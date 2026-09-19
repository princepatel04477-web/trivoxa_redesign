'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { BrandMark, BrandWordmark } from '@/components/ui/brand-lockup';

/**
 * Trivoxa loader — the eagle mark and wordmark reveal, a progress line, then a
 * curtain lift onto the page.
 *
 * Timing model
 *  · The reveal is pure CSS (see `.preloader-*` in globals.css). It is part of the
 *    server-rendered HTML, so it starts at first paint instead of waiting for
 *    hydration and never depends on the main thread being free.
 *  · JS only decides WHEN to leave: once MIN_TOTAL_MS has passed since navigation
 *    start (so the reveal always finishes) AND the page has loaded. HARD_CAP_MS
 *    guarantees a slow network or a stalled asset can never trap the visitor.
 *  · The exit is a compositor-only transform (translateY), not an animated
 *    clip-path, so it stays smooth while the page underneath is still busy.
 *  · Return visits and reduced-motion users never see it (head script in
 *    layout.tsx hides it before first paint).
 */
const MIN_TOTAL_MS = 1900;
const HARD_CAP_MS = 4200;
const EXIT_MS = 800;
/** How far into the exit the page's own entrance animations are released. */
const READY_AT_MS = 280;

/**
 * Tells the page the overlay is lifting. Entrance animations (see `.hero-copy-enter`
 * in globals.css) wait for this attribute, so they play as the curtain rises instead
 * of finishing unseen underneath it.
 */
function signalReady(): void {
  document.documentElement.setAttribute('data-preloader-done', '');
  window.dispatchEvent(new CustomEvent('trivoxa:ready'));
}

export function Preloader() {
  const [show, setShow] = useState<boolean>(true);
  const reducedMotion = useReducedMotion();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const exitedRef = useRef<boolean>(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const exitPreloader = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    try {
      sessionStorage.setItem('trivoxa_preloader_seen', 'true');
    } catch {
      // Storage can be blocked (private mode, embedded contexts) — not fatal.
    }

    const el = preloaderRef.current ?? document.getElementById('trivoxa-preloader');
    if (!el) {
      setShow(false);
      signalReady();
      return;
    }

    el.classList.add('preloader-exit');
    timersRef.current.push(setTimeout(signalReady, READY_AT_MS));
    timersRef.current.push(setTimeout(() => setShow(false), EXIT_MS + 60));
  };

  useEffect(() => {
    // Always start a visit from the top, instantly (the page is smooth-scroll by default).
    if (!window.location.hash) {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    if (reducedMotion) {
      setShow(false);
      signalReady();
      return;
    }

    try {
      if (sessionStorage.getItem('trivoxa_preloader_seen')) {
        setShow(false);
        signalReady();
        return;
      }
    } catch {
      setShow(false);
      signalReady();
      return;
    }

    let minElapsed = false;
    let loaded = document.readyState === 'complete';
    const maybeExit = () => {
      if (minElapsed && loaded) exitPreloader();
    };

    const onLoad = () => {
      loaded = true;
      maybeExit();
    };
    if (!loaded) window.addEventListener('load', onLoad, { once: true });

    // Measured from navigation start, so a slow hydration doesn't stack extra wait on top.
    const sinceNavStart = performance.now();
    timersRef.current.push(
      setTimeout(() => {
        minElapsed = true;
        maybeExit();
      }, Math.max(0, MIN_TOTAL_MS - sinceNavStart)),
      setTimeout(exitPreloader, Math.max(1200, HARD_CAP_MS - sinceNavStart))
    );

    return () => {
      window.removeEventListener('load', onLoad);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [reducedMotion]);

  if (!show) return null;

  return (
    <div
      id="trivoxa-preloader"
      ref={preloaderRef}
      onClick={exitPreloader}
      role="status"
      aria-live="polite"
      aria-label="Loading Trivoxa Group"
      className="preloader bg-espresso-deep text-ivory fixed inset-0 z-[10000] flex cursor-pointer select-none flex-col items-center justify-center"
      title="Click to skip"
    >
      <div className="preloader-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="preloader-content relative z-10 flex flex-col items-center">
        <BrandMark size={96} decorative className="preloader-mark" />
        <BrandWordmark height={46} decorative className="preloader-word mt-6" />
        <span className="preloader-track mt-10" aria-hidden="true">
          <span className="preloader-bar" />
        </span>
      </div>

      <span className="sr-only">Loading</span>

      <div className="preloader-foot text-bronze/70 absolute right-8 bottom-8 left-8 flex items-center justify-between font-mono text-[11px] tracking-widest uppercase">
        <span>Surat &rarr; Global</span>
        <span className="opacity-70">Click to skip</span>
      </div>
    </div>
  );
}
