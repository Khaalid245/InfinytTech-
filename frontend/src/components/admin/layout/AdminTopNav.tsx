import React, { useState } from 'react';
import { Menu, Search, Plus, Bell, Moon, Sun, ChevronDown } from 'lucide-react';

interface AdminTopNavProps {
  onMenuClick: () => void;
}

const AdminTopNav: React.FC<AdminTopNavProps> = ({ onMenuClick }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="h-16 bg-surface-light border-b border-border-primary flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      
      {/* Left section: Mobile menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center relative max-w-md w-full">
          <Search className="w-4 h-4 text-secondary-text absolute left-3" />
          <input 
            type="text" 
            placeholder="Search modules..." 
            className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-accent-primary focus:bg-transparent rounded-md py-1.5 pl-9 pr-4 text-sm text-primary-text outline-none transition-all"
          />
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Quick Create */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-medium rounded-md transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">Create</span>
        </button>

        <div className="h-6 w-px bg-border-primary mx-1"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="p-2 text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface-light"></span>
        </button>

        {/* Profile Dropdown Trigger (Static for now) */}
        <button className="flex items-center gap-2 p-1 pl-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors ml-1">
          <div className="w-7 h-7 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-xs font-bold uppercase border border-accent-primary/30">
            AD
          </div>
          <div className="hidden md:flex flex-col items-start mr-1">
            <span className="text-xs font-medium text-primary-text leading-tight max-w-[100px] truncate">
              Administrator
            </span>
          </div>
          <ChevronDown className="w-3 h-3 text-secondary-text hidden md:block" />
        </button>

      </div>
    </header>
  );
};

export default AdminTopNav;
