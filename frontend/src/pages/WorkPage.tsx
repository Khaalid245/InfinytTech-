import React from 'react';
import PortfolioHero from '../sections/PortfolioHeroSection';
import FeaturedCaseStudies from '../sections/FeaturedCaseStudies';
import PortfolioImpactSummary from '../sections/PortfolioImpactSummary';
import PortfolioGridSection from '../sections/PortfolioGridSection';
import PortfolioOutcomesSection from '../sections/PortfolioOutcomesSection';
import PortfolioCtaSection from '../sections/PortfolioCtaSection';
import { SchemaOrg } from '../components/seo/SchemaOrg';
import Breadcrumb from '../components/ui/Breadcrumb';
import Container from '../components/layout/Container';

interface WorkPageProps {
  theme: 'dark' | 'light';
}

export const WorkPage: React.FC<WorkPageProps> = ({ theme }) => {
  return (
    <div className="animate-fade-in">
      <SchemaOrg
        breadcrumbs={[
          { name: 'Portfolio & Case Studies', url: '/work' },
        ]}
        schema={{
          '@type': 'CollectionPage',
          name: 'Portfolio & Engineering Case Studies',
          description: 'Explore enterprise software architectures, mobile platforms, and AI systems built by Infinity Technologies.',
        }}
      />

      <div className="pt-24 pb-2 border-b border-border-primary/40 bg-surface-muted/30">
        <Container size="lg">
          <Breadcrumb
            theme={theme}
            items={[{ label: 'Portfolio & Case Studies', href: '/work', isCurrent: true }]}
          />
        </Container>
      </div>

      {/* 1. Portfolio Hero Section */}
      <PortfolioHero theme={theme} />

      {/* 2. Featured Projects Grid */}
      <div id="portfolio">
        <FeaturedCaseStudies theme={theme} />
      </div>

      {/* 3. Project Impact Summary */}
      <PortfolioImpactSummary theme={theme} />

      {/* 4. Project Explorer & Library Grid */}
      <PortfolioGridSection theme={theme} />

      {/* 5. Results & Technologies */}
      <PortfolioOutcomesSection theme={theme} />

      {/* 6. Call to Action */}
      <PortfolioCtaSection theme={theme} />
    </div>
  );
};

export default WorkPage;
