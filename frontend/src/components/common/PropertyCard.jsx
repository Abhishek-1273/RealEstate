import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bed, Bath, Square, MapPin, ArrowRight, Car, ShieldCheck } from 'lucide-react';
import { useWishlist, useAuth } from '../../contexts';
import Tilt from './Tilt';

const badgeStyles = {
  gold: 'bg-gold text-navy',
  green: 'bg-emerald-500 text-white',
  red: 'bg-red-500 text-white',
  blue: 'bg-sky-500 text-white',
};

export default function PropertyCard({ property, view = 'grid' }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, openAuth } = useAuth();
  const [imgErr, setImgErr] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const wished = isWishlisted(property._id || property.id);
  const navigate = useNavigate();

  const fallback = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80';

  if (view === 'list') {
    return (
      <div 
        onClick={() => navigate(`/properties/${property._id || property.id}`)}
        className="bg-white dark:bg-navy-light rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-white/20 flex flex-row h-[170px] md:h-[260px] group cursor-pointer relative"
      >
        {/* ── Image Column ── */}
        <div className="relative overflow-hidden w-[140px] md:w-[320px] shrink-0 h-full">
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          <img
            src={imgErr ? fallback : property.image}
            onError={() => setImgErr(true)}
            onLoad={() => setImgLoaded(true)}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s, transform 0.7s' }}
          />

          <div className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.4) 0%, transparent 100%)' }}
          />

          {property.badge && (
            <span className="absolute top-2 left-2 md:top-4 md:left-4 text-[7px] md:text-[9px] font-accent font-black px-2 py-1 md:px-3 md:py-1.5 rounded-full tracking-wider z-[3] bg-gold text-navy">
              {property.badge}
            </span>
          )}
        </div>

        {/* ── Content Column ── */}
        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-1 md:gap-3 mb-1 md:mb-2.5">
              <div className="space-y-0.5 md:space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="badge-gold text-[8px] md:text-[9px] uppercase font-bold tracking-wider inline-block">{property.type}</span>
                  {property.status && (
                    <span className="text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {property.status}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-navy dark:text-white text-xs sm:text-sm md:text-xl leading-snug group-hover:text-gold transition-colors duration-250 truncate md:whitespace-normal">
                  {property.title}
                </h3>
              </div>

              <div className="md:text-right shrink-0 flex items-baseline md:block gap-1 mt-0.5 md:mt-0">
                <p className="font-display font-black text-navy dark:text-gold-light text-sm md:text-2xl leading-none">
                  {property.priceLabel}
                </p>
                <p className="text-ink-muted dark:text-white/60 text-[8px] md:text-[10px] mt-0.5 font-body">
                  {property.area > 0 ? `₹${Math.round(property.price / property.area).toLocaleString()}/sqft` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-ink-muted dark:text-cream/80 text-[10px] md:text-xs mb-1.5 md:mb-2.5">
              <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 text-gold" style={{ color: '#D4AF37' }} />
              <span className="truncate">{property.location}</span>
            </div>

            {/* Extra Info Pills */}
            <div className="hidden md:flex flex-wrap items-center gap-1.5 mb-3">
              {property.furnishing && (
                <span className="text-[9.5px] px-2 py-0.5 rounded-md font-semibold bg-gold/10 text-gold-dark dark:text-gold border border-gold/20">
                  🛋️ {property.furnishing}
                </span>
              )}
              {property.parking > 0 && (
                <span className="text-[9.5px] px-2 py-0.5 rounded-md font-semibold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/70 border border-gray-150 dark:border-white/10 flex items-center gap-1">
                  <Car className="w-3 h-3 text-gold" style={{ color: '#D4AF37' }} /> {property.parking} Parking
                </span>
              )}
              {property.rera && (
                <span className="text-[9.5px] px-2 py-0.5 rounded-md font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-500" /> RERA Verified
                </span>
              )}
            </div>

            <p className="text-ink-soft dark:text-white/50 text-[10px] md:text-xs line-clamp-2 mb-4 leading-relaxed max-w-2xl hidden md:block">
              {property.description || "An architectural masterpiece nestled in a highly coveted enclave, offering bespoke interiors, ultra-exclusive amenities, and sweeping views of the city skyline."}
            </p>
          </div>

          <div className="flex flex-row items-center justify-between gap-4 pt-2.5 border-t border-gray-100 dark:border-white/10 mt-auto">
            <div className="flex items-center gap-2.5 md:gap-5 text-ink-muted dark:text-white/60 text-[9px] md:text-xs">
              {[
                { icon: <Bed className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/80" />, val: `${property.bedrooms} Beds` },
                { icon: <Bath className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/80" />, val: `${property.bathrooms} Baths` },
                { icon: <Square className="w-3 h-3 md:w-3.5 md:h-3.5 text-gold/80" />, val: `${property.area.toLocaleString()} sqft` },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  {s.icon}
                  <span className="font-semibold text-navy/80 dark:text-cream/90">
                    {s.val.split(' ')[0]}
                    <span className="hidden sm:inline"> {s.val.split(' ')[1]}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <button
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!user) {
                    openAuth();
                    return;
                  }
                  toggleWishlist(property);
                }}
                className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-250 ${
                  wished
                    ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.4)]'
                    : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 ${wished ? 'fill-current animate-pulse' : ''}`} />
              </button>

              <span
                className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all duration-300 group-hover:bg-navy/90"
                style={{ background: '#071A2F' }}
              >
                View Details <ArrowRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform" style={{ color: '#D4AF37' }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tilt
      className="bg-white dark:bg-navy-light rounded-3xl overflow-hidden shadow-card card-shine glow-border dark:border-white/20 group cursor-pointer relative"
      style={{ willChange: 'transform' }}
    >
      <div onClick={() => navigate(`/properties/${property._id || property.id}`)} className="rounded-3xl overflow-hidden">
        {/* ── Image ── */}
        <div className="relative overflow-hidden rounded-t-3xl aspect-square w-full">
          {/* Skeleton loader */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}
          <img
            src={imgErr ? fallback : property.image}
            onError={() => setImgErr(true)}
            onLoad={() => setImgLoaded(true)}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s, transform 0.7s' }}
          />

          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 z-[1]"
            style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.7) 0%, rgba(7,26,47,0.1) 50%, transparent 100%)' }}
          />

          {/* Hover glass overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 z-[2]"
            style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.85) 0%, rgba(7,26,47,0.2) 60%, transparent 100%)' }}
          />

          {/* Badge */}
          {property.badge && (
            <span className={`absolute top-4 left-4 text-[9px] font-accent font-black px-3 py-1.5 rounded-full tracking-wider z-[3] ${badgeStyles[property.badgeColor] || badgeStyles.gold}`}>
              {property.badge}
            </span>
          )}

          {/* Wishlist */}
          <button
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                openAuth();
                return;
              }
              toggleWishlist(property);
            }}
            className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-250 z-[3] ${wished
                ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.4)]'
                : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white backdrop-blur-sm'
              }`}
          >
            <motion.div
              animate={{ scale: wished ? [1, 1.35, 1] : 1 }}
              transition={{ duration: 0.35 }}
            >
              <Heart className={`w-4 h-4 ${wished ? 'fill-current' : ''}`} />
            </motion.div>
          </button>

          {/* Price */}
          <div className="absolute bottom-4 left-4 z-[3]">
            <p className="font-display font-black text-white text-xl leading-none">{property.priceLabel}</p>
            <p className="text-white/60 text-[10px] mt-0.5 font-body">
              {property.area > 0 ? `₹${Math.round(property.price / property.area).toLocaleString()}/sqft` : ''}
            </p>
          </div>

          {/* View Details — appears on hover */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-[3]">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-navy text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
            >
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-5 relative z-[3] bg-white dark:bg-navy-light rounded-b-3xl transition-colors duration-300">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-bold text-navy dark:text-white text-base leading-snug group-hover:text-gold-muted transition-colors duration-250 line-clamp-1">
              {property.title}
            </h3>
            <span className="badge-gold shrink-0 text-[10px]">{property.type}</span>
          </div>

          <div className="flex items-center justify-between gap-2 text-ink-muted dark:text-cream/80 text-xs mb-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D4AF37' }} />
              <span className="truncate">{property.location}</span>
            </div>
            {property.status && (
              <span className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {property.status}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-ink-muted dark:text-white/60 text-[11px] md:text-xs pt-3.5 border-t border-gray-100 dark:border-white/20 gap-1">
            {[
              { icon: <Bed className="w-3.5 h-3.5" />, val: `${property.bedrooms} Beds` },
              { icon: <Bath className="w-3.5 h-3.5" />, val: `${property.bathrooms} Baths` },
              { icon: <Square className="w-3.5 h-3.5" />, val: `${property.area ? property.area.toLocaleString() : 0} sqft` },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1 transition-transform duration-300 group-hover:translate-y-[-2px]">
                {s.icon}
                <span className="whitespace-nowrap">{s.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Tilt>
  );
}

