'use client';

import { useRef } from 'react';
import { useGSAP } from './use-gsap';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * <ScrollProgress> — a 1px bronze hairline across the top of long pages.
 * One gesture. It is the only scroll-position ornament the site allows.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    ({ gsap }) => {
      const bar = ref.current;
      if (!bar) return;

      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        },
      );
    },
    { disabled: reduced },
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px origin-left bg-bronze/70"
      ref={ref}
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
