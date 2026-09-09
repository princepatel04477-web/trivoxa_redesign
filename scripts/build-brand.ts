/**
 * scripts/build-brand.ts
 * ---------------------------------------------------------------------------
 * Generates every derived brand asset from two vector sources of truth:
 *
 *   src/lib/brand/wordmark-paths.ts  →  mark + wordmark geometry
 *   src/lib/tokens/colors.ts         →  the exact brand palette
 *
 * Outputs (all gitignored-adjacent derivatives, safe to regenerate):
 *   public/brand/trivoxa-mark.svg            SVGO'd, viewBox, currentColor
 *   public/brand/trivoxa-wordmark.svg        SVGO'd, viewBox, currentColor
 *   public/brand/trivoxa-lockup-dark.svg     ivory ink on espresso
 *   public/brand/trivoxa-lockup-light.svg    espresso ink on ivory
 *   src/app/icon.svg                         browser tab icon
 *   src/app/apple-icon.png                   180×180
 *   src/app/favicon.ico                      16 / 32 / 48, PNG payload
 *   src/app/opengraph-image.png              1200×630
 *
 * Run: npm run brand
 *
 * When the real logo pack is uploaded to public/brand/_incoming/, run
 * `npm run check:brand` — it reports exactly which generated files the real
 * assets supersede, so the old mark cannot survive anywhere in the repo.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import sharp from 'sharp';

import { BRAND } from '../src/lib/tokens/colors';
import { sampleEagle } from '../src/lib/three/eagle-points';
import {
  MARK_VIEWBOX,
  WORDMARK_CAP_HEIGHT,
  WORDMARK_VIEWBOX,
  markPathData,
  wordmarkPathData,
} from '../src/lib/brand/wordmark-paths';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_BRAND = join(ROOT, 'public', 'brand');
const APP = join(ROOT, 'src', 'app');

const MARK = markPathData();
const WORD = wordmarkPathData();

/* ---------------------------------------------------------------- svgo ---- */

function svgo(svg: string, name: string): string {
  const result = optimize(svg, {
    path: name,
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // `viewBox` must survive — P0 acceptance requires it.
            removeViewBox: false,
            // currentColor only for mark & wordmark, never for lockups with bg & ink
            convertColors: name.includes('lockup') ? false : { currentColor: true },
          },
        },
      },
      // SVGO 3.x — `removeDimensions` drops width/height so each asset scales to
      // its container. Script stripping is already covered by preset-default.
      'removeDimensions',
    ],
  });
  return result.data;
}

/* --------------------------------------------------------------- sources -- */

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" fill="none" role="img" aria-label="Trivoxa">
  <path fill="currentColor" fill-rule="evenodd" d="${MARK}"/>
</svg>`;

const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORDMARK_VIEWBOX}" fill="none" role="img" aria-label="TRIVOXA GROUP">
  <path fill="currentColor" fill-rule="evenodd" d="${WORD}"/>
</svg>`;

/**
 * Horizontal lockup. Geometry is fixed and documented so the two colourways
 * are provably identical apart from ink and ground.
 *   padding 48 · mark 96 · gap 32 · wordmark height 58
 */
const LOCKUP_W = 480;
const LOCKUP_H = 192;
const MARK_SCALE = 96 / 997;
const WORD_SCALE = 58 / WORDMARK_CAP_HEIGHT;
const WORD_X = 48 + 96 + 32;
const WORD_Y = (LOCKUP_H - 58) / 2;

function lockupSvg(bg: string, ink: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LOCKUP_W} ${LOCKUP_H}" fill="none" role="img" aria-label="Trivoxa Group">
  <rect width="${LOCKUP_W}" height="${LOCKUP_H}" fill="${bg}"/>
  <g transform="translate(48 48) scale(${MARK_SCALE})">
    <path fill="${ink}" fill-rule="evenodd" d="${MARK}"/>
  </g>
  <g transform="translate(${WORD_X} ${WORD_Y}) scale(${WORD_SCALE})">
    <path fill="${ink}" fill-rule="evenodd" d="${WORD}"/>
  </g>
</svg>`;
}

/* ----------------------------------------------------------------- icons -- */

/** App-icon treatment: espresso ground, ivory mark, generous inner padding. */
function iconSvg(size: number, radius: number): string {
  const innerSize = size * 0.68;
  const scale = innerSize / 997;
  const offset = (size - innerSize) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${BRAND.espresso.hex}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">
    <path fill="${BRAND.ivory.hex}" fill-rule="evenodd" d="${MARK}"/>
  </g>
</svg>`;
}

/**
 * OG image. 1200×630, espresso ground, a single bronze hairline frame, the
 * mark, the wordmark. No raster photography, no gradient, no text engine —
 * this sandbox has no system fonts, so every glyph here is vector geometry.
 */
