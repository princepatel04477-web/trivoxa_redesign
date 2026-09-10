'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * SSR-safe `prefers-reduced-motion`.
 *
 * The server assumes NO preference (full motion) so the initial HTML is the
 * "rich" variant; the client corrects within the same frame it hydrates, and
 * every motion component's reduced path renders content at its FINAL position
 * — so the correction is a no-op visually and can never flash or shift layout.
 *
 * Listens for changes, because P20's acceptance test toggles the OS setting on
 * a running page and expects the whole site to respond.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);

    const onChange = (event: MediaQueryListEvent): void => setReduced(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Non-hook read, for GSAP timelines and event handlers. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(QUERY).matches;
}
