import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Mail } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaFacebookF } from 'react-icons/fa6';
import { fetchBlogBySlug, fetchBlogs } from '../../utils/api';
import { fadeUp } from '../../animations/variants';
import PageLoader from '../../components/common/PageLoader';
import SEO from '../../components/common/SEO';

export default function BlogDetails() {
  const { id: slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const prevCategory = location.state?.category || 'All';

  useEffect(() => {
    const getBlogDetails = async () => {
      setLoading(true);
      try {
        const article = await fetchBlogBySlug(slug);
        setBlog(article);
        
        const allBlogs = await fetchBlogs();
        setRelated(allBlogs.filter(b => b.slug !== slug).slice(0, 3));
      } catch (err) {
        console.error('Failed to load article details:', err);
      } finally {
        setLoading(false);
      }
    };
    getBlogDetails();
  }, [slug]);

  const parseMarkdownContent = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((block, i) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return <h3 key={i} className="font-display font-bold text-navy dark:text-white text-lg mt-8 mb-3.5 tracking-tight">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={i} className="font-display font-bold text-navy dark:text-white text-2xl mt-10 mb-4.5 tracking-tight border-b border-white/5 pb-2">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(li => li.replace('* ', '').trim());
        return (
          <ul key={i} className="list-disc pl-5 my-5 space-y-2.5 text-ink-muted dark:text-white/70 text-sm leading-relaxed">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        );
      }
      if (trimmed.startsWith('1. ')) {
        const items = trimmed.split('\n').map(li => li.replace(/^\d+\.\s+/, '').trim());
        return (
          <ol key={i} className="list-decimal pl-5 my-5 space-y-2.5 text-ink-muted dark:text-white/70 text-sm leading-relaxed">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ol>
        );
      }
      return <p key={i} className="text-sm md:text-base leading-relaxed mb-6 text-ink-muted dark:text-white/70" style={{ lineHeight: '1.95' }}>{trimmed}</p>;
    });
  };

  if (loading) return <PageLoader />;

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071A2F]">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Article Not Found</h2>
          <Link to="/blog" className="badge-gold inline-block px-6 py-2.5 rounded-full font-bold">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-20 transition-colors duration-300">
      {blog && (
        <SEO 
          title={blog.title} 
          description={blog.excerpt} 
          image={blog.image}
          type="article"
          url={`/blog/${slug}`} 
        />
      )}
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ height: '480px' }}>
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.95) 0%, rgba(7,26,47,0.5) 55%, rgba(7,26,47,0.2) 100%)' }} />
        
        {/* Back button */}
        <div className="absolute top-8 left-0 right-0 z-10">
          <div className="container-luxury">
            <Link
              to="/blog"
              state={{ category: prevCategory }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-white/70 hover:text-white transition-all duration-300 group shadow-lg"
              style={{ background: 'rgba(7,26,47,0.65)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}
            >
              <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-accent tracking-wider uppercase font-semibold">Back to Blog</span>
            </Link>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 pb-8 pt-24 bg-gradient-to-t from-[#071A2F]/95 via-[#071A2F]/70 to-transparent">
          <div className="container-luxury">
            <span className="badge-gold mb-3 inline-block">{blog.category}</span>
            <h1 className="font-display font-black text-white leading-[1.15] mb-4 max-w-3xl"
              style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white/70 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                {blog.author?.image && (
                  <img src={blog.author.image} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-gold/50" />
                )}
                <span className="text-white/95 font-semibold">{blog.author?.name}</span>
              </div>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span>{blog.date}</span>
              <span className="text-white/30">•</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold" style={{ color: '#D4AF37' }} />{blog.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-luxury py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="prose prose-lg max-w-none dark:prose-invert"
                style={{ '--tw-prose-body': '#52525B', '--tw-prose-headings': '#1A1A2E', color: '#52525B' }}>
                <p className="text-base md:text-lg leading-relaxed mb-6 font-medium text-navy dark:text-cream/90" style={{ lineHeight: '1.95' }}>
                  {blog.excerpt}
                </p>
                {parseMarkdownContent(blog.content)}
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 mt-10 pt-8 border-t border-gray-100 dark:border-white/10">
                <span className="text-ink-muted dark:text-white/50 text-sm font-semibold">Share:</span>
                {[
                  { icon: <FaXTwitter className="w-4 h-4" />, label: 'Twitter', color: '#1DA1F2' },
                  { icon: <FaLinkedinIn className="w-4 h-4" />, label: 'LinkedIn', color: '#0A66C2' },
                  { icon: <FaFacebookF className="w-4 h-4" />, label: 'Facebook', color: '#1877F2' },
                ].map(s => (
                  <button key={s.label} aria-label={s.label}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: s.color }}>
                    {s.icon}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Author Info */}
              <div className="rounded-2xl p-5 bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card transition-colors duration-300">
                <h3 className="font-display font-bold text-navy dark:text-white text-xs uppercase tracking-wider text-gold mb-4" style={{ color: '#D4AF37' }}>Written by</h3>
                <div className="flex items-center gap-3">
                  {blog.author?.image && (
                    <img src={blog.author.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gold/30" />
                  )}
                  <div>
                    <p className="font-bold text-navy dark:text-white text-sm">{blog.author?.name}</p>
                    <p className="text-ink-soft dark:text-white/45 text-xs mt-0.5">Senior Property Advisor</p>
                    <p className="text-[10px] mt-1 font-semibold" style={{ color: '#D4AF37' }}>HyperRelestix, Pune</p>
                  </div>
                </div>
              </div>

              {/* Related posts */}
              <div className="rounded-2xl p-5 bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card transition-colors duration-300">
                <h3 className="font-display font-bold text-navy dark:text-white text-sm mb-4">More Articles</h3>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link key={r._id || r.id} to={`/blog/${r.slug}`}
                      className="group flex gap-3 p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200">
                      <img src={r.image} alt="" className="w-16 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="badge-gold text-[9px] px-2 py-0.5 mb-1 inline-block">{r.category}</span>
                        <p className="text-navy dark:text-white/80 text-xs font-semibold leading-snug group-hover:text-gold-muted transition-colors line-clamp-2">{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="rounded-2xl p-5 bg-navy/95 border border-white/5 shadow-luxury">
                <p className="font-display font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gold" style={{ color: '#D4AF37' }} /> Weekly Insights
                </p>
                <p className="text-white/50 text-[10px] mb-4 leading-relaxed">Pune market trends delivered to your inbox every Monday.</p>
                <input type="email" placeholder="your@email.com" className="w-full bg-white/5 text-white placeholder-white/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-gold/50 transition-colors mb-2.5" />
                <button className="w-full py-2.5 rounded-xl text-xs font-bold text-navy transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
                  Subscribe
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
