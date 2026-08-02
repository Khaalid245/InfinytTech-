import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { Trash2, Plus } from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';

const ContactSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, control, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'office_locations' as any
  });

  useEffect(() => {
    if (settings) {
      reset({
        primary_email: settings.primary_email,
        support_email: settings.support_email,
        sales_email: settings.sales_email,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        office_address: settings.office_address,
        google_maps_url: settings.google_maps_url,
        business_hours: settings.business_hours,
        office_locations: settings.office_locations || [],
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({ id: settings.id, data });
      reset(data); // reset form with new data to clear isDirty
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-primary-text">Contact Information</h2>
          <p className="text-sm text-secondary-text">Manage addresses and support channels.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Primary Email" 
            type="email"
            {...register('primary_email')} 
          />
          <Input 
            label="Support Email" 
            type="email"
            {...register('support_email')} 
          />
          <Input 
            label="Sales Email" 
            type="email"
            {...register('sales_email')} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-primary">
          <Input 
            label="Phone Number" 
            {...register('phone')} 
          />
          <Input 
            label="WhatsApp Number" 
            {...register('whatsapp')} 
          />
        </div>

        <div className="space-y-6 pt-4 border-t border-border-primary">
          <TextArea 
            label="Office Address" 
            {...register('office_address')} 
            rows={3} 
          />
          <Input 
            label="Google Maps Embed URL" 
            {...register('google_maps_url')} 
          />
          <TextArea 
            label="Business Hours" 
            {...register('business_hours')} 
            rows={3}
            placeholder="Mon - Fri: 9:00 AM - 6:00 PM"
          />
        </div>

        <div className="pt-6 border-t border-border-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-md font-medium text-primary-text">Office Locations</h3>
              <p className="text-sm text-secondary-text">Locations shown on the Contact page.</p>
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => append({ city: '', country: '', address: '', phone: '', email: '', map_url: '', order: fields.length, is_active: true })}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Location
            </Button>
          </div>
          
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border-primary rounded-lg bg-surface relative">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-10">
                  <Input 
                    label="City" 
                    {...register(`office_locations.${index}.city`)} 
                    placeholder="e.g. Mogadishu Office"
                  />
                  <Input 
                    label="Country" 
                    {...register(`office_locations.${index}.country`)} 
                    placeholder="e.g. Somalia"
                  />
                  <TextArea 
                    label="Address" 
                    {...register(`office_locations.${index}.address`)} 
                    rows={2}
                  />
                  <div className="space-y-4">
                    <Input 
                      label="Email" 
                      {...register(`office_locations.${index}.email`)} 
                    />
                    <Input 
                      label="Phone" 
                      {...register(`office_locations.${index}.phone`)} 
                    />
                  </div>
                </div>
              </div>
            ))}
            {fields.length === 0 && (
              <div className="text-center py-8 border border-dashed border-border-primary rounded-lg text-secondary-text">
                No office locations added yet.
              </div>
            )}
          </div>
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

export default ContactSettings;
