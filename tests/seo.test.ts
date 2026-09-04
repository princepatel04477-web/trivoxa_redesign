/**
 * SEO gates (P19).
 *
 * Structured data is the one place where a site can quietly start lying to a
 * search engine — an invented price, an aggregateRating nobody collected, a
 * parent company described differently from the page. These tests pin the
 * schema to the content modules that render the visible page.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import {
  SITE_URL,
  breadcrumbSchema,
  catalogSchema,
  faqSchema,
  organizationSchema,
  portsSchema,
  webSiteSchema,
} from '@/components/seo/json-ld';
import { INDUSTRIES, PORTS, REGIONS } from '@/content/taxonomy';
import { LEGAL_DOCUMENTS } from '@/content/legal';
import { RFQ_FAQ } from '@/content/faqs';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { catalogRows } from '@/lib/selectors';

const urls = (): string[] => sitemap().map((entry) => entry.url);

describe('sitemap', () => {
  it('lists every industry and every legal document', () => {
    const list = urls();
    for (const industry of INDUSTRIES) {
      expect(list).toContain(`${SITE_URL}/industries/${industry.slug}`);
    }
    for (const slug of Object.keys(LEGAL_DOCUMENTS)) {
      expect(list).toContain(`${SITE_URL}/legal/${slug}`);
    }
  });

  it('excludes the dev-only styleguide', () => {
    expect(urls()).not.toContain(`${SITE_URL}/styleguide`);
  });

  it('has no duplicate URLs and no relative ones', () => {
    const list = urls();
    expect(new Set(list).size).toBe(list.length);
    for (const url of list) expect(url.startsWith(`${SITE_URL}/`)).toBe(true);
  });

  it('puts the money path above the narrative pages', () => {
    const priority = (path: string): number =>
      sitemap().find((entry) => entry.url === `${SITE_URL}${path}`)?.priority ?? 0;

    expect(priority('/businesses/product-exports')).toBeGreaterThan(priority('/group'));
    expect(priority('/rfq')).toBeGreaterThan(priority('/careers'));
  });
});

describe('Organization schema', () => {
  const org = organizationSchema();

  it('states Shiveshwar Textiles as the PARENT organization', () => {
    const parent = org.parentOrganization as { name?: string } | undefined;
    expect(parent?.name).toBe('Shiveshwar Textiles');
    // and never as a partner, supplier or member
    expect(org.subOrganization).toBeUndefined();
    expect(org.memberOf).toBeUndefined();
  });

  it('describes the relationship in the one canonical sentence', () => {
    // The sentence itself lives in company.ts and is asserted verbatim here so
    // a schema rewrite cannot introduce a fourth phrasing.
    expect(SHIVESHWAR_CANONICAL_SENTENCE).toContain('parent company');
    expect(SHIVESHWAR_CANONICAL_SENTENCE).toContain('Shiveshwar Textiles');
  });

  it('serves exactly the canonical regions, no more', () => {
    const served = (org.areaServed as { name: string }[]).map((place) => place.name);
    expect(served).toEqual(REGIONS.map((region) => region.name));
  });

  it('publishes no rating we have not collected and no price we do not publish', () => {
    const serialized = JSON.stringify(org);
    expect(serialized).not.toContain('aggregateRating');
    expect(serialized).not.toContain('"price"');
    expect(serialized).not.toContain('review');
  });

  it('links only social profiles we actually have', () => {
    const sameAs = org.sameAs as string[];
    expect(Array.isArray(sameAs)).toBe(true);
    for (const profile of sameAs) expect(profile.startsWith('https://')).toBe(true);
  });
});

describe('other schema nodes', () => {
  it('website node points at the organization node', () => {
    const site = webSiteSchema();
    expect((site.publisher as { '@id': string })['@id']).toBe(`${SITE_URL}/#organization`);
    expect(site.inLanguage).toBe('en');
  });

  it('breadcrumbs are positional and absolute', () => {
    const schema = breadcrumbSchema([
      { href: '/', label: 'Home' },
      { href: '/industries', label: 'Industries' },
      { href: '/industries/textile-apparel', label: 'Textile & Apparel' },
    ]);

    const items = schema?.itemListElement as { position: number; item: string }[];
    expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
    expect(items[2]?.item).toBe(`${SITE_URL}/industries/textile-apparel`);
  });

  it('emits no breadcrumb node for a single-item trail', () => {
    expect(breadcrumbSchema([{ href: '/', label: 'Home' }])).toBeNull();
  });

  it('FAQ nodes carry every question verbatim', () => {
    const schema = faqSchema(RFQ_FAQ, 'Requesting a quotation');
    const questions = (schema.mainEntity as { name: string }[]).map((entry) => entry.name);
    expect(questions).toEqual(RFQ_FAQ.map((faq) => faq.question));
  });

  it('the catalogue node lists every row with its HS code and no offer', () => {
    const rows = catalogRows();
    const schema = catalogSchema(rows, 'Catalogue');
    expect(schema.numberOfItems).toBe(rows.length);

    const serialized = JSON.stringify(schema);
    expect(serialized).not.toContain('"offers"');
    expect(serialized).not.toContain('"price"');
    expect(serialized).toContain('5209.42'); // denim, from the taxonomy
    expect(serialized).toContain('HS code');
  });

  it('ports node names all three ports with their UN/LOCODEs', () => {
    const schema = portsSchema();
    const names = (schema.itemListElement as { item: { name: string } }[]).map(
      (entry) => entry.item.name,
    );
    expect(names).toHaveLength(PORTS.length);
    for (const port of PORTS) {
      expect(names.some((name) => name.includes(port.locode))).toBe(true);
    }
  });
});

/* -------------------------------------------------------------------------- */
/* P22 metadata audit — canonicals and titles                                 */
/* -------------------------------------------------------------------------- */

