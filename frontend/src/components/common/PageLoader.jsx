import { motion } from 'framer-motion';
import { useSiteSettings, getLogoInitials, renderBrandLogo } from '../../contexts';

export default function PageLoader() {
  const { settings } = useSiteSettings();

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: '#071A2F' }}
    >
      {/* Logo mark */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-5"
      >
        {/* Monogram / Logo Image */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #E8C84A 50%, #A8882B 100%)',
            boxShadow: '0 0 60px rgba(212,175,55,0.3)',
          }}
        >
          {settings?.logoIconImage ? (
            <img src={settings.logoIconImage} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <span className="text-navy font-display font-black text-3xl leading-none tracking-tight">
              {getLogoInitials(settings)}
            </span>
          )}
        </div>


        <div className="text-center">
          <p className="font-display font-bold text-white text-xl tracking-tight">
            {renderBrandLogo(settings, '#D4AF37')}
          </p>
          <p className="text-white/40 text-[9px] font-accent tracking-[0.3em] uppercase mt-1">
            {settings?.logoSubtitle || 'Luxury Real Estate · Pune'}
          </p>
        </div>

        {/* Shimmer bar */}
        <div className="w-48 h-0.5 rounded-full overflow-hidden mt-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #E8C84A, #D4AF37)' }}
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

