/**
 * Role-Based Route Component
 * 
 * Why this approach:
 * - Uses Redux state (single source of truth)
 * - Granular access control per route
 * - Reusable for different role combinations
 * - Clear 403 handling
 * - Type-safe role checking
 */

import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { UserRole } from '../types';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in allowed roles
  if (!allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user doesn't have permission
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;

