const websocketService = require('./websocketService');
const tempStorage = require('../temp-storage');

class NotificationService {
  constructor() {
    this.notifications = new Map(); // userId -> notifications[]
  }

  // Send real-time notification to user
  async sendNotification(userId, notification) {
    try {
      const fullNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        read: false,
        createdAt: new Date().toISOString(),
        expiresAt: notification.expiresAt || null
      };

      // Store notification
      if (!this.notifications.has(userId)) {
        this.notifications.set(userId, []);
      }
      this.notifications.get(userId).unshift(fullNotification);

      // Keep only last 50 notifications per user
      const userNotifications = this.notifications.get(userId);
      if (userNotifications.length > 50) {
        this.notifications.set(userId, userNotifications.slice(0, 50));
      }

      // Send real-time notification if user is connected
      websocketService.sendNotification(userId, fullNotification);

      return fullNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  // Send system-wide notification
  async sendSystemNotification(notification) {
    try {
      const systemNotification = {
        id: `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        createdAt: new Date().toISOString(),
        isSystem: true
      };

      // Send to all connected users
      websocketService.broadcastToAll('system_notification', systemNotification);

      return systemNotification;
    } catch (error) {
      console.error('Error sending system notification:', error);
      return null;
    }
  }

  // Get user notifications
  getUserNotifications(userId, limit = 20) {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.slice(0, limit);
  }

  // Mark notification as read
  markAsRead(userId, notificationId) {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const notification = userNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        
        // Send real-time update
        websocketService.broadcastToUser(userId, 'notification_updated', {
          id: notificationId,
          read: true,
          readAt: notification.readAt
        });
        
        return true;
      }
    }
    return false;
  }

  // Mark all notifications as read
  markAllAsRead(userId) {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const updatedIds = [];
      userNotifications.forEach(notification => {
        if (!notification.read) {
          notification.read = true;
          notification.readAt = new Date().toISOString();
          updatedIds.push(notification.id);
        }
      });

      if (updatedIds.length > 0) {
        websocketService.broadcastToUser(userId, 'notifications_bulk_read', {
          notificationIds: updatedIds,
          readAt: new Date().toISOString()
        });
      }

      return updatedIds.length;
    }
    return 0;
  }

  // Delete notification
  deleteNotification(userId, notificationId) {
    const userNotifications = this.notifications.get(userId);
    if (userNotifications) {
      const index = userNotifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        userNotifications.splice(index, 1);
        
        websocketService.broadcastToUser(userId, 'notification_deleted', {
          id: notificationId
        });
        
        return true;
      }
    }
    return false;
  }

  // Get unread count
  getUnreadCount(userId) {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter(n => !n.read).length;
  }

  // Notification templates
  templates = {
    apiKeyCreated: (keyName, service) => ({
      type: 'success',
      title: 'API Key Created',
      message: `Successfully created API key "${keyName}" for ${service}`,
      data: { keyName, service }
    }),

    apiKeyRotationDue: (keyName, daysLeft) => ({
      type: 'warning',
      title: 'API Key Rotation Due',
      message: `API key "${keyName}" is due for rotation in ${daysLeft} days`,
      data: { keyName, daysLeft }
    }),

    apiKeyExpired: (keyName) => ({
      type: 'error',
      title: 'API Key Expired',
      message: `API key "${keyName}" has expired and needs to be rotated`,
      data: { keyName }
    }),

    usageLimitReached: (percentage, limit) => ({
      type: 'warning',
      title: 'Usage Limit Warning',
      message: `You've used ${percentage}% of your monthly limit (${limit} requests)`,
      data: { percentage, limit }
    }),

    planUpgraded: (newPlan) => ({
      type: 'success',
      title: 'Plan Upgraded',
      message: `Successfully upgraded to ${newPlan} plan`,
      data: { newPlan }
    }),

    securityAlert: (message, details) => ({
      type: 'error',
      title: 'Security Alert',
      message,
      data: details
    }),

    systemMaintenance: (startTime, duration) => ({
      type: 'info',
      title: 'Scheduled Maintenance',
      message: `System maintenance scheduled for ${startTime} (${duration})`,
      data: { startTime, duration }
    })
  };

  // Send templated notifications
  async sendApiKeyCreated(userId, keyName, service) {
    return this.sendNotification(userId, this.templates.apiKeyCreated(keyName, service));
  }

  async sendApiKeyRotationDue(userId, keyName, daysLeft) {
    return this.sendNotification(userId, this.templates.apiKeyRotationDue(keyName, daysLeft));
  }

  async sendApiKeyExpired(userId, keyName) {
    return this.sendNotification(userId, this.templates.apiKeyExpired(keyName));
  }

  async sendUsageLimitWarning(userId, percentage, limit) {
    return this.sendNotification(userId, this.templates.usageLimitReached(percentage, limit));
  }

  async sendPlanUpgraded(userId, newPlan) {
    return this.sendNotification(userId, this.templates.planUpgraded(newPlan));
  }

  async sendSecurityAlert(userId, message, details = {}) {
    return this.sendNotification(userId, this.templates.securityAlert(message, details));
  }

  async sendSystemMaintenance(startTime, duration) {
    return this.sendSystemNotification(this.templates.systemMaintenance(startTime, duration));
  }

  // Cleanup expired notifications
  cleanupExpiredNotifications() {
    const now = new Date();
    
    this.notifications.forEach((userNotifications, userId) => {
      const validNotifications = userNotifications.filter(notification => {
        if (!notification.expiresAt) return true;
        return new Date(notification.expiresAt) > now;
      });
      
      if (validNotifications.length !== userNotifications.length) {
        this.notifications.set(userId, validNotifications);
      }
    });
  }

  // Start periodic cleanup
  startCleanupJob() {
    // Clean up expired notifications every hour
    setInterval(() => {
      this.cleanupExpiredNotifications();
    }, 60 * 60 * 1000);
  }
}

module.exports = new NotificationService();