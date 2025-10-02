const express = require('express');
const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');
const { authenticate } = require('../middleware/auth');
const encryptionService = require('../services/encryptionService');
const tempStorage = require('../temp-storage');
const cacheService = require('../services/cacheService');
const rateLimiter = require('../middleware/rateLimiter');
const websocketService = require('../services/websocketService');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Get all API keys for user with caching
router.get('/', authenticate, cacheService.middleware(300), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, environment } = req.query;
    const skip = (page - 1) * limit;
    
    let apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      apiKeys = apiKeys.filter(key => 
        key.name?.toLowerCase().includes(searchLower) ||
        key.service?.toLowerCase().includes(searchLower) ||
        key.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status) {
      apiKeys = apiKeys.filter(key => key.status === status);
    }
    
    if (environment) {
      apiKeys = apiKeys.filter(key => key.environment === environment);
    }
    
    // Pagination
    const total = apiKeys.length;
    const paginatedKeys = apiKeys.slice(skip, skip + parseInt(limit));
    
    // Remove sensitive data and add computed fields
    const safeKeys = paginatedKeys.map(key => ({
      _id: key._id,
      name: key.name,
      service: key.service,
      description: key.description,
      serviceWebsite: key.serviceWebsite,
      apiDocumentation: key.apiDocumentation,
      keyId: key.keyId,
      environment: key.environment,
      status: key.status,
      isActive: key.isActive,
      monthlyLimit: key.monthlyLimit,
      monthlyCost: key.monthlyCost,
      rotationInterval: key.rotationInterval,
      tags: key.tags,
      lastUsed: key.lastUsed,
      usageCount: key.usageCount || 0,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt
    }));

    res.json({
      keys: safeKeys,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Server error fetching API keys' });
  }
});

// Create new API key with rate limiting
router.post('/', authenticate, rateLimiter.keyCreation(), async (req, res) => {
  try {
    const { 
      name, 
      service, 
      apiKey: userApiKey, 
      passphrase,
      description, 
      serviceWebsite,
      apiDocumentation,
      environment, 
      status, 
      monthlyLimit, 
      monthlyCost,
      rotationInterval,
      tags = [] 
    } = req.body;

    if (!name || !service || !userApiKey || !passphrase) {
      return res.status(400).json({ message: 'Name, service, API key, and passphrase are required' });
    }

    // Encrypt the user's API key with their passphrase
    const encryptedKey = encryptionService.encryptApiKeyWithPassphrase(userApiKey, passphrase);

    // Create API key record
    const apiKey = tempStorage.createApiKey({
      userId: req.userId,
      name,
      service,
      description,
      serviceWebsite,
      apiDocumentation,
      environment: environment || 'development',
      status: status || 'active',
      encryptedKey,
      monthlyLimit: monthlyLimit ? parseInt(monthlyLimit) : null,
      monthlyCost: monthlyCost ? parseFloat(monthlyCost) : null,
      rotationInterval: rotationInterval ? parseInt(rotationInterval) : 90,
      tags: tags || []
    });

    console.log('API key created successfully:', apiKey._id);
    
    // Clear user's API keys cache
    await cacheService.del(`cache:/api/keys:${req.userId}`);
    
    // Send real-time notification
    await notificationService.sendApiKeyCreated(req.userId, apiKey.name, apiKey.service);
    
    // Broadcast real-time update
    websocketService.broadcastToUser(req.userId, 'api_key_update', {
      type: 'created',
      apiKey: {
        _id: apiKey._id,
        name: apiKey.name,
        service: apiKey.service,
        environment: apiKey.environment,
        status: apiKey.status,
        createdAt: apiKey.createdAt
      },
      timestamp: new Date().toISOString()
    });
    
    // Return the API key (without the actual key for security)
    res.status(201).json({
      _id: apiKey._id,
      name: apiKey.name,
      service: apiKey.service,
      description: apiKey.description,
      serviceWebsite: apiKey.serviceWebsite,
      apiDocumentation: apiKey.apiDocumentation,
      keyId: apiKey.keyId,
      environment: apiKey.environment,
      status: apiKey.status,
      isActive: apiKey.isActive,
      monthlyLimit: apiKey.monthlyLimit,
      monthlyCost: apiKey.monthlyCost,
      rotationInterval: apiKey.rotationInterval,
      tags: apiKey.tags,
      lastUsed: apiKey.lastUsed,
      usageCount: apiKey.usageCount || 0,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error creating API key',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific API key
router.get('/:id', authenticate, async (req, res) => {
  try {
    const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, req.params.id);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    // Remove sensitive data
    const { encryptedKey, ...safeKey } = apiKey;
    res.json(safeKey);
  } catch (error) {
    console.error('Error fetching API key:', error);
    res.status(500).json({ message: 'Server error fetching API key' });
  }
});

// Update API key
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, permissions, isActive } = req.body;

    const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, req.params.id);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    // Update fields
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (permissions !== undefined) updates.permissions = permissions;
    if (isActive !== undefined) updates.isActive = isActive;

    const updatedKey = tempStorage.updateApiKey(req.params.id, updates);

    res.json({
      message: 'API key updated successfully',
      apiKey: {
        _id: updatedKey._id,
        name: updatedKey.name,
        description: updatedKey.description,
        keyId: updatedKey.keyId,
        permissions: updatedKey.permissions,
        isActive: updatedKey.isActive,
        createdAt: updatedKey.createdAt,
        updatedAt: updatedKey.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({ message: 'Server error updating API key' });
  }
});

// Delete API key
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, req.params.id);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    tempStorage.deleteApiKey(req.params.id);

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Server error deleting API key' });
  }
});

