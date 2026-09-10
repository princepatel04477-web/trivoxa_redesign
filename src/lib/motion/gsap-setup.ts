'use client';

import type { gsap as GsapCore } from 'gsap';
import type { ScrollTrigger as ScrollTriggerPlugin } from 'gsap/ScrollTrigger';
import type { SplitText as SplitTextPlugin } from 'gsap/SplitText';
import type { Flip as FlipPlugin } from 'gsap/Flip';

/**
 * GSAP, loaded OFF the critical path (P20).
 * ---------------------------------------------------------------------------
 * The animation stack was 130 kB gzipped of blocking JavaScript on the homepage
 * (GSAP and its plugins ≈ 77 kB, Motion ≈ 43 kB, Lenis ≈ 9 kB) against a budget
 * of 180 kB for everything. Every one of those libraries is progressive
 * enhancement: the HTML is complete and readable without them, and the headings,
 * numbers and tables are server-rendered.
 *
 * So they are dynamically imported. Two consequences, both stated plainly:
 *
 *  · `loadGsap()` is asynchronous. Call sites either use `useGSAP()` (which
 *    handles it) or check `peekGsap()` first and fall back to `loadGsap()` —
 *    the pattern the catalogue's Flip transition uses, because a Flip has to run
 *    in the same frame as the DOM change and by the time a buyer clicks a filter
 *    the bundle is long since cached.
 *  · The import is kicked off as soon as this module is first evaluated on the
 *    client, which happens during hydration. Total bytes transferred are
 *    therefore unchanged; what changes is that parsing and executing ~77 kB no
 *    longer blocks first paint, and a visitor who never scrolls past the hero on
 *    a slow connection never pays for SplitText at all.
 *
 * ScrollSmoother is a Club plugin and is not licensed here — Lenis covers smooth
 * scrolling instead, wired to GSAP's ticker so ScrollTrigger stays in sync.
 */

export type GsapBundle = {
  gsap: typeof GsapCore;
  ScrollTrigger: typeof ScrollTriggerPlugin;
  SplitText: typeof SplitTextPlugin;
  Flip: typeof FlipPlugin;
};

let cached: GsapBundle | null = null;
let pending: Promise<GsapBundle> | null = null;

/** Synchronous access for frame-critical callers. `null` until loaded. */
export function peekGsap(): GsapBundle | null {
  return cached;
}

/** Load (once) and register the plugins. Safe to call from many components. */
export function loadGsap(): Promise<GsapBundle> {
  if (cached) return Promise.resolve(cached);
  if (pending) return pending;

  pending = Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('gsap/SplitText'),
    import('gsap/Flip'),
  ]).then(([{ gsap }, { ScrollTrigger }, { SplitText }, { Flip }]) => {
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
    gsap.defaults({ ease: 'power4.out', duration: 0.4 });

    cached = { gsap, ScrollTrigger, SplitText, Flip };
    return cached;
  });

  return pending;
}

/**
 * Kick the download off during hydration rather than waiting for the first
 * scroll animation to ask for it. Client-only, and a failed fetch is not fatal —
 * every consumer treats GSAP as optional.
 */
if (typeof window !== 'undefined') {
  void loadGsap().catch(() => {
    pending = null;
  });
}
