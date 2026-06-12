import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Moon, Sun, Bell, Search, User as UserIcon, LogOut, Settings, HelpCircle, ChevronRight, CheckCircle, X, Sparkles, ShoppingBag, Package, Hammer, Truck, LayoutDashboard, FileText, CreditCard, Star, Store, Users, BarChart2, ShieldCheck, MessageSquare } from 'lucide-react';
import UserSidebar from './UserSidebar';
import VendorSidebar from './VendorSidebar';
import AdminSidebar from './AdminSidebar';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('currentDashboardTab') || 'overview';
  });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('Not Submitted');

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Persist current tab to local storage for refresh continuity
  useEffect(() => {
    localStorage.setItem('currentDashboardTab', activeTab);
  }, [activeTab]);

  // Sync route overrides (e.g. clicking a link from outside the dashboard)
  useEffect(() => {
    const overrideTab = localStorage.getItem('activeDashboardTab');
    if (overrideTab) {
      setActiveTab(overrideTab);
      localStorage.removeItem('activeDashboardTab');
    }
  }, []);



  // Load notifications from local storage based on role
  const isVendor = ['vendor', 'manufacturer', 'delivery', 'installation'].includes(user?.role);
  const isAdmin = user?.role === 'admin';

  const getNotifKey = () => {
    if (isAdmin) return 'mockAdminNotifications';
    if (isVendor) return 'mockVendorNotifications';
    return 'mockUserNotifications';
  };

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      if (res.data && res.data.success) {
        // Map backend isRead to frontend read
        const mapped = res.data.data.map(n => ({ ...n, read: n.isRead }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.warn("API notifications fetch failed:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [user?.role]);

  // Fetch verification status for vendor sidebar badge
  useEffect(() => {
    if (isVendor) {
      const localVer = [];
      const current = localVer.find(k => k.email === user?.email || k.email === 'vendor@example.com');
      if (current?.status) {
        setVerificationStatus(current.status);
      }
    }
  }, [user?.email, isVendor]);

  const handleMarkAllRead = async () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    // Also try to update via API if they are real DB objects
    notifications.forEach(async (n) => {
      if (!n.read && n._id && n._id.length === 24) {
        try { await axios.put(`/notifications/${n._id}/read`); } catch(e){}
      }
    });
  };

  const handleNotifClick = async (notif) => {
    const updated = notifications.map(n => n._id === notif._id ? { ...n, read: true } : n);
    setNotifications(updated);
    setSelectedNotif({ ...notif, read: true });
    setShowNotifDropdown(false);

    if (notif._id && notif._id.length === 24) {
      try { await axios.put(`/notifications/${notif._id}/read`); } catch(e){}
    }

    // Navigate to relevant dashboard tab when notification has related request
    if (notif.relatedId && notif.relatedModel === 'ManualDesignRequest') {
      const targetTab = isAdmin ? 'custom_design_requests' : isVendor ? 'custom_requests' : null;
      if (targetTab) {
        // Store the related ID so the dashboard tab can highlight/scroll to it
        localStorage.setItem('highlightRequestId', notif.relatedId);
        setActiveTab(targetTab);
      }
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSidebar = () => {
    if (isAdmin) return <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} unreadNotifCount={unreadCount} />;
    if (isVendor) return <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} unreadNotifCount={unreadCount} verificationStatus={verificationStatus} />;
    return <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} unreadNotifCount={unreadCount} />;
  };

  // Spotlight navigation items — role-aware
  const allNavItems = [
    // Shared
    { tab: 'overview',       label: 'Overview',                    icon: LayoutDashboard, desc: 'Your main dashboard home',              roles: ['user', 'vendor', 'manufacturer', 'delivery', 'installation', 'admin'] },
    { tab: 'profile',        label: 'My Profile',                  icon: UserIcon,        desc: 'Account details and settings',           roles: ['user', 'vendor', 'manufacturer', 'delivery', 'installation', 'admin'] },
    { tab: 'support',        label: 'Help & Support',              icon: HelpCircle,      desc: 'Submit tickets and get help',            roles: ['user', 'vendor', 'manufacturer', 'delivery', 'installation', 'admin'] },
    { tab: 'notifications',  label: 'Notifications',               icon: Bell,            desc: 'View all alerts and updates',            roles: ['user', 'vendor', 'manufacturer', 'delivery', 'installation', 'admin'] },

    // User-only
    { tab: 'ai_studio',      label: 'AI Room Studio',              icon: Sparkles,        desc: 'Generate AI interior designs',           roles: ['user'] },
    { tab: 'manual',         label: 'Manual Design Request',       icon: Hammer,          desc: 'Submit custom design to vendors',        roles: ['user'] },
    { tab: 'designer',       label: 'Interior Designer Help',      icon: Star,            desc: 'Hire a professional designer',           roles: ['user'] },
    { tab: 'marketplace',    label: 'Shop Products',               icon: ShoppingBag,     desc: 'Browse the furniture marketplace',       roles: ['user'] },
    { tab: 'cart',           label: 'My Shopping Cart',            icon: ShoppingBag,     desc: 'View cart and checkout',                 roles: ['user'] },
    { tab: 'orders',         label: 'My Orders',                   icon: Package,         desc: 'Track your product orders',              roles: ['user'] },
    { tab: 'quotations',     label: 'Quotations',                  icon: FileText,        desc: 'Review vendor quotations',               roles: ['user'] },
    { tab: 'tracking',       label: 'Order Tracking',              icon: Truck,           desc: 'Live delivery tracking',                 roles: ['user'] },
    { tab: 'payments',       label: 'Payments & Invoices',         icon: CreditCard,      desc: 'Manage payments and billing',            roles: ['user'] },
    { tab: 'saved',          label: 'Saved Designs',               icon: Star,            desc: 'View bookmarked AI designs',             roles: ['user'] },

    // Vendor-only
    { tab: 'products',           label: 'Product Catalog',             icon: Package,       desc: 'Manage your listed products',               roles: ['vendor'] },
    { tab: 'custom_requests',    label: 'Custom Orders',               icon: Hammer,        desc: 'Review and quote custom requests',          roles: ['vendor', 'manufacturer'] },
    { tab: 'ai_design_orders',   label: 'AI Design Orders',            icon: Sparkles,      desc: 'AI-generated design order assignments',     roles: ['vendor'] },
    { tab: 'manufacturing',      label: 'Manufacturing Orders',        icon: Hammer,        desc: 'Production workflow and tracking',          roles: ['vendor', 'manufacturer'] },
    { tab: 'logistics',          label: 'Logistics & Dispatch',        icon: Truck,         desc: 'Manage deliveries and dispatch',            roles: ['vendor', 'delivery'] },
    { tab: 'orders',             label: 'Ready-Made Orders',           icon: Package,       desc: 'Orders for your marketplace products',      roles: ['vendor'] },
    { tab: 'earnings',           label: 'Earnings & Revenue',          icon: CreditCard,    desc: 'Revenue, payouts and commission',           roles: ['vendor', 'manufacturer', 'delivery'] },
    { tab: 'verification',       label: 'Business Verification',       icon: ShieldCheck,   desc: 'Submit KYC documents for approval',         roles: ['vendor', 'manufacturer', 'delivery'] },
    { tab: 'store_setup',        label: 'Store Setup',                 icon: Store,         desc: 'Configure your vendor storefront',          roles: ['vendor'] },
    { tab: 'inventory',          label: 'Inventory Control',           icon: Package,       desc: 'Manage stock levels for products',          roles: ['vendor'] },
    { tab: 'reviews',            label: 'Store Reviews',               icon: Star,          desc: 'Customer ratings and feedback',             roles: ['vendor'] },
    { tab: 'messages',           label: 'Customer Chat',               icon: MessageSquare, desc: 'Inbox and customer conversations',          roles: ['vendor'] },

    // Admin-only
    { tab: 'users',              label: 'User Management',             icon: Users,         desc: 'Manage all platform users',                 roles: ['admin'] },
    { tab: 'vendors',            label: 'Vendor Management',           icon: Store,         desc: 'Approve, manage and suspend vendors',       roles: ['admin'] },
    { tab: 'manufacturers',      label: 'Manufacturer Management',     icon: Hammer,        desc: 'Manufacturing partner oversight',           roles: ['admin'] },
    { tab: 'delivery',           label: 'Logistics Partners',          icon: Truck,         desc: 'Delivery partner management',               roles: ['admin'] },
    { tab: 'orders',             label: 'Orders & Workflow',           icon: Package,       desc: 'Full order pipeline and assignment',        roles: ['admin'] },
    { tab: 'custom_design_requests', label: 'Custom Design Requests',   icon: FileText,      desc: 'Centralized custom design request queue',   roles: ['admin'] },
    { tab: 'verifications',      label: 'Vendor Verifications',        icon: ShieldCheck,   desc: 'KYC and document approvals',                roles: ['admin'] },
    { tab: 'store-approvals',    label: 'Store Approvals',             icon: Store,         desc: 'Review and approve vendor store setups',    roles: ['admin'] },
    { tab: 'product-reviews',    label: 'Product Quality Review',      icon: Package,       desc: 'Review and approve product listings',       roles: ['admin'] },
    { tab: 'analytics',          label: 'Reports & Analytics',         icon: BarChart2,     desc: 'Platform performance and revenue insights', roles: ['admin'] },
    { tab: 'payments',           label: 'Payments & Commissions',      icon: CreditCard,    desc: 'Transaction history and commission rates',  roles: ['admin'] },
    { tab: 'roles',              label: 'Roles & Permissions',         icon: ShieldCheck,   desc: 'Sub-admin access and permission control',   roles: ['admin'] },
    { tab: 'tickets',            label: 'Support Tickets',             icon: HelpCircle,    desc: 'Customer support ticket management',        roles: ['admin'] },
    { tab: 'notifications',      label: 'Send Notifications',          icon: Bell,          desc: 'Broadcast alerts to users and vendors',     roles: ['admin'] },
  ];

  const currentRole = user?.role || 'user';
  const searchResults = searchQuery.trim().length > 0
    ? allNavItems
        .filter(item => item.roles.includes(currentRole))
        .filter(item =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tab.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 7)
    : [];

  const handleSearchNavigate = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  // Breadcrumbs Map
  const breadcrumbMap = {
    overview: ['Home', 'Overview'],
    ai_studio: ['Home', 'Design Services', 'AI Room Studio'],
    manual: ['Home', 'Design Services', 'Manual Request'],
    designer: ['Home', 'Design Services', 'Designer Consultation'],
    marketplace: ['Home', 'Marketplace', 'Shop Products'],
    cart: ['Home', 'Marketplace', 'My Shopping Cart'],
    orders: ['Home', 'Operations', 'Orders'],
    tracking: ['Home', 'Operations', 'Live Order Tracking'],
    payments: ['Home', 'Operations', 'Payments & Invoices'],
    quotations: ['Home', 'Operations', 'Quotations'],
    support: ['Home', 'Help & Support', 'User Chat'],
    profile: ['Home', 'Account', 'Profile Details'],
    saved: ['Home', 'Account', 'Saved Designs'],
    notifications: ['Home', 'Account', 'Notifications'],
    
    // Vendor specific
    products: ['Home', 'Products', 'Product Catalog'],
    custom_requests: ['Home', 'Orders', 'Custom Orders'],
    manufacturing: ['Home', 'Operations', 'Manufacturing'],
    installation: ['Home', 'Operations', 'Installation'],
    logistics: ['Home', 'Orders', 'Logistics & Dispatch'],
    earnings: ['Home', 'Earnings', 'Revenue & Payments'],
    messages: ['Home', 'Inbox', 'Customer Chat'],
    reviews: user?.role === 'vendor' ? ['Home', 'Inbox', 'Store Reviews'] : ['Home', 'Help & Support', 'Submit Review'],
    verification: ['Home', 'Settings', 'Business Verification'],
    store_setup: ['Home', 'Settings', 'Store Setup'],

    // Admin specific
    users: ['Home', 'Management', 'Users'],
    vendors: ['Home', 'Management', 'Vendors'],
    manufacturers: ['Home', 'Management', 'Manufacturers'],
    delivery: ['Home', 'Management', 'Logistics Partners'],
    custom_design_requests: ['Home', 'Management', 'Custom Design Requests'],
    tickets: ['Home', 'Operations', 'Support Tickets'],
    analytics: ['Home', 'Reports & Analytics', 'Overview'],
    roles: ['Home', 'Security', 'Role Permissions'],
    verifications: ['Home', 'Verification & Reviews', 'Vendor Verification'],
    'store-approvals': ['Home', 'Verification & Reviews', 'Store Approval'],
    'product-reviews': ['Home', 'Verification & Reviews', 'Product Quality Review']
  };

  const breadcrumbs = breadcrumbMap[activeTab] || ['Home', 'Dashboard'];

  // Inject props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { 
        activeTab, 
        setActiveTab,
        notifications,
        onNotifClick: handleNotifClick,
        onMarkAllRead: handleMarkAllRead,
        searchQuery,
        highlightRequestId: localStorage.getItem('highlightRequestId')
      });
    }
    return child;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabColors = {
    overview: '#3B82F6',
    ai_studio: '#8B5CF6',
    manual: '#EC4899',
    designer: '#F59E0B',
    saved: '#10B981',
    marketplace: '#06B6D4',
    cart: '#F97316',
    quotations: '#6366F1',
    orders: isAdmin || isVendor ? '#10B981' : '#14B8A6',
    tracking: '#84CC16',
    payments: '#EAB308',
    reviews: '#F43F5E',
    support: isAdmin ? '#84CC16' : isVendor ? '#14B8A6' : '#A855F7',
    profile: '#64748B',
    notifications: '#EF4444',
    products: '#8B5CF6',
    inventory: '#F59E0B',
    custom_requests: '#EC4899',
    manufacturing: isVendor ? '#F97316' : '#EC4899',
    logistics: '#06B6D4',
    earnings: '#84CC16',
    payouts: '#EAB308',
    verification: '#3B82F6',
    store_setup: '#A855F7',
    users: '#8B5CF6',
    vendors: '#F59E0B',
    delivery: '#F97316',
    installation: '#06B6D4',
    custom_design_requests: '#6366F1',
    platform_commission: '#14B8A6',
    refunds: '#F43F5E',
    contact_messages: '#EAB308',
    analytics: '#A855F7',
    verifications: '#3B82F6',
    'store-approvals': '#F59E0B',
    'product-reviews': '#10B981',
    reviews_management: '#EC4899'
  };

  const activeColor = tabColors[activeTab] || (isAdmin ? '#1D3557' : isVendor ? '#2A9D8F' : '#8B5E3C');

  // Header background theme based on Role
  const headerAccentColor = isAdmin ? 'border-b-[#1D3557]' : isVendor ? 'border-b-[#2A9D8F]' : 'border-b-[#8B5E3C]';

  return (
    <div className="min-h-screen flex transition-colors duration-500" style={{ backgroundColor: `${activeColor}12` }}>
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        
        {/* Sticky Navbar */}
        <header className={`h-16 bg-white border-b ${headerAccentColor} border-b-2 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm transition-all duration-300`}>
          
          {/* Left: Breadcrumbs & Navigation */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span>{crumb}</span>
                  {idx < breadcrumbs.length - 1 && <ChevronRight className="w-2.5 h-2.5 mx-0.5" />}
                </React.Fragment>
              ))}
            </div>
            <h2 className="text-sm font-extrabold text-[#1F2937] tracking-tight mt-0.5 capitalize">
              {breadcrumbs[breadcrumbs.length - 1]}
            </h2>
          </div>

          {/* Center: Search Bar — Spotlight Navigation */}
          <div className="hidden md:flex items-center relative w-72 lg:w-96" ref={searchRef}>
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 z-10" />
            <input 
              type="text"
              placeholder="Search sections, orders, products..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-8 text-xs font-medium focus:outline-none focus:bg-white focus:border-[#8B5E3C] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                <div className="px-4 py-2.5 border-b border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {searchResults.length} section{searchResults.length !== 1 ? 's' : ''} found
                  </span>
                </div>
                <div className="py-1 max-h-64 overflow-y-auto">
                  {searchResults.map((item) => {
                    const Icon = item.icon;
                    const accentColor = isAdmin ? '#1D3557' : isVendor ? '#2A9D8F' : '#8B5E3C';
                    const isActive = activeTab === item.tab;
                    return (
                      <button
                        key={item.tab + item.label}
                        onClick={() => handleSearchNavigate(item.tab)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors group ${
                          isActive ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                          style={{ backgroundColor: `${accentColor}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: accentColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 leading-none">{item.label}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.desc}</p>
                        </div>
                        {isActive && (
                          <span className="text-[9px] font-bold uppercase tracking-widest shrink-0" style={{ color: accentColor }}>Current</span>
                        )}
                        {!isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No Results State */}
            {showSearchResults && searchQuery.trim().length > 0 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-6 z-50 text-center animate-fadeIn">
                <Search className="w-6 h-6 text-gray-300 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-gray-500">No sections found</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Try a different keyword</p>
              </div>
            )}
          </div>

          {/* Right: Actions Dropdowns */}
          <div className="flex items-center gap-4">
            


            {/* Notification Dropdown Container */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className={`p-2 rounded-xl transition-all relative ${showNotifDropdown ? 'bg-gray-100 text-[#8B5E3C]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E76F51] rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-50">
                    <span className="text-xs font-extrabold text-gray-800">Notifications ({unreadCount} new)</span>
                    <div className="flex gap-2">
                      <button onClick={handleMarkAllRead} className="text-[9px] font-bold text-[#8B5E3C] hover:underline">Mark all read</button>
                      <span className="text-gray-200">|</span>
                      <button onClick={handleClearNotifications} className="text-[9px] font-bold text-gray-400 hover:underline">Clear</button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-400 font-medium">
                        No new notifications.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          onClick={() => handleNotifClick(notif)}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50/50 flex gap-2 items-start cursor-pointer ${!notif.read ? 'bg-[#8B5E3C]/5' : ''}`}
                        >
                          <span className="mt-0.5 text-xs">🔔</span>
                          <div className="flex-1 min-w-0">
                            {notif.title && <p className="text-[12px] font-bold text-[#1F2937] leading-tight truncate">{notif.title}</p>}
                            <p className={`text-[11px] leading-tight truncate ${notif.title ? 'text-gray-500' : 'font-bold text-gray-700'}`}>{notif.message.split('\n')[0]}</p>
                            <span className="text-[9px] text-gray-400 mt-1 block">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5E3C] mt-1.5"></span>}
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pt-2 border-t border-gray-50 text-center">
                    <button 
                      onClick={() => {
                        setActiveTab('notifications');
                        setShowNotifDropdown(false);
                      }} 
                      className="text-[10px] font-bold text-[#8B5E3C] hover:underline"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Container */}
            <div className="relative pl-4 border-l border-gray-100" ref={profileRef}>
              <button 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1 hover:bg-gray-50 rounded-xl transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-[#8B5E3C]/10 uppercase">
                  {(user?.name || 'A').charAt(0)}
                </div>
                <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-xs font-bold text-gray-800 leading-none">{user?.name || 'Artisan Guest'}</span>
                  <span className="text-[9px] font-semibold text-gray-400 capitalize mt-0.5">{user?.role || 'Guest'} Portal</span>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-extrabold text-gray-800">{user?.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email || 'guest@example.com'}</p>
                  </div>

                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setActiveTab('profile');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-[#8B5E3C]/5 hover:text-[#8B5E3C] transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>My Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        // Redirect to active settings page depending on role
                        setActiveTab(isAdmin ? 'roles' : 'profile');
                        setShowProfileDropdown(false);
                      }} 
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-[#8B5E3C]/5 hover:text-[#8B5E3C] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-gray-50 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-8 overflow-y-auto transition-colors duration-500">
          {childrenWithProps}
        </main>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden transform scale-100 transition-all duration-300">
            {/* Modal Header */}
            <div className={`p-6 text-white flex items-center justify-between ${
              isAdmin ? 'bg-[#1D3557]' : isVendor ? 'bg-[#2A9D8F]' : 'bg-[#8B5E3C]'
            }`}>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 animate-bounce" />
                <span className="font-extrabold text-sm uppercase tracking-wider">Notification Detail</span>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex gap-3 items-start">
                <div className={`p-2 rounded-xl mt-1 ${
                  isAdmin ? 'bg-[#1D3557]/10 text-[#1D3557]' : isVendor ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' : 'bg-[#8B5E3C]/10 text-[#8B5E3C]'
                }`}>
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  {selectedNotif.title && (
                    <p className="font-extrabold text-gray-800 text-sm mb-1">{selectedNotif.title}</p>
                  )}
                  <p className="font-bold text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                    {selectedNotif.message}
                  </p>
                  {selectedNotif.details && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5">
                      {selectedNotif.details.roomType && (
                        <p className="text-xs text-gray-600"><strong>Room:</strong> {selectedNotif.details.roomType}</p>
                      )}
                      {selectedNotif.details.style && (
                        <p className="text-xs text-gray-600"><strong>Style:</strong> {selectedNotif.details.style}</p>
                      )}
                      {selectedNotif.details.budget && (
                        <p className="text-xs text-gray-600"><strong>Budget:</strong> {selectedNotif.details.budget}</p>
                      )}
                      {selectedNotif.details.status && (
                        <p className="text-xs text-gray-600"><strong>Status:</strong> {selectedNotif.details.status}</p>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2 font-semibold">
                    Received on: {selectedNotif.createdAt ? new Date(selectedNotif.createdAt).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              {selectedNotif.relatedId && selectedNotif.relatedModel === 'ManualDesignRequest' && (
                <button 
                  onClick={() => {
                    const targetTab = isAdmin ? 'custom_design_requests' : isVendor ? 'custom_requests' : null;
                    if (targetTab) {
                      localStorage.setItem('highlightRequestId', selectedNotif.relatedId);
                      setActiveTab(targetTab);
                      setSelectedNotif(null);
                    }
                  }}
                  className="px-4 py-2 bg-[#1F2937] hover:bg-[#374151] text-white rounded-xl text-xs font-bold transition-colors"
                >
                  View Request Details
                </button>
              )}
              <button 
                onClick={() => setSelectedNotif(null)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
