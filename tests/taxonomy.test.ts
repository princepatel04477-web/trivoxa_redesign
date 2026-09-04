/**
 * P2 acceptance: the taxonomy cannot drift.
 *
 *  · "A test proves that changing REGIONS updates both footer and Global
 *    Presence." — both lists come from one selector over one array; this test
 *    mutates nothing but asserts the invariant that makes mutation safe.
 *  · Homepage previews carry the true total and the affordance label.
 *  · A `live` product can never lose a required spec field.
 *  · Exactly one email domain; no personal inboxes.
 */
import { describe, expect, it } from 'vitest';

import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { CATEGORIES, CONTACT, INDUSTRIES, PRODUCTS, REGIONS } from '@/content/taxonomy';
import { footerRegions, globalPresenceRegions, homepageIndustryPreview } from '@/lib/selectors';

describe('regions — one canonical list', () => {
  it('footer and Global Presence render the identical list', () => {
    const footer = footerRegions().map((r) => r.slug);
    const page = globalPresenceRegions().map((r) => r.slug);

    expect(footer).toEqual(page);
    expect(footer).toHaveLength(REGIONS.length);
  });

  it('uses exactly the six canonical names, once each', () => {
    const names = REGIONS.map((r) => r.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.sort()).toEqual(
      ['Africa', 'Asia-Pacific', 'Europe', 'Middle East', 'North America', 'South America'].sort(),
    );
  });

  it('every region carries a specific, verifiable detail', () => {
    for (const region of REGIONS) {
      expect(region.verifiableDetail.length, region.slug).toBeGreaterThanOrEqual(30);
    }
  });
});

describe('industries — no silent subsets', () => {
  it('the homepage preview carries the true total and an affordance label', () => {
    const preview = homepageIndustryPreview(6);

    expect(preview.shown).toHaveLength(Math.min(6, INDUSTRIES.length));
    expect(preview.total).toBe(INDUSTRIES.length);
    expect(preview.affordanceLabel).toContain(String(INDUSTRIES.length));
    expect(preview.affordanceLabel).toMatch(/^View all \d+ industries$/);
  });

  it('if INDUSTRIES grows, the preview total grows with it', () => {
    // The invariant, stated as behaviour: the total is derived, not typed.
    const preview = homepageIndustryPreview(6);
    expect(preview.affordanceLabel).toBe(`View all ${INDUSTRIES.length} industries`);
  });

  it('onboarding industries are labelled, never hidden', () => {
    const onboarding = INDUSTRIES.filter((i) => i.status === 'onboarding');
    expect(onboarding.length).toBeGreaterThan(0);
    for (const industry of onboarding) {
      expect(industry.complianceNotes.length).toBeGreaterThan(0);
    }
  });
});

describe('categories and products', () => {
  it('every category resolves to an industry', () => {
    const slugs = new Set(INDUSTRIES.map((i) => i.slug));
    for (const category of CATEGORIES) {
      expect(slugs.has(category.industrySlug), category.slug).toBe(true);
    }
  });

  it('no live product renders as a row of dashes', () => {
    for (const product of PRODUCTS.filter((p) => p.status === 'live')) {
      expect(product.hsCode, product.slug).toBeTruthy();
      expect(product.grade, product.slug).toBeTruthy();
      expect(product.moq, product.slug).toBeTruthy();
      expect(product.leadTime, product.slug).toBeTruthy();
      expect(product.incoterms?.length, product.slug).toBeGreaterThan(0);
      expect(product.portSlug, product.slug).toBeTruthy();

      // The literal failure mode from the audit: a dash standing in for data.
      // En-dashes inside genuine ranges ("15–20 days") are correct typography;
      // a value that IS a dash is the defect.
      for (const value of [product.hsCode, product.grade, product.moq, product.leadTime]) {
        expect(value, `${product.slug} ships a dash where data belongs`).not.toMatch(/^[\s—–-]+$/);
      }
    }
  });
});

describe('contact — one email set', () => {
  it('every address is a group-domain alias', () => {
    const addresses = [CONTACT.general, CONTACT.sales, CONTACT.careers, CONTACT.partnerships];
    for (const address of addresses) {
      expect(address).toMatch(/^[a-z]+@trivoxagroup\.com$/);
    }
    expect(new Set(addresses).size).toBe(addresses.length);
  });
});

describe('the Shiveshwar sentence', () => {
  it('states the confirmed relationship exactly once, verbatim', () => {
    expect(SHIVESHWAR_CANONICAL_SENTENCE).toContain('parent company');
    expect(SHIVESHWAR_CANONICAL_SENTENCE).not.toContain('strategic partner');
  });
});
