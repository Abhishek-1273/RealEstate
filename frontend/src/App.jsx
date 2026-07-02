import { BrowserRouter } from 'react-router-dom';
import { WishlistProvider, AuthProvider, SearchProvider } from './contexts';
import AppRoutes from './routes';
import ScrollToTop from './components/common/ScrollToTop';
import './styles/globals.css';

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <AuthProvider>
      <WishlistProvider>
        <SearchProvider>
          <AppRoutes />
        </SearchProvider>
      </WishlistProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
