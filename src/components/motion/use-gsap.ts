'use client';

import { useLayoutEffect, useRef } from 'react';
import { loadGsap, peekGsap, type GsapBundle } from '@/lib/motion/gsap-setup';

/**
 * useGSAP — the only way scroll work is created in this codebase.
 *
 * Guarantees (P4, updated by P20):
 *  · one gsap.context per component, scoped to its own DOM subtree;
 *  · everything created inside is reverted on unmount — a leaked ScrollTrigger
 *    is the classic cause of "animation fires on the wrong page after
 *    navigation";
 *  · plugins registered exactly once, inside `loadGsap()`;
 *  · GSAP arrives asynchronously (it is off the critical path now), so the hook
 *    runs the callback synchronously when the bundle is already cached — the
 *    common case, because the download starts during hydration — and otherwise
 *    runs it the moment it lands, cancelling cleanly if the component unmounts
 *    first.
 *
 * Components must therefore be correct WITHOUT their animation: everything
 * animated here is server-rendered and visible in its final state first.
 */
export function useGSAP(
  callback: (bundle: GsapBundle) => void | (() => void),
  options: { disabled?: boolean; scope?: React.RefObject<HTMLElement | null> } = {},
): void {
  const internalRef = useRef<HTMLElement | null>(null);
  const scopeRef = options.scope ?? internalRef;
  const disabled = options.disabled ?? false;

  useLayoutEffect(() => {
    if (disabled) return;

    let context: ReturnType<GsapBundle['gsap']['context']> | null = null;
    let cleanup: void | (() => void);
    let cancelled = false;

    const run = (bundle: GsapBundle): void => {
      context = bundle.gsap.context(() => {
        cleanup = callback(bundle);
      }, scopeRef.current ?? undefined);
    };

    const ready = peekGsap();
    if (ready) {
      run(ready);
    } else {
      void loadGsap().then((bundle) => {
        if (!cancelled) run(bundle);
      });
    }

    return () => {
      cancelled = true;
      if (typeof cleanup === 'function') cleanup();
      context?.revert();
      context = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);
}
