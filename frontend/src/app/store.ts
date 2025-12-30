/**
 * Redux Store Configuration
 * 
 * Why RTK Query:
 * - Built-in caching and invalidation
 * - Automatic loading/error states
 * - Reduces boilerplate significantly
 * - TypeScript-first approach
 * - Optimistic updates support
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import authReducer from '../features/auth/slice/authSlice';
import themeReducer, { setEffectiveTheme } from '../features/settings/slice/themeSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API slice
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Auth slice
    auth: authReducer,
    // Theme slice
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (RTK Query uses non-serializable values)
        ignoredActions: ['api/executeQuery/pending', 'api/executeQuery/fulfilled', 'api/executeQuery/rejected'],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.DEV, // Only enable in development
});

// Make store available globally for system theme listener
if (typeof window !== 'undefined') {
  (window as any).__REDUX_STORE__ = store;
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const state = store.getState();
      if (state.theme?.mode === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        store.dispatch(setEffectiveTheme(newTheme));
      }
    });
  }
}

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

