import { Link } from 'react-router-dom';

import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa6';
import { useAuth } from '../../contexts';

const gatedPaths = ['/services/buy', '/services/sell', '/services/lease', '/services/management'];

const links = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Our Team', to: '/about#team' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/contact' },
    { label: 'Press', to: '/contact' },
  ],
  services: [
    { label: 'Buy Property', to: '/services/buy' },
    { label: 'Sell Property', to: '/services/sell' },
    { label: 'Lease Property', to: '/services/lease' },
    { label: 'Property Management', to: '/services/management' },
    { label: 'Home Loans', to: '/contact' },
  ],
  properties: [
    { label: 'Luxury Villas', to: '/properties?category=villas' },
    { label: 'Apartments', to: '/properties?category=apartments' },
    { label: 'Penthouses', to: '/properties?category=penthouse' },
    { label: 'Farm Houses', to: '/properties?category=farm' },
    { label: 'Commercial', to: '/properties?category=commercial' },
  ],
  locations: [
    { label: 'Mumbai', to: '/properties?city=Mumbai' },
    { label: 'Delhi NCR', to: '/properties?city=Delhi NCR' },
    { label: 'Bengaluru', to: '/properties?city=Bengaluru' },
    { label: 'Hyderabad', to: '/properties?city=Hyderabad' },
    { label: 'Pune', to: '/properties?city=Pune' },
  ],
};

const socials = [
  { icon: <FaInstagram />, href: '#', label: 'Instagram' },
  { icon: <FaXTwitter />, href: '#', label: 'X (Twitter)' },
  { icon: <FaLinkedinIn />, href: '#', label: 'LinkedIn' },
  { icon: <FaYoutube />, href: '#', label: 'YouTube' },
];

const columns = [
  { title: 'Company', items: links.company },
  { title: 'Services', items: links.services },
  { title: 'Properties', items: links.properties },
  { title: 'Locations', items: links.locations },
];

export default function Footer() {
  const { user, openAuth } = useAuth();

  const handleLinkClick = (e, to) => {
    if (!user && gatedPaths.includes(to)) {
      e.preventDefault();
      openAuth(to);
    }
  };

  return (
    <footer className="bg-mesh-dark relative overflow-hidden">
      {/* Ambient glow spots */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(30,58,138,0.08) 0%, transparent 70%)' }} />

      <div className="container-luxury pt-20 pb-12 relative">


        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 xl:gap-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-7 group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E8C84A 50%, #A8882B 100%)' }}
              >
                <span className="text-navy font-display font-black text-sm leading-none">HR</span>
              </div>
              <div>
                <p className="font-display font-bold text-xl text-white leading-none">
                  Hyper<span style={{ color: '#D4AF37' }}>Relestix</span>
                </p>
                <p className="text-white/40 text-[8px] font-accent tracking-[0.25em] uppercase mt-0.5">
                  Luxury Real Estate · Pune
                </p>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-[1.9] mb-7 max-w-[280px]">
              Pune's most trusted luxury real estate platform. We help discerning buyers and sellers navigate premium property markets with expertise and elegance.
            </p>

            <div className="space-y-3.5 mb-7">
              {[
                { icon: <MapPin className="w-3.5 h-3.5 shrink-0" />, text: 'Level 12, Panchshil Tech Park, Yerwada, Pune 411006' },
                { icon: <Phone className="w-3.5 h-3.5 shrink-0" />, text: '+91 98765 43210' },
                { icon: <Mail className="w-3.5 h-3.5 shrink-0" />, text: 'hello@hyperrelestix.in' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-white/55 text-xs leading-relaxed">
                  <span className="mt-0.5" style={{ color: '#D4AF37' }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/50 text-sm transition-all duration-250"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #D4AF37, #E8C84A)';
                    e.currentTarget.style.color = '#071A2F';
                    e.currentTarget.style.border = '1px solid transparent';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)';
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
            {['Privacy Policy', 'Terms of Service', 'RERA: P52100046789'].map((l) => (
              <a key={l} href="#" className="text-white/35 hover:text-gold text-xs transition-colors duration-200">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
