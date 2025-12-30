/**
 * Protected Route Component
 * 
 * Why this approach:
 * - Uses Redux state (single source of truth)
 * - Automatic redirect to login if not authenticated
 * - Can be extended with loading states
 * - Works with React Router v6 nested routes
 * - Wraps authenticated routes with AppLayout
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import AppLayout from '../components/layout/AppLayout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes with AppLayout
  return <AppLayout />;
};

export default ProtectedRoute;

