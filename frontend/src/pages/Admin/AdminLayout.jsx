import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2,
  FileText, LogOut, Menu, ChevronRight, Globe, Database, Settings, Award, HelpCircle
} from 'lucide-react';
import { useAdmin } from './AdminContext';
import { useSiteSettings } from '../../contexts';

const ROLE_COLOR = {
  admin:        '#D4AF37',
  management:   '#D4AF37',
  agent:        '#D4AF37',
};

const ROLE_LABEL = {
  admin:        'Admin',
  management:   'Management',
  agent:        'Agent',
};

const NAV = [
  { to: '/panel/dashboard',    label: 'Dashboard',       Icon: LayoutDashboard, roles: ['admin', 'management'] },
  { to: '/panel/properties',   label: 'Properties',      Icon: Building2,        roles: ['admin', 'management'] },
  { to: '/panel/blogs',        label: 'Blogs & Reviews', Icon: FileText,         roles: ['admin', 'management'] },
  { to: '/panel/partners',     label: 'Partners',        Icon: Globe,            roles: ['admin', 'management'] },
  { to: '/panel/advisors',     label: 'Advisors Panel',  Icon: Award,            roles: ['admin', 'management'] },
  { to: '/panel/faqs',         label: 'FAQ Manager',     Icon: HelpCircle,       roles: ['admin', 'management'] },
  { to: '/panel/settings',     label: 'Site Settings',   Icon: Settings,         roles: ['admin', 'management'] },
  { to: '/panel/users',        label: 'Staff Directory', Icon: Users,            roles: ['admin'] },
  { to: '/panel/master-data',  label: 'Master Data',     Icon: Database,         roles: ['admin'] },
];

export default function AdminLayout() {
  const { user, signOut, isStaff } = useAdmin();
  const { settings } = useSiteSettings();
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);

  // Safeguard: Ensure scrollbars and body overflows are fully enabled inside the admin layout
  useEffect(() => {
    document.body.style.overflow = 'unset';
    document.documentElement.style.overflow = 'unset';
    document.documentElement.classList.remove('lenis');
    document.documentElement.classList.remove('lenis-smooth');
    document.documentElement.classList.remove('lenis-stopped');

    if (window.lenis) {
      try {
        window.lenis.destroy();
        window.lenis = null;
      } catch (err) {
        console.log("Lenis cleanup bypass:", err);
      }
    }
  }, []);

  if (!isStaff) {
    navigate('/panel/login');
    return null;
  }

  const links = NAV.filter(n => n.roles.includes(user?.role));
  const roleColor = ROLE_COLOR[user?.role] || '#D4AF37';

  const handleSignOut = async () => {
    await signOut();
    navigate('/panel/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
            {settings?.logoIconImage ? (
              <img src={settings.logoIconImage} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="font-black text-navy text-sm" style={{ fontFamily: 'Manrope,sans-serif' }}>
                {settings?.logoIconText || 'HR'}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none">
              {settings?.logoTextPrimary || 'Hyper'}{settings?.logoTextSecondary || 'Relestix'}
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">Internal Panel</p>
          </div>
        </div>
      </div>

      {/* User badge */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
            style={{ background: `${roleColor}33`, color: roleColor }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${roleColor}22`, color: roleColor }}>
              {ROLE_LABEL[user?.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? { background: `${roleColor}22`, color: roleColor } : {}}>
            {({ isActive }) => (
              <>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}

        <Link to="/" onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 mt-4 pt-4 border-t border-white/5">
          <Globe className="w-4 h-4 shrink-0 text-white/40" />
          <span className="flex-1">View Website</span>
        </Link>
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F5F5F4] dark:bg-[#080F1A] transition-colors duration-300" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Desktop sidebar — stays dark navy always */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 overflow-hidden" style={{ background: '#071A2F' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="w-60 h-full" style={{ background: '#071A2F' }}>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-navy-dark border-gray-200 dark:border-white/10 transition-colors duration-300">
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <Menu className="w-5 h-5 text-gray-600 dark:text-white/70" />
          </button>
          <span className="font-bold text-navy dark:text-white text-sm" style={{ fontFamily: 'Manrope,sans-serif' }}>
            {settings?.logoTextPrimary || 'Hyper'}{settings?.logoTextSecondary || 'Relestix'} Panel
          </span>
          <button onClick={handleSignOut} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <LogOut className="w-4 h-4 text-gray-500 dark:text-white/50" />
          </button>
        </div>

        <main data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain p-4 md:p-7 [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
