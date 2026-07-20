import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { WishlistProvider, AuthProvider, SearchProvider } from './contexts';
import { SettingsProvider } from './contexts/SettingsContext';
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
      <SettingsProvider>
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
      </SettingsProvider>
    </BrowserRouter>
  </HelmetProvider>
);

export default App;

