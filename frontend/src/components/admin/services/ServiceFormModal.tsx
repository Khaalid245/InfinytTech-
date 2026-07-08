import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Image as ImageIcon, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import type { Service, ServiceFormData } from '../../../types/services';
import { useServiceCategories, useIndustries, useFaqs, useAdminServiceDetail } from '../../../hooks/useServices';
import Button from '../../ui/Button';
import MediaPickerModal from '../media/MediaPickerModal';
import type { MediaFile } from '../../../services/media.service';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service;
  onSubmit: (data: ServiceFormData) => void;
  isSubmitting: boolean;
}

const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  service,
  onSubmit,
  isSubmitting,
}) => {
  const { data: categories } = useServiceCategories();
  const { data: industries } = useIndustries();
  const { data: faqs } = useFaqs();

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [featuredMediaPreview, setFeaturedMediaPreview] = useState<string | null>(null);

  const { data: serviceDetail, isLoading: isLoadingDetail } = useAdminServiceDetail(isOpen && service ? service.slug : '');

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    category_id: '',
    icon: '',
    featured_media_id: null,
    is_featured: false,
    is_active: true,
    order: 0,
    benefits: [],
    industry_ids: [],
    faq_ids: [],
  });

  useEffect(() => {
    if (service && serviceDetail) {
      setFormData({
        title: serviceDetail.title,
        slug: serviceDetail.slug,
        short_description: serviceDetail.short_description || '',
        description: serviceDetail.description || '',
        category_id: serviceDetail.category?.id || '',
        icon: serviceDetail.icon || '',
        featured_media_id: null, // We keep null unless updated, the API doesn't return the ID cleanly unless we use the detail API. We will just leave it null to keep the existing one unless changed.
        is_featured: serviceDetail.is_featured,
        is_active: serviceDetail.is_active,
        order: serviceDetail.order || 0,
        benefits: serviceDetail.benefits || [],
        industry_ids: serviceDetail.industries?.map(i => i.id) || [],
        faq_ids: serviceDetail.faqs?.map(f => f.id) || [],
      });
      setFeaturedMediaPreview(serviceDetail.featured_image);
    } else if (!service) {
      setFormData({
        title: '',
        slug: '',
        short_description: '',
        description: '',
        category_id: '',
        icon: '',
        featured_media_id: null,
        is_featured: false,
        is_active: true,
        order: 0,
        benefits: [],
        industry_ids: [],
        faq_ids: [],
      });
      setFeaturedMediaPreview(null);
    }
  }, [service, serviceDetail, isOpen]);

  // Auto-generate slug from title for new services
  useEffect(() => {
    if (!service && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, service]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: 'industry_ids' | 'faq_ids') => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: options }));
  };

  const handleMediaSelect = (media: MediaFile | MediaFile[]) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    if (mediaArray.length > 0) {
      const selected = mediaArray[0];
      setFormData(prev => ({ ...prev, featured_media_id: selected.id }));
      setFeaturedMediaPreview(selected.file);
    }
    setIsMediaPickerOpen(false);
  };

  const handleRemoveMedia = () => {
    setFormData(prev => ({ ...prev, featured_media_id: null }));
    setFeaturedMediaPreview(null);
  };

  const handleAddBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ''] }));
  };

  const handleUpdateBenefit = (index: number, value: string) => {
    setFormData(prev => {
      const newBenefits = [...prev.benefits];
      newBenefits[index] = value;
      return { ...prev, benefits: newBenefits };
    });
  };

  const handleMoveBenefit = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const newBenefits = [...prev.benefits];
      if (direction === 'up' && index > 0) {
        const temp = newBenefits[index - 1];
        newBenefits[index - 1] = newBenefits[index];
        newBenefits[index] = temp;
      } else if (direction === 'down' && index < newBenefits.length - 1) {
        const temp = newBenefits[index + 1];
        newBenefits[index + 1] = newBenefits[index];
        newBenefits[index] = temp;
      }
      return { ...prev, benefits: newBenefits };
    });
  };

  const handleRemoveBenefit = (index: number) => {
    setFormData(prev => {
      const newBenefits = [...prev.benefits];
      newBenefits.splice(index, 1);
      return { ...prev, benefits: newBenefits };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty benefits
    const cleanedFormData = {
      ...formData,
      benefits: formData.benefits.filter(b => b.trim() !== '')
    };
    onSubmit(cleanedFormData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-surface-light border border-border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-primary">
            <div>
              <h2 className="text-xl font-bold text-primary-text">
                {service ? 'Edit Service' : 'Create Service'}
              </h2>
              <p className="text-sm text-secondary-text mt-1">
                {service ? `Editing ${service.title}` : 'Add a new service to your portfolio'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoadingDetail ? (
            <div className="p-12 text-center text-secondary-text animate-pulse">
              Loading service details...
            </div>
          ) : (
            /* Body */
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <form id="service-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* General Info */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <h3 className="text-lg font-semibold text-primary-text mb-4">General Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="title"
                        required
                        className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Web Development"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">Slug <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="slug"
                        required
                        className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="e.g. web-development"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-6">
                    <label className="text-sm font-medium text-primary-text">Short Description</label>
                    <textarea 
                      name="short_description"
                      rows={2}
                      className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all resize-none shadow-sm"
                      value={formData.short_description}
                      onChange={handleChange}
                      placeholder="A brief summary for cards and banners..."
                    />
                  </div>

                  <div className="space-y-1.5 mt-6">
                    <label className="text-sm font-medium text-primary-text">Full Description <span className="text-red-500">*</span></label>
                    <textarea 
                      name="description"
                      required
                      rows={6}
                      className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all resize-y shadow-sm"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Full detailed description of the service..."
                    />
                  </div>
                </div>

                {/* Media */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <h3 className="text-lg font-semibold text-primary-text mb-4">Media</h3>
                  <div className="space-y-4 max-w-lg">
                    <label className="text-sm font-medium text-primary-text">Featured Image</label>
                    {featuredMediaPreview ? (
                      <div className="relative group rounded-xl overflow-hidden border border-border-primary aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <img 
                          src={featuredMediaPreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button type="button" variant="secondary" onClick={() => setIsMediaPickerOpen(true)}>
                            Change
                          </Button>
                          <Button type="button" variant="secondary" onClick={handleRemoveMedia} className="text-red-500 hover:text-red-600">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="rounded-xl border-2 border-dashed border-border-primary hover:border-accent-primary aspect-video bg-surface-light flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <ImageIcon className="w-8 h-8 text-secondary-text" />
                        <span className="text-sm text-secondary-text">Click to select from Media Library</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Organization */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <h3 className="text-lg font-semibold text-primary-text mb-4">Organization</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">Category</label>
                      <select 
                        name="category_id"
                        className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                        value={formData.category_id}
                        onChange={handleChange}
                      >
                        <option value="">Select a category...</option>
                        {categories?.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      {categories?.length === 0 && (
                        <p className="text-xs text-yellow-500 mt-1">No categories available. Please create one.</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">Icon Name</label>
                      <input 
                        type="text" 
                        name="icon"
                        className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                        value={formData.icon}
                        onChange={handleChange}
                        placeholder="e.g. code, monitor"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">Display Order</label>
                      <input 
                        type="number" 
                        name="order"
                        className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                        value={formData.order}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits / Features */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-primary-text">Benefits & Features</h3>
                    <Button type="button" variant="secondary" onClick={handleAddBenefit} className="py-1 px-3 text-sm">
                      <Plus className="w-4 h-4 mr-1.5" /> Add Benefit
                    </Button>
                  </div>
                  
                  {formData.benefits.length === 0 ? (
                    <div className="text-sm text-secondary-text italic text-center py-6 bg-surface-light rounded-lg border border-border-primary">
                      No benefits added yet. Click 'Add Benefit' to start.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                            value={benefit}
                            onChange={(e) => handleUpdateBenefit(index, e.target.value)}
                            placeholder="e.g. Scalable Architecture"
                          />
                          <div className="flex bg-surface-light border border-transparent rounded-lg shadow-sm overflow-hidden">
                            <button 
                              type="button"
                              onClick={() => handleMoveBenefit(index, 'up')}
                              disabled={index === 0}
                              className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleMoveBenefit(index, 'down')}
                              disabled={index === formData.benefits.length - 1}
                              className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-colors border-l border-border-primary/50"
                              title="Move Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleRemoveBenefit(index)}
                              className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors border-l border-border-primary/50"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Relations */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <h3 className="text-lg font-semibold text-primary-text mb-4">Relationships</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">Industries <span className="text-secondary-text font-normal text-xs">(Hold Ctrl/Cmd to multi-select)</span></label>
                      {industries?.length === 0 ? (
                         <div className="text-sm text-secondary-text italic text-center py-4 bg-surface-light rounded-lg border border-border-primary">
                            No industries available.
                         </div>
                      ) : (
                        <select 
                          multiple
                          className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all h-40 shadow-sm"
                          value={formData.industry_ids}
                          onChange={(e) => handleMultiSelect(e, 'industry_ids')}
                        >
                          {industries?.map(industry => (
                            <option key={industry.id} value={industry.id}>{industry.name}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-primary-text">FAQs <span className="text-secondary-text font-normal text-xs">(Hold Ctrl/Cmd to multi-select)</span></label>
                      {faqs?.length === 0 ? (
                         <div className="text-sm text-secondary-text italic text-center py-4 bg-surface-light rounded-lg border border-border-primary">
                            No FAQs available.
                         </div>
                      ) : (
                        <select 
                          multiple
                          className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all h-40 shadow-sm"
                          value={formData.faq_ids}
                          onChange={(e) => handleMultiSelect(e, 'faq_ids')}
                        >
                          {faqs?.map(faq => (
                            <option key={faq.id} value={faq.id}>{faq.question}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                {/* SEO */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-primary-text">SEO</h3>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-500 mb-1">SEO Fields Not Supported</h4>
                      <p className="text-sm text-yellow-700/80 dark:text-yellow-500/80">
                        Custom SEO fields (Meta Title, Meta Description, Canonical URL) are not currently supported by the backend Service model. The system will automatically use the Service Title and Short Description as fallbacks for SEO metadata.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Publishing */}
                <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                  <h3 className="text-lg font-semibold text-primary-text mb-4">Publishing</h3>
                  <div className="flex gap-8 bg-surface-light p-4 rounded-lg border border-border-primary shadow-sm">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="is_active"
                        className="w-5 h-5 rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50"
                        checked={formData.is_active}
                        onChange={handleChange}
                      />
                      <div>
                        <span className="block text-sm font-medium text-primary-text">Published</span>
                        <span className="block text-xs text-secondary-text">Make this service visible to the public</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="is_featured"
                        className="w-5 h-5 rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50"
                        checked={formData.is_featured}
                        onChange={handleChange}
                      />
                      <div>
                        <span className="block text-sm font-medium text-primary-text">Featured</span>
                        <span className="block text-xs text-secondary-text">Highlight this service on the homepage</span>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-border-primary bg-black/5 dark:bg-white/5 flex justify-end gap-3 mt-auto">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="service-form" 
              variant="primary" 
              disabled={isSubmitting || isLoadingDetail}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Service
                </>
              )}
            </Button>
          </div>

        </div>
      </div>

      <MediaPickerModal 
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={false}
      />
    </>
  );
};

export default ServiceFormModal;
