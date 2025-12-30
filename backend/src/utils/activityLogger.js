/**
 * Activity Logger Utility
 * 
 * Why this utility:
 * - Centralized logging helper
 * - Extracts request metadata (IP, user agent)
 * - Consistent log format
 * - Non-blocking (doesn't await, logs asynchronously)
 */

import { createActivityLog } from '../services/activityLogService.js';

/**
 * Get client IP address from request
 * @param {Object} req - Express request object
 * @returns {string} - IP address
 */
const getClientIp = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

/**
 * Get user agent from request
 * @param {Object} req - Express request object
 * @returns {string} - User agent
 */
const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

/**
 * Log an activity
 * Non-blocking - doesn't await to avoid slowing down requests
 * @param {Object} options - Log options
 * @param {string} options.userId - User ID
 * @param {string} options.action - Action type
 * @param {string} options.entityType - Entity type (optional)
 * @param {string} options.entityId - Entity ID (optional)
 * @param {Object} options.details - Additional details (optional)
 * @param {Object} options.req - Express request object (optional, for IP/user agent)
 */
export const logActivity = async ({
  userId,
  action,
  entityType = null,
  entityId = null,
  details = {},
  req = null,
}) => {
  // Don't block the request if logging fails
  try {
    await createActivityLog({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress: req ? getClientIp(req) : null,
      userAgent: req ? getUserAgent(req) : null,
    });
  } catch (error) {
    // Log error but don't throw - activity logging shouldn't break the app
    console.error('Failed to create activity log:', error);
  }
};

