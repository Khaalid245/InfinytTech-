import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import BookingModal from '../ui/BookingModal';
import { MaintenanceScreen } from '../common/MaintenanceScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../hooks/useSiteSettings';

void React;

interface PageLayoutProps {
  children: React.ReactNode;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, theme, onThemeToggle }) => {
  const { pathname } = useLocation();
  const { isAdmin } = useAuth();
  const { data: settings } = useSiteSettings();

  const isMaintenanceMode = Boolean(settings?.maintenance_mode);
  const isLoginPage = pathname === '/login';
  const showMaintenance = isMaintenanceMode && !isAdmin && !isLoginPage;

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-primary-bg select-text">
      {isMaintenanceMode && isAdmin && (
        <div
          role="status"
          className="bg-amber-500/15 border-b border-amber-500/30 text-amber-500 px-4 py-1.5 text-xs font-medium flex items-center justify-center gap-2"
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Maintenance Mode Active — Admin Preview &amp; Bypass Enabled</span>
        </div>
      )}
      <Navbar currentTheme={theme} onThemeToggle={onThemeToggle} />
      <main className={`flex-grow ${pathname === '/contact' ? 'pt-0' : 'pt-24'}`}>
        {showMaintenance ? (
          <MaintenanceScreen theme={theme} settings={settings} />
        ) : (
          children
        )}
      </main>
      {!showMaintenance && <Footer />}
      {!showMaintenance && <BookingModal theme={theme} />}
    </div>
  );
};
export default PageLayout;