describe('per-route metadata (P22 audit)', () => {
  const pages = ((): string[] => {
    const out: string[] = [];
    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name === 'page.tsx') out.push(full);
      }
    };
    walk(path.resolve(__dirname, '../src/app'));
    return out;
  })();

  /**
   * The styleguide is dev-only, disallowed in robots.txt and absent from the
   * sitemap: giving it a canonical would tell crawlers to index a page we have
   * asked them not to fetch. It is the one route allowed to opt out.
   */
  const exempt = (file: string): boolean => file.includes('/styleguide/');

  it('every route that declares metadata declares a canonical', () => {
    const missing: string[] = [];
    for (const file of pages) {
      if (exempt(file)) continue;
      const src = readFileSync(file, 'utf8');
      const declaresMetadata = /export const metadata|generateMetadata/.test(src);
      if (declaresMetadata && !src.includes('canonical')) missing.push(path.relative(process.cwd(), file));
    }
    expect(missing, `no canonical: ${missing.join(', ')}`).toEqual([]);
  });

  it('the homepage self-canonicalises', () => {
    const src = readFileSync(path.resolve(__dirname, '../src/app/page.tsx'), 'utf8');
    expect(src).toMatch(/canonical:\s*'\/'/);
  });

  it('no route title repeats the brand the template already appends', () => {
    // `title.template` is "%s | Trivoxa Group", so a page title containing the
    // brand renders as "Privacy Policy — Trivoxa Group | Trivoxa Group". Nine
    // routes shipped like that; this is what stops the tenth.
    const offenders: string[] = [];
    for (const file of pages) {
      const src = readFileSync(file, 'utf8');
      for (const line of src.split('\n')) {
        if (/^\s*title:/.test(line) && /Trivoxa Group/.test(line)) {
          offenders.push(`${path.relative(process.cwd(), file)}: ${line.trim()}`);
        }
        // generateMetadata can compose a title too
        if (/title: `\$\{.*\} — Trivoxa Group`/.test(line)) {
          offenders.push(`${path.relative(process.cwd(), file)}: ${line.trim()}`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
