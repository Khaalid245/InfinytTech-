import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';

const DEFAULT_TRUST_ITEMS: string[] = [
  'Enterprise Engineering',
  'Scalable Architecture',
  'Modern Technology Stack',
  'Long-Term Partnership',
];

const PortfolioHeroSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const [trustItems, setTrustItems] = useState<string[]>(DEFAULT_TRUST_ITEMS);
  const [itemsModified, setItemsModified] = useState(false);

  const watchedBadge = watch('portfolio_hero_badge') || 'OUR WORK';
  const watchedTitle = watch('portfolio_hero_title') || 'Products Built For Real Business Growth.';
  const watchedSubtitle = watch('portfolio_hero_subtitle') || 'Explore selected digital products, platforms, and technology solutions designed to help startups, businesses, and organizations scale with confidence.';
  const watchedPrimaryBtn = watch('portfolio_hero_primary_btn_text') || 'View Projects';
  const watchedSecondaryBtn = watch('portfolio_hero_secondary_btn_text') || 'Start Your Project';

  const watchedFeaturedBadge = watch('portfolio_featured_badge') || 'FEATURED PROJECTS';
  const watchedFeaturedTitle = watch('portfolio_featured_title') || 'Solutions Designed To Solve Real Problems.';
  const watchedFeaturedSubtitle = watch('portfolio_featured_subtitle') || 'A selection of products and platforms built to improve operations, customer experiences, and business growth.';

  useEffect(() => {
    if (settings) {
      reset({
        portfolio_hero_badge: settings.portfolio_hero_badge || 'OUR WORK',
        portfolio_hero_title: settings.portfolio_hero_title || 'Products Built For Real Business Growth.',
        portfolio_hero_subtitle: settings.portfolio_hero_subtitle || 'Explore selected digital products, platforms, and technology solutions designed to help startups, businesses, and organizations scale with confidence.',
        portfolio_hero_primary_btn_text: settings.portfolio_hero_primary_btn_text || 'View Projects',
        portfolio_hero_secondary_btn_text: settings.portfolio_hero_secondary_btn_text || 'Start Your Project',
        portfolio_hero_secondary_btn_url: settings.portfolio_hero_secondary_btn_url || '/contact',
        portfolio_featured_badge: settings.portfolio_featured_badge || 'FEATURED PROJECTS',
        portfolio_featured_title: settings.portfolio_featured_title || 'Solutions Designed To Solve Real Problems.',
        portfolio_featured_subtitle: settings.portfolio_featured_subtitle || 'A selection of products and platforms built to improve operations, customer experiences, and business growth.',
      });

      if (settings.portfolio_hero_trust_items && settings.portfolio_hero_trust_items.length > 0) {
        setTrustItems(settings.portfolio_hero_trust_items);
      }
    }
  }, [settings, reset]);

  // Trust items CRUD
  const handleUpdateTrustItem = (index: number, val: string) => {
    const updated = [...trustItems];
    updated[index] = val;
    setTrustItems(updated);
    setItemsModified(true);
  };

  const handleAddTrustItem = () => {
    setTrustItems([...trustItems, 'New Engineering Guarantee']);
    setItemsModified(true);
  };

  const handleDeleteTrustItem = (index: number) => {
    setTrustItems(trustItems.filter((_, i) => i !== index));
    setItemsModified(true);
  };

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({
        id: settings.id,
        data: {
          portfolio_hero_badge: data.portfolio_hero_badge?.trim(),
          portfolio_hero_title: data.portfolio_hero_title?.trim(),
          portfolio_hero_subtitle: data.portfolio_hero_subtitle?.trim(),
          portfolio_hero_primary_btn_text: data.portfolio_hero_primary_btn_text?.trim(),
          portfolio_hero_secondary_btn_text: data.portfolio_hero_secondary_btn_text?.trim(),
          portfolio_hero_secondary_btn_url: data.portfolio_hero_secondary_btn_url?.trim(),
          portfolio_hero_trust_items: trustItems,
          portfolio_featured_badge: data.portfolio_featured_badge?.trim(),
          portfolio_featured_title: data.portfolio_featured_title?.trim(),
          portfolio_featured_subtitle: data.portfolio_featured_subtitle?.trim(),
        },
      });
      reset(data);
      setItemsModified(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="p-8 flex items-center justify-center">
        <LoadingState variant="spinner" />
      </div>
    );
  }

  const hasChanges = isDirty || itemsModified;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-text">Portfolio Page Hero Section</h2>
            <p className="text-sm text-secondary-text">
              Customize the top headline, value proposition, call-to-action buttons, and trust checkmarks on the Portfolio & Case Studies page.
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
          disabled={!hasChanges}
          variant="primary"
          className="shrink-0"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Live Card Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary-text">
            <Eye className="w-4 h-4 text-accent-primary" />
            Live Preview on Portfolio Page
          </div>

          <div className="p-8 rounded-2xl bg-surface-dark border border-border-primary text-white shadow-xl text-center flex flex-col items-center gap-4 relative overflow-hidden">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-border-primary text-[#D4A017] bg-[#121417]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
              {watchedBadge}
            </span>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white max-w-2xl leading-tight">
              {watchedTitle}
            </h3>

            <p className="text-xs sm:text-sm font-light text-slate-300 max-w-xl leading-relaxed">
              {watchedSubtitle}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#D4A017] text-[#0B0D0F] font-bold text-xs shadow-md">
                {watchedPrimaryBtn}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-border-primary text-slate-200 text-xs font-medium">
                {watchedSecondaryBtn}
              </div>
            </div>

            {trustItems.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 border-t border-border-primary text-[11px] text-slate-400">
                {trustItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#D4A017]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column Controls */}
          <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-border-primary pb-4">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <h3 className="text-base font-semibold text-primary-text">Hero Copy & Action Buttons</h3>
            </div>

            <Input
              label="Eyebrow Badge Tag"
              placeholder="e.g. OUR WORK"
              helperText="Pill capsule tag displayed above the headline"
              {...register('portfolio_hero_badge')}
            />

            <Input
              label="Primary Headline"
              placeholder="e.g. Products Built For Real Business Growth."
              helperText="The bold main headline of the portfolio page"
              {...register('portfolio_hero_title')}
            />

            <TextArea
              label="Supporting Description"
              rows={4}
              placeholder="Detailed subtitle introducing your case studies and products..."
              helperText="Subtitle narrative under the title"
              {...register('portfolio_hero_subtitle')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Button Text"
                placeholder="e.g. View Projects"
                {...register('portfolio_hero_primary_btn_text')}
              />
              <Input
                label="Secondary Button Text"
                placeholder="e.g. Start Your Project"
                {...register('portfolio_hero_secondary_btn_text')}
              />
            </div>

            <Input
              label="Secondary Button URL"
              placeholder="e.g. /contact"
              helperText="Destination link for secondary action"
              {...register('portfolio_hero_secondary_btn_url')}
            />
          </div>

          {/* Right Column Controls (Trust Checkmarks) */}
          <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border-primary pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4A017]" />
                <h3 className="text-base font-semibold text-primary-text">Trust Checkmark Items</h3>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddTrustItem}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Item
              </Button>
            </div>

            <p className="text-xs text-secondary-text">
              These checkmark points appear directly below the call-to-action buttons to build immediate credibility with visitors.
            </p>

            <div className="space-y-3">
              {trustItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4A017] shrink-0" />
                  <Input
                    className="flex-1"
                    value={item}
                    onChange={(e) => handleUpdateTrustItem(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteTrustItem(idx)}
                    className="p-2 rounded text-red-500 hover:bg-red-500/10"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Projects Grid Header Section */}
        <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-border-primary pb-4">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <div>
              <h3 className="text-base font-semibold text-primary-text">Featured Projects Grid Header</h3>
              <p className="text-xs text-secondary-text">
                Customize the headline and description text displayed above the project cards and category filter pills.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface-dark border border-border-primary text-center space-y-3">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full border border-border-primary text-[#D4A017] bg-[#121417]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
              {watchedFeaturedBadge}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {watchedFeaturedTitle}
            </h4>
            <p className="text-xs sm:text-sm font-light text-slate-300 max-w-lg mx-auto">
              {watchedFeaturedSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <Input
                label="Featured Section Badge"
                placeholder="e.g. FEATURED PROJECTS"
                helperText="Capsule tag above the title"
                {...register('portfolio_featured_badge')}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Featured Section Title"
                placeholder="e.g. Solutions Designed To Solve Real Problems."
                helperText="Headline above the project filters"
                {...register('portfolio_featured_title')}
              />
            </div>
          </div>

          <div>
            <TextArea
              label="Featured Section Subtitle"
              rows={3}
              placeholder="e.g. A selection of products and platforms built to improve operations..."
              helperText="Descriptive paragraph below the headline"
              {...register('portfolio_featured_subtitle')}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-primary">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              if (settings?.portfolio_hero_trust_items) setTrustItems(settings.portfolio_hero_trust_items);
              setItemsModified(false);
            }}
            disabled={!hasChanges || isSubmitting}
          >
            Discard Changes
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!hasChanges}
            variant="primary"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PortfolioHeroSettings;
