import { useScroll, useSpring, useTransform, motion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Fade out progress bar when at the very top of the page
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, opacity, width: '100%' }}
    />
  );
}
