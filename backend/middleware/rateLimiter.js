const { RateLimiterRedis, RateLimiterMemory } = require('rate-limiter-flexible');
const Redis = require('ioredis');

class RateLimiterService {
  constructor() {
    this.redis = null;
    this.initRedis();
    this.setupLimiters();
  }

  async initRedis() {
    // Skip Redis for rate limiter if not available
    if (!process.env.REDIS_URL && !process.env.ENABLE_REDIS) {
      console.log('ℹ️  Rate limiter using memory-based limiting');
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = new Redis(redisUrl, {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
        lazyConnect: true
      });
      
      this.redis.on('error', () => {
        console.warn('⚠️  Rate limiter Redis failed, using memory fallback');
        this.redis = null;
      });

      await Promise.race([
        this.redis.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ]);
      
      console.log('✅ Rate limiter Redis connected');
    } catch (error) {
      console.warn('⚠️  Rate limiter using memory fallback');
      this.redis = null;
    }
  }

  setupLimiters() {
    const redisClient = this.redis;

    // General API rate limiter - 1000 requests per 15 minutes per IP
    this.generalLimiter = redisClient 
      ? new RateLimiterRedis({
          storeClient: redisClient,
          keyPrefix: 'rl_general',
          points: 1000, // Number of requests
          duration: 900, // Per 15 minutes
          blockDuration: 900, // Block for 15 minutes if exceeded
        })
      : new RateLimiterMemory({
          keyPrefix: 'rl_general',
          points: 1000,
          duration: 900,
          blockDuration: 900,
        });

    // Authentication rate limiter - 10 attempts per 15 minutes per IP
    this.authLimiter = redisClient
      ? new RateLimiterRedis({
          storeClient: redisClient,
          keyPrefix: 'rl_auth',
          points: 10,
          duration: 900,
          blockDuration: 1800, // Block for 30 minutes
        })
      : new RateLimiterMemory({
          keyPrefix: 'rl_auth',
          points: 10,
          duration: 900,
          blockDuration: 1800,
        });

    // API key creation limiter - 20 per hour per user
    this.keyCreationLimiter = redisClient
      ? new RateLimiterRedis({
          storeClient: redisClient,
          keyPrefix: 'rl_key_creation',
          points: 20,
          duration: 3600,
          blockDuration: 3600,
        })
      : new RateLimiterMemory({
          keyPrefix: 'rl_key_creation',
          points: 20,
          duration: 3600,
          blockDuration: 3600,
        });

    // Heavy operations limiter - 100 per hour per user
    this.heavyOpsLimiter = redisClient
      ? new RateLimiterRedis({
          storeClient: redisClient,
          keyPrefix: 'rl_heavy_ops',
          points: 100,
          duration: 3600,
          blockDuration: 1800,
        })
      : new RateLimiterMemory({
          keyPrefix: 'rl_heavy_ops',
          points: 100,
          duration: 3600,
          blockDuration: 1800,
        });
  }

  /**
   * General rate limiting middleware
   */
  general() {
    return async (req, res, next) => {
      try {
        const key = req.ip;
        await this.generalLimiter.consume(key);
        next();
      } catch (rejRes) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${secs} seconds.`,
          retryAfter: secs
        });
      }
    };
  }

  /**
   * Authentication rate limiting middleware
   */
  auth() {
    return async (req, res, next) => {
      try {
        const key = req.ip;
        await this.authLimiter.consume(key);
        next();
      } catch (rejRes) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
          error: 'Too Many Authentication Attempts',
          message: `Too many login attempts. Try again in ${Math.ceil(secs / 60)} minutes.`,
          retryAfter: secs
        });
      }
    };
  }

  /**
   * API key creation rate limiting middleware
   */
  keyCreation() {
    return async (req, res, next) => {
      try {
        const key = req.userId || req.ip;
        await this.keyCreationLimiter.consume(key);
        next();
      } catch (rejRes) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
          error: 'API Key Creation Limit Exceeded',
          message: `Too many API keys created. Try again in ${Math.ceil(secs / 60)} minutes.`,
          retryAfter: secs
        });
      }
    };
  }

  /**
   * Heavy operations rate limiting middleware
   */
  heavyOps() {
    return async (req, res, next) => {
      try {
        const key = req.userId || req.ip;
        await this.heavyOpsLimiter.consume(key);
        next();
      } catch (rejRes) {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secs));
        res.status(429).json({
          error: 'Heavy Operations Limit Exceeded',
          message: `Too many resource-intensive operations. Try again in ${Math.ceil(secs / 60)} minutes.`,
          retryAfter: secs
        });
      }
    };
  }

  /**
   * Get rate limiter statistics
   */
  async getStats() {
    try {
      return {
        general: await this.getLimiterStats(this.generalLimiter, 'rl_general'),
        auth: await this.getLimiterStats(this.authLimiter, 'rl_auth'),
        keyCreation: await this.getLimiterStats(this.keyCreationLimiter, 'rl_key_creation'),
        heavyOps: await this.getLimiterStats(this.heavyOpsLimiter, 'rl_heavy_ops')
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async getLimiterStats(limiter, prefix) {
    if (this.redis) {
      const keys = await this.redis.keys(`${prefix}:*`);
      return {
        activeKeys: keys.length,
        type: 'redis'
      };
    } else {
      return {
        type: 'memory',
        message: 'Memory-based rate limiting active'
      };
    }
  }
}

module.exports = new RateLimiterService();