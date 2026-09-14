import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import {
  Send, Eye, EyeOff, CheckCircle2, XCircle, AlertCircle,
  Clock, Wifi, FileCode2, Settings2, Server, ShieldCheck, Mail,
  Activity, Shield,
} from 'lucide-react';
import type { SiteSettings } from '../../../types/siteSettings.types';
import toast from 'react-hot-toast';
import { cn } from '../../../utils/cn';

// ── Status badge helper ──────────────────────────────────────────────────────

interface StatusConfig {
  label: string;
  dot: string;
  badge: string;
  icon: React.ReactNode;
  description: string;
}

function getStatusConfig(
  status: 'not_tested' | 'success' | 'error' | undefined,
  smtpConfigured: boolean,
): StatusConfig {
  if (status === 'success') {
    return {
      label: 'Operational',
      dot: 'bg-emerald-500 animate-pulse',
      badge: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      description: 'SMTP is configured and the last test completed successfully.',
    };
  }
  if (status === 'error') {
    return {
      label: 'Error',
      dot: 'bg-red-500 animate-pulse',
      badge: 'text-red-500 bg-red-500/10 border-red-500/20',
      icon: <XCircle className="w-4 h-4 text-red-500" />,
      description: 'The most recent test email failed. Check your SMTP credentials.',
    };
  }
  if (!smtpConfigured) {
    return {
      label: 'Not Configured',
      dot: 'bg-secondary-text',
      badge: 'text-secondary-text bg-surface-light border-border-primary',
      icon: <AlertCircle className="w-4 h-4 text-secondary-text" />,
      description: 'SMTP settings have not been configured yet.',
    };
  }
  return {
    label: 'Not Tested',
    dot: 'bg-amber-500',
    badge: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
    description: 'SMTP is configured but no successful test has been performed.',
  };
}

// ── Date formatter ───────────────────────────────────────────────────────────

function formatTs(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: '—', time: '' };
  try {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }),
    };
  } catch {
    return { date: iso, time: '' };
  }
}

// ── Main Component ───────────────────────────────────────────────────────────

