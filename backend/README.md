# SafinaLand Backend

Backend API untuk aplikasi SafinaLand menggunakan Express.js dan MySQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Import database:
```bash
mysql -u root -p < database.sql
```

3. Buat file `.env` dari `.env.example`:
```bash
cp .env.example .env
```

4. Sesuaikan konfigurasi database di file `.env`

5. Jalankan server:
```bash
node server.js
```

Server akan berjalan di http://localhost:5000

## Default Admin Login

- Username: `admin`
- Password: `admin123`

## API Endpoints

### Auth
- POST `/api/login` - Login admin
- GET `/api/verify` - Verify token

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get category by ID
- POST `/api/categories` - Create category (auth required)
- PUT `/api/categories/:id` - Update category (auth required)
- DELETE `/api/categories/:id` - Delete category (auth required)

### Properties
- GET `/api/properties?page=1&category_id=1` - Get properties with pagination
- GET `/api/properties/:id` - Get property by ID with galleries
- POST `/api/properties` - Create property (auth required)
- PUT `/api/properties/:id` - Update property (auth required)
- DELETE `/api/properties/:id` - Delete property (auth required)
- DELETE `/api/property-galleries/:id` - Delete gallery image (auth required)

### Settings
- GET `/api/settings` - Get all settings
- PUT `/api/settings` - Update settings (auth required)

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics (auth required)
