'use client';

import { useEffect, useState } from 'react';
import {
  Heart, Brain, Truck, BarChart3, Building2, ShoppingBag,
  ArrowRight, Code2, Box, Layout, Cpu, Globe, Shield, Zap, Layers,
  type LucideIcon,
} from 'lucide-react';
import { Eyebrow, SecondaryBtn } from './ui';
import SpiderLines from './SpiderLines';
import { api, type Project } from '@/lib/api';

const ICON_MAP: Record<string, LucideIcon> = {
  Heart, Brain, Truck, BarChart3, Building2, ShoppingBag,
  Code2, Box, Layout, Cpu, Globe, Shield, Zap, Layers,
};
const DEFAULT_ICON: LucideIcon = BarChart3;

function resolveIcon(tag: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    Healthcare: Heart, Education: Brain, Logistics: Truck,
    SaaS: BarChart3, 'Real Estate': Building2, Retail: ShoppingBag,
    Fintech: Cpu, Analytics: Layers,
  };
  return map[tag] ?? DEFAULT_ICON;
}

const ICON_BOX = 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)';

function Bloom() {
  return <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(225,255,81,0.055) 0%, transparent 70%)' }} aria-hidden="true" />;
}

function ArrowBtn() {
  return (
    <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:-rotate-45" style={{ background: '#00272c', color: 'rgba(212,255,58,0.70)', boxShadow: ICON_BOX }} aria-hidden="true">
      <ArrowRight size={14} strokeWidth={2} />
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.portfolio.list().then((res) => {
      if (res.success && res.data.length > 0) {
        setProjects(res.data.slice(0, 6));
      } else {
        setError(true);
      }
      setLoading(false);
    });
  }, []);

  return (
    <section id="projects" className="relative overflow-hidden py-24" style={{ background: 'transparent' }}>
      <div className="pointer-events-none absolute inset-0" style={{ background: 'rgba(0, 20, 26, 0.88)' }} aria-hidden="true" />
      <SpiderLines />
      <div className="cinema-key pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)', filter: 'blur(8px)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)', filter: 'blur(14px)' }} aria-hidden="true" />
      <div className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: 'screen' }} aria-hidden="true">
        <div style={{ position: 'absolute', top: '-40%', left: '5%',  width: 280, height: '170%', background: 'linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)', transform: 'rotate(-28deg)', transformOrigin: 'top center', filter: 'blur(34px)', opacity: 0.038 }} />
        <div style={{ position: 'absolute', top: '-40%', left: '19%', width: 95,  height: '170%', background: 'linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)', transform: 'rotate(-28deg)', transformOrigin: 'top center', filter: 'blur(22px)', opacity: 0.026 }} />
        <div style={{ position: 'absolute', top: '-40%', left: '33%', width: 160, height: '170%', background: 'linear-gradient(180deg,rgba(14,158,181,0.8) 0%,rgba(14,158,181,0.10) 62%,transparent 100%)', transform: 'rotate(-22deg)', transformOrigin: 'top center', filter: 'blur(30px)', opacity: 0.028 }} />
      </div>
      <div className="hero-gradient-drift pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-160 h-160" style={{ background: 'radial-gradient(circle, rgba(180,204,65,0.09) 0%, transparent 62%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-120 w-[65%]" style={{ background: 'radial-gradient(ellipse 80% 90% at 90% 100%, rgba(180,204,65,0.07) 0%, rgba(14,158,181,0.04) 45%, transparent 70%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)' }} aria-hidden="true" />

      <div className="relative z-10 max-w-300 mx-auto px-8">
        <div className="relative flex flex-col gap-3.5 mb-16">
          <Eyebrow>Our work</Eyebrow>
          <h2 className="text-[36px] lg:text-[40px] font-extrabold tracking-[-0.015em] leading-[1.1] text-white">Selected Work</h2>
          <p className="text-[18px] leading-[1.6] max-w-160">Six recent projects across education, healthcare, retail, logistics, SaaS, and real estate.</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-white/[0.07]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-10 lg:p-12 border-b border-white/[0.07] animate-pulse">
                <div className="h-4 w-20 bg-white/10 rounded mb-6" />
                <div className="h-8 w-32 bg-white/10 rounded mb-4" />
                <div className="h-3 w-full bg-white/5 rounded mb-2" />
                <div className="h-3 w-4/5 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="border-t border-white/[0.07] py-16 text-center">
            <p className="text-[14px] text-white/40">Projects unavailable right now. Please try again later.</p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="border-t border-white/[0.07] py-16 text-center">
            <p className="text-[14px] text-white/40">No projects to display yet.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-white/[0.07]">
            <FeaturedPanel project={projects[0]} />
            {projects[1] && <WidePanel project={projects[1]} index={1} />}
            {projects[2] && <WidePanel project={projects[2]} index={2} />}
            {projects[3] && <StandardPanel project={projects[3]} index={3} />}
            {projects[4] && <StandardPanel project={projects[4]} index={4} />}
            {projects[5] && <StandardPanel project={projects[5]} index={5} />}
          </div>
        )}

        <div className="border-t border-white/[0.07] py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[12px] italic text-white/35">All work shown with client permission. Some project names anonymized for confidentiality.</p>
          <SecondaryBtn href="/case-studies">View all case studies</SecondaryBtn>
        </div>
      </div>
    </section>
  );
}

