import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import Select from '../../../components/ui/Select';
import type { SiteSettings } from '../../../types/siteSettings.types';

const GeneralSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  useEffect(() => {
    if (settings) {
      reset({
        company_name: settings.company_name,
        company_tagline: settings.company_tagline,
        company_description: settings.company_description,
        founded_year: settings.founded_year,
        company_timezone: settings.company_timezone,
        default_language: settings.default_language,
        default_currency: settings.default_currency,
        completed_projects: settings.completed_projects ?? 0,
        happy_clients: settings.happy_clients ?? 0,
        countries_served: settings.countries_served ?? 0,
        years_experience: settings.years_experience ?? 0,
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
          <h2 className="text-lg font-medium text-primary-text">General Settings</h2>
          <p className="text-sm text-secondary-text">Update your core business information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Company Name" 
            {...register('company_name')} 
            required 
          />
          <Input 
            label="Company Tagline" 
            {...register('company_tagline')} 
          />
        </div>

        <TextArea 
          label="Business Description" 
          {...register('company_description')} 
          rows={4} 
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border-primary">
          <Select 
            label="Default Language" 
            {...register('default_language')}
            options={[
              { value: 'en', label: 'English (US)' },
              { value: 'en-gb', label: 'English (UK)' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'es', label: 'Spanish' },
            ]}
          />
          <Select 
            label="Default Currency" 
            {...register('default_currency')}
            options={[
              { value: 'USD', label: 'US Dollar (USD)' },
              { value: 'EUR', label: 'Euro (EUR)' },
              { value: 'GBP', label: 'British Pound (GBP)' },
            ]}
          />
          <Input 
            label="Founded Year" 
            type="number"
            {...register('founded_year', { valueAsNumber: true })} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select 
            label="Company Timezone" 
            {...register('company_timezone')}
            options={[
              { value: 'UTC', label: 'UTC' },
              { value: 'America/New_York', label: 'America/New_York (EST)' },
              { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
              { value: 'Europe/London', label: 'Europe/London (GMT)' },
              { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
              { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
            ]}
          />
        </div>

        {/* Business Statistics Section */}
        <div className="pt-6 border-t border-border-primary">
          <h3 className="text-base font-semibold text-primary-text mb-1">Business Statistics & KPI Metrics</h3>
          <p className="text-xs text-secondary-text mb-4">Numbers displayed live in the homepage counter and impact sections.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
              label="Completed Projects" 
              type="number"
              min="0"
              {...register('completed_projects', { valueAsNumber: true })} 
            />
            <Input 
              label="Happy Clients (%)" 
              type="number"
              min="0"
              max="100"
              {...register('happy_clients', { valueAsNumber: true })} 
            />
            <Input 
              label="Countries Served" 
              type="number"
              min="0"
              {...register('countries_served', { valueAsNumber: true })} 
            />
            <Input 
              label="Years Experience" 
              type="number"
              min="0"
              {...register('years_experience', { valueAsNumber: true })} 
            />
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

export default GeneralSettings;
