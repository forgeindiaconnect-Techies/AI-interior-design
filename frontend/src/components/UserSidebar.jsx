import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sparkles, FileText, ShoppingBag, Bookmark, ShoppingCart, Package, Truck, User as UserIcon, HelpCircle, LogOut, ChevronDown, ChevronRight, CreditCard, Star, Bell, Armchair, Hammer } from 'lucide-react';
import axios from 'axios';

// ── USER SIDEBAR THEME: Clean White / Peach Highlight ──
const U = {
  bg:          '#ffffff',
  border:      '#E5E7EB',
  headerBg:    '#ffffff',
  footerBg:    '#FAFAFA',
  footerBtn:   '#ffffff',
  labelColor:  '#9CA3AF',
  itemColor:   '#4B5563',
  itemHoverBg: '#FDF8F5',
  activeBg:    '#FDF8F5',   // light peach
  activeText:  '#8B5E3C',   // brand brown
  accentText:  '#8B5E3C',
  brandText:   '#1F2937',
  iconBg:      '#8B5E3C',
  iconColor:   '#ffffff',
};

const UserSidebar = ({ activeTab, setActiveTab, onLogout, unreadNotifCount = 0 }) => {
  const [cartCount, setCartCount] = useState(0);
  const [openGroups, setOpenGroups] = useState({
    design: true, shop: true, orders: true, support: true, account: true
  });

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/cart');
      const items = res.data?.data?.items || [];
      setCartCount(items.filter(i => i.productId).length);
    } catch (err) {
      console.warn('Failed to fetch cart count:', err);
    }
  };

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartUpdated', fetchCartCount);
    window.addEventListener('storage', fetchCartCount);
    return () => {
      window.removeEventListener('cartUpdated', fetchCartCount);
      window.removeEventListener('storage', fetchCartCount);
    };
  }, []);

  const toggleGroup = (g) => setOpenGroups(p => ({ ...p, [g]: !p[g] }));

  const NavItem = ({ name, icon: Icon, tab, badge, isBadgeCoral, color = U.activeText }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', padding: '10px 12px', borderRadius: '10px',
          fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: isActive ? `${color}1A` : 'transparent',
          color: isActive ? color : U.itemColor,
        }}
        onMouseEnter={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = `${color}0D`; 
            e.currentTarget.style.color = color; 
          } 
        }}
        onMouseLeave={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = 'transparent'; 
            e.currentTarget.style.color = U.itemColor; 
          } 
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon style={{ width: 16, height: 16, flexShrink: 0, color: color }} />
          {name}
        </span>
        {badge > 0 && (
          <span style={{
            backgroundColor: isBadgeCoral ? '#E76F51' : `${color}33`,
            color: isBadgeCoral ? '#ffffff' : color,
            fontSize: 10, fontWeight: 700, padding: '2px 6px',
            borderRadius: 9999, minWidth: 18, textAlign: 'center'
          }}>{badge}</span>
        )}
      </button>
    );
  };

  const SectionLabel = ({ label, group }) => (
    <button
      onClick={() => toggleGroup(group)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 14px', fontSize: '10px', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: U.labelColor, background: 'none', border: 'none', cursor: 'pointer',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = U.itemColor; }}
      onMouseLeave={e => { e.currentTarget.style.color = U.labelColor; }}
    >
      <span>{label}</span>
      {openGroups[group]
        ? <ChevronDown style={{ width: 14, height: 14, color: U.labelColor }} />
        : <ChevronRight style={{ width: 14, height: 14, color: U.labelColor }} />}
    </button>
  );

  const sections = [
    {
      group: 'design', label: 'Design Services',
      items: [
        { name: 'AI Room Studio', icon: Sparkles, tab: 'ai_studio', color: '#8B5CF6' },
        { name: 'Manual Design Request', icon: FileText, tab: 'manual', color: '#EC4899' },
        { name: 'Interior Designer Help', icon: UserIcon, tab: 'designer', color: '#F59E0B' },
        { name: 'Saved Designs', icon: Bookmark, tab: 'saved', color: '#10B981' },
      ]
    },
    {
      group: 'shop', label: 'Marketplace',
      items: [
        { name: 'Products', icon: ShoppingBag, tab: 'marketplace', color: '#06B6D4' },
      ]
    },
    {
      group: 'orders', label: 'Orders & Payments',
      items: [
        { name: 'My Cart', icon: ShoppingCart, tab: 'cart', badge: cartCount, color: '#F97316' },
        { name: 'Quotations', icon: FileText, tab: 'quotations', color: '#6366F1' },
        { name: 'My Orders', icon: Package, tab: 'orders', color: '#14B8A6' },
        { name: 'Order Tracking', icon: Truck, tab: 'tracking', color: '#84CC16' },
        { name: 'Payments', icon: CreditCard, tab: 'payments', color: '#EAB308' },
      ]
    },
    {
      group: 'support', label: 'Support',
      items: [
        { name: 'Reviews', icon: Star, tab: 'reviews', color: '#F43F5E' },
        { name: 'User Chat', icon: HelpCircle, tab: 'support', color: '#A855F7' },
      ]
    },
    {
      group: 'account', label: 'Account',
      items: [
        { name: 'Profile', icon: UserIcon, tab: 'profile', color: '#64748B' },
        { name: 'Notifications', icon: Bell, tab: 'notifications', badge: unreadNotifCount, isBadgeCoral: true, color: '#EF4444' },
      ]
    },
  ];

  return (
    <aside className="user-sidebar" style={{
      width: 256, backgroundColor: U.bg, color: U.itemColor,
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      borderRight: `1px solid ${U.border}`,
    }}>
      {/* Brand Header */}
      <div className="sidebar-header" style={{
        height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
        borderBottom: `1px solid ${U.border}`, backgroundColor: U.headerBg,
      }}>
        <div className="brand-icon" style={{
          width: 32, height: 32, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: U.iconBg, color: U.iconColor, flexShrink: 0,
        }}>
          <div className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
            <Armchair style={{ width: '100%', height: '100%' }} />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" style={{ width: '50%', height: '50%' }} />
          </div>
        </div>
        <span className="brand-text" style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: U.brandText, fontFamily: "'Outfit', sans-serif" }}>
          Artisan<span className="brand-accent" style={{ color: U.accentText }}>Studio</span>
        </span>
      </div>

      {/* Nav Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Overview */}
        <NavItem name="Overview" icon={LayoutDashboard} tab="overview" color="#3B82F6" />

        {/* Collapsible Sections */}
        {sections.map(({ group, label, items }) => (
          <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel label={label} group={group} />
            {openGroups[group] && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                {items.map(item => (
                  <NavItem key={item.tab} {...item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout Footer */}
      <div className="sidebar-footer" style={{ padding: 14, borderTop: `1px solid ${U.border}`, backgroundColor: U.footerBg }}>
        <button
          onClick={onLogout}
          className="sidebar-footer-btn"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '11px 16px', borderRadius: 10, fontWeight: 700, fontSize: 12,
            backgroundColor: U.footerBtn, color: '#6B7280', border: `1px solid ${U.border}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = U.footerBtn; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = U.border; }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
