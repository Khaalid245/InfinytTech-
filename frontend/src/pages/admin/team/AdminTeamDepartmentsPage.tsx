import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import DataTable, { type ColumnDef } from '../../../components/admin/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import { useAdminDepartments, useDeleteDepartment } from '../../../hooks/useTeamAdmin';
import DepartmentModal from '../../../components/admin/team/DepartmentModal';
import ConfirmDialog from '../../../components/admin/shared/ConfirmDialog';
import type { Department } from '../../../types/team';

const AdminTeamDepartmentsPage: React.FC = () => {
  const { data: departments = [], isLoading } = useAdminDepartments();
  const { mutateAsync: deleteDepartment } = useDeleteDepartment();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    dept?: Department;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  const handleCreate = () => {
    setSelectedDept(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept);
    setIsModalOpen(true);
  };

  const handleDelete = (dept: Department) => {
    if (dept.members_count && dept.members_count > 0) {
      toast.error(`Cannot delete ${dept.name} because it contains ${dept.members_count} members. Please move or delete the members first.`);
      return;
    }
    
    setDeleteDialog({
      isOpen: true,
      dept,
      title: 'Delete Department',
      description: `Are you sure you want to delete ${dept.name}? This action cannot be undone.`
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.dept) return;
    try {
      await deleteDepartment(deleteDialog.dept.id);
      toast.success('Department deleted successfully');
      setDeleteDialog({ isOpen: false, title: '', description: '' });
    } catch (err) {
      console.error('Failed to delete', err);
      toast.error('Failed to delete department.');
    }
  };

  const columns: ColumnDef<Department>[] = [
    {
      header: 'Name',
      accessor: (dept) => (
        <div className="flex items-center gap-3">
          <span className="font-medium text-primary-text">{dept.name}</span>
        </div>
      )
    },
    {
      header: 'Slug',
      accessor: (dept) => <span className="text-secondary-text">{dept.slug}</span>
    },
    {
      header: 'Members',
      accessor: (dept) => (
        <Badge variant={dept.members_count ? 'primary' : 'outline'}>
          {dept.members_count || 0}
        </Badge>
      )
    },
    {
      header: 'Order',
      accessor: (dept) => <span className="text-secondary-text">{dept.display_order}</span>
    },
    {
      header: 'Status',
      accessor: (dept) => (
        <Badge variant={dept.is_active ? 'accent' : 'secondary'}>
          {dept.is_active ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (dept) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(dept)}
            className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(dept)}
            className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title={dept.members_count && dept.members_count > 0 ? "Cannot delete department with active members" : "Delete"}
          >
            {dept.members_count && dept.members_count > 0 ? (
              <ShieldAlert className="w-4 h-4 text-orange-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-text">Departments</h1>
          <p className="text-secondary-text text-sm mt-1">Manage organizational groups for your team members.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Create Department
        </Button>
      </div>

      <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center text-secondary-text animate-pulse">Loading departments...</div>
        ) : departments.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-primary-text mb-2">No departments found</h3>
            <p className="text-secondary-text mb-6">Create your first department to organize your team.</p>
            <Button variant="secondary" onClick={handleCreate}>Create Department</Button>
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={departments} 
            keyExtractor={(d) => d.id} 
          />
        )}
      </div>

      <DepartmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={selectedDept}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, title: '', description: '' })}
        onConfirm={handleConfirmDelete}
        title={deleteDialog.title}
        description={deleteDialog.description}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default AdminTeamDepartmentsPage;