const EmailSettings: React.FC = () => {
  const navigate = useNavigate();
  const {
    settings,
    isLoadingSettings,
    updateSettings,
    testEmail,
    emailStatus,
    isLoadingEmailStatus,
  } = useSettingsAdmin();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<Partial<SiteSettings>>();

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
        // password is write-only – leave blank
      });
    }
  }, [settings, reset]);

  const onSubmit = (data: Partial<SiteSettings>) => {
    if (settings?.id) {
      updateSettings.mutate({ id: settings.id, data }, { onSuccess: () => reset(data) });
    }
  };

  const handleTestEmail = () => {
    if (!testEmailAddress) {
      toast.error('Please enter a recipient email address');
      return;
    }
    testEmail.mutate(testEmailAddress);
  };

  const statusConfig = getStatusConfig(emailStatus?.status, emailStatus?.smtp_configured ?? false);
  const lastSuccess = formatTs(emailStatus?.last_test_at ?? null);
  const lastFailure = formatTs(emailStatus?.last_failure_at ?? null);
  const summary = emailStatus?.smtp_summary;

  if (isLoadingSettings) return <div className="p-8"><LoadingState /></div>;

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-lg font-medium text-primary-text">Email & SMTP</h2>
        <p className="text-sm text-secondary-text">Configure outbound email delivery and monitor service health.</p>
      </div>

      {/* ── TOP ROW: Status Panel (full width) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Current Status */}
        <div className="bg-surface border border-border-primary rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-secondary-text" />
              <span className="text-sm font-semibold text-primary-text">Email Service Status</span>
            </div>
            {isLoadingEmailStatus ? (
              <span className="text-xs text-secondary-text animate-pulse">Loading…</span>
            ) : (
              <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold border rounded-full px-2.5 py-0.5', statusConfig.badge)}>
                <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dot)} />
                {statusConfig.label}
              </span>
            )}
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-light border border-border-primary">
            {statusConfig.icon}
            <p className="text-xs text-secondary-text leading-relaxed">{statusConfig.description}</p>
          </div>

          {/* Sub-Service checks */}
          <div className="mt-4 space-y-2.5">
            {([
              {
                icon: Wifi,
                label: 'SMTP Connection',
                state: emailStatus?.status === 'success' ? 'healthy' : emailStatus?.status === 'error' ? 'failed' : 'pending',
              },
              {
                icon: FileCode2,
                label: 'Template Engine',
                state: emailStatus?.last_failure_reason?.toLowerCase().includes('template') ? 'failed' : 'healthy',
              },
              {
                icon: Settings2,
                label: 'Configuration',
                state: emailStatus?.smtp_configured ? 'healthy' : 'pending',
              },
            ] as const).map(({ icon: Icon, label, state }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-secondary-text" />
                  <span className="text-xs text-secondary-text">{label}</span>
                </div>
                {state === 'healthy' ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Healthy
                  </span>
                ) : state === 'failed' ? (
                  <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <XCircle className="w-3 h-3" /> Failed
                  </span>
                ) : (
                  <span className="text-xs text-secondary-text">Pending test</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Last Test Metadata */}
        <div className="bg-surface border border-border-primary rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-secondary-text" />
            <span className="text-sm font-semibold text-primary-text">Last Test Results</span>
          </div>

          {/* Success block */}
          <div className={cn(
            'rounded-lg border p-4 space-y-3',
            emailStatus?.last_test_at ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border-primary bg-surface-light'
          )}>
            <p className={cn('text-[10px] uppercase tracking-wider font-semibold',
              emailStatus?.last_test_at ? 'text-emerald-500' : 'text-secondary-text'
            )}>
              Last Successful Test
            </p>
            {emailStatus?.last_test_at ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-primary-text">{lastSuccess.date}</p>
                  <p className="text-xs text-secondary-text">{lastSuccess.time}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text mb-0.5">Recipient</p>
                  <p className="text-xs font-medium text-primary-text truncate">{emailStatus.last_test_recipient}</p>
                </div>
              </>
            ) : (
              <p className="text-xs text-secondary-text italic">No successful test recorded</p>
            )}
          </div>

          {/* Failure block */}
          {emailStatus?.last_failure_at && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-3">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-red-500">Last Failure</p>
              <div>
                <p className="text-sm font-semibold text-primary-text">{lastFailure.date}</p>
                <p className="text-xs text-secondary-text">{lastFailure.time}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-secondary-text mb-0.5">Reason</p>
                <p className="text-xs font-medium text-red-400 leading-relaxed">
                  {emailStatus.last_failure_reason || 'Unknown error'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SMTP Summary */}
        <div className="bg-surface border border-border-primary rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-secondary-text" />
            <span className="text-sm font-semibold text-primary-text">SMTP Summary</span>
          </div>
          <div className="space-y-3">
            {([
              { label: 'Provider', value: summary?.provider || '—' },
              { label: 'Host', value: summary?.host || '—' },
              { label: 'Encryption', value: summary?.encryption || '—' },
              { label: 'Port', value: summary?.port?.toString() || '—' },
              { label: 'Sender Name', value: summary?.sender_name || '—' },
              { label: 'Sender Email', value: summary?.sender_email || '—' },
            ]).map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-border-primary last:border-0">
                <span className="text-xs text-secondary-text">{label}</span>
                <span className="text-xs font-medium text-primary-text text-right max-w-[55%] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: SMTP Form + Test Delivery ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SMTP Configuration Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border-primary rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-4 h-4 text-secondary-text" />
              <h3 className="text-sm font-semibold text-primary-text">SMTP Configuration</h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="SMTP Provider"
                  {...register('smtp_provider')}
                  options={[
                    { value: 'Custom', label: 'Custom SMTP' },
                    { value: 'Gmail', label: 'Gmail' },
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
                  <Input label="SMTP Host" {...register('smtp_host')} placeholder="smtp.example.com" />
                </div>
                <div>
                  <Input label="SMTP Port" type="number" {...register('smtp_port', { valueAsNumber: true })} placeholder="587" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border-primary">
                <Input label="Username" {...register('smtp_username')} />
                <div className="relative">
                  <Input
                    label="Password (Encrypted)"
                    type={showPassword ? 'text' : 'password'}
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
                <Input label="Sender Name" {...register('smtp_sender_name')} placeholder="Admin" />
                <Input label="Sender Email" type="email" {...register('smtp_sender_email')} placeholder="noreply@example.com" />
              </div>

              <div className="pt-4 border-t border-border-primary flex justify-end">
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
        </div>

        {/* Test Delivery + Quick Actions */}
        <div className="lg:col-span-1 space-y-4">

          {/* Send Test Email */}
          <div className="bg-surface border border-border-primary rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-secondary-text" />
              <h3 className="text-sm font-semibold text-primary-text">Send Test Email</h3>
            </div>
            <p className="text-xs text-secondary-text mb-4 ml-6">
              Verify your SMTP configuration by sending a live diagnostic email. Save your settings first.
            </p>
            <div className="space-y-3">
              <Input
                label="Recipient Address"
                placeholder="you@example.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
              />
              <Button
                variant="primary"
                className="w-full"
                onClick={handleTestEmail}
                isLoading={testEmail.isPending}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send Test Email
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-surface border border-border-primary rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-3">Quick Actions</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/admin/settings/security')}
                className="w-full flex items-center justify-between text-xs text-primary-text border border-border-primary hover:border-accent/40 bg-surface-light hover:bg-surface rounded-lg px-3 py-2.5 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-accent" />
                  Security & Audit Logs
                </span>
                <span className="text-[10px] text-secondary-text">Manage</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/settings/system')}
                className="w-full flex items-center justify-between text-xs text-primary-text border border-border-primary hover:border-accent/40 bg-surface-light hover:bg-surface rounded-lg px-3 py-2.5 transition-all text-left"
              >
                <span className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  System Diagnostics
                </span>
                <span className="text-[10px] text-secondary-text">Inspect</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
