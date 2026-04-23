import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearSession, getRole, getUser } from '../../utils/auth';

const ROLE_NAV = {
  FARMER: [
    { label: 'Overview',      icon: '📊', path: '/dashboard/farmer' },
    { label: 'Listings',      icon: '🌾', path: '/dashboard/farmer/listings' },
    { label: 'Transactions',  icon: '💸', path: '/dashboard/farmer/transactions' },
    { label: 'Storage Debt',  icon: '🏦', path: '/dashboard/farmer/debt' },
    { label: 'Agent Contact', icon: '📞', path: '/dashboard/farmer/agent' },
    { label: 'Profile',       icon: '⚙️', path: '/dashboard/farmer/profile' },
  ],
  AGENT: [
    { label: 'Overview',     icon: '📁', path: '/dashboard/agent' },
    { label: 'Farmers',      icon: '👥', path: '/dashboard/agent/farmers' },
    { label: 'Transactions', icon: '💸', path: '/dashboard/agent/transactions' },
    { label: 'My Profile',   icon: '⚙️', path: '/dashboard/agent/profile' },
  ],
  BUYER: [
    { label: 'Marketplace', icon: '🏪', path: '/dashboard/buyer' },
    { label: 'Orders',      icon: '📦', path: '/dashboard/buyer/orders' },
  ],
  ADMIN: [
    { label: 'Control Center',  icon: '🛡️', path: '/dashboard/admin' },
    { label: 'User Management', icon: '⚙️', path: '/dashboard/admin/users' },
  ],
};

// Per-role CSS class names — matches index.css
const ROLE_CONFIG = {
  FARMER: {
    wrapperClass:  'farmer-bg',
    sidebarClass:  'farmer-sidebar',
    navActive:     'bg-green-900/30 text-green-400 border-l-4 border-green-400',
    navHover:      'text-white/60 hover:text-white hover:bg-white/5',
    badge:         'bg-green-700 text-white',
    headerBg:      'bg-black/50 border-white/5',
    headerText:    'text-white',
    toggleBg:      'bg-white/10 text-white',
    statusDot:     'bg-green-400',
    statusText:    'text-green-400',
    logoutHover:   'hover:bg-red-500',
    personality:   'personality-farmer',
  },
  AGENT: {
    wrapperClass:  'agent-bg',
    sidebarClass:  'agent-sidebar',
    navActive:     'bg-orange-900/30 text-orange-300 border-l-4 border-orange-400',
    navHover:      'text-white/60 hover:text-white hover:bg-white/5',
    badge:         'bg-orange-700 text-white',
    headerBg:      'bg-black/50 border-white/5',
    headerText:    'text-white',
    toggleBg:      'bg-white/10 text-white',
    statusDot:     'bg-green-400',
    statusText:    'text-green-400',
    logoutHover:   'hover:bg-red-500',
    personality:   'personality-agent',
  },
  BUYER: {
    wrapperClass:  'buyer-bg',
    sidebarClass:  'buyer-sidebar',
    navActive:     'bg-amber-500 text-white',
    navHover:      'text-white/60 hover:text-white hover:bg-white/10',
    badge:         'bg-amber-500 text-white',
    headerBg:      'bg-white/80 border-primary-900/5',
    headerText:    'text-primary-950',
    toggleBg:      'bg-primary-50 text-primary-950',
    statusDot:     'bg-green-500',
    statusText:    'text-primary-700',
    logoutHover:   'hover:bg-red-500 hover:text-white',
    personality:   'personality-buyer',
  },
  ADMIN: {
    wrapperClass:  'admin-bg',
    sidebarClass:  'admin-sidebar',
    navActive:     'bg-white/10 text-white border-l-4 border-green-500',
    navHover:      'text-white/50 hover:text-white hover:bg-white/5',
    badge:         'bg-white/10 text-white',
    headerBg:      'bg-black/60 border-white/5',
    headerText:    'text-white',
    toggleBg:      'bg-white/10 text-white',
    statusDot:     'bg-green-500',
    statusText:    'text-green-400',
    logoutHover:   'hover:bg-red-600',
    personality:   'personality-admin',
  },
};

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const role     = getRole() || 'FARMER';
  const user     = getUser();

  const navItems = ROLE_NAV[role] || [];
  const cfg      = ROLE_CONFIG[role] || ROLE_CONFIG.FARMER;

  const handleLogout = () => { clearSession(); navigate('/login'); };

  const isActive = (path) => {
    if (path === `/dashboard/${role.toLowerCase()}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen ${cfg.wrapperClass} ${cfg.personality} flex relative font-sans`}>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside
        className={`${cfg.sidebarClass} text-white flex-shrink-0 transition-all duration-300 z-50 flex flex-col 
                    fixed inset-y-0 left-0 md:relative h-full overflow-hidden
                    ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-0'}`}
      >
        {/* Branding */}
        <div className="p-8 border-b border-white/10 flex-shrink-0">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary-700 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <span className="text-white font-display font-black text-2xl">A</span>
            </div>
            <div>
              <h2 className="font-display font-black text-xl tracking-tight leading-none italic">AgriLink</h2>
              <span className="text-[9px] font-black uppercase tracking-widest text-primary-400">Portal Infrastructure</span>
            </div>
          </Link>
        </div>

        {/* User chip */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${cfg.badge} flex items-center justify-center font-black text-sm flex-shrink-0`}>
              {(user?.fullName || user?.id || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-black text-sm text-white truncate">{user?.fullName || user?.id || 'User'}</p>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{role.toLowerCase()}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all group relative overflow-hidden
                ${isActive(item.path)
                  ? `${cfg.navActive} shadow-xl translate-x-1`
                  : cfg.navHover
                }`}
            >
              <span className="text-xl opacity-80 group-hover:opacity-100 flex-shrink-0">{item.icon}</span>
              <span className="font-black uppercase tracking-wide text-[11px]">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`w-full bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl
                       transition-all text-[10px] font-black uppercase tracking-widest
                       flex items-center justify-center gap-3 ${cfg.logoutHover} hover:text-white`}
          >
            <span>🚪</span> Secure Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 relative">

        {/* Header */}
        <header
          className={`h-20 ${cfg.headerBg} backdrop-blur-xl border-b px-8 flex items-center
                     justify-between sticky top-0 z-40`}
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className={`w-10 h-10 rounded-xl ${cfg.toggleBg} flex items-center justify-center
                         hover:opacity-80 transition-all`}
            >
              {isSidebarOpen ? '←' : '→'}
            </button>
            <h1 className={`font-display font-black text-2xl tracking-tighter ${cfg.headerText}`}>
              {navItems.find(i => isActive(i.path))?.label || 'AgriLink'}
            </h1>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className={`text-[9px] font-black uppercase tracking-widest opacity-40 ${cfg.headerText}`}>
              System Status
            </span>
            <span className={`flex items-center gap-2 text-[10px] font-black ${cfg.statusText}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.statusDot} animate-pulse`}></span>
              AgriLink Online
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 dashboard-content">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}
