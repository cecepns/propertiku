const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'safinaland_secret_key_2024';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads-safinaland')));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'safinaland'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads-safinaland'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Helper function to delete image file from filesystem
const deleteImageFile = (imageUrl) => {
  if (!imageUrl) return;
  
  // Extract filename from URL (e.g., /uploads/filename.jpg -> filename.jpg)
  const filename = imageUrl.replace('/uploads/', '');
  const filePath = path.join(__dirname, 'uploads-safinaland', filename);
  
  // Delete file if it exists
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error deleting file:', filePath, err);
    }
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ROUTES
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admin WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  });
});

app.get('/api/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// CATEGORY ROUTES
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY created_at DESC', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

app.get('/api/categories/:id', (req, res) => {
  db.query('SELECT * FROM categories WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(results[0]);
  });
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  db.query(
    'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
    [name, slug, description],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ id: result.insertId, name, slug, description });
    }
  );
});

app.put('/api/categories/:id', authenticateToken, (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  db.query(
    'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
    [name, slug, description, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }
      res.json({ message: 'Category updated successfully' });
    }
  );
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM categories WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    res.json({ message: 'Category deleted successfully' });
  });
});

// PROPERTY ROUTES
app.get('/api/properties', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const categoryId = req.query.category_id;
  const search = req.query.search;

  let countQuery = 'SELECT COUNT(*) as total FROM properties p';
  let dataQuery = `
    SELECT p.*, c.name as category_name,
    (SELECT image_url FROM property_galleries WHERE property_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
    FROM properties p
    LEFT JOIN categories c ON p.category_id = c.id
  `;

  const params = [];
  const conditions = [];

  if (categoryId) {
    conditions.push('p.category_id = ?');
    params.push(categoryId);
  }

  if (search) {
    conditions.push('(p.title LIKE ? OR p.description LIKE ? OR p.location LIKE ?)');
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ');
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  dataQuery += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';

  db.query(countQuery, params, (err, countResults) => {
    if (err) {
      console.error('Error in count query:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const total = countResults[0].total;
    const totalPages = Math.ceil(total / limit);

    db.query(dataQuery, [...params, limit, offset], (err, results) => {
      if (err) {
        console.error('Error in data query:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.json({
        data: results,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });
    });
  });
});

app.get('/api/properties/:id', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name
    FROM properties p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;

  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const property = results[0];

    db.query(
      'SELECT * FROM property_galleries WHERE property_id = ? ORDER BY is_primary DESC, created_at ASC',
      [req.params.id],
      (err, galleries) => {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }
        property.galleries = galleries;
        res.json(property);
      }
    );
  });
});

app.post('/api/properties', authenticateToken, upload.array('images', 10), (req, res) => {
  const { category_id, title, description, price, location, size, status, featured } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  db.query(
    'INSERT INTO properties (category_id, title, slug, description, price, location, size, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [category_id, title, slug, description, price, location, size, status || 'available', featured || false],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      const propertyId = result.insertId;

      if (req.files && req.files.length > 0) {
        const galleryValues = req.files.map((file, index) => [
          propertyId,
          `/uploads/${file.filename}`,
          index === 0 ? 1 : 0
        ]);

        db.query(
          'INSERT INTO property_galleries (property_id, image_url, is_primary) VALUES ?',
          [galleryValues],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error uploading images' });
            }
            res.json({ id: propertyId, message: 'Property created successfully' });
          }
        );
      } else {
        res.json({ id: propertyId, message: 'Property created successfully' });
      }
    }
  );
});

