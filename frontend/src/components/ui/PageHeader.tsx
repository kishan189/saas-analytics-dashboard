/**
 * Page Header Component
 * 
 * Why reusable component:
 * - Consistent page headers
 * - Title + description pattern
 * - Professional spacing
 * - Optional actions
 */

import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;

