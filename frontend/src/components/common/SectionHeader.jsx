import { motion } from 'framer-motion';

export default function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  light = false,
  className = '',
}) {
  const center = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`${center ? 'text-center' : ''} ${className}`}
    >
      {label && (
        <div className={`flex items-center gap-2.5 mb-4 ${center ? 'justify-center' : ''}`}>
          <span
            className="block h-px w-7 rounded-full"
            style={{ background: 'linear-gradient(90deg, #D4AF37, transparent)' }}
          />
          <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase"
            style={{ color: '#D4AF37' }}>
            {label}
          </span>
          {center && (
            <span
              className="block h-px w-7 rounded-full"
              style={{ background: 'linear-gradient(270deg, #D4AF37, transparent)' }}
            />
          )}
        </div>
      )}

      {title && (
        <div
          className={`font-display font-bold leading-[1.1] mb-5 ${
            light ? 'text-white' : 'text-navy dark:text-white'
          }`}
          style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
        >
          {title}
        </div>
      )}

      {description && (
        <p
          className={`font-body text-base leading-[1.9] ${
            center ? 'mx-auto max-w-2xl' : 'max-w-xl'
          } ${light ? 'text-white/65' : 'text-ink-muted dark:text-white/60'}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