app.put('/api/properties/:id', authenticateToken, upload.array('images', 10), (req, res) => {
  const { category_id, title, description, price, location, size, status, featured } = req.body;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  db.query(
    'UPDATE properties SET category_id = ?, title = ?, slug = ?, description = ?, price = ?, location = ?, size = ?, status = ?, featured = ? WHERE id = ?',
    [category_id, title, slug, description, price, location, size, status, featured, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (req.files && req.files.length > 0) {
        // Get old images before deleting them
        db.query(
          'SELECT image_url FROM property_galleries WHERE property_id = ?',
          [req.params.id],
          (err, oldImages) => {
            if (err) {
              return res.status(500).json({ message: 'Server error' });
            }

            // Delete old images from filesystem
            oldImages.forEach(img => {
              deleteImageFile(img.image_url);
            });

            // Delete old image records from database
            db.query(
              'DELETE FROM property_galleries WHERE property_id = ?',
              [req.params.id],
              (err) => {
                if (err) {
                  return res.status(500).json({ message: 'Error deleting old images' });
                }

                // Insert new images
                const galleryValues = req.files.map((file, index) => [
                  req.params.id,
                  `/uploads/${file.filename}`,
                  index === 0 ? 1 : 0
                ]);

                db.query(
                  'INSERT INTO property_galleries (property_id, image_url, is_primary) VALUES ?',
                  [galleryValues],
                  (err) => {
                    if (err) {
                      return res.status(500).json({ message: 'Error uploading images' });
                    }
                    res.json({ message: 'Property updated successfully' });
                  }
                );
              }
            );
          }
        );
      } else {
        res.json({ message: 'Property updated successfully' });
      }
    }
  );
});

app.delete('/api/properties/:id', authenticateToken, (req, res) => {
  // First, get all images associated with this property
  db.query(
    'SELECT image_url FROM property_galleries WHERE property_id = ?',
    [req.params.id],
    (err, images) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      // Delete all image files from filesystem
      images.forEach(img => {
        deleteImageFile(img.image_url);
      });

      // Delete gallery records from database
      db.query(
        'DELETE FROM property_galleries WHERE property_id = ?',
        [req.params.id],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Server error' });
          }

          // Finally, delete the property
          db.query('DELETE FROM properties WHERE id = ?', [req.params.id], (err) => {
            if (err) {
              return res.status(500).json({ message: 'Server error' });
            }
            res.json({ message: 'Property deleted successfully' });
          });
        }
      );
    }
  );
});

app.delete('/api/property-galleries/:id', authenticateToken, (req, res) => {
  // First, get the image URL before deleting the record
  db.query(
    'SELECT image_url FROM property_galleries WHERE id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Gallery image not found' });
      }

      const imageUrl = results[0].image_url;

      // Delete the record from database
      db.query('DELETE FROM property_galleries WHERE id = ?', [req.params.id], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Server error' });
        }

        // Delete the physical file
        deleteImageFile(imageUrl);

        res.json({ message: 'Gallery image deleted successfully' });
      });
    }
  );
});

// SETTINGS ROUTES
app.get('/api/settings', (req, res) => {
  db.query('SELECT * FROM settings', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }
    const settings = {};
    results.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  });
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const settings = req.body;
  const queries = [];

  Object.keys(settings).forEach(key => {
    queries.push(
      new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, settings[key], settings[key]],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      })
    );
  });

  Promise.all(queries)
    .then(() => {
      res.json({ message: 'Settings updated successfully' });
    })
    .catch(() => {
      res.status(500).json({ message: 'Server error' });
    });
});

// DASHBOARD STATS
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const queries = {
    totalProperties: 'SELECT COUNT(*) as count FROM properties',
    totalCategories: 'SELECT COUNT(*) as count FROM categories',
    availableProperties: 'SELECT COUNT(*) as count FROM properties WHERE status = "available"',
    soldProperties: 'SELECT COUNT(*) as count FROM properties WHERE status = "sold"'
  };

  const results = {};

  Promise.all(
    Object.keys(queries).map(key => {
      return new Promise((resolve, reject) => {
        db.query(queries[key], (err, result) => {
          if (err) reject(err);
          else {
            results[key] = result[0].count;
            resolve();
          }
        });
      });
    })
  )
    .then(() => {
      res.json(results);
    })
    .catch(() => {
      res.status(500).json({ message: 'Server error' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
