import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LoadingState } from '../components/common/LoadingState';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const MapView = lazy(() => import('../pages/MapView'));
const ZoneDetails = lazy(() => import('../pages/ZoneDetails'));
const Reports = lazy(() => import('../pages/Reports'));
const Upload = lazy(() => import('../pages/Upload'));
const CrackReports = lazy(() => import('../pages/CrackReports'));
const Alerts = lazy(() => import('../pages/Alerts'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Admin = lazy(() => import('../pages/Admin'));
const Profile = lazy(() => import('../pages/Profile'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingState message="Loading page..." />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: 'map', element: <SuspenseWrapper><MapView /></SuspenseWrapper> },
      { path: 'zones/:id', element: <SuspenseWrapper><ZoneDetails /></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
      { path: 'upload', element: <SuspenseWrapper><Upload /></SuspenseWrapper> },
      { path: 'crack-reports', element: <SuspenseWrapper><CrackReports /></SuspenseWrapper> },
      { path: 'alerts', element: <SuspenseWrapper><Alerts /></SuspenseWrapper> },
      { path: 'analytics', element: <SuspenseWrapper><Analytics /></SuspenseWrapper> },
      { path: 'admin', element: <SuspenseWrapper><Admin /></SuspenseWrapper> },
      { path: 'profile', element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
    ],
  },
]);

export default router;
