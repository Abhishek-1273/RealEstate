import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchableSelect({ value, onChange, options, placeholder = "Select Locality", className = "" }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredOptions = options.filter(opt => {
    const label = typeof opt === 'object' ? opt.label : opt;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedOption = options.find(o => typeof o === 'object' ? o.value === value : o === value);
  const displayText = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : placeholder;

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearchTerm('');
        }}
        className={`w-full flex items-center justify-between input-luxury text-left px-4.5 py-3 h-[46px] bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 rounded-2xl text-xs md:text-sm text-navy dark:text-white placeholder-zinc-400 dark:placeholder-white/35 focus:outline-none focus:border-gold transition-all ${className}`}
      >
        <span className={value ? "text-navy dark:text-white font-bold" : "text-zinc-400 dark:text-white/35 font-semibold"}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-soft dark:text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-1.5 max-h-64 overflow-hidden bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury z-50 flex flex-col"
          >
            {/* Search Input Box */}
            <div className="p-2 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-white/30 shrink-0 ml-1.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search locality..."
                className="w-full bg-transparent text-xs text-navy dark:text-white placeholder-zinc-400 dark:placeholder-white/30 focus:outline-none py-1.5 pr-2"
                autoFocus
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-48 py-1.5 no-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const val = typeof opt === 'object' ? opt.value : opt;
                  const label = typeof opt === 'object' ? opt.label : opt;
                  const active = value === val;

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        onChange(val);
                        setOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                        active
                          ? 'bg-gold/10 text-gold-dark dark:text-gold'
                          : 'text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                      }`}
                    >
                      <span>{label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-gold" style={{ color: '#D4AF37' }} />}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-4 text-xs text-zinc-400 dark:text-white/35">
                  No localities found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
