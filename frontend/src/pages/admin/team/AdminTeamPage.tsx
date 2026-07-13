import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import Button from '../../../components/ui/Button';
import DataTable, { type ColumnDef } from '../../../components/admin/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import { useAdminTeamMembers, useAdminDepartments, useDeleteTeamMember } from '../../../hooks/useTeamAdmin';
import TeamMemberDrawer from '../../../components/admin/team/TeamMemberDrawer';
import type { TeamMember } from '../../../types/team';
import { resolveImageUrl } from '../../../utils/imageHelper';

const AdminTeamPage: React.FC = () => {
  const { data: members = [], isLoading: membersLoading } = useAdminTeamMembers();
  const { data: departments = [] } = useAdminDepartments();
  const { mutateAsync: deleteMember } = useDeleteTeamMember();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('all');
  
  // Selection
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Dashboard Stats
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.is_active).length;
  const numDepartments = departments.length;
  const leadershipCount = members.filter(m => m.is_featured).length;
  const recentlyAddedCount = members.filter(m => {
    if (!m.created_at) return false;
    const addedDate = new Date(m.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return addedDate >= thirtyDaysAgo;
  }).length;

  const handleCreate = () => {
    setSelectedMember(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (member: TeamMember) => {
    if (window.confirm(`Are you sure you want to delete ${member.full_name}?`)) {
      try {
        await deleteMember(member.id);
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleSelectRow = (member: TeamMember, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(member.id)) {
      newSelected.delete(member.id);
    } else {
      newSelected.add(member.id);
    }
    setSelectedKeys(newSelected);
  };

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch = 
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.position.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDeptId === 'all' || m.department?.id === selectedDeptId;
      return matchesSearch && matchesDept;
    });
  }, [members, searchQuery, selectedDeptId]);

  const columns: ColumnDef<TeamMember>[] = [
    {
      header: 'Member',
      accessor: (m) => (
        <div className="flex items-center gap-3">
          {m.photo ? (
            <img src={resolveImageUrl(m.photo.file)} alt={m.full_name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-secondary-text font-medium text-sm">
              {m.first_name[0]}{m.last_name[0]}
            </div>
          )}
          <div>
            <div className="font-medium text-primary-text">{m.full_name}</div>
            <div className="text-xs text-secondary-text">{m.email || 'No email'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Position',
      accessor: (m) => <span className="text-sm">{m.position}</span>
    },
    {
      header: 'Department',
      accessor: (m) => <span className="text-sm text-secondary-text">{m.department?.name || '-'}</span>
    },
    {
      header: 'Exp',
      accessor: (m) => <span className="text-sm">{m.years_of_experience ? `${m.years_of_experience} yrs` : '-'}</span>
    },
    {
      header: 'Status',
      accessor: (m) => (
        <Badge variant={m.is_active ? 'accent' : 'secondary'}>
          {m.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (m) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(m)}
            className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(m)}
            className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete"
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
          <h1 className="text-2xl font-semibold text-primary-text">Team Manager</h1>
          <p className="text-secondary-text text-sm mt-1">Manage your organization's staff and member profiles.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Member
        </Button>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Members</div>
          <div className="text-2xl font-bold text-primary-text">{totalMembers}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Departments</div>
          <div className="text-2xl font-bold text-primary-text">{numDepartments}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Active</div>
          <div className="text-2xl font-bold text-primary-text">{activeMembers}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Leadership</div>
          <div className="text-2xl font-bold text-primary-text">{leadershipCount}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">New (30d)</div>
          <div className="text-2xl font-bold text-primary-text">{recentlyAddedCount}</div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface-light p-4 rounded-xl border border-border-primary shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm relative">
        {membersLoading ? (
          <div className="p-8 text-center text-secondary-text animate-pulse">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-primary-text mb-2">No members found</h3>
            <p className="text-secondary-text mb-6">There are no members matching your criteria.</p>
            {searchQuery || selectedDeptId !== 'all' ? (
              <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedDeptId('all'); }}>Clear Filters</Button>
            ) : (
              <Button variant="secondary" onClick={handleCreate}>Add Member</Button>
            )}
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredMembers} 
            keyExtractor={(m) => m.id}
            selectedKeys={selectedKeys}
            onSelectRow={handleSelectRow}
            onRowClick={(m) => handleEdit(m)}
          />
        )}
      </div>

      <TeamMemberDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        member={selectedMember}
        departments={departments}
      />
    </div>
  );
};

export default AdminTeamPage;
