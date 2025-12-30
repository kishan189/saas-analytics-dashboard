/**
 * Analytics API Slice
 * 
 * Why RTK Query for analytics:
 * - Automatic caching
 * - Built-in loading/error states
 * - Type-safe API calls
 * - Easy refetch on date range changes
 */

import { apiSlice } from '../../../app/api/apiSlice';

// Analytics data point
export interface AnalyticsDataPoint {
  date: string;
  dateValue: Date;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

// Analytics summary
export interface AnalyticsSummary {
  totalNewUsers: number;
  totalActiveUsers: number;
  averageNewUsersPerDay: number;
  averageActiveUsersPerDay: number;
  peakNewUsersDay: {
    date: string;
    count: number;
  } | null;
  peakActiveUsersDay: {
    date: string;
    count: number;
  } | null;
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

// Query params
export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get analytics data for charts
    getAnalyticsData: builder.query<{ data: AnalyticsDataPoint[] }, AnalyticsQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.groupBy) searchParams.append('groupBy', params.groupBy);

        const queryString = searchParams.toString();
        return {
          url: `analytics/data${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),

    // Get analytics summary
    getAnalyticsSummary: builder.query<{ data: AnalyticsSummary }, AnalyticsQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();
        return {
          url: `analytics/summary${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),
  }),
});

export const { useGetAnalyticsDataQuery, useGetAnalyticsSummaryQuery } = analyticsApiSlice;

