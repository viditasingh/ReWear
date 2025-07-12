import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/profile/',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/profile/',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: '/auth/change-password/',
        method: 'POST',
        body: { currentPassword, newPassword },
      }),
    }),
    getPoints: builder.query({
      query: () => '/points/transactions/',
      providesTags: ['User'],
    }),
    getPointsHistory: builder.query({
      query: () => '/points/transactions/',
      providesTags: ['User'],
    }),
    uploadAvatar: builder.mutation({
      query: (formData) => ({
        url: '/profile/avatar/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    getPreferences: builder.query({
      query: () => '/profile/preferences/',
      providesTags: ['User'],
    }),
    updatePreferences: builder.mutation({
      query: (preferences) => ({
        url: '/profile/preferences/',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['User'],
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/profile/delete/',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getNotifications: builder.query({
      query: () => '/notifications/',
      providesTags: ['User'],
    }),
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read/`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all/',
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
