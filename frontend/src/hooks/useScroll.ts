import { useState, useEffect } from 'react';

interface ScrollState {
  y: number;
  x: number;
  isScrolled: boolean;
}

/**
 * Custom hook to monitor window scroll coordinates and scrolled threshold status.
 */
export function useScroll(threshold = 20): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    y: 0,
    x: 0,
    isScrolled: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const y = window.scrollY;
      const x = window.scrollX;
      setScrollState({
        y,
        x,
        isScrolled: y > threshold,
      });
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrollState;
}
export default useScroll;
