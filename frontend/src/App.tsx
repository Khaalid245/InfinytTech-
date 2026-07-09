import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Layers, ArrowRight, Inbox, RefreshCw } from 'lucide-react';

// Primitives
import Heading from './components/ui/Heading';
import Text from './components/ui/Text';
import Label from './components/ui/Label';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import ServiceCard from './components/ui/ServiceCard';
import CaseStudyCard from './components/ui/CaseStudyCard';
import TestimonialCard from './components/ui/TestimonialCard';
import BlogCard from './components/ui/BlogCard';
import Input from './components/ui/Input';
import TextArea from './components/ui/TextArea';
import Select from './components/ui/Select';
import Checkbox from './components/ui/Checkbox';
import Badge from './components/ui/Badge';
import Tag from './components/ui/Tag';
import EmptyState from './components/ui/EmptyState';
import LoadingState from './components/ui/LoadingState';

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
import ServicesSection from './sections/ServicesSection';
import ProcessSection from './sections/ProcessSection';
import AboutSection from './sections/AboutSection';
import TestimonialSection from './sections/TestimonialSection';
import { GlobalSEO } from './components/seo/GlobalSEO';
import { BusinessStatisticsSection } from './sections/BusinessStatisticsSection';
import ClientLogosSection from './sections/ClientLogosSection';
import InteractiveCtaSection from './sections/InteractiveCtaSection';
import ContactSection from './sections/ContactSection';
import CTASection from './sections/CTASection';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import InsightsPage from './pages/InsightsPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import { useBlogPosts } from './hooks/useBlog';
import { resolveImageUrl } from './utils/imageHelper';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminBlogCategoriesPage from './pages/admin/AdminBlogCategoriesPage';
import AdminBlogTagsPage from './pages/admin/AdminBlogTagsPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminStubPage from './pages/admin/AdminStubPage';
import AdminLayout from './components/admin/layout/AdminLayout';
import { AuthProvider } from './contexts/AuthContext';

// Constants & Data
import {
  dummyServices,
  dummyCaseStudies,
  dummySteps,
} from './data/mockData';

const ShowcaseBlogGrid: React.FC = () => {
  const { data: postsData, isLoading } = useBlogPosts({ page_size: 2 });
  const posts = postsData?.results || [];

  if (isLoading) {
    return <div className="h-20 flex items-center justify-center text-caption text-secondary-text animate-pulse">Loading showcase blog cards...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BlogCard
          title="Scaling Tailwind CSS in Large-Scale Monorepos"
          excerpt="Strategies for avoiding utility class duplication, managing custom theme extensions with Tailwind v4, and defining rigid design systems."
          date="May 28, 2026"
          readTime="6 min read"
          category="Engineering"
        />
        <BlogCard
          title="The Case for Verbatim Module Syntax in TypeScript"
          excerpt="Why type-only imports lead to faster bundler compilation times and cleaner transpiled Javascript output in production React systems."
          date="April 15, 2026"
          readTime="4 min read"
          category="Architecture"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post, idx) => (
        <BlogCard
          key={idx}
          title={post.title}
          excerpt={post.excerpt}
          date={post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
          readTime={`${post.reading_time} min read`}
          imageUrl={resolveImageUrl(post.featured_image)}
          category={post.category?.name}
        />
      ))}
    </div>
  );
};

