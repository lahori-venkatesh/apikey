import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardHome from './DashboardHome';
import ApiKeysPage from './ApiKeysPage';
import AnalyticsPage from './AnalyticsPage';
import RotationPage from './RotationPage';
import MonitoringPage from './MonitoringPage';

const Dashboard = ({ user, onLogout }) => {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/api-keys" element={<ApiKeysPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/rotation" element={<RotationPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;