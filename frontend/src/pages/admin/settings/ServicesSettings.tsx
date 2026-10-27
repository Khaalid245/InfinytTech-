import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { Briefcase, Layers, Sparkles, Building2, Workflow, ArrowRight } from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';

const ServicesSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  // Watch fields for live preview
  const watchedServicesBadge = watch('services_badge') || 'OUR SERVICE OFFERINGS';
  const watchedServicesTitle = watch('services_title') || 'How We Help Businesses Build, Scale, and Innovate';
  const watchedServicesSubtitle = watch('services_subtitle') || 'Choose a capability below to see what we build, the business impact we deliver, and how a typical engagement works.';

  const watchedIndBadge = watch('industries_badge') || 'OUR INDUSTRIES';
  const watchedIndTitle = watch('industries_title') || 'Technology Solutions Across Every Industry';
  const watchedIndSubtitle = watch('industries_subtitle') || 'We partner with startups, enterprises, and organizations to design, build, and scale digital products that solve real business challenges across diverse industries.';
  const watchedIndQuote = watch('industries_quote') || "From a healthcare startup to an enterprise logistics platform — our process adapts, our standards don't.";
  const watchedCtaTitle = watch('industries_cta_title') || "Don't see your industry?";
  const watchedCtaSubtitle = watch('industries_cta_subtitle') || 'Our team builds custom digital solutions for organizations of all sizes.';
  const watchedCtaBtn = watch('industries_cta_btn_text') || 'Explore Our Services';

  const watchedProcessBadge = watch('process_badge') || 'Our Delivery Process';
  const watchedProcessTitle = watch('process_title') || 'From Idea to Product. A Transparent Process.';
  const watchedProcessSubtitle = watch('process_subtitle') || 'Every successful product follows a structured process designed for clarity, quality, speed, and long-term business success.';

  useEffect(() => {
    if (settings) {
      reset({
        services_badge: settings.services_badge || 'OUR SERVICE OFFERINGS',
        services_title: settings.services_title || 'How We Help Businesses Build, Scale, and Innovate',
        services_subtitle: settings.services_subtitle || 'Choose a capability below to see what we build, the business impact we deliver, and how a typical engagement works.',

        industries_badge: settings.industries_badge || 'OUR INDUSTRIES',
        industries_title: settings.industries_title || 'Technology Solutions Across Every Industry',
        industries_subtitle: settings.industries_subtitle || 'We partner with startups, enterprises, and organizations to design, build, and scale digital products that solve real business challenges across diverse industries.',
        industries_quote: settings.industries_quote || "From a healthcare startup to an enterprise logistics platform — our process adapts, our standards don't.",
        industries_cta_title: settings.industries_cta_title || "Don't see your industry?",
        industries_cta_subtitle: settings.industries_cta_subtitle || 'Our team builds custom digital solutions for organizations of all sizes.',
        industries_cta_btn_text: settings.industries_cta_btn_text || 'Explore Our Services',

        process_badge: settings.process_badge || 'Our Delivery Process',
        process_title: settings.process_title || 'From Idea to Product. A Transparent Process.',
        process_subtitle: settings.process_subtitle || 'Every successful product follows a structured process designed for clarity, quality, speed, and long-term business success.',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({
        id: settings.id,
        data: {
          services_badge: data.services_badge?.trim(),
          services_title: data.services_title?.trim(),
          services_subtitle: data.services_subtitle?.trim(),

          industries_badge: data.industries_badge?.trim(),
          industries_title: data.industries_title?.trim(),
          industries_subtitle: data.industries_subtitle?.trim(),
          industries_quote: data.industries_quote?.trim(),
          industries_cta_title: data.industries_cta_title?.trim(),
          industries_cta_subtitle: data.industries_cta_subtitle?.trim(),
          industries_cta_btn_text: data.industries_cta_btn_text?.trim(),

          process_badge: data.process_badge?.trim(),
          process_title: data.process_title?.trim(),
          process_subtitle: data.process_subtitle?.trim(),
        },
      });
      reset(data);
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 border-b border-border-primary pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-bold text-primary-text">Services, Industries & Delivery Process Settings</h2>
          </div>
          <p className="text-sm text-secondary-text">
            Configure the public section titles, eyebrow tags, and conversion copy for Service Explorer, Industries We Serve, and Delivery Process.
          </p>
        </div>

        <Link
          to="/admin/services"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 rounded-lg transition-colors self-start md:self-auto"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Services Catalogue</span>
          <ArrowRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl">
        {/* Section 1: Services Explorer Header */}
        <div className="bg-surface-muted/30 p-6 rounded-2xl border border-border-primary/60 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-text">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span>1. Services & Capabilities Explorer Section</span>
          </div>

          <div className="bg-[#0B0D0F] border border-[#23262D] rounded-xl p-6 text-center space-y-3">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#23262D] text-[#D4A017] bg-[#121417]">
              {watchedServicesBadge}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
              {watchedServicesTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
              {watchedServicesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Eyebrow Badge"
                placeholder="OUR SERVICE OFFERINGS"
                {...register('services_badge')}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Section Title"
                placeholder="How We Help Businesses Build, Scale, and Innovate"
                {...register('services_title')}
              />
            </div>
            <div className="md:col-span-3">
              <TextArea
                label="Section Subtitle"
                rows={2}
                placeholder="Choose a capability below to see what we build..."
                {...register('services_subtitle')}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Industries We Serve */}
        <div className="bg-surface-muted/30 p-6 rounded-2xl border border-border-primary/60 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-text">
            <Building2 className="w-4 h-4 text-brand-gold" />
            <span>2. Industries We Serve Section</span>
          </div>

          <div className="bg-[#0B0D0F] border border-[#23262D] rounded-xl p-6 text-center space-y-3">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#23262D] text-[#D4A017] bg-[#121417]">
              {watchedIndBadge}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
              {watchedIndTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
              {watchedIndSubtitle}
            </p>
            <p className="text-xs italic text-[#D4A017] pt-2">
              "{watchedIndQuote}"
            </p>
            <div className="mt-4 pt-3 border-t border-[#23262D] flex items-center justify-between text-left">
              <div>
                <p className="text-xs font-bold text-[#F8FAFC]">{watchedCtaTitle}</p>
                <p className="text-[11px] text-[#94A3B8]">{watchedCtaSubtitle}</p>
              </div>
              <span className="text-[10px] font-semibold text-[#D4A017] border border-[#D4A017]/30 px-2.5 py-1 rounded-lg">
                {watchedCtaBtn} →
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Eyebrow Badge"
                placeholder="OUR INDUSTRIES"
                {...register('industries_badge')}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Section Title"
                placeholder="Technology Solutions Across Every Industry"
                {...register('industries_title')}
              />
            </div>
            <div className="md:col-span-3">
              <TextArea
                label="Section Subtitle"
                rows={2}
                placeholder="We partner with startups, enterprises, and organizations..."
                {...register('industries_subtitle')}
              />
            </div>
            <div className="md:col-span-3">
              <Input
                label="Trust Quote Banner"
                placeholder="From a healthcare startup to an enterprise logistics platform..."
                {...register('industries_quote')}
              />
            </div>
            <div>
              <Input
                label="Banner CTA Title"
                placeholder="Don't see your industry?"
                {...register('industries_cta_title')}
              />
            </div>
            <div>
              <Input
                label="Banner CTA Subtitle"
                placeholder="Our team builds custom digital solutions..."
                {...register('industries_cta_subtitle')}
              />
            </div>
            <div>
              <Input
                label="Banner CTA Button Text"
                placeholder="Explore Our Services"
                {...register('industries_cta_btn_text')}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Process */}
        <div className="bg-surface-muted/30 p-6 rounded-2xl border border-border-primary/60 space-y-6">
          <div className="flex items-center gap-2 text-sm font-bold text-primary-text">
            <Workflow className="w-4 h-4 text-brand-gold" />
            <span>3. Delivery Process & Timeline Section</span>
          </div>

          <div className="bg-[#0B0D0F] border border-[#23262D] rounded-xl p-6 text-center space-y-3">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#23262D] text-[#D4A017] bg-[#121417]">
              {watchedProcessBadge}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
              {watchedProcessTitle}
            </h4>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
              {watchedProcessSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Eyebrow Badge"
                placeholder="Our Delivery Process"
                {...register('process_badge')}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Section Title"
                placeholder="From Idea to Product. A Transparent Process."
                {...register('process_title')}
              />
            </div>
            <div className="md:col-span-3">
              <TextArea
                label="Section Subtitle"
                rows={2}
                placeholder="Every successful product follows a structured process..."
                {...register('process_subtitle')}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-border-primary">
          <span className="text-xs text-secondary-text">
            {isDirty ? '● Unsaved changes detected' : 'All settings synchronized with database.'}
          </span>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting || updateSettings.isPending}
            disabled={!isDirty || isSubmitting || updateSettings.isPending}
          >
            Save Section Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServicesSettings;
