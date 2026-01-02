/**
 * Dashboard Page
 * 
 * Why this structure:
 * - Feature-based organization
 * - Clear separation of concerns
 * - Reusable components
 * - Comprehensive error handling
 * - Professional SaaS layout
 * - Uses design system components
 */

import { useNavigate } from 'react-router-dom';
import { useGetDashboardKPIsQuery } from '../api/dashboardApiSlice';
import KPICard from '../components/KPICard';
import { PageHeader, Card, Button } from '../../../components/ui';
import { ROUTES } from '../../../utils/constants';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    data: kpisData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDashboardKPIsQuery({});

  if (isError) {
    return (
      <div>
        <PageHeader
          title="Dashboard"
          description="Overview of your business metrics"
        />
        <Card variant="default" className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">Error loading dashboard</h3>
          <p className="text-red-600 dark:text-red-400 text-sm mb-4">
            {error && 'data' in error ? (error.data as any)?.message : 'Failed to load dashboard data'}
          </p>
          <Button variant="danger" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const kpis = kpisData?.data;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your business metrics"
      />

      {/* KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <KPICard key={i} title="" value="" isLoading={true} />
          ))}
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <KPICard
            title="Total Users"
            value={kpis.totalUsers.value.toLocaleString('en-US')}
            growth={kpis.totalUsers.growth}
          />
          <KPICard
            title="Active Users (7 days)"
            value={kpis.activeUsers.value.toLocaleString('en-US')}
            growth={kpis.activeUsers.growth}
          />
          <KPICard
            title="New Users (30 days)"
            value={kpis.newUsers.value.toLocaleString('en-US')}
            growth={kpis.newUsers.growth}
          />
        </div>
      ) : (
        <Card variant="default">
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          </div>
        </Card>
      )}

      {/* Analytics Overview Card */}
      <div className="mt-8">
        <Card 
          variant="default" 
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-300 dark:hover:border-blue-600"
          onClick={() => navigate(ROUTES.ANALYTICS)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Analytics Overview
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                View detailed analytics including user growth trends, active user metrics, and comprehensive insights over customizable date ranges.
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                <span>View Full Analytics</span>
                <svg 
                  className="w-4 h-4 ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
