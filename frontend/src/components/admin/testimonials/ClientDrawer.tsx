import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Checkbox from '../../ui/Checkbox';
import Combobox from '../../ui/Combobox';
import type { Client } from '../../../types/testimonials';
import type { MediaFile } from '../../../services/media.service';
import { useCreateClient, useUpdateClient } from '../../../hooks/useTestimonialsAdmin';
import { resolveImageUrl } from '../../../utils/imageHelper';
import MediaPickerModal from '../media/MediaPickerModal';

interface ClientDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Education', 'Finance', 'Retail', 
  'Hospitality', 'Agriculture', 'Construction', 'Government', 'Other'
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'India', 'Japan', 'Brazil', 'Somalia', 'Kenya', 'South Africa'
];

export default function ClientDrawer({ isOpen, onClose, client }: ClientDrawerProps) {
  const [companyName, setCompanyName] = useState('');
  const [slug, setSlug] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Form State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Media Picker
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<MediaFile | null>(null);

  const { mutateAsync: createClient, isPending: isCreating } = useCreateClient();
  const { mutateAsync: updateClient, isPending: isUpdating } = useUpdateClient();

  useEffect(() => {
    if (client) {
      setCompanyName(client.company_name);
      setSlug(client.slug);
      setIndustry(client.industry || '');
      setWebsite(client.website || '');
      setCountry(client.country || '');
      setCompanySize(client.company_size || '');
      setIsActive(client.is_active ?? true);

      if (client.company_logo) {
        setSelectedLogo({
          id: client.company_logo.id,
          file: client.company_logo.file,
          file_name: client.company_logo.file_name,
          alt_text: client.company_logo.alt_text,
          folder: null,
          title: '',
          caption: '',
          description: '',
          mime_type: 'image/png',
          extension: 'png',
          checksum: '',
          is_public: true,
          file_size: 0, // Using 0 if unknown
          width: null,
          height: null,
          created_at: '',
          updated_at: ''
        });
      } else {
        setSelectedLogo(null);
      }
    } else {
      resetForm();
    }
    setErrors({});
  }, [client, isOpen]);

  const resetForm = () => {
    setCompanyName('');
    setSlug('');
    setIndustry('');
    setWebsite('');
    setCountry('');
    setCompanySize('');
    setIsActive(true);
    setSelectedLogo(null);
    setErrors({});
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!companyName.trim()) newErrors.companyName = 'Company name is required.';
    if (!industry) newErrors.industry = 'Industry is required.';
    
    if (website && !/^https?:\/\//i.test(website)) {
      newErrors.website = 'Website URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWebsiteBlur = () => {
    if (website && !/^https?:\/\//i.test(website)) {
      setWebsite(`https://${website.trim()}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const payload = {
        company_name: companyName,
        slug,
        industry,
        website,
        country,
        company_size: companySize,
        is_active: isActive,
        company_logo: selectedLogo?.id || null,
      };

      if (client) {
        await updateClient({ id: client.id, data: payload });
      } else {
        await createClient(payload);
      }
      
      onClose();
    } catch (err) {
      console.error('Failed to save client', err);
      setErrors({ submit: 'Failed to save client. Please try again.' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-surface-light shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-border-primary shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-primary-text">
              {client ? 'Edit Client' : 'Add Client'}
            </h2>
            <p className="text-secondary-text text-sm">Professional Client Information</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-secondary-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* GENERAL SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">General</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Company Name" required value={companyName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)} error={errors.companyName} />
                <Input label="Slug (Auto-generated if empty)" value={slug} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSlug(e.target.value)} />
              </div>
            </section>

            {/* BRANDING SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Branding</h3>
              
              {!selectedLogo ? (
                <div className="border-2 border-dashed border-border-primary rounded-xl p-8 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5">
                  <ImageIcon className="w-10 h-10 text-secondary-text/50 mb-3" />
                  <p className="text-sm text-secondary-text mb-4 text-center max-w-xs">Select a professional company logo from the Enterprise Media Library. Recommended format: SVG or transparent PNG.</p>
                  <Button type="button" variant="secondary" onClick={() => setIsMediaPickerOpen(true)}>
                    Select Logo
                  </Button>
                </div>
              ) : (
                <div className="border border-border-primary rounded-xl p-4 flex flex-col sm:flex-row gap-6 bg-surface-light items-start sm:items-center">
                  <div className="w-32 h-32 rounded-lg bg-black/5 dark:bg-white/5 border border-border-primary flex items-center justify-center p-2 shrink-0">
                    <img src={resolveImageUrl(selectedLogo.file)} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-primary-text truncate mb-1" title={selectedLogo.file_name}>{selectedLogo.file_name}</h4>
                    <div className="text-xs text-secondary-text space-y-1 mb-4">
                      {selectedLogo.file_size > 0 && <div>Size: {formatFileSize(selectedLogo.file_size)}</div>}
                      {selectedLogo.width && selectedLogo.height && <div>Dimensions: {selectedLogo.width} × {selectedLogo.height}</div>}
                      <div>Format: {selectedLogo.extension?.toUpperCase() || 'IMG'}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={() => setIsMediaPickerOpen(true)} className="py-1 px-3 text-xs">
                        Replace
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setSelectedLogo(null)} className="py-1 px-3 text-xs text-red-500 hover:bg-red-500/10">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* BUSINESS SECTION */}
            <section className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Business</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Combobox
                  label="Industry"
                  required
                  options={INDUSTRIES.map(i => ({ value: i, label: i }))}
                  value={industry}
                  onChange={setIndustry}
                  placeholder="Select industry..."
                  emptyText="No exact match found."
                  error={errors.industry}
                />
                
                <Combobox
                  label="Country"
                  options={COUNTRIES.map(c => ({ value: c, label: c }))}
                  value={country}
                  onChange={setCountry}
                  placeholder="Select country..."
                  emptyText="No exact match found."
                />

                <Input 
                  label="Website URL" 
                  type="text" 
                  value={website} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWebsite(e.target.value)} 
                  onBlur={handleWebsiteBlur}
                  placeholder="acacia.com" 
                  error={errors.website}
                />
                <Input 
                  label="Company Size" 
                  value={companySize} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanySize(e.target.value)} 
                  placeholder="e.g. 1000+ employees" 
                />
              </div>
            </section>

            {/* PUBLISHING */}
            <section className="space-y-4 pb-12">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary pb-2">Publishing</h3>
              <div className="space-y-3 pt-2">
                <Checkbox 
                  label="Published (Visible on Website)"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
              </div>
            </section>
            
            {errors.submit && <div className="text-red-500 text-sm">{errors.submit}</div>}
          </form>
        </div>

        <div className="p-6 border-t border-border-primary flex justify-end gap-3 bg-surface-light shrink-0">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            form="client-form"
            isLoading={isCreating || isUpdating}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Client
          </Button>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media: MediaFile | MediaFile[]) => {
          const file = Array.isArray(media) ? media[0] : media;
          setSelectedLogo(file);
          setIsMediaPickerOpen(false);
        }}
      />
    </>
  );
}
