import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const [stack, setStack] = useState([0, 1, 2, 3]);
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
      {/* ── DESKTOP/TABLET: 3D Horizontal Ribbon Shuffle Stack ── */}
      <div
        className="hidden md:flex flex-col items-center justify-center relative w-full h-[500px]"
        style={{ perspective: '1600px', transformStyle: 'preserve-3d' }}
      >
        {/* Explicitly wide box (w-[580px]) to capture all mouse clicks within the fanned-out area */}
        {/* Slow organic floating animation makes the whole deck float like a luxury island */}
        <motion.div
          className="relative w-[580px] h-[380px] flex justify-center items-center"
          style={{ transformStyle: 'preserve-3d', transform: 'translateX(-40px)' }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {SERVICES.map((card, idx) => {
            const pos = stack.indexOf(idx);
            const isFront = pos === 0;
            const isCardHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={card.id}
                onMouseMove={(e) => handleMouseMove(e, isFront)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  handleMouseLeaveCard();
                }}
                onClick={() => handleCardClick(isFront ? stack[1] : idx)}
                className="absolute w-[260px] h-[360px] rounded-[30px] flex flex-col justify-end select-none cursor-pointer overflow-hidden transition-all duration-300 shadow-2xl"
                style={{
                  background: 'rgba(9, 18, 31, 0.98)', // Dark luxury solid card background
                  backdropFilter: 'blur(24px)',
                  transformStyle: 'preserve-3d',
                  // White border highlight only for active front card on hover
                  border: isFront
                    ? (isCardHovered ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid rgba(255, 255, 255, 0.12)')
                    : '1px solid rgba(255, 255, 255, 0.03)',
                  boxShadow: isFront
                    ? (isCardHovered
                      ? '0 35px 70px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : '0 30px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)')
                    : '0 15px 30px rgba(0,0,0,0.35)',
                  zIndex: 40 - pos, // Set dynamic inline zIndex
                }}
                animate={getCardTransform(pos, isCardHovered)}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 18,
                  mass: 1.1,
                }}
              >
                {/* 1. Card Header Image with bottom gradient mask fading into dark background */}
                {/* Zoom hover effect on image */}
                <div className="absolute top-0 left-0 right-0 h-[200px] overflow-hidden z-0">
                  <motion.img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: isCardHovered ? 1.06 : 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09121f]/50 to-[#09121f]" />
                </div>

                {/* Spotlight Flashlight tracking cursor (Only for Front active card - golden spotlight) */}
                {isFront && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                    style={{
                      opacity: hoveredIdx === idx ? 1 : 0,
                      background: `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, rgba(212, 175, 55, 0.08) 0%, transparent 65%)`
                    }}
                  />
                )}

                {/* 2. Card Info Area (Left-Aligned details) */}
                <div
                  className="p-5 w-full flex flex-col justify-end z-20 relative"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  {/* Title */}
                  <h4 className="font-display font-bold text-lg text-white text-left tracking-wide leading-tight mt-1">
                    {card.title}
                  </h4>

                  {/* Tagline description */}
                  <p className="text-white/55 text-[10px] leading-relaxed font-body text-left mt-1.5 h-[32px] overflow-hidden line-clamp-2">
                    {card.tagline}
                  </p>

                  {/* Rating & Context pill capsules */}
                  <div className="flex gap-1.5 mt-3.5 text-white/70">
                    <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/5 flex items-center gap-1 font-semibold">
                      {card.badge1}
                    </span>
                    <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/5 font-semibold">
                      {card.badge2}
                    </span>
                  </div>

                  {/* Call-to-action button (Active front card is solid white, background cards are clean outlines) */}
                  <div className="mt-4" style={{ transform: 'translateZ(15px)' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(card.link);
                      }}
                      className={`w-full py-2.5 rounded-full font-bold text-xs transition-all duration-300 shadow-md ${isFront
                        ? 'bg-white hover:bg-neutral-100 hover:scale-[1.04] text-[#09121f] cursor-pointer'
                        : 'bg-white/[0.05] border border-white/10 hover:border-white/30 text-white/90 cursor-pointer'
                        }`}
                    >
                      {isFront ? 'Reserve now' : 'Explore'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Carousel indicators dots */}
        <div className="flex gap-2 mt-10 z-25 relative animate-pulse-slow" style={{ transform: 'translateX(-15px)' }}>
          {SERVICES.map((_, idx) => {
            const isActive = stack[0] === idx;
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

      {/* ── MOBILE: Swipe Carousel (auto-shuffling, centered) ── */}
      <div className="md:hidden w-full">
        <div
          ref={mobileScrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            paddingLeft: 'calc((100vw - 275px) / 2)',
            paddingRight: 'calc((100vw - 275px) / 2)',
          }}
        >
          {SERVICES.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.link)}
              className="snap-center shrink-0 w-[275px] rounded-[30px] flex flex-col justify-end h-[340px] relative overflow-hidden shadow-xl border border-white/5 cursor-pointer"
              style={{
                background: '#09121f',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }}
            >
              {/* Image background with gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-[190px] overflow-hidden z-0">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09121f]/50 to-[#09121f]" />
              </div>

              {/* Card Info Area */}
              <div className="p-5 w-full flex flex-col justify-end z-20 relative">
                <h4 className="font-display font-bold text-base text-white text-left tracking-wide leading-tight mt-1">
                  {card.title}
                </h4>
                <p className="text-white/60 text-[10px] leading-relaxed font-body text-left mt-1.5 h-[32px] overflow-hidden">
                  {card.tagline}
                </p>
                <div className="flex gap-1.5 mt-3 text-white/70">
                  <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/5 flex items-center gap-1 font-semibold">
                    {card.badge1}
                  </span>
                  <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-sm border border-white/5 font-semibold">
                    {card.badge2}
                  </span>
                </div>
                <div className="mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(card.link); }}
                    className="w-full py-2 rounded-full font-bold text-xs text-[#09121f] transition-all duration-200"
                    style={{ background: '#ffffff' }}
                  >
                    Reserve now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
