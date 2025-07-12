import { baseApi } from './baseApi';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingItems: builder.query({
      query: () => '/admin/items/pending',
      providesTags: ['Admin'],
    }),
    approveItem: builder.mutation({
      query: (itemId) => ({
        url: `/admin/items/${itemId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Admin', 'Item'],
    }),
    rejectItem: builder.mutation({
      query: ({ itemId, reason }) => ({
        url: `/admin/items/${itemId}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Admin', 'Item'],
    }),
    getAllUsers: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value);
          }
        });
        return `/admin/users?${searchParams.toString()}`;
      },
      providesTags: ['Admin'],
    }),
    banUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `/admin/users/${userId}/ban`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Admin'],
    }),
    unbanUser: builder.mutation({
      query: (userId) => ({
        url: `/admin/users/${userId}/unban`,
        method: 'POST',
      }),
      invalidatesTags: ['Admin'],
    }),
    getReports: builder.query({
      query: () => '/admin/reports',
      providesTags: ['Admin'],
    }),
    resolveReport: builder.mutation({
      query: ({ reportId, action, notes }) => ({
        url: `/admin/reports/${reportId}/resolve`,
        method: 'POST',
        body: { action, notes },
      }),
      invalidatesTags: ['Admin'],
    }),
    getAnalytics: builder.query({
      query: (period = '30d') => `/admin/analytics?period=${period}`,
      providesTags: ['Admin'],
    }),
    getDashboardStats: builder.query({
      query: () => '/admin/dashboard/stats',
      providesTags: ['Admin'],
    }),
    getSystemSettings: builder.query({
      query: () => '/admin/settings',
      providesTags: ['Admin'],
    }),
    updateSystemSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Admin'],
    }),
    exportData: builder.mutation({
      query: ({ type, format, dateRange }) => ({
        url: '/admin/export',
        method: 'POST',
        body: { type, format, dateRange },
      }),
    }),
  }),
});

export const {
  useGetPendingItemsQuery,
  useApproveItemMutation,
  useRejectItemMutation,
  useGetAllUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useGetReportsQuery,
  useResolveReportMutation,
  useGetAnalyticsQuery,
  useGetDashboardStatsQuery,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useExportDataMutation,
} = adminApi;
