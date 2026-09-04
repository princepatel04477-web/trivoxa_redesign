'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { setupGsap, ScrollTrigger } from '@/lib/motion/gsap-setup';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { usePerfTier } from '@/lib/perf-tier';

/**
 * SmoothScroll — Lenis, wired to GSAP's ticker so ScrollTrigger never drifts
 * from the smoother (P4).
 *
 * Disabled entirely under prefers-reduced-motion and at perf tier `low`:
 * buyers on mid-tier mobile in our target markets get native scrolling, which
 * is both faster and less nauseating than a JS smoother fighting their GPU.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const tier = usePerfTier();

  useEffect(() => {
    if (reduced || tier === 'low') return;
    if (window.matchMedia('(pointer: coarse)').matches && tier !== 'high') return;

    const gsap = setupGsap();

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    const onScroll = (): void => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const tick = (time: number): void => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, [reduced, tier]);

  return <>{children}</>;
}
