import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Camera, CheckCircle2 } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { Link } from 'react-router-dom';
import PremiumIcon from '../../components/common/PremiumIcon';

const STEPS = ['Property Details', 'Photos & Pricing', 'Owner Contact'];
const propTypes = ['Villa', 'Apartment', 'Penthouse', 'Farm House', 'Commercial', 'Plot'];
const localities = ['Baner', 'Balewadi', 'Kharadi', 'Koregaon Park', 'Kalyani Nagar', 'Wakad', 'Hinjawadi', 'Viman Nagar', 'Bavdhan', 'NIBM', 'Magarpatta', 'Other'];

export default function SellProperty() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: '', locality: '', area: '', bedrooms: '', furnishing: 'Fully Furnished', name: '', phone: '', email: '', askingPrice: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      <div className="bg-mesh-dark py-20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 40%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <div className="container-luxury relative">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-gold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
            <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Sell Property</span>
          </div>
          <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight">
            Maximise Your <span style={{ color: '#D4AF37' }}>Property's Value</span>
          </h1>
          <p className="text-white/55 mt-4 max-w-lg leading-relaxed">
            List with HyperRelestix — Pune's most trusted luxury platform. We sell premium properties 40% faster than market average.
          </p>
        </div>
      </div>

      <div className="container-luxury max-w-3xl">
        {!submitted ? (
          <>
            {/* Progress */}
            <div className="relative mb-10 md:mb-12">
              {/* Line connector behind */}
              <div className="absolute top-4 left-[15%] right-[15%] h-[2px] bg-gray-100 -z-10 rounded-full">
                <div 
                  className="h-full bg-gold transition-all duration-500 rounded-full"
                  style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-start justify-between w-full">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 border-2 bg-white"
                      style={{
                        borderColor: i <= step ? '#D4AF37' : 'rgba(7,26,47,0.1)',
                        background: i < step ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : i === step ? '#071A2F' : '#FFFFFF',
                        color: i === step ? 'white' : i < step ? '#071A2F' : '#71717A',
                      }}
                    >
                      {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className="text-[9px] md:text-xs font-bold text-center leading-tight tracking-wide max-w-[85px] md:max-w-none" 
                      style={{ color: i <= step ? '#071A2F' : '#71717A' }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display font-bold text-navy text-2xl mb-2">Tell us about your property</h2>
                <p className="text-ink-muted text-sm mb-8">Basic details to help us assess your property's market value.</p>
                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-2">Property Type</label>
                    <div className="flex flex-wrap gap-2">
                      {propTypes.map(t => (
                        <button key={t} onClick={() => set('type', t)}
                          className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                          style={{ background: form.type === t ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'white', color: form.type === t ? '#071A2F' : '#52525B', border: form.type === t ? 'none' : '1px solid rgba(7,26,47,0.1)', boxShadow: form.type === t ? '0 4px 14px rgba(212,175,55,0.3)' : 'none' }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy mb-2">Locality</label>
                    <div className="flex flex-wrap gap-2">
                      {localities.map(l => (
                        <button key={l} onClick={() => set('locality', l)}
                          className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                          style={{ background: form.locality === l ? 'rgba(212,175,55,0.1)' : 'white', color: form.locality === l ? '#8A6A18' : '#52525B', border: form.locality === l ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.1)' }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Carpet Area (sqft)</label>
                      <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="e.g. 3200" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Bedrooms</label>
                      <select value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} className="input-luxury">
                        <option value="">Select</option>
                        {['1','2','3','4','5','6+'].map(b => <option key={b}>{b} BHK</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Furnishing</label>
                      <select value={form.furnishing} onChange={e => set('furnishing', e.target.value)} className="input-luxury">
                        {['Fully Furnished','Semi Furnished','Unfurnished','Shell Condition'].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(1)} disabled={!form.type || !form.locality} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display font-bold text-navy text-2xl mb-2">Pricing & Highlights</h2>
                <p className="text-ink-muted text-sm mb-8">Set your asking price and add any special features to attract premium buyers.</p>
                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">Asking Price (₹)</label>
                    <input value={form.askingPrice} onChange={e => set('askingPrice', e.target.value)}
                      placeholder="e.g. 8,50,00,000" className="input-luxury" />
                    <p className="text-ink-soft text-xs mt-1.5">Our team will provide a free professional valuation for comparison.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">Key Highlights (Optional)</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4}
                      placeholder="e.g. Private pool, corner flat, RERA approved, recently renovated, ready-to-move, panoramic city view..."
                      className="input-luxury resize-none" />
                  </div>
                  {/* Photo upload note */}
                  <div className="p-5 rounded-2xl flex items-start gap-4"
                    style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
                    <PremiumIcon icon={Camera} size="sm" variant="gold" className="mt-0.5" animate={false} />
                    <div>
                      <p className="font-semibold text-navy text-sm mb-1">Professional Photography Included</p>
                      <p className="text-ink-muted text-xs leading-relaxed">Once your listing is verified, our professional photographer will capture your property — completely complimentary for HyperRelestix listings.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-outline"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1">Continue <ArrowRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display font-bold text-navy text-2xl mb-2">Owner Details</h2>
                <p className="text-ink-muted text-sm mb-8">Your information is confidential and shared only with verified buyers.</p>
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Full Name *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Anjali Reddy" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Mobile Number *</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="+91 98765 43210" className="input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1.5">Email Address</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="anjali@company.com" className="input-luxury" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setStep(1)} className="btn-outline"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button type="submit" className="btn-primary flex-1">List My Property <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </form>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>✓</div>
            <h2 className="font-display font-black text-navy text-3xl mb-3">Listing Request Received!</h2>
            <p className="text-ink-muted max-w-sm mx-auto leading-relaxed mb-8">Our team will review your property and schedule a professional valuation within 48 hours.</p>
            <Link to="/" className="btn-primary">Go to Homepage <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
