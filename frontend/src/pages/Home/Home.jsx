import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Star, Shield, Award, Clock, TrendingUp,
  CheckCircle2, MapPin, Search, Home as HomeIcon, Building2, Zap,
  Building, Store, Trees, Layers
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  'Luxury Villas': HomeIcon,
  'Apartments': Building2,
  'Penthouses': Building,
  'Commercial': Store,
  'Farm Houses': Trees,
  'Plots': Layers,
};
import CountUpNumber from '../../components/common/CountUpNumber';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Hero from '../../components/common/Hero';
import SectionHeader from '../../components/common/SectionHeader';
import PropertyCard from '../../components/common/PropertyCard';
const InteractiveGlobe = lazy(() => import('../../components/common/InteractiveGlobe'));
import PremiumIcon from '../../components/common/PremiumIcon';
import { featuredProperties } from '../../data/properties';
import { testimonials, cities, stats, blogs, categories, developerLogos, companyLogos } from '../../data/index';
import { submitEnquiry, fetchProperties, fetchPropertyCounts, fetchPartners, fetchBlogs } from '../../utils/api';
import { fadeUp, fadeLeft, scaleIn, staggerContainer, staggerFast, viewportOnce } from '../../animations/variants';

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
   FEATURED PROPERTIES
══════════════════════════════════════════════════════════════════════════ */
function FeaturedProperties() {
  const [list, setList] = useState(featuredProperties.slice(0, 6));

  useEffect(() => {
    let active = true;
    const getFeatured = async () => {
      try {
        const data = await fetchProperties({ featured: 'true', limit: 6 });
        if (active && data?.properties?.length > 0) {
          setList(data.properties);
        }
      } catch (err) {
        // Fallback already matches static featuredProperties
      }
    };
    getFeatured();
    return () => { active = false; };
  }, []);

  return (
    <section className="section-pad bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeader
            label="Handpicked for You"
            title={<>Featured <span style={{ color: '#D4AF37' }}>Properties</span></>}
            description="Every listing personally vetted by our senior advisors. These represent the finest available in India right now."
          />
          <Link to="/properties" className="btn-outline shrink-0 hidden md:inline-flex">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {list.map((p) => (
            <motion.div key={p._id || p.id} variants={fadeUp}>
              <PropertyCard property={p} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View All at bottom */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link to="/properties" className="btn-outline w-full text-center justify-center">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STATS STRIP
══════════════════════════════════════════════════════════════════════════ */
function StatsStrip() {
  return (
    <section className="py-24 bg-mesh-dark relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
      <div className="container-luxury relative">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {stats.map((s, i) => (
            <motion.div key={i} variants={scaleIn} className="text-center">
              <p className="font-display font-black text-white leading-none mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                <CountUpNumber end={s.value} duration={2.5} />
                <span style={{ color: '#D4AF37' }}>{s.suffix}</span>
              </p>
              <p className="text-white/50 text-sm font-body tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   EXPLORE LUXURY CITIES
══════════════════════════════════════════════════════════════════════════ */
function ExploreCities({ counts = {} }) {
  const [activeCity, setActiveCity] = useState('Balewadi');
  const [expanded, setExpanded] = useState(false);

  const main8Names = ['KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Balewadi'];

  // Split and order cities
  const main8 = cities.filter(c => main8Names.includes(c.name));
  const otherCities = cities.filter(c => !main8Names.includes(c.name));
  main8.sort((a, b) => main8Names.indexOf(a.name) - main8Names.indexOf(b.name));

  const displayedCities = expanded ? [...main8, ...otherCities] : main8;

  // Auto expand if city selected on globe is not in main 8
  useEffect(() => {
    if (!main8Names.includes(activeCity)) {
      setExpanded(true);
    }
  }, [activeCity]);

  const activeCityData = cities.find((c) => c.name === activeCity) || cities[0];

  return (
    <section className="section-pad bg-white dark:bg-navy-dark relative overflow-hidden transition-colors duration-300">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />

      <div className="container-luxury relative">
        <SectionHeader
          label="Explore by Locality"
          title={<>Pune's Most Coveted <span style={{ color: '#D4AF37' }}>Luxury Localities</span></>}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column — 3D Globe */}
          <div className="hidden md:block lg:col-span-7">
            <Suspense fallback={
              <div className="relative w-full h-[450px] flex flex-col items-center justify-center bg-transparent gap-3">
                <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
                <p className="text-xs font-semibold tracking-widest uppercase text-gold" style={{ color: '#D4AF37' }}>Loading 3D Earth...</p>
              </div>
            }>
              <InteractiveGlobe onSelectCity={setActiveCity} activeCity={activeCity} />
            </Suspense>
          </div>

          {/* Right Column — City Tabs & Preview Card */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Symmetrical Grid of Localities (Compact) */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                {displayedCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setActiveCity(city.name)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border truncate transition-all duration-300 ${activeCity === city.name
                        ? 'border-gold bg-gold/10 text-gold shadow-[0_3px_10px_rgba(212,175,55,0.12)]'
                        : 'border-gray-100 dark:border-white/10 bg-transparent text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    style={activeCity === city.name ? { color: '#D4AF37', borderColor: '#D4AF37' } : {}}
                  >
                    {city.name}
                  </button>
                ))}
              </div>

              {/* Show More / Show Less Toggle under the tabs grid (Centered & Compact) */}
              <div className="pt-1 flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/15" />
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase border border-gold/20 hover:border-gold hover:bg-gold/5 text-gold transition-all duration-300 shrink-0"
                  style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.25)' }}
                >
                  <span>{expanded ? 'Show Less Localities' : 'Show All Localities'}</span>
                  <span className="text-[10px] leading-none">{expanded ? '▴' : '▾'}</span>
                </button>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/15" />
              </div>

              {/* Active City Preview Card */}
              <motion.div
                key={activeCity}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-3xl shadow-luxury"
                style={{ height: '300px', border: '1px solid rgba(7,26,47,0.07)' }}
              >
                <img
                  src={activeCityData.image}
                  alt={activeCityData.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.92) 0%, rgba(7,26,47,0.3) 55%, transparent 100%)' }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <span className="text-[10px] font-accent font-bold tracking-[0.22em] uppercase mb-1.5" style={{ color: '#D4AF37' }}>
                    {activeCityData.tag}
                  </span>
                  <h3 className="font-display font-black text-white text-2xl leading-tight">{activeCityData.name}</h3>
                  <div className="flex items-center justify-between mt-3 pt-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <p className="text-white/70 text-sm font-semibold">
                      {counts[activeCityData.name] ?? 0}{' '}
                      {(counts[activeCityData.name] ?? 0) === 1 ? 'Verified Property' : 'Verified Properties'}
                    </p>
                    <Link
                      to={`/properties?city=${activeCityData.name}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-navy text-xs font-bold transition-transform group-hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
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
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={scaleIn}>
              <Link
                to={`/properties?category=${cat.name}`}
                className="group block relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400"
                style={{ aspectRatio: '1' }}
              >
                <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.9) 0%, rgba(7,26,47,0.35) 60%, transparent 100%)' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <span className="mb-2 group-hover:scale-110 transition-transform duration-300">
                    <PremiumIcon icon={CATEGORY_ICON_MAP[cat.name]} variant="glass-light" size="md" animate={false} />
                  </span>
                  <p className="text-white font-display font-bold text-xs leading-snug mt-2">{cat.name}</p>
                  <p className="text-white/50 text-[10px] mt-0.5">
                    {counts[cat.name] || 0} {counts[cat.name] === 1 ? 'Property' : 'Properties'}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   WHY HYPERRELESTIX
══════════════════════════════════════════════════════════════════════════ */
function WhyUs() {
  const features = [
    { icon: <Shield className="w-5 h-5" />, title: 'RERA Verified', desc: 'Every property passes rigorous RERA and legal verification before listing.' },
    { icon: <Award className="w-5 h-5" />, title: 'Award-Winning Advisors', desc: 'Our local specialists are consistently ranked among India\'s best luxury agents.' },
    { icon: <Clock className="w-5 h-5" />, title: '24×7 Concierge', desc: 'Round-the-clock dedicated support for every client, every query.' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Best ROI Insights', desc: 'Data-backed market intelligence to ensure you invest at the right moment.' },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Zero Hidden Costs', desc: 'Complete transparency — no surprises at any stage of your transaction.' },
    { icon: <MapPin className="w-5 h-5" />, title: 'Prime Indian Addresses', desc: 'Exclusively curated from India\'s most sought-after locations.' },
  ];

  return (
    <section className="section-pad bg-mesh-dark relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(30,58,138,0.07) 0%, transparent 70%)' }} />

      <div className="container-luxury relative">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <SectionHeader
              label="Why Choose Us"
              title={<>The HyperRelestix <span style={{ color: '#D4AF37' }}>Difference</span></>}
              description="We don't just sell properties — we craft experiences, build trust, and match you with homes that truly reflect your aspirations in India's finest addresses."
              light
            />
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/about" className="btn-primary">Our Story <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/contact" className="btn-outline-light">Talk to Us</Link>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="p-6 rounded-2xl transition-all duration-300 group cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                whileHover={{
                  background: 'rgba(255,255,255,0.07)',
                  borderColor: 'rgba(212,175,55,0.2)',
                  y: -4,
                }}
              >
                <PremiumIcon icon={f.icon} variant="gold" size="md" className="mb-4" />
                <h3 className="font-display font-bold text-white text-sm mb-2">{f.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BUYING JOURNEY
══════════════════════════════════════════════════════════════════════════ */
function BuyingJourney() {
  const steps = [
    { icon: <Search className="w-6 h-6" />, step: '01', title: 'Search', desc: 'Browse our curated luxury collection and shortlist your favourites.' },
    { icon: <MapPin className="w-6 h-6" />, step: '02', title: 'Site Visit', desc: 'Our advisor personally accompanies you to every property on your list.' },
    { icon: <Zap className="w-6 h-6" />, step: '03', title: 'Make an Offer', desc: 'We negotiate on your behalf to secure the best possible terms.' },
    { icon: <HomeIcon className="w-6 h-6" />, step: '04', title: 'Move In', desc: 'Complete documentation, registration, and handover — all managed by us.' },
  ];

  return (
    <section className="section-pad bg-white dark:bg-navy-dark transition-colors duration-300">
      <div className="container-luxury">
        <SectionHeader
          label="Simple Process"
          title={<>Your Buying <span style={{ color: '#D4AF37' }}>Journey</span></>}
          description="From first search to key handover — we're with you at every step."
          align="center"
          className="mb-20"
        />
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), rgba(212,175,55,0.5), rgba(212,175,55,0.3), transparent)' }} />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center group">
                <div className="relative inline-flex mb-8">
                  <PremiumIcon icon={s.icon} variant="gold" size="xl" />
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center text-navy"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                  >
                    {s.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-navy dark:text-white text-lg mb-2">{s.title}</h3>
                <p className="text-ink-muted dark:text-white/60 text-sm leading-[1.8]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════════════════════ */
function Testimonials() {
  return (
    <section className="section-pad bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <SectionHeader
          label="Client Stories"
          title={<>What Our Clients <span style={{ color: '#D4AF37' }}>Say</span></>}
          align="center"
          className="mb-16"
        />
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          spaceBetween={28}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          className="pb-14"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div
                className="rounded-3xl p-8 h-full flex flex-col transition-all duration-400 hover:-translate-y-1 bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-ink-muted dark:text-cream/80 text-sm font-body leading-[1.95] mb-6 italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3.5 pt-5 border-t border-gray-100 dark:border-white/10">
                  <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-display font-bold text-navy dark:text-white text-sm">{t.name}</p>
                    <p className="text-ink-soft dark:text-white/50 text-xs mt-0.5">{t.role}</p>
                    <p className="text-[10px] mt-0.5 font-accent tracking-wide" style={{ color: '#D4AF37' }}>{t.property}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
   BLOG PREVIEW
══════════════════════════════════════════════════════════════════════════ */
function BlogPreview() {
  const [list, setList] = useState(blogs);

  useEffect(() => {
    let active = true;
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        const blogsArray = data.blogs || (Array.isArray(data) ? data : []);
        if (active && blogsArray.length > 0) {
          setList(blogsArray.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load real blogs on homepage:', err);
      }
    };
    getBlogs();
    return () => { active = false; };
  }, []);

  return (
    <section className="section-pad bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeader
            label="Insights & Trends"
            title={<>Latest from Our <span style={{ color: '#D4AF37' }}>Blog</span></>}
          />
          <Link to="/blog" className="btn-outline shrink-0 hidden md:inline-flex">All Articles <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-7"
        >
          {list.map((b) => (
            <motion.div key={b._id || b.id} variants={fadeUp}>
              <Link
                to={`/blog/${b.slug || b.id}`}
                className="group block bg-white dark:bg-navy-light rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-1 border border-gray-150 dark:border-white/10 shadow-card"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={b.image} alt={b.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108" />
                  <span className="absolute top-4 left-4 badge-gold">{b.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-ink-soft dark:text-white/50 mb-3">
                    <span>{b.date}</span><span>·</span><span>{b.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy dark:text-white text-base leading-snug mb-3 group-hover:text-gold-muted transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-ink-muted dark:text-white/60 text-sm line-clamp-2 leading-relaxed mb-5">{b.excerpt}</p>
                  <div className="flex items-center gap-2.5 pt-4 border-t border-gray-150 dark:border-white/10">
                    <img src={b.author?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-ink-muted dark:text-cream/80 text-xs font-semibold">{b.author?.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" style={{ color: '#D4AF37' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile All Articles at bottom */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link to="/blog" className="btn-outline w-full text-center justify-center">
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
