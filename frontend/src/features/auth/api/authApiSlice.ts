/**
 * Auth API Slice
 * 
 * Why RTK Query for auth:
 * - Automatic caching and invalidation
 * - Built-in loading/error states
 * - Type-safe API calls
 * - Easy to integrate with Redux state
 */

import { apiSlice } from '../../../app/api/apiSlice';
import type { LoginCredentials, User, ApiResponse } from '../../../types';

// Login response type (matches backend structure)
type LoginResponse = ApiResponse<{
  user: User;
  accessToken: string;
}>;

// Register payload type
export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'viewer';
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register mutation
    register: builder.mutation<LoginResponse, RegisterPayload>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Dashboard'], // Invalidate dashboard to refresh on registration
    }),

    // Login mutation
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User', 'Dashboard'], // Invalidate dashboard to refresh on login
    }),

    // Refresh token mutation
    refreshToken: builder.mutation<{ accessToken: string }, { refreshToken: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    // Logout mutation
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Get current user
    getMe: builder.query<{ user: User }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApiSlice;

