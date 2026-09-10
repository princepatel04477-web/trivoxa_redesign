'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from './use-gsap';
import { PARALLAX_MAX_TRAVEL } from '@/lib/tokens/motion';
import { clamp } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * <Parallax> — subtle vertical travel on scroll, hard-capped at 12% of the
 * element's height. Anything more and the site starts feeling like a demo
 * reel instead of a trading company.
 */
export function Parallax({
  children,
  travel = 0.08,
  className,
}: {
  children: ReactNode;
  /** Fraction of element height. Clamped to PARALLAX_MAX_TRAVEL. */
  travel?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const amount = clamp(travel, 0, PARALLAX_MAX_TRAVEL);

  useGSAP(
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;

      const distance = root.offsetHeight * amount;

      gsap.fromTo(
        root,
        { y: -distance / 2 },
        {
          y: distance / 2,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    },
    { disabled: reduced, scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
