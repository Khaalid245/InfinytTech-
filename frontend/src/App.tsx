import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import InteractiveCtaSection from './sections/InteractiveCtaSection';
import ContactSection from './sections/ContactSection';
import CTASection from './sections/CTASection';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';

// Constants & Data
import { SITE_INFO } from './constants';
import {
  dummyServices,
  dummyCaseStudies,
  dummySteps,
  dummyTestimonials,
  dummyBlogPosts,
} from './data/mockData';

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {dummyBlogPosts.map((post, idx) => (
                  <BlogCard
                    key={idx}
                    {...post}
                  />
                ))}
              </div>
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
          <TestimonialSection
            tagline="Testimonials"
            title="Trusted by technology leaders."
            subtitle="Read how our frontend engineering architecture helps teams build products faster with bulletproof reliability."
            testimonials={dummyTestimonials}
            background="light"
          />

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
            locations={SITE_INFO.locations as any}
          />
        </div>
      )}
    </div>
  );
};

// ── Home page: hero first, then remaining sections ──────────────────────────
const HomePage: FC<{ theme: 'dark' | 'light' }> = ({ theme }) => (
  <div>
    <div id="hero">
      <HeroSection theme={theme} />
    </div>
    <div id="services">
      <ServiceExplorer theme={theme} />
    </div>
    <div id="portfolio">
      <FeaturedCaseStudies theme={theme} />
    </div>
    <div id="process">
      <WorkflowTimeline theme={theme} />
    </div>
    <WhyChooseUs theme={theme} />
    <div id="tech-stack">
      <TechStackSection theme={theme} />
    </div>
    <InteractiveCtaSection theme={theme} />
    <div id="blog">
      <TestimonialSection
        tagline="Testimonials"
        title="Trusted by technology leaders."
        subtitle="Read how our frontend engineering architecture helps teams build products faster."
        testimonials={dummyTestimonials}
        background="light"
      />
    </div>
    <div id="contact">
      <ContactSection
        tagline="Contact Us"
        title="Partner with InfinytTech"
        subtitle="Have questions about timelines or budgeting? Write to our core team."
        locations={SITE_INFO.locations as any}
      />
    </div>
  </div>
);

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleThemeToggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <PageLayout theme={theme} onThemeToggle={handleThemeToggle}>
        <Routes>
          <Route path="/" element={<HomePage theme={theme} />} />
          <Route path="/about" element={<AboutPage theme={theme} />} />
          <Route path="/services" element={<ServicesPage theme={theme} />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="*" element={<HomePage theme={theme} />} />
        </Routes>
      </PageLayout>
    </Router>
  );
};

export default App;
