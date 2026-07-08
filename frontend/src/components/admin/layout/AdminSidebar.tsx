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
  Settings, 
  User, 
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

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/admin/services', label: 'Services', icon: Layers },
  { 
    path: '/admin/blog', 
    label: 'Blog', 
    icon: FileText,
    children: [
      { path: '/admin/blog', label: 'Posts' },
      { path: '/admin/blog/categories', label: 'Categories' },
      { path: '/admin/blog/tags', label: 'Tags' },
    ]
  },
  { path: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { path: '/admin/team', label: 'Team', icon: Users },
  { path: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { path: '/admin/leads', label: 'Leads CRM', icon: Target },
  { path: '/admin/settings', label: 'Site Settings', icon: Settings },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen }) => {
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({
    '/admin/blog': true,
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
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
          <div className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-4 px-2">Modules</div>
          
          {navItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.path)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm font-medium text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    {expandedMenus[item.path] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedMenus[item.path] && (
                    <div className="pl-9 space-y-1 mt-1">
                      {item.children.map(child => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          end={child.path === '/admin/blog'} // exact match for parent route so it doesn't stay active on sub-routes
                          className={({ isActive }) => 
                            `block px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                              isActive 
                                ? 'bg-accent-primary/10 text-accent-primary' 
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
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                      isActive 
                        ? 'bg-accent-primary/10 text-accent-primary' 
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

        {/* Bottom section */}
        <div className="p-4 border-t border-border-primary space-y-1 shrink-0">
          <NavLink
            to="/admin/profile"
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary' 
                  : 'text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text'
              }`
            }
          >
            <User className="w-4 h-4" />
            Profile
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
