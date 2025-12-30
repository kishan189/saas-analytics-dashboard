/**
 * Auth Slice
 * 
 * Why Redux slice for auth state:
 * - Global state accessible everywhere
 * - Persists across route changes
 * - Easy to sync with API calls
 * - Centralized auth logic
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '../../../types';
import { userStorage, tokenStorage } from '../../../utils/storage';

// Initialize state from localStorage (for page refresh)
const initialState: AuthState = {
  user: userStorage.getUser(),
  accessToken: tokenStorage.getAccessToken(),
  refreshToken: tokenStorage.getRefreshToken(),
  isAuthenticated: !!userStorage.getUser() && !!tokenStorage.getAccessToken(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.isAuthenticated = true;

      if (refreshToken) {
        state.refreshToken = refreshToken;
      }

      // Persist to localStorage
      userStorage.setUser(user);
      tokenStorage.setAccessToken(accessToken);
      if (refreshToken) {
        tokenStorage.setRefreshToken(refreshToken);
      }
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      tokenStorage.setAccessToken(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear localStorage
      userStorage.removeUser();
      tokenStorage.clearTokens();
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

