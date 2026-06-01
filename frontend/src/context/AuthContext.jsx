import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Set base URL for all axios calls (frontend knows where API lives)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://ai-interior-final-project.onrender.com/api';

// Attach token on every request if present
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config.url && !error.config.url.includes('/auth/login')) {
        console.warn('[Axios Interceptor] 401 Unauthorized detected. Clearing session.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Session expired or unauthorized. Please login again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token, user: userData } = res.data;
        console.log('[Auth] Token received from login');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        console.log('[Auth] Token and User stored in localStorage. Role:', userData.role);
        return { success: true, user: userData };
      }
      return { success: false, message: res.data?.message || 'Login failed' };
    } catch (err) {
      console.warn('Login request failed:', err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token & fetch user details
      axios.get('/auth/me')
        .then((res) => {
          if (res.data && res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Token is invalid/expired - clear it (also handled by interceptor)
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
