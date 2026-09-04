# PERF-BUDGET.md — the numbers the build is held to

A meaningful share of Trivoxa's buyers are in the Gulf, Africa and South Asia on
mid-tier mobile hardware over inconsistent connections. The budget is written
for *them*, not for a MacBook on wifi.

## Test profile

**Moto G4 class · 4× CPU throttle · Slow 4G.** Every performance claim in this
project is measured on that profile. Lighthouse CI enforces it in CI (P20).

## Budget

| Metric | Budget | Where |
|---|---|---|
| LCP | < 2.5 s | homepage **and** the product catalog |
| CLS | < 0.05 | all routes |
| INP | < 200 ms | all routes |
| Initial JS | < 180 KB gzipped | excluding WebGL chunks |
| WebGL chunks | dynamically imported, below the fold or tier-gated; **never loaded at tier `low`** | all scenes |
| Total page weight | < 1.5 MB at tier `medium` | homepage |
| Lighthouse mobile | Performance ≥ 85 · Accessibility ≥ 95/100 · Best Practices ≥ 95 · SEO 100 | homepage, an industry page, the catalog |

LCP is always the **headline**, never a canvas. Headline, sub and CTAs are in
the server-rendered HTML and readable before any WebGL initialises.

## Perf tiers (`src/lib/perf-tier.tsx`)

Thresholds, asserted by `tests/perf-tier.test.ts`:

| Input | high | medium | low |
|---|---|---|---|
| `hardwareConcurrency` | ≥ 8 | 5–7 | ≤ 4 |
| `deviceMemory` (GiB) | ≥ 4 | 3 | ≤ 2 |
| `connection.effectiveType` | 4g+ | 4g | `3g`, `2g`, `slow-2g` |
| `saveData` | — | — | forces low |
| WebGL available | yes | yes | no → low |
| `prefers-reduced-motion` | — | — | forces low |

Degradation behaviour:

| Tier | Particles / globe | Post-processing |
|---|---|---|
| high | eagle 80k · globe full arcs | bloom on |
| medium | eagle 25k · globe `cobe` canvas | off |
| low | static poster image / static SVG map | n/a — no WebGL context is created |

The `low` poster is designed first and reviewed on its own merits (P9): a real
share of visitors will only ever see it, so it must be handsome, not a
screenshot of a broken canvas.

## Fonts

Self-hosted, subset, `font-display: swap`, preloaded. Three families, five
weights (ADR 009). No third-party font CSS, ever — including Fontshare's CDN.

## Images

`next/image` everywhere with explicit `sizes`; AVIF/WebP; blur placeholders.
Factory photography is high-value and heavy — audit it at P20 and serve it
progressively, captioned, never as a decorative background wash.

## What to cut first when over budget

1. The P5 component intake — that is where the fat usually is.
2. Any effect that duplicates something a token already does.
3. Post-processing before particle counts.
4. Particle counts before scenes.
5. Never the fallbacks. The fallbacks are the product for a real share of buyers.

## Measured (2026-09-04, homepage as composed in P6–P10)

`npm run build`, Next.js 15.5.25, production.

| Route | Page JS | First Load JS | Render |
|---|---|---|---|
| `/` | 26.4 kB | **246 kB** ⚠ over the 180 kB budget | static |
| `/styleguide` | 5.07 kB | 163 kB | static |
| `/_not-found` | 123 B | 103 kB | static |

Shared first-load cost: `framework` (React) ≈ 60 kB gz, plus two vendor chunks
≈ 47 kB and ≈ 54 kB gz — GSAP (core + ScrollTrigger + SplitText + Flip), Motion
and anime.js.

**The overage is owned by P20, not re-based.** Planned cuts, in order:

1. `setupGsap()` becomes async: GSAP core and each plugin are dynamically
   imported inside the effects that use them, so nothing animation-related is
   in the first-load chunk. Callers already run inside `useEffect`.
2. anime.js is dynamically imported inside the industry-icon effect — it is
   used for one micro-animation and should cost nothing on first paint.
3. The route-progress and scroll-progress bars move to Motion's mini `animate`
   API instead of the full `motion/react` component layer.
4. SplitText stays eager ONLY if the hero headline measurably needs it; the
   headline is server-rendered, so a late split is a late flourish, not a late
   LCP.

WebGL status is as designed: `eagle-scene`, `globe-r3f` and `globe-cobe` are
separate lazy chunks reached only from inside a tier check, and a tier-`low`
visitor downloads none of them.
