import { useState, useEffect } from 'react';
import { Download, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteSettings, getBrandName } from '../../contexts';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { settings } = useSiteSettings();
  const brandName = getBrandName(settings);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent standard mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Delay showing our premium prompt so the user isn't immediately spammed
      const isDismissed = localStorage.getItem('hr_pwa_dismissed');
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 6000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Also check if app is already installed/running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.info('User accepted the PWA install prompt');
    } else {
      console.info('User dismissed the PWA install prompt');
    }
    
    // Clear deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('hr_pwa_dismissed', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md z-50 p-5 rounded-3xl border shadow-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(7, 26, 47, 0.85)',
            borderColor: 'rgba(212, 175, 55, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.1)'
          }}
        >
          <div className="flex gap-4 items-start">
            {/* Symmetrical glowing icon container */}
            <div className="p-3 bg-gold/10 rounded-2xl text-gold border border-gold/15 shrink-0 animate-pulse" style={{ color: '#D4AF37' }}>
              <Download className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[9px] font-accent font-bold uppercase tracking-widest text-gold flex items-center gap-1" style={{ color: '#D4AF37' }}>
                  <Sparkles className="w-2.5 h-2.5" /> PWA Experience
                </span>
              </div>
              <h4 className="text-sm font-display font-black text-white mb-1.5 leading-snug">
                Install {brandName} Mobile
              </h4>
              <p className="text-white/60 text-[11px] leading-relaxed mb-4">
                Access verified luxury Pune properties instantly from your home screen. Uses zero storage, works offline.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleInstall}
                  className="px-4 py-2 bg-gold hover:bg-gold-light text-[#071A2F] text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-95 shadow-md flex items-center gap-1.5"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3.5 py-2 text-white/50 hover:text-white text-xs font-semibold transition-colors duration-300"
                >
                  Not Now
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-white/40 hover:text-white shrink-0 p-1 hover:bg-white/5 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
