/**
 * Analytics Summary Component
 * 
 * Why this component:
 * - Displays key metrics at a glance
 * - Clean card-based layout
 * - Easy to scan
 */

import { Card } from '../../../components/ui';
import type { AnalyticsSummary } from '../api/analyticsApiSlice';

interface AnalyticsSummaryProps {
  summary: AnalyticsSummary;
  isLoading?: boolean;
}

const AnalyticsSummaryComponent = ({ summary, isLoading = false }: AnalyticsSummaryProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="default">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total New Users',
      value: summary.totalNewUsers.toLocaleString(),
      description: `in ${summary.period.days} days`,
    },
    {
      label: 'Total Active Users',
      value: summary.totalActiveUsers.toLocaleString(),
      description: `in ${summary.period.days} days`,
    },
    {
      label: 'Avg New Users/Day',
      value: summary.averageNewUsersPerDay.toFixed(1),
      description: 'Daily average',
    },
    {
      label: 'Avg Active Users/Day',
      value: summary.averageActiveUsersPerDay.toFixed(1),
      description: 'Daily average',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} variant="default">
          <div className="p-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {metric.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metric.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {metric.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AnalyticsSummaryComponent;

