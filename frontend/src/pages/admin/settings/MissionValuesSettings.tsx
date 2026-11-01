import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import Select from '../../../components/ui/Select';
import { Plus, Trash2, Target, MoveUp, MoveDown, Compass, CheckCircle2 } from 'lucide-react';
import type { SiteSettings, CoreValueItem } from '../../../types/siteSettings.types';

const AVAILABLE_ICONS = [
  { value: 'Award', label: 'Award / Excellence' },
  { value: 'ShieldCheck', label: 'Shield Check / Trust & Security' },
  { value: 'Globe', label: 'Globe / International & Transparency' },
  { value: 'Sparkles', label: 'Sparkles / Innovation & AI' },
  { value: 'Users', label: 'Users / Team & Collaboration' },
  { value: 'BookOpen', label: 'Book / Continuous Learning' },
  { value: 'Target', label: 'Target / Focus & Goals' },
  { value: 'Eye', label: 'Eye / Vision' },
  { value: 'Compass', label: 'Compass / Guidance' },
  { value: 'BadgeCheck', label: 'Badge Check / Quality' },
  { value: 'CheckCircle', label: 'Check Circle / Reliability' },
  { value: 'Lightbulb', label: 'Lightbulb / Ideas' },
  { value: 'Heart', label: 'Heart / Passion' },
  { value: 'Zap', label: 'Zap / Speed & Velocity' },
];

const DEFAULT_CORE_VALUES: CoreValueItem[] = [
  { id: '01', title: 'Excellence', desc: 'We hold ourselves to the highest standards, ensuring every solution we deliver is durable, reliable, and crafted with meticulous attention to detail.', icon: 'Award' },
  { id: '02', title: 'Ownership', desc: 'We approach every project with the mindset of a founder, taking full responsibility for the outcomes and long-term success of the partners we serve.', icon: 'ShieldCheck' },
  { id: '03', title: 'Transparency', desc: 'We build trust through honest, open, and clear communication, keeping our partners fully aligned and informed at every stage.', icon: 'Globe' },
  { id: '04', title: 'Innovation', desc: 'We challenge conventional approaches and continuously seek better ways to solve meaningful problems.', icon: 'Sparkles' },
  { id: '05', title: 'Collaboration', desc: 'We work as an extension of your team, aligning our goals with yours to build strong, unified partnerships that amplify our collective impact.', icon: 'Users' },
  { id: '06', title: 'Continuous Learning', desc: 'We remain perpetually curious, constantly expanding our knowledge and adapting to new paradigms to deliver future-ready solutions.', icon: 'BookOpen' },
];

const MissionValuesSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const [coreValues, setCoreValues] = useState<CoreValueItem[]>(DEFAULT_CORE_VALUES);
  const [cardsModified, setCardsModified] = useState(false);

  useEffect(() => {
    if (settings) {
      reset({
        mission_title: settings.mission_title || 'Our Mission',
        mission_statement: settings.mission_statement || '',
        vision_title: settings.vision_title || 'Our Vision',
        vision_statement: settings.vision_statement || '',
      });

      if (settings.core_values && settings.core_values.length > 0) {
        setCoreValues(settings.core_values);
      }
    }
  }, [settings, reset]);

  const handleUpdateCoreValue = (index: number, field: keyof CoreValueItem, value: string) => {
    const updated = [...coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setCoreValues(updated);
    setCardsModified(true);
  };

  const handleAddCoreValue = () => {
    const nextId = String(coreValues.length + 1).padStart(2, '0');
    setCoreValues([
      ...coreValues,
      {
        id: nextId,
        title: 'New Value / Principle',
        desc: 'Describe how this foundation guides engineering standards, team culture, and partner success.',
        icon: 'Award',
      },
    ]);
    setCardsModified(true);
  };

  const handleDeleteCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
    setCardsModified(true);
  };

  const handleMoveCoreValue = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === coreValues.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...coreValues];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCoreValues(updated);
    setCardsModified(true);
  };

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      const payload: Partial<SiteSettings> = {
        mission_title: data.mission_title,
        mission_statement: data.mission_statement,
        vision_title: data.vision_title,
        vision_statement: data.vision_statement,
        core_values: coreValues,
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
            <Compass className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl font-bold text-primary-text">Mission, Vision & Core Values</h2>
          </div>
          <p className="text-sm text-secondary-text">
            Manage your company's strategic mission statement, future vision, and foundational core value cards displayed on the public About page.
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
        {/* ─── Mission & Vision Statements ─── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-brand-gold" />
            <h3 className="text-base font-semibold text-primary-text">Strategic Statements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-muted/30 p-5 rounded-2xl border border-border-primary/60">
            <div className="space-y-4">
              <Input 
                label="Mission Title" 
                {...register('mission_title')} 
                placeholder="e.g. Our Mission"
              />
              <TextArea 
                label="Mission Statement" 
                {...register('mission_statement')} 
                placeholder="Describe your organization's core purpose and commitment..."
                rows={4} 
              />
            </div>

            <div className="space-y-4">
              <Input 
                label="Vision Title" 
                {...register('vision_title')} 
                placeholder="e.g. Our Vision"
              />
              <TextArea 
                label="Vision Statement" 
                {...register('vision_statement')} 
                placeholder="Describe where your company is headed and its long-term global impact..."
                rows={4} 
              />
            </div>
          </div>
        </div>

        {/* ─── Core Values Card Builder ─── */}
        <div className="space-y-6 pt-6 border-t border-border-primary">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-gold" />
                Core Value Cards ({coreValues.length})
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                Add, edit, reorder, or delete the principles shown in the 6-pillar grid on the About page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCoreValue}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Value Card
            </button>
          </div>

          <div className="space-y-4">
            {coreValues.map((val, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl border border-border-primary bg-surface-muted/20 hover:border-border-secondary transition-colors space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border-primary/50">
                  <span className="text-xs font-mono font-bold text-brand-gold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-gold/10 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {val.title || `Value ${idx + 1}`}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveCoreValue(idx, 'up')}
                      className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-secondary-text disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Up"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === coreValues.length - 1}
                      onClick={() => handleMoveCoreValue(idx, 'down')}
                      className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-secondary-text disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                      title="Move Down"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoreValue(idx)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                      title="Delete Value Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Select 
                    label="Icon" 
                    value={val.icon} 
                    onChange={(e) => handleUpdateCoreValue(idx, 'icon', e.target.value)}
                    options={AVAILABLE_ICONS}
                  />
                  <div className="sm:col-span-2">
                    <Input 
                      label="Principle Title" 
                      value={val.title} 
                      onChange={(e) => handleUpdateCoreValue(idx, 'title', e.target.value)}
                      placeholder="e.g. Excellence, Ownership, Innovation"
                    />
                  </div>
                </div>

                <TextArea 
                  label="Description" 
                  value={val.desc} 
                  onChange={(e) => handleUpdateCoreValue(idx, 'desc', e.target.value)}
                  placeholder="Describe this core value..."
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
            Save Mission & Values
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MissionValuesSettings;
