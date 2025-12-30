/**
 * Activity Log Routes
 * 
 * Why separate route files:
 * - Better organization
 * - Easier to maintain
 * - Can be mounted as middleware
 * - Clear API structure
 */

import express from 'express';
import {
  getAllActivityLogs,
  getActivityLog,
} from '../controllers/activityLogController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', getAllActivityLogs);
router.get('/:id', getActivityLog);

export default router;

