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
        lockout_duration: settings.lockout_duration,
        two_factor_auth_enabled: settings.two_factor_auth_enabled,
        allowed_origins: settings.allowed_origins,
        api_token_expiration: settings.api_token_expiration,
        rate_limiting_enabled: settings.rate_limiting_enabled,
        login_rate_limit: settings.login_rate_limit,
        api_rate_limit: settings.api_rate_limit,
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border-primary">
          <Input 
            label="Max Login Attempts" 
            type="number"
            {...register('max_login_attempts', { valueAsNumber: true, min: 1 })} 
            placeholder="5"
          />
          <Input 
            label="Lockout Duration (Minutes)" 
            type="number"
            {...register('lockout_duration', { valueAsNumber: true, min: 1 })} 
            placeholder="15"
          />
          <Input 
            label="Session Timeout (Minutes)" 
            type="number"
            {...register('session_timeout', { valueAsNumber: true, min: 1 })} 
            placeholder="1440"
          />
          <p className="text-xs text-secondary-text -mt-4">
            Minimum 1 minute. Users inactive for this duration will be signed out automatically.
          </p>
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

        {/* Rate Limiting */}
        <div className="pt-6 border-t border-border-primary space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-primary-text mb-1">API Rate Limiting</h3>
            <p className="text-xs text-secondary-text mb-4">
              Protect authentication and API endpoints from abuse. Excessive requests receive HTTP 429 with a <code className="font-mono bg-surface-dark/30 px-1 rounded">Retry-After</code> header.
            </p>
            <Checkbox
              label="Enable API rate limiting"
              {...register('rate_limiting_enabled')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Login Rate Limit (requests / minute / IP)"
                type="number"
                {...register('login_rate_limit', { valueAsNumber: true, min: 1 })}
                placeholder="10"
              />
              <p className="text-xs text-secondary-text mt-1">
                Max login attempts per IP per minute. Affects <code className="font-mono bg-surface-dark/30 px-1 rounded">POST /api/auth/login/</code>.
              </p>
            </div>
            <div>
              <Input
                label="API Rate Limit (requests / minute / user)"
                type="number"
                {...register('api_rate_limit', { valueAsNumber: true, min: 1 })}
                placeholder="300"
              />
              <p className="text-xs text-secondary-text mt-1">
                Max requests per authenticated user per minute across all endpoints.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border-primary flex justify-end">
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={updateSettings.isPending || isSubmitting}
            disabled={!isDirty || updateSettings.isPending || isSubmitting}
          >
            {updateSettings.isPending || isSubmitting ? 'Saving...' : 'Save Security Rules'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
