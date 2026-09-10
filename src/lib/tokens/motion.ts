/**
 * src/lib/tokens/motion.ts — every motion value in the codebase reads from here.
 * ---------------------------------------------------------------------------
 * CSS mirror: the @theme motion block in src/app/globals.css. The two are
 * asserted to agree by tests/tokens.test.ts so no magic number can drift in.
 *
 * House rules (docs/MOTION.md):
 *  · entrances use EASE_OUT_EXPO; loops use EASE_IN_OUT_QUAD; the house curve
 *    for everything with character;
 *  · reveals travel 16–32px and never more — content arrives, it does not fly;
 *  · sibling stagger is 60–80ms and capped at 8 items;
 *  · nothing animates under prefers-reduced-motion except a 120ms opacity fade.
 */

/** Durations in milliseconds. */
export const DURATION = {
  instant: 120,
  fast: 240,
  base: 400,
  slow: 700,
  cinematic: 1200,
} as const;

export type DurationToken = keyof typeof DURATION;

/** CSS `var()` references, for GSAP/instyle values that must track the theme. */
export const DURATION_CSS = {
  instant: 'var(--duration-instant)',
  fast: 'var(--duration-fast)',
  base: 'var(--duration-base)',
  slow: 'var(--duration-slow)',
  cinematic: 'var(--duration-cinematic)',
} as const satisfies Record<DurationToken, string>;

/**
 * Easing curves.
 *  · house     — cubic-bezier(0.16, 1, 0.3, 1): the signature, long slow settle.
 *  · outExpo   — entrances; identical curve to house, kept as an alias so
 *                intent is readable at call sites.
 *  · inOutQuad — loops and marquees; symmetric, no settle.
 */
export const EASE = {
  house: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
} as const;

/** GSAP-flavoured copies, since GSAP takes raw bezier arrays or named eases. */
export const EASE_GSAP = {
  house: 'power4.out',
  outExpo: 'expo.out',
  inOutQuad: 'sine.inOut',
} as const;

/** Motion-flavoured cubic-bezier arrays. */
export const EASE_MOTION = {
  house: [0.16, 1, 0.3, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOutQuad: [0.45, 0, 0.55, 1] as const,
};

/** Travel distances in px. Reveals travel 16–32px and never more. */
export const DISTANCE = {
  subtle: 16,
  reveal: 24,
  strong: 32,
} as const;

export type DistanceToken = keyof typeof DISTANCE;

/** Sibling stagger, ms. Capped at STAGGER_MAX_ITEMS — see staggered(). */
export const STAGGER = {
  tight: 60,
  base: 70,
  loose: 80,
} as const;

export const STAGGER_MAX_ITEMS = 8;

/**
 * Stagger delay for item `index` of `total`, honouring the 8-item cap.
 * Beyond the cap items enter together rather than making the last card wait
 * half a second for its turn — a capped stagger is a design decision, not a
 * bug, and centralising it is the only way to keep it true.
 */
export function staggerDelay(
  index: number,
  amount: (typeof STAGGER)[keyof typeof STAGGER] = STAGGER.base,
): number {
  return Math.min(index, STAGGER_MAX_ITEMS - 1) * amount;
}

/** Parallax may travel at most 12% of the element's height. */
export const PARALLAX_MAX_TRAVEL = 0.12;

/**
 * The reduced-motion path: content appears at its final position with a
 * single opacity fade. Used by every motion component, not reimplemented.
 */
export const REDUCED_MOTION = {
  duration: DURATION.instant,
  ease: 'linear',
} as const;
