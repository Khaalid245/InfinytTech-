import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import MediaPickerModal from '../../../components/admin/media/MediaPickerModal';
import type { SiteSettings, MediaImage } from '../../../types/siteSettings.types';
import { resolveImageUrl } from '../../../utils/imageHelper';
import { Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

const ImageSelector = ({ 
  label, 
  savedId,
  savedDetails,
  selectedId,
  selectedDetails,
  onChange, 
  onRevert 
}: { 
  label: string; 
  savedId: string | null;
  savedDetails: MediaImage | null;
  selectedId: string | null; 
  selectedDetails: MediaImage | null;
  onChange: (media: any) => void;
  onRevert: () => void;
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const hasChanged = savedId !== selectedId;

  return (
    <div className="space-y-3 bg-surface-light border border-border-primary rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-primary pb-3 mb-4 gap-3">
        <label className="text-base font-semibold text-primary-text flex items-center gap-2">
          {label}
        </label>
        {hasChanged ? (
           <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full w-fit">
             <AlertCircle className="w-3.5 h-3.5" /> Unsaved Changes
           </span>
        ) : (
           <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full w-fit">
             <CheckCircle2 className="w-3.5 h-3.5" /> Currently Saved
           </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CURRENTLY SAVED */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">Currently Saved</span>
          {savedId && savedDetails ? (
            <div className="relative w-full aspect-square border border-border-primary rounded-lg overflow-hidden bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center p-4">
              <img src={savedDetails.url || (savedDetails as any).file} alt={savedDetails.alt_text || 'Saved media'} className="flex-1 min-h-0 object-contain w-full" />
              {savedDetails.url && (
                 <div className="mt-3 text-[10px] text-secondary-text break-all w-full text-center line-clamp-2">
                   {savedDetails.url.split('/').pop()}
                 </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-square border border-dashed border-border-primary rounded-lg flex flex-col items-center justify-center text-secondary-text bg-black/2 dark:bg-white/2">
              <span className="text-sm font-medium">None</span>
            </div>
          )}
        </div>

        {/* NEW SELECTION OR ACTION */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
            {hasChanged ? 'New Selection' : 'Action'}
          </span>
          {hasChanged && selectedId && selectedDetails ? (
            <div className="relative w-full aspect-square border-2 border-accent-primary rounded-lg overflow-hidden bg-surface flex flex-col items-center justify-center p-4 shadow-sm group">
              <img src={selectedDetails.url || (selectedDetails as any).file} alt={selectedDetails.alt_text || 'Selected media'} className="flex-1 min-h-0 object-contain w-full" />
              {selectedDetails.url && (
                 <div className="mt-3 text-[10px] text-secondary-text break-all w-full text-center line-clamp-2">
                   {selectedDetails.url.split('/').pop()}
                 </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPickerOpen(true)}
                  className="px-3 py-1.5 bg-white text-black text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={onRevert}
                  className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  title="Revert to Saved"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : hasChanged && !selectedId ? (
            <div className="relative w-full aspect-square border-2 border-dashed border-red-500/50 rounded-lg overflow-hidden bg-red-500/5 flex flex-col items-center justify-center p-4">
              <span className="text-sm font-medium text-red-500 mb-2">Will be removed</span>
              <button
                type="button"
                onClick={onRevert}
                className="text-xs font-medium text-secondary-text hover:text-primary-text underline"
              >
                Undo Remove
              </button>
            </div>
          ) : (
            <div className="w-full aspect-square flex flex-col gap-4 items-center justify-center border border-dashed border-border-primary rounded-lg bg-black/2 dark:bg-white/2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
               <button
                 type="button"
                 onClick={() => setIsPickerOpen(true)}
                 className="flex flex-col items-center text-secondary-text hover:text-accent-primary transition-colors"
               >
                 <ImageIcon className="w-8 h-8 mb-2" />
                 <span className="text-sm font-medium">Select Image</span>
               </button>
               {savedId && (
                 <button
                   type="button"
                   onClick={() => onChange(null)}
                   className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline px-3 py-1 rounded hover:bg-red-500/10 transition-colors"
                 >
                   Remove Image
                 </button>
               )}
            </div>
          )}
        </div>
      </div>

      {isPickerOpen && (
        <MediaPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          title={`Select ${label}`}
          onSelect={(media) => {
            if (!Array.isArray(media)) {
              onChange(media);
            }
            setIsPickerOpen(false);
          }}
        />
      )}
    </div>
  );
};

const BrandingSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  // Subscribe component to all form state changes to trigger previews and active save button states
  watch();

  useEffect(() => {
    if (settings) {
      reset({
        primary_logo: settings.primary_logo,
        primary_logo_details: settings.primary_logo_details,
        secondary_logo: settings.secondary_logo,
        secondary_logo_details: settings.secondary_logo_details,
        dark_logo: settings.dark_logo,
        dark_logo_details: settings.dark_logo_details,
        light_logo: settings.light_logo,
        light_logo_details: settings.light_logo_details,
        favicon: settings.favicon,
        favicon_details: settings.favicon_details,
        open_graph_image: settings.open_graph_image,
        open_graph_image_details: settings.open_graph_image_details,
        apple_touch_icon: settings.apple_touch_icon,
        apple_touch_icon_details: settings.apple_touch_icon_details,
        loading_logo: settings.loading_logo,
        loading_logo_details: settings.loading_logo_details,
        brand_colors: settings.brand_colors || {},
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      try {
        // clean details from payload, backend doesn't expect them for update, just the IDs
        const payload = { ...data };
        delete payload.primary_logo_details;
        delete payload.secondary_logo_details;
        delete payload.dark_logo_details;
        delete payload.light_logo_details;
        delete payload.favicon_details;
        delete payload.open_graph_image_details;
        delete payload.apple_touch_icon_details;
        delete payload.loading_logo_details;
  
        await updateSettings.mutateAsync({ id: settings.id, data: payload });
        toast.success('Branding updated successfully', { duration: 4000 });
      } catch (error) {
        toast.error('Failed to update branding. Please try again.', { duration: 5000 });
      }
    }
  };

  const handleMediaChange = (field: any, name: any, media: any) => {
    if (media) {
      field.onChange(media.id);
      // Resolve to absolute URL immediately so the preview <img> renders before save
      const absoluteUrl = resolveImageUrl(media.file) || media.file;
      setValue(`${name}_details` as any, { id: media.id, url: absoluteUrl, alt_text: media.alt_text || media.title } as any, { shouldDirty: true });
    } else {
      field.onChange(null);
      setValue(`${name}_details` as any, null, { shouldDirty: true });
    }
  };

  const handleMediaRevert = (field: any, name: any) => {
    field.onChange((settings as any)?.[name] || null);
    setValue(`${name}_details` as any, (settings as any)?.[`${name}_details`] || null, { shouldDirty: false });
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  const hasUnsavedChanges = isDirty;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-text">Branding Assets</h2>
          <p className="text-sm text-secondary-text mt-1">Manage your enterprise visual identity and platform icons.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-sm font-medium text-amber-500 animate-pulse">
              Unsaved changes detected
            </span>
          )}
          <Button 
            type="submit" 
            form="branding-form"
            variant="primary" 
            isLoading={updateSettings.isPending || isSubmitting}
            disabled={!hasUnsavedChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <form id="branding-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Controller
            name="primary_logo"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Primary Logo"
                savedId={settings?.primary_logo || null}
                savedDetails={settings?.primary_logo_details || null}
                selectedId={field.value || null}
                selectedDetails={watch('primary_logo_details') || null}
                onChange={(m) => handleMediaChange(field, 'primary_logo', m)}
                onRevert={() => handleMediaRevert(field, 'primary_logo')}
              />
            )}
          />
          <Controller
            name="dark_logo"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Dark Mode Logo"
                savedId={settings?.dark_logo || null}
                savedDetails={settings?.dark_logo_details || null}
                selectedId={field.value || null}
                selectedDetails={watch('dark_logo_details') || null}
                onChange={(m) => handleMediaChange(field, 'dark_logo', m)}
                onRevert={() => handleMediaRevert(field, 'dark_logo')}
              />
            )}
          />
          <Controller
            name="light_logo"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Light Mode Logo"
                savedId={settings?.light_logo || null}
                savedDetails={settings?.light_logo_details || null}
                selectedId={field.value || null}
                selectedDetails={watch('light_logo_details') || null}
                onChange={(m) => handleMediaChange(field, 'light_logo', m)}
                onRevert={() => handleMediaRevert(field, 'light_logo')}
              />
            )}
          />
          <Controller
            name="favicon"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Favicon"
                savedId={settings?.favicon || null}
                savedDetails={settings?.favicon_details || null}
                selectedId={field.value || null}
                selectedDetails={watch('favicon_details') || null}
                onChange={(m) => handleMediaChange(field, 'favicon', m)}
                onRevert={() => handleMediaRevert(field, 'favicon')}
              />
            )}
          />
          <Controller
            name="apple_touch_icon"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Apple Touch Icon"
                savedId={settings?.apple_touch_icon || null}
                savedDetails={settings?.apple_touch_icon_details || null}
                selectedId={field.value || null}
                selectedDetails={watch('apple_touch_icon_details') || null}
                onChange={(m) => handleMediaChange(field, 'apple_touch_icon', m)}
                onRevert={() => handleMediaRevert(field, 'apple_touch_icon')}
              />
            )}
          />
          <Controller
            name="open_graph_image"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Default Open Graph Image"
                savedId={settings?.open_graph_image || null}
                savedDetails={settings?.open_graph_image_details || null}
                selectedId={field.value || null}
                selectedDetails={watch('open_graph_image_details') || null}
                onChange={(m) => handleMediaChange(field, 'open_graph_image', m)}
                onRevert={() => handleMediaRevert(field, 'open_graph_image')}
              />
            )}
          />
        </div>

        <div className="pt-6 border-t border-border-primary flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={updateSettings.isPending || isSubmitting}
            disabled={!hasUnsavedChanges}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BrandingSettings;
