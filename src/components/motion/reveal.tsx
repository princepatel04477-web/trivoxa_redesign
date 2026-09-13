'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from './use-gsap';
import { DISTANCE, DURATION, EASE_GSAP, STAGGER, STAGGER_MAX_ITEMS } from '@/lib/tokens/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { usePerfTier } from '@/lib/perf-tier';

export type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  /** Stagger direct children instead of the wrapper. Capped at 8 items. */
  staggerChildren?: boolean;
  distance?: keyof typeof DISTANCE;
  delay?: number;
  className?: string;
  /** Where in the viewport the reveal fires. */
  start?: string;
  once?: boolean;
  id?: string;
};

/**
 * <Reveal> — fade + 24px rise, ScrollTrigger, once.
 *
 * Guarantees:
 *  - Server renders content at its FINAL position with no inline styles;
 *  - Fails open: 2.5s safety timeout forces final visible state if ScrollTrigger stalls;
 *  - Under `prefers-reduced-motion` or `perfTier === 'low'`, animation is disabled;
 *  - Global CSS enforces `opacity: 1 !important` under reduced motion;
 *  - Stagger is capped at 8 items so large grids don't read as loading spinners.
 */
export function Reveal({
  children,
  as: As = 'div',
  staggerChildren = false,
  distance = 'reveal',
  delay = 0,
  className,
  start = 'top 82%',
  once = true,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const tier = usePerfTier();
  const Tag = As as React.ComponentType<Record<string, unknown>>;

  const disabled = reduced || tier === 'low';

  useGSAP(
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;

      const each = STAGGER.base / 1000;
      const targets = staggerChildren ? Array.from(root.children) : root;

      let settled = false;
      const settle = (): void => {
        if (settled) return;
        settled = true;
        gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform,opacity' });
      };

      // Failsafe timer: content-visibility must fail open
      const failsafe = setTimeout(settle, 2500);

      gsap.from(targets, {
        y: DISTANCE[distance],
        opacity: 0,
        duration: DURATION.base / 1000,
        ease: EASE_GSAP.outExpo,
        immediateRender: true,
        delay: delay / 1000,
        stagger: staggerChildren
          ? (index: number) => Math.min(index, STAGGER_MAX_ITEMS - 1) * each
          : 0,
        scrollTrigger: { trigger: root, start, once },
        onComplete: () => {
          clearTimeout(failsafe);
          settle();
        },
      });

      return () => clearTimeout(failsafe);
    },
    { disabled, scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-reveal className={className}>
      {children}
    </Tag>
  );
}
