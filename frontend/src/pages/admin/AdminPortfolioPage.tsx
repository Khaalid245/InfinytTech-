import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';

import PortfolioToolbar from '../../components/admin/portfolio/PortfolioToolbar';
import PortfolioTable from '../../components/admin/portfolio/PortfolioTable';
import PortfolioTableSkeleton from '../../components/admin/portfolio/PortfolioTableSkeleton';
import PortfolioFormModal from '../../components/admin/portfolio/PortfolioFormModal';
import BulkActionsBar from '../../components/admin/portfolio/BulkActionsBar';
import { AlertCircle } from 'lucide-react';

import { 
  useAdminProjects, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject 
} from '../../hooks/usePortfolio';
import {
  addProjectGalleryImage,
  updateProjectGalleryImage,
  removeProjectGalleryImage
} from '../../services/portfolio.service';
import type { ProjectFilters } from '../../services/portfolio.service';
import type { ProjectListItem, ProjectFormData } from '../../types/portfolio';
import type { GalleryImageState } from '../../components/admin/portfolio/PortfolioFormModal';

const AdminPortfolioPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [filters, setFilters] = useState<ProjectFilters>(() => {
    return {
      page: Number(searchParams.get('page')) || 1,
      page_size: Number(searchParams.get('page_size')) || 10,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectListItem | undefined>();
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  // Queries & Mutations
  const { data, isLoading, isError, isRefetching, refetch } = useAdminProjects(filters);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handlers
  const handleFilterChange = (newFilters: Partial<ProjectFilters>) => {
    setFilters((prev: ProjectFilters) => {
      const nextFilters = { ...prev, ...newFilters };
      
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
      
      setSearchParams(params, { replace: true });
      return nextFilters;
    });
  };

  const handleOpenCreate = () => {
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectListItem) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(undefined);
  };

  const handleSubmit = async (formData: ProjectFormData, galleryImages: GalleryImageState[]) => {
    try {
      let slug = '';
      if (editingProject) {
        const result = await updateMutation.mutateAsync({ slug: editingProject.slug, data: formData });
        slug = result.slug;
      } else {
        const result = await createMutation.mutateAsync(formData);
        slug = result.slug;
      }

      // Handle Gallery Images concurrently
      const galleryPromises: Promise<void>[] = [];
      
      for (const img of galleryImages) {
        if (img.isDeleted && img.id) {
          galleryPromises.push(removeProjectGalleryImage(slug, img.id));
        } else if (!img.isDeleted && !img.id) {
          galleryPromises.push(addProjectGalleryImage(slug, img.media_file_id, img.display_order));
        } else if (!img.isDeleted && img.id) {
          // If it exists, we might need to update its display_order
          galleryPromises.push(updateProjectGalleryImage(slug, img.id, img.display_order));
        }
      }

      if (galleryPromises.length > 0) {
        await Promise.all(galleryPromises);
      }

      handleCloseModal();
      refetch();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Check console for details.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(slug);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleToggleStatus = async (project: ProjectListItem) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await updateMutation.mutateAsync({ slug: project.slug, data: { status: newStatus } });
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleToggleFeatured = async (project: ProjectListItem) => {
    try {
      await updateMutation.mutateAsync({ slug: project.slug, data: { is_featured: !project.is_featured } });
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'publish' | 'draft' | 'delete' | 'feature' | 'unfeature') => {
    if (selectedSlugs.size === 0) return;
    
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedSlugs.size} projects?`)) return;
    }

    const promises = Array.from(selectedSlugs).map(slug => {
      switch (action) {
        case 'delete': return deleteMutation.mutateAsync(slug);
        case 'publish': return updateMutation.mutateAsync({ slug, data: { status: 'published' } });
        case 'draft': return updateMutation.mutateAsync({ slug, data: { status: 'draft' } });
        case 'feature': return updateMutation.mutateAsync({ slug, data: { is_featured: true } });
        case 'unfeature': return updateMutation.mutateAsync({ slug, data: { is_featured: false } });
      }
    });

    try {
      await Promise.all(promises);
      setSelectedSlugs(new Set()); // Clear selection on success
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Some projects failed to update during bulk ${action}.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-light p-6 rounded-xl border border-border-primary shadow-sm">
        <div>
          <Heading variant="h2" className="text-2xl mb-1">Portfolio Manager</Heading>
          <Text variant="small" className="text-secondary-text">
            Manage your case studies, projects, and client work.
          </Text>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shrink-0 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Toolbar (Filters & Search) */}
      <PortfolioToolbar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={refetch}
        isRefetching={isRefetching}
      />

      {/* States */}
      {isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center flex flex-col items-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="text-lg font-medium text-red-500 mb-1">Failed to load projects</h3>
          <p className="text-red-500/70 text-sm mb-4">Please check your connection or permissions.</p>
          <Button variant="secondary" onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : isLoading ? (
        <PortfolioTableSkeleton />
      ) : data?.results.length === 0 ? (
        <div className="bg-surface-light border border-border-primary rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-secondary-text" />
          </div>
          <h3 className="text-xl font-bold text-primary-text mb-2">
            {filters.search || filters.category || filters.status ? 'No projects match your current filters.' : 'No projects found'}
          </h3>
          <p className="text-secondary-text mb-6 max-w-md">
            {filters.search || filters.category || filters.status 
              ? 'Try adjusting your search terms or clearing some filters to see more results.' 
              : 'Get started by creating your very first portfolio project. Showcase your best work to the world.'}
          </p>
          {(filters.search || filters.category || filters.status) ? (
            <Button variant="secondary" onClick={() => handleFilterChange({ search: undefined, category: undefined, status: undefined, page: 1 })}>
              Clear All Filters
            </Button>
          ) : (
            <Button variant="primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          )}
        </div>
      ) : (
        <PortfolioTable 
          projects={data?.results || []}
          selectedSlugs={selectedSlugs}
          onSelect={(slugs) => setSelectedSlugs(slugs)}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* Pagination (Simple for MVP) */}
      {!isError && !isLoading && data && data.count > 0 && (
        <div className="flex justify-between items-center bg-surface-light px-6 py-4 rounded-xl border border-border-primary shadow-sm">
          <span className="text-sm text-secondary-text">
            Showing {data.results.length} of {data.count} projects
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
      <PortfolioFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={editingProject}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Bulk Actions */}
      <BulkActionsBar 
        selectedCount={selectedSlugs.size}
        onClear={() => setSelectedSlugs(new Set())}
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

export default AdminPortfolioPage;
