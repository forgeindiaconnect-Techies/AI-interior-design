import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palette, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (['vendor', 'manufacturer', 'delivery', 'installation'].includes(user.role)) return '/dashboard/vendor';
    return '/dashboard/user';
  };

  return (
    <nav className="bg-[#F8F5F0] border-b border-[#D4A373]/30 sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Palette className="w-6 h-6" />
          </div>
          <span className="font-['Playfair_Display'] font-bold text-2xl tracking-wide text-[#1F2937]">
            Artisan<span className="text-[#8B5E3C]">Studio</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-[#6B7280]">
          <Link to="/" className="hover:text-[#8B5E3C] transition-colors">Home</Link>
          <a href="/#ai-design" className="hover:text-[#8B5E3C] transition-colors">AI Studio</a>
          <a href="/#marketplace" className="hover:text-[#8B5E3C] transition-colors">Marketplace</a>
          <a href="/#how-it-works" className="hover:text-[#8B5E3C] transition-colors">How It Works</a>
          <a href="/#pricing" className="hover:text-[#8B5E3C] transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to={getDashboardLink()} 
                className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-full border border-[#D4A373] text-[#8B5E3C] hover:bg-[#8B5E3C] hover:text-white transition-all shadow-sm"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-[#8B5E3C] hover:text-[#8B5E3C]/80 font-medium px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
