/**
 * Theme Sync Hook
 * 
 * Why this hook:
 * - Ensures theme is applied to DOM when Redux state changes
 * - Handles React re-renders properly
 * - Syncs theme on mount and changes
 */

import { useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';

/**
 * Syncs Redux theme state with DOM
 * Applies/removes 'dark' class on document.documentElement
 */
export const useThemeSync = () => {
  const { effectiveTheme } = useAppSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    // Force synchronous update - remove first, then add if needed
    root.classList.remove('dark');
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      // Verify it was added
      if (!root.classList.contains('dark')) {
        console.error('[Theme Sync] Failed to add dark class!');
        root.setAttribute('class', root.className + ' dark');
      }
    }
    
  }, [effectiveTheme]);
};

