import React from 'react';
import Card from '../ui/Card';
import Heading from '../ui/Heading';
import Text from '../ui/Text';
import { Target, FileText, Briefcase, Users, Image as ImageIcon } from 'lucide-react';
import type { RecentActivity as RecentActivityType } from '../../types/dashboard.types';

interface RecentActivityProps {
  data: RecentActivityType;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ data }) => {
  // Aggregate all activity into a single flat array and sort by created_at DESC
  const allActivity = [
    ...data.recent_leads.map(lead => ({
      id: `lead-${lead.id}`,
      type: 'Lead',
      title: `${lead.first_name} ${lead.last_name}`,
      subtitle: lead.email,
      status: lead.status,
      date: new Date(lead.created_at),
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    })),
    ...data.recent_posts.map(post => ({
      id: `post-${post.id}`,
      type: 'Blog Post',
      title: post.title,
      subtitle: `Status: ${post.status}`,
      status: post.status,
      date: new Date(post.created_at),
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    })),
    ...data.recent_projects.map(project => ({
      id: `project-${project.id}`,
      type: 'Project',
      title: project.title,
      subtitle: `Status: ${project.status}`,
      status: project.status,
      date: new Date(project.created_at),
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    })),
    ...data.recent_team.map(member => ({
      id: `team-${member.id}`,
      type: 'Team Member',
      title: `${member.first_name} ${member.last_name}`,
      subtitle: 'Joined the team',
      date: new Date(member.created_at),
      icon: Users,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    })),
    ...data.recent_media.map(media => ({
      id: `media-${media.id}`,
      type: 'Media File',
      title: media.title,
      subtitle: media.mime_type,
      date: new Date(media.created_at),
      icon: ImageIcon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    }))
  ];

  // Sort by date descending and take top 8
  const sortedActivity = allActivity
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const formatRelativeTime = (date: Date) => {
    const diffInMs = new Date().getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return `Yesterday`;
    return `${diffInDays}d ago`;
  };

  return (
    <Card variant="outline" className="p-0 h-full bg-surface-light border-border-primary overflow-hidden">
      <div className="p-6 pb-4 border-b border-border-primary">
        <Heading variant="h3" className="text-lg tracking-tight">Activity Feed</Heading>
      </div>
      
      {sortedActivity.length === 0 ? (
        <div className="text-center py-12">
          <Text variant="small" className="text-secondary-text">No recent activity found.</Text>
        </div>
      ) : (
        <div className="relative">
          {/* Continuous background line for timeline */}
          <div className="absolute left-[39px] top-6 bottom-6 w-px bg-border-primary/60" />
          
          <div className="flex flex-col py-2">
            {sortedActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="relative flex gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-default"
              >
                
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-border-primary ${activity.bgColor} ${activity.color} z-10 transition-transform group-hover:scale-110 shadow-sm`}>
                  <activity.icon className="w-3.5 h-3.5" />
                </div>
                
                <div className="flex-1 min-w-0 flex justify-between items-start pt-1.5">
                  <div className="pr-4 truncate">
                    <span className="block text-sm font-semibold text-primary-text truncate group-hover:text-accent-primary transition-colors">{activity.title}</span>
                    <span className="block text-xs text-secondary-text mt-0.5 truncate opacity-90">{activity.type} • {activity.subtitle}</span>
                  </div>
                  <span className="text-[11px] font-medium text-secondary-text whitespace-nowrap pt-0.5 group-hover:text-primary-text transition-colors">
                    {formatRelativeTime(activity.date)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
