const websocketService = require('./websocketService');
const notificationService = require('./notificationService');
const tempStorage = require('../temp-storage');

class RealtimeUsageService {
  constructor() {
    this.usageBuffer = new Map(); // userId -> usage events
    this.statsCache = new Map(); // userId -> cached stats
    this.alertThresholds = {
      usage: [50, 75, 90, 95], // Percentage thresholds for alerts
      responseTime: 5000, // Alert if response time > 5s
      errorRate: 10 // Alert if error rate > 10%
    };
  }

  // Track API usage in real-time
  async trackUsage(userId, usageData) {
    try {
      const usage = {
        id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        apiKeyId: usageData.apiKeyId,
        service: usageData.service,
        endpoint: usageData.endpoint,
        method: usageData.method || 'GET',
        statusCode: usageData.statusCode,
        responseTime: usageData.responseTime,
        requestSize: usageData.requestSize || 0,
        responseSize: usageData.responseSize || 0,
        userAgent: usageData.userAgent,
        ipAddress: usageData.ipAddress,
        timestamp: new Date(),
        success: usageData.statusCode >= 200 && usageData.statusCode < 400
      };

      // Store in temp storage
      tempStorage.createUsage(usage);

      // Add to buffer for real-time processing
      if (!this.usageBuffer.has(userId)) {
        this.usageBuffer.set(userId, []);
      }
      this.usageBuffer.get(userId).push(usage);

      // Keep only last 1000 usage events per user in buffer
      const userBuffer = this.usageBuffer.get(userId);
      if (userBuffer.length > 1000) {
        this.usageBuffer.set(userId, userBuffer.slice(-1000));
      }

      // Send real-time update
      websocketService.broadcastToUser(userId, 'usage_event', {
        usage,
        timestamp: new Date().toISOString()
      });

      // Update real-time stats
      const updatedStats = await this.calculateRealtimeStats(userId);
      websocketService.broadcastToUser(userId, 'usage_stats_update', updatedStats);

      // Check for alerts
      await this.checkUsageAlerts(userId, usage, updatedStats);

      return usage;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return null;
    }
  }

  // Calculate real-time usage statistics
  async calculateRealtimeStats(userId) {
    try {
      const userBuffer = this.usageBuffer.get(userId) || [];
      const apiKeys = tempStorage.findApiKeysByUserId(userId);
      
      // Time periods
      const now = new Date();
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
      const last5min = new Date(now.getTime() - 5 * 60 * 1000);

      // Filter usage by time periods
      const usage24h = userBuffer.filter(u => u.timestamp >= last24h);
      const usageHour = userBuffer.filter(u => u.timestamp >= lastHour);
      const usage5min = userBuffer.filter(u => u.timestamp >= last5min);

      // Calculate stats
      const stats = {
        userId,
        timestamp: now.toISOString(),
        periods: {
          last5min: this.calculatePeriodStats(usage5min),
          lastHour: this.calculatePeriodStats(usageHour),
          last24h: this.calculatePeriodStats(usage24h)
        },
        apiKeys: {
          total: apiKeys.length,
          active: apiKeys.filter(k => k.status === 'active').length
        },
        topServices: this.getTopServices(usage24h),
        recentErrors: this.getRecentErrors(userBuffer.slice(-50)),
        performanceMetrics: this.calculatePerformanceMetrics(usage24h)
      };

      // Cache stats
      this.statsCache.set(userId, stats);

      return stats;
    } catch (error) {
      console.error('Error calculating realtime stats:', error);
      return null;
    }
  }

  calculatePeriodStats(usageArray) {
    if (usageArray.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        successRate: 0,
        errorRate: 0,
        totalDataTransfer: 0
      };
    }

    const successful = usageArray.filter(u => u.success);
    const failed = usageArray.filter(u => !u.success);
    const totalResponseTime = usageArray.reduce((sum, u) => sum + (u.responseTime || 0), 0);
    const totalDataTransfer = usageArray.reduce((sum, u) => sum + (u.requestSize || 0) + (u.responseSize || 0), 0);

