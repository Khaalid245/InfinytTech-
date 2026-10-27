import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { Cpu, Layers, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';

const TechStackSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const watchedBadge = watch('tech_stack_badge') || 'Technology Stack';
  const watchedTitle = watch('tech_stack_title') || 'Tools We Trust to Build and Scale';
  const watchedSubtitle = watch('tech_stack_subtitle') || 'We use proven technologies, modern frameworks, and scalable infrastructure to build reliable digital products for startups, businesses, and growing organizations.';

  useEffect(() => {
    if (settings) {
      reset({
        tech_stack_badge: settings.tech_stack_badge || 'Technology Stack',
        tech_stack_title: settings.tech_stack_title || 'Tools We Trust to Build and Scale',
        tech_stack_subtitle: settings.tech_stack_subtitle || 'We use proven technologies, modern frameworks, and scalable infrastructure to build reliable digital products for startups, businesses, and growing organizations.',
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({
        id: settings.id,
        data: {
          tech_stack_badge: data.tech_stack_badge?.trim(),
          tech_stack_title: data.tech_stack_title?.trim(),
          tech_stack_subtitle: data.tech_stack_subtitle?.trim(),
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
            <Cpu className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-bold text-primary-text">Technology Stack Section Settings</h2>
          </div>
          <p className="text-sm text-secondary-text">
            Configure the section title, eyebrow badge, and introductory narrative for the public Technology Stack section.
          </p>
        </div>

        <Link
          to="/admin/portfolio"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 rounded-lg transition-colors self-start md:self-auto"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Technologies & Icons</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        {/* Live Preview Card */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-secondary-text uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Live Section Header Preview</span>
          </div>

          <div className="bg-[#0B0D0F] border border-[#23262D] rounded-2xl p-8 text-center space-y-4 shadow-xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border border-[#23262D] text-[#D4A017] bg-[#121417]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
              {watchedBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight">
              {watchedTitle}
            </h3>
            <p className="text-xs sm:text-sm font-light text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
              {watchedSubtitle}
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="bg-surface-muted/30 p-6 rounded-2xl border border-border-primary/60 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Input
                label="Eyebrow Badge Tag"
                placeholder="e.g. Technology Stack"
                helperText="Capsule tag above the title"
                {...register('tech_stack_badge')}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Main Section Title"
                placeholder="e.g. Tools We Trust to Build and Scale"
                helperText="Primary headline above category filters"
                {...register('tech_stack_title')}
              />
            </div>
          </div>

          <div>
            <TextArea
              label="Section Description / Subtitle"
              rows={3}
              placeholder="e.g. We use proven technologies, modern frameworks, and scalable infrastructure..."
              helperText="Descriptive paragraph explaining your technology standards"
              {...register('tech_stack_subtitle')}
            />
          </div>
        </div>

        {/* Actions */}
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
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Save Tech Stack Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TechStackSettings;
