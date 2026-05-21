import React, { useState } from 'react';
import { 
  Palette, LayoutDashboard, Package, ShoppingCart, FileText, 
  Send, Wrench, Truck, DollarSign, MessageSquare, Star, 
  Briefcase, CheckCircle, ShieldCheck, Bell, LogOut, ChevronDown, ChevronRight 
} from 'lucide-react';

const VendorSidebar = ({ activeTab, setActiveTab, onLogout, unreadNotifCount = 0 }) => {
  // Collapsible groups state
  const [openGroups, setOpenGroups] = useState({
    products: true,
    orders: true,
    quotations: true,
    earnings: false,
    settings: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50 gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#2A9D8F] flex items-center justify-center text-white shadow-sm shadow-[#2A9D8F]/20">
          <Palette className="w-4.5 h-4.5" />
        </div>
        <span className="font-['Outfit'] font-bold text-lg tracking-tight text-[#1F2937]">
          Artisan<span className="text-[#2A9D8F]">Studio</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Section: Main */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview' 
                ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                : 'text-gray-500 hover:bg-[#2A9D8F]/5 hover:text-[#2A9D8F]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>
        </div>

        {/* Section: Products */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('products')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Products</span>
            {openGroups.products ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.products && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Product Management', icon: Package, tab: 'products' },
                { name: 'Inventory', icon: Package, tab: 'inventory' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#2A9D8F]/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Orders Workflow */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('orders')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Orders Workflow</span>
            {openGroups.orders ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.orders && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Ready-made Orders', icon: ShoppingCart, tab: 'orders' },
                { name: 'Custom Orders', icon: FileText, tab: 'custom_requests' },
                { name: 'Manufacturing Requests', icon: Wrench, tab: 'manufacturing' },
                { name: 'Delivery & Installation', icon: Truck, tab: 'logistics' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#2A9D8F]/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Quotations & Customers */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('quotations')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Quotations & Customers</span>
            {openGroups.quotations ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.quotations && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Quotations', icon: Send, tab: 'quotations' },
                { name: 'Customer Messages', icon: MessageSquare, tab: 'messages' },
                { name: 'Reviews', icon: Star, tab: 'reviews' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#2A9D8F]/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Earnings */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('earnings')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Earnings</span>
            {openGroups.earnings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.earnings && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Revenue', icon: DollarSign, tab: 'earnings' },
                { name: 'Payouts', icon: DollarSign, tab: 'payouts' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#2A9D8F]/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Business Settings */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('settings')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Business Settings</span>
            {openGroups.settings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.settings && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Business Profile', icon: Briefcase, tab: 'profile' },
                { name: 'Business Verification', icon: CheckCircle, tab: 'verification' },
                { name: 'Store Setup', icon: ShieldCheck, tab: 'store_setup' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#2A9D8F]/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Notifications */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notifications' 
                ? 'bg-[#2A9D8F]/10 text-[#2A9D8F]' 
                : 'text-gray-500 hover:bg-[#2A9D8F]/5 hover:text-[#2A9D8F]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 shrink-0" />
              <span>Notifications</span>
            </div>
            {unreadNotifCount > 0 && (
              <span className="bg-[#E76F51] text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 min-w-[16px] text-center">
                {unreadNotifCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl font-bold text-xs transition-all border border-gray-100 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar;
