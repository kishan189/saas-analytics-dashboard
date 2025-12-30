/**
 * User Routes
 * 
 * Why separate route files:
 * - Better organization
 * - Easier to maintain
 * - Can be mounted as middleware
 * - Clear API structure
 */

import express from 'express';
import {
  getAllUsers,
  getUser,
  create,
  update,
  remove,
  toggleStatus,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/toggle-status', toggleStatus);

export default router;

