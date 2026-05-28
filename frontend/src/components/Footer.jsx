import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Armchair, Sparkles } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate to home then smoothly scroll to a section
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
      }, 150);
    }
  };

  const handleHomeTop = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#2F3E46] text-white py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <a href="/" onClick={handleHomeTop} className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="w-10 h-10 rounded-full bg-[#D4A373] flex items-center justify-center text-[#2F3E46] shadow-md group-hover:scale-105 transition-transform">
              <div className="relative flex items-center justify-center">
              <Armchair className="w-6 h-6" />
              <Sparkles className="w-1/2 h-1/2 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
            </div>
            <span className="font-['Playfair_Display'] font-bold text-2xl tracking-wide text-white group-hover:text-[#D4A373] transition-colors">
              Artisan<span className="text-[#D4A373]">Studio</span>
            </span>
          </a>
          <p className="text-gray-300 text-sm leading-relaxed">
            Professional AI interior design, custom furniture manufacturing, and full-service marketplace platform. Transforming spaces with cutting-edge artificial intelligence.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4 text-[#D4A373]">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="/#ai-design" onClick={handleSectionNav('ai-design')} className="hover:text-white transition-colors cursor-pointer">
                AI Studio
              </a>
            </li>
            <li>
              <Link to="/marketplace" className="hover:text-white transition-colors">
                Furniture Marketplace
              </Link>
            </li>
            <li>
              <a href="/#custom-manufacturing" onClick={handleSectionNav('custom-manufacturing')} className="hover:text-white transition-colors cursor-pointer">
                Custom Manufacturing
              </a>
            </li>
            <li>
              <a href="/#delivery-installation" onClick={handleSectionNav('delivery-installation')} className="hover:text-white transition-colors cursor-pointer">
                Delivery &amp; Installation
              </a>
            </li>
          </ul>
        </div>

        {/* Partner Network */}
        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4 text-[#D4A373]">Partner Network</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/register?role=vendor" className="hover:text-white transition-colors">
                Become a Vendor
              </Link>
            </li>
            <li>
              <Link to="/register?role=manufacturer" className="hover:text-white transition-colors">
                Manufacturer Portal
              </Link>
            </li>
            <li>
              <Link to="/register?role=delivery" className="hover:text-white transition-colors">
                Delivery Partner Portal
              </Link>
            </li>
            <li>
              <Link to="/register?role=installation" className="hover:text-white transition-colors">
                Installation Expert Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Legal */}
        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4 text-[#D4A373]">Contact &amp; Legal</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="mailto:support@artisanstudio.com" className="hover:text-white transition-colors">
                support@artisanstudio.com
              </a>
            </li>
            <li>
              <a href="tel:+15551234567" className="hover:text-white transition-colors">
                +1 (555) 123-4567
              </a>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
        <p>© 2026 ArtisanStudio Platform. All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-4 h-4 text-[#E76F51] fill-[#E76F51]" />
          <span>for luxury interiors</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
