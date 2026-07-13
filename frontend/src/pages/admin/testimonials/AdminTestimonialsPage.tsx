import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import Button from '../../../components/ui/Button';
import DataTable, { type ColumnDef } from '../../../components/admin/shared/DataTable';
import Badge from '../../../components/ui/Badge';
import { useAdminTestimonials, useAdminClients, useDeleteTestimonial } from '../../../hooks/useTestimonialsAdmin';
import TestimonialDrawer from '../../../components/admin/testimonials/TestimonialDrawer';
import type { Testimonial } from '../../../types/testimonials';
import { resolveImageUrl } from '../../../utils/imageHelper';

export default function AdminTestimonialsPage() {
  const { data: testimonials = [], isLoading: testimonialsLoading } = useAdminTestimonials();
  const { data: clients = [] } = useAdminClients();
  const { mutateAsync: deleteTestimonial } = useDeleteTestimonial();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('all');
  
  // Selection
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Dashboard Stats
  const totalTestimonials = testimonials.length;
  const featuredCount = testimonials.filter(t => t.featured).length;
  
  const totalRating = testimonials.reduce((acc, t) => acc + t.rating, 0);
  const averageRating = totalTestimonials > 0 ? (totalRating / totalTestimonials).toFixed(1) : '0.0';

  const handleCreate = () => {
    setSelectedTestimonial(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from ${testimonial.author_name}?`)) {
      try {
        await deleteTestimonial(testimonial.id);
      } catch (err) {
        console.error('Failed to delete', err);
      }
    }
  };

  const handleSelectRow = (testimonial: Testimonial, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedKeys);
    if (newSelected.has(testimonial.id)) {
      newSelected.delete(testimonial.id);
    } else {
      newSelected.add(testimonial.id);
    }
    setSelectedKeys(newSelected);
  };

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(t => {
      const matchesSearch = 
        t.author_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.testimonial.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesRating = selectedRating === 'all' || t.rating.toString() === selectedRating;
      const matchesFeatured = selectedFeatured === 'all' || 
                             (selectedFeatured === 'true' && t.featured) || 
                             (selectedFeatured === 'false' && !t.featured);
                             
      return matchesSearch && matchesRating && matchesFeatured;
    });
  }, [testimonials, searchQuery, selectedRating, selectedFeatured]);

  const columns: ColumnDef<Testimonial>[] = [
    {
      header: 'Author',
      accessor: (t) => (
        <div className="flex items-center gap-3">
          {t.author_photo ? (
            <img src={resolveImageUrl(t.author_photo.file)} alt={t.author_name} className="w-10 h-10 rounded-full object-cover border border-border-primary shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-border-primary flex items-center justify-center text-secondary-text font-medium text-sm shrink-0">
              {t.author_name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="font-medium text-primary-text">{t.author_name}</div>
            <div className="text-xs text-secondary-text">{t.author_position}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Client / Company',
      accessor: (t) => (
        <div className="flex items-center gap-2">
          {t.client?.company_logo ? (
             <div className="w-6 h-6 rounded bg-white border border-border-primary flex items-center justify-center p-0.5 shrink-0 overflow-hidden">
               <img src={resolveImageUrl(t.client.company_logo.file)} alt={`${t.client.company_name} logo`} className="w-full h-full object-contain" />
             </div>
          ) : (
             <div className="w-6 h-6 rounded bg-black/5 dark:bg-white/5 border border-border-primary flex items-center justify-center text-secondary-text font-medium text-[10px] shrink-0">
               {t.client?.company_name?.substring(0, 2).toUpperCase() || '-'}
             </div>
          )}
          <span className="text-sm font-medium text-primary-text">{t.client?.company_name || '-'}</span>
        </div>
      )
    },
    {
      header: 'Rating',
      accessor: (t) => (
        <div className="flex items-center text-yellow-500 text-sm">
          {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (t) => (
        <Badge variant={t.status === 'PUBLISHED' ? 'accent' : t.status === 'ARCHIVED' ? 'outline' : 'secondary'}>
          {t.status}
        </Badge>
      )
    },
    {
      header: 'Featured',
      accessor: (t) => (
        <Badge variant={t.featured ? 'primary' : 'secondary'}>
          {t.featured ? 'Featured' : 'Standard'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessor: (t) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleEdit(t)}
            className="p-1.5 text-secondary-text hover:text-accent-primary hover:bg-accent-primary/10 rounded-md transition-colors"
            title={`Edit ${t.author_name}'s testimonial`}
            aria-label="Edit Testimonial"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDelete(t)}
            className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title={`Delete ${t.author_name}'s testimonial`}
            aria-label="Delete Testimonial"
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
          <h1 className="text-2xl font-semibold text-primary-text">Testimonial Manager</h1>
          <p className="text-secondary-text text-sm mt-1">Manage client feedback and success stories.</p>
        </div>
        <Button variant="primary" onClick={handleCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Add Testimonial
        </Button>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Total Testimonials</div>
          <div className="text-2xl font-bold text-primary-text">{totalTestimonials}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Featured</div>
          <div className="text-2xl font-bold text-primary-text">{featuredCount}</div>
        </div>
        <div className="bg-surface-light border border-border-primary p-4 rounded-xl shadow-sm">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-1">Avg Rating</div>
          <div className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
            {averageRating} <span className="text-sm">★</span>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-surface-light p-4 rounded-xl border border-border-primary shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              className="appearance-none bg-black/5 dark:bg-white/5 border border-border-primary rounded-md py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-accent-primary"
            >
              <option value="all">All Features</option>
              <option value="true">Featured Only</option>
              <option value="false">Standard Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden shadow-sm relative">
        {testimonialsLoading ? (
          <div className="p-8 text-center text-secondary-text animate-pulse">Loading testimonials...</div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-medium text-primary-text mb-2">No testimonials found</h3>
            <p className="text-secondary-text mb-6">There are no testimonials matching your criteria.</p>
            {searchQuery || selectedRating !== 'all' || selectedFeatured !== 'all' ? (
              <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedRating('all'); setSelectedFeatured('all'); }}>Clear Filters</Button>
            ) : (
              <Button variant="secondary" onClick={handleCreate}>Add Testimonial</Button>
            )}
          </div>
        ) : (
          <DataTable 
            columns={columns} 
            data={filteredTestimonials} 
            keyExtractor={(t) => t.id}
            selectedKeys={selectedKeys}
            onSelectRow={handleSelectRow}
            onRowClick={(t) => handleEdit(t)}
          />
        )}
      </div>

      <TestimonialDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        testimonial={selectedTestimonial}
        clients={clients}
      />
    </div>
  );
}
