import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { fadeUp, fadeLeft, fadeRight, staggerContainer, viewportOnce } from '../../animations/variants';
import { faqs } from '../../data/index';
import SectionHeader from '../../components/common/SectionHeader';
import PremiumIcon from '../../components/common/PremiumIcon';
import { useAuth } from '../../contexts';
import { submitEnquiry } from '../../utils/api';

const CONTACTS = [
  { icon: <MapPin className="w-5 h-5" />, label: 'Visit Us', val: 'Level 12, Panchshil Tech Park\nYerwada, Pune 411006', href: '#' },
  { icon: <Phone className="w-5 h-5" />, label: 'Call Us', val: '+91 98765 43210\n+91 98765 43211', href: 'tel:+919876543210' },
  { icon: <Mail className="w-5 h-5" />, label: 'Email Us', val: 'hello@hyperrelestix.in\ncareers@hyperrelestix.in', href: 'mailto:hello@hyperrelestix.in' },
  { icon: <Clock className="w-5 h-5" />, label: 'Office Hours', val: 'Mon–Sat: 9:00 AM – 7:00 PM\nSunday: 10:00 AM – 4:00 PM', href: null },
];

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

export default function Contact() {
  const { user, openAuth } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: location.state?.subject || '',
    message: '',
    timezone: 'Dubai (GST)',
    preferredTime: ''
  });
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [serverError, setServerError] = useState('');
  const [openFaq, setOpenFaq]         = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (location.state?.subject) {
      setForm(f => ({ ...f, subject: location.state.subject }));
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark pt-20 transition-colors duration-300">

      {/* Hero */}
      <div className="bg-mesh-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 25% 60%, rgba(212,175,55,0.08) 0%, transparent 55%)' }} />
        <div className="container-luxury relative text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
              <span className="font-accent font-bold tracking-[0.22em] text-[10px] uppercase" style={{ color: '#D4AF37' }}>Get in Touch</span>
              <span className="h-px w-8" style={{ background: 'linear-gradient(270deg, transparent, #D4AF37)' }} />
            </div>
            <h1 className="font-display font-black text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Talk to a <span style={{ color: '#D4AF37' }}>Luxury Advisor</span>
            </h1>
            <p className="text-white/55 max-w-lg mx-auto leading-relaxed">
              Whether you're searching for your dream home or looking to maximise your property's value — our senior advisors are here to help.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container-luxury py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {CONTACTS.map((c, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div
                className="p-6 rounded-2xl h-full bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                <PremiumIcon icon={c.icon} variant="gold" size="md" className="mb-4" />
                <p className="font-display font-bold text-navy dark:text-white text-sm mb-2.5">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-ink-muted dark:text-cream/80 text-xs leading-[1.85] whitespace-pre-line hover:text-gold transition-colors">
                    {c.val}
                  </a>
                ) : (
                  <p className="text-ink-muted dark:text-cream/80 text-xs leading-[1.85] whitespace-pre-line">{c.val}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Form + Map Grid */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <div className="rounded-3xl p-8 bg-white dark:bg-navy-light border border-gray-100 dark:border-white/10 shadow-card transition-all duration-300"
            >
              <h2 className="font-display font-bold text-navy dark:text-white text-2xl mb-1.5">Send Us a Message</h2>
              <p className="text-ink-muted dark:text-white/60 text-sm mb-7">We typically respond within 2 hours during business hours.</p>
              {!submitted ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user) { openAuth(); return; }
                  setLoading(true);
                  setServerError('');
                  try {
                    let finalMessage = form.message;
                    if (form.subject === 'Book a Site Visit' || form.subject === 'NRI Desk Consultation') {
                      finalMessage += `\n\n[Timezone: ${form.timezone} | Preferred Slot: ${form.preferredTime || 'Not Specified'}]`;
                    }
                    
                    await submitEnquiry({
                      type: 'contact',
                      name: form.name,
                      phone: form.phone,
                      email: form.email,
                      subject: form.subject,
                      message: finalMessage,
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
                      <input value={form.name} onChange={e => set('name', e.target.value)} required
                        placeholder="Vikram Singhania" className="input-luxury" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Mobile Number *</label>
                      <input value={form.phone} onChange={e => set('phone', e.target.value)} required
                        placeholder="+91 98765 43210" className="input-luxury" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Email Address</label>
                    <input value={form.email} onChange={e => set('email', e.target.value)} type="email"
                      placeholder="vikram@company.com" className="input-luxury" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Subject</label>
                    <CustomSelect
                      value={form.subject}
                      onChange={val => set('subject', val)}
                      placeholder="Select a subject"
                      options={[
                        'Buy Property in Pune',
                        'Sell My Property',
                        'Lease / Rental Enquiry',
                        'Property Management',
                        'Book a Site Visit',
                        'NRI Desk Consultation',
                        'Other'
                      ]}
                    />
                  </div>

                  {(form.subject === 'Book a Site Visit' || form.subject === 'NRI Desk Consultation') && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid sm:grid-cols-2 gap-4 pt-1"
                    >
                      <div>
                        <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Preferred Timezone</label>
                        <CustomSelect
                          value={form.timezone}
                          onChange={val => set('timezone', val)}
                          placeholder="Select timezone"
                          options={[
                            'Dubai (GST - UTC+4)',
                            'London (BST - UTC+1)',
                            'Toronto (EST - UTC-5)',
                            'Singapore (SGT - UTC+8)',
                            'San Francisco (PST - UTC-8)',
                            'India (IST - UTC+5:30)'
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Preferred Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={form.preferredTime} 
                          onChange={e => set('preferredTime', e.target.value)} 
                          className="input-luxury" 
                        />
                      </div>
                    </motion.div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-navy dark:text-white mb-1.5">Message</label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4}
                      placeholder="Tell us how we can help you today..."
                      className="input-luxury resize-none" />
                  </div>
                  {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                      {serverError}
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? 'Sending...' : <> Send Message <ArrowRight className="w-4 h-4" /> </>}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
                    ✓
                  </div>
                  <h3 className="font-display font-bold text-navy dark:text-white text-2xl mb-3">Message Sent!</h3>
                  <p className="text-ink-muted dark:text-white/60 text-sm">Our advisor will call you within 2 hours.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Map placeholder + quick links */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={viewportOnce}
            className="flex flex-col gap-6">
            {/* Map */}
            <div className="flex-1 rounded-3xl overflow-hidden relative min-h-[300px]"
              style={{ background: 'linear-gradient(135deg, #071A2F, #0E2B4A)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <PremiumIcon icon={MapPin} variant="gold" size="xl" />
                <div className="text-center">
                  <p className="text-white font-display font-bold text-sm">HyperRelestix Pune HQ</p>
                  <p className="text-white/55 text-xs mt-1">Level 12, Panchshil Tech Park, Yerwada</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Panchshil+Tech+Park+Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full text-xs font-bold text-navy transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
                >
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Quick contact */}
            <div className="rounded-3xl p-6 bg-mesh-dark">
              <p className="font-display font-bold text-white text-base mb-4">Prefer to call or WhatsApp?</p>
              <div className="flex flex-col gap-3">
                <a href="tel:+919876543210"
                  className="flex items-center gap-3 py-3.5 px-5 rounded-2xl text-sm font-semibold text-navy transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 4px 16px rgba(212,175,55,0.3)' }}>
                  <Phone className="w-4 h-4" /> +91 98765 43210
                </a>
                <a href="https://wa.me/919876543210"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3.5 px-5 rounded-2xl text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: '#25D366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
                  WhatsApp Advisor
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-navy py-24 transition-colors duration-300">
        <div className="container-luxury max-w-3xl">
          <SectionHeader label="FAQ" title={<>Frequently Asked <span style={{ color: '#D4AF37' }}>Questions</span></>} align="center" className="mb-12" />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={faq.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${
                    openFaq === i
                      ? 'bg-gold/5 dark:bg-gold/10 border-gold/40'
                      : 'bg-black/5 dark:bg-white/5 border-gray-100 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display font-bold text-navy dark:text-white text-sm">{faq.question}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: '#D4AF37' }} />
                      : <ChevronDown className="w-4 h-4 shrink-0 text-ink-soft" />
                    }
                  </div>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-ink-muted dark:text-white/60 text-sm leading-[1.85] pt-3">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
