import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Shield, Wrench, Users, CheckCircle2, ChevronDown } from 'lucide-react';
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants';
import { Link } from 'react-router-dom';
import PremiumIcon from '../../components/common/PremiumIcon';
import { submitEnquiry } from '../../utils/api';

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
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-24 pb-20 transition-colors duration-300">
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
                className={`relative p-7 rounded-3xl cursor-pointer transition-all duration-400 hover:-translate-y-2 border shadow-card ${
                  selected === t.id
                    ? 'bg-white dark:bg-navy-light border-gold shadow-[0_16px_48px_rgba(212,175,55,0.16)]'
                    : 'bg-white dark:bg-navy-light border-gray-100 dark:border-white/10'
                }`}
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
                <h3 className="font-display font-bold text-navy dark:text-white text-xl mb-1">{t.name}</h3>
                <p className="font-bold text-base mb-6" style={{ color: '#D4AF37' }}>{t.price}</p>
                <ul className="space-y-2.5">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-xs text-ink-muted dark:text-white/60">
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
              className="rounded-3xl p-8 bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card"
            >
              <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-1.5">Get Started Today</h2>
              <p className="text-ink-muted dark:text-white/60 text-sm mb-6">Fill in your details and our property management team will contact you within 24 hours.</p>
              <form onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setServerError('');
              try {
                await submitEnquiry({
                  type: 'management',
                  name: form.name,
                  phone: form.phone,
                  email: form.email,
                  managementTier: selected,
                  numberOfProperties: form.properties,
                  notes: form.notes,
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
                <div>
                  <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Number of Properties to Manage</label>
                  <CustomSelect
                    value={form.properties}
                    onChange={val => set('properties', val)}
                    placeholder="Select property count"
                    options={[
                      { value: '1', label: '1 property' },
                      { value: '2', label: '2 properties' },
                      { value: '3–5', label: '3–5 properties' },
                      { value: '6–10', label: '6–10 properties' },
                      { value: '10+', label: '10+ properties' }
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Property Addresses / Notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} placeholder="Enter property details or specific management requirements" className="input-luxury resize-none" />
                </div>
                <div className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-gold/5 dark:bg-gold/10 border border-gold/20 shadow-sm">
                  <span className="text-xs font-bold text-navy dark:text-white">Selected Plan</span>
                  <span className="text-xs font-semibold text-gold">
                    {tiers.find(t => t.id === selected)?.name} — {tiers.find(t => t.id === selected)?.price}
                  </span>
                </div>
                {serverError && <p className="text-red-500 text-xs mt-2">{serverError}</p>}
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Submitting Request...' : 'Request Management Services'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center py-10">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 60px rgba(212,175,55,0.3)' }}>✓</div>
            <h2 className="font-display font-black text-navy dark:text-white text-3xl mb-3">We're On It!</h2>
            <p className="text-ink-muted dark:text-white/60 max-w-sm mx-auto leading-relaxed mb-6">Our property management team will contact you within 24 hours to discuss your requirements.</p>
            <Link to="/" className="btn-primary">Go to Homepage <ArrowRight className="w-4 h-4" /></Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
