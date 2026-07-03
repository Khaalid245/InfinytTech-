// ─── src/components/ui/TeamMemberModal.tsx ────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Tag } from './Tag';
import type { TeamMember } from '../../types/team';
import { Image } from './Image';

interface TeamMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  const photoUrl = member.photo?.file || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.full_name) + '&background=random&size=512';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-surface-light rounded-xl shadow-elegant-lg overflow-y-auto animate-in zoom-in-95 duration-300 flex flex-col md:flex-row"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button (mobile floating) */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-2/5 h-64 md:h-auto shrink-0 relative bg-neutral-100">
          <Image 
            src={photoUrl} 
            alt={member.full_name} 
            className="w-full h-full"
          />
        </div>
        
        {/* Right Column: Content */}
        <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col relative bg-primary-bg">
          {/* Close button (desktop) */}
          <button
            onClick={onClose}
            className="hidden md:flex absolute top-6 right-6 text-neutral-400 hover:text-primary-text transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-6 pr-8">
            <h2 id="modal-title" className="text-h3 font-display font-medium text-primary-text mb-1">
              {member.full_name}
            </h2>
            <p className="text-primary-accent font-medium text-lg mb-2">
              {member.position}
            </p>
            {member.department && (
              <span className="text-[12px] uppercase tracking-widest text-neutral-500 font-semibold block mb-4">
                {member.department.name}
              </span>
            )}
            
            <div className="flex flex-wrap gap-3">
              {member.linkedin_url && (
                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#0077b5] transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {member.github_url && (
                <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-text transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {member.website_url && (
                <a href={member.website_url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-accent transition-colors" aria-label="Website">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div className="prose prose-sm md:prose-base prose-neutral max-w-none text-secondary-text mb-8">
            {member.biography ? (
              <div dangerouslySetInnerHTML={{ __html: member.biography.replace(/\n/g, '<br/>') }} />
            ) : (
              <p>{member.short_bio}</p>
            )}
          </div>

          {(member.skills?.length > 0 || member.years_of_experience) && (
            <div className="mt-auto pt-6 border-t border-border-primary">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {member.skills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-primary-text uppercase tracking-wider mb-3">
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, idx) => (
                        <Tag key={idx} className="text-[12px] bg-surface-light">
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}
                
                {member.years_of_experience && (
                  <div>
                    <h4 className="text-sm font-semibold text-primary-text uppercase tracking-wider mb-3">
                      Experience
                    </h4>
                    <p className="text-secondary-text">
                      {member.years_of_experience}+ Years in industry
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
