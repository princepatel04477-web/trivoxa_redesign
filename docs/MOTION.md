# MOTION.md — the animation layer

Motion is infrastructure here, not decoration. The audit's UX reviewer warned:
*"Fix the IA before investing more in animation fidelity."* The IA is fixed
(P2/P3), so motion spend is now legitimate — inside a budget.

## Tokens

`src/lib/tokens/motion.ts` (TS) and the `@theme` motion block in
`src/app/globals.css` (CSS) hold every value. `tests/tokens.test.ts` proves they
agree. **No magic numbers anywhere else.**

| Token | Value |
|---|---|
| duration · instant / fast / base / slow / cinematic | 120 / 240 / 400 / 700 / 1200 ms |
| ease · house & outExpo | `cubic-bezier(0.16, 1, 0.3, 1)` |
| ease · inOutQuad | `cubic-bezier(0.45, 0, 0.55, 1)` |
| distance · subtle / reveal / strong | 16 / 24 / 32 px — reveals never travel further |
| stagger · tight / base / loose | 60 / 70 / 80 ms, **capped at 8 items** |
| parallax max travel | 12% of element height |

## Library boundaries (ADR 013)

| Library | Owns | Never used for |
|---|---|---|
| GSAP + ScrollTrigger (+ SplitText, Flip) | all scroll-driven work, timelines, headline mask reveals, pinned journeys | React enter/exit |
| Motion (Framer successor) | React component enter/exit, layout animations, gestures | scroll scrubbing |
| anime.js v4 | small standalone SVG/icon path draws and numeric micro-animation | anything with a timeline longer than ~1s |
| React Three Fiber | **the eagle and the globe and nothing else** | decorative particles elsewhere |

If a fourth library appears in a PR, this table is the place to argue about it.

## Components (`src/components/motion/`)

| Component | Behaviour |
|---|---|
| `<Reveal>` | fade + 24px rise, ScrollTrigger, once, 60–80ms stagger, capped at 8 |
| `<SplitHeading>` | GSAP SplitText per-line mask reveal for display headings |
| `<CountUp>` | number ticker **with the real value in the server HTML**; animates from a lower bound. A visitor with JS blocked sees the truth, never "0 regions served" |
| `<Parallax>` | ≤12% travel |
| `<Marquee>` | logo/port/corridor ticker; pauses on hover; static under reduced motion |
| `<MagneticButton>` | cursor attraction on the primary CTA only |
| `<PageTransition>` | View Transitions API where supported, Motion fallback |
| `<ScrollProgress>` | 1px bronze hairline at the top of long pages |

## Performance tiering (`src/lib/perf-tier.tsx`, ADR 014)

One classification, made once on mount, read by every scene:

* **high** — full particle counts, bloom/post-processing
* **medium** — reduced counts, no post-processing
* **low** — a static, beautifully-composed poster. Never a broken canvas.

Inputs: `hardwareConcurrency`, `deviceMemory`, a WebGL probe,
`connection.effectiveType`, `saveData`, `prefers-reduced-motion`. Thresholds in
`docs/PERF-BUDGET.md`.

**The WebGL chunk is only dynamic-imported from an effect, after the tier
check.** A `low` device therefore never downloads three.js at all — verified by
the P20 acceptance test, not by intention.

## Reduced motion is a first-class path

Under `prefers-reduced-motion: reduce`:

* content appears at its **final position** with a 120ms opacity fade;
* WebGL scenes render their poster image;
* marquees stop; Lenis never mounts; ScrollTrigger scrubbing is disabled;
* the pinned Journey timeline becomes a vertical stepper.

Test by toggling the OS setting on a running page — every route, not just the
homepage (P20).

## Scene handoffs (ADR 015)

The homepage's particle narrative (eagle → network → cards → icons → globe →
articles) is a **sequence of independent scenes sharing a visual language**, not
one uninterrupted canvas. Each scene owns its own lifecycle and unmounts
cleanly; the handoff carries the story. One mega-timeline is unshippable on
mid-tier mobile and unmaintainable at any tier.

## House rules for new motion

1. Read a token. If the value you want isn't in the table, propose a token.
2. Entrance = ease-out-expo; loop = ease-in-out-quad; anything with character =
   house.
3. Never animate layout properties on scroll (transform/opacity only).
4. Kill every ScrollTrigger and GSAP context on unmount (`useGSAP` does this).
5. Decorative canvases are `aria-hidden`; their meaning lives in adjacent text.
