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
        return `/items?${searchParams.toString()}`;
      },
      providesTags: ['Item'],
    }),
    getItem: builder.query({
      query: (id) => `/items/${id}`,
      providesTags: (result, error, id) => [{ type: 'Item', id }],
    }),
    createItem: builder.mutation({
      query: (itemData) => ({
        url: '/items',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Item'],
    }),
    updateItem: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/items/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Item', id }],
    }),
    deleteItem: builder.mutation({
      query: (id) => ({
        url: `/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'],
    }),
    getFeaturedItems: builder.query({
      query: () => '/items/featured',
      providesTags: ['Item'],
    }),
    getMyItems: builder.query({
      query: () => '/items/my',
      providesTags: ['Item'],
    }),
    getCategories: builder.query({
      query: () => '/items/categories',
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: '/items/upload-images',
        method: 'POST',
        body: formData,
      }),
    }),
    searchItems: builder.query({
      query: (searchTerm) => `/items/search?q=${encodeURIComponent(searchTerm)}`,
      providesTags: ['Item'],
    }),
    getItemsByCategory: builder.query({
      query: (category) => `/items/category/${category}`,
      providesTags: ['Item'],
    }),
    reportItem: builder.mutation({
      query: ({ itemId, reason }) => ({
        url: `/items/${itemId}/report`,
        method: 'POST',
        body: { reason },
      }),
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
} = itemsApi;
