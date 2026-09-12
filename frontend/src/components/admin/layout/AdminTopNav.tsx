import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, Search, Plus, Bell, Moon, Sun, ChevronDown, 
  LogOut, User, Settings, ExternalLink, Briefcase, 
  FileText, Layers, Image, Users, Target, MessageSquare, 
  Building, Shield, Key, Sparkles, Globe, Lock,
  LayoutDashboard, CheckCircle2, X
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useDashboard } from '../../../hooks/useDashboard';

interface AdminTopNavProps {
  onMenuClick: () => void;
}

interface ModuleItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  description: string;
}

const ADMIN_MODULES: ModuleItem[] = [
  { label: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard, category: 'Overview', description: 'System KPIs & content metrics' },
  { label: 'Portfolio Projects', path: '/admin/portfolio', icon: Briefcase, category: 'Content', description: 'Manage case studies & projects' },
  { label: 'Services', path: '/admin/services', icon: Layers, category: 'Content', description: 'Core business service offerings' },
  { label: 'Blog Posts', path: '/admin/blog', icon: FileText, category: 'Blog', description: 'Articles, insights, and drafts' },
  { label: 'Media Library', path: '/admin/media', icon: Image, category: 'Assets', description: 'Uploaded images, SVGs, and documents' },
  { label: 'Team Members', path: '/admin/team', icon: Users, category: 'Organization', description: 'Staff directory & profiles' },
  { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare, category: 'Social Proof', description: 'Client reviews and feedback' },
  { label: 'Clients & Partners', path: '/admin/clients', icon: Building, category: 'Social Proof', description: 'Partner brands & enterprise logos' },
  { label: 'Leads & Inquiries', path: '/admin/leads', icon: Target, category: 'CRM', description: 'Contact form submissions & pipeline' },
  { label: 'User Management', path: '/admin/users', icon: Shield, category: 'System', description: 'Admin accounts and credentials' },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: Key, category: 'System', description: 'Access control and role levels' },
  { label: 'General Settings', path: '/admin/settings/general', icon: Settings, category: 'Settings', description: 'Platform branding & information' },
  { label: 'Branding Settings', path: '/admin/settings/branding', icon: Sparkles, category: 'Settings', description: 'Logos, hero assets & themes' },
  { label: 'SEO Settings', path: '/admin/settings/seo', icon: Globe, category: 'Settings', description: 'Meta tags, sitemaps & analytics' },
  { label: 'Security Settings', path: '/admin/settings/security', icon: Lock, category: 'Settings', description: 'Authentication & session controls' },
];

