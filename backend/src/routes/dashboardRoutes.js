/**
 * Dashboard Routes
 * 
 * Why separate route files:
 * - Better organization
 * - Easier to maintain
 * - Can be mounted as middleware
 */

import express from 'express';
import { getKPIs, getAnalytics } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes
router.get('/kpis', getKPIs);
router.get('/analytics', getAnalytics);

export default router;

