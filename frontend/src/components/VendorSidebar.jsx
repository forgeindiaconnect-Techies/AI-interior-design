import React, { useState } from 'react';
import { LayoutDashboard, Package, ShoppingCart, FileText, Wrench, Truck, MessageSquare, Star, DollarSign, Briefcase, LogOut, ChevronDown, ChevronRight, HelpCircle, Bell, ShieldCheck, Store, Armchair, Sparkles } from 'lucide-react';

// ── VENDOR SIDEBAR THEME: Clean White / Teal Highlight ──
const V = {
  bg:          '#ffffff',
  border:      '#E5E7EB',
  headerBg:    '#ffffff',
  footerBg:    '#FAFAFA',
  footerBtn:   '#ffffff',
  labelColor:  '#9CA3AF',
  itemColor:   '#4B5563',
  itemHoverBg: '#F0F9F8',
  activeBg:    '#F0F9F8',   // light teal
  activeText:  '#2A9D8F',   // brand teal
  accentText:  '#2A9D8F',
  brandText:   '#1F2937',
  iconBg:      '#2A9D8F',
  iconColor:   '#ffffff',
};

const VendorSidebar = ({ activeTab, setActiveTab, onLogout, unreadNotifCount = 0, verificationStatus }) => {
  // Collapsible groups state
  const [openGroups, setOpenGroups] = useState({
    products: true,
    orders: true,
    customers: true,
    finance: true,
    business: true
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const NavItem = ({ name, icon: Icon, tab, badge, isBadgeCoral, isVerified, color = V.activeText }) => {
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
          color: isActive ? color : V.itemColor,
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
            e.currentTarget.style.color = V.itemColor; 
          } 
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icon style={{ width: 16, height: 16, flexShrink: 0, color: color }} />
          {name}
          {isVerified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              backgroundColor: '#2A9D8F', color: '#fff',
              fontSize: 8, fontWeight: 800, padding: '1px 5px',
              borderRadius: 9999, lineHeight: '14px',
              marginLeft: 4
            }}>✓</span>
          )}
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
        color: V.labelColor, background: 'none', border: 'none', cursor: 'pointer',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = V.itemColor; }}
      onMouseLeave={e => { e.currentTarget.style.color = V.labelColor; }}
    >
      <span>{label}</span>
      {openGroups[group]
        ? <ChevronDown style={{ width: 14, height: 14, color: V.labelColor }} />
        : <ChevronRight style={{ width: 14, height: 14, color: V.labelColor }} />}
    </button>
  );

  const sections = [
    {
      group: 'products', label: 'Products',
      items: [
        { name: 'Product Management', icon: Package, tab: 'products', color: '#8B5CF6' },
        { name: 'Inventory', icon: Package, tab: 'inventory', color: '#F59E0B' }
      ]
    },
    {
      group: 'orders', label: 'Orders Workflow',
      items: [
        { name: 'Ready-made Orders', icon: ShoppingCart, tab: 'orders', color: '#10B981' },
        { name: 'Custom Orders', icon: FileText, tab: 'custom_requests', color: '#EC4899' },
        { name: 'Production Requests', icon: Wrench, tab: 'manufacturing', color: '#F97316' },
        { name: 'Delivery & Installation', icon: Truck, tab: 'logistics', color: '#06B6D4' }
      ]
    },
    {
      group: 'customers', label: 'Quotations & Customers',
      items: [
        { name: 'Quotations', icon: FileText, tab: 'quotations', color: '#6366F1' },
        { name: 'Customer Chat', icon: MessageSquare, tab: 'support', color: '#14B8A6' },
        { name: 'Reviews', icon: Star, tab: 'reviews', color: '#F43F5E' }
      ]
    },
    {
      group: 'finance', label: 'Earnings',
      items: [
        { name: 'Revenue', icon: DollarSign, tab: 'earnings', color: '#84CC16' },
        { name: 'Payouts', icon: DollarSign, tab: 'payouts', color: '#EAB308' }
      ]
    },
    {
      group: 'business', label: 'Business Settings',
      items: [
        { name: 'Business Profile', icon: Briefcase, tab: 'profile', color: '#64748B' },
        { name: 'Business Verification', icon: ShieldCheck, tab: 'verification', color: '#3B82F6' },
        { name: 'Store Setup', icon: Store, tab: 'store_setup', color: '#A855F7' }
      ]
    }
  ];

  return (
    <aside className="vendor-sidebar" style={{
      width: 256, backgroundColor: V.bg, color: V.itemColor,
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      borderRight: `1px solid ${V.border}`,
    }}>
      {/* Brand Header */}
      <div className="sidebar-header" style={{
        height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
        borderBottom: `1px solid ${V.border}`, backgroundColor: V.headerBg,
      }}>
        <div className="brand-icon" style={{
          width: 32, height: 32, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: V.iconBg, color: V.iconColor, flexShrink: 0,
        }}>
          <div className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
            <Armchair style={{ width: '100%', height: '100%' }} />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" style={{ width: '50%', height: '50%' }} />
          </div>
        </div>
        <span className="brand-text" style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: V.brandText, fontFamily: "'Outfit', sans-serif" }}>
          Artisan<span className="brand-accent" style={{ color: V.accentText }}>Studio</span>
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
                  <NavItem key={item.tab} {...item} isVerified={item.tab === 'verification' && verificationStatus === 'Approved'} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Outer-level Notifications Item */}
        <div style={{ marginTop: 10 }}>
          <NavItem name="Notifications" icon={Bell} tab="notifications" badge={unreadNotifCount} isBadgeCoral={true} color="#EF4444" />
        </div>
      </div>

      {/* Logout Footer */}
      <div className="sidebar-footer" style={{ padding: 14, borderTop: `1px solid ${V.border}`, backgroundColor: V.footerBg }}>
        <button
          onClick={onLogout}
          className="sidebar-footer-btn"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '11px 16px', borderRadius: 10, fontWeight: 700, fontSize: 12,
            backgroundColor: V.footerBtn, color: '#6B7280', border: `1px solid ${V.border}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = V.footerBtn; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = V.border; }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default VendorSidebar;
