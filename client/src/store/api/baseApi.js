import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: import.meta.env.VITE_API_TIMEOUT || 10000,
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set('authorization', `Token ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token or logout
    api.dispatch({ type: 'auth/logout' });
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Item', 'Swap', 'Admin'],
  endpoints: () => ({}),
});

export const { useGetQuery, useLazyGetQuery } = baseApi;
