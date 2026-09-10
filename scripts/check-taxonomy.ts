/**
 * scripts/check-taxonomy.ts — the build-time consistency gate.
 * ---------------------------------------------------------------------------
 * Wired into `npm run build`. It fails the build (exit 1) on structural
 * inconsistencies and prints warnings (exit 0) for founder inputs that are
 * honestly outstanding. The distinction matters: a dangling category reference
 * is a defect; a missing phone number the founders haven't supplied yet is a
 * tracked gap that must be loud but must not block the team.
 *
 * Checks (P2 acceptance):
 *   1  every array parses against its zod schema (live products carry specs)
 *   2  every category references an existing industry
 *   3  every product references an existing category and port
 *   4  every industry's relatedCategories exist
 *   5  every industry/region cross-reference resolves
 *   6  exactly one contact-email domain and only known aliases appear in src/
 *   7  the Shiveshwar canonical sentence exists exactly once
 *   8  docs/DECISIONS.md records the Shiveshwar relationship as CLOSED
 *
 * Warnings:
 *   · CONTACT.phoneNumbers empty            → /contact renders the callback substitute
 *   · CONTACT.registeredEntityNumber null   → compliance renders the honest substitute
 *   · region verifiableDetail values        → founder confirmation outstanding
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CATEGORIES,
  CERTIFICATIONS,
  CONTACT,
  DIVISIONS,
  INDUSTRIES,
  PORTS,
  PRODUCTS,
  REGIONS,
} from '../src/content/taxonomy';
import { LEADERSHIP, SHIVESHWAR_CANONICAL_SENTENCE } from '../src/content/company';
import type { ZodType } from 'zod';
import { z } from 'zod';

import {
  CategorySchema,
  CertificationSchema,
  ContactSchema,
  DivisionSchema,
  IndustrySchema,
  PortSchema,
  ProductSchema,
  RegionSchema,
} from '../src/content/schemas';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const errors: string[] = [];
const warnings: string[] = [];

const fail = (message: string): void => {
  errors.push(message);
};
const warn = (message: string): void => {
  warnings.push(message);
};

/* 1 · schema validation -------------------------------------------------- */

function validateAll(): void {
  const suites: [string, unknown[], z.ZodType][] = [
    ['INDUSTRIES', INDUSTRIES, IndustrySchema],
    ['CATEGORIES', CATEGORIES, CategorySchema],
    ['PRODUCTS', PRODUCTS, ProductSchema],
    ['REGIONS', REGIONS, RegionSchema],
    ['PORTS', PORTS, PortSchema],
    ['CERTIFICATIONS', CERTIFICATIONS, CertificationSchema],
    ['DIVISIONS', DIVISIONS, DivisionSchema],
  ];

  for (const [name, rows, schema] of suites) {
    rows.forEach((row, index) => {
      const result = schema.safeParse(row);
      if (!result.success) {
        for (const issue of result.error.issues) {
          fail(`${name}[${index}] ${issue.path.join('.')}: ${issue.message}`);
        }
      }
    });
  }

  const contact = ContactSchema.safeParse(CONTACT);
  if (!contact.success) {
    for (const issue of contact.error.issues) {
      fail(`CONTACT ${issue.path.join('.')}: ${issue.message}`);
    }
  }
}

/* 2–5 · cross-references -------------------------------------------------- */

function checkReferences(): void {
  const industrySlugs = new Set(INDUSTRIES.map((i) => i.slug));
  const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));
  const portSlugs = new Set(PORTS.map((p) => p.slug));
  const regionSlugs = new Set(REGIONS.map((r) => r.slug));

  for (const category of CATEGORIES) {
    if (!industrySlugs.has(category.industrySlug)) {
      fail(`CATEGORIES.${category.slug}: industrySlug "${category.industrySlug}" does not exist in INDUSTRIES.`);
    }
  }

  for (const product of PRODUCTS) {
    if (!categorySlugs.has(product.categorySlug)) {
      fail(`PRODUCTS.${product.slug}: categorySlug "${product.categorySlug}" does not exist in CATEGORIES.`);
    }
    if (product.portSlug && !portSlugs.has(product.portSlug)) {
      fail(`PRODUCTS.${product.slug}: portSlug "${product.portSlug}" does not exist in PORTS.`);
    }
  }

  for (const industry of INDUSTRIES) {
    for (const slug of industry.relatedCategories) {
      if (!categorySlugs.has(slug)) {
        fail(`INDUSTRIES.${industry.slug}: relatedCategories contains unknown category "${slug}".`);
      }
    }
    for (const slug of industry.regionFocus ?? []) {
      if (!regionSlugs.has(slug)) {
        fail(`INDUSTRIES.${industry.slug}: regionFocus contains unknown region "${slug}".`);
      }
    }
  }

  for (const division of DIVISIONS) {
    for (const slug of division.categorySlugs ?? []) {
      if (!categorySlugs.has(slug)) {
        fail(`DIVISIONS.${division.slug}: categorySlugs contains unknown category "${slug}".`);
      }
    }
  }

  for (const region of REGIONS) {
    for (const slug of region.industryFocus) {
      if (!industrySlugs.has(slug)) {
        fail(`REGIONS.${region.slug}: industryFocus contains unknown industry "${slug}".`);
      }
    }
  }

  // Every live industry must own at least one live category with live products,
  // OR be explicitly onboarding. A "live" industry with an empty catalog is the
  // Furniture failure in reverse.
  for (const industry of INDUSTRIES) {
    if (industry.status !== 'live') continue;
    const categories = CATEGORIES.filter((c) => c.industrySlug === industry.slug);
    if (categories.length === 0) continue; // service-side industries are exempt
    const hasLiveProduct = categories.some((c) =>
      PRODUCTS.some((p) => p.categorySlug === c.slug && p.status === 'live'),
    );
    if (!hasLiveProduct) {
      fail(`INDUSTRIES.${industry.slug} is 'live' but owns no category with a live product.`);
    }
  }
}

