import React from 'react';
import Card from '../ui/Card';
import Heading from '../ui/Heading';
import { Database, Server, Code, GitMerge, Settings } from 'lucide-react';
import type { SystemHealth as SystemHealthType } from '../../types/dashboard.types';

interface SystemHealthProps {
  data: SystemHealthType;
}

const SystemHealth: React.FC<SystemHealthProps> = ({ data }) => {
  return (
    <Card variant="outline" className="p-0 h-full bg-surface-light border-border-primary overflow-hidden">
      <div className="p-6 pb-4 border-b border-border-primary flex items-center justify-between">
        <Heading variant="h3" className="text-lg tracking-tight">System Health</Heading>
        {data.database_connection === 'Healthy' && data.migration_status === 'Up to date' ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] uppercase tracking-wider font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Operational
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] uppercase tracking-wider font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
            Degraded
          </div>
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default group">
          <div className="flex items-center text-sm font-medium text-secondary-text group-hover:text-primary-text transition-colors">
            <Database className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            Database Connection
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${
            data.database_connection === 'Healthy' 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm'
          }`}>
            {data.database_connection}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-border-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default group">
          <div className="flex items-center text-sm font-medium text-secondary-text group-hover:text-primary-text transition-colors">
            <GitMerge className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            Pending Migrations
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${
            data.migration_status === 'Up to date' 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm' 
              : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-sm'
          }`}>
            {data.migration_status}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-border-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default group">
          <div className="flex items-center text-sm font-medium text-secondary-text group-hover:text-primary-text transition-colors">
            <Settings className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            App Version
          </div>
          <span className="text-[13px] font-mono font-medium text-primary-text bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-border-primary">
            v{data.application_version}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-border-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default group">
          <div className="flex items-center text-sm font-medium text-secondary-text group-hover:text-primary-text transition-colors">
            <Server className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            Django Version
          </div>
          <span className="text-[13px] font-mono font-medium text-primary-text bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-border-primary">
            {data.django_version}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default group">
          <div className="flex items-center text-sm font-medium text-secondary-text group-hover:text-primary-text transition-colors">
            <Code className="w-4 h-4 mr-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            Python Version
          </div>
          <span className="text-[13px] font-mono font-medium text-primary-text bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-border-primary">
            {data.python_version}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default SystemHealth;
