import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bed, Bath, Square, MapPin, Heart, Share2, Phone, Mail,
  ChevronLeft, ChevronRight, X, CheckCircle2, Shield, Star,
  Car, Calendar, Layers, Sparkles, Loader2,
  GraduationCap, TrainFront, Activity, ShoppingBag, Locate,
  ChevronDown
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import { useWishlist, useAuth, useSiteSettings, getBrandName } from '../../contexts';
import PropertyCard from '../../components/common/PropertyCard';
import { fetchPropertyById, fetchProperties } from '../../utils/api';
import { getDynamicOgImage } from '../../utils/ogImage';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, viewportOnce } from '../../animations/variants';
import InteractiveMap from '../../components/common/InteractiveMap';
import SEO from '../../components/common/SEO';
import ErrorBoundary from '../../components/common/ErrorBoundary';

function generateNearbyAmenities(lat, lng) {
  if (!lat || !lng) return {};

  const categories = {
    education: [
      { name: 'Delhi Public School', offsetLat: 0.006, offsetLng: -0.005 },
      { name: 'International Institute of Technology', offsetLat: -0.009, offsetLng: 0.007 },
      { name: 'Royal Orchid Preschool', offsetLat: 0.003, offsetLng: 0.005 },
      { name: 'Oakridge International School', offsetLat: -0.005, offsetLng: -0.006 }
    ],
    transit: [
      { name: 'Metro Station - Line 1', offsetLat: 0.004, offsetLng: 0.002 },
      { name: 'Central Bus Terminal', offsetLat: -0.005, offsetLng: -0.003 },
      { name: 'Prestige Auto Stand', offsetLat: 0.002, offsetLng: -0.001 },
      { name: 'Railway Junction Station', offsetLat: 0.012, offsetLng: -0.011 }
    ],
    medical: [
      { name: 'Max Super Speciality Hospital', offsetLat: -0.003, offsetLng: 0.004 },
      { name: 'Apollo Pharmacy & Wellness', offsetLat: 0.001, offsetLng: 0.002 },
      { name: 'Fortis Memorial Health Institute', offsetLat: 0.008, offsetLng: -0.005 },
      { name: 'LifeCare Diagnostic Clinic', offsetLat: -0.002, offsetLng: -0.003 }
    ],
    shopping: [
      { name: 'Phoenix Marketcity Mall', offsetLat: -0.006, offsetLng: -0.008 },
      { name: 'The Galleria Luxury Highstreet', offsetLat: 0.003, offsetLng: 0.003 },
      { name: 'Gourmet World Supermarket', offsetLat: -0.001, offsetLng: 0.001 },
      { name: 'Starbucks Coffee & Roastery', offsetLat: 0.001, offsetLng: 0.002 }
    ]
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const result = {};
  Object.keys(categories).forEach(cat => {
    result[cat] = categories[cat].map(item => {
      const itemLat = lat + item.offsetLat;
      const itemLng = lng + item.offsetLng;
      const dist = getDistance(lat, lng, itemLat, itemLng);
      return {
        name: item.name,
        distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`,
        distanceVal: dist,
        coordinates: { lat: itemLat, lng: itemLng }
      };
    }).sort((a, b) => a.distanceVal - b.distanceVal);
  });

  return result;
}

export default function PropertyDetails() {
  const { id } = useParams();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuth } = useAuth();
  const { settings } = useSiteSettings();
  const brandName = getBrandName(settings);

  const [amenityCategory, setAmenityCategory] = useState('education');
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(14);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [loan, setLoan] = useState(20000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyRef = useRef(null);
  const sidebarWrapRef = useRef(null);
  const sidebarRef = useRef(null);
  const mapSectionRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Smooth 3-state scroll tracking for sidebar card
  useEffect(() => {
    const wrap = sidebarWrapRef.current;
    const card = sidebarRef.current;
    const mapEl = mapSectionRef.current;
    if (!wrap || !card || !property) return;

    const NAVBAR_H = 96;

    const resetStyles = () => {
      card.style.position = '';
      card.style.top = '';
      card.style.left = '';
      card.style.width = '';
      card.style.bottom = '';
      card.style.zIndex = '';
    };

    const onScroll = () => {
      // On mobile screens (< 1024px), sidebar is stacked normally below content
      if (window.innerWidth < 1024) {
        resetStyles();
        return;
      }

      const wrapRect = wrap.getBoundingClientRect();
      const cardH = card.offsetHeight;
      const wrapTop = wrapRect.top;

      const mapTop = mapEl ? mapEl.getBoundingClientRect().top : Infinity;
      const distanceToMap = mapEl ? (mapEl.offsetTop - wrap.offsetTop) : Infinity;
      const maxTop = distanceToMap - cardH - 24;

      // State 1: Above fixed threshold (top of page)
      if (wrapTop > NAVBAR_H) {
        resetStyles();
      }
      // State 2: Map section reached -> lock at exact maxTop offset inside wrapper
      else if (mapTop <= NAVBAR_H + cardH + 24) {
        card.style.position = 'absolute';
        card.style.top = maxTop + 'px';
        card.style.bottom = 'auto';
        card.style.left = '0px';
        card.style.width = '100%';
        card.style.zIndex = '30';
      }
      // State 3: Middle region -> stay fixed below navbar
      else {
        card.style.position = 'fixed';
        card.style.top = NAVBAR_H + 'px';
        card.style.left = wrapRect.left + 'px';
        card.style.width = wrapRect.width + 'px';
        card.style.bottom = 'auto';
        card.style.zIndex = '30';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      resetStyles();
    };
  }, [property]);

  const currenciesList = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'AED', label: 'AED (Dh)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
  ];

  const formatPrice = (price, curr) => {
    const rates = {
      INR: { rate: 1, symbol: '₹' },
      USD: { rate: 1 / 83.5, symbol: '$' },
      AED: { rate: 1 / 22.7, symbol: 'AED ' },
      GBP: { rate: 1 / 106.2, symbol: '£' },
      CAD: { rate: 1 / 61.2, symbol: 'C$' }
    };
    const { rate, symbol } = rates[curr];
    const converted = price * rate;
    if (curr === 'INR') {
      return property?.priceLabel;
    }
    if (converted >= 1000000) {
      return `${symbol}${(converted / 1000000).toFixed(2)} M`;
    }
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const getProperty = async () => {
      try {
        const data = await fetchPropertyById(id);
        if (active) {
          setProperty(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Failed to load property details.');
          setLoading(false);
        }
      }
    };
    const getRelated = async () => {
      try {
        const resData = await fetchProperties({ limit: 12 });
        if (active && resData?.properties) {
          setRelatedList(resData.properties);
        }
      } catch (err) {
        console.error('Failed to load related properties:', err);
      }
    };
    getProperty();
    getRelated();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (property?.coordinates?.lat && property?.coordinates?.lng) {
      setMapCenter([property.coordinates.lat, property.coordinates.lng]);
    } else {
      setMapCenter([19.0178, 72.8173]); // default fallback: Worli, Mumbai
    }
  }, [property]);

  const handleShare = async () => {
    const shareData = {
      title: property?.title,
      text: `Check out this luxury property: ${property?.title} in ${property?.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share was canceled or failed — this is expected user behavior, not an error
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

  // Related: same city > same type > anything else — always 3 results
  const { related, relatedLabel } = (() => {
    const others = relatedList.filter(p => String(p.id) !== String(id) && p._id !== id);
    const sameCity = others.filter(p => p.city === property?.city);
    if (sameCity.length >= 3) return { related: sameCity.slice(0, 3), relatedLabel: `More in ${property?.city}` };
    if (sameCity.length > 0) {
      const sameType = others.filter(p => p.type === property?.type && !sameCity.includes(p));
      const merged = [...sameCity, ...sameType].slice(0, 3);
      if (merged.length >= 3) return { related: merged, relatedLabel: `Similar ${property?.type}s` };
    }
    const sameType = others.filter(p => p.type === property?.type);
    if (sameType.length >= 3) return { related: sameType.slice(0, 3), relatedLabel: `Similar ${property?.type}s` };
    return { related: others.slice(0, 3), relatedLabel: 'You May Also Like' };
  })();
  const wished = isWishlisted(property?._id || property?.id || id);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#071A2F]">
      <Loader2 className="w-8 h-8 animate-spin text-gold" style={{ color: '#D4AF37' }} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-navy-dark transition-colors duration-300">
      <div className="text-center max-w-md p-6">
        <h2 className="font-display font-bold text-red-500 text-2xl mb-2">Error Loading Property</h2>
        <p className="text-sm text-ink-soft dark:text-white/60 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
          <Link to="/properties" className="btn-outline">Back to Listings</Link>
        </div>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-navy-dark transition-colors duration-300">
      <div className="text-center">
        <h2 className="font-display font-bold text-navy dark:text-white text-3xl mb-4">Property not found</h2>
        <Link to="/properties" className="btn-primary">Back to Listings</Link>
      </div>
    </div>
  );

  const emi = Math.round((loan * (rate / 1200) * Math.pow(1 + rate / 1200, years * 12)) / (Math.pow(1 + rate / 1200, years * 12) - 1));

  const galleryImages = property.images && property.images.length > 0
    ? property.images
    : (property.image ? [property.image] : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200']);

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-20 transition-colors duration-300">
      <SEO
        title={`${property.title} in ${property.location}, ${property.city}`}
        description={`${property.type} for sale in ${property.location}, ${property.city}. Price: ${property.priceLabel}. ${property.description || `Discover this verified premium listing on ${brandName}.`}`}
        image={getDynamicOgImage(property)}
        url={`/properties/${id}`}
      />

      {/* Schema.org Structured Data for Real Estate Listings */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SingleFamilyResidence",
          "name": property.title,
          "description": property.description || `${property.type} for sale in ${property.location}, ${property.city}.`,
          "image": galleryImages,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": property.location,
            "addressRegion": property.city,
            "addressCountry": "IN"
          },
          ...(property.coordinates?.lat && property.coordinates?.lng ? {
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": property.coordinates.lat,
              "longitude": property.coordinates.lng
            }
          } : {}),
          "offers": {
            "@type": "Offer",
            "price": property.price,
            "priceCurrency": "INR",
            "availability": property.status === 'Sold Out' ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
          }
        })}
      </script>

      {/* Swiper gallery styles are in globals.css — .main-swiper-gallery, .thumbs-swiper-gallery */}

      {/* ── Breadcrumb ── */}
      <div className="bg-white dark:bg-navy border-b border-gray-100 dark:border-white/10 transition-colors">
        <div className="container-luxury py-4 flex items-center gap-2.5 text-[10px] text-ink-muted dark:text-cream/80 font-accent uppercase tracking-widest font-bold">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-neutral-300 dark:text-white/20 font-normal">/</span>
          <Link to="/properties" className="hover:text-gold transition-colors">Properties</Link>
          <span className="text-neutral-300 dark:text-white/20 font-normal">/</span>
          <span className="text-navy dark:text-white truncate font-black">{property.title}</span>
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
            <ErrorBoundary widget>
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
                {galleryImages.map((img, i) => (
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
            </ErrorBoundary>

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
                className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border"
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
                className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg border text-white hover:text-gold"
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
              <ErrorBoundary widget>
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
              </ErrorBoundary>
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
            <div>
              {/* Title + Price */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display font-black text-navy dark:text-white text-3xl md:text-4xl leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-ink-muted dark:text-cream/80">
                    <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="w-full md:w-auto text-right flex flex-col items-end">
                  <div className="relative" ref={currencyRef}>
                    <button
                      type="button"
                      onClick={() => setCurrencyOpen(!currencyOpen)}
                      className="mb-2 flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-gray-150 dark:border-white/10 rounded-full px-2.5 py-0.5 text-navy dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10"
                    >
                      <span className="text-[9px] text-ink-soft dark:text-white/40 uppercase font-bold tracking-wider">Currency:</span>
                      <span className="text-[9px] font-bold tracking-wide uppercase flex items-center gap-0.5">
                        {currency} <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${currencyOpen ? 'rotate-180' : ''}`} />
                      </span>
                    </button>

                    <AnimatePresence>
                      {currencyOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.95 }}
                          transition={{ duration: 0.12 }}
                          className="absolute right-0 mt-1 min-w-[100px] bg-white/95 dark:bg-navy-light/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-xl shadow-luxury z-30 py-1 overflow-hidden"
                        >
                          {currenciesList.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => {
                                setCurrency(c.value);
                                setCurrencyOpen(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 text-[10px] font-semibold transition-colors flex items-center justify-between ${currency === c.value
                                ? 'bg-gold/10 text-gold-dark dark:text-gold'
                                : 'text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                                }`}
                            >
                              {c.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="font-display font-black text-3xl md:text-4xl" style={{ color: '#8A6A18' }}>
                    {formatPrice(property.price, currency)}
                  </p>
                  <p className="text-ink-soft dark:text-white/55 text-[11px] mt-1">
                    {currency === 'INR'
                      ? `₹${Math.round(property.price / property.area).toLocaleString()}/sqft`
                      : `${currency} ${Math.round((property.price * (currency === 'USD' ? 1 / 83.5 : currency === 'AED' ? 1 / 22.7 : currency === 'GBP' ? 1 / 106.2 : 1 / 61.2)) / property.area).toLocaleString()}/sqft`
                    }
                  </p>
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap gap-4 p-5 rounded-2xl mb-8 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 shadow-card transition-colors duration-300">
                {[
                  { icon: <Bed className="w-5 h-5" />, label: 'Bedrooms', val: property.bedrooms },
                  { icon: <Bath className="w-5 h-5" />, label: 'Bathrooms', val: property.bathrooms },
                  { icon: <Square className="w-5 h-5" />, label: 'Carpet Area', val: `${property.area.toLocaleString()} sqft` },
                  { icon: <Car className="w-5 h-5" />, label: 'Parking', val: property.parking },
                  { icon: <Calendar className="w-5 h-5" />, label: 'Year Built', val: property.yearBuilt },
                  { icon: <Layers className="w-5 h-5" />, label: 'Furnishing', val: property.furnishing },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3 min-w-[130px]">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gold/10 text-gold">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-ink-soft dark:text-white/40">{s.label}</p>
                      <p className="font-bold text-navy dark:text-white text-sm">{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-navy dark:text-white text-xl mb-4">About This Property</h2>
                <p className="text-ink-muted dark:text-white/60 text-sm leading-[1.95]">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-navy dark:text-white text-xl mb-5">Amenities</h2>
                <div className="flex flex-wrap gap-2.5">
                  {(property.amenities || []).map((a, i) => (
                    <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-gold/5 dark:bg-gold/10 border border-gold/20 text-gold-dark dark:text-gold-light"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details table */}
              <div className="mb-8">
                <h2 className="font-display font-bold text-navy dark:text-white text-xl mb-5">Property Details</h2>
                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10"
                >
                  {[
                    ['Property Type', property.type],
                    ['Category', property.category],
                    ['Facing', property.facing],
                    ['Developer', property.developer || 'Reputed Developer'],
                    ['RERA Number', property.rera || 'P52100046789'],
                    ['Status', property.status],
                  ].map(([k, v], i) => (
                    <div key={i} className={`flex items-center justify-between px-5 py-3.5 text-sm ${i % 2 === 0 ? 'bg-white dark:bg-navy' : 'bg-black/5 dark:bg-white/5'} ${i < 5 ? 'border-b border-gray-100 dark:border-white/10' : ''}`}
                    >
                      <span className="text-ink-muted dark:text-cream/80">{k}</span>
                      <span className="font-semibold text-navy dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EMI Calculator */}
              <div className="rounded-3xl p-7 mb-8 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 shadow-card transition-colors duration-300"
              >
                <h2 className="font-display font-bold text-navy dark:text-white text-xl mb-6 flex items-center gap-2.5">
                  Home Loan Calculator
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-muted dark:text-cream/80">Loan Amount</span>
                      <span className="font-bold text-navy dark:text-white">₹{(loan / 10000000).toFixed(2)} Cr</span>
                    </div>
                    <input type="range" min={1000000} max={property.price} step={100000}
                      value={loan} onChange={e => setLoan(Number(e.target.value))} className="w-full animate-slider" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-muted dark:text-cream/80">Interest Rate</span>
                      <span className="font-bold text-navy dark:text-white">{rate}% p.a.</span>
                    </div>
                    <input type="range" min={6} max={14} step={0.25}
                      value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-ink-muted dark:text-cream/80">Loan Tenure</span>
                      <span className="font-bold text-navy dark:text-white">{years} years</span>
                    </div>
                    <input type="range" min={5} max={30} step={1}
                      value={years} onChange={e => setYears(Number(e.target.value))} className="w-full" />
                  </div>
                  <div className="pt-4 rounded-2xl px-5 py-4 text-center bg-gradient-to-br from-gold/10 to-gold/5 dark:from-gold/20 dark:to-gold/10 border border-gold/25"
                  >
                    <p className="text-ink-muted dark:text-cream/80 text-xs mb-1">Estimated Monthly EMI</p>
                    <p className="font-display font-black text-3xl text-gold-dark dark:text-gold">₹{emi.toLocaleString()}</p>
                    <p className="text-ink-soft dark:text-white/40 text-[11px] mt-1">Consult your bank for exact rates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column (Sticky Sidebar Card) ── */}
          <div ref={sidebarWrapRef} className="lg:col-span-1 relative">
            <div ref={sidebarRef} className="space-y-4">

              {/* Booking Card */}
              <div className="rounded-3xl p-6 bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card transition-colors duration-300">
                <p className="font-display font-black text-navy dark:text-white text-2xl mb-0.5">{property.priceLabel}</p>
                <p className="text-ink-soft dark:text-white/40 text-xs mb-6">Negotiable · RERA Verified</p>

                <div className="flex flex-col gap-3 mb-5">
                  <Link
                    to="/contact"
                    state={{
                      subject: `Book a Site Visit: ${property.title}`,
                      propertyId: property._id || property.id,
                      message: `Hi, I am interested in booking a site visit for "${property.title}" (Locality: ${property.location}). Please connect me with the specialist advisor, ${property.agent?.name || 'an agent'}.`
                    }}
                    onClick={(e) => { if (!user) { e.preventDefault(); openAuth('/contact'); } }}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-navy flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 4px 18px rgba(212,175,55,0.3)' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(212,175,55,0.45)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(212,175,55,0.3)'; }}
                  >
                    <Calendar className="w-4 h-4" /> Book a Site Visit
                  </Link>
                  <a href={`tel:${property.agent.phone}`}
                    className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border-2 border-navy dark:border-white text-navy dark:text-white hover:bg-navy dark:hover:bg-white hover:text-white dark:hover:text-navy transition-all duration-200"
                  >
                    <Phone className="w-4 h-4" /> Call Agent
                  </a>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${property.agent.name}&background=D4AF37&color=071A2F&font-size=0.5`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-navy dark:text-white text-sm">{property.agent.name}</p>
                    <p className="text-ink-soft dark:text-white/40 text-xs">Luxury Property Advisor</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <a href={`https://wa.me/919876543210?text=Hi, I am interested in ${property.title}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 text-white"
                    style={{ background: '#25D366' }}>
                    WhatsApp Agent
                  </a>
                  <a href={`mailto:${property.agent.email || 'hello@hyperrelestix.in'}`}
                    className="w-full py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 text-ink-muted dark:text-cream/80 hover:text-navy dark:hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> Send Email
                  </a>
                </div>
              </div>{/* end booking card */}

              {/* RERA badge */}
              <div className="rounded-2xl p-4 flex items-center gap-3 bg-gold/5 dark:bg-gold/10 border border-gold/20">
                <Shield className="w-5 h-5 shrink-0" style={{ color: '#D4AF37' }} />
                <div>
                  <p className="text-navy dark:text-white text-xs font-bold">RERA Registered</p>
                  <p className="text-ink-soft dark:text-white/40 text-[11px]">{property.rera || 'P52100046789'}</p>
                </div>
              </div>{/* end RERA badge */}

            </div>{/* end sidebarRef */}
          </div>{/* end sidebarWrapRef */}

        </div>{/* end grid */}

        {/* ── Location & Neighborhood ── */}
        <div ref={mapSectionRef} className="mt-16 bg-white dark:bg-navy border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-card transition-colors duration-300">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Map Column */}
            <div className="flex-1 min-h-[350px] md:min-h-[450px] relative z-0 order-2 lg:order-1 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5">
              <ErrorBoundary widget>
                <InteractiveMap
                  properties={[property]}
                  center={mapCenter}
                  zoom={mapZoom}
                  activePropertyId={property._id || property.id}
                  showAmenities={
                    generateNearbyAmenities(
                      property?.coordinates?.lat || 19.0178,
                      property?.coordinates?.lng || 72.8173
                    )[amenityCategory] || []
                  }
                  amenityCategory={amenityCategory}
                />
              </ErrorBoundary>
            </div>

            {/* Amenities Sidebar Column */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col justify-between order-1 lg:order-2">
              <div>
                <span className="h-px w-8 bg-gold inline-block mb-3" style={{ background: '#D4AF37' }} />
                <h3 className="font-display font-black text-navy dark:text-white text-2xl tracking-tight mb-2">
                  Location & Neighborhood
                </h3>
                <p className="text-xs text-ink-soft dark:text-white/40 mb-6">
                  Verify nearby landmarks and travel convenience.
                </p>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
                    { id: 'transit', label: 'Transit', icon: <TrainFront className="w-3.5 h-3.5" /> },
                    { id: 'medical', label: 'Medical', icon: <Activity className="w-3.5 h-3.5" /> },
                    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag className="w-3.5 h-3.5" /> }
                  ].map((tab) => {
                    const isActive = amenityCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAmenityCategory(tab.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${isActive
                          ? 'bg-gold/10 text-gold-dark dark:text-gold border-gold'
                          : 'bg-black/5 dark:bg-white/5 text-ink-muted dark:text-cream/80 border-transparent hover:bg-black/10 dark:hover:bg-white/10'
                          }`}
                        style={isActive ? { borderColor: '#D4AF37', color: '#D4AF37' } : {}}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Amenity items list */}
                <div className="space-y-3.5">
                  {(() => {
                    const items = generateNearbyAmenities(
                      property?.coordinates?.lat || 19.0178,
                      property?.coordinates?.lng || 72.8173
                    )[amenityCategory] || [];
                    return items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          if (item.coordinates) {
                            setMapCenter([item.coordinates.lat, item.coordinates.lng]);
                            setMapZoom(16);
                          }
                        }}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-gold/5 dark:hover:bg-gold/5 border border-transparent hover:border-gold/20 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex gap-2.5 items-start min-w-0">
                          <div className={`p-1.5 rounded-lg shrink-0 ${amenityCategory === 'education' ? 'bg-emerald-500/10 text-emerald-500' :
                            amenityCategory === 'transit' ? 'bg-blue-500/10 text-blue-500' :
                              amenityCategory === 'medical' ? 'bg-red-500/10 text-red-500' :
                                'bg-amber-500/10 text-amber-500'
                            }`}>
                            {amenityCategory === 'education' ? <GraduationCap className="w-3.5 h-3.5" /> :
                              amenityCategory === 'transit' ? <TrainFront className="w-3.5 h-3.5" /> :
                                amenityCategory === 'medical' ? <Activity className="w-3.5 h-3.5" /> :
                                  <ShoppingBag className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-navy dark:text-white truncate group-hover:text-gold transition-colors">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-ink-soft dark:text-white/40">Landmark</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-gold self-center shrink-0 uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                          {item.distance}
                        </span>
                      </div>
                    ));
                  })()}
                </div>

                <p className="text-[10px] text-ink-soft dark:text-cream/40 leading-relaxed italic border-t border-gray-100 dark:border-white/10 pt-4 mt-4">
                  *Disclaimer: Landmark names and coordinate offsets are estimated approximate metrics calculated from general locality centroids for illustrative planning purposes. Real distances may vary.
                </p>
              </div>

              {/* Reset to property center */}
              <button
                onClick={() => {
                  if (property?.coordinates) {
                    setMapCenter([property.coordinates.lat, property.coordinates.lng]);
                    setMapZoom(14);
                  }
                }}
                className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 text-[10px] font-accent font-black uppercase tracking-widest text-ink-muted dark:text-cream/80 hover:text-gold transition-colors border border-dashed border-gray-200 dark:border-white/10 hover:border-gold/30 rounded-xl"
              >
                <Locate className="w-3.5 h-3.5 text-gold" style={{ color: '#D4AF37' }} /> Recenter on Property
              </button>
            </div>
          </div>
        </div>

        {/* ── Related Properties ── */}
        <div className="mt-20">
          <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-8">{relatedLabel}</h2>
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
