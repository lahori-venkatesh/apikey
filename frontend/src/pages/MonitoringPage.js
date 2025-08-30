import React, { useState, useEffect } from 'react';

const MonitoringPage = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High API Usage',
      message: 'Payment Gateway API has exceeded 80% of rate limit',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'active',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'error',
      title: 'Authentication Failures',
      message: 'Multiple failed authentication attempts detected',
      timestamp: '2024-01-20T09:15:00Z',
      status: 'resolved',
      severity: 'high'
    },
    {
      id: 3,
      type: 'info',
      title: 'Key Rotation Completed',
      message: 'User Service API key has been successfully rotated',
      timestamp: '2024-01-20T08:00:00Z',
      status: 'resolved',
      severity: 'low'
    }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    overall: 'healthy',
    apiGateway: 'healthy',
    database: 'healthy',
    cache: 'warning',
    monitoring: 'healthy'
  });

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    activeConnections: 1247,
    requestsPerSecond: 156,
    errorRate: 0.02,
    avgResponseTime: 142
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealtimeMetrics(prev => ({
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 20) - 10,
        requestsPerSecond: Math.max(0, prev.requestsPerSecond + Math.floor(Math.random() * 40) - 20),
        errorRate: Math.max(0, prev.errorRate + (Math.random() * 0.01) - 0.005),
        avgResponseTime: Math.max(50, prev.avgResponseTime + Math.floor(Math.random() * 20) - 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
      case 'info':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  const getHealthStatus = (status) => {
    switch (status) {
      case 'healthy':
        return { color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' };
      case 'warning':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' };
      case 'error':
        return { color: 'text-red-600', bg: 'bg-red-100', label: 'Error' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const resolveAlert = (id) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, status: 'resolved' } : alert
      )
    );
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and alerts for your API infrastructure</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Connections</p>
              <p className="text-2xl font-bold text-gray-900">{realtimeMetrics.activeConnections.toLocaleString()}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requests/sec</p>
              <p className="text-2xl font-bold text-gray-900">{realtimeMetrics.requestsPerSecond}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(realtimeMetrics.errorRate * 100).toFixed(2)}%</p>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{realtimeMetrics.avgResponseTime}ms</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(systemHealth).map(([component, status]) => {
              const healthStatus = getHealthStatus(status);
              return (
                <div key={component} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {component.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${healthStatus.bg} ${healthStatus.color}`}>
                      {healthStatus.label}
                    </span>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'healthy' ? 'bg-green-500' :
                    status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {alerts.filter(a => a.status === 'active').length} active
            </span>
          </div>
        </div>
        
        {alerts.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts</h3>
            <p className="text-gray-500">All systems are running smoothly</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.status === 'active' ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-75'
                }`}>
                  <div className="flex items-start space-x-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            alert.status === 'active' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {alert.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {alert.status === 'active' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Real-time performance charts coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;