// Main Showcase View
const Showcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'primitives' | 'sections'>('primitives');
  const [tags, setTags] = useState(['React', 'TypeScript', 'Design Systems']);

  return (
    <div className="py-8 animate-fade-in">
      {/* Page Title & Navigation */}
      <Container size="lg">
        <div className="border-b border-border-primary pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Heading variant="h1" className="text-4xl md:text-5xl font-medium tracking-tight mb-3">
              Design System Showcase
            </Heading>
            <Text variant="body-large" className="text-secondary-text">
              An interactive blueprint of our premium enterprise-grade frontend architecture.
            </Text>
          </div>
          
          {/* Tab Selector */}
          <div className="flex gap-2 bg-surface-light border border-border-primary p-1 rounded-md self-start">
            <button
              onClick={() => setActiveTab('primitives')}
              className={`px-4 py-2 text-small font-medium rounded-sm transition-all cursor-pointer ${
                activeTab === 'primitives'
                  ? 'bg-primary-text text-primary-bg'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              UI Primitives
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 text-small font-medium rounded-sm transition-all cursor-pointer ${
                activeTab === 'sections'
                  ? 'bg-primary-text text-primary-bg'
                  : 'text-secondary-text hover:text-primary-text'
              }`}
            >
              Modular Sections
            </button>
          </div>
        </div>
      </Container>

      {/* RENDER PRIMITIVES SHOWCASE */}
      {activeTab === 'primitives' && (
        <Container size="lg" className="space-y-20 pb-20">
          
          {/* 1. Typography */}
          <div className="space-y-6">
            <Heading variant="h2" className="text-2xl border-b border-border-primary pb-3 mb-6">
              01 / Typography System
            </Heading>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Card variant="outline" className="space-y-6">
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Heading 1</span>
                  <Heading variant="h1" className="text-3xl sm:text-4xl lg:text-5xl">Design Longevity</Heading>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Heading 2</span>
                  <Heading variant="h2">Unifying engineering & design</Heading>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Heading 3</span>
                  <Heading variant="h3">Atomic component architectures</Heading>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Heading 4</span>
                  <Heading variant="h4">System specifications</Heading>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Label Component</span>
                  <Label htmlFor="typography-showcase-label" required>Required Form Label</Label>
                </div>
              </Card>
              
              <Card variant="outline" className="space-y-6">
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Body Large</span>
                  <Text variant="body-large">
                    We build digital product foundations that empower development velocity and foster design integrity.
                  </Text>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Body Standard</span>
                  <Text variant="body">
                    A clean, well-spaced, and highly functional body text structure suited for complex instructions, blogs, and detailed documentation readouts.
                  </Text>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Small Text</span>
                  <Text variant="small">
                    Strict, descriptive notes, forms placeholders, and auxiliary captions used for minor notifications.
                  </Text>
                </div>
                <div>
                  <span className="text-[10px] text-accent-primary uppercase font-bold tracking-widest block mb-2">Caption</span>
                  <Text variant="caption">
                    SYSTEM DECLARATION - VERSION 1.0.0
                  </Text>
                </div>
              </Card>
            </div>
          </div>

          {/* 2. Interactive Buttons */}
          <div className="space-y-6">
            <Heading variant="h2" className="text-2xl border-b border-border-primary pb-3 mb-6">
              02 / Buttons & Interactive States
            </Heading>
            <Card variant="outline" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Primary</span>
                <Button variant="primary" className="w-full">Primary Action</Button>
                <Button variant="primary" className="w-full" isLoading>Loading</Button>
                <Button variant="primary" className="w-full" disabled>Disabled</Button>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Secondary</span>
                <Button variant="secondary" className="w-full">Secondary</Button>
                <Button variant="secondary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>With Icon</Button>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Ghost</span>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
                <Button variant="ghost" className="w-full" leftIcon={<RefreshCw className="w-4 h-4" />}>With Icon</Button>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Text Link</span>
                <div className="flex flex-col items-start gap-4">
                  <Button variant="text">Read documentation</Button>
                  <Button variant="text" rightIcon={<ArrowRight className="w-4 h-4" />}>Explore engineering</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 3. Cards Showcase */}
          <div className="space-y-6">
            <Heading variant="h2" className="text-2xl border-b border-border-primary pb-3 mb-6">
              03 / Content Card Primitives
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block mb-3">Service Card</span>
                <ServiceCard
                  icon={Layers}
                  title="Modular Architectures"
                  description="We package components atomically to foster maximum layout customizability across the enterprise codebase."
                  href="#"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block mb-3">Testimonial Card</span>
                <TestimonialCard
                  quote="InfinytTech's architectural design patterns helped us standardise our global dashboards, shortening feature deployment from weeks to days."
                  author="Sarah Jenkins"
                  role="VP of Engineering"
                  company="Acme Corporation"
                />
              </div>
            </div>
            
            <div className="pt-6">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block mb-3">Case Study Card</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dummyCaseStudies.map((cs, idx) => (
                  <CaseStudyCard
                    key={idx}
                    {...cs}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block mb-3">Blog Post Card</span>
              <ShowcaseBlogGrid />
            </div>
          </div>

          {/* 4. Forms */}
          <div className="space-y-6">
            <Heading variant="h2" className="text-2xl border-b border-border-primary pb-3 mb-6">
              04 / Form Fields & Validation Layouts
            </Heading>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <Card variant="outline" className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="John" required />
                    <Input label="Last Name" placeholder="Doe" />
                  </div>
                  <Input label="Email Address" type="email" placeholder="john@doe.com" error="Please enter a valid business email." />
                  <Select
                    label="Requested Service"
                    options={[
                      { value: 'sys', label: 'Systems Engineering' },
                      { value: 'des', label: 'Experience Design' },
                    ]}
                  />
                  <TextArea label="Project Scope" placeholder="Outline timelines and dependencies..." />
                  <Checkbox
                    label="I agree to comply with enterprise-grade data security checks."
                    checked
                    onChange={() => {}}
                  />
                </Card>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-6 justify-center">
                <Card variant="flat" className="space-y-4">
                  <Heading variant="h4" className="text-base font-semibold">Validation States</Heading>
                  <Text variant="small" className="text-secondary-text">
                    Form elements are designed with semantic visual boundaries: focus transforms borders to absolute primary, and errors render high-contrast warning elements to prevent form submission issues.
                  </Text>
                </Card>
              </div>
            </div>
          </div>

          {/* 5. Feedback Indicators */}
          <div className="space-y-6">
            <Heading variant="h2" className="text-2xl border-b border-border-primary pb-3 mb-6">
              05 / Status Feedback & Taxonomy Tags
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card variant="outline" className="space-y-8">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Status Badges</span>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="primary">Stable</Badge>
                    <Badge variant="secondary">Draft</Badge>
                    <Badge variant="accent">Optimized</Badge>
                    <Badge variant="outline">Enterprise</Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Taxonomy Filter Tags</span>
                  <div className="flex flex-wrap gap-2.5">
                    {tags.map((tag) => (
                      <Tag
                        key={tag}
                        active
                        onRemove={() => setTags(tags.filter(t => t !== tag))}
                      >
                        {tag}
                      </Tag>
                    ))}
                    <Tag onClick={() => setTags([...tags, 'Node.js'])}>+ Add Tag</Tag>
                  </div>
                </div>
              </Card>

              <Card variant="outline" className="space-y-8 flex flex-col justify-center">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Skeleton Loader</span>
                  <LoadingState variant="skeleton" lines={3} />
                </div>
                
                <div className="space-y-3 border-t border-border-primary pt-6">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text block">Empty State Overlay</span>
                  <EmptyState
                    icon={Inbox}
                    title="No project inquiries"
                    description="When users fill in the contact form, their queries will render in this data panel."
                  />
                </div>
              </Card>
            </div>
          </div>

        </Container>
      )}

      {/* RENDER MODULAR SECTIONS SHOWCASE */}
      {activeTab === 'sections' && (
        <div className="border-t border-border-primary animate-fade-in">
          
          {/* A. Hero Section */}
          <HeroSection theme="dark" />

          {/* B. Services Section */}
          <ServicesSection
            tagline="Expertise"
            title="Premium solutions, engineered for scale."
            subtitle="We implement custom development workflows to build fast and highly maintainable web applications."
            services={dummyServices}
          />

          {/* C. Process Section */}
          <ProcessSection
            tagline="Methodology"
            title="Our engineering process."
            subtitle="Moving systematically from foundational tokens to comprehensive component layouts."
            steps={dummySteps}
          />

          {/* D. About Section */}
          <AboutSection
            tagline="About InfinytTech"
            title="Combining typography and architecture."
            paragraphs={[
              'InfinytTech was founded to address the widening gap between UI designers and frontend developers. We treat code as a direct extension of structural graphic design.',
              'We believe that modern web applications should load immediately, function flawlessly, and feature timeless layout principles inspired by premium European design bureaus.',
            ]}
            features={[
              { label: 'Dev velocity', value: '2.5x' },
              { label: 'Load speeds', value: '<1.2s' },
              { label: 'Unit coverage', value: '99%' },
              { label: 'Projects launched', value: '40+' },
            ]}
            imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
            imagePosition="right"
          />

          {/* E. Testimonial Section */}
          <TestimonialSection background="light" />

          {/* F. CTA Section */}
          <CTASection
            tagline="Get Started"
            title="Ready to build your design system?"
            subtitle="Partner with staff-level engineers to establish a clean and future-proof frontend architecture."
            ctas={[
              { label: 'Contact Advisors', variant: 'primary' },
              { label: 'Read Documentation', variant: 'secondary' },
            ]}
          />

          {/* G. Contact & Inquiries */}
          <ContactSection
            tagline="Contact Us"
            title="Partner with InfinytTech"
            subtitle="Have questions about code quality, setup timelines, or project budgeting? Write to our core team in London or Zurich."
            // Fallback to SITE_INFO.locations handled in ContactSection if needed
            locations={[]} 
          />
        </div>
      )}
    </div>
  );
};

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

const HomePage: FC<{ theme: 'dark' | 'light' }> = ({ theme }) => (
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
          title="Partner with InfinytTech"
          subtitle="Have questions about timelines or budgeting? Write to our core team."
          locations={[]}
        />
      </div>
    </FadeUp>
  </div>
);

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleThemeToggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <AuthProvider>
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
            <Route path="/showcase" element={<Showcase />} />
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
            <Route path="settings" element={<AdminStubPage title="Global Settings" description="Configure site-wide preferences, API keys, and metadata." />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="team" element={<AdminStubPage title="Team Members" description="Manage your organization's staff and member profiles." />} />
            <Route path="testimonials" element={<AdminStubPage title="Testimonials" description="Curate and organize reviews from your clients." />} />
            <Route path="leads" element={<AdminStubPage title="Leads CRM" description="Track inquiries and manage your sales pipeline." />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
