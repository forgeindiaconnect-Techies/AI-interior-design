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

  const NavItem = ({ name, icon: Icon, tab, badge, isBadgeCoral, isVerified }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', padding: '9px 12px', borderRadius: '10px',
          fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
          transition: 'all 0.15s ease',
          backgroundColor: isActive ? V.activeBg : 'transparent',
          color: isActive ? V.activeText : V.itemColor,
        }}
        onMouseEnter={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = V.itemHoverBg; 
            e.currentTarget.style.color = V.activeText; 
          } 
        }}
        onMouseLeave={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = 'transparent'; 
            e.currentTarget.style.color = V.itemColor; 
          } 
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon style={{ width: 15, height: 15, flexShrink: 0, color: isActive ? V.activeText : '#9CA3AF' }} />
          {name}
          {isVerified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              backgroundColor: '#2A9D8F', color: '#fff',
              fontSize: 8, fontWeight: 800, padding: '1px 5px',
              borderRadius: 9999, lineHeight: '14px',
            }}>✓</span>
          )}
        </span>
        {badge > 0 && (
          <span style={{
            backgroundColor: isBadgeCoral ? '#E76F51' : V.activeBg,
            color: isBadgeCoral ? '#ffffff' : V.activeText,
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
        { name: 'Product Management', icon: Package, tab: 'products' },
        { name: 'Inventory', icon: Package, tab: 'inventory' }
      ]
    },
    {
      group: 'orders', label: 'Orders Workflow',
      items: [
        { name: 'Ready-made Orders', icon: ShoppingCart, tab: 'orders' },
        { name: 'Custom Orders', icon: FileText, tab: 'custom_requests' },
        { name: 'Production Requests', icon: Wrench, tab: 'manufacturing' },
        { name: 'Delivery & Installation', icon: Truck, tab: 'logistics' }
      ]
    },
    {
      group: 'customers', label: 'Quotations & Customers',
      items: [
        { name: 'Quotations', icon: FileText, tab: 'quotations' },
        { name: 'Customer Chat', icon: MessageSquare, tab: 'messages' },
        { name: 'Reviews', icon: Star, tab: 'reviews' }
      ]
    },
    {
      group: 'finance', label: 'Earnings',
      items: [
        { name: 'Revenue', icon: DollarSign, tab: 'earnings' },
        { name: 'Payouts', icon: DollarSign, tab: 'payouts' }
      ]
    },
    {
      group: 'business', label: 'Business Settings',
      items: [
        { name: 'Business Profile', icon: Briefcase, tab: 'profile' },
        { name: 'Business Verification', icon: ShieldCheck, tab: 'verification' },
        { name: 'Store Setup', icon: Store, tab: 'store_setup' }
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
          <Palette style={{ width: 16, height: 16 }} />
        </div>
        <span className="brand-text" style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: V.brandText, fontFamily: "'Outfit', sans-serif" }}>
          Artisan<span className="brand-accent" style={{ color: V.accentText }}>Studio</span>
        </span>
      </div>

      {/* Nav Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Overview */}
        <NavItem name="Overview" icon={LayoutDashboard} tab="overview" />

        {/* Collapsible Sections */}
        {sections.map(({ group, label, items }) => (
          <div key={group} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SectionLabel label={label} group={group} />
            {openGroups[group] && (
              <div className="section-border" style={{ borderLeft: `1px solid ${V.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(item => (
                  <NavItem key={item.tab} {...item} isVerified={item.tab === 'verification' && verificationStatus === 'Approved'} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Outer-level Notifications Item */}
        <div style={{ marginTop: 10 }}>
          <NavItem name="Notifications" icon={Bell} tab="notifications" badge={unreadNotifCount} isBadgeCoral={true} />
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
