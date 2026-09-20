import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import Select from '../../../components/ui/Select';
import { Plus, Trash2, Layers, Sparkles, MoveUp, MoveDown } from 'lucide-react';
import type { SiteSettings, DifferentiatorItem, CoreValueItem } from '../../../types/siteSettings.types';

const AVAILABLE_ICONS = [
  { value: 'Target', label: 'Target / Focus' },
  { value: 'BadgeCheck', label: 'Badge Check / Verified' },
  { value: 'ShieldCheck', label: 'Shield Check / Security' },
  { value: 'Handshake', label: 'Handshake / Partnership' },
  { value: 'MessageSquare', label: 'Message / Communication' },
  { value: 'Globe', label: 'Globe / International' },
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

const DEFAULT_CORE_VALUES: CoreValueItem[] = [
  { id: '01', title: 'Excellence', desc: 'We hold ourselves to the highest standards, ensuring every solution we deliver is durable, reliable, and crafted with meticulous attention to detail.', icon: 'Award' },
  { id: '02', title: 'Ownership', desc: 'We approach every project with the mindset of a founder, taking full responsibility for the outcomes and long-term success of the partners we serve.', icon: 'ShieldCheck' },
  { id: '03', title: 'Transparency', desc: 'We build trust through honest, open, and clear communication, keeping our partners fully aligned and informed at every stage.', icon: 'Globe' },
  { id: '04', title: 'Innovation', desc: 'We challenge conventional approaches and continuously seek better ways to solve meaningful problems.', icon: 'Sparkles' },
  { id: '05', title: 'Collaboration', desc: 'We work as an extension of your team, aligning our goals with yours to build strong, unified partnerships that amplify our collective impact.', icon: 'Users' },
  { id: '06', title: 'Continuous Learning', desc: 'We remain perpetually curious, constantly expanding our knowledge and adapting to new paradigms to deliver future-ready solutions.', icon: 'BookOpen' },
];

const GeneralSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  // Local card state
  const [differentiators, setDifferentiators] = useState<DifferentiatorItem[]>(DEFAULT_DIFFERENTIATORS);
  const [coreValues, setCoreValues] = useState<CoreValueItem[]>(DEFAULT_CORE_VALUES);
  const [cardsModified, setCardsModified] = useState(false);

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
        mission_title: settings.mission_title || 'Our Mission',
        mission_statement: settings.mission_statement || '',
        vision_title: settings.vision_title || 'Our Vision',
        vision_statement: settings.vision_statement || '',
        why_choose_us_title: settings.why_choose_us_title || 'What Makes Us Different',
        why_choose_us_subtitle: settings.why_choose_us_subtitle || '',
      });

      if (settings.differentiators && settings.differentiators.length > 0) {
        setDifferentiators(settings.differentiators);
      }
      if (settings.core_values && settings.core_values.length > 0) {
        setCoreValues(settings.core_values);
      }
    }
  }, [settings, reset]);

  // Differentiator CRUD
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

  // Core Values CRUD
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
        title: 'New Principle',
        desc: 'Describe how this foundation guides decisions and execution standards.',
        icon: 'Award',
      },
    ]);
    setCardsModified(true);
  };

  const handleDeleteCoreValue = (index: number) => {
    setCoreValues(coreValues.filter((_, i) => i !== index));
    setCardsModified(true);
  };

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      const payload: Partial<SiteSettings> = {
        ...data,
        differentiators,
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-primary-text">General Settings & Content CMS</h2>
          <p className="text-sm text-secondary-text">Update your core business information, strategic mission, and homepage differentiator cards.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
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

        {/* ─── Differentiator Cards (What Makes Us Different) ─── */}
        <div className="pt-6 border-t border-border-primary space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-gold" />
                What Makes Us Different (Differentiator Cards)
              </h3>
              <p className="text-xs text-secondary-text mt-0.5">
                Manage the 6 dynamic cards displayed on the Homepage and About page. Add, edit, reorder or delete cards.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddDifferentiator}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Section Title" 
              {...register('why_choose_us_title')} 
            />
            <Input 
              label="Section Subtitle (Optional)" 
              {...register('why_choose_us_subtitle')} 
            />
          </div>

          <div className="space-y-4 pt-2">
            {differentiators.map((card, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl border border-border-primary bg-surface-light dark:bg-surface-dark space-y-3 transition-all"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border-primary">
                  <span className="text-xs font-bold text-primary-text uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {card.title || 'Untitled Card'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveDifferentiator(idx, 'up')}
                      title="Move Up"
                      className="p-1 rounded hover:bg-border-primary text-secondary-text disabled:opacity-30 cursor-pointer"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === differentiators.length - 1}
                      onClick={() => handleMoveDifferentiator(idx, 'down')}
                      title="Move Down"
                      className="p-1 rounded hover:bg-border-primary text-secondary-text disabled:opacity-30 cursor-pointer"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDifferentiator(idx)}
                      title="Delete Card"
                      className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-caption text-secondary-text block">Card Icon</label>
                    <select
                      value={card.icon}
                      onChange={(e) => handleUpdateDifferentiator(idx, 'icon', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border-primary bg-primary-bg text-primary-text outline-none focus:border-brand-gold cursor-pointer"
                    >
                      {AVAILABLE_ICONS.map((ico) => (
                        <option key={ico.value} value={ico.value}>
                          {ico.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-caption text-secondary-text block">Card Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateDifferentiator(idx, 'title', e.target.value)}
                      placeholder="e.g. Quality Engineering"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border-primary bg-primary-bg text-primary-text outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-caption text-secondary-text block">Card Description</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => handleUpdateDifferentiator(idx, 'description', e.target.value)}
                    placeholder="Describe this differentiator..."
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border-primary bg-primary-bg text-primary-text outline-none focus:border-brand-gold leading-relaxed resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Mission & Vision Statements ─── */}
        <div className="pt-6 border-t border-border-primary space-y-4">
          <div>
            <h3 className="text-base font-semibold text-primary-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Mission & Vision Statements
            </h3>
            <p className="text-xs text-secondary-text">Displayed dynamically in the About page Mission, Vision & Values section.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Input 
                label="Mission Heading" 
                {...register('mission_title')} 
              />
              <TextArea 
                label="Mission Statement" 
                {...register('mission_statement')} 
                rows={3} 
              />
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              <Input 
                label="Vision Heading" 
                {...register('vision_title')} 
              />
              <TextArea 
                label="Vision Statement" 
                {...register('vision_statement')} 
                rows={3} 
              />
            </div>
          </div>
        </div>

        {/* ─── Core Values Cards ─── */}
        <div className="pt-6 border-t border-border-primary space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-primary-text">Core Values Cards</h3>
              <p className="text-xs text-secondary-text">The 6 principle cards rendered under the Values tab on the About page.</p>
            </div>
            <button
              type="button"
              onClick={handleAddCoreValue}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/20 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Value
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coreValues.map((val, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl border border-border-primary bg-surface-light dark:bg-surface-dark space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border-primary">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={val.id}
                      onChange={(e) => handleUpdateCoreValue(idx, 'id', e.target.value)}
                      placeholder="01"
                      className="w-12 px-2 py-1 text-center font-mono text-xs rounded border border-border-primary bg-primary-bg font-bold text-brand-gold"
                    />
                    <span className="text-xs font-bold text-primary-text">{val.title || 'Untitled Value'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCoreValue(idx)}
                    title="Delete Value"
                    className="p-1 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-caption text-secondary-text block">Icon</label>
                    <select
                      value={val.icon}
                      onChange={(e) => handleUpdateCoreValue(idx, 'icon', e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-border-primary bg-primary-bg text-primary-text outline-none"
                    >
                      {AVAILABLE_ICONS.map((ico) => (
                        <option key={ico.value} value={ico.value}>{ico.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-caption text-secondary-text block">Title</label>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => handleUpdateCoreValue(idx, 'title', e.target.value)}
                      className="w-full px-2 py-1 text-xs rounded border border-border-primary bg-primary-bg text-primary-text outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-caption text-secondary-text block">Description</label>
                  <textarea
                    rows={2}
                    value={val.desc}
                    onChange={(e) => handleUpdateCoreValue(idx, 'desc', e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded border border-border-primary bg-primary-bg text-primary-text outline-none resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
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
            disabled={!isDirty && !cardsModified}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;
