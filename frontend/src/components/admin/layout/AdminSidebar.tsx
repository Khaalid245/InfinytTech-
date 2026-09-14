import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Users, 
  MessageSquare, 
  Target, 
  User,
  Shield,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavSection {
  title: string;
  items: Array<{
    path: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: Array<{ path: string; label: string }>;
  }>;
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Content & Media',
    items: [
      { path: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
      { path: '/admin/services', label: 'Services', icon: Layers },
      { 
        path: '/admin/blog', 
        label: 'Blog Articles', 
        icon: FileText,
        children: [
          { path: '/admin/blog', label: 'All Posts' },
          { path: '/admin/blog/categories', label: 'Categories' },
          { path: '/admin/blog/tags', label: 'Tags' },
        ]
      },
      { path: '/admin/media', label: 'Media Library', icon: ImageIcon },
    ]
  },
  {
    title: 'Growth & CRM',
    items: [
      { path: '/admin/leads', label: 'Leads CRM', icon: Target },
      { 
        path: '/admin/team', 
        label: 'Team Members', 
        icon: Users,
        children: [
          { path: '/admin/team', label: 'Members' },
          { path: '/admin/team/departments', label: 'Departments' },
        ]
      },
      { 
        path: '/admin/testimonials', 
        label: 'Social Proof', 
        icon: MessageSquare,
        children: [
          { path: '/admin/testimonials', label: 'Testimonials' },
          { path: '/admin/clients', label: 'Clients & Logos' },
        ]
      },
    ]
  },
  {
    title: 'Administration',
    items: [
      { 
        path: '/admin/users', 
        label: 'User Management', 
        icon: Shield,
        children: [
          { path: '/admin/users', label: 'Admin Users' },
          { path: '/admin/roles', label: 'Roles & Access' },
        ]
      },
      { path: '/admin/settings', label: 'Platform Settings', icon: Settings },
    ]
  }
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({
    '/admin/blog': true,
    '/admin/team': true,
    '/admin/testimonials': true,
    '/admin/users': true,
  });

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-64 bg-surface-light border-r border-border-primary z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-border-primary shrink-0 justify-between">
          <span className="text-xl font-bold tracking-tight text-primary-text">InfinytAdmin</span>
          <button 
            className="lg:hidden p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-secondary-text"
            onClick={() => setIsOpen(false)}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 scrollbar-hide">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] font-bold text-secondary-text/70 uppercase tracking-widest px-3 mb-2">
                {section.title}
              </div>
              
              {section.items.map((item) => (
                <div key={item.path}>
                  {item.children ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleMenu(item.path)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm font-medium text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-secondary-text" />
                          {item.label}
                        </div>
                        {expandedMenus[item.path] ? (
                          <ChevronDown className="w-3.5 h-3.5 text-secondary-text" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-secondary-text" />
                        )}
                      </button>
                      
                      {expandedMenus[item.path] && (
                        <div className="pl-9 space-y-1 mt-1 border-l-2 border-border-primary/50 ml-5">
                          {item.children.map(child => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end={child.path === item.path}
                              className={({ isActive }) => 
                                `block px-3 py-1.5 rounded-md transition-colors text-xs font-medium ${
                                  isActive 
                                    ? 'bg-accent-primary/10 text-accent-primary font-semibold' 
                                    : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
                                }`
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                          isActive 
                            ? 'bg-accent-primary/10 text-accent-primary font-semibold' 
                            : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-border-primary space-y-1 shrink-0">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary' 
                  : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
              }`
            }
          >
            <User className="w-4 h-4" />
            Profile & Settings
          </NavLink>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-red-500 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
