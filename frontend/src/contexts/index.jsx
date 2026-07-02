import { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext(null);
const AuthContext = createContext(null);
const SearchContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = useCallback((property) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === property.id);
      return exists ? prev.filter(p => p.id !== property.id) : [...prev, property];
    });
  }, []);

  const isWishlisted = useCallback((id) => {
    return wishlist.some(p => p.id === id);
  }, [wishlist]);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, clearWishlist, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);

  const openAuth = (redirectPath = null) => {
    setPendingRedirect(redirectPath);
    setShowAuthModal(true);
  };

  const closeAuth = () => setShowAuthModal(false);

  const signIn = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, showAuthModal, pendingRedirect, openAuth, closeAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const SearchProvider = ({ children }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['Penthouse Koregaon Park', 'Villa Baner', 'Luxury flat Kharadi']);

  const addRecentSearch = (query) => {
    setRecentSearches(prev => [query, ...prev.filter(s => s !== query)].slice(0, 5));
  };

  return (
    <SearchContext.Provider value={{ showSearch, setShowSearch, searchQuery, setSearchQuery, recentSearches, addRecentSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

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
