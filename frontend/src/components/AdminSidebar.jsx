import React from 'react';
import { 
  Palette, LayoutDashboard, Users, Store, Factory, Truck, 
  Sparkles, FileText, UserCheck, ShoppingBag, DollarSign, 
  HelpCircle, BarChart, CheckSquare, Key, Bell, LogOut, ShieldCheck
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'overview' },
    { name: 'User Management', icon: Users, tab: 'users' },
    { name: 'Vendor Management', icon: Store, tab: 'vendors' },
    { name: 'Manufacturer Management', icon: Factory, tab: 'manufacturers' },
    { name: 'Delivery Partner Management', icon: Truck, tab: 'delivery' },
    { name: 'AI Design Requests', icon: Sparkles, tab: 'ai_designs' },
    { name: 'Manual Design Requests', icon: FileText, tab: 'manual_designs' },
    { name: 'Interior Designer Requests', icon: UserCheck, tab: 'designer_requests' },
    { name: 'Orders & Workflow', icon: ShoppingBag, tab: 'orders' },
    { name: 'Payments & Commission', icon: DollarSign, tab: 'payments' },
    { name: 'Support Tickets', icon: HelpCircle, tab: 'tickets' },
    { name: 'Reports & Analytics', icon: BarChart, tab: 'analytics' },
    { name: 'KYC Approvals', icon: CheckSquare, tab: 'kyc' },
    { name: 'Security Deposits', icon: ShieldCheck, tab: 'deposit' },
    { name: 'Role & Permission', icon: Key, tab: 'roles' },
    { name: 'System Notifications', icon: Bell, tab: 'notifications' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3 bg-[#1F2937]/10">
        <div className="w-9 h-9 rounded-xl bg-[#1F2937] flex items-center justify-center text-white shadow-md shadow-[#1F2937]/30">
          <Palette className="w-5 h-5" />
        </div>
        <span className="font-['Playfair_Display'] font-extrabold text-xl tracking-wide text-[#1F2937]">
          Artisan<span className="text-[#E76F51]">Admin</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-3">
          System Administration Console
        </p>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button 
              key={index} 
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#1F2937] text-white shadow-md shadow-[#1F2937]/30 scale-105' : 'text-gray-600 hover:bg-[#1F2937]/10 hover:text-[#1F2937]'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E76F51]'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-[#E76F51]/10 text-gray-600 hover:text-[#E76F51] rounded-xl font-bold text-xs transition-all border border-gray-200 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
