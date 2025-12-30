/**
 * User Growth Chart Component
 * 
 * Why this component:
 * - Line chart for user growth over time
 * - Shows new users and total users
 * - Responsive and accessible
 */

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AnalyticsDataPoint } from '../api/analyticsApiSlice';

interface UserGrowthChartProps {
  data: AnalyticsDataPoint[];
  isLoading?: boolean;
}

const UserGrowthChart = ({ data, isLoading = false }: UserGrowthChartProps) => {
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
      newUsers: item.newUsers,
      totalUsers: item.totalUsers,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
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
        <Line
          type="monotone"
          dataKey="newUsers"
          stroke="#3b82f6"
          strokeWidth={2}
          name="New Users"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="totalUsers"
          stroke="#10b981"
          strokeWidth={2}
          name="Total Users"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;

