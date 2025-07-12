import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authSlice from './slices/authSlice';
import itemsSlice from './slices/itemsSlice';
import userSlice from './slices/userSlice';
import swapSlice from './slices/swapSlice';
import adminSlice from './slices/adminSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authSlice,
  items: itemsSlice,
  user: userSlice,
  swap: swapSlice,
  admin: adminSlice,
});

export default rootReducer;
