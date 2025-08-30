// Temporary in-memory storage for development without MongoDB
const users = new Map();
const apiKeys = new Map();
const usage = [];

let userIdCounter = 1;
let apiKeyIdCounter = 1;

const tempStorage = {
  // User operations
  createUser: (userData) => {
    const userId = userIdCounter++;
    const user = {
      _id: userId.toString(),
      id: userId.toString(),
      ...userData,
      createdAt: new Date(),
      lastLogin: new Date()
    };
    users.set(user.email, user);
    return user;
  },

  findUserByEmail: (email) => {
    return users.get(email.toLowerCase());
  },

  findUserById: (id) => {
    for (let user of users.values()) {
      if (user._id === id || user.id === id) {
        return user;
      }
    }
    return null;
  },

  updateUser: (id, updates) => {
    const user = tempStorage.findUserById(id);
    if (user) {
      Object.assign(user, updates);
      users.set(user.email, user);
      return user;
    }
    return null;
  },

  // API Key operations
  createApiKey: (keyData) => {
    const keyId = apiKeyIdCounter++;
    const apiKey = {
      _id: keyId.toString(),
      id: keyId.toString(),
      keyId: `ak_${Math.random().toString(36).substring(2, 15)}`,
      ...keyData,
      isActive: keyData.status === 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    apiKeys.set(keyId.toString(), apiKey);
    return apiKey;
  },

  findApiKeysByUserId: (userId) => {
    const userKeys = [];
    for (let key of apiKeys.values()) {
      if (key.userId === userId) {
        userKeys.push(key);
      }
    }
    return userKeys.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  findApiKeyById: (id) => {
    return apiKeys.get(id);
  },

  findApiKeyByUserAndId: (userId, keyId) => {
    const key = apiKeys.get(keyId);
    return (key && key.userId === userId) ? key : null;
  },

  updateApiKey: (id, updates) => {
    const key = apiKeys.get(id);
    if (key) {
      Object.assign(key, updates, { updatedAt: new Date() });
      apiKeys.set(id, key);
      return key;
    }
    return null;
  },

  deleteApiKey: (id) => {
    return apiKeys.delete(id);
  },

  // Usage operations
  createUsage: (usageData) => {
    const usageRecord = {
      _id: Date.now().toString(),
      ...usageData,
      timestamp: new Date()
    };
    usage.push(usageRecord);
    return usageRecord;
  },

  findUsageByApiKey: (apiKeyId, limit = 100) => {
    return usage
      .filter(u => u.apiKeyId === apiKeyId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  getUsageStats: (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get user's API keys
    const userKeys = tempStorage.findApiKeysByUserId(userId);
    const userKeyIds = userKeys.map(k => k._id);
    
    // Filter today's usage
    const todayUsage = usage.filter(u => 
      userKeyIds.includes(u.apiKeyId) && 
      new Date(u.timestamp) >= today
    );
    
    const totalCalls = todayUsage.length;
    const successfulCalls = todayUsage.filter(u => u.statusCode === 200).length;
    const avgResponseTime = todayUsage.length > 0 
      ? todayUsage.reduce((sum, u) => sum + (u.responseTime || 0), 0) / todayUsage.length 
      : 0;
    
    return {
      todayCalls: totalCalls,
      successRate: totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0,
      avgResponseTime: Math.round(avgResponseTime)
    };
  }
};

module.exports = tempStorage;