function FeaturedPanel({ project }: { project: Project }) {
  const Icon = resolveIcon(project.tag);
  return (
    <article className="group relative flex flex-col p-10 lg:p-14 border-b border-white/[0.07] lg:row-span-2 lg:border-r lg:border-white/[0.07] transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer">
      <Bloom />
      <div className="relative z-10 flex items-center justify-between mb-14">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 ease-out select-none">01</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: '#e1ff51' }}>{project.tag || 'Project'}</span>
        </div>
        <ArrowBtn />
      </div>
      <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl mb-10 transition-all duration-300 ease-out group-hover:scale-105" style={{ background: '#00272c', color: '#e1ff51', boxShadow: ICON_BOX }}>
        <Icon size={30} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <h3 className="relative z-10 text-[26px] font-bold tracking-tight leading-tight text-white mb-4">{project.title}</h3>
      <p className="relative z-10 text-[14px] leading-[1.8] text-white/60 flex-1">{project.description}</p>
      {project.key_metric && (
        <div className="relative z-10 mt-10 pt-7 border-t border-white/[0.07]">
          <p className="font-extrabold tracking-[-0.03em] leading-none" style={{ fontSize: 'clamp(28px, 3vw, 40px)', color: '#e1ff51' }}>{project.key_metric}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Key outcome</p>
        </div>
      )}
    </article>
  );
}

function WidePanel({ project, index }: { project: Project; index: number }) {
  const Icon = resolveIcon(project.tag);
  return (
    <article className="group relative flex flex-col p-10 lg:p-14 border-b border-white/[0.07] lg:col-span-2 transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer">
      <Bloom />
      <div className="relative z-10 flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 ease-out select-none">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: '#e1ff51' }}>{project.tag || 'Project'}</span>
        </div>
        <ArrowBtn />
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12">
        <div className="flex items-start gap-6 flex-1">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out group-hover:scale-105" style={{ background: '#00272c', color: '#e1ff51', boxShadow: ICON_BOX }}>
            <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-[22px] font-bold tracking-[-0.02em] leading-tight text-white mb-3">{project.title}</h3>
            <p className="text-[14px] leading-[1.75] text-white/60">{project.description}</p>
          </div>
        </div>
        {project.key_metric && (
          <div className="shrink-0 lg:border-l lg:border-white/[0.07] lg:pl-12 pt-6 lg:pt-0 border-t border-white/[0.07] lg:border-t-0">
            <p className="font-extrabold tracking-[-0.03em] leading-none whitespace-nowrap" style={{ fontSize: 'clamp(22px, 2vw, 32px)', color: '#e1ff51' }}>{project.key_metric}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Key outcome</p>
          </div>
        )}
      </div>
    </article>
  );
}

function StandardPanel({ project, index }: { project: Project; index: number }) {
  const Icon = resolveIcon(project.tag);
  const isLastCol = index === 5;
  return (
    <article className={['group relative flex flex-col p-10 lg:p-12 border-b border-white/[0.07] transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer', !isLastCol ? 'lg:border-r lg:border-white/[0.07]' : ''].join(' ')}>
      <Bloom />
      <div className="relative z-10 flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 ease-out select-none">{String(index + 1).padStart(2, '00')}</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: '#e1ff51' }}>{project.tag || 'Project'}</span>
        </div>
        <ArrowBtn />
      </div>
      {project.key_metric && (
        <div className="relative z-10 mb-8">
          <p className="font-extrabold tracking-tight leading-none" style={{ fontSize: 'clamp(26px, 2.2vw, 36px)', color: '#e1ff51' }}>{project.key_metric}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Key outcome</p>
        </div>
      )}
      <div className="relative z-10 border-t border-white/[0.07] mb-8" />
      <div className="relative z-10 flex items-start gap-5 flex-1">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out group-hover:scale-105" style={{ background: '#00272c', color: '#e1ff51', boxShadow: ICON_BOX }}>
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-[18px] font-bold tracking-tight leading-tight text-white mb-2">{project.title}</h3>
          <p className="text-[13px] leading-[1.75] text-white/60">{project.description}</p>
        </div>
      </div>
    </article>
  );
}
