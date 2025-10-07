import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { propertyAPI, getImageUrl, settingsAPI } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PropertiDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [settings, setSettings] = useState({});
  const [selectedImage, setSelectedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    try {
      const [propertyRes, settingsRes] = await Promise.all([
        propertyAPI.getById(id),
        settingsAPI.getAll(),
      ]);

      setProperty(propertyRes.data);
      setSettings(settingsRes.data);

      if (propertyRes.data.galleries && propertyRes.data.galleries.length > 0) {
        setSelectedImage(propertyRes.data.galleries[0].image_url);
      } else if (propertyRes.data.primary_image) {
        setSelectedImage(propertyRes.data.primary_image);
      }
    } catch (error) {
      console.error('Error loading property:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    const message = `Halo, saya tertarik dengan properti: ${property.title} - ${formatPrice(property.price)}`;
    const url = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20 bg-blue-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Link to="/properti" className="text-blue-600 hover:text-blue-700 mb-4 inline-block font-semibold">
            &larr; Kembali ke Daftar Properti
          </Link>

          <div className="grid grid-cols-1 gap-8 mt-4">
            <div data-aos="fade-right">
              <div className="bg-gray-200 h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
                {selectedImage ? (
                  <img
                    src={getImageUrl(selectedImage)}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            <div data-aos="fade-left" className="bg-white p-6 rounded-2xl shadow-lg">
              <span className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white text-sm px-3 py-1.5 rounded-full font-semibold mb-2">
                {property.category_name}
              </span>
              {property.status === 'sold' && (
                <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded mb-2 ml-2">
                  Terjual
                </span>
              )}

              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>

              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-600">
                  <p className="mb-1">Lokasi: {property.location}</p>
                  <p>Luas: {property.size}</p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">Deskripsi</h2>
                <div
                  className="text-gray-700 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>

              {property.status !== 'sold' && settings.whatsapp && (
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full max-w-fit bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Hubungi Via WhatsApp
                </button>
              )}

              {property.status === 'sold' && (
                <div className="w-full bg-red-600 text-white px-6 py-3 rounded-xl text-lg font-semibold text-center">
                  Properti Sudah Terjual
                </div>
              )}
            </div>
          </div>

          {/* Gallery Section */}
          {property.galleries && property.galleries.length > 0 && (
            <div className="mt-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold mb-6 text-blue-600">Galeri Foto</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.galleries.map((gallery) => (
                  <div
                    key={gallery.id}
                    onClick={() => handleImageClick(gallery.image_url)}
                    className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    <img
                      src={getImageUrl(gallery.image_url)}
                      alt={`Gallery ${gallery.id}`}
                      className="w-full h-64 object-cover transition-transform duration-300 ease-in-out"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300 transition"
              aria-label="Close modal"
            >
              &times;
            </button>
            <img
              src={getImageUrl(modalImage)}
              alt="Gallery view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertiDetail;
