/**
 * User Controller
 * 
 * Why controller layer:
 * - Handles HTTP request/response
 * - Validates input
 * - Calls service layer
 * - Returns appropriate HTTP responses
 * - Error handling at the HTTP level
 */

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
} from '../services/userService.js';
import { logActivity } from '../utils/activityLogger.js';

/**
 * Get all users (with pagination, search, filters)
 * GET /api/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const result = await getUsers({
      page,
      limit,
      search,
      role,
      isActive,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users',
    });
  }
};

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found',
    });
  }
};

/**
 * Create new user
 * POST /api/users
 */
export const create = async (req, res) => {
  try {
    const { email, password, name, role, isActive } = req.body;

    // Validation
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

    if (role && !['admin', 'manager', 'viewer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, manager, or viewer',
      });
    }

    const user = await createUser({
      email,
      password,
      name,
      role,
      isActive,
    });

    // Log user creation activity (non-blocking)
    logActivity({
      userId: req.user.userId,
      action: 'user.created',
      entityType: 'user',
      entityId: user._id.toString(),
      details: {
        createdUserEmail: user.email,
        createdUserRole: user.role,
      },
      req,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create user',
    });
  }
};

/**
 * Update user
 * PUT /api/users/:id
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validation
    if (updateData.role && !['admin', 'manager', 'viewer'].includes(updateData.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be admin, manager, or viewer',
      });
    }

    if (updateData.password && updateData.password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const user = await updateUser(id, updateData);

    // Log user update activity (non-blocking)
    logActivity({
      userId: req.user.userId,
      action: 'user.updated',
      entityType: 'user',
      entityId: user._id.toString(),
      details: {
        updatedFields: Object.keys(updateData),
      },
      req,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    const statusCode = error.message === 'User not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update user',
    });
  }
};

/**
 * Delete user
 * DELETE /api/users/:id
 * Prevents users from deleting themselves
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.userId; // From protect middleware

    await deleteUser(id, currentUserId);

    // Log user deletion activity (non-blocking)
    logActivity({
      userId: currentUserId,
      action: 'user.deleted',
      entityType: 'user',
      entityId: id,
      req,
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    // Check if it's a self-deletion error
    const statusCode = error.message === 'You cannot delete your own account' ? 403 : 
                      error.message === 'User not found' ? 404 : 400;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to delete user',
    });
  }
};

/**
 * Toggle user active status
 * PATCH /api/users/:id/toggle-status
 */
export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await toggleUserStatus(id);

    // Log user status toggle activity (non-blocking)
    logActivity({
      userId: req.user.userId,
      action: 'user.status_toggled',
      entityType: 'user',
      entityId: user._id.toString(),
      details: {
        newStatus: user.isActive,
      },
      req,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found',
    });
  }
};

