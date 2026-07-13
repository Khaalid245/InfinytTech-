import React from 'react';
import { useSettingsAdmin } from '../../../hooks/useSettingsAdmin';
import Button from '../../../components/ui/Button';
import LoadingState from '../../../components/ui/LoadingState';
import { Server, Database, HardDrive, Cpu, Archive, RefreshCw } from 'lucide-react';

interface HealthCardProps {
  title: string;
  status: string;
  value?: number;
  icon: React.ElementType;
}

const SystemSettings: React.FC = () => {
  const { 
    healthData, isLoadingHealth, 
    backups, isLoadingBackups, createBackup, restoreBackup,
    notifications, isLoadingNotifications, markNotificationRead,
    auditLogs, isLoadingAuditLogs
  } = useSettingsAdmin();

  const handleCreateBackup = () => {
    createBackup.mutate();
  };

  if (isLoadingHealth || isLoadingBackups || isLoadingNotifications || isLoadingAuditLogs) {
    return <div className="p-8"><LoadingState /></div>;
  }

  const HealthCard: React.FC<HealthCardProps> = ({ title, status, value, icon: Icon }) => {
    const isHealthy = status === 'Healthy' || (typeof value === 'number' && value < 80);
    return (
      <div className="bg-surface border border-border-primary p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-md ${isHealthy ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-primary-text">{title}</div>
            <div className="text-xs text-secondary-text">{status}</div>
          </div>
        </div>
        {value !== undefined && (
          <div className="text-lg font-semibold text-primary-text">{value}{typeof value === 'number' ? '%' : ''}</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-12">
      
      {/* 1. System Health Dashboard */}
      <section>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-primary-text">System Health</h2>
          <p className="text-sm text-secondary-text">Live overview of platform infrastructure.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthCard title="Database" status={healthData?.database} icon={Database} />
          <HealthCard title="Redis Cache" status={healthData?.redis} icon={Server} />
          <HealthCard title="CPU Usage" status={healthData?.cpu_usage < 80 ? 'Healthy' : 'High Load'} value={healthData?.cpu_usage} icon={Cpu} />
          <HealthCard title="Disk Usage" status={healthData?.disk_usage < 80 ? 'Healthy' : 'Warning'} value={healthData?.disk_usage} icon={HardDrive} />
        </div>
      </section>

      {/* 2. System Backups */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-primary-text">System Backups</h2>
            <p className="text-sm text-secondary-text">Manage database and media snapshots.</p>
          </div>
          <Button 
            variant="primary" 
            onClick={handleCreateBackup}
            isLoading={createBackup.isPending}
            leftIcon={<Archive className="w-4 h-4" />}
          >
            Trigger Backup
          </Button>
        </div>
        <div className="border border-border-primary rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-secondary-text">
            <thead className="bg-surface-light text-primary-text uppercase tracking-wider text-xs border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 font-medium">File Name</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {backups?.map((item) => (
                <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{item.file_name}</td>
                  <td className="px-6 py-4">{item.file_size}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded ${
                      item.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                      item.status === 'failed' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" onClick={() => restoreBackup.mutate(item.id)} leftIcon={<RefreshCw className="w-4 h-4" />}>
                      Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. System Notifications */}
      <section>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-primary-text">System Notifications</h2>
          <p className="text-sm text-secondary-text">Important alerts regarding infrastructure and security.</p>
        </div>
        <div className="border border-border-primary rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-secondary-text">
            <thead className="bg-surface-light text-primary-text uppercase tracking-wider text-xs border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Notification</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {notifications?.filter(n => !n.is_read).map((item) => (
                <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded bg-accent-primary/10 text-accent-primary">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary-text">{item.title}</div>
                    <div className="text-xs text-secondary-text truncate max-w-sm">{item.message}</div>
                  </td>
                  <td className="px-6 py-4">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" onClick={() => markNotificationRead.mutate(item.id)}>
                      Mark Read
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Audit Logs */}
      <section>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-primary-text">Recent Audit Logs</h2>
          <p className="text-sm text-secondary-text">Latest administrative actions performed on the platform.</p>
        </div>
        <div className="border border-border-primary rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-secondary-text">
            <thead className="bg-surface-light text-primary-text uppercase tracking-wider text-xs border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {auditLogs?.map((item) => (
                <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{item.user_email || 'System'}</td>
                  <td className="px-6 py-4">{item.action}</td>
                  <td className="px-6 py-4">{item.ip_address}</td>
                  <td className="px-6 py-4">{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default SystemSettings;
