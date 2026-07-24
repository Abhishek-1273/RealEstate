import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Camera, CheckCircle2, ChevronDown } from 'lucide-react';
import { fadeUp } from '../../animations/variants';
import { Link } from 'react-router-dom';
import PremiumIcon from '../../components/common/PremiumIcon';
import { useSiteSettings, getBrandName } from '../../contexts';
import { submitEnquiry, fetchMasterData } from '../../utils/api';
import CameraUploader from '../../components/common/CameraUploader';
import SearchableSelect from '../../components/common/SearchableSelect';

const STEPS = ['Property Details', 'Photos & Pricing', 'Owner Contact'];
const propTypes = ['Villa', 'Apartment', 'Penthouse', 'Farm House', 'Commercial', 'Plot'];
const localities = ['Balewadi', 'Hadapsar', 'KP', 'NIBM Road', 'Viman Nagar', 'Kharadi', 'Punewadi', 'Kothrud', 'Karve Nagar', 'Shewalewadi Road', 'Baner', 'Pashan', 'Bawadhan', 'MG Road', 'JM Road', 'F.C. Road', 'Hinjewadi Phase I, II', 'Ravet', 'Ganga Dham Chownk', 'Swargate', 'Katraj', 'Prabhat Road', 'Bibwewadi', 'Bhekrai Nagar', 'Pimple Gurav', 'Pimple Saudagar', 'Dhayari', 'Kondhwa', 'Undri', 'Muhamad wadi', 'Handewadi', 'Wakad', 'Shivaji Nagar', 'Parvati Hill', 'Sukhsagar Nagar', 'Singhgad Road', 'Camp', 'Pimpri Gaon', 'Chinchwad Gaon', 'Bhosari', 'Nigdi', 'Bhugaon', 'Man', 'Sus', 'Malwadi', 'Warje', 'Fursungi', 'Wagholi', 'Manjari', 'Lohgaon', 'Vishrantwadi', 'Khadki', 'Nanded City', 'Other'];

