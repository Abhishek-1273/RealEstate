import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
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
  const wished = isWishlisted(property.id);
  const navigate = useNavigate();

  const fallback = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80';

  if (view === 'list') {
    return (
      <div 
        onClick={() => navigate(`/properties/${property.id}`)}
        className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row md:h-[260px] group cursor-pointer relative"
      >
        {/* ── Image Column ── */}
        <div className="relative overflow-hidden w-full md:w-[320px] shrink-0 h-[240px] md:h-full">
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
            <span className={`absolute top-4 left-4 text-[9px] font-accent font-black px-3 py-1.5 rounded-full tracking-wider z-[3] ${badgeStyles[property.badgeColor] || badgeStyles.gold}`}>
              {property.badge}
            </span>
          )}
        </div>

        {/* ── Content Column ── */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-2.5">
              <div className="space-y-1">
                <span className="badge-gold text-[9px] uppercase font-bold tracking-wider inline-block">{property.type}</span>
                <h3 className="font-display font-bold text-navy text-lg md:text-xl leading-snug group-hover:text-gold transition-colors duration-250">
                  {property.title}
                </h3>
              </div>

              <div className="md:text-right shrink-0">
                <p className="font-display font-black text-navy text-xl md:text-2xl leading-none" style={{ color: '#071A2F' }}>
                  {property.priceLabel}
                </p>
                <p className="text-ink-muted text-[10px] mt-1 font-body">
                  ₹{Math.round(property.price / property.area).toLocaleString()}/sqft
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-ink-muted text-xs mb-3.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-gold" style={{ color: '#D4AF37' }} />
              <span className="truncate">{property.location}</span>
            </div>

            <p className="text-ink-soft text-xs line-clamp-2 mb-4 leading-relaxed max-w-2xl">
              {property.description || "An architectural masterpiece nestled in a highly coveted enclave, offering bespoke interiors, ultra-exclusive amenities, and sweeping views of the city skyline."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-5 text-ink-muted text-xs">
              {[
                { icon: <Bed className="w-3.5 h-3.5 text-gold/80" />, val: `${property.bedrooms} Beds` },
                { icon: <Bath className="w-3.5 h-3.5 text-gold/80" />, val: `${property.bathrooms} Baths` },
                { icon: <Square className="w-3.5 h-3.5 text-gold/80" />, val: `${property.area.toLocaleString()} sqft` },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {s.icon}
                  <span className="font-semibold text-navy/80">{s.val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!user) {
                    openAuth();
                    return;
                  }
                  toggleWishlist(property);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-250 ${
                  wished
                    ? 'bg-red-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.4)]'
                    : 'bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${wished ? 'fill-current animate-pulse' : ''}`} />
              </button>

              <span
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all duration-300 group-hover:bg-navy/90"
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
      className="bg-white rounded-3xl overflow-hidden shadow-card card-shine glow-border group cursor-pointer relative"
      style={{ willChange: 'transform' }}
    >
      <div onClick={() => navigate(`/properties/${property.id}`)} className="rounded-3xl overflow-hidden">
        {/* ── Image ── */}
        <div className="relative overflow-hidden rounded-t-3xl" style={{ height: '260px' }}>
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
              ₹{Math.round(property.price / property.area).toLocaleString()}/sqft
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
        <div className="p-5 relative z-[3] bg-white rounded-b-3xl">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-bold text-navy text-base leading-snug group-hover:text-gold-muted transition-colors duration-250 line-clamp-1">
              {property.title}
            </h3>
            <span className="badge-gold shrink-0">{property.type}</span>
          </div>

          <div className="flex items-center gap-1.5 text-ink-muted text-xs mb-4">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D4AF37' }} />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex items-center justify-between text-ink-muted text-xs pt-4 border-t border-gray-100">
            {[
              { icon: <Bed className="w-3.5 h-3.5" />, val: `${property.bedrooms} Beds` },
              { icon: <Bath className="w-3.5 h-3.5" />, val: `${property.bathrooms} Baths` },
              { icon: <Square className="w-3.5 h-3.5" />, val: `${property.area.toLocaleString()} sqft` },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-y-[-2px]">
                {s.icon}
                <span>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tilt>
  );
}
