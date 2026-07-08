import React, { useState } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Heading from '../../components/ui/Heading';
import Button from '../../components/ui/Button';

import BlogToolbar from '../../components/admin/blog/BlogToolbar';
import BlogTable from '../../components/admin/blog/BlogTable';
import BlogTableSkeleton from '../../components/admin/blog/BlogTableSkeleton';
import BlogFormModal from '../../components/admin/blog/BlogFormModal';
import BulkActionsBar from '../../components/admin/portfolio/BulkActionsBar';

import { 
  useAdminBlogPosts, 
  useCreateBlogPost, 
  useUpdateBlogPost, 
  useDeleteBlogPost 
} from '../../hooks/useBlog';
import type { AdminBlogFilters, BlogPost, BlogFormData } from '../../types/blog';

const AdminBlogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [filters, setFilters] = useState<AdminBlogFilters>(() => {
    return {
      page: Number(searchParams.get('page')) || 1,
      page_size: Number(searchParams.get('page_size')) || 10,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Queries & Mutations
  const { data, isLoading, isError, isRefetching, refetch } = useAdminBlogPosts(filters);
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handlers
  const handleFilterChange = (newFilters: Partial<AdminBlogFilters>) => {
    const nextFilters = { ...filters, ...newFilters };
    setFilters(nextFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (nextFilters.page && nextFilters.page > 1) params.set('page', nextFilters.page.toString());
    else params.delete('page');
    
    if (nextFilters.search) params.set('search', nextFilters.search);
    else params.delete('search');
    
    if (nextFilters.category) params.set('category', nextFilters.category);
    else params.delete('category');
    
    if (nextFilters.status) params.set('status', nextFilters.status);
    else params.delete('status');
    
    if (nextFilters.featured !== undefined) params.set('featured', nextFilters.featured.toString());
    else params.delete('featured');
    
    setSearchParams(params, { replace: true });
  };

  const handleOpenCreate = () => {
    setEditingPost(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDuplicate = (post: BlogPost) => {
    // Open create mode but pre-filled with this post's data
    const duplicatedPost = { ...post, slug: '' }; // blank slug to auto-generate
    setEditingPost(duplicatedPost as BlogPost);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(undefined);
  };

  const handleSubmit = async (formData: BlogFormData) => {
    try {
      if (editingPost && editingPost.id) {
        await updateMutation.mutateAsync({ id: editingPost.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post. Check console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id);
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } catch (error) {
        console.error('Failed to delete post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      await updateMutation.mutateAsync({ id, data: { status: newStatus } });
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update status.');
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { is_featured: !currentFeatured } });
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      alert('Failed to update featured status.');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'publish' | 'draft' | 'delete' | 'feature' | 'unfeature') => {
    if (selectedIds.size === 0) return;
    
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} posts?`)) {
        return;
      }
    }

    const promises = Array.from(selectedIds).map(id => {
      switch (action) {
        case 'delete': return deleteMutation.mutateAsync(id);
        case 'publish': return updateMutation.mutateAsync({ id, data: { status: 'published' } });
        case 'draft': return updateMutation.mutateAsync({ id, data: { status: 'draft' } });
        case 'feature': return updateMutation.mutateAsync({ id, data: { is_featured: true } });
        case 'unfeature': return updateMutation.mutateAsync({ id, data: { is_featured: false } });
      }
    });

    try {
      await Promise.all(promises);
      setSelectedIds(new Set());
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Some posts failed to update during bulk ${action}.`);
    }
  };

  const totalPosts = data?.count || 0;
  const draftPosts = data?.results?.filter(p => p.status === 'draft').length || 0;
  const publishedPosts = data?.results?.filter(p => p.status === 'published').length || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-light p-6 rounded-xl border border-border-primary shadow-sm">
        <div>
          <Heading variant="h2" className="text-2xl mb-1">Blog Manager</Heading>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="text-sm font-medium bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full text-secondary-text">Total: {totalPosts}</span>
            <span className="text-sm font-medium bg-yellow-500/10 px-3 py-1 rounded-full text-yellow-600 dark:text-yellow-400">Draft: {draftPosts}</span>
            <span className="text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full text-green-600 dark:text-green-400">Published: {publishedPosts}</span>
          </div>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shrink-0 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Toolbar (Filters & Search) */}
      <BlogToolbar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={refetch}
        isRefetching={isRefetching}
      />

      {/* States */}
      {isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center flex flex-col items-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="text-lg font-medium text-red-500 mb-1">Failed to load posts</h3>
          <p className="text-red-500/70 text-sm mb-4">Please check your connection or permissions.</p>
          <Button variant="secondary" onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : isLoading ? (
        <BlogTableSkeleton />
      ) : data?.results.length === 0 ? (
        <div className="bg-surface-light border border-border-primary rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-secondary-text" />
          </div>
          <h3 className="text-xl font-bold text-primary-text mb-2">
            {filters.search || filters.category || filters.status ? 'No posts match your filters.' : 'No posts found'}
          </h3>
          <p className="text-secondary-text mb-6 max-w-md">
            {filters.search || filters.category || filters.status 
              ? 'Try adjusting your search terms or clearing some filters to see more results.' 
              : 'Get started by drafting your first blog post.'}
          </p>
          {(filters.search || filters.category || filters.status) ? (
            <Button variant="secondary" onClick={() => handleFilterChange({ search: undefined, category: undefined, status: undefined, featured: undefined, page: 1 })}>
              Clear All Filters
            </Button>
          ) : (
            <Button variant="primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Post
            </Button>
          )}
        </div>
      ) : (
        <BlogTable 
          posts={data?.results || []}
          selectedIds={selectedIds}
          onSelect={(ids) => setSelectedIds(ids)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* Pagination */}
      {!isError && !isLoading && data && data.count > 0 && (
        <div className="flex justify-between items-center bg-surface-light px-6 py-4 rounded-xl border border-border-primary shadow-sm">
          <span className="text-sm text-secondary-text">
            Showing {data.results.length} of {data.count} posts
          </span>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              disabled={!data.previous}
              onClick={() => handleFilterChange({ page: (filters.page || 1) - 1 })}
            >
              Previous
            </Button>
            <Button 
              variant="secondary" 
              disabled={!data.next}
              onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      <BlogFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        post={editingPost}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Bulk Actions */}
      <BulkActionsBar 
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onPublish={() => handleBulkAction('publish')}
        onDraft={() => handleBulkAction('draft')}
        onDelete={() => handleBulkAction('delete')}
        onFeature={() => handleBulkAction('feature')}
        onUnfeature={() => handleBulkAction('unfeature')}
        isProcessing={isSubmitting || deleteMutation.isPending}
      />

    </div>
  );
};

export default AdminBlogPage;