function CustomSelect({ value, onChange, options, placeholder, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const selectedOption = options.find(o => typeof o === 'object' ? o.value === value : o === value);
  const displayText = selectedOption 
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) 
    : placeholder;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between input-luxury text-left ${className}`}
      >
        <span className={value ? "text-navy dark:text-white" : "text-zinc-400 dark:text-white/35"}>
          {displayText}
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-soft dark:text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white/95 dark:bg-navy/95 backdrop-blur-md border border-gray-150 dark:border-white/10 rounded-2xl shadow-luxury z-50 py-1.5 no-scrollbar"
          >
            {options.map((opt) => {
              const val = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              const active = value === val;

              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    onChange(val);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between ${
                    active
                      ? 'bg-gold/10 text-gold-dark dark:text-gold'
                      : 'text-ink-muted dark:text-cream/80 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-navy dark:hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                  {active && <span className="text-gold text-[10px]">●</span>}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SellProperty() {
  const { settings } = useSiteSettings();
  const brandName = getBrandName(settings);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ type: '', locality: '', area: '', bedrooms: '', furnishing: 'Fully Furnished', name: '', phone: '', email: '', askingPrice: '', notes: '', images: [] });
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  const [dynamicLocalities, setDynamicLocalities] = useState([]);
  const [dynamicTypes, setDynamicTypes] = useState([]);

  useEffect(() => {
    fetchMasterData()
      .then(data => {
        if (data) {
          if (data.locality) setDynamicLocalities(data.locality);
          if (data.propertyType) setDynamicTypes(data.propertyType);
        }
      })
      .catch(err => console.error("Failed to load SellProperty master data:", err));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-24 pb-20 transition-colors duration-300">
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
            List with {brandName} — Pune's most trusted luxury platform. We sell premium properties 40% faster than market average.
          </p>
        </div>
      </div>

      <div className="container-luxury max-w-3xl">
        {!submitted ? (
          <>
            {/* Progress */}
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

            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-2">Tell us about your property</h2>
                <p className="text-ink-muted dark:text-white/60 text-sm mb-8">Basic details to help us assess your property's market value.</p>
                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-2">Property Type</label>
                    <div className="flex flex-wrap gap-2">
                      {(dynamicTypes.length > 0 ? dynamicTypes : propTypes).map(t => (
                        <button key={t} onClick={() => set('type', t)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                            form.type === t
                              ? 'bg-gradient-to-r from-gold to-gold-light border-gold text-navy shadow-[0_4px_14px_rgba(212,175,55,0.3)]'
                              : 'bg-white dark:bg-navy-light text-ink-muted dark:text-cream/80 border-gray-100 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-2">Locality</label>
                    <SearchableSelect
                      value={form.locality}
                      onChange={val => set('locality', val)}
                      options={dynamicLocalities.length > 0 ? dynamicLocalities : localities}
                      placeholder="Select property locality"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Carpet Area (sqft)</label>
                      <input value={form.area} onChange={e => set('area', e.target.value)} placeholder="Carpet area in sqft" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Bedrooms</label>
                      <CustomSelect
                        value={form.bedrooms}
                        onChange={val => set('bedrooms', val)}
                        placeholder="Select BHK"
                        options={[
                          { value: '1 BHK', label: '1 BHK' },
                          { value: '2 BHK', label: '2 BHK' },
                          { value: '3 BHK', label: '3 BHK' },
                          { value: '4 BHK', label: '4 BHK' },
                          { value: '5 BHK', label: '5 BHK' },
                          { value: '6+ BHK', label: '6+ BHK' }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy mb-1.5">Furnishing</label>
                      <CustomSelect
                        value={form.furnishing}
                        onChange={val => set('furnishing', val)}
                        placeholder="Select furnishing status"
                        options={['Fully Furnished','Semi Furnished','Unfurnished','Shell Condition']}
                      />
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
                <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-2">Pricing & Highlights</h2>
                <p className="text-ink-muted dark:text-white/60 text-sm mb-8">Set your asking price and add any special features to attract premium buyers.</p>
                <div className="space-y-5 mb-10">
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Asking Price (₹)</label>
                    <input value={form.askingPrice} onChange={e => set('askingPrice', e.target.value)}
                      placeholder="Expected price in ₹" className="input-luxury" />
                    <p className="text-ink-soft dark:text-white/40 text-xs mt-1.5">Our team will provide a free professional valuation for comparison.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Key Highlights (Optional)</label>
                    <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={4}
                      placeholder="Highlight key property features (e.g. Corner unit, RERA approved, city view)"
                      className="input-luxury resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-2">Property Photos *</label>
                    <CameraUploader values={form.images} onChange={val => set('images', val)} maxImages={5} />
                    {form.images.length === 0 && (
                      <p className="text-[10px] text-amber-500 font-semibold mt-1.5">Please upload or capture at least 1 photo to continue.</p>
                    )}
                  </div>
                  {/* Photo upload note */}
                  <div className="p-5 rounded-2xl flex items-start gap-4 bg-gold/5 dark:bg-gold/10 border border-gold/20"
                  >
                    <PremiumIcon icon={Camera} size="sm" variant="gold" className="mt-0.5" animate={false} />
                    <div>
                      <p className="font-semibold text-navy dark:text-white text-sm mb-1">Professional Photography Included</p>
                      <p className="text-ink-muted dark:text-white/60 text-xs leading-relaxed">Once your listing is verified, our professional photographer will capture your property — completely complimentary for {brandName} listings.</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-outline"><ArrowLeft className="w-4 h-4" /> Back</button>
                  <button 
                    onClick={() => setStep(2)} 
                    disabled={form.images.length === 0} 
                    className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-2">Owner Details</h2>
                <p className="text-ink-muted dark:text-white/60 text-sm mb-8">Your information is confidential and shared only with verified buyers.</p>
                <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setServerError('');
                try {
                  await submitEnquiry({
                    type: 'sell',
                    name: form.name,
                    phone: form.phone,
                    email: form.email,
                    propertyType: form.type,
                    propertyLocality: form.locality,
                    propertyArea: form.area,
                    bedrooms: form.bedrooms,
                    furnishing: form.furnishing,
                    askingPrice: form.askingPrice,
                    notes: form.notes,
                    images: form.images,
                    isNRI: form.phone.startsWith('+') && !form.phone.startsWith('+91'),
                  });
                  setSubmitted(true);
                } catch (err) {
                  setServerError(err.message || 'Something went wrong. Please try again.');
                } finally {
                  setLoading(false);
                }
              }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Full Name *</label>
                      <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Enter full name" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Mobile Number *</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="Enter mobile number" className="input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Email Address</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="Enter email address" className="input-luxury" />
                  </div>
                  {serverError && <p className="text-red-500 text-xs mt-2">{serverError}</p>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" disabled={loading} onClick={() => setStep(1)} className="btn-outline"><ArrowLeft className="w-4 h-4" /> Back</button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1">
                      {loading ? 'Listing Property...' : 'List My Property'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-16">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>✓</div>
            <h2 className="font-display font-black text-navy dark:text-white text-3xl mb-3">Listing Request Received!</h2>
            <p className="text-ink-muted dark:text-white/60 max-w-sm mx-auto leading-relaxed mb-8">Our team will review your property and schedule a professional valuation within 48 hours.</p>
            <Link to="/" className="btn-primary">Go to Homepage <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