function ogSvg(): string {
  const markScale = 170 / 997;
  const markW = 1000 * markScale;
  const markX = (1200 - markW) / 2;
  const markY = 120;
  const wordScale = 64 / WORDMARK_CAP_HEIGHT;
  const wordWidth = 3020 * wordScale;
  const wordX = (1200 - wordWidth) / 2;
  const wordY = markY + 170 + 44;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
  <rect width="1200" height="630" fill="${BRAND.espresso.hex}"/>
  <rect x="32.5" y="32.5" width="1135" height="565" stroke="${BRAND.bronze.hex}" stroke-opacity="0.45"/>
  <rect x="568" y="90" width="64" height="1" fill="${BRAND.bronze.hex}"/>
  <g transform="translate(${markX} ${markY}) scale(${markScale})">
    <path fill="${BRAND.ivory.hex}" fill-rule="evenodd" d="${MARK}"/>
  </g>
  <g transform="translate(${wordX} ${wordY}) scale(${wordScale})">
    <path fill="${BRAND.ivory.hex}" fill-rule="evenodd" d="${WORD}"/>
  </g>
</svg>`;
}

/** Minimal ICO container with PNG payloads (Vista-style). No native encoder needed. */
function buildIco(frames: { size: number; png: Buffer }[]): Buffer {
  const dirSize = 6 + frames.length * 16;
  let offset = dirSize;

  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(frames.length, 4);

  const entries = frames.map((frame) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(frame.size >= 256 ? 0 : frame.size, 0);
    entry.writeUInt8(frame.size >= 256 ? 0 : frame.size, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(frame.png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += frame.png.length;
    return entry;
  });

  return Buffer.concat([dir, ...entries, ...frames.map((f) => f.png)]);
}

/* ------------------------------------------------------------------ run --- */

/**
 * Rasterise the sampled cloud into a composed still: espresso-deep ground,
 * ivory points with the bronze fringe, a single bronze hairline. This image is
 * reviewed on its own merits — a real share of buyers will only ever see it.
 */
async function renderEaglePoster(): Promise<Buffer> {
  const cloud = sampleEagle(5200, 7);
  const WIDTH = 1600;
  const HEIGHT = 900;
  const scale = 330;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  const dots: string[] = [];
  for (let i = 0; i < cloud.count; i += 1) {
    const x = cx + (cloud.positions[i * 3] ?? 0) * scale;
    const y = cy - (cloud.positions[i * 3 + 1] ?? 0) * scale;
    const bronze = (cloud.tints[i] ?? 0) === 1;
    const r = bronze ? 1.5 : 1.15;
    const opacity = bronze ? 0.9 : 0.55 + ((i * 37) % 40) / 100;
    dots.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${bronze ? BRAND.bronze.hex : BRAND.ivory.hex}" fill-opacity="${opacity.toFixed(2)}"/>`,
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BRAND.espressoDeep.hex}"/>
  <rect x="${cx - 32}" y="64" width="64" height="1" fill="${BRAND.bronze.hex}" fill-opacity="0.55"/>
  ${dots.join('')}
</svg>`;

  return sharp(Buffer.from(svg)).webp({ quality: 84 }).toBuffer();
}

async function main(): Promise<void> {
  mkdirSync(PUBLIC_BRAND, { recursive: true });
  mkdirSync(APP, { recursive: true });
  mkdirSync(join(PUBLIC_BRAND, '_incoming'), { recursive: true });

  const written: string[] = [];
  const write = (rel: string, contents: string | Buffer): void => {
    const abs = join(ROOT, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, contents);
    written.push(rel);
  };

  // 1. Vector assets, SVGO'd.
  write('public/brand/trivoxa-mark.svg', svgo(markSvg, 'mark.svg'));
  write('public/brand/trivoxa-wordmark.svg', svgo(wordmarkSvg, 'wordmark.svg'));
  write(
    'public/brand/trivoxa-lockup-dark.svg',
    svgo(lockupSvg(BRAND.espresso.hex, BRAND.ivory.hex), 'lockup-dark.svg'),
  );
  write(
    'public/brand/trivoxa-lockup-light.svg',
    svgo(lockupSvg(BRAND.ivory.hex, BRAND.espresso.hex), 'lockup-light.svg'),
  );

  // 2. App-router metadata icons.
  write('src/app/icon.svg', svgo(iconSvg(64, 12), 'icon.svg'));

  write(
    'src/app/apple-icon.png',
    await sharp(Buffer.from(iconSvg(180, 40))).png().toBuffer(),
  );

  const icoFrames = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      png: await sharp(Buffer.from(iconSvg(size, Math.round(size * 0.18)))).png().toBuffer(),
    })),
  );
  write('src/app/favicon.ico', buildIco(icoFrames));

  write(
    'src/app/opengraph-image.png',
    await sharp(Buffer.from(ogSvg())).png().toBuffer(),
  );

  // 3. The eagle poster — the low-tier / reduced-motion / failed-WebGL still.
  //    Sampled from the SAME generator as the live scene, so the static path
  //    and the WebGL path are provably the same bird (P6, P9, P20).
  write('public/brand/eagle-poster.webp', await renderEaglePoster());

  // 4. A note where the real assets get dropped.
  write(
    'public/brand/_incoming/README.md',
    `# Drop the real logo pack here

Everything from the Drive folder **"Trivoxa website / Logo"** goes in this directory:

- \`Trivoxa Final Logo file without BG\` → the transparent PNGs (\`1.png\` … \`7.png\`)
- \`trivoxa-logo.svg\` and \`trivoxa-logo check.svg\`
- the \`3D LOGO\` folder
- the \`Logo video\` folder

Then run:

\`\`\`bash
npm run check:brand
\`\`\`

It reports which generated provisional asset each uploaded file supersedes, and
flags anything the build still needs. Nothing in \`src/\` has to change: the
components read \`public/brand/trivoxa-mark.svg\` and the vector wordmark in
\`src/lib/brand/wordmark-paths.ts\`, and both are single-point swaps.

**Do not ship the logo video or the 3D renders on the critical path.** They are
recorded in \`docs/DECISIONS.md\` as candidates for the Group page hero and the
loading state — not for the header, not for LCP.
`,
  );

  console.log(`[build-brand] ✓ ${written.length} assets generated`);
  for (const rel of written) console.log(`            · ${rel}`);
}

main().catch((error) => {
  console.error('[build-brand] failed:', error);
  process.exit(1);
});
