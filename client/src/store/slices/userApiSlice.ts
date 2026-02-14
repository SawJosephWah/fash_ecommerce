import type { UpdatePasswordRequest, UserResponse } from '@/Types/User';
import { apiSlice } from './apiSlice';



export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/users/login',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User','Order', 'Product']
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/users/register',
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<{ status: string }, void>({
      query: () => ({
        url: '/users/logout',
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Order', 'Product'],
    }),
    getMe: builder.query<UserResponse, void>({
      query: () => ({
        url: '/users/me',
        method: 'GET',
      }),
      providesTags: ['User']
    }),
    uploadAvatar: builder.mutation({
      query: (data) => ({
        url: '/users/update-avatar',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // --- NEW ENDPOINT ---
    updateEmail: builder.mutation({
      query: (data) => ({
        url: '/users/update-email',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateName: builder.mutation<UserResponse, { name: string }>({
      query: (data) => ({
        url: '/users/update-name',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'], // Automatically refreshes the UI
    }),
    updatePassword: builder.mutation<{ status: string; message: string }, UpdatePasswordRequest>({
      query: (data) => ({
        url: '/users/update-password',
        method: 'PUT',
        body: data, // This will now send { current_password, new_password }
      }),
    }),
    resetPassword: builder.mutation<{ status: string; message: string }, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: `/users/reset-password/${token}`,
        method: 'PATCH',
        body: { password }, // Only sends the password field as requested
      }),
    }),
    forgetPassword: builder.mutation({
      query: (data) => ({
        url: '/users/forget-password-email',
        method: 'POST',
        body: data, // sends { email }
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUploadAvatarMutation,
  useUpdateEmailMutation, // Export the new hook
  useUpdateNameMutation,
  useUpdatePasswordMutation,
  useResetPasswordMutation,
  useForgetPasswordMutation
} = userApiSlice;