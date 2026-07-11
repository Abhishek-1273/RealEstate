/**
 * AdminContext — wraps the main site's AuthContext
 * Ek hi JWT cookie, ek hi session.
 * Admin panel sirf role check karta hai — alag login nahi.
 */
import { createContext, useContext } from 'react';
import { useAuth } from '../../contexts';

const AdminCtx = createContext(null);

export function AdminProvider({ children }) {
  // Reuse the same auth session from the main site
  const { user, authLoading, signOut } = useAuth();

  const isAdmin    = user?.role === 'admin';
  const isMgmt     = ['admin', 'management'].includes(user?.role);
  const isLeadCtrl = ['admin', 'management'].includes(user?.role);
  const isStaff    = !!user && user.role !== 'client';

  return (
    <AdminCtx.Provider value={{ user, loading: authLoading, signOut, isAdmin, isMgmt, isLeadCtrl, isStaff }}>
      {children}
    </AdminCtx.Provider>
  );
}

export const useAdmin = () => {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
};
