/**
 * Utility for conditional class names
 * Combines clsx with Tailwind's class merging
 */

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

