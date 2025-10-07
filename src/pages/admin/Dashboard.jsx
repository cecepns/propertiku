import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { dashboardAPI } from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalCategories: 0,
    availableProperties: 0,
    soldProperties: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Properti"
            value={stats.totalProperties}
            color="border-blue-500"
          />
          <StatCard
            title="Total Kategori"
            value={stats.totalCategories}
            color="border-green-500"
          />
          <StatCard
            title="Properti Tersedia"
            value={stats.availableProperties}
            color="border-yellow-500"
          />
          <StatCard
            title="Properti Terjual"
            value={stats.soldProperties}
            color="border-red-500"
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Selamat Datang di Propertiku Admin</h2>
          <p className="text-gray-600">
            Gunakan menu di sebelah kiri untuk mengelola kategori, properti, dan pengaturan website.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
