/**
 * User Service
 * 
 * Why service layer:
 * - Business logic separation from HTTP layer
 * - Reusable across different controllers
 * - Easier to test
 * - Single responsibility principle
 */

import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Get all users with pagination, search, and filtering
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.limit - Items per page (default: 10)
 * @param {string} options.search - Search term (searches name and email)
 * @param {string} options.role - Filter by role
 * @param {boolean} options.isActive - Filter by active status
 * @param {string} options.sortBy - Field to sort by (default: createdAt)
 * @param {string} options.sortOrder - Sort order: 'asc' or 'desc' (default: desc)
 * @returns {Object} - Paginated users and metadata
 */
export const getUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    role,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  // Build query
  const query = {};

  // Search filter (name or email)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Role filter
  if (role) {
    query.role = role;
  }

  // Active status filter
  if (isActive !== undefined) {
    query.isActive = isActive === 'true' || isActive === true;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password') // Exclude password
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  return {
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object} - User data
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.name - User name
 * @param {string} userData.role - User role
 * @param {boolean} userData.isActive - Active status
 * @returns {Object} - Created user
 */
export const createUser = async (userData) => {
  const { email, password, name, role = 'viewer', isActive = true } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name,
    role,
    isActive,
  });

  // Return user without password
  return await User.findById(user._id).select('-password');
};

/**
 * Update user
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated user
 */
export const updateUser = async (userId, updateData) => {
  const { email, password, name, role, isActive } = updateData;

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if email is being changed and if it's already taken
  if (email && email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    user.email = email.toLowerCase();
  }

  // Update fields
  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive === 'true' || isActive === true;

  // Update password if provided
  if (password) {
    user.password = password; // Will be hashed by pre-save hook
  }

  await user.save();

  // Return updated user without password
  return await User.findById(userId).select('-password');
};

/**
 * Delete user
 * @param {string} userId - User ID to delete
 * @param {string} currentUserId - Current user ID (to prevent self-deletion)
 * @returns {void}
 */
export const deleteUser = async (userId, currentUserId) => {
  // Prevent self-deletion
  if (userId === currentUserId) {
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(userId);
};

/**
 * Toggle user active status
 * @param {string} userId - User ID
 * @returns {Object} - Updated user
 */
export const toggleUserStatus = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.isActive = !user.isActive;
  await user.save();

  return await User.findById(userId).select('-password');
};

