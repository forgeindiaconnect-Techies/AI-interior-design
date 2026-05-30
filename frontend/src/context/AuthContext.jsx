import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set base URL for all axios calls (frontend knows where API lives)
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://ai-interior-final-project.onrender.com/api';
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

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        setUser(userData);
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
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token & fetch user details
      axios.get('/auth/me')
        .then((res) => {
          if (res.data && res.data.success) {
            setUser(res.data.user);
          }
        })
        .catch(() => {
          // token invalid/expired – clear it
          localStorage.removeItem('token');
          setUser(null);
        });
    }
    setLoading(false);
  }, []);

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
