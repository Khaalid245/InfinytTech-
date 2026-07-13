import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Trash2, Star, Quote } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import TextArea from '../../ui/TextArea';
import Checkbox from '../../ui/Checkbox';
import Combobox, { type ComboboxOption } from '../../ui/Combobox';
import type { Testimonial, Client } from '../../../types/testimonials';
import type { MediaFile } from '../../../services/media.service';
import { useCreateTestimonial, useUpdateTestimonial } from '../../../hooks/useTestimonialsAdmin';
import { useAdminProjects } from '../../../hooks/usePortfolio';
import { resolveImageUrl } from '../../../utils/imageHelper';
import MediaPickerModal from '../media/MediaPickerModal';

interface TestimonialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: Testimonial | null;
  clients: Client[];
}

const StarRating = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`p-1 transition-colors ${star <= value ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500/50'}`}
        >
          <Star className={`w-6 h-6 ${star <= value ? 'fill-current' : ''}`} />
        </button>
      ))}
    </div>
  );
};

export default function TestimonialDrawer({ isOpen, onClose, testimonial, clients }: TestimonialDrawerProps) {
  const [clientId, setClientId] = useState('');
  const [relatedProjectId, setRelatedProjectId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorPosition, setAuthorPosition] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [featured, setFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Form State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Media Picker
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaFile | null>(null);

  const { mutateAsync: createTestimonial, isPending: isCreating } = useCreateTestimonial();
  const { mutateAsync: updateTestimonial, isPending: isUpdating } = useUpdateTestimonial();

  useEffect(() => {
    if (testimonial) {
      setClientId(testimonial.client?.id || '');
      setRelatedProjectId(testimonial.related_project?.id || '');
      setAuthorName(testimonial.author_name);
      setAuthorPosition(testimonial.author_position);
      setTestimonialText(testimonial.testimonial);
      setRating(testimonial.rating);
      setFeatured(testimonial.featured);
      setIsPublished(testimonial.status === 'PUBLISHED');

      if (testimonial.author_photo) {
        setSelectedPhoto({
          id: testimonial.author_photo.id,
          file: testimonial.author_photo.file,
          file_name: testimonial.author_photo.file_name,
          alt_text: testimonial.author_photo.alt_text,
          folder: null,
          title: '',
          caption: '',
          description: '',
          mime_type: 'image/jpeg',
          extension: 'jpg',
          checksum: '',
          is_public: true,
          file_size: 0,
          width: null,
          height: null,
          created_at: '',
          updated_at: ''
        });
      } else {
        setSelectedPhoto(null);
      }
    } else {
      resetForm();
    }
    setErrors({});
  }, [testimonial, isOpen]);

  const resetForm = () => {
    setClientId('');
    setRelatedProjectId('');
    setAuthorName('');
    setAuthorPosition('');
    setTestimonialText('');
    setRating(5);
    setFeatured(false);
    setIsPublished(true);
    setSelectedPhoto(null);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!clientId) newErrors.clientId = 'Please select a client.';
    if (!authorName.trim()) newErrors.authorName = 'Author name is required.';
    if (!authorPosition.trim()) newErrors.authorPosition = 'Author position is required.';
    if (!testimonialText.trim()) newErrors.testimonialText = 'Testimonial quote is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const payload: any = {
        client: clientId,
        author_name: authorName,
        author_position: authorPosition,
        testimonial: testimonialText,
        rating,
        featured,
        status: isPublished ? 'PUBLISHED' : 'DRAFT',
        author_photo: selectedPhoto?.id || null,
        related_project_id: relatedProjectId || null,
      };

      if (testimonial) {
        await updateTestimonial({ id: testimonial.id, data: payload });
      } else {
        await createTestimonial(payload);
      }
      
      // Basic toast/alert replacement (can be improved with a real toast system later)
      // window.alert(`Testimonial ${testimonial ? 'updated' : 'created'} successfully!`);
      
      onClose();
    } catch (err) {
      console.error('Failed to save testimonial', err);
      setErrors({ submit: 'Failed to save testimonial. Please try again.' });
    }
  };

  const selectedClientFull = clients.find(c => c.id === clientId);

  const clientOptions: ComboboxOption[] = clients.map(c => ({
    value: c.id,
    label: c.company_name,
    subtitle: c.industry || c.country || undefined,
    imageUrl: c.company_logo ? resolveImageUrl(c.company_logo.file) : undefined
  }));

  const { data: projectsData } = useAdminProjects({ page_size: 100 });
  const projects = projectsData?.results || [];

  const projectOptions: ComboboxOption[] = [
    { value: '', label: 'None (Unlinked)' },
    ...projects.map(p => ({
      value: p.id,
      label: p.title,
      subtitle: p.category?.name || 'Uncategorized',
      imageUrl: p.featured_image ? p.featured_image : undefined
    }))
  ];

  const selectedProjectFull = projects.find(p => p.id === relatedProjectId);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* We make it wider to fit the live preview side-by-side on large screens */}
      <div className="fixed inset-y-0 right-0 w-full max-w-5xl bg-surface-light shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border-primary shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-primary-text">
              {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
            </h2>
            <p className="text-secondary-text text-sm">Client feedback & Success stories</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-secondary-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-0 flex flex-col lg:flex-row scrollbar-hide">
          
          {/* LEFT: FORM (Takes ~60%) */}
          <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border-primary overflow-y-auto scrollbar-hide">
            <form id="testimonial-form" onSubmit={handleSubmit} className="space-y-10">
              
              {/* RELATIONSHIP SECTION */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Relationship</h3>
                
                <Combobox
                  label="Client / Company"
                  required
                  options={clientOptions}
                  value={clientId}
                  onChange={setClientId}
                  placeholder="Search by company name, industry..."
                  emptyText="No clients found."
                  error={errors.clientId}
                />

                {selectedClientFull && (
                  <div className="mt-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-border-primary flex items-center gap-4">
                    {selectedClientFull.company_logo ? (
                       <img src={resolveImageUrl(selectedClientFull.company_logo.file)} alt="Logo" className="w-12 h-12 object-contain bg-white rounded p-1" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-surface-light flex items-center justify-center text-secondary-text font-semibold">
                        {selectedClientFull.company_name.substring(0,2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-primary-text truncate">{selectedClientFull.company_name}</div>
                      <div className="text-sm text-secondary-text flex gap-2 items-center mt-0.5">
                        {selectedClientFull.industry && <span>{selectedClientFull.industry}</span>}
                        {selectedClientFull.industry && selectedClientFull.country && <span>•</span>}
                        {selectedClientFull.country && <span>{selectedClientFull.country}</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-primary-text">{selectedClientFull.testimonials_count || 0}</div>
                      <div className="text-xs text-secondary-text uppercase">Testimonials</div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border-primary mt-4">
                  <Combobox
                    label="Related Portfolio Project (Optional)"
                    options={projectOptions}
                    value={relatedProjectId}
                    onChange={setRelatedProjectId}
                    placeholder="Search for a case study..."
                    emptyText="No projects found."
                  />
                  {selectedProjectFull && (
                    <div className="mt-4 p-3 bg-surface-light border border-border-primary rounded-lg flex items-center gap-4">
                      {selectedProjectFull.featured_image ? (
                        <img src={selectedProjectFull.featured_image} alt="Project" className="w-16 h-10 object-cover rounded shadow-sm" />
                      ) : (
                        <div className="w-16 h-10 bg-black/5 dark:bg-white/5 rounded flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-secondary-text opacity-50" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-primary-text">{selectedProjectFull.title}</div>
                        <div className="text-xs text-secondary-text">
                          <span className={selectedProjectFull.status === 'published' ? 'text-green-500' : 'text-amber-500 capitalize'}>
                            {selectedProjectFull.status}
                          </span>
                          <span className="mx-1.5 opacity-50">•</span>
                          {selectedProjectFull.category?.name || 'Uncategorized'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* GENERAL SECTION */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Author Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Author Name" required value={authorName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorName(e.target.value)} error={errors.authorName} />
                  <Input label="Author Position" required value={authorPosition} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAuthorPosition(e.target.value)} error={errors.authorPosition} />
                </div>
                <TextArea 
                  label="Quote / Testimonial Text" 
                  required 
                  value={testimonialText} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTestimonialText(e.target.value)} 
                  rows={5}
                  error={errors.testimonialText}
                />
                
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
              </section>

              {/* MEDIA SECTION */}
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Media</h3>
                <div className="flex items-start gap-6">
                  <div 
                    className="w-24 h-24 rounded-full bg-black/5 dark:bg-white/5 border-2 border-dashed border-border-primary flex items-center justify-center overflow-hidden shrink-0 relative group"
                  >
                    {selectedPhoto ? (
                      <>
                        <img src={resolveImageUrl(selectedPhoto.file)} alt="Author" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setSelectedPhoto(null)}
                            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-secondary-text/50" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3 pt-2">
                    <p className="text-sm text-secondary-text">Select a professional portrait of the author from the Enterprise Media Library.</p>
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => setIsMediaPickerOpen(true)}
                    >
                      {selectedPhoto ? 'Replace Photo' : 'Select Photo'}
                    </Button>
                  </div>
                </div>
              </section>

              {/* PUBLISHING */}
              <section className="space-y-4 pb-12">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Publishing</h3>
                <div className="space-y-3 pt-2">
                  <Checkbox 
                    label="Published (Visible on Website)"
                    checked={isPublished}
                    onChange={() => setIsPublished(!isPublished)}
                  />
                  <Checkbox 
                    label="Featured Testimonial (Promoted on Homepage)"
                    checked={featured}
                    onChange={() => setFeatured(!featured)}
                  />
                </div>
              </section>
              
              {errors.submit && <div className="text-red-500 text-sm mt-4">{errors.submit}</div>}
            </form>
          </div>

          {/* RIGHT: LIVE PREVIEW (Takes ~40%) */}
          <div className="w-full lg:w-[400px] bg-black/5 dark:bg-white/5 p-6 lg:p-8 flex flex-col">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text mb-6">Live Preview</h3>
            
            {/* The actual preview card (mimicking TestimonialCard component design) */}
            <div className="bg-surface-light border border-border-primary rounded-xl p-6 lg:p-8 shadow-sm flex flex-col h-full relative overflow-hidden group transition-all hover:border-accent-primary/50">
              <Quote className="absolute -top-4 -right-4 w-24 h-24 text-accent-primary/5 -rotate-12 group-hover:text-accent-primary/10 transition-colors duration-500" />
              
              <div className="flex text-yellow-500 mb-6">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>

              <blockquote className="flex-grow">
                <p className="text-lg md:text-xl font-medium text-primary-text leading-relaxed">
                  "{testimonialText || 'Quote will appear here...'}"
                </p>
              </blockquote>

              <div className="mt-8 flex items-center gap-4 relative z-10">
                {selectedPhoto ? (
                   <img
                    src={resolveImageUrl(selectedPhoto.file)}
                    alt={authorName || 'Author'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-surface-light shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border-2 border-surface-light shadow-sm flex items-center justify-center text-secondary-text font-medium">
                    {(authorName || 'A').substring(0, 2).toUpperCase()}
                  </div>
                )}
                
                <div>
                  <div className="font-semibold text-primary-text">{authorName || 'Author Name'}</div>
                  <div className="text-sm text-secondary-text">
                    {authorPosition || 'Position'} {selectedClientFull ? `at ${selectedClientFull.company_name}` : ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-secondary-text">
              Displays exactly how it will appear on the public homepage.
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border-primary flex justify-end gap-3 bg-surface-light shrink-0 z-10">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="testimonial-form"
            isLoading={isCreating || isUpdating}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Testimonial
          </Button>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media: MediaFile | MediaFile[]) => {
          const file = Array.isArray(media) ? media[0] : media;
          setSelectedPhoto(file);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
}
