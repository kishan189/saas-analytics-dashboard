/**
 * Organization Model
 * 
 * Why organization model:
 * - Multi-tenant support (users belong to organizations)
 * - Analytics data is organization-scoped
 * - Future billing/plan management
 */

import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;

