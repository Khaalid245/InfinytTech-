import React, { useEffect } from 'react';
import Container from '../../components/layout/Container';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { RefreshCw, Image as ImageIcon, Users, Briefcase, FileText, Target, AlertCircle, Clock } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

// Sections
import DashboardStatsCards from '../../components/admin/DashboardStatsCards';
import LeadAnalytics from '../../components/admin/LeadAnalytics';
import ContentHealth from '../../components/admin/ContentHealth';
import SystemHealth from '../../components/admin/SystemHealth';
import RecentActivity from '../../components/admin/RecentActivity';

const AdminDashboardPage: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();

  useEffect(() => {
    // Add dark mode explicitly for admin dashboard to ensure it looks premium
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  if (isLoading) {
    return (
      <div className="py-12">
        <Container size="xl" className="space-y-12">
          {/* Skeleton Header */}
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-border-primary rounded w-32"></div>
            <div className="h-10 bg-border-primary rounded w-64"></div>
            <div className="h-4 bg-border-primary rounded w-96"></div>
          </div>
          {/* Skeleton KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-border-primary rounded-xl"></div>
            ))}
          </div>
          {/* Skeleton Wide Section */}
          <div className="h-64 bg-border-primary rounded-xl animate-pulse"></div>
        </Container>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="py-12">
        <Container size="xl">
          <EmptyState
            icon={AlertCircle}
            title="Dashboard Unavailable"
            description={error?.message || "Failed to load dashboard data. Please verify your connection and permissions."}
            actionText="Retry Connection"
            onAction={() => refetch()}
          />
        </Container>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Calculate smart summary gracefully
  const smartSummary = (() => {
    if (!data) return null;
    const newLeads = data.overview.leads.new || 0;
    const draftPosts = data.overview.blog.drafts || 0;
    
    if (newLeads === 0 && draftPosts === 0) {
      return "All systems normal. You are fully caught up.";
    }
    
    const parts = [];
    if (newLeads > 0) parts.push(`${newLeads} new lead${newLeads !== 1 ? 's' : ''}`);
    if (draftPosts > 0) parts.push(`${draftPosts} unpublished blog post${draftPosts !== 1 ? 's' : ''}`);
    
    return `You currently have ${parts.join(' and ')}.`;
  })();

  return (
    <div className="pb-12">
      <Container size="xl" className="space-y-12 animate-fade-in">
        
        {/* 1. Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-primary pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-[10px] text-accent-primary uppercase font-bold tracking-widest mb-3">
              <span>{currentDate}</span>
              <span className="w-1 h-1 rounded-full bg-accent-primary opacity-50"></span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {currentTime}</span>
            </div>
            <Heading variant="h1" className="text-3xl md:text-4xl tracking-tight text-primary-text">
              Welcome back, Administrator
            </Heading>
            {smartSummary && (
              <Text variant="body" className="text-secondary-text max-w-2xl mt-2">
                {smartSummary}
              </Text>
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            <Button 
              variant="secondary" 
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />}
              onClick={() => refetch()}
              disabled={isRefetching}
              className="bg-surface-light hover:bg-surface-dark border-border-primary"
            >
              Sync
            </Button>
          </div>
        </div>

        {/* 2. KPI Overview */}
        <section className="space-y-6">
          <DashboardStatsCards overview={data.overview} />
        </section>

        {/* 3. Quick Actions */}
        <section className="space-y-4">
          <Heading variant="h4" className="text-sm uppercase tracking-wider text-secondary-text font-semibold">Quick Actions</Heading>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="bg-surface-light hover:bg-surface-dark shadow-sm hover:shadow" leftIcon={<Briefcase className="w-4 h-4 text-blue-500" />}>Create Portfolio</Button>
            <Button variant="secondary" className="bg-surface-light hover:bg-surface-dark shadow-sm hover:shadow" leftIcon={<FileText className="w-4 h-4 text-orange-500" />}>Write Blog</Button>
            <Button variant="secondary" className="bg-surface-light hover:bg-surface-dark shadow-sm hover:shadow" leftIcon={<LayersIcon className="text-purple-500" />} >Create Service</Button>
            <Button variant="secondary" className="bg-surface-light hover:bg-surface-dark shadow-sm hover:shadow" leftIcon={<ImageIcon className="w-4 h-4 text-indigo-500" />}>Upload Media</Button>
            <Button variant="secondary" className="bg-surface-light hover:bg-surface-dark shadow-sm hover:shadow" leftIcon={<Users className="w-4 h-4 text-cyan-500" />}>Add Team Member</Button>
            <Button variant="primary" className="shadow-md hover:shadow-lg transition-shadow" leftIcon={<Target className="w-4 h-4" />}>View Leads</Button>
          </div>
        </section>

        {/* 4. Lead Pipeline */}
        <section className="space-y-6">
          <Heading variant="h4" className="text-sm uppercase tracking-wider text-secondary-text font-semibold">Lead Pipeline</Heading>
          <LeadAnalytics data={data.lead_analytics} />
        </section>

        {/* 5. Recent Activity */}
        <section className="space-y-6">
          <Heading variant="h4" className="text-sm uppercase tracking-wider text-secondary-text font-semibold">Recent Activity</Heading>
          <RecentActivity data={data.recent_activity} />
        </section>

        {/* Grid for Health Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 6. Content Health */}
          <section className="space-y-6">
            <Heading variant="h4" className="text-sm uppercase tracking-wider text-secondary-text font-semibold">Content Health</Heading>
            <ContentHealth data={data.content_health} />
          </section>

          {/* 7. System Health */}
          <section className="space-y-6">
            <Heading variant="h4" className="text-sm uppercase tracking-wider text-secondary-text font-semibold">System Health</Heading>
            <SystemHealth data={data.system_health} />
          </section>
        </div>

      </Container>
    </div>
  );
};

// Helper for inline icon
const LayersIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
    <polyline points="2 12 12 17 22 12"></polyline>
    <polyline points="2 17 12 22 22 17"></polyline>
  </svg>
);

export default AdminDashboardPage;
