import React from 'react';
import PortfolioHero from '../sections/PortfolioHeroSection';
import FeaturedCaseStudies from '../sections/FeaturedCaseStudies';
import PortfolioImpactSummary from '../sections/PortfolioImpactSummary';
import PortfolioGridSection from '../sections/PortfolioGridSection';
import PortfolioOutcomesSection from '../sections/PortfolioOutcomesSection';
import PortfolioCtaSection from '../sections/PortfolioCtaSection';

interface WorkPageProps {
  theme: 'dark' | 'light';
}

export const WorkPage: React.FC<WorkPageProps> = ({ theme }) => {
  return (
    <div className="animate-fade-in">
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
