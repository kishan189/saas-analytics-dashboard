/**
 * Dashboard Controller
 * 
 * Why controller layer:
 * - Handles HTTP request/response
 * - Validates input
 * - Calls service layer
 * - Returns appropriate HTTP responses
 */

import { getDashboardKPIs, getRecentAnalytics } from '../services/dashboardService.js';

/**
 * Get dashboard KPIs
 * GET /api/dashboard/kpis
 */
export const getKPIs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const kpis = await getDashboardKPIs({
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    console.error('Dashboard KPIs error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard KPIs',
    });
  }
};

/**
 * Get recent analytics data
 * GET /api/dashboard/analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;

    const analytics = await getRecentAnalytics({
      startDate,
      endDate,
      limit: limit ? parseInt(limit) : undefined,
    });

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics data',
    });
  }
};

