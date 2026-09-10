'use client';

import { useEffect, useRef } from 'react';
import { loadGsap, peekGsap, type GsapBundle } from '@/lib/motion/gsap-setup';
import { DURATION, EASE_GSAP } from '@/lib/tokens/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { formatNumber } from '@/lib/utils';

export type CountUpProps = {
  value: number;
  locale?: string;
  /** Rendered suffix, e.g. "+" or " ports". */
  suffix?: string;
  prefix?: string;
  className?: string;
  /** Where the count starts as a fraction of the final value. */
  from?: number;
  start?: string;
};

/**
 * <CountUp> — the number ticker, with the fix the audit demanded.
 *
 * The live site's "Presence in Numbers" counters rendered as literal zeros in
 * a content-level fetch: *"If JavaScript is slow, blocked, or errors out, a
 * real visitor sees a company boasting '0 regions served.'"*
 *
 * So: the FINAL, locale-formatted value is in the server-rendered HTML. The
 * client animates from a lower bound up to it. JS off, JS slow, JS broken,
 * reduced motion, tier low — everyone sees the true number.
 */
export function CountUp({
  value,
  locale = 'en',
  suffix = '',
  prefix = '',
  className,
  from = 0.5,
  start = 'top 88%',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const final = `${prefix}${formatNumber(value, locale)}${suffix}`;

  useEffect(() => {
    if (reduced) return;
    if (!ref.current) return;

    let cancelled = false;
    let tween: { kill: () => void; scrollTrigger?: { kill: () => void } } | null = null;

    const begin = ({ gsap, ScrollTrigger }: GsapBundle): void => {
      const el = ref.current;
      if (cancelled || !el) return;

      const state = { current: Math.max(0, Math.round(value * from)) };

      tween = gsap.to(state, {
        current: value,
        duration: DURATION.slow / 1000,
        ease: EASE_GSAP.outExpo,
        snap: { current: 1 },
        onUpdate: () => {
          el.textContent = `${prefix}${formatNumber(Math.round(state.current), locale)}${suffix}`;
        },
        scrollTrigger: { trigger: el, start, once: true },
      }) as unknown as { kill: () => void; scrollTrigger?: { kill: () => void } };

      void ScrollTrigger;
    };

    // GSAP is off the critical path now: run immediately if it has landed
    // (the usual case — the download starts during hydration), otherwise when
    // it does. The server-rendered final value is on screen either way, so
    // there is never a "0 regions served" frame.
    const ready = peekGsap();
    if (ready) begin(ready);
    else void loadGsap().then(begin);

    return () => {
      cancelled = true;
      tween?.scrollTrigger?.kill();
      tween?.kill();
      peekGsap()?.ScrollTrigger.refresh();
    };
  }, [value, locale, suffix, prefix, from, start, reduced]);

  return (
    <span ref={ref} className={className} data-spec suppressHydrationWarning>
      {final}
    </span>
  );
}
