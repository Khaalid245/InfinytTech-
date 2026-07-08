import React, { useState } from 'react';
import { Plus, Search, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Heading from '../../components/ui/Heading';
import Button from '../../components/ui/Button';

import type { BlogTag, BlogTagFormData } from '../../types/blog';
import { 
  useAdminBlogTags, 
  useCreateBlogTag, 
  useUpdateBlogTag, 
  useDeleteBlogTag 
} from '../../hooks/useBlog';

import TagFormModal from '../../components/admin/blog/TagFormModal';
import ConfirmDialog from '../../components/admin/shared/ConfirmDialog';
import EmptyState from '../../components/admin/shared/EmptyState';
import SkeletonTable from '../../components/admin/shared/SkeletonTable';
import DataTable from '../../components/admin/shared/DataTable';
import Pagination from '../../components/admin/shared/Pagination';

export default function AdminBlogTagsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;

  // React Query Hooks
  const { data: tagsData, isLoading } = useAdminBlogTags({ page, page_size: 10, search });
  const createMutation = useCreateBlogTag();
  const updateMutation = useUpdateBlogTag();
  const deleteMutation = useDeleteBlogTag();

  // Local State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | undefined>();
  const [deleteConfirmTag, setDeleteConfirmTag] = useState<BlogTag | null>(null);
  const [searchTerm, setSearchTerm] = useState(search || '');

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    if (newPage > 1) params.set('page', newPage.toString());
    else params.delete('page');
    setSearchParams(params);
  };

  const handleOpenCreate = () => {
    setEditingTag(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: BlogTagFormData) => {
    if (editingTag) {
      await updateMutation.mutateAsync({ id: editingTag.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
  };

  const handleDeleteClick = (tag: BlogTag) => {
    setDeleteConfirmTag(tag);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmTag) {
      await deleteMutation.mutateAsync(deleteConfirmTag.id);
      setDeleteConfirmTag(null);
    }
  };

  // Build Table Columns
  const columns = [
    {
      header: 'Tag Name',
      accessor: (tag: BlogTag) => (
        <div>
          <p className="font-semibold text-primary-text">{tag.name}</p>
          <p className="text-xs text-secondary-text font-mono mt-0.5">{tag.slug}</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: (tag: BlogTag) => (
        <span className="text-secondary-text truncate max-w-[200px] block" title={tag.description}>
          {tag.description || '—'}
        </span>
      ),
    },
    {
      header: 'Usage Count',
      accessor: (tag: BlogTag) => (
        <div className="flex items-center gap-2">
          <span className="bg-black/5 dark:bg-white/5 text-primary-text px-2 py-0.5 rounded-full text-xs font-semibold">
            {tag.usage_count || 0}
          </span>
          <span className="text-xs text-secondary-text">posts</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (tag: BlogTag) => {
        const isActive = tag.is_active ?? true;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isActive 
              ? 'bg-green-500/10 text-green-600 border-green-500/20'
              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (tag: BlogTag) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEdit(tag)}
            className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
            title="Edit Tag"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteClick(tag)}
            className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete Tag"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }
  ];

  const hasPosts = deleteConfirmTag && (deleteConfirmTag.usage_count || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading variant="h2" className="text-2xl font-bold tracking-tight text-primary-text">
            Blog Tags
          </Heading>
          <p className="text-secondary-text mt-1 text-sm">
            Manage keywords and micro-taxonomies for your articles.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <input 
              type="text" 
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-light border border-border-primary focus:border-accent-primary rounded-lg text-sm outline-none transition-all w-full sm:w-64 text-primary-text"
            />
          </form>
          <Button variant="primary" onClick={handleOpenCreate} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Create Tag
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <SkeletonTable rows={5} columns={5} />
          </div>
        ) : !tagsData?.results.length ? (
          <EmptyState 
            icon={AlertCircle}
            title={search ? "No tags found" : "No Tags Yet"}
            description={search ? "Try adjusting your search terms." : "Create your first tag to label blog posts."}
            action={!search ? {
              label: "Create Tag",
              onClick: handleOpenCreate
            } : undefined}
          />
        ) : (
          <>
            <DataTable 
              columns={columns}
              data={tagsData.results}
              keyExtractor={(tag: BlogTag) => tag.id}
            />
            
            {/* Pagination */}
            {tagsData.count > 10 && (
              <div className="p-4 border-t border-border-primary flex items-center justify-between bg-black/2 dark:bg-white/2">
                <p className="text-sm text-secondary-text font-medium">
                  Showing <span className="text-primary-text font-semibold">{(page - 1) * 10 + 1}</span> to <span className="text-primary-text font-semibold">{Math.min(page * 10, tagsData.count)}</span> of <span className="text-primary-text font-semibold">{tagsData.count}</span>
                </p>
                <Pagination 
                  currentPage={page}
                  totalPages={Math.ceil(tagsData.count / 10)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      <TagFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        tag={editingTag}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={!!deleteConfirmTag}
        onClose={() => setDeleteConfirmTag(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Tag"
        description={
          hasPosts
            ? `WARNING: This tag is currently used by ${deleteConfirmTag?.usage_count} post(s). Deleting it will remove the tag from those posts without affecting the posts themselves. Are you sure?`
            : `Are you sure you want to delete the tag "${deleteConfirmTag?.name}"? This action cannot be undone.`
        }
        confirmText="Delete Tag"
        variant="danger"
      />
    </div>
  );
}
