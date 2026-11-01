import React from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import Heading from '../components/ui/Heading';
import Text from '../components/ui/Text';
import Button from '../components/ui/Button';
import BlogCard from '../components/ui/BlogCard';
import Container from '../components/layout/Container';
import { FadeUp } from '../components/animation/FadeUp';
import { StaggerContainer, StaggerItem } from '../components/animation/StaggerContainer';

// Sections
import HeroSection from '../sections/HeroSection';
import FeaturedCaseStudies from '../sections/FeaturedCaseStudies';
import ServiceExplorer from '../sections/ServiceExplorer';
import WorkflowTimeline from '../sections/WorkflowTimeline';
import WhyChooseUs from '../sections/WhyChooseUs';
import TechStackSection from '../sections/TechStackSection';
import TestimonialSection from '../sections/TestimonialSection';
import { BusinessStatisticsSection } from '../sections/BusinessStatisticsSection';
import ClientLogosSection from '../sections/ClientLogosSection';
import InteractiveCtaSection from '../sections/InteractiveCtaSection';
import ContactSection from '../sections/ContactSection';
import { useBlogPosts } from '../hooks/useBlog';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { resolveImageUrl } from '../utils/imageHelper';
import { SchemaOrg } from '../components/seo/SchemaOrg';

interface HomePageProps {
  theme: 'dark' | 'light';
}

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
              <div
                key={idx}
                className={`h-[380px] rounded-xl border p-5 flex flex-col justify-between animate-pulse ${
                  isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-white border-slate-200'
                }`}
              >
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
            <Text variant="body" className="text-secondary-text">
              No articles published yet.
            </Text>
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

export const HomePage: FC<HomePageProps> = ({ theme }) => {
  const { data: settings } = useSiteSettings();
  return (
    <div>
      <SchemaOrg
        schema={{
          '@type': 'WebSite',
          name: settings?.company_name || 'Infinity Technologies',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          description: settings?.company_description || settings?.default_meta_description || 'Enterprise Software Engineering and AI Transformation.',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${typeof window !== 'undefined' ? window.location.origin : ''}/work?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
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

export default HomePage;
