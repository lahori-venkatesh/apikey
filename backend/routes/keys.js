const express = require('express');
const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');
const { authenticate } = require('../middleware/auth');
const encryptionService = require('../services/encryptionService');
const tempStorage = require('../temp-storage');

const router = express.Router();

// Get all API keys for user
router.get('/', authenticate, async (req, res) => {
  try {
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    
    // Remove sensitive data
    const safeKeys = apiKeys.map(key => ({
      _id: key._id,
      name: key.name,
      description: key.description,
      keyId: key.keyId,
      permissions: key.permissions,
      isActive: key.isActive,
      createdAt: key.createdAt,
      updatedAt: key.updatedAt,
      usage: 0 // TODO: Calculate from usage data
    }));

    res.json(safeKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Server error fetching API keys' });
  }
});

// Create new API key
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, service, apiKey: userApiKey, description, environment, status, monthlyLimit, costPerRequest, tags = [] } = req.body;

    if (!name || !service || !userApiKey) {
      return res.status(400).json({ message: 'Name, service, and API key are required' });
    }

    // Encrypt the user's API key
    const encryptedKey = encryptionService.encrypt(userApiKey);

    // Create API key record
    const apiKey = tempStorage.createApiKey({
      userId: req.userId,
      name,
      service,
      description,
      environment: environment || 'production',
      status: status || 'active',
      encryptedKey,
      monthlyLimit: monthlyLimit ? parseInt(monthlyLimit) : null,
      costPerRequest: costPerRequest ? parseFloat(costPerRequest) : null,
      tags: tags || []
    });

    // Return the API key (without the actual key for security)
    res.status(201).json({
      _id: apiKey._id,
      name: apiKey.name,
      service: apiKey.service,
      description: apiKey.description,
      keyId: apiKey.keyId,
      environment: apiKey.environment,
      isActive: apiKey.isActive,
      monthlyLimit: apiKey.monthlyLimit,
      costPerRequest: apiKey.costPerRequest,
      tags: apiKey.tags,
      createdAt: apiKey.createdAt,
      usage: 0
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Server error creating API key' });
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
router.post('/:id/regenerate', authenticate, async (req, res) => {
  try {
    const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, req.params.id);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    // Generate new key
    const newActualKey = crypto.randomBytes(32).toString('hex');
    const newEncryptedKey = encryptionService.encrypt(newActualKey);

    // Update the key
    tempStorage.updateApiKey(req.params.id, { 
      encryptedKey: newEncryptedKey 
    });

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

module.exports = router;