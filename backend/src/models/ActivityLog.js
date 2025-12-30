/**
 * Activity Log Model
 * 
 * Why this model:
 * - Audit trail for security and compliance
 * - Track user actions (login, logout, CRUD operations)
 * - Admin visibility into system activity
 * - Timestamped records for debugging
 */

import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // For user-specific queries
    },
    action: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'user.created',
        'user.updated',
        'user.deleted',
        'user.status_toggled',
      ],
      index: true, // For filtering by action type
    },
    entityType: {
      type: String,
      enum: ['user', 'auth', null],
      default: null,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true, // For entity-specific queries
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // Store additional context (e.g., changed fields, IP address)
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Compound indexes for efficient queries
activityLogSchema.index({ createdAt: -1 }); // Most recent first
activityLogSchema.index({ userId: 1, createdAt: -1 }); // User activity timeline
activityLogSchema.index({ action: 1, createdAt: -1 }); // Action type queries

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;

