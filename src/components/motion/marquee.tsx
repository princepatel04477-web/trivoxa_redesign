'use client';

import type { ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

export type MarqueeProps = {
  children: ReactNode;
  /** Pixels per second. Duration is derived so speed is constant regardless
   *  of how many items the content model hands us. */
  speed?: number;
  className?: string;
  /** Accessible label for the band. The band itself is aria-hidden; meaning
   *  lives in adjacent text or this label. */
  label?: string;
  reverse?: boolean;
};

/**
 * <Marquee> — the site's single ticker idiom (ports / corridors / logos).
 *
 * CSS-driven, not JS: two duplicated tracks translate on a keyframe, paused
 * on hover and on focus-within so a keyboard user can actually read an item.
 * Under prefers-reduced-motion the animation stops and the band becomes a
 * plain horizontally-scrollable row — content never disappears.
 */
export function Marquee({ children, speed = 48, className, label, reverse = false }: MarqueeProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      role={label ? 'marquee' : undefined}
      aria-label={label}
      className={cn('group relative overflow-hidden', className)}
    >
      <div
        data-marquee
        className={cn('marquee-track flex w-max', reduced && 'marquee-static')}
        style={{
          ['--marquee-duration' as string]: `${Math.max(12, 1000 / speed) * 12}s`,
          ['--marquee-direction' as string]: reverse ? 'reverse' : 'normal',
        }}
      >
        <div aria-hidden={false} className="flex shrink-0 items-center">
          {children}
        </div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
