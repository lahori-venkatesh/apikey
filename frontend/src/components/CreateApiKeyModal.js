import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../contexts/ToastContext';

const CreateApiKeyModal = ({ isOpen, onClose, onApiKeyCreated, currentKeyCount = 0 }) => {
  const [formData, setFormData] = useState({
    service: '',
    keyName: '',
    apiKey: '',
    passphrase: '',
    environment: 'development',
    status: 'active',
    description: '',
    serviceWebsite: '',
    apiDocumentation: '',
    monthlyLimit: '',
    monthlyCost: '',
    rotationInterval: '90',
    tags: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [serviceSuggestions, setServiceSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { showSuccess, showError } = useToast();

  const popularServices = [
    { 
      value: 'openai', 
      label: 'OpenAI', 
      icon: '🤖',
      placeholder: 'sk-...',
      description: 'GPT-4, GPT-3.5, DALL-E, Whisper'
    },
    { 
      value: 'anthropic', 
      label: 'Anthropic', 
      icon: '🧠',
      placeholder: 'sk-ant-...',
      description: 'Claude 3, Claude 2'
    },
    { 
      value: 'google', 
      label: 'Google AI', 
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
    }
  ];

  const MAX_FREE_KEYS = 5;

  const environments = [
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' }
  ];

  const rotationIntervals = [
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '180 days' },
    { value: '365', label: '365 days' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle service input with suggestions
    if (name === 'service') {
      const filtered = popularServices.filter(service => 
        service.label.toLowerCase().includes(value.toLowerCase()) ||
        service.value.toLowerCase().includes(value.toLowerCase())
      );
      setServiceSuggestions(filtered);
      setShowSuggestions(value.length > 0 && filtered.length > 0);
    }
  };

  const handleServiceSelect = (service) => {
    setFormData(prev => ({
      ...prev,
      service: service.label
    }));
    setShowSuggestions(false);
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
    return popularServices.find(s => s.label.toLowerCase() === formData.service.toLowerCase() || s.value === formData.service);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user has reached the free limit
    if (currentKeyCount >= MAX_FREE_KEYS) {
      showError(`You've reached the limit of ${MAX_FREE_KEYS} free API keys. Upgrade to Pro to add unlimited keys.`);
      return;
    }

    setIsLoading(true);

    try {
      const selectedService = getSelectedService();
      const requestData = {
        name: formData.keyName,
        service: selectedService ? selectedService.value : formData.service.toLowerCase().replace(/\s+/g, ''),
        apiKey: formData.apiKey,
        passphrase: formData.passphrase,
        description: formData.description,
        serviceWebsite: formData.serviceWebsite,
        apiDocumentation: formData.apiDocumentation,
        environment: formData.environment,
        status: formData.status,
        monthlyLimit: formData.monthlyLimit ? parseInt(formData.monthlyLimit) : null,
        monthlyCost: formData.monthlyCost ? parseFloat(formData.monthlyCost) : null,
        rotationInterval: parseInt(formData.rotationInterval),
        tags: formData.tags
      };
      
      console.log('Sending API key creation request:', { ...requestData, apiKey: '[HIDDEN]' });
      
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const newKey = await response.json();
        setShowApiKey(true);
        showSuccess('API key stored successfully!');
        onApiKeyCreated(newKey);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('API Error:', response.status, errorData);
        showError(errorData.message || `Failed to store API key (${response.status})`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      showError(`Network error: ${error.message}. Please check if the server is running.`);
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
      passphrase: '',
      environment: 'development',
      status: 'active',
      description: '',
      serviceWebsite: '',
      apiDocumentation: '',
      monthlyLimit: '',
      monthlyCost: '',
      rotationInterval: '90',
      tags: []
    });
    setShowApiKey(false);
    setNewTag('');
    onClose();
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out scale-100"
        style={{ zIndex: 1000000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {showApiKey ? 'API Key Configuration Complete' : 'Add API Key'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {showApiKey ? 'Your API key has been securely encrypted and stored' : 'Configure and store your API credentials'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-6">

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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Usage Counter */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {currentKeyCount} of {MAX_FREE_KEYS} API keys used
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {MAX_FREE_KEYS - currentKeyCount} API keys remaining on Free Tier
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentKeyCount / MAX_FREE_KEYS) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{Math.round((currentKeyCount / MAX_FREE_KEYS) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Enhanced Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900">Enhanced Security</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your API key will be encrypted locally using a passphrase you provide. This ensures maximum security - even if our database is compromised, your API keys remain protected. Your passphrase is never stored or transmitted.
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Limit Notice */}
            {currentKeyCount >= MAX_FREE_KEYS - 1 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-amber-900">
                      {currentKeyCount === MAX_FREE_KEYS - 1 ? 'Plan Limit Notice' : 'Plan Limit Reached'}
                    </h4>
                    <p className="text-sm text-amber-700 mt-1">
                      {currentKeyCount === MAX_FREE_KEYS - 1 
                        ? `This will be your ${MAX_FREE_KEYS}th API key. Consider upgrading to Professional for unlimited storage.`
                        : `You have reached the ${MAX_FREE_KEYS}-key limit for your current plan. Upgrade to Professional for unlimited API keys.`
                      }
                    </p>
                    <button type="button" className="text-sm text-amber-800 font-medium hover:text-amber-900 mt-2">
                      View Upgrade Options
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Service Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  onFocus={() => setShowSuggestions(serviceSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., OpenAI, Anthropic, Custom API"
                />
                
                {/* Service Suggestions Dropdown */}
                {showSuggestions && serviceSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {serviceSuggestions.map((service) => (
                      <button
                        key={service.value}
                        type="button"
                        onClick={() => handleServiceSelect(service)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-xl">{service.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{service.label}</div>
                          <div className="text-xs text-gray-500">{service.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Key Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Key Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="keyName"
                value={formData.keyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a descriptive name for this API key"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                API Key <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder={getSelectedService()?.placeholder || "Enter your API key"}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Your API key will be encrypted with a passphrase before being stored</p>
            </div>

            {/* Passphrase */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Encryption Passphrase <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="passphrase"
                value={formData.passphrase}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a strong passphrase for encryption"
              />
              <p className="text-xs text-gray-500 mt-1">This passphrase will be used to encrypt your API key locally. Keep it secure!</p>
            </div>

            {/* Environment & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Environment
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
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Describe the purpose and usage of this API key"
              />
            </div>

            {/* Service Website & API Documentation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Service Website (Optional)
                </label>
                <input
                  type="url"
                  name="serviceWebsite"
                  value={formData.serviceWebsite}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  API Documentation (Optional)
                </label>
                <input
                  type="url"
                  name="apiDocumentation"
                  value={formData.apiDocumentation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://docs.example.com/api"
                />
              </div>
            </div>

            {/* Usage Limits & Cost */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Monthly Usage Limit (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="monthlyLimit"
                    value={formData.monthlyLimit}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1000"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-sm text-gray-500">requests</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Monthly Cost (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <span className="text-sm text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="monthlyCost"
                    value={formData.monthlyCost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="25.00"
                  />
                </div>
              </div>
            </div>

            {/* Rotation Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rotation Interval (Days)
              </label>
              <select
                name="rotationInterval"
                value={formData.rotationInterval}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {rotationIntervals.map(interval => (
                  <option key={interval.value} value={interval.value}>{interval.label}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
                  placeholder="Add organizational tags"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || currentKeyCount >= MAX_FREE_KEYS}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Storing...
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
    </div>
  );

  // Render modal in a portal at document body level
  return ReactDOM.createPortal(modalContent, document.body);
};

export default CreateApiKeyModal;