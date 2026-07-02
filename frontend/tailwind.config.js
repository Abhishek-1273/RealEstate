/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#071A2F',
          light: '#0E2B4A',
          muted: '#16314f',
          dark: '#030E1B',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C84A',
          dark: '#A8882B',
          muted: '#8A6A18',
          text: '#8A6A18',
        },
        cream: '#FAFAFA',
        surface: '#F5F5F4',
        'surface-alt': '#F4F0EA',
        ink: {
          DEFAULT: '#1A1A2E',
          muted: '#52525B',
          soft: '#71717A',
        },
        royal: {
          DEFAULT: '#1E3A8A',
          light: '#2D4EAF',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        accent: ['Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)',
        'luxury-deep': '0 48px 120px rgba(0,0,0,0.25), 0 16px 48px rgba(0,0,0,0.12)',
        gold: '0 8px 32px rgba(212,175,55,0.38)',
        'gold-glow': '0 0 60px rgba(212,175,55,0.2), 0 0 20px rgba(212,175,55,0.12)',
        card: '0 2px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 24px 64px rgba(0,0,0,0.14)',
        glass: '0 8px 32px rgba(7,26,47,0.12)',
        'glass-card': '0 4px 24px rgba(7,26,47,0.08)',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'scroll': 'scroll 38s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'bounce-slow': 'bounce 2.5s infinite',
        'fade-in': 'fade-in 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'gradient-x': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-gold': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%': { boxShadow: '0 0 0 14px rgba(212,175,55,0)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundSize: {
        '200%': '200% auto',
        '300%': '300% 300%',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22,1,0.36,1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        800: '800ms',
      },
    },
  },
  plugins: [],
}
