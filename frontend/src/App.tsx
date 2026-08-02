import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Heading from './components/ui/Heading';
import Text from './components/ui/Text';
import Button from './components/ui/Button';
import BlogCard from './components/ui/BlogCard';

// Layout & Navigation
import PageLayout from './components/layout/PageLayout';
import Container from './components/layout/Container';
import { useEffect } from 'react';
import { FadeUp } from './components/animation/FadeUp';
import { StaggerContainer, StaggerItem } from './components/animation/StaggerContainer';

// Sections
import HeroSection from './sections/HeroSection';
import FeaturedCaseStudies from './sections/FeaturedCaseStudies';
import ServiceExplorer from './sections/ServiceExplorer';
import WorkflowTimeline from './sections/WorkflowTimeline';
import WhyChooseUs from './sections/WhyChooseUs';
import TechStackSection from './sections/TechStackSection';
import type { FC } from 'react';
import TestimonialSection from './sections/TestimonialSection';
import { GlobalSEO } from './components/seo/GlobalSEO';
import { BusinessStatisticsSection } from './sections/BusinessStatisticsSection';
import ClientLogosSection from './sections/ClientLogosSection';
import InteractiveCtaSection from './sections/InteractiveCtaSection';
import ContactSection from './sections/ContactSection';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import InsightsPage from './pages/InsightsPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import { useBlogPosts } from './hooks/useBlog';
import { useSiteSettings } from './hooks/useSiteSettings';
import { resolveImageUrl } from './utils/imageHelper';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminBlogCategoriesPage from './pages/admin/AdminBlogCategoriesPage';
import AdminBlogTagsPage from './pages/admin/AdminBlogTagsPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminTeamPage from './pages/admin/team/AdminTeamPage';
import AdminTeamDepartmentsPage from './pages/admin/team/AdminTeamDepartmentsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminTestimonialsPage from './pages/admin/testimonials/AdminTestimonialsPage';
import AdminClientsPage from './pages/admin/testimonials/AdminClientsPage';
import AdminLeadsPage from './pages/admin/leads/AdminLeadsPage';
import AdminUsersPage from './pages/admin/users/AdminUsersPage';
import AdminRolesPage from './pages/admin/users/AdminRolesPage';
import SettingsLayout from './pages/admin/settings/SettingsLayout';
import GeneralSettings from './pages/admin/settings/GeneralSettings';
import BrandingSettings from './pages/admin/settings/BrandingSettings';
import ContactSettings from './pages/admin/settings/ContactSettings';
import SocialSettings from './pages/admin/settings/SocialSettings';
import SeoSettings from './pages/admin/settings/SeoSettings';
import EmailSettings from './pages/admin/settings/EmailSettings';
import SecuritySettings from './pages/admin/settings/SecuritySettings';
import SystemSettings from './pages/admin/settings/SystemSettings';
import AdminLayout from './components/admin/layout/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';


const RecentInsights: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const { data: postsData, isLoading } = useBlogPosts({ page_size: 3 });
  const posts = postsData?.results || [];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isDark = theme === 'dark';

  return (
    <section className="py-20 border-t border-border-primary">
      <Container size="lg">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-caption text-accent-primary uppercase font-bold tracking-widest block mb-3">
              Insights
            </span>
            <Heading variant="h2" className="text-3xl font-medium tracking-tight">
              Recent writing from our team.
            </Heading>
          </div>
          <Link to="/blog">
            <Button variant="secondary" className="py-2.5">
              View All Articles &rarr;
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className={`h-[380px] rounded-xl border p-5 flex flex-col justify-between animate-pulse ${
                isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-white border-slate-200'
              }`}>
                <div className="w-full h-40 bg-surface-light rounded-lg border border-border-primary mb-4" />
                <div className="space-y-3 flex-grow">
                  <div className="h-4 bg-surface-light rounded w-1/4" />
                  <div className="h-6 bg-surface-light rounded w-3/4" />
                </div>
                <div className="h-8 bg-surface-light rounded w-1/3 mt-4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 border border-border-primary border-dashed rounded-xl">
            <Text variant="body" className="text-secondary-text">No articles published yet.</Text>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <StaggerItem key={post.id}>
                <Link to={`/blog/${post.slug}`} className="block h-full">
                  <BlogCard
                  title={post.title}
                  excerpt={post.excerpt}
                  date={formatDate(post.published_at)}
                  readTime={`${post.reading_time} min read`}
                  imageUrl={resolveImageUrl(post.featured_image)}
                  category={post.category?.name}
                  href={`/blog/${post.slug}`}
                  className="h-full"
                />
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </Container>
    </section>
  );
};

const HomePage: FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
  const { data: settings } = useSiteSettings();
  return (
  <div>
    <FadeUp viewportAmount={0} duration={0.8}>
      <div id="hero">
        <HeroSection theme={theme} />
      </div>
    </FadeUp>
    <div id="statistics">
      <BusinessStatisticsSection theme={theme} />
    </div>
    <FadeUp viewportAmount={0.2} delay={0.1}>
      <div id="clients">
        <ClientLogosSection theme={theme} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="services">
        <ServiceExplorer theme={theme} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="portfolio">
        <FeaturedCaseStudies theme={theme} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="process">
        <WorkflowTimeline theme={theme} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <WhyChooseUs theme={theme} />
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="testimonials">
        <TestimonialSection background={theme === 'dark' ? 'primary' : 'light'} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="tech-stack">
        <TechStackSection theme={theme} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <InteractiveCtaSection theme={theme} />
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="blog">
        <RecentInsights theme={theme} />
      </div>
    </FadeUp>
    <FadeUp viewportAmount={0.1}>
      <div id="contact">
        <ContactSection
          tagline="Contact Us"
          title={`Partner with ${settings?.company_name || 'our team'}`}
          subtitle="Have questions about timelines or budgeting? Write to our core team."
          locations={[]}
        />
      </div>
    </FadeUp>
  </div>
);
};

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
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
              <Outlet />
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
            <Route path="*" element={<HomePage theme={theme} />} />
          </Route>

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Outlet />
              </AdminLayout>
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
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
