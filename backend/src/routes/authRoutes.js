/**
 * Auth Routes
 * 
 * Why separate route files:
 * - Better organization
 * - Easier to maintain
 * - Can be mounted as middleware
 * - Clear API structure
 */

import express from 'express';
import { login, register, refresh, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);

export default router;

