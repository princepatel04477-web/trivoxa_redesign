'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from './use-gsap';
import { DISTANCE, DURATION, EASE_GSAP, STAGGER, STAGGER_MAX_ITEMS } from '@/lib/tokens/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

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
 * The server renders content at its FINAL position with no inline styles, so
 * a visitor with JS blocked or slow sees everything immediately. The start
 * state is applied in useLayoutEffect (before paint) via immediateRender,
 * which avoids both a flash-of-final-content and a CLS hit.
 *
 * Stagger is capped: item 9 and beyond enter together with item 8 rather than
 * waiting their turn — a capped stagger reads as confidence, an uncapped one
 * reads as a loading spinner.
 *
 * Under prefers-reduced-motion nothing is transformed: content simply is.
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
  // Polymorphic tag: props are validated by our own RevealProps, not by the
  // union of every intrinsic element (which collapses to `never`).
  const Tag = As as React.ComponentType<Record<string, unknown>>;

  useGSAP(
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;

      const each = STAGGER.base / 1000;

      gsap.from(staggerChildren ? Array.from(root.children) : root, {
        y: DISTANCE[distance],
        opacity: 0,
        duration: DURATION.base / 1000,
        ease: EASE_GSAP.outExpo,
        immediateRender: true,
        delay: delay / 1000,
        // Function-based stagger = the cap. Sibling 9+ enters with sibling 8.
        stagger: staggerChildren
          ? (index: number) => Math.min(index, STAGGER_MAX_ITEMS - 1) * each
          : 0,
        scrollTrigger: { trigger: root, start, once },
      });
    },
    { disabled: reduced, scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