const AdminTopNav: React.FC<AdminTopNavProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { role, logout } = useAuth();
  const { data: dashboardData } = useDashboard();

  const [theme, setTheme] = useState<'dark' | 'light'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  // Dropdown states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Refs for outside click handling
  const searchRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Read stored user from localStorage
  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          email: parsed.email || 'admin@infinyttech.com',
          name: parsed.first_name ? `${parsed.first_name} ${parsed.last_name || ''}`.trim() : 'Administrator',
          role: parsed.role || role || 'admin'
        };
      }
    } catch {
      // fallback
    }
    return {
      email: 'admin@infinyttech.com',
      name: 'Administrator',
      role: role || 'admin'
    };
  }, [role]);

  const initials = useMemo(() => {
    if (currentUser.name && currentUser.name !== 'Administrator') {
      const parts = currentUser.name.split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return currentUser.name.slice(0, 2).toUpperCase();
    }
    return currentUser.email.slice(0, 2).toUpperCase();
  }, [currentUser]);

  const newLeadsCount = dashboardData?.overview?.leads?.new || 0;

  // Filter modules based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return ADMIN_MODULES.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return ADMIN_MODULES.filter(m => 
      m.label.toLowerCase().includes(q) || 
      m.category.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) {
        setIsSearchOpen(false);
      }
      if (createRef.current && !createRef.current.contains(target)) {
        setIsCreateOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleModuleSelect = (path: string) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsSearchOpen(true);
      return;
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev + 1) % filteredModules.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSearchIndex(prev => (prev - 1 + filteredModules.length) % filteredModules.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredModules[selectedSearchIndex]) {
        handleModuleSelect(filteredModules[selectedSearchIndex].path);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-16 bg-surface-light border-b border-border-primary flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      
      {/* Left section: Mobile menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
          aria-label="Toggle sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Spotlight Module Search */}
        <div ref={searchRef} className="hidden md:flex items-center relative max-w-md w-full">
          <Search className="w-4 h-4 text-secondary-text absolute left-3 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search admin modules or jump to page..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
              setSelectedSearchIndex(0);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary focus:bg-transparent rounded-md py-1.5 pl-9 pr-8 text-sm text-primary-text outline-none transition-all placeholder:text-secondary-text/60"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 p-0.5 text-secondary-text hover:text-primary-text rounded"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-full bg-surface-light border border-border-primary rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary/50 mb-1 flex items-center justify-between">
                <span>{searchQuery ? 'Matching Modules' : 'Quick Jump'}</span>
                <span className="text-[10px] text-secondary-text/70">↑↓ to navigate • ↵ select</span>
              </div>
              {filteredModules.length === 0 ? (
                <div className="px-4 py-3 text-sm text-secondary-text text-center">
                  No modules matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {filteredModules.map((m, idx) => {
                    const Icon = m.icon;
                    const isSelected = idx === selectedSearchIndex;
                    return (
                      <button
                        key={m.path}
                        onClick={() => handleModuleSelect(m.path)}
                        onMouseEnter={() => setSelectedSearchIndex(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                          isSelected 
                            ? 'bg-accent-primary/10 text-accent-primary' 
                            : 'text-primary-text hover:bg-black/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isSelected ? 'bg-accent-primary/20 text-accent-primary' : 'bg-black/5 dark:bg-white/5 text-secondary-text'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">{m.label}</div>
                          <div className="text-[11px] text-secondary-text truncate">{m.description}</div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-secondary-text font-mono">
                          {m.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Quick Create Dropdown */}
        <div ref={createRef} className="relative">
          <button 
            onClick={() => setIsCreateOpen(prev => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-medium rounded-md transition-colors shadow-sm cursor-pointer"
            aria-label="Quick create menu"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Create</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>

          {isCreateOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-light border border-border-primary rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary-text border-b border-border-primary/50 mb-1">
                Quick Create
              </div>
              <button
                onClick={() => { navigate('/admin/portfolio'); setIsCreateOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-blue-500" />
                <span>New Project</span>
              </button>
              <button
                onClick={() => { navigate('/admin/blog'); setIsCreateOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <FileText className="w-4 h-4 text-orange-500" />
                <span>New Blog Post</span>
              </button>
              <button
                onClick={() => { navigate('/admin/services'); setIsCreateOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Layers className="w-4 h-4 text-purple-500" />
                <span>New Service</span>
              </button>
              <button
                onClick={() => { navigate('/admin/media'); setIsCreateOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Image className="w-4 h-4 text-indigo-500" />
                <span>Upload Media</span>
              </button>
              <button
                onClick={() => { navigate('/admin/team'); setIsCreateOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Users className="w-4 h-4 text-cyan-500" />
                <span>Add Team Member</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border-primary mx-1"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors cursor-pointer"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div ref={notificationsRef} className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors relative cursor-pointer"
            aria-label="Notifications"
            title="Notifications & alerts"
          >
            <Bell className="w-4 h-4" />
            {newLeadsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-surface-light animate-pulse">
                {newLeadsCount > 9 ? '9+' : newLeadsCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-surface-light border border-border-primary rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-border-primary/50 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary-text">Notifications</span>
                <span className="text-[11px] text-accent-primary font-medium">Real-time</span>
              </div>
              <div className="p-2 space-y-1">
                {newLeadsCount > 0 ? (
                  <div 
                    onClick={() => { navigate('/admin/leads'); setIsNotificationsOpen(false); }}
                    className="p-2.5 rounded-md bg-accent-primary/10 border border-accent-primary/20 hover:bg-accent-primary/15 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-accent-primary" />
                      <span className="text-xs font-semibold text-primary-text">New Client Inquiries</span>
                    </div>
                    <p className="text-xs text-secondary-text">
                      You have {newLeadsCount} new contact inquiries waiting for review.
                    </p>
                    <span className="inline-block mt-1.5 text-[11px] font-medium text-accent-primary hover:underline">
                      Review Leads &rarr;
                    </span>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-secondary-text">
                    All caught up! No unread lead notifications.
                  </div>
                )}
                
                <div className="p-2.5 rounded-md bg-black/5 dark:bg-white/5 flex items-center gap-2 text-xs text-secondary-text">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <span>Platform services & database operational</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setIsProfileOpen(prev => !prev)}
            className="flex items-center gap-2 p-1 pl-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors ml-1 cursor-pointer"
            aria-label="User profile menu"
          >
            <div className="w-7 h-7 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-xs font-bold uppercase border border-accent-primary/30">
              {initials}
            </div>
            <div className="hidden md:flex flex-col items-start mr-1 text-left">
              <span className="text-xs font-medium text-primary-text leading-tight max-w-[120px] truncate">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-secondary-text capitalize">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-secondary-text hidden md:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-surface-light border border-border-primary rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2.5 border-b border-border-primary/50">
                <div className="text-xs font-semibold text-primary-text truncate">{currentUser.name}</div>
                <div className="text-[11px] text-secondary-text truncate">{currentUser.email}</div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-accent-primary/15 text-accent-primary">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { navigate('/admin/settings'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-secondary-text" />
                  <span>Settings & Configuration</span>
                </button>
                <button
                  onClick={() => { navigate('/admin/users'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-secondary-text" />
                  <span>Admin User Directory</span>
                </button>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-secondary-text" />
                  <span>View Public Site</span>
                </a>
              </div>

              <div className="border-t border-border-primary/50 pt-1 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default AdminTopNav;
