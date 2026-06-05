import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import BookingModal from '../ui/BookingModal';

interface PageLayoutProps {
  children: React.ReactNode;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children, theme, onThemeToggle }) => {
  const { pathname } = useLocation();

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
      <Navbar currentTheme={theme} onThemeToggle={onThemeToggle} />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
      <BookingModal theme={theme} />
    </div>
  );
};
export default PageLayout;
