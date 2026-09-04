'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { DURATION, EASE_MOTION } from '@/lib/tokens/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * RouteProgress — the route-change indicator (P3).
 *
 * A 1px bronze hairline that runs to ~70% on navigation start and completes on
 * commit. Distinct from <ScrollProgress>, which reports page position. Under
 * reduced motion it is simply absent.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const barRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const first = useRef(true);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || reduced) return;
    if (first.current) {
      first.current = false;
      return;
    }

    bar.style.opacity = '1';
    bar.style.transform = 'scaleX(0)';

    let run: { stop: () => void } | null = null;
    let finish: { stop: () => void } | null = null;
    let cancelled = false;

    // Motion is the right tool for this (an imperative, interruptible tween on a
    // DOM node), but it is imported only when a navigation actually happens —
    // the first route change, not first paint.
    void import('motion/react').then(({ animate }) => {
      if (cancelled) return;
      run = animate(bar, { scaleX: [0, 0.7] }, { duration: DURATION.slow / 1000, ease: 'easeOut' }) as unknown as {
        stop: () => void;
      };
      finish = animate(
        bar,
        { scaleX: 1, opacity: [1, 0] },
        { duration: DURATION.fast / 1000, ease: EASE_MOTION.house, delay: 0.12 },
      ) as unknown as { stop: () => void };
    });

    return () => {
      cancelled = true;
      run?.stop();
      finish?.stop();
    };
    }, [pathname, searchParams, reduced]);

  if (reduced) return null;

  return (
    <div
      ref={barRef}
      aria-hidden
      className="bg-bronze pointer-events-none fixed inset-x-0 top-0 z-[80] h-px origin-left"
      style={{ transform: 'scaleX(0)', opacity: 0 }}
    />
  );
}
