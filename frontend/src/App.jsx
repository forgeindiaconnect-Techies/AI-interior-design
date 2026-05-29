import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
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

  // NOTE: Strict role-based redirects have been disabled for prototype testing 
  // so you can view Vendor and User dashboards side-by-side in the same browser.

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
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/vendor" 
        element={
          <ProtectedRoute allowedRoles={['vendor', 'manufacturer', 'delivery', 'installation']}>
            <DashboardLayout>
              <VendorDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
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
    // Clear all mock localStorage keys on app startup
    const keysToRemove = [
      'mockOrders', 'mockSharedChat', 'mockProducts', 'mockReviews',
      'mockCart', 'mockUserNotifications', 'mockVendorNotifications',
      'mockAdminNotifications', 'mockManualRequests', 'mockDesignerRequests',
      'mockVerificationSubmissions', 'mockStoreSetupSubmissions', 'mockPayoutHistory',
      'mockPlatformMetrics', 'mockUsers', 'mockDesigns'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
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
