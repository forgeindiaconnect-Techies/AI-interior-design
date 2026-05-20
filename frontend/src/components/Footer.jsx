import React from 'react';
import { Palette, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#2F3E46] text-white py-12 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A373] flex items-center justify-center text-[#2F3E46] shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <span className="font-['Playfair_Display'] font-bold text-2xl tracking-wide text-white">
              Artisan<span className="text-[#D4A373]">AI</span>
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Professional AI interior design, custom furniture manufacturing, and full-service marketplace platform. Transforming spaces with cutting-edge artificial intelligence.
          </p>
        </div>

        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4 text-[#D4A373]">Platform</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#ai-design" className="hover:text-white transition-colors">AI Studio</a></li>
            <li><a href="#marketplace" className="hover:text-white transition-colors">Furniture Marketplace</a></li>
            <li><a href="#custom-manufacturing" className="hover:text-white transition-colors">Custom Manufacturing</a></li>
            <li><a href="#delivery-installation" className="hover:text-white transition-colors">Delivery & Installation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4 text-[#D4A373]">Partner Network</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/register?role=vendor" className="hover:text-white transition-colors">Become a Vendor</a></li>
            <li><a href="/register?role=manufacturer" className="hover:text-white transition-colors">Manufacturer Portal</a></li>
            <li><a href="/register?role=delivery" className="hover:text-white transition-colors">Delivery Partner Portal</a></li>
            <li><a href="/register?role=installation" className="hover:text-white transition-colors">Installation Expert Portal</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-['Playfair_Display'] text-lg font-semibold mb-4 text-[#D4A373]">Contact & Legal</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>support@artisanai.com</li>
            <li>+1 (555) 123-4567</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
        <p>© 2026 ArtisanAI Platform. All rights reserved.</p>
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
