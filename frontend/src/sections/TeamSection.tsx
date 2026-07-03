// ─── src/sections/TeamSection.tsx ─────────────────────────────────────────────
import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Tag } from '../components/ui/Tag';
import { TeamMemberCard } from '../components/ui/TeamMemberCard';
import { TeamMemberModal } from '../components/ui/TeamMemberModal';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useDepartments, useTeamMembers } from '../hooks/useTeam';
import type { TeamMember } from '../types/team';

interface TeamSectionProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  theme = 'light',
  className,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Fetch departments for filter tags
  const { data: departments } = useDepartments();
  
  // Fetch team members (passing department slug if not "All")
  const { 
    data: membersData, 
    isLoading, 
    isError 
  } = useTeamMembers({ 
    department: activeDepartment !== 'All' ? activeDepartment : undefined 
  });

  const members = membersData?.results || [];
  const filterCategories = departments || [];
  const showFilters = filterCategories.length > 0;

  return (
    <Section
      background={theme === 'dark' ? 'primary' : 'light'}
      padding="lg"
      className={className}
    >
      <Container size="lg">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl flex flex-col items-start">
            <span className="text-caption text-accent-primary font-semibold tracking-wider uppercase mb-3 block">
              Our Leadership
            </span>
            <Heading
              variant="h2"
              className="mb-4 text-3xl md:text-4xl font-medium tracking-tight text-primary-text"
            >
              Meet the Team
            </Heading>
            <Text
              variant="body-large"
              className="text-secondary-text text-base md:text-lg"
            >
              A collective of engineers, designers, and strategists dedicated to driving your digital transformation.
            </Text>
          </div>
          
          {/* Categories Filter Tags */}
          {showFilters && (
            <div className="flex flex-wrap gap-2.5 max-w-md self-start md:self-end">
              <Tag
                active={activeDepartment === 'All'}
                onClick={() => setActiveDepartment('All')}
              >
                All
              </Tag>
              {filterCategories.map((dept) => (
                <Tag
                  key={dept.id}
                  active={activeDepartment === dept.slug}
                  onClick={() => setActiveDepartment(dept.slug)}
                >
                  {dept.name}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="py-24 flex justify-center">
            <LoadingState />
          </div>
        ) : isError ? (
          <EmptyState 
            title="Unable to load team"
            description="We encountered an issue while loading the team directory. Please try again later."
          />
        ) : members.length === 0 ? (
          <EmptyState 
            title="No team members found"
            description="There are currently no team members listed in this department."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onClick={setSelectedMember}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </Section>
  );
};

export default TeamSection;
