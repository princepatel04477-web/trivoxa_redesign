'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import Noise from '@/components/reactbits/Noise/Noise';

/**
 * The exit is driven by the split-flap actually finishing (Surat → Trivoxa),
 * not by a wall-clock guess — timers started at hydration raced the flip and,
 * on slow devices, wiped the overlay away while tiles were still mid-scramble.
 * Once TRIVOXA has settled it holds for HOLD_AFTER_FLIP_MS so it can be read,
 * then wipes as soon as the page has loaded.
 *
 * HARD_CAP_MS is measured from navigation start (performance.now()), so a slow
 * connection or a stalled flip can never hold the visitor hostage.
 */
const HOLD_AFTER_FLIP_MS = 450;
const HARD_CAP_MS = 4500;
const MIN_TIME_AFTER_MOUNT_MS = 1500;

export function Preloader() {
  const [show, setShow] = useState<boolean>(true);
  const reducedMotion = useReducedMotion();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const exitedRef = useRef<boolean>(false);
  const flipHeldRef = useRef<boolean>(false);
  const pageLoadedRef = useRef<boolean>(false);
  const flipHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFlipCompleteRef = useRef<(() => void) | null>(null);

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
      if (flipHeldRef.current && pageLoadedRef.current) exitPreloader();
    };
    flipHeldRef.current = false;
    flipHoldTimerRef.current = null;

    pageLoadedRef.current = document.readyState === 'complete';
    const handleLoad = () => {
      pageLoadedRef.current = true;
      maybeExit();
    };
    if (!pageLoadedRef.current) {
      window.addEventListener('load', handleLoad, { once: true });
    }

    // Called by SplitFlapText once TRIVOXA has fully settled.
    onFlipCompleteRef.current = () => {
      if (flipHoldTimerRef.current) return;
      flipHoldTimerRef.current = setTimeout(() => {
        flipHeldRef.current = true;
        maybeExit();
      }, HOLD_AFTER_FLIP_MS);
    };

    // Hard fallback: force remove no matter what, so slow assets never strand the visitor
    const sinceNavStart = typeof performance !== 'undefined' ? performance.now() : 0;
    const fallbackTimer = setTimeout(
      () => exitPreloader(),
      Math.max(MIN_TIME_AFTER_MOUNT_MS, HARD_CAP_MS - sinceNavStart)
    );

    return () => {
      window.removeEventListener('load', handleLoad);
      onFlipCompleteRef.current = null;
      if (flipHoldTimerRef.current) clearTimeout(flipHoldTimerRef.current);
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
          onComplete={() => onFlipCompleteRef.current?.()}
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
