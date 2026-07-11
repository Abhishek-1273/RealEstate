import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { useAuth } from '../../contexts';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ROLE_LABELS = {
  admin:        { label: 'Admin', color: '#7C3AED' },
  management:   { label: 'Management', color: '#D4AF37' },
  client:       { label: 'Client', color: '#6B7280' },
};

export default function AdminLogin() {
  const { signIn } = useAuth();
  const { user }   = useAdmin();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      if (data.user.role === 'client') {
        setError('Access denied. This portal is for staff only.');
        return;
      }
      signIn(data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 8px 32px rgba(212,175,55,0.3)' }}>
            <span className="font-black text-navy text-xl" style={{ fontFamily: 'Manrope, sans-serif' }}>HR</span>
          </div>
          <h1 className="text-white font-black text-2xl mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Staff Portal
          </h1>
          <p className="text-white/40 text-sm">HyperRelestix Internal Panel</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wider uppercase">Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="block text-white/60 text-xs font-semibold mb-1.5 tracking-wider uppercase">Mobile Number</label>
              <input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="10-digit mobile number"
                type="tel"
                className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-navy text-sm transition-all duration-200 disabled:opacity-60"
              style={{ background: loading ? '#A8882B' : 'linear-gradient(135deg, #D4AF37, #E8C84A)', boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}>
              {loading ? 'Signing in…' : 'Sign In to Panel →'}
            </button>
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
          {Object.entries(ROLE_LABELS).filter(([k]) => k !== 'client').map(([key, val]) => (
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
