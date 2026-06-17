import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user data if token is stored on initialization
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to load credentials:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login action handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { token: receivedToken, user: loggedUser } = res.data.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(loggedUser);
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  // Sign up action handler
  const signup = async (userData) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/signup', userData);
      if (res.data && res.data.success) {
        const { token: receivedToken, user: registeredUser } = res.data.data;
        localStorage.setItem('token', receivedToken);
        setToken(receivedToken);
        setUser(registeredUser);
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  // Logout action handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
