'use client';

import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { useGSAP } from '@/components/motion/use-gsap';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { EASE_GSAP } from '@/lib/tokens/motion';

type HeadlineDoneHandler = () => void;

/**
 * The headline (`.kinetic-word`) is owned entirely by <KineticTextReveal> —
 * this timeline used to also `gsap.set`/animate the same elements, and the
 * two effects raced each other (whichever mounted second could reset the
 * headline mid-animation). Instead, the hero wires KineticTextReveal's
 * `onComplete` to `useHeroHeadlineComplete()`, and everything below the
 * headline waits for that signal before it plays.
 */
const HeroHeadlineContext = createContext<HeadlineDoneHandler | null>(null);

export function useHeroHeadlineComplete(): HeadlineDoneHandler {
  const handler = useContext(HeroHeadlineContext);
  return handler ?? (() => {});
}

export function HeroEntranceTimeline({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const headlineDoneRef = useRef<HeadlineDoneHandler>(() => {});

  // Built on `useGSAP` — its `gsap.context()` + `.revert()` cleanup, rather
  // than a manual `.kill()`, is what keeps this safe under React StrictMode's
  // dev-mode mount→cleanup→mount (see kinetic-text-reveal.tsx for the failure
  // mode a raw `.kill()` on a freshly-created tween can leave behind).
  useGSAP(
    ({ gsap }) => {
      const root = rootRef.current;
      if (!root) return;

      const eyebrowRule = root.querySelector<HTMLElement>('.hero-eyebrow-rule');
      const eyebrowText = root.querySelector<HTMLElement>('.hero-eyebrow-text');
      const lede = root.querySelector<HTMLElement>('.hero-lede');
      const ctas = root.querySelectorAll<HTMLElement>('.hero-cta');
      const proofRibbon = root.querySelector<HTMLElement>('.hero-proof-ribbon');
      const scrollCue = root.querySelector<HTMLElement>('.hero-scroll-cue');

      // 1. Eyebrow entrance — runs immediately; it never touches the headline.
      const eyebrowTimeline = gsap.timeline({ defaults: { ease: EASE_GSAP.outExpo } });
      if (eyebrowRule) {
        gsap.set(eyebrowRule, { scaleX: 0, transformOrigin: '0% 50%' });
        eyebrowTimeline.to(eyebrowRule, { scaleX: 1, duration: 0.6 }, 0);
      }
      if (eyebrowText) {
        gsap.set(eyebrowText, { yPercent: 100, opacity: 0 });
        eyebrowTimeline.to(eyebrowText, { yPercent: 0, opacity: 1, duration: 0.6 }, 0.08);
      }

      // 2. Everything below the headline — built paused, played once the
      // headline (owned by KineticTextReveal) reports itself done.
      const restTimeline = gsap.timeline({ paused: true, defaults: { ease: EASE_GSAP.outExpo } });

      if (lede) {
        gsap.set(lede, { y: 24, opacity: 0 });
        restTimeline.to(lede, { y: 0, opacity: 1, duration: 0.75 }, 0);
      }
      if (ctas.length > 0) {
        gsap.set(ctas, { y: 18, opacity: 0, scale: 0.97 });
        restTimeline.to(
          ctas,
          { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.09 },
          0.14,
        );
      }
      if (proofRibbon) {
        gsap.set(proofRibbon, { y: 16, opacity: 0 });
        restTimeline.to(proofRibbon, { y: 0, opacity: 1, duration: 0.65 }, 0.3);
      }
      if (scrollCue) {
        gsap.set(scrollCue, { opacity: 0 });
        restTimeline.to(scrollCue, { opacity: 1, duration: 0.5 }, 0.45);
      }

      headlineDoneRef.current = () => {
        restTimeline.play();
      };

      return () => {
        headlineDoneRef.current = () => {};
      };
    },
    { disabled: reduced, scope: rootRef },
  );

  const onHeadlineComplete = useCallback(() => {
    headlineDoneRef.current();
  }, []);

  return (
    <HeroHeadlineContext.Provider value={onHeadlineComplete}>
      <div ref={rootRef}>{children}</div>
    </HeroHeadlineContext.Provider>
  );
}
