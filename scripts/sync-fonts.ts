/**
 * scripts/sync-fonts.ts
 * ---------------------------------------------------------------------------
 * Runs as `predev` / `prebuild`.
 *
 * Two jobs:
 *
 *  1. Copy the self-hostable faces we depend on out of node_modules and into
 *     `src/fonts/vendor/` (gitignored). Next.js `next/font/local` needs real
 *     files on disk; pointing it straight into node_modules is fragile across
 *     package managers and breaks `next build` output tracing.
 *
 *  2. Resolve the BODY face and emit `src/lib/fonts.generated.ts`.
 *
 *     The brand spec calls for Satoshi (Fontshare). Satoshi is not distributed
 *     on npm and api.fontshare.com is not reachable from CI, so this script
 *     looks for the real files in `src/fonts/custom/` and, when they are
 *     absent, falls back to Inter — the fallback the brand document itself
 *     names. Dropping `Satoshi-*.woff2` into `src/fonts/custom/` and rebuilding
 *     is the entire swap. Nothing else in the codebase changes: every consumer
 *     reads `--font-body`.
 *
 * See docs/DECISIONS.md → "Body face: Satoshi pending upload".
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = join(ROOT, 'src', 'fonts');
const VENDOR = join(FONTS, 'vendor');
const CUSTOM = join(FONTS, 'custom');
const OUT = join(ROOT, 'src', 'lib', 'fonts.generated.ts');

/** Faces we always ship, sourced from @fontsource packages. */
const VENDOR_FACES = [
  // Display — Instrument Serif (400 regular only; it is a single-weight face).
  {
    from: '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2',
    to: 'instrument-serif-latin-400-normal.woff2',
  },
  {
    from: '@fontsource/instrument-serif/files/instrument-serif-latin-ext-400-normal.woff2',
    to: 'instrument-serif-latin-ext-400-normal.woff2',
  },
  // Data — Geist Mono variable (one file covers the whole weight axis).
  {
    from: '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2',
    to: 'geist-mono-latin-wght-normal.woff2',
  },
  {
    from: '@fontsource-variable/geist-mono/files/geist-mono-latin-ext-wght-normal.woff2',
    to: 'geist-mono-latin-ext-wght-normal.woff2',
  },
  // Body fallback — Inter, used only when Satoshi is not present.
  ...['400', '500', '600'].map((w) => ({
    from: `@fontsource/inter/files/inter-latin-${w}-normal.woff2`,
    to: `inter-latin-${w}-normal.woff2`,
  })),
];

/** Weights we expose for the body face. Kept to 3 to respect the 5-weight budget. */
const BODY_WEIGHTS = ['400', '500', '600'] as const;

type Src = { path: string; weight: string; style: string };

function copyVendorFaces(): void {
  mkdirSync(VENDOR, { recursive: true });
  for (const face of VENDOR_FACES) {
    const from = join(ROOT, 'node_modules', face.from);
    const to = join(VENDOR, face.to);
    if (!existsSync(from)) {
      console.warn(`[sync-fonts] missing in node_modules, skipped: ${face.from}`);
      continue;
    }
    cpSync(from, to);
  }
}

/**
 * Satoshi ships from Fontshare as `Satoshi-Regular.woff2`, `Satoshi-Medium.woff2`,
 * `Satoshi-Bold.woff2` (and a `Satoshi-Variable.woff2`). Accept any of those
 * spellings plus the numeric-weight convention, so the drop-in is forgiving.
 */
const SATOSHI_CANDIDATES: Record<(typeof BODY_WEIGHTS)[number], string[]> = {
  '400': ['Satoshi-Regular.woff2', 'Satoshi-Variable.woff2', 'satoshi-latin-400-normal.woff2'],
  '500': ['Satoshi-Medium.woff2', 'Satoshi-Variable.woff2', 'satoshi-latin-500-normal.woff2'],
  '600': ['Satoshi-Bold.woff2', 'Satoshi-Variable.woff2', 'satoshi-latin-600-normal.woff2'],
};

