import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Properti from './pages/Properti';
import PropertiDetail from './pages/PropertiDetail';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Properties from './pages/admin/Properties';
import PropertyForm from './pages/admin/PropertyForm';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properti" element={<Properti />} />
        <Route path="/properti/:id" element={<PropertiDetail />} />

        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/properties/create"
          element={
            <ProtectedRoute>
              <PropertyForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/properties/edit/:id"
          element={
            <ProtectedRoute>
              <PropertyForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
