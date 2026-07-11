import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Reset standard window scroll
    window.scrollTo(0, 0);

    // 2. Reset Lenis scroll if active
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    // 3. Reset scroll on scrollable main containers (like Admin Panel main)
    const scrollContainers = document.querySelectorAll('main, .overflow-y-auto');
    scrollContainers.forEach(container => {
      container.scrollTop = 0;
    });

    // 4. Fallback tick for asynchronous page mounts
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: true });
      }
      const containers = document.querySelectorAll('main, .overflow-y-auto');
      containers.forEach(container => {
        container.scrollTop = 0;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
