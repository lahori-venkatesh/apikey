import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';

const BillingUsage = () => {
  const [usageData, setUsageData] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUsageData();
    fetchBillingData();
  }, [selectedPeriod]);

  const fetchUsageData = async () => {
    try {
      const response = await fetch(`/api/usage/stats?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
      } else {
        showError('Failed to fetch usage data');
      }
    } catch (error) {
      showError('Network error fetching usage data');
    }
  };

  const fetchBillingData = async () => {
    try {
      const response = await fetch('/api/billing/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBillingData(data);
      } else {
        // Mock data for demo
        setBillingData({
          plan: 'Free',
          nextBillingDate: null,
          currentUsage: {
            apiKeys: 3,
            requests: 1250,
            storage: '2.5 MB'
          },
          limits: {
            apiKeys: 5,
            requests: 10000,
            storage: '100 MB'
          },
          invoices: [
            {
              id: 'inv_001',
              date: '2024-01-01',
              amount: 0,
              status: 'paid',
              plan: 'Free'
            }
          ]
        });
      }
    } catch (error) {
      showError('Network error fetching billing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    showSuccess('Redirecting to upgrade page...');
    // TODO: Implement upgrade flow
  };

  const handleDownloadInvoice = (invoiceId) => {
    showSuccess(`Downloading invoice ${invoiceId}...`);
    // TODO: Implement invoice download
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const usagePercentage = (current, limit) => Math.min((current / limit) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Billing & Usage</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor your usage and manage your subscription</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="last3">Last 3 Months</option>
          </select>
          {billingData?.plan === 'Free' && (
            <button
              onClick={handleUpgrade}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
            <p className="text-sm text-gray-600">Your subscription details and limits</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{billingData?.plan}</div>
            {billingData?.nextBillingDate && (
              <p className="text-sm text-gray-600">
                Next billing: {new Date(billingData.nextBillingDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Usage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* API Keys Usage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">API Keys</h3>
              <span className="text-sm text-gray-600">
                {billingData?.currentUsage.apiKeys} / {billingData?.limits.apiKeys}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${usagePercentage(billingData?.currentUsage.apiKeys, billingData?.limits.apiKeys)}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {billingData?.limits.apiKeys - billingData?.currentUsage.apiKeys} remaining
            </p>
          </div>

          {/* Requests Usage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Monthly Requests</h3>
              <span className="text-sm text-gray-600">
                {billingData?.currentUsage.requests?.toLocaleString()} / {billingData?.limits.requests?.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${usagePercentage(billingData?.currentUsage.requests, billingData?.limits.requests)}%`
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {(billingData?.limits.requests - billingData?.currentUsage.requests)?.toLocaleString()} remaining
            </p>
          </div>

          {/* Storage Usage */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Storage</h3>
              <span className="text-sm text-gray-600">
                {billingData?.currentUsage.storage} / {billingData?.limits.storage}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: '25%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">97.5 MB remaining</p>
          </div>
        </div>
      </div>

      {/* Usage Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Usage Analytics</h2>
        
        {/* Usage Chart Placeholder */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Chart</h3>
          <p className="text-gray-600">Detailed usage analytics will be displayed here</p>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1,250</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">145ms</div>
            <div className="text-sm text-gray-600">Avg Response</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Active Keys</div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
            <p className="text-sm text-gray-600">Your past invoices and payments</p>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">
            Download All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billingData?.invoices?.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">{invoice.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{invoice.plan}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Prompt for Free Users */}
      {billingData?.plan === 'Free' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Ready to scale up?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Upgrade to Pro for unlimited API keys, advanced analytics, and priority support.
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingUsage;