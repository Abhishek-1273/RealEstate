import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Home, Building2, MapPin, CheckCircle2,
  Building, Trees, Briefcase, Layers 
} from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { Link } from 'react-router-dom';
import PremiumIcon from '../../components/common/PremiumIcon';

const ICON_MAP = {
  villa: Home,
  apartment: Building2,
  penthouse: Building,
  farmhouse: Trees,
  commercial: Briefcase,
  plot: Layers,
};

const STEPS = ['Property Type', 'Location & Budget', 'Contact Details'];

const propertyTypes = [
  { id: 'villa', label: 'Villa', icon: '🏡', desc: 'Private villas with personal pool & garden' },
  { id: 'apartment', label: 'Apartment', icon: '🏢', desc: 'Luxury flats in premium towers' },
  { id: 'penthouse', label: 'Penthouse', icon: '🌇', desc: 'Sky-high living with panoramic views' },
  { id: 'farmhouse', label: 'Farm House', icon: '🌾', desc: 'Expansive estates on the outskirts' },
  { id: 'commercial', label: 'Commercial', icon: '🏬', desc: 'Office spaces & retail in Pune CBD' },
  { id: 'plot', label: 'Plot', icon: '🌿', desc: 'Land in premium Pune localities' },
];

const localities = ['Baner', 'Balewadi', 'Kharadi', 'Koregaon Park', 'Kalyani Nagar', 'Wakad', 'Hinjawadi', 'Viman Nagar', 'Bavdhan', 'NIBM', 'Magarpatta', 'Hadapsar'];
const budgets = ['Under ₹2 Cr', '₹2–5 Cr', '₹5–10 Cr', '₹10–20 Cr', '₹20 Cr+'];
const timings = ['Immediately', 'Within 3 months', '3–6 months', 'Just exploring'];

export default function BuyProperty() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: '', locality: '', budget: '', timing: '', name: '', phone: '', email: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-20">
      {/* Page header */}
      <div className="bg-mesh-dark py-20 relative overflow-hidden mb-12">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <div className="container-luxury relative">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Link to="/services" className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-gold mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Services
            </Link>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Buy Property</span>
            </div>
            <h1 className="font-display font-black text-white text-4xl md:text-5xl leading-tight">
              Find Your <span style={{ color: '#D4AF37' }}>Dream Home</span>
            </h1>
            <p className="text-white/55 mt-4 max-w-lg leading-relaxed">
              Tell us what you're looking for and our senior luxury advisor will curate a personalised shortlist within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-luxury max-w-3xl">
        {!submitted ? (
          <>
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-12">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-400"
                      style={{
                        background: i < step ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : i === step ? '#071A2F' : 'rgba(7,26,47,0.06)',
                        color: i <= step ? (i < step ? '#071A2F' : 'white') : '#52525B',
                        border: i === step ? '2px solid #D4AF37' : 'none',
                      }}
                    >
                      {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className="hidden sm:block text-xs font-semibold" style={{ color: i === step ? '#071A2F' : '#71717A' }}>{s}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px rounded-full"
                      style={{ background: i < step ? '#D4AF37' : 'rgba(7,26,47,0.1)' }} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 0 — Property Type */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <h2 className="font-display font-bold text-navy text-2xl mb-2">What type of property?</h2>
                  <p className="text-ink-muted text-sm mb-8">Select the type of property you're looking for in Pune.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {propertyTypes.map(pt => {
                      const IconComponent = ICON_MAP[pt.id];
                      return (
                        <button
                          key={pt.id}
                          onClick={() => set('type', pt.id)}
                          className="p-5 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 group"
                          style={{
                            background: form.type === pt.id ? 'rgba(212,175,55,0.08)' : 'white',
                            border: form.type === pt.id ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.08)',
                            boxShadow: form.type === pt.id ? '0 4px 20px rgba(212,175,55,0.15)' : '0 2px 12px rgba(7,26,47,0.04)',
                          }}
                        >
                          <PremiumIcon icon={IconComponent} variant={form.type === pt.id ? 'gold' : 'accent'} size="lg" className="mb-3" />
                          <p className="font-display font-bold text-navy text-sm mt-3">{pt.label}</p>
                          <p className="text-ink-muted text-xs mt-1 leading-relaxed">{pt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setStep(1)} disabled={!form.type}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Step 1 — Location & Budget */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <h2 className="font-display font-bold text-navy text-2xl mb-2">Location & Budget</h2>
                  <p className="text-ink-muted text-sm mb-8">Where in Pune and what's your investment range?</p>

                  <div className="space-y-6 mb-10">
                    <div>
                      <label className="block font-display font-bold text-navy text-sm mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} /> Preferred Locality
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {localities.map(l => (
                          <button key={l} onClick={() => set('locality', l)}
                            className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200"
                            style={{
                              background: form.locality === l ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'white',
                              color: form.locality === l ? '#071A2F' : '#52525B',
                              border: form.locality === l ? 'none' : '1px solid rgba(7,26,47,0.1)',
                              boxShadow: form.locality === l ? '0 4px 14px rgba(212,175,55,0.3)' : 'none',
                            }}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-display font-bold text-navy text-sm mb-3">Budget Range</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {budgets.map(b => (
                          <button key={b} onClick={() => set('budget', b)}
                            className="py-3 px-4 rounded-xl text-xs font-semibold transition-all duration-200"
                            style={{
                              background: form.budget === b ? 'rgba(212,175,55,0.1)' : 'white',
                              border: form.budget === b ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.08)',
                              color: form.budget === b ? '#8A6A18' : '#52525B',
                            }}>
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block font-display font-bold text-navy text-sm mb-3">When do you plan to buy?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {timings.map(t => (
                          <button key={t} onClick={() => set('timing', t)}
                            className="py-3 px-4 rounded-xl text-xs font-semibold transition-all duration-200"
                            style={{
                              background: form.timing === t ? 'rgba(212,175,55,0.1)' : 'white',
                              border: form.timing === t ? '2px solid #D4AF37' : '1px solid rgba(7,26,47,0.08)',
                              color: form.timing === t ? '#8A6A18' : '#52525B',
                            }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="btn-outline">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => setStep(2)} disabled={!form.locality || !form.budget}
                      className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex-1">
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 — Contact */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <h2 className="font-display font-bold text-navy text-2xl mb-2">Your Contact Details</h2>
                  <p className="text-ink-muted text-sm mb-8">Our luxury advisor will reach out within 24 hours with a personalised shortlist.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1.5">Full Name *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} required
                          placeholder="Vikram Singhania" className="input-luxury" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy mb-1.5">Mobile Number *</label>
                        <input value={form.phone} onChange={e => set('phone', e.target.value)} required
                          placeholder="+91 98765 43210" className="input-luxury" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1.5">Email Address</label>
                      <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
                        placeholder="vikram@company.com" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy mb-1.5">Specific Requirements (Optional)</label>
                      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                        placeholder="e.g. Sea facing, near school, home office space, NRI investment..."
                        className="input-luxury resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(1)} className="btn-outline">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button type="submit" className="btn-primary flex-1">
                        Submit Requirement <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Success */
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>
              ✓
            </div>
            <h2 className="font-display font-black text-navy text-3xl mb-3">Requirement Received!</h2>
            <p className="text-ink-muted max-w-sm mx-auto leading-relaxed mb-8">
              Your advisor will contact you within 24 hours with a curated shortlist of Pune's finest properties matching your requirement.
            </p>
            <Link to="/properties" className="btn-primary">Browse Properties <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
