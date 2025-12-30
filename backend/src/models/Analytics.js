/**
 * Analytics Model
 * 
 * Why separate model:
 * - Analytics data has different structure than users
 * - Can be optimized for time-series queries
 * - Supports aggregation operations
 * - Clear separation of concerns
 */

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true, // For faster queries
    },
    date: {
      type: Date,
      required: true,
      index: true, // For date range queries
    },
    revenue: {
      type: Number,
      required: true,
      default: 0,
    },
    activeUsers: {
      type: Number,
      required: true,
      default: 0,
    },
    newUsers: {
      type: Number,
      required: true,
      default: 0,
    },
    churnRate: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient date range queries
analyticsSchema.index({ organizationId: 1, date: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;

