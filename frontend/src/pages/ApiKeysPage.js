import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import CreateApiKeyModal from '../components/CreateApiKeyModal';

const ApiKeysPage = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnvironment, setFilterEnvironment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('API Keys Response:', data); // Debug log
        // Handle the new API response format that returns {keys: [], pagination: {}}
        const keys = data.keys || data || [];
        setApiKeys(Array.isArray(keys) ? keys : []);
      } else {
        showError('Failed to fetch API keys');
        setApiKeys([]);
      }
    } catch (error) {
      showError('Network error. Please try again.');
      setApiKeys([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyCreated = (newKey) => {
    setApiKeys(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [newKey, ...safePrev];
    });
    setShowCreateModal(false);
  };

  const deleteApiKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setApiKeys(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return safePrev.filter(key => key._id !== keyId);
        });
        showSuccess('API key deleted successfully!');
      } else {
        showError('Failed to delete API key');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSuccess('API key copied to clipboard!');
  };

  const regenerateKey = async (keyId) => {
    if (!window.confirm('Are you sure you want to regenerate this API key? The old key will stop working immediately.')) {
      return;
    }

    try {
      const response = await fetch(`/api/keys/${keyId}/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        showSuccess('API key regenerated successfully!');
        // Show the new key in a modal or alert
        alert(`New API Key: ${data.actualKey}\n\nPlease copy this key now as it won't be shown again.`);
      } else {
        showError('Failed to regenerate API key');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    }
  };

  // Ensure apiKeys is always an array to prevent filter errors
  const safeApiKeys = Array.isArray(apiKeys) ? apiKeys : [];
  
  const filteredKeys = safeApiKeys.filter(key => {
    const matchesSearch = key.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = filterEnvironment === 'all' || key.environment === filterEnvironment;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && key.isActive) ||
                         (filterStatus === 'inactive' && !key.isActive);
    
    return matchesSearch && matchesEnvironment && matchesStatus;
  });

  const getEnvironmentBadge = (environment) => {
    const colors = {
      production: 'bg-red-100 text-red-800',
      staging: 'bg-yellow-100 text-yellow-800',
      development: 'bg-green-100 text-green-800',
      testing: 'bg-blue-100 text-blue-800'
    };
    return colors[environment] || 'bg-gray-100 text-gray-800';
  };

  const getServiceIcon = (service) => {
    const icons = {
      openai: '🤖',
      anthropic: '🧠',
      google: '💎',
      cohere: '🔮',
      huggingface: '🤗',
      replicate: '🔄',
      stability: '🎨',
      elevenlabs: '🎵',
      pinecone: '🌲',
      custom: '⚙️'
    };
    return icons[service] || '🔑';
  };

  const getServiceName = (service) => {
    const names = {
      openai: 'OpenAI',
      anthropic: 'Anthropic (Claude)',
      google: 'Google AI (Gemini)',
      cohere: 'Cohere',
      huggingface: 'Hugging Face',
      replicate: 'Replicate',
      stability: 'Stability AI',
      elevenlabs: 'ElevenLabs',
      pinecone: 'Pinecone',
      custom: 'Custom API'
    };
    return names[service] || 'Unknown Service';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
            <p className="text-gray-600 mt-1">Securely store and manage API keys from OpenAI, Claude, Gemini, and other AI services</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {safeApiKeys.length}/5 free keys used
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={safeApiKeys.length >= 5}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                safeApiKeys.length >= 5 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{safeApiKeys.length >= 5 ? 'Limit Reached' : 'Add API Key'}</span>
            </button>
            {safeApiKeys.length >= 5 && (
              <a 
                href="/pricing" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Upgrade to Pro
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
            <select
              value={filterEnvironment}
              onChange={(e) => setFilterEnvironment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Environments</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
              <option value="testing">Testing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterEnvironment('all');
                setFilterStatus('all');
              }}
              className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredKeys.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys stored</h3>
            <p className="text-gray-500 mb-4">
              {safeApiKeys.length === 0 
                ? "Add your first API key from services like OpenAI, Claude, or Gemini to get started" 
                : "No API keys match your current filters"
              }
            </p>
            {safeApiKeys.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add API Key
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service & Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKeys.map((key) => (
                  <tr key={key._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getServiceIcon(key.service)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{key.name}</div>
                          <div className="text-sm text-gray-500">{getServiceName(key.service)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {key.keyId ? `${key.keyId.substring(0, 12)}...` : 'ak_***'}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.keyId)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEnvironmentBadge(key.environment)}`}>
                        {key.environment || 'development'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        key.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {key.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {key.usage || 0} calls
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => regenerateKey(key._id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Regenerate key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteApiKey(key._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete key"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onApiKeyCreated={handleApiKeyCreated}
        currentKeyCount={safeApiKeys.length}
      />
    </div>
  );
};

export default ApiKeysPage;