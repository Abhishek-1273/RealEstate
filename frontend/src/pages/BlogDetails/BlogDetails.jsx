import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaFacebookF } from 'react-icons/fa6';
import { blogs } from '../../data/index';
import { fadeUp } from '../../animations/variants';

export default function BlogDetails() {
  const { id } = useParams();
  const blog = blogs.find(b => b.id === Number(id)) || blogs[0];
  const related = blogs.filter(b => b.id !== Number(id));
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const prevCategory = location.state?.category || 'All';

  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Reading progress bar */}
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '480px' }}>
        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.95) 0%, rgba(7,26,47,0.5) 55%, rgba(7,26,47,0.2) 100%)' }} />
        {/* Top Left Back Button */}
        <div className="absolute top-8 left-0 right-0 z-10">
          <div className="container-luxury">
            <Link 
              to="/blog" 
              state={{ category: prevCategory }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-white/70 hover:text-white transition-all duration-300 group shadow-lg"
              style={{
                background: 'rgba(7,26,47,0.65)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.background = 'rgba(212,175,55,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.background = 'rgba(7,26,47,0.65)';
              }}
            >
              <ArrowLeft className="w-4 h-4 text-gold group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-accent tracking-wider uppercase font-semibold">Back to Blog</span>
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <div className="container-luxury">
            <span className="badge-gold mb-4 inline-block">{blog.category}</span>
            <h1 className="font-display font-black text-white leading-[1.1] mb-5 max-w-3xl"
              style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}>
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-white/60 text-xs">
              <img src={blog.author.image} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-gold/50" />
              <span className="text-white/80 font-semibold">{blog.author.name}</span>
              <span>·</span><span>{blog.date}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{blog.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-luxury py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              {/* Article body */}
              <div className="prose prose-lg max-w-none"
                style={{ '--tw-prose-body': '#52525B', '--tw-prose-headings': '#1A1A2E', color: '#52525B' }}>
                <p className="text-base leading-[2] mb-5" style={{ fontSize: '1.05rem', lineHeight: '1.95' }}>
                  {blog.excerpt}
                </p>
                <p className="text-base leading-[2] mb-5" style={{ lineHeight: '1.95' }}>
                  Pune's luxury real estate market has undergone a profound transformation over the past five years. What was once a secondary market to Mumbai has emerged as one of India's most dynamic premium property destinations — attracting high-net-worth individuals, NRI investors, and corporate executives seeking world-class residences at prices that still offer extraordinary value compared to Mumbai.
                </p>
                <h2 className="font-display font-bold text-navy text-2xl mt-10 mb-5">The Rise of New Luxury Corridors</h2>
                <p className="text-base mb-5" style={{ lineHeight: '1.95' }}>
                  The traditional dominance of Koregaon Park — long considered Pune's most prestigious address — is now being challenged by rapidly maturing luxury micro-markets in Baner, Balewadi, and the Hinjawadi-Wakad stretch. These areas combine the proximity to Pune's technology hubs with generous plot sizes, superior infrastructure, and the kind of curated community living that discerning buyers increasingly demand.
                </p>
                <p className="text-base mb-5" style={{ lineHeight: '1.95' }}>
                  Kharadi's transformation has been perhaps the most dramatic. Once an industrial outpost, it now hosts premium residential towers that rival Mumbai's best — with rooftop infinity pools, AI-driven home automation, and IGBC Green-certified buildings that appeal to environmentally conscious HNI buyers.
                </p>
                <h2 className="font-display font-bold text-navy text-2xl mt-10 mb-5">Investment Returns in Pune's Premium Localities</h2>
                <p className="text-base mb-5" style={{ lineHeight: '1.95' }}>
                  The data is compelling. Baner luxury properties have delivered 14% year-on-year appreciation over the past three years, while Koregaon Park — despite its maturity — continues to hold value with 9% growth, driven primarily by limited inventory and persistent demand from Pune's growing HNI population.
                </p>
                <p className="text-base" style={{ lineHeight: '1.95' }}>
                  For NRI investors, Pune offers a particularly attractive proposition: lower entry points than Mumbai, strong rental yields from the IT population (often 4–5% on luxury apartments), and RERA-compliant projects from India's most reputed developers including Panchshil Realty, Kolte-Patil, and Godrej Properties.
                </p>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3 mt-10 pt-8" style={{ borderTop: '1px solid rgba(7,26,47,0.08)' }}>
                <span className="text-ink-muted text-sm font-semibold">Share:</span>
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
              {/* Author card */}
              <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)', boxShadow: '0 2px 20px rgba(7,26,47,0.06)' }}>
                <h3 className="font-display font-bold text-navy text-sm mb-4">Written by</h3>
                <div className="flex items-center gap-3">
                  <img src={blog.author.image} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-gold/30" />
                  <div>
                    <p className="font-bold text-navy text-sm">{blog.author.name}</p>
                    <p className="text-ink-soft text-xs mt-0.5">Senior Property Advisor</p>
                    <p className="text-[10px] mt-1" style={{ color: '#D4AF37' }}>HyperRelestix, Pune</p>
                  </div>
                </div>
              </div>

              {/* Related articles */}
              <div>
                <h3 className="font-display font-bold text-navy text-sm mb-4">More Articles</h3>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link key={r.id} to={`/blog/${r.id}`}
                      className="group flex gap-3 p-3 rounded-xl hover:bg-white transition-all duration-200">
                      <img src={r.image} alt="" className="w-16 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <span className="badge-gold text-[9px] px-2 py-0.5 mb-1 inline-block">{r.category}</span>
                        <p className="text-navy text-xs font-semibold leading-snug group-hover:text-gold-muted transition-colors line-clamp-2">{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="rounded-2xl p-5 bg-mesh-dark">
                <p className="font-display font-bold text-white text-sm mb-1.5">Weekly Property Insights</p>
                <p className="text-white/50 text-xs mb-4 leading-relaxed">Pune market trends delivered to your inbox every Monday.</p>
                <input type="email" placeholder="your@email.com" className="input-glass mb-2.5 text-xs py-2.5" />
                <button className="w-full py-2.5 rounded-xl text-xs font-bold text-navy"
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
