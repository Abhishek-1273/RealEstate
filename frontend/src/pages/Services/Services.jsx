import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Home, Building2, Key, Settings, CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';
import PremiumIcon from '../../components/common/PremiumIcon';
import { useAuth } from '../../contexts';

const services = [
  {
    id: 'buy',
    icon: <Home className="w-8 h-8" />,
    title: 'Buy Property',
    tagline: 'Find Your Dream Home',
    desc: 'From compact luxury apartments to sprawling villas — we curate only the finest properties across Pune\'s most coveted localities.',
    link: '/services/buy',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    features: ['RERA Verified Listings', 'Virtual Site Tours', 'Home Loan Assistance', 'Legal Documentation Support'],
    color: 'from-gold/10 to-transparent',
    accentColor: '#D4AF37',
  },
  {
    id: 'sell',
    icon: <Building2 className="w-8 h-8" />,
    title: 'Sell Property',
    tagline: 'Maximise Your Asset',
    desc: 'List with Pune\'s most trusted luxury platform. Our advisors deliver premium valuations and sell 40% faster than market average.',
    link: '/services/sell',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    features: ['Free Professional Valuation', 'Premium Photography', 'NRI-Friendly Process', 'Maximum Visibility Marketing'],
    color: 'from-royal/10 to-transparent',
    accentColor: '#1E3A8A',
  },
  {
    id: 'lease',
    icon: <Key className="w-8 h-8" />,
    title: 'Lease Property',
    tagline: 'Premium Rental Solutions',
    desc: 'Whether you\'re seeking a luxury rental or leasing your asset — our rental desk manages every detail with discretion and expertise.',
    link: '/services/lease',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    features: ['Tenant Screening', 'Rental Agreement Drafting', 'Rent Optimisation', 'Property Handover Management'],
    color: 'from-emerald-500/10 to-transparent',
    accentColor: '#10B981',
  },
  {
    id: 'manage',
    icon: <Settings className="w-8 h-8" />,
    title: 'Property Management',
    tagline: 'Hands-Free Ownership',
    desc: 'Your property, perfectly managed. From maintenance to tenant relations — we handle everything so you don\'t have to.',
    link: '/services/management',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    features: ['Maintenance Coordination', 'Tenant Relations', 'Monthly Reporting', 'NRI Remote Management'],
    color: 'from-purple-500/10 to-transparent',
    accentColor: '#8B5CF6',
  },
];

export default function Services() {
  const { user, openAuth } = useAuth();

  const handleServiceClick = (e, link) => {
    if (!user) {
      e.preventDefault();
      openAuth(link);
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-20">

      {/* ── Hero ── */}
      <div className="relative py-28 overflow-hidden bg-mesh-dark">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <div className="container-luxury relative text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>
                What We Offer
              </span>
              <span className="h-px w-8" style={{ background: 'linear-gradient(270deg, transparent, #D4AF37)' }} />
            </div>
            <h1 className="font-display font-black text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Our <span style={{ color: '#D4AF37' }}>Premium</span> Services
            </h1>
            <p className="text-white/55 max-w-xl mx-auto font-body leading-relaxed">
              From first search to final handover — HyperRelestix delivers end-to-end luxury real estate services designed for Pune's most discerning clients.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Service Cards ── */}
      <div className="container-luxury py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((s) => (
            <motion.div key={s.id} variants={fadeUp}>
              <Link to={s.link} onClick={(e) => handleServiceClick(e, s.link)} className="group block rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-luxury"
                style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)', boxShadow: '0 2px 24px rgba(7,26,47,0.07)' }}>
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.75) 0%, transparent 60%)' }} />
                  <div className="absolute top-5 left-5">
                    <PremiumIcon icon={s.icon} size="lg" variant="glass-dark" />
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <p className="text-[9px] font-accent tracking-[0.22em] uppercase mb-1" style={{ color: '#D4AF37' }}>{s.tagline}</p>
                    <h2 className="font-display font-black text-white text-2xl">{s.title}</h2>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7">
                  <p className="text-ink-muted text-sm leading-[1.85] mb-6">{s.desc}</p>
                  <ul className="space-y-2.5 mb-7">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-navy font-body">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#D4AF37' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 font-semibold text-sm transition-all duration-300 group-hover:gap-3"
                    style={{ color: '#D4AF37' }}>
                    Get Started <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── CTA Banner ── */}
      <div className="bg-mesh-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.07) 0%, transparent 60%)' }} />
        <div className="container-luxury relative text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <p className="font-display font-black text-white text-2xl md:text-3xl mb-4">
              Not sure which service is right for you?
            </p>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Speak with a senior HyperRelestix advisor — completely free, completely confidential.
            </p>
            <Link to="/contact" className="btn-primary">
              Talk to an Advisor <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
