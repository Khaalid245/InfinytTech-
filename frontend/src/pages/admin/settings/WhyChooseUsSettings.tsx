import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import Select from '../../../components/ui/Select';
import { Plus, Trash2, Layers, MoveUp, MoveDown, Award, CheckCircle2 } from 'lucide-react';
import type { SiteSettings, DifferentiatorItem } from '../../../types/siteSettings.types';

const AVAILABLE_ICONS = [
  { value: 'Target', label: 'Target / Focus & ROI' },
  { value: 'BadgeCheck', label: 'Badge Check / Verified' },
  { value: 'ShieldCheck', label: 'Shield Check / Security' },
  { value: 'Handshake', label: 'Handshake / Partnership' },
  { value: 'MessageSquare', label: 'Message / Communication' },
  { value: 'Globe', label: 'Globe / International & Standards' },
  { value: 'Award', label: 'Award / Excellence' },
  { value: 'Sparkles', label: 'Sparkles / AI & Innovation' },
  { value: 'Users', label: 'Users / Team & Collaboration' },
  { value: 'BookOpen', label: 'Book / Continuous Learning' },
  { value: 'CheckCircle', label: 'Check Circle / Quality' },
  { value: 'Zap', label: 'Zap / Speed & Performance' },
];

const DEFAULT_DIFFERENTIATORS: DifferentiatorItem[] = [
  {
    icon: 'Target',
    stat: 'Business-First',
    title: 'Business-First Thinking',
    description: 'Every technical decision is evaluated against business goals, helping organizations invest in technology that creates measurable value.',
  },
  {
    icon: 'BadgeCheck',
    stat: 'Product Ownership',
    title: 'Product Ownership',
    description: 'We go beyond implementation by identifying risks, uncovering opportunities, and helping shape stronger product decisions.',
  },
  {
    icon: 'MessageSquare',
    stat: 'Transparency',
    title: 'Transparent Communication',
    description: 'Clear milestones, regular updates, and open collaboration ensure complete visibility throughout the engagement.',
  },
  {
    icon: 'ShieldCheck',
    stat: 'Quality Engineering',
    title: 'Quality Engineering',
    description: 'Built with maintainability, performance, security, and scalability to support long-term business growth.',
  },
  {
    icon: 'Handshake',
    stat: 'Partnership',
    title: 'Long-Term Partnership',
    description: 'Our relationship continues after launch through optimization, support, and strategic guidance as products evolve.',
  },
  {
    icon: 'Globe',
    stat: 'Standards',
    title: 'Global Standards',
    description: 'We apply internationally recognized engineering practices and delivery standards to every project we undertake.',
  },
];

const WhyChooseUsSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const [differentiators, setDifferentiators] = useState<DifferentiatorItem[]>(DEFAULT_DIFFERENTIATORS);
  const [cardsModified, setCardsModified] = useState(false);

  useEffect(() => {
    if (settings) {
      reset({
        why_choose_us_title: settings.why_choose_us_title || 'What Makes Us Different',
        why_choose_us_subtitle: settings.why_choose_us_subtitle || '',
      });

      if (settings.differentiators && settings.differentiators.length > 0) {
        setDifferentiators(settings.differentiators);
      }
    }
  }, [settings, reset]);

  const handleUpdateDifferentiator = (index: number, field: keyof DifferentiatorItem, value: string) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], [field]: value };
    setDifferentiators(updated);
    setCardsModified(true);
  };

  const handleAddDifferentiator = () => {
    setDifferentiators([
      ...differentiators,
      {
        icon: 'Sparkles',
        stat: 'New Advantage',
        title: 'New Value Differentiator',
        description: 'Describe how this capability provides high-impact value to client outcomes.',
      },
    ]);
    setCardsModified(true);
  };

  const handleDeleteDifferentiator = (index: number) => {
    setDifferentiators(differentiators.filter((_, i) => i !== index));
    setCardsModified(true);
  };

  const handleMoveDifferentiator = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === differentiators.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...differentiators];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setDifferentiators(updated);
    setCardsModified(true);
  };

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      const payload: Partial<SiteSettings> = {
        why_choose_us_title: data.why_choose_us_title,
        why_choose_us_subtitle: data.why_choose_us_subtitle,
        differentiators,
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
            <Award className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-bold text-primary-text">Why Choose Us (Differentiator Cards)</h2>
          </div>
          <p className="text-sm text-secondary-text">
            Manage the headline copy and the 6 dynamic differentiator cards displayed on the public Homepage and About page.
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
        {/* ─── Section Header Copy ─── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-gold" />
            <h3 className="text-base font-semibold text-primary-text">Section Titles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-muted/30 p-5 rounded-2xl border border-border-primary/60">
            <Input 
              label="Section Main Title" 
              {...register('why_choose_us_title')} 
              placeholder="e.g. What Makes Us Different / Why Industry Leaders Choose Us"
            />
            <Input 
              label="Section Subtitle / Eyebrow (Optional)" 
              {...register('why_choose_us_subtitle')} 
              placeholder="e.g. Engineered for measurable commercial impact and reliability"
            />
          </div>
        </div>

        {/* ─── Differentiator Cards Builder ─── */}
        <div className="space-y-6 pt-6 border-t border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold" />
                Differentiator Cards ({differentiators.length})
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                Add, edit, reorder or delete cards. Each card automatically receives hover backlight and golden accents.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDifferentiator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Differentiator Card
            </button>
          </div>

          <div className="space-y-4">
            {differentiators.map((card, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-border-primary bg-surface-muted/20 hover:border-border-secondary transition-colors space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border-primary/50">
                  <span className="text-xs font-mono font-bold text-brand-gold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {card.title ? card.title.toUpperCase() : `CARD ${idx + 1}`}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveDifferentiator(idx, 'up')}
                      className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-secondary-text disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === differentiators.length - 1}
                      onClick={() => handleMoveDifferentiator(idx, 'down')}
                      className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-secondary-text disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDifferentiator(idx)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select 
                    label="Card Icon" 
                    value={card.icon} 
                    onChange={(e) => handleUpdateDifferentiator(idx, 'icon', e.target.value)}
                    options={AVAILABLE_ICONS}
                  />
                  <div className="sm:col-span-2">
                    <Input 
                      label="Card Title" 
                      value={card.title} 
                      onChange={(e) => handleUpdateDifferentiator(idx, 'title', e.target.value)}
                      placeholder="e.g. Enterprise-First Strategy"
                    />
                  </div>
                </div>

                <TextArea 
                  label="Card Description" 
                  value={card.description} 
                  onChange={(e) => handleUpdateDifferentiator(idx, 'description', e.target.value)}
                  placeholder="Describe the impact and benefit of this differentiator..."
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
            Save Differentiator Cards
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WhyChooseUsSettings;
