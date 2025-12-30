/**
 * LocalStorage utilities
 * Type-safe storage helpers with error handling
 */

import { STORAGE_KEYS } from './constants';
import type { User } from '../types';

class Storage {
  private isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.isAvailable()) {
      console.warn('LocalStorage is not available');
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  }

  getItem(key: string): string | null {
    if (!this.isAvailable()) {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable()) {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  }

  clear(): void {
    if (!this.isAvailable()) {
      return;
    }
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

const storage = new Storage();

// Token management
export const tokenStorage = {
  getAccessToken: (): string | null => storage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string): void => storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: (): void => storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),

  getRefreshToken: (): string | null => storage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string): void => storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: (): void => storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),

  clearTokens: (): void => {
    storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

// User management
export const userStorage = {
  getUser: (): User | null => {
    const userStr = storage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },
  setUser: (user: User): void => {
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  removeUser: (): void => {
    storage.removeItem(STORAGE_KEYS.USER);
  },
};

// Theme management
export const themeStorage = {
  getTheme: (): 'light' | 'dark' | 'system' => {
    const theme = storage.getItem(STORAGE_KEYS.THEME);
    return (theme === 'dark' || theme === 'light' || theme === 'system') ? theme : 'system';
  },
  setTheme: (theme: 'light' | 'dark' | 'system'): void => {
    if (theme === 'system') {
      storage.removeItem(STORAGE_KEYS.THEME);
    } else {
      storage.setItem(STORAGE_KEYS.THEME, theme);
    }
  },
};

// Clear all auth data
export const clearAuthData = (): void => {
  tokenStorage.clearTokens();
  userStorage.removeUser();
};

