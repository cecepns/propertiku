import { useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';
import { Building2, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await settingsAPI.getAll();
      setSettings(response.data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  return (
    <footer id="contact" className="bg-blue-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-8 h-8 text-white" />
              <h3 className="text-xl font-bold text-white">Propertiku</h3>
            </div>
            <p className="text-blue-50 leading-relaxed">{settings.about_us || 'Perusahaan properti terpercaya dengan layanan terbaik untuk investasi masa depan Anda.'}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Kontak</h3>
            <div className="space-y-3 text-blue-50">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <p>{settings.address || 'Alamat belum diset'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <p>Telp: {settings.phone || '-'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-white flex-shrink-0" />
                <p>Email: {settings.email || '-'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Hubungi Kami</h3>
            <div className="flex space-x-4">
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-blue-500 mt-8 pt-8 text-center text-blue-50">
          <p>&copy; 2024 Propertiku. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
