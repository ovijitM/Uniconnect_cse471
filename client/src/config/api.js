// API Configuration for different environments

const config = {
  development: {
    API_URL: 'http://localhost:5001'
  },
  production: {
    API_URL: process.env.REACT_APP_API_URL || 'https://your-backend-app.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';

export const API_BASE_URL = config[environment].API_URL;

// Create axios instance with base configuration
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };