// ─── src/components/ui/TeamMemberCard.tsx ─────────────────────────────────────
import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { TeamMember } from '../../types/team';
import { Image } from './Image';

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GitHubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface TeamMemberCardProps {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
  theme?: 'dark' | 'light';
  className?: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  onClick, 
  theme = 'dark',
  className 
}) => {
  const isDark = theme === 'dark';

  // Graceful fallback for missing photo
  const photoUrl = member.photo?.file || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.full_name)}&background=181B1F&color=D4A017&size=512`;

  return (
    <div 
      className={cn(
        'group relative rounded-3xl border transition-all duration-500 ease-out flex flex-col h-full overflow-hidden cursor-pointer',
        'hover:-translate-y-2',
        isDark 
          ? 'bg-[#121417] border-[#23262D] hover:border-[#D4A017]/50 hover:shadow-[0_20px_40px_-15px_rgba(212,160,23,0.18)]' 
          : 'bg-white border-[#E2E8F0] hover:border-[#B8860B]/50 hover:shadow-2xl',
        className
      )}
      onClick={() => onClick(member)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(member);
        }
      }}
    >
      {/* 1. Photo Container with Framing & Aspect Ratio */}
      <div className="p-3 pb-0">
        <div className={cn(
          'relative aspect-[4/5] w-full rounded-2xl overflow-hidden',
          isDark ? 'bg-[#181B1F]' : 'bg-slate-100'
        )}>
          <Image 
            src={photoUrl} 
            alt={member.full_name} 
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          />

          {/* Smooth bottom vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

          {/* Floating Department Badge */}
          {member.department && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/10 text-[#D4A017] shadow-sm">
                {member.department.name}
              </span>
            </div>
          )}

          {/* Quick Social Action Icons (Floating top-right) */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 opacity-90 transition-opacity">
            {member.linkedin_url && (
              <a
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#0077b5] hover:bg-black/90 transition-all duration-200"
                aria-label={`${member.full_name} on LinkedIn`}
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {member.github_url && (
              <a
                href={member.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black/90 transition-all duration-200"
                aria-label={`${member.full_name} on GitHub`}
              >
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {member.website_url && (
              <a
                href={member.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-slate-300 hover:text-[#D4A017] hover:bg-black/90 transition-all duration-200"
                aria-label={`${member.full_name} website`}
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* 2. Card Content & Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        {/* Name & Position */}
        <div className="mb-3">
          <h3 className={cn(
            'text-lg sm:text-xl font-bold tracking-tight capitalize transition-colors duration-300 mb-1',
            isDark 
              ? 'text-[#F8FAFC] group-hover:text-[#D4A017]' 
              : 'text-[#0F172A] group-hover:text-[#B8860B]'
          )}>
            {member.full_name}
          </h3>
          <p className={cn(
            'text-xs sm:text-sm font-semibold capitalize tracking-wide',
            isDark ? 'text-[#D4A017]' : 'text-[#B8860B]'
          )}>
            {member.position}
          </p>
        </div>
        
        {/* Short Bio */}
        {member.short_bio && (
          <p className={cn(
            'text-xs sm:text-sm font-light leading-relaxed line-clamp-2 mb-5',
            isDark ? 'text-[#94A3B8]' : 'text-[#475569]'
          )}>
            {member.short_bio}
          </p>
        )}
        
        {/* Skills Pills & View Profile Footer */}
        <div className="mt-auto pt-4 border-t flex flex-col gap-3" style={{ borderColor: isDark ? '#23262D' : '#F1F5F9' }}>
          {member.skills && member.skills.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {member.skills.slice(0, 3).map((skill, idx) => (
                <span 
                  key={idx} 
                  className={cn(
                    'text-[11px] font-mono px-2.5 py-0.5 rounded-md border capitalize transition-colors',
                    isDark 
                      ? 'bg-[#181B1F] border-[#23262D] text-[#94A3B8] group-hover:border-[#3A3F4A] group-hover:text-zinc-200' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 group-hover:border-slate-300 group-hover:text-slate-900'
                  )}
                >
                  {skill}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span className={cn(
                  'text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold',
                  isDark 
                    ? 'bg-[#181B1F] border-[#23262D] text-[#D4A017]' 
                    : 'bg-slate-50 border-slate-200 text-[#B8860B]'
                )}>
                  +{member.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Interactive Action Prompt */}
          <div className="flex items-center justify-between pt-1">
            <span className={cn(
              'text-xs font-semibold uppercase tracking-wider transition-colors',
              isDark ? 'text-zinc-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'
            )}>
              View Profile
            </span>
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1',
              isDark 
                ? 'bg-[#181B1F] text-[#D4A017] group-hover:bg-[#D4A017] group-hover:text-black' 
                : 'bg-slate-100 text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-white'
            )}>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
