import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Search, Grid3X3, List, ChevronDown, MapPin, Loader2, ArrowUpDown } from 'lucide-react';
import PropertyCard from '../../components/common/PropertyCard';
import { properties as staticProperties } from '../../data/properties';
import { fetchProperties } from '../../utils/api';
import { fadeUp, staggerContainer } from '../../animations/variants';

const TYPES = ['All', 'Villa', 'Apartment', 'Penthouse', 'Farm House', 'Commercial', 'Plot'];
const CITIES = [
  'All',
  'Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi',
  'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner',
  'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road',
  'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate',
  'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav',
  'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi',
  'Handewadi', 'Wakad', 'Shivaji Nagar', 'Parvati Hill', 'Sukhsagar Nagar',
  'Singhgad Road', 'Camp', 'Pimpri Gaon', 'Chinchwad Gaon', 'Bhosari',
  'Nigdi', 'Bhugaon', 'Man', 'Sus', 'Malwadi', 'Warje', 'Fursungi',
  'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City'
];
const BUDGETS = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under ₹2 Cr', min: 0, max: 20000000 },
  { label: '₹2–5 Cr', min: 20000000, max: 50000000 },
  { label: '₹5–10 Cr', min: 50000000, max: 100000000 },
  { label: '₹10 Cr+', min: 100000000, max: Infinity },
];
const SORTBY = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Area: Large to Small'];

const SORT_API_MAP = {
  'Newest': 'newest',
  'Price: Low to High': 'price-asc',
  'Price: High to Low': 'price-desc',
  'Area: Large to Small': 'area-desc',
};

// Map footer/homepage URL param values → filter state
const CATEGORY_MAP = {
  'luxury villas': 'Villa',
  'apartments': 'Apartment',
  'penthouses': 'Penthouse',
  'commercial': 'Commercial',
  'farm houses': 'Farm House',
  'plots': 'Plot',
};

