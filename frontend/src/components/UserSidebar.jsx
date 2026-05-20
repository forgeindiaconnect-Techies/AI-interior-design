import React from 'react';
import { 
  Palette, LayoutDashboard, Sparkles, FileText, HelpCircle, 
  ShoppingBag, ShoppingCart, Package, Truck, DollarSign, 
  Star, User as UserIcon, Bookmark, Bell, LogOut 
} from 'lucide-react';

const UserSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'overview' },
    { name: 'AI Room Studio', icon: Sparkles, tab: 'ai_studio' },
    { name: 'Manual Design Request', icon: FileText, tab: 'manual' },
    { name: 'Interior Designer Help', icon: HelpCircle, tab: 'designer' },
    { name: 'Marketplace Products', icon: ShoppingBag, tab: 'marketplace' },
    { name: 'My Cart', icon: ShoppingCart, tab: 'cart' },
    { name: 'My Orders', icon: Package, tab: 'orders' },
    { name: 'Order Tracking', icon: Truck, tab: 'tracking' },
    { name: 'Payments', icon: DollarSign, tab: 'payments' },
    { name: 'Reviews & Support', icon: Star, tab: 'support' },
    { name: 'My Profile', icon: UserIcon, tab: 'profile' },
    { name: 'Saved Designs', icon: Bookmark, tab: 'saved' },
    { name: 'Notifications', icon: Bell, tab: 'notifications' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-sm">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 gap-3 bg-[#F8F5F0]/50">
        <div className="w-9 h-9 rounded-xl bg-[#8B5E3C] flex items-center justify-center text-white shadow-md shadow-[#8B5E3C]/30">
          <Palette className="w-5 h-5" />
        </div>
        <span className="font-['Playfair_Display'] font-extrabold text-xl tracking-wide text-[#1F2937]">
          Artisan<span className="text-[#8B5E3C]">Studio</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Customer Portal
        </p>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button 
              key={index} 
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-[#8B5E3C] text-white shadow-md shadow-[#8B5E3C]/30 scale-105' : 'text-gray-600 hover:bg-[#8B5E3C]/10 hover:text-[#8B5E3C]'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#8B5E3C]'}`} />
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

export default UserSidebar;
