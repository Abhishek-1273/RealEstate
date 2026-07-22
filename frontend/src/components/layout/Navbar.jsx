import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, User, X, ChevronDown, ArrowRight,
  Home, Building2, Key, Settings, Calendar, LogOut,
  Sun, Moon, Search
} from 'lucide-react';
import { useAuth, useWishlist, useSearch, useSiteSettings, getLogoInitials, renderBrandLogo } from '../../contexts';

import Magnetic from '../common/Magnetic';
import PremiumIcon from '../common/PremiumIcon';

const services = [
  { id: 'buy', title: 'Buy Property', desc: "Find your perfect luxury home from our verified Pune listings", icon: <Home className="w-5 h-5" />, link: '/services/buy', color: 'from-gold/10 to-transparent' },
  { id: 'sell', title: 'Sell Property', desc: "List with Pune's most trusted luxury real estate platform", icon: <Building2 className="w-5 h-5" />, link: '/services/sell', color: 'from-royal/10 to-transparent' },
  { id: 'lease', title: 'Lease Property', desc: 'Premium rental solutions for discerning clients in Pune', icon: <Key className="w-5 h-5" />, link: '/services/lease', color: 'from-emerald-500/10 to-transparent' },
  { id: 'manage', title: 'Property Management', desc: 'End-to-end care for your real estate portfolio', icon: <Settings className="w-5 h-5" />, link: '/services/management', color: 'from-purple-500/10 to-transparent' },
];

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', hasMenu: true },
  { label: 'Properties', path: '/properties' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="2.5"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

function MenuToggle({ isOpen }) {
  return (
    <svg width="20" height="20" viewBox="0 0 23 23" className="flex items-center justify-center">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.2 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { openAuth, user, signOut } = useAuth();
  const { setShowSearch } = useSearch();
  const { count } = useWishlist();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const megaRef = useRef(null);
  const megaPanelRef = useRef(null);
  const profileRef = useRef(null);

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // ── Mega menu outside-click close ─────────────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (
        megaRef.current && !megaRef.current.contains(e.target) &&
        megaPanelRef.current && !megaPanelRef.current.contains(e.target)
      ) setMegaOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => window.removeEventListener('mousedown', fn);
  }, []);

  // ── Profile dropdown outside-click close ─────────────────────────────────
  useEffect(() => {
    const fn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', fn);
    return () => window.removeEventListener('mousedown', fn);
  }, []);

  // ── Mobile body scroll lock ───────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    if (window.lenis) {
      if (mobileOpen) window.lenis.stop();
      else window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [mobileOpen]);

  const handleService = (link) => {
    setMegaOpen(false);
    setMobileOpen(false);
    if (!user) { openAuth(link); return; }
    navigate(link);
  };

  const handleSignOut = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await signOut();
    navigate('/');
  };

  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setProfileOpen(false);
  }, [pathname]);
  const isHome = pathname === '/';
  const isSolid = scrolled || !isHome;

  const navText = isSolid ? 'text-ink-muted dark:text-cream/90 hover:text-navy dark:hover:text-white' : 'text-white/90 hover:text-white';
  const activeStyle = isSolid ? 'text-gold-muted dark:text-gold font-semibold' : 'text-gold font-semibold';

  return (
    <>
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isSolid
          ? 'bg-white/95 dark:bg-navy-dark/95 backdrop-blur-2xl shadow-[0_1px_0_rgba(7,26,47,0.06),0_8px_32px_rgba(7,26,47,0.06)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06),0_8px_32px_rgba(3,14,27,0.4)]'
          : 'bg-transparent'
          }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-[74px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #E5C17D 0%, #ECD7AA 50%, #C69D59 100%)' }}
              >
                {settings?.logoIconImage ? (
                  <img src={settings.logoIconImage} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-navy font-display font-black text-sm leading-none tracking-tight">
                    {getLogoInitials(settings)}
                  </span>

                )}
              </div>
              <div className="flex flex-col justify-center">
                <p className={`font-display font-bold text-[17px] leading-tight tracking-tight transition-colors duration-300 ${isSolid ? 'text-navy dark:text-white' : 'text-white'}`}>
                  {renderBrandLogo(settings, '#E5C17D')}
                </p>
                <p className={`text-[8px] font-accent tracking-[0.25em] uppercase mt-[1.5px] transition-colors duration-300 ${isSolid ? 'text-ink-soft dark:text-white/50' : 'text-white/70'}`}>
                  {settings?.logoSubtitle || 'Luxury Real Estate · Pune'}
                </p>
              </div>



            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isServicesActive = link.hasMenu && pathname.startsWith('/services');
                return link.hasMenu ? (
                  <div key="services" ref={megaRef} className="relative">
                    <button
                      onMouseEnter={() => setMegaOpen(true)}
                      onClick={() => setMegaOpen(v => !v)}
                      className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-200 ${isServicesActive ? activeStyle : navText}`}
                    >
                      Services
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`} />
                      {isServicesActive && <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-gold scale-x-100" />}
                    </button>
                  </div>
                ) : (
                  <NavLink
                    key={link.label}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-200 ${isActive ? activeStyle : navText} group`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <span className={`absolute bottom-1 left-4 right-4 h-[2px] bg-gold origin-center transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`relative p-2.5 rounded-xl transition-all duration-200 group ${isSolid ? 'hover:bg-gray-100 dark:hover:bg-white/10' : 'hover:bg-white/10'}`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className={`w-[18px] h-[18px] transition-colors duration-200 ${isSolid ? 'text-ink-muted dark:text-cream/90 group-hover:text-navy dark:group-hover:text-white' : 'text-white/85 group-hover:text-white'}`} />
                ) : (
                  <Moon className={`w-[18px] h-[18px] transition-colors duration-200 ${isSolid ? 'text-ink-muted dark:text-cream/90 group-hover:text-navy dark:group-hover:text-white' : 'text-white/85 group-hover:text-white'}`} />
                )}
              </button>

              {/* Search */}
              <button
                onClick={() => setShowSearch(true)}
                className={`relative p-2.5 rounded-xl transition-all duration-200 group flex items-center justify-center ${isSolid ? 'hover:bg-gray-100 dark:hover:bg-white/10' : 'hover:bg-white/10'}`}
                aria-label="Search properties"
              >
                <Search
                  className={`w-[18px] h-[18px] transition-colors duration-200 ${isSolid ? 'text-ink-muted dark:text-cream/90 group-hover:text-navy dark:group-hover:text-white' : 'text-white/85 group-hover:text-white'}`}
                />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist"
                className={`relative p-2.5 rounded-xl transition-all duration-200 group ${isSolid ? 'hover:bg-gray-100 dark:hover:bg-white/10' : 'hover:bg-white/10'}`}>
                <Heart className={`w-[18px] h-[18px] transition-colors duration-200 ${isSolid ? 'text-ink-muted dark:text-cream/90 group-hover:text-navy dark:group-hover:text-white' : 'text-white/85 group-hover:text-white'}`} />
                {count > 0 && (
                  <span
                    className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-navy text-[9px] font-black rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #E5C17D, #ECD7AA)' }}
                  >
                    {count}
                  </span>
                )}
              </Link>

              {/* Profile / Sign In */}
              {user ? (
                <div ref={profileRef} className="relative ml-1">
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isSolid ? 'bg-navy text-white hover:bg-navy/90' : 'bg-white/15 text-white border border-white/20 hover:bg-white/20'
                      }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#071A2F' }}
                    >
                      {user.name[0].toUpperCase()}
                    </div>
                    {user.name.split(' ')[0]}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-navy rounded-2xl shadow-luxury border border-gray-100 dark:border-white/10 overflow-hidden z-50 transition-colors duration-300"
                      >
                        <div className="p-3 border-b border-gray-100 dark:border-white/10">
                          <p className="font-bold text-navy dark:text-white text-sm">{user.name}</p>
                          <p className="text-ink-soft dark:text-white/40 text-xs mt-0.5">{user.phone}</p>
                          {user.email && <p className="text-ink-soft dark:text-white/40 text-xs truncate">{user.email}</p>}
                        </div>
                        <div className="p-1.5">
                          <Link
                            to="/wishlist"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white transition-colors"
                          >
                            <Heart className="w-4 h-4" /> Saved Properties
                          </Link>
                          {user.role && user.role !== 'client' && (
                            <Link
                              to="/panel/dashboard"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-50 dark:hover:bg-amber-950/20 text-[#92400E] dark:text-gold-light transition-colors"
                            >
                              <span className="w-4 h-4 flex items-center justify-center text-xs">⚡</span>
                              Staff Panel
                            </Link>
                          )}
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openAuth()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ml-1 transition-all duration-200 ${isSolid ? 'text-ink-muted hover:text-navy hover:bg-gray-100' : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <User className="w-4 h-4" /> Sign In
                </button>
              )}

              {/* Book a Visit CTA */}
              <Magnetic>
                <button onClick={() => navigate('/contact', { state: { subject: 'Book a Site Visit' } })} className="btn-book-visit ml-2">
                  <Calendar className="w-3.5 h-3.5" /> Book a Visit
                </button>
              </Magnetic>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors flex items-center justify-center ${isSolid ? 'text-navy dark:text-cream/90 hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10'}`}
              aria-label="Toggle menu"
            >
              <MenuToggle isOpen={mobileOpen} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mega Menu ── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            ref={megaPanelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onMouseLeave={() => setMegaOpen(false)}
            className={`fixed top-[74px] inset-x-0 z-40 border-b transition-colors duration-500 ${isSolid ? 'bg-white dark:bg-navy-dark border-gray-200 dark:border-white/10' : 'bg-navy/95 dark:bg-navy-dark/95 backdrop-blur-2xl border-white/10'
              }`}
            style={{ boxShadow: '0 16px 48px rgba(7,26,47,0.10)' }}
          >
            <div className="container-luxury py-7">
              <div className="grid grid-cols-4 gap-3">
                {services.map((s, i) => (
                  <motion.button
                    key={s.id}
                    onClick={() => handleService(s.link)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`text-left p-5 rounded-2xl bg-gradient-to-br ${s.color} border transition-all duration-250 group ${isSolid
                      ? 'border-gray-100/80 dark:border-white/10 hover:border-gold/25 hover:shadow-card'
                      : 'border-white/10 hover:border-gold/25 hover:shadow-luxury'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <PremiumIcon icon={s.icon} size="md" variant="gold" />
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className={`font-display font-bold text-sm mb-1.5 ${isSolid ? 'text-navy dark:text-white' : 'text-white'}`}>{s.title}</h3>
                    <p className={`text-xs leading-relaxed ${isSolid ? 'text-ink-muted dark:text-cream/80' : 'text-white/60'}`}>{s.desc}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[1999] w-full h-[100dvh] bg-navy/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 z-[2000] w-[310px] h-[100dvh] flex flex-col"
              style={{ background: '#0A192F' }}
              data-lenis-prevent
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-[74px] shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #E5C17D, #ECD7AA)' }}>
                    {settings?.logoIconImage ? (
                      <img src={settings.logoIconImage} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-navy font-black text-xs">{getLogoInitials(settings)}</span>

                    )}
                  </div>
                  <span className="text-white font-display font-bold text-sm">
                    {renderBrandLogo(settings, '#E5C17D')}
                  </span>

                </div>
                <button onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
                {navLinks.map((link) =>
                  link.hasMenu ? (
                    <div key="svc-mobile">
                      <Link
                        to="/services"
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-3.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all"
                      >
                        Services
                      </Link>
                      <p className="text-white/40 text-[9px] font-accent tracking-[0.25em] uppercase px-3 pt-2 pb-1">
                        All Services
                      </p>
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleService(s.link)}
                          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all text-sm text-left"
                        >
                          <span className="text-gold opacity-90">{s.icon}</span>
                          {s.title}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <NavLink
                      key={link.label}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'text-gold font-semibold' : 'text-white/80 hover:text-white hover:bg-white/8'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}

                {/* Subtle Divider */}
                <div className="h-px bg-white/10 my-3.5 mx-3" />

                {/* Wishlist link in mobile drawer */}
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all"
                >
                  <Heart className="w-4 h-4 text-gold opacity-80" />
                  Saved Properties
                </Link>

                {/* Staff Panel link — only for non-client roles */}
                {user && user.role && user.role !== 'client' && (
                  <Link
                    to="/panel/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ color: '#D4AF37', background: 'rgba(212,175,55,0.08)' }}
                  >
                    <span className="text-base">⚡</span>
                    Staff Panel
                  </Link>
                )}

                {/* Theme toggle in mobile drawer */}
                <button
                  onClick={() => { setMobileOpen(false); toggleTheme(); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all w-full text-left"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-gold opacity-80" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-gold opacity-80" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>

                {/* Search in mobile drawer */}
                <button
                  onClick={() => { setMobileOpen(false); setShowSearch(true); }}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/8 transition-all w-full text-left"
                >
                  <Search className="w-4 h-4 text-gold opacity-80" />
                  Search Properties
                </button>
              </nav>

              {/* Bottom actions */}
              <div className="p-4 space-y-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/contact', { state: { subject: 'Book a Site Visit' } }); }}
                  className="w-full btn-book-visit justify-center"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book a Visit
                </button>

                {!user && (
                  <button
                    onClick={() => { setMobileOpen(false); openAuth(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-sm font-semibold transition-all"
                  >
                    <User className="w-4 h-4" /> Sign In
                  </button>
                )}

                {user && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/6">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #E5C17D, #ECD7AA)' }}>
                        <span className="text-navy font-black text-sm">{user.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm leading-none truncate">{user.name}</p>
                        <p className="text-white/50 text-xs mt-0.5">{user.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
