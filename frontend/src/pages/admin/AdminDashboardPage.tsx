import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../../components/layout/Container';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { 
  RefreshCw, Image as ImageIcon, Briefcase, 
  FileText, Target, AlertCircle, Clock, Layers,
  ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

// Sections
import DashboardStatsCards from '../../components/admin/DashboardStatsCards';
import LeadAnalytics from '../../components/admin/LeadAnalytics';
import ContentHealth from '../../components/admin/ContentHealth';
import SystemHealth from '../../components/admin/SystemHealth';
import RecentActivity from '../../components/admin/RecentActivity';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();

  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return null;
  }, []);

  const adminName = useMemo(() => {
    if (currentUser?.first_name) {
      return `${currentUser.first_name} ${currentUser.last_name || ''}`.trim();
    }
    return 'Administrator';
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="py-8">
        <Container size="xl" className="space-y-8">
          {/* Skeleton Header */}
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-border-primary rounded w-32"></div>
            <div className="h-10 bg-border-primary rounded w-64"></div>
            <div className="h-4 bg-border-primary rounded w-96"></div>
          </div>
          {/* Skeleton KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-36 bg-border-primary rounded-xl"></div>
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

  const newLeadsCount = data.overview.leads.new || 0;
  const draftPostsCount = data.overview.blog.drafts || 0;

  const quickActions = [
    {
      id: 'create-project',
      label: 'New Project',
      desc: 'Publish case study',
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      path: '/admin/portfolio',
    },
    {
      id: 'write-blog',
      label: 'Write Article',
      desc: 'Create blog post',
      icon: FileText,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      path: '/admin/blog',
    },
    {
      id: 'create-service',
      label: 'Add Service',
      desc: 'Core offering',
      icon: Layers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      path: '/admin/services',
    },
    {
      id: 'upload-media',
      label: 'Upload Media',
      desc: 'Images & SVGs',
      icon: ImageIcon,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      path: '/admin/media',
    },
    {
      id: 'view-leads',
      label: 'Review Leads',
      desc: `${newLeadsCount} pending`,
      icon: Target,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      path: '/admin/leads',
      highlight: newLeadsCount > 0,
    },
  ];

  return (
    <div className="pb-12 space-y-8 animate-fade-in">
      <Container size="xl" className="space-y-8">
        
        {/* ── 1. Executive Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-surface-light border border-border-primary shadow-sm">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-text">
              <span className="font-semibold text-primary-text">{currentDate}</span>
              <span className="w-1 h-1 rounded-full bg-border-primary"></span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]"><Clock className="w-3.5 h-3.5 text-secondary-text" /> {currentTime}</span>
              <span className="w-1 h-1 rounded-full bg-border-primary"></span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> System Operational
              </span>
            </div>
            
            <Heading variant="h1" className="text-2xl md:text-3xl font-bold tracking-tight text-primary-text">
              Welcome back, {adminName}
            </Heading>
            
            <Text variant="small" className="text-secondary-text">
              {newLeadsCount > 0 
                ? `You have ${newLeadsCount} new client ${newLeadsCount === 1 ? 'inquiry' : 'inquiries'} awaiting response${draftPostsCount > 0 ? ` and ${draftPostsCount} draft articles.` : '.'}`
                : draftPostsCount > 0 
                ? `All inquiries answered. You have ${draftPostsCount} draft articles ready for review.`
                : 'All incoming inquiries and content queues are up to date.'}
            </Text>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button 
              variant="secondary" 
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />}
              onClick={() => refetch()}
              disabled={isRefetching}
              className="bg-surface hover:bg-surface-dark border-border-primary text-xs"
            >
              Refresh Data
            </Button>
            <Button 
              variant="primary" 
              leftIcon={<Zap className="w-4 h-4" />}
              onClick={() => navigate('/admin/leads')}
              className="text-xs shadow-md"
            >
              Open Pipeline
            </Button>
          </div>
        </div>

        {/* ── 2. KPI Metrics Overview ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-text">Executive Performance Overview</h3>
            <span className="text-xs text-secondary-text">Live metrics updated in real-time</span>
          </div>
          <DashboardStatsCards overview={data.overview} />
        </section>

        {/* ── 3. Quick Action Hub ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-text">Quick Actions & Shortcuts</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className={`p-4 rounded-xl bg-surface-light border transition-all text-left group hover:-translate-y-0.5 hover:shadow-md cursor-pointer flex flex-col justify-between h-28 ${
                  action.highlight 
                    ? 'border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500' 
                    : 'border-border-primary hover:border-accent-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg border ${action.bgColor}`}>
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-secondary-text opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-primary-text group-hover:text-accent-primary transition-colors">
                    {action.label}
                  </span>
                  <span className="block text-[11px] text-secondary-text truncate">
                    {action.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── 4. Main Intelligence & Operations Split (2 Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (CRM Pipeline & Content Health — 7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Lead Pipeline */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-text">Client Inquiries & Pipeline</h3>
                <button 
                  onClick={() => navigate('/admin/leads')}
                  className="text-xs font-semibold text-accent-primary hover:underline"
                >
                  View All Leads &rarr;
                </button>
              </div>
              <LeadAnalytics data={data.lead_analytics} />
            </section>

            {/* Content Health */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-text">Content & Catalog Health</h3>
                <button 
                  onClick={() => navigate('/admin/portfolio')}
                  className="text-xs font-semibold text-accent-primary hover:underline"
                >
                  Manage Portfolio &rarr;
                </button>
              </div>
              <ContentHealth data={data.content_health} />
            </section>
          </div>

          {/* Right Column (Live Activity Stream & System Health — 5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Recent Activity */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-text">Live Platform Activity</h3>
              </div>
              <RecentActivity data={data.recent_activity} />
            </section>

            {/* System Health */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-secondary-text">System & Infrastructure</h3>
                <button 
                  onClick={() => navigate('/admin/settings/system')}
                  className="text-xs font-semibold text-accent-primary hover:underline"
                >
                  Diagnostics &rarr;
                </button>
              </div>
              <SystemHealth data={data.system_health} />
            </section>
          </div>

        </div>

      </Container>
    </div>
  );
};

export default AdminDashboardPage;
