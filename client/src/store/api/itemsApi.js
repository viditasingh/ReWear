import { baseApi } from './baseApi';

export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        return `/items/?${searchParams.toString()}`;
      },
      transformResponse: (response) => ({
        items: response.results || [],
        total: response.count || 0,
        totalPages: response.next || response.previous ? Math.ceil(response.count / (response.results?.length || 1)) : 1,
        next: response.next,
        previous: response.previous
      }),
      providesTags: ['Item'],
    }),
    getItem: builder.query({
      query: (id) => `/items/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Item', id }],
    }),
    createItem: builder.mutation({
      query: (itemData) => ({
        url: '/items/create/',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Item'],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/items/${id}/update/`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Item', id }],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/items/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'],
    }),
    getFeaturedItems: builder.query({
      query: () => '/items/featured/',
      transformResponse: (response) => response.results || [],
      providesTags: ['Item'],
    }),
    getMyItems: builder.query({
      query: () => '/items/my-items/',
      transformResponse: (response) => ({
        items: response.results || [],
        total: response.count || 0,
        totalPages: response.next || response.previous ? Math.ceil(response.count / (response.results?.length || 1)) : 1,
        next: response.next,
        previous: response.previous
      }),
      providesTags: ['Item'],
    }),
    getCategories: builder.query({
      query: () => '/categories/',
      transformResponse: (response) => response.results || [],
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: '/items/upload-images/',
        method: 'POST',
        body: formData,
      }),
    }),
    searchItems: builder.query({
      query: (searchTerm) => `/search/?q=${encodeURIComponent(searchTerm)}`,
      transformResponse: (response) => ({
        items: response.results || [],
        total: response.count || 0,
        totalPages: response.next || response.previous ? Math.ceil(response.count / (response.results?.length || 1)) : 1,
        next: response.next,
        previous: response.previous
      }),
      providesTags: ['Item'],
    }),
    getItemsByCategory: builder.query({
      query: (category) => `/items/?category=${category}`,
      transformResponse: (response) => ({
        items: response.results || [],
        total: response.count || 0,
        totalPages: response.next || response.previous ? Math.ceil(response.count / (response.results?.length || 1)) : 1,
        next: response.next,
        previous: response.previous
      }),
      providesTags: ['Item'],
    }),
    reportItem: builder.mutation({
      query: ({ itemId, reason }) => ({
        url: `/items/${itemId}/report/`,
        method: 'POST',
        body: { reason },
      }),
    }),
    getSimilarItems: builder.query({
      query: (itemId) => `/items/${itemId}/similar/`,
      transformResponse: (response) => response.results || [],
      providesTags: ['Item'],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useGetFeaturedItemsQuery,
  useGetMyItemsQuery,
  useGetCategoriesQuery,
  useUploadImagesMutation,
  useSearchItemsQuery,
  useGetItemsByCategoryQuery,
  useReportItemMutation,
  useGetSimilarItemsQuery,
} = itemsApi;
