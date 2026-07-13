import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import TextArea from '../../../components/ui/TextArea';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import type { SiteSettings } from '../../../types/siteSettings.types';

const SeoSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  // Live preview values
  const metaTitle = watch('default_meta_title') || '';
  const metaDesc = watch('default_meta_description') || '';
  const canonical = watch('canonical_url') || 'https://infinyt.tech';

  useEffect(() => {
    if (settings) {
      reset({
        default_meta_title: settings.default_meta_title,
        default_meta_description: settings.default_meta_description,
        default_keywords: settings.default_keywords,
        canonical_url: settings.canonical_url,
        robots_index: settings.robots_index,
        robots_follow: settings.robots_follow,
        open_graph_title: settings.open_graph_title,
        open_graph_description: settings.open_graph_description,
        twitter_card_type: settings.twitter_card_type,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({ id: settings.id, data });
      reset(data); // clear dirty state
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-primary-text">Global SEO</h2>
          <p className="text-sm text-secondary-text">Configure defaults for search engines and social sharing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <div className="xl:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Meta tags */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-primary-text uppercase tracking-wider">Search Engine Defaults</h3>
              <Input 
                label="Default Meta Title" 
                {...register('default_meta_title')} 
              />
              <TextArea 
                label="Default Meta Description" 
                {...register('default_meta_description')} 
                rows={3}
              />
              <Input 
                label="Default Keywords (Comma separated)" 
                {...register('default_keywords')} 
              />
              <Input 
                label="Canonical URL Base" 
                {...register('canonical_url')} 
                placeholder="https://..."
              />
            </div>

            {/* Robots */}
            <div className="space-y-4 pt-6 border-t border-border-primary">
              <h3 className="text-sm font-semibold text-primary-text uppercase tracking-wider">Robots directives</h3>
              <div className="flex gap-8">
                <Checkbox 
                  label="Allow Indexing (robots_index)"
                  {...register('robots_index')}
                />
                <Checkbox 
                  label="Allow Following Links (robots_follow)"
                  {...register('robots_follow')}
                />
              </div>
            </div>

            {/* Social Graph */}
            <div className="space-y-6 pt-6 border-t border-border-primary">
              <h3 className="text-sm font-semibold text-primary-text uppercase tracking-wider">Open Graph & Twitter</h3>
              <Input 
                label="Open Graph Title (Optional fallback)" 
                {...register('open_graph_title')} 
              />
              <TextArea 
                label="Open Graph Description" 
                {...register('open_graph_description')} 
                rows={3}
              />
              <div className="w-1/2">
                <Select 
                  label="Twitter Card Type" 
                  {...register('twitter_card_type')}
                  options={[
                    { value: 'summary', label: 'Summary' },
                    { value: 'summary_large_image', label: 'Summary with Large Image' },
                    { value: 'app', label: 'App' },
                    { value: 'player', label: 'Player' },
                  ]}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border-primary flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={updateSettings.isPending || isSubmitting}
                disabled={!isDirty}
              >
                Save SEO Settings
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-primary-text mb-4">Google Search Preview</h3>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200" style={{ fontFamily: 'arial, sans-serif' }}>
                <div className="text-xs text-[#202124] mb-1 flex items-center gap-2">
                  <span className="bg-[#f1f3f4] w-6 h-6 rounded-full flex items-center justify-center text-[10px]">🌐</span>
                  <span className="truncate">{canonical}</span>
                </div>
                <div className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate mb-1" style={{ lineHeight: '1.2' }}>
                  {metaTitle || 'Your Page Title'}
                </div>
                <div className="text-[13px] text-[#4d5156] line-clamp-2 leading-snug">
                  {metaDesc || 'Your page description will appear here. It should be compelling and contain relevant keywords to attract clicks from search users.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoSettings;
