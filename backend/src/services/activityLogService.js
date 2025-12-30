/**
 * Activity Log Service
 * 
 * Why separate service:
 * - Centralized logging logic
 * - Reusable across controllers
 * - Easy to extend with new event types
 * - Can be optimized for performance
 */

import ActivityLog from '../models/ActivityLog.js';

/**
 * Create an activity log entry
 * @param {Object} logData - Log entry data
 * @param {string} logData.userId - User who performed the action
 * @param {string} logData.action - Action type (login, logout, user.created, etc.)
 * @param {string} logData.entityType - Type of entity affected (user, auth, etc.)
 * @param {string} logData.entityId - ID of entity affected (optional)
 * @param {Object} logData.details - Additional context (optional)
 * @param {string} logData.ipAddress - IP address (optional)
 * @param {string} logData.userAgent - User agent (optional)
 * @returns {Object} - Created activity log entry
 */
export const createActivityLog = async (logData) => {
  const activityLog = await ActivityLog.create(logData);
  return activityLog;
};

/**
 * Get activity logs with pagination and filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 20)
 * @param {string} options.userId - Filter by user ID (optional)
 * @param {string} options.action - Filter by action type (optional)
 * @param {Date} options.startDate - Filter by start date (optional)
 * @param {Date} options.endDate - Filter by end date (optional)
 * @returns {Object} - Paginated activity logs
 */
export const getActivityLogs = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    userId,
    action,
    startDate,
    endDate,
  } = options;

  // Build query
  const query = {};

  if (userId) {
    query.userId = userId;
  }

  if (action) {
    query.action = action;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Execute query with pagination
  const [data, total] = await Promise.all([
    ActivityLog.find(query)
      .populate('userId', 'name email role')
      .populate('entityId', 'name email')
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ActivityLog.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get activity log by ID
 * @param {string} id - Activity log ID
 * @returns {Object} - Activity log entry
 */
export const getActivityLogById = async (id) => {
  const activityLog = await ActivityLog.findById(id)
    .populate('userId', 'name email role')
    .populate('entityId', 'name email')
    .lean();

  return activityLog;
};

