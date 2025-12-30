/**
 * KPI Card Component
 * 
 * Why reusable component:
 * - Consistent styling across all KPIs
 * - Easy to maintain
 * - DRY principle
 * - Type-safe props
 * - Uses design system Card component
 */

import Card from '../../../components/ui/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  growth?: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const KPICard = ({ title, value, growth, icon, isLoading }: KPICardProps) => {
  if (isLoading) {
    return (
      <Card variant="default" className="hover:shadow-md transition-shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </Card>
    );
  }

  const formattedValue =
    typeof value === 'number'
      ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : value;

  const growthColor = growth && growth >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';
  const growthIcon = growth && growth >= 0 ? '↑' : '↓';

  return (
    <Card variant="default" className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
        {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
      </div>
      
      <div className="mb-2">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formattedValue}</p>
      </div>

      {growth !== undefined && (
        <div className={`flex items-center text-sm ${growthColor}`}>
          <span className="mr-1">{growthIcon}</span>
          <span>{Math.abs(growth).toFixed(1)}%</span>
          <span className="ml-1 text-gray-500 dark:text-gray-400">vs previous period</span>
        </div>
      )}
    </Card>
  );
};

export default KPICard;

