import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';

const RealtimeUsageDashboard = () => {
  const { usageStats, isConnected, trackUsage } = useWebSocket();
  const [recentEvents, setRecentEvents] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate some usage events for demo
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        // Simulate random API usage
        const services = ['OpenAI', 'Anthropic', 'Google AI', 'Cohere'];
        const endpoints = ['/v1/chat/completions', '/v1/completions', '/v1/embeddings'];
        const statusCodes = [200, 200, 200, 200, 400, 500]; // Mostly successful
        
        const mockUsage = {
          apiKeyId: 'demo_key_' + Math.floor(Math.random() * 3),
          service: services[Math.floor(Math.random() * services.length)],
          endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
          method: 'POST',
          statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
          responseTime: Math.floor(Math.random() * 2000) + 100,
          requestSize: Math.floor(Math.random() * 5000) + 500,
          responseSize: Math.floor(Math.random() * 10000) + 1000,
          timestamp: new Date().toISOString()
        };

        trackUsage(mockUsage);
        
        // Add to recent events for display
        setRecentEvents(prev => [
          {
            id: Date.now(),
            ...mockUsage,
            success: mockUsage.statusCode >= 200 && mockUsage.statusCode < 400
          },
          ...prev.slice(0, 19) // Keep last 20 events
        ]);
      }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds

      return () => clearInterval(interval);
    }
  }, [isConnected, trackUsage]);

  if (!usageStats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  const getResponseTimeColor = (responseTime) => {
    if (responseTime < 500) return 'text-green-600';
    if (responseTime < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requests (5min)</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageStats.periods?.last5min?.totalRequests || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center">
            <div className={`flex items-center ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-xs font-medium">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageStats.periods?.last5min?.successRate || 0}%
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {usageStats.periods?.last5min?.successfulRequests || 0} successful
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageStats.periods?.last5min?.averageResponseTime || 0}ms
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">Last 5 minutes</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Keys</p>
              <p className="text-2xl font-bold text-gray-900">
                {usageStats.apiKeys?.active || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-xs text-gray-500">
              {usageStats.apiKeys?.total || 0} total keys
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900">Live Activity</h3>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>

        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-y-auto`}>
          {recentEvents.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm">No recent activity</p>
              <p className="text-xs text-gray-400 mt-1">API usage will appear here in real-time</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentEvents.map((event) => (
                <div key={event.id} className="px-6 py-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${event.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{event.service}</span>
                          <span className="text-xs text-gray-500">{event.method}</span>
                          <span className="text-xs text-gray-400">{event.endpoint}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`text-xs font-medium ${getStatusColor(event.success)}`}>
                            {event.statusCode}
                          </span>
                          <span className={`text-xs ${getResponseTimeColor(event.responseTime)}`}>
                            {event.responseTime}ms
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round((event.requestSize + event.responseSize) / 1024)}KB
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Services */}
      {usageStats.topServices && usageStats.topServices.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services (24h)</h3>
          <div className="space-y-3">
            {usageStats.topServices.map((service, index) => (
              <div key={service.service} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{service.service}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{service.count} requests</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(service.count / Math.max(...usageStats.topServices.map(s => s.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealtimeUsageDashboard;