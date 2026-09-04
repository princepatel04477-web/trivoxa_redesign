'use client';

import { useEffect } from 'react';
import 'lenis/dist/lenis.css';
import { loadGsap } from '@/lib/motion/gsap-setup';
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

    let disposed = false;
    let teardown: (() => void) | null = null;

    // Lenis is imported with GSAP: a smoother without ScrollTrigger in sync is
    // worse than native scrolling, and neither belongs in blocking JS.
    void Promise.all([loadGsap(), import('lenis')]).then(([bundle, lenisModule]) => {
      if (disposed) return;

      const Lenis = lenisModule.default;
      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      const onScroll = (): void => bundle.ScrollTrigger.update();
      lenis.on('scroll', onScroll);

      const tick = (time: number): void => lenis.raf(time * 1000);
      bundle.gsap.ticker.add(tick);
      bundle.gsap.ticker.lagSmoothing(0);

      teardown = () => {
        bundle.gsap.ticker.remove(tick);
        lenis.off('scroll', onScroll);
        lenis.destroy();
      };
    });

    return () => {
      disposed = true;
      teardown?.();
    };
  }, [reduced, tier]);

  return <>{children}</>;
}
