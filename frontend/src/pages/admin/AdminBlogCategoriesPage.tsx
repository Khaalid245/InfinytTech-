import React, { useState } from 'react';
import { Plus, Search, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Heading from '../../components/ui/Heading';
import Button from '../../components/ui/Button';

import type { BlogCategory, BlogCategoryFormData } from '../../types/blog';
import { 
  useAdminBlogCategories, 
  useCreateBlogCategory, 
  useUpdateBlogCategory, 
  useDeleteBlogCategory 
} from '../../hooks/useBlog';

import CategoryFormModal from '../../components/admin/blog/CategoryFormModal';
import ConfirmDialog from '../../components/admin/shared/ConfirmDialog';
import EmptyState from '../../components/admin/shared/EmptyState';
import SkeletonTable from '../../components/admin/shared/SkeletonTable';
import DataTable from '../../components/admin/shared/DataTable';
import Pagination from '../../components/admin/shared/Pagination';

export default function AdminBlogCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || undefined;

  // React Query Hooks
  const { data: categoriesData, isLoading } = useAdminBlogCategories({ page, page_size: 10, search });
  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();

  // Local State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | undefined>();
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState<BlogCategory | null>(null);
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
    setEditingCategory(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: BlogCategory) => {
    setEditingCategory(cat);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: BlogCategoryFormData) => {
    if (editingCategory) {
      await updateMutation.mutateAsync({ id: editingCategory.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setIsFormOpen(false);
  };

  const handleDeleteClick = (cat: BlogCategory) => {
    setDeleteConfirmCategory(cat);
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmCategory) {
      await deleteMutation.mutateAsync(deleteConfirmCategory.id);
      setDeleteConfirmCategory(null);
    }
  };

  // Build Table Columns
  const columns = [
    {
      header: 'Category Name',
      accessor: (cat: BlogCategory) => (
        <div>
          <p className="font-semibold text-primary-text">{cat.name}</p>
          <p className="text-xs text-secondary-text font-mono mt-0.5">{cat.slug}</p>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: (cat: BlogCategory) => (
        <span className="text-secondary-text truncate max-w-[200px] block" title={cat.description}>
          {cat.description || '—'}
        </span>
      ),
    },
    {
      header: 'Post Count',
      accessor: (cat: BlogCategory) => (
        <div className="flex items-center gap-2">
          <span className="bg-black/5 dark:bg-white/5 text-primary-text px-2 py-0.5 rounded-full text-xs font-semibold">
            {cat.post_count || 0}
          </span>
          {(cat.post_count || 0) > 0 ? (
            <span className="text-xs text-secondary-text">posts</span>
          ) : (
            <span className="text-xs text-red-500/80">unused</span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (cat: BlogCategory) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          cat.is_active 
            ? 'bg-green-500/10 text-green-600 border-green-500/20'
            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cat.is_active ? 'bg-green-500' : 'bg-yellow-500'}`} />
          {cat.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Order',
      accessor: (cat: BlogCategory) => (
        <span className="text-secondary-text font-mono text-sm">{cat.order}</span>
      ),
    },
    {
      header: 'Actions',
      accessor: (cat: BlogCategory) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenEdit(cat)}
            className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteClick(cat)}
            className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }
  ];

  const hasPosts = deleteConfirmCategory && (deleteConfirmCategory.post_count || 0) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Heading variant="h2" className="text-2xl font-bold tracking-tight text-primary-text">
            Blog Categories
          </Heading>
          <p className="text-secondary-text mt-1 text-sm">
            Manage the primary taxonomy and organization of your blog articles.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <input 
              type="text" 
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-surface-light border border-border-primary focus:border-accent-primary rounded-lg text-sm outline-none transition-all w-full sm:w-64 text-primary-text"
            />
          </form>
          <Button variant="primary" onClick={handleOpenCreate} className="whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-6">
            <SkeletonTable rows={5} columns={6} />
          </div>
        ) : !categoriesData?.results.length ? (
          <EmptyState 
            icon={AlertCircle}
            title={search ? "No categories found" : "No Categories Yet"}
            description={search ? "Try adjusting your search terms." : "Create your first category to organize blog posts."}
            action={!search ? {
              label: "Create Category",
              onClick: handleOpenCreate
            } : undefined}
          />
        ) : (
          <>
            <DataTable 
              columns={columns}
              data={categoriesData.results}
              keyExtractor={(cat: BlogCategory) => cat.id}
            />
            
            {/* Pagination */}
            {categoriesData.count > 10 && (
              <div className="p-4 border-t border-border-primary flex items-center justify-between bg-black/2 dark:bg-white/2">
                <p className="text-sm text-secondary-text font-medium">
                  Showing <span className="text-primary-text font-semibold">{(page - 1) * 10 + 1}</span> to <span className="text-primary-text font-semibold">{Math.min(page * 10, categoriesData.count)}</span> of <span className="text-primary-text font-semibold">{categoriesData.count}</span>
                </p>
                <Pagination 
                  currentPage={page}
                  totalPages={Math.ceil(categoriesData.count / 10)}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Form Modal */}
      <CategoryFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={editingCategory}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={!!deleteConfirmCategory}
        onClose={() => setDeleteConfirmCategory(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={
          hasPosts
            ? `WARNING: This category is currently used by ${deleteConfirmCategory?.post_count} post(s). Deleting it will leave those posts uncategorized. Are you absolutely sure you want to delete "${deleteConfirmCategory?.name}"?`
            : `Are you sure you want to delete the category "${deleteConfirmCategory?.name}"? This action cannot be undone.`
        }
        confirmText={hasPosts ? "Yes, Delete & Uncategorize Posts" : "Delete Category"}
        variant={hasPosts ? "danger" : "danger"}
      />
    </div>
  );
}
