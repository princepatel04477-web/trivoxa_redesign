'use client';

import { useLayoutEffect, useRef } from 'react';
import type { gsap as GSAP } from 'gsap';
import { setupGsap, ScrollTrigger, SplitText, Flip } from '@/lib/motion/gsap-setup';

export type GSAPContextSafe = {
  gsap: typeof GSAP;
  ScrollTrigger: typeof ScrollTrigger;
  SplitText: typeof SplitText;
  Flip: typeof Flip;
};

/**
 * useGSAP — the only way scroll work is created in this codebase.
 *
 * Guarantees (P4):
 *  · one gsap.context per component, scoped to its own DOM subtree;
 *  · everything created inside is reverted on unmount — a leaked
 *    ScrollTrigger is the classic cause of "animation fires on the wrong
 *    page after navigation";
 *  · plugins registered exactly once.
 */
export function useGSAP(
  callback: (safe: GSAPContextSafe) => void | (() => void),
  options: { disabled?: boolean; scope?: React.RefObject<HTMLElement | null> } = {},
): void {
  const internalRef = useRef<HTMLElement | null>(null);
  const scopeRef = options.scope ?? internalRef;
  const disabled = options.disabled ?? false;

  useLayoutEffect(() => {
    if (disabled) return;

    const g = setupGsap();
    let cleanup: void | (() => void);

    const context = g.context(() => {
      cleanup = callback({ gsap: g, ScrollTrigger, SplitText, Flip });
    }, scopeRef.current ?? undefined);

    return () => {
      if (typeof cleanup === 'function') cleanup();
      context.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
