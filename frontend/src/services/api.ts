/**
 * Centralized Axios client with interceptors
 * 
 * Why this approach:
 * - Single source of truth for API configuration
 * - Automatic token injection
 * - Centralized error handling
 * - Request/response transformation
 * - Retry logic for failed requests
 */

import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { tokenStorage, clearAuthData } from '../utils/storage';

// Create axios instance
// Using ReturnType to infer the type from axios.create() - more reliable than importing AxiosInstance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Inject access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (token expired/invalid)
    // Don't handle 401 on login endpoint - let it fail normally
    const isLoginEndpoint = originalRequest.url?.includes('/auth/login');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginEndpoint) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, clear auth and redirect to login
          clearAuthData();
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Store new tokens
        tokenStorage.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenStorage.setRefreshToken(newRefreshToken);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth and redirect
        clearAuthData();
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // For login endpoint 401 errors, just reject without redirecting
    if (error.response?.status === 401 && isLoginEndpoint) {
      return Promise.reject(error);
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;

