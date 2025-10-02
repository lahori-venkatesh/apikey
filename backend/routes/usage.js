const express = require('express');
const Usage = require('../models/Usage');
const ApiKey = require('../models/ApiKey');
const { authenticate } = require('../middleware/auth');
const tempStorage = require('../temp-storage');
const realtimeUsageService = require('../services/realtimeUsageService');
const websocketService = require('../services/websocketService');

const router = express.Router();

// Get usage statistics for user
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = tempStorage.getUsageStats(req.userId);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    res.status(500).json({ message: 'Server error fetching usage statistics' });
  }
});

// Get detailed usage for specific API key
router.get('/key/:keyId', authenticate, async (req, res) => {
  try {
    const { keyId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    // Find API key by keyId and verify ownership
    const userKeys = tempStorage.findApiKeysByUserId(req.userId);
    const apiKey = userKeys.find(key => key.keyId === keyId);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    const usage = tempStorage.findUsageByApiKey(apiKey._id, parseInt(limit));
    res.json(usage);
  } catch (error) {
    console.error('Error fetching API key usage:', error);
    res.status(500).json({ message: 'Server error fetching API key usage' });
  }
});

// Get usage analytics (aggregated data)
router.get('/analytics', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '7d' } = req.query;

    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // For now, return empty analytics since we don't have complex aggregation in temp storage
    res.json([]);
  } catch (error) {
    console.error('Error fetching usage analytics:', error);
    res.status(500).json({ message: 'Server error fetching usage analytics' });
  }
});

// Record API usage (this would typically be called by your API gateway)
router.post('/record', authenticate, async (req, res) => {
  try {
    const {
      apiKeyId,
      service,
      endpoint,
      method,
      statusCode,
      responseTime,
      requestSize,
      responseSize,
      userAgent,
      ipAddress
    } = req.body;

    // Verify the API key belongs to the user
    const apiKey = tempStorage.findApiKeyByUserAndId(req.userId, apiKeyId);

    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    // Track usage in real-time service
    await realtimeUsageService.trackUsage(req.userId, {
      apiKeyId,
      service: service || apiKey.service,
      endpoint,
      method,
      statusCode,
      responseTime,
      requestSize,
      responseSize,
      userAgent,
      ipAddress
    });

    res.status(201).json({ message: 'Usage recorded successfully' });
  } catch (error) {
    console.error('Error recording usage:', error);
    res.status(500).json({ message: 'Server error recording usage' });
  }
});

// Get real-time usage statistics
router.get('/realtime', authenticate, async (req, res) => {
  try {
    const stats = realtimeUsageService.getCachedStats(req.userId);
    if (stats) {
      res.json(stats);
    } else {
      // Calculate fresh stats if not cached
      const freshStats = await realtimeUsageService.calculateRealtimeStats(req.userId);
      res.json(freshStats || {});
    }
  } catch (error) {
    console.error('Error fetching real-time usage:', error);
    res.status(500).json({ message: 'Server error fetching real-time usage' });
  }
});

// Generate usage report
router.get('/report', authenticate, async (req, res) => {
  try {
    const { period = '24h' } = req.query;
    const report = await realtimeUsageService.generateUsageReport(req.userId, period);
    
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: 'No usage data found for the specified period' });
    }
  } catch (error) {
    console.error('Error generating usage report:', error);
    res.status(500).json({ message: 'Server error generating usage report' });
  }
});

module.exports = router;