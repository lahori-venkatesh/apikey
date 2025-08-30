const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    minlength: [2, 'Service name must be at least 2 characters long'],
    maxlength: [50, 'Service name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  encryptedApiKey: {
    type: String,
    required: [true, 'API key is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.encryptedApiKey; // Never expose encrypted key in JSON
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
apiKeySchema.index({ userId: 1 });
apiKeySchema.index({ userId: 1, serviceName: 1 });
apiKeySchema.index({ userId: 1, status: 1 });
apiKeySchema.index({ expiresAt: 1 });

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