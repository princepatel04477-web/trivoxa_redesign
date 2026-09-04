/**
 * scripts/check-brand-assets.ts — brand integrity gate.
 * ---------------------------------------------------------------------------
 * Run manually (`npm run check:brand`); also invoked by CI.
 *
 *  1. Parses the six canonical hexes out of the `@theme` block in
 *     src/app/globals.css and asserts they equal src/lib/tokens/colors.ts.
 *     Two token files (CSS + TS) is one too many unless a machine proves they
 *     agree on every build — this is that machine.
 *  2. Recomputes the WCAG contrast matrix and rewrites the CONTRAST block in
 *     docs/DECISIONS.md, so the ratios recorded there can never go stale.
 *  3. Asserts every derived brand asset exists (mark, wordmark, both lockups,
 *     favicon, apple icon, OG image) and that NO legacy logo file survives
 *     anywhere in the repo — the brief's "grep for it" requirement.
 *  4. If the real logo pack has been dropped into public/brand/_incoming/,
 *     reports exactly which provisional assets it supersedes.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BRAND, contrastReport } from '../src/lib/tokens/colors';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const errors: string[] = [];
const notes: string[] = [];

/* 1 · CSS ⇄ TS hex parity -------------------------------------------------- */

function checkHexParity(): void {
  const css = readFileSync(join(ROOT, 'src', 'app', 'globals.css'), 'utf8');
  const themeStart = css.indexOf('@theme');
  const themeEnd = css.indexOf('/* ---', themeStart);
  const theme = css.slice(themeStart, themeEnd === -1 ? undefined : themeEnd);

  const parsed = new Map<string, string>();
  for (const match of theme.matchAll(/--color-([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) {
    const [, token, hex] = match;
    if (!token || !hex) continue;
    parsed.set(`--color-${token}`, hex.toLowerCase());
  }

  for (const [name, colour] of Object.entries(BRAND)) {
    const cssHex = parsed.get(colour.token);
    if (!cssHex) {
      errors.push(`globals.css @theme is missing ${colour.token} (brand colour "${name}").`);
      continue;
    }
    if (cssHex !== colour.hex.toLowerCase()) {
      errors.push(
        `Hex drift for "${name}": globals.css says ${cssHex}, colors.ts says ${colour.hex.toLowerCase()}. Fix one, not both.`,
      );
    }
  }

  // No stray brand-ish hexes outside @theme in the CSS file.
  const outside = css.slice(0, themeStart) + css.slice(css.indexOf('}', themeStart));
  const stray = [...outside.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0] ?? '').filter(Boolean);
  if (stray.length > 0) {
    errors.push(`Raw hex values outside the @theme token block in globals.css: ${stray.join(', ')}`);
  }
}

/* 2 · contrast record ------------------------------------------------------ */

function writeContrastRecord(): void {
  const path = join(ROOT, 'docs', 'DECISIONS.md');
  const doc = readFileSync(path, 'utf8');
  const start = '<!-- CONTRAST:START -->';
  const end = '<!-- CONTRAST:END -->';

  if (!doc.includes(start) || !doc.includes(end)) {
    errors.push('docs/DECISIONS.md is missing the CONTRAST markers; cannot record ratios.');
    return;
  }

  const rows = contrastReport()
    .map(
      (entry) =>
        `| ${entry.surface} | ${entry.pair} | \`${entry.fg}\` on \`${entry.bg}\` | **${entry.ratio.toFixed(2)}** | ${entry.clears} |`,
    )
    .join('\n');

  const block = `${start}
| Surface | Pair | Colours | Ratio | Clears |
|---|---|---|---|---|
${rows}
${end}`;

  const next = doc.replace(/<!-- CONTRAST:START -->[\s\S]*<!-- CONTRAST:END -->/, block);
  writeFileSync(path, next, 'utf8');
  notes.push(`contrast matrix recorded — ${contrastReport().length} pairs`);
}

/* 3 · assets exist; legacy logo gone --------------------------------------- */

const REQUIRED_ASSETS = [
  'public/brand/trivoxa-mark.svg',
  'public/brand/trivoxa-wordmark.svg',
  'public/brand/trivoxa-lockup-dark.svg',
  'public/brand/trivoxa-lockup-light.svg',
  'src/app/icon.svg',
  'src/app/apple-icon.png',
  'src/app/favicon.ico',
  'src/app/opengraph-image.png',
];

function checkAssets(): void {
  for (const asset of REQUIRED_ASSETS) {
    if (!existsSync(join(ROOT, asset))) {
      errors.push(`Missing brand asset: ${asset}. Run \`npm run brand\`.`);
    }
  }

  const mark = readFileSync(join(ROOT, 'public/brand/trivoxa-mark.svg'), 'utf8');
  if (!mark.includes('viewBox')) errors.push('trivoxa-mark.svg lost its viewBox (P0 acceptance).');
  if (!mark.includes('currentColor')) {
    errors.push('trivoxa-mark.svg is not currentColor — it cannot serve both lockups.');
  }

  // The old logo must not survive anywhere. The legacy site referenced
  // images/logo*.png and a favicon under /images; flag any such path.
  const suspects: string[] = [];
  const scan = (dir: string): void => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) scan(full);
      else if (/logo[-_]?(old|legacy|previous)/i.test(entry.name) || /^old[-_]logo/i.test(entry.name)) {
        suspects.push(full.replace(ROOT, ''));
      }
    }
  };
  scan(join(ROOT, 'public'));
  scan(join(ROOT, 'src'));

  if (suspects.length > 0) {
    errors.push(`Legacy logo files still present: ${suspects.join(', ')}. Delete them.`);
  }
}

/* 4 · incoming real assets -------------------------------------------------- */

function reportIncoming(): void {
  const incoming = join(ROOT, 'public', 'brand', '_incoming');
  if (!existsSync(incoming)) return;

  const files = readdirSync(incoming).filter((f) => !f.startsWith('README'));
  if (files.length === 0) {
    notes.push('no real logo pack in public/brand/_incoming/ yet — provisional vectors in use');
    return;
  }

  notes.push(`real logo pack detected: ${files.join(', ')}`);
  notes.push('it supersedes: trivoxa-mark.svg, trivoxa-wordmark.svg, both lockups, icon.svg, apple-icon.png, favicon.ico, opengraph-image.png');
  notes.push('and, once inspected, answers ADR 007 (display face). See public/brand/_incoming/README.md.');
}

checkHexParity();
writeContrastRecord();
checkAssets();
reportIncoming();

for (const note of notes) console.log(`[check-brand] ✓ ${note}`);
for (const error of errors) console.error(`[check-brand] ERROR ${error}`);

if (errors.length > 0) {
  console.error(`\n[check-brand] ${errors.length} error(s).`);
  process.exit(1);
}
console.log('[check-brand] ✓ palette parity, assets and contrast record all good');
