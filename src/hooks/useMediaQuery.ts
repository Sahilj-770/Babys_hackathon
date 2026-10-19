import { useState, useEffect } from 'react';

/**
 * Custom hook to track CSS media queries cleanly with cleanup and SSR safety.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQueryList = window.matchMedia(query);
    const updateMatch = (e: MediaQueryListEvent) => setMatches(e.matches);

    mediaQueryList.addEventListener('change', updateMatch);
    return () => mediaQueryList.removeEventListener('change', updateMatch);
  }, [query]);

  return matches;
}
