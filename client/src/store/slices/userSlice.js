import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  points: 0,
  myItems: [],
  loading: false,
  error: null,
  preferences: {
    notifications: true,
    theme: 'light',
    language: 'en',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    setPoints: (state, action) => {
      state.points = action.payload;
    },
    addPoints: (state, action) => {
      state.points += action.payload;
    },
    subtractPoints: (state, action) => {
      state.points = Math.max(0, state.points - action.payload);
    },
    setMyItems: (state, action) => {
      state.myItems = action.payload;
    },
    addMyItem: (state, action) => {
      state.myItems.unshift(action.payload);
    },
    updateMyItem: (state, action) => {
      const index = state.myItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.myItems[index] = action.payload;
      }
    },
    removeMyItem: (state, action) => {
      state.myItems = state.myItems.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      return initialState;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setPoints,
  addPoints,
  subtractPoints,
  setMyItems,
  addMyItem,
  updateMyItem,
  removeMyItem,
  setLoading,
  setError,
  setPreferences,
  clearError,
  clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
