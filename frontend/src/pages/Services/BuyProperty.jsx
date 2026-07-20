import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Home, Building2, MapPin, CheckCircle2,
  Building, Trees, Briefcase, Layers 
} from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { Link } from 'react-router-dom';
import PremiumIcon from '../../components/common/PremiumIcon';
import { submitEnquiry, fetchProperties, fetchMasterData } from '../../utils/api';
import SearchableSelect from '../../components/common/SearchableSelect';

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

const localities = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav', 'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi', 'Handewadi', 'Wakad', 'Shivaji Nagar', 'Parvati Hill', 'Sukhsagar Nagar', 'Singhgad Road', 'Camp', 'Pimpri Gaon', 'Chinchwad Gaon', 'Bhosari', 'Nigdi', 'Bhugaon', 'Man', 'Sus', 'Malwadi', 'Warje', 'Fursungi', 'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City'];
const timings = ['Immediately', 'Within 3 months', '3–6 months', 'Just exploring'];

const formatPrice = (val) => {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  }
  return `₹${(val / 100000).toFixed(0)} Lakh`;
};

const DEFAULT_RANGES = {
  villa: { min: 15000000, max: 250000000, defaultVal: 50000000 },
  apartment: { min: 4000000, max: 80000000, defaultVal: 15000000 },
  penthouse: { min: 30000000, max: 150000000, defaultVal: 60000000 },
  farmhouse: { min: 20000000, max: 120000000, defaultVal: 40000000 },
  commercial: { min: 10000000, max: 300000000, defaultVal: 50000000 },
  plot: { min: 3000000, max: 50000000, defaultVal: 10000000 }
};

const matchType = (dbType, formTypeId) => {
  if (!dbType || !formTypeId) return false;
  const t = dbType.toLowerCase().replace(/\s+/g, '');
  return t === formTypeId.toLowerCase();
};

