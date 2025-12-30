/**
 * Analytics Routes
 * 
 * Why separate route files:
 * - Better organization
 * - Easier to maintain
 * - Can be mounted as middleware
 * - Clear API structure
 */

import express from 'express';
import {
  getAnalyticsDataController,
  getAnalyticsSummaryController,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/data', getAnalyticsDataController);
router.get('/summary', getAnalyticsSummaryController);

export default router;

