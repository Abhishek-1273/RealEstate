import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, Shield, Award, Clock, CheckCircle2
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import Hero from '../../components/common/Hero';
import SectionHeader from '../../components/common/SectionHeader';
import { testimonials, categories } from '../../data/index';
import { submitEnquiry, fetchPropertyCounts, fetchPartners, fetchTestimonials } from '../../utils/api';
import { fadeUp, viewportOnce } from '../../animations/variants';
import SEO from '../../components/common/SEO';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import KineticGrid from '../../components/common/KineticGrid';
import Smooth3DSlideshow from '../../components/common/Smooth3DSlideshow';
import StickerPeeling from '../../components/common/StickerPeeling';
import reraBadge from '../../assets/image/rera-gold-badge.png';

// Subcomponents
import FeaturedProperties from './components/FeaturedProperties';
import StatsStrip from './components/StatsStrip';
import ExploreCities from './components/ExploreCities';
import BlogPreview from './components/BlogPreview';



/* ══════════════════════════════════════════════════════════════════════════
   PROPERTY CATEGORIES
══════════════════════════════════════════════════════════════════════════ */


function Categories({ counts = {} }) {
  const navigate = useNavigate();
  const [cardSize, setCardSize] = useState({ width: 340, height: 340 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardSize({ width: 265, height: 265 });
      } else if (window.innerWidth < 1024) {
        setCardSize({ width: 300, height: 300 });
      } else {
        setCardSize({ width: 340, height: 340 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slides = categories.map((c) => ({
    image: { src: c.image, alt: c.name },
    title: `${c.name}\n${counts[c.name] ?? 0} Listings`,
    id: c.id
  }));

  const handleActiveClick = (slide) => {
    navigate(`/properties?category=${slide.id}`);
  };

  return (
    <section className="section-pad-sm bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <SectionHeader
          label="Browse by Type"
          title={
            <>
              Property{' '}
              <span style={{ color: '#D4AF37' }}>
                Collections
              </span>
            </>
          }
          align="center"
          className="mb-14"
        />

        <div className="h-[380px] flex items-center justify-center relative select-none">
          <Smooth3DSlideshow
            slides={slides}
            cardWidth={cardSize.width}
            cardHeight={cardSize.height}
            radius={3}
            tilt={10}
            sideTilt={6}
            gap={9}
            opacity={50}
            titleFont={{ fontSize: cardSize.width < 300 ? 16 : 22, fontWeight: 800 }}
            onActiveClick={handleActiveClick}
          />
        </div>

        <p className="text-center text-[10px] text-ink-soft dark:text-white/40 font-semibold tracking-wider uppercase mt-4">
          ← Arrow Keys or Click to Swivel · Click Center Card to Explore →
        </p>
      </div>
    </section>
  );
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + ' ';
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function createCardCanvas(reraBadgeImg) {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Clip rounded corners for card aspect ratio (32px border radius -> 64px on 2x scale)
  ctx.beginPath();
  ctx.roundRect(0, 0, 960, 720, 64);
  ctx.clip();

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 960, 720);
  bgGrad.addColorStop(0, '#071626');
  bgGrad.addColorStop(1, '#0c223c');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 960, 720);

  // Gold Radial Glow in Top Right
  const glowGrad = ctx.createRadialGradient(960, 0, 0, 960, 0, 500);
  glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.22)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, 960, 720);

  // Top header divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 200);
  ctx.lineTo(880, 200);
  ctx.stroke();

  // RERA DOCUMENT AUDIT header in gold
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 20px 'Outfit', 'Inter', sans-serif";
  ctx.textBaseline = "top";
  ctx.fillText("RERA DOCUMENT AUDIT", 80, 80);

  // Title in White
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px 'Outfit', 'Inter', sans-serif";
  ctx.fillText("Pune Market Intelligence", 80, 120);

  // Quote Text
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.font = "500 28px 'Inter', sans-serif";
  const quoteText = '"HyperRelestix operates with complete legal compliance and fiduciary responsibility, ensuring every transaction is completely RERA-verified."';
  wrapText(ctx, quoteText, 80, 260, 800, 44);

  // Bottom Divider
  ctx.beginPath();
  ctx.moveTo(80, 520);
  ctx.lineTo(880, 520);
  ctx.stroke();

  // Bottom Advisory Seal - HR circle
  ctx.fillStyle = "rgba(212, 175, 55, 0.12)";
  ctx.beginPath();
  ctx.arc(130, 610, 44, 0, 2 * Math.PI);
  ctx.fill();

  ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(130, 610, 44, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 24px 'Outfit', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("HR", 130, 610);
  ctx.textAlign = "left";

  // Advisory Board Titles
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px 'Outfit', sans-serif";
  ctx.fillText("Advisory Board", 200, 580);

  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "bold 16px 'Outfit', sans-serif";
  ctx.fillText("FEMA & TAX COMPLIANCE AUDITED", 200, 620);

  // Draw Gold Badge Seal Image in Top Right
  if (reraBadgeImg) {
    ctx.drawImage(reraBadgeImg, 760, 60, 110, 110);
  }

  return canvas;
}

/* ══════════════════════════════════════════════════════════════════════════
   WHY US (ACCORDION WITH IMAGE REVEAL / FLOATING TABS)
   ══════════════════════════════════════════════════════════════════════════ */
function WhyUs() {
  const [activeTab, setActiveTab] = useState(0);
  const [cardTexture, setCardTexture] = useState(null);
  const [stickerSize, setStickerSize] = useState({ width: 480, height: 360 });

  useEffect(() => {
    const handleResize = () => {
      const w = Math.min(window.innerWidth - 32, 480);
      const h = (w * 3) / 4;
      setStickerSize({ width: w, height: h });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const badgeImg = new Image();
    badgeImg.crossOrigin = "anonymous";
    badgeImg.onload = () => {
      const canvas = createCardCanvas(badgeImg);
      if (canvas) setCardTexture(canvas);
    };
    badgeImg.onerror = () => {
      const canvas = createCardCanvas(null);
      if (canvas) setCardTexture(canvas);
    };
    badgeImg.src = reraBadge;
  }, []);

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
          <div className="relative aspect-[4/3] w-full max-w-[480px] mx-auto select-none flex items-center justify-center overflow-visible">
            {cardTexture ? (
              <StickerPeeling
                image={cardTexture}
                imageWidth={stickerSize.width}
                imageHeight={stickerSize.height}
                curlRotation={220}
                hoverPeel={26}
                pressPeel={45}
                backColor="#C5A028"
                shadowEnabled={true}
                style={{ width: `${stickerSize.width}px`, height: `${stickerSize.height}px` }}
              />
            ) : (
              <div className="w-full h-full aspect-[4/3] rounded-[32px] bg-mesh-dark animate-pulse" />
            )}
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
  const [list, setList] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchTestimonials();
        if (active) setList(data || []);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const activeTestimonials = list.length > 0 ? list : testimonials;

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
            {activeTestimonials.map((t) => (
              <SwiperSlide key={t._id || t.id}>
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
      <KineticGrid background="transparent" lineColor="rgba(212,175,55,0.06)" dotColor="rgba(212,175,55,0.15)" spacing={50} radius={200} />
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
