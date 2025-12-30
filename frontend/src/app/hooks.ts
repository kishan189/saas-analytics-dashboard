/**
 * Typed Redux Hooks
 * 
 * Why custom hooks:
 * - TypeScript inference for dispatch and state
 * - Prevents common mistakes
 * - Better IDE autocomplete
 * - Consistent usage across the app
 */

import { useDispatch, useSelector, useStore } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore = () => useStore<RootState>();

