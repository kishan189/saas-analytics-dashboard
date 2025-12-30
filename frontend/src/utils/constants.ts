/**
 * Application constants
 * Centralized constants for better maintainability
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ANALYTICS: '/analytics',
  USERS: '/users',
  BILLING: '/billing',
  SETTINGS: '/settings',
  ACTIVITY_LOGS: '/activity-logs',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  VIEWER: 'viewer',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

