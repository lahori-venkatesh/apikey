const express = require('express');
const { authenticate } = require('../middleware/auth');
const tempStorage = require('../temp-storage');
const cacheService = require('../services/cacheService');

const router = express.Router();

// Get user profile
router.get('/', authenticate, async (req, res) => {
  try {
    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/', authenticate, async (req, res) => {
  try {
    const {
      name,
      company,
      jobTitle,
      phone,
      timezone,
      language,
      emailNotifications,
      securityAlerts,
      marketingEmails
    } = req.body;

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    const updates = {
      name: name || user.name,
      company: company || user.company,
      jobTitle: jobTitle || user.jobTitle,
      phone: phone || user.phone,
      timezone: timezone || user.timezone,
      language: language || user.language,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.emailNotifications,
      securityAlerts: securityAlerts !== undefined ? securityAlerts : user.securityAlerts,
      marketingEmails: marketingEmails !== undefined ? marketingEmails : user.marketingEmails,
      updatedAt: new Date()
    };

    const updatedUser = tempStorage.updateUser(req.userId, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear cache
    await cacheService.del(`user:${req.userId}`);

    // Remove sensitive data
    const { password, ...safeUser } = updatedUser;
    res.json({
      message: 'Profile updated successfully',
      user: safeUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // For demo purposes, we'll just update the password
    // In production, you'd verify the current password first
    const encryptionService = require('../services/encryptionService');
    const hashedPassword = await encryptionService.hashPassword(newPassword);

    tempStorage.updateUser(req.userId, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// Enable/disable 2FA
router.post('/2fa', authenticate, async (req, res) => {
  try {
    const { enable } = req.body;

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    tempStorage.updateUser(req.userId, {
      twoFactorEnabled: enable,
      updatedAt: new Date()
    });

    res.json({
      message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: enable
    });
  } catch (error) {
    console.error('Error updating 2FA:', error);
    res.status(500).json({ message: 'Server error updating 2FA' });
  }
});

// Export account data
router.get('/export', authenticate, async (req, res) => {
  try {
    const user = tempStorage.findUserById(req.userId);
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    const usage = tempStorage.findUsageByApiKey ? 
      apiKeys.flatMap(key => tempStorage.findUsageByApiKey(key._id, 1000)) : [];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove sensitive data
    const { password, ...safeUser } = user;
    const safeApiKeys = apiKeys.map(key => {
      const { encryptedKey, ...safeKey } = key;
      return safeKey;
    });

    const exportData = {
      user: safeUser,
      apiKeys: safeApiKeys,
      usage: usage,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="account-export.json"');
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting account data:', error);
    res.status(500).json({ message: 'Server error exporting account data' });
  }
});

// Delete account
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { confirmPassword } = req.body;

    if (!confirmPassword) {
      return res.status(400).json({ message: 'Password confirmation required' });
    }

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's API keys
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    apiKeys.forEach(key => {
      tempStorage.deleteApiKey(key._id);
    });

    // Delete user account
    tempStorage.users.delete(user.email);

    // Clear all related cache
    await cacheService.del(`user:${req.userId}`);
    await cacheService.del(`cache:/api/keys:${req.userId}`);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
});

module.exports = router;