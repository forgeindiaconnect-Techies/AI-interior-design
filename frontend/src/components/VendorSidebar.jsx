import React from 'react';
import { 
  Palette, LayoutDashboard, Package, ShoppingCart, FileText, 
  Send, Wrench, Truck, DollarSign, MessageSquare, Star, 
  Briefcase, CheckCircle, ShieldCheck, Bell, LogOut 
} from 'lucide-react';

const VendorSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'overview' },
    { name: 'Product Management', icon: Package, tab: 'products' },
    { name: 'Ready-made Orders', icon: ShoppingCart, tab: 'orders' },
    { name: 'Custom Design Requests', icon: FileText, tab: 'custom_requests' },
    { name: 'Quotations & Bids', icon: Send, tab: 'quotations' },
    { name: 'Manufacturing Requests', icon: Wrench, tab: 'manufacturing' },
    { name: 'Delivery & Installation', icon: Truck, tab: 'logistics' },
    { name: 'Earnings & Payouts', icon: DollarSign, tab: 'earnings' },
    { name: 'Customer Messages', icon: MessageSquare, tab: 'messages' },
    { name: 'Reviews', icon: Star, tab: 'reviews' },
    { name: 'Business Profile', icon: Briefcase, tab: 'profile' },
    { name: 'KYC Status', icon: CheckCircle, tab: 'kyc' },
    { name: 'Security Deposit', icon: ShieldCheck, tab: 'deposit' },
    { name: 'Notifications', icon: Bell, tab: 'notifications' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3 bg-[#2A9D8F]/10">
        <div className="w-9 h-9 rounded-xl bg-[#2A9D8F] flex items-center justify-center text-white shadow-md shadow-[#2A9D8F]/30">
          <Palette className="w-5 h-5" />
        </div>
        <span className="font-['Playfair_Display'] font-extrabold text-xl tracking-wide text-[#1F2937]">
          Artisan<span className="text-[#2A9D8F]">Partner</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Vendor & Partner Portal
        </p>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button 
              key={index} 
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#2A9D8F] text-white shadow-md shadow-[#2A9D8F]/30 scale-105' : 'text-gray-600 hover:bg-[#2A9D8F]/10 hover:text-[#2A9D8F]'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#2A9D8F]'}`} />
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

export default VendorSidebar;
