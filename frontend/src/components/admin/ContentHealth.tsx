import React from 'react';
import Card from '../ui/Card';
import Heading from '../ui/Heading';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import type { ContentHealth as ContentHealthType } from '../../types/dashboard.types';

interface ContentHealthProps {
  data: ContentHealthType;
}

const ContentHealth: React.FC<ContentHealthProps> = ({ data }) => {
  const issues = [
    { label: 'Projects missing featured images', count: data.projects_without_image },
    { label: 'Blog posts missing SEO', count: data.blog_posts_missing_seo },
    { label: 'Services missing features', count: data.services_without_features },
    { label: 'Testimonials missing logos', count: data.testimonials_without_logo },
    { label: 'Inactive social links', count: data.inactive_social_links },
    { label: 'Missing office locations', count: data.missing_office_locations },
  ];

  const hasIssues = issues.some(issue => issue.count > 0);

  return (
    <Card variant="outline" className="p-0 h-full bg-surface-light border-border-primary overflow-hidden">
      <div className="p-6 pb-4 border-b border-border-primary flex items-center justify-between">
        <Heading variant="h3" className="text-lg tracking-tight">Content Health</Heading>
        {hasIssues ? (
          <span className="flex items-center text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3 mr-1" /> Needs Attention
          </span>
        ) : (
          <span className="flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3 mr-1" /> Healthy
          </span>
        )}
      </div>

      <div className="flex flex-col">
        {issues.map((issue, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between p-4 border-b border-border-primary last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-default"
          >
            <div className="flex items-center gap-3">
              {issue.count > 0 ? (
                <AlertTriangle className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500 opacity-80" />
              )}
              <span className={`text-sm font-medium ${issue.count > 0 ? 'text-primary-text' : 'text-secondary-text'}`}>
                {issue.label}
              </span>
            </div>
            
            {issue.count > 0 ? (
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm">
                {issue.count} Issue{issue.count !== 1 ? 's' : ''}
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-500/80">
                Healthy
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ContentHealth;
