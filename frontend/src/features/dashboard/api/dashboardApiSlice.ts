/**
 * Dashboard API Slice
 * 
 * Why RTK Query for dashboard:
 * - Automatic caching (dashboard data doesn't change frequently)
 * - Built-in loading/error states
 * - Type-safe API calls
 * - Easy refetch on date range changes
 */

import { apiSlice } from '../../../app/api/apiSlice';

// KPI data types (matching backend response)
export interface KPIData {
  totalUsers: {
    value: number;
    growth: number;
  };
  activeUsers: {
    value: number;
    growth: number;
  };
  newUsers: {
    value: number;
    growth: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface AnalyticsDataPoint {
  date: string;
  newUsers: number;
  activeUsers: number;
}

export interface DashboardKPIsResponse {
  data: KPIData;
}

export interface DashboardAnalyticsResponse {
  data: AnalyticsDataPoint[];
}

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard KPIs
    getDashboardKPIs: builder.query<DashboardKPIsResponse, DashboardQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();
        return {
          url: `dashboard/kpis${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Dashboard'],
    }),

    // Get recent analytics data
    getDashboardAnalytics: builder.query<DashboardAnalyticsResponse, DashboardQueryParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);
        if (params.limit) searchParams.append('limit', params.limit.toString());

        const queryString = searchParams.toString();
        return {
          url: `dashboard/analytics${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardKPIsQuery, useGetDashboardAnalyticsQuery } = dashboardApiSlice;