export default function BuyProperty() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: '', locality: '', budget: '₹2 Cr', timing: '', name: '', phone: '', email: '', notes: '' });
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  
  const [allProperties, setAllProperties] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 4000000, max: 250000000, step: 500000 });
  const [sliderValue, setSliderValue] = useState(20000000);
  const [dynamicLocalities, setDynamicLocalities] = useState([]);

  useEffect(() => {
    fetchProperties({ limit: 100 })
      .then(data => {
        setAllProperties(data.properties || []);
      })
      .catch(err => console.error("Failed to load properties:", err));

    fetchMasterData()
      .then(data => {
        if (data && data.locality) setDynamicLocalities(data.locality);
      })
      .catch(err => console.error("Failed to load localities master data:", err));
  }, []);

  useEffect(() => {
    if (!form.type) return;

    const filtered = allProperties.filter(p => p.price >= 1000000 && matchType(p.type, form.type));
    
    if (filtered.length > 0) {
      const prices = filtered.map(p => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min !== max) {
        setPriceRange({ min, max, step: 500000 });
        const initialVal = Math.round((min + max) / 2);
        setSliderValue(initialVal);
        setForm(f => ({ ...f, budget: formatPrice(initialVal) }));
        return;
      }
    }

    const range = DEFAULT_RANGES[form.type] || { min: 4000000, max: 250000000, defaultVal: 20000000 };
    setPriceRange({ min: range.min, max: range.max, step: 500000 });
    setSliderValue(range.defaultVal);
    setForm(f => ({ ...f, budget: formatPrice(range.defaultVal) }));
  }, [form.type, allProperties]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    try {
      await submitEnquiry({
        type: 'buy',
        name: form.name,
        phone: form.phone,
        email: form.email,
        propertyType: form.type,
        locality: form.locality,
        budget: form.budget,
        timing: form.timing,
        notes: form.notes,
        isNRI: form.phone.startsWith('+') && !form.phone.startsWith('+91'),
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-24 pb-20 transition-colors duration-300">
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
            <div className="relative mb-10 md:mb-12">
              {/* Line connector behind */}
              <div className="absolute top-4 left-[15%] right-[15%] h-[2px] bg-gray-100 dark:bg-white/10 -z-10 rounded-full">
                <div 
                  className="h-full bg-gold transition-all duration-500 rounded-full"
                  style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex items-start justify-between w-full">
                {STEPS.map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 border-2 ${
                        i < step
                          ? 'bg-gradient-to-r from-gold to-gold-light border-gold text-navy'
                          : i === step
                            ? 'bg-navy dark:bg-gold border-navy dark:border-gold text-white dark:text-navy'
                            : 'bg-white dark:bg-navy-light border-gray-100 dark:border-white/10 text-ink-soft dark:text-cream/50'
                      }`}
                    >
                      {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span className={`text-[9px] md:text-xs font-bold text-center leading-tight tracking-wide max-w-[85px] md:max-w-none ${
                      i <= step ? 'text-navy dark:text-white' : 'text-ink-soft dark:text-cream/40'
                    }`}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 0 — Property Type */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                  <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-2">What type of property?</h2>
                  <p className="text-ink-muted dark:text-white/60 text-sm mb-8">Select the type of property you're looking for in Pune.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {propertyTypes.map(pt => {
                      const IconComponent = ICON_MAP[pt.id];
                      return (
                        <button
                          key={pt.id}
                          onClick={() => set('type', pt.id)}
                          className={`p-5 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 group border shadow-card ${
                            form.type === pt.id
                              ? 'bg-gold/10 dark:bg-gold/20 border-gold shadow-[0_4px_20px_rgba(212,175,55,0.15)]'
                              : 'bg-white dark:bg-navy-light border-gray-100 dark:border-white/10'
                          }`}
                        >
                          <PremiumIcon icon={IconComponent} variant={form.type === pt.id ? 'gold' : 'accent'} size="lg" className="mb-3" />
                          <p className="font-display font-bold text-navy dark:text-white text-sm mt-3">{pt.label}</p>
                          <p className="text-ink-muted dark:text-white/60 text-xs mt-1 leading-relaxed">{pt.desc}</p>
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
                  <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-2">Location & Budget</h2>
                  <p className="text-ink-muted dark:text-white/60 text-sm mb-8">Where in Pune and what's your investment range?</p>

                  <div className="space-y-6 mb-10">
                    <div>
                      <label className="block font-display font-bold text-navy dark:text-white text-sm mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" style={{ color: '#D4AF37' }} /> Preferred Locality
                      </label>
                      <SearchableSelect
                        value={form.locality}
                        onChange={val => set('locality', val)}
                        options={dynamicLocalities.length > 0 ? dynamicLocalities : localities}
                        placeholder="Choose locality (e.g. Balewadi, KP, Sus...)"
                      />
                    </div>
                    <div>
                      <label className="block font-display font-bold text-navy dark:text-white text-sm mb-1.5">
                        Budget Range: <span className="text-gold font-extrabold ml-1">{formatPrice(sliderValue)}</span>
                      </label>
                      <p className="text-[11px] text-ink-soft dark:text-cream/40 mb-4">Drag the slider to set your target budget.</p>
                      
                      <div className="px-2">
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          step={priceRange.step}
                          value={sliderValue}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setSliderValue(val);
                            set('budget', formatPrice(val));
                          }}
                          className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-ink-soft dark:text-cream/30 mt-2 uppercase tracking-wider">
                          <span>Min: {formatPrice(priceRange.min)}</span>
                          <span>Max: {formatPrice(priceRange.max)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block font-display font-bold text-navy dark:text-white text-sm mb-3">When do you plan to buy?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {timings.map(t => (
                          <button key={t} onClick={() => set('timing', t)}
                            className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                              form.timing === t
                                ? 'bg-gold/10 dark:bg-gold/20 border-gold text-gold-text dark:text-gold-light'
                                : 'bg-white dark:bg-navy-light text-ink-muted dark:text-cream/80 border-gray-100 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                            }`}
                          >
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
                  <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-2">Your Contact Details</h2>
                  <p className="text-ink-muted dark:text-white/60 text-sm mb-8">Our luxury advisor will reach out within 24 hours with a personalised shortlist.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Full Name *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} required
                          placeholder="Vikram Singhania" className="input-luxury" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Mobile Number *</label>
                        <input value={form.phone} onChange={e => set('phone', e.target.value)} required
                          placeholder="+91 98765 43210" className="input-luxury" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Email Address</label>
                      <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
                        placeholder="vikram@company.com" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy dark:text-white mb-1.5">Specific Requirements (Optional)</label>
                      <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                        placeholder="e.g. Sea facing, near school, home office space, NRI investment..."
                        className="input-luxury resize-none" />
                    </div>
                    {serverError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                        {serverError}
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(1)} className="btn-outline">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? 'Submitting...' : <> Submit Requirement <ArrowRight className="w-4 h-4" /> </>}
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
            <h2 className="font-display font-black text-navy dark:text-white text-3xl mb-3">Requirement Received!</h2>
            <p className="text-ink-muted dark:text-white/60 max-w-sm mx-auto leading-relaxed mb-8">
              Your advisor will contact you within 24 hours with a curated shortlist of Pune's finest properties matching your requirement.
            </p>
            <Link to="/properties" className="btn-primary">Browse Properties <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
