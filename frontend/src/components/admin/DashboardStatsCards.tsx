import React from 'react';
import { Layers, FileText, Users, MessageSquare, Image, Target, Settings, Briefcase } from 'lucide-react';
import Card from '../ui/Card';
import Text from '../ui/Text';
import type { DashboardOverview } from '../../types/dashboard.types';

interface DashboardStatsCardsProps {
  overview: DashboardOverview;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ overview }) => {
  const cards = [
    {
      id: 'portfolio',
      label: 'Portfolio Projects',
      count: overview.portfolio.total_projects,
      description: `${overview.portfolio.published} Published • ${overview.portfolio.featured} Featured`,
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'blog',
      label: 'Blog Posts',
      count: overview.blog.total_posts,
      description: `${overview.blog.published} Published • ${overview.blog.drafts} Drafts`,
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'services',
      label: 'Services',
      count: overview.services.total_services,
      description: `${overview.services.categories} Categories`,
      icon: Layers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'team',
      label: 'Team Members',
      count: overview.team.total_members,
      description: `${overview.team.departments} Departments`,
      icon: Users,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      count: overview.testimonials.total_testimonials,
      description: `${overview.testimonials.featured} Featured`,
      icon: MessageSquare,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    },
    {
      id: 'media',
      label: 'Media Files',
      count: overview.media.total_files,
      description: `${overview.media.images} Images • ${overview.media.svgs} SVGs`,
      icon: Image,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      id: 'leads',
      label: 'Leads',
      count: overview.leads.total_leads,
      description: `${overview.leads.new} New • ${overview.leads.won} Won`,
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'settings',
      label: 'Site Settings',
      count: overview.site_settings.active_config > 0 ? 1 : 0,
      description: overview.site_settings.active_config > 0 ? 'Configured' : 'Missing Config',
      icon: Settings,
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card 
          key={card.id} 
          variant="outline" 
          className="flex flex-col justify-between h-36 p-5 bg-surface-light border border-border-primary hover:border-accent-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 ${card.bgColor}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <span className="text-3xl font-semibold tracking-tight text-primary-text group-hover:text-accent-primary transition-colors">
              {card.count}
            </span>
          </div>
          <div className="mt-auto">
            <span className="block text-sm font-semibold text-primary-text mb-0.5">{card.label}</span>
            <Text variant="small" className="text-secondary-text text-xs opacity-80 group-hover:opacity-100 transition-opacity">{card.description}</Text>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatsCards;
