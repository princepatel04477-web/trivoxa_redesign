'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from './use-gsap';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

export type KineticTextRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger between words in seconds (default: 0.035s / 35ms) */
  stagger?: number;
  /** Duration of each word animation in seconds (default: 0.85s) */
  duration?: number;
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number;
  /** If true, fires immediately without ScrollTrigger (for above-the-fold hero titles) */
  isHero?: boolean;
  /** ScrollTrigger start position for below-the-fold elements (default: 'top 85%') */
  start?: string;
  id?: string;
  /**
   * Fires once the word reveal completes. Lets a parent (e.g. the hero's
   * entrance timeline) sequence its own elements off this instead of also
   * reaching into `.kinetic-word` itself — this component is the only owner
   * of that animation.
   */
  onComplete?: () => void;
};

/**
 * <KineticTextReveal> — Master text reveal animation powered by GSAP.
 *
 * Each word is wrapped in an overflow-hidden mask container. Words rise from
 * behind the mask (`yPercent: 125 -> 0`) with subtle 3D perspective rotation
 * and exponential deceleration.
 *
 * Built on `useGSAP` (not a hand-rolled effect + manual `.kill()`) so cleanup
 * goes through `gsap.context().revert()` — the same StrictMode-safe pattern
 * every other GSAP consumer in this codebase (`<Reveal>`, `<MagneticButton>`,
 * `SiteHeader`) uses, instead of reimplementing the load/cancel dance here.
 *
 * Guarantees:
 * - Server-rendered and readable before JavaScript hydrates.
 * - No font-swapping line break collapse: words wrap naturally based on actual CSS.
 * - Instant display under `prefers-reduced-motion`.
 */
export function KineticTextReveal({
  children,
  as: As = 'h2',
  className,
  stagger = 0.035,
  duration = 0.85,
  delay = 0,
  isHero = false,
  start = 'top 85%',
  id,
  onComplete,
}: KineticTextRevealProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();
  const Tag = As as React.ComponentType<Record<string, unknown>>;

  // Latest callback, read from inside the animation — the effect itself is
  // intentionally not re-run when onComplete changes identity.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Reduced motion never runs the GSAP effect below (useGSAP's `disabled`),
  // so the handoff to the parent still has to fire from somewhere.
  useEffect(() => {
    if (reduced) onCompleteRef.current?.();
  }, [reduced]);

  useGSAP(
    ({ gsap, ScrollTrigger }) => {
      const container = containerRef.current;
      if (!container) return;

      const words = container.querySelectorAll<HTMLElement>('.kinetic-word');
      if (words.length === 0) {
        onCompleteRef.current?.();
        return;
      }

      gsap.set(words, {
        yPercent: 125,
        opacity: 0,
        rotateX: -15,
        transformOrigin: '50% 100%',
      });

      // A failsafe, not the common path: this headline is often the LCP
      // element, and it must never stay invisible just because a decorative
      // WebGL scene mounting at the same moment (e.g. the hero's particle
      // eagle) starved the main thread of the animation frames GSAP's ticker
      // needs to finish the tween. If the reveal hasn't completed shortly
      // after it was due to, jump it to its final state outright.
      let settled = false;
      const settle = (): void => {
        if (settled) return;
        settled = true;
        gsap.set(words, { yPercent: 0, opacity: 1, rotateX: 0 });
        onCompleteRef.current?.();
      };

      const animProps = {
        yPercent: 0,
        opacity: 1,
        rotateX: 0,
        duration,
        delay,
        stagger,
        ease: 'power4.out',
        overwrite: 'auto' as const,
        onComplete: () => {
          if (settled) return;
          settled = true;
          onCompleteRef.current?.();
        },
      };
      const failsafeMs = (delay + duration + stagger * Math.max(0, words.length - 1)) * 1000 + 800;

      if (isHero) {
        // Immediate entrance for hero display
        gsap.to(words, animProps);
        const failsafe = window.setTimeout(settle, failsafeMs);
        return () => window.clearTimeout(failsafe);
      }

      // Scroll-triggered entrance for below-the-fold headings
      let failsafe: number | undefined;
      const trigger = ScrollTrigger.create({
        trigger: container,
        start,
        once: true,
        onEnter: () => {
          gsap.to(words, animProps);
          failsafe = window.setTimeout(settle, failsafeMs);
        },
      });
      return () => {
        trigger.kill();
        if (failsafe) window.clearTimeout(failsafe);
      };
    },
    { disabled: reduced, scope: containerRef },
  );

  // Render string content split into masked words
  const renderContent = () => {
    if (typeof children !== 'string') {
      return children;
    }

    const words = children.split(' ');
    return words.map((word, index) => (
      <span
        key={`${word}-${index}`}
        className="inline-block overflow-hidden align-top mr-[0.24em] last:mr-0"
        style={{ perspective: '800px' }}
      >
        <span
          className={cn(
            'kinetic-word inline-block will-change-transform',
            reduced ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full',
          )}
        >
          {word}
        </span>
      </span>
    ));
  };

  return (
    <Tag ref={containerRef} id={id} className={cn('text-wrap-balance', className)}>
      {renderContent()}
    </Tag>
  );
}
