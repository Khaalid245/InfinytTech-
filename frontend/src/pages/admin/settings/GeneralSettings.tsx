import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import Select from '../../../components/ui/Select';
import { Settings, Compass, Award, ArrowRight, BarChart3, Globe2, Building } from 'lucide-react';
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
      reset(data);
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-border-primary pb-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-brand-gold" />
          <h2 className="text-xl font-bold text-primary-text">General Platform Settings</h2>
        </div>
        <p className="text-sm text-secondary-text">
          Manage your organization's core business identity, regional localization, and global milestone metrics.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl">
        {/* ─── 1. Platform Identity ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-gold" />
            <h3 className="text-base font-semibold text-primary-text">Company Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-muted/30 p-5 rounded-2xl border border-border-primary/60">
            <Input 
              label="Company Name" 
              {...register('company_name')} 
              required 
              placeholder="Infinity Technologies"
            />
            <Input 
              label="Company Tagline" 
              {...register('company_tagline')} 
              placeholder="Enterprise Digital Product Engineering"
            />
            <div className="md:col-span-2">
              <TextArea 
                label="Business Description / Summary" 
                {...register('company_description')} 
                rows={3} 
                placeholder="High-level description of your technology consulting firm..."
              />
            </div>
          </div>
        </div>

        {/* ─── 2. Localization & Regional Standards ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-brand-gold" />
            <h3 className="text-base font-semibold text-primary-text">Localization & Regional Standards</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-surface-muted/30 p-5 rounded-2xl border border-border-primary/60">
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
                { value: 'USD', label: 'US Dollar ($)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' },
              ]}
            />
            <Select 
              label="Company Timezone" 
              {...register('company_timezone')}
              options={[
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'America/New_York (EST)' },
                { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
                { value: 'Europe/London', label: 'Europe/London (GMT)' },
                { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
                { value: 'Africa/Nairobi', label: 'Africa/Nairobi (EAT)' },
                { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
              ]}
            />
            <Input 
              label="Founded Year" 
              type="number"
              {...register('founded_year', { valueAsNumber: true })} 
            />
          </div>
        </div>

        {/* ─── 3. Global Measurable Milestone Metrics ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-gold" />
            <h3 className="text-base font-semibold text-primary-text">Global Milestone Metrics (Counters)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-surface-muted/30 p-5 rounded-2xl border border-border-primary/60">
            <Input 
              label="Completed Projects" 
              type="number"
              {...register('completed_projects', { valueAsNumber: true })} 
            />
            <Input 
              label="Happy Enterprise Clients" 
              type="number"
              {...register('happy_clients', { valueAsNumber: true })} 
            />
            <Input 
              label="Countries Served" 
              type="number"
              {...register('countries_served', { valueAsNumber: true })} 
            />
            <Input 
              label="Years of Experience" 
              type="number"
              {...register('years_experience', { valueAsNumber: true })} 
            />
          </div>
        </div>

        {/* ─── 4. Quick Navigation Hub to Dedicated CMS Pages ─── */}
        <div className="space-y-4 pt-4 border-t border-border-primary">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text">
            Dedicated Page Sections CMS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/admin/settings/mission-values"
              className="p-5 rounded-2xl border border-border-primary bg-surface-muted/20 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary-text font-semibold group-hover:text-brand-gold transition-colors">
                  <Compass className="w-4 h-4 text-brand-gold" />
                  Mission, Vision & Values
                </div>
                <p className="text-xs text-secondary-text">
                  Manage the strategic statements and 6 foundational core value cards.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-secondary-text group-hover:text-brand-gold group-hover:translate-x-1 transition-all mt-1" />
            </Link>

            <Link 
              to="/admin/settings/why-choose-us"
              className="p-5 rounded-2xl border border-border-primary bg-surface-muted/20 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary-text font-semibold group-hover:text-brand-gold transition-colors">
                  <Award className="w-4 h-4 text-brand-gold" />
                  Why Choose Us (Differentiators)
                </div>
                <p className="text-xs text-secondary-text">
                  Manage section headlines and the 6 dynamic differentiator cards.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-secondary-text group-hover:text-brand-gold group-hover:translate-x-1 transition-all mt-1" />
            </Link>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-border-primary sticky bottom-0 bg-surface-light/95 backdrop-blur-md py-4 z-10">
          <div className="text-xs text-secondary-text">
            {isDirty ? (
              <span className="text-brand-gold font-medium">You have unsaved changes</span>
            ) : (
              <span>All changes synchronized with backend</span>
            )}
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isSubmitting}
            disabled={!isDirty}
          >
            Save General Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
