/**
 * src/lib/brand/wordmark-paths.ts
 * ---------------------------------------------------------------------------
 * The TRIVOXA wordmark as raw vector geometry.
 *
 * WHY THIS EXISTS
 * The client's real logo pack ("Trivoxa website / Logo" in Drive) has not been
 * uploaded yet, and this sandbox has no system fonts — so an SVG `<text>`
 * wordmark cannot be rasterised for the favicon / OG image, and a font-dependent
 * wordmark flickers in the header while webfonts load.
 *
 * So the provisional wordmark is drawn as paths on a 120-unit cap height with a
 * uniform 14-unit stroke: a wide-tracked geometric sans. It is font-independent,
 * rasterises cleanly at 16px, and renders identically before and after hydration.
 *
 * THIS IS NOT A BRAND DECISION. Whether the real wordmark is a serif or a
 * geometric sans is an open question in docs/DECISIONS.md — it is answered the
 * moment the logo pack lands, at which point this file is deleted and the
 * lockup component points at the real SVG. See `npm run check:brand`.
 */

/** Cap height of the wordmark grid, in user units. */
export const WORDMARK_CAP_HEIGHT = 120;

/** Uniform stroke weight of the letterforms. */
export const WORDMARK_STROKE = 14;

/** Letterspacing between advance widths. Deliberately wide — this is a premium mark. */
export const WORDMARK_TRACKING = 34;

export type WordmarkGlyph = {
  /** Single character, for debugging and for selective rendering. */
  char: string;
  /** Advance width in user units. */
  width: number;
  /**
   * Path data in a local coordinate space whose origin is the glyph's own
   * top-left. Translate by the cumulative x offset when composing.
   */
  d: string;
};

/**
 * T · R · I · V · O · X · A
 * `O`, `R` and `A` carry counters as second subpaths and rely on fill-rule
 * "evenodd" — set that on the consuming <path> or <g>.
 */
export const WORDMARK_GLYPHS: readonly WordmarkGlyph[] = [
  {
    char: 'T',
    width: 88,
    d: 'M0 0H88V14H51V120H37V14H0Z',
  },
  {
    char: 'R',
    width: 86,
    d: 'M0 0H72V58H48L80 120H62L34 62H14V120H0Z M14 14H58V44H14Z',
  },
  {
    char: 'I',
    width: 14,
    d: 'M0 0H14V120H0Z',
  },
  {
    char: 'V',
    width: 92,
    d: 'M0 0H16L46 96L76 0H92L54 120H38Z',
  },
  {
    char: 'O',
    width: 96,
    d: 'M28 0H68A28 28 0 0 1 96 28V92A28 28 0 0 1 68 120H28A28 28 0 0 1 0 92V28A28 28 0 0 1 28 0Z M28 14H68A14 14 0 0 1 82 28V92A14 14 0 0 1 68 106H28A14 14 0 0 1 14 92V28A14 14 0 0 1 28 14Z',
  },
  {
    char: 'X',
    width: 92,
    d: 'M0 0H18L46 48L74 0H92L56 60L92 120H74L46 72L18 120H0L36 60Z',
  },
  {
    char: 'A',
    width: 94,
    d: 'M38 0H56L94 120H76L68 94H26L18 120H0Z M32 78H62L47 26Z',
  },
] as const;

/** Total advance width of the full wordmark, tracking included. */
export const WORDMARK_WIDTH = WORDMARK_GLYPHS.reduce(
  (total, glyph) => total + glyph.width + WORDMARK_TRACKING,
  -WORDMARK_TRACKING,
);

/** viewBox for a standalone wordmark SVG. */
export const WORDMARK_VIEWBOX = `0 0 ${WORDMARK_WIDTH} ${WORDMARK_CAP_HEIGHT}`;

/**
 * The wordmark as one pre-translated path string, ready to drop into a single
 * `<path d="…" fill-rule="evenodd">`. One path keeps SVGO, favicons and
 * particle sampling simple.
 */
export function wordmarkPathData(): string {
  let x = 0;
  const parts: string[] = [];
  for (const glyph of WORDMARK_GLYPHS) {
    parts.push(translatePath(glyph.d, x, 0));
    x += glyph.width + WORDMARK_TRACKING;
  }
  return parts.join(' ');
}

/**
 * Minimal path translator. The wordmark grammar is deliberately restricted to
 * M / H / V / L / A / Z with absolute coordinates so this stays trivial and
 * exact — no parser library, no floating-point drift.
 */
function translatePath(d: string, dx: number, dy: number): string {
  if (dx === 0 && dy === 0) return d;

  return d
    .split(/(?=[MHVLAZ])/i)
    .map((rawSegment) => {
      const segment = rawSegment.trim();
      if (!segment) return '';
      const command = segment[0] as string;
      const args = segment
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);

      switch (command.toUpperCase()) {
        case 'M':
        case 'L':
          return `${command}${args[0]! + dx} ${args[1]! + dy}`;
        case 'H':
          return `${command}${args[0]! + dx}`;
        case 'V':
          return `${command}${args[0]! + dy}`;
        case 'A': {
          // rx ry rot largeArc sweep x y — only the endpoint moves.
          const [rx, ry, rot, large, sweep, ax, ay] = args as number[];
          return `${command}${rx} ${ry} ${rot} ${large} ${sweep} ${ax! + dx} ${ay! + dy}`;
        }
        case 'Z':
          return command;
        default:
          throw new Error(`wordmarkPathData: unsupported path command "${command}"`);
      }
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * The eagle mark, in the same 240×240 space as `brand/mark.svg`.
 * Kept here as well as in the SVG so the OG image, the favicon and the inline
 * React lockup all render from one definition and cannot drift apart —
 * which is the exact failure mode the July 2026 audit kept finding.
 */
export const MARK_VIEWBOX = '0 0 240 240';

export const MARK_PATHS: readonly string[] = [
  'M120 22 140 44 120 66 100 44Z', // head
  'M140 44 174 52 140 60Z', // beak, turned to the viewer's right
  'M120 62 134 84 127 172 120 198 113 172 106 84Z', // body
  'M113 172 98 206 116 192Z', // tail feather, left
  'M127 172 142 206 124 192Z', // tail feather, right
  'M108 100 10 52 10 80 108 128Z', // primary wing, left
  'M132 100 230 52 230 80 132 128Z', // primary wing, right
  'M108 136 34 100 34 120 108 156Z', // secondary feather, left
  'M132 136 206 100 206 120 132 156Z', // secondary feather, right
] as const;

export function markPathData(): string {
  return MARK_PATHS.join(' ');
}
