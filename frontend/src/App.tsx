import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoadingState from './components/ui/LoadingState';

// Layout & Global Components
import PageLayout from './components/layout/PageLayout';
import { GlobalSEO } from './components/seo/GlobalSEO';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

// Public Pages (Code Split)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const BlogPostDetailPage = lazy(() => import('./pages/BlogPostDetailPage'));

// Admin Pages (Code Split)
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminLayout = lazy(() => import('./components/admin/layout/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminPortfolioPage = lazy(() => import('./pages/admin/AdminPortfolioPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminBlogCategoriesPage = lazy(() => import('./pages/admin/AdminBlogCategoriesPage'));
const AdminBlogTagsPage = lazy(() => import('./pages/admin/AdminBlogTagsPage'));
const AdminMediaPage = lazy(() => import('./pages/admin/AdminMediaPage'));
const AdminTeamPage = lazy(() => import('./pages/admin/team/AdminTeamPage'));
const AdminTeamDepartmentsPage = lazy(() => import('./pages/admin/team/AdminTeamDepartmentsPage'));
const AdminTestimonialsPage = lazy(() => import('./pages/admin/testimonials/AdminTestimonialsPage'));
const AdminClientsPage = lazy(() => import('./pages/admin/testimonials/AdminClientsPage'));
const AdminLeadsPage = lazy(() => import('./pages/admin/leads/AdminLeadsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/users/AdminUsersPage'));
const AdminRolesPage = lazy(() => import('./pages/admin/users/AdminRolesPage'));
const SettingsLayout = lazy(() => import('./pages/admin/settings/SettingsLayout'));
const GeneralSettings = lazy(() => import('./pages/admin/settings/GeneralSettings'));
const BrandingSettings = lazy(() => import('./pages/admin/settings/BrandingSettings'));
const ContactSettings = lazy(() => import('./pages/admin/settings/ContactSettings'));
const SocialSettings = lazy(() => import('./pages/admin/settings/SocialSettings'));
const SeoSettings = lazy(() => import('./pages/admin/settings/SeoSettings'));
const EmailSettings = lazy(() => import('./pages/admin/settings/EmailSettings'));
const SecuritySettings = lazy(() => import('./pages/admin/settings/SecuritySettings'));
const SystemSettings = lazy(() => import('./pages/admin/settings/SystemSettings'));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8">
    <LoadingState variant="spinner" />
  </div>
);

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <GlobalSEO />
        <Routes>
          {/* Public Routes with PageLayout */}
          <Route element={
            <PageLayout theme={theme} onThemeToggle={handleThemeToggle}>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Outlet />
              </Suspense>
            </PageLayout>
          }>
            <Route path="/" element={<HomePage theme={theme} />} />
            <Route path="/about" element={<AboutPage theme={theme} />} />
            <Route path="/services" element={<ServicesPage theme={theme} />} />
            <Route path="/work" element={<WorkPage theme={theme} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<InsightsPage theme={theme} />} />
            <Route path="/blog/:slug" element={<BlogPostDetailPage theme={theme} />} />
            <Route path="/insights" element={<InsightsPage theme={theme} />} />
            <Route path="/insights/:slug" element={<BlogPostDetailPage theme={theme} />} />

            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <AdminLayout>
                  <Suspense fallback={<RouteLoadingFallback />}>
                    <Outlet />
                  </Suspense>
                </AdminLayout>
              </Suspense>
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="portfolio" element={<AdminPortfolioPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="blog">
              <Route index element={<AdminBlogPage />} />
              <Route path="categories" element={<AdminBlogCategoriesPage />} />
              <Route path="tags" element={<AdminBlogTagsPage />} />
            </Route>
            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<GeneralSettings />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="branding" element={<BrandingSettings />} />
              <Route path="contact" element={<ContactSettings />} />
              <Route path="social" element={<SocialSettings />} />
              <Route path="seo" element={<SeoSettings />} />
              <Route path="email" element={<EmailSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="system" element={<SystemSettings />} />
            </Route>
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="team">
              <Route index element={<AdminTeamPage />} />
              <Route path="departments" element={<AdminTeamDepartmentsPage />} />
            </Route>
            <Route path="testimonials">
              <Route index element={<AdminTestimonialsPage />} />
            </Route>
            <Route path="clients" element={<AdminClientsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="users">
              <Route index element={<AdminUsersPage />} />
            </Route>
            <Route path="roles" element={<AdminRolesPage />} />
            <Route path="profile" element={<Navigate to="/admin/settings" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
