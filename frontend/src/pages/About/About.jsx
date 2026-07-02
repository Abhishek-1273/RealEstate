import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Target, Heart, Shield, TrendingUp, Star } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight, scaleIn, staggerContainer, staggerFast, viewportOnce } from '../../animations/variants';
import SectionHeader from '../../components/common/SectionHeader';
import CountUpNumber from '../../components/common/CountUpNumber';
import PremiumIcon from '../../components/common/PremiumIcon';
import { agents, stats } from '../../data/index';
import aboutBg from '../../assets/image/about-bg.png';
import missionFront from '../../assets/image/mission-front.png';
import missionBack from '../../assets/image/mission-back.png';


const values = [
  { icon: <Shield className="w-5 h-5" />, title: 'Integrity', desc: 'Complete transparency at every step. No hidden costs, no surprises.' },
  { icon: <Heart className="w-5 h-5" />, title: 'Client First', desc: 'Your home is our mission. We measure success by your satisfaction.' },
  { icon: <Target className="w-5 h-5" />, title: 'Excellence', desc: 'We accept nothing less than the finest in every property we represent.' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Innovation', desc: 'From 3D tours to AI market insights — we lead with technology.' },
  { icon: <Award className="w-5 h-5" />, title: 'Expertise', desc: '15+ years of deep Pune market knowledge, at your service.' },
  { icon: <Star className="w-5 h-5" />, title: 'Luxury Standard', desc: 'Every interaction is designed to match the calibre of our properties.' },
];

export default function About() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="min-h-screen bg-surface pt-20">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ height: '560px' }}>
        <img
          src={aboutBg}
          alt="HyperRelestix Office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(7,26,47,0.96) 0%, rgba(7,26,47,0.65) 55%, rgba(7,26,47,0.2) 100%)' }} />
        <div className="absolute inset-0 flex items-center">
          <div className="container-luxury">
            <motion.div variants={fadeLeft} initial="hidden" animate="visible">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
                <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Our Story</span>
              </div>
              <h1 className="font-display font-black text-white leading-[1.05] mb-5 max-w-2xl"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>
                India's Most Trusted <span style={{ color: '#D4AF37' }}>Luxury Realty</span>
              </h1>
              <p className="text-white/65 max-w-xl leading-relaxed mb-8">
                Founded in 2010, HyperRelestix has redefined luxury real estate in India. From a boutique advisory practice to India's most decorated premium property platform — our story is one of relentless pursuit of excellence.
              </p>
              <Link to="/contact" className="btn-primary">
                Talk to Our Team <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="bg-mesh-dark py-16">
        <div className="container-luxury">
          <motion.div
            variants={staggerFast}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={scaleIn} className="text-center">
                <p className="font-display font-black text-white leading-none mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-[3rem]">
                  <CountUpNumber end={s.value} duration={2} />{s.suffix}
                </p>
                <p className="text-white/50 text-xs">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Mission + Vision ── */}
      <div className="section-pad bg-surface-alt">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <SectionHeader
                label="Our Purpose"
                title={<>Mission & <span style={{ color: '#D4AF37' }}>Vision</span></>}
                description="At HyperRelestix, we believe every client deserves not just a property — but a home that amplifies their aspirations."
              />
              <div className="mt-8 space-y-5">
                <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)' }}>
                  <p className="font-display font-bold text-navy text-sm mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" style={{ color: '#D4AF37' }} /> Our Mission
                  </p>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    To make luxury real estate accessible, transparent, and joyful — connecting India's finest properties with buyers who truly deserve them.
                  </p>
                </div>
                <div className="p-6 rounded-2xl" style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)' }}>
                  <p className="font-display font-bold text-navy text-sm mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" style={{ color: '#D4AF37' }} /> Our Vision
                  </p>
                  <p className="text-ink-muted text-sm leading-relaxed">
                    To be India's most trusted luxury real estate platform — known for integrity, expertise, and delivering experiences that exceed every expectation.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              <div
                className="group relative rounded-3xl"
                style={{ height: '400px', perspective: '1500px' }}
                onMouseEnter={() => setIsFlipped(true)}
                onMouseLeave={() => setIsFlipped(false)}
              >
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* ── Front Face ── */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img
                      src={missionFront}
                      alt="Our mission"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 p-7"
                      style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.9), transparent)' }}>
                      <p className="text-white/60 text-[10px] font-accent tracking-[0.2em] uppercase mb-1">Est. 2010</p>
                      <p className="text-white font-display font-bold text-xl">15 Years of Luxury Real Estate in India</p>
                    </div>
                  </div>

                  {/* ── Back Face ── */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <img
                      src={missionBack}
                      alt="Our vision"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 p-7"
                      style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.9), transparent)' }}>
                      <p className="text-white/60 text-[10px] font-accent tracking-[0.2em] uppercase mb-1">Our Vision</p>
                      <p className="text-white font-display font-bold text-xl">India's Most Trusted Luxury Platform</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Values ── */}
      <div className="section-pad bg-white">
        <div className="container-luxury">
          <SectionHeader label="What We Stand For" title={<>Our Core <span style={{ color: '#D4AF37' }}>Values</span></>} align="center" className="mb-16" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="p-7 rounded-2xl h-full transition-all duration-400 hover:-translate-y-2 hover:shadow-card-hover"
                  style={{ background: 'rgba(7,26,47,0.02)', border: '1px solid rgba(7,26,47,0.07)' }}>
                  <PremiumIcon icon={v.icon} className="mb-5" variant="gold" size="md" />
                  <h3 className="font-display font-bold text-navy text-lg mb-2">{v.title}</h3>
                  <p className="text-ink-muted text-sm leading-[1.85]">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Team ── */}
      <div id="team" className="section-pad bg-surface-alt">
        <div className="container-luxury">
          <SectionHeader label="Meet the Team" title={<>Our <span style={{ color: '#D4AF37' }}>Luxury Advisors</span></>}
            description="India's most accomplished luxury real estate specialists — with decades of combined experience."
            align="center" className="mb-16" />
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {agents.map((a) => (
              <motion.div key={a.id} variants={scaleIn} className="h-full">
                <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-white transition-all duration-400 hover:-translate-y-2 hover:shadow-luxury"
                  style={{ border: '1px solid rgba(7,26,47,0.07)' }}>
                  <div className="relative h-52 overflow-hidden shrink-0">
                    <img src={a.image} alt={a.name} loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(7,26,47,0.6) 0%, transparent 60%)' }} />
                    <div className="absolute bottom-4 left-4 flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-gold text-gold" />)}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-navy text-base">{a.name}</h3>
                      <p className="text-xs font-semibold mt-0.5 mb-3" style={{ color: '#D4AF37' }}>{a.role}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {a.specialization.map(s => (
                          <span key={s} className="text-[9px] font-semibold px-2 py-1 rounded-full"
                            style={{ background: 'rgba(7,26,47,0.05)', color: '#52525B' }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-ink-muted mt-5 pt-4" style={{ borderTop: '1px solid rgba(7,26,47,0.06)' }}>
                      <span><strong className="text-navy">{a.propertiesSold}</strong> Sold</span>
                      <span><strong className="text-navy">{a.experience}yr</strong> Exp.</span>
                      <span><strong className="text-navy">{a.rating}</strong> Rating</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-mesh-dark py-20 relative overflow-hidden">
        <div className="container-luxury relative text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <h2 className="font-display font-black text-white text-3xl mb-4">Ready to find your dream home in Pune?</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">Let's start your luxury property journey today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/properties" className="btn-primary">Browse Properties <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/contact" className="btn-outline-light">Talk to an Advisor</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}