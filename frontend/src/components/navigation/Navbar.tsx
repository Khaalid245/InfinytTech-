import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

interface NavbarProps {
  currentTheme?: 'dark' | 'light';
  theme?: 'dark' | 'light';
  onThemeToggle?: () => void;
  onNavigate?: (tabId: string) => void;
}

// ─── Navigation Items Definition ───
const NAV_ITEMS = [
  { label: 'Home', href: '/', id: 'home', sectionId: 'hero' },
  { label: 'Services', href: '/services', id: 'services', sectionId: undefined },
  { label: 'Portfolio', href: '/work', id: 'portfolio', sectionId: 'portfolio' },
  { label: 'About', href: '/about', id: 'about', sectionId: undefined },
  { label: 'Blog', href: '/insights', id: 'blog', sectionId: 'blog' },
  { label: 'Contact', href: '/contact', id: 'contact', sectionId: undefined },
] as const;

export default function Navbar({ currentTheme, theme, onThemeToggle, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);
  
  // Underline state styling coordinates
  const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // Resolve theme prop dynamically with fallbacks
  const activeTheme = currentTheme || theme || 'dark';
  const isDark = activeTheme === 'dark';

  const isContactPage = location.pathname === '/contact';
  const useHeroText = isContactPage && !isScrolled;
  const routeActiveTab = NAV_ITEMS.find((item) => item.href === location.pathname)?.id ?? '';
  const visibleActiveTab = location.pathname === '/' ? activeTab : routeActiveTab;

  // 1. Hook up window scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Performant Scroll Spy using IntersectionObserver
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    if (!isHomePage) {
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // Trigger when section occupies core viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const matchingItem = NAV_ITEMS.find((item) => item.sectionId === id);
          if (matchingItem) {
            setActiveTab(matchingItem.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      if (item.sectionId) {
        const el = document.getElementById(item.sectionId);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // 3. Dynamic positioning calculations for the sliding hover underline
  const updateUnderlinePosition = useCallback(() => {
    const targetTab = hoveredTab || visibleActiveTab;
    const targetEl = itemRefs.current[targetTab];
    if (targetEl && navRef.current) {
      const left = targetEl.offsetLeft;
      const width = targetEl.offsetWidth;
      setUnderlineStyle({
        left,
        width,
        opacity: 1,
      });
    } else {
      setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [visibleActiveTab, hoveredTab]);

  useEffect(() => {
    updateUnderlinePosition();
    window.addEventListener('resize', updateUnderlinePosition);
    return () => window.removeEventListener('resize', updateUnderlinePosition);
  }, [updateUnderlinePosition, isScrolled]);

  // 5. URL Path-to-Scroll Router Listener (Navbar & Footer Links)
  useEffect(() => {
    const path = location.pathname;
    
    const pathRouteMap: Record<string, string> = {
      '/': 'hero',
      '/work': 'portfolio',
      '/process': 'process',
      '/insights': 'blog',
    };

    const targetSectionId = pathRouteMap[path];
    if (targetSectionId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(targetSectionId);
        if (element) {
          const headerOffset = window.scrollY > 30 ? 90 : 120;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // 4. Premium Smooth Scroll Click Handler
  const handleLinkClick = (e: React.MouseEvent<HTMLElement>, item: typeof NAV_ITEMS[number]) => {
    setActiveTab(item.id);
    onNavigate?.(item.id);
    setIsMobileMenuOpen(false);

    const isHomePage = location.pathname === '/';
    
    if (isHomePage && item.sectionId) {
      const element = document.getElementById(item.sectionId);
      if (element) {
        e.preventDefault();
        
        // Offset for sticky floating header dock
        const headerOffset = isScrolled ? 90 : 120;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  // Color Mapping Tokens
  const underlineColor = isDark ? 'bg-[#EAB308]' : 'bg-[#CA8A04]'; // Golden vs Amber
  
  return (
    <>
      {/* ── HEADER SHELL ── */}
      <header
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 w-full flex items-center justify-center',
          'transition-all duration-500'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* ── INNER CONTAINER — Morphs from full-width flush to floating glass dock ── */}
        <div
          className={cn(
            'w-full flex items-center justify-between transition-all duration-500',
            isScrolled
              ? cn(
                  'max-w-7xl mx-4 my-3 rounded-2xl border px-6 shadow-lg backdrop-blur-md',
                  isDark
                    ? 'bg-[#171717]/80 border-[#2A2A2A] shadow-yellow-500/[0.02]'
                    : 'bg-white/85 border-slate-200 shadow-slate-200/40'
                )
              : cn(
                  'px-6 md:px-12',
                  isNavHovered
                    ? (isDark ? 'bg-[#171717]/80 backdrop-blur-md border-b border-[#2A2A2A]' : 'bg-white/40 backdrop-blur-md border-b border-slate-200/30')
                    : 'bg-transparent border-b border-transparent'
                ),
            isScrolled ? 'h-14' : 'h-20'
          )}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn(
              'flex items-center select-none transition-all duration-200 active:scale-95 hover:opacity-80'
            )}
          >
            <Logo className="h-8 md:h-9" />
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav
            ref={navRef}
            onMouseLeave={() => setHoveredTab(null)}
            className="relative hidden md:flex items-center gap-8"
          >
            {/* Sliding Underline Indicator */}
            <span
              aria-hidden="true"
              className={cn(
                'absolute bottom-0 h-[2px] rounded-full pointer-events-none transition-all duration-300 ease-out',
                underlineColor
              )}
              style={{
                left: underlineStyle.left,
                width: underlineStyle.width,
                opacity: underlineStyle.opacity,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {NAV_ITEMS.map((item) => {
              const isItemActive = visibleActiveTab === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  onMouseEnter={() => setHoveredTab(item.id)}
                  onClick={(e) => handleLinkClick(e, item)}
                  className={cn(
                    'relative text-sm font-medium py-1.5 transition-colors duration-200 active:scale-95 select-none',
                    useHeroText ? (isItemActive ? 'text-white' : 'text-white/80 hover:text-white') : (isDark ? (isItemActive ? 'text-white' : 'text-[#D4D4D4] hover:text-white') : (isItemActive ? 'text-[#0F172A]' : 'text-slate-500 hover:text-[#0F172A]'))
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ── DESKTOP ACTIONS ── */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            {onThemeToggle && (
              <button
                type="button"
                onClick={onThemeToggle}
                aria-label="Toggle theme"
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-300',
                  'active:scale-95 cursor-pointer',
                  useHeroText ? 'border-white/30 text-white hover:bg-white/10 hover:rotate-12 hover:scale-110' : (isDark ? 'border-[#2A2A2A] text-[#FACC15] hover:bg-[#2A2A2A] hover:rotate-12 hover:scale-110' : 'border-slate-200 text-[#CA8A04] hover:bg-slate-100 hover:-rotate-12 hover:scale-110')
                )}
              >
                {isDark ? (
                  <Sun className="w-4 h-4 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform duration-300" />
                )}
              </button>
            )}

            {/* CTA Book a Call Button */}
            <Button
              type="button"
              variant="secondary"
              onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal'))}
              className={cn(
                'px-4 py-2',
                useHeroText ? 'bg-transparent text-white border-white/30 hover:bg-white/10' : (isDark ? 'bg-transparent text-white border-[#2A2A2A] hover:bg-[#1F1F1F]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50')
              )}
            >
              Book a Call
            </Button>

            {/* CTA Start Project Button */}
            <Button
              to="/contact"
              variant="primary"
              onClick={(e) => {
                const contactItem = NAV_ITEMS.find((i) => i.id === 'contact');
                if (contactItem) handleLinkClick(e, contactItem);
              }}
              className={cn(
                'px-4 py-2',
                useHeroText ? 'bg-white text-[#0F0F10] border-white hover:bg-white/90 hover:border-white/90' : (isDark ? 'bg-[#FACC15] text-[#0F0F10] border-[#FACC15] hover:bg-[#EAB308] hover:border-[#EAB308]' : 'bg-[#0F172A] text-white border-[#0F172A] hover:bg-slate-800')
              )}
            >
              Start Project
            </Button>
          </div>

          {/* ── MOBILE HAMBURGER / X MORPH BUTTON ── */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer',
              useHeroText ? 'border-white/30 hover:bg-white/10' : (isDark ? 'border-[#2A2A2A] hover:bg-[#1F1F1F]' : 'border-slate-200 hover:bg-slate-50')
            )}
          >
            {/* Top Bar */}
            <span
              className={cn(
                'block h-[1.5px] w-5 rounded-full transition-all duration-300 origin-center',
                useHeroText ? 'bg-white' : (isDark ? 'bg-white' : 'bg-[#0F172A]'),
                isMobileMenuOpen && 'rotate-45 translate-y-[6.5px]'
              )}
            />
            {/* Middle Bar */}
            <span
              className={cn(
                'block h-[1.5px] w-5 rounded-full transition-all duration-300',
                useHeroText ? 'bg-white' : (isDark ? 'bg-white' : 'bg-[#0F172A]'),
                isMobileMenuOpen && 'opacity-0 scale-x-0'
              )}
            />
            {/* Bottom Bar */}
            <span
              className={cn(
                'block h-[1.5px] w-5 rounded-full transition-all duration-300 origin-center',
                useHeroText ? 'bg-white' : (isDark ? 'bg-white' : 'bg-[#0F172A]'),
                isMobileMenuOpen && '-rotate-45 -translate-y-[6.5px]'
              )}
            />
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={cn(
          'fixed inset-0 z-40 backdrop-blur-lg bg-black/40 transition-opacity duration-300 md:hidden',
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden="true"
      />

      {/* ── MOBILE DRAWER ── */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 z-50 w-[300px] flex flex-col transition-transform duration-500 md:hidden',
          'shadow-2xl',
          isDark ? 'bg-[#171717] border-l border-[#2A2A2A]' : 'bg-white border-l border-slate-200',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Drawer Header */}
        <div
          className={cn(
            'flex items-center justify-between px-6 py-5 border-b',
            isDark ? 'border-[#2A2A2A]' : 'border-slate-100'
          )}
        >
          <Link
            to="/"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={cn(
              'flex items-center select-none transition-all duration-200 active:scale-95 hover:opacity-80'
            )}
          >
            <Logo className="h-8" />
          </Link>

          {/* Theme Switcher inside Drawer Header */}
          {onThemeToggle && (
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label="Toggle theme"
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 active:scale-95 cursor-pointer',
                isDark ? 'border-[#2A2A2A] text-[#FACC15]' : 'border-slate-200 text-[#CA8A04]'
              )}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Links inside Drawer (Thumb-Friendly 48px target & Staggered delay fade-in) */}
        <nav className="flex-grow flex flex-col justify-center px-6 gap-1.5">
          {NAV_ITEMS.map((item, i) => {
            const isItemActive = visibleActiveTab === item.id;
            
            // Staggered transitions
            const staggerStyles = isMobileMenuOpen
              ? {
                  opacity: 1,
                  transform: 'translateX(0)',
                  transitionDelay: `${100 + i * 50}ms`,
                }
              : {
                  opacity: 0,
                  transform: 'translateX(16px)',
                  transitionDelay: '0ms',
                };

            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={(e) => handleLinkClick(e, item)}
                style={{
                  ...staggerStyles,
                  transitionProperty: 'opacity, transform',
                  transitionDuration: '500ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className={cn(
                  'flex items-center min-h-[48px] px-4 rounded-xl text-base font-semibold transition-all duration-200 active:scale-95 select-none',
                  isDark
                    ? isItemActive
                      ? 'text-[#FACC15] bg-[#FACC15]/10'
                      : 'text-[#D4D4D4] hover:text-white hover:bg-white/5'
                    : isItemActive
                      ? 'text-[#CA8A04] bg-[#CA8A04]/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer CTA */}
        <div className={cn('p-6 border-t flex flex-col gap-3', isDark ? 'border-[#2A2A2A]' : 'border-slate-100')}>
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setIsMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-booking-modal'));
            }}
            className={cn(
              'w-full min-h-[48px]',
              isDark
                ? 'bg-[#FACC15] text-[#0F0F10] border-[#FACC15] hover:bg-[#EAB308]'
                : 'bg-[#0F172A] text-white border-[#0F172A] hover:bg-slate-800'
            )}
          >
            Book a Discovery Call
          </Button>
          
          <Button
            to="/contact"
            variant="secondary"
            onClick={(e) => {
              const contactItem = NAV_ITEMS.find((i) => i.id === 'contact');
              if (contactItem) handleLinkClick(e, contactItem);
            }}
            className={cn(
              'w-full min-h-[48px]',
              isDark
                ? 'bg-transparent text-white border-[#2A2A2A] hover:bg-[#1F1F1F]'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            )}
          >
            Start Project
          </Button>
          <p className={cn('text-center text-[10px] uppercase tracking-wider font-semibold mt-2 opacity-40')}>
            © {new Date().getFullYear()} InfinytTech
          </p>
        </div>
      </div>
    </>
  );
}
