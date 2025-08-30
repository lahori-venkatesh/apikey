const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  keyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    required: [true, 'Key ID is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true,
    default: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  callsMade: {
    type: Number,
    default: 0,
    min: [0, 'Calls made cannot be negative']
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

// Compound indexes for better query performance
usageSchema.index({ keyId: 1, date: 1 }, { unique: true });
usageSchema.index({ userId: 1, date: 1 });
usageSchema.index({ date: 1 });

// Static method to find or create usage record for today
usageSchema.statics.findOrCreateToday = async function(keyId, userId) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  let usage = await this.findOne({ keyId, date: startOfDay });
  
  if (!usage) {
    usage = new this({
      keyId,
      userId,
      date: startOfDay,
      callsMade: 0
    });
    await usage.save();
  }
  
  return usage;
};

// Static method to get usage in date range
usageSchema.statics.getUsageInRange = function(keyId, startDate, endDate) {
  return this.find({
    keyId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to get user's total usage in date range
usageSchema.statics.getUserUsageInRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to increment usage
usageSchema.statics.incrementUsage = async function(keyId, userId, count = 1) {
  const usage = await this.findOrCreateToday(keyId, userId);
  usage.callsMade += count;
  return usage.save();
};

// Static method to get daily usage stats
usageSchema.statics.getDailyStats = function(userId, days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$date',
        totalCalls: { $sum: '$callsMade' },
        keyCount: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

module.exports = mongoose.model('Usage', usageSchema);