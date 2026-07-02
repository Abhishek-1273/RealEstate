import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bed, Bath, Square, MapPin, Heart, Share2, Phone, Mail,
  ChevronLeft, ChevronRight, X, CheckCircle2, Shield, Star,
  Car, Calendar, Layers, Sparkles
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { useWishlist, useAuth } from '../../contexts';
import { properties } from '../../data/properties';
import PropertyCard from '../../components/common/PropertyCard';
import InteractiveFloorPlan from '../../components/common/InteractiveFloorPlan';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, viewportOnce } from '../../animations/variants';

export default function PropertyDetails() {
  const { id } = useParams();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuth } = useAuth();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [loan, setLoan] = useState(20000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const property = properties.find(p => p.id === Number(id));

  const handleShare = async () => {
    const shareData = {
      title: property?.title,
      text: `Check out this luxury property: ${property?.title} in ${property?.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled/failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const related = properties.filter(p => p.id !== Number(id)).slice(0, 3);
  const wished = isWishlisted(Number(id));

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <h2 className="font-display font-bold text-navy text-3xl mb-4">Property not found</h2>
        <Link to="/properties" className="btn-primary">Back to Listings</Link>
      </div>
    </div>
  );

  const emi = Math.round((loan * (rate / 1200) * Math.pow(1 + rate / 1200, years * 12)) / (Math.pow(1 + rate / 1200, years * 12) - 1));

  return (
    <div className="min-h-screen bg-surface pt-20">
      
      {/* ── Custom Swiper Localized Styles Injection ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .main-swiper-gallery .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.45) !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .main-swiper-gallery .swiper-pagination-bullet-active {
          background: #D4AF37 !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
        .thumbs-swiper-gallery .swiper-slide {
          border: 2px solid transparent !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          transition: all 0.3s ease !important;
        }
        .thumbs-swiper-gallery .swiper-slide-thumb-active {
          border-color: #D4AF37 !important;
          transform: scale(0.96);
        }
        .thumbs-swiper-gallery .swiper-slide-thumb-active img {
          opacity: 1 !important;
        }
      `}} />

      {/* ── Breadcrumb ── */}
      <div className="bg-white" style={{ borderBottom: '1px solid rgba(7,26,47,0.06)' }}>
        <div className="container-luxury py-4 flex items-center gap-2.5 text-[10px] text-ink-muted font-accent uppercase tracking-widest font-bold">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-neutral-300 font-normal">/</span>
          <Link to="/properties" className="hover:text-gold transition-colors">Properties</Link>
          <span className="text-neutral-300 font-normal">/</span>
          <span className="text-navy truncate font-black">{property.title}</span>
        </div>
      </div>

      {/* ── Gallery ── */}
      <div 
        className="py-10 relative overflow-hidden" 
        style={{ 
          background: 'linear-gradient(180deg, #071A2F 0%, #030D18 100%)',
          boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.2), inset 0 -10px 30px rgba(0,0,0,0.2)'
        }}
      >
        {/* Soft luxury ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[130px] pointer-events-none" />

        <div className="container-luxury">
          {/* Main swiper wrapper */}
          <div className="relative rounded-3xl overflow-hidden mb-5 shadow-2xl group border border-white/10 aspect-square md:aspect-auto md:h-[520px] w-full">
            <Swiper
              modules={[Pagination, Thumbs]}
              onSwiper={setMainSwiper}
              pagination={{ 
                clickable: true,
                dynamicBullets: true 
              }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              className="h-full main-swiper-gallery"
            >
              {property.images.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`${property.title} ${i + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-[1.025]"
                    onClick={() => setLightbox(i)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Premium Swiper Navigation (Fade in on hover of Swiper wrapper) */}
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/90 text-white hover:text-navy border border-white/15 hover:border-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
              onClick={() => {
                mainSwiper?.slidePrev();
              }}
            >
              <ChevronLeft className="w-5 h-5 -translate-x-0.5" />
            </button>
            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/90 text-white hover:text-navy border border-white/15 hover:border-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
              onClick={() => {
                mainSwiper?.slideNext();
              }}
            >
              <ChevronRight className="w-5 h-5 translate-x-0.5" />
            </button>

            {/* Overlay badges (Pill tags - shortened on mobile) */}
            <div className="absolute top-3.5 left-3.5 md:top-6 md:left-6 z-10 flex items-center gap-1.5 md:gap-2.5 select-none">
              {property.badge && (
                <span 
                  className="px-2.5 py-1 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1 md:gap-1.5 border border-white/20"
                  style={{ 
                    background: 'linear-gradient(135deg, #D4AF37 0%, #B89020 100%)', 
                    color: '#071A2F'
                  }}
                >
                  <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 animate-pulse" />
                  <span className="hidden sm:inline">{property.badge}</span>
                  <span className="inline sm:hidden">{property.badge === 'New Launch' ? 'New' : property.badge === 'Signature Collection' ? 'Signature' : property.badge}</span>
                </span>
              )}
              <span 
                className="px-2.5 py-1 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1 md:gap-1.5 border border-white/10"
                style={{ 
                  background: 'rgba(7, 26, 47, 0.65)', 
                  color: 'white', 
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="w-1 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                <span className="hidden sm:inline">{property.status}</span>
                <span className="inline sm:hidden">{property.status === 'Ready to Move' ? 'Ready' : property.status === 'Under Construction' ? 'Const.' : property.status}</span>
              </span>
            </div>

            {/* Premium Actions (Wishlist & Share - shortened/smaller on mobile) */}
            <div className="absolute top-3.5 right-3.5 md:top-6 md:right-6 z-10 flex gap-2 md:gap-3">
              <button
                onClick={() => {
                  if (!user) {
                    openAuth();
                    return;
                  }
                  toggleWishlist(property);
                }}
                className="w-8.5 h-8.5 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border"
                style={{
                  background: wished ? 'rgba(239, 68, 68, 0.95)' : 'rgba(7, 26, 47, 0.5)',
                  borderColor: wished ? '#EF4444' : 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Heart className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 ${wished ? 'fill-current animate-pulse' : ''}`} />
              </button>
              <button 
                onClick={handleShare}
                className="w-8.5 h-8.5 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border text-white hover:text-gold"
                style={{ 
                  background: 'rgba(7, 26, 47, 0.5)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)' 
                }}
              >
                <Share2 className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
              </button>
            </div>
          </div>

          {/* Thumbnails Swiper (Beautiful gold-bordered cards) */}
          {property.images.length > 1 && (
            <div className="pt-4 mt-4 border-t border-white/5">
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={Math.min(property.images.length, 6)}
                freeMode
                watchSlidesProgress
                className="!h-20 thumbs-swiper-gallery"
              >
                {property.images.map((img, i) => (
                  <SwiperSlide 
                    key={i} 
                    onClick={() => mainSwiper?.slideTo(i)}
                    className="cursor-pointer !h-20 border border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-105" 
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              <X className="w-5 h-5" />
            </button>
            <img
              src={property.images[lightbox]}
              alt=""
              className="max-w-full max-h-full rounded-2xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            {lightbox > 0 && (
              <button onClick={e => { e.stopPropagation(); setLightbox(l => l - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {lightbox < property.images.length - 1 && (
              <button onClick={e => { e.stopPropagation(); setLightbox(l => l + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="container-luxury py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2">
            <motion.div variants={fadeLeft} initial="hidden" animate="visible">
              {/* Title + Price */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display font-black text-navy text-3xl md:text-4xl leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-ink-muted">
                    <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-black text-4xl" style={{ color: '#8A6A18' }}>{property.priceLabel}</p>
                  <p className="text-ink-soft text-sm">₹{Math.round(property.price / property.area).toLocaleString()}/sqft</p>
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-4 p-5 rounded-2xl mb-8"
                style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)', boxShadow: '0 2px 16px rgba(7,26,47,0.05)' }}>
                {[
                  { icon: <Bed className="w-5 h-5" />, label: 'Bedrooms', val: property.bedrooms },
                  { icon: <Bath className="w-5 h-5" />, label: 'Bathrooms', val: property.bathrooms },
                  { icon: <Square className="w-5 h-5" />, label: 'Carpet Area', val: `${property.area.toLocaleString()} sqft` },
                  { icon: <Car className="w-5 h-5" />, label: 'Parking', val: property.parking },
                  { icon: <Calendar className="w-5 h-5" />, label: 'Year Built', val: property.yearBuilt },
                  { icon: <Layers className="w-5 h-5" />, label: 'Furnishing', val: property.furnishing },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 min-w-[130px]">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-ink-soft">{s.label}</p>
                      <p className="font-bold text-navy text-sm">{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-navy text-xl mb-4">About This Property</h2>
                <p className="text-ink-muted text-sm leading-[1.95]">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-navy text-xl mb-5">Amenities</h2>
                <div className="flex flex-wrap gap-2.5">
                  {property.amenities.map((a, i) => (
                    <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                      style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', color: '#8A6A18' }}>
                      <CheckCircle2 className="w-3 h-3" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details table */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-navy text-xl mb-5">Property Details</h2>
                <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(7,26,47,0.08)' }}>
                  {[
                    ['Property Type', property.type],
                    ['Category', property.category],
                    ['Facing', property.facing],
                    ['Developer', property.developer || 'Reputed Developer'],
                    ['RERA Number', property.rera || 'P52100046789'],
                    ['Status', property.status],
                  ].map(([k, v], i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 text-sm"
                      style={{ background: i % 2 === 0 ? 'white' : 'rgba(7,26,47,0.02)', borderBottom: i < 5 ? '1px solid rgba(7,26,47,0.05)' : 'none' }}>
                      <span className="text-ink-muted">{k}</span>
                      <span className="font-semibold text-navy">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Floor Plan */}
              <div className="mb-10">
                <InteractiveFloorPlan />
              </div>

              {/* EMI Calculator */}
              <div className="rounded-3xl p-7 mb-8"
                style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)', boxShadow: '0 4px 24px rgba(7,26,47,0.06)' }}>
                <h2 className="font-display font-bold text-navy text-xl mb-6 flex items-center gap-2.5">
                  Home Loan Calculator
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-muted">Loan Amount</span>
                      <span className="font-bold text-navy">₹{(loan / 10000000).toFixed(2)} Cr</span>
                    </div>
                    <input type="range" min={1000000} max={property.price} step={100000}
                      value={loan} onChange={e => setLoan(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-muted">Interest Rate</span>
                      <span className="font-bold text-navy">{rate}% p.a.</span>
                    </div>
                    <input type="range" min={6} max={14} step={0.25}
                      value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-muted">Loan Tenure</span>
                      <span className="font-bold text-navy">{years} years</span>
                    </div>
                    <input type="range" min={5} max={30} step={1}
                      value={years} onChange={e => setYears(Number(e.target.value))} className="w-full" />
                  </div>
                  <div className="pt-4 rounded-2xl px-5 py-4 text-center"
                    style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.04))', border: '1px solid rgba(212,175,55,0.2)' }}>
                    <p className="text-ink-muted text-xs mb-1">Estimated Monthly EMI</p>
                    <p className="font-display font-black text-3xl" style={{ color: '#8A6A18' }}>₹{emi.toLocaleString()}</p>
                    <p className="text-ink-soft text-[11px] mt-1">Consult your bank for exact rates</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Right Column (Sticky) ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-24 lg:self-start space-y-4"
          >
            {/* Booking Card */}
            <div className="rounded-3xl p-6"
              style={{ background: 'white', border: '1px solid rgba(7,26,47,0.08)', boxShadow: '0 8px 40px rgba(7,26,47,0.10)' }}>
              <p className="font-display font-black text-navy text-2xl mb-0.5">{property.priceLabel}</p>
              <p className="text-ink-soft text-xs mb-6">Negotiable · RERA Verified</p>

              <div className="flex flex-col gap-3 mb-5">
                <Link to="/contact"
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      openAuth('/contact');
                    }
                  }}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-navy flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 4px 18px rgba(212,175,55,0.3)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(212,175,55,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(212,175,55,0.3)'; }}
                >
                  <Calendar className="w-4 h-4" /> Book a Site Visit
                </Link>
                <a href={`tel:${property.agent.phone}`}
                  className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border-2 border-navy text-navy hover:bg-navy hover:text-white transition-all duration-250">
                  <Phone className="w-4 h-4" /> Call Agent
                </a>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{ background: 'rgba(7,26,47,0.03)' }}>
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                  <img src={`https://ui-avatars.com/api/?name=${property.agent.name}&background=D4AF37&color=071A2F&font-size=0.5`} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-navy text-sm">{property.agent.name}</p>
                  <p className="text-ink-soft text-xs">Luxury Property Advisor</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <a href={`https://wa.me/919876543210?text=Hi, I am interested in ${property.title}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 text-white transition-all duration-250 hover:-translate-y-0.5"
                  style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
                  WhatsApp Agent
                </a>
                <a href={`mailto:${property.agent.email || 'hello@hyperrelestix.in'}`}
                  className="w-full py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 text-ink-muted hover:text-navy transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Send Email
                </a>
              </div>
            </div>

            {/* RERA badge */}
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
              <Shield className="w-5 h-5 shrink-0" style={{ color: '#D4AF37' }} />
              <div>
                <p className="text-navy text-xs font-bold">RERA Registered</p>
                <p className="text-ink-soft text-[11px]">{property.rera || 'P52100046789'}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Related Properties ── */}
        <div className="mt-20">
          <h2 className="font-display font-bold text-navy text-2xl mb-8">Similar Luxury Properties</h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-7"
          >
            {related.map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Clipboard Copy Toast Notification ── */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#071A2F]/95 border border-[#D4AF37]/30 px-6 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] animate-bounce" />
            <span className="text-white text-xs font-bold uppercase tracking-wider font-accent">Property Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
