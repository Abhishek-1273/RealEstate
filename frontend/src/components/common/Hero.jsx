import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, TrendingUp, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgBG from '../../assets/image/bg.webp';

// ── Video backgrounds hosted on Cloudinary CDN ────────────────────────────────
// q_auto = automatic quality optimisation, f_auto = best format per browser
// (WebM for Chrome/Firefox, MP4 for Safari) — served from edge nodes globally
const VIDEO_BG  = 'https://res.cloudinary.com/dzb2hbq9e/video/upload/q_auto/v1783787482/bg_eylysx.mp4';
const VIDEO_BG2 = 'https://res.cloudinary.com/dzb2hbq9e/video/upload/q_auto/v1783787480/bg2_ijjnna.mp4';

// ─── Showcase Properties (Pune NRI focused) ───────────────────────────────────
const SHOWCASE_PROPERTIES = [
  {
    id: 1,
    name: 'Elysian Heights',
    locality: 'Koregaon Park',
    city: 'Pune',
    price: '₹12 Cr',
    beds: 5, baths: 5, sqft: '4,800',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    growth: '+14%',
    trendPath: 'M 10 55 Q 35 45 60 25 T 130 5',
  },
  {
    id: 2,
    name: 'The Grand Penthouse',
    locality: 'Boat Club Road',
    city: 'Pune',
    price: '₹8.5 Cr',
    beds: 4, baths: 4, sqft: '3,900',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    growth: '+17%',
    trendPath: 'M 10 60 Q 35 48 65 28 T 130 4',
  },
  {
    id: 3,
    name: 'Serene Baner Villa',
    locality: 'Baner',
    city: 'Pune',
    price: '₹5.2 Cr',
    beds: 4, baths: 4, sqft: '3,200',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    growth: '+19%',
    trendPath: 'M 10 65 Q 30 52 60 22 T 130 3',
  },
];


// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const navigate = useNavigate();

  // Carousel state
  const [activeSlide, setActiveSlide]   = useState(0);
  const timerRef                         = useRef(null);

  // Video state
  const videoRef                         = useRef(null);
  const [videoReady, setVideoReady]      = useState(false);
  const [videoError, setVideoError]      = useState(false);
  const [muted, setMuted]                = useState(true);
  const [isMobile, setIsMobile]          = useState(false);

  // ── Detect mobile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Carousel timer ──────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SHOWCASE_PROPERTIES.length);
    }, 6000);
  }, [stopTimer]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const handleDotClick   = (idx) => { setActiveSlide(idx); startTimer(); };
  const handleNextSlide  = () => { setActiveSlide(p => (p + 1) % SHOWCASE_PROPERTIES.length); startTimer(); };
  const handlePrevSlide  = () => { setActiveSlide(p => (p - 1 + SHOWCASE_PROPERTIES.length) % SHOWCASE_PROPERTIES.length); startTimer(); };

  // ── Video setup — desktop only, lazy ───────────────────────────────────────
  useEffect(() => {
    if (isMobile) return; // never load video on mobile
    const vid = videoRef.current;
    if (!vid) return;

    const onCanPlay = () => setVideoReady(true);
    const onError   = () => setVideoError(true);

    vid.addEventListener('canplaythrough', onCanPlay);
    vid.addEventListener('error', onError);

    // Start loading
    vid.load();

    return () => {
      vid.removeEventListener('canplaythrough', onCanPlay);
      vid.removeEventListener('error', onError);
    };
  }, [isMobile]);

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !muted;
    setMuted(m => !m);
  };

  // ── Show video background when ready, else fallback to image ───────────────
  const showVideo = !isMobile && videoReady && !videoError;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ══ BACKGROUND ══════════════════════════════════════════════════════ */}

      {/* Fallback image — always rendered, hidden once video is ready */}
      <div
        className="absolute inset-0 scale-110 transition-opacity duration-1000"
        style={{ opacity: showVideo ? 0 : 1 }}
      >
        <img
          src={imgBG}
          alt="Luxury property"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Desktop video — hidden on mobile, fades in when ready */}
      {!isMobile && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: showVideo ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            src={VIDEO_BG2}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={imgBG}
          >
          </video>
        </div>
      )}

      {/* Overlay gradients — same for both video + image */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(7,26,47,0.96) 0%, rgba(7,26,47,0.80) 45%, rgba(7,26,47,0.30) 50%)' }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(7,26,47,0.75) 0%, transparent 55%)' }}
        />
      </div>

      {/* ══ MUTE TOGGLE — desktop only, shows when video is playing ════════ */}
      {showVideo && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={toggleMute}
          className="absolute bottom-8 right-8 z-20 p-2.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all hidden lg:flex items-center gap-2 text-xs font-medium"
        >
          {muted
            ? <><VolumeX className="w-4 h-4" /> <span>Unmute</span></>
            : <><Volume2 className="w-4 h-4" /> <span>Mute</span></>
          }
        </motion.button>
      )}

      {/* ══ CONTENT ═════════════════════════════════════════════════════════ */}
      <div className="container-luxury relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left — Copy ── */}
          <div>
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-gold"
                style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
              <span className="text-white/85 text-[10px] font-accent font-semibold tracking-[0.2em] uppercase">
                Pune's Premier NRI Property Platform
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-white leading-[1.05]"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
              >
                Pune's Finest
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className="font-display font-black leading-[1.05] block"
                  style={{
                    fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
                    background: 'linear-gradient(135deg, #D4AF37 0%, #E8C84A 50%, #C4A028 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Luxury Homes
                </span>
              </motion.div>
            </div>
            <div className="overflow-hidden mb-7">
              <motion.h1
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-white/90 leading-[1.05]"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}
              >
                For NRIs
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="text-white/65 font-body text-base lg:text-lg leading-[1.85] mb-9 max-w-[480px]"
            >
              Premium properties across Pune & Pimpri-Chinchwad —
              exclusively curated for NRI investors who demand the very best.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8 mb-10"
            >
              {[
                { num: '500+',  label: 'Pune Properties' },
                { num: '320+',  label: 'NRI Clients' },
                { num: '4.9',   label: 'Star Rating', icon: <Star className="w-3.5 h-3.5 fill-gold text-gold" /> },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    {s.icon}
                    <p className="font-display font-black text-white text-xl md:text-4xl leading-none">{s.num}</p>
                  </div>
                  <p className="text-white/50 text-[10px] font-body mt-1.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* NRI Trust Badges — mobile only shows these, desktop shows card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="flex flex-wrap gap-2 lg:hidden"
            >
              {['FEMA Compliant', 'Remote Buying', 'RERA Verified', 'NRI Desk'].map(badge => (
                <span key={badge}
                  className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gold/30 text-gold/80"
                  style={{ background: 'rgba(212,175,55,0.08)' }}
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Right — Property Showcase Card (desktop only) ── */}
          <div className="relative hidden lg:flex items-center justify-end" style={{ height: '600px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-[380px] rounded-3xl p-5 shadow-2xl relative overflow-hidden"
              style={{
                background: 'rgba(7, 26, 47, 0.65)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Property image */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    src={SHOWCASE_PROPERTIES[activeSlide].image}
                    alt={SHOWCASE_PROPERTIES[activeSlide].name}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

                {/* Growth badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white font-semibold text-xs shadow-lg backdrop-blur-md">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{SHOWCASE_PROPERTIES[activeSlide].growth} YoY Growth</span>
                </div>

                {/* Location tag */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy/80 text-white text-[10px] font-accent uppercase tracking-wider font-semibold border border-white/10">
                  <MapPin className="w-3 h-3 text-gold" />
                  <span>{SHOWCASE_PROPERTIES[activeSlide].locality}, {SHOWCASE_PROPERTIES[activeSlide].city}</span>
                </div>
              </div>

              {/* Property details */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-bold text-white text-lg tracking-wide">
                      {SHOWCASE_PROPERTIES[activeSlide].name}
                    </h3>
                    <span className="font-display font-black text-gold text-lg">
                      {SHOWCASE_PROPERTIES[activeSlide].price}
                    </span>
                  </div>

                  <div className="flex gap-3 text-white/50 text-xs border-b border-white/10 pb-3.5 mb-3.5">
                    <span>{SHOWCASE_PROPERTIES[activeSlide].beds} Beds</span>
                    <span>·</span>
                    <span>{SHOWCASE_PROPERTIES[activeSlide].baths} Baths</span>
                    <span>·</span>
                    <span>{SHOWCASE_PROPERTIES[activeSlide].sqft} Sq Ft</span>
                  </div>

                  {/* Trend graph */}
                  <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white/40 text-[9px] font-accent tracking-widest uppercase mb-0.5">Investment Health</p>
                        <p className="text-white font-semibold text-xs">Locality Valuation Index</p>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 text-xs font-bold font-accent">{SHOWCASE_PROPERTIES[activeSlide].growth}</span>
                        <p className="text-white/40 text-[8px]">Steady Rise</p>
                      </div>
                    </div>
                    <div className="relative h-12 flex items-end justify-between px-1">
                      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 140 80">
                        <defs>
                          <linearGradient id="gradient-gold-hero" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <motion.path
                          key={`line-${activeSlide}`}
                          d={SHOWCASE_PROPERTIES[activeSlide].trendPath}
                          fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                        <motion.path
                          key={`area-${activeSlide}`}
                          d={`${SHOWCASE_PROPERTIES[activeSlide].trendPath} L 130 80 L 10 80 Z`}
                          fill="url(#gradient-gold-hero)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </svg>
                      <span className="text-white/30 text-[9px] font-mono select-none">2023</span>
                      <span className="text-white/30 text-[9px] font-mono select-none">2024</span>
                      <span className="text-white/30 text-[9px] font-mono select-none">2025</span>
                      <span className="text-gold text-[9px] font-mono font-bold select-none">Active</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel controls */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex gap-2">
                  {SHOWCASE_PROPERTIES.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => handleDotClick(idx)}
                      className="h-2 rounded-full transition-all duration-300 focus:outline-none"
                      style={{
                        width: activeSlide === idx ? '24px' : '8px',
                        background: activeSlide === idx ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                      }}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={handlePrevSlide}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-gold transition-all duration-200">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNextSlide}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-gold transition-all duration-200">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
