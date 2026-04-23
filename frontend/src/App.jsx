import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/queryClient';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import { lazy, Suspense } from 'react';
import LoadingScreen from './components/ui/LoadingScreen';

import LandingPage from './pages/LandingPage';
import LoginPage   from './pages/LoginPage';

const FarmerDashboard      = lazy(() => import('./features/farmer/pages/FarmerDashboard'));
const AgentDashboard       = lazy(() => import('./features/agent/pages/AgentDashboard'));
const BuyerDashboard       = lazy(() => import('./features/buyer/pages/BuyerDashboard'));
const AdminDashboard       = lazy(() => import('./features/admin/pages/AdminDashboard'));
const FarmerRegistration   = lazy(() => import('./features/farmer/pages/FarmerRegistrationPage'));
const BuyerRegistration    = lazy(() => import('./features/buyer/pages/BuyerRegistrationPage'));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public */}
            <Route path="/"                element={<LandingPage />} />
            <Route path="/login"           element={<LoginPage />} />
            <Route path="/register/farmer" element={<FarmerRegistration />} />
            <Route path="/register/buyer"  element={<BuyerRegistration />} />

            {/* Farmer */}
            <Route path="/dashboard/farmer/*" element={
              <ProtectedRoute requiredRole="FARMER">
                <DashboardLayout><FarmerDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Agent */}
            <Route path="/dashboard/agent/*" element={
              <ProtectedRoute requiredRole="AGENT">
                <DashboardLayout><AgentDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Buyer */}
            <Route path="/dashboard/buyer/*" element={
              <ProtectedRoute requiredRole="BUYER">
                <DashboardLayout><BuyerDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/dashboard/admin/*" element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout><AdminDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
