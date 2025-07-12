import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: { token },
      }),
    }),
    resendVerification: builder.mutation({
      query: (email) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
