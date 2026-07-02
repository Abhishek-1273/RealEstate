import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown, MapPin } from 'lucide-react';
import PropertyCard from '../../components/common/PropertyCard';
import { properties } from '../../data/properties';
import { fadeUp, staggerContainer } from '../../animations/variants';

const TYPES = ['All', 'Villa', 'Apartment', 'Penthouse', 'Farm House'];
const CITIES = ['All', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune', 'Goa'];
const BUDGETS = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under ₹2 Cr', min: 0, max: 20000000 },
  { label: '₹2–5 Cr', min: 20000000, max: 50000000 },
  { label: '₹5–10 Cr', min: 50000000, max: 100000000 },
  { label: '₹10 Cr+', min: 100000000, max: Infinity },
];
const SORTBY = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Area: Large to Small'];

export default function Properties() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [city, setCity] = useState('All');
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [sort, setSort] = useState('Newest');
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = properties.filter(p => {
      const q = query.toLowerCase();
      if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      if (type !== 'All' && p.type !== type) return false;
      if (city !== 'All' && p.city !== city) return false;
      if (p.price < budget.min || p.price > budget.max) return false;
      return true;
    });
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'Area: Large to Small') list = [...list].sort((a, b) => b.area - a.area);
    return list;
  }, [query, type, city, budget, sort]);

  const clearFilters = () => { setQuery(''); setType('All'); setCity('All'); setBudget(BUDGETS[0]); setSort('Newest'); };
  const hasFilters = query || type !== 'All' || city !== 'All' || budget.label !== 'Any';

  return (
    <div className="min-h-screen bg-surface pt-20">

      {/* ── Page Header ── */}
      <div className="bg-mesh-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(212,175,55,0.07) 0%, transparent 55%)' }} />
        <div className="container-luxury relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Our Listings</span>
            </div>
            <h1 className="font-display font-black text-white leading-tight mb-3"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Luxury Properties <span style={{ color: '#D4AF37' }}>in India</span>
            </h1>
            <p className="text-white/55 max-w-lg leading-relaxed">
              Handpicked from India's finest enclaves — every listing personally verified by our luxury advisors.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="sticky top-[74px] z-30 bg-white/95 backdrop-blur-xl"
        style={{ borderBottom: '1px solid rgba(7,26,47,0.07)', boxShadow: '0 4px 20px rgba(7,26,47,0.04)' }}>
        <div className="container-luxury py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or locality..."
                className="w-full pl-11 pr-4 h-[44px] rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
              />
            </div>

            {/* Type filter */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar md:items-center">
              {TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className="px-4 h-[44px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-250 shrink-0 flex items-center justify-center"
                  style={{
                    background: type === t ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'rgba(7,26,47,0.04)',
                    color: type === t ? '#071A2F' : '#52525B',
                    boxShadow: type === t ? '0 3px 12px rgba(212,175,55,0.3)' : 'none',
                  }}>
                  {t}
                </button>
              ))}
            </div>

            {/* More filters toggle */}
            <button
              onClick={() => setFiltersOpen(v => !v)}
              className="flex items-center justify-center gap-2 px-4 h-[44px] rounded-xl text-sm font-semibold shrink-0 transition-all duration-200"
              style={{ background: filtersOpen ? 'rgba(212,175,55,0.1)' : 'rgba(7,26,47,0.04)', color: filtersOpen ? '#8A6A18' : '#52525B', border: filtersOpen ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent' }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-gold ml-0.5" />}
            </button>

            {/* Sort */}
            <div className="relative shrink-0 flex items-center">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="appearance-none pl-4 pr-9 h-[44px] rounded-xl text-xs font-semibold border border-gray-200 focus:outline-none focus:border-gold cursor-pointer bg-white flex items-center justify-center"
                style={{ lineHeght: 'normal' }}
              >
                {SORTBY.map(s => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-soft pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex gap-1 p-1 h-[44px] items-center rounded-xl shrink-0" style={{ background: 'rgba(7,26,47,0.04)' }}>
              {[['grid', <Grid3X3 className="w-4 h-4" />], ['list', <List className="w-4 h-4" />]].map(([v, icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className="p-2 rounded-lg transition-all duration-200 h-8 flex items-center justify-center"
                  style={{ background: view === v ? 'white' : 'transparent', color: view === v ? '#071A2F' : '#71717A', boxShadow: view === v ? '0 1px 4px rgba(7,26,47,0.08)' : 'none' }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4">
                <div className="flex flex-wrap gap-3">
                  {/* City */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs font-bold text-navy self-center mr-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" style={{ color: '#D4AF37' }} /> City:
                    </span>
                    {CITIES.map(c => (
                      <button key={c} onClick={() => setCity(c)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                        style={{ background: city === c ? 'rgba(212,175,55,0.12)' : 'rgba(7,26,47,0.04)', color: city === c ? '#8A6A18' : '#52525B', border: city === c ? '1.5px solid #D4AF37' : '1px solid transparent' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                  {/* Budget */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs font-bold text-navy self-center mr-1">₹ Budget:</span>
                    {BUDGETS.map(b => (
                      <button key={b.label} onClick={() => setBudget(b)}
                        className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                        style={{ background: budget.label === b.label ? 'rgba(212,175,55,0.12)' : 'rgba(7,26,47,0.04)', color: budget.label === b.label ? '#8A6A18' : '#52525B', border: budget.label === b.label ? '1.5px solid #D4AF37' : '1px solid transparent' }}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                  {hasFilters && (
                    <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 transition-all hover:bg-red-100 ml-auto">
                      <X className="w-3 h-3" /> Clear Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container-luxury py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-ink-muted text-sm">
            Showing <span className="font-bold text-navy">{filtered.length}</span> of {properties.length} luxury properties
          </p>
        </div>

        {filtered.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'
              : 'flex flex-col gap-5'}
          >
            {filtered.map(p => (
              <motion.div key={p.id} variants={fadeUp}>
                <PropertyCard property={p} view={view} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-24">
            <div className="text-6xl mb-6">🏠</div>
            <h3 className="font-display font-bold text-navy text-2xl mb-3">No properties found</h3>
            <p className="text-ink-muted mb-6">Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
