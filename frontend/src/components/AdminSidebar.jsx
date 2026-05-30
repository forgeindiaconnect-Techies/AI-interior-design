import React, { useState } from 'react';
import { LayoutDashboard, Users, Store, Factory, Truck, ShoppingBag, Sparkles, FileText, BarChart2, RefreshCw, HelpCircle, ShieldCheck, Key, Bell, LogOut, ChevronDown, ChevronRight, CheckSquare, AlertCircle, Wrench, UserCheck, MessageSquare, Armchair } from 'lucide-react';

// ── ADMIN SIDEBAR THEME: Clean White / Navy Highlight ──
const A = {
  bg:          '#ffffff',
  border:      '#E5E7EB',
  headerBg:    '#ffffff',
  footerBg:    '#FAFAFA',
  footerBtn:   '#ffffff',
  labelColor:  '#9CA3AF',
  itemColor:   '#4B5563',
  itemHoverBg: '#F0F4F8',
  activeBg:    '#F0F4F8',   // light navy
  activeText:  '#1D3557',   // brand navy
  accentText:  '#1D3557',
  brandText:   '#1F2937',
  iconBg:      '#1D3557',
  iconColor:   '#ffffff',
};

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, unreadNotifCount = 0 }) => {
  // Collapsible groups state
  const [openGroups, setOpenGroups] = useState({
    users: true,
    operations: true,
    ai_requests: true,
    finance: true,
    support: true,
    verifications: true
  });

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const NavItem = ({ name, icon: Icon, tab, badge, isBadgeCoral }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '10px', padding: '9px 12px', borderRadius: '10px',
          fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer',
          transition: 'all 0.15s ease',
          backgroundColor: isActive ? A.activeBg : 'transparent',
          color: isActive ? A.activeText : A.itemColor,
        }}
        onMouseEnter={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = A.itemHoverBg; 
            e.currentTarget.style.color = A.activeText; 
          } 
        }}
        onMouseLeave={e => { 
          if (!isActive) { 
            e.currentTarget.style.backgroundColor = 'transparent'; 
            e.currentTarget.style.color = A.itemColor; 
          } 
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon style={{ width: 15, height: 15, flexShrink: 0, color: isActive ? A.activeText : '#9CA3AF' }} />
          {name}
        </span>
        {badge > 0 && (
          <span style={{
            backgroundColor: isBadgeCoral ? '#E76F51' : A.activeBg,
            color: isBadgeCoral ? '#ffffff' : A.activeText,
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
        color: A.labelColor, background: 'none', border: 'none', cursor: 'pointer',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = A.itemColor; }}
      onMouseLeave={e => { e.currentTarget.style.color = A.labelColor; }}
    >
      <span>{label}</span>
      {openGroups[group]
        ? <ChevronDown style={{ width: 14, height: 14, color: A.labelColor }} />
        : <ChevronRight style={{ width: 14, height: 14, color: A.labelColor }} />}
    </button>
  );

  return (
    <aside className="admin-sidebar" style={{
      width: 256, backgroundColor: A.bg, color: A.itemColor,
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'fixed', left: 0, top: 0, zIndex: 50,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      borderRight: `1px solid ${A.border}`,
    }}>
      {/* Brand Header */}
      <div className="sidebar-header" style={{
        height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
        borderBottom: `1px solid ${A.border}`, backgroundColor: A.headerBg,
      }}>
        <div className="brand-icon" style={{
          width: 32, height: 32, borderRadius: '50%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: A.iconBg, color: A.iconColor, flexShrink: 0,
        }}>
          <div className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
            <Armchair style={{ width: '100%', height: '100%' }} />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" style={{ width: '50%', height: '50%' }} />
          </div>
        </div>
        <span className="brand-text" style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.5px', color: A.brandText, fontFamily: "'Outfit', sans-serif" }}>
          Artisan<span className="brand-accent" style={{ color: A.accentText }}>Studio</span>
        </span>
      </div>

      {/* Nav Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Overview */}
        <NavItem name="Overview" icon={LayoutDashboard} tab="overview" />

        {/* Collapsible: USER & VENDOR MANAGEMENT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="User & Vendor Management" group="users" />
          {openGroups.users && (
            <div className="section-border" style={{ borderLeft: `1px solid ${A.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItem name="Users" icon={Users} tab="users" />
              <NavItem name="Vendors" icon={Store} tab="vendors" />
              <NavItem name="Manufacturers" icon={Factory} tab="manufacturers" />
              <NavItem name="Delivery Partners" icon={Truck} tab="delivery" />
            </div>
          )}
        </div>

        {/* Collapsible: OPERATIONS WORKFLOW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="Operations Workflow" group="operations" />
          {openGroups.operations && (
            <div className="section-border" style={{ borderLeft: `1px solid ${A.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItem name="Orders" icon={ShoppingBag} tab="orders" />
              <NavItem name="Manufacturing" icon={Factory} tab="manufacturing" />
              <NavItem name="Delivery" icon={Truck} tab="delivery" />
              <NavItem name="Installation" icon={Wrench} tab="installation" />
            </div>
          )}
        </div>

        {/* Collapsible: AI & DESIGN REQUESTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="AI & Design Requests" group="ai_requests" />
          {openGroups.ai_requests && (
            <div className="section-border" style={{ borderLeft: `1px solid ${A.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItem name="Custom Design Requests" icon={FileText} tab="custom_design_requests" />
            </div>
          )}
        </div>

        {/* Collapsible: FINANCE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="Finance" group="finance" />
          {openGroups.finance && (
            <div className="section-border" style={{ borderLeft: `1px solid ${A.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItem name="Platform Commission" icon={BarChart2} tab="platform_commission" />
              <NavItem name="Refunds" icon={RefreshCw} tab="refunds" />
            </div>
          )}
        </div>

        {/* Collapsible: SUPPORT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="Support" group="support" />
          {openGroups.support && (
            <div className="section-border" style={{ borderLeft: `1px solid ${A.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItem name="Live Chat" icon={MessageSquare} tab="support" />
              <NavItem name="Contact Messages" icon={MessageSquare} tab="contact_messages" />
            </div>
          )}
        </div>

        {/* Outer-level: Reports & Analytics */}
        <div>
          <NavItem name="Reports & Analytics" icon={BarChart2} tab="analytics" />
        </div>

        {/* Collapsible: VERIFICATION & REVIEWS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SectionLabel label="Verification & Reviews" group="verifications" />
          {openGroups.verifications && (
            <div className="section-border" style={{ borderLeft: `1px solid ${A.border}`, marginLeft: 20, paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItem name="Vendor Verification" icon={CheckSquare} tab="verifications" />
              <NavItem name="Store Approval" icon={Store} tab="store-approvals" />
              <NavItem name="Product Quality Review" icon={AlertCircle} tab="product-reviews" />
              <NavItem name="Customer Reviews" icon={Sparkles} tab="reviews_management" />
            </div>
          )}
        </div>

        {/* Outer-level: Notifications */}
        <div>
          <NavItem name="Notifications" icon={Bell} tab="notifications" badge={unreadNotifCount} isBadgeCoral={true} />
        </div>
      </div>

      {/* Logout Footer */}
      <div className="sidebar-footer" style={{ padding: 14, borderTop: `1px solid ${A.border}`, backgroundColor: A.footerBg }}>
        <button
          onClick={onLogout}
          className="sidebar-footer-btn"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '11px 16px', borderRadius: 10, fontWeight: 700, fontSize: 12,
            backgroundColor: A.footerBtn, color: '#6B7280', border: `1px solid ${A.border}`,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = A.footerBtn; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = A.border; }}
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
