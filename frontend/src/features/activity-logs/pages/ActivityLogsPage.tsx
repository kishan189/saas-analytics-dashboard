/**
 * Activity Logs Page
 * 
 * Why this structure:
 * - Audit trail for security and compliance
 * - Admin visibility into system activity
 * - Table layout for easy scanning
 * - Filtering and pagination
 */

import { useState } from 'react';
import { useGetActivityLogsQuery } from '../api/activityLogsApiSlice';
import { PageHeader, Card, Badge, Button } from '../../../components/ui';
import LoadingSpinner from '../../../components/LoadingSpinner';
import type { ActivityLog } from '../api/activityLogsApiSlice';

const ActivityLogsPage = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>('');
  const limit = 20;

  // Query activity logs
  const {
    data: logsData,
    isLoading,
    isError,
    error,
  } = useGetActivityLogsQuery({
    page,
    limit,
    action: (actionFilter as ActivityLog['action']) || undefined,
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get action label and color
  const getActionInfo = (action: ActivityLog['action']) => {
    const actionMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' }> = {
      login: { label: 'Login', variant: 'success' },
      logout: { label: 'Logout', variant: 'default' },
      'user.created': { label: 'User Created', variant: 'success' },
      'user.updated': { label: 'User Updated', variant: 'warning' },
      'user.deleted': { label: 'User Deleted', variant: 'danger' },
      'user.status_toggled': { label: 'Status Changed', variant: 'warning' },
    };
    return actionMap[action] || { label: action, variant: 'default' };
  };

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description="Audit trail of system activities and user actions"
      />

      {/* Filters */}
      <Card variant="default" className="mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Action
              </label>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1); // Reset to first page when filter changes
                }}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="user.created">User Created</option>
                <option value="user.updated">User Updated</option>
                <option value="user.deleted">User Deleted</option>
                <option value="user.status_toggled">Status Changed</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {isError && (
        <Card variant="default" className="mb-6">
          <div className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-2">
              Failed to load activity logs
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {(error as any)?.data?.message || 'Please try again later'}
            </p>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card variant="default">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      )}

      {/* Activity Logs Table */}
      {!isLoading && !isError && (
        <>
          <Card variant="default" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {logsData?.data && logsData.data.length > 0 ? (
                    logsData.data.map((log) => {
                      const actionInfo = getActionInfo(log.action);
                      return (
                        <tr
                          key={log._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatTimestamp(log.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {log.userId?.name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {log.userId?.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={actionInfo.variant} size="sm">
                              {actionInfo.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {log.entityId ? (
                              <div>
                                <div className="text-gray-900 dark:text-white">
                                  {log.entityId.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {log.entityId.email}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            {log.ipAddress || <span className="text-gray-400">—</span>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          No activity logs found
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {logsData?.pagination && logsData.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((page - 1) * limit) + 1} to{' '}
                {Math.min(page * limit, logsData.pagination.total)} of{' '}
                {logsData.pagination.total} logs
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= logsData.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityLogsPage;

