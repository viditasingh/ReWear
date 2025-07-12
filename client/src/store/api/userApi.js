import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/user/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: '/user/change-password',
        method: 'POST',
        body: { currentPassword, newPassword },
      }),
    }),
    getPoints: builder.query({
      query: () => '/user/points',
      providesTags: ['User'],
    }),
    getPointsHistory: builder.query({
      query: () => '/user/points/history',
      providesTags: ['User'],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/user/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    getPreferences: builder.query({
      query: () => '/user/preferences',
      providesTags: ['User'],
    }),
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: '/user/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/user/account',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getNotifications: builder.query({
      query: () => '/user/notifications',
      providesTags: ['User'],
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/user/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/user/notifications/read-all',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetPointsQuery,
  useGetPointsHistoryQuery,
  useUploadAvatarMutation,
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
  useDeleteAccountMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = userApi;
