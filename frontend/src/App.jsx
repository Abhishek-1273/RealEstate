import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { WishlistProvider, AuthProvider, SearchProvider } from './contexts';
import AppRoutes from './routes';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import PwaInstallPrompt from './components/common/PwaInstallPrompt';

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <WishlistProvider>
          <SearchProvider>
            <ErrorBoundary>
              <AppRoutes />
              <Analytics />
              <PwaInstallPrompt />
            </ErrorBoundary>
          </SearchProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;
