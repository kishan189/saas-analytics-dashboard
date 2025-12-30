/**
 * Settings Page
 * 
 * Why this structure:
 * - Clean, organized settings layout
 * - Immediate visual feedback
 * - Accessible controls
 * - Extensible for future preferences
 */

import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { setTheme, type ThemeMode } from '../slice/themeSlice';
import toast from 'react-hot-toast';
import { PageHeader, Card } from '../../../components/ui';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { mode, effectiveTheme } = useAppSelector((state) => state.theme);

  const handleThemeChange = (newTheme: ThemeMode) => {
    // Calculate effective theme immediately
    const effective = newTheme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    
    // Apply theme immediately to DOM (before Redux update)
    const root = document.documentElement;
    
    // Force remove first, then add to ensure it works
    root.classList.remove('dark');
    if (effective === 'dark') {
      root.classList.add('dark');
      // Double-check it was added
      if (!root.classList.contains('dark')) {
        console.error('[Theme] Failed to add dark class!');
        // Force it
        root.setAttribute('class', root.className + ' dark');
      }
    }
    
    // Dispatch Redux action (which will also apply theme)
    dispatch(setTheme(newTheme));
    toast.success(`Theme changed to ${newTheme === 'system' ? 'system default' : newTheme}`);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your application preferences"
      />

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance Section */}
        <Card variant="default">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose how the application looks to you
          </p>

          {/* Theme Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Light Theme Option */}
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  mode === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-pressed={mode === 'light'}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">☀️</span>
                  <span className="font-medium">Light</span>
                </div>
                {mode === 'light' && (
                  <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">Active</p>
                )}
              </button>

              {/* Dark Theme Option */}
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  mode === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-pressed={mode === 'dark'}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🌙</span>
                  <span className="font-medium">Dark</span>
                </div>
                {mode === 'dark' && (
                  <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">Active</p>
                )}
              </button>

              {/* System Theme Option */}
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  mode === 'system'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                aria-pressed={mode === 'system'}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">💻</span>
                  <span className="font-medium">System</span>
                </div>
                {mode === 'system' && (
                  <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                    Active ({effectiveTheme})
                  </p>
                )}
              </button>
            </div>

            {/* Current Theme Info */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Current theme: <span className="font-medium">{effectiveTheme}</span>
              {mode === 'system' && ' (following system preference)'}
            </p>
          </div>
        </Card>

        {/* Future Preferences Section */}
        <Card variant="default">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Additional preferences will be available here in the future
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

