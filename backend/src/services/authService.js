/**
 * Auth Service
 * 
 * Why service layer:
 * - Separation of concerns (business logic separate from controllers)
 * - Reusable across different controllers
 * - Easier to test
 * - Single responsibility principle
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

/**
 * Generate JWT tokens
 * @param {string} userId - User ID
 * @returns {Object} - Access and refresh tokens
 */
export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} - Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} - Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} - User data and tokens
 */
export const loginUser = async (email, password) => {
  // Find user and include password (normally excluded)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is active
  if (user.isActive === false) {
    throw new Error('Account is deactivated. Please contact administrator.');
  }

  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Update lastLogin timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false }); // Skip validation to avoid re-hashing password

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Return user data (without password) and tokens
  const userData = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: userData,
    accessToken,
    refreshToken,
  };
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Object} - New access token and optionally new refresh token
 */
export const refreshAccessToken = async (refreshToken) => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if user still exists
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Generate new tokens
  const tokens = generateTokens(user._id.toString());

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken, // Rotate refresh token for security
  };
};

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @param {string} role - User role (admin, manager, viewer)
 * @returns {Object} - User data and tokens
 */
export const registerUser = async (email, password, name, role = 'viewer') => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Validate role
  const validRoles = ['admin', 'manager', 'viewer'];
  if (role && !validRoles.includes(role)) {
    throw new Error('Invalid role. Must be admin, manager, or viewer');
  }

  // Create user (password will be hashed by pre-save hook)
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    name,
    role: role || 'viewer', // Use provided role or default to viewer
    isActive: true,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Return user data (without password) and tokens
  const userData = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: userData,
    accessToken,
    refreshToken,
  };
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object} - User data
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

