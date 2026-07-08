import React from 'react';
import Card from '../ui/Card';
import Heading from '../ui/Heading';
import type { LeadAnalytics as LeadAnalyticsType } from '../../types/dashboard.types';

interface LeadAnalyticsProps {
  data: LeadAnalyticsType;
}

const LeadAnalytics: React.FC<LeadAnalyticsProps> = ({ data }) => {
  const statusColors: Record<string, string> = {
    'NEW': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'CONTACTED': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'QUALIFIED': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'PROPOSAL_SENT': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'NEGOTIATION': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    'WON': 'bg-green-500/10 text-green-500 border-green-500/20',
    'LOST': 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  const totalLeads = Object.values(data.status_distribution).reduce((acc, curr) => acc + curr, 0);

  return (
    <Card variant="outline" className="p-6 bg-surface-light border-border-primary">
      <Heading variant="h3" className="text-lg mb-6 tracking-tight">Lead Analytics</Heading>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-light border border-border-primary p-4 rounded-lg">
          <span className="block text-[10px] uppercase tracking-wider text-secondary-text mb-1">Today</span>
          <span className="text-2xl font-medium">{data.leads_today}</span>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-lg">
          <span className="block text-[10px] uppercase tracking-wider text-secondary-text mb-1">This Week</span>
          <span className="text-2xl font-medium">{data.leads_this_week}</span>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-lg">
          <span className="block text-[10px] uppercase tracking-wider text-secondary-text mb-1">This Month</span>
          <span className="text-2xl font-medium">{data.leads_this_month}</span>
        </div>
      </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(data.status_distribution).map(([status, count]) => {
            const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
            return (
              <div 
                key={status} 
                className={`p-4 rounded-xl border flex flex-col gap-2 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-default ${statusColors[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-90">{status.replace('_', ' ')}</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-white/20 dark:bg-black/20">{percentage}%</span>
                </div>
                <span className="text-2xl font-bold tracking-tight">{count}</span>
              </div>
            );
          })}
        </div>
    </Card>
  );
};

export default LeadAnalytics;
