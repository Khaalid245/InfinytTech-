import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { CaseStudyCard } from '../components/ui/CaseStudyCard';
import type { CaseStudyCardProps } from '../components/ui/CaseStudyCard';
import { Tag } from '../components/ui/Tag';

export interface PortfolioSectionProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  projects: CaseStudyCardProps[];
  filterCategories?: string[];
  background?: 'primary' | 'light';
  className?: string;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  tagline,
  title,
  subtitle,
  projects,
  filterCategories = [],
  background = 'primary',
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const showFilters = filterCategories.length > 0;
  
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <Section
      background={background}
      padding="lg"
      className={className}
    >
      <Container size="lg">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <div className="max-w-2xl flex flex-col items-start">
            {tagline && (
              <span className="text-caption text-accent-primary font-semibold tracking-wider uppercase mb-3 block">
                {tagline}
              </span>
            )}
            <Heading
              variant="h2"
              className="mb-4 text-3xl md:text-4xl font-medium tracking-tight text-primary-text"
            >
              {title}
            </Heading>
            {subtitle && (
              <Text
                variant="body-large"
                className="text-secondary-text text-base md:text-lg"
              >
                {subtitle}
              </Text>
            )}
          </div>
          
          {/* Categories Filter Tags */}
          {showFilters && (
            <div className="flex flex-wrap gap-2.5 max-w-md self-start md:self-end">
              <Tag
                active={activeCategory === 'All'}
                onClick={() => setActiveCategory('All')}
              >
                All
              </Tag>
              {filterCategories.map((cat) => (
                <Tag
                  key={cat}
                  active={activeCategory.toLowerCase() === cat.toLowerCase()}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {filteredProjects.map((project, index) => (
            <CaseStudyCard
              key={index}
              {...project}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
export default PortfolioSection;
