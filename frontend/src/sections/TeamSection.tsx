// ─── src/sections/TeamSection.tsx ─────────────────────────────────────────────
import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { TeamMemberCard } from '../components/ui/TeamMemberCard';
import { TeamMemberModal } from '../components/ui/TeamMemberModal';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useDepartments, useTeamMembers } from '../hooks/useTeam';
import { cn } from '../utils/cn';
import type { TeamMember } from '../types/team';

interface TeamSectionProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  theme = 'dark',
  className,
}) => {
  const isDark = theme === 'dark';
  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Fetch all members count for 'All' pill
  const { data: allMembersData } = useTeamMembers();

  // Fetch departments for filter tags
  const { data: departments } = useDepartments();
  
  // Fetch filtered team members
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
  const totalCount = allMembersData?.count ?? allMembersData?.results?.length ?? members.length;

  const bg      = isDark ? '#0B0D0F' : '#FAFAFA';
  const border  = isDark ? '#23262D' : '#E2E8F0';
  const accent  = isDark ? '#D4A017' : '#B8860B';
  const primary = isDark ? '#F8FAFC' : '#0F172A';
  const sub     = isDark ? '#94A3B8' : '#475569';

  return (
    <section 
      style={{ background: bg }}
      className={cn("py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300", className)}
      aria-label="Executive Leadership and Engineering Team"
    >
      <Container size="lg">
        {/* 1. Header & Dynamic Measurable Filters Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl flex flex-col items-start space-y-4">
            {/* Eyebrow Capsule */}
            <div className="inline-flex">
              <span 
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-300"
                style={{
                  background:  isDark ? '#181B1F' : '#F1F5F9',
                  borderColor: border,
                  color:       accent,
                }}
              >
                OUR LEADERSHIP
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
              style={{ color: primary }}
            >
              Meet the Team
            </h2>

            <p
              className="text-sm sm:text-base font-light leading-relaxed max-w-xl"
              style={{ color: sub }}
            >
              A collective of elite engineers, architects, and strategists dedicated to driving your digital transformation.
            </p>
          </div>
          
          {/* 2. Filter Pills with Dynamic Measurable Counts */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 max-w-xl self-start lg:self-end">
              <button
                type="button"
                onClick={() => setActiveDepartment('All')}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 flex items-center gap-2 cursor-pointer select-none',
                  activeDepartment === 'All'
                    ? isDark 
                      ? 'bg-[#D4A017]/15 border-[#D4A017] text-[#D4A017] shadow-[0_0_15px_rgba(212,160,23,0.15)]'
                      : 'bg-[#B8860B]/10 border-[#B8860B] text-[#B8860B]'
                    : isDark
                      ? 'bg-[#121417] border-[#23262D] text-[#94A3B8] hover:border-[#3A3F4A] hover:text-[#F8FAFC]'
                      : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300 hover:text-slate-900'
                )}
              >
                <span>All</span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none',
                  activeDepartment === 'All'
                    ? isDark ? 'bg-[#D4A017]/30 text-[#D4A017]' : 'bg-[#B8860B]/20 text-[#B8860B]'
                    : isDark ? 'bg-[#181B1F] text-slate-400' : 'bg-slate-100 text-slate-500'
                )}>
                  {totalCount}
                </span>
              </button>

              {filterCategories.map((dept) => {
                const count = dept.members_count ?? allMembersData?.results?.filter(m => m.department?.id === dept.id || m.department?.slug === dept.slug).length;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => setActiveDepartment(dept.slug)}
                    className={cn(
                      'px-4 py-2 rounded-full text-xs font-semibold tracking-wide border capitalize transition-all duration-300 flex items-center gap-2 cursor-pointer select-none',
                      activeDepartment === dept.slug
                        ? isDark 
                          ? 'bg-[#D4A017]/15 border-[#D4A017] text-[#D4A017] shadow-[0_0_15px_rgba(212,160,23,0.15)]'
                          : 'bg-[#B8860B]/10 border-[#B8860B] text-[#B8860B]'
                        : isDark
                          ? 'bg-[#121417] border-[#23262D] text-[#94A3B8] hover:border-[#3A3F4A] hover:text-[#F8FAFC]'
                          : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300 hover:text-slate-900'
                    )}
                  >
                    <span>{dept.name}</span>
                    {count !== undefined && (
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none',
                        activeDepartment === dept.slug
                          ? isDark ? 'bg-[#D4A017]/30 text-[#D4A017]' : 'bg-[#B8860B]/20 text-[#B8860B]'
                          : isDark ? 'bg-[#181B1F] text-slate-400' : 'bg-slate-100 text-slate-500'
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Team Member Cards Grid Area */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                theme={theme}
                onClick={setSelectedMember}
              />
            ))}
          </div>
        )}
      </Container>

      {/* 4. Team Member Detail Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
};

export default TeamSection;
