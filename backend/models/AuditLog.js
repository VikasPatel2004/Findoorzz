const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    required: true,
    enum: [
      'CREATE_LISTING',
      'UPDATE_LISTING', 
      'DELETE_LISTING',
      'APPROVE_LISTING',
      'REJECT_LISTING',
      'ACTIVATE_LISTING',
      'DEACTIVATE_LISTING',
      'UPDATE_USER',
      'BAN_USER',
      'UNBAN_USER',
      'CHANGE_USER_ROLE',
      'VIEW_ADMIN_DASHBOARD',
      'BULK_DELETE',
      'BULK_UPDATE'
    ]
  },
  targetType: {
    type: String,
    enum: ['FlatListing', 'PGListing', 'User', 'System'],
    required: true
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false // Some actions might not have a specific target
  },
  targetName: { type: String }, // Human readable name/identifier
  description: { type: String, required: true },
  beforeSnapshot: { type: mongoose.Schema.Types.Mixed }, // State before change
  afterSnapshot: { type: mongoose.Schema.Types.Mixed }, // State after change
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed } // Additional context data
}, { timestamps: true });

// Indexes for better performance
auditLogSchema.index({ admin: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ createdAt: -1 });

// Static method to log an action
auditLogSchema.statics.logAction = async function(data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent disrupting main operation
    return null;
  }
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
