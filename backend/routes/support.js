const express = require('express');
const { authenticate } = require('../middleware/auth');
const tempStorage = require('../temp-storage');

const router = express.Router();

// Submit support ticket
router.post('/tickets', authenticate, async (req, res) => {
  try {
    const { subject, category, priority, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    const user = tempStorage.findUserById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create support ticket
    const ticket = {
      id: `ticket_${Date.now()}`,
      userId: req.userId,
      userEmail: user.email,
      userName: user.name,
      subject,
      category: category || 'general',
      priority: priority || 'medium',
      description,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: []
    };

    // Store ticket (in a real app, this would go to a database)
    if (!tempStorage.supportTickets) {
      tempStorage.supportTickets = new Map();
    }
    tempStorage.supportTickets.set(ticket.id, ticket);

    // Send confirmation email (mock)
    console.log(`Support ticket created: ${ticket.id} for user ${user.email}`);

    res.status(201).json({
      message: 'Support ticket submitted successfully',
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ message: 'Server error creating support ticket' });
  }
});

// Get user's support tickets
router.get('/tickets', authenticate, async (req, res) => {
  try {
    if (!tempStorage.supportTickets) {
      return res.json({ tickets: [] });
    }

    const userTickets = Array.from(tempStorage.supportTickets.values())
      .filter(ticket => ticket.userId === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ tickets: userTickets });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Server error fetching support tickets' });
  }
});

// Get specific support ticket
router.get('/tickets/:ticketId', authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!tempStorage.supportTickets) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = tempStorage.supportTickets.get(ticketId);

    if (!ticket || ticket.userId !== req.userId) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ message: 'Server error fetching support ticket' });
  }
});

// Add response to support ticket
router.post('/tickets/:ticketId/responses', authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!tempStorage.supportTickets) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = tempStorage.supportTickets.get(ticketId);

    if (!ticket || ticket.userId !== req.userId) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const user = tempStorage.findUserById(req.userId);
    
    const response = {
      id: `response_${Date.now()}`,
      message,
      author: user.name || user.email,
      authorType: 'user',
      createdAt: new Date().toISOString()
    };

    ticket.responses.push(response);
    ticket.updatedAt = new Date().toISOString();
    ticket.status = 'awaiting_response';

    tempStorage.supportTickets.set(ticketId, ticket);

    res.json({
      message: 'Response added successfully',
      response
    });
  } catch (error) {
    console.error('Error adding ticket response:', error);
    res.status(500).json({ message: 'Server error adding ticket response' });
  }
});

// Close support ticket
router.post('/tickets/:ticketId/close', authenticate, async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!tempStorage.supportTickets) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = tempStorage.supportTickets.get(ticketId);

    if (!ticket || ticket.userId !== req.userId) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.status = 'closed';
    ticket.closedAt = new Date().toISOString();
    ticket.updatedAt = new Date().toISOString();

    tempStorage.supportTickets.set(ticketId, ticket);

    res.json({
      message: 'Ticket closed successfully',
      ticket: {
        id: ticket.id,
        status: ticket.status,
        closedAt: ticket.closedAt
      }
    });
  } catch (error) {
    console.error('Error closing support ticket:', error);
    res.status(500).json({ message: 'Server error closing support ticket' });
  }
});

// Get FAQ
router.get('/faq', async (req, res) => {
  try {
    const faq = [
      {
        category: 'Getting Started',
        questions: [
          {
            id: 1,
            question: 'How do I create my first API key?',
            answer: 'Navigate to the Dashboard, click "Add API Key", fill in the required information including service name, key name, and your API key. Don\'t forget to set a secure passphrase for encryption.',
            tags: ['api-key', 'getting-started', 'dashboard']
          },
          {
            id: 2,
            question: 'What is a passphrase and why do I need it?',
            answer: 'A passphrase is used to encrypt your API keys locally before storing them. This ensures that even if our database is compromised, your API keys remain secure. Choose a strong, unique passphrase that you can remember.',
            tags: ['security', 'passphrase', 'encryption']
          }
        ]
      },
      {
        category: 'Security',
        questions: [
          {
            id: 3,
            question: 'How secure are my API keys?',
            answer: 'Your API keys are encrypted using AES-256-GCM encryption with your personal passphrase. We use industry-standard security practices and never store your passphrases.',
            tags: ['security', 'encryption', 'aes-256']
          },
          {
            id: 4,
            question: 'Can I rotate my API keys automatically?',
            answer: 'Yes! You can set rotation intervals (30, 60, 90, 180, or 365 days) for each API key. The system will notify you when keys are due for rotation.',
            tags: ['rotation', 'automation', 'security']
          }
        ]
      },
      {
        category: 'Billing',
        questions: [
          {
            id: 5,
            question: 'How does billing work?',
            answer: 'We offer a free tier with 5 API keys and basic features. Pro plans are billed monthly and include unlimited API keys, advanced analytics, and priority support.',
            tags: ['billing', 'pricing', 'plans']
          },
          {
            id: 6,
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.',
            tags: ['billing', 'cancellation', 'subscription']
          }
        ]
      }
    ];

    res.json({ faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ message: 'Server error fetching FAQ' });
  }
});

// Search FAQ
router.get('/faq/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    // Mock FAQ search
    const searchResults = [
      {
        id: 1,
        question: 'How do I create my first API key?',
        answer: 'Navigate to the Dashboard, click "Add API Key"...',
        category: 'Getting Started',
        relevance: 0.95
      }
    ];

    res.json({
      query: q,
      results: searchResults,
      count: searchResults.length
    });
  } catch (error) {
    console.error('Error searching FAQ:', error);
    res.status(500).json({ message: 'Server error searching FAQ' });
  }
});

// Get system status
router.get('/status', async (req, res) => {
  try {
    const status = {
      overall: 'operational',
      services: [
        {
          name: 'API Service',
          status: 'operational',
          uptime: '99.9%',
          responseTime: '120ms'
        },
        {
          name: 'Dashboard',
          status: 'operational',
          uptime: '99.8%',
          responseTime: '85ms'
        },
        {
          name: 'Authentication',
          status: 'operational',
          uptime: '100%',
          responseTime: '45ms'
        },
        {
          name: 'Database',
          status: 'operational',
          uptime: '99.9%',
          responseTime: '25ms'
        }
      ],
      incidents: [],
      lastUpdated: new Date().toISOString()
    };

    res.json(status);
  } catch (error) {
    console.error('Error fetching system status:', error);
    res.status(500).json({ message: 'Server error fetching system status' });
  }
});

module.exports = router;