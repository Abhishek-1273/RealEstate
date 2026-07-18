import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { fetchBlogs } from '../../../utils/api';
import { blogs as staticBlogs } from '../../../data/index';
import SectionHeader from '../../../components/common/SectionHeader';
import { fadeUp, staggerContainer, viewportOnce } from '../../../animations/variants';

export default function BlogPreview() {
  const [list, setList] = useState(staticBlogs.slice(0, 3));

  useEffect(() => {
    let active = true;
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        const blogsArray = data.blogs || (Array.isArray(data) ? data : []);
        if (active && blogsArray.length > 0) {
          setList(blogsArray.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load real blogs on homepage:', err);
      }
    };
    getBlogs();
    return () => { active = false; };
  }, []);

  return (
    <section className="section-pad bg-surface-alt dark:bg-navy transition-colors duration-300">
      <div className="container-luxury">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <SectionHeader
            label="Insights & Trends"
            title={<>Latest from Our <span style={{ color: '#D4AF37' }}>Blog</span></>}
          />
          <Link to="/blog" className="btn-outline shrink-0 hidden md:inline-flex">All Articles <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-7"
        >
          {list.map((b) => (
            <motion.div key={b._id || b.id} variants={fadeUp}>
              <Link
                to={`/blog/${b.slug || b.id}`}
                className="group block bg-white dark:bg-navy-light rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-1 border border-gray-150 dark:border-white/10 shadow-card"
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={b.image} alt={b.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108" />
                  <span className="absolute top-4 left-4 badge-gold">{b.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-ink-soft dark:text-white/50 mb-3">
                    <Clock className="w-3 h-3 text-gold" style={{ color: '#D4AF37' }} />
                    <span>{b.date}</span><span>·</span><span>{b.readTime}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy dark:text-white text-base leading-snug mb-3 group-hover:text-gold-muted transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-ink-muted dark:text-white/60 text-sm line-clamp-2 leading-relaxed mb-5">{b.excerpt}</p>
                  <div className="flex items-center gap-2.5 pt-4 border-t border-gray-150 dark:border-white/10">
                    <img src={b.author?.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-ink-muted dark:text-cream/80 text-xs font-semibold">{b.author?.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-auto group-hover:translate-x-1 transition-transform" style={{ color: '#D4AF37' }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile All Articles at bottom */}
        <div className="flex justify-center mt-10 md:hidden">
          <Link to="/blog" className="btn-outline w-full text-center justify-center">
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
