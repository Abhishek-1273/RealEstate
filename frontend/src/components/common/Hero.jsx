import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Home, ChevronDown, ArrowRight, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgBG from '../../assets/image/bg.png';
import Magnetic from './Magnetic';

// ─── Data ────────────────────────────────────────────────────────────────────

const BG = imgBG;

const SHOWCASE_PROPERTIES = [
  {
    id: 1,
    name: 'Elysian Heights',
    city: 'Pune',
    locality: 'Koregaon Park',
    price: '₹12 Cr',
    beds: 5,
    baths: 5,
    sqft: '4,800',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    growth: '+14%',
    trendPath: 'M 10 55 Q 35 45 60 25 T 130 5',
  },
  {
    id: 2,
    name: 'Aura Sky Penthouse',
    city: 'Mumbai',
    locality: 'Worli',
    price: '₹45 Cr',
    beds: 6,
    baths: 7,
    sqft: '8,200',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    growth: '+12%',
    trendPath: 'M 10 60 Q 35 50 65 30 T 130 8',
  },
  {
    id: 3,
    name: 'The Banyan Estate',
    city: 'Goa',
    locality: 'Anjuna',
    price: '₹24 Cr',
    beds: 4,
    baths: 5,
    sqft: '6,500',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    growth: '+16%',
    trendPath: 'M 10 65 Q 30 55 60 20 T 130 3',
  }
];

// ─── Hero ────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [type, setType] = useState('Any Type');
  const [locality, setLocality] = useState('All Locations');
  const [budget, setBudget] = useState('Any Budget');
  const navigate = useNavigate();

  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_PROPERTIES.length);
    }, 6000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const handleDotClick = (idx) => {
    setActiveSlide(idx);
    startTimer();
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SHOWCASE_PROPERTIES.length);
    startTimer();
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SHOWCASE_PROPERTIES.length) % SHOWCASE_PROPERTIES.length);
    startTimer();
  };



  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type !== 'Any Type') params.set('type', type);
    if (locality !== 'All Locations') params.set('city', locality);
    navigate(`/properties${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Background ── */}
      <motion.div
        className="absolute inset-0 scale-110"
      >
        <img
          src={BG}
          alt="Luxury apartments"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, rgba(7,26,47,0.97) 0%, rgba(7,26,47,0.82) 45%, rgba(7,26,47,0.35) 50%)'
          }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(7,26,47,0.75) 0%, transparent 50%)' }}
        />
      </motion.div>


      {/* ── Content ── */}
      <div className="container-luxury relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Copy */}
          <div>
            {/* Eyebrow */}
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
                India's Premier Luxury Real Estate
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
                Where Luxury
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
                  Meets India
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
                Skyline
              </motion.h1>
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="text-white/65 font-body text-base lg:text-lg leading-[1.85] mb-9 max-w-[480px]"
            >
              Curated luxury properties from Mumbai to Gurugram — handpicked
              for discerning buyers who demand the very best of India.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-8 mb-10"
            >
              {[
                { num: '1,500+', label: 'Luxury Properties' },
                { num: '12,000+', label: 'Happy Families' },
                { num: '4.9', label: 'Star Rating', icon: <Star className="w-3.5 h-3.5 fill-gold text-gold" /> },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    {s.icon}
                    <p className="font-display font-black text-white text-3xl md:text-4xl leading-none">{s.num}</p>
                  </div>
                  <p className="text-white/50 text-[10px] font-body mt-1.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Unified Interactive Carousel */}
          <div className="relative hidden lg:flex items-center justify-end" style={{ height: '600px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-[380px] rounded-3xl p-5 shadow-2xl relative overflow-hidden"
              style={{
                background: 'rgba(7, 26, 47, 0.65)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Image with slide animation */}
              <div className="relative h-44 rounded-2xl overflow-hidden mb-4 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    src={SHOWCASE_PROPERTIES[activeSlide].image}
                    alt={SHOWCASE_PROPERTIES[activeSlide].name}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

                {/* Growth Pill */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/90 text-white font-semibold text-xs shadow-lg backdrop-blur-md">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{SHOWCASE_PROPERTIES[activeSlide].growth} YoY Growth</span>
                </div>

                {/* City Location Tag */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 rounded-md bg-navy/80 text-white text-[10px] font-accent uppercase tracking-wider font-semibold border border-white/10">
                  <MapPin className="w-3 h-3 text-gold" />
                  <span>{SHOWCASE_PROPERTIES[activeSlide].locality}, {SHOWCASE_PROPERTIES[activeSlide].city}</span>
                </div>
              </div>

              {/* Property Details */}
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

                  {/* Integrated Market Trend Insights */}
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

                    {/* SVG Line Graph */}
                    <div className="relative h-12 flex items-end justify-between px-1">
                      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 140 80">
                        <defs>
                          <linearGradient id="gradient-gold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Animated Line */}
                        <motion.path
                          key={activeSlide}
                          d={SHOWCASE_PROPERTIES[activeSlide].trendPath}
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.2, ease: 'easeInOut' }}
                        />
                        {/* Filled Gradient Area */}
                        <motion.path
                          key={`area-${activeSlide}`}
                          d={`${SHOWCASE_PROPERTIES[activeSlide].trendPath} L 130 80 L 10 80 Z`}
                          fill="url(#gradient-gold)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                      </svg>
                      {/* X-axis labels */}
                      <span className="text-white/30 text-[9px] font-mono select-none">2023</span>
                      <span className="text-white/30 text-[9px] font-mono select-none">2024</span>
                      <span className="text-white/30 text-[9px] font-mono select-none">2025</span>
                      <span className="text-gold text-[9px] font-mono font-bold select-none">Active</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="flex items-center justify-between pt-1">
                {/* Dots indicator */}
                <div className="flex gap-2">
                  {SHOWCASE_PROPERTIES.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => handleDotClick(idx)}
                      className="h-2 rounded-full transition-all duration-300 relative focus:outline-none"
                      style={{
                        width: activeSlide === idx ? '24px' : '8px',
                        background: activeSlide === idx ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                      }}
                    />
                  ))}
                </div>

                {/* Left/Right Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-gold transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-gold transition-all duration-200"
                  >
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