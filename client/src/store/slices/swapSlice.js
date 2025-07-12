import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  swaps: [],
  currentSwap: null,
  swapRequests: [],
  loading: false,
  error: null,
  history: [],
  notifications: [],
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSwaps: (state, action) => {
      state.swaps = action.payload;
    },
    addSwap: (state, action) => {
      state.swaps.unshift(action.payload);
    },
    updateSwap: (state, action) => {
      const index = state.swaps.findIndex(swap => swap.id === action.payload.id);
      if (index !== -1) {
        state.swaps[index] = action.payload;
      }
    },
    removeSwap: (state, action) => {
      state.swaps = state.swaps.filter(swap => swap.id !== action.payload);
    },
    setCurrentSwap: (state, action) => {
      state.currentSwap = action.payload;
    },
    setSwapRequests: (state, action) => {
      state.swapRequests = action.payload;
    },
    addSwapRequest: (state, action) => {
      state.swapRequests.unshift(action.payload);
    },
    updateSwapRequest: (state, action) => {
      const index = state.swapRequests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.swapRequests[index] = action.payload;
      }
    },
    removeSwapRequest: (state, action) => {
      state.swapRequests = state.swapRequests.filter(req => req.id !== action.payload);
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    addToHistory: (state, action) => {
      state.history.unshift(action.payload);
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationAsRead: (state, action) => {
      const index = state.notifications.findIndex(notif => notif.id === action.payload);
      if (index !== -1) {
        state.notifications[index].read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notif => {
        notif.read = true;
      });
    },
    deleteNotification: (state, action) => {
      state.notifications = state.notifications.filter(notif => notif.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSwaps,
  addSwap,
  updateSwap,
  removeSwap,
  setCurrentSwap,
  setSwapRequests,
  addSwapRequest,
  updateSwapRequest,
  removeSwapRequest,
  setHistory,
  addToHistory,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearNotifications,
  setLoading,
  setError,
  clearError,
} = swapSlice.actions;

export default swapSlice.reducer;
