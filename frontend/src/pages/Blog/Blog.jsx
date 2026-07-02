import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { blogs } from '../../data/index';
import { fadeUp, staggerContainer } from '../../animations/variants';
import blogBg from '../../assets/image/blog-bg.png';

const CATEGORIES = ['All', 'Market Insights', 'Buying Guide', 'Technology', 'Lifestyle', 'Investment'];

export default function Blog() {
  const location = useLocation();
  const [cat, setCat] = useState(location.state?.category || 'All');
  const filtered = cat === 'All' ? blogs : blogs.filter(b => b.category === cat);
  const featured = blogs.find(b => b.featured);
  const rest = blogs.filter(b => !b.featured);

  return (
    <div className="min-h-screen bg-surface pt-20">

      {/* ── Featured Hero ── */}
      {featured && (
        <Link to={`/blog/${featured.id}`} state={{ category: cat }} className="group block relative overflow-hidden" style={{ height: '520px' }}>
          <img src={blogBg} alt={featured.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.95) 0%, rgba(7,26,47,0.4) 55%, transparent 100%)' }} />
          <div className="absolute bottom-0 inset-x-0 p-8 md:p-16">
            <div className="container-luxury">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="badge-gold mb-5 inline-block">{featured.category}</span>
                <h1 className="font-display font-black text-white leading-[1.1] mb-4 max-w-3xl"
                  style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
                  {featured.title}
                </h1>
                <p className="text-white/65 text-sm max-w-xl leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-white/60 text-xs">
                  <img src={featured.author.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <span className="font-semibold">{featured.author.name}</span>
                  <span>·</span><span>{featured.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </Link>
      )}

      {/* ── Filter Tabs ── */}
      <div className="bg-white sticky top-[74px] z-20" style={{ borderBottom: '1px solid rgba(7,26,47,0.07)' }}>
        <div className="container-luxury py-4 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-250 shrink-0"
              style={{
                background: cat === c ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'rgba(7,26,47,0.05)',
                color: cat === c ? '#071A2F' : '#52525B',
                boxShadow: cat === c ? '0 3px 12px rgba(212,175,55,0.3)' : 'none',
              }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Articles Grid ── */}
      <div className="container-luxury py-16">
        <motion.div
          key={cat}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-7"
        >
          {(cat === 'All' ? rest : filtered).map(b => (
            <motion.div key={b.id} variants={fadeUp}>
              <Link to={`/blog/${b.id}`} state={{ category: cat }}
                className="group block bg-white rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-2"
                style={{ boxShadow: '0 2px 24px rgba(7,26,47,0.07)' }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={b.image} alt={b.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
                  <span className="absolute top-4 left-4 badge-gold">{b.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-ink-soft mb-2.5">
                    <Clock className="w-3 h-3" />{b.readTime}
                    <span>·</span>{b.date}
                  </div>
                  <h2 className="font-display font-bold text-navy text-base leading-snug mb-2.5 group-hover:text-gold-muted transition-colors line-clamp-2">
                    {b.title}
                  </h2>
                  <p className="text-ink-muted text-xs line-clamp-2 mb-5 leading-relaxed">{b.excerpt}</p>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(7,26,47,0.06)' }}>
                    <div className="flex items-center gap-2">
                      <img src={b.author.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs text-ink-muted font-semibold">{b.author.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" style={{ color: '#D4AF37' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
