import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminLayout from '../../components/AdminLayout';
import { propertyAPI, categoryAPI, getImageUrl } from '../../utils/api';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    description: '',
    price: '',
    location: '',
    size: '',
    status: 'available',
    featured: false,
  });
  const [images, setImages] = useState([]);
  const [existingGalleries, setExistingGalleries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadProperty();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProperty = async () => {
    try {
      const response = await propertyAPI.getById(id);
      const property = response.data;

      setFormData({
        category_id: property.category_id,
        title: property.title,
        description: property.description || '',
        price: property.price,
        location: property.location || '',
        size: property.size || '',
        status: property.status,
        featured: property.featured,
      });

      setExistingGalleries(property.galleries || []);
    } catch (error) {
      console.error('Error loading property:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('category_id', formData.category_id);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('location', formData.location);
      submitData.append('size', formData.size);
      submitData.append('status', formData.status);
      submitData.append('featured', formData.featured ? '1' : '0');

      for (let i = 0; i < images.length; i++) {
        submitData.append('images', images[i]);
      }

      if (isEdit) {
        await propertyAPI.update(id, submitData);
      } else {
        await propertyAPI.create(submitData);
      }

      navigate('/admin/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Gagal menyimpan properti');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleDeleteGallery = async (galleryId) => {
    if (!confirm('Yakin ingin menghapus gambar ini?')) return;

    try {
      await propertyAPI.deleteGallery(galleryId);
      setExistingGalleries(existingGalleries.filter((g) => g.id !== galleryId));
    } catch (error) {
      console.error('Error deleting gallery:', error);
      alert('Gagal menghapus gambar');
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">
          {isEdit ? 'Edit Properti' : 'Tambah Properti'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Kategori *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Judul *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Harga *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Lokasi</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ukuran</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Contoh: 100 m²"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">Deskripsi *</label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              modules={modules}
              className="bg-white"
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              <span className="text-gray-700 font-semibold">Properti Unggulan</span>
            </label>
          </div>

          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">Gambar Properti</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload hingga 10 gambar. Gambar pertama akan menjadi gambar utama.
            </p>
          </div>

          {isEdit && existingGalleries.length > 0 && (
            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Galeri Saat Ini</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingGalleries.map((gallery) => (
                  <div key={gallery.id} className="relative group">
                    <img
                      src={getImageUrl(gallery.image_url)}
                      alt="Gallery"
                      className="w-full h-32 object-cover rounded"
                    />
                    {gallery.is_primary === 1 && (
                      <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Utama
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteGallery(gallery.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/admin/properties')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PropertyForm;