// Regenerate API key
router.post('/:id/regenerate', authenticate, rateLimiter.heavyOps(), async (req, res) => {
  try {
    const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, req.params.id);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    // Generate new key
    const newActualKey = crypto.randomBytes(32).toString('hex');
    const newEncryptedKey = encryptionService.encryptApiKey(newActualKey);

    // Update the key
    tempStorage.updateApiKey(req.params.id, { 
      encryptedKey: newEncryptedKey,
      updatedAt: new Date()
    });

    // Clear cache
    await cacheService.del(`cache:/api/keys:${req.userId}`);
    await cacheService.del(`cache:/api/keys/${req.params.id}:${req.userId}`);

    res.json({
      message: 'API key regenerated successfully',
      actualKey: newActualKey, // Only returned on regeneration
      keyId: apiKey.keyId
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    res.status(500).json({ message: 'Server error regenerating API key' });
  }
});

// Bulk operations
router.post('/bulk/delete', authenticate, rateLimiter.heavyOps(), async (req, res) => {
  try {
    const { keyIds } = req.body;
    
    if (!Array.isArray(keyIds) || keyIds.length === 0) {
      return res.status(400).json({ message: 'keyIds array is required' });
    }

    if (keyIds.length > 50) {
      return res.status(400).json({ message: 'Cannot delete more than 50 keys at once' });
    }

    let deletedCount = 0;
    const errors = [];

    for (const keyId of keyIds) {
      const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, keyId);
      if (apiKey) {
        tempStorage.deleteApiKey(keyId);
        deletedCount++;
      } else {
        errors.push(`Key ${keyId} not found`);
      }
    }

    // Clear cache
    await cacheService.del(`cache:/api/keys:${req.userId}`);

    res.json({
      message: `Bulk delete completed`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    res.status(500).json({ message: 'Server error in bulk delete' });
  }
});

router.post('/bulk/update-status', authenticate, rateLimiter.heavyOps(), async (req, res) => {
  try {
    const { keyIds, status } = req.body;
    
    if (!Array.isArray(keyIds) || keyIds.length === 0) {
      return res.status(400).json({ message: 'keyIds array is required' });
    }

    if (!['active', 'inactive', 'expired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (keyIds.length > 100) {
      return res.status(400).json({ message: 'Cannot update more than 100 keys at once' });
    }

    let updatedCount = 0;
    const errors = [];

    for (const keyId of keyIds) {
      const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, keyId);
      if (apiKey) {
        tempStorage.updateApiKey(keyId, { 
          status,
          isActive: status === 'active',
          updatedAt: new Date()
        });
        updatedCount++;
      } else {
        errors.push(`Key ${keyId} not found`);
      }
    }

    // Clear cache
    await cacheService.del(`cache:/api/keys:${req.userId}`);

    res.json({
      message: `Bulk status update completed`,
      updatedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in bulk status update:', error);
    res.status(500).json({ message: 'Server error in bulk status update' });
  }
});

// Search API keys
router.get('/search', authenticate, cacheService.middleware(180), async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const searchTerm = q.toLowerCase().trim();
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    
    const results = apiKeys
      .filter(key => 
        key.name?.toLowerCase().includes(searchTerm) ||
        key.service?.toLowerCase().includes(searchTerm) ||
        key.description?.toLowerCase().includes(searchTerm) ||
        key.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .slice(0, parseInt(limit))
      .map(key => ({
        _id: key._id,
        name: key.name,
        service: key.service,
        keyId: key.keyId,
        environment: key.environment,
        status: key.status,
        tags: key.tags,
        createdAt: key.createdAt
      }));

    res.json({
      query: q,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('Error searching API keys:', error);
    res.status(500).json({ message: 'Server error searching API keys' });
  }
});

// Get API key statistics
router.get('/stats', authenticate, cacheService.middleware(600), async (req, res) => {
  try {
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    
    const stats = {
      total: apiKeys.length,
      active: apiKeys.filter(k => k.status === 'active').length,
      inactive: apiKeys.filter(k => k.status === 'inactive').length,
      expired: apiKeys.filter(k => k.status === 'expired').length,
      byEnvironment: {
        development: apiKeys.filter(k => k.environment === 'development').length,
        staging: apiKeys.filter(k => k.environment === 'staging').length,
        production: apiKeys.filter(k => k.environment === 'production').length
      },
      byService: {},
      recentlyCreated: apiKeys.filter(k => 
        new Date(k.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    };

    // Count by service
    apiKeys.forEach(key => {
      const service = key.service || 'unknown';
      stats.byService[service] = (stats.byService[service] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching API key stats:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;