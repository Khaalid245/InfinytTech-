import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, FileText, Users, MessageSquare, Image, Target, Settings, Briefcase, ArrowUpRight } from 'lucide-react';
import Card from '../ui/Card';
import Text from '../ui/Text';
import type { DashboardOverview } from '../../types/dashboard.types';

interface DashboardStatsCardsProps {
  overview: DashboardOverview;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ overview }) => {
  const navigate = useNavigate();

  const primaryCards = [
    {
      id: 'leads',
      label: 'Client Inquiries',
      count: overview.leads.total_leads,
      badge: overview.leads.new > 0 ? `${overview.leads.new} New` : null,
      description: `${overview.leads.new} New Inquiries • ${overview.leads.won} Won Deals`,
      icon: Target,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      path: '/admin/leads'
    },
    {
      id: 'portfolio',
      label: 'Portfolio Showcase',
      count: overview.portfolio.total_projects,
      badge: overview.portfolio.featured > 0 ? `${overview.portfolio.featured} Featured` : null,
      description: `${overview.portfolio.published} Live Projects • ${overview.portfolio.featured} Featured`,
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      path: '/admin/portfolio'
    },
    {
      id: 'blog',
      label: 'Articles & Insights',
      count: overview.blog.total_posts,
      badge: overview.blog.drafts > 0 ? `${overview.blog.drafts} Drafts` : null,
      description: `${overview.blog.published} Published • ${overview.blog.drafts} Pending Review`,
      icon: FileText,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      path: '/admin/blog'
    },
    {
      id: 'services',
      label: 'Service Offerings',
      count: overview.services.total_services,
      badge: `${overview.services.categories} Categories`,
      description: `${overview.services.total_services} Active Services across ${overview.services.categories} categories`,
      icon: Layers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      path: '/admin/services'
    },
  ];

  const secondaryStats = [
    {
      id: 'media',
      label: 'Media Library',
      value: `${overview.media.total_files} Assets`,
      sub: `${overview.media.images} Images, ${overview.media.svgs} SVGs`,
      icon: Image,
      color: 'text-indigo-400',
      path: '/admin/media'
    },
    {
      id: 'team',
      label: 'Team Directory',
      value: `${overview.team.total_members} Members`,
      sub: `${overview.team.departments} Departments`,
      icon: Users,
      color: 'text-cyan-400',
      path: '/admin/team'
    },
    {
      id: 'testimonials',
      label: 'Client Reviews',
      value: `${overview.testimonials.total_testimonials} Reviews`,
      sub: `${overview.testimonials.featured} Highlighted`,
      icon: MessageSquare,
      color: 'text-pink-400',
      path: '/admin/testimonials'
    },
    {
      id: 'settings',
      label: 'Platform Status',
      value: overview.site_settings.active_config > 0 ? 'Operational' : 'Config Needed',
      sub: 'All Systems Connected',
      icon: Settings,
      color: 'text-slate-400',
      path: '/admin/settings'
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Tier 1: Primary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {primaryCards.map((card) => (
          <Card 
            key={card.id} 
            variant="outline" 
            onClick={() => navigate(card.path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(card.path);
              }
            }}
            className="flex flex-col justify-between p-5 bg-surface-light border border-border-primary hover:border-accent-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-accent-primary rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${card.bgColor}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="flex items-center gap-2">
                {card.badge && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                    {card.badge}
                  </span>
                )}
                <ArrowUpRight className="w-4 h-4 text-secondary-text opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div>
              <span className="text-3xl font-bold tracking-tight text-primary-text group-hover:text-accent-primary transition-colors block mb-1">
                {card.count}
              </span>
              <span className="block text-sm font-semibold text-primary-text mb-0.5">{card.label}</span>
              <Text variant="small" className="text-secondary-text text-xs line-clamp-1">{card.description}</Text>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Tier 2: Secondary Resource Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {secondaryStats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => navigate(stat.path)}
            className="p-3.5 rounded-xl bg-surface border border-border-primary hover:border-accent-primary/30 hover:bg-surface-light transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-light border border-border-primary/60 group-hover:border-accent-primary/30 transition-colors">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <span className="block text-xs font-semibold text-primary-text group-hover:text-accent-primary transition-colors">
                  {stat.value}
                </span>
                <span className="block text-[11px] text-secondary-text truncate max-w-[110px]">
                  {stat.label}
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-secondary-text opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStatsCards;

