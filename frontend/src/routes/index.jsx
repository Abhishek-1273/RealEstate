import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageLoader from '../components/common/PageLoader';
import AuthGuard from '../components/common/AuthGuard';
import { AdminProvider, useAdmin } from '../pages/Admin/AdminContext';

// ── Public pages ──────────────────────────────────────────────────────────────
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
const PrivacyPolicy   = lazy(() => import('../pages/Legal/PrivacyPolicy'));
const TermsOfService  = lazy(() => import('../pages/Legal/TermsOfService'));
const AuthCallback    = lazy(() => import('../pages/Auth/AuthCallback'));

// ── Admin panel pages ─────────────────────────────────────────────────────────
const AdminLogin      = lazy(() => import('../pages/Admin/AdminLogin'));
const AdminLayout     = lazy(() => import('../pages/Admin/AdminLayout'));
const Dashboard       = lazy(() => import('../pages/Admin/Dashboard'));
const BlogsAdmin      = lazy(() => import('../pages/Admin/BlogsAdmin'));
const PropertiesAdmin = lazy(() => import('../pages/Admin/PropertiesAdmin'));
const UsersAdmin      = lazy(() => import('../pages/Admin/UsersAdmin'));
const PartnersAdmin   = lazy(() => import('../pages/Admin/PartnersAdmin'));

// ── Guard: redirect to login if not staff ─────────────────────────────────────
function PanelGuard({ children, requiredRoles }) {
  const { user, loading } = useAdmin();
  if (loading) return <PageLoader />;
  if (!user || (user.role !== 'admin' && user.role !== 'management')) {
    return <Navigate to="/admin/login" replace />;
  }
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Main public site ─────────────────────────────────────────────── */}
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
          <Route path="services/buy"        element={<AuthGuard><BuyProperty /></AuthGuard>} />
          <Route path="services/sell"       element={<AuthGuard><SellProperty /></AuthGuard>} />
          <Route path="services/lease"      element={<AuthGuard><LeaseProperty /></AuthGuard>} />
          <Route path="services/management" element={<AuthGuard><PropertyMgmt /></AuthGuard>} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ── Admin panel ───────────────────────────────────────────────────── */}
        <Route path="/admin/*" element={
          <AdminProvider>
            <Routes>
              <Route path="login" element={<AdminLogin />} />
              <Route path="" element={
                <PanelGuard>
                  <AdminLayout />
                </PanelGuard>
              }>
                {/* Dashboard — admin + management */}
                <Route path="dashboard" element={
                  <PanelGuard requiredRoles={['admin','management']}>
                    <Dashboard />
                  </PanelGuard>
                } />



                {/* Blog Manager — admin + management */}
                <Route path="blogs" element={
                  <PanelGuard requiredRoles={['admin','management']}>
                    <BlogsAdmin />
                  </PanelGuard>
                } />

                {/* Properties — admin + management */}
                <Route path="properties" element={
                  <PanelGuard requiredRoles={['admin','management']}>
                    <PropertiesAdmin />
                  </PanelGuard>
                } />

                {/* Partners — admin + management */}
                <Route path="partners" element={
                  <PanelGuard requiredRoles={['admin','management']}>
                    <PartnersAdmin />
                  </PanelGuard>
                } />

                {/* Users — admin only */}
                <Route path="users" element={
                  <PanelGuard requiredRoles={['admin']}>
                    <UsersAdmin />
                  </PanelGuard>
                } />

                {/* Default redirect */}
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Routes>
          </AdminProvider>
        } />
      </Routes>
    </Suspense>
  );
}
