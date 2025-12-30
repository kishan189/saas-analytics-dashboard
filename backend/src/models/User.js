/**
 * User Model
 * 
 * Why Mongoose Schema:
 * - Data validation at the database level
 * - Built-in methods (comparePassword, etc.)
 * - Type safety and consistency
 * - Automatic timestamps
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'viewer'],
      default: 'viewer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for performance
userSchema.index({ createdAt: -1 }); // For new users queries
userSchema.index({ lastLogin: -1 }); // For active users queries
userSchema.index({ isActive: 1 }); // For filtering active users
userSchema.index({ email: 1 }); // Already unique, but explicit index

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password is modified (not on every save)
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

