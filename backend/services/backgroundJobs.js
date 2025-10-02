const cron = require('node-cron');
const tempStorage = require('../temp-storage');
const cacheService = require('./cacheService');

class BackgroundJobService {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️  Background jobs already running');
      return;
    }

    console.log('🔄 Starting background job service...');
    this.isRunning = true;

    // Clean expired cache entries every 5 minutes
    this.scheduleJob('cache-cleanup', '*/5 * * * *', this.cleanupCache.bind(this));

    // Update API key usage statistics every hour
    this.scheduleJob('usage-stats', '0 * * * *', this.updateUsageStats.bind(this));

    // Check for expired API keys every day at 2 AM
    this.scheduleJob('expire-keys', '0 2 * * *', this.checkExpiredKeys.bind(this));

    // Generate daily reports every day at 3 AM
    this.scheduleJob('daily-reports', '0 3 * * *', this.generateDailyReports.bind(this));

    // Cleanup old usage data every week
    this.scheduleJob('cleanup-usage', '0 4 * * 0', this.cleanupOldUsage.bind(this));

    console.log('✅ Background jobs started successfully');
  }

  stop() {
    console.log('🛑 Stopping background jobs...');
    
    for (const [name, task] of this.jobs) {
      task.stop();
      console.log(`  ✓ Stopped job: ${name}`);
    }
    
    this.jobs.clear();
    this.isRunning = false;
    console.log('✅ All background jobs stopped');
  }

  scheduleJob(name, schedule, callback) {
    try {
      const task = cron.schedule(schedule, callback, {
        scheduled: true,
        timezone: process.env.TZ || 'UTC'
      });
      
      this.jobs.set(name, task);
      console.log(`  ✓ Scheduled job: ${name} (${schedule})`);
    } catch (error) {
      console.error(`❌ Failed to schedule job ${name}:`, error.message);
    }
  }

  async cleanupCache() {
    try {
      console.log('🧹 Running cache cleanup...');
      
      // Get cache stats before cleanup
      const statsBefore = cacheService.getStats();
      
      // Clear expired entries (this is handled automatically by Redis/NodeCache)
      // But we can force cleanup of specific patterns
      
      console.log(`✅ Cache cleanup completed. Memory keys: ${statsBefore.memory.keys}`);
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error.message);
    }
  }

  async updateUsageStats() {
    try {
      console.log('📊 Updating usage statistics...');
      
      // Update usage counts for all API keys
      const allKeys = [];
      for (const user of tempStorage.users.values()) {
        const userKeys = tempStorage.findApiKeysByUserId(user._id);
        allKeys.push(...userKeys);
      }

      let updatedCount = 0;
      for (const key of allKeys) {
        const usage = tempStorage.findUsageByApiKey(key._id, 1000);
        const usageCount = usage.length;
        
        if (key.usageCount !== usageCount) {
          tempStorage.updateApiKey(key._id, { 
            usageCount,
            lastUsed: usage.length > 0 ? usage[0].timestamp : key.lastUsed
          });
          updatedCount++;
        }
      }

      console.log(`✅ Updated usage stats for ${updatedCount} API keys`);
    } catch (error) {
      console.error('❌ Usage stats update failed:', error.message);
    }
  }

  async checkExpiredKeys() {
    try {
      console.log('⏰ Checking for expired API keys...');
      
      const now = new Date();
      let expiredCount = 0;

      for (const user of tempStorage.users.values()) {
        const userKeys = tempStorage.findApiKeysByUserId(user._id);
        
        for (const key of userKeys) {
          // Check if key should be rotated based on rotation interval
          const daysSinceUpdate = Math.floor((now - new Date(key.updatedAt)) / (1000 * 60 * 60 * 24));
          
          if (key.status === 'active' && daysSinceUpdate >= key.rotationInterval) {
            tempStorage.updateApiKey(key._id, { 
              status: 'expired',
              isActive: false
            });
            expiredCount++;
          }
        }
      }

      if (expiredCount > 0) {
        // Clear relevant caches
        await cacheService.clear();
      }

      console.log(`✅ Expired ${expiredCount} API keys based on rotation interval`);
    } catch (error) {
      console.error('❌ Expired keys check failed:', error.message);
    }
  }

  async generateDailyReports() {
    try {
      console.log('📈 Generating daily reports...');
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Calculate daily statistics
      const stats = {
        date: yesterday.toISOString().split('T')[0],
        totalUsers: tempStorage.users.size,
        totalApiKeys: 0,
        activeApiKeys: 0,
        newApiKeys: 0,
        totalUsage: 0,
        newUsage: 0
      };

      // Count API keys
      for (const user of tempStorage.users.values()) {
        const userKeys = tempStorage.findApiKeysByUserId(user._id);
        stats.totalApiKeys += userKeys.length;
        stats.activeApiKeys += userKeys.filter(k => k.status === 'active').length;
        stats.newApiKeys += userKeys.filter(k => 
          new Date(k.createdAt) >= yesterday && new Date(k.createdAt) < today
        ).length;
      }

      // Count usage
      const allUsage = tempStorage.usage || [];
      stats.totalUsage = allUsage.length;
      stats.newUsage = allUsage.filter(u => 
        new Date(u.timestamp) >= yesterday && new Date(u.timestamp) < today
      ).length;

      // Store report in cache for retrieval
      await cacheService.set(`daily-report:${stats.date}`, stats, 86400 * 7); // Keep for 7 days

      console.log(`✅ Daily report generated:`, stats);
    } catch (error) {
      console.error('❌ Daily report generation failed:', error.message);
    }
  }

  async cleanupOldUsage() {
    try {
      console.log('🗑️  Cleaning up old usage data...');
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 90); // Keep 90 days of data
      
      const usage = tempStorage.usage || [];
      const initialCount = usage.length;
      
      // Filter out old usage records
      tempStorage.usage = usage.filter(u => new Date(u.timestamp) > cutoffDate);
      
      const removedCount = initialCount - tempStorage.usage.length;
      
      console.log(`✅ Cleaned up ${removedCount} old usage records (kept ${tempStorage.usage.length})`);
    } catch (error) {
      console.error('❌ Usage cleanup failed:', error.message);
    }
  }

  getJobStatus() {
    const status = {};
    for (const [name, task] of this.jobs) {
      status[name] = {
        running: task.running || false,
        scheduled: true
      };
    }
    return {
      isRunning: this.isRunning,
      jobCount: this.jobs.size,
      jobs: status
    };
  }
}

module.exports = new BackgroundJobService();