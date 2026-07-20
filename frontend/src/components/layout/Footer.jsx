import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';
import { useAuth, useSiteSettings } from '../../contexts';
import KineticGrid from '../common/KineticGrid';

const gatedPaths = ['/services/buy', '/services/sell', '/services/lease', '/services/management'];

const links = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Team', to: '/about#team' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'My Wishlist', to: '/wishlist' },
  ],
  services: [
    { label: 'Buy Property', to: '/services/buy' },
    { label: 'Sell Property', to: '/services/sell' },
    { label: 'Lease Property', to: '/services/lease' },
    { label: 'Property Management', to: '/services/management' },
  ],
  properties: [
    { label: 'Luxury Villas', to: '/properties?category=villas' },
    { label: 'Apartments', to: '/properties?category=apartments' },
    { label: 'Penthouses', to: '/properties?category=penthouse' },
    { label: 'Farm Houses', to: '/properties?category=farm' },
    { label: 'Commercial', to: '/properties?category=commercial' },
  ],
  locations: [
    { label: 'Balewadi', to: '/properties?city=Balewadi' },
    { label: 'Baner', to: '/properties?city=Baner' },
    { label: 'Kharadi', to: '/properties?city=Kharadi' },
    { label: 'Viman Nagar', to: '/properties?city=Viman Nagar' },
    { label: 'Hadapsar', to: '/properties?city=Hadapsar' },
  ],
};

const columns = [
  { title: 'Company', items: links.company },
  { title: 'Services', items: links.services },
  { title: 'Properties', items: links.properties },
  { title: 'Locations', items: links.locations },
];

export default function Footer() {
  const { user, openAuth } = useAuth();
  const { settings } = useSiteSettings();

  const dynamicSocials = [
    { icon: <FaInstagram />, href: settings?.socials?.instagram || '#', label: 'Instagram' },
    { icon: <FaXTwitter />, href: settings?.socials?.twitter || '#', label: 'X (Twitter)' },
    { icon: <FaLinkedinIn />, href: settings?.socials?.linkedin || '#', label: 'LinkedIn' },
    { icon: <FaYoutube />, href: settings?.socials?.facebook || '#', label: 'Facebook' },
  ];

  const handleLinkClick = (e, to) => {
    if (!user && gatedPaths.includes(to)) {
      e.preventDefault();
      openAuth(to);
    }
  };

  return (
    <footer className="bg-mesh-dark relative overflow-hidden">
      <KineticGrid background="transparent" lineColor="rgba(212,175,55,0.05)" dotColor="rgba(212,175,55,0.12)" spacing={50} radius={180} />
      {/* Ambient glow spots */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />

      <div className="container-luxury pt-20 pb-12 relative">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 xl:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-7 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E8C84A 50%, #A8882B 100%)' }}
              >
                {settings?.logoIconImage ? (
                  <img src={settings.logoIconImage} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-navy font-display font-black text-sm leading-none">{settings?.logoIconText || 'HR'}</span>
                )}
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white leading-none">
                  {settings?.logoTextPrimary || 'Hyper'}<span style={{ color: '#D4AF37' }}>{settings?.logoTextSecondary || 'Relestix'}</span>
                </p>
                <p className="text-white/40 text-[8px] font-accent tracking-[0.25em] uppercase mt-0.5">
                  {settings?.logoSubtitle || 'Luxury Real Estate · Pune'}
                </p>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-[1.9] mb-7 max-w-[280px]">
              Pune's most trusted luxury real estate platform. We help discerning buyers and sellers navigate premium property markets with expertise and elegance.
            </p>

            <div className="space-y-3.5 mb-7">
              {[
                { icon: <MapPin className="w-3.5 h-3.5 shrink-0" />, text: settings?.contactAddress || 'Level 12, Panchshil Tech Park, Yerwada, Pune 411006' },
                { icon: <Phone className="w-3.5 h-3.5 shrink-0" />, text: settings?.contactPhone1 || '+91 98765 43210' },
                { icon: <Mail className="w-3.5 h-3.5 shrink-0" />, text: settings?.contactEmail1 || 'hello@hyperrelestix.in' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-white/55 text-xs leading-relaxed">
                  <span className="mt-0.5" style={{ color: '#D4AF37' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {dynamicSocials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 text-sm transition-all duration-250 hover:text-navy"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37, #E8C84A)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="col-span-1 lg:col-span-2">
              <h4 className="font-display font-bold text-white text-[10px] uppercase tracking-[0.22em] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.items.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={(e) => handleLinkClick(e, link.to)}
                      className="text-white/50 hover:text-gold text-sm transition-all duration-300 flex items-center relative pl-0 hover:pl-5 group"
                    >
                      <ArrowRight className="w-3 h-3 absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-gold" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-luxury py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs">
            © 2025 HyperRelestix Realty Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-white/35 hover:text-gold text-xs transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/35 hover:text-gold text-xs transition-colors duration-200">
              Terms of Service
            </Link>
            <span className="text-white/35 text-xs">
              RERA: P52100046789
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
