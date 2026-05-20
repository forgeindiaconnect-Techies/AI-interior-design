import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, Bell } from 'lucide-react';
import UserSidebar from './UserSidebar';
import VendorSidebar from './VendorSidebar';
import AdminSidebar from './AdminSidebar';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false);

  React.useEffect(() => {
    const overrideTab = localStorage.getItem('activeDashboardTab');
    if (overrideTab) {
      setActiveTab(overrideTab);
      localStorage.removeItem('activeDashboardTab');
    }
  }, []);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isVendor = ['vendor', 'manufacturer', 'delivery', 'installation'].includes(user?.role);
  const isAdmin = user?.role === 'admin';

  const renderSidebar = () => {
    if (isAdmin) return <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />;
    if (isVendor) return <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />;
    return <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />;
  };

  // Inject activeTab and setActiveTab into dashboard children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { activeTab, setActiveTab });
    }
    return child;
  });

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex">
      {/* Dynamic Role-Based Fixed Left Sidebar */}
      {renderSidebar()}

      {/* Main Content Area with Top Header */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        {/* Sleek Top Header matching reference image */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-extrabold text-[#1F2937] tracking-tight">
                {isAdmin ? 'System Administration Console' : isVendor ? 'Partner & Vendor Portal' : 'Customer Studio'}
              </h1>
              <p className="text-xs font-medium text-gray-500">
                Role: {(user?.role || 'user').toUpperCase()} — Welcome back, {user?.name || 'Demo'}!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-gray-400 hover:text-[#8B5E3C] transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative">
              <button onClick={() => setActiveTab('notifications')} className="p-2 text-gray-400 hover:text-[#8B5E3C] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E76F51] rounded-full ring-2 ring-white"></span>
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <span className="text-xs font-extrabold text-[#1F2937] tracking-wide">
                ArtisanHub
              </span>
              <div className="w-8 h-8 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white font-bold text-xs shadow-md">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
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
