import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  featuredItems: [],
  currentItem: null,
  loading: false,
  error: null,
  filters: {
    category: '',
    size: '',
    condition: '',
    priceRange: [0, 1000],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  searchQuery: '',
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    setFeaturedItems: (state, action) => {
      state.featuredItems = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleItemLike: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.is_liked = !item.is_liked;
        item.likes_count = item.is_liked ? 
          (item.likes_count || 0) + 1 : 
          Math.max((item.likes_count || 0) - 1, 0);
      }
    },
    addToWishlist: (state, action) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.in_wishlist = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setItems,
  addItem,
  updateItem,
  removeItem,
  setCurrentItem,
  setFeaturedItems,
  setLoading,
  setError,
  setFilters,
  resetFilters,
  setPagination,
  setSearchQuery,
  toggleItemLike,
  addToWishlist,
  clearError,
} = itemsSlice.actions;

export default itemsSlice.reducer;
