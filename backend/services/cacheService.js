const Redis = require('ioredis');
const NodeCache = require('node-cache');

class CacheService {
  constructor() {
    // Redis for distributed caching
    this.redis = null;
    this.initRedis();
    
    // In-memory cache as fallback
    this.memoryCache = new NodeCache({
      stdTTL: 300, // 5 minutes default TTL
      checkperiod: 60, // Check for expired keys every minute
      maxKeys: 10000 // Limit memory usage
    });
    
    this.isRedisConnected = false;
  }

  async initRedis() {
    // Skip Redis initialization if REDIS_URL is not provided or Redis is disabled
    if (!process.env.REDIS_URL && !process.env.ENABLE_REDIS) {
      console.log('ℹ️  Redis disabled, using memory cache only');
      this.isRedisConnected = false;
      return;
    }

    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.redis = new Redis(redisUrl, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 5000,
        commandTimeout: 3000,
        enableOfflineQueue: false
      });

      this.redis.on('connect', () => {
        console.log('✅ Redis connected');
        this.isRedisConnected = true;
      });

      this.redis.on('error', (err) => {
        console.warn('⚠️  Redis connection error, falling back to memory cache');
        this.isRedisConnected = false;
        // Don't retry connection to avoid spam
        if (this.redis) {
          this.redis.disconnect();
          this.redis = null;
        }
      });

      this.redis.on('close', () => {
        console.warn('⚠️  Redis connection closed, using memory cache');
        this.isRedisConnected = false;
      });

      // Try to connect with timeout
      const connectPromise = this.redis.connect();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 3000)
      );

      await Promise.race([connectPromise, timeoutPromise]);
    } catch (error) {
      console.warn('⚠️  Redis initialization failed, using memory cache only');
      this.isRedisConnected = false;
      if (this.redis) {
        this.redis.disconnect();
        this.redis = null;
      }
    }
  }

  /**
   * Get value from cache (Redis first, then memory cache)
   */
  async get(key) {
    try {
      if (this.isRedisConnected) {
        const value = await this.redis.get(key);
        if (value) {
          return JSON.parse(value);
        }
      }
      
      // Fallback to memory cache
      return this.memoryCache.get(key);
    } catch (error) {
      console.warn('Cache get error:', error.message);
      return this.memoryCache.get(key);
    }
  }

  /**
   * Set value in cache
   */
  async set(key, value, ttl = 300) {
    try {
      const serializedValue = JSON.stringify(value);
      
      if (this.isRedisConnected) {
        await this.redis.setex(key, ttl, serializedValue);
      }
      
      // Always set in memory cache as backup
      this.memoryCache.set(key, value, ttl);
      
      return true;
    } catch (error) {
      console.warn('Cache set error:', error.message);
      this.memoryCache.set(key, value, ttl);
      return false;
    }
  }

  /**
   * Delete from cache
   */
  async del(key) {
    try {
      if (this.isRedisConnected) {
        await this.redis.del(key);
      }
      
      this.memoryCache.del(key);
      return true;
    } catch (error) {
      console.warn('Cache delete error:', error.message);
      this.memoryCache.del(key);
      return false;
    }
  }

  /**
   * Clear all cache
   */
  async clear() {
    try {
      if (this.isRedisConnected) {
        await this.redis.flushdb();
      }
      
      this.memoryCache.flushAll();
      return true;
    } catch (error) {
      console.warn('Cache clear error:', error.message);
      this.memoryCache.flushAll();
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const memStats = this.memoryCache.getStats();
    return {
      redis: {
        connected: this.isRedisConnected,
        status: this.isRedisConnected ? 'connected' : 'disconnected'
      },
      memory: {
        keys: memStats.keys,
        hits: memStats.hits,
        misses: memStats.misses,
        hitRate: memStats.hits / (memStats.hits + memStats.misses) || 0
      }
    };
  }

  /**
   * Cache middleware for Express
   */
  middleware(ttl = 300) {
    return async (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }

      const key = `cache:${req.originalUrl}:${req.userId || 'anonymous'}`;
      
      try {
        const cached = await this.get(key);
        if (cached) {
          return res.json(cached);
        }

        // Store original json method
        const originalJson = res.json;
        
        // Override json method to cache response
        res.json = (data) => {
          this.set(key, data, ttl);
          return originalJson.call(res, data);
        };

        next();
      } catch (error) {
        console.warn('Cache middleware error:', error.message);
        next();
      }
    };
  }
}

module.exports = new CacheService();