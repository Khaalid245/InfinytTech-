import { useState } from 'react';
import { 
  Trash2, Search, Filter, ChevronDown 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import AdminLayout from '../../../components/admin/layout/AdminLayout';
import DataTable from '../../../components/admin/shared/DataTable';
import type { ColumnDef } from '../../../components/admin/shared/DataTable';
import ConfirmDialog from '../../../components/admin/shared/ConfirmDialog';
import SkeletonTable from '../../../components/admin/shared/SkeletonTable';
import LeadDrawer from '../../../components/admin/leads/LeadDrawer';

import { 
  useAdminLeads, 
  useLeadAnalytics, 
  useBulkUpdateLeads, 
  useBulkDeleteLeads 
} from '../../../hooks/useLeadsAdmin';
import type { Lead } from '../../../types/leads';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  contacted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  qualified: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  proposal_sent: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  won: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-bold',
};

const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

export default function AdminLeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // DataTable state
  const page = 1;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Drawer state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries
  const { data: leadsData, isLoading: isLeadsLoading } = useAdminLeads({
    page,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const { data: analytics } = useLeadAnalytics();

  // Mutations
  const bulkUpdate = useBulkUpdateLeads();
  const bulkDelete = useBulkDeleteLeads();

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleBulkStatus = (status: string) => {
    if (!selectedIds.length) return;
    bulkUpdate.mutate({ lead_ids: selectedIds, status }, {
      onSuccess: () => setSelectedIds([])
    });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    bulkDelete.mutate({ lead_ids: selectedIds }, {
      onSuccess: () => {
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
      }
    });
  };

  const columns: ColumnDef<Lead>[] = [
    {
      header: 'Lead Name',
      accessor: (lead) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary-text">{lead.first_name} {lead.last_name}</span>
          <span className="text-sm text-secondary-text">{lead.email}</span>
        </div>
      )
    },
    {
      header: 'Company',
      accessor: (lead) => lead.company || <span className="text-secondary-text/50">—</span>
    },
    {
      header: 'Priority',
      accessor: (lead) => (
        <span className={`px-2.5 py-1 rounded-full text-xs uppercase tracking-wider ${PRIORITY_COLORS[lead.priority]}`}>
          {lead.priority}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (lead) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[lead.status]}`}>
          {lead.status.replace('_', ' ').toUpperCase()}
        </span>
      )
    },
    {
      header: 'Assigned To',
      accessor: (lead) => lead.assigned_to_name ? (
        <span className="text-sm">{lead.assigned_to_name}</span>
      ) : (
        <span className="text-sm text-secondary-text italic">Unassigned</span>
      )
    },
    {
      header: 'Created',
      accessor: (lead) => new Date(lead.created_at).toLocaleDateString()
    }
  ];

  const handleSelectionChange = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (set.has(lead.id)) {
        set.delete(lead.id);
      } else {
        set.add(lead.id);
      }
      return Array.from(set);
    });
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        
        {/* KPI Dashboard */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <p className="text-sm text-secondary-text mb-1">Total Leads</p>
              <h3 className="text-2xl font-bold text-primary-text">{analytics.kpis.total}</h3>
            </div>
            <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <p className="text-sm text-secondary-text mb-1">New Leads</p>
              <h3 className="text-2xl font-bold text-blue-500">{analytics.kpis.new}</h3>
            </div>
            <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <p className="text-sm text-secondary-text mb-1">Contacted</p>
              <h3 className="text-2xl font-bold text-purple-500">{analytics.kpis.contacted}</h3>
            </div>
            <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <p className="text-sm text-secondary-text mb-1">Qualified</p>
              <h3 className="text-2xl font-bold text-indigo-500">{analytics.kpis.qualified}</h3>
            </div>
            <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <p className="text-sm text-secondary-text mb-1">Won</p>
              <h3 className="text-2xl font-bold text-emerald-500">{analytics.kpis.won}</h3>
            </div>
            <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
              <p className="text-sm text-secondary-text mb-1">Conv. Rate</p>
              <h3 className="text-2xl font-bold text-accent-primary">{analytics.kpis.conversion_rate}%</h3>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-surface-light border border-border-primary rounded-xl">
              <h3 className="text-lg font-bold text-primary-text mb-6">Monthly Leads</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthly}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border-primary/50" />
                    <XAxis dataKey="month" tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fill: '#888', fontSize: 12}} axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                    <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-6 bg-surface-light border border-border-primary rounded-xl">
              <h3 className="text-lg font-bold text-primary-text mb-6">Lead Sources</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.sources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="source"
                    >
                      {analytics.sources.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-light border border-border-primary rounded-lg text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-surface-light border border-border-primary rounded-lg text-sm appearance-none focus:outline-none focus:border-accent-primary"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text pointer-events-none" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text pointer-events-none" />
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-accent-primary/10 px-4 py-2 rounded-lg border border-accent-primary/20 animate-fade-in">
              <span className="text-sm font-medium text-accent-primary mr-2">
                {selectedIds.length} selected
              </span>
              
              <select
                onChange={(e) => handleBulkStatus(e.target.value)}
                className="text-xs py-1.5 px-3 rounded bg-white dark:bg-black border border-border-primary cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Change Status...</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
              
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Delete Selected"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-surface-light rounded-xl border border-border-primary overflow-hidden">
          {isLeadsLoading ? (
            <SkeletonTable columns={6} rows={5} />
          ) : (
            <DataTable
              data={leadsData?.results || []}
              columns={columns}
              keyExtractor={(item) => item.id}
              onRowClick={handleRowClick}
              selectedKeys={new Set(selectedIds)}
              onSelectRow={handleSelectionChange}
            />
          )}
        </div>
      </div>

      <LeadDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Leads"
        description={`Are you sure you want to delete ${selectedIds.length} lead(s)? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleBulkDelete}
        variant="danger"
      />
    </AdminLayout>
  );
}
