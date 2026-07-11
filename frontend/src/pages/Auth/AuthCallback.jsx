import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts';
import { Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received from Google.');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    const exchangeCode = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/google/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'OAuth token exchange failed');
        }

        signIn(data.user);
        navigate('/');
      } catch (err) {
        console.error('Google OAuth error:', err);
        setError(err.message || 'Google authentication failed.');
        setTimeout(() => navigate('/'), 4000);
      }
    };

    exchangeCode();
  }, [searchParams, signIn, navigate]);

  return (
    <div className="min-h-screen bg-[#071A2F] flex flex-col items-center justify-center text-white px-4 text-center">
      <div className="max-w-md w-full rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              !
            </div>
            <h2 className="text-lg font-bold text-red-300">Authentication Failed</h2>
            <p className="text-xs text-white/50">{error}</p>
            <p className="text-[10px] text-white/30">Redirecting you home...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto" />
            <h2 className="text-lg font-bold text-white tracking-tight">Authenticating with Google</h2>
            <p className="text-xs text-white/50">Securing your premium real estate account connection...</p>
          </div>
        )}
      </div>
    </div>
  );
}
