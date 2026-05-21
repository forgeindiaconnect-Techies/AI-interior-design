import React, { useState } from 'react';
import { 
  Palette, LayoutDashboard, Users, Store, Factory, Truck, 
  Sparkles, FileText, UserCheck, ShoppingBag, DollarSign, 
  HelpCircle, BarChart, CheckSquare, Key, Bell, LogOut, ShieldCheck,
  ChevronDown, ChevronRight 
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  // Collapsible groups state
  const [openGroups, setOpenGroups] = useState({
    users: true,
    operations: true,
    design: true,
    security: false,
    settings: false
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <aside className="w-64 bg-[#1F2937] text-gray-300 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-md">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800 gap-3">
        <div className="w-8 h-8 rounded-xl bg-white text-[#1F2937] flex items-center justify-center shadow-sm">
          <Palette className="w-4.5 h-4.5" />
        </div>
        <span className="font-['Outfit'] font-bold text-lg tracking-tight text-white">
          Artisan<span className="text-[#E76F51]">Admin</span>
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
                ? 'bg-white/10 text-white shadow-sm' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </button>
        </div>

        {/* Section: User & Vendor Management */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('users')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            <span>User & Vendor Management</span>
            {openGroups.users ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.users && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-800 ml-3.5">
              {[
                { name: 'Users', icon: Users, tab: 'users' },
                { name: 'Vendors', icon: Store, tab: 'vendors' },
                { name: 'Manufacturers', icon: Factory, tab: 'manufacturers' },
                { name: 'Delivery Partners', icon: Truck, tab: 'delivery' },
                { name: 'Interior Designers', icon: UserCheck, tab: 'designer_requests' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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

        {/* Section: Operations Workflow */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('operations')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            <span>Operations Workflow</span>
            {openGroups.operations ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.operations && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-800 ml-3.5">
              {[
                { name: 'Orders', icon: ShoppingBag, tab: 'orders' },
                { name: 'Manufacturing', icon: Factory, tab: 'manufacturing' },
                { name: 'Delivery', icon: Truck, tab: 'delivery' },
                { name: 'Installation', icon: HelpCircle, tab: 'installation' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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

        {/* Section: AI & Design Requests */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('design')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            <span>AI & Design Requests</span>
            {openGroups.design ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.design && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-800 ml-3.5">
              {[
                { name: 'AI Requests', icon: Sparkles, tab: 'ai_designs' },
                { name: 'Manual Requests', icon: FileText, tab: 'manual_designs' },
                { name: 'Designer Requests', icon: UserCheck, tab: 'designer_requests' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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

        {/* Section: Payments & Commission */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payments' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 shrink-0" />
            <span>Payments & Commission</span>
          </button>
        </div>

        {/* Section: Reports & Analytics */}
        <div className="space-y-1">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics' 
                ? 'bg-white/10 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BarChart className="w-4 h-4 shrink-0" />
            <span>Reports & Analytics</span>
          </button>
        </div>

        {/* Section: KYC & Security */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('security')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            <span>KYC & Security</span>
            {openGroups.security ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.security && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-800 ml-3.5">
              {[
                { name: 'KYC Approvals', icon: CheckSquare, tab: 'kyc' },
                { name: 'Security Deposits', icon: ShieldCheck, tab: 'deposit' },
                { name: 'Role & Permissions', icon: Key, tab: 'roles' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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

        {/* Section: System Settings */}
        <div className="space-y-1">
          <button 
            onClick={() => toggleGroup('settings')}
            className="w-full flex items-center justify-between px-3.5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
          >
            <span>System Settings</span>
            {openGroups.settings ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          
          {openGroups.settings && (
            <div className="pl-2 space-y-1 mt-1 border-l border-gray-800 ml-3.5">
              {[
                { name: 'Notifications', icon: Bell, tab: 'notifications' },
                { name: 'Platform Settings', icon: Key, tab: 'platform_settings' }
              ].map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button 
                    key={index} 
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-gray-850 bg-gray-900/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2D3748] hover:bg-red-900/20 hover:text-red-400 text-gray-400 rounded-xl font-bold text-xs transition-all border border-gray-800 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
