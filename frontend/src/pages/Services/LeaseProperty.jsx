import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { Link } from 'react-router-dom';

const localities = ['Baner', 'Balewadi', 'Kharadi', 'Koregaon Park', 'Kalyani Nagar', 'Wakad', 'Hinjawadi', 'Viman Nagar', 'Bavdhan', 'NIBM', 'Other'];
const rentRanges = ['Under ₹30K/month', '₹30K–60K/month', '₹60K–1L/month', '₹1L–2L/month', '₹2L+/month'];
const durations = ['3 months', '6 months', '11 months', '1 year', '2+ years'];

export default function LeaseProperty() {
  const [form, setForm] = useState({ purpose: 'rent', locality: '', budget: '', duration: '', name: '', phone: '', email: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="bg-mesh-dark py-20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(212,175,55,0.07) 0%, transparent 60%)' }} />
        <div className="container-luxury relative">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-gold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Lease Property</span>
          </div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight">
            Premium <span style={{ color: '#D4AF37' }}>Rental Solutions</span>
          </h1>
          <p className="text-white/55 mt-4 max-w-lg leading-relaxed">
            Looking to rent a luxury home or lease your property? Our rental desk handles every detail with discretion.
          </p>
        </div>
      </div>

      <div className="container-luxury max-w-2xl">
        {!submitted ? (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            {/* Toggle */}
            <div className="flex gap-2 p-1.5 rounded-2xl mb-8 w-fit" style={{ background: 'rgba(7,26,47,0.06)' }}>
              {['rent', 'list'].map(p => (
                <button key={p} onClick={() => set('purpose', p)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-300"
                  style={{
                    background: form.purpose === p ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'transparent',
                    color: form.purpose === p ? '#071A2F' : '#52525B',
                    boxShadow: form.purpose === p ? '0 4px 16px rgba(212,175,55,0.3)' : 'none',
                  }}>
                  {p === 'rent' ? 'I Want to Rent' : 'List My Property'}
                </button>
              ))}
            </div>

            <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-navy mb-2">Preferred Locality</label>
                <div className="flex flex-wrap gap-2">
                  {localities.map(l => (
                    <button key={l} type="button" onClick={() => set('locality', l)}
                      className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                      style={{ background: form.locality === l ? 'rgba(212,175,55,0.1)' : 'white', color: form.locality === l ? '#8A6A18' : '#52525B', border: form.locality === l ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.1)' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy mb-2">{form.purpose === 'rent' ? 'Monthly Budget' : 'Expected Rent'}</label>
                  <div className="space-y-2">
                    {rentRanges.map(r => (
                      <button key={r} type="button" onClick={() => set('budget', r)}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                        style={{ background: form.budget === r ? 'rgba(212,175,55,0.1)' : 'white', color: form.budget === r ? '#8A6A18' : '#52525B', border: form.budget === r ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.08)' }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-2">Lease Duration</label>
                  <div className="space-y-2">
                    {durations.map(d => (
                      <button key={d} type="button" onClick={() => set('duration', d)}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                        style={{ background: form.duration === d ? 'rgba(212,175,55,0.1)' : 'white', color: form.duration === d ? '#8A6A18' : '#52525B', border: form.duration === d ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.08)' }}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
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
                <label className="block text-xs font-bold text-navy mb-1.5">Additional Notes</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="e.g. Pet-friendly, furnished preference, family of 4..." className="input-luxury resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Submit Rental Requirement <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>✓</div>
            <h2 className="font-display font-black text-navy text-3xl mb-3">Request Submitted!</h2>
            <p className="text-ink-muted max-w-sm mx-auto leading-relaxed mb-8">
              Our rental specialist will contact you within 24 hours with matching luxury properties in your preferred Pune localities.
            </p>
            <Link to="/properties" className="btn-primary">Browse Listings <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
