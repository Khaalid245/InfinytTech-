import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { X, Search, RotateCcw } from 'lucide-react';
import { useProjects, useCategories, useProjectDetail } from '../hooks/usePortfolio';
import type { ProjectListItem } from '../types/portfolio';
import TestimonialCard from '../components/ui/TestimonialCard';

interface PortfolioGridSectionProps {
  theme: 'dark' | 'light';
}

// ─── Skeleton grid card ───────────────────────────────────────────────────────
const SkeletonGridCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div
    className="rounded-2xl border overflow-hidden animate-pulse flex flex-col"
    style={{
      background:   isDark ? '#121417' : '#FFFFFF',
      borderColor:  isDark ? '#23262D' : '#E2E8F0',
    }}
  >
    <div className="w-full aspect-[16/10]" style={{ background: isDark ? '#1a1d22' : '#F1F5F9' }} />
    <div className="p-6 flex flex-col gap-4 flex-grow">
      {/* Title */}
      <div className="h-6 w-3/4 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
      {/* Description */}
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
        <div className="h-3.5 w-5/6 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
      </div>
      {/* Impact metric */}
      <div className="h-4 w-1/2 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
      {/* Badges */}
      <div className="flex gap-2 mt-auto pt-2">
        {[50, 65, 45].map(w => (
          <div key={w} className="h-5 rounded" style={{ width: w, background: isDark ? '#23262D' : '#E2E8F0' }} />
        ))}
      </div>
      {/* CTA link */}
      <div className="h-4 w-28 rounded mt-4" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export const PortfolioGridSection: React.FC<PortfolioGridSectionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const gold    = '#D4A017';
  const bg      = isDark ? 'bg-[#0B0D0F]' : 'bg-[#F8FAFC]';
  const cardBg  = isDark ? 'bg-[#121417]' : 'bg-[#FFFFFF]';
  const border  = isDark ? 'border-[#23262D]' : 'border-[#E2E8F0]';
  const textPri = isDark ? 'text-[#F8FAFC]' : 'text-[#0F172A]';
  const textSec = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const textDim = isDark ? 'text-[#64748B]' : 'text-[#64748B]';
  const borderRaw = isDark ? '#23262D' : '#E2E8F0';

  // ── URL state ──────────────────────────────────────────────────────────────
  const activeCategory = useMemo(() => searchParams.get('filter') || 'all', [searchParams]);

  const setActiveCategory = (category: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (category && category !== 'all') {
      newParams.set('filter', category);
    } else {
      newParams.delete('filter');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  const librarySlugParam = searchParams.get('library');

  const setSelectedSlug = (slug: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (slug) {
      newParams.set('library', slug);
    } else {
      newParams.delete('library');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  // ── Data fetching ──────────────────────────────────────────────────────────
  const {
    data: projectsPage,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects({ page_size: 100 }); // load all for client-side filtering

  const {
    data: categories,
    isLoading: catsLoading,
  } = useCategories();

  const allProjects = projectsPage?.results ?? [];

  // ── Dynamic filter tabs with Live Project Counts ───────────────────────────
  const filterTabs = useMemo(() => {
    const tabs: Array<{ label: string; value: string; count: number }> = [
      { label: 'All Projects', value: 'all', count: allProjects.length },
    ];
    if (categories) {
      const countsByCat: Record<string, number> = {};
      allProjects.forEach(p => {
        const slug = p.category?.slug;
        if (slug) {
          countsByCat[slug] = (countsByCat[slug] || 0) + 1;
        }
      });
      categories
        .filter(c => (countsByCat[c.slug] || 0) > 0)
        .forEach(c => tabs.push({ label: c.name, value: c.slug, count: countsByCat[c.slug] || 0 }));
    }
    return tabs;
  }, [categories, allProjects]);

  // ── Client-side Live Search & Category Filtering ──────────────────────────
  const filteredProjects = useMemo(() => {
    let list = allProjects;
    if (activeCategory !== 'all') {
      list = list.filter(p => p.category?.slug === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.client_name?.toLowerCase().includes(q) ||
        p.technologies?.some(t => t.name.toLowerCase().includes(q)) ||
        p.tags?.some(t => t.name.toLowerCase().includes(q)) ||
        p.category?.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProjects, activeCategory, searchQuery]);

  // ── Body scroll lock when modal open ──────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = librarySlugParam ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [librarySlugParam]);

  const modalRef = useRef<HTMLDivElement>(null);

  // ── Focus trap for grid modal ──────────────────────────────────────────────
  useEffect(() => {
    if (!librarySlugParam) return;
    const timer = setTimeout(() => {
      const modal = modalRef.current;
      if (!modal) return;
      modal.focus();

      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const els = modal.querySelectorAll<HTMLElement>(focusableSelector);
      const first = els[0];
      const last  = els[els.length - 1];

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { setSelectedSlug(null); return; }
        if (e.key === 'Tab') {
          if (els.length === 0) { e.preventDefault(); return; }
          if (e.shiftKey) {
            if (document.activeElement === first) { last.focus(); e.preventDefault(); }
          } else {
            if (document.activeElement === last) { first.focus(); e.preventDefault(); }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, 50);

    return () => clearTimeout(timer);
  }, [librarySlugParam]);

  return (
    <section
      className={cn('w-full py-24 px-4 sm:px-6 lg:px-8 border-t transition-colors duration-300', bg)}
      style={{ borderColor: isDark ? '#1E1E20' : '#E8EDF3' }}
      aria-label="PROJECT LIBRARY"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Section Header */}
        <div className="mb-12 text-center">
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
          <p className={cn('text-sm sm:text-base max-w-xl mx-auto leading-relaxed', textSec)}>
            Browse through our full archive of engineering case studies, enterprise systems, and client solutions.
          </p>
        </div>

        {/* ── Live Search & Discovery Bar ── */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative flex items-center">
            <Search className={cn("absolute left-4 w-4 h-4 pointer-events-none", textSec)} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies by keyword, tech, or industry..."
              className={cn(
                "w-full pl-11 pr-10 py-3 rounded-2xl text-sm border shadow-xs transition-all",
                "focus:outline-none focus:ring-2 focus:ring-[#D4A017]/40 focus:border-[#D4A017]",
                isDark 
                  ? "bg-[#121417] border-[#23262D] text-[#F8FAFC] placeholder-slate-500" 
                  : "bg-white border-slate-200 text-[#0F172A] placeholder-slate-400"
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Navigation with Live Counts */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-4xl mx-auto">
          {(catsLoading || projectsLoading)
            ? [90, 120, 100, 130, 110, 95].map(w => (
                <div
                  key={w}
                  className="h-10 rounded-full animate-pulse"
                  style={{ width: w, background: isDark ? '#23262D' : '#E2E8F0' }}
                />
              ))
            : filterTabs.map(cat => {
                const isActive = activeCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300 active:scale-95 cursor-pointer',
                      isActive
                        ? 'border-[#D4A017] bg-[#D4A017] text-[#0B0D0F] shadow-lg shadow-amber-600/15 font-bold'
                        : isDark
                        ? 'border-[#23262D] bg-[#121417] text-[#94A3B8] hover:border-[#23262D] hover:text-[#F8FAFC]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                    )}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none transition-colors',
                        isActive
                          ? 'bg-black/20 text-[#0B0D0F] font-bold'
                          : isDark
                          ? 'bg-[#181B1F] text-[#64748B]'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })
          }
        </div>

        {/* Real-time Discovery Results Counter */}
        <div className="flex items-center justify-between mb-8 px-2 max-w-4xl mx-auto text-xs">
          <p className={textSec}>
            Showing <strong className={textPri}>{filteredProjects.length}</strong> of <strong className={textPri}>{allProjects.length}</strong> case studies
            {activeCategory !== 'all' && ` in ${filterTabs.find(t => t.value === activeCategory)?.label || ''}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
          {(activeCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 text-accent-primary hover:underline font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Project Grid */}
        {projectsError ? (
          <div
            className="rounded-2xl border p-12 text-center"
            style={{ borderColor: borderRaw, background: isDark ? '#121417' : '#FFFFFF' }}
          >
            <p className="text-3xl mb-3" aria-hidden="true">⚠️</p>
            <p className={cn('font-semibold mb-1', textPri)}>Failed to load projects</p>
            <p className={cn('text-sm', textSec)}>Please check your connection and try again.</p>
          </div>
        ) : projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonGridCard key={i} isDark={isDark} />)}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div
            className={cn("rounded-2xl border p-12 text-center max-w-lg mx-auto shadow-sm", cardBg, border)}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-accent-primary flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className={cn('text-lg font-bold mb-2', textPri)}>No Matching Projects Found</h3>
            <p className={cn('text-sm mb-6 leading-relaxed', textSec)}>
              We couldn't find any case studies matching "{searchQuery}" in this category. Try adjusting your search query or reset filters.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-accent-primary text-black font-semibold text-xs shadow-sm hover:brightness-105 transition-all cursor-pointer"
            >
              Clear Search & Show All
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                isDark={isDark}
                gold={gold}
                cardBg={cardBg}
                border={border}
                borderRaw={borderRaw}
                textPri={textPri}
                textSec={textSec}
                onClick={() => setSelectedSlug(project.slug)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Deep-dive Detail Modal */}
      {librarySlugParam && (
        <ProjectDetailModal
          slug={librarySlugParam}
          isDark={isDark}
          gold={gold}
          cardBg={cardBg}
          border={border}
          borderRaw={borderRaw}
          textPri={textPri}
          textSec={textSec}
          textDim={textDim}
          modalRef={modalRef}
          onClose={() => setSelectedSlug(null)}
          navigate={navigate}
        />
      )}
    </section>
  );
};

// ─── Grid card ────────────────────────────────────────────────────────────────
interface CardProps {
  project:   ProjectListItem;
  isDark:    boolean;
  gold:      string;
  cardBg:    string;
  border:    string;
  borderRaw: string;
  textPri:   string;
  textSec:   string;
  onClick:   () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  'web-applications':   '#10B981',
  'mobile-applications':'#F59E0B',
  'ai-solutions':       '#8B5CF6',
  'enterprise-systems': '#3B82F6',
  'ui-ux-design':       '#EC4899',
  'cloud-platforms':    '#06B6D4',
};
const DEFAULT_CAT_COLOR = '#D4A017';

function catColor(slug?: string): string {
  if (!slug) return DEFAULT_CAT_COLOR;
  return CATEGORY_COLORS[slug] ?? DEFAULT_CAT_COLOR;
}

const getInitials = (title: string) => {
  return title
    .split(/\s+/)
    .map(word => word[0])
    .filter(Boolean)
    .join('')
    .slice(0, 3)
    .toUpperCase();
};

const ProjectCard: React.FC<CardProps> = ({
  project, isDark, gold, cardBg, border, borderRaw, textPri, textSec, onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const cc = catColor(project.category?.slug);
  const firstMetric = project.metrics?.[0];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative flex flex-col rounded-2xl border overflow-hidden cursor-pointer select-none',
        'transition-all duration-300 hover:-translate-y-1 text-left',
        cardBg, border
      )}
      style={{
        borderColor: hovered ? `${gold}4D` : borderRaw,
        boxShadow: hovered ? `0 12px 40px -8px ${gold}15` : '0 2px 8px -2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Thumbnail or initials cover */}
      <div className="w-full aspect-[16/10] overflow-hidden relative border-b flex-shrink-0" style={{ borderColor: borderRaw }}>
        {/* Overlaid Category Badge */}
        {project.category && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md"
              style={{
                borderColor: `${cc}30`,
                color: cc,
                background: `${cc}15`,
              }}
            >
              {project.category.name}
            </span>
          </div>
        )}

        {project.featured_image ? (
          <img
            src={project.featured_image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${cc}15 0%, ${cc}35 100%)`,
            }}
          >
            <div
              className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-20"
              style={{ backgroundColor: cc }}
            />
            <div
              className="absolute -left-8 -top-8 w-20 h-20 rounded-full blur-xl opacity-10"
              style={{ backgroundColor: cc }}
            />
            <div className="z-10 flex flex-col items-center gap-1.5">
              <span
                className="text-4xl font-extrabold tracking-wider font-mono select-none"
                style={{ color: cc }}
              >
                {getInitials(project.title)}
              </span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-grow gap-4">
        <h3 className={cn('text-lg font-bold tracking-tight leading-snug line-clamp-2', textPri)}>
          {project.title}
        </h3>

        {/* Business Impact Section (Only shown if metric exists) */}
        {firstMetric && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-left">
            <span className="font-extrabold" style={{ color: gold }}>{firstMetric.metric_value}</span>
            <span className={cn('font-light', textSec)}>{firstMetric.metric_label}</span>
          </div>
        )}

        <p className={cn('text-xs font-light leading-relaxed line-clamp-2', textSec)}>
          {project.short_description}
        </p>

        {/* Tech + Tag pills (sliced to limits) */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.technologies.slice(0, 3).map(tech => (
            <span
              key={tech.id}
              className="px-2 py-0.5 rounded text-[10px] font-medium border"
              style={{
                borderColor: isDark ? '#23262D' : '#E2E8F0',
                color: isDark ? '#64748B' : '#64748B',
                backgroundColor: isDark ? '#121417/40' : '#F8FAFC/60',
              }}
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold border"
              style={{
                borderColor: isDark ? '#23262D' : '#E2E8F0',
                color: gold,
                backgroundColor: isDark ? '#121417/40' : '#F8FAFC/60',
              }}
            >
              +{project.technologies.length - 3}
            </span>
          )}
          {project.tags.slice(0, 2).map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded text-[10px] font-medium border"
              style={{
                borderColor: `${gold}20`,
                color: gold,
                backgroundColor: `${gold}03`,
              }}
            >
              #{tag.name}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold border"
              style={{
                borderColor: `${gold}20`,
                color: gold,
                backgroundColor: `${gold}03`,
              }}
            >
              +{project.tags.length - 2}
            </span>
          )}
        </div>

        {/* CTA Link (clean inline action) */}
        <div className="flex items-center gap-1 pt-2">
          <span className={cn('text-xs font-bold transition-all duration-200 flex items-center gap-1', textSec, hovered && 'text-[#D4A017]')}>
            View Project <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
      </div>
    </article>
  );
};

// ─── Grid detail modal ────────────────────────────────────────────────────────
interface ModalProps {
  slug:      string;
  isDark:    boolean;
  gold:      string;
  cardBg:    string;
  border:    string;
  borderRaw: string;
  textPri:   string;
  textSec:   string;
  textDim:   string;
  modalRef:  React.RefObject<HTMLDivElement | null>;
  onClose:   () => void;
  navigate:  ReturnType<typeof useNavigate>;
}

const ProjectDetailModal: React.FC<ModalProps> = ({
  slug, isDark, gold, cardBg, border, borderRaw, textPri, textSec, textDim, modalRef, onClose, navigate,
}) => {
  const { data: project, isLoading, isError } = useProjectDetail(slug);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  const cc = catColor(project?.category?.slug);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={project?.title ?? 'Project detail'}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn('relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl outline-none', cardBg, border)}
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full rounded-t-2xl flex-shrink-0" style={{ backgroundColor: gold }} />

        {/* Loading skeleton */}
        {isLoading && (
          <div className="p-8 flex flex-col gap-6 animate-pulse">
            {/* Banner image skeleton */}
            <div className="h-56 w-full rounded-xl" style={{ background: isDark ? '#1a1d22' : '#F1F5F9' }} />
            
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-20 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
              <div className="h-7 w-3/4 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
            </div>

            {/* Metadata row skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-12 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
                  <div className="h-4 w-20 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
                </div>
              ))}
            </div>

            {/* Metrics cards skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-32 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 rounded-xl border p-4 flex flex-col justify-center gap-2" style={{ borderColor: isDark ? '#23262D' : '#E2E8F0' }}>
                    <div className="h-6 w-16 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
                    <div className="h-3 w-20 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-36 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
              <div className="h-3 w-full rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
              <div className="h-3 w-5/6 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
            </div>

            {/* Gallery skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-28 rounded" style={{ background: isDark ? '#23262D' : '#E2E8F0' }} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video rounded-xl" style={{ background: isDark ? '#1a1d22' : '#F1F5F9' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="p-10 text-center">
            <p className="text-3xl mb-3">⚠️</p>
            <p className={cn('font-semibold mb-1', textPri)}>Failed to load project</p>
            <p className={cn('text-sm mb-6', textSec)}>Could not retrieve project details.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-bold border"
              style={{ borderColor: borderRaw, color: isDark ? '#94A3B8' : '#475569' }}
            >
              Close
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {project && (
          <>
            {/* Banner Image or placeholder */}
            <div className="h-56 w-full overflow-hidden border-b relative flex-shrink-0" style={{ borderColor: borderRaw }}>
              {project.featured_image ? (
                <>
                  <img src={project.featured_image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${cc}15 0%, ${cc}35 100%)`,
                  }}
                >
                  <div
                    className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: cc }}
                  />
                  <div
                    className="absolute -left-8 -top-8 w-20 h-20 rounded-full blur-xl opacity-10"
                    style={{ backgroundColor: cc }}
                  />
                  <div className="z-10 flex flex-col items-center gap-1.5">
                    <span
                      className="text-5xl font-extrabold tracking-wider font-mono select-none"
                      style={{ color: cc }}
                    >
                      {getInitials(project.title)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Header */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b"
              style={{ backgroundColor: isDark ? '#121417' : '#FFFFFF', borderColor: borderRaw }}
            >
              <div className="flex flex-col gap-1 text-left">
                {project.category && (
                  <span
                    className="inline-flex items-center self-start px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border"
                    style={{ borderColor: `${gold}40`, color: gold, background: `${gold}08` }}
                  >
                    {project.category.name}
                  </span>
                )}
                <h2 className={cn('text-xl font-black tracking-tight leading-snug', textPri)}>
                  {project.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className={cn('w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-150 active:scale-95 cursor-pointer', border)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Project Header Metadata Row ──────────────────────────── */}
            {(project.category || project.client_name || project.status || project.project_url) && (
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 border-b text-left"
                style={{ borderColor: borderRaw, backgroundColor: isDark ? '#0B0D0F' : '#F8FAFC' }}
              >
                {project.category && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: gold }}>Industry</p>
                    <p className={cn('text-xs font-semibold', textPri)}>{project.category.name}</p>
                  </div>
                )}
                {project.client_name && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: gold }}>Client</p>
                    <p className={cn('text-xs font-semibold', textPri)}>{project.client_name}</p>
                  </div>
                )}
                {project.status && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: gold }}>Status</p>
                    <p className={cn('text-xs font-semibold capitalize', textPri)}>{project.status}</p>
                  </div>
                )}
                {project.project_url && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: gold }}>Project URL</p>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold hover:underline flex items-center gap-1"
                      style={{ color: gold }}
                    >
                      Visit Live Project
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col gap-6 text-left">

              {/* ── Business Outcomes Section (Render all dynamically) ──── */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: gold }}>
                    Business Outcomes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.metrics.map(m => (
                      <div
                        key={m.id}
                        className="rounded-xl p-4 border flex flex-col justify-center"
                        style={{ background: isDark ? '#0B0D0F' : '#FFFBEB', borderColor: `${gold}30` }}
                      >
                        <p className="text-2xl font-black font-mono tracking-tight" style={{ color: gold }}>
                          {m.metric_value}
                        </p>
                        <p className={cn('text-[11px] font-medium leading-tight mt-1', textSec)}>
                          {m.metric_label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="flex gap-3">
                <span className="text-xs font-black font-mono mt-0.5" style={{ color: gold }}>01</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: textDim }}>
                    About This Project
                  </p>
                  <p className={cn('text-sm font-light leading-relaxed', textSec)}>
                    {project.short_description}
                  </p>
                </div>
              </div>

              {project.full_description && (
                <div className="flex gap-3">
                  <span className="text-xs font-black font-mono mt-0.5" style={{ color: gold }}>02</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: textDim }}>
                      Full Description
                    </p>
                    <p className={cn('text-sm font-light leading-relaxed', textSec)}>
                      {project.full_description}
                    </p>
                  </div>
                </div>
              )}

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div
                  className="border rounded-xl p-4"
                  style={{ borderColor: borderRaw, backgroundColor: isDark ? '#121417' : '#F8FAFC' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: textDim }}>
                    Technologies Used
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span
                        key={tech.id}
                        className="px-2.5 py-1 rounded text-xs font-bold border transition-colors hover:border-[#D4A017] cursor-default"
                        style={{ borderColor: `${gold}30`, color: gold, background: `${gold}08` }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-left">
                  {project.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold border"
                      style={{ borderColor: borderRaw, color: isDark ? '#64748B' : '#64748B', background: isDark ? '#0B0D0F' : '#F8FAFC' }}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Gallery with lightbox click trigger */}
              {project.images && project.images.length > 0 && (
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: textDim }}>
                    Project Gallery
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.images.map(img => (
                      <div
                        key={img.id}
                        onClick={() => setActiveLightboxImg(img.image)}
                        className="group relative rounded-xl overflow-hidden border cursor-pointer aspect-video"
                        style={{ borderColor: borderRaw }}
                      >
                        <img
                          src={img.image}
                          alt={img.caption || project.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 rounded-full">
                            Preview
                          </span>
                        </div>
                        {img.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-black/60 px-2 py-1">
                            <p className="text-[9px] text-white truncate">{img.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Testimonials */}
              {project.testimonials && project.testimonials.length > 0 && (
                <div className="flex flex-col gap-4 text-left border-t pt-8 mt-4" style={{ borderColor: borderRaw }}>
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: textDim }}>
                    Client Testimonials
                  </p>
                  <div className="flex flex-col gap-6">
                    {project.testimonials.map(t => (
                      <TestimonialCard
                        key={t.id}
                        quote={t.testimonial}
                        author={t.author_name}
                        role={t.author_position}
                        company={t.client?.company_name || 'Client'}
                        imageUrl={t.author_photo?.file}
                        clientLogoUrl={t.client?.company_logo?.file}
                        rating={t.rating}
                        className="w-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'flex-grow py-3 px-6 rounded-xl text-sm font-bold text-center transition-all duration-200 active:scale-95 border-none',
                      isDark ? 'text-[#0B0D0F] bg-[#D4A017] hover:bg-[#E6B325]' : 'text-white bg-[#B8860B] hover:bg-[#A0780A]'
                    )}
                  >
                    Visit Live Project &rarr;
                  </a>
                )}
                <button
                  onClick={() => { onClose(); navigate('/contact'); }}
                  className={cn(
                    'flex-grow py-3 px-6 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer border-none',
                    isDark ? 'text-[#0B0D0F] bg-[#D4A017] hover:bg-[#E6B325]' : 'text-white bg-[#B8860B] hover:bg-[#A0780A]'
                  )}
                  style={project.project_url ? { background: 'transparent', border: `1px solid ${borderRaw}`, color: isDark ? '#94A3B8' : '#475569' } : {}}
                >
                  Discuss Similar Project &rarr;
                </button>
                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{
                    borderColor: borderRaw,
                    color: isDark ? '#94A3B8' : '#475569',
                    background: isDark ? '#181B1F' : '#F8FAFC',
                  }}
                >
                  Close Details
                </button>
              </div>
            </div>

            {/* Lightbox Overlay */}
            {activeLightboxImg && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
                onClick={() => setActiveLightboxImg(null)}
              >
                <button
                  onClick={() => setActiveLightboxImg(null)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border-none"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={activeLightboxImg}
                  alt="Gallery Preview"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioGridSection;
