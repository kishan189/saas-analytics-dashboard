/**
 * Auth Controller
 * 
 * Why controller layer:
 * - Handles HTTP request/response
 * - Validates input
 * - Calls service layer
 * - Returns appropriate HTTP responses
 * - Error handling at the HTTP level
 */

import { loginUser, registerUser, refreshAccessToken, getUserById } from '../services/authService.js';
import { logActivity } from '../utils/activityLogger.js';

/**
 * Login controller
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    // Debug logging (remove in production)
    console.log('Login request received:', {
      body: req.body,
      headers: req.headers['content-type'],
      method: req.method,
    });

    // Safety check for req.body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing or invalid. Please ensure Content-Type is application/json',
      });
    }

    const { email, password } = req.body || {};

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Call service
    const result = await loginUser(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Log login activity (non-blocking)
    logActivity({
      userId: result.user._id.toString(),
      action: 'login',
      entityType: 'auth',
      req,
    });

    // Return access token in response body (stored in memory on frontend)
    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

/**
 * Register controller
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    // Safety check for req.body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing or invalid. Please ensure Content-Type is application/json',
      });
    }

    const { email, password, name, role } = req.body;

    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Validate role if provided
    if (role && !['admin', 'manager', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, manager, or viewer',
      });
    }

    // Call service
    const result = await registerUser(email, password, name, role);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Log registration/login activity (non-blocking)
    logActivity({
      userId: result.user._id.toString(),
      action: 'login', // Registration also logs them in
      entityType: 'auth',
      req,
    });

    // Return access token in response body (stored in memory on frontend)
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
    });
  }
};

/**
 * Refresh token controller
 * POST /api/auth/refresh
 */
export const refresh = async (req, res) => {
  try {
    // Get refresh token from cookie or body (fallback)
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Call service
    const tokens = await refreshAccessToken(refreshToken);

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return new access token
    res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Token refresh failed',
    });
  }
};

/**
 * Logout controller
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  // Log logout activity if user is authenticated (non-blocking)
  if (req.user?.userId) {
    logActivity({
      userId: req.user.userId,
      action: 'logout',
      entityType: 'auth',
      req,
    });
  }

  // Clear refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * Get current user controller
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found',
    });
  }
};

