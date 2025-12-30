/**
 * Activity Log Controller
 * 
 * Why controller layer:
 * - Handles HTTP request/response
 * - Validates input
 * - Calls service layer
 * - Returns appropriate HTTP responses
 * - Admin-only access control
 */

import { getActivityLogs, getActivityLogById } from '../services/activityLogService.js';

/**
 * Get all activity logs (with pagination and filters)
 * GET /api/activity-logs
 * Admin only
 */
export const getAllActivityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      userId,
      action,
      startDate,
      endDate,
    } = req.query;

    const result = await getActivityLogs({
      page,
      limit,
      userId,
      action,
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Activity logs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch activity logs',
    });
  }
};

/**
 * Get activity log by ID
 * GET /api/activity-logs/:id
 * Admin only
 */
export const getActivityLog = async (req, res) => {
  try {
    const { id } = req.params;
    const activityLog = await getActivityLogById(id);

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        message: 'Activity log not found',
      });
    }

    res.status(200).json({
      success: true,
      data: activityLog,
    });
  } catch (error) {
    console.error('Activity log error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch activity log',
    });
  }
};

