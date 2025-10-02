# 🔐 API Key Management Platform

A comprehensive, enterprise-grade platform for secure API key management with real-time monitoring, automated rotation, and advanced analytics. Built with modern web technologies and following industry best practices for security and scalability.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ System Architecture](#️-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🔧 Algorithms & Data Structures](#-algorithms--data-structures)
- [🛡️ Security Implementation](#️-security-implementation)
- [🚀 Getting Started](#-getting-started)
- [📊 System Design Concepts](#-system-design-concepts)
- [🔌 API Documentation](#-api-documentation)
- [⚡ Performance Optimizations](#-performance-optimizations)
- [🧪 Testing Strategy](#-testing-strategy)
- [🚀 Deployment](#-deployment)

## 🎯 Overview

The API Key Management Platform is a full-stack web application designed to solve the complex challenges of managing API keys across multiple services and environments. It provides enterprise-level security, real-time monitoring, and automated management capabilities.

### Key Features
- 🔑 **Secure Storage**: AES-256 encryption with user-defined passphrases
- 🔄 **Automated Rotation**: Configurable rotation schedules with notifications
- 📊 **Real-time Analytics**: Live usage tracking and performance metrics
- 🚨 **Smart Monitoring**: Proactive alerts and anomaly detection
- 👥 **Multi-user Support**: Role-based access control and team collaboration
- 🌐 **Multi-environment**: Development, staging, and production support
- 📱 **Responsive Design**: Mobile-first, accessible interface
- ⚡ **Real-time Updates**: WebSocket-based live notifications

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Components  │  Pages  │  Services  │  Contexts  │  Utils   │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Auth Middleware  │  Rate Limiter  │  CORS  │  Validation   │
├─────────────────────────────────────────────────────────────┤
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│  Routes  │  Controllers  │  Services  │  Models  │  Utils   │
├─────────────────────────────────────────────────────────────┤
│                    Data Persistence                         │
├─────────────────────────────────────────────────────────────┤
│     MongoDB      │      Redis       │    File System       │
└─────────────────────────────────────────────────────────────┘
```

### Component Flow Diagram

```
User Request → Load Balancer → API Gateway → Authentication → 
Rate Limiting → Route Handler → Business Logic → Database → 
Cache Layer → Response → WebSocket Updates → Client
```

## 💻 Tech Stack

### Frontend Technologies

#### Core Framework
- **React 18.2.0** - Modern functional components with hooks
- **React Router DOM 6.8.0** - Client-side routing and navigation
- **React Scripts 5.0.1** - Build tooling and development server

#### Styling & UI
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **PostCSS 8.4.31** - CSS processing and optimization
- **Autoprefixer 10.4.16** - Automatic vendor prefixing

#### Data Visualization
- **Recharts 2.8.0** - Composable charting library for React
- **Custom Chart Components** - Tailored analytics visualizations

#### Real-time Communication
- **Socket.io Client 4.8.1** - WebSocket client for real-time updates
- **WebSocket Context** - React context for socket management

#### HTTP Client & State Management
- **Axios 1.6.0** - Promise-based HTTP client
- **React Context API** - Global state management
- **Custom Hooks** - Reusable stateful logic

#### Testing Framework
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **User Event Testing** - User interaction simulation

### Backend Technologies

#### Core Framework
- **Node.js 18+** - JavaScript runtime environment
- **Express.js 4.18.2** - Web application framework
- **Mongoose 8.0.3** - MongoDB object modeling

#### Authentication & Security
- **JSON Web Tokens (JWT) 9.0.2** - Stateless authentication
- **bcryptjs 2.4.3** - Password hashing with salt
- **Helmet 7.1.0** - Security headers middleware
- **CORS 2.8.5** - Cross-origin resource sharing

#### Encryption & Cryptography
- **Node.js Crypto Module** - Built-in cryptographic functionality
- **AES-256-CBC** - Symmetric encryption algorithm
- **PBKDF2** - Password-based key derivation function
- **UUID 9.0.1** - Unique identifier generation

#### Real-time Features
- **Socket.io 4.8.1** - WebSocket server implementation
- **Real-time Notifications** - Live user notifications
- **Live Usage Tracking** - Real-time analytics updates

#### Performance & Caching
- **Redis (ioredis 5.8.0)** - In-memory data structure store
- **Node-cache 5.1.2** - In-memory caching solution
- **Compression 1.8.1** - Response compression middleware

#### Rate Limiting & Security
- **Express Rate Limit 7.1.5** - Basic rate limiting
- **Rate Limiter Flexible 2.4.2** - Advanced rate limiting
- **Express Validator 7.0.1** - Input validation and sanitization

#### Background Processing
- **Node-cron 3.0.3** - Scheduled task execution
- **Background Jobs Service** - Asynchronous task processing
- **Automated Rotation** - Scheduled API key rotation

#### Monitoring & Logging
- **Morgan 1.10.0** - HTTP request logger
- **Custom Analytics Service** - Usage tracking and metrics
- **Performance Monitoring** - System health tracking

## 📁 Project Structure

### Frontend Architecture

```
frontend/
├── public/                          # Static assets
│   ├── index.html                   # HTML template
│   ├── favicon.ico                  # Application icon
│   └── notification.svg             # Notification icon
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── Navbar.js           # Navigation bar with user menu
│   │   │   ├── Sidebar.js          # Dashboard sidebar navigation
│   │   │   └── DashboardLayout.js  # Main dashboard wrapper
│   │   ├── forms/                   # Form components
│   │   │   ├── CreateApiKeyModal.js # API key creation modal
│   │   │   └── LoginForm.js        # Authentication form
│   │   ├── charts/                  # Data visualization
│   │   │   ├── UsageChart.js       # Usage analytics chart
│   │   │   └── PerformanceChart.js # Performance metrics
│   │   ├── notifications/           # Notification system
│   │   │   ├── RealtimeNotifications.js # Live notifications
│   │   │   └── NotificationCenter.js    # Notification management
│   │   ├── monitoring/              # System monitoring
│   │   │   ├── SystemMonitor.js    # System health display
│   │   │   └── RealtimeUsageDashboard.js # Live usage tracking
│   │   └── websocket/               # WebSocket management
│   │       ├── WebSocketManager.js # Socket connection handler
│   │       └── ConnectionStatus.js # Connection status indicator
│   ├── pages/                       # Page components
│   │   ├── public/                  # Public pages
│   │   │   ├── Home.js             # Landing page
│   │   │   ├── Pricing.js          # Pricing plans
│   │   │   └── Features.js         # Feature showcase
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── Login.js            # User login
│   │   │   └── Signup.js           # User registration
│   │   ├── dashboard/               # Dashboard pages
│   │   │   ├── DashboardHome.js    # Main dashboard
│   │   │   ├── ApiKeysPage.js      # API key management
│   │   │   ├── MonitoringPage.js   # System monitoring
│   │   │   ├── BillingUsage.js     # Usage and billing
│   │   │   ├── ProfileSettings.js  # User profile
│   │   │   ├── HelpSupport.js      # Help and support
│   │   │   └── ApiDocumentation.js # API documentation
│   ├── contexts/                    # React contexts
│   │   ├── AuthContext.js          # Authentication state
│   │   ├── WebSocketContext.js     # WebSocket connection
│   │   └── NotificationContext.js  # Notification state
│   ├── services/                    # API services
│   │   ├── api.js                  # Base API configuration
│   │   ├── authService.js          # Authentication API
│   │   ├── apiKeyService.js        # API key management
│   │   └── analyticsService.js     # Analytics API
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js              # Authentication hook
│   │   ├── useWebSocket.js         # WebSocket hook
│   │   └── useLocalStorage.js      # Local storage hook
│   ├── utils/                       # Utility functions
│   │   ├── constants.js            # Application constants
│   │   ├── helpers.js              # Helper functions
│   │   └── validators.js           # Form validation
│   ├── styles/                      # Global styles
│   │   ├── globals.css             # Global CSS
│   │   └── components.css          # Component-specific styles
│   ├── App.js                       # Main application component
│   └── index.js                     # Application entry point
├── package.json                     # Dependencies and scripts
├── tailwind.config.js              # Tailwind CSS configuration
└── .env                            # Environment variables
```

### Backend Architecture

```
backend/
├── config/                          # Configuration files
│   ├── database.js                 # MongoDB connection
│   ├── redis.js                   # Redis configuration
│   └── websocket.js               # WebSocket configuration
├── controllers/                     # Route controllers
│   ├── authController.js          # Authentication logic
│   ├── apiKeyController.js        # API key management
│   ├── usageController.js         # Usage tracking
│   ├── billingController.js       # Billing operations
│   └── profileController.js       # User profile management
├── middleware/                      # Custom middleware
│   ├── auth.js                    # JWT authentication
│   ├── rateLimiter.js             # Rate limiting
│   ├── validation.js              # Input validation
│   ├── errorHandler.js            # Error handling
│   └── performance.js             # Performance monitoring
├── models/                          # Database schemas
│   ├── User.js                    # User model
│   ├── ApiKey.js                  # API key model
│   ├── Usage.js                   # Usage tracking model
│   ├── Subscription.js            # Subscription model
│   └── Notification.js            # Notification model
├── routes/                          # API routes
│   ├── auth.js                    # Authentication routes
│   ├── keys.js                    # API key routes
│   ├── usage.js                   # Usage tracking routes
│   ├── billing.js                 # Billing routes
│   ├── profile.js                 # Profile routes
│   └── support.js                 # Support routes
├── services/                        # Business logic services
│   ├── encryptionService.js       # Encryption/decryption
│   ├── notificationService.js     # Notification system
│   ├── websocketService.js        # WebSocket management
│   ├── cacheService.js            # Caching operations
│   ├── backgroundJobs.js          # Background processing
│   ├── realtimeUsageService.js    # Real-time usage tracking
│   └── databaseService.js         # Database operations
├── utils/                           # Utility functions
│   ├── encryption.js              # Encryption utilities
│   ├── validation.js              # Validation helpers
│   ├── logger.js                  # Logging utilities
│   └── constants.js               # Application constants
├── scripts/                         # Utility scripts
│   ├── setupDatabase.js           # Database initialization
│   ├── seedData.js                # Sample data seeding
│   └── migration.js               # Database migrations
├── tests/                           # Test files
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
├── temp-storage.js                  # Temporary in-memory storage
├── server.js                        # Express server entry point
├── cluster.js                       # Cluster mode configuration
├── start-dev.js                     # Development server
├── package.json                     # Dependencies and scripts
├── ecosystem.config.js              # PM2 configuration
├── Dockerfile                       # Docker configuration
├── docker-compose.yml              # Docker Compose setup
└── .env.example                     # Environment variables template
```

## 🔧 Algorithms & Data Structures

### Encryption Algorithms

#### AES-256-CBC Encryption
```javascript
/**
 * Advanced Encryption Standard with 256-bit key in Cipher Block Chaining mode
 * Time Complexity: O(n) where n is the length of plaintext
 * Space Complexity: O(n) for encrypted output
 */
class EncryptionService {
  encryptApiKey(plainKey) {
    const iv = crypto.randomBytes(16);           // 128-bit initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
    
    let encrypted = cipher.update(plainKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;  // IV:EncryptedData format
  }
}
```

#### PBKDF2 Key Derivation
```javascript
/**
 * Password-Based Key Derivation Function 2
 * Time Complexity: O(iterations) - intentionally slow for security
 * Space Complexity: O(1) for key generation
 */
encryptApiKeyWithPassphrase(plainKey, passphrase) {
  const salt = crypto.randomBytes(32);          // 256-bit salt
  const iterations = 100000;                   // OWASP recommended minimum
  const keyLength = 32;                        // 256-bit key
  
  const key = crypto.pbkdf2Sync(passphrase, salt, iterations, keyLength, 'sha512');
  // ... encryption logic
}
```

### Data Structures

#### In-Memory Storage (Development)
```javascript
/**
 * Hash Map based storage for development environment
 * Time Complexity: O(1) average for CRUD operations
 * Space Complexity: O(n) where n is number of stored items
 */
class TempStorage {
  constructor() {
    this.users = new Map();        // email -> user object
    this.apiKeys = new Map();      // keyId -> apiKey object
    this.usage = [];               // Array for usage records
  }
  
  // O(1) user lookup by email
  findUserByEmail(email) {
    return this.users.get(email.toLowerCase());
  }
  
  // O(n) user lookup by ID (could be optimized with additional Map)
  findUserById(id) {
    for (let user of this.users.values()) {
      if (user._id === id) return user;
    }
    return null;
  }
}
```

#### Caching Strategy
```javascript
/**
 * Multi-level caching with TTL (Time To Live)
 * L1: In-memory cache (fastest)
 * L2: Redis cache (shared across instances)
 * L3: Database (persistent storage)
 */
class CacheService {
  async get(key) {
    // L1 Cache check - O(1)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // L2 Cache check - O(1) network call
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      this.memoryCache.set(key, redisValue, 300); // 5min TTL
      return redisValue;
    }
    
    return null; // Cache miss
  }
}
```

### Search & Filtering Algorithms

#### API Key Search
```javascript
/**
 * Multi-field search with fuzzy matching
 * Time Complexity: O(n*m) where n=keys, m=search terms
 * Space Complexity: O(k) where k=matching results
 */
searchApiKeys(query, filters) {
  const searchTerm = query.toLowerCase().trim();
  
  return this.apiKeys.filter(key => {
    // Multi-field search
    const matchesSearch = 
      key.name?.toLowerCase().includes(searchTerm) ||
      key.service?.toLowerCase().includes(searchTerm) ||
      key.description?.toLowerCase().includes(searchTerm) ||
      key.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
    
    // Apply filters
    const matchesStatus = !filters.status || key.status === filters.status;
    const matchesEnvironment = !filters.environment || key.environment === filters.environment;
    
    return matchesSearch && matchesStatus && matchesEnvironment;
  });
}
```

#### Usage Analytics Aggregation
```javascript
/**
 * Time-series data aggregation for analytics
 * Time Complexity: O(n log n) for sorting by timestamp
 * Space Complexity: O(d) where d=number of time buckets
 */
aggregateUsageData(usageRecords, timeframe) {
  const buckets = new Map();
  const bucketSize = this.getBucketSize(timeframe); // hour, day, week, month
  
  usageRecords.forEach(record => {
    const bucket = Math.floor(record.timestamp / bucketSize) * bucketSize;
    
    if (!buckets.has(bucket)) {
      buckets.set(bucket, {
        timestamp: bucket,
        requests: 0,
        errors: 0,
        avgResponseTime: 0,
        totalResponseTime: 0
      });
    }
    
    const bucketData = buckets.get(bucket);
    bucketData.requests++;
    if (record.statusCode >= 400) bucketData.errors++;
    bucketData.totalResponseTime += record.responseTime || 0;
    bucketData.avgResponseTime = bucketData.totalResponseTime / bucketData.requests;
  });
  
  return Array.from(buckets.values()).sort((a, b) => a.timestamp - b.timestamp);
}
```

### Rate Limiting Algorithm

#### Token Bucket Algorithm
```javascript
/**
 * Token bucket rate limiting implementation
 * Time Complexity: O(1) for rate limit check
 * Space Complexity: O(u) where u=number of unique users
 */
class RateLimiter {
  constructor(capacity, refillRate) {
    this.capacity = capacity;      // Maximum tokens
    this.refillRate = refillRate;  // Tokens per second
    this.buckets = new Map();      // userId -> bucket state
  }
  
  isAllowed(userId) {
    const now = Date.now();
    let bucket = this.buckets.get(userId);
    
    if (!bucket) {
      bucket = { tokens: this.capacity, lastRefill: now };
      this.buckets.set(userId, bucket);
    }
    
    // Refill tokens based on elapsed time
    const elapsed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = Math.floor(elapsed * this.refillRate);
    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
    
    if (bucket.tokens > 0) {
      bucket.tokens--;
      return true;
    }
    
    return false; // Rate limit exceeded
  }
}
```

## 🛡️ Security Implementation

### Authentication Flow

```
Client → Server: POST /auth/login {email, password}
Server → Database: Find user by email
Database → Server: User data with hashed password
Server: bcrypt.compare(password, hash)
Server: jwt.sign(payload, secret)
Server → Client: {token, user} or {error}

Note: Subsequent requests
Client → Server: API Request with Authorization header
Server: jwt.verify(token, secret)
Server: Extract userId from token
Server → Database: Validate user exists
Server → Client: API Response or 401 Unauthorized
```

### Encryption Architecture

```javascript
/**
 * Multi-layer encryption strategy
 * 1. User passwords: bcrypt with salt rounds
 * 2. API keys: AES-256-CBC with user passphrase
 * 3. Sensitive data: AES-256-CBC with system key
 */

// Password Security
const hashPassword = async (password) => {
  const saltRounds = 12; // 2^12 iterations
  return await bcrypt.hash(password, saltRounds);
};

// API Key Encryption with User Passphrase
const encryptWithPassphrase = (apiKey, passphrase) => {
  const salt = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(passphrase, salt, 100000, 32, 'sha512');
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(apiKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
};
```

### Security Headers & Middleware

```javascript
// Security middleware stack
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

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **MongoDB 5.0+** - Document database
- **Redis 6.0+** - In-memory cache (optional)
- **Git** - Version control

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/your-username/api-key-management.git
cd api-key-management
```

2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Start development server
npm start
```

4. **Database Setup**
```bash
# Ensure MongoDB is running
mongod

# Initialize database (optional)
cd backend
npm run setup:db
```

### Environment Configuration

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/api-key-management

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here
AES_SECRET=your-32-character-aes-encryption-key

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_ENV=development
```

## 📊 System Design Concepts

### Scalability Patterns

#### Horizontal Scaling
```javascript
// Cluster mode for multi-core utilization
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Restart worker
  });
} else {
  // Worker process
  require('./server.js');
}
```

#### Load Balancing Strategy
```nginx
# Nginx configuration for load balancing
upstream api_servers {
    least_conn;
    server 127.0.0.1:8080 weight=3;
    server 127.0.0.1:8081 weight=2;
    server 127.0.0.1:8082 weight=1;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Caching Strategy

#### Multi-Level Caching
```javascript
/**
 * Caching hierarchy for optimal performance
 * L1: Application memory (fastest, smallest)
 * L2: Redis (fast, shared)
 * L3: Database (slowest, persistent)
 */
class CacheManager {
  async get(key) {
    // L1: Memory cache
    const memoryResult = this.memoryCache.get(key);
    if (memoryResult) return memoryResult;
    
    // L2: Redis cache
    const redisResult = await this.redis.get(key);
    if (redisResult) {
      this.memoryCache.set(key, redisResult, 300); // 5min TTL
      return JSON.parse(redisResult);
    }
    
    // L3: Database fallback
    return null;
  }
  
  async set(key, value, ttl = 3600) {
    // Write to all cache levels
    this.memoryCache.set(key, value, Math.min(ttl, 300));
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

### Database Design

#### Schema Design Patterns

```javascript
// User Schema with indexing strategy
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    index: true  // B-tree index for fast lookups
  },
  password: { type: String, required: true },
  profile: {
    name: String,
    avatar: String,
    preferences: {
      theme: { type: String, default: 'light' },
      notifications: { type: Boolean, default: true }
    }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    limits: {
      apiKeys: { type: Number, default: 5 },
      monthlyRequests: { type: Number, default: 1000 }
    }
  },
  security: {
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Compound indexes for complex queries
userSchema.index({ email: 1, 'security.lockUntil': 1 });
userSchema.index({ 'subscription.plan': 1, createdAt: -1 });
```

#### API Key Schema with Encryption
```javascript
const apiKeySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  keyId: { 
    type: String, 
    unique: true, 
    required: true,
    index: true
  },
  name: { type: String, required: true },
  service: { type: String, required: true, index: true },
  
  // Encrypted storage
  encryptedKey: { type: String, required: true },
  encryptionMethod: { type: String, default: 'aes-256-cbc' },
  
  // Metadata
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
  
  // Usage tracking
  lastUsed: Date,
  usageCount: { type: Number, default: 0 },
  
  // Rotation settings
  rotationInterval: { type: Number, default: 90 }, // days
  nextRotation: Date,
  
  // Limits and monitoring
  monthlyLimit: Number,
  currentMonthUsage: { type: Number, default: 0 },
  
  tags: [String]
}, {
  timestamps: true
});

// Compound indexes for efficient queries
apiKeySchema.index({ userId: 1, status: 1 });
apiKeySchema.index({ userId: 1, environment: 1 });
apiKeySchema.index({ nextRotation: 1, status: 1 }); // For rotation jobs
```

### Real-time Architecture

#### WebSocket Event System
```javascript
/**
 * Event-driven architecture for real-time updates
 * Publisher-Subscriber pattern with Socket.io
 */
class WebSocketService {
  constructor() {
    this.connectedUsers = new Map(); // userId -> socket
    this.rooms = new Map();          // roomId -> Set<socketId>
  }
  
  // Broadcast to specific user
  broadcastToUser(userId, event, data) {
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit(event, {
        ...data,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Broadcast to room (e.g., team members)
  broadcastToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }
  
  // Handle real-time usage tracking
  trackUsage(userId, apiKeyId, usageData) {
    // Update database
    this.updateUsageStats(apiKeyId, usageData);
    
    // Broadcast real-time update
    this.broadcastToUser(userId, 'usage_update', {
      apiKeyId,
      usage: usageData,
      stats: this.calculateRealTimeStats(apiKeyId)
    });
  }
}
```

## 🔌 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "subscription": {
      "plan": "free",
      "limits": {
        "apiKeys": 5,
        "monthlyRequests": 1000
      }
    }
  }
}
```

#### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### API Key Management

#### GET /api/keys
Retrieve user's API keys with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term for name/service
- `status` (string): Filter by status (active/inactive/expired)
- `environment` (string): Filter by environment

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "keys": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "OpenAI Production Key",
      "service": "OpenAI",
      "keyId": "ak_prod_abc123",
      "environment": "production",
      "status": "active",
      "lastUsed": "2024-01-15T10:30:00Z",
      "usageCount": 1250,
      "monthlyLimit": 10000,
      "currentMonthUsage": 3420,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

#### POST /api/keys
Create a new API key with encryption.

**Request Body:**
```json
{
  "name": "OpenAI Development Key",
  "service": "OpenAI",
  "apiKey": "sk-1234567890abcdef...",
  "passphrase": "mySecurePassphrase123",
  "description": "Development environment key for testing",
  "environment": "development",
  "monthlyLimit": 5000,
  "tags": ["development", "openai", "testing"]
}
```

**Response (201):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
  "name": "OpenAI Development Key",
  "service": "OpenAI",
  "keyId": "ak_dev_xyz789",
  "environment": "development",
  "status": "active",
  "monthlyLimit": 5000,
  "tags": ["development", "openai", "testing"],
  "createdAt": "2024-01-15T12:00:00Z"
}
```

### Usage Analytics

#### GET /api/usage/:keyId
Get usage statistics for a specific API key.

**Query Parameters:**
- `timeframe` (string): day/week/month/year
- `startDate` (string): ISO date string
- `endDate` (string): ISO date string

**Response (200):**
```json
{
  "keyId": "ak_prod_abc123",
  "timeframe": "week",
  "summary": {
    "totalRequests": 1250,
    "successfulRequests": 1180,
    "failedRequests": 70,
    "successRate": 94.4,
    "averageResponseTime": 245
  },
  "dailyBreakdown": [
    {
      "date": "2024-01-15",
      "requests": 180,
      "errors": 12,
      "avgResponseTime": 230
    }
  ],
  "topEndpoints": [
    {
      "endpoint": "/v1/chat/completions",
      "requests": 850,
      "percentage": 68.0
    }
  ]
}
```

#### POST /api/usage/:keyId/track
Track API usage event (called by client applications).

**Request Body:**
```json
{
  "endpoint": "/v1/chat/completions",
  "method": "POST",
  "statusCode": 200,
  "responseTime": 245,
  "requestSize": 1024,
  "responseSize": 2048,
  "metadata": {
    "model": "gpt-3.5-turbo",
    "tokens": 150
  }
}
```

### Real-time Features

#### WebSocket Events

**Client → Server Events:**
- `authenticate` - Authenticate WebSocket connection
- `subscribe_usage` - Subscribe to usage updates
- `subscribe_notifications` - Subscribe to notifications

**Server → Client Events:**
- `authenticated` - Authentication successful
- `usage_update` - Real-time usage data
- `api_key_update` - API key changes
- `notification` - New notification
- `system_alert` - System-wide alerts

**Example WebSocket Usage:**
```javascript
// Client-side WebSocket connection
const socket = io('ws://localhost:8080');

// Authenticate
socket.emit('authenticate', localStorage.getItem('token'));

// Listen for real-time updates
socket.on('usage_update', (data) => {
  console.log('Usage update:', data);
  updateDashboard(data);
});

socket.on('api_key_update', (data) => {
  console.log('API key update:', data);
  refreshApiKeysList();
});
```

## ⚡ Performance Optimizations

### Database Optimizations

#### Indexing Strategy
```javascript
// Compound indexes for common query patterns
db.apikeys.createIndex({ "userId": 1, "status": 1 });
db.apikeys.createIndex({ "userId": 1, "environment": 1 });
db.apikeys.createIndex({ "service": 1, "createdAt": -1 });

// Text index for search functionality
db.apikeys.createIndex({
  "name": "text",
  "service": "text", 
  "description": "text"
});

// TTL index for automatic cleanup
db.usage.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 2592000 }); // 30 days
```

#### Query Optimization
```javascript
// Efficient pagination with skip/limit
const getApiKeys = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  
  // Use aggregation pipeline for complex queries
  return await ApiKey.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'usage',
        localField: '_id',
        foreignField: 'apiKeyId',
        as: 'recentUsage',
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);
};
```

### Caching Implementation

#### Redis Caching Strategy
```javascript
class CacheService {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
    this.memoryCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
  }
  
  // Cache with automatic serialization
  async set(key, value, ttl = 3600) {
    const serialized = JSON.stringify(value);
    await this.redis.setex(key, ttl, serialized);
    this.memoryCache.set(key, value, Math.min(ttl, 300));
  }
  
  // Multi-level cache retrieval
  async get(key) {
    // L1: Memory cache
    let value = this.memoryCache.get(key);
    if (value) return value;
    
    // L2: Redis cache
    const cached = await this.redis.get(key);
    if (cached) {
      value = JSON.parse(cached);
      this.memoryCache.set(key, value, 300);
      return value;
    }
    
    return null;
  }
  
  // Cache invalidation patterns
  async invalidatePattern(pattern) {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}
```

### Frontend Optimizations

#### Code Splitting & Lazy Loading
```javascript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ApiKeysPage = lazy(() => import('./pages/ApiKeysPage'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Component lazy loading with Suspense
function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api-keys" element={<ApiKeysPage />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

#### Memoization & Performance Hooks
```javascript
// Memoized components for expensive renders
const ApiKeyCard = memo(({ apiKey, onUpdate }) => {
  const handleUpdate = useCallback((updates) => {
    onUpdate(apiKey.id, updates);
  }, [apiKey.id, onUpdate]);
  
  return (
    <div className="api-key-card">
      {/* Component content */}
    </div>
  );
});

// Debounced search hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

## 🧪 Testing Strategy

### Unit Testing

#### Backend Unit Tests
```javascript
// API Key service tests
describe('ApiKeyService', () => {
  describe('encryptApiKey', () => {
    it('should encrypt and decrypt API key correctly', async () => {
      const plainKey = 'sk-test123456789';
      const passphrase = 'mySecurePassphrase';
      
      const encrypted = encryptionService.encryptApiKeyWithPassphrase(plainKey, passphrase);
      const decrypted = encryptionService.decryptApiKeyWithPassphrase(encrypted, passphrase);
      
      expect(decrypted).toBe(plainKey);
      expect(encrypted).not.toBe(plainKey);
      expect(encrypted.split(':')).toHaveLength(3); // salt:iv:encrypted
    });
    
    it('should fail with wrong passphrase', () => {
      const plainKey = 'sk-test123456789';
      const encrypted = encryptionService.encryptApiKeyWithPassphrase(plainKey, 'correct');
      
      expect(() => {
        encryptionService.decryptApiKeyWithPassphrase(encrypted, 'wrong');
      }).toThrow();
    });
  });
});
```

#### Frontend Unit Tests
```javascript
// Component testing with React Testing Library
describe('ApiKeyCard', () => {
  it('renders API key information correctly', () => {
    const mockApiKey = {
      id: '1',
      name: 'Test Key',
      service: 'OpenAI',
      status: 'active',
      lastUsed: '2024-01-15T10:30:00Z'
    };
    
    render(<ApiKeyCard apiKey={mockApiKey} />);
    
    expect(screen.getByText('Test Key')).toBeInTheDocument();
    expect(screen.getByText('OpenAI')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
  
  it('calls onUpdate when edit button is clicked', () => {
    const mockOnUpdate = jest.fn();
    const mockApiKey = { id: '1', name: 'Test Key' };
    
    render(<ApiKeyCard apiKey={mockApiKey} onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(mockOnUpdate).toHaveBeenCalledWith('1', expect.any(Object));
  });
});
```

### Integration Testing

#### API Integration Tests
```javascript
describe('API Keys Integration', () => {
  let authToken;
  
  beforeAll(async () => {
    // Setup test user and get auth token
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    authToken = response.body.token;
  });
  
  it('should create, retrieve, and delete API key', async () => {
    // Create API key
    const createResponse = await request(app)
      .post('/api/keys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Key',
        service: 'OpenAI',
        apiKey: 'sk-test123',
        passphrase: 'secure123'
      });
    
    expect(createResponse.status).toBe(201);
    const keyId = createResponse.body._id;
    
    // Retrieve API keys
    const getResponse = await request(app)
      .get('/api/keys')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.keys).toHaveLength(1);
    
    // Delete API key
    const deleteResponse = await request(app)
      .delete(`/api/keys/${keyId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(deleteResponse.status).toBe(200);
  });
});
```

### End-to-End Testing

#### Cypress E2E Tests
```javascript
// cypress/integration/api-key-management.spec.js
describe('API Key Management Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.login('test@example.com', 'password123');
  });
  
  it('should complete full API key lifecycle', () => {
    // Navigate to API keys page
    cy.get('[data-testid="nav-api-keys"]').click();
    cy.url().should('include', '/api-keys');
    
    // Create new API key
    cy.get('[data-testid="create-api-key-btn"]').click();
    cy.get('[data-testid="api-key-name"]').type('Test OpenAI Key');
    cy.get('[data-testid="api-key-service"]').select('OpenAI');
    cy.get('[data-testid="api-key-value"]').type('sk-test123456789');
    cy.get('[data-testid="passphrase"]').type('mySecurePassphrase');
    cy.get('[data-testid="submit-btn"]').click();
    
    // Verify API key appears in list
    cy.get('[data-testid="api-key-list"]')
      .should('contain', 'Test OpenAI Key')
      .should('contain', 'OpenAI');
    
    // Edit API key
    cy.get('[data-testid="edit-api-key"]').first().click();
    cy.get('[data-testid="api-key-name"]').clear().type('Updated OpenAI Key');
    cy.get('[data-testid="submit-btn"]').click();
    
    // Verify update
    cy.get('[data-testid="api-key-list"]').should('contain', 'Updated OpenAI Key');
    
    // Delete API key
    cy.get('[data-testid="delete-api-key"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();
    
    // Verify deletion
    cy.get('[data-testid="api-key-list"]').should('not.contain', 'Updated OpenAI Key');
  });
});
```

## 🚀 Deployment

### Docker Deployment

#### Multi-stage Dockerfile
```dockerfile
# Backend Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

FROM base AS production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

#### Docker Compose Configuration
```yaml
version: '3.8'

services:
  # Backend API
  backend:
    build:
      context: ./backend
      target: production
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/apikey-management
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  # MongoDB Database
  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
      - ./backend/scripts/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
    environment:
      - MONGO_INITDB_DATABASE=apikey-management
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:6.2-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  mongo_data:
  redis_data:
```

### Production Deployment

#### PM2 Ecosystem Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api-key-backend',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 8080
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
```

#### Nginx Configuration
```nginx
# nginx.conf
upstream backend {
    least_conn;
    server backend:8080;
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Frontend
    location / {
        proxy_pass http://frontend:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /socket.io/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

### Monitoring & Health Checks

#### Health Check Endpoint
```javascript
// Health check with dependency verification
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    dependencies: {}
  };
  
  try {
    // Check MongoDB connection
    await mongoose.connection.db.admin().ping();
    health.dependencies.mongodb = 'connected';
  } catch (error) {
    health.dependencies.mongodb = 'disconnected';
    health.status = 'error';
  }
  
  try {
    // Check Redis connection
    await redis.ping();
    health.dependencies.redis = 'connected';
  } catch (error) {
    health.dependencies.redis = 'disconnected';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## 📈 Monitoring & Analytics

### Application Metrics
- **Response Time**: API endpoint performance tracking
- **Error Rate**: 4xx/5xx error monitoring
- **Throughput**: Requests per second
- **Database Performance**: Query execution time
- **Cache Hit Rate**: Redis cache effectiveness
- **Memory Usage**: Application memory consumption
- **CPU Usage**: Server resource utilization

### Business Metrics
- **User Engagement**: Active users, session duration
- **API Key Usage**: Creation, rotation, deletion rates
- **Feature Adoption**: Dashboard usage patterns
- **Performance Impact**: User experience metrics

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow coding standards and add tests
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

### Code Standards
- **ESLint** configuration for JavaScript/React
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **JSDoc** for function documentation
- **Unit tests** required for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/api-key-management/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/api-key-management/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/api-key-management/discussions)
- **Email**: support@your-domain.com

---

**Built with ❤️ for secure API key management** - A comprehensive solution for modern API key management needs.