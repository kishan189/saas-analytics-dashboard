/**
 * Core TypeScript types for the application
 * Centralized type definitions for better maintainability
 */

// User roles
export type UserRole = 'admin' | 'manager' | 'viewer';

// User interface
export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  // Note: refreshToken is stored in HTTP-only cookie, not in response
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common query params
export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

