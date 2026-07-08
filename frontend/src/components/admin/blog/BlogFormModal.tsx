import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { BlogPost, BlogFormData } from '../../../types/blog';
import { useBlogCategories, useBlogTags, useAdminBlogPostDetail } from '../../../hooks/useBlog';

import { resolveImageUrl } from '../../../utils/imageHelper';
import Button from '../../ui/Button';
import MediaPickerModal from '../media/MediaPickerModal';
import type { MediaFile } from '../../../services/media.service';

interface BlogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  post?: BlogPost;
  onSubmit: (data: BlogFormData) => void;
  isSubmitting: boolean;
}

const BlogFormModal: React.FC<BlogFormModalProps> = ({
  isOpen,
  onClose,
  post,
  onSubmit,
  isSubmitting,
}) => {
  const { data: categories } = useBlogCategories();
  const { data: tags } = useBlogTags();

  const navigate = useNavigate();
  
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

  const { data: postDetail, isLoading: isLoadingDetail, isError: isLoadError, refetch } = useAdminBlogPostDetail(isOpen && post ? post.id : '');

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category_id: '',
    tag_ids: [],
    featured_media_id: null,
    author_id: null,
    status: 'draft',
    is_featured: false,
    seo_title: '',
    seo_description: '',
  });

  useEffect(() => {
    if (post && postDetail) {
      setFormData({
        title: postDetail.title,
        slug: postDetail.slug,
        excerpt: postDetail.excerpt || '',
        content: postDetail.content || '',
        category_id: postDetail.category?.id || '',
        tag_ids: postDetail.tags?.map(t => t.id) || [],
        featured_media_id: postDetail.featured_media?.id || null,
        author_id: postDetail.author?.id || null,
        status: postDetail.status,
        is_featured: postDetail.is_featured,
        seo_title: postDetail.seo_title || '',
        seo_description: postDetail.seo_description || '',
      });
      setSelectedMedia(postDetail.featured_media || null);
    } else if (!post) {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category_id: '',
        tag_ids: [],
        featured_media_id: null,
        author_id: null,
        status: 'draft',
        is_featured: false,
        seo_title: '',
        seo_description: '',
      });
      setSelectedMedia(null);
    }
  }, [post, postDetail, isOpen]);

  // Auto-generate slug from title for new posts
  useEffect(() => {
    if (!post && formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, field: 'tag_ids') => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: options }));
  };

  const handleMediaSelect = (media: MediaFile | MediaFile[]) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    if (mediaArray.length > 0) {
      const selected = mediaArray[0];
      setFormData(prev => ({ ...prev, featured_media_id: selected.id }));
      setSelectedMedia(selected);
    }
    setIsMediaPickerOpen(false);
  };

  const handleRemoveMedia = () => {
    setFormData(prev => ({ ...prev, featured_media_id: null }));
    setSelectedMedia(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  // If there's an error loading the detail, show the error state
  if (post && isLoadError) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <div className="bg-surface-light border border-border-primary w-full max-w-md rounded-2xl shadow-xl flex flex-col p-6 items-center text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-primary-text mb-2">Failed to load post</h2>
          <p className="text-secondary-text mb-6">
            There was a problem loading the blog post data. It may have been deleted.
          </p>
          <div className="flex w-full gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">Close</Button>
            <Button variant="primary" onClick={() => refetch()} className="flex-1">Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-5xl bg-surface-light border border-border-primary rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-primary">
            <div>
              <h2 className="text-xl font-bold text-primary-text">
                {post ? 'Edit Blog Post' : 'Create Blog Post'}
              </h2>
              <p className="text-sm text-secondary-text mt-1">
                {post ? `Editing ${post.title}` : 'Draft a new article for the blog'}
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
              Loading post details...
            </div>
          ) : (
            /* Body */
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
                
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
                        placeholder="e.g. 10 Tips for Better UX"
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
                        placeholder="e.g. 10-tips-for-better-ux"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 mt-6">
                    <label className="text-sm font-medium text-primary-text">Excerpt</label>
                    <textarea 
                      name="excerpt"
                      rows={2}
                      className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all resize-none shadow-sm"
                      value={formData.excerpt}
                      onChange={handleChange}
                      placeholder="A short summary of the article..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Editor & SEO */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Content Editor */}
                    <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary flex flex-col h-[500px]">
                      <h3 className="text-lg font-semibold text-primary-text mb-4">Content</h3>
                      <div className="flex-1 flex flex-col space-y-1.5">
                        <textarea 
                          name="content"
                          required
                          className="flex-1 w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg p-4 text-primary-text outline-none transition-all resize-none shadow-sm font-mono text-sm"
                          value={formData.content}
                          onChange={handleChange}
                          placeholder="Write your content here... (Supports Markdown / HTML based on backend configuration)"
                        />
                      </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                      <h3 className="text-lg font-semibold text-primary-text mb-4">SEO Settings</h3>
                      <div className="space-y-6">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-primary-text">SEO Title Override</label>
                          <input 
                            type="text" 
                            name="seo_title"
                            className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                            value={formData.seo_title}
                            onChange={handleChange}
                            placeholder="Leave blank to use the main title"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-primary-text">SEO Description Override</label>
                          <textarea 
                            name="seo_description"
                            rows={3}
                            className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all resize-none shadow-sm"
                            value={formData.seo_description}
                            onChange={handleChange}
                            placeholder="Leave blank to use the excerpt"
                          />
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3">
                          <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-blue-700/80 dark:text-blue-500/80">
                              If Canonical URLs are needed, note that the backend does not currently support custom Canonical fields and automatically uses the standard article URL.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Media, Org, Publishing */}
                  <div className="space-y-8">
                    {/* Media */}
                    <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary">
                      <h3 className="text-lg font-semibold text-primary-text mb-4">Media</h3>
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-primary-text">Featured Image</label>
                        {selectedMedia ? (
                          <div className="space-y-3">
                            <div className="relative group rounded-xl overflow-hidden border border-border-primary aspect-video bg-black/5 dark:bg-white/5 flex items-center justify-center">
                              <img 
                                src={resolveImageUrl(selectedMedia.file)} 
                                alt={selectedMedia.alt_text || selectedMedia.title || "Preview"} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button type="button" variant="secondary" onClick={() => setIsMediaPickerOpen(true)} className="scale-75 origin-center">
                                  Replace
                                </Button>
                                <Button type="button" variant="secondary" onClick={handleRemoveMedia} className="scale-75 origin-center text-red-500 hover:text-red-600">
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between px-2 text-xs text-secondary-text">
                              <span className="font-medium truncate mr-4" title={selectedMedia.original_filename || selectedMedia.file_name || selectedMedia.title}>
                                {selectedMedia.original_filename || selectedMedia.file_name || selectedMedia.title || 'selected-image'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div 
                            onClick={() => setIsMediaPickerOpen(true)}
                            className="rounded-xl border-2 border-dashed border-border-primary hover:border-accent-primary aspect-video bg-surface-light flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <ImageIcon className="w-8 h-8 text-secondary-text" />
                            <span className="text-xs text-secondary-text text-center px-4">Click to select from Media Library</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary space-y-6">
                      <h3 className="text-lg font-semibold text-primary-text">Organization</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-primary-text">Category</label>
                        {categories?.length === 0 ? (
                           <div className="bg-surface-light p-4 rounded-lg border border-border-primary text-center space-y-3">
                             <p className="text-sm text-secondary-text">No Categories Available</p>
                             <Button 
                               variant="secondary" 
                               size="sm" 
                               onClick={() => {
                                 onClose();
                                 navigate('/admin/blog/categories');
                               }}
                             >
                               Create Category
                             </Button>
                           </div>
                        ) : (
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
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-primary-text">Tags <span className="text-secondary-text font-normal text-xs">(Hold Ctrl/Cmd)</span></label>
                        {tags?.length === 0 ? (
                           <div className="bg-surface-light p-4 rounded-lg border border-border-primary text-center space-y-3">
                             <p className="text-sm text-secondary-text">No Tags Available</p>
                             <Button 
                               variant="secondary" 
                               size="sm" 
                               onClick={() => {
                                 onClose();
                                 navigate('/admin/blog/tags');
                               }}
                             >
                               Create Tag
                             </Button>
                           </div>
                        ) : (
                          <select 
                            multiple
                            className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all h-32 shadow-sm"
                            value={formData.tag_ids}
                            onChange={(e) => handleMultiSelect(e, 'tag_ids')}
                          >
                            {tags?.map(tag => (
                              <option key={tag.id} value={tag.id}>{tag.name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Publishing */}
                    <div className="bg-black/2 dark:bg-white/2 p-6 rounded-xl border border-border-primary space-y-6">
                      <h3 className="text-lg font-semibold text-primary-text">Publishing</h3>
                      
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-primary-text">Author</label>
                        {post?.author ? (
                          <div className="flex items-center gap-3 p-3 bg-surface-light border border-border-primary rounded-lg shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm font-bold shrink-0">
                              {post.author.first_name?.[0] || post.author.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-primary-text block">
                                {post.author.first_name || post.author.last_name 
                                  ? `${post.author.first_name} ${post.author.last_name}`.trim() 
                                  : post.author.email}
                              </span>
                              <span className="text-xs text-secondary-text uppercase tracking-wider">{post.author.role || 'Author'}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-surface-light border border-border-primary rounded-lg shadow-sm">
                            <div className="w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center text-sm font-bold shrink-0">
                              U
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-primary-text block">Current User</span>
                              <span className="text-xs text-secondary-text">Assigned Automatically</span>
                            </div>
                          </div>
                        )}
                        <input type="hidden" name="author_id" value={formData.author_id || ''} />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-primary-text">Status</label>
                        <select 
                          name="status"
                          className="w-full bg-surface-light border border-transparent focus:border-accent-primary rounded-lg py-2 px-3 text-primary-text outline-none transition-all shadow-sm"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-surface-light rounded-lg border border-border-primary shadow-sm">
                        <input 
                          type="checkbox" 
                          name="is_featured"
                          className="w-5 h-5 rounded border-border-primary bg-transparent text-accent-primary focus:ring-accent-primary/50"
                          checked={formData.is_featured}
                          onChange={handleChange}
                        />
                        <div>
                          <span className="block text-sm font-medium text-primary-text">Featured</span>
                          <span className="block text-xs text-secondary-text">Highlight on homepage</span>
                        </div>
                      </label>
                    </div>

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
              form="blog-form" 
              variant="primary" 
              disabled={isSubmitting || isLoadingDetail}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Post
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

export default BlogFormModal;
