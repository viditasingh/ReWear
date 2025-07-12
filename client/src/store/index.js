import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './rootReducer';
import { baseApi } from './api/baseApi';
import { rtkQueryErrorLogger, authErrorMiddleware } from './middleware';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      baseApi.middleware,
      rtkQueryErrorLogger,
      authErrorMiddleware
    ),
  devTools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
});

setupListeners(store.dispatch);

// Type exports for TypeScript (if migrating later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
