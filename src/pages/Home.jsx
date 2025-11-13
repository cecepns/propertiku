import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { propertyAPI, categoryAPI, getImageUrl } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bannerImage from '../assets/banner.jpeg';
import { 
  Home as HomeIcon, 
  Building2, 
  MapPin, 
  TrendingUp, 
  Shield, 
  Award,
  Search,
  ArrowRight,
  Sparkles,
  LandPlot,
  Building,
  Store,
} from 'lucide-react';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [propertiesRes, categoriesRes] = await Promise.all([
        propertyAPI.getAll(1),
        categoryAPI.getAll(),
      ]);

      const featured = propertiesRes.data.data.filter(p => p.featured).slice(0, 6);
      setFeaturedProperties(featured);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const categoryIcons = {
    'Tanah': LandPlot,
    'Rumah': HomeIcon,
    'Kost': Building,
    'Ruko': Store,
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Banner Section */}
      <section className="relative mt-[110px] md:mt-[150px] h-44 md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={bannerImage}
            alt="Banner Properti"
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-blue-900/70"></div> */}
        </div>
        
        {/* <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-2xl" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-4">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-blue-600">Selamat Datang di PROPERTIKU</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                Raih Impian Memiliki Properti Ideal Anda
              </h2>
              
              <p className="text-lg md:text-xl text-white mb-6 drop-shadow leading-relaxed">
                Kami hadirkan solusi properti terpercaya dengan pilihan terlengkap dan harga terbaik
              </p>
              
              <Link
                to="/properti"
                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
              >
                <Search className="w-5 h-5" />
                Mulai Cari Properti
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div> */}
      </section>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-blue-800 flex items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-lg mb-6">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-blue-600">Properti Terpercaya #1</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight drop-shadow-lg">
                Temukan Properti Impian Anda
              </h1>
              
              <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed drop-shadow">
                Tanah, Rumah, Kost, dan Ruko Terbaik di PROPERTIKU. Investasi masa depan dimulai dari sini.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/properti"
                  className="group bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <Search className="w-5 h-5" />
                  Jelajahi Properti
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a
                  href="#categories"
                  className="bg-blue-800 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Lihat Kategori
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">100+</div>
                  <div className="text-sm text-gray-700 font-medium">Properti</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">50+</div>
                  <div className="text-sm text-gray-700 font-medium">Klien Puas</div>
                </div>
                <div className="text-center bg-white rounded-xl p-4 shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">4.9</div>
                  <div className="text-sm text-gray-700 font-medium">Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Feature Cards */}
            <div className="hidden lg:block" data-aos="fade-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Terpercaya</h3>
                  <p className="text-sm text-gray-600">Properti terverifikasi</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all mt-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Investasi</h3>
                  <p className="text-sm text-gray-600">Nilai tinggi</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Lokasi Strategis</h3>
                  <p className="text-sm text-gray-600">Akses mudah</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all mt-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Berkualitas</h3>
                  <p className="text-sm text-gray-600">Standar terbaik</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">
              Kategori Properti
            </h2>
            <p className="text-xl text-gray-600">Pilih jenis properti yang sesuai dengan kebutuhan Anda</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[category.name] || Building2;
              const gradients = [
                'bg-gradient-to-br from-orange-400 to-orange-600',
                'bg-gradient-to-br from-pink-400 to-rose-600',
                'bg-gradient-to-br from-amber-400 to-yellow-600',
                'bg-gradient-to-br from-purple-400 to-purple-600'
              ];
              
              return (
                <Link
                  key={category.id}
                  to={`/properti?category=${category.id}`}
                  className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-400"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className={`w-16 h-16 ${gradients[index % 4]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* <section className="py-20 bg-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600">Solusi properti terpercaya untuk investasi Anda</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="0">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Properti Terverifikasi</h3>
              <p className="text-gray-600 leading-relaxed">
                Setiap properti telah melalui proses verifikasi ketat untuk memastikan kualitas dan legalitas
              </p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="100">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Investasi Menguntungkan</h3>
              <p className="text-gray-600 leading-relaxed">
                Properti pilihan dengan potensi pertumbuhan nilai tinggi untuk investasi jangka panjang
              </p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2" data-aos="fade-up" data-aos-delay="200">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Transaksi Aman</h3>
              <p className="text-gray-600 leading-relaxed">
                Proses transaksi yang transparan dan aman dengan pendampingan profesional
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Properties Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">
              Properti Unggulan
            </h2>
            <p className="text-xl text-gray-600">Pilihan terbaik untuk investasi properti Anda</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-blue-100 hover:border-blue-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative h-56 bg-blue-100 overflow-hidden">
                  {property.primary_image ? (
                    <>
                      <img
                        src={getImageUrl(property.primary_image)}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-blue-900/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <Building2 className="w-16 h-16 mb-2" />
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      <Sparkles className="w-3 h-3" />
                      {property.category_name}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <p className="text-sm line-clamp-1">{property.location}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-blue-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Harga</p>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Luas</p>
                      <span className="text-sm font-semibold text-gray-700">{property.size}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/properti/${property.id}`}
                    className="group/btn flex items-center justify-center gap-2 w-full bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {featuredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl">Belum ada properti unggulan</p>
            </div>
          )}
          
          {featuredProperties.length > 0 && (
            <div className="text-center mt-12" data-aos="fade-up">
              <Link
                to="/properti"
                className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Lihat Semua Properti
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
