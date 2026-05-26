import React, { useState, useEffect } from 'react';
import { 
  Palette, LayoutDashboard, Sparkles, FileText, HelpCircle, 
  ShoppingBag, Bookmark, ShoppingCart, Package, Truck, DollarSign, 
  Star, User as UserIcon, Bell, LogOut, ChevronDown, ChevronRight 
} from 'lucide-react';

const UserSidebar = ({ activeTab, setActiveTab, onLogout, unreadNotifCount = 0 }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  // Collapsible groups state
  const [openGroups, setOpenGroups] = useState({
    design: true,
    marketplace: true,
    orders: true,
    support: false,
    account: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  // Main items list to check if activeTab is within a group to auto-expand or highlight
  const isTabInGroup = (tab, groupItems) => groupItems.some(item => item.tab === tab);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-50 gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#8B5E3C] flex items-center justify-center text-white shadow-sm shadow-[#8B5E3C]/20">
          <Palette className="w-4.5 h-4.5" />
        </div>
        <span className="font-['Outfit'] font-bold text-lg tracking-tight text-[#1F2937]">
          Artisan<span className="text-[#8B5E3C]">Studio</span>
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
                ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' 
                : 'text-gray-500 hover:bg-[#8B5E3C]/5 hover:text-[#8B5E3C]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>
        </div>

        {/* Section: Design Services */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('design')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Design Services</span>
            {openGroups.design ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.design && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'AI Room Studio', icon: Sparkles, tab: 'ai_studio' },
                { name: 'Manual Design Request', icon: FileText, tab: 'manual' },
                { name: 'Interior Designer Help', icon: HelpCircle, tab: 'designer' },
                { name: 'Saved Designs', icon: Bookmark, tab: 'saved' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#8B5E3C]/5'
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

        {/* Section: Marketplace */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('marketplace')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Marketplace</span>
            {openGroups.marketplace ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.marketplace && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Products', icon: ShoppingBag, tab: 'marketplace' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#8B5E3C]/5'
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

        {/* Section: Orders & Payments */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('orders')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Orders & Payments</span>
            {openGroups.orders ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.orders && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
                {[
                  { name: 'My Cart', icon: ShoppingCart, tab: 'cart', badge: cartCount },
                  { name: 'Quotations', icon: FileText, tab: 'quotations' },
                  { name: 'My Orders', icon: Package, tab: 'orders' },
                  { name: 'Order Tracking', icon: Truck, tab: 'tracking' },
                  { name: 'Payments', icon: DollarSign, tab: 'payments' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tab;
                  return (
                    <button 
                      key={index} 
                      onClick={() => setActiveTab(item.tab)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-[#8B5E3C]/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge != null && item.badge > 0 && (
                        <span className="bg-[#8B5E3C] text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 min-w-[16px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
              })}
            </div>
          )}
        </div>

        {/* Section: Support */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('support')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Support</span>
            {openGroups.support ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.support && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Reviews', icon: Star, tab: 'reviews' },
                { name: 'Help Center', icon: HelpCircle, tab: 'support' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#8B5E3C]/5'
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

        {/* Section: Account */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('account')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
          >
            <span>Account</span>
            {openGroups.account ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.account && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-100 ml-3.5">
              {[
                { name: 'Profile', icon: UserIcon, tab: 'profile' },
                { name: 'Notifications', icon: Bell, tab: 'notifications' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-[#8B5E3C]/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.tab === 'notifications' && unreadNotifCount > 0 && (
                      <span className="bg-[#E76F51] text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 min-w-[16px] text-center">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
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

export default UserSidebar;
