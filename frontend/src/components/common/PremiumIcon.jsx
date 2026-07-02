import React from 'react';

/**
 * PremiumIcon Component
 * Wraps Lucide or other icons with high-end, production-grade styling.
 * Supports various container shapes, premium color themes, hover animations, and glow effects.
 */
export default function PremiumIcon({
  icon: IconComponent,
  variant = 'gold', // 'gold' | 'navy' | 'glass-light' | 'glass-dark' | 'accent' | 'emerald' | 'purple'
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  iconClassName = '',
  animate = true,
  ...props
}) {
  if (!IconComponent) return null;

  // Size mappings for container
  const containerSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-11 h-11 rounded-xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-16 h-16 rounded-[1.5rem]',
  };

  // Size mappings for icons
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-11 h-11',
  };

  // Variant/Theme mappings (combining gradients, borders, background, text, shadow & hovers)
  const variantClasses = {
    gold: 'bg-gold/10 border border-gold/25 text-gold hover:bg-gold/20 hover:border-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.35)]',
    navy: 'bg-navy/85 border border-navy-light text-gold hover:bg-navy hover:text-white hover:border-gold/30 hover:shadow-[0_0_15px_rgba(14,43,74,0.35)]',
    'glass-light': 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]',
    'glass-dark': 'bg-navy-dark/70 border border-white/10 text-gold hover:bg-navy-dark/95 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]',
    accent: 'bg-cream border border-gold/15 text-navy hover:text-gold hover:border-gold/45 hover:shadow-card-hover',
    emerald: 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    purple: 'bg-purple-500/10 border border-purple-500/25 text-purple-500 hover:bg-purple-500/20 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  };

  const animationClasses = animate
    ? 'transition-all duration-300 ease-out transform hover:-translate-y-0.5'
    : 'transition-colors duration-200';

  // Render check: if IconComponent is already an element (e.g. <Shield />) vs a component class (e.g. Shield)
  const isElement = React.isValidElement(IconComponent);

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${containerSizes[size]} ${variantClasses[variant]} ${animationClasses} ${className}`}
      {...props}
    >
      {isElement ? (
        React.cloneElement(IconComponent, {
          className: `${iconSizes[size]} stroke-[1.5] ${iconClassName}`,
        })
      ) : (
        <IconComponent className={`${iconSizes[size]} stroke-[1.5] ${iconClassName}`} />
      )}
    </div>
  );
}