    return {
      totalRequests: usageArray.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageResponseTime: Math.round(totalResponseTime / usageArray.length),
      successRate: Math.round((successful.length / usageArray.length) * 100),
      errorRate: Math.round((failed.length / usageArray.length) * 100),
      totalDataTransfer: Math.round(totalDataTransfer / 1024) // KB
    };
  }

  getTopServices(usageArray) {
    const serviceCount = {};
    usageArray.forEach(usage => {
      serviceCount[usage.service] = (serviceCount[usage.service] || 0) + 1;
    });

    return Object.entries(serviceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([service, count]) => ({ service, count }));
  }

  getRecentErrors(usageArray) {
    return usageArray
      .filter(u => !u.success)
      .slice(-10)
      .map(u => ({
        service: u.service,
        endpoint: u.endpoint,
        statusCode: u.statusCode,
        timestamp: u.timestamp,
        responseTime: u.responseTime
      }));
  }

  calculatePerformanceMetrics(usageArray) {
    if (usageArray.length === 0) return {};

    const responseTimes = usageArray.map(u => u.responseTime || 0).sort((a, b) => a - b);
    const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)];
    const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)];
    const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)];

    return {
      p50ResponseTime: p50,
      p95ResponseTime: p95,
      p99ResponseTime: p99,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes)
    };
  }

  // Check for usage alerts
  async checkUsageAlerts(userId, usage, stats) {
    try {
      const user = tempStorage.findUserById(userId);
      if (!user) return;

      // Check response time alert
      if (usage.responseTime > this.alertThresholds.responseTime) {
        await notificationService.sendNotification(userId, {
          type: 'warning',
          title: 'Slow Response Detected',
          message: `API response took ${usage.responseTime}ms for ${usage.service}`,
          data: { usage, threshold: this.alertThresholds.responseTime }
        });
      }

      // Check error rate alert
      const errorRate = stats.periods.lastHour.errorRate;
      if (errorRate > this.alertThresholds.errorRate) {
        await notificationService.sendNotification(userId, {
          type: 'error',
          title: 'High Error Rate Detected',
          message: `Error rate is ${errorRate}% in the last hour`,
          data: { errorRate, threshold: this.alertThresholds.errorRate }
        });
      }

      // Check usage limit alerts (for Pro users with limits)
      if (user.plan === 'Free') {
        const monthlyUsage = this.getMonthlyUsage(userId);
        const monthlyLimit = 10000; // Free tier limit
        const usagePercentage = (monthlyUsage / monthlyLimit) * 100;

        for (const threshold of this.alertThresholds.usage) {
          if (usagePercentage >= threshold && !this.hasRecentAlert(userId, `usage_${threshold}`)) {
            await notificationService.sendUsageLimitWarning(userId, Math.round(usagePercentage), monthlyLimit);
            this.markAlertSent(userId, `usage_${threshold}`);
            break;
          }
        }
      }

    } catch (error) {
      console.error('Error checking usage alerts:', error);
    }
  }

  getMonthlyUsage(userId) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const userBuffer = this.usageBuffer.get(userId) || [];
    
    return userBuffer.filter(u => u.timestamp >= monthStart).length;
  }

  hasRecentAlert(userId, alertType) {
    // Check if alert was sent in the last 24 hours
    const key = `alert_${userId}_${alertType}`;
    const lastSent = this.alertsSent?.get(key);
    if (!lastSent) return false;
    
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return new Date(lastSent) > dayAgo;
  }

  markAlertSent(userId, alertType) {
    if (!this.alertsSent) {
      this.alertsSent = new Map();
    }
    const key = `alert_${userId}_${alertType}`;
    this.alertsSent.set(key, new Date().toISOString());
  }

  // Get cached stats
  getCachedStats(userId) {
    return this.statsCache.get(userId) || null;
  }

  // Generate usage report
  async generateUsageReport(userId, period = '24h') {
    try {
      const userBuffer = this.usageBuffer.get(userId) || [];
      const now = new Date();
      let startTime;

      switch (period) {
        case '1h':
          startTime = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        default:
          startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const periodUsage = userBuffer.filter(u => u.timestamp >= startTime);
      
      const report = {
        userId,
        period,
        startTime: startTime.toISOString(),
        endTime: now.toISOString(),
        summary: this.calculatePeriodStats(periodUsage),
        hourlyBreakdown: this.getHourlyBreakdown(periodUsage),
        serviceBreakdown: this.getServiceBreakdown(periodUsage),
        errorAnalysis: this.getErrorAnalysis(periodUsage),
        performanceAnalysis: this.getPerformanceAnalysis(periodUsage)
      };

      return report;
    } catch (error) {
      console.error('Error generating usage report:', error);
      return null;
    }
  }

  getHourlyBreakdown(usageArray) {
    const hourlyData = {};
    
    usageArray.forEach(usage => {
      const hour = new Date(usage.timestamp).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { requests: 0, errors: 0, totalResponseTime: 0 };
      }
      hourlyData[hour].requests++;
      if (!usage.success) hourlyData[hour].errors++;
      hourlyData[hour].totalResponseTime += usage.responseTime || 0;
    });

    return Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      requests: data.requests,
      errors: data.errors,
      averageResponseTime: Math.round(data.totalResponseTime / data.requests),
      errorRate: Math.round((data.errors / data.requests) * 100)
    }));
  }

  getServiceBreakdown(usageArray) {
    const serviceData = {};
    
    usageArray.forEach(usage => {
      if (!serviceData[usage.service]) {
        serviceData[usage.service] = {
          requests: 0,
          errors: 0,
          totalResponseTime: 0,
          dataTransfer: 0
        };
      }
      const service = serviceData[usage.service];
      service.requests++;
      if (!usage.success) service.errors++;
      service.totalResponseTime += usage.responseTime || 0;
      service.dataTransfer += (usage.requestSize || 0) + (usage.responseSize || 0);
    });

    return Object.entries(serviceData).map(([service, data]) => ({
      service,
      requests: data.requests,
      errors: data.errors,
      averageResponseTime: Math.round(data.totalResponseTime / data.requests),
      errorRate: Math.round((data.errors / data.requests) * 100),
      dataTransfer: Math.round(data.dataTransfer / 1024) // KB
    }));
  }

  getErrorAnalysis(usageArray) {
    const errors = usageArray.filter(u => !u.success);
    const errorsByCode = {};
    
    errors.forEach(error => {
      errorsByCode[error.statusCode] = (errorsByCode[error.statusCode] || 0) + 1;
    });

    return {
      totalErrors: errors.length,
      errorRate: Math.round((errors.length / usageArray.length) * 100),
      errorsByStatusCode: errorsByCode,
      mostCommonErrors: Object.entries(errorsByCode)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([code, count]) => ({ statusCode: parseInt(code), count }))
    };
  }

  getPerformanceAnalysis(usageArray) {
    const responseTimes = usageArray.map(u => u.responseTime || 0);
    if (responseTimes.length === 0) return {};

    responseTimes.sort((a, b) => a - b);
    
    return {
      averageResponseTime: Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length),
      medianResponseTime: responseTimes[Math.floor(responseTimes.length / 2)],
      p95ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.95)],
      p99ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.99)],
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      slowRequests: responseTimes.filter(t => t > 1000).length
    };
  }

  // Start periodic stats updates
  startPeriodicUpdates() {
    // Update stats every 30 seconds
    setInterval(async () => {
      for (const userId of this.usageBuffer.keys()) {
        if (websocketService.isUserConnected(userId)) {
          const stats = await this.calculateRealtimeStats(userId);
          if (stats) {
            websocketService.broadcastToUser(userId, 'usage_stats_update', stats);
          }
        }
      }
    }, 30000);
  }
}

module.exports = new RealtimeUsageService();