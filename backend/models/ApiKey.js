const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  keyId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Key name is required'],
    trim: true,
    maxlength: [100, 'Key name cannot exceed 100 characters']
  },
  service: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    lowercase: true,
    maxlength: [50, 'Service name cannot exceed 50 characters'],
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  serviceWebsite: {
    type: String,
    trim: true,
    maxlength: [200, 'Service website URL cannot exceed 200 characters']
  },
  apiDocumentation: {
    type: String,
    trim: true,
    maxlength: [200, 'API documentation URL cannot exceed 200 characters']
  },
  encryptedKey: {
    type: String,
    required: [true, 'Encrypted API key is required']
  },
  environment: {
    type: String,
    enum: ['development', 'staging', 'production'],
    default: 'development',
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active',
    index: true
  },
  monthlyLimit: {
    type: Number,
    min: 0,
    default: null
  },
  monthlyCost: {
    type: Number,
    min: 0,
    default: null
  },
  rotationInterval: {
    type: Number,
    min: 1,
    max: 365,
    default: 90
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  lastUsed: {
    type: Date,
    default: null,
    index: true
  },
  usageCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.encryptedKey; // Never expose encrypted key in JSON
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for efficient queries
apiKeySchema.index({ userId: 1, status: 1 });
apiKeySchema.index({ userId: 1, service: 1 });
apiKeySchema.index({ userId: 1, environment: 1 });
apiKeySchema.index({ userId: 1, createdAt: -1 });
apiKeySchema.index({ userId: 1, lastUsed: -1 });
apiKeySchema.index({ rotationInterval: 1, updatedAt: 1 });
apiKeySchema.index({ tags: 1 });

// Text index for search functionality
apiKeySchema.index({
  name: 'text',
  service: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual to check if key is expired
apiKeySchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Static method to find user's API keys
apiKeySchema.statics.findByUserId = function(userId) {
  return this.find({ userId });
};

// Static method to find user's active API keys
apiKeySchema.statics.findActiveByUserId = function(userId) {
  return this.find({ userId, status: 'active' });
};

// Static method to find expired keys
apiKeySchema.statics.findExpired = function(userId) {
  return this.find({ 
    userId, 
    expiresAt: { $lt: new Date() } 
  });
};

// Instance method to toggle status
apiKeySchema.methods.toggleStatus = function() {
  this.status = this.status === 'active' ? 'inactive' : 'active';
  return this.save();
};

module.exports = mongoose.model('ApiKey', apiKeySchema);