import axios from 'axios';

// Use VITE_API_BASE_URL for production (e.g., https://atrixstore.tech)
// Fallback to localhost for development
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Essential for cross-domain cookies
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data?.token) {
      localStorage.setItem('adminToken', response.data.token);
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      console.error('Network error - server may be down');
      return Promise.reject({ 
        response: { 
          data: { 
            success: false,
            message: 'Unable to connect to server. Please check if the backend is running on http://localhost:3000' 
          } 
        } 
      });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