export default function Properties() {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');
  const [city, setCity] = useState('All');
  const [budget, setBudget] = useState(BUDGETS[0]);
  const [sort, setSort] = useState('Newest');
  const [view, setView] = useState('grid');
  const [sortOpen, setSortOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);

  // Data state
  const [allProperties, setAllProperties] = useState(staticProperties); // start with static
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [total, setTotal] = useState(staticProperties.length);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ── Read URL params on mount ─────────────────────────────────────────────
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const cityParam = searchParams.get('city');
    const searchParam = searchParams.get('search');
    if (categoryParam) {
      const mapped = CATEGORY_MAP[categoryParam.toLowerCase()];
      if (mapped) setType(mapped);
    }
    if (cityParam) {
      const match = CITIES.find(c => c.toLowerCase() === cityParam.toLowerCase());
      if (match) {
        setCity(match);
      } else {
        // If it is a Pune locality, set the city to Pune and set the search query to the locality
        const localities = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav', 'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi', 'Handewadi', 'Wakad', 'Shivaji Nagar', 'Parvati Hill', 'Sukhsagar Nagar', 'Singhgad Road', 'Camp', 'Pimpri Gaon', 'Chinchwad Gaon', 'Bhosari', 'Nigdi', 'Bhugaon', 'Man', 'Sus', 'Malwadi', 'Warje', 'Fursungi', 'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City'];
        const matchedLocality = localities.find(l => l.toLowerCase() === cityParam.toLowerCase());
        if (matchedLocality) {
          setCity('Pune');
          setQuery(matchedLocality);
        }
      }
    }
    if (searchParam) setQuery(searchParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset page when search/filter attributes change
  useEffect(() => {
    setPage(1);
  }, [type, city, budget, sort, query]);

  // Scroll to top of page when pagination page changes ( Lenis compatible )
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [page]);

  // Click outside to close sort dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSortOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Fetch from backend ───────────────────────────────────────────────────
  const loadProperties = useCallback(async (signal) => {
    setLoading(true);
    try {
      const params = { sort: SORT_API_MAP[sort], page, limit: 6 };
      if (type !== 'All') params.type = type;
      if (city !== 'All') params.city = city;
      if (query) params.search = query;
      if (budget.min > 0) params.minPrice = budget.min;
      if (budget.max !== Infinity) params.maxPrice = budget.max;

      const data = await fetchProperties(params, { signal });
      setAllProperties(data.properties);
      const totalCount = data.total !== undefined ? data.total : data.properties.length;
      setTotal(totalCount);
      setTotalPages(Math.ceil(totalCount / 6) || 1);
      setApiError(false);
      setLoading(false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      // Graceful fallback: filter static data client-side
      setApiError(true);
      const filtered = staticProperties.filter(p => {
        const q = query.toLowerCase();
        if (q && !p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
        if (type !== 'All' && p.type !== type) return false;
        if (city !== 'All') {
          const matchedCity = p.city === city;
          const matchedLocality = p.location.toLowerCase().includes(city.toLowerCase());
          if (!matchedCity && !matchedLocality) return false;
        }
        if (p.price < budget.min || p.price > budget.max) return false;
        return true;
      });
      setAllProperties(filtered.slice((page - 1) * 6, page * 6));
      setTotal(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 6) || 1);
      setLoading(false);
    }
  }, [type, city, budget, sort, query, page]);

  useEffect(() => {
    const controller = new AbortController();
    // Debounce search input slightly
    const timer = setTimeout(() => { loadProperties(controller.signal); }, query ? 350 : 0);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [loadProperties, query]);

  // If backend filtered, no client-side filter needed; just use allProperties
  const filtered = useMemo(() => {
    if (!apiError) return allProperties; // backend already filtered
    // fallback: already client-filtered in catch block above
    return allProperties;
  }, [allProperties, apiError]);

  const clearFilters = () => {
    setQuery('');
    setType('All');
    setCity('All');
    setBudget(BUDGETS[0]);
    setSort('Newest');
  };

  const hasFilters = query || type !== 'All' || city !== 'All' || budget.label !== 'Any';

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-20 transition-colors duration-300">

      {/* ── Page Header ── */}
      <div className="bg-mesh-dark py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(212,175,55,0.07) 0%, transparent 55%)' }} />
        <div className="container-luxury relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>
                Our Listings
              </span>
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
      <div className="bg-white/95 dark:bg-navy-dark/95 border-b border-gray-100 dark:border-white/10 transition-colors duration-300">
        <div className="container-luxury py-4">
          <div className="flex flex-col gap-3">

            {/* Row 1 */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3 w-full">
              <div className="relative w-full md:w-[42%] shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft dark:text-white/40" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search location, developer, project..."
                  className="w-full pl-9 pr-3 h-[40px] rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy text-xs md:text-sm text-navy dark:text-white placeholder-zinc-400 dark:placeholder-white/35 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>

              {/* Group for other filters on mobile */}
              <div className="flex items-center gap-2 w-full md:flex-1">
                {/* City Dropdown Selector */}
                <div className="relative flex-1 md:shrink-0 min-w-0" ref={cityDropdownRef}>
                  <button
                    onClick={() => setCityOpen(!cityOpen)}
                    className="flex items-center justify-between gap-2 px-3 md:px-4 h-[40px] w-full md:min-w-[140px] rounded-xl text-[11px] md:text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-navy text-navy dark:text-white hover:border-gold/50 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D4AF37' }} />
                    <span className="truncate flex-1 text-left">{city === 'All' ? 'All Localities' : city}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-ink-soft dark:text-white/40 transition-transform duration-200 shrink-0 ${cityOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        data-lenis-prevent
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 right-0 md:right-auto md:w-48 top-full mt-2 max-h-60 overflow-y-auto bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury z-50 py-1.5 no-scrollbar"
                      >
                        {CITIES.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setCity(c);
                              setCityOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${city === c
                                ? 'bg-gold/10 text-gold-dark dark:text-gold'
                                : 'text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                              }`}
                          >
                            <span>{c === 'All' ? 'All Localities' : c}</span>
                            {city === c && <span className="text-gold text-[10px]">●</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sort dropdown */}
                <div className="relative flex-1 md:shrink-0 min-w-0" ref={dropdownRef}>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center justify-between gap-2 px-3 md:px-4 h-[40px] w-full md:min-w-[120px] rounded-xl text-[11px] md:text-xs font-semibold border border-gray-200 dark:border-white/10 bg-white dark:bg-navy text-navy dark:text-white hover:border-gold/50 transition-colors"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 shrink-0 text-ink-soft dark:text-white/40" />
                    <span className="truncate flex-1 text-left">{sort}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-ink-soft dark:text-white/40 transition-transform duration-200 shrink-0 ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div
                        data-lenis-prevent
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 right-0 md:right-auto md:w-48 top-full mt-2 bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury overflow-hidden z-50 py-1.5"
                      >
                        {SORTBY.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setSort(s);
                              setSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${sort === s
                                ? 'bg-gold/10 text-gold-dark dark:text-gold'
                                : 'text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                              }`}
                          >
                            {s}
                            {sort === s && <span className="text-gold text-[10px]">●</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Grid view selector */}
                <div className="flex gap-0.5 p-1 h-[40px] items-center rounded-xl shrink-0 bg-black/5 dark:bg-white/5 border border-transparent dark:border-white/5">
                  {[
                    ['grid', <Grid3X3 key="g" className="w-3.5 h-3.5" />],
                    ['list', <List key="l" className="w-3.5 h-3.5" />]
                  ].map(([v, icon]) => (
                    <button key={v} onClick={() => setView(v)}
                      className={`p-1.5 rounded-lg transition-all duration-200 h-7 w-7 flex items-center justify-center ${view === v
                          ? 'bg-white dark:bg-navy-light text-navy dark:text-white shadow-sm'
                          : 'bg-transparent text-ink-soft dark:text-white/40 hover:text-navy dark:hover:text-white'
                        }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Filters (Types & Budgets) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
              {/* Type pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar items-center shrink-0 py-1.5">
                {TYPES.map(t => (
                  <button key={t} onClick={() => setType(t)}
                    className={`px-3.5 h-[36px] rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all duration-250 shrink-0 flex items-center justify-center ${type === t
                        ? 'bg-gradient-to-r from-gold to-gold-light text-navy shadow-[0_3px_10px_rgba(212,175,55,0.25)]'
                        : 'bg-black/5 dark:bg-white/5 text-ink-muted dark:text-cream/80 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Separator / Spacer for layout */}
              <div className="hidden md:block h-5 w-px bg-gray-200 dark:bg-white/10 mx-2" />

              {/* Budget pills */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar items-center flex-1 md:justify-end py-1.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft dark:text-white/40 shrink-0 mr-1">
                  Budget:
                </span>
                {BUDGETS.map(b => (
                  <button key={b.label} onClick={() => setBudget(b)}
                    className={`px-3 h-[32px] rounded-lg text-[10px] font-semibold whitespace-nowrap transition-all duration-250 shrink-0 flex items-center justify-center border ${budget.label === b.label
                        ? 'bg-gold/10 text-gold-dark dark:text-gold border-gold'
                        : 'bg-black/5 dark:bg-white/5 text-ink-muted dark:text-cream/80 border-transparent hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                  >
                    {b.label === 'Any' ? 'Any Budget' : b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container-luxury py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-ink-muted dark:text-white/60 text-sm">
            {loading
              ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading properties…</span>
              : <>Showing <span className="font-bold text-navy dark:text-white">{filtered.length}</span> of {total} luxury properties</>
            }
          </p>
          {apiError && (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              Showing cached listings
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-navy border border-gray-100 dark:border-white/10 overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-100 dark:bg-navy-light" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-navy-light rounded w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-navy-light rounded w-1/2" />
                  <div className="h-5 bg-gray-100 dark:bg-navy-light rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'
              : 'flex flex-col gap-5'}
          >
            {filtered.map(p => (
              <motion.div key={p._id || p.id} variants={fadeUp}>
                <PropertyCard property={p} view={view} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-24">
            <div className="text-6xl mb-6">🏠</div>
            <h3 className="font-display font-bold text-navy dark:text-white text-2xl mb-3">No properties found</h3>
            <p className="text-ink-muted dark:text-white/60 mb-6">Try adjusting your filters to see more results.</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </motion.div>
        )}

        {/* Pagination Toolbar */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-white/10 text-navy dark:text-white hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${page === i + 1
                    ? 'bg-gradient-to-r from-gold to-gold-light text-navy shadow-[0_3px_10px_rgba(212,175,55,0.25)]'
                    : 'border border-transparent hover:bg-black/5 dark:hover:bg-white/5 text-ink-muted dark:text-cream/80'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-white/10 text-navy dark:text-white hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
