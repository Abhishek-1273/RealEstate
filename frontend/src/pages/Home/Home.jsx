import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, Shield, Award, Clock, TrendingUp,
  CheckCircle2, MapPin, Home as HomeIcon, Building2,
  Building, Store, Trees, Layers
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Hero from '../../components/common/Hero';
import SectionHeader from '../../components/common/SectionHeader';
import { testimonials, categories, companyLogos } from '../../data/index';
import { submitEnquiry, fetchPropertyCounts, fetchPartners } from '../../utils/api';
import { fadeUp, scaleIn, staggerContainer, staggerFast, viewportOnce } from '../../animations/variants';
import SEO from '../../components/common/SEO';
import ErrorBoundary from '../../components/common/ErrorBoundary';

// Subcomponents
import FeaturedProperties from './components/FeaturedProperties';
import StatsStrip from './components/StatsStrip';
import ExploreCities from './components/ExploreCities';
import BlogPreview from './components/BlogPreview';

const CATEGORY_ICON_MAP = {
  'Luxury Villas': HomeIcon,
  'Apartments': Building2,
  'Penthouses': Building,
  'Commercial': Store,
  'Farm Houses': Trees,
  'Plots': Layers,
};

/* ══════════════════════════════════════════════════════════════════════════
   TRUST MARQUEE
══════════════════════════════════════════════════════════════════════════ */
function TrustMarquee() {
  const logos = [...companyLogos, ...companyLogos]; // doubled is sufficient for seamless -50% scroll
  return (
    <section className="py-16 bg-white dark:bg-navy-dark border-y border-gray-100 dark:border-white/10 transition-colors duration-300">
      <div className="container-luxury mb-8 text-center">
        <p className="text-[11px] font-accent text-gold font-bold tracking-[0.28em] uppercase mb-1">
          Trusted Financing Partners
        </p>
        <div className="h-[2px] w-8 bg-gold/50 mx-auto mt-2 rounded-full" />
      </div>
      <div className="relative overflow-hidden py-2">
        <div className="flex gap-6 animate-scroll whitespace-nowrap w-max hover:[animation-play-state:paused] py-2">
          {logos.map((l, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center px-8 py-4.5 bg-white dark:bg-navy border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-[0_4px_16px_rgba(10,25,47,0.02)] transition-all duration-300 hover:border-gold/30 hover:shadow-[0_12px_24px_rgba(229,193,125,0.12)] hover:-translate-y-1 group cursor-pointer"
            >
              <span className="font-display font-extrabold text-sm tracking-widest uppercase text-navy/45 dark:text-cream/50 group-hover:text-gold transition-colors duration-300">
                {l.name}
              </span>
            </div>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-32 pointer-events-none bg-gradient-to-r from-white dark:from-navy-dark to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 pointer-events-none bg-gradient-to-l from-white dark:from-navy-dark to-transparent z-10" />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PROPERTY CATEGORIES
══════════════════════════════════════════════════════════════════════════ */
function Categories({ counts = {} }) {
  return (
    <section className="section-pad-sm bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <SectionHeader
          label="Browse by Type"
          title={<>Property <span style={{ color: '#D4AF37' }}>Categories</span></>}
          align="center"
          className="mb-14"
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5"
        >
          {categories.map((c) => {
            const Icon = CATEGORY_ICON_MAP[c.name] || HomeIcon;
            return (
              <motion.div key={c.id} variants={fadeUp}>
                <Link
                  to={`/properties?category=${c.id}`}
                  className="group block bg-white dark:bg-navy-light rounded-3xl p-7 text-center border border-gray-150 dark:border-white/5 transition-all duration-400 hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_16px_36px_rgba(10,25,47,0.04)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.25)] relative overflow-hidden"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="w-5.5 h-5.5" style={{ color: '#D4AF37' }} />
                  </div>
                  <h3 className="font-display font-bold text-navy dark:text-white text-xs md:text-sm tracking-tight mb-2">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-ink-soft dark:text-white/40 font-semibold tracking-wide uppercase">
                    {counts[c.name] ?? 0} Listings
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   WHY US (ACCORDION WITH IMAGE REVEAL / FLOATING TABS)
══════════════════════════════════════════════════════════════════════════ */
function WhyUs() {
  const [activeTab, setActiveTab] = useState(0);

  const items = [
    {
      title: 'RERA-Verified Portfolio Only',
      desc: 'We enforce 100% legal verification. Every penthouse, villa, and apartment has undergone RERA verification and full title registration audit before hitting our platform.',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      title: 'Elite Advisory Network',
      desc: 'Our real estate advisors have 15+ years of deep luxury market intelligence. We consult on legal due diligence, tax structures, FEMA compliance, and property valuations.',
      icon: <Award className="w-5 h-5" />,
    },
    {
      title: 'Seamless Remote Execution',
      desc: 'Specifically designed for remote buyers and NRI investors. Video walkthroughs, remote PoA logistics, digital contracts, and absolute security at every stage.',
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <section className="section-pad bg-white dark:bg-navy-dark transition-colors duration-300">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              label="Why HyperRelestix"
              title={<>Setting the Standard in <span style={{ color: '#D4AF37' }}>Advisory</span></>}
              description="We do not just list properties. We provide a full-service, secure transactional ecosystem built on transparency."
              className="mb-10"
            />

            <div className="space-y-4">
              {items.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${activeTab === i
                      ? 'bg-gold/5 border-gold/30 dark:bg-gold/[0.03]'
                      : 'bg-transparent border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                    }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activeTab === i ? 'bg-gold/25 text-gold-dark dark:text-gold' : 'bg-black/5 dark:bg-white/5 text-ink-muted'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className={`font-display font-bold text-sm md:text-base leading-none transition-colors mb-2.5 ${activeTab === i ? 'text-navy dark:text-white font-extrabold' : 'text-ink-muted dark:text-cream/80'}`}>
                        {item.title}
                      </h3>
                      {activeTab === i && (
                        <p className="text-ink-muted dark:text-white/60 text-xs leading-relaxed mt-2 animate-fade-in">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic illustrative elements */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-[32px] overflow-hidden bg-mesh-dark p-10 flex flex-col justify-between relative shadow-luxury">
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(circle at 100% 0%, rgba(212,175,55,0.2) 0%, transparent 60%)' }} />

              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="font-accent font-bold text-[9px] tracking-widest text-gold uppercase" style={{ color: '#D4AF37' }}>RERA Document Audit</p>
                  <h4 className="font-display font-black text-white text-lg mt-1">Pune Market Intelligence</h4>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/25 text-gold text-[10px] font-bold" style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.25)' }}>
                  Verified
                </div>
              </div>

              <div className="relative z-10 py-6 my-auto">
                <p className="text-white/80 font-body text-sm leading-relaxed max-w-sm">
                  "HyperRelestix operates with complete legal compliance and deep fiduciary responsibility, ensuring every transaction is completely RERA-verified."
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-3 pt-6 border-t border-white/10">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/10 text-gold text-xs font-bold" style={{ color: '#D4AF37' }}>HR</div>
                <div>
                  <p className="text-white text-xs font-bold font-display">Advisory Board</p>
                  <p className="text-white/40 text-[9px] mt-0.5 uppercase tracking-wide">FEMA & Tax Compliance Audited</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BUYING JOURNEY (STAGGERED STEPS)
══════════════════════════════════════════════════════════════════════════ */
function BuyingJourney() {
  const steps = [
    { num: '01', title: 'Consultation & Shortlisting', desc: 'Connect with a senior advisor to discuss FEMA guidelines, tax parameters, and view immersive RERA-verified options.' },
    { num: '02', title: 'Virtual Tours & Auditing', desc: 'Inspect property dimensions, locality metrics, and title registry documents via video streaming and digital assets.' },
    { num: '03', title: 'Escrow & Title Transfer', desc: 'Secure remittances directly via NRE/NRO banking channels. Our legal team drafts digital contracts and manages registration.' },
  ];

  return (
    <section className="section-pad bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <SectionHeader
          label="The Transaction Process"
          title={<>Your Journey, <span style={{ color: '#D4AF37' }}>Simplified</span></>}
          align="center"
          className="mb-16"
        />
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="bg-white dark:bg-navy-light rounded-3xl p-8 border border-gray-150 dark:border-white/5 shadow-card relative h-full flex flex-col justify-between">
              <div>
                <p className="font-display font-black text-gold/25 text-4xl mb-6">{s.num}</p>
                <h3 className="font-display font-bold text-navy dark:text-white text-lg mb-3">{s.title}</h3>
                <p className="text-ink-muted dark:text-white/60 text-xs leading-relaxed">{s.desc}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/10 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] text-ink-soft dark:text-white/40 uppercase tracking-wider font-bold">Secure Phase</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS (CAROUSEL / SWIPER)
══════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="section-pad bg-white dark:bg-navy-dark transition-colors duration-300">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeader
            label="Client Reviews"
            title={<>Trusted by <span style={{ color: '#D4AF37' }}>Advisors & HNIs</span></>}
            description="Listen to what local Pune property owners and global NRI investors say about our advisory service."
          />
        </div>
        <ErrorBoundary widget>
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={28}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            className="pb-14 animate-fade-in"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div
                  className="rounded-3xl p-8 h-full flex flex-col transition-all duration-400 hover:-translate-y-1 bg-white dark:bg-navy-light border border-gray-150 dark:border-white/10 shadow-card"
                >
                  <div className="flex gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" style={{ color: '#D4AF37' }} />
                    ))}
                  </div>
                  <p className="text-ink-muted dark:text-cream/80 text-xs md:text-sm font-body leading-[1.95] mb-6 italic flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3.5 pt-5 border-t border-gray-100 dark:border-white/10">
                    <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-gold/10" />
                    <div>
                      <p className="font-display font-bold text-navy dark:text-white text-xs md:text-sm">{t.name}</p>
                      <p className="text-ink-soft dark:text-white/50 text-[10px] mt-0.5">{t.role}</p>
                      <p className="text-[9px] mt-0.5 font-accent tracking-wide" style={{ color: '#D4AF37' }}>{t.property}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </ErrorBoundary>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DEVELOPER PARTNERS (DYNAMIC)
══════════════════════════════════════════════════════════════════════════ */
function DeveloperPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const getPartners = async () => {
      try {
        const list = await fetchPartners();
        if (active) setPartners(list || []);
      } catch (err) {
        console.error('Failed to load partners:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    getPartners();
    return () => { active = false; };
  }, []);

  if (loading || partners.length === 0) return null;

  // Double the array for infinite scroll
  const doubled = [...partners, ...partners];

  return (
    <section className="py-20 bg-white dark:bg-navy-dark border-y border-gray-100 dark:border-white/10 transition-colors duration-300">
      <div className="container-luxury mb-10 text-center">
        <p className="text-[11px] font-accent text-gold font-bold tracking-[0.28em] uppercase mb-2">
          Premium Developer Partners
        </p>
        <p className="text-ink-muted dark:text-white/60 text-sm font-body">We work exclusively with India's most trusted developers</p>
        <div className="h-[2px] w-12 bg-gold/50 mx-auto mt-3 rounded-full" />
      </div>
      <div className="relative overflow-hidden py-2">
        <div className="flex gap-6 animate-scroll whitespace-nowrap w-max hover:[animation-play-state:paused] py-2">
          {doubled.map((d, i) => (
            <div
              key={i}
              className="inline-flex items-center justify-center px-8 py-4.5 bg-white dark:bg-navy border border-gray-200/60 dark:border-white/10 rounded-2xl shadow-[0_4px_16px_rgba(10,25,47,0.02)] transition-all duration-300 hover:border-gold/30 hover:shadow-[0_12px_24px_rgba(229,193,125,0.12)] hover:-translate-y-1 group cursor-pointer"
            >
              <span className="font-display font-extrabold text-sm tracking-widest uppercase text-navy/45 dark:text-cream/50 group-hover:text-gold transition-colors duration-300">
                {d.name}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 pointer-events-none bg-gradient-to-r from-white dark:from-navy-dark to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 pointer-events-none bg-gradient-to-l from-white dark:from-navy-dark to-transparent z-10" />
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEWSLETTER
══════════════════════════════════════════════════════════════════════════ */
function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!email) { setError('Please enter your email address.'); return; }
    if (!name) { setError('Please enter your name.'); return; }
    if (!phone) { setError('Please enter your phone number.'); return; }
    setError('');
    setLoading(true);
    try {
      await submitEnquiry({
        type: 'newsletter',
        name,
        phone,
        email,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad-sm bg-mesh-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 65%)' }} />
      <div className="container-luxury relative text-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span className="h-px w-8 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Stay Informed</span>
            <span className="h-px w-8 rounded-full" style={{ background: 'linear-gradient(270deg, transparent, #D4AF37)' }} />
          </div>
          <h2 className="font-display font-black text-white leading-tight mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
            Get Exclusive <span style={{ color: '#D4AF37' }}>Luxury Property</span> Alerts
          </h2>
          <p className="text-white/50 max-w-lg mx-auto font-body mb-10 leading-relaxed">
            Be first to know about new luxury listings, market insights, and investment opportunities from India's premium locations — curated weekly.
          </p>

          {submitted ? (
            <div className="max-w-md mx-auto py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 30px rgba(212,175,55,0.3)' }}>
                ✓
              </div>
              <p className="text-white font-display font-bold text-lg mb-1">You're subscribed!</p>
              <p className="text-white/50 text-sm">You'll receive our next luxury property update soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="px-5 py-4 rounded-2xl font-body text-sm text-white placeholder-white/35 focus:outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
              />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Mobile number (+91 98765 43210)"
                className="px-5 py-4 rounded-2xl font-body text-sm text-white placeholder-white/35 focus:outline-none transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-5 py-4 rounded-2xl font-body text-sm text-white placeholder-white/35 focus:outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
                />
                <button onClick={handleSubscribe} disabled={loading} className="btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed rounded-2xl">
                  {loading ? 'Subscribing…' : <> Subscribe <ArrowRight className="w-4  h-4" /> </>}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs text-left px-1">{error}</p>
              )}
            </div>
          )}

          <p className="text-white/30 text-xs mt-5">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [counts, setCounts] = useState({ typeCounts: {}, localityCounts: {} });

  useEffect(() => {
    let active = true;
    const getCounts = async () => {
      try {
        const data = await fetchPropertyCounts();
        if (active) {
          setCounts(data);
        }
      } catch (err) {
        console.error('Failed to load dynamic counts:', err);
      }
    };
    getCounts();
    return () => { active = false; };
  }, []);

  return (
    <>
      <SEO 
        title="Luxury Real Estate Pune | Premium Villas & Apartments" 
        description="Discover Pune's most exclusive luxury homes. RERA-verified premium villas, apartments, and penthouses in Koregaon Park, Baner, Kharadi, and Viman Nagar." 
        url="/" 
      />
      <Hero />
      <FeaturedProperties />
      <StatsStrip />
      <ExploreCities counts={counts.localityCounts} />
      <Categories counts={counts.typeCounts} />
      <WhyUs />
      <BuyingJourney />
      <Testimonials />
      <DeveloperPartners />
      <BlogPreview />
      <Newsletter />
    </>
  );
}
