import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Set base URL for all axios calls (frontend knows where API lives)
axios.defaults.baseURL = 'https://ai-interior-design-xnmc.onrender.com/api'; // Hardcoded to bypass old Vercel env variable

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

// Handle global 401 and 403 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (error.config.url && !error.config.url.includes('/auth/login')) {
          console.warn('[Axios Interceptor] 401 Unauthorized detected on ' + error.config.url);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        const msg = (error.response.data?.message || '').toLowerCase();
        if (msg.includes('suspended') || msg.includes('blocked')) {
          console.warn('[Axios Interceptor] Account suspended/blocked, logging out');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login?suspended=true';
          return Promise.reject(error);
        }
        console.warn('[Axios Interceptor] 403 Forbidden on ' + error.config.url + ':', error.response.data?.message || 'Access denied');
        // Do not force redirect on other 403s, let the specific component handle the lack of access.
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
  const [loading, setLoading] = useState(() => {
    // If we have a cached user and token, don't block the UI on page refresh
    return !(localStorage.getItem('token') && localStorage.getItem('user'));
  });

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      if (res.data && res.data.success) {
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.data?.message || 'Registration failed' };
    } catch (err) {
      console.warn('Registration request failed:', err);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

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
    const cachedUser = localStorage.getItem('user');
    if (token) {
      if (cachedUser) {
        // Don't block UI — verify token in background
        setLoading(false);
      }
      axios.get('/auth/me')
        .then((res) => {
          if (res.data && res.data.success) {
            const userData = res.data.user;
            // If account is suspended, log them out with a clear message
            if (userData.status === 'Suspended' || userData.status === 'Blocked') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              window.location.href = '/login?suspended=true';
              return;
            }
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          } else {
            console.warn('[AuthContext] Verification failed, but keeping session due to non-401 error', error);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const value = { user, login, logout, register, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
