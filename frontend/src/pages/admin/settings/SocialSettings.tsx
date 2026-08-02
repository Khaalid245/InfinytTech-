import React, { useEffect, useState } from 'react';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Trash2, Plus } from 'lucide-react';
import type { SocialLink } from '../../../types/siteSettings.types';


const SocialSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.social_links) {
      setSocialLinks(settings.social_links);
    }
  }, [settings]);

  const handleAdd = () => {
    setSocialLinks([...socialLinks, {
      id: `new_${Date.now()}`,
      platform: 'linkedin',
      url: '',
      icon: '',
      order: socialLinks.length,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]);
  };

  const handleRemove = (id: string) => {
    setSocialLinks(socialLinks.filter(l => l.id !== id));
  };

  const handleChange = (id: string, field: keyof SocialLink, value: any) => {
    setSocialLinks(socialLinks.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const onSave = async () => {
    if (!settings?.id) return;
    setIsSaving(true);
    try {
      const sanitizedLinks = socialLinks.map(link => {
        if (typeof link.id === 'string' && link.id.startsWith('new_')) {
          const { id, ...rest } = link;
          return rest;
        }
        return link;
      });
      await updateSettings.mutateAsync({ 
        id: settings.id, 
        data: { social_links: sanitizedLinks as any } 
      });
      // success toast is handled inside updateSettings mutation onSuccess
    } catch (e) {
      // error toast is handled inside updateSettings mutation onError
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-primary-text">Social Media</h2>
          <p className="text-sm text-secondary-text">Manage your social profiles.</p>
        </div>
        <Button variant="secondary" onClick={handleAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Profile
        </Button>
      </div>

      <div className="space-y-4 max-w-4xl">
        {socialLinks.map((link) => (
          <div key={link.id} className="flex gap-4 items-start bg-surface border border-border-primary p-4 rounded-lg">
            <div className="w-48 shrink-0">
              <Select 
                label="Platform"
                value={link.platform}
                onChange={(e) => handleChange(link.id, 'platform', e.target.value)}
                options={[
                  { value: 'linkedin', label: 'LinkedIn' },
                  { value: 'github', label: 'GitHub' },
                  { value: 'twitter', label: 'X (Twitter)' },
                  { value: 'facebook', label: 'Facebook' },
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'tiktok', label: 'TikTok' },
                  { value: 'youtube', label: 'YouTube' },
                  { value: 'behance', label: 'Behance' },
                  { value: 'dribbble', label: 'Dribbble' },
                  { value: 'medium', label: 'Medium' },
                ]}
              />
            </div>
            <div className="flex-1">
              <Input 
                label="Profile URL" 
                value={link.url}
                onChange={(e) => handleChange(link.id, 'url', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="pt-7">
              <button onClick={() => handleRemove(link.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {socialLinks.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border-primary rounded-lg text-secondary-text">
            No social links configured.
          </div>
        )}

        <div className="pt-6 border-t border-border-primary flex justify-end">
          <Button 
            onClick={onSave} 
            variant="primary" 
            isLoading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialSettings;
