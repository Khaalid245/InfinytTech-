import { useSyncExternalStore } from 'react';

/**
 * Custom hook to monitor match states of media queries (e.g. min-width breakpoints)
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    const media = window.matchMedia(query);
    const listener = () => callback();

    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  };

  const getSnapshot = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
export default useMediaQuery;
