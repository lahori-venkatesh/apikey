import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const ApiDocumentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const { showSuccess } = useToast();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess('Code copied to clipboard!');
  };

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: '🚀' },
    { id: 'authentication', title: 'Authentication', icon: '🔐' },
    { id: 'api-keys', title: 'API Keys', icon: '🔑' },
    { id: 'usage-tracking', title: 'Usage Tracking', icon: '📊' },
    { id: 'webhooks', title: 'Webhooks', icon: '🔗' },
    { id: 'rate-limits', title: 'Rate Limits', icon: '⚡' },
    { id: 'errors', title: 'Error Handling', icon: '⚠️' },
    { id: 'sdks', title: 'SDKs & Libraries', icon: '📦' }
  ];

  const codeExamples = {
    javascript: {
      auth: `// Authentication with Bearer Token
const response = await fetch('https://api.example.com/v1/keys', {
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});`,
      createKey: `// Create a new API key
const createApiKey = async () => {
  const response = await fetch('/api/keys', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'My API Key',
      service: 'openai',
      apiKey: 'sk-...',
      passphrase: 'your-secure-passphrase',
      environment: 'production'
    })
  });
  
  const data = await response.json();
  console.log('API Key created:', data);
};`,
      getKeys: `// Get all API keys
const getApiKeys = async () => {
  const response = await fetch('/api/keys', {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  });
  
  const data = await response.json();
  return data.keys;
};`
    },
    python: {
      auth: `# Authentication with Bearer Token
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
}

response = requests.get('https://api.example.com/v1/keys', headers=headers)`,
      createKey: `# Create a new API key
import requests

def create_api_key():
    url = '/api/keys'
    headers = {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
    }
    data = {
        'name': 'My API Key',
        'service': 'openai',
        'apiKey': 'sk-...',
        'passphrase': 'your-secure-passphrase',
        'environment': 'production'
    }
    
    response = requests.post(url, headers=headers, json=data)
    return response.json()`,
      getKeys: `# Get all API keys
import requests

def get_api_keys():
    url = '/api/keys'
    headers = {'Authorization': 'Bearer YOUR_TOKEN'}
    
    response = requests.get(url, headers=headers)
    return response.json()['keys']`
    },
    curl: {
      auth: `# Authentication with Bearer Token
curl -H "Authorization: Bearer YOUR_API_TOKEN" \\
     -H "Content-Type: application/json" \\
     https://api.example.com/v1/keys`,
      createKey: `# Create a new API key
curl -X POST /api/keys \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My API Key",
    "service": "openai",
    "apiKey": "sk-...",
    "passphrase": "your-secure-passphrase",
    "environment": "production"
  }'`,
      getKeys: `# Get all API keys
curl -H "Authorization: Bearer YOUR_TOKEN" \\
     /api/keys`
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
              <p className="text-gray-600 mb-6">
                Welcome to the API Key Management Platform API. This guide will help you get started with managing your API keys programmatically.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Base URL</h3>
              <code className="text-blue-800 bg-blue-100 px-2 py-1 rounded">
                https://api.keymanager.com/v1
              </code>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Start</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Obtain your API token from the dashboard</li>
                <li>Include the token in the Authorization header</li>
                <li>Make requests to the API endpoints</li>
                <li>Handle responses and errors appropriately</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Example Request</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{codeExamples[selectedLanguage].auth}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage].auth)}
                  className="mt-2 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
              <p className="text-gray-600 mb-6">
                All API requests must be authenticated using a Bearer token in the Authorization header.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Security Note</h3>
              <p className="text-yellow-800">
                Keep your API tokens secure and never expose them in client-side code. Rotate tokens regularly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Getting Your Token</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Log in to your dashboard</li>
                <li>Navigate to Profile Settings</li>
                <li>Generate a new API token</li>
                <li>Copy and store the token securely</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Authentication Example</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{codeExamples[selectedLanguage].auth}
                </pre>
                <button
                  onClick={() => copyToClipboard(codeExamples[selectedLanguage].auth)}
                  className="mt-2 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        );

      case 'api-keys':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">API Keys Management</h2>
              <p className="text-gray-600 mb-6">
                Manage your API keys programmatically with full CRUD operations.
              </p>
            </div>

            <div className="space-y-8">
              {/* Create API Key */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Create API Key</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <code className="text-green-800">POST /api/keys</code>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{codeExamples[selectedLanguage].createKey}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeExamples[selectedLanguage].createKey)}
                    className="mt-2 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Get API Keys */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Get API Keys</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <code className="text-blue-800">GET /api/keys</code>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
{codeExamples[selectedLanguage].getKeys}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(codeExamples[selectedLanguage].getKeys)}
                    className="mt-2 px-3 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* API Endpoints Table */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Endpoints</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Method</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Endpoint</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-green-600 font-mono">POST</td>
                        <td className="px-4 py-3 text-sm font-mono">/api/keys</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Create a new API key</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-blue-600 font-mono">GET</td>
                        <td className="px-4 py-3 text-sm font-mono">/api/keys</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Get all API keys</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-blue-600 font-mono">GET</td>
                        <td className="px-4 py-3 text-sm font-mono">/api/keys/:id</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Get specific API key</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-yellow-600 font-mono">PUT</td>
                        <td className="px-4 py-3 text-sm font-mono">/api/keys/:id</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Update API key</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-red-600 font-mono">DELETE</td>
                        <td className="px-4 py-3 text-sm font-mono">/api/keys/:id</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Delete API key</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'rate-limits':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rate Limits</h2>
              <p className="text-gray-600 mb-6">
                Our API implements rate limiting to ensure fair usage and system stability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">General API</h3>
                <p className="text-blue-800">1,000 requests per 15 minutes</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Authentication</h3>
                <p className="text-green-800">10 attempts per 15 minutes</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Key Creation</h3>
                <p className="text-purple-800">20 keys per hour</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Heavy Operations</h3>
                <p className="text-orange-800">100 operations per hour</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Rate Limit Headers</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
Retry-After: 900`}
                </pre>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Section Coming Soon</h2>
            <p className="text-gray-600">This documentation section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentation</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">API Documentation</h1>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="curl">cURL</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;