/**
 * Analytics Service
 * 
 * Why separate service:
 * - More detailed analytics than dashboard
 * - Supports complex date range queries
 * - Time-series data aggregation
 * - Reusable across different endpoints
 */

import User from '../models/User.js';

/**
 * Get analytics data for charts
 * Aggregates user data by day/week/month based on date range
 * @param {Object} options - Query options
 * @param {string} options.startDate - Start date (ISO string)
 * @param {string} options.endDate - End date (ISO string)
 * @param {string} options.groupBy - Group by 'day', 'week', or 'month'
 * @returns {Array} - Analytics data points for charts
 */
export const getAnalyticsData = async (options = {}) => {
  const { startDate, endDate, groupBy = 'day' } = options;

  const now = new Date();
  const defaultStartDate = new Date(now);
  defaultStartDate.setDate(defaultStartDate.getDate() - 30); // Default to last 30 days

  const queryStartDate = startDate ? new Date(startDate) : defaultStartDate;
  const queryEndDate = endDate ? new Date(endDate) : now;

  // Determine date format based on groupBy
  let dateFormat = '%Y-%m-%d'; // Default: daily
  if (groupBy === 'week') {
    dateFormat = '%Y-W%V'; // Week format: 2024-W01
  } else if (groupBy === 'month') {
    dateFormat = '%Y-%m'; // Month format: 2024-01
  }

  // Aggregate new users by date
  const newUsersData = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: queryStartDate,
          $lte: queryEndDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: '$createdAt' },
        },
        newUsers: { $sum: 1 },
        date: { $first: '$createdAt' },
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  // Aggregate active users by lastLogin date
  const activeUsersData = await User.aggregate([
    {
      $match: {
        isActive: true,
        lastLogin: {
          $gte: queryStartDate,
          $lte: queryEndDate,
          $ne: null,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: '$lastLogin' },
        },
        activeUsers: { $sum: 1 },
        date: { $first: '$lastLogin' },
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  // Calculate total users (cumulative) efficiently
  // Get all unique dates from the period
  const allDates = new Set();
  newUsersData.forEach((item) => allDates.add(item._id));
  activeUsersData.forEach((item) => allDates.add(item._id));
  
  // Get all users created up to the end date, sorted by creation date
  const allUsers = await User.find({
    createdAt: { $lte: queryEndDate },
  })
    .select('createdAt')
    .sort({ createdAt: 1 })
    .lean();
  
  // Build a map of date keys to actual dates for comparison
  const dateKeyToDate = new Map();
  newUsersData.forEach((item) => {
    if (item.date) dateKeyToDate.set(item._id, item.date);
  });
  activeUsersData.forEach((item) => {
    if (item.date && !dateKeyToDate.has(item._id)) {
      dateKeyToDate.set(item._id, item.date);
    }
  });
  
  // Calculate cumulative totals for each date key
  const totalUsersMap = new Map();
  const sortedDates = Array.from(allDates).sort();
  
  for (const dateKey of sortedDates) {
    const dateObj = dateKeyToDate.get(dateKey);
    if (!dateObj) continue;
    
    // Count users created on or before this date
    let count = 0;
    for (const user of allUsers) {
      if (user.createdAt <= dateObj) {
        count++;
      } else {
        break; // Since sorted, we can break early
      }
    }
    totalUsersMap.set(dateKey, count);
  }

  // Combine all data points
  const dateSet = new Set();
  newUsersData.forEach((item) => dateSet.add(item._id));
  activeUsersData.forEach((item) => dateSet.add(item._id));
  // totalUsersMap keys are already included via allDates above

  // Create combined data array
  const combinedData = Array.from(dateSet)
    .sort()
    .map((dateKey) => {
      const newUsersItem = newUsersData.find((item) => item._id === dateKey);
      const activeUsersItem = activeUsersData.find((item) => item._id === dateKey);
      const totalUsers = totalUsersMap.get(dateKey) || 0;

      // Get the actual date from either source
      const date = newUsersItem?.date || activeUsersItem?.date || new Date();

      return {
        date: dateKey,
        dateValue: date,
        newUsers: newUsersItem?.newUsers || 0,
        activeUsers: activeUsersItem?.activeUsers || 0,
        totalUsers: totalUsers,
      };
    });

  return combinedData;
};

/**
 * Get analytics summary statistics
 * @param {Object} options - Query options
 * @param {string} options.startDate - Start date (ISO string)
 * @param {string} options.endDate - End date (ISO string)
 * @returns {Object} - Summary statistics
 */
export const getAnalyticsSummary = async (options = {}) => {
  const { startDate, endDate } = options;

  const now = new Date();
  const defaultStartDate = new Date(now);
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);

  const queryStartDate = startDate ? new Date(startDate) : defaultStartDate;
  const queryEndDate = endDate ? new Date(endDate) : now;

  // Calculate summary stats in parallel
  const [
    totalNewUsers,
    totalActiveUsers,
    averageNewUsersPerDay,
    averageActiveUsersPerDay,
    peakNewUsersDay,
    peakActiveUsersDay,
  ] = await Promise.all([
    // Total new users in period
    User.countDocuments({
      createdAt: {
        $gte: queryStartDate,
        $lte: queryEndDate,
      },
    }),

    // Total active users in period
    User.countDocuments({
      isActive: true,
      lastLogin: {
        $gte: queryStartDate,
        $lte: queryEndDate,
        $ne: null,
      },
    }),

    // Average new users per day
    User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: queryStartDate,
            $lte: queryEndDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$count' },
        },
      },
    ]),

    // Average active users per day
    User.aggregate([
      {
        $match: {
          isActive: true,
          lastLogin: {
            $gte: queryStartDate,
            $lte: queryEndDate,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: '$count' },
        },
      },
    ]),

    // Peak new users day
    User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: queryStartDate,
            $lte: queryEndDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          date: { $first: '$createdAt' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]),

    // Peak active users day
    User.aggregate([
      {
        $match: {
          isActive: true,
          lastLogin: {
            $gte: queryStartDate,
            $lte: queryEndDate,
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$lastLogin' },
          },
          count: { $sum: 1 },
          date: { $first: '$lastLogin' },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 1,
      },
    ]),
  ]);

  const daysDiff = Math.ceil(
    (queryEndDate - queryStartDate) / (1000 * 60 * 60 * 24)
  );

  return {
    totalNewUsers,
    totalActiveUsers,
    averageNewUsersPerDay:
      averageNewUsersPerDay[0]?.avg || 0,
    averageActiveUsersPerDay:
      averageActiveUsersPerDay[0]?.avg || 0,
    peakNewUsersDay: peakNewUsersDay[0]
      ? {
          date: peakNewUsersDay[0]._id,
          count: peakNewUsersDay[0].count,
        }
      : null,
    peakActiveUsersDay: peakActiveUsersDay[0]
      ? {
          date: peakActiveUsersDay[0]._id,
          count: peakActiveUsersDay[0].count,
        }
      : null,
    period: {
      startDate: queryStartDate.toISOString(),
      endDate: queryEndDate.toISOString(),
      days: daysDiff,
    },
  };
};

