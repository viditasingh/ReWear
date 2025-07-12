import { apiService } from './apiService';
import { AUTH_CONFIG } from '../utils/constants';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiService.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      // Store token and user data
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
      
      return { user, token };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await apiService.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiService.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      return token;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password
  resetPassword: async (token, password) => {
    try {
      const response = await apiService.post('/auth/reset-password', { token, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await apiService.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await apiService.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const userString = localStorage.getItem(AUTH_CONFIG.USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    return !!token;
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  },
};
