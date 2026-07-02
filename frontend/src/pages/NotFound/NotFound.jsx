import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mesh-dark flex items-center justify-center px-5 pt-20">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated 404 */}
          <div className="relative mb-8">
            <p
              className="font-display font-black leading-none select-none"
              style={{
                fontSize: 'clamp(8rem, 20vw, 14rem)',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              404
            </p>
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ fontSize: 'clamp(8rem, 20vw, 14rem)' }}
            >
              <motion.span
                className="font-display font-black leading-none"
                style={{
                  fontSize: '1em',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #E8C84A 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundSize: '200%',
                }}
                animate={{ backgroundPosition: ['0% center', '200% center', '0% center'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                404
              </motion.span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>
              Page Not Found
            </span>
            <span className="h-px w-8" style={{ background: 'linear-gradient(270deg, transparent, #D4AF37)' }} />
          </div>

          <h1 className="font-display font-black text-white text-2xl md:text-3xl mb-4 leading-snug">
            This address doesn't exist in our portfolio
          </h1>
          <p className="text-white/50 mb-10 leading-relaxed max-w-sm mx-auto">
            But Pune's finest luxury properties do. Let us help you find your dream home at the right address.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="btn-primary">
              <Home className="w-4 h-4" /> Go to Homepage
            </Link>
            <Link to="/properties" className="btn-outline-light">
              <Search className="w-4 h-4" /> Browse Properties
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
