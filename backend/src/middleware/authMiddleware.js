/**
 * Auth Middleware
 * 
 * Why middleware:
 * - Reusable across multiple routes
 * - Centralized authentication logic
 * - Clean separation of concerns
 * - Can be applied to route groups
 */

import { verifyAccessToken } from '../services/authService.js';

/**
 * Protect routes - requires valid access token
 * Sets req.user with userId from token
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from Authorization header
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user ID to request object
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Not authorized, token failed',
    });
  }
};

/**
 * Role-based authorization middleware
 * Must be used after protect middleware
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return async (req, res, next) => {
    // This assumes getUserById is called and user role is in req.user
    // We'll need to fetch user to check role, or modify protect to include it
    // For now, we'll check in the route handler or enhance this later
    
    // For immediate implementation, we'll need to fetch user
    // This is a simplified version - in production, you might cache user data in token
    try {
      const { getUserById } = await import('../services/authService.js');
      const user = await getUserById(req.user.userId);

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${user.role}' is not authorized to access this route`,
        });
      }

      // Attach full user to request
      req.user.role = user.role;
      req.user.userData = user;

      next();
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Authorization failed',
      });
    }
  };
};

