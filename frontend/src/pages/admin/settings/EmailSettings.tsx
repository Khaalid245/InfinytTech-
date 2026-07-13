import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { Send, Eye, EyeOff } from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';
import toast from 'react-hot-toast';

const EmailSettings: React.FC = () => {
  const { settings, isLoadingSettings, updateSettings, testEmail } = useSettingsAdmin();
  const { register, handleSubmit, reset, formState: { isSubmitting, isDirty } } = useForm<Partial<SiteSettings>>();
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  useEffect(() => {
    if (settings) {
      reset({
        smtp_provider: settings.smtp_provider,
        smtp_host: settings.smtp_host,
        smtp_port: settings.smtp_port,
        smtp_username: settings.smtp_username,
        smtp_encryption: settings.smtp_encryption,
        smtp_sender_name: settings.smtp_sender_name,
        smtp_sender_email: settings.smtp_sender_email,
        // password is write only, so we leave it blank
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      await updateSettings.mutateAsync({ id: settings.id, data });
      reset(data); // clear dirty state
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailAddress) {
      toast.error('Please enter an email address for testing');
      return;
    }
    await testEmail.mutateAsync(testEmailAddress);
  };

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-primary-text">Email & SMTP</h2>
          <p className="text-sm text-secondary-text">Configure outbound email delivery for the platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="SMTP Provider" 
                {...register('smtp_provider')}
                options={[
                  { value: 'Custom', label: 'Custom SMTP' },
                  { value: 'SendGrid', label: 'SendGrid' },
                  { value: 'Mailgun', label: 'Mailgun' },
                  { value: 'Amazon SES', label: 'Amazon SES' },
                ]}
              />
              <Select 
                label="Encryption" 
                {...register('smtp_encryption')}
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'ssl', label: 'SSL' },
                  { value: 'tls', label: 'TLS' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border-primary">
              <div className="md:col-span-2">
                <Input 
                  label="SMTP Host" 
                  {...register('smtp_host')} 
                  placeholder="smtp.example.com"
                />
              </div>
              <div>
                <Input 
                  label="SMTP Port" 
                  type="number"
                  {...register('smtp_port', { valueAsNumber: true })} 
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-primary">
              <Input 
                label="Username" 
                {...register('smtp_username')} 
              />
              <div className="relative">
                <Input 
                  label="Password (Encrypted)" 
                  type={showPassword ? "text" : "password"}
                  {...register('smtp_password')} 
                  placeholder="Leave blank to keep existing"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-[34px] text-secondary-text hover:text-primary-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-primary">
              <Input 
                label="Sender Name" 
                {...register('smtp_sender_name')} 
                placeholder="InfinytTech Admin"
              />
              <Input 
                label="Sender Email" 
                type="email"
                {...register('smtp_sender_email')} 
                placeholder="noreply@infinyt.tech"
              />
            </div>

            <div className="pt-6 border-t border-border-primary flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={updateSettings.isPending || isSubmitting}
                disabled={!isDirty}
              >
                Save SMTP Settings
              </Button>
            </div>
          </form>
        </div>

        {/* Test Email Card */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border-primary rounded-xl p-5 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold text-primary-text mb-2">Test Delivery</h3>
            <p className="text-xs text-secondary-text mb-5">
              Send a test email to verify your SMTP configuration. Ensure you save your changes first.
            </p>
            <div className="space-y-4">
              <Input 
                label="Test Recipient"
                placeholder="you@example.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
              />
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={handleTestEmail}
                isLoading={testEmail.isPending}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send Test Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
