// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://uniconnect-cse471.onrender.com/api';

export { API_BASE_URL };

// Default axios configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
