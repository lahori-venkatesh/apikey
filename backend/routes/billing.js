const express = require('express');
const { authenticate } = require('../middleware/auth');
const tempStorage = require('../temp-storage');
const cacheService = require('../services/cacheService');

const router = express.Router();

// Get current billing information
router.get('/current', authenticate, async (req, res) => {
  try {
    const user = tempStorage.findUserById(req.userId);
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock billing data for demo
    const billingData = {
      plan: user.plan || 'Free',
      planId: user.planId || 'free',
      nextBillingDate: user.nextBillingDate || null,
      currentUsage: {
        apiKeys: apiKeys.length,
        requests: Math.floor(Math.random() * 5000) + 1000, // Mock data
        storage: '2.5 MB' // Mock data
      },
      limits: {
        apiKeys: user.plan === 'Pro' ? -1 : 5, // -1 means unlimited
        requests: user.plan === 'Pro' ? 100000 : 10000,
        storage: user.plan === 'Pro' ? '10 GB' : '100 MB'
      },
      invoices: user.invoices || [
        {
          id: 'inv_001',
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: user.plan === 'Pro' ? 399 : 0,
          status: 'paid',
          plan: user.plan || 'Free',
          currency: 'INR'
        }
      ],
      paymentMethod: user.paymentMethod || null,
      billingAddress: user.billingAddress || null
    };

    res.json(billingData);
  } catch (error) {
    console.error('Error fetching billing data:', error);
    res.status(500).json({ message: 'Server error fetching billing data' });
  }
});

// Get usage statistics
router.get('/usage', authenticate, async (req, res) => {
  try {
    const { period = 'current' } = req.query;
    const apiKeys = tempStorage.findApiKeysByUserId(req.userId);
    
    // Calculate date range based on period
    let startDate, endDate = new Date();
    
    switch (period) {
      case 'last':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      case 'last3':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, 1);
        break;
      default: // current
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }

    // Mock usage data for demo
    const usageData = {
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalRequests: Math.floor(Math.random() * 10000) + 1000,
      successfulRequests: Math.floor(Math.random() * 9000) + 900,
      failedRequests: Math.floor(Math.random() * 100) + 10,
      averageResponseTime: Math.floor(Math.random() * 200) + 100,
      topServices: [
        { service: 'OpenAI', requests: Math.floor(Math.random() * 5000) + 500 },
        { service: 'Anthropic', requests: Math.floor(Math.random() * 3000) + 300 },
        { service: 'Google AI', requests: Math.floor(Math.random() * 2000) + 200 }
      ],
      dailyUsage: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        requests: Math.floor(Math.random() * 500) + 50
      }))
    };

    res.json(usageData);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).json({ message: 'Server error fetching usage data' });
  }
});

// Get invoices
router.get('/invoices', authenticate, async (req, res) => {
  try {
    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mock invoice data
    const invoices = user.invoices || [
      {
        id: 'inv_003',
        date: new Date().toISOString(),
        amount: user.plan === 'Pro' ? 399 : 0,
        status: 'paid',
        plan: user.plan || 'Free',
        currency: 'INR',
        downloadUrl: '/api/billing/invoices/inv_003/download'
      },
      {
        id: 'inv_002',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: user.plan === 'Pro' ? 399 : 0,
        status: 'paid',
        plan: user.plan || 'Free',
        currency: 'INR',
        downloadUrl: '/api/billing/invoices/inv_002/download'
      },
      {
        id: 'inv_001',
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        amount: user.plan === 'Pro' ? 399 : 0,
        status: 'paid',
        plan: user.plan || 'Free',
        currency: 'INR',
        downloadUrl: '/api/billing/invoices/inv_001/download'
      }
    ];

    res.json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ message: 'Server error fetching invoices' });
  }
});

// Download invoice
router.get('/invoices/:invoiceId/download', authenticate, async (req, res) => {
  try {
    const { invoiceId } = req.params;
    
    // Mock PDF generation
    const invoiceData = {
      id: invoiceId,
      date: new Date().toISOString(),
      amount: 399,
      currency: 'INR',
      plan: 'Pro',
      status: 'paid'
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceId}.pdf"`);
    
    // In a real implementation, you'd generate a PDF here
    res.json({
      message: 'PDF generation not implemented in demo',
      invoice: invoiceData
    });
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ message: 'Server error downloading invoice' });
  }
});

// Update payment method
router.post('/payment-method', authenticate, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    tempStorage.updateUser(req.userId, {
      paymentMethod,
      updatedAt: new Date()
    });

    res.json({ message: 'Payment method updated successfully' });
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: 'Server error updating payment method' });
  }
});

// Update billing address
router.post('/address', authenticate, async (req, res) => {
  try {
    const { billingAddress } = req.body;

    if (!billingAddress) {
      return res.status(400).json({ message: 'Billing address is required' });
    }

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    tempStorage.updateUser(req.userId, {
      billingAddress,
      updatedAt: new Date()
    });

    res.json({ message: 'Billing address updated successfully' });
  } catch (error) {
    console.error('Error updating billing address:', error);
    res.status(500).json({ message: 'Server error updating billing address' });
  }
});

// Upgrade to Pro
router.post('/upgrade', authenticate, async (req, res) => {
  try {
    const { paymentMethod, billingAddress } = req.body;

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.plan === 'Pro') {
      return res.status(400).json({ message: 'User is already on Pro plan' });
    }

    // Mock upgrade process
    const nextBillingDate = new Date();
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    tempStorage.updateUser(req.userId, {
      plan: 'Pro',
      planId: 'pro',
      nextBillingDate: nextBillingDate.toISOString(),
      paymentMethod: paymentMethod || user.paymentMethod,
      billingAddress: billingAddress || user.billingAddress,
      updatedAt: new Date()
    });

    // Clear cache
    await cacheService.del(`user:${req.userId}`);

    res.json({
      message: 'Successfully upgraded to Pro plan',
      plan: 'Pro',
      nextBillingDate: nextBillingDate.toISOString()
    });
  } catch (error) {
    console.error('Error upgrading plan:', error);
    res.status(500).json({ message: 'Server error upgrading plan' });
  }
});

// Cancel subscription
router.post('/cancel', authenticate, async (req, res) => {
  try {
    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.plan === 'Free') {
      return res.status(400).json({ message: 'User is already on Free plan' });
    }

    tempStorage.updateUser(req.userId, {
      plan: 'Free',
      planId: 'free',
      nextBillingDate: null,
      cancelledAt: new Date().toISOString(),
      updatedAt: new Date()
    });

    // Clear cache
    await cacheService.del(`user:${req.userId}`);

    res.json({
      message: 'Subscription cancelled successfully. You will retain Pro features until the end of your billing period.',
      plan: 'Free'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Server error cancelling subscription' });
  }
});

module.exports = router;