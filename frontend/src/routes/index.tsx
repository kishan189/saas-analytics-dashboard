/**
 * React Router Configuration
 * 
 * Why this structure:
 * - Centralized route definitions
 * - Protected route wrapper
 * - Role-based access control
 * - Lazy loading for code splitting
 * - Nested route support
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const AnalyticsPage = lazy(() => import('../features/analytics/pages/AnalyticsPage'));
const UsersPage = lazy(() => import('../features/users/pages/UsersPage'));
const BillingPage = lazy(() => import('../features/billing/pages/BillingPage'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage'));
const ActivityLogsPage = lazy(() => import('../features/activity-logs/pages/ActivityLogsPage'));

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'users',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <UsersPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'activity-logs',
        element: (
          <RoleBasedRoute allowedRoles={['admin']}>
            <ActivityLogsPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'billing',
        element: (
          <RoleBasedRoute allowedRoles={['admin', 'manager']}>
            <BillingPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

