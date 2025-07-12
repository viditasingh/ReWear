import { apiService } from './apiService';

export const itemService = {
  // Get all items with filters
  getItems: async (params = {}) => {
    try {
      const response = await apiService.get('/items', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single item by ID
  getItem: async (id) => {
    try {
      const response = await apiService.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new item
  createItem: async (itemData) => {
    try {
      const response = await apiService.post('/items', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update item
  updateItem: async (id, itemData) => {
    try {
      const response = await apiService.put(`/items/${id}`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete item
  deleteItem: async (id) => {
    try {
      await apiService.delete(`/items/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get featured items
  getFeaturedItems: async () => {
    try {
      const response = await apiService.get('/items/featured');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user's items
  getMyItems: async () => {
    try {
      const response = await apiService.get('/items/my');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await apiService.get('/items/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Upload images
  uploadImages: async (formData) => {
    try {
      const response = await apiService.upload('/items/upload-images', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search items
  searchItems: async (query, filters = {}) => {
    try {
      const params = { q: query, ...filters };
      const response = await apiService.get('/items/search', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get items by category
  getItemsByCategory: async (category) => {
    try {
      const response = await apiService.get(`/items/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Report item
  reportItem: async (itemId, reason) => {
    try {
      const response = await apiService.post(`/items/${itemId}/report`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like/Unlike item
  toggleLike: async (itemId) => {
    try {
      const response = await apiService.post(`/items/${itemId}/toggle-like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add to wishlist
  addToWishlist: async (itemId) => {
    try {
      const response = await apiService.post(`/items/${itemId}/wishlist`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (itemId) => {
    try {
      await apiService.delete(`/items/${itemId}/wishlist`);
      return true;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get similar items
  getSimilarItems: async (itemId) => {
    try {
      const response = await apiService.get(`/items/${itemId}/similar`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
