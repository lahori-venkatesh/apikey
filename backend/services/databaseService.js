const mongoose = require('mongoose');

class DatabaseService {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
  }

  async connect() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apikey_management';
    
    const options = {
      // Connection pool settings for high load
      maxPoolSize: 50, // Maximum number of connections
      minPoolSize: 5,  // Minimum number of connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take
      
      // Buffering settings
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      
      // Write concern for better performance
      writeConcern: {
        w: 1, // Acknowledge writes to primary only
        j: false // Don't wait for journal
      },
      
      // Auto-index creation (disabled to avoid replica set issues)
      autoIndex: false,
      autoCreate: false
    };

    try {
      await mongoose.connect(MONGODB_URI, options);
      
      this.isConnected = true;
      this.connectionAttempts = 0;
      
      console.log('✅ MongoDB connected with optimized settings');
      console.log(`📊 Pool size: ${options.maxPoolSize}, Min pool: ${options.minPoolSize}`);
      
      // Set up connection event listeners
      this.setupEventListeners();
      
      return true;
    } catch (error) {
      this.connectionAttempts++;
      console.error(`❌ MongoDB connection attempt ${this.connectionAttempts} failed:`, error.message);
      
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection in 5 seconds...`);
        setTimeout(() => this.connect(), 5000);
      } else {
        console.error('💀 Max connection attempts reached. Server will run without database.');
      }
      
      return false;
    }
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  Mongoose disconnected');
      this.isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
  }

  /**
   * Get connection statistics
   */
  getStats() {
    if (!this.isConnected) {
      return { connected: false };
    }

    const db = mongoose.connection.db;
    const readyState = mongoose.connection.readyState;
    
    return {
      connected: this.isConnected,
      readyState: this.getReadyStateText(readyState),
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections).length
    };
  }

  getReadyStateText(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }

  /**
   * Health check for the database
   */
  async healthCheck() {
    try {
      if (!this.isConnected) {
        return { status: 'error', message: 'Database not connected' };
      }

      // Simple ping to check connection
      await mongoose.connection.db.admin().ping();
      
      return { 
        status: 'healthy', 
        message: 'Database connection is healthy',
        stats: this.getStats()
      };
    } catch (error) {
      return { 
        status: 'error', 
        message: `Database health check failed: ${error.message}` 
      };
    }
  }

  /**
   * Create optimized indexes for better query performance
   */
  async createIndexes() {
    try {
      if (!this.isConnected) {
        console.warn('⚠️  Cannot create indexes: Database not connected');
        return;
      }

      console.log('📊 Creating optimized database indexes...');

      // User indexes
      await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
      await mongoose.connection.collection('users').createIndex({ googleId: 1 }, { sparse: true });
      await mongoose.connection.collection('users').createIndex({ createdAt: -1 });

      // API Key indexes
      await mongoose.connection.collection('apikeys').createIndex({ userId: 1 });
      await mongoose.connection.collection('apikeys').createIndex({ userId: 1, status: 1 });
      await mongoose.connection.collection('apikeys').createIndex({ userId: 1, service: 1 });
      await mongoose.connection.collection('apikeys').createIndex({ userId: 1, createdAt: -1 });
      await mongoose.connection.collection('apikeys').createIndex({ keyId: 1 }, { unique: true });
      await mongoose.connection.collection('apikeys').createIndex({ rotationInterval: 1, updatedAt: 1 });

      // Usage indexes
      await mongoose.connection.collection('usages').createIndex({ apiKeyId: 1, timestamp: -1 });
      await mongoose.connection.collection('usages').createIndex({ userId: 1, timestamp: -1 });
      await mongoose.connection.collection('usages').createIndex({ timestamp: -1 });
      
      // TTL index for usage data (auto-delete after 90 days)
      await mongoose.connection.collection('usages').createIndex(
        { timestamp: 1 }, 
        { expireAfterSeconds: 90 * 24 * 60 * 60 }
      );

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
    }
  }
}

module.exports = new DatabaseService();