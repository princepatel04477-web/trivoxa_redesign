/**
 * src/lib/tokens/colors.ts — THE ONLY PLACE BRAND HEX VALUES LIVE IN TypeScript.
 * ---------------------------------------------------------------------------
 * Exact values from the client's brand document. Do not add shades. Do not
 * invent a palette ramp. The only derived values permitted are the state
 * overlays used for hover/active/disabled, and those are expressed as alpha
 * over a canonical token — never as a new hex.
 *
 * The CSS mirror of this file is the `@theme` block in `src/app/globals.css`.
 * `scripts/check-brand-assets.ts` parses both and fails the build if they
 * diverge, which is how we guarantee a single source of truth across the
 * TS and CSS layers.
 *
 * Bronze discipline (enforced by review + the /styleguide surface, not by a
 * linter): bronze is never a page background and never body copy. It is a
 * hairline, a hover underline, a small icon fill, a focus ring, or the
 * occasional number. More than ~3% bronze by area on a screen is wrong.
 */

export type Hex = `#${string}`;

export type BrandColor = {
  /** CSS custom property name in the `@theme` block. */
  token: string;
  hex: Hex;
  /** Where this colour is allowed to appear. */
  role: string;
};

/**
 * The six canonical brand colours.
 *
 * Note on naming: `espresso` is the brand primary — dark grounds AND ink on
 * light grounds. `ivory` is the brand secondary — light grounds AND ink on
 * dark grounds. `espressoDeep` is reserved for full-bleed statement sections.
 */
export const BRAND = {
  espresso: {
    token: '--color-espresso',
    hex: '#241C18',
    role: 'Brand primary. Dark surfaces; ink on light surfaces.',
  },
  ivory: {
    token: '--color-ivory',
    hex: '#F4EFE6',
    role: 'Brand secondary. Light surfaces; ink on dark surfaces.',
  },
  espressoDeep: {
    token: '--color-espresso-deep',
    hex: '#171210',
    role: 'Deepest sections only. Near-black brown, full-bleed statements.',
  },
  ivorySoft: {
    token: '--color-ivory-soft',
    hex: '#FAF8F3',
    role: 'Raised surfaces and cards sitting on ivory.',
  },
  bronze: {
    token: '--color-bronze',
    hex: '#A88B68',
    role: 'ACCENT ONLY. Hairlines, hover underlines, small icon fills, focus rings.',
  },
  white: {
    token: '--color-white',
    hex: '#FFFFFF',
    role: 'Pure white. Rarely a surface; used for overlays and true-white text.',
  },
} as const satisfies Record<string, BrandColor>;

export type BrandColorName = keyof typeof BRAND;

/** Every canonical hex, for the drift check and for shaders. */
export const BRAND_HEXES = Object.values(BRAND).map((c) => c.hex) as Hex[];

/* ------------------------------------------------------------------------ */
/* Surfaces                                                                */
/* ------------------------------------------------------------------------ */

/**
 * The two canonical surfaces plus DEEP. Every section declares which one it is
 * via `<Section surface="light|dark|deep">`; nothing improvises a background.
 */
export type Surface = 'light' | 'dark' | 'deep';

export type SurfaceTokens = {
  surface: Surface;
  /** Page/section ground. */
  bg: Hex;
  /** Primary ink — headings and body. Always opaque and always AA against `bg`. */
  fg: Hex;
  /**
   * Secondary ink — supporting copy, captions.
   * Stored as the OPAQUE result of compositing `fg` at `mutedAlpha` over `bg`,
   * so a contrast checker tests the pixel that is actually painted.
   */
  muted: Hex;
  /** Faintest ink — placeholders, disabled labels. Composited the same way. */
  faint: Hex;
  /** Hairline / divider. Composited the same way. */
  hairline: Hex;
  /** Raised card ground. Composited the same way. */
  raised: Hex;
  /** Accent, always bronze. */
  accent: Hex;
  /** `color-scheme` for form controls and scrollbars. */
  colorScheme: 'light' | 'dark';
  /** The alphas the derived tokens were built from — the real design inputs. */
  alpha: {
    muted: number;
    faint: number;
    hairline: number;
    raised: number;
  };
};

/**
 * Build a surface from three inputs only: ground, ink, and a set of alphas.
 * Nothing here can introduce a new hue — every derived token is `fg` (or
 * `ivorySoft` on the light surface) at some opacity over `bg`.
 */
function defineSurface(input: {
  surface: Surface;
  bg: Hex;
  fg: Hex;
  raised: Hex;
  alpha: SurfaceTokens['alpha'];
}): SurfaceTokens {
  const { surface, bg, fg, alpha } = input;
  return {
    surface,
    bg,
    fg,
    muted: composite(fg, alpha.muted, bg),
    faint: composite(fg, alpha.faint, bg),
    hairline: composite(fg, alpha.hairline, bg),
    raised: input.raised,
    accent: BRAND.bronze.hex,
    colorScheme: surface === 'light' ? 'light' : 'dark',
    alpha,
  };
}

