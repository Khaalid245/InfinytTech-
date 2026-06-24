import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';
import { useProjects, useCategories, useProjectDetail } from '../hooks/usePortfolio';
import type { ProjectListItem } from '../types/portfolio';

interface FeaturedCaseStudiesProps {
  theme: 'dark' | 'light';
}

// ─── Category accent colour map (keyed by category slug) ──────────────────────
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

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div
    className="rounded-2xl border overflow-hidden animate-pulse flex flex-col"
    style={{
      background: isDark ? '#121417' : '#FFFFFF',
      borderColor: isDark ? '#23262D' : '#E2E8F0',
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
export const FeaturedCaseStudies: React.FC<FeaturedCaseStudiesProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visible, setVisible]           = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const projectSlugParam = searchParams.get('project');

  const bg      = isDark ? '#0B0D0F' : '#FAFAFA';
  const cardBg  = isDark ? '#121417' : '#FFFFFF';
  const border  = isDark ? '#23262D' : '#E2E8F0';
  const accent  = isDark ? '#D4A017' : '#B8860B';
  const primary = isDark ? '#F8FAFC' : '#0F172A';
  const sub     = isDark ? '#94A3B8' : '#475569';
  const dim     = isDark ? '#64748B' : '#94A3B8';

  // ── Data fetching ──────────────────────────────────────────────────────────
  const {
    data: projectsPage,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useProjects({ featured: true, page_size: 50 });

  const {
    data: categories,
    isLoading: catsLoading,
  } = useCategories();

  // ── Client-side filter ────────────────────────────────────────────────────
  const projects = projectsPage?.results ?? [];

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter(p => p.category?.slug === activeFilter);
  }, [projects, activeFilter]);

  // ── Filter tabs: "All Projects" + dynamic categories present in results ───
  const filterTabs = useMemo(() => {
    const tabs: Array<{ label: string; value: string }> = [
      { label: 'All Projects', value: 'all' },
    ];
    if (categories) {
      // Only show categories that have at least one featured project
      const usedSlugs = new Set(projects.map(p => p.category?.slug).filter(Boolean));
      categories
        .filter(c => usedSlugs.has(c.slug))
        .forEach(c => tabs.push({ label: c.name, value: c.slug }));
    }
    return tabs;
  }, [categories, projects]);

  const handleFilter = (value: string) => {
    setVisible(false);
    setTimeout(() => {
      setActiveFilter(value);
      setVisible(true);
    }, 200);
  };

  // ── URL-driven project selection (for modal) ──────────────────────────────
  const setSelectedSlug = (slug: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (slug) {
      newParams.set('project', slug);
    } else {
      newParams.delete('project');
    }
    setSearchParams(newParams, { replace: true, preventScrollReset: true });
  };

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = projectSlugParam ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [projectSlugParam]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <section
        style={{ background: bg }}
        className="w-full py-24 px-4 sm:px-6 lg:px-8"
        aria-label="Featured Projects"
      >
        <div className="max-w-7xl mx-auto">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div className="mb-16 text-center">
            <span
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full border mb-4"
              style={{ borderColor: border, color: accent, background: isDark ? '#121417' : '#FFFBEB' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
              FEATURED PROJECTS
            </span>
            <h2
              className="text-4xl sm:text-5xl font-black mt-2 mb-4 tracking-tight leading-[1.1]"
              style={{ color: primary }}
            >
              Solutions Designed<br className="hidden sm:inline" />
              To Solve Real Problems.
            </h2>
            <p
              className="text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed"
              style={{ color: sub }}
            >
              A selection of products and platforms built to improve operations, customer experiences, and business growth.
            </p>
          </div>

          {/* ── Filter bar ──────────────────────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {(catsLoading || projectsLoading)
              ? [90, 120, 100, 110, 95].map(w => (
                  <div
                    key={w}
                    className="h-9 rounded-full animate-pulse"
                    style={{ width: w, background: isDark ? '#23262D' : '#E2E8F0' }}
                  />
                ))
              : filterTabs.map(f => {
                  const isActive = activeFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      onClick={() => handleFilter(f.value)}
                      className="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer"
                      style={{
                        borderColor: isActive ? accent : border,
                        background:  isActive ? accent : cardBg,
                        color:       isActive ? (isDark ? '#0B0D0F' : '#FFFFFF') : sub,
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })
            }
          </div>

          {/* ── Case studies grid ───────────────────────────────────────── */}
          {projectsError ? (
            <div
              className="rounded-2xl border p-12 text-center"
              style={{ borderColor: border, background: cardBg }}
            >
              <p className="text-3xl mb-3" aria-hidden="true">⚠️</p>
              <p className="font-semibold mb-1" style={{ color: primary }}>Failed to load projects</p>
              <p className="text-sm" style={{ color: sub }}>Please check your connection and try again.</p>
            </div>
          ) : projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <SkeletonCard key={i} isDark={isDark} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="rounded-2xl border p-12 text-center"
              style={{ borderColor: border, background: cardBg }}
            >
              <p className="text-3xl mb-3" aria-hidden="true">📂</p>
              <p className="font-semibold" style={{ color: sub }}>No portfolio projects available yet.</p>
            </div>
          ) : (
            <div
              className={cn(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300',
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              )}
            >
              {filtered.map(project => (
                <CaseStudyCard
                  key={project.id}
                  project={project}
                  isDark={isDark}
                  accent={accent}
                  cardBg={cardBg}
                  border={border}
                  primary={primary}
                  sub={sub}
                  dim={dim}
                  onClick={() => setSelectedSlug(project.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Deep-dive modal ─────────────────────────────────────────────── */}
      {projectSlugParam && (
        <CaseStudyModal
          slug={projectSlugParam}
          isDark={isDark}
          accent={accent}
          cardBg={cardBg}
          border={border}
          primary={primary}
          sub={sub}
          dim={dim}
          onClose={() => setSelectedSlug(null)}
        />
      )}
    </>
  );
};

// ─── Card sub-component ───────────────────────────────────────────────────────
interface CardProps {
  project: ProjectListItem;
  isDark: boolean;
  accent: string;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  dim: string;
  onClick: () => void;
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

const CaseStudyCard: React.FC<CardProps> = ({
  project, isDark, accent, cardBg, border, primary, sub, dim, onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const cc = catColor(project.category?.slug);
  const hoverBorder = `${accent}4D`;

  // Automatically display first available ProjectMetric or hide impact section entirely
  const firstMetric = project.metrics?.[0];

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Open case study: ${project.title}`}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'group relative rounded-2xl border overflow-hidden cursor-pointer select-none flex flex-col',
        'transition-all duration-300',
        hovered ? '-translate-y-1' : 'translate-y-0'
      )}
      style={{
        background:  cardBg,
        borderColor: hovered ? hoverBorder : border,
        boxShadow:   hovered
          ? `0 12px 40px -8px ${accent}15`
          : '0 2px 8px -2px rgba(0,0,0,0.04)',
      }}
    >
      {/* Featured image or professional generated placeholder */}
      <div className="w-full aspect-[16/10] overflow-hidden relative flex-shrink-0 border-b" style={{ borderColor: border }}>
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
            className={cn(
              'w-full h-full object-cover transition-transform duration-500',
              hovered ? 'scale-103' : 'scale-100'
            )}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col flex-grow gap-4">
        {/* Title */}
        <h3 className="text-lg font-bold tracking-tight leading-snug line-clamp-2 text-left" style={{ color: primary }}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-xs font-light leading-relaxed line-clamp-2 text-left" style={{ color: sub }}>
          {project.short_description}
        </p>

        {/* Business Impact Section (Compact KPI row) */}
        {firstMetric && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-left">
            <span className="font-extrabold" style={{ color: accent }}>{firstMetric.metric_value}</span>
            <span className="font-light" style={{ color: dim }}>{firstMetric.metric_label}</span>
          </div>
        )}

        {/* Tech + Tag pills (sliced to limits) */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.technologies.slice(0, 3).map(tech => (
            <span
              key={tech.id}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border"
              style={{ borderColor: border, color: dim, background: isDark ? '#0B0D0F/40' : '#F8FAFC/60' }}
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold border"
              style={{ borderColor: border, color: accent, background: isDark ? '#0B0D0F/40' : '#F8FAFC/60' }}
            >
              +{project.technologies.length - 3}
            </span>
          )}
          {project.tags.slice(0, 2).map(tag => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded text-[10px] font-semibold border"
              style={{
                borderColor: `${accent}20`,
                color: accent,
                background: `${accent}03`,
              }}
            >
              #{tag.name}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold border"
              style={{
                borderColor: `${accent}20`,
                color: accent,
                background: `${accent}03`,
              }}
            >
              +{project.tags.length - 2} More
            </span>
          )}
        </div>

        {/* CTA row (clean inline action) */}
        <div className="flex items-center gap-1 pt-2">
          <span
            className="text-xs font-bold transition-colors duration-200 flex items-center gap-1"
            style={{ color: hovered ? accent : sub }}
          >
            View Case Study <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>
      </div>
    </article>
  );
};

// ─── Modal sub-component ──────────────────────────────────────────────────────
interface ModalProps {
  slug: string;
  isDark: boolean;
  accent: string;
  cardBg: string;
  border: string;
  primary: string;
  sub: string;
  dim: string;
  onClose: () => void;
}

const CaseStudyModal: React.FC<ModalProps> = ({
  slug, isDark, accent, cardBg, border, primary, sub, dim, onClose,
}) => {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch full detail on demand
  const { data: project, isLoading, isError } = useProjectDetail(slug);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  const cc = catColor(project?.category?.slug);

  // Accessibility: focus trap + escape key
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    modal.focus();

    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modal.querySelectorAll<HTMLElement>(focusableSelector);
    const firstElement = focusableElements[0];
    const lastElement  = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Tab') {
        if (focusableElements.length === 0) { e.preventDefault(); return; }
        if (e.shiftKey) {
          if (document.activeElement === firstElement) { lastElement.focus(); e.preventDefault(); }
        } else {
          if (document.activeElement === lastElement) { firstElement.focus(); e.preventDefault(); }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, project]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={project ? `Case study: ${project.title}` : 'Loading case study'}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl outline-none"
        style={{ background: cardBg, borderColor: border }}
      >
        {/* Accent bar */}
        <div className="h-[3px] w-full rounded-t-2xl flex-shrink-0" style={{ background: cc }} />

        {/* ── Loading state ──────────────────────────────────────────────── */}
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

        {/* ── Error state ────────────────────────────────────────────────── */}
        {isError && (
          <div className="p-12 text-center">
            <p className="text-3xl mb-3">⚠️</p>
            <p className="font-semibold mb-1" style={{ color: primary }}>Failed to load project</p>
            <p className="text-sm mb-6" style={{ color: sub }}>Could not retrieve project details.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-bold border"
              style={{ borderColor: border, color: sub }}
            >
              Close
            </button>
          </div>
        )}

        {/* ── Loaded state ───────────────────────────────────────────────── */}
        {project && (
          <>
            {/* Banner image or placeholder */}
            <div className="h-56 w-full overflow-hidden border-b relative flex-shrink-0" style={{ borderColor: border }}>
              {project.featured_image ? (
                <>
                  <img
                    src={project.featured_image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
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

            {/* ── Modal header ─────────────────────────────────────────── */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b"
              style={{ background: cardBg, borderColor: border }}
            >
              <div className="flex flex-col gap-1.5 text-left">
                {project.category && (
                  <span
                    className="inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                    style={{ borderColor: `${cc}40`, color: cc, background: `${cc}12` }}
                  >
                    {project.category.name}
                  </span>
                )}
                <h2 className="text-2xl font-black tracking-tight leading-snug" style={{ color: primary }}>
                  {project.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="mt-1 w-9 h-9 flex items-center justify-center rounded-full border flex-shrink-0 transition-all duration-150 active:scale-95 cursor-pointer"
                style={{ borderColor: border, color: sub }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = border)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── Project Header Metadata Row ──────────────────────────── */}
            {(project.category || project.client_name || project.status || project.project_url) && (
              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 border-b text-left"
                style={{ borderColor: border, backgroundColor: isDark ? '#0B0D0F' : '#F8FAFC' }}
              >
                {project.category && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: dim }}>Industry</p>
                    <p className="text-xs font-semibold" style={{ color: primary }}>{project.category.name}</p>
                  </div>
                )}
                {project.client_name && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: dim }}>Client</p>
                    <p className="text-xs font-semibold" style={{ color: primary }}>{project.client_name}</p>
                  </div>
                )}
                {project.status && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: dim }}>Status</p>
                    <p className="text-xs font-semibold capitalize" style={{ color: primary }}>{project.status}</p>
                  </div>
                )}
                {project.project_url && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: dim }}>Project URL</p>
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold hover:underline flex items-center gap-1"
                      style={{ color: accent }}
                    >
                      Visit Live Project
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="px-6 py-6 flex flex-col gap-7">

              {/* ── Business Outcomes Section (Render all dynamically) ──── */}
              {project.metrics && project.metrics.length > 0 && (
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: dim }}>
                    Business Outcomes
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {project.metrics.map(m => (
                      <div
                        key={m.id}
                        className="rounded-xl p-4 border flex flex-col justify-center"
                        style={{ background: isDark ? '#0B0D0F' : '#FFFBEB', borderColor: `${accent}30` }}
                      >
                        <p className="text-2xl font-black font-mono tracking-tight" style={{ color: accent }}>
                          {m.metric_value}
                        </p>
                        <p className="text-[11px] font-medium leading-tight mt-1" style={{ color: sub }}>
                          {m.metric_label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Narrative sections ──────────────────────────────────── */}
              {[
                { num: '01', label: 'About This Project', body: project.short_description },
                ...(project.full_description
                  ? [{ num: '02', label: 'Full Description', body: project.full_description }]
                  : []),
              ].map(({ num, label, body }) => (
                <div key={num} className="flex gap-4 text-left">
                  <span className="text-xs font-black font-mono mt-0.5 flex-shrink-0 w-6" style={{ color: accent }}>
                    {num}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: dim }}>
                      {label}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: sub }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}

              {/* ── Tech stack pills (all) ───────────────────────────────── */}
              {project.technologies.length > 0 && (
                <div
                  className="rounded-xl p-4 border text-left"
                  style={{ background: isDark ? '#0B0D0F' : '#F8FAFC', borderColor: border }}
                >
                  <p className="text-[10px] uppercase tracking-widest font-semibold mb-3" style={{ color: dim }}>
                    Technology Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span
                        key={tech.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors hover:border-[#D4A017] cursor-default"
                        style={{ borderColor: `${accent}30`, color: accent, background: `${accent}10` }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tags (all) ───────────────────────────────────────────── */}
              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-left">
                  {project.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{ borderColor: border, color: dim, background: isDark ? '#0B0D0F' : '#F8FAFC' }}
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* ── Gallery images with lightbox click trigger ───────────── */}
              {project.images && project.images.length > 0 && (
                <div className="flex flex-col gap-3 text-left">
                  <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: dim }}>
                    Project Gallery
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.images.map(img => (
                      <div
                        key={img.id}
                        onClick={() => setActiveLightboxImg(img.image)}
                        className="group relative rounded-xl overflow-hidden border cursor-pointer aspect-video"
                        style={{ borderColor: border }}
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

              {/* ── Footer actions ───────────────────────────────────────── */}
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
                  style={project.project_url ? { background: 'transparent', border: `1px solid ${border}`, color: sub } : {}}
                >
                  Discuss Similar Project &rarr;
                </button>
                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-xl text-sm font-bold border transition-all duration-200 active:scale-95 cursor-pointer"
                  style={{ borderColor: border, color: sub, background: isDark ? '#181B1F' : '#F8FAFC' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.color = sub; }}
                >
                  Close Analysis
                </button>
              </div>
            </div>

            {/* ── Lightbox Overlay ─────────────────────────────────────── */}
            {activeLightboxImg && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
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

export default FeaturedCaseStudies;
