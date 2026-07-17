import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts';

const SERVICES = [
  {
    id: 'buy',
    title: 'Buy Property',
    tagline: "Find your dream home across Pune's finest RERA-verified luxury listings.",
    badge1: '★ 4.9 Pune',
    badge2: 'RERA Listed',
    link: '/services/buy',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80',
  },
  {
    id: 'sell',
    title: 'Sell Property',
    tagline: 'Sell 40% faster than average with premium asset valuation models.',
    badge1: '📈 Top Value',
    badge2: '40% Faster',
    link: '/services/sell',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80',
  },
  {
    id: 'lease',
    title: 'Lease Property',
    tagline: 'Luxury lease setups, strict tenant screening, and rent optimization.',
    badge1: '🔑 Max Rent',
    badge2: 'Vetted Tenants',
    link: '/services/lease',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&q=80',
  },
  {
    id: 'management',
    title: 'Property Management',
    tagline: 'Complete hands-free remote ownership, upkeep, and reporting for NRI hosts.',
    badge1: '🏢 24/7 Care',
    badge2: 'NRI Remote',
    link: '/services/management',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&q=80',
  },
];

export default function ServiceShuffle() {
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();
  const [stack, setStack] = useState([0, 1, 2, 3]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Mouse Move Tilt State for the Front Card
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [spotlight, setSpotlight] = useState({ x: 120, y: 170 });

  // Mobile carousel auto-scroll
  const mobileScrollRef = useRef(null);
  const mobileCurrentIdx = useRef(0);
  const lastUserInteraction = useRef(0);

  const handleScroll = () => {
    if (!mobileScrollRef.current) return;
    lastUserInteraction.current = Date.now();
    const scrollLeft = mobileScrollRef.current.scrollLeft;
    const CARD_STEP = 275 + 16; // card width + gap
    const idx = Math.round(scrollLeft / CARD_STEP);
    mobileCurrentIdx.current = Math.max(0, Math.min(idx, SERVICES.length - 1));
  };

  // Shuffle callback to bring a clicked card to the front
  const handleCardClick = useCallback((idx) => {
    setActiveIdx(idx);
    setStack(prev => {
      const next = [...prev];
      while (next[0] !== idx) {
        const top = next.shift();
        next.push(top);
      }
      return next;
    });
    // Reset tilts
    setTiltX(0);
    setTiltY(0);
  }, []);

  // Auto shuffle every 4.5 seconds (pauses on hover)
  useEffect(() => {
    const timer = setInterval(() => {
      if (hoveredIdx === null) {
        setActiveIdx(prev => (prev + 1) % SERVICES.length);
        setStack(prev => {
          const next = [...prev];
          const top = next.shift();
          next.push(top);
          return next;
        });
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [hoveredIdx]);

  // Mobile carousel auto-scroll
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    const CARD_STEP = 275 + 16; // card width + gap
    const total = SERVICES.length;
    const timer = setInterval(() => {
      // Pause if user scrolled/touched in last 5 seconds
      if (Date.now() - lastUserInteraction.current < 5000) return;
      if (!mobileScrollRef.current) return;

      const nextIdx = (mobileCurrentIdx.current + 1) % total;
      mobileCurrentIdx.current = nextIdx;
      mobileScrollRef.current.scrollTo({ left: nextIdx * CARD_STEP, behavior: 'smooth' });
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Interactive 3D Cursor Tilt logic for Front Card
  const handleMouseMove = (e, isFront) => {
    if (!isFront) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    setTiltX(-y / 12);
    setTiltY(x / 12);
    setSpotlight({
      x: e.clientX - box.left,
      y: e.clientY - box.top
    });
  };

  const handleMouseLeaveCard = () => {
    setTiltX(0);
    setTiltY(0);
  };

  const handleServiceClick = useCallback((link) => {
    if (!user) {
      openAuth(link);
    } else {
      navigate(link);
    }
  }, [user, openAuth, navigate]);

  // Dynamic layout calculations based on position in stack
  const getCardTransform = (pos, isCardHovered) => {
    switch (pos) {
      case 0: // Front Center Card (Active)
        return {
          x: 0,
          y: isCardHovered ? -15 : 0,
          z: 120,
          scale: 1,
          rotateX: tiltX,
          rotateY: tiltY,
          rotateZ: 0,
          opacity: 1,
          filter: 'blur(0px)',
        };
      case 1: // Right Peeking Card
        return {
          x: 130,
          y: isCardHovered ? -8 : 0,
          z: 60,
          scale: 0.86,
          rotateX: 0,
          rotateY: -15,
          rotateZ: -1.5,
          opacity: 0.9,
          filter: 'blur(0px)',
        };
      case 2: // Far-Right Peeking Card
        return {
          x: 260,
          y: isCardHovered ? -8 : 0,
          z: 10,
          scale: 0.78,
          rotateX: 0,
          rotateY: -20,
          rotateZ: -2.5,
          opacity: 0.72,
          filter: 'blur(0px)',
        };
      case 3: // Left Peeking Card
        return {
          x: -130,
          y: isCardHovered ? -8 : 0,
          z: 60,
          scale: 0.86,
          rotateX: 0,
          rotateY: 15,
          rotateZ: 1.5,
          opacity: 0.9,
          filter: 'blur(0px)',
        };
      default:
        return {
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          opacity: 1,
          filter: 'blur(0px)',
        };
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      {/* ── DESKTOP/TABLET: 3D Single Card Slide/Fade Show ── */}
      <div
        className="hidden md:flex flex-col items-center justify-center relative w-full h-[500px]"
        style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
      >
        <div
          className="relative w-[420px] h-[500px] flex justify-center items-center"
          style={{ transformStyle: 'preserve-3d', transform: 'translateX(90px)' }}
        >
          <AnimatePresence mode="wait">
            <div
              key={activeIdx}
              onMouseMove={(e) => handleMouseMove(e, true)}
              onMouseEnter={() => setHoveredIdx(activeIdx)}
              onMouseLeave={() => {
                setHoveredIdx(null);
                handleMouseLeaveCard();
              }}
              onClick={() => handleServiceClick(SERVICES[activeIdx].link)}
              className="relative w-[360px] h-[480px] flex items-center justify-center cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, x: 50, rotateX: 0, rotateY: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  rotateX: tiltX,
                  rotateY: tiltY,
                  rotateZ: 0,
                  y: hoveredIdx === activeIdx ? -20 : 0,
                }}
                exit={{ opacity: 0, x: -50, rotateX: 0, rotateY: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onClick={() => handleServiceClick(SERVICES[activeIdx].link)}
                className="absolute w-[360px] h-[480px] rounded-[30px] flex flex-col justify-end select-none cursor-pointer overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(10, 25, 47, 0.96) 0%, rgba(5, 12, 24, 0.99) 100%)',
                  backdropFilter: 'blur(30px)',
                  transformStyle: 'preserve-3d',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                  border: hoveredIdx === activeIdx
                    ? '2px solid rgba(229, 193, 125, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: hoveredIdx === activeIdx
                    ? '0 30px 60px rgba(0,0,0,0.65), 0 0 35px rgba(229, 193, 125, 0.25)'
                    : '0 20px 40px rgba(0,0,0,0.45)',
                  zIndex: 40,
                }}
              >
                {/* Pulsing EXCLUSIVE tag over image */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 bg-navy/85 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
                  <span className="text-[9px] font-accent font-black tracking-widest text-gold uppercase">EXCLUSIVE SERVICE</span>
                </div>

                {/* 1. Card Header Image */}
                <div className="absolute top-0 left-0 right-0 h-[260px] overflow-hidden z-0">
                  <motion.img
                    src={SERVICES[activeIdx].image}
                    alt={SERVICES[activeIdx].title}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredIdx === activeIdx ? 1.08 : 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09121f]/50 to-[#09121f]" />
                </div>

                {/* Spotlight Flashlight tracking cursor */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                  style={{
                    opacity: hoveredIdx === activeIdx ? 1 : 0,
                    background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(229, 193, 125, 0.12) 0%, transparent 60%)`
                  }}
                />

                {/* 2. Card Info Area */}
                <div
                  className="p-6 w-full flex flex-col justify-end z-20 relative"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  {/* Title */}
                  <h4 className="font-display font-bold text-xl text-white text-left tracking-wide leading-tight mt-1">
                    {SERVICES[activeIdx].title}
                  </h4>

                  {/* Tagline description */}
                  <p className="text-white/60 text-xs leading-relaxed font-body text-left mt-2 h-[36px] overflow-hidden line-clamp-2">
                    {SERVICES[activeIdx].tagline}
                  </p>

                  {/* Rating & Context pill capsules */}
                  <div className="flex gap-1.5 mt-4 text-white/70">
                    <span className="text-[9px] px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 flex items-center gap-1 font-semibold text-gold">
                      {SERVICES[activeIdx].badge1}
                    </span>
                    <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/80 font-semibold">
                      {SERVICES[activeIdx].badge2}
                    </span>
                  </div>

                  {/* Call-to-action button */}
                  <div className="mt-4" style={{ transform: 'translateZ(60px)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(SERVICES[activeIdx].link);
                      }}
                      className="w-full py-2.5 rounded-full font-display font-black text-xs text-navy tracking-wider transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #E5C17D 0%, #F5D797 50%, #C59D4E 100%)',
                        boxShadow: hoveredIdx === activeIdx
                          ? '0 8px 25px rgba(229,193,125,0.35)'
                          : '0 4px 10px rgba(0,0,0,0.3)',
                      }}
                    >
                      RESERVE NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators dots */}
        <div className="flex gap-2 mt-10 z-25 relative animate-pulse-slow">
          {SERVICES.map((_, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  width: isActive ? '24px' : '8px',
                  background: isActive ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── MOBILE: Single Card Slide/Fade Carousel (auto-shuffling) ── */}
      <div className="md:hidden w-full flex flex-col items-center justify-center relative h-[450px]">
        <div className="relative w-[300px] h-[400px] flex justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              onClick={() => handleServiceClick(SERVICES[activeIdx].link)}
              className="absolute w-[280px] h-[390px] rounded-[30px] flex flex-col justify-end select-none cursor-pointer overflow-hidden shadow-xl border border-white/10"
              style={{
                background: 'linear-gradient(145deg, rgba(10, 25, 47, 0.96) 0%, rgba(5, 12, 24, 0.99) 100%)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Pulsing EXCLUSIVE tag over image */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gold/30 bg-navy/85 backdrop-blur-md">
                <span className="w-1 h-1 rounded-full bg-gold animate-ping" />
                <span className="text-[8px] font-accent font-black tracking-widest text-gold uppercase">EXCLUSIVE SERVICE</span>
              </div>

              {/* Image background with gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-[210px] overflow-hidden z-0">
                <img src={SERVICES[activeIdx].image} alt={SERVICES[activeIdx].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09121f]/50 to-[#09121f]" />
              </div>

              {/* Card Info Area */}
              <div className="p-5 w-full flex flex-col justify-end z-20 relative">
                <h4 className="font-display font-bold text-base text-white text-left tracking-wide leading-tight mt-1">
                  {SERVICES[activeIdx].title}
                </h4>
                <p className="text-white/60 text-[10px] leading-relaxed font-body text-left mt-1.5 h-[32px] overflow-hidden">
                  {SERVICES[activeIdx].tagline}
                </p>
                <div className="flex gap-1.5 mt-3 text-white/70">
                  <span className="text-[9px] px-2.5 py-1 rounded-full bg-gold/10 border border-gold/20 flex items-center gap-1 font-semibold text-gold">
                    {SERVICES[activeIdx].badge1}
                  </span>
                  <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/80 font-semibold">
                    {SERVICES[activeIdx].badge2}
                  </span>
                </div>
                <div className="mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleServiceClick(SERVICES[activeIdx].link); }}
                    className="w-full py-2.5 rounded-full font-display font-black text-xs text-navy tracking-wider transition-all duration-300 active:scale-[0.98] shadow-md cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #E5C17D 0%, #F5D797 50%, #C59D4E 100%)',
                    }}
                  >
                    RESERVE NOW
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel indicators dots */}
        <div className="flex gap-2 mt-6 z-25 relative animate-pulse-slow">
          {SERVICES.map((_, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                className="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  width: isActive ? '24px' : '8px',
                  background: isActive ? '#D4AF37' : 'rgba(255,255,255,0.25)',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
