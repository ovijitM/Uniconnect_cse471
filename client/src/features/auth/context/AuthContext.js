import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // Verify token and get user data
      fetchUserProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log('=== AUTH CONTEXT - FETCHING USER PROFILE ===');
      const response = await axios.get(`${API_BASE_URL}/auth/profile`);
      console.log('User profile response:', response.data.user);
      console.log('Events attended in response:', response.data.user?.eventsAttended?.length || 0);
      setUser(response.data.user);
      console.log('User state updated in AuthContext');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: authToken } = response.data;

      localStorage.setItem('token', authToken);
      setToken(authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      // Immediately fetch full user profile with populated data
      await fetchUserProfile();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration with data:', userData);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      const { token: authToken } = response.data;

      localStorage.setItem('token', authToken);
      setToken(authToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      // Immediately fetch full user profile with populated data
      await fetchUserProfile();

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);

      let errorMessage = 'Registration failed';

      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors && error.response.data.errors.length > 0) {
          errorMessage = error.response.data.errors[0].msg;
        }
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, profileData);
      setUser(response.data.user);

      // Fetch fresh profile data to ensure university is properly populated
      await fetchUserProfile();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  const refreshUser = async () => {
    try {
      console.log('=== AUTH CONTEXT - REFRESH USER CALLED ===');
      await fetchUserProfile();
      console.log('User refresh completed successfully');
      return { success: true };
    } catch (error) {
      console.error('Error in refreshUser:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to refresh user data'
      };
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
