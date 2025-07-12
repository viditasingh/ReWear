import { isRejectedWithValue } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from RTK, and the `fulfilled` meta property is always true
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!');
    
    const errorMessage = action.payload?.data?.message || 
                        action.payload?.message || 
                        'Something went wrong';
    
    toast.error(errorMessage);
  }

  return next(action);
};

/**
 * Middleware to handle authentication errors
 */
export const authErrorMiddleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action.payload?.status === 401) {
      // Dispatch logout action
      store.dispatch({ type: 'auth/logout' });
      toast.error('Session expired. Please log in again.');
    }
  }

  return next(action);
};
