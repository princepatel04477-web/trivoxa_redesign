'use client';

import type { ReactNode } from 'react';

/**
 * Entrance timing for the hero's non-headline copy (P6, rebuilt in P20):
 * sub +200ms, CTAs +320ms, scroll cue +600ms — after the headline's mask
 * reveal.
 *
 * This used to be Motion. It is now a CSS animation, because the hero copy sits
 * on the LCP path: a JavaScript-driven entrance means the browser has to
 * download, parse and execute an animation library before the largest element on
 * the page can settle at opacity 1. CSS costs nothing, cannot be delayed by a
 * slow main thread, and honours `prefers-reduced-motion` in the stylesheet (see
 * `.hero-copy-enter` in globals.css), so reduced-motion visitors get the copy
 * immediately with no animation at all.
 */
export function HeroCopyMotion({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <div className="hero-copy-enter" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
