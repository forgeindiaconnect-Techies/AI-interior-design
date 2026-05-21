import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Bell, Search, User as UserIcon, LogOut, Settings, CreditCard, HelpCircle, Check, ChevronRight } from 'lucide-react';
import UserSidebar from './UserSidebar';
import VendorSidebar from './VendorSidebar';
import AdminSidebar from './AdminSidebar';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Sync route overrides
  useEffect(() => {
    const overrideTab = localStorage.getItem('activeDashboardTab');
    if (overrideTab) {
      setActiveTab(overrideTab);
      localStorage.removeItem('activeDashboardTab');
    }
  }, []);

  // Theme Sync
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load notifications from local storage based on role
  const isVendor = ['vendor', 'manufacturer', 'delivery', 'installation'].includes(user?.role);
  const isAdmin = user?.role === 'admin';

  const getNotifKey = () => {
    if (isAdmin) return 'mockAdminNotifications';
    if (isVendor) return 'mockVendorNotifications';
    return 'mockUserNotifications';
  };

  const loadNotifications = () => {
    const key = getNotifKey();
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (stored.length === 0) {
      // Seed some nice initial notifications for presentation
      const initial = [
        { _id: 'n1', message: 'Welcome to your premium dashboard workspace.', type: 'info', createdAt: new Date().toISOString(), read: false },
        { _id: 'n2', message: 'System optimization is complete.', type: 'success', createdAt: new Date(Date.now() - 3600000).toISOString(), read: true }
      ];
      localStorage.setItem(key, JSON.stringify(initial));
      setNotifications(initial);
    } else {
      setNotifications(stored);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Poll notifications every 8 seconds to show live updates
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const handleMarkAllRead = () => {
    const key = getNotifKey();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(key, JSON.stringify(updated));
    setNotifications(updated);
  };

  const handleClearNotifications = () => {
    const key = getNotifKey();
    localStorage.setItem(key, JSON.stringify([]));
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderSidebar = () => {
    if (isAdmin) return <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />;
    if (isVendor) return <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />;
    return <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />;
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
    support: ['Home', 'Help & Support', 'Help Center'],
    profile: ['Home', 'Account', 'Profile Details'],
    saved: ['Home', 'Account', 'Saved Designs'],
    notifications: ['Home', 'Account', 'Notifications'],
    
    // Vendor specific
    products: ['Home', 'Products', 'Product Catalog'],
    custom_requests: ['Home', 'Orders', 'Custom Orders'],
    manufacturing: ['Home', 'Orders', 'Manufacturing Requests'],
    logistics: ['Home', 'Orders', 'Logistics & Dispatch'],
    earnings: ['Home', 'Earnings', 'Revenue & Payments'],
    messages: ['Home', 'Inbox', 'Customer Chat'],
    reviews: user?.role === 'vendor' ? ['Home', 'Inbox', 'Store Reviews'] : ['Home', 'Help & Support', 'Submit Review'],
    kyc: ['Home', 'Settings', 'KYC Verification'],
    deposit: ['Home', 'Settings', 'Security Deposit'],

    // Admin specific
    users: ['Home', 'Management', 'Users'],
    vendors: ['Home', 'Management', 'Vendors'],
    manufacturers: ['Home', 'Management', 'Manufacturers'],
    delivery: ['Home', 'Management', 'Logistics Partners'],
    designer_requests: ['Home', 'Management', 'Designer Registry'],
    ai_designs: ['Home', 'AI Studio', 'Design Queue'],
    manual_designs: ['Home', 'Operations', 'Manual Requests'],
    tickets: ['Home', 'Operations', 'Support Tickets'],
    analytics: ['Home', 'Reports & Analytics', 'Overview'],
    roles: ['Home', 'Security', 'Role Permissions']
  };

  const breadcrumbs = breadcrumbMap[activeTab] || ['Home', 'Dashboard'];

  // Inject props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // Header background theme based on Role
  const headerAccentColor = isAdmin ? 'border-b-[#1D3557]' : isVendor ? 'border-b-[#2A9D8F]' : 'border-b-[#8B5E3C]';

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
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

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search services, products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:bg-white focus:border-[#8B5E3C] transition-all"
            />
          </div>

          {/* Right: Actions Dropdowns */}
          <div className="flex items-center gap-4">
            
            {/* Dark Mode toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />}
            </button>

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
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50/50 flex gap-2 items-start ${!notif.read ? 'bg-[#8B5E3C]/5' : ''}`}
                        >
                          <span className="mt-0.5 text-xs">🔔</span>
                          <div className="flex-1">
                            <p className="text-[11px] font-bold text-gray-700 leading-tight">{notif.message}</p>
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
                        // Redirect to active settings page / security deposit / etc depending on role
                        setActiveTab(isAdmin ? 'roles' : isVendor ? 'profile' : 'saved');
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
        <main className="flex-1 p-8 overflow-y-auto">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
