import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Armchair, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Navigate to home and scroll to top
  const handleHomeNav = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll to a section on the landing page; if not on home, navigate there first
  const handleSectionNav = (sectionId) => (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="bg-[#F8F5F0] border-b border-[#D4A373]/30 sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" onClick={handleHomeNav} className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#8B5E3C] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <div className="relative flex items-center justify-center">
              <Armchair className="w-6 h-6" />
              <Sparkles className="w-1/2 h-1/2 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <span className="font-['Playfair_Display'] font-bold text-2xl tracking-wide text-[#1F2937] group-hover:text-[#8B5E3C] transition-colors">
            Artisan<span className="text-[#8B5E3C]">Studio</span>
          </span>
        </a>

        <div className="flex items-center gap-8 font-medium text-[#6B7280]">
          <a href="/" onClick={handleHomeNav} className="hover:text-[#8B5E3C] transition-colors font-semibold cursor-pointer">Home</a>
          <a href="/#ai-design" onClick={handleSectionNav('ai-design')} className="hidden md:inline hover:text-[#8B5E3C] transition-colors cursor-pointer">AI Studio</a>
          <Link to="/marketplace" className="hidden md:inline hover:text-[#8B5E3C] transition-colors">Marketplace</Link>
          <a href="/#how-it-works" onClick={handleSectionNav('how-it-works')} className="hidden md:inline hover:text-[#8B5E3C] transition-colors cursor-pointer">How It Works</a>
          <a href="/#about-us" onClick={handleSectionNav('about-us')} className="hidden md:inline hover:text-[#8B5E3C] transition-colors cursor-pointer">About Us</a>
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
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-[#8B5E3C] hover:bg-[#8B5E3C]/90 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
