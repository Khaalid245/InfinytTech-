import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { BookOpen, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';

const OurStorySettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const watchedBadge = watch('about_story_badge') || 'Our Story';
  const watchedTitle = watch('about_story_title') || 'Bridging Tech Corridors';
  const watchedLead = watch('about_story_lead') || 'We believe world-class technology talent exists everywhere. Yet too many organizations struggle to access reliable engineering partners capable of turning ambitious ideas into scalable digital products.';
  const watchedP1 = watch('about_story_paragraph_1') || `${settings?.company_name || 'InfinytTech'} was founded to bridge that gap. We unite highly disciplined, self-starting developers with international networks, breaking down traditional Silicon Valley corridors to unlock global engineering capacity.`;
  const watchedP2 = watch('about_story_paragraph_2') || 'By combining strict quality standards, modern development workflows, and a philosophy of long-term partnership, we deliver production-ready SaaS platforms, machine learning systems, and complex product architectures directly to enterprises worldwide on time.';
  const watchedSymbol = watch('about_story_symbol') || '∞';

  useEffect(() => {
    if (settings) {
      reset({
        about_story_badge: settings.about_story_badge || 'Our Story',
        about_story_title: settings.about_story_title || 'Bridging Tech Corridors',
        about_story_lead: settings.about_story_lead || 'We believe world-class technology talent exists everywhere. Yet too many organizations struggle to access reliable engineering partners capable of turning ambitious ideas into scalable digital products.',
        about_story_paragraph_1: settings.about_story_paragraph_1 || `${settings.company_name || 'InfinytTech'} was founded to bridge that gap. We unite highly disciplined, self-starting developers with international networks, breaking down traditional Silicon Valley corridors to unlock global engineering capacity.`,
        about_story_paragraph_2: settings.about_story_paragraph_2 || 'By combining strict quality standards, modern development workflows, and a philosophy of long-term partnership, we deliver production-ready SaaS platforms, machine learning systems, and complex product architectures directly to enterprises worldwide on time.',
        about_story_symbol: settings.about_story_symbol || '∞',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({
        id: settings.id,
        data: {
          about_story_badge: data.about_story_badge?.trim(),
          about_story_title: data.about_story_title?.trim(),
          about_story_lead: data.about_story_lead?.trim(),
          about_story_paragraph_1: data.about_story_paragraph_1?.trim(),
          about_story_paragraph_2: data.about_story_paragraph_2?.trim(),
          about_story_symbol: data.about_story_symbol?.trim() || '∞',
        },
      });
      reset(data);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="p-8 flex items-center justify-center">
        <LoadingState variant="spinner" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-text">Our Story & Strategic Narrative</h2>
            <p className="text-sm text-secondary-text">
              Customize the "Bridging Tech Corridors" story narrative, mission statement, and badge displayed on the About page.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          disabled={!isDirty}
          variant="primary"
          className="shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Narrative
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Live Card Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary-text">
            <Eye className="w-4 h-4 text-accent-primary" />
            Live Preview on About Page
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-dark border border-border-primary text-white shadow-xl relative overflow-hidden group">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 flex flex-col items-start text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] mb-3">
                  {watchedBadge}
                </span>
                <h3 className="text-2xl font-black mb-4 tracking-tight text-white">
                  {watchedTitle}
                </h3>
                <p className="text-sm sm:text-base font-semibold leading-relaxed mb-4 text-white group-hover:text-[#D4A017] transition-colors duration-300">
                  {watchedLead}
                </p>
                <div className="text-xs font-light leading-relaxed space-y-3 text-slate-300">
                  <p>{watchedP1}</p>
                  <p>{watchedP2}</p>
                </div>
              </div>
              <div className="md:col-span-4 flex items-center justify-center md:justify-end">
                <div className="w-24 h-24 rounded-full border border-border-primary bg-surface-light flex items-center justify-center font-bold text-3xl text-[#D4A017] shadow-inner">
                  {watchedSymbol}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Form Inputs */}
        <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-border-primary pb-4">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <h3 className="text-base font-semibold text-primary-text">Narrative Content</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Eyebrow Badge Tag"
                placeholder="e.g. Our Story"
                helperText="Displayed in gold/amber uppercase above the title"
                {...register('about_story_badge')}
              />
            </div>
            <div>
              <Input
                label="Badge Symbol / Monogram"
                placeholder="e.g. ∞"
                helperText="Symbol displayed inside the circular badge"
                {...register('about_story_symbol')}
              />
            </div>
          </div>

          <div>
            <Input
              label="Section Headline / Title"
              placeholder="e.g. Bridging Tech Corridors"
              helperText="The bold primary headline for your story"
              {...register('about_story_title')}
            />
          </div>

          <div>
            <TextArea
              label="Highlighted Lead Statement"
              rows={3}
              placeholder="Bold summary paragraph that defines your core mission/belief"
              helperText="Rendered in bolder, larger typography below the title"
              {...register('about_story_lead')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <TextArea
                label="Body Paragraph 1 (Origins & Mission)"
                rows={5}
                placeholder="Describe why the company was founded and what gap it bridges..."
                helperText="First explanatory narrative paragraph"
                {...register('about_story_paragraph_1')}
              />
            </div>
            <div>
              <TextArea
                label="Body Paragraph 2 (Execution & Promise)"
                rows={5}
                placeholder="Describe your engineering standards, workflows, and delivery promise..."
                helperText="Second explanatory narrative paragraph"
                {...register('about_story_paragraph_2')}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-primary">
          <Button
            type="button"
            variant="secondary"
            onClick={() => reset()}
            disabled={!isDirty || isSubmitting}
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty}
            variant="primary"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Narrative
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OurStorySettings;
