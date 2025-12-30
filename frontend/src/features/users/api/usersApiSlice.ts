/**
 * Users API Slice
 * 
 * Why RTK Query for users:
 * - Automatic caching and invalidation
 * - Built-in loading/error states
 * - Type-safe API calls
 * - Optimistic updates support
 * - Pagination handling
 */

import { apiSlice } from '../../../app/api/apiSlice';
import type { User, PaginatedResponse, PaginationParams } from '../../../types';

// Query params for getting users
export interface GetUsersParams extends PaginationParams {
  search?: string;
  role?: 'admin' | 'manager' | 'viewer';
  isActive?: boolean | string;
}

// Create user payload
export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'manager' | 'viewer';
  isActive?: boolean;
}

// Update user payload
export interface UpdateUserPayload {
  email?: string;
  password?: string;
  name?: string;
  role?: 'admin' | 'manager' | 'viewer';
  isActive?: boolean;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query<
      { data: User[]; pagination: PaginatedResponse<User>['pagination'] },
      GetUsersParams
    >({
      query: (params = {} as GetUsersParams) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.role) searchParams.append('role', params.role);
        if (params.isActive !== undefined) {
          searchParams.append('isActive', params.isActive.toString());
        }
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

        const queryString = searchParams.toString();
        return {
          url: `users${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['User'],
    }),

    // Get user by ID
    getUser: builder.query<{ data: User }, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Create user
    createUser: builder.mutation<{ data: User }, CreateUserPayload>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // Update user
    updateUser: builder.mutation<
      { data: User },
      { id: string; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        'User',
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Toggle user status
    toggleUserStatus: builder.mutation<{ data: User }, string>({
      query: (id) => ({
        url: `users/${id}/toggle-status`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        'User',
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
} = usersApiSlice;

