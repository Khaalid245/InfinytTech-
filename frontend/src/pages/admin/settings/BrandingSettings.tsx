import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import MediaPickerModal from '../../../components/admin/media/MediaPickerModal';
import type { SiteSettings, MediaImage } from '../../../types/siteSettings.types';
import { Image as ImageIcon, X } from 'lucide-react';

const ImageSelector = ({ 
  label, 
  value, 
  details, 
  onChange, 
  onClear 
}: { 
  label: string; 
  value: string | null; 
  details: MediaImage | null;
  onChange: (id: string) => void;
  onClear: () => void;
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary-text">{label}</label>
      {value && details ? (
        <div className="relative w-40 h-40 border border-border-primary rounded-lg overflow-hidden group bg-surface-light flex items-center justify-center p-4">
          <img src={details.url} alt={details.alt_text || 'Selected media'} className="max-w-full max-h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onClear}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="w-40 h-40 border-2 border-dashed border-border-primary rounded-lg flex flex-col items-center justify-center text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-sm font-medium">Select Image</span>
        </button>
      )}

      {isPickerOpen && (
        <MediaPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          title={`Select ${label}`}
          onSelect={(media) => {
            if (!Array.isArray(media)) {
              onChange(media.id);
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
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-primary-text">Branding</h2>
        <p className="text-sm text-secondary-text">Manage your site logos and visual identity.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Controller
            name="primary_logo"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Primary Logo"
                value={field.value || null}
                details={watch('primary_logo_details') || null}
                onChange={(id) => {
                  field.onChange(id);
                  // Trigger re-fetch or clear details to show loading in a real app, 
                  // here we just save and it'll refresh from the server.
                }}
                onClear={() => {
                  field.onChange(null);
                  setValue('primary_logo_details', null, { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            name="dark_logo"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Dark Mode Logo"
                value={field.value || null}
                details={watch('dark_logo_details') || null}
                onChange={(id) => field.onChange(id)}
                onClear={() => {
                  field.onChange(null);
                  setValue('dark_logo_details', null, { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            name="light_logo"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Light Mode Logo"
                value={field.value || null}
                details={watch('light_logo_details') || null}
                onChange={(id) => field.onChange(id)}
                onClear={() => {
                  field.onChange(null);
                  setValue('light_logo_details', null, { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            name="favicon"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Favicon"
                value={field.value || null}
                details={watch('favicon_details') || null}
                onChange={(id) => field.onChange(id)}
                onClear={() => {
                  field.onChange(null);
                  setValue('favicon_details', null, { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            name="apple_touch_icon"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Apple Touch Icon"
                value={field.value || null}
                details={watch('apple_touch_icon_details') || null}
                onChange={(id) => field.onChange(id)}
                onClear={() => {
                  field.onChange(null);
                  setValue('apple_touch_icon_details', null, { shouldDirty: true });
                }}
              />
            )}
          />
          <Controller
            name="open_graph_image"
            control={control}
            render={({ field }) => (
              <ImageSelector
                label="Default Open Graph Image"
                value={field.value || null}
                details={watch('open_graph_image_details') || null}
                onChange={(id) => field.onChange(id)}
                onClear={() => {
                  field.onChange(null);
                  setValue('open_graph_image_details', null, { shouldDirty: true });
                }}
              />
            )}
          />
        </div>

        <div className="pt-6 border-t border-border-primary flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={updateSettings.isPending || isSubmitting}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BrandingSettings;
