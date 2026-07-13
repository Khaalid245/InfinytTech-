import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Checkbox from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import type { SiteSettings } from '../../../types/siteSettings.types';

const SecuritySettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();

  useEffect(() => {
    if (settings) {
      reset({
        password_policy: settings.password_policy,
        session_timeout: settings.session_timeout,
        max_login_attempts: settings.max_login_attempts,
        two_factor_auth_enabled: settings.two_factor_auth_enabled,
        allowed_origins: settings.allowed_origins,
        api_token_expiration: settings.api_token_expiration,
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
          <h2 className="text-lg font-medium text-primary-text">Security</h2>
          <p className="text-sm text-secondary-text">Configure global platform security, authentication, and session rules.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select 
            label="Password Policy" 
            {...register('password_policy')}
            options={[
              { value: 'standard', label: 'Standard (8+ chars, mixed case, numbers)' },
              { value: 'strict', label: 'Strict (12+ chars, mixed, numbers, symbols)' },
              { value: 'relaxed', label: 'Relaxed (6+ chars)' },
            ]}
          />
          <div className="pt-8">
            <Checkbox 
              label="Require 2FA globally for all admin users"
              {...register('two_factor_auth_enabled')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-primary">
          <Input 
            label="Max Login Attempts" 
            type="number"
            {...register('max_login_attempts', { valueAsNumber: true })} 
            placeholder="5"
          />
          <Input 
            label="Session Timeout (Minutes)" 
            type="number"
            {...register('session_timeout', { valueAsNumber: true })} 
            placeholder="120"
          />
          <Input 
            label="API Token Expiration (Days)" 
            type="number"
            {...register('api_token_expiration', { valueAsNumber: true })} 
            placeholder="30"
          />
        </div>

        <div className="pt-6 border-t border-border-primary">
          <Input 
            label="Allowed CORS Origins (Comma separated)" 
            {...register('allowed_origins')} 
            placeholder="https://app.infinyt.tech, https://dashboard.infinyt.tech"
          />
          <p className="text-xs text-secondary-text mt-2">
            Leave blank or use '*' to allow all origins (not recommended for production).
          </p>
        </div>

        <div className="pt-6 border-t border-border-primary flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={updateSettings.isPending || isSubmitting}
            disabled={!isDirty}
          >
            Save Security Rules
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
