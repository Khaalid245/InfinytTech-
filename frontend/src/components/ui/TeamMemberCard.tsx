// ─── src/components/ui/TeamMemberCard.tsx ─────────────────────────────────────
import React from 'react';
import { Card } from './Card';
import { Tag } from './Tag';
import { cn } from '../../utils/cn';
import type { TeamMember } from '../../types/team';
import { Image } from './Image';

interface TeamMemberCardProps {
  member: TeamMember;
  onClick: (member: TeamMember) => void;
  className?: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onClick, className }) => {
  // Graceful fallback for missing photo
  const photoUrl = member.photo?.file || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.full_name) + '&background=random&size=256';

  return (
    <Card 
      variant="outline" 
      hoverable 
      padding="none"
      className={cn('group cursor-pointer overflow-hidden flex flex-col h-full', className)}
      onClick={() => onClick(member)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Image 
          src={photoUrl} 
          alt={member.full_name} 
          className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="text-h4 font-display font-medium text-primary-text mb-1 group-hover:text-primary-accent transition-colors">
            {member.full_name}
          </h3>
          <p className="text-secondary-text font-medium text-small">
            {member.position}
          </p>
        </div>
        
        {member.department && (
          <div className="mb-4">
            <span className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
              {member.department.name}
            </span>
          </div>
        )}
        
        {member.short_bio && (
          <p className="text-secondary-text text-body line-clamp-3 mb-6">
            {member.short_bio}
          </p>
        )}
        
        <div className="mt-auto flex flex-wrap gap-2">
          {member.skills?.slice(0, 3).map((skill, idx) => (
            <Tag key={idx} className="text-[12px] py-0.5 px-2 bg-neutral-50 border-neutral-200">
              {skill}
            </Tag>
          ))}
          {member.skills?.length > 3 && (
            <Tag className="text-[12px] py-0.5 px-2 bg-neutral-50 border-neutral-200">
              +{member.skills.length - 3}
            </Tag>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TeamMemberCard;
