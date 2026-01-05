/**
 * Theme Toggle Component
 * 
 * Why this component:
 * - Reusable theme switcher
 * - Accessible dropdown menu
 * - Visual feedback for current theme
 * - Follows SaaS best practices (icon + dropdown)
 */

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setTheme, type ThemeMode } from '../../features/settings/slice/themeSlice';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import toast from 'react-hot-toast';

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const { mode, effectiveTheme } = useAppSelector((state) => state.theme);

  const handleThemeChange = (newTheme: ThemeMode) => {
    // Calculate effective theme immediately
    const effective = newTheme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    
    // Apply theme immediately to DOM (before Redux update)
    const root = document.documentElement;
    root.classList.remove('dark');
    if (effective === 'dark') {
      root.classList.add('dark');
    }
    
    // Dispatch Redux action
    dispatch(setTheme(newTheme));
    
    // Show toast notification
    const themeLabel = newTheme === 'system' ? 'system default' : newTheme;
    toast.success(`Theme changed to ${themeLabel}`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  // Get icon based on effective theme
  const getThemeIcon = () => {
    if (effectiveTheme === 'dark') {
      return (
        <svg
          className="h-5 w-5 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-5 w-5 cursor-pointer"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    );
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Change theme"
          title={`Current theme: ${mode === 'system' ? 'system' : mode}`}
        >
          {getThemeIcon()}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
          align="end"
          sideOffset={5}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Theme
          </div>
          
          <DropdownMenu.Item
            onClick={() => handleThemeChange('light')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer outline-none ${
              mode === 'light'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Light
            {mode === 'light' && (
              <svg
                className="h-4 w-4 ml-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => handleThemeChange('dark')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer outline-none ${
              mode === 'dark'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            Dark
            {mode === 'dark' && (
              <svg
                className="h-4 w-4 ml-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => handleThemeChange('system')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer outline-none ${
              mode === 'system'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            System
            {mode === 'system' && (
              <svg
                className="h-4 w-4 ml-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ThemeToggle;

