'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import Noise from '@/components/reactbits/Noise/Noise';

/**
 * Minimum time the mark stays on screen once shown, so the split-flap
 * transition (Surat → Trivoxa) always completes instead of being cut off
 * mid-flip. Exit fires at max(MIN_DISPLAY_MS, page load), capped by
 * MAX_DISPLAY_MS so a slow connection never holds the visitor hostage.
 */
const MIN_DISPLAY_MS = 900;
const MAX_DISPLAY_MS = 2000;

export function Preloader() {
  const [show, setShow] = useState<boolean>(true);
  const reducedMotion = useReducedMotion();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const exitedRef = useRef<boolean>(false);
  const minElapsedRef = useRef<boolean>(false);
  const pageLoadedRef = useRef<boolean>(false);

  const exitPreloader = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    try {
      sessionStorage.setItem('trivoxa_preloader_seen', 'true');
    } catch {
      // Ignore storage errors in restricted contexts
    }

    const el = preloaderRef.current || document.getElementById('trivoxa-preloader');
    if (el) {
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => {
          setShow(false);
          window.dispatchEvent(new CustomEvent('trivoxa:ready'));
        },
      });
    } else {
      setShow(false);
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
    }
  };

  useEffect(() => {
    // Ensure clean initial scroll to top of fold on visit
    if (typeof window !== 'undefined' && !window.location.hash) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    if (reducedMotion) {
      setShow(false);
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
      return;
    }

    try {
      const seen = sessionStorage.getItem('trivoxa_preloader_seen');
      if (seen) {
        setShow(false);
        window.dispatchEvent(new CustomEvent('trivoxa:ready'));
        return;
      }
    } catch {
      setShow(false);
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
      return;
    }

    const maybeExit = () => {
      if (minElapsedRef.current && pageLoadedRef.current) exitPreloader();
    };

    pageLoadedRef.current = document.readyState === 'complete';
    const handleLoad = () => {
      pageLoadedRef.current = true;
      maybeExit();
    };
    if (!pageLoadedRef.current) {
      window.addEventListener('load', handleLoad, { once: true });
    }

    const minTimer = setTimeout(() => {
      minElapsedRef.current = true;
      maybeExit();
    }, MIN_DISPLAY_MS);

    // Hard fallback: force remove no matter what, so slow assets never strand the visitor
    const fallbackTimer = setTimeout(() => {
      exitPreloader();
    }, MAX_DISPLAY_MS);

    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(minTimer);
      clearTimeout(fallbackTimer);
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
      className="bg-espresso-deep text-ivory fixed inset-0 z-[10000] flex cursor-pointer select-none flex-col items-center justify-center"
      style={{ clipPath: 'inset(0 0 0 0)' }}
      title="Click to skip"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={2} patternAlpha={12} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <SplitFlapText
          words={['SURAT', 'TRIVOXA']}
          padTo={7}
          loop={false}
          flipDuration={0.05}
          flipsPerChar={3}
          stagger={0.03}
          cycleDelay={280}
          textColor="var(--color-ivory)"
          tileColor="var(--color-espresso)"
          fontSize="clamp(28px, 6vw, 48px)"
        />
        <span aria-hidden="true" className="bg-bronze h-px w-10 origin-center scale-x-0 animate-[preloader-rule_0.5s_var(--ease-house)_0.4s_forwards]" />
      </div>

      <span className="sr-only">Loading</span>

      <div className="text-bronze/70 absolute bottom-8 left-8 right-8 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
        <span>Surat &rarr; Global</span>
        <span className="opacity-70">Click to skip</span>
      </div>

      <style>{`@keyframes preloader-rule { to { transform: scaleX(1); } }`}</style>
    </div>
  );
}
