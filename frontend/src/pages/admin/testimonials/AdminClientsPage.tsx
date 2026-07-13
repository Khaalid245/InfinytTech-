import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import Button from '../../../components/ui/Button';
import DataTable, { type ColumnDef } from '../../../components/admin/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import { useAdminClients, useDeleteClient } from '../../../hooks/useTestimonialsAdmin';
import ClientDrawer from '../../../components/admin/testimonials/ClientDrawer';
import type { Client } from '../../../types/testimonials';
import { resolveImageUrl } from '../../../utils/imageHelper';

export default function AdminClientsPage() {
  const { data: clients = [], isLoading: clientsLoading } = useAdminClients();
  const { mutateAsync: deleteClient } = useDeleteClient();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  
  // Selection
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Dashboard Stats
  const totalClients = clients.length;
  const publishedClients = clients.filter(c => c.is_active !== false).length;
  const uniqueIndustries = new Set(clients.map(c => c.industry).filter(Boolean)).size;

  const handleCreate = () => {
    setSelectedClient(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (client.testimonials_count && client.testimonials_count > 0) {
      window.alert(`Cannot delete ${client.company_name} because they have ${client.testimonials_count} associated testimonial(s). Please delete the testimonials first or unpublish the client instead.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${client.company_name}?`)) {
      try {
        await deleteClient(client.id);
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleSelectRow = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(client.id)) {
      newSelected.delete(client.id);
    } else {
      newSelected.add(client.id);
    }
    setSelectedKeys(newSelected);
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesSearch = 
        c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (c.website || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = selectedIndustry === 'all' || c.industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [clients, searchQuery, selectedIndustry]);

  const industriesList = Array.from(new Set(clients.map(c => c.industry).filter(Boolean)));

  const columns: ColumnDef<Client>[] = [
    {
      header: 'Company',
      accessor: (c) => (
        <div className="flex items-center gap-3">
          {c.company_logo ? (
            <div className="w-10 h-10 rounded-md bg-white border border-border-primary flex items-center justify-center overflow-hidden p-1 shrink-0">
              <img src={resolveImageUrl(c.company_logo.file)} alt={`${c.company_name} logo`} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-md bg-black/5 dark:bg-white/5 border border-border-primary flex items-center justify-center text-secondary-text font-medium text-sm shrink-0">
              {c.company_name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="font-medium text-primary-text">{c.company_name}</div>
        </div>
      )
    },
    {
      header: 'Industry',
      accessor: (c) => <span className="text-sm">{c.industry || '-'}</span>
    },
    {
      header: 'Website',
      accessor: (c) => c.website ? (
        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-primary hover:underline truncate max-w-[150px] inline-block" title={c.website} onClick={e => e.stopPropagation()}>
          {c.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>
      ) : <span className="text-sm text-secondary-text">-</span>
    },
    {
      header: 'Country',
      accessor: (c) => <span className="text-sm text-secondary-text">{c.country || '-'}</span>
    },
    {
      header: 'Testimonials',
      accessor: (c) => (
        <span className={`text-sm ${c.testimonials_count ? 'font-medium text-primary-text' : 'text-secondary-text'}`}>
          {c.testimonials_count || 0}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (c) => (
        <Badge variant={c.is_active !== false ? 'accent' : 'secondary'}>
          {c.is_active !== false ? 'Published' : 'Draft'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (c) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(c)}
            className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
            title={`Edit ${c.company_name}`}
            aria-label="Edit Client"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(c)}
            className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title={`Delete ${c.company_name}`}
            aria-label="Delete Client"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Client Manager</h1>
          <p className="text-secondary-text text-sm mt-1">Manage your trusted partners and corporate clients.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Client
        </Button>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Clients</div>
          <div className="text-2xl font-bold text-primary-text">{totalClients}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Published</div>
          <div className="text-2xl font-bold text-primary-text">{publishedClients}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Industries</div>
          <div className="text-2xl font-bold text-primary-text">{uniqueIndustries}</div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface-light p-4 rounded-xl border border-border-primary shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
            >
              <option value="all">All Industries</option>
              {industriesList.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm relative">
        {clientsLoading ? (
          <div className="p-8 text-center text-secondary-text animate-pulse">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-primary-text mb-2">No clients found</h3>
            <p className="text-secondary-text mb-6">There are no clients matching your criteria.</p>
            {searchQuery || selectedIndustry !== 'all' ? (
              <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedIndustry('all'); }}>Clear Filters</Button>
            ) : (
              <Button variant="secondary" onClick={handleCreate}>Add Client</Button>
            )}
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredClients} 
            keyExtractor={(c) => c.id}
            selectedKeys={selectedKeys}
            onSelectRow={handleSelectRow}
            onRowClick={(c) => handleEdit(c)}
          />
        )}
      </div>

      <ClientDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        client={selectedClient}
      />
    </div>
  );
}
