/**
 * Activity Logs API Slice
 * 
 * Why RTK Query for activity logs:
 * - Automatic caching
 * - Built-in loading/error states
 * - Type-safe API calls
 * - Pagination handling
 */

import { apiSlice } from '../../../app/api/apiSlice';

// Activity log data point
export interface ActivityLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: 'login' | 'logout' | 'user.created' | 'user.updated' | 'user.deleted' | 'user.status_toggled';
  entityType: 'user' | 'auth' | null;
  entityId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  details: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

// Query params
export interface ActivityLogsQueryParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: ActivityLog['action'];
  startDate?: string;
  endDate?: string;
}

export const activityLogsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get activity logs with pagination and filters
    getActivityLogs: builder.query<
      { data: ActivityLog[]; pagination: any },
      ActivityLogsQueryParams
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.userId) searchParams.append('userId', params.userId);
        if (params.action) searchParams.append('action', params.action);
        if (params.startDate) searchParams.append('startDate', params.startDate);
        if (params.endDate) searchParams.append('endDate', params.endDate);

        const queryString = searchParams.toString();
        return {
          url: `activity-logs${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['ActivityLog'],
    }),

    // Get activity log by ID
    getActivityLog: builder.query<{ data: ActivityLog }, string>({
      query: (id) => ({
        url: `activity-logs/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'ActivityLog', id }],
    }),
  }),
});

export const { useGetActivityLogsQuery, useGetActivityLogQuery } = activityLogsApiSlice;

