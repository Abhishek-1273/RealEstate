import { motion } from 'framer-motion';
import CountUpNumber from '../../../components/common/CountUpNumber';
import { useSiteSettings } from '../../../contexts/SettingsContext';
import { scaleIn, staggerFast, viewportOnce } from '../../../animations/variants';

export default function StatsStrip() {
  const { settings } = useSiteSettings();
  
  const dynamicStats = [
    { label: 'Premium Properties sold', value: settings?.stats?.propertiesSold ?? 1500, suffix: '+' },
    { label: 'Average Client Satisfaction', value: settings?.stats?.happyClients ?? 98, suffix: '%' },
    { label: 'Years of Pune Market Expertise', value: settings?.stats?.experience ?? 12, suffix: '+' },
    { label: 'Total Deals Closed Successfully', value: settings?.stats?.dealsClosed ?? 350, suffix: '+' },
  ];

  return (
    <section className="py-24 bg-mesh-dark relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
      <div className="container-luxury relative">
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {dynamicStats.map((s, i) => (
            <motion.div key={i} variants={scaleIn} className="text-center">
              <p className="font-display font-black text-white leading-none mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem]">
                <CountUpNumber end={s.value} duration={2.5} />
                <span style={{ color: '#D4AF37' }}>{s.suffix}</span>
              </p>
              <p className="text-white/50 text-sm font-body tracking-wide">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
