import axios from 'axios';

// Create Axios client using Vite environment endpoints
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor to append local token if logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified format handler for responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error formats for toast messages
    const message = error.response?.data?.message || 'Server connection failed. Stormy waters ahead!';
    error.message = message;
    return Promise.reject(error);
  }
);

export default apiClient;
