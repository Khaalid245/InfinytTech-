import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import type { LibraryProject } from '../data/portfolioData';

const CATEGORIES = [
  { label: 'All Projects', value: 'all' },
  { label: 'Web Applications', value: 'web' },
  { label: 'Mobile Applications', value: 'mobile' },
  { label: 'AI Solutions', value: 'ai' },
  { label: 'Enterprise Systems', value: 'enterprise' },
  { label: 'UI/UX Design', value: 'uiux' },
  { label: 'Cloud Platforms', value: 'cloud' },
] as const;

interface PortfolioGridSectionProps {
  theme: 'dark' | 'light';
}

export const PortfolioGridSection: React.FC<PortfolioGridSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategory = useMemo(() => {
    return searchParams.get('filter') || 'all';
  }, [searchParams]);

  const setActiveCategory = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (category && category !== 'all') {
      newParams.set('filter', category);
    } else {
      newParams.delete('filter');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  const libraryParam = searchParams.get('library');
  const selectedProject = useMemo(() => {
    if (!libraryParam) return null;
    return PROJECTS.find((p) => p.id === libraryParam) || null;
  }, [libraryParam]);

  const setSelectedProject = (project: LibraryProject | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (project) {
      newParams.set('library', project.id);
    } else {
      newParams.delete('library');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  // Lock body scroll when project modal is open
  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap for selectedProject modal
  useEffect(() => {
    if (!selectedProject) return;

    const timer = setTimeout(() => {
      const modal = modalRef.current;
      if (!modal) return;

      modal.focus();

      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelector);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedProject(null);
          return;
        }

        if (e.key === 'Tab') {
          if (focusableElements.length === 0) {
            e.preventDefault();
            return;
          }

          if (e.shiftKey) { // Tab back
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else { // Tab forward
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [selectedProject]);

  const gold = '#D4A017';
  const bg = isDark ? 'bg-[#0B0D0F]' : 'bg-[#F8FAFC]';
  const cardBg = isDark ? 'bg-[#121417]' : 'bg-[#FFFFFF]';
  const border = isDark ? 'border-[#23262D]' : 'border-[#E2E8F0]';
  const textPri = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSec = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const textDim = isDark ? 'text-[#64748B]' : 'text-[#64748B]';

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.type === activeCategory);
  }, [activeCategory]);

  return (
    <section 
      className={cn('w-full py-24 px-4 sm:px-6 lg:px-8 border-t transition-colors duration-300', bg)} 
      style={{ borderColor: isDark ? '#1E1E20' : '#E8EDF3' }} 
      aria-label="PROJECT LIBRARY"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
            style={{ color: gold, borderColor: isDark ? '#252527' : '#E2E8F0', backgroundColor: isDark ? 'rgba(20,20,22,0.9)' : '#F1F5F9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: gold }} aria-hidden="true" />
            PROJECT LIBRARY
          </span>
          <h2 className={cn('text-4xl sm:text-5xl font-black mt-2 mb-4 tracking-tight leading-[1.1]', textPri)}>
            Explore More Projects.
          </h2>
        </div>

        {/* Categories Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300 active:scale-95 cursor-pointer',
                  isActive
                    ? 'border-[#D4A017] bg-[#D4A017] text-[#0B0D0F] shadow-lg shadow-amber-600/10'
                    : isDark
                    ? 'border-[#23262D] bg-[#121417] text-[#94A3B8] hover:border-[#23262D] hover:text-[#F8FAFC]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedProject(project)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
              className={cn(
                'group flex flex-col rounded-2xl border overflow-hidden cursor-pointer select-none transition-all duration-300 hover:-translate-y-1 text-left',
                cardBg,
                border
              )}
            >
              {/* Thumbnail */}
              <div className="h-48 w-full overflow-hidden relative border-b" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    {/* Category pill */}
                    <span
                      className="inline-flex items-center self-start px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border"
                      style={{
                        borderColor: isDark ? 'rgba(212,160,23,0.20)' : 'rgba(202,138,4,0.2)',
                        color: gold,
                        background: isDark ? 'rgba(212,160,23,0.08)' : 'rgba(212,160,23,0.02)',
                      }}
                    >
                      {project.industry}
                    </span>
                    <h3 className={cn('text-lg font-black tracking-tight leading-snug', textPri)}>
                      {project.title}
                    </h3>
                  </div>
                  {/* Icon */}
                  <span className="text-2xl flex-shrink-0">{project.accentIcon}</span>
                </div>

                <p className={cn('text-xs font-light leading-relaxed line-clamp-3 mb-2', textSec)}>
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[10px] font-medium border"
                      style={{
                        borderColor: isDark ? '#23262D' : '#E2E8F0',
                        color: isDark ? '#64748B' : '#64748B',
                        backgroundColor: isDark ? '#121417' : '#F8FAFC',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA Link */}
                <div className="flex items-center gap-1.5 pt-4 border-t" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
                  <span className={cn('text-xs font-bold transition-colors duration-200 group-hover:text-[#D4A017]', textSec)}>
                    View Project &rarr;
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Deep-dive Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedProject.title}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className={cn('relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border shadow-2xl outline-none', cardBg, border)}
          >
            {/* Top gold bar */}
            <div className="h-[3px] w-full rounded-t-2xl" style={{ backgroundColor: gold }} />

            {/* Banner Image */}
             <div className="h-48 w-full overflow-hidden border-b relative" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
              <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b"
              style={{ backgroundColor: isDark ? '#121417' : '#FFFFFF', borderColor: isDark ? '#23262D' : '#E2E8F0' }}
            >
              <div className="flex flex-col gap-1 text-left">
                <span
                  className="inline-flex items-center self-start px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border"
                  style={{ borderColor: `${gold}40`, color: gold, background: `${gold}08` }}
                >
                  {selectedProject.categoryLabel}
                </span>
                <h2 className={cn('text-xl font-black tracking-tight leading-snug', textPri)}>{selectedProject.title}</h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
                className={cn('w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-150 active:scale-95 cursor-pointer', border)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Narrative Content */}
            <div className="p-6 flex flex-col gap-6 text-left">
              {/* Challenge */}
              <div className="flex gap-3">
                <span className="text-xs font-black font-mono mt-0.5" style={{ color: gold }}>01</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: textDim }}>Business Challenge</p>
                  <p className="text-sm font-light leading-relaxed" style={{ color: textSec }}>{selectedProject.challenge}</p>
                </div>
              </div>

              {/* Solution */}
              <div className="flex gap-3">
                <span className="text-xs font-black font-mono mt-0.5" style={{ color: gold }}>02</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: textDim }}>Solution Delivered</p>
                  <p className="text-sm font-light leading-relaxed" style={{ color: textSec }}>{selectedProject.solution}</p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="border rounded-xl p-4" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0', backgroundColor: isDark ? '#121417' : '#F8FAFC' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: textDim }}>Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded text-xs font-bold border"
                      style={{ borderColor: `${gold}30`, color: gold, background: `${gold}08` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    navigate('/contact');
                  }}
                  className={cn(
                    'flex-grow py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer border-none',
                    isDark ? 'text-[#0B0D0F] bg-[#D4A017] hover:bg-[#E6B325]' : 'text-white bg-[#B8860B] hover:bg-[#A0780A]'
                  )}
                >
                  Discuss This Technology &rarr;
                </button>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="py-3 px-6 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{
                    borderColor: isDark ? '#23262D' : '#E2E8F0',
                    color: isDark ? '#94A3B8' : '#475569',
                    background: isDark ? '#181B1F' : '#F8FAFC',
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PortfolioGridSection;
