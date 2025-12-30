/**
 * User Preferences Model
 * 
 * Why separate model:
 * - Extensible for future preferences
 * - Can be extended without modifying User model
 * - Supports per-user customization
 * - Lightweight schema for now
 */

import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    // Future preferences can be added here:
    // language: String,
    // notifications: Object,
    // etc.
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
userPreferencesSchema.index({ userId: 1 });

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

export default UserPreferences;

