import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Calendar, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingCTA() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-7 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {expanded && (
          <>
            {/* Book a Visit */}
            <motion.button
              initial={{ opacity: 0, scale: 0.7, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { setExpanded(false); navigate('/contact'); }}
              className="flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full text-navy font-semibold text-sm shadow-gold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,175,55,0.45)]"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
            >
              <Calendar className="w-4 h-4" />
              Book a Site Visit
            </motion.button>

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20HyperRelestix%20luxury%20properties%20in%20Pune."
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.7, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 16 }}
              transition={{ duration: 0.2, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: '#25D366', boxShadow: '0 6px 24px rgba(37,211,102,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 32px rgba(37,211,102,0.55)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.4)'}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setExpanded((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-navy transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #E8C84A)',
          boxShadow: expanded
            ? '0 0 0 0 rgba(212,175,55,0)'
            : '0 8px 28px rgba(212,175,55,0.5)',
        }}
        aria-label={expanded ? 'Close menu' : 'Contact options'}
      >
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {expanded ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </motion.div>
      </motion.button>
    </div>
  );
}
