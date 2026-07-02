import { useEffect } from 'react';
import { useAuth } from '../../contexts';
import { useLocation } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const { user, openAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // Trigger the authentication modal, passing the target path for post-login redirect
      openAuth(location.pathname);
    }
  }, [user, openAuth, location]);

  if (!user) {
    // Stay on the same URL with no content while the modal is open —
    // no route flash, no scroll jump. This only matters for someone
    // directly typing/bookmarking a gated URL; normal clicks never
    // reach here because Services/Navbar/Footer intercept before navigating.
    return null;
  }

  return children;
}
