import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield, Wrench, Users, CheckCircle2 } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';
import { Link } from 'react-router-dom';
import PremiumIcon from '../../components/common/PremiumIcon';

const tiers = [
  {
    id: 'essential',
    name: 'Essential Care',
    price: '₹5,000/month',
    icon: <Shield className="w-5 h-5" />,
    features: ['Monthly Property Inspection', 'Utility Bill Management', 'Emergency Maintenance', 'Monthly Report'],
    best: false,
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '₹12,000/month',
    icon: <Wrench className="w-5 h-5" />,
    features: ['Everything in Essential', 'Tenant Management', 'Renovation Coordination', 'Quarterly Audit', 'Legal Support'],
    best: true,
  },
  {
    id: 'concierge',
    name: 'Concierge Care',
    price: 'Custom Pricing',
    icon: <Users className="w-5 h-5" />,
    features: ['Everything in Premium', 'Dedicated Property Manager', 'NRI Remote Reporting', 'Annual Property Valuation', 'Priority 24/7 Support'],
    best: false,
  },
];

export default function PropertyManagement() {
  const [selected, setSelected] = useState('premium');
  const [form, setForm] = useState({ name: '', phone: '', email: '', properties: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="bg-mesh-dark py-20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 60% 30%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <div className="container-luxury relative">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-gold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Property Management</span>
          </div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight">
            Hands-Free <span style={{ color: '#D4AF37' }}>Ownership</span>
          </h1>
          <p className="text-white/55 mt-4 max-w-lg leading-relaxed">
            Your property, perfectly managed. Trusted by NRI families and HNI investors across Pune's premium localities.
          </p>
        </div>
      </div>

      <div className="container-luxury">
        {/* Tiers */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {tiers.map(t => (
            <motion.div key={t.id} variants={fadeUp}>
              <div
                onClick={() => setSelected(t.id)}
                className="relative p-7 rounded-3xl cursor-pointer transition-all duration-400 hover:-translate-y-2"
                style={{
                  background: selected === t.id ? 'white' : 'white',
                  border: selected === t.id ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.08)',
                  boxShadow: selected === t.id ? '0 16px 48px rgba(212,175,55,0.16)' : '0 2px 16px rgba(7,26,47,0.05)',
                }}
              >
                {t.best && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black text-navy tracking-widest uppercase"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <PremiumIcon icon={t.icon} variant={selected === t.id ? 'gold' : 'accent'} size="md" />
                  {selected === t.id && <CheckCircle2 className="w-5 h-5 ml-auto" style={{ color: '#D4AF37' }} />}
                </div>
                <h3 className="font-display font-bold text-navy text-xl mb-1">{t.name}</h3>
                <p className="font-bold text-base mb-6" style={{ color: '#D4AF37' }}>{t.price}</p>
                <ul className="space-y-2.5">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-ink-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#D4AF37' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact form */}
        {!submitted ? (
          <div className="max-w-2xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}
              className="rounded-3xl p-8" style={{ background: 'white', border: '1px solid rgba(7,26,47,0.07)', boxShadow: '0 4px 32px rgba(7,26,47,0.07)' }}>
              <h2 className="font-display font-bold text-navy text-2xl mb-1.5">Get Started Today</h2>
              <p className="text-ink-muted text-sm mb-6">Fill in your details and our property management team will contact you within 24 hours.</p>
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">Full Name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your name" className="input-luxury" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">Mobile Number *</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="+91 98765 43210" className="input-luxury" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">Email Address</label>
                  <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="you@company.com" className="input-luxury" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">Number of Properties to Manage</label>
                  <select value={form.properties} onChange={e => set('properties', e.target.value)} className="input-luxury">
                    <option value="">Select</option>
                    {['1', '2', '3–5', '6–10', '10+'].map(n => <option key={n}>{n} propert{n === '1' ? 'y' : 'ies'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1.5">Property Addresses / Notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="e.g. Villa in Baner, apartment in Kharadi — NRI, need remote management..." className="input-luxury resize-none" />
                </div>
                <div className="pt-1 px-4 py-3 rounded-xl flex items-center gap-3"
                  style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <span className="text-xs font-semibold text-navy">Selected Plan:</span>
                  <span className="text-xs" style={{ color: '#D4AF37' }}>
                    {tiers.find(t => t.id === selected)?.name} — {tiers.find(t => t.id === selected)?.price}
                  </span>
                </div>
                <button type="submit" className="btn-primary w-full justify-center">
                  Request Management Services <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>✓</div>
            <h2 className="font-display font-black text-navy text-3xl mb-3">We're On It!</h2>
            <p className="text-ink-muted max-w-sm mx-auto leading-relaxed mb-6">Our property management team will contact you within 24 hours to discuss your requirements.</p>
            <Link to="/" className="btn-primary">Go to Homepage <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
