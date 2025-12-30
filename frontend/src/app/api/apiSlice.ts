/**
 * RTK Query Base API Slice
 * 
 * Why this structure:
 * - Single base API for all endpoints
 * - Shared configuration (base URL, headers)
 * - Automatic caching and invalidation
 * - Type-safe API calls
 * - Centralized error handling
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { AxiosError } from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import { tokenStorage, clearAuthData } from '../../utils/storage';
import apiClient from '../../services/api';

// Custom base query using our axios instance
const axiosBaseQuery =
  (): BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError> =>
  async ({ url, method, body, data, params }) => {
    try {
      // RTK Query uses 'body', axios uses 'data' - map accordingly
      const requestData = body || data;
      
      // Ensure URL is valid
      if (!url) {
        throw new Error('No URL provided');
      }
      
      const result = await apiClient.request({
        url: url as string,
        method: method as any,
        data: requestData,
        params,
      });
      return { data: result.data };
    } catch (axiosError: any) {
      const err = axiosError as AxiosError;
      
      // Handle 401 - clear auth and redirect (but not on login endpoint)
      if (err.response?.status === 401 && !url?.includes('/auth/login')) {
        clearAuthData();
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      return {
        error: {
          status: err.response?.status || 500,
          data: err.response?.data || { message: err.message },
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['User', 'Analytics', 'Dashboard', 'Billing', 'ActivityLog'], // Tags for cache invalidation
  endpoints: () => ({}), // Endpoints will be injected by feature slices
});

