import { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import SectionHeader from '../../../components/common/SectionHeader';
import { cities } from '../../../data/index';
import ErrorBoundary from '../../../components/common/ErrorBoundary';

const InteractiveGlobe = lazy(() => import('../../../components/common/InteractiveGlobe'));

export default function ExploreCities({ counts = {} }) {
  const [activeCity, setActiveCity] = useState('Balewadi');
  const [expanded, setExpanded] = useState(false);

  const main8Names = ['KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Balewadi'];

  // Split and order cities
  const main8 = cities.filter(c => main8Names.includes(c.name));
  const otherCities = cities.filter(c => !main8Names.includes(c.name));
  main8.sort((a, b) => main8Names.indexOf(a.name) - main8Names.indexOf(b.name));

  const displayedCities = expanded ? [...main8, ...otherCities] : main8;

  // Auto expand if city selected on globe is not in main 8
  useEffect(() => {
    if (!main8Names.includes(activeCity)) {
      setExpanded(true);
    }
  }, [activeCity]);

  const activeCityData = cities.find((c) => c.name === activeCity) || cities[0];

  return (
    <section className="section-pad bg-white dark:bg-navy-dark relative overflow-hidden transition-colors duration-300">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />

      <div className="container-luxury relative">
        <SectionHeader
          label="Explore by Locality"
          title={<>Pune's Most Coveted <span style={{ color: '#D4AF37' }}>Luxury Localities</span></>}
          align="center"
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column — 3D Globe */}
          <div className="hidden md:block lg:col-span-7">
            <ErrorBoundary widget>
              <Suspense fallback={
                <div className="relative w-full h-[450px] flex flex-col items-center justify-center bg-transparent gap-3">
                  <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }} />
                  <p className="text-xs font-semibold tracking-widest uppercase text-gold" style={{ color: '#D4AF37' }}>Loading 3D Earth...</p>
                </div>
              }>
                <InteractiveGlobe onSelectCity={setActiveCity} activeCity={activeCity} />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Right Column — City Tabs & Preview Card */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Symmetrical Grid of Localities (Compact) */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
                {displayedCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setActiveCity(city.name)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-center border truncate transition-all duration-300 ${activeCity === city.name
                        ? 'border-gold bg-gold/10 text-gold shadow-[0_3px_10px_rgba(212,175,55,0.12)]'
                        : 'border-gray-100 dark:border-white/10 bg-transparent text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    style={activeCity === city.name ? { color: '#D4AF37', borderColor: '#D4AF37' } : {}}
                  >
                    {city.name}
                  </button>
                ))}
              </div>

              {/* Show More / Show Less Toggle under the tabs grid (Centered & Compact) */}
              <div className="pt-1 flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/15" />
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[9px] font-bold tracking-wider uppercase border border-gold/20 hover:border-gold hover:bg-gold/5 text-gold transition-all duration-300 shrink-0"
                  style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.25)' }}
                >
                  <span>{expanded ? 'Show Less Localities' : 'Show All Localities'}</span>
                  <span className="text-[10px] leading-none">{expanded ? '▴' : '▾'}</span>
                </button>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/15" />
              </div>

              {/* Active City Preview Card */}
              <motion.div
                key={activeCity}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-3xl shadow-luxury"
                style={{ height: '300px', border: '1px solid rgba(7,26,47,0.07)' }}
              >
                <img
                  src={activeCityData.image}
                  alt={activeCityData.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.92) 0%, rgba(7,26,47,0.3) 55%, transparent 100%)' }}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <span className="text-[10px] font-accent font-bold tracking-[0.22em] uppercase mb-1.5" style={{ color: '#D4AF37' }}>
                    {activeCityData.tag}
                  </span>
                  <h3 className="font-display font-black text-white text-2xl leading-tight">{activeCityData.name}</h3>
                  <div className="flex items-center justify-between mt-3 pt-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <p className="text-white/70 text-sm font-semibold">
                      {counts[activeCityData.name] ?? 0}{' '}
                      {(counts[activeCityData.name] ?? 0) === 1 ? 'Verified Property' : 'Verified Properties'}
                    </p>
                    <Link
                      to={`/properties?city=${activeCityData.name}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-navy text-xs font-bold transition-transform group-hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                    >
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
