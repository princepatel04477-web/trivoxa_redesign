'use client';

import React, { useEffect, type ReactNode } from 'react';
import { ScrollTrigger } from './gsap';

/**
 * LenisProvider — Preserves native, responsive 120Hz browser scrolling.
 *
 * Artificial JS scroll-jacking with high durations (e.g. 1.2s lerp) causes
 * floatiness, input lag, and motion nausea on desktop wheels and precision trackpads.
 * Native browser scrolling gives 1:1 tactile precision, zero latency, and hardware
 * acceleration. GSAP's ScrollTrigger tracks window scrolling natively.
 *
 * What it DOES own is keeping ScrollTrigger's measured trigger positions honest.
 * Triggers are measured once when a component mounts; when webfonts swap in,
 * images decode or an accordion opens, the page reflows and every measured
 * position below that point goes stale — reveals then fire late, early, or (for
 * content already on screen) never. So we re-measure when fonts are ready, on
 * load, and whenever the document height genuinely changes.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const refresh = (): void => {
      if (cancelled) return;
      ScrollTrigger.refresh();
    };

    // Debounced so a burst of reflows (image decodes, font swaps) costs one refresh.
    const scheduleRefresh = (delay = 200): void => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(refresh, delay);
    };

    scheduleRefresh(0);

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => scheduleRefresh(50));
    }
    const onLoad = (): void => scheduleRefresh(50);
    if (document.readyState !== 'complete') {
      window.addEventListener('load', onLoad, { once: true });
    }

    let lastHeight = document.documentElement.scrollHeight;
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        const height = document.documentElement.scrollHeight;
        // Ignore sub-perceptible changes (and our own pin-spacer churn).
        if (Math.abs(height - lastHeight) < 24) return;
        lastHeight = height;
        scheduleRefresh(250);
      });
      observer.observe(document.body);
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.removeEventListener('load', onLoad);
      observer?.disconnect();
    };
  }, []);

  return <>{children}</>;
}
