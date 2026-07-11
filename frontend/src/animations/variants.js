// HyperRelestix — Central Animation Variant Library
// Used across all pages for consistent, premium motion design

/* ─── Easing ─── */
export const ease = [0.22, 1, 0.36, 1];
export const easeOut = [0, 0, 0.36, 1];
export const spring = { type: 'spring', stiffness: 280, damping: 26 };
export const springFirm = { type: 'spring', stiffness: 380, damping: 28 };

/* ─── Viewport Settings ─── */
export const viewportOnce = { once: true, amount: 0.15 };
export const viewportHalf = { once: true, amount: 0.4 };

/* ─── Fade Variants ─── */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const fadeDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: easeOut } },
};

/* ─── Scale Variants ─── */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease } },
};

/* ─── Stagger Containers ─── */
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

export const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } },
};

/* ─── Text Reveal ─── */
export const textReveal = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  visible: { clipPath: 'inset(0 0% 0 0)', opacity: 1, transition: { duration: 0.85, ease } },
};

export const textSlideUp = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.75, ease } },
};

/* ─── Float Loop (infinite) ─── */
export const floatLoop = {
  animate: { y: [0, -18, 0], transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' } },
};

export const floatLoopSlow = {
  animate: { y: [0, -12, 0], transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' } },
};

export const floatRotate = {
  animate: {
    y: [0, -14, 0],
    rotate: [0, 4, 0, -4, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
};

/* ─── Card Hover ─── */
export const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: '0 2px 24px rgba(0,0,0,0.07)' },
  hover: {
    y: -8,
    scale: 1.01,
    boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

export const pageTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

/* ─── Slide Panels ─── */
export const slideFromRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1, transition: spring },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.25 } },
};

export const slideFromTop = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  exit: { y: -12, opacity: 0, transition: { duration: 0.15 } },
};

export const overlayFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};
