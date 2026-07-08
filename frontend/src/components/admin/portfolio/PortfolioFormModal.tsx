import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import type { ProjectListItem, ProjectFormData } from '../../../types/portfolio';
import { useCategories, useTechnologies, useTags, useAdminProjectDetail } from '../../../hooks/usePortfolio';
import Button from '../../ui/Button';
import MediaPickerModal from '../media/MediaPickerModal';
import type { MediaFile } from '../../../services/media.service';

export interface GalleryImageState {
  id?: string;
  media_file_id: string;
  url: string;
  display_order: number;
  isDeleted?: boolean;
}

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectListItem;
  onSubmit: (data: ProjectFormData, galleryImages: GalleryImageState[]) => void;
  isSubmitting: boolean;
}

const PortfolioFormModal: React.FC<PortfolioFormModalProps> = ({
  isOpen,
  onClose,
  project,
  onSubmit,
  isSubmitting,
}) => {
  const { data: categories } = useCategories();
  const { data: technologies } = useTechnologies();
  const { data: tags } = useTags();

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerMode, setMediaPickerMode] = useState<'featured' | 'gallery'>('featured');
  const [featuredMediaPreview, setFeaturedMediaPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImageState[]>([]);

  const { data: projectDetail, isLoading: isLoadingDetail } = useAdminProjectDetail(isOpen && project ? project.slug : undefined);

  const [formData, setFormData] = useState<ProjectFormData & { github_url?: string; completion_date?: string }>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    client_name: '',
    project_url: '',
    status: 'draft',
    is_featured: false,
    category_id: '',
    technology_ids: [],
    tag_ids: [],
    featured_image: null,
  });

  useEffect(() => {
    if (project && projectDetail) {
      setFormData({
        title: projectDetail.title,
        slug: projectDetail.slug,
        short_description: projectDetail.short_description,
        full_description: projectDetail.full_description || '',
        client_name: projectDetail.client_name,
        project_url: projectDetail.project_url,
        status: projectDetail.status,
        is_featured: projectDetail.is_featured,
        category_id: projectDetail.category?.id || '',
        technology_ids: projectDetail.technologies.map((t: any) => t.id),
        tag_ids: projectDetail.tags.map((t: any) => t.id),
        featured_image: null,
        featured_media_id: null,
        github_url: '',
        completion_date: '',
      });
      setFeaturedMediaPreview(projectDetail.featured_image); 
      
      if (projectDetail.images) {
        setGalleryImages(projectDetail.images.map((img: any) => ({
          id: img.id,
          media_file_id: '', // We don't need this for existing if not changing it, wait, we actually don't have it on ProjectImage output unless we mapped it. But we just need it for new ones.
          url: img.image,
          display_order: img.display_order,
        })));
      }
    } else if (!project) {
      setFormData({
        title: '',
        slug: '',
        short_description: '',
        full_description: '',
        client_name: '',
        project_url: '',
        status: 'draft',
        is_featured: false,
        category_id: '',
        technology_ids: [],
        tag_ids: [],
        featured_image: null,
        featured_media_id: null,
        github_url: '',
        completion_date: '',
      });
      setFeaturedMediaPreview(null);
      setGalleryImages([]);
    }
  }, [project, projectDetail, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'technology_ids' || name === 'tag_ids') {
      const options = (e.target as HTMLSelectElement).selectedOptions;
      const values = Array.from(options).map(opt => opt.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    // Auto-generate slug if it's a new project
    if (!project) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, title, slug }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { github_url, completion_date, ...submitData } = formData;
    onSubmit(submitData, galleryImages);
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === galleryImages.length - 1) return;
    
    setGalleryImages(prev => {
      const newImages = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      
      // Update display orders
      return newImages.map((img, i) => ({ ...img, display_order: i }));
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-primary-bg w-full max-w-3xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col border border-border-primary overflow-hidden animate-fade-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary bg-surface-light shrink-0">
          <h2 className="text-xl font-bold text-primary-text">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onClose} className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {project && isLoadingDetail ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-accent-primary border-t-transparent rounded-full" />
            </div>
          ) : (
          <form id="portfolio-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Project Title *</label>
                  <input 
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">URL Slug *</label>
                  <input 
                    required
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Client Name</label>
                  <input 
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Live URL</label>
                  <input 
                    name="project_url"
                    value={formData.project_url}
                    onChange={handleChange}
                    placeholder="https://"
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">GitHub URL (UI Demo)</label>
                  <input 
                    name="github_url"
                    value={formData.github_url || ''}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Status</label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Completion Date (UI Demo)</label>
                  <input 
                    type="date"
                    name="completion_date"
                    value={formData.completion_date || ''}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Category</label>
                  <select 
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                  >
                    <option value="">Select a category...</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-8 p-3 border border-border-primary rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <input 
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-accent-primary border-border-primary focus:ring-accent-primary bg-black/5 dark:bg-white/5"
                    />
                    <span className="text-sm font-medium text-primary-text">Feature this project on homepage</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-primary">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Short Description *</label>
                <textarea 
                  required
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Full Description (Markdown)</label>
                <textarea 
                  name="full_description"
                  value={formData.full_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-4 py-2 text-sm focus:border-accent-primary outline-none transition-colors font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-primary">
              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Technologies</label>
                <select 
                  multiple
                  name="technology_ids"
                  value={formData.technology_ids}
                  onChange={handleChange}
                  className="w-full h-32 bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-3 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                >
                  {technologies?.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p className="text-xs text-secondary-text mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-text mb-1.5">Tags</label>
                <select 
                  multiple
                  name="tag_ids"
                  value={formData.tag_ids}
                  onChange={handleChange}
                  className="w-full h-32 bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg px-3 py-2 text-sm focus:border-accent-primary outline-none transition-colors"
                >
                  {tags?.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <p className="text-xs text-secondary-text mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>

            {/* Featured Image & Gallery section */}
            <div className="pt-6 border-t border-border-primary mt-6">
              <h3 className="text-sm font-semibold text-primary-text mb-4">Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-1.5">Featured Image</label>
                  <div className="border border-border-primary rounded-xl p-4 bg-surface-light">
                    {featuredMediaPreview ? (
                      <div className="space-y-3">
                        <div className="aspect-video bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex items-center justify-center border border-border-primary/50">
                          <img src={featuredMediaPreview} alt="Featured" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="secondary" size="sm" className="flex-1" onClick={() => setIsMediaPickerOpen(true)}>
                            Replace
                          </Button>
                          <Button type="button" variant="secondary" size="sm" className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => {
                            setFeaturedMediaPreview(null);
                            setFormData(prev => ({ ...prev, featured_media_id: null, featured_image: null }));
                          }}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsMediaPickerOpen(true)}
                        className="w-full aspect-video border-2 border-dashed border-border-primary rounded-lg flex flex-col items-center justify-center text-secondary-text hover:border-accent-primary hover:text-accent-primary transition-colors bg-black/2 dark:bg-white/2"
                      >
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-sm font-medium">Select from Media Library</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Gallery Manager */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-primary-text">Project Gallery</label>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => {
                        setMediaPickerMode('gallery');
                        setIsMediaPickerOpen(true);
                      }}
                    >
                      Add Images
                    </Button>
                  </div>
                  <div className="border border-border-primary rounded-xl p-4 bg-surface-light h-full min-h-[220px] flex flex-col">
                    
                    {galleryImages.filter(img => !img.isDeleted).length === 0 ? (
                      <div className="flex-1 border-2 border-dashed border-border-primary rounded-lg flex flex-col items-center justify-center text-secondary-text bg-black/2 dark:bg-white/2 p-4 text-center">
                        <ImageIcon className="w-6 h-6 mb-2 opacity-30" />
                        <p className="text-xs">No gallery images added yet.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {galleryImages.map((img, idx) => {
                          if (img.isDeleted) return null;
                          return (
                            <div key={img.id || img.media_file_id + idx} className="flex items-center gap-3 p-2 bg-black/5 dark:bg-white/5 border border-border-primary rounded-lg">
                              <div className="flex flex-col gap-1">
                                <button type="button" onClick={() => moveGalleryImage(idx, 'up')} disabled={idx === 0} className="p-0.5 text-secondary-text hover:text-primary-text disabled:opacity-30"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                                <button type="button" onClick={() => moveGalleryImage(idx, 'down')} disabled={idx === galleryImages.length - 1} className="p-0.5 text-secondary-text hover:text-primary-text disabled:opacity-30"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                              </div>
                              <div className="w-12 h-12 rounded bg-black/10 dark:bg-white/10 shrink-0 overflow-hidden">
                                <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-primary-text truncate">Order: {img.display_order}</p>
                                {img.id ? <span className="text-[10px] bg-green-500/20 text-green-500 px-1 rounded">Saved</span> : <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1 rounded">New</span>}
                              </div>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setGalleryImages(prev => {
                                    const next = [...prev];
                                    if (next[idx].id) {
                                      next[idx].isDeleted = true; // Mark for deletion
                                    } else {
                                      next.splice(idx, 1); // Just remove if not saved yet
                                    }
                                    // Re-calc display orders for remaining
                                    let order = 0;
                                    return next.map(i => {
                                      if (!i.isDeleted) i.display_order = order++;
                                      return i;
                                    });
                                  });
                                }}
                                className="p-1.5 text-secondary-text hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-primary bg-surface-light shrink-0 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="portfolio-form"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Project</>}
          </Button>
        </div>

      </div>
      <MediaPickerModal 
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        multiple={mediaPickerMode === 'gallery'}
        onSelect={(selection) => {
          if (mediaPickerMode === 'featured') {
            const media = selection as MediaFile;
            setFeaturedMediaPreview(media.file);
            setFormData(prev => ({ ...prev, featured_media_id: media.id }));
          } else {
            const mediaArray = Array.isArray(selection) ? selection : [selection];
            setGalleryImages(prev => {
              const currentValid = prev.filter(img => !img.isDeleted);
              const startIndex = currentValid.length;
              
              const newImages = mediaArray.map((m, i) => ({
                media_file_id: m.id,
                url: m.file,
                display_order: startIndex + i
              }));
              
              return [...prev, ...newImages];
            });
          }
        }}
        title={mediaPickerMode === 'gallery' ? 'Add Gallery Images' : 'Select Featured Image'}
      />
    </div>
  );
};

export default PortfolioFormModal;
