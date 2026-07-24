import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import imgBG from '../../assets/image/bg.webp';
import ServiceShuffle from './ServiceShuffle';
import { useSiteSettings } from '../../contexts';

export default function Hero() {
  const { settings } = useSiteSettings();

  // Video state
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── Detect mobile on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Video setup — desktop only, lazy ───────────────────────────────────────
  useEffect(() => {
    if (isMobile) return; // never load video on mobile
    const vid = videoRef.current;
    if (!vid) return;

    // Reset video ready state when src changes
    setVideoReady(false);
    setVideoError(false);

    const onCanPlay = () => {
      setVideoReady(true);
      vid.muted = true;
      vid.play().catch(err => console.log("Video play failed:", err));
    };
    const onError = () => setVideoError(true);

    vid.addEventListener('canplaythrough', onCanPlay);
    vid.addEventListener('error', onError);

    vid.load();

    return () => {
      vid.removeEventListener('canplaythrough', onCanPlay);
      vid.removeEventListener('error', onError);
    };
  }, [isMobile, settings?.heroVideoUrl]);

  const showVideo = !isMobile && videoReady && !videoError;
  const activeFallbackImage = settings?.heroMobileImageUrl || imgBG;

  return (
    <section className="relative lg:min-h-screen lg:flex lg:items-center overflow-hidden" style={{ maxWidth: '100vw' }}>

      {/* Fallback image — always rendered, hidden once video is ready */}
      <div
        className="absolute inset-0 scale-110 transition-opacity duration-1000"
        style={{ opacity: showVideo ? 0 : 1 }}
      >
        <img
          src={activeFallbackImage}
          alt="Luxury property background"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Desktop video — hidden on mobile, fades in when ready */}
      {!isMobile && settings?.heroVideoUrl && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: showVideo ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            key={settings?.heroVideoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            preload="metadata"
            poster={activeFallbackImage}
            muted
          >
            <source src={settings?.heroVideoUrl} />
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

      {/* ══ CONTENT ═════════════════════════════════════════════════════════ */}
      <div className="container-luxury relative z-10 pt-28 pb-16 lg:pt-32 lg:pb-20">

        {/* ── Desktop: 2-col grid ── */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-7"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-gold" style={{ background: '#D4AF37', boxShadow: '0 0 8px rgba(212,175,55,0.8)' }} />
              <span className="text-white/85 text-[10px] font-accent font-semibold tracking-[0.2em] uppercase">
                {settings?.heroTagline || "Pune's Premier NRI Property Platform"}
              </span>
            </motion.div>
            
            <div className="overflow-hidden mb-2">
              <motion.h1 initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-white leading-[1.05]" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}>
                {settings?.heroTitleLine1 || "Pune's Finest"}
              </motion.h1>
            </div>
            
            <div className="overflow-hidden mb-2" style={{ width: 'fit-content', paddingRight: '20px' }}>
              <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                <span className="font-display font-black leading-[1.05] inline-block whitespace-nowrap"
                  style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)', background: 'linear-gradient(135deg, #D4AF37 0%, #E8C84A 50%, #C4A028 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {settings?.heroTitleLine2Highlight || "Luxury Homes"}
                </span>
              </motion.div>
            </div>
            
            <div className="overflow-hidden mb-7">
              <motion.h1 initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.85, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-black text-white/90 leading-[1.05]" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.2rem)' }}>
                {settings?.heroTitleLine3 || "For NRIs"}
              </motion.h1>
            </div>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
              className="text-white/65 font-body text-base leading-[1.85] mb-9 max-w-[480px]">
              {settings?.heroDescription || "Pune's premier luxury real estate agency, specializing in helping NRI clients find elite properties and handle secure investments entirely remotely."}
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex items-center gap-8 mb-10">
              {[
                { num: '500+', label: 'Pune Properties' },
                { num: '320+', label: 'NRI Clients' },
                { num: '4.9', label: 'Star Rating', icon: <Star className="w-3.5 h-3.5 fill-gold text-gold" /> },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center gap-1 justify-center">{s.icon}<p className="font-display font-black text-white text-4xl leading-none">{s.num}</p></div>
                  <p className="text-white/50 text-[10px] font-body mt-1.5 tracking-wide">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="flex items-center justify-end">
            <ServiceShuffle />
          </div>
        </div>

        {/* ── Mobile: stacked layout ── */}
        <div className="lg:hidden flex flex-col w-full">
          <div className="mb-6 w-full overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4AF37' }} />
              <span className="text-white/85 text-[9px] font-semibold tracking-widest uppercase">
                {settings?.heroTagline || "Pune's Premier NRI Property Platform"}
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display font-black text-white leading-tight mb-2"
              style={{ fontSize: 'clamp(1.75rem, 7.5vw, 2.5rem)' }}>
              {settings?.heroTitleLine1 || "Pune's Finest"}<br />
              <span style={{ background: 'linear-gradient(135deg,#D4AF37,#E8C84A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {settings?.heroTitleLine2Highlight || "Luxury Homes"}
              </span><br />
              {settings?.heroTitleLine3 || "For NRIs"}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
              className="text-white/60 text-xs leading-relaxed mb-5 max-w-[320px]">
              {settings?.heroDescription || "Pune's premier luxury real estate agency, specializing in helping NRI clients find elite properties and handle secure investments entirely remotely."}
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-5">
              {[
                { num: '500+', label: 'Properties' },
                { num: '320+', label: 'NRI Clients' },
                { num: '4.9', label: 'Stars', icon: <Star className="w-3 h-3 fill-gold text-gold" /> },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="flex items-center gap-0.5 justify-center">{s.icon}<p className="font-display font-black text-white text-xl leading-none">{s.num}</p></div>
                  <p className="text-white/50 text-[9px] mt-1 tracking-wide">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <ServiceShuffle />

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-2 justify-center mt-5 pb-4">
            {['FEMA Compliant', 'Remote Buying', 'RERA Verified', 'NRI Desk'].map(badge => (
              <span key={badge} className="text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gold/30 text-gold/80"
                style={{ background: 'rgba(212,175,55,0.08)' }}>
                {badge}
              </span>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
