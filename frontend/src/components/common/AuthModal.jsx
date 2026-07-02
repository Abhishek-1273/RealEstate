import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useAuth } from '../../contexts';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/image/bg.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function AuthModal() {
  const { closeAuth, signIn, pendingRedirect } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // ── Absolute Scroll Lock & Touch Prevention ──
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Lock standard body overflows
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (window.lenis) {
      window.lenis.stop();
    }

    // Intercept and prevent wheel & touchmove events on window to lock background scroll
    const preventDefault = (e) => {
      const scrollableForm = document.querySelector('.auth-modal-scrollable');
      if (scrollableForm && scrollableForm.contains(e.target)) {
        if (scrollableForm.scrollHeight > scrollableForm.clientHeight) {
          // If the form itself is scrollable, allow it
          return;
        }
      }
      e.preventDefault();
    };

    window.addEventListener('wheel', preventDefault, { passive: false });
    window.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;

      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);

      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      // Save to context
      signIn(data.user);
      setStep('success');

    } catch {
      setServerError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    closeAuth();
    if (pendingRedirect) navigate(pendingRedirect);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-md"
      onClick={e => e.target === e.currentTarget && closeAuth()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="relative w-full max-w-md md:max-w-[860px] bg-[#0D1527] rounded-[2rem] shadow-luxury-deep overflow-hidden md:flex md:flex-row border border-white/5"
      >
        {/* Left Side: 60% width sunset picture visual */}
        <div
          className="hidden md:flex w-full md:w-3/5 relative flex-col justify-between p-6 text-white overflow-hidden shrink-0 select-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Sunset Indigo Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1527]/92 via-[#0D1527]/75 to-[#0D1527]/96 z-0" />

          {/* Logo Brand info */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gold to-gold-dark shadow-gold">
                <span className="text-navy font-display font-black text-xs">HR</span>
              </div>
              <span className="font-display font-bold text-xs tracking-wider uppercase text-white/90">HyperRelestix</span>
            </div>
          </div>

          {/* Heading overlay */}
          <div className="relative z-10">
            <h1 className="font-display font-light text-xl leading-snug text-white/90 mb-1">
              Find Your <br />
              <span className="font-bold text-gold">Signature Space</span>
            </h1>
            <p className="text-[8px] font-accent text-white/40 tracking-[0.25em] uppercase">Pune's Premier Residences</p>
          </div>
        </div>

        {/* Right Side: 40% width form */}
        <div className="w-full md:w-2/5 relative flex flex-col justify-center bg-[#0D1527] auth-modal-scrollable shrink-0">
          {/* Top subtle golden line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

          <button
            onClick={closeAuth}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:py-6 md:px-8">
            <AnimatePresence mode="wait">
              {/* Form Step */}
              {step === 'form' && (
                <motion.div
                  key="form"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="text-left">
                    <h2 className="font-display font-bold text-2xl text-white tracking-tight">
                      Welcome Back
                    </h2>
                    <p className="text-white/50 text-[11px] mt-1">
                      Sign in to your account to access premium properties
                    </p>
                  </motion.div>

                  {/* Server error */}
                  {serverError && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-2 text-red-400 text-xs"
                    >
                      {serverError}
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {/* Name input */}
                    <motion.div variants={itemVariants} className="group relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${errors.name ? 'border-red-500/40 focus:ring-red-500/10' : 'border-white/10 focus:border-gold/50'
                          } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                      />
                      {errors.name && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.name}</p>}
                    </motion.div>

                    {/* Phone input */}
                    <motion.div variants={itemVariants} className="group relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                      <input
                        type="tel"
                        placeholder="Mobile Number *"
                        value={form.phone}
                        maxLength={10}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${errors.phone ? 'border-red-500/40 focus:ring-red-500/10' : 'border-white/10 focus:border-gold/50'
                          } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                      />
                      {errors.phone && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.phone}</p>}
                    </motion.div>

                    {/* Email input */}
                    <motion.div variants={itemVariants} className="group relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                      <input
                        type="email"
                        placeholder="Email Address (optional)"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                        className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${errors.email ? 'border-red-500/40 focus:ring-red-500/10' : 'border-white/10 focus:border-gold/50'
                          } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                      />
                      {errors.email && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.email}</p>}
                    </motion.div>
                  </div>

                  {/* Assistance Link */}
                  <motion.div variants={itemVariants} className="flex justify-end text-[11px] text-white/30 hover:text-white/50 transition-colors">
                    <a href="#help" className="hover:underline">Need assistance?</a>
                  </motion.div>

                  {/* Actions */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed justify-center py-2.5 text-xs"
                    >
                      {loading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                      ) : (
                        <>Continue <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>

                    <div className="flex items-center gap-3 my-0.5">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-white/30 text-[10px] uppercase tracking-wider">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Social Logins */}
                    <div className="flex items-center justify-center gap-3">
                      <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/85 hover:bg-white/10 hover:border-gold/30 hover:text-gold transition-all duration-300 cursor-pointer">
                        <FaFacebookF className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/85 hover:bg-white/10 hover:border-gold/30 hover:text-gold transition-all duration-300 cursor-pointer">
                        <FaGoogle className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/85 hover:bg-white/10 hover:border-gold/30 hover:text-gold transition-all duration-300 cursor-pointer">
                        <FaApple className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>

                  <motion.p variants={itemVariants} className="text-center text-[10px] text-white/35">
                    By continuing you agree to our{' '}
                    <a href="#terms" className="text-gold hover:underline">Terms</a>
                    {' '}&{' '}
                    <a href="#privacy" className="text-gold hover:underline">Privacy Policy</a>
                  </motion.p>
                </motion.div>
              )}

              {/* Success Step */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-4 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, delay: 0.1 }}
                    className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </motion.div>

                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-xl text-white">
                      Welcome, {form.name.split(' ')[0]}! 🎉
                    </h3>
                    <p className="text-white/60 text-xs max-w-xs mx-auto leading-relaxed">
                      Your details have been saved successfully. You now have full access to all premium services.
                    </p>
                  </div>

                  <button
                    onClick={handleDone}
                    className="btn-primary mx-auto py-2.5 px-6 text-xs"
                  >
                    {pendingRedirect ? 'Continue to Service' : 'Explore Properties'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
