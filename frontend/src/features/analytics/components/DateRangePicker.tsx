/**
 * Date Range Picker Component
 * 
 * Why this component:
 * - Reusable date range selection
 * - Clean UI with preset options
 * - Accessible form controls
 */

import { Button } from '../../../components/ui';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  groupBy: 'day' | 'week' | 'month';
  onGroupByChange: (groupBy: 'day' | 'week' | 'month') => void;
  isLoading?: boolean;
}

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  groupBy,
  onGroupByChange,
  isLoading = false,
}: DateRangePickerProps) => {

  // Preset date ranges
  const presets = [
    {
      label: 'Last 7 days',
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Last 30 days',
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Last 90 days',
      getDates: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 90);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'This month',
      getDates: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth(), 1);
        return {
          start: start.toISOString().split('T')[0],
          end: end.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Last month',
      getDates: () => {
        const end = new Date();
        const start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
        const lastDay = new Date(end.getFullYear(), end.getMonth(), 0);
        return {
          start: start.toISOString().split('T')[0],
          end: lastDay.toISOString().split('T')[0],
        };
      },
    },
  ];

  const handlePreset = (preset: typeof presets[0]) => {
    const dates = preset.getDates();
    onStartDateChange(dates.start);
    onEndDateChange(dates.end);
  };

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() => handlePreset(preset)}
            disabled={isLoading}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Date inputs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className="flex items-end">
          <Button
            onClick={onApply}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? 'Loading...' : 'Apply'}
          </Button>
        </div>
      </div>

      {/* Group by selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Group By
        </label>
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map((option) => (
            <Button
              key={option}
              variant={groupBy === option ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onGroupByChange(option)}
              disabled={isLoading}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;

