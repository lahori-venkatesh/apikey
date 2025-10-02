import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first API key?',
          a: 'Navigate to the Dashboard, click "Add API Key", fill in the required information including service name, key name, and your API key. Don\'t forget to set a secure passphrase for encryption.'
        },
        {
          q: 'What is a passphrase and why do I need it?',
          a: 'A passphrase is used to encrypt your API keys locally before storing them. This ensures that even if our database is compromised, your API keys remain secure. Choose a strong, unique passphrase that you can remember.'
        },
        {
          q: 'How many API keys can I store?',
          a: 'Free accounts can store up to 5 API keys. Pro accounts have unlimited storage. You can upgrade anytime from your billing settings.'
        }
      ]
    },
    {
      category: 'Security',
      questions: [
        {
          q: 'How secure are my API keys?',
          a: 'Your API keys are encrypted using AES-256-GCM encryption with your personal passphrase. We use industry-standard security practices and never store your passphrases.'
        },
        {
          q: 'Can I rotate my API keys automatically?',
          a: 'Yes! You can set rotation intervals (30, 60, 90, 180, or 365 days) for each API key. The system will notify you when keys are due for rotation.'
        },
        {
          q: 'What happens if I forget my passphrase?',
          a: 'Unfortunately, if you forget your passphrase, we cannot recover your encrypted API keys. This is by design for maximum security. You\'ll need to re-add your API keys with a new passphrase.'
        }
      ]
    },
    {
      category: 'Billing',
      questions: [
        {
          q: 'How does billing work?',
          a: 'We offer a free tier with 5 API keys and basic features. Pro plans are billed monthly and include unlimited API keys, advanced analytics, and priority support.'
        },
        {
          q: 'Can I cancel my subscription anytime?',
          a: 'Yes, you can cancel your subscription at any time. Your account will remain active until the end of your current billing period.'
        },
        {
          q: 'Do you offer refunds?',
          a: 'We offer a 30-day money-back guarantee for new Pro subscriptions. Contact support for refund requests.'
        }
      ]
    },
    {
      category: 'API & Integration',
      questions: [
        {
          q: 'Do you have an API for managing keys programmatically?',
          a: 'Yes! We provide a comprehensive REST API for managing your API keys. Check our API Documentation for detailed information and code examples.'
        },
        {
          q: 'What programming languages do you support?',
          a: 'Our API works with any language that can make HTTP requests. We provide examples in JavaScript, Python, and cURL in our documentation.'
        },
        {
          q: 'Are there rate limits on the API?',
          a: 'Yes, we implement rate limiting to ensure fair usage. Free accounts have lower limits than Pro accounts. Check the API documentation for specific limits.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(ticketForm)
      });

      if (response.ok) {
        showSuccess('Support ticket submitted successfully! We\'ll get back to you soon.');
        setTicketForm({
          subject: '',
          category: 'general',
          priority: 'medium',
          description: ''
        });
      } else {
        showError('Failed to submit ticket. Please try again.');
      }
    } catch (error) {
      showError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
        <p className="text-lg text-gray-600">
          Get help with your API key management and find answers to common questions
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Documentation</h3>
          <p className="text-blue-700 text-sm mb-4">Comprehensive guides and API reference</p>
          <button
            onClick={() => setActiveTab('docs')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Docs →
          </button>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-green-900 mb-2">FAQ</h3>
          <p className="text-green-700 text-sm mb-4">Find answers to common questions</p>
          <button
            onClick={() => setActiveTab('faq')}
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Browse FAQ →
          </button>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Contact Support</h3>
          <p className="text-purple-700 text-sm mb-4">Get personalized help from our team</p>
          <button
            onClick={() => setActiveTab('contact')}
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            Contact Us →
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'faq', label: 'FAQ', icon: '❓' },
              { id: 'contact', label: 'Contact Support', icon: '📧' },
              { id: 'status', label: 'System Status', icon: '🟢' },
              { id: 'resources', label: 'Resources', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* FAQ Categories */}
              <div className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => (
                        <details key={faqIndex} className="bg-gray-50 rounded-lg">
                          <summary className="p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 rounded-lg">
                            {faq.q}
                          </summary>
                          <div className="px-4 pb-4 text-gray-600">
                            {faq.a}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No FAQ items found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {/* Contact Support Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit a Support Ticket</h2>
              
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={ticketForm.subject}
                    onChange={handleTicketChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={ticketForm.category}
                      onChange={handleTicketChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Account</option>
                      <option value="feature">Feature Request</option>
                      <option value="security">Security Concern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={ticketForm.priority}
                      onChange={handleTicketChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={ticketForm.description}
                    onChange={handleTicketChange}
                    required
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">support@keymanager.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">Response time: 24-48 hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Status Tab */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-800 font-medium">All systems operational</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { service: 'API Service', status: 'operational', uptime: '99.9%' },
                  { service: 'Dashboard', status: 'operational', uptime: '99.8%' },
                  { service: 'Authentication', status: 'operational', uptime: '100%' },
                  { service: 'Database', status: 'operational', uptime: '99.9%' }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-medium text-gray-900">{service.service}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Uptime: {service.uptime}</div>
                      <div className="text-xs text-green-600 capitalize">{service.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Helpful Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Getting Started Guide</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Complete walkthrough for new users to set up their first API key.
                  </p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                    Read Guide →
                  </a>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Security Best Practices</h3>
                  <p className="text-green-700 text-sm mb-4">
                    Learn how to keep your API keys secure and follow industry standards.
                  </p>
                  <a href="#" className="text-green-600 hover:text-green-800 font-medium">
                    Learn More →
                  </a>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">API Reference</h3>
                  <p className="text-purple-700 text-sm mb-4">
                    Complete API documentation with examples and code samples.
                  </p>
                  <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">
                    View Docs →
                  </a>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-orange-900 mb-3">Video Tutorials</h3>
                  <p className="text-orange-700 text-sm mb-4">
                    Step-by-step video guides for common tasks and features.
                  </p>
                  <a href="#" className="text-orange-600 hover:text-orange-800 font-medium">
                    Watch Videos →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;