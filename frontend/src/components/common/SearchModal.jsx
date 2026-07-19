import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useSearch } from '../../contexts';
import { properties } from '../../data/properties';
import { fetchProperties } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';

const popularSearches = [
  'Sea facing penthouse Mumbai',
  'Villa Hyderabad under 5cr',
  'Beach house Goa',
  '3 BHK Bengaluru',
  'Farm house Delhi',
];

export default function SearchModal() {
  const { setShowSearch, searchQuery, setSearchQuery, recentSearches, addRecentSearch } = useSearch();
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length > 1) {
      let active = true;
      const search = async () => {
        try {
          const data = await fetchProperties({ search: q, limit: 4 });
          if (active) {
            setResults(data.properties);
          }
        } catch {
          if (active) {
            const filtered = properties.filter(p =>
              p.title.toLowerCase().includes(q) ||
              p.location.toLowerCase().includes(q) ||
              p.city.toLowerCase().includes(q) ||
              p.type.toLowerCase().includes(q)
            ).slice(0, 4);
            setResults(filtered);
          }
        }
      };
      search();
      return () => { active = false; };
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  // Navigate to properties page with the search query as a URL param
  const handleSearch = (q) => {
    addRecentSearch(q);
    setSearchQuery(q);
  };

  const submitSearch = (q) => {
    const query = (q || searchQuery).trim();
    if (!query) return;
    addRecentSearch(query);
    setShowSearch(false);
    setSearchQuery('');
    navigate(`/properties?search=${encodeURIComponent(query)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitSearch(searchQuery);
    if (e.key === 'Escape') setShowSearch(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-navy/80 dark:bg-navy-dark/90 backdrop-blur-lg flex flex-col"
      onClick={(e) => e.target === e.currentTarget && setShowSearch(false)}
    >
      <div className="container-luxury pt-8">
        {/* ── Search input bar ── */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-navy rounded-2xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 shadow-2xl border dark:border-white/10"
        >
          <Search className="w-5 h-5 text-gray-400 dark:text-white/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search properties, cities..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 font-body bg-transparent text-navy dark:text-white text-base sm:text-lg placeholder-gray-400 dark:placeholder-white/35 outline-none min-w-0"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => submitSearch(searchQuery)}
            className="hidden sm:block px-4 py-2 rounded-xl text-sm font-bold text-navy transition-all shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
          >
            Search
          </button>
          <button
            onClick={() => setShowSearch(false)}
            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-white/80 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* ── Results / Suggestions ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-white dark:bg-navy rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10"
        >
          {results.length > 0 ? (
            <div className="p-4">
              <p className="text-xs font-accent text-gray-400 dark:text-white/40 uppercase tracking-widest mb-3">Properties Found</p>
              {results.map(p => (
                <Link
                  key={p._id || p.id}
                  to={`/properties/${p._id || p.id}`}
                  onClick={() => { addRecentSearch(p.title); setShowSearch(false); setSearchQuery(''); }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-navy dark:text-white text-sm truncate">{p.title}</p>
                    <p className="text-gray-600 dark:text-cream/80 text-xs">{p.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-bold text-sm">{p.priceLabel}</p>
                    <p className="text-gray-400 dark:text-white/40 text-xs">{p.type}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold transition-colors shrink-0" />
                </Link>
              ))}
              {/* See all results link */}
              <button
                onClick={() => submitSearch(searchQuery)}
                className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-gold border border-gold/25 hover:bg-gold/5 transition-all flex items-center justify-center gap-2"
              >
                See all results for "{searchQuery}" <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-navy transition-colors duration-300">
              {/* Recent searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-accent text-gray-400 dark:text-white/40 uppercase tracking-widest">Recent</p>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-3 w-full text-left text-gray-600 dark:text-cream/80 hover:text-navy dark:hover:text-white text-sm py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg px-2 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-300 dark:text-white/20 shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {/* Popular */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-accent text-gray-400 dark:text-white/40 uppercase tracking-widest">Popular</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => submitSearch(s)}
                      className="text-xs bg-gold/10 text-gold font-semibold px-3 py-1.5 rounded-full hover:bg-gold hover:text-navy transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
