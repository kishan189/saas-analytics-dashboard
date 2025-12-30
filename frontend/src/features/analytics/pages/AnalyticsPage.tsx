/**
 * Analytics Page
 * 
 * Why this structure:
 * - Comprehensive analytics dashboard
 * - Date range filtering
 * - Multiple chart visualizations
 * - Summary statistics
 */

import { useState, useEffect } from 'react';
import { useGetAnalyticsDataQuery, useGetAnalyticsSummaryQuery } from '../api/analyticsApiSlice';
import DateRangePicker from '../components/DateRangePicker';
import UserGrowthChart from '../components/UserGrowthChart';
import ActiveUsersChart from '../components/ActiveUsersChart';
import AnalyticsSummaryComponent from '../components/AnalyticsSummary';
import { PageHeader, Card } from '../../../components/ui';
import LoadingSpinner from '../../../components/LoadingSpinner';

const AnalyticsPage = () => {
  // Default to last 30 days
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  };

  const [startDate, setStartDate] = useState(getDefaultDates().start);
  const [endDate, setEndDate] = useState(getDefaultDates().end);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Query analytics data
  const {
    data: analyticsData,
    isLoading: isLoadingData,
    isError: isErrorData,
    error: errorData,
    refetch: refetchData,
  } = useGetAnalyticsDataQuery({
    startDate,
    endDate,
    groupBy,
  });

  // Refetch when groupBy changes
  useEffect(() => {
    if (startDate && endDate) {
      refetchData();
    }
  }, [groupBy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Query analytics summary
  const {
    data: summaryData,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    error: errorSummary,
  } = useGetAnalyticsSummaryQuery({
    startDate,
    endDate,
  });

  const handleApply = () => {
    refetchData();
  };

  const isLoading = isLoadingData || isLoadingSummary;
  const isError = isErrorData || isErrorSummary;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Detailed analytics and insights about user growth and activity"
      />

      {/* Date Range Picker */}
      <Card variant="default" className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Date Range
          </h2>
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onApply={handleApply}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            isLoading={isLoading}
          />
        </div>
      </Card>

      {/* Error State */}
      {isError && (
        <Card variant="default" className="mb-6">
          <div className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">
              Failed to load analytics data
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(errorData as any)?.data?.message ||
                (errorSummary as any)?.data?.message ||
                'Please try again later'}
            </p>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && !isError && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Analytics Content */}
      {!isLoading && !isError && (
        <>
          {/* Summary Statistics */}
          {summaryData?.data && (
            <div className="mb-6">
              <AnalyticsSummaryComponent
                summary={summaryData.data}
                isLoading={isLoadingSummary}
              />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* User Growth Chart */}
            <Card variant="default" className="w-full min-w-0">
              <div className="p-6 w-full min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  User Growth
                </h2>
                <div className="w-full min-w-0 overflow-hidden">
                  <UserGrowthChart
                    data={analyticsData?.data || []}
                    isLoading={isLoadingData}
                  />
                </div>
              </div>
            </Card>

            {/* Active Users Chart */}
            <Card variant="default" className="w-full min-w-0">
              <div className="p-6 w-full min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Active Users
                </h2>
                <div className="w-full min-w-0 overflow-hidden">
                  <ActiveUsersChart
                    data={analyticsData?.data || []}
                    isLoading={isLoadingData}
                  />
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
