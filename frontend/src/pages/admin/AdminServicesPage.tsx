import React, { useState } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Heading from '../../components/ui/Heading';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';

import ServicesToolbar from '../../components/admin/services/ServicesToolbar';
import ServicesTable from '../../components/admin/services/ServicesTable';
import ServicesTableSkeleton from '../../components/admin/services/ServicesTableSkeleton';
import ServiceFormModal from '../../components/admin/services/ServiceFormModal';
import BulkActionsBar from '../../components/admin/portfolio/BulkActionsBar';

import { 
  useAdminServices, 
  useCreateService, 
  useUpdateService, 
  useDeleteService 
} from '../../hooks/useServices';
import type { AdminServiceFilters } from '../../services/services.service';
import type { Service, ServiceFormData } from '../../types/services';

const AdminServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [filters, setFilters] = useState<AdminServiceFilters>(() => {
    return {
      page: Number(searchParams.get('page')) || 1,
      page_size: Number(searchParams.get('page_size')) || 10,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
    };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());

  // Queries & Mutations
  const { data, isLoading, isError, isRefetching, refetch } = useAdminServices(filters);
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Handlers
  const handleFilterChange = (newFilters: Partial<AdminServiceFilters>) => {
    setFilters((prev: AdminServiceFilters) => {
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
    setEditingService(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(undefined);
  };

  const handleSubmit = async (formData: ServiceFormData) => {
    try {
      if (editingService) {
        await updateMutation.mutateAsync({ slug: editingService.slug, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      handleCloseModal();
      refetch();
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('Failed to save service. Check console for details.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(slug);
        setSelectedSlugs(prev => {
          const next = new Set(prev);
          next.delete(slug);
          return next;
        });
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service.');
      }
    }
  };

  const handleToggleStatus = async (slug: string, currentStatus: boolean) => {
    try {
      await updateMutation.mutateAsync({ slug, data: { is_active: !currentStatus } });
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update status.');
    }
  };

  const handleToggleFeatured = async (slug: string, currentFeatured: boolean) => {
    try {
      await updateMutation.mutateAsync({ slug, data: { is_featured: !currentFeatured } });
    } catch (error) {
      console.error('Failed to toggle featured:', error);
      alert('Failed to update featured status.');
    }
  };

  // Bulk Actions
  const handleBulkAction = async (action: 'publish' | 'draft' | 'delete' | 'feature' | 'unfeature') => {
    if (selectedSlugs.size === 0) return;
    
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedSlugs.size} services?`)) {
        return;
      }
    }

    const promises = Array.from(selectedSlugs).map(slug => {
      switch (action) {
        case 'delete': return deleteMutation.mutateAsync(slug);
        case 'publish': return updateMutation.mutateAsync({ slug, data: { is_active: true } });
        case 'draft': return updateMutation.mutateAsync({ slug, data: { is_active: false } });
        case 'feature': return updateMutation.mutateAsync({ slug, data: { is_featured: true } });
        case 'unfeature': return updateMutation.mutateAsync({ slug, data: { is_featured: false } });
      }
    });

    try {
      await Promise.all(promises);
      setSelectedSlugs(new Set()); // Clear selection on success
    } catch (error) {
      console.error(`Bulk ${action} failed:`, error);
      alert(`Some services failed to update during bulk ${action}.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-light p-6 rounded-xl border border-border-primary shadow-sm">
        <div>
          <Heading variant="h2" className="text-2xl mb-1">Services Manager</Heading>
          <Text variant="small" className="text-secondary-text">
            Manage your digital service offerings and solutions.
          </Text>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shrink-0 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Service
        </Button>
      </div>

      {/* Toolbar (Filters & Search) */}
      <ServicesToolbar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={refetch}
        isRefetching={isRefetching}
      />

      {/* States */}
      {isError ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center flex flex-col items-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="text-lg font-medium text-red-500 mb-1">Failed to load services</h3>
          <p className="text-red-500/70 text-sm mb-4">Please check your connection or permissions.</p>
          <Button variant="secondary" onClick={() => refetch()}>Try Again</Button>
        </div>
      ) : isLoading ? (
        <ServicesTableSkeleton />
      ) : data?.results.length === 0 ? (
        <div className="bg-surface-light border border-border-primary rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-secondary-text" />
          </div>
          <h3 className="text-xl font-bold text-primary-text mb-2">
            {filters.search || filters.category || filters.status ? 'No services match your current filters.' : 'No services found'}
          </h3>
          <p className="text-secondary-text mb-6 max-w-md">
            {filters.search || filters.category || filters.status 
              ? 'Try adjusting your search terms or clearing some filters to see more results.' 
              : 'Get started by creating your first service.'}
          </p>
          {(filters.search || filters.category || filters.status) ? (
            <Button variant="secondary" onClick={() => handleFilterChange({ search: undefined, category: undefined, status: undefined, page: 1 })}>
              Clear All Filters
            </Button>
          ) : (
            <Button variant="primary" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Service
            </Button>
          )}
        </div>
      ) : (
        <ServicesTable 
          services={data?.results || []}
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
            Showing {data.results.length} of {data.count} services
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
      <ServiceFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={editingService}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Bulk Actions (Reusing from Portfolio) */}
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

export default AdminServicesPage;
