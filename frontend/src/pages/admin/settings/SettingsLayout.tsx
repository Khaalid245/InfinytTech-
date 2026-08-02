import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Heading from '../../../components/ui/Heading';
import Text from '../../../components/ui/Text';
import { Settings, Image, Phone, Share2, Globe, Mail, Shield, Server } from 'lucide-react';

const tabs = [
  { path: '/admin/settings/general', label: 'General', icon: Settings },
  { path: '/admin/settings/branding', label: 'Branding', icon: Image },
  { path: '/admin/settings/contact', label: 'Contact', icon: Phone },
  { path: '/admin/settings/social', label: 'Social Media', icon: Share2 },
  { path: '/admin/settings/seo', label: 'Global SEO', icon: Globe },
  { path: '/admin/settings/email', label: 'Email / SMTP', icon: Mail },
  { path: '/admin/settings/security', label: 'Security', icon: Shield },
  { path: '/admin/settings/system', label: 'System & Health', icon: Server },
];

const SettingsLayout: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <Heading variant="h2" className="text-2xl font-semibold text-primary-text">
          Platform Settings
        </Heading>
        <Text variant="body" className="text-secondary-text">
          Manage your global platform configuration, branding, and integrations.
        </Text>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-primary/10 text-accent-primary'
                      : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
                  }`
                }
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface-light border border-border-primary rounded-xl overflow-hidden min-h-[600px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
