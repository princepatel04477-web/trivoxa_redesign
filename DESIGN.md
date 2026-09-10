# Design

## Visual Theme

Trivoxa Group embodies Sovereign Industrial Luxury. An architectural balance of deep warm espresso, natural ivory, and precision bronze hairlines. Every surface is deliberate, grounded, and physical.

## Palette

- **Espresso (`--color-espresso`)**: `#241C18` — Brand primary; dark surfaces, ink on light grounds.
- **Ivory (`--color-ivory`)**: `#F4EFE6` — Brand secondary; light grounds, ink on dark grounds.
- **Deep Espresso (`--color-espresso-deep`)**: `#171210` — Full-bleed statement sections, immersive backdrops.
- **Soft Ivory (`--color-ivory-soft`)**: `#FAF8F3` — Raised cards and structured panels on light grounds.
- **Bronze (`--color-bronze`)**: `#A88B68` — Accent only (<=3% area). Hairlines, hover underlines, focus rings, and text on dark grounds (5.2:1 / 5.8:1 contrast).
- **Bronze Ink (`--color-bronze-ink`)**: `#7A6244` — Text and links on light grounds (5.0:1 contrast, WCAG AA compliant).
- **White (`--color-white`)**: `#FFFFFF` — Overlays, high-visibility contrast nodes.

## Typography

- **Display**: Instrument Serif (classical serif authority for large titles, quotes, and primary statements).
- **Body / Interface**: Satoshi / Inter (clean, high-legibility geometric/humanist sans for body copy, buttons, labels).
- **Data / Metrics**: Geist Mono (tabular numerals and monospace precision for HS codes, MOQs, Incoterms, lead times, port LOCODEs).

## Elevation & Hairlines

- Hairline borders: `1px solid var(--hairline)` tinted relative to the active surface.
- No heavy floating drop-shadows; elevation is achieved through subtle tonal shifts (`surface-raised`), precise 1px borders, and architectural spacing.

## Motion & Transitions

- Ease-out exponential transitions (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Durations: 150ms–250ms for state changes (hovers, focus, disclosures).
- Zero bouncing, zero layout-shift triggers.
- Full support for `prefers-reduced-motion` with static fallbacks.
