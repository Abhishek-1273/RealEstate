import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, ArrowRight, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { useAuth } from '../../contexts';
import { useNavigate } from 'react-router-dom';
import bgImage from '../../assets/image/bg.webp';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
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

  const [tab, setTab]                 = useState('login'); // 'login' | 'signup'
  const [step, setStep]               = useState('form'); // 'form' | 'otp' | 'success' | 'social_select'
  const [socialProvider, setSocialProvider] = useState(''); // 'Google' | 'Facebook' | 'Apple'
  const [form, setForm]               = useState({ name: '', phone: '', email: '' });
  const [loginTarget, setLoginTarget] = useState(''); // email or phone for login
  const [otpTarget, setOtpTarget]     = useState('');
  const [otpCode, setOtpCode]         = useState(['', '', '', '', '', '']);
  const [timer, setTimer]             = useState(30);
  const [canResend, setCanResend]     = useState(false);
  const [isNew, setIsNew]             = useState(false);
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState('');

  // ── Scroll lock while modal is open ────────────────────────────────────────
  useEffect(() => {
    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();

    const block = (e) => {
      const formEl = document.querySelector('.auth-modal-scrollable');
      if (formEl?.contains(e.target) && formEl.scrollHeight > formEl.clientHeight) return;
      e.preventDefault();
    };
    window.addEventListener('wheel', block, { passive: false });
    window.addEventListener('touchmove', block, { passive: false });

    return () => {
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
      window.removeEventListener('wheel', block);
      window.removeEventListener('touchmove', block);
      if (window.lenis) window.lenis.start();
    };
  }, []);

  // ── Resend Timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validateForm = () => {
    const e = {};
    setServerError('');

    if (tab === 'login') {
      if (!loginTarget.trim()) {
        e.loginTarget = 'Email or Mobile Number is required';
      } else if (loginTarget.includes('@')) {
        if (!/\S+@\S+\.\S+/.test(loginTarget)) {
          e.loginTarget = 'Enter a valid email address';
        }
      } else {
        if (!/^[6-9]\d{9}$/.test(loginTarget.replace(/\D/g, ''))) {
          e.loginTarget = 'Enter a valid 10-digit mobile number';
        }
      }
    } else {
      if (!form.name.trim()) e.name = 'Name is required';
      if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter valid 10-digit mobile number';
      if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter valid email address';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setServerError('');
    setOtpSuccessMessage('');

    const targetVal = tab === 'login' ? loginTarget.trim() : form.phone.trim();

    try {
      const res = await fetch(`${API_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: targetVal, mode: tab }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message || 'Verification code request failed.');
        return;
      }

      setOtpTarget(targetVal);
      setStep('otp');
      setTimer(30);
      setCanResend(false);
      setOtpCode(['', '', '', '', '', '']);
      setTimeout(() => {
        document.getElementById('otp-input-0')?.focus();
      }, 100);

    } catch {
      setServerError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (!canResend) return;

    setLoading(true);
    setServerError('');
    setOtpSuccessMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: otpTarget, mode: tab }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message || 'Verification code request failed.');
        return;
      }

      setTimer(30);
      setCanResend(false);
      setOtpCode(['', '', '', '', '', '']);
      setOtpSuccessMessage('New OTP has been logged to console.');
      setTimeout(() => {
        document.getElementById('otp-input-0')?.focus();
      }, 100);

    } catch {
      setServerError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const code = otpCode.join('');
    if (code.length !== 6) {
      setServerError('Please enter all 6 digits of the OTP.');
      return;
    }

    setLoading(true);
    setServerError('');
    setOtpSuccessMessage('');

    try {
      const payload = {
        target: otpTarget,
        code,
        mode: tab,
      };

      if (tab === 'signup') {
        payload.name = form.name.trim();
        payload.phone = form.phone.trim();
        payload.email = form.email.trim();
      }

      const res = await fetch(`${API_URL}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message || 'OTP verification failed.');
        return;
      }

      setIsNew(data.isNew);
      signIn(data.user);
      setStep('success');

    } catch {
      setServerError('Cannot verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Social Login Initiator ──────────────────────────────────────────────────
  const handleSocialInitiate = (provider) => {
    setServerError('');
    if (provider === 'Google') {
      const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
      const options = {
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '825902148154-lhbeo43siobpdrq7r61tclptlcr313s9.apps.googleusercontent.com',
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/callback',
        response_type: 'code',
        scope: 'email profile openid',
        prompt: 'select_account',
      };
      const qs = new URLSearchParams(options).toString();
      window.location.href = `${rootUrl}?${qs}`;
    } else {
      setSocialProvider(provider);
      setStep('social_select');
    }
  };

  // ── Social Login Verification ──────────────────────────────────────────────
  const handleSocialVerify = async (name, email) => {
    setLoading(true);
    setServerError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, provider: socialProvider }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.message || 'Social login failed.');
        setStep('form');
        return;
      }

      setIsNew(data.isNew);
      signIn(data.user);
      setStep('success');

    } catch {
      setServerError('Cannot connect to server. Please try again.');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input focus flow ────────────────────────────────────────────────────
  const handleOtpChange = (value, index) => {
    const val = value.replace(/\D/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = val.substring(val.length - 1);
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpCode[index] && index > 0) {
        const newOtp = [...otpCode];
        newOtp[index - 1] = '';
        setOtpCode(newOtp);
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      } else {
        const newOtp = [...otpCode];
        newOtp[index] = '';
        setOtpCode(newOtp);
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtpCode(newOtp);
      document.getElementById('otp-input-5')?.focus();
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
        {/* ── Left visual panel (desktop only) ─────────────────────────────── */}
        <div
          className="hidden md:flex w-full md:w-3/5 relative flex-col justify-between p-6 text-white overflow-hidden shrink-0 select-none"
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1527]/92 via-[#0D1527]/75 to-[#0D1527]/96 z-0" />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-gold to-gold-dark shadow-gold">
                <span className="text-navy font-display font-black text-xs">HR</span>
              </div>
              <span className="font-display font-bold text-xs tracking-wider uppercase text-white/90">HyperRelestix</span>
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="font-display font-light text-xl leading-snug text-white/90 mb-1">
              Find Your <br />
              <span className="font-bold text-gold">Signature Space</span>
            </h1>
            <p className="text-[8px] font-accent text-white/40 tracking-[0.25em] uppercase">Pune's Premier Residences</p>
          </div>
        </div>

        {/* ── Right form panel ──────────────────────────────────────────────── */}
        <div className="w-full md:w-2/5 relative flex flex-col justify-center bg-[#0D1527] auth-modal-scrollable shrink-0">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

          <button
            onClick={closeAuth}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 md:py-6 md:px-8">
            <AnimatePresence mode="wait">

              {/* ── Signup/Login Form Step ──────────────────────────────────── */}
              {step === 'form' && (
                <motion.div
                  key="form-step"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="text-left mb-2">
                    <h2 className="font-display font-bold text-2xl text-white tracking-tight">
                      Welcome
                    </h2>
                    <p className="text-white/50 text-[11px] mt-1">
                      Enter details below to access luxury experiences.
                    </p>
                  </motion.div>

                  {/* Tabs */}
                  <motion.div variants={itemVariants} className="flex border-b border-white/10 mb-4 bg-white/5 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => { setTab('login'); setServerError(''); setErrors({}); }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        tab === 'login'
                          ? 'bg-gradient-to-br from-gold to-gold-dark text-navy shadow-md'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTab('signup'); setServerError(''); setErrors({}); }}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        tab === 'signup'
                          ? 'bg-gradient-to-br from-gold to-gold-dark text-navy shadow-md'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      Sign Up
                    </button>
                  </motion.div>

                  {/* Server error banner */}
                  {serverError && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-2 text-red-400 text-xs"
                    >
                      {serverError}
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    {tab === 'login' ? (
                      /* Login view (Phone or Email) */
                      <motion.div variants={itemVariants} className="group relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                        <input
                          type="text"
                          placeholder="Email or Mobile Number *"
                          value={loginTarget}
                          onChange={e => setLoginTarget(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                          className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${
                            errors.loginTarget ? 'border-red-500/40' : 'border-white/10 focus:border-gold/50'
                          } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                        />
                        {errors.loginTarget && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.loginTarget}</p>}
                      </motion.div>
                    ) : (
                      /* Signup view (Full details) */
                      <>
                        {/* Name */}
                        <motion.div variants={itemVariants} className="group relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                          <input
                            type="text"
                            placeholder="Full Name *"
                            value={form.name}
                            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                            className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${
                              errors.name ? 'border-red-500/40' : 'border-white/10 focus:border-gold/50'
                            } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                          />
                          {errors.name && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.name}</p>}
                        </motion.div>

                        {/* Phone */}
                        <motion.div variants={itemVariants} className="group relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                          <input
                            type="tel"
                            placeholder="Mobile Number *"
                            value={form.phone}
                            maxLength={10}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, '') }))}
                            onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                            className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${
                              errors.phone ? 'border-red-500/40' : 'border-white/10 focus:border-gold/50'
                            } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                          />
                          {errors.phone && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.phone}</p>}
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={itemVariants} className="group relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 transition-colors group-focus-within:text-gold" />
                          <input
                            type="email"
                            placeholder="Email Address (optional)"
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                            className={`w-full pl-11 pr-4 py-2.5 bg-white/5 border ${
                              errors.email ? 'border-red-500/40' : 'border-white/10 focus:border-gold/50'
                            } rounded-2xl text-white placeholder-white/30 text-xs focus:outline-none focus:bg-white/8 transition-all`}
                          />
                          {errors.email && <p className="text-red-400 text-[9px] mt-1 ml-1">{errors.email}</p>}
                        </motion.div>
                      </>
                    )}
                  </div>

                  <motion.div variants={itemVariants} className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-white/20">OTP Verification required ✦</span>
                    <a href="mailto:support@hyperrelestix.com" className="text-white/30 hover:text-white/50 transition-colors hover:underline">Need help?</a>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3 pt-1">
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed justify-center py-2.5 text-xs font-bold"
                    >
                      {loading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Requesting OTP...</>
                      ) : (
                        <>Send Verification Code <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>

                    <div className="flex items-center gap-3 my-0.5">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-white/30 text-[10px] uppercase tracking-wider">or</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Social buttons */}
                    <div className="flex items-center justify-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => handleSocialInitiate('Facebook')}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2]/10 hover:border-[#1877F2]/40 hover:shadow-[0_0_15px_rgba(24,119,242,0.35)] hover:scale-105 transition-all duration-300"
                        title="Sign in with Facebook"
                      >
                        <FaFacebookF className="w-4 h-4 text-[#1877F2]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialInitiate('Google')}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#4285F4]/40 hover:shadow-[0_0_15px_rgba(66,133,244,0.35)] hover:scale-105 transition-all duration-300"
                        title="Sign in with Google"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSocialInitiate('Apple')}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 transition-all duration-300"
                        title="Sign in with Apple"
                      >
                        <FaApple className="w-4.5 h-4.5 text-white" />
                      </button>
                    </div>
                    <p className="text-center text-[10px] text-white/20">Or verify with social profile</p>
                  </motion.div>

                  <motion.p variants={itemVariants} className="text-center text-[10px] text-white/35">
                    By continuing you agree to our{' '}
                    <a href="#terms" className="text-gold hover:underline">Terms</a>
                    {' '}&{' '}
                    <a href="#privacy" className="text-gold hover:underline">Privacy Policy</a>
                  </motion.p>
                </motion.div>
              )}

              {/* ── Social Login Screen Simulation ───────────────────────── */}
              {step === 'social_select' && (
                <motion.div
                  key="social-select-step"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4 text-center"
                >
                  <div className="flex items-center gap-2 mb-2 text-left">
                    <button
                      type="button"
                      onClick={() => { setStep('form'); setServerError(''); }}
                      className="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h2 className="font-display font-bold text-lg text-white">
                      Sign in with {socialProvider}
                    </h2>
                  </div>

                  {socialProvider === 'Google' && (
                    <div className="bg-white rounded-2xl p-5 text-gray-800 space-y-4 shadow-xl border border-gray-100">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <FaGoogle className="w-6 h-6 text-[#DB4437]" />
                        <span className="font-black text-sm tracking-tight text-gray-800 font-display">Google</span>
                      </div>
                      
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                        Choose an account to continue to <span className="font-semibold text-gray-700">HyperRelestix</span>
                      </p>

                      <div className="space-y-2 text-left">
                        <button
                          type="button"
                          onClick={() => handleSocialVerify('Abhishek Kayg', 'akayg@gmail.com')}
                          disabled={loading}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gold/15 text-gold font-bold flex items-center justify-center text-xs">
                            AK
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">Abhishek Kayg</p>
                            <p className="text-[10px] text-gray-400">akayg@gmail.com</p>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleSocialVerify('Demo User', 'demo@gmail.com')}
                          disabled={loading}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs">
                            DU
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">Demo User</p>
                            <p className="text-[10px] text-gray-400">demo@gmail.com</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {socialProvider === 'Facebook' && (
                    <div className="bg-[#1877F2] rounded-2xl p-6 text-white space-y-4 shadow-xl">
                      <div className="flex items-center justify-center gap-2">
                        <FaFacebookF className="w-6 h-6 text-white" />
                        <span className="font-black text-base font-display">facebook</span>
                      </div>
                      
                      <p className="text-xs text-white/80 font-medium">
                        HyperRelestix is requesting access to your name and email profile.
                      </p>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleSocialVerify('Abhishek Kayg', 'akayg@facebook.com')}
                          disabled={loading}
                          className="w-full bg-white text-[#1877F2] hover:bg-gray-50 transition-colors font-bold text-xs py-3 rounded-xl shadow-md"
                        >
                          {loading ? 'Connecting...' : 'Continue as Abhishek Kayg'}
                        </button>
                      </div>
                    </div>
                  )}

                  {socialProvider === 'Apple' && (
                    <div className="bg-black border border-white/10 rounded-2xl p-6 text-white space-y-5 shadow-xl">
                      <div className="flex items-center justify-center gap-2">
                        <FaApple className="w-6 h-6 text-white" />
                        <span className="font-bold text-sm tracking-tight text-white font-display">Apple ID</span>
                      </div>
                      
                      <p className="text-[11px] text-white/50 leading-relaxed max-w-xs mx-auto">
                        Use your Apple ID to sign in to <span className="text-white font-semibold">HyperRelestix</span>.
                      </p>

                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-left">
                        <p className="text-[9px] text-white/45 uppercase tracking-wider font-bold">Apple ID</p>
                        <p className="text-xs text-white/90 font-medium mt-0.5">akayg@icloud.com</p>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleSocialVerify('Abhishek Kayg', 'akayg@icloud.com')}
                          disabled={loading}
                          className="w-full bg-white text-black hover:bg-gray-100 transition-colors font-black text-xs py-3 rounded-xl shadow-md"
                        >
                          {loading ? 'Verifying with Touch ID...' : 'Continue with Touch ID / Password'}
                        </button>
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-xs text-white/50 pt-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <span>Completing secure login...</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── OTP Verification Step ───────────────────────────────────── */}
              {step === 'otp' && (
                <motion.div
                  key="otp-step"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4"
                >
                  <motion.div variants={itemVariants} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setStep('form'); setServerError(''); setOtpSuccessMessage(''); }}
                      className="p-1 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="text-left">
                      <h2 className="font-display font-bold text-xl text-white tracking-tight">
                        Enter Verification Code
                      </h2>
                      <p className="text-white/50 text-[10px] mt-0.5">
                        Sent to: <span className="text-gold font-bold">{otpTarget}</span>
                      </p>
                    </div>
                  </motion.div>

                  {/* Server error / success banner */}
                  {serverError && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-2 text-red-400 text-xs"
                    >
                      {serverError}
                    </motion.div>
                  )}
                  {otpSuccessMessage && (
                    <motion.div
                      variants={itemVariants}
                      className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2 text-emerald-400 text-xs text-center"
                    >
                      {otpSuccessMessage}
                    </motion.div>
                  )}

                  {/* 6 OTP Boxes */}
                  <motion.div variants={itemVariants} className="flex justify-between gap-2 max-w-xs mx-auto py-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        className="w-10 h-11 text-center text-base font-extrabold bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl text-white focus:outline-none focus:bg-white/8 transition-all"
                      />
                    ))}
                  </motion.div>

                  {/* Countdown Timer */}
                  <motion.div variants={itemVariants} className="text-center text-xs text-white/40">
                    {timer > 0 ? (
                      <p>Resend code in <span className="text-gold font-bold">{timer}s</span></p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-gold hover:underline font-bold transition-all disabled:opacity-50"
                      >
                        Resend OTP code
                      </button>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-2">
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed justify-center py-2.5 text-xs font-bold"
                    >
                      {loading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying...</>
                      ) : (
                        <>Verify & Login <CheckCircle2 className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* ── Success step ────────────────────────────────────────────── */}
              {step === 'success' && (
                <motion.div
                  key="success-step"
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
                      {isNew ? `Welcome, ${form.name.split(' ')[0]}! 🎉` : `Welcome back!`}
                    </h3>
                    <p className="text-white/60 text-xs max-w-xs mx-auto leading-relaxed">
                      {isNew
                        ? 'Your account has been created. You now have full access to all premium services.'
                        : 'Signed in successfully. You now have full access to all premium services.'
                      }
                    </p>
                  </div>

                  <button onClick={handleDone} className="btn-primary mx-auto py-2.5 px-6 text-xs">
                    {pendingRedirect ? 'Continue to Service' : 'Explore Properties'}{' '}
                    <ArrowRight className="w-3.5 h-3.5" />
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
