import { BrowserRouter } from 'react-router-dom';
import { WishlistProvider, AuthProvider, SearchProvider } from './contexts';
import AppRoutes from './routes';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/globals.css';

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <AuthProvider>
      <WishlistProvider>
        <SearchProvider>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </SearchProvider>
      </WishlistProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
