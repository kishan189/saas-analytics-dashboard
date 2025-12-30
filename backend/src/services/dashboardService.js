/**
 * Dashboard Service
 * 
 * Why service layer:
 * - Complex aggregation logic
 * - Reusable across different endpoints
 * - Easier to test
 * - Can be optimized for performance
 */

import User from '../models/User.js';

/**
 * Get dashboard KPIs from real user data
 * Calculates metrics from users collection using MongoDB aggregation
 * @param {Object} options - Query options (optional, for future date filtering)
 * @returns {Object} - Dashboard KPIs with growth percentages
 */
export const getDashboardKPIs = async (options = {}) => {
  const now = new Date();
  
  // Define time periods
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  
  // Previous period for growth calculation (30-60 days ago)
  const previousPeriodStart = sixtyDaysAgo;
  const previousPeriodEnd = thirtyDaysAgo;

  // Calculate KPIs in parallel for better performance
  const [
    totalUsers,
    activeUsersLast7Days,
    newUsersLast30Days,
    previousPeriodActiveUsers,
    previousPeriodNewUsers,
  ] = await Promise.all([
    // Total active users
    User.countDocuments({ isActive: true }),
    
    // Active users in last 7 days (users who logged in)
    User.countDocuments({
      isActive: true,
      lastLogin: {
        $gte: sevenDaysAgo,
        $lte: now,
      },
    }),
    
    // New users in last 30 days
    User.countDocuments({
      isActive: true,
      createdAt: {
        $gte: thirtyDaysAgo,
        $lte: now,
      },
    }),
    
    // Active users in previous period (30-60 days ago) for growth calculation
    User.countDocuments({
      isActive: true,
      lastLogin: {
        $gte: previousPeriodStart,
        $lte: previousPeriodEnd,
      },
    }),
    
    // New users in previous period (30-60 days ago) for growth calculation
    User.countDocuments({
      isActive: true,
      createdAt: {
        $gte: previousPeriodStart,
        $lte: previousPeriodEnd,
      },
    }),
  ]);

  // Calculate growth percentages
  const activeUsersGrowth =
    previousPeriodActiveUsers > 0
      ? ((activeUsersLast7Days - previousPeriodActiveUsers) / previousPeriodActiveUsers) * 100
      : activeUsersLast7Days > 0
      ? 100 // If no previous data but current data exists, show 100% growth
      : 0;

  const newUsersGrowth =
    previousPeriodNewUsers > 0
      ? ((newUsersLast30Days - previousPeriodNewUsers) / previousPeriodNewUsers) * 100
      : newUsersLast30Days > 0
      ? 100 // If no previous data but current data exists, show 100% growth
      : 0;

  // Total users growth (compare current total with total 30 days ago)
  const totalUsers30DaysAgo = await User.countDocuments({
    isActive: true,
    createdAt: { $lte: thirtyDaysAgo },
  });
  
  const totalUsersGrowth =
    totalUsers30DaysAgo > 0
      ? ((totalUsers - totalUsers30DaysAgo) / totalUsers30DaysAgo) * 100
      : totalUsers > 0
      ? 100
      : 0;

  return {
    totalUsers: {
      value: totalUsers,
      growth: totalUsersGrowth,
    },
    activeUsers: {
      value: activeUsersLast7Days,
      growth: activeUsersGrowth,
    },
    newUsers: {
      value: newUsersLast30Days,
      growth: newUsersGrowth,
    },
    period: {
      startDate: thirtyDaysAgo.toISOString(),
      endDate: now.toISOString(),
    },
  };
};

/**
 * Get recent analytics data for charts
 * Aggregates user data by day for time-series visualization
 * @param {Object} options - Query options
 * @param {string} options.startDate - Start date (ISO string)
 * @param {string} options.endDate - End date (ISO string)
 * @param {number} options.limit - Number of data points
 * @returns {Array} - Recent analytics data points
 */
export const getRecentAnalytics = async (options = {}) => {
  const { startDate, endDate, limit = 30 } = options;

  const now = new Date();
  const defaultStartDate = new Date(now);
  defaultStartDate.setDate(defaultStartDate.getDate() - limit);

  const queryStartDate = startDate ? new Date(startDate) : defaultStartDate;
  const queryEndDate = endDate ? new Date(endDate) : now;

  // Aggregate users by creation date (daily new users)
  const dailyNewUsers = await User.aggregate([
    {
      $match: {
        isActive: true,
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
        newUsers: { $sum: 1 },
        date: { $first: '$createdAt' },
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $limit: limit,
    },
  ]);

  // Aggregate active users by lastLogin date (daily active users)
  const dailyActiveUsers = await User.aggregate([
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
        activeUsers: { $sum: 1 },
        date: { $first: '$lastLogin' },
      },
    },
    {
      $sort: { date: 1 },
    },
    {
      $limit: limit,
    },
  ]);

  // Combine and format data for charts
  // Create a map of dates to combine new users and active users
  const dataMap = new Map();

  dailyNewUsers.forEach((item) => {
    const dateKey = item._id;
    dataMap.set(dateKey, {
      date: dateKey,
      newUsers: item.newUsers,
      activeUsers: 0,
    });
  });

  dailyActiveUsers.forEach((item) => {
    const dateKey = item._id;
    if (dataMap.has(dateKey)) {
      dataMap.get(dateKey).activeUsers = item.activeUsers;
    } else {
      dataMap.set(dateKey, {
        date: dateKey,
        newUsers: 0,
        activeUsers: item.activeUsers,
      });
    }
  });

  // Convert map to array and sort by date
  const data = Array.from(dataMap.values()).sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return data;
};

