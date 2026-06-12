import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import { ToastProvider } from './components/Toast';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PlanEssential from './pages/PlanEssential';
import PlanPremium from './pages/PlanPremium';
import PlanEnterprise from './pages/PlanEnterprise';
import axios from 'axios';

const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const DashLoader = () => (
  <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm font-bold text-[#8B5E3C]">Loading dashboard...</p>
    </div>
  </div>
);

// Removed SyncManager as part of removing mock data

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center font-bold text-lg text-[#8B5E3C]">Loading System...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // NOTE: Strict role-based redirects can be added here if needed
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //    // If user is logged in but doesn't have the right role, send them home
  //    return <Navigate to="/" replace />;
  // }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Standard Navbar & Footer */}
      <Route path="/" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><LandingPage /></main><Footer /></div>} />
      <Route path="/login" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><LoginPage /></main><Footer /></div>} />
      <Route path="/register" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><RegisterPage /></main><Footer /></div>} />
      
      {/* Marketplace Routes with Standard Navbar & Footer */}
      <Route path="/marketplace" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><Marketplace /></main><Footer /></div>} />
      <Route path="/marketplace/product/:id" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><ProductDetails /></main><Footer /></div>} />
      <Route path="/privacy-policy" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><PrivacyPolicy /></main><Footer /></div>} />
      <Route path="/terms-of-service" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><TermsOfService /></main><Footer /></div>} />

      {/* Pricing Plan Pages */}
      <Route path="/plans/essential" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><PlanEssential /></main><Footer /></div>} />
      <Route path="/plans/premium" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><PlanPremium /></main><Footer /></div>} />
      <Route path="/plans/enterprise" element={<div className="flex flex-col min-h-screen"><Navbar /><main className="flex-grow"><PlanEnterprise /></main><Footer /></div>} />
      
      {/* Dashboard Routes with Full-Height Sidebar Layout */}
      <Route 
        path="/dashboard/user" 
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Suspense fallback={<DashLoader />}>
              <DashboardLayout>
                <UserDashboard />
              </DashboardLayout>
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/vendor" 
        element={
          <ProtectedRoute allowedRoles={['vendor', 'manufacturer', 'delivery', 'installation']}>
            <Suspense fallback={<DashLoader />}>
              <DashboardLayout>
                <VendorDashboard />
              </DashboardLayout>
            </Suspense>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={<DashLoader />}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </Suspense>
          </ProtectedRoute>
        } 
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    // Local storage clearing removed to persist mock data across dashboard reloads.
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
