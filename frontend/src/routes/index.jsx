import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageLoader from '../components/common/PageLoader';
import AuthGuard from '../components/common/AuthGuard';

const Home            = lazy(() => import('../pages/Home/Home'));
const Properties      = lazy(() => import('../pages/Properties/Properties'));
const PropertyDetails = lazy(() => import('../pages/PropertyDetails/PropertyDetails'));
const About           = lazy(() => import('../pages/About/About'));
const Blog            = lazy(() => import('../pages/Blog/Blog'));
const BlogDetails     = lazy(() => import('../pages/BlogDetails/BlogDetails'));
const Contact         = lazy(() => import('../pages/Contact/Contact'));
const Wishlist        = lazy(() => import('../pages/Wishlist/Wishlist'));
const NotFound        = lazy(() => import('../pages/NotFound/NotFound'));
const BuyProperty     = lazy(() => import('../pages/Services/BuyProperty'));
const SellProperty    = lazy(() => import('../pages/Services/SellProperty'));
const LeaseProperty   = lazy(() => import('../pages/Services/LeaseProperty'));
const PropertyMgmt    = lazy(() => import('../pages/Services/PropertyManagement'));
const ServicesIndex   = lazy(() => import('../pages/Services/Services'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="properties" element={<Properties />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="services" element={<ServicesIndex />} />
          <Route path="services/buy" element={<AuthGuard><BuyProperty /></AuthGuard>} />
          <Route path="services/sell" element={<AuthGuard><SellProperty /></AuthGuard>} />
          <Route path="services/lease" element={<AuthGuard><LeaseProperty /></AuthGuard>} />
          <Route path="services/management" element={<AuthGuard><PropertyMgmt /></AuthGuard>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