function resolveBody(): { family: string; srcs: Src[]; note: string } {
  const customFiles = existsSync(CUSTOM) ? readdirSync(CUSTOM) : [];
  const variable = customFiles.find((f) => /^Satoshi-Variable\.woff2$/i.test(f));

  if (variable) {
    return {
      family: 'Satoshi',
      srcs: [
        {
          path: `../fonts/custom/${variable}`,
          weight: '300 900',
          style: 'normal',
        },
      ],
      note: 'Satoshi variable — resolved from src/fonts/custom/.',
    };
  }

  const statics = BODY_WEIGHTS.map((weight): Src | null => {
    const hit = SATOSHI_CANDIDATES[weight]
      .map((candidate) => customFiles.find((f) => f.toLowerCase() === candidate.toLowerCase()))
      .find((f): f is string => Boolean(f));
    return hit ? { path: `../fonts/custom/${hit}`, weight, style: 'normal' } : null;
  }).filter((s): s is Src => s !== null);

  if (statics.length > 0) {
    return {
      family: 'Satoshi',
      srcs: statics,
      note: `Satoshi static — resolved ${statics.length} weight(s) from src/fonts/custom/.`,
    };
  }

  // Fallback path: Inter, copied into vendor/ above.
  return {
    family: 'Inter',
    srcs: BODY_WEIGHTS.map((weight) => ({
      path: `../fonts/vendor/inter-latin-${weight}-normal.woff2`,
      weight,
      style: 'normal',
    })),
    note:
      'FALLBACK — Satoshi not found in src/fonts/custom/. Inter is the fallback named in the\n * brand document. Drop Satoshi-*.woff2 into src/fonts/custom/ and rebuild to swap.',
  };
}

function emit(): void {
  copyVendorFaces();
  const body = resolveBody();

  const renderSrc = (srcs: Src[]): string =>
    srcs.map((s) => `    { path: '${s.path}', weight: '${s.weight}', style: '${s.style}' },`).join('\n');

  const displaySrcs: Src[] = [
    { path: '../fonts/vendor/instrument-serif-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/vendor/instrument-serif-latin-ext-400-normal.woff2', weight: '400', style: 'normal' },
  ].filter((s) => existsSync(join(ROOT, 'src', 'lib', s.path)));

  const monoSrcs: Src[] = [
    { path: '../fonts/vendor/geist-mono-latin-wght-normal.woff2', weight: '100 900', style: 'normal' },
    { path: '../fonts/vendor/geist-mono-latin-ext-wght-normal.woff2', weight: '100 900', style: 'normal' },
  ].filter((s) => existsSync(join(ROOT, 'src', 'lib', s.path)));

  const bodySrcs = body.srcs.filter((s) => existsSync(join(ROOT, 'src', 'lib', s.path)));

  if (displaySrcs.length === 0 || monoSrcs.length === 0 || bodySrcs.length === 0) {
    throw new Error(
      '[sync-fonts] could not resolve at least one file per family. Run `npm install` first.',
    );
  }

  const file = `/* eslint-disable */
/**
 * AUTO-GENERATED by scripts/sync-fonts.ts — DO NOT EDIT BY HAND.
 * Regenerate with: npm run prebuild   (runs automatically before dev/build)
 *
 * Display : Instrument Serif
 * Body    : ${body.family}${body.family === 'Inter' ? '  (FALLBACK — Satoshi not yet uploaded)' : ''}
 * Data    : Geist Mono (variable)
 *
 * ${body.note}
 */
import localFont from 'next/font/local';

/** Display — headlines, section headings, hero. Single weight by design. */
export const displayFont = localFont({
  src: [
${renderSrc(displaySrcs)}
  ],
  variable: '--fontstack-display',
  display: 'swap',
  preload: true,
  fallback: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
  adjustFontFallback: false,
});

/** Body / UI — everything that is not a headline or a spec value. */
export const bodyFont = localFont({
  src: [
${renderSrc(bodySrcs)}
  ],
  variable: '--fontstack-body',
  display: 'swap',
  preload: true,
  fallback: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: false,
});

/** Data — HS codes, MOQs, lead times, Incoterms, port codes, cert numbers. */
export const dataFont = localFont({
  src: [
${renderSrc(monoSrcs)}
  ],
  variable: '--fontstack-data',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
  adjustFontFallback: false,
});

/** True when the real brand body face is in place. Surfaced on /styleguide. */
export const BODY_FONT_FAMILY = ${JSON.stringify(body.family)};
export const BODY_FONT_IS_FALLBACK = ${body.family !== 'Satoshi'};

export const fontVariables = \`\${displayFont.className} \${bodyFont.className} \${dataFont.className}\`;
`;

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, file, 'utf8');

  const icon = body.family === 'Satoshi' ? '✓' : '!';
  console.log(`[sync-fonts] ${icon} body face: ${body.family}${body.family === 'Satoshi' ? '' : ' (fallback — drop Satoshi into src/fonts/custom/)'}`);
  console.log('[sync-fonts] ✓ display face: Instrument Serif');
  console.log('[sync-fonts] ✓ data face:    Geist Mono (variable)');
}

// Keep the vendor dir honest: wipe and re-copy so stale faces never linger.
if (existsSync(VENDOR)) rmSync(VENDOR, { recursive: true, force: true });
emit();
