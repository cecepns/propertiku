import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = "https://api-inventory.isavralabel.com/propertiku/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  verify: () => api.get('/verify'),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const propertyAPI = {
  getAll: (page = 1, categoryId = null, search = null) => {
    let url = `/properties?page=${page}`;
    if (categoryId) {
      url += `&category_id=${categoryId}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return api.get(url);
  },
  getById: (id) => api.get(`/properties/${id}`),
  create: (formData) => api.post('/properties', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  update: (id, formData) => api.put(`/properties/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id) => api.delete(`/properties/${id}`),
  deleteGallery: (id) => api.delete(`/property-galleries/${id}`),
};

export const settingsAPI = {
  getAll: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://api-inventory.isavralabel.com/propertiku${imagePath}`;
};

export default api;
