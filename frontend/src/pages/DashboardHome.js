import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import CreateApiKeyModal from '../components/CreateApiKeyModal';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalKeys: 0,
    activeKeys: 0,
    todayCalls: 0,
    successRate: 0,
    avgResponseTime: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, keysResponse] = await Promise.all([
        fetch('/api/usage/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('/api/keys', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (statsResponse.ok && keysResponse.ok) {
        const statsData = await statsResponse.json();
        const keysData = await keysResponse.json();
        
        setStats({
          totalKeys: keysData.length,
          activeKeys: keysData.filter(key => key.isActive).length,
          todayCalls: statsData.todayCalls || 0,
          successRate: statsData.successRate || 0,
          avgResponseTime: statsData.avgResponseTime || 0
        });

        // Mock recent activity for now
        setRecentActivity([
          { id: 1, action: 'API Key Added', key: 'OpenAI GPT-4 - Production', time: '2 hours ago', type: 'create' },
          { id: 2, action: 'API Call', key: 'Claude 3 - Development', time: '5 minutes ago', type: 'call' },
          { id: 3, action: 'Usage Alert', key: 'Gemini Pro - Production', time: '1 hour ago', type: 'warning' },
          { id: 4, action: 'Key Updated', key: 'Stability AI - Production', time: '3 hours ago', type: 'rotate' }
        ]);
      }
    } catch (error) {
      showError('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'create':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'call':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      case 'rotate':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your API key security and usage</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create API Key</span>
        </button>
      </div>

      {/* Stats Grid - KeyHaven Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total API Keys */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total API Keys</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalKeys}<span className="text-lg text-gray-400">/5</span></p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Keys */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Keys</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeKeys}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* API Calls Today */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">API Calls Today</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayCalls}</p>
              <p className="text-xs text-gray-400 mt-1">7 day trend</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Security Score */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Security Score</p>
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400 mr-2">+2%</span>
                <span className="text-xs text-gray-400">No security issues</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">7 day trend</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.414-4.414a2 2 0 00-2.828 0L10 11.172 7.414 8.586a2 2 0 00-2.828 2.828l4 4a2 2 0 002.828 0l8-8a2 2 0 000-2.828z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/dashboard/api-keys"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                Manage API Keys
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Store and manage API keys from OpenAI, Claude, Gemini, and other AI services
              </p>
            </div>
            <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
        </Link>

        <Link
          to="/dashboard/analytics"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                View Analytics
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Monitor usage patterns and performance
              </p>
            </div>
            <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </Link>

        <Link
          to="/dashboard/rotation"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                Key Rotation
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Schedule automatic key rotations
              </p>
            </div>
            <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Create API Key Modal */}
      <CreateApiKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onApiKeyCreated={(newKey) => {
          setStats(prev => ({
            ...prev,
            totalKeys: prev.totalKeys + 1,
            activeKeys: prev.activeKeys + 1
          }));
          setShowCreateModal(false);
          showSuccess('API key created successfully!');
        }}
      />
    </div>
  );
};

export default DashboardHome;