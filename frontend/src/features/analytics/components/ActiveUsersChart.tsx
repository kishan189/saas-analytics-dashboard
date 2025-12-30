/**
 * Active Users Chart Component
 * 
 * Why this component:
 * - Bar chart for active users
 * - Easy to compare daily/weekly/monthly activity
 * - Responsive and accessible
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AnalyticsDataPoint } from '../api/analyticsApiSlice';

interface ActiveUsersChartProps {
  data: AnalyticsDataPoint[];
  isLoading?: boolean;
}

const ActiveUsersChart = ({ data, isLoading = false }: ActiveUsersChartProps) => {
  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">No data available</div>
      </div>
    );
  }

  // Format data for chart with better date formatting
  const chartData = data.map((item) => {
    // Format date for display
    let formattedDate = item.date;
    try {
      const date = new Date(item.dateValue || item.date);
      if (!isNaN(date.getTime())) {
        // Format based on date string length (day/week/month)
        if (item.date.includes('W')) {
          // Week format: 2024-W01 -> Week 01, 2024
          formattedDate = item.date.replace('W', ' - Week ');
        } else if (item.date.match(/^\d{4}-\d{2}$/)) {
          // Month format: 2024-01 -> Jan 2024
          formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
          // Day format: 2024-01-15 -> Jan 15
          formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
    } catch (e) {
      // Keep original if parsing fails
    }
    
    return {
      date: formattedDate,
      activeUsers: item.activeUsers,
      newUsers: item.newUsers,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          stroke="currentColor"
        />
        <YAxis
          className="text-xs"
          tick={{ fill: 'currentColor' }}
          stroke="currentColor"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card-bg, white)',
            border: '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '0.5rem',
            color: 'var(--text-color, #111827)',
          }}
          labelStyle={{ color: 'var(--text-color, #111827)' }}
          itemStyle={{ color: 'var(--text-color, #111827)' }}
        />
        <Legend />
        <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
        <Bar dataKey="newUsers" fill="#10b981" name="New Users" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActiveUsersChart;

