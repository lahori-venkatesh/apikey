import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const CreateApiKeyModal = ({ isOpen, onClose, onApiKeyCreated }) => {
  const [formData, setFormData] = useState({
    service: '',
    keyName: '',
    apiKey: '',
    environment: 'production',
    status: 'active',
    description: '',
    monthlyLimit: '',
    costPerRequest: '',
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newTag, setNewTag] = useState('');
  const { showSuccess, showError } = useToast();

  const services = [
    { 
      value: 'openai', 
      label: 'OpenAI', 
      icon: '🤖',
      placeholder: 'sk-...',
      description: 'GPT-4, GPT-3.5, DALL-E, Whisper'
    },
    { 
      value: 'anthropic', 
      label: 'Anthropic (Claude)', 
      icon: '🧠',
      placeholder: 'sk-ant-...',
      description: 'Claude 3, Claude 2'
    },
    { 
      value: 'google', 
      label: 'Google AI (Gemini)', 
      icon: '💎',
      placeholder: 'AIza...',
      description: 'Gemini Pro, Gemini Vision'
    },
    { 
      value: 'cohere', 
      label: 'Cohere', 
      icon: '🔮',
      placeholder: 'co-...',
      description: 'Command, Embed, Classify'
    },
    { 
      value: 'huggingface', 
      label: 'Hugging Face', 
      icon: '🤗',
      placeholder: 'hf_...',
      description: 'Transformers, Inference API'
    },
    { 
      value: 'replicate', 
      label: 'Replicate', 
      icon: '🔄',
      placeholder: 'r8_...',
      description: 'AI Models API'
    },
    { 
      value: 'stability', 
      label: 'Stability AI', 
      icon: '🎨',
      placeholder: 'sk-...',
      description: 'Stable Diffusion'
    },
    { 
      value: 'elevenlabs', 
      label: 'ElevenLabs', 
      icon: '🎵',
      placeholder: 'el_...',
      description: 'Voice Synthesis'
    },
    { 
      value: 'pinecone', 
      label: 'Pinecone', 
      icon: '🌲',
      placeholder: 'pc-...',
      description: 'Vector Database'
    },
    { 
      value: 'custom', 
      label: 'Custom API', 
      icon: '⚙️',
      placeholder: 'Enter your API key',
      description: 'Other API services'
    }
  ];

  const environments = [
    { value: 'production', label: 'Production' },
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'testing', label: 'Testing' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getSelectedService = () => {
    return services.find(s => s.value === formData.service);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.keyName,
          service: formData.service,
          apiKey: formData.apiKey,
          description: formData.description,
          environment: formData.environment,
          status: formData.status,
          monthlyLimit: formData.monthlyLimit ? parseInt(formData.monthlyLimit) : null,
          costPerRequest: formData.costPerRequest ? parseFloat(formData.costPerRequest) : null,
          tags: formData.tags
        })
      });

      if (response.ok) {
        const newKey = await response.json();
        setShowApiKey(true);
        showSuccess('API key stored successfully!');
        onApiKeyCreated(newKey);
      } else {
        const error = await response.json();
        showError(error.message || 'Failed to store API key');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.apiKey);
    showSuccess('API key copied to clipboard!');
  };

  const handleClose = () => {
    setFormData({
      service: '',
      keyName: '',
      apiKey: '',
      environment: 'production',
      status: 'active',
      description: '',
      monthlyLimit: '',
      costPerRequest: '',
      tags: []
    });
    setShowApiKey(false);
    setNewTag('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {showApiKey ? 'API Key Stored Successfully' : 'Add API Key'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {showApiKey ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <h4 className="text-lg font-semibold text-green-800">API Key Stored Successfully!</h4>
              </div>
              <p className="text-green-700 text-sm">
                Your API key has been securely encrypted and stored. You can now monitor its usage and manage it from your dashboard.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getSelectedService()?.icon}</span>
                  <p className="text-gray-900 font-medium">{getSelectedService()?.label}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <p className="text-gray-900 font-medium">{formData.keyName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key (Encrypted)
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-gray-100 p-3 rounded-lg text-sm font-mono">
                    {formData.apiKey.substring(0, 8)}{'*'.repeat(20)}
                  </code>
                  <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs">Encrypted</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Environment
                  </label>
                  <p className="text-gray-900 capitalize">{formData.environment}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    formData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {formData.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Service *
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an AI service</option>
                {services.map(service => (
                  <option key={service.value} value={service.value}>
                    {service.icon} {service.label}
                  </option>
                ))}
              </select>
              {formData.service && (
                <p className="text-xs text-gray-500 mt-1">
                  {services.find(s => s.value === formData.service)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key *
              </label>
              <input
                type="password"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder={formData.service ? services.find(s => s.value === formData.service)?.placeholder : "Enter your API key"}
              />
              <div className="flex items-center mt-1">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-green-600">Your API key will be encrypted and stored securely</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Name *
              </label>
              <input
                type="text"
                name="keyName"
                value={formData.keyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Main Production Key, Development Key"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment *
                </label>
                <select
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {environments.map(env => (
                    <option key={env.value} value={env.value}>{env.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what this API key will be used for..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a tag (e.g., chatbot, image-gen)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Limit (Optional)
                </label>
                <input
                  type="number"
                  name="monthlyLimit"
                  value={formData.monthlyLimit}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 1000 requests"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set a monthly usage limit for cost control
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Request (Optional)
                </label>
                <input
                  type="number"
                  name="costPerRequest"
                  value={formData.costPerRequest}
                  onChange={handleChange}
                  min="0"
                  step="0.0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 0.002"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Track costs (USD per request)
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Store API Key'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateApiKeyModal;