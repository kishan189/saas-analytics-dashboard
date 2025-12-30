/**
 * User Growth Chart Component
 * 
 * Enhanced design:
 * - Professional styling with better colors
 * - Improved tooltips with dark mode support
 * - Better spacing and typography
 * - Smooth animations
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

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const UserGrowthChart = ({ data, isLoading = false }: UserGrowthChartProps) => {
  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading chart data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-1">No data available</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your date range</p>
        </div>
      </div>
    );
  }

  // Format data for chart with better date formatting
  const chartData = data.map((item) => {
    let formattedDate = item.date;
    try {
      const date = new Date(item.dateValue || item.date);
      if (!isNaN(date.getTime())) {
        if (item.date.includes('W')) {
          formattedDate = item.date.replace('W', ' - Week ');
        } else if (item.date.match(/^\d{4}-\d{2}$/)) {
          formattedDate = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } else {
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
        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#e5e7eb" 
          className="dark:stroke-gray-700"
          opacity={0.5}
        />
        <XAxis
          dataKey="date"
          tick={{ 
            fill: '#6b7280',
            fontSize: 12,
            className: 'dark:fill-gray-400'
          }}
          stroke="#d1d5db"
          className="dark:stroke-gray-600"
          tickLine={{ stroke: '#d1d5db', className: 'dark:stroke-gray-600' }}
          axisLine={{ stroke: '#d1d5db', className: 'dark:stroke-gray-600' }}
        />
        <YAxis
          tick={{ 
            fill: '#6b7280',
            fontSize: 12,
            className: 'dark:fill-gray-400'
          }}
          stroke="#d1d5db"
          className="dark:stroke-gray-600"
          tickLine={{ stroke: '#d1d5db', className: 'dark:stroke-gray-600' }}
          axisLine={{ stroke: '#d1d5db', className: 'dark:stroke-gray-600' }}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
          formatter={(value) => (
            <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="newUsers"
          stroke="#3b82f6"
          strokeWidth={2.5}
          name="New Users"
          dot={{ 
            r: 4, 
            fill: '#3b82f6',
            strokeWidth: 2,
            stroke: '#fff',
            className: 'dark:stroke-gray-800'
          }}
          activeDot={{ r: 6 }}
          animationDuration={300}
        />
        <Line
          type="monotone"
          dataKey="totalUsers"
          stroke="#10b981"
          strokeWidth={2.5}
          name="Total Users"
          dot={{ 
            r: 4, 
            fill: '#10b981',
            strokeWidth: 2,
            stroke: '#fff',
            className: 'dark:stroke-gray-800'
          }}
          activeDot={{ r: 6 }}
          animationDuration={300}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
