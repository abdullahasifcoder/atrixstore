import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const storedToken = localStorage.getItem('adminToken');
    
    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
      verifyAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAuth = async () => {
    try {
      const response = await api.get('/api/admin/auth/me');
      if (response.data.success) {
        setAdmin(response.data.admin);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
      }
    } catch (error) {
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/admin/auth/login', { email, password });
      if (response.data.success) {
        setAdmin(response.data.admin);
        localStorage.setItem('admin', JSON.stringify(response.data.admin));
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
        }
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check server connection.'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/admin/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
