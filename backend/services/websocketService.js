const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const tempStorage = require('../temp-storage');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socket
    this.userSockets = new Map(); // socketId -> userId
    this.rooms = new Map(); // roomId -> Set of socketIds
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventHandlers();
    console.log('✅ WebSocket service initialized');
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', async (token) => {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
          const user = tempStorage.findUserById(decoded.userId);
          
          if (user) {
            socket.userId = decoded.userId;
            socket.userEmail = user.email;
            
            // Store user connection
            this.connectedUsers.set(decoded.userId, socket);
            this.userSockets.set(socket.id, decoded.userId);
            
            // Join user-specific room
            socket.join(`user:${decoded.userId}`);
            
            socket.emit('authenticated', { 
              userId: decoded.userId, 
              email: user.email,
              connectedAt: new Date().toISOString()
            });
            
            // Send initial data
            this.sendInitialData(socket, decoded.userId);
            
            console.log(`✅ User authenticated: ${user.email} (${socket.id})`);
          } else {
            socket.emit('auth_error', { message: 'User not found' });
          }
        } catch (error) {
          console.error('Authentication error:', error.message);
          socket.emit('auth_error', { message: 'Invalid token' });
        }
      });

      // Handle real-time API key operations
      socket.on('api_key_created', (data) => {
        this.broadcastToUser(socket.userId, 'api_key_update', {
          type: 'created',
          apiKey: data,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('api_key_updated', (data) => {
        this.broadcastToUser(socket.userId, 'api_key_update', {
          type: 'updated',
          apiKey: data,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('api_key_deleted', (data) => {
        this.broadcastToUser(socket.userId, 'api_key_update', {
          type: 'deleted',
          apiKeyId: data.id,
          timestamp: new Date().toISOString()
        });
      });

      // Handle usage tracking
      socket.on('track_usage', (data) => {
        this.handleUsageTracking(socket.userId, data);
      });

      // Handle real-time notifications
      socket.on('mark_notification_read', (notificationId) => {
        this.markNotificationAsRead(socket.userId, notificationId);
      });

      // Handle system monitoring
      socket.on('subscribe_monitoring', () => {
        socket.join('monitoring');
        this.sendSystemStats(socket);
      });

      socket.on('unsubscribe_monitoring', () => {
        socket.leave('monitoring');
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
        
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          this.userSockets.delete(socket.id);
        }
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  async sendInitialData(socket, userId) {
    try {
      // Send API keys
      const apiKeys = tempStorage.findApiKeysByUserId(userId);
      socket.emit('initial_api_keys', apiKeys);

      // Send notifications
      const notifications = this.getUserNotifications(userId);
      socket.emit('initial_notifications', notifications);

      // Send usage stats
      const usageStats = this.getUserUsageStats(userId);
      socket.emit('initial_usage_stats', usageStats);

    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  broadcastToUser(userId, event, data) {
    if (userId && this.connectedUsers.has(userId)) {
      const socket = this.connectedUsers.get(userId);
      socket.emit(event, data);
    }
  }

  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  broadcastToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  handleUsageTracking(userId, data) {
    try {
      // Create usage record
      const usageRecord = tempStorage.createUsage({
        userId,
        apiKeyId: data.apiKeyId,
        service: data.service,
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        requestSize: data.requestSize,
        responseSize: data.responseSize,
        timestamp: new Date()
      });

      // Broadcast real-time usage update
      this.broadcastToUser(userId, 'usage_update', {
        type: 'new_request',
        usage: usageRecord,
        timestamp: new Date().toISOString()
      });

      // Update real-time stats
      const updatedStats = this.getUserUsageStats(userId);
      this.broadcastToUser(userId, 'usage_stats_update', updatedStats);

    } catch (error) {
      console.error('Error handling usage tracking:', error);
    }
  }

  getUserUsageStats(userId) {
    const apiKeys = tempStorage.findApiKeysByUserId(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    let totalResponseTime = 0;

    apiKeys.forEach(key => {
      const usage = tempStorage.findUsageByApiKey ? tempStorage.findUsageByApiKey(key._id, 100) : [];
      const todayUsage = usage.filter(u => new Date(u.timestamp) >= today);
      
      totalRequests += todayUsage.length;
      successfulRequests += todayUsage.filter(u => u.statusCode >= 200 && u.statusCode < 300).length;
      failedRequests += todayUsage.filter(u => u.statusCode >= 400).length;
      totalResponseTime += todayUsage.reduce((sum, u) => sum + (u.responseTime || 0), 0);
    });

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: totalRequests > 0 ? Math.round(totalResponseTime / totalRequests) : 0,
      successRate: totalRequests > 0 ? Math.round((successfulRequests / totalRequests) * 100) : 0,
      timestamp: new Date().toISOString()
    };
  }

  getUserNotifications(userId) {
    // Mock notifications for demo
    return [
      {
        id: 'notif_1',
        type: 'info',
        title: 'Welcome to API Key Manager',
        message: 'Your account has been set up successfully!',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif_2',
        type: 'warning',
        title: 'API Key Rotation Due',
        message: 'Your OpenAI API key is due for rotation in 7 days.',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  markNotificationAsRead(userId, notificationId) {
    // In a real app, this would update the database
    this.broadcastToUser(userId, 'notification_updated', {
      id: notificationId,
      read: true,
      timestamp: new Date().toISOString()
    });
  }

  sendSystemStats(socket) {
    const stats = {
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        connectedUsers: this.connectedUsers.size,
        totalSockets: this.io.engine.clientsCount
      },
      database: {
        users: tempStorage.users.size,
        apiKeys: Array.from(tempStorage.users.values())
          .reduce((total, user) => total + tempStorage.findApiKeysByUserId(user._id).length, 0)
      },
      timestamp: new Date().toISOString()
    };

    socket.emit('system_stats', stats);
  }

  // Periodic system updates
  startPeriodicUpdates() {
    // Send system stats to monitoring subscribers every 5 seconds
    setInterval(() => {
      this.io.to('monitoring').emit('system_stats_update', {
        connectedUsers: this.connectedUsers.size,
        totalSockets: this.io.engine.clientsCount,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
      });
    }, 5000);

    // Send usage updates every 30 seconds
    setInterval(() => {
      this.connectedUsers.forEach((socket, userId) => {
        const stats = this.getUserUsageStats(userId);
        socket.emit('usage_stats_update', stats);
      });
    }, 30000);
  }

  // Notification system
  sendNotification(userId, notification) {
    this.broadcastToUser(userId, 'new_notification', {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    });
  }

  sendSystemAlert(message, type = 'info') {
    this.broadcastToAll('system_alert', {
      id: `alert_${Date.now()}`,
      type,
      message,
      timestamp: new Date().toISOString()
    });
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.keys());
  }

  isUserConnected(userId) {
    return this.connectedUsers.has(userId);
  }
}

module.exports = new WebSocketService();