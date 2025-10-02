import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useToast } from './ToastContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const { showSuccess, showError, showWarning } = useToast();

  // Initialize WebSocket connection
  const connect = useCallback((token) => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:8080', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
      
      // Authenticate with token
      if (token) {
        newSocket.emit('authenticate', token);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('authenticated', (data) => {
      console.log('✅ WebSocket authenticated:', data);
      showSuccess('Real-time connection established');
    });

    newSocket.on('auth_error', (error) => {
      console.error('❌ WebSocket auth error:', error);
      showError('Failed to establish real-time connection');
    });

    // Handle initial data
    newSocket.on('initial_api_keys', (keys) => {
      setApiKeys(keys);
    });

    newSocket.on('initial_notifications', (notifs) => {
      setNotifications(notifs);
    });

    newSocket.on('initial_usage_stats', (stats) => {
      setUsageStats(stats);
    });

    // Handle real-time updates
    newSocket.on('api_key_update', (update) => {
      handleApiKeyUpdate(update);
    });

    newSocket.on('usage_event', (data) => {
      handleUsageEvent(data);
    });

    newSocket.on('usage_stats_update', (stats) => {
      setUsageStats(stats);
    });

    newSocket.on('new_notification', (notification) => {
      handleNewNotification(notification);
    });

    newSocket.on('notification_updated', (update) => {
      handleNotificationUpdate(update);
    });

    newSocket.on('system_notification', (notification) => {
      handleSystemNotification(notification);
    });

    newSocket.on('system_stats', (stats) => {
      setSystemStats(stats);
    });

    newSocket.on('system_stats_update', (stats) => {
      setSystemStats(prev => ({ ...prev, ...stats }));
    });

    newSocket.on('system_alert', (alert) => {
      handleSystemAlert(alert);
    });

    // Handle errors
    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return newSocket;
  }, [showSuccess, showError]);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  // Handle API key updates
  const handleApiKeyUpdate = useCallback((update) => {
    setApiKeys(prev => {
      switch (update.type) {
        case 'created':
          return [update.apiKey, ...prev];
        case 'updated':
          return prev.map(key => 
            key._id === update.apiKey._id ? { ...key, ...update.apiKey } : key
          );
        case 'deleted':
          return prev.filter(key => key._id !== update.apiKeyId);
        default:
          return prev;
      }
    });

    // Show toast notification
    switch (update.type) {
      case 'created':
        showSuccess(`API key "${update.apiKey.name}" created successfully`);
        break;
      case 'updated':
        showSuccess(`API key "${update.apiKey.name}" updated successfully`);
        break;
      case 'deleted':
        showSuccess('API key deleted successfully');
        break;
    }
  }, [showSuccess]);

  // Handle usage events
  const handleUsageEvent = useCallback((data) => {
    // You can add real-time usage visualization here
    console.log('📊 New usage event:', data);
  }, []);

  // Handle new notifications
  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast based on notification type
    switch (notification.type) {
      case 'success':
        showSuccess(notification.message);
        break;
      case 'warning':
        showWarning(notification.message);
        break;
      case 'error':
        showError(notification.message);
        break;
      default:
        showSuccess(notification.message);
    }
  }, [showSuccess, showWarning, showError]);

  // Handle notification updates
  const handleNotificationUpdate = useCallback((update) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === update.id ? { ...notif, ...update } : notif
      )
    );
  }, []);

  // Handle system notifications
  const handleSystemNotification = useCallback((notification) => {
    showSuccess(notification.message, { duration: 5000 });
  }, [showSuccess]);

  // Handle system alerts
  const handleSystemAlert = useCallback((alert) => {
    switch (alert.type) {
      case 'error':
        showError(alert.message);
        break;
      case 'warning':
        showWarning(alert.message);
        break;
      default:
        showSuccess(alert.message);
    }
  }, [showSuccess, showWarning, showError]);

  // WebSocket event emitters
  const trackUsage = useCallback((usageData) => {
    if (socket && isConnected) {
      socket.emit('track_usage', usageData);
    }
  }, [socket, isConnected]);

  const markNotificationRead = useCallback((notificationId) => {
    if (socket && isConnected) {
      socket.emit('mark_notification_read', notificationId);
    }
  }, [socket, isConnected]);

  const subscribeToMonitoring = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('subscribe_monitoring');
    }
  }, [socket, isConnected]);

  const unsubscribeFromMonitoring = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('unsubscribe_monitoring');
    }
  }, [socket, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  // Auto-reconnect logic
  useEffect(() => {
    if (socket && !isConnected) {
      const reconnectTimer = setTimeout(() => {
        console.log('🔄 Attempting to reconnect WebSocket...');
        const token = localStorage.getItem('token');
        if (token) {
          connect(token);
        }
      }, 5000);

      return () => clearTimeout(reconnectTimer);
    }
  }, [socket, isConnected, connect]);

  const value = {
    socket,
    isConnected,
    notifications,
    usageStats,
    apiKeys,
    systemStats,
    connect,
    disconnect,
    trackUsage,
    markNotificationRead,
    subscribeToMonitoring,
    unsubscribeFromMonitoring,
    // Notification management
    markAllNotificationsRead: () => {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
    },
    clearNotifications: () => {
      setNotifications([]);
    },
    getUnreadCount: () => {
      return notifications.filter(n => !n.read).length;
    }
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};