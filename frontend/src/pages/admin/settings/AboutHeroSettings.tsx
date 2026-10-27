import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { Plus, Trash2, Sparkles, MoveUp, MoveDown, BookOpen, BarChart3, CheckCircle2 } from 'lucide-react';
import type { SiteSettings, AboutHeroMetric, ManifestoItem } from '../../../types/siteSettings.types';

const DEFAULT_METRICS: AboutHeroMetric[] = [
  { val: 'Top 1.5%', label: 'Elite Developer Select' },
  { val: 'Silicon Valley', label: 'Standards Workflow' },
  { val: 'Sovereign', label: 'Scale Infrastructure' },
];

const DEFAULT_MANIFESTO: ManifestoItem[] = [
  { title: 'Built in Africa', desc: "Powered by the continent's top technical minds." },
  { title: 'Designed for the World', desc: 'Engineered to compete in Palo Alto, London, and Tokyo.' },
  { title: 'Business First', desc: 'Delivering measurable commercial impact, not just lines of code.' },
  { title: 'Engineering Excellence', desc: 'Strict compilation audits and zero technical debt guarantees.' },
  { title: 'Long-Term Partnership', desc: 'Committed to active scaling, cloud support, and lasting SLAs.' },
];

const AboutHeroSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const [metrics, setMetrics] = useState<AboutHeroMetric[]>(DEFAULT_METRICS);
  const [manifesto, setManifesto] = useState<ManifestoItem[]>(DEFAULT_MANIFESTO);
  const [cardsModified, setCardsModified] = useState(false);

  useEffect(() => {
    if (settings) {
      reset({
        about_hero_badge: settings.about_hero_badge || "LET'S BUILD TOGETHER",
        about_hero_title: settings.about_hero_title || 'Building the Future of Digital Innovation from Africa.',
        about_hero_description: settings.about_hero_description || 'We partner with ambitious startups, enterprises, and organizations to design, engineer, and scale world-class digital products.',
      });

      if (settings.about_hero_metrics && settings.about_hero_metrics.length > 0) {
        setMetrics(settings.about_hero_metrics);
      }
      if (settings.about_manifesto && settings.about_manifesto.length > 0) {
        setManifesto(settings.about_manifesto);
      }
    }
  }, [settings, reset]);

  // Metrics CRUD
  const handleUpdateMetric = (index: number, field: keyof AboutHeroMetric, value: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
    setCardsModified(true);
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { val: '99.9%', label: 'Uptime Reliability' }]);
    setCardsModified(true);
  };

  const handleDeleteMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
    setCardsModified(true);
  };

  // Manifesto CRUD
  const handleUpdateManifesto = (index: number, field: keyof ManifestoItem, value: string) => {
    const updated = [...manifesto];
    updated[index] = { ...updated[index], [field]: value };
    setManifesto(updated);
    setCardsModified(true);
  };

  const handleAddManifesto = () => {
    setManifesto([
      ...manifesto,
      {
        title: 'New Pillar of Excellence',
        desc: 'Describe this commitment to architectural integrity, client velocity, or sovereign scaling.',
      },
    ]);
    setCardsModified(true);
  };

  const handleDeleteManifesto = (index: number) => {
    setManifesto(manifesto.filter((_, i) => i !== index));
    setCardsModified(true);
  };

  const handleMoveManifesto = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === manifesto.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...manifesto];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setManifesto(updated);
    setCardsModified(true);
  };

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      const payload: Partial<SiteSettings> = {
        about_hero_badge: data.about_hero_badge,
        about_hero_title: data.about_hero_title,
        about_hero_description: data.about_hero_description,
        about_hero_metrics: metrics,
        about_manifesto: manifesto,
      };
      await updateSettings.mutateAsync({ id: settings.id, data: payload });
      reset(data);
      setCardsModified(false);
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-primary pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-bold text-primary-text">About Hero & The Manifesto</h2>
          </div>
          <p className="text-sm text-secondary-text">
            Manage the top hero narrative, key strategic metrics, and the 5-point Manifesto creed displayed at the top of the public About page.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live DB Sync
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 max-w-4xl">
        {/* ─── 1. Hero Narrative & Eyebrow ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <h3 className="text-base font-semibold text-primary-text">Hero Strategic Narrative</h3>
          </div>

          <div className="space-y-4 bg-surface-muted/30 p-5 rounded-2xl border border-border-primary/60">
            <Input 
              label="Eyebrow Capsule Tag" 
              {...register('about_hero_badge')} 
              placeholder="e.g. LET'S BUILD TOGETHER"
            />
            <Input 
              label="Main Headline" 
              {...register('about_hero_title')} 
              placeholder="e.g. Building the Future of Digital Innovation from Africa."
            />
            <TextArea 
              label="Strategic Paragraph Description" 
              {...register('about_hero_description')} 
              placeholder="Describe your organization's mission and engineering approach..."
              rows={3} 
            />
          </div>
        </div>

        {/* ─── 2. Key Hero Metrics ─── */}
        <div className="space-y-4 pt-6 border-t border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-gold" />
                Key Hero Metrics ({metrics.length})
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                The highlighted stat counters rendered directly under the strategic paragraph.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMetric}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Metric
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl border border-border-primary bg-surface-muted/20 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-brand-gold font-bold">
                    Metric 0{idx + 1}
                  </span>
                  {metrics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMetric(idx)}
                      className="p-1 rounded text-secondary-text hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Metric"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <Input 
                  label="Value" 
                  value={metric.val} 
                  onChange={(e) => handleUpdateMetric(idx, 'val', e.target.value)}
                  placeholder="e.g. Top 1.5%"
                />
                <Input 
                  label="Label" 
                  value={metric.label} 
                  onChange={(e) => handleUpdateMetric(idx, 'label', e.target.value)}
                  placeholder="e.g. Elite Developer Select"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ─── 3. The Manifesto Cards ─── */}
        <div className="space-y-6 pt-6 border-t border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-gold" />
                The Manifesto Creed Cards ({manifesto.length})
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                The numbered creed cards displayed in the right column of the About page hero.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddManifesto}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Creed Item
            </button>
          </div>

          <div className="space-y-4">
            {manifesto.map((item, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-border-primary bg-surface-muted/20 hover:border-border-secondary transition-colors space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border-primary/50">
                  <span className="text-xs font-mono font-bold text-brand-gold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px]">
                      0{idx + 1}
                    </span>
                    {item.title || `Creed 0${idx + 1}`}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveManifesto(idx, 'up')}
                      className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-secondary-text disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === manifesto.length - 1}
                      onClick={() => handleMoveManifesto(idx, 'down')}
                      className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-secondary-text disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteManifesto(idx)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                      title="Delete Creed Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Input 
                  label="Title" 
                  value={item.title} 
                  onChange={(e) => handleUpdateManifesto(idx, 'title', e.target.value)}
                  placeholder="e.g. Built in Africa, Designed for the World"
                />

                <TextArea 
                  label="Description" 
                  value={item.desc} 
                  onChange={(e) => handleUpdateManifesto(idx, 'desc', e.target.value)}
                  placeholder="Describe this pillar of your manifesto..."
                  rows={2} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-border-primary sticky bottom-0 bg-surface-light/95 backdrop-blur-md py-4 z-10">
          <div className="text-xs text-secondary-text">
            {cardsModified || isDirty ? (
              <span className="text-brand-gold font-medium">You have unsaved changes</span>
            ) : (
              <span>All changes synchronized with backend</span>
            )}
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isSubmitting}
            disabled={!isDirty && !cardsModified}
          >
            Save About Hero & Manifesto
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AboutHeroSettings;
