import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingItems: [],
  users: [],
  reports: [],
  analytics: {
    totalUsers: 0,
    totalItems: 0,
    totalSwaps: 0,
    activeUsers: 0,
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setPendingItems: (state, action) => {
      state.pendingItems = action.payload;
    },
    addPendingItem: (state, action) => {
      state.pendingItems.unshift(action.payload);
    },
    removePendingItem: (state, action) => {
      state.pendingItems = state.pendingItems.filter(item => item.id !== action.payload);
    },
    approveItem: (state, action) => {
      const index = state.pendingItems.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.pendingItems[index].status = 'approved';
      }
    },
    rejectItem: (state, action) => {
      const index = state.pendingItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.pendingItems[index].status = 'rejected';
        state.pendingItems[index].rejectionReason = action.payload.reason;
      }
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    banUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload);
      if (index !== -1) {
        state.users[index].banned = true;
      }
    },
    unbanUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload);
      if (index !== -1) {
        state.users[index].banned = false;
      }
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    addReport: (state, action) => {
      state.reports.unshift(action.payload);
    },
    updateReport: (state, action) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
    },
    setAnalytics: (state, action) => {
      state.analytics = action.payload;
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
  setPendingItems,
  addPendingItem,
  removePendingItem,
  approveItem,
  rejectItem,
  setUsers,
  updateUser,
  banUser,
  unbanUser,
  setReports,
  addReport,
  updateReport,
  setAnalytics,
  setLoading,
  setError,
  clearError,
} = adminSlice.actions;

export default adminSlice.reducer;
