import { useState } from 'react';
import { 
  Trash2, Search, ChevronDown, Plus
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import AdminLayout from '../../../components/admin/layout/AdminLayout';
import DataTable from '../../../components/admin/shared/DataTable';
import type { ColumnDef } from '../../../components/admin/shared/DataTable';
import ConfirmDialog from '../../../components/admin/shared/ConfirmDialog';
import SkeletonTable from '../../../components/admin/shared/SkeletonTable';
import UserDrawer from '../../../components/admin/users/UserDrawer';

import { 
  useAdminUsers,
  useDeleteUser
} from '../../../hooks/useUsersAdmin';
import type { UserListResponse } from '../../../types/users';
import Button from '../../../components/ui/Button';

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-bold',
  admin: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 font-semibold',
  content_manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  sales: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  hr: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  editor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // DataTable state
  const page = 1;
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Drawer state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Queries
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsers({
    page,
    search: search || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  });

  // Mutations
  const deleteUser = useDeleteUser();
  const queryClient = useQueryClient();

  const handleRowClick = (user: UserListResponse) => {
    setSelectedUserId(user.id);
    setIsDrawerOpen(true);
  };

  const handleCreateUser = () => {
    setSelectedUserId(null); // null ID means create mode
    setIsDrawerOpen(true);
  };

  const handleBulkDelete = () => {
    if (!selectedIds.length) return;
    // Bulk delete not strictly implemented in API yet, 
    // so we will loop over selectedIds for now or rely on a bulk endpoint if we had one.
    // For Phase 19, we will just delete one by one.
    Promise.all(selectedIds.map(id => deleteUser.mutateAsync(id)))
      .then(() => {
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['users'] });
      })
      .catch((error) => {
        console.error(error);
        setIsDeleteModalOpen(false);
      });
  };

  const columns: ColumnDef<UserListResponse>[] = [
    {
      header: 'User',
      accessor: (user: UserListResponse) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-light border border-border-primary shrink-0 flex items-center justify-center">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-secondary-text text-sm font-medium">
                {user.first_name?.[0]}{user.last_name?.[0]}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-primary-text">{user.full_name || 'No Name'}</span>
            <span className="text-sm text-secondary-text">{user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (user: UserListResponse) => (
        <span className={`px-2.5 py-1 rounded-full text-xs uppercase tracking-wider ${ROLE_COLORS[user.role]}`}>
          {user.role.replace('_', ' ')}
        </span>
      )
    },
    {
      header: 'Department',
      accessor: (user: UserListResponse) => user.department ? (
        <span className="text-sm">{user.department}</span>
      ) : (
        <span className="text-secondary-text/50">—</span>
      )
    },
    {
      header: 'Status',
      accessor: (user: UserListResponse) => (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">{user.is_active ? 'Active' : 'Inactive'}</span>
        </div>
      )
    },
    {
      header: 'Last Login',
      accessor: (user: UserListResponse) => user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'
    }
  ];

  const handleSelectionChange = (user: UserListResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (set.has(user.id)) {
        set.delete(user.id);
      } else {
        set.add(user.id);
      }
      return Array.from(set);
    });
  };

  const users = usersData?.results || [];
  
  // Calculate KPIs
  const totalUsers = usersData?.count || 0;
  const activeUsers = users.filter((u: UserListResponse) => u.is_active).length;
  const admins = users.filter((u: UserListResponse) => ['admin', 'super_admin'].includes(u.role)).length;
  const editors = users.filter((u: UserListResponse) => u.role === 'editor').length;
  const sales = users.filter((u: UserListResponse) => u.role === 'sales').length;

  return (
    <AdminLayout>
      <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto animate-fade-in">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-text tracking-tight mb-1">User Management</h1>
            <p className="text-secondary-text">Manage system users, roles, and enterprise access.</p>
          </div>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleCreateUser}>
            Add User
          </Button>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
            <p className="text-sm text-secondary-text mb-1">Total Users</p>
            <h3 className="text-2xl font-bold text-primary-text">{totalUsers}</h3>
          </div>
          <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
            <p className="text-sm text-secondary-text mb-1">Active</p>
            <h3 className="text-2xl font-bold text-green-500">{activeUsers}</h3>
          </div>
          <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
            <p className="text-sm text-secondary-text mb-1">Administrators</p>
            <h3 className="text-2xl font-bold text-orange-500">{admins}</h3>
          </div>
          <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
            <p className="text-sm text-secondary-text mb-1">Editors</p>
            <h3 className="text-2xl font-bold text-indigo-500">{editors}</h3>
          </div>
          <div className="p-4 bg-surface-light border border-border-primary rounded-xl">
            <p className="text-sm text-secondary-text mb-1">Sales</p>
            <h3 className="text-2xl font-bold text-emerald-500">{sales}</h3>
          </div>
        </div>

        {/* Toolbar & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-light border border-border-primary rounded-lg text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-4 pr-8 py-2 bg-surface-light border border-border-primary rounded-lg text-sm appearance-none focus:outline-none focus:border-accent-primary"
              >
                <option value="">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="content_manager">Content Manager</option>
                <option value="sales">Sales</option>
                <option value="hr">HR</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-8 py-2 bg-surface-light border border-border-primary rounded-lg text-sm appearance-none focus:outline-none focus:border-accent-primary"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text pointer-events-none" />
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 animate-fade-in">
              <span className="text-sm font-medium text-red-500 mr-2">
                {selectedIds.length} selected
              </span>
              
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded transition-colors font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-surface-light rounded-xl border border-border-primary overflow-hidden">
          {isUsersLoading ? (
            <SkeletonTable columns={5} rows={5} />
          ) : (
            <DataTable
              data={users}
              columns={columns}
              keyExtractor={(item: UserListResponse) => item.id}
              onRowClick={handleRowClick}
              selectedKeys={new Set(selectedIds)}
              onSelectRow={handleSelectionChange}
            />
          )}
        </div>
      </div>

      <UserDrawer
        userId={selectedUserId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUserId(null);
        }}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Users"
        description={`Are you sure you want to delete ${selectedIds.length} user(s)? This action cannot be undone.`}
        confirmText="Delete Users"
        onConfirm={handleBulkDelete}
        variant="danger"
      />
    </AdminLayout>
  );
}
