import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { useAuth, useSiteSettings, getLogoInitials, getBrandName } from '../../contexts';

import PageLoader from '../../components/common/PageLoader';

import { API_URL } from '../../config/api';
const API = API_URL;
const ROLE_LABELS = {
  admin:        { label: 'Admin', color: '#7C3AED' },
  management:   { label: 'Management', color: '#D4AF37' },
};

export default function AdminLogin() {
  const { signIn } = useAuth();
  const { user, loading: sessionLoading }   = useAdmin();
  const { settings } = useSiteSettings();
  const navigate   = useNavigate();

  const [step, setStep]     = useState('email'); // 'email' | 'otp'
  const [email, setEmail]   = useState('');
  const [otp, setOtp]       = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [info, setInfo]     = useState('');

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'management')) {
      navigate('/panel/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (sessionLoading) {
    return <PageLoader />;
  }

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!email.trim()) { setError('Email address is required'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ target: email.trim(), mode: 'login' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      setInfo(`OTP sent to ${email.trim()}`);
      setStep('otp');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and sign in
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ target: email.trim(), code, mode: 'login' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      if (data.user.role === 'client' || data.user.role === 'agent') {
        setError('Access denied. This portal is for admin and management staff only.');
        return;
      }
      signIn(data.user, data.token);
      navigate('/panel/dashboard');
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // OTP input handler
  const handleOtpChange = (val, idx) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);
    if (digit && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
    if (e.key === 'Enter') handleVerifyOtp();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').substring(0, 6).split('');
    if (digits.length === 6) {
      setOtp(digits);
      otpRefs[5].current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#071A2F' }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 65%)' }} />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 8px 32px rgba(212,175,55,0.3)' }}>
            {settings?.logoIconImage ? (
              <img src={settings.logoIconImage} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <span className="font-black text-navy text-xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {getLogoInitials(settings)}
              </span>

            )}
          </div>
          <h1 className="text-white font-black text-2xl mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Staff Portal
          </h1>
          <p className="text-white/40 text-sm">
            {getBrandName(settings)} Internal Panel
          </p>

        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
          <div className="space-y-5">

            {step === 'email' ? (
              <>
                <div>
                  <label className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wider uppercase">Email Address</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@hyperrelestix.in or akayg@gmail.com"
                    type="email"
                    className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all focus:border-gold border border-white/10"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                    onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                  />
                  <p className="text-white/40 text-[11px] mt-1.5 leading-relaxed">
                    Admin: <span className="text-gold cursor-pointer underline" onClick={() => setEmail('akaygill64@gmail.com')}>akaygill64@gmail.com</span> | Manager: <span className="text-gold cursor-pointer underline" onClick={() => setEmail('admin@hyperrelestix.in')}>admin@hyperrelestix.in</span>
                  </p>

                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </div>
                )}

                <button onClick={handleSendOtp} disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-navy text-sm transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  style={{ background: loading ? '#A8882B' : 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}>
                  {loading ? 'Sending OTP…' : 'Send OTP →'}
                </button>
              </>
            ) : (
              <>
                {info && (
                  <div className="px-4 py-3 rounded-xl text-green-300 text-xs text-center" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                    ✓ {info}
                  </div>
                )}

                <div>
                  <label className="block text-white/60 text-xs font-semibold mb-3 tracking-wider uppercase text-center">Enter 6-digit OTP</label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpRefs[idx]}
                        value={digit}
                        onChange={e => handleOtpChange(e.target.value, idx)}
                        onKeyDown={e => handleOtpKeyDown(e, idx)}
                        maxLength={1}
                        inputMode="numeric"
                        className="w-11 h-12 text-center text-white text-lg font-bold rounded-xl border focus:outline-none transition-all"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: digit ? '1.5px solid #D4AF37' : '1px solid rgba(255,255,255,0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </div>
                )}

                <button onClick={handleVerifyOtp} disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-navy text-sm transition-all duration-200 disabled:opacity-60 cursor-pointer"
                  style={{ background: loading ? '#A8882B' : 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}>
                  {loading ? 'Verifying…' : 'Verify & Access Panel →'}
                </button>

                <button
                  onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); setInfo(''); }}
                  className="w-full text-white/40 text-xs hover:text-white/70 transition-colors"
                >
                  ← Change email
                </button>
              </>
            )}
          </div>

          <p className="text-white/25 text-xs text-center mt-6 flex flex-col items-center gap-2.5">
            <span>Access restricted to authorised staff only</span>
            <Link to="/" className="text-gold hover:text-gold-light font-bold hover:underline text-[11px] transition-colors" style={{ color: '#D4AF37' }}>
              ← Return to Main Website
            </Link>
          </p>
        </div>

        {/* Role badges */}
        <div className="flex flex-wrap gap-2 justify-center mt-6">
          {Object.entries(ROLE_LABELS).map(([key, val]) => (
            <span key={key} className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${val.color}22`, color: val.color, border: `1px solid ${val.color}44` }}>
              {val.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
