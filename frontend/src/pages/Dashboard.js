import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import DashboardHome from './DashboardHome';
import ApiKeysPage from './ApiKeysPage';
import AnalyticsPage from './AnalyticsPage';
import RotationPage from './RotationPage';
import MonitoringPage from './MonitoringPage';
import ProfileSettings from './ProfileSettings';
import BillingUsage from './BillingUsage';
import ApiDocumentation from './ApiDocumentation';
import HelpSupport from './HelpSupport';

const Dashboard = ({ user, onLogout }) => {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/api-keys" element={<ApiKeysPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/rotation" element={<RotationPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/profile" element={<ProfileSettings user={user} />} />
        <Route path="/billing" element={<BillingUsage />} />
        <Route path="/docs" element={<ApiDocumentation />} />
        <Route path="/support" element={<HelpSupport />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;