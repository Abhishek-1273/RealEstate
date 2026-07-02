import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useSearch } from '../../contexts';
import { properties } from '../../data/properties';
import { Link } from 'react-router-dom';

const popularSearches = ['Sea facing penthouse Mumbai', 'Villa Hyderabad under 5cr', 'Beach house Goa', '3 BHK Bengaluru', 'Farm house Delhi'];

const SearchModal = () => {
  const { setShowSearch, searchQuery, setSearchQuery, recentSearches, addRecentSearch } = useSearch();
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const q = searchQuery.toLowerCase();
    if (q.length > 1) {
      setResults(properties.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      ).slice(0, 4));
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (q) => {
    addRecentSearch(q);
    setSearchQuery(q);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-navy/80 backdrop-blur-lg flex flex-col"
      onClick={(e) => e.target === e.currentTarget && setShowSearch(false)}
    >
      <div className="container-luxury pt-8">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
        >
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search properties, cities, types..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 font-body text-navy text-lg placeholder-gray-400 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowSearch(false)}
            className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Results / Suggestions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-white rounded-2xl overflow-hidden shadow-2xl"
        >
          {results.length > 0 ? (
            <div className="p-4">
              <p className="text-xs font-accent text-gray-400 uppercase tracking-widest mb-3">Properties Found</p>
              {results.map(p => (
                <Link
                  key={p.id}
                  to={`/properties/${p.id}`}
                  onClick={() => { addRecentSearch(p.title); setShowSearch(false); }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-navy text-sm truncate">{p.title}</p>
                    <p className="text-gray-600 text-xs">{p.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-bold text-sm">{p.priceLabel}</p>
                    <p className="text-gray-400 text-xs">{p.type}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gold transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-accent text-gray-400 uppercase tracking-widest">Recent</p>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="flex items-center gap-3 w-full text-left text-gray-600 hover:text-navy text-sm py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-accent text-gray-400 uppercase tracking-widest">Popular</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearch(s)}
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
};

export default SearchModal;
