/**
 * Theme Slice
 * 
 * Why Redux slice for theme:
 * - Global state accessible everywhere
 * - Persists across route changes
 * - Easy to sync with localStorage
 * - Can be extended for future preferences
 */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { themeStorage } from '../../../utils/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  effectiveTheme: 'light' | 'dark'; // Actual theme being used (resolved from system if needed)
}

// Get system preference
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Get effective theme based on mode
const getEffectiveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

// Initialize from localStorage or default to 'system'
const savedTheme = themeStorage.getTheme();
const initialMode: ThemeMode = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'system';
const initialEffectiveTheme = getEffectiveTheme(initialMode);

// Apply theme to document
const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    // Force synchronous update - always remove first, then add if needed
    root.classList.remove('dark');
    
    if (theme === 'dark') {
      root.classList.add('dark');
      // Double-check
      if (!root.classList.contains('dark')) {
        // Force it using setAttribute as fallback
        const currentClasses = root.className || '';
        root.setAttribute('class', currentClasses ? `${currentClasses} dark` : 'dark');
      }
    }
    
  }
};

// Apply initial theme immediately (for SSR/hydration)
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  // Always remove first to ensure clean state
  root.classList.remove('dark');
  if (initialEffectiveTheme === 'dark') {
    root.classList.add('dark');
    // Verify
    if (!root.classList.contains('dark')) {
      root.setAttribute('class', (root.className || '') + ' dark');
    }
  }
}

// Listen for system theme changes (will be set up after store is created)

const initialState: ThemeState = {
  mode: initialMode,
  effectiveTheme: initialEffectiveTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      const effective = getEffectiveTheme(action.payload);
      state.effectiveTheme = effective;
      
      // Persist to localStorage (only if not 'system')
      if (action.payload !== 'system') {
        themeStorage.setTheme(action.payload);
      } else {
        // Remove from storage if system
        localStorage.removeItem('theme');
      }
      
      // Apply theme immediately (for instant feedback)
      applyTheme(effective);
    },
    setEffectiveTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.effectiveTheme = action.payload;
      // Apply theme immediately
      applyTheme(action.payload);
    },
  },
});

export const { setTheme, setEffectiveTheme } = themeSlice.actions;
export default themeSlice.reducer;

