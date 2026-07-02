import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, User, Menu, X, ChevronDown, ArrowRight,
  Home, Building2, Key, Settings, Calendar
} from 'lucide-react';
import { useAuth, useWishlist } from '../../contexts';
import Magnetic from '../common/Magnetic';
import PremiumIcon from '../common/PremiumIcon';

const services = [
  {
    id: 'buy',
    title: 'Buy Property',
    desc: 'Find your perfect luxury home from our verified Pune listings',
    icon: <Home className="w-5 h-5" />,
    link: '/services/buy',
    color: 'from-gold/10 to-transparent',
  },
  {
    id: 'sell',
    title: 'Sell Property',
    desc: "List with Pune's most trusted luxury real estate platform",
    icon: <Building2 className="w-5 h-5" />,
    link: '/services/sell',
    color: 'from-royal/10 to-transparent',
  },
  {
    id: 'lease',
    title: 'Lease Property',
    desc: 'Premium rental solutions for discerning clients in Pune',
    icon: <Key className="w-5 h-5" />,
    link: '/services/lease',
    color: 'from-emerald-500/10 to-transparent',
  },
  {
    id: 'manage',
    title: 'Property Management',
    desc: 'End-to-end care for your real estate portfolio',
    icon: <Settings className="w-5 h-5" />,
    link: '/services/management',
    color: 'from-purple-500/10 to-transparent',
  },
];

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', hasMenu: true },
  { label: 'Properties', path: '/properties' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const { openAuth, user } = useAuth();
  const { count } = useWishlist();
  const navigate = useNavigate();
  const megaRef = useRef(null);
  const megaPanelRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => {
      if (
        megaRef.current && !megaRef.current.contains(e.target) &&
        megaPanelRef.current && !megaPanelRef.current.contains(e.target)
      ) setMegaOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleService = (link) => {
    setMegaOpen(false);
    setMobileOpen(false);
    if (!user) {
      openAuth(link);
      return;
    }
    navigate(link);
  };

  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isSolid = scrolled || !isHome;

  const navText = isSolid
    ? 'text-ink-muted hover:text-navy'
    : 'text-white/90 hover:text-white';
  const activeStyle = isSolid
    ? 'text-gold-muted font-semibold'
    : 'text-gold font-semibold';

  return (
    <>
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isSolid
            ? 'bg-white/95 backdrop-blur-2xl shadow-[0_1px_0_rgba(7,26,47,0.06),0_8px_32px_rgba(7,26,47,0.06)]'
            : 'bg-transparent'
          }`}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-[74px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #E5C17D 0%, #ECD7AA 50%, #C69D59 100%)' }}
              >
                <span className="text-navy font-display font-black text-sm leading-none tracking-tight">HR</span>
              </div>
              <div className="leading-none">
                <p className={`font-display font-bold text-[17px] tracking-tight transition-colors duration-300 ${isSolid ? 'text-navy' : 'text-white'}`}>
                  Hyper<span style={{ color: '#E5C17D' }}>Relestix</span>
                </p>
                <p className={`text-[8px] font-accent tracking-[0.25em] uppercase mt-1 transition-colors duration-300 ${isSolid ? 'text-ink-soft' : 'text-white/70'}`}>
                  Luxury Real Estate · Pune
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
                      onClick={() => setMegaOpen((v) => !v)}
                      className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all duration-200 ${
                        isServicesActive ? activeStyle : navText
                      }`}
                    >
                      Services
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? 'rotate-180' : ''}`}
                      />
                      {isServicesActive && (
                        <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-gold scale-x-100" />
                      )}
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
                )
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className={`relative p-2.5 rounded-xl transition-all duration-200 group ${isSolid ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                  }`}
              >
                <Heart
                  className={`w-[18px] h-[18px] transition-colors duration-200 ${isSolid ? 'text-ink-muted group-hover:text-navy' : 'text-white/85 group-hover:text-white'
                    }`}
                />
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
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ml-1 ${isSolid ? 'bg-navy text-white' : 'bg-white/15 text-white border border-white/20'
                    }`}
                >
                  <User className="w-4 h-4" />
                  {user.name.split(' ')[0]}
                </div>
              ) : (
                <button
                  onClick={() => openAuth()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ml-1 transition-all duration-200 ${isSolid
                      ? 'text-ink-muted hover:text-navy hover:bg-gray-100'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}

              {/* Book a Visit — Gold CTA */}
              <Magnetic>
                <button
                  onClick={() => navigate('/contact')}
                  className="btn-book-visit ml-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book a Visit
                </button>
              </Magnetic>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${isSolid ? 'text-navy hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
            >
              <Menu className="w-5 h-5" />
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
            className={`fixed top-[74px] inset-x-0 z-40 border-b transition-colors duration-500 ${isSolid
                ? 'bg-white border-gray-200'
                : 'bg-navy/95 backdrop-blur-2xl border-white/10'
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
                        ? 'border-gray-100/80 hover:border-gold/25 hover:shadow-card'
                        : 'border-white/10 hover:border-gold/25 hover:shadow-luxury'
                      }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <PremiumIcon icon={s.icon} size="md" variant="gold" />
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <h3 className={`font-display font-bold text-sm mb-1.5 ${isSolid ? 'text-navy' : 'text-white'}`}>{s.title}</h3>
                    <p className={`text-xs leading-relaxed ${isSolid ? 'text-ink-muted' : 'text-white/60'}`}>{s.desc}</p>
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
              className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[310px] flex flex-col"
              style={{ background: '#0A192F' }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-6 h-[74px] shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #E5C17D, #ECD7AA)' }}
                  >
                    <span className="text-navy font-black text-xs">HR</span>
                  </div>
                  <span className="text-white font-display font-bold text-sm">HyperRelestix</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-0.5">
                {navLinks.map((link) =>
                  link.hasMenu ? (
                    <div key="svc-mobile">
                      <p className="text-white/40 text-[9px] font-accent tracking-[0.25em] uppercase px-3 pt-6 pb-2">
                        Services
                      </p>
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleService(s.link)}
                          className="flex items-center gap-3 w-full px-3 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/8 transition-all text-sm text-left"
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
                        `block px-3 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                          ? 'text-gold font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/8'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )
                )}
              </nav>

              {/* Bottom */}
              <div className="p-4 space-y-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/contact'); }}
                  className="w-full btn-book-visit justify-center"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Book a Visit
                </button>
                {!user && (
                  <button
                    onClick={() => { setMobileOpen(false); openAuth(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 text-sm font-semibold transition-all"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
                {user && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/6">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'linear-gradient(135deg, #E5C17D, #ECD7AA)' }}
                    >
                      <span className="text-navy font-black text-sm">{user.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm leading-none">{user.name}</p>
                      <p className="text-white/50 text-xs mt-0.5">{user.phone}</p>
                    </div>
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
