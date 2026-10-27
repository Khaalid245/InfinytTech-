import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { 
  Megaphone, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  ArrowRight,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import type { SiteSettings, CtaTimelineStep } from '../../../types/siteSettings.types';

const DEFAULT_STEPS: CtaTimelineStep[] = [
  { num: '1', title: 'Discovery Call', desc: 'We learn about your goals, requirements, and timeline.' },
  { num: '2', title: 'Product Assessment', desc: 'Our team evaluates scope, technical requirements, and opportunities.' },
  { num: '3', title: 'Roadmap & Proposal', desc: 'Receive a clear plan, timeline, and project estimate.' },
  { num: '4', title: 'Build & Scale', desc: 'Engineering scalable systems with continuous optimization and growth.' },
];

const DEFAULT_TRUST_POINTS: string[] = [
  'Secure cloud deployments',
  'Clear project roadmap',
  'Dedicated product team',
  'Long-term support available',
];

const CtaSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  const [steps, setSteps] = useState<CtaTimelineStep[]>(DEFAULT_STEPS);
  const [trustPoints, setTrustPoints] = useState<string[]>(DEFAULT_TRUST_POINTS);
  const [itemsModified, setItemsModified] = useState(false);

  const watchedBadge = watch('cta_badge') || "LET'S BUILD TOGETHER";
  const watchedTitle = watch('cta_title') || 'Ready to Work With a Long-Term Technology Partner?';
  const watchedDesc = watch('cta_description') || 'We partner with ambitious startups, businesses, and organizations to transform ideas into scalable digital products through strategy, engineering, and long-term collaboration.';
  const watchedPrimaryBtn = watch('cta_primary_btn_text') || 'Book a Free Discovery Call';
  const watchedPrimaryNote = watch('cta_primary_btn_note') || "No commitment required — we'll discuss your goals and recommend a path forward.";
  const watchedSecondaryBtn = watch('cta_secondary_btn_text') || 'or send us a project brief →';
  const watchedTimelineTitle = watch('cta_timeline_title') || 'How We Start Every Partnership';
  const watchedTimelineSubtitle = watch('cta_timeline_subtitle') || 'Our structured path from initial outreach to product scale.';

  useEffect(() => {
    if (settings) {
      reset({
        cta_badge: settings.cta_badge || "LET'S BUILD TOGETHER",
        cta_title: settings.cta_title || 'Ready to Work With a Long-Term Technology Partner?',
        cta_description: settings.cta_description || 'We partner with ambitious startups, businesses, and organizations to transform ideas into scalable digital products through strategy, engineering, and long-term collaboration.',
        cta_primary_btn_text: settings.cta_primary_btn_text || 'Book a Free Discovery Call',
        cta_primary_btn_note: settings.cta_primary_btn_note || "No commitment required — we'll discuss your goals and recommend a path forward.",
        cta_secondary_btn_text: settings.cta_secondary_btn_text || 'or send us a project brief →',
        cta_secondary_btn_url: settings.cta_secondary_btn_url || '/contact',
        cta_timeline_title: settings.cta_timeline_title || 'How We Start Every Partnership',
        cta_timeline_subtitle: settings.cta_timeline_subtitle || 'Our structured path from initial outreach to product scale.',
      });

      if (settings.cta_timeline_steps && settings.cta_timeline_steps.length > 0) {
        setSteps(settings.cta_timeline_steps);
      }
      if (settings.cta_trust_points && settings.cta_trust_points.length > 0) {
        setTrustPoints(settings.cta_trust_points);
      }
    }
  }, [settings, reset]);

  // Steps CRUD
  const handleUpdateStep = (index: number, field: keyof CtaTimelineStep, val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    setSteps(updated);
    setItemsModified(true);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        num: `${steps.length + 1}`,
        title: 'New Phase',
        desc: 'Describe this phase of the client onboarding roadmap.',
      },
    ]);
    setItemsModified(true);
  };

  const handleDeleteStep = (index: number) => {
    const filtered = steps.filter((_, i) => i !== index);
    const renumbered = filtered.map((st, i) => ({ ...st, num: `${i + 1}` }));
    setSteps(renumbered);
    setItemsModified(true);
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    const renumbered = updated.map((st, i) => ({ ...st, num: `${i + 1}` }));
    setSteps(renumbered);
    setItemsModified(true);
  };

  // Trust Points CRUD
  const handleUpdateTrustPoint = (index: number, val: string) => {
    const updated = [...trustPoints];
    updated[index] = val;
    setTrustPoints(updated);
    setItemsModified(true);
  };

  const handleAddTrustPoint = () => {
    setTrustPoints([...trustPoints, 'New trust guarantee or SLA']);
    setItemsModified(true);
  };

  const handleDeleteTrustPoint = (index: number) => {
    setTrustPoints(trustPoints.filter((_, i) => i !== index));
    setItemsModified(true);
  };

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({
        id: settings.id,
        data: {
          cta_badge: data.cta_badge?.trim(),
          cta_title: data.cta_title?.trim(),
          cta_description: data.cta_description?.trim(),
          cta_primary_btn_text: data.cta_primary_btn_text?.trim(),
          cta_primary_btn_note: data.cta_primary_btn_note?.trim(),
          cta_secondary_btn_text: data.cta_secondary_btn_text?.trim(),
          cta_secondary_btn_url: data.cta_secondary_btn_url?.trim(),
          cta_timeline_title: data.cta_timeline_title?.trim(),
          cta_timeline_subtitle: data.cta_timeline_subtitle?.trim(),
          cta_timeline_steps: steps,
          cta_trust_points: trustPoints,
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
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-text">Call To Action & Partnership Roadmap</h2>
            <p className="text-sm text-secondary-text">
              Manage the bottom interactive conversion section and onboarding timeline displayed across the About, Home, and Services pages.
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
            Live Preview on Public Website
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-surface-dark border border-border-primary text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Preview */}
              <div className="lg:col-span-6 flex flex-col items-start text-left gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-border-primary text-[#D4A017] bg-[#121417]">
                  {watchedBadge}
                </span>
                <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
                  {watchedTitle}
                </h3>
                <p className="text-xs font-light text-slate-300 leading-relaxed">
                  {watchedDesc}
                </p>
                <div className="space-y-2 pt-2">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D4A017] text-[#0B0D0F] font-bold text-xs shadow-md">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    {watchedPrimaryBtn}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[10px] text-slate-400">{watchedPrimaryNote}</p>
                  <p className="text-xs text-slate-300 underline cursor-pointer">{watchedSecondaryBtn}</p>
                </div>
              </div>

              {/* Right Preview */}
              <div className="lg:col-span-6 p-5 rounded-xl border border-border-primary bg-[#0B0D0F]">
                <h4 className="text-sm font-bold text-white mb-1">{watchedTimelineTitle}</h4>
                <p className="text-[10px] text-slate-400 mb-4">{watchedTimelineSubtitle}</p>
                
                <div className="space-y-3">
                  {steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full border border-[#D4A017] text-[#D4A017] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {st.num}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-white">{st.title}</p>
                        <p className="text-[10px] text-slate-300">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {trustPoints.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border-primary grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                    {trustPoints.map((tp, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{tp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column Controls */}
          <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-border-primary pb-4">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <h3 className="text-base font-semibold text-primary-text">CTA Copy & Action Buttons</h3>
            </div>

            <Input
              label="Eyebrow Tag"
              placeholder="e.g. LET'S BUILD TOGETHER"
              helperText="Small capsule badge displayed above the title"
              {...register('cta_badge')}
            />

            <Input
              label="Section Headline"
              placeholder="e.g. Ready to Work With a Long-Term Technology Partner?"
              helperText="Primary bold headline"
              {...register('cta_title')}
            />

            <TextArea
              label="Supporting Narrative"
              rows={3}
              placeholder="Detailed description inviting partnership..."
              helperText="Paragraph text below the title"
              {...register('cta_description')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Button Text"
                placeholder="e.g. Book a Free Discovery Call"
                {...register('cta_primary_btn_text')}
              />
              <Input
                label="Primary Button Micro-Note"
                placeholder="e.g. No commitment required..."
                {...register('cta_primary_btn_note')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Secondary Button Text"
                placeholder="e.g. or send us a project brief →"
                {...register('cta_secondary_btn_text')}
              />
              <Input
                label="Secondary Button URL"
                placeholder="e.g. /contact"
                {...register('cta_secondary_btn_url')}
              />
            </div>
          </div>

          {/* Right Column Controls (Roadmap Steps & Trust Points) */}
          <div className="space-y-6">
            {/* Timeline Header */}
            <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-accent-primary" />
                  <h3 className="text-base font-semibold text-primary-text">Partnership Roadmap Steps</h3>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddStep}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Step
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Roadmap Card Title"
                  placeholder="e.g. How We Start Every Partnership"
                  {...register('cta_timeline_title')}
                />
                <Input
                  label="Roadmap Subtitle"
                  placeholder="e.g. Our structured path..."
                  {...register('cta_timeline_subtitle')}
                />
              </div>

              {/* Steps List */}
              <div className="space-y-4">
                {steps.map((st, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border-primary bg-surface-dark/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-accent-primary/10 text-accent-primary text-xs font-bold flex items-center justify-center border border-accent-primary/20">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-primary-text">Phase {idx + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStep(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-secondary-text hover:text-primary-text disabled:opacity-30"
                          title="Move up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStep(idx, 'down')}
                          disabled={idx === steps.length - 1}
                          className="p-1 rounded text-secondary-text hover:text-primary-text disabled:opacity-30"
                          title="Move down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStep(idx)}
                          className="p-1 rounded text-red-500 hover:bg-red-500/10"
                          title="Delete step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <Input
                      label="Step Title"
                      value={st.title}
                      onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                    />
                    <TextArea
                      label="Step Description"
                      rows={2}
                      value={st.desc}
                      onChange={(e) => handleUpdateStep(idx, 'desc', e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Checklist Points */}
            <div className="bg-surface-light border border-border-primary rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border-primary pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-base font-semibold text-primary-text">Trust Guarantees & Checklist</h3>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddTrustPoint}
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Bullet
                </Button>
              </div>

              <div className="space-y-3">
                {trustPoints.map((tp, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <Input
                      className="flex-1"
                      value={tp}
                      onChange={(e) => handleUpdateTrustPoint(idx, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteTrustPoint(idx)}
                      className="p-2 rounded text-red-500 hover:bg-red-500/10"
                      title="Remove guarantee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-primary">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              if (settings?.cta_timeline_steps) setSteps(settings.cta_timeline_steps);
              if (settings?.cta_trust_points) setTrustPoints(settings.cta_trust_points);
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

export default CtaSettings;
