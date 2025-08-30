const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
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
  planType: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: [true, 'Plan type is required']
  },
  monthlyLimit: {
    type: Number,
    required: [true, 'Monthly limit is required'],
    min: [1, 'Monthly limit must be positive']
  },
  currentUsage: {
    type: Number,
    default: 0,
    min: [0, 'Current usage cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ userId: 1, serviceName: 1 }, { unique: true });
subscriptionSchema.index({ expiryDate: 1 });
subscriptionSchema.index({ planType: 1 });

// Virtual to calculate usage percentage
subscriptionSchema.virtual('usagePercentage').get(function() {
  if (!this.monthlyLimit || this.monthlyLimit === 0) return 0;
  return Math.round((this.currentUsage / this.monthlyLimit) * 100 * 100) / 100; // Round to 2 decimal places
});

// Virtual to check if near limit (80% or more)
subscriptionSchema.virtual('isNearLimit').get(function() {
  return this.usagePercentage >= 80;
});

// Virtual to check if expired
subscriptionSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Virtual to check if expiring soon (within 7 days)
subscriptionSchema.virtual('isExpiringSoon').get(function() {
  if (!this.expiryDate) return false;
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  return this.expiryDate <= sevenDaysFromNow && this.expiryDate > new Date();
});

// Include virtuals in JSON output
subscriptionSchema.set('toJSON', { virtuals: true });

// Static method to find user's subscriptions
subscriptionSchema.statics.findByUserId = function(userId) {
  return this.find({ userId });
};

// Static method to find subscription by service
subscriptionSchema.statics.findByUserAndService = function(userId, serviceName) {
  return this.findOne({ userId, serviceName });
};

// Static method to find expired subscriptions
subscriptionSchema.statics.findExpired = function(userId) {
  return this.find({ 
    userId, 
    expiryDate: { $lt: new Date() } 
  });
};

// Static method to find expiring soon subscriptions
subscriptionSchema.statics.findExpiringSoon = function(userId, days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    userId,
    expiryDate: {
      $gte: new Date(),
      $lte: futureDate
    }
  });
};

// Static method to find subscriptions near limit
subscriptionSchema.statics.findNearLimit = function(userId, threshold = 80) {
  return this.find({ userId }).then(subscriptions => {
    return subscriptions.filter(sub => sub.usagePercentage >= threshold);
  });
};

// Instance method to increment usage
subscriptionSchema.methods.incrementUsage = function(count = 1) {
  this.currentUsage += count;
  return this.save();
};

// Instance method to reset monthly usage
subscriptionSchema.methods.resetUsage = function() {
  this.currentUsage = 0;
  return this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);