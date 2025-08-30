import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

const RotationPage = () => {
  const [rotationSchedules, setRotationSchedules] = useState([
    {
      id: 1,
      keyName: 'Payment Gateway - Production',
      frequency: 'monthly',
      nextRotation: '2024-02-15',
      status: 'active',
      lastRotation: '2024-01-15'
    },
    {
      id: 2,
      keyName: 'User Service - Production',
      frequency: 'quarterly',
      nextRotation: '2024-03-01',
      status: 'active',
      lastRotation: '2023-12-01'
    },
    {
      id: 3,
      keyName: 'Analytics Service',
      frequency: 'weekly',
      nextRotation: '2024-01-22',
      status: 'paused',
      lastRotation: '2024-01-15'
    }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    keyId: '',
    frequency: 'monthly',
    startDate: '',
    notifyBefore: '7'
  });
  const { showSuccess, showError } = useToast();

  const frequencyOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getFrequencyBadge = (frequency) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800',
      quarterly: 'bg-indigo-100 text-indigo-800',
      yearly: 'bg-gray-100 text-gray-800'
    };
    return colors[frequency] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    // Mock creation
    const newId = Math.max(...rotationSchedules.map(s => s.id)) + 1;
    const schedule = {
      id: newId,
      keyName: `API Key ${newId}`,
      frequency: newSchedule.frequency,
      nextRotation: newSchedule.startDate,
      status: 'active',
      lastRotation: null
    };
    
    setRotationSchedules(prev => [...prev, schedule]);
    setShowCreateModal(false);
    setNewSchedule({ keyId: '', frequency: 'monthly', startDate: '', notifyBefore: '7' });
    showSuccess('Rotation schedule created successfully!');
  };

  const toggleScheduleStatus = (id) => {
    setRotationSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id 
          ? { ...schedule, status: schedule.status === 'active' ? 'paused' : 'active' }
          : schedule
      )
    );
    showSuccess('Schedule status updated!');
  };

  const deleteSchedule = (id) => {
    if (window.confirm('Are you sure you want to delete this rotation schedule?')) {
      setRotationSchedules(prev => prev.filter(schedule => schedule.id !== id));
      showSuccess('Rotation schedule deleted!');
    }
  };

  const rotateNow = (id) => {
    if (window.confirm('Are you sure you want to rotate this key now?')) {
      setRotationSchedules(prev => 
        prev.map(schedule => 
          schedule.id === id 
            ? { 
                ...schedule, 
                lastRotation: new Date().toISOString().split('T')[0],
                nextRotation: getNextRotationDate(schedule.frequency)
              }
            : schedule
        )
      );
      showSuccess('API key rotated successfully!');
    }
  };

  const getNextRotationDate = (frequency) => {
    const now = new Date();
    switch (frequency) {
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'quarterly':
        now.setMonth(now.getMonth() + 3);
        break;
      case 'yearly':
        now.setFullYear(now.getFullYear() + 1);
        break;
    }
    return now.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Key Rotation Schedule</h1>
          <p className="text-gray-600 mt-1">Automate API key rotation for enhanced security</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Schedule</span>
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Schedules</p>
              <p className="text-2xl font-bold text-gray-900">
                {rotationSchedules.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Rotation</p>
              <p className="text-2xl font-bold text-gray-900">3 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rotation Schedules</h3>
        </div>
        
        {rotationSchedules.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rotation schedules</h3>
            <p className="text-gray-500 mb-4">Create your first rotation schedule to automate key security</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Schedule
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Rotation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Rotation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rotationSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.keyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFrequencyBadge(schedule.frequency)}`}>
                        {schedule.frequency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(schedule.nextRotation).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.lastRotation ? new Date(schedule.lastRotation).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => rotateNow(schedule.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Rotate now"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleScheduleStatus(schedule.id)}
                          className={schedule.status === 'active' ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                          title={schedule.status === 'active' ? 'Pause schedule' : 'Resume schedule'}
                        >
                          {schedule.status === 'active' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M7 16a3 3 0 006 0v-2" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete schedule"
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

      {/* Create Schedule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Rotation Schedule</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <select
                  value={newSchedule.keyId}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, keyId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select an API key</option>
                  <option value="1">Payment Gateway - Production</option>
                  <option value="2">User Service - Production</option>
                  <option value="3">Analytics Service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rotation Frequency
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {frequencyOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newSchedule.startDate}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notify Before (days)
                </label>
                <select
                  value={newSchedule.notifyBefore}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, notifyBefore: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RotationPage;