const cacheService = require('../services/cacheService');

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      totalResponseTime: 0,
      slowRequests: 0,
      errors: 0,
      activeConnections: 0
    };
    
    this.slowRequestThreshold = 1000; // 1 second
    this.metricsWindow = 60000; // 1 minute
    this.resetMetrics();
  }

  resetMetrics() {
    setInterval(() => {
      // Store current metrics in cache for monitoring
      cacheService.set('performance-metrics', {
        ...this.metrics,
        timestamp: new Date(),
        avgResponseTime: this.metrics.requests > 0 
          ? Math.round(this.metrics.totalResponseTime / this.metrics.requests)
          : 0,
        errorRate: this.metrics.requests > 0
          ? Math.round((this.metrics.errors / this.metrics.requests) * 100)
          : 0,
        slowRequestRate: this.metrics.requests > 0
          ? Math.round((this.metrics.slowRequests / this.metrics.requests) * 100)
          : 0
      }, 300); // Keep for 5 minutes

      // Reset counters
      this.metrics = {
        requests: 0,
        totalResponseTime: 0,
        slowRequests: 0,
        errors: 0,
        activeConnections: 0
      };
    }, this.metricsWindow);
  }

  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      this.metrics.activeConnections++;
      this.metrics.requests++;

      // Override res.end to capture response time
      const originalEnd = res.end;
      res.end = (...args) => {
        const responseTime = Date.now() - startTime;
        this.metrics.totalResponseTime += responseTime;
        this.metrics.activeConnections--;

        // Track slow requests
        if (responseTime > this.slowRequestThreshold) {
          this.metrics.slowRequests++;
          console.warn(`⚠️  Slow request: ${req.method} ${req.originalUrl} - ${responseTime}ms`);
        }

        // Track errors
        if (res.statusCode >= 400) {
          this.metrics.errors++;
        }

        // Add performance headers
        res.set('X-Response-Time', `${responseTime}ms`);
        res.set('X-Request-ID', req.headers['x-request-id'] || 'unknown');

        originalEnd.apply(res, args);
      };

      next();
    };
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgResponseTime: this.metrics.requests > 0 
        ? Math.round(this.metrics.totalResponseTime / this.metrics.requests)
        : 0,
      errorRate: this.metrics.requests > 0
        ? Math.round((this.metrics.errors / this.metrics.requests) * 100)
        : 0,
      slowRequestRate: this.metrics.requests > 0
        ? Math.round((this.metrics.slowRequests / this.metrics.requests) * 100)
        : 0
    };
  }

  async getHistoricalMetrics() {
    try {
      return await cacheService.get('performance-metrics') || null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new PerformanceMonitor();