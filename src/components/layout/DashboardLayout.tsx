import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from './AppLayout';

// Legacy component - redirects to new AppLayout
export const DashboardLayout: React.FC = () => {
  return <AppLayout />;
};