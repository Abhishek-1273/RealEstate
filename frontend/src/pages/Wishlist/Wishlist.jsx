import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../../contexts';
import PropertyCard from '../../components/common/PropertyCard';
import { fadeUp, staggerContainer } from '../../animations/variants';

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-mesh-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.07) 0%, transparent 55%)' }} />
        <div className="container-luxury relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>
                Saved Properties
              </span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display font-black text-white leading-tight"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  Your <span style={{ color: '#D4AF37' }}>Wishlist</span>
                </h1>
                <p className="text-white/55 mt-2">
                  {wishlist.length} {wishlist.length === 1 ? 'property' : 'properties'} saved
                </p>
              </div>
              {wishlist.length > 0 && (
                <button onClick={clearWishlist}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 border border-red-500/20 dark:border-red-500/30">
                  <Trash2 className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-luxury py-16">
        {wishlist.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {wishlist.map(p => (
              <motion.div key={p._id || p.id} variants={fadeUp}>
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-24">
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex mb-8"
            >
              <Heart className="w-20 h-20" style={{ color: '#D4AF37', fill: 'rgba(212,175,55,0.15)' }} />
            </motion.div>
            <h2 className="font-display font-bold text-navy dark:text-white text-3xl mb-3">Your wishlist is empty</h2>
            <p className="text-ink-muted dark:text-white/55 text-base max-w-sm mx-auto leading-relaxed mb-8">
              Browse our curated Pune luxury properties and save your favourites by clicking the heart icon.
            </p>
            <Link to="/properties" className="btn-primary">
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