export const SURFACES: Record<Surface, SurfaceTokens> = {
  light: defineSurface({
    surface: 'light',
    bg: BRAND.ivory.hex,
    fg: BRAND.espresso.hex,
    // ivorySoft is a canonical token, not a derived one.
    raised: BRAND.ivorySoft.hex,
    alpha: { muted: 0.74, faint: 0.5, hairline: 0.16, raised: 1 },
  }),
  dark: defineSurface({
    surface: 'dark',
    bg: BRAND.espresso.hex,
    fg: BRAND.ivory.hex,
    raised: composite(BRAND.ivory.hex, 0.045, BRAND.espresso.hex),
    alpha: { muted: 0.74, faint: 0.5, hairline: 0.18, raised: 0.045 },
  }),
  deep: defineSurface({
    surface: 'deep',
    bg: BRAND.espressoDeep.hex,
    fg: BRAND.ivory.hex,
    raised: composite(BRAND.ivory.hex, 0.045, BRAND.espressoDeep.hex),
    alpha: { muted: 0.74, faint: 0.48, hairline: 0.16, raised: 0.045 },
  }),
};

/* ------------------------------------------------------------------------ */
/* Colour maths                                                            */
/* ------------------------------------------------------------------------ */

type Rgb = { r: number; g: number; b: number };

export function hexToRgb(hex: Hex): Rgb {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => `${c}${c}`)
          .join('')
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`hexToRgb: "${hex}" is not a 3- or 6-digit hex colour`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): Hex {
  const channel = (n: number): string =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase() as Hex;
}

/**
 * Composite `ink` at `alpha` over `ground` and return the opaque result.
 *
 * Every derived colour in this system is a canonical token at some opacity
 * over a canonical ground, so the palette can never grow new hues — and
 * contrast can be computed against the pixel that is actually painted rather
 * than against a translucent layer.
 */
export function composite(ink: Hex, alpha: number, ground: Hex): Hex {
  if (alpha >= 1) return ink;
  const fg = hexToRgb(ink);
  const bg = hexToRgb(ground);
  return rgbToHex({
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  });
}

function channelLuminance(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.1 relative luminance. */
export function relativeLuminance(hex: Hex): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
  );
}

/** WCAG 2.1 contrast ratio, 1…21. */
export function contrastRatio(a: Hex, b: Hex): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.1 AA minimums by text size. */
export const WCAG_AA = {
  /** Body copy, under 18.66px bold / 24px regular. */
  normal: 4.5,
  /** Large text: ≥24px regular or ≥18.66px bold. */
  large: 3,
  /** Non-text contrast: focus rings, hairlines that carry meaning, icon fills. */
  ui: 3,
} as const;

export function meetsAA(ratio: number, kind: keyof typeof WCAG_AA = 'normal'): boolean {
  return ratio >= WCAG_AA[kind];
}

/**
 * The contrast matrix every surface must clear — computed, not asserted.
 *
 * P1's acceptance criterion is that ivory-on-espresso and espresso-on-ivory are
 * verified programmatically and recorded in docs/DECISIONS.md. This is the
 * source of that record: `scripts/check-brand-assets.ts` renders it and fails
 * the build on any violation, so the ratios in the docs cannot go stale.
 */
export type ContrastEntry = {
  surface: Surface;
  pair: string;
  fg: Hex;
  bg: Hex;
  ratio: number;
  /** The smallest text this pair may legally be used at. */
  clears: 'normal' | 'large' | 'ui' | 'none';
};

function classify(ratio: number): ContrastEntry['clears'] {
  if (ratio >= WCAG_AA.normal) return 'normal';
  if (ratio >= WCAG_AA.large) return 'large';
  if (ratio >= WCAG_AA.ui) return 'ui';
  return 'none';
}

export function contrastReport(): ContrastEntry[] {
  const entries: ContrastEntry[] = [];

  for (const surface of Object.values(SURFACES)) {
    const pairs: ReadonlyArray<[string, Hex, Hex]> = [
      ['fg on bg', surface.fg, surface.bg],
      ['muted on bg', surface.muted, surface.bg],
      ['faint on bg', surface.faint, surface.bg],
      ['fg on raised', surface.fg, surface.raised],
      ['accent on bg', surface.accent, surface.bg],
    ];

    for (const [pair, fg, bg] of pairs) {
      const ratio = contrastRatio(fg, bg);
      entries.push({
        surface: surface.surface,
        pair,
        fg,
        bg,
        ratio: Math.round(ratio * 100) / 100,
        clears: classify(ratio),
      });
    }
  }

  return entries;
}

/**
 * The minimum text size a token may be used at on a given surface. Components
 * consult this instead of hardcoding an assumption — `faint` never clears
 * AA-normal, so it is legal for placeholders and disabled labels and illegal
 * for body copy, and `accent` is never body copy on any surface (bronze rule).
 */
export function inkClearance(
  surface: Surface,
  token: 'fg' | 'muted' | 'faint' | 'accent',
): ContrastEntry['clears'] {
  const s = SURFACES[surface];
  return classify(contrastRatio(s[token], s.bg));
}
