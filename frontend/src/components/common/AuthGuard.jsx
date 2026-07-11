import { useEffect } from 'react';
import { useAuth } from '../../contexts';
import { useLocation } from 'react-router-dom';

// ── AuthGuard ─────────────────────────────────────────────────────────────────
// Wraps gated service pages (/services/buy, /sell, /lease, /management).
//
// Three states:
//  1. authLoading = true  → still checking /api/auth/me — show subtle loader
//  2. user = null         → not logged in — open auth modal, render nothing
//  3. user exists         → render children normally
// ─────────────────────────────────────────────────────────────────────────────
export default function AuthGuard({ children }) {
  const { user, authLoading, openAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Only open modal once we know the user is definitely not logged in
    if (!authLoading && !user) {
      openAuth(location.pathname);
    }
  }, [authLoading, user, openAuth, location.pathname]);

  // Still checking session — show a minimal non-jarring spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface pt-20">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
          >
            <span className="text-navy font-display font-black text-sm">HR</span>
          </div>
          <div className="w-32 h-0.5 rounded-full overflow-hidden bg-gray-200">
            <div
              className="h-full rounded-full animate-shimmer"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #E8C84A, #D4AF37)', backgroundSize: '200%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in — modal is open, nothing behind it
  if (!user) return null;

  return children;
}
