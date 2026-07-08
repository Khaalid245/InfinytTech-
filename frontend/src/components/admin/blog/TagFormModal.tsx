import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { BlogTag, BlogTagFormData } from '../../../types/blog';
import Button from '../../ui/Button';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: BlogTag;
  onSubmit: (data: BlogTagFormData) => void;
  isSubmitting: boolean;
}

const TagFormModal: React.FC<TagFormModalProps> = ({
  isOpen,
  onClose,
  tag,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<BlogTagFormData>({
    name: '',
    slug: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    if (tag && isOpen) {
      setFormData({
        name: tag.name,
        slug: tag.slug,
        description: tag.description || '',
        is_active: tag.is_active ?? true,
      });
    } else if (!tag && isOpen) {
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
      });
    }
  }, [tag, isOpen]);

  // Auto-generate slug
  useEffect(() => {
    if (!tag && formData.name && !formData.slug) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, tag]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-surface-light border border-border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border-primary shrink-0">
          <div>
            <h2 className="text-xl font-bold text-primary-text">
              {tag ? 'Edit Tag' : 'Create Tag'}
            </h2>
            <p className="text-sm text-secondary-text mt-1">
              {tag ? `Editing ${tag.name}` : 'Add a new blog tag'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-secondary-text hover:text-primary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <form id="tag-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary-text">Tag Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name"
                required
                className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. React"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary-text">Slug <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="slug"
                required
                className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all font-mono text-sm"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g. react"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary-text">Description</label>
              <textarea 
                name="description"
                rows={3}
                className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all resize-none"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the tag..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-primary-text mb-2 block">Status</label>
              <label className="flex items-center gap-2 cursor-pointer mt-3">
                <input 
                  type="checkbox" 
                  name="is_active"
                  className="w-4 h-4 rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50 cursor-pointer"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span className="text-sm text-primary-text select-none">Active</span>
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border-primary bg-black/2 dark:bg-white/2 flex justify-end gap-3 shrink-0">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="tag-form" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (tag ? 'Save Changes' : 'Create Tag')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TagFormModal;
