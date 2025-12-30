/**
 * Skeleton Loader Component
 * 
 * Why skeleton loaders:
 * - Better perceived performance
 * - Shows content structure while loading
 * - Reduces layout shift
 * - Professional UX pattern
 */

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

const SkeletonLoader = ({ className = '', variant = 'rectangular' }: SkeletonLoaderProps) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-20',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export default SkeletonLoader;

