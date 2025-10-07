import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { propertyAPI, categoryAPI, getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Properti = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    loadCategories();
  }, []);

  useEffect(() => {
    loadProperties();
  }, [currentPage, selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProperties = async () => {
    try {
      const categoryId = selectedCategory || null;
      const response = await propertyAPI.getAll(currentPage, categoryId);
      setProperties(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded ${
            currentPage === i
              ? 'bg-blue-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          } transition`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="pt-24 pb-16 bg-blue-500 text-white">
        <div className="container mx-auto px-4" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Daftar Properti</h1>
          <p className="text-xl text-white">Temukan properti terbaik untuk Anda</p>
        </div>
      </section>

      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="mb-8" data-aos="fade-up">
            <label className="block text-gray-700 font-semibold mb-2">Filter Kategori:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full md:w-64 px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-md hover:shadow-lg transition-all"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-blue-100"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="h-48 bg-gray-200">
                  {property.primary_image ? (
                    <img
                      src={getImageUrl(property.primary_image)}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    {property.category_name}
                  </span>
                  {property.status === 'sold' && (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mb-2 ml-2">
                      Terjual
                    </span>
                  )}
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-sm text-gray-500">{property.size}</span>
                  </div>
                  <Link
                    to={`/properti/${property.id}`}
                    className="mt-4 block w-full bg-blue-800 hover:bg-blue-700 text-white text-center py-2 rounded transition"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {properties.length === 0 && (
            <p className="text-center text-gray-500 text-xl mt-8">Tidak ada properti ditemukan</p>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12" data-aos="fade-up">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {renderPagination()}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 bg-white text-gray-700 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properti;
