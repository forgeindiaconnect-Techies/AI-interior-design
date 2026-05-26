import React, { useState, useEffect } from 'react';
import { 
  Palette, LayoutDashboard, Sparkles, FileText, 
  ShoppingBag, Bookmark, ShoppingCart, Package, Truck, 
  User as UserIcon, HelpCircle, LogOut, ChevronDown, ChevronRight, MessageSquare 
} from 'lucide-react';

// ── USER SIDEBAR THEME: Deep Warm Brown ──
const U = {
  bg:          '#2C1A0E',   // main sidebar bg
  border:      '#4A2E1A',   // divider / border
  headerBg:    '#2C1A0E',
  footerBg:    '#1E1108',
  footerBtn:   '#3D2314',
  labelColor:  '#8a6650',
  itemColor:   '#C4A882',
  itemHoverBg: 'rgba(255,255,255,0.06)',
  activeBg:    '#C07D45',   // rich amber-brown
  activeText:  '#ffffff',
  accentText:  '#C07D45',
  brandText:   '#ffffff',
  iconBg:      '#C07D45',
  iconColor:   '#ffffff',
};

const UserSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const [cartCount, setCartCount] = useState(0);
  const [openGroups, setOpenGroups] = useState({
    design: true, shop: true, orders: true, support: false, account: false
  });

  useEffect(() => {
    const update = () => {
      const cart = JSON.parse(localStorage.getItem('mockCart') || '[]');
      setCartCount(cart.length);
    };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('cartUpdated', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('cartUpdated', update);
    };
  }, []);

  const toggleGroup = (g) => setOpenGroups(p => ({ ...p, [g]: !p[g] }));

  const NavItem = ({ name, icon: Icon, tab, badge }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', padding: '9px 12px', borderRadius: '10px',
          fontSize: '11.5px', fontWeight: 700, border: 'none', cursor: 'pointer',
          transition: 'all 0.15s ease',
          backgroundColor: isActive ? U.activeBg : 'transparent',
          color: isActive ? U.activeText : U.itemColor,
        }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = U.itemHoverBg; e.currentTarget.style.color = '#fff'; } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = U.itemColor; } }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
          {name}
        </span>
        {badge > 0 && (
          <span style={{
            backgroundColor: isActive ? '#fff' : U.activeBg,
            color: isActive ? U.activeBg : '#fff',
            fontSize: 9, fontWeight: 800, padding: '2px 6px',
            borderRadius: 9999, minWidth: 16, textAlign: 'center'
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
        padding: '6px 14px', fontSize: 9.5, fontWeight: 800,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: U.labelColor, background: 'none', border: 'none', cursor: 'pointer',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#C4A882'; }}
      onMouseLeave={e => { e.currentTarget.style.color = U.labelColor; }}
    >
      <span>{label}</span>
      {openGroups[group]
        ? <ChevronDown style={{ width: 13, height: 13 }} />
        : <ChevronRight style={{ width: 13, height: 13 }} />}
    </button>
  );

  const sections = [
    {
      group: 'design', label: 'Design',
      items: [
        { name: 'AI Room Studio', icon: Sparkles, tab: 'ai_studio' },
        { name: 'Manual Design Request', icon: FileText, tab: 'manual' },
        { name: 'My Designs', icon: Bookmark, tab: 'saved' },
      ]
    },
    {
      group: 'shop', label: 'Shop',
      items: [
        { name: 'Products', icon: ShoppingBag, tab: 'marketplace' },
      ]
    },
    {
      group: 'orders', label: 'Orders',
      items: [
        { name: 'Cart', icon: ShoppingCart, tab: 'cart', badge: cartCount },
        { name: 'My Orders', icon: Package, tab: 'orders' },
        { name: 'Order Tracking', icon: Truck, tab: 'tracking' },
      ]
    },
    {
      group: 'support', label: 'Support',
      items: [
        { name: 'Help Center', icon: HelpCircle, tab: 'support' },
        { name: 'Message Vendor', icon: MessageSquare, tab: 'messages' },
      ]
    },
    {
      group: 'account', label: 'Account',
      items: [
        { name: 'Profile', icon: UserIcon, tab: 'profile' },
      ]
    },
  ];

  return (
    <aside style={{
      width: 256, backgroundColor: U.bg, color: U.itemColor,
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
      boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
      borderRight: `1px solid ${U.border}`,
    }}>
      {/* Brand Header */}
      <div style={{
        height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
        borderBottom: `1px solid ${U.border}`, backgroundColor: U.headerBg,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: U.iconBg, color: U.iconColor, flexShrink: 0,
        }}>
          <Palette style={{ width: 17, height: 17 }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.5px', color: U.brandText, fontFamily: "'Outfit', sans-serif" }}>
          Artisan<span style={{ color: U.accentText }}>Studio</span>
        </span>
      </div>

      {/* Nav Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Overview */}
        <NavItem name="Overview" icon={LayoutDashboard} tab="overview" />

        {/* Collapsible Sections */}
        {sections.map(({ group, label, items }) => (
          <div key={group}>
            <SectionLabel label={label} group={group} />
            {openGroups[group] && (
              <div style={{ borderLeft: `2px solid ${U.border}`, marginLeft: 18, paddingLeft: 8, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(item => (
                  <NavItem key={item.tab} {...item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Logout Footer */}
      <div style={{ padding: 14, borderTop: `1px solid ${U.border}`, backgroundColor: U.footerBg }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '11px 16px', borderRadius: 10, fontWeight: 700, fontSize: 11.5,
            backgroundColor: U.footerBtn, color: '#9CA3AF', border: `1px solid ${U.border}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(180,20,20,0.2)'; e.currentTarget.style.color = '#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = U.footerBtn; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
