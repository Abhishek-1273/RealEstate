import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

const WishlistContext = createContext(null);
const AuthContext     = createContext(null);
const SearchContext   = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
// Wishlist Provider
// ─────────────────────────────────────────────────────────────────────────────
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext) || {};

  // Load wishlist from database on mount / login
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    const loadWishlist = async () => {
      try {
        const token = localStorage.getItem('hr_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/auth/wishlist`, {
          headers,
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setWishlist(data.wishlist);
        }
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      }
    };
    loadWishlist();
  }, [user]);

  const toggleWishlist = useCallback(async (property) => {
    const propId = property._id || property.id;
    
    // Optimistic local update
    setWishlist(prev => {
      const exists = prev.find(p => (p._id || p.id) === propId);
      return exists ? prev.filter(p => (p._id || p.id) !== propId) : [...prev, property];
    });

    if (user) {
      try {
        const token = localStorage.getItem('hr_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/auth/wishlist/toggle`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ propertyId: propId }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setWishlist(data.wishlist);
        }
      } catch (err) {
        console.error('Failed to sync wishlist:', err);
      }
    }
  }, [user]);

  const isWishlisted = useCallback(
    (id) => wishlist.some(p => (p._id || p.id) === id),
    [wishlist]
  );

  const clearWishlist = useCallback(() => setWishlist([]), []);

  // Auto-clear wishlist when user signs out
  useEffect(() => {
    const handler = () => setWishlist([]);
    window.addEventListener('auth:signout', handler);
    return () => window.removeEventListener('auth:signout', handler);
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted, clearWishlist, count: wishlist.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth Provider  (JWT httpOnly cookie — persists across refreshes)
// ─────────────────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]                   = useState(null);
  const [authLoading, setAuthLoading]     = useState(true); // true until /me check completes
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);

  // ── Restore session on every app mount / page refresh ──────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const localToken = localStorage.getItem('hr_token');
        const headers = {};
        if (localToken) {
          headers['Authorization'] = `Bearer ${localToken}`;
        }

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers,
          credentials: 'include', // send the httpOnly cookie
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setUser(data.user);
        } else {
          if (localToken) localStorage.removeItem('hr_token');
        }
      } catch {
        // No session or server unreachable — stay logged out silently
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Auth modal helpers ──────────────────────────────────────────────────────
  const openAuth = useCallback((redirectPath = null) => {
    setPendingRedirect(redirectPath);
    setShowAuthModal(true);
  }, []);

  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  // Called after a successful /signin response — user object comes from backend
  const signIn = useCallback((userData, token = null) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('hr_token', token);
    }
    setShowAuthModal(false);
  }, []);

  // Sign out — calls backend to clear the httpOnly cookie, then clears local state
  const signOut = useCallback(async () => {
    try {
      const localToken = localStorage.getItem('hr_token');
      const headers = {};
      if (localToken) {
        headers['Authorization'] = `Bearer ${localToken}`;
      }

      await fetch(`${API_URL}/api/auth/signout`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch {
      // Ignore network errors — clear local state regardless
    }
    setUser(null);
    localStorage.removeItem('hr_token');
    // Notify other providers (WishlistProvider) to clear their state
    window.dispatchEvent(new Event('auth:signout'));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        showAuthModal,
        pendingRedirect,
        openAuth,
        closeAuth,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Search Provider
// ─────────────────────────────────────────────────────────────────────────────
export const SearchProvider = ({ children }) => {
  const [showSearch, setShowSearch]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Penthouse KP',
    'Villa Balewadi',
    'Luxury flat Kharadi',
  ]);

  const addRecentSearch = useCallback((query) => {
    setRecentSearches(prev =>
      [query, ...prev.filter(s => s !== query)].slice(0, 5)
    );
  }, []);

  return (
    <SearchContext.Provider
      value={{ showSearch, setShowSearch, searchQuery, setSearchQuery, recentSearches, addRecentSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};
