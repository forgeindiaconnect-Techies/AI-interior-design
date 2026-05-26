import React, { useState } from 'react';
import { 
  Palette, LayoutDashboard, Package, ShoppingCart, FileText, 
  Wrench, Truck, MessageSquare, Star, DollarSign, Briefcase, 
  LogOut, ChevronDown, ChevronRight, HelpCircle 
} from 'lucide-react';

const VendorSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  // Collapsible groups state
  const [openGroups, setOpenGroups] = useState({
    products: true,
    orders: true,
    customers: true,
    finance: false,
    business: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <aside className="vendor-sidebar w-64 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-lg">
      {/* Brand Header */}
      <div className="sidebar-header h-16 flex items-center px-6 gap-3">
        <div className="brand-icon w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">
          <Palette className="w-4 h-4" />
        </div>
        <span className="brand-text font-bold text-lg tracking-tight" style={{fontFamily: "'Outfit', sans-serif"}}>
          Artisan<span className="brand-accent">Studio</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">

        {/* Section: Dashboard */}
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>
        </div>

        {/* Section: Products */}
        <div className="space-y-1">
          <button
            onClick={() => toggleGroup('products')}
            className="section-label w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Products</span>
            {openGroups.products ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openGroups.products && (
            <div className="section-border pl-2 space-y-1 mt-1 ml-3.5">
              {[
                { name: 'Product Management', icon: Package, tab: 'products' },
                { name: 'Inventory', icon: Package, tab: 'inventory' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(item.tab)}
                    className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === item.tab ? 'active' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Orders */}
        <div className="space-y-1">
          <button
            onClick={() => toggleGroup('orders')}
            className="section-label w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Orders</span>
            {openGroups.orders ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openGroups.orders && (
            <div className="section-border pl-2 space-y-1 mt-1 ml-3.5">
              {[
                { name: 'Ready-made Orders', icon: ShoppingCart, tab: 'orders' },
                { name: 'Custom Orders', icon: FileText, tab: 'custom_requests' },
                { name: 'Production Requests', icon: Wrench, tab: 'manufacturing' },
                { name: 'Delivery & Installation', icon: Truck, tab: 'logistics' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(item.tab)}
                    className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === item.tab ? 'active' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Customers */}
        <div className="space-y-1">
          <button
            onClick={() => toggleGroup('customers')}
            className="section-label w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Customers</span>
            {openGroups.customers ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openGroups.customers && (
            <div className="section-border pl-2 space-y-1 mt-1 ml-3.5">
              {[
                { name: 'Messages', icon: MessageSquare, tab: 'messages' },
                { name: 'Reviews', icon: Star, tab: 'reviews' },
                { name: 'Help Center', icon: HelpCircle, tab: 'support' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(item.tab)}
                    className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === item.tab ? 'active' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Finance */}
        <div className="space-y-1">
          <button
            onClick={() => toggleGroup('finance')}
            className="section-label w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Finance</span>
            {openGroups.finance ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openGroups.finance && (
            <div className="section-border pl-2 space-y-1 mt-1 ml-3.5">
              {[
                { name: 'Revenue', icon: DollarSign, tab: 'earnings' },
                { name: 'Payouts', icon: DollarSign, tab: 'payouts' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(item.tab)}
                    className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === item.tab ? 'active' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Business */}
        <div className="space-y-1">
          <button
            onClick={() => toggleGroup('business')}
            className="section-label w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
          >
            <span>Business</span>
            {openGroups.business ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {openGroups.business && (
            <div className="section-border pl-2 space-y-1 mt-1 ml-3.5">
              {[
                { name: 'Business Profile', icon: Briefcase, tab: 'profile' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(item.tab)}
                    className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === item.tab ? 'active' : ''}`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Logout Footer */}
      <div className="sidebar-footer p-4">
        <button
          onClick={onLogout}
          className="sidebar-footer-btn w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar;
