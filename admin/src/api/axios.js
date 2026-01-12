import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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
