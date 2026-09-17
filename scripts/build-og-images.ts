/**
 * scripts/build-og-images.ts
 * ---------------------------------------------------------------------------
 * Pre-renders social share cards (1200×630) to `public/brand/og/`.
 *
 * Runs during `prebuild` to ensure all 5 core templates (Default, Industry,
 * Catalogue, Compliance, RFQ/Enquiry) and all 25 product detail cards are
 * present as static PNG assets for zero-latency crawler unfurls.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BRAND } from '../src/lib/tokens/colors';
import { markPathData } from '../src/lib/brand/wordmark-paths';
import { INDUSTRIES, PRODUCTS } from '../src/content/taxonomy';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OG_DIR = join(ROOT, 'public', 'brand', 'og');
const MARK = markPathData();

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface OgCardParams {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
  metaLeft: string;
  metaRight: string;
}

function renderCardSvg(params: OgCardParams): string {
  const markScale = 40 / 997;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" fill="none">
    <rect width="1200" height="630" fill="${BRAND.espresso.hex}"/>
    
    <!-- Outer hairline border -->
    <rect x="32.5" y="32.5" width="1135" height="565" stroke="${BRAND.bronze.hex}" stroke-opacity="0.4" stroke-width="1"/>

    <!-- Header bar -->
    <g transform="translate(64, 64)">
      <!-- Mark -->
      <g transform="scale(${markScale})">
        <path fill="${BRAND.ivory.hex}" fill-rule="evenodd" d="${MARK}"/>
      </g>
      <!-- Eyebrow text -->
      <text x="56" y="27" fill="${BRAND.bronze.hex}" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="2">
        ${escapeXml(params.eyebrow.toUpperCase())}
      </text>
    </g>

    <!-- Right badge or host -->
    <g transform="translate(1136, 91)">
      <text text-anchor="end" fill="#BBB6AE" font-family="monospace" font-size="13" letter-spacing="1.5">
        ${escapeXml(params.badge ? params.badge.toUpperCase() : 'TRIVOXAGROUP.COM')}
      </text>
    </g>

    <!-- Main Title & Subtitle -->
    <g transform="translate(64, 250)">
      <text x="0" y="0" fill="${BRAND.ivory.hex}" font-family="serif" font-size="56" font-weight="normal">
        ${escapeXml(params.title)}
      </text>
      <text x="0" y="60" fill="#BBB6AE" font-family="sans-serif" font-size="22" font-weight="normal">
        ${escapeXml(params.subtitle)}
      </text>
    </g>

    <!-- Divider rule -->
    <line x1="64" y1="510" x2="1136" y2="510" stroke="${BRAND.bronze.hex}" stroke-opacity="0.3" stroke-width="1"/>

    <!-- Bottom metadata in mono -->
    <g transform="translate(64, 545)">
      <text x="0" y="0" fill="#817C77" font-family="monospace" font-size="13" letter-spacing="1.5">
        ${escapeXml(params.metaLeft.toUpperCase())}
      </text>
      <text x="1072" y="0" text-anchor="end" fill="#817C77" font-family="monospace" font-size="13" letter-spacing="1.5">
        ${escapeXml(params.metaRight.toUpperCase())}
      </text>
    </g>
  </svg>`;
}

async function buildAll() {
  mkdirSync(OG_DIR, { recursive: true });

  const tasks: { filename: string; params: OgCardParams }[] = [
    // 1. Compliance
    {
      filename: 'compliance.png',
      params: {
        eyebrow: 'Compliance & Certifications',
        title: 'Statutory Credentials & Quality Standards',
        subtitle: '2 credentials active today (IEC, GST) · 7 in progress targeting 2026-Q4',
        badge: 'REGISTER',
        metaLeft: 'Statutory Credentials: 2 Active',
        metaRight: 'Next Target: 2026-Q4',
      },
    },
    // 2. Catalogue
    {
      filename: 'catalogue.png',
      params: {
        eyebrow: 'Export Product Catalogue',
        title: 'Indian Commodity & Manufacturing Lines',
        subtitle: '25 products across 5 live categories · HS code, MOQ, lead time, Incoterms',
        badge: 'CATALOGUE',
        metaLeft: '25 Live Products',
        metaRight: 'Ports: Nhava Sheva · Mundra · Hazira',
      },
    },
    // 3. Enquiry / RFQ / Contact
    {
      filename: 'enquiry.png',
      params: {
        eyebrow: 'Commercial Enquiry Desk',
        title: 'Request a Formal Export Quotation',
        subtitle: 'Direct trade quotations prepared against buyer volume and incoterms.',
        badge: 'RESPONSE: 24H',
        metaLeft: 'Response Window: 24 Business Hours IST',
        metaRight: 'Mon–Sat 10:00–19:00 IST',
      },
    },
  ];

  // 4. Industry cards (9)
  for (const ind of INDUSTRIES) {
    tasks.push({
      filename: `industry-${ind.slug}.png`,
      params: {
        eyebrow: `Industry Sector · ${ind.status === 'live' ? 'Live Today' : 'Onboarding'}`,
        title: ind.name,
        subtitle: ind.shortDescription,
        badge: ind.status === 'live' ? 'LIVE' : 'ONBOARDING',
        metaLeft: `Category: ${ind.name}`,
        metaRight: 'Sourcing ex-Surat, Gujarat',
      },
    });
  }

  // 5. Product cards (25)
  for (const prod of PRODUCTS) {
    tasks.push({
      filename: `product-${prod.slug}.png`,
      params: {
        eyebrow: `Export Specification · HS ${prod.hsCode ?? 'Pending'}`,
        title: prod.name,
        subtitle: `Grade: ${prod.grade ?? 'Standard'} · MOQ: ${prod.moq ?? 'On request'}`,
        badge: `HS ${prod.hsCode ?? 'TRADE'}`,
        metaLeft: `Lead Time: ${prod.leadTime ?? '15–25 days'}`,
        metaRight: `Ex-${(prod.portSlug ?? 'Port').toUpperCase()}`,
      },
    });
  }

  for (const item of tasks) {
    const svg = renderCardSvg(item.params);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    writeFileSync(join(OG_DIR, item.filename), png);
  }
}

buildAll();
