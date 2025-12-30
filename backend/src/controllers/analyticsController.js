/**
 * Analytics Controller
 * 
 * Why controller layer:
 * - Handles HTTP request/response
 * - Validates input
 * - Calls service layer
 * - Returns appropriate HTTP responses
 */

import { getAnalyticsData, getAnalyticsSummary } from '../services/analyticsService.js';

/**
 * Get analytics data for charts
 * GET /api/analytics/data
 */
export const getAnalyticsDataController = async (req, res) => {
  try {
    const { startDate, endDate, groupBy } = req.query;

    // Validate groupBy if provided
    if (groupBy && !['day', 'week', 'month'].includes(groupBy)) {
      return res.status(400).json({
        success: false,
        message: 'groupBy must be one of: day, week, month',
      });
    }

    const analyticsData = await getAnalyticsData({
      startDate,
      endDate,
      groupBy: groupBy || 'day',
    });

    res.status(200).json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error('Analytics data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics data',
    });
  }
};

/**
 * Get analytics summary statistics
 * GET /api/analytics/summary
 */
export const getAnalyticsSummaryController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const summary = await getAnalyticsSummary({
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch analytics summary',
    });
  }
};

