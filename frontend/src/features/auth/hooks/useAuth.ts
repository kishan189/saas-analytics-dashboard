/**
 * Custom Auth Hook
 * 
 * Why custom hook:
 * - Encapsulates auth logic
 * - Reusable across components
 * - Cleaner component code
 * - Type-safe
 */

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { logout as logoutAction } from '../slice/authSlice';
import { useLogoutMutation } from '../api/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  const logout = async () => {
    try {
      // Call logout API (clears refresh token cookie on server)
      await logoutMutation().unwrap();
    } catch (error) {
      // Even if API call fails, clear local state
      console.error('Logout API error:', error);
    } finally {
      // Clear Redux state and localStorage
      dispatch(logoutAction());
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Redirect to login
      navigate(ROUTES.LOGIN);
    }
  };

  return {
    user,
    isAuthenticated,
    accessToken,
    logout,
  };
};