/* 6 · exactly one email domain, known aliases only ------------------------ */

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
  return out;
}

function checkEmails(): void {
  const known = new Set<string>([
    CONTACT.general,
    CONTACT.sales,
    CONTACT.careers,
    CONTACT.partnerships,
    ...LEADERSHIP.map((leader) => leader.email),
  ]);

  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const seen = new Map<string, string[]>();

  for (const file of walk(join(ROOT, 'src'))) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(emailPattern)) {
      const raw = match[0];
      if (!raw) continue;
      const email = raw.toLowerCase();
      const list = seen.get(email) ?? [];
      list.push(file.replace(ROOT, ''));
      seen.set(email, list);
    }
  }

  for (const [email, files] of seen) {
    // RFC 2606 reserved domains are legal placeholders, not contact data.
    if (/@example\.(com|org|net)$/.test(email)) continue;
    if (!email.endsWith('@trivoxagroup.com')) {
      fail(`Email "${email}" in ${files.join(', ')} is not a @trivoxagroup.com address.`);
    } else if (!known.has(email)) {
      fail(`Email "${email}" in ${files.join(', ')} is not in the canonical CONTACT set. Add it to src/content/taxonomy.ts or remove it.`);
    }
  }
}

/* 7 · the canonical sentence appears exactly once ------------------------- */

function checkCanonicalSentence(): void {
  const needle = 'manufacturing foundation of our parent company';
  const hits: string[] = [];

  for (const file of walk(join(ROOT, 'src'))) {
    if (readFileSync(file, 'utf8').includes(needle)) hits.push(file.replace(ROOT, ''));
  }

  if (hits.length !== 1) {
    fail(
      `The Shiveshwar canonical sentence appears in ${hits.length} files (${hits.join(', ')}). It must live only in src/content/company.ts and be imported everywhere else.`,
    );
  }

  if (!SHIVESHWAR_CANONICAL_SENTENCE.includes(needle)) {
    fail('SHIVESHWAR_CANONICAL_SENTENCE no longer contains the guarded phrase — update the check, not the sentence.');
  }
}

/* 8 · DECISIONS.md records the relationship as CLOSED --------------------- */

function checkDecisionsLog(): void {
  const path = join(ROOT, 'docs', 'DECISIONS.md');
  let doc = '';
  try {
    doc = readFileSync(path, 'utf8');
  } catch {
    fail('docs/DECISIONS.md is missing. P0 requires it; P2 blocks without it.');
    return;
  }

  const row = doc
    .split('\n')
    .find((line) => line.toLowerCase().includes('shiveshwar') && line.includes('|'));

  if (!row) {
    fail('docs/DECISIONS.md has no ADR row for the Shiveshwar Textiles relationship.');
    return;
  }

  if (/\bOPEN\b/i.test(row)) {
    fail(
      'docs/DECISIONS.md still marks the Shiveshwar relationship OPEN. P2 must not guess: get the legal answer from the founders, record it, then rebuild.',
    );
  }
}

/* warnings ---------------------------------------------------------------- */

function collectWarnings(): void {
  if (CONTACT.phoneNumbers.length === 0) {
    warn(
      'CONTACT.phoneNumbers is empty. /contact renders the designed callback substitute. The Company Profile PDF lists two direct numbers — supply them (one-line edit in src/content/taxonomy.ts).',
    );
  }

  if (!CONTACT.registeredEntityNumber) {
    warn(
      'CONTACT.registeredEntityNumber is null. The audit calls this a credibility requirement for procurement teams. Supply the CIN/registration number.',
    );
  }

  for (const region of REGIONS) {
    warn(`REGIONS.${region.slug} verifiableDetail needs founder confirmation: "${region.verifiableDetail}"`);
  }

  for (const certification of CERTIFICATIONS) {
    if (certification.status === 'in-progress' && !certification.targetQuarter && !certification.targetNote) {
      warn(`CERTIFICATIONS.${certification.slug} is in-progress with neither a target quarter nor a note.`);
    }
  }
}

/* run --------------------------------------------------------------------- */

validateAll();
checkReferences();
checkEmails();
checkCanonicalSentence();
checkDecisionsLog();
collectWarnings();

for (const message of warnings) console.warn(`[check-taxonomy] WARN  ${message}`);
for (const message of errors) console.error(`[check-taxonomy] ERROR ${message}`);

if (errors.length > 0) {
  console.error(`\n[check-taxonomy] ${errors.length} error(s). Build blocked.`);
  process.exit(1);
}

console.log(
  `[check-taxonomy] ✓ ${INDUSTRIES.length} industries · ${CATEGORIES.length} categories · ${PRODUCTS.length} products · ${REGIONS.length} regions · ${PORTS.length} ports · ${CERTIFICATIONS.length} certifications`,
);
console.log(`[check-taxonomy] ✓ ${warnings.length} warning(s) — outstanding founder inputs, tracked in docs/DECISIONS.md`);
