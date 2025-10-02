const express = require('express');
const http = require('http');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import services
const databaseService = require('./services/databaseService');
const cacheService = require('./services/cacheService');
const rateLimiter = require('./middleware/rateLimiter');
const backgroundJobs = require('./services/backgroundJobs');
const performanceMonitor = require('./middleware/performance');
const websocketService = require('./services/websocketService');
const notificationService = require('./services/notificationService');
const realtimeUsageService = require('./services/realtimeUsageService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Trust proxy for accurate IP addresses in load balancer setup
app.set('trust proxy', 1);

// Compression middleware for better performance
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (1-9)
  threshold: 1024 // Only compress responses > 1KB
}));

// Security middleware with optimized settings
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS with optimized settings
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Rate limiting with advanced configuration
app.use('/api/', rateLimiter.general());
app.use('/api/auth', rateLimiter.auth());

// Performance monitoring
app.use(performanceMonitor.middleware());

// Optimized middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ 
  limit: '1mb', // Reduced from 10mb for security
  strict: true
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '1mb',
  parameterLimit: 100
}));

// Initialize database connection (optional for development)
if (process.env.ENABLE_MONGODB === 'true') {
  databaseService.connect().then(async (connected) => {
    if (connected) {
      // Create optimized indexes
      await databaseService.createIndexes();
      console.log('✅ Database connected and ready for user authentication');
    } else {
      console.log('⚠️  Database connection failed - using temporary storage');
    }
  });
} else {
  console.log('ℹ️  MongoDB disabled - using temporary storage for development');
}

// Health check route with detailed system information
app.get('/api/health', async (req, res) => {
  const dbHealth = await databaseService.healthCheck();
  const cacheStats = cacheService.getStats();
  
  res.json({
    status: 'OK',
    message: 'API Key Management Platform Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    database: dbHealth,
    cache: cacheStats,
    pid: process.pid
  });
});

// System stats route (protected)
app.get('/api/system/stats', async (req, res) => {
  try {
    const stats = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        pid: process.pid,
        platform: process.platform,
        nodeVersion: process.version
      },
      database: await databaseService.healthCheck(),
      cache: cacheService.getStats(),
      rateLimiter: await rateLimiter.getStats(),
      performance: {
        current: performanceMonitor.getMetrics(),
        historical: await performanceMonitor.getHistoricalMetrics()
      },
      backgroundJobs: backgroundJobs.getJobStatus()
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import routes with caching where appropriate
app.use('/api/auth', require('./routes/auth'));
app.use('/api/keys', require('./routes/keys'));
app.use('/api/usage', require('./routes/usage'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/support', require('./routes/support'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong!',
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      timestamp: new Date().toISOString()
    }
  });
});

// Initialize WebSocket service
websocketService.initialize(server);
websocketService.startPeriodicUpdates();

// Initialize real-time services
notificationService.startCleanupJob();
realtimeUsageService.startPeriodicUpdates();

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 WebSocket server ready`);
  
  // Start background jobs in production
  if (process.env.NODE_ENV === 'production') {
    backgroundJobs.start();
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  backgroundJobs.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  backgroundJobs.stop();
  process.exit(0);
});

module.exports = app;