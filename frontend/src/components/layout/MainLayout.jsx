import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from '../common/AuthModal';
import SearchModal from '../common/SearchModal';
import ScrollProgress from '../common/ScrollProgress';
import AIChatbot from '../common/AIChatbot';
import { useAuth, useSearch } from '../../contexts';
import { pageTransition } from '../../animations/variants';
import GoldCursorTrail from '../common/GoldCursorTrail';

const MainLayout = () => {
  const { showAuthModal } = useAuth();
  const { showSearch } = useSearch();
  const location = useLocation();
  const lenisRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ── Lenis smooth scroll initialisation ──
  useEffect(() => {
    let lenis = null;
    let rafId = null;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const initLenis = async () => {
      try {
        const { default: Lenis } = await import('@studio-freight/lenis');
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2,
        });
        lenisRef.current = lenis;
        window.lenis = lenis;

        // If modal was already opened during lazy load, stop lenis immediately
        if (document.body.style.overflow === 'hidden') {
          lenis.stop();
        }

        const raf = (time) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // Lenis not available, fall back gracefully
      }
    };

    initLenis();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        window.lenis = null;
      }
      // Force clean up scroll locks and Lenis side-effect styles
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('lenis');
      document.documentElement.classList.remove('lenis-smooth');
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, []);

  // ── Lock scroll when modals open ──
  useEffect(() => {
    const locked = showAuthModal || showSearch;
    document.body.style.overflow = locked ? 'hidden' : '';
    if (locked && lenisRef.current) lenisRef.current.stop();
    else if (!locked && lenisRef.current) lenisRef.current.start();
    return () => { document.body.style.overflow = ''; };
  }, [showAuthModal, showSearch]);

  // ── Scroll to top on route change ──
  useEffect(() => {
    // Reset immediately
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // Reset again after transition exit completes (100ms) to ensure new content starts at top
    const timer = setTimeout(() => {
      if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <GoldCursorTrail />
      <ScrollProgress />
      <Navbar />

      <main className="flex-1">
        {isMobile ? (
          <div>
            <Outlet />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={pageTransition.initial}
              animate={pageTransition.animate}
              exit={pageTransition.exit}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      <Footer />
      <AIChatbot />
      {showAuthModal && <AuthModal />}
      {showSearch && <SearchModal />}
    </div>
  );
};

export default MainLayout;
