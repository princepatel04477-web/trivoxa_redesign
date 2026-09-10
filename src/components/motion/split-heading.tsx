'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from './use-gsap';
import { DURATION, EASE_GSAP, STAGGER } from '@/lib/tokens/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

export type SplitHeadingProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Line stagger in ms. */
  stagger?: number;
  duration?: number;
  start?: string;
  id?: string;
};

/**
 * <SplitHeading> — GSAP SplitText per-line mask reveal for display headings.
 *
 * Each line is wrapped in an overflow-hidden mask at runtime and rises from
 * yPercent 100 on the house curve. Before JS (and under reduced motion) the
 * heading is plain, fully-visible text — the mask wrappers only exist once
 * the animation is definitely going to run.
 */
export function SplitHeading({
  children,
  as: As = 'h2',
  className,
  stagger = STAGGER.loose,
  duration = DURATION.slow,
  start = 'top 85%',
  id,
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const Tag = As as React.ComponentType<Record<string, unknown>>;

  useGSAP(
    ({ gsap, SplitText }) => {
      const root = ref.current;
      if (!root) return;

      const split = new SplitText(root as HTMLElement, { type: 'lines' });
      const lines = split.lines as HTMLElement[];
      if (lines.length === 0) return;

      // Wrap each line in its own mask so the rise is clipped, not floating.
      const masks = lines.map((line) => {
        const mask = document.createElement('span');
        mask.style.display = 'block';
        mask.style.overflow = 'hidden';
        mask.style.paddingBottom = '0.06em';
        mask.style.marginBottom = '-0.06em';
        line.parentNode?.insertBefore(mask, line);
        mask.appendChild(line);
        line.style.display = 'block';
        return mask;
      });

      gsap.from(lines, {
        yPercent: 108,
        duration: duration / 1000,
        ease: EASE_GSAP.house,
        stagger: stagger / 1000,
        immediateRender: true,
        scrollTrigger: { trigger: root, start, once: true },
      });

      return () => {
        masks.forEach((mask) => {
          const child = mask.firstChild;
          if (child) mask.parentNode?.insertBefore(child, mask);
          mask.remove();
        });
        split.revert();
      };
    },
    { disabled: reduced, scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {children}
    </Tag>
  );
}
