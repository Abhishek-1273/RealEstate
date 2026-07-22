import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { fetchBlogs } from '../../utils/api';
import { fadeUp, staggerContainer } from '../../animations/variants';
import SEO from '../../components/common/SEO';
import { blogs as staticBlogs } from '../../data/index';

const CATEGORIES = ['All', 'NRI Guide', 'Market Insights', 'NRI Services'];

export default function Blog() {
  const location = useLocation();
  const [cat, setCat] = useState(location.state?.category || 'All');
  const [blogsList, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogsList(data);
        setApiError(false);
      } catch (err) {
        console.error('Failed to load blogs:', err);
        setBlogsList(staticBlogs);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const filtered = cat === 'All' ? blogsList : blogsList.filter(b => b.category === cat);



  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-20 transition-colors duration-300">
      <SEO 
        title={cat === 'All' ? 'Luxury Real Estate Blog' : `${cat} — Real Estate Updates`} 
        description="Exclusive insights, NRI property guides, tax updates, and market trends in Pune's premium real estate sectors." 
        url="/blog" 
      />

      {/* ── Page Hero ── */}
      <div className="relative py-16 md:py-20 bg-[#071A2F] border-b border-white/10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #071A2F 0%, #0c2543 50%, #051324 100%)' }}>
        <div className="container-luxury relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge-gold mb-3 inline-block">INSIGHTS & TRENDS</span>
            <h1 className="font-display font-black text-white text-3xl md:text-5xl leading-tight mb-3 tracking-tight">
              Real Estate <span style={{ color: '#D4AF37' }}>Journal & Insights</span>
            </h1>
            <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              Exclusive insights, NRI property guides, market analysis, and legal updates in Pune's premium real estate sectors.
            </p>
          </motion.div>
        </div>
      </div>


      {/* ── Filter Tabs ── */}
      <div className="bg-white dark:bg-navy sticky top-[74px] z-20 border-b border-gray-100 dark:border-white/10 transition-colors">
        <div className="container-luxury py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-250 shrink-0 border ${
                cat === c
                  ? 'bg-gradient-to-r from-gold to-gold-light text-navy border-gold shadow-[0_3px_12px_rgba(212,175,55,0.3)]'
                  : 'bg-black/5 dark:bg-white/5 text-ink-muted dark:text-cream/80 border-transparent hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <div className="container-luxury py-16">
        {apiError && (
          <div className="mb-6 flex justify-end">
            <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30 px-3 py-1 rounded-full">
              Showing cached articles
            </span>
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-3xl bg-white dark:bg-navy border border-gray-100 dark:border-white/10 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-navy-light" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-navy-light w-1/3 rounded" />
                  <div className="h-6 bg-gray-200 dark:bg-navy-light w-3/4 rounded" />
                  <div className="h-4 bg-gray-200 dark:bg-navy-light w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            key={cat}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-7"
          >
            {filtered.map(b => (

              <motion.div key={b._id || b.id} variants={fadeUp}>
                <Link to={`/blog/${b.slug}`} state={{ category: cat }}
                  className="group block bg-white dark:bg-navy-light rounded-3xl overflow-hidden border border-gray-100 dark:border-white/10 transition-all duration-400 hover:-translate-y-2 shadow-card"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={b.image} alt={b.title} loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
                    <span className="absolute top-4 left-4 badge-gold">{b.category}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-ink-soft dark:text-white/50 mb-2.5">
                      <Clock className="w-3 h-3" />{b.readTime}
                      <span>·</span>{b.date}
                    </div>
                    <h2 className="font-display font-bold text-navy dark:text-white text-base leading-snug mb-2.5 group-hover:text-gold-muted transition-colors line-clamp-2">
                      {b.title}
                    </h2>
                    <p className="text-ink-muted dark:text-white/60 text-xs line-clamp-2 mb-5 leading-relaxed">{b.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        {b.author?.image && (
                          <img src={b.author.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <span className="text-xs text-ink-muted dark:text-cream/80 font-semibold">{b.author?.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" style={{ color: '#D4AF37' }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
