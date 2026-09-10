/**
 * Gates for the homepage stack (P6–P10).
 *
 * These are the assertions that stop a regression from being silent:
 *  · the eagle sampler is deterministic and stays inside the mark's viewbox,
 *    so the static poster and the live scene can't drift apart;
 *  · every canonical region has a globe anchor and every arc really starts at
 *    Surat and ends on the target's unit sphere position;
 *  · previews report their true totals (the July audit's subset finding);
 *  · the conditional sections stay conditional — no "Coming soon" shells.
 */
import { describe, expect, it } from 'vitest';
import { EAGLE_PARTICLES, sampleEagle } from '@/lib/three/eagle-points';
import { HQ, arcPoints, latLngToVector3, regionAnchor, regionsWithAnchors } from '@/lib/geo';
import { REGIONS } from '@/content/taxonomy';
import {
  INSIGHTS,
  OPEN_ROLES,
  InsightSchema,
  RoleSchema,
  hasInsights,
  hasOpenRoles,
} from '@/content/editorial';
import { homepageIndustryPreview, presenceNumbers, proofBand } from '@/lib/selectors';

describe('eagle sampler (P6)', () => {
  it('is deterministic for a given seed and count', () => {
    const a = sampleEagle(500, 7);
    const b = sampleEagle(500, 7);
    expect(Array.from(a.positions)).toEqual(Array.from(b.positions));
  });

  it('produces exactly the requested particle count', () => {
    const cloud = sampleEagle(1234, 7);
    expect(cloud.positions.length).toBe(1234 * 3);
    expect(cloud.tints.length).toBe(1234);
    expect(cloud.dispersed.length).toBe(1234 * 3);
  });

  it('keeps every particle inside the normalised viewbox', () => {
    const cloud = sampleEagle(2000, 7);
    for (let i = 0; i < cloud.positions.length; i += 1) {
      const value = cloud.positions[i] as number;
      expect(Math.abs(value)).toBeLessThanOrEqual(1.02);
    }
  });

  it('tints a small bronze fringe — never a bronze bird', () => {
    const cloud = sampleEagle(6000, 7);
    const bronze = Array.from(cloud.tints).filter((t) => t === 1).length;
    const ratio = bronze / cloud.tints.length;
    expect(ratio).toBeGreaterThan(0.03);
    expect(ratio).toBeLessThan(0.14);
  });

  it('defines the three perf tiers, with zero particles at low', () => {
    expect(EAGLE_PARTICLES.low).toBe(0);
    expect(EAGLE_PARTICLES.medium).toBeLessThan(EAGLE_PARTICLES.high);
  });
});

describe('globe geometry (P9)', () => {
  it('anchors every canonical region', () => {
    expect(regionsWithAnchors()).toHaveLength(REGIONS.length);
    for (const region of REGIONS) {
      const anchor = regionAnchor(region.slug);
      expect(anchor.lat).toBeGreaterThanOrEqual(-90);
      expect(anchor.lat).toBeLessThanOrEqual(90);
      expect(anchor.lng).toBeGreaterThanOrEqual(-180);
      expect(anchor.lng).toBeLessThan(180);
    }
  });

  it('projects lat/lng onto the unit sphere', () => {
    const [x, y, z] = latLngToVector3(HQ.lat, HQ.lng);
    const radius = Math.hypot(x as number, y as number, z as number);
    expect(radius).toBeCloseTo(1, 6);
  });

  it('draws arcs from Surat to the target, lifted off the surface', () => {
    const to = regionAnchor('europe');
    const points = arcPoints(HQ, to, 24, 0.28);
    const first = points[0] as [number, number, number];
    const last = points[points.length - 1] as [number, number, number];
    const middle = points[12] as [number, number, number];

    const start = latLngToVector3(HQ.lat, HQ.lng);
    const end = latLngToVector3(to.lat, to.lng);

    expect(Math.hypot(first[0] - (start[0] as number), first[1] - (start[1] as number), first[2] - (start[2] as number))).toBeLessThan(0.01);
    expect(Math.hypot(last[0] - (end[0] as number), last[1] - (end[1] as number), last[2] - (end[2] as number))).toBeLessThan(0.01);

    const midRadius = Math.hypot(middle[0], middle[1], middle[2]);
    expect(midRadius).toBeGreaterThan(1.05); // lifted
    expect(midRadius).toBeLessThan(1.4);
  });
});

describe('previews report their true totals (P8 / audit fix)', () => {
  it('slices six industries but always carries the real total', () => {
    const preview = homepageIndustryPreview(6);
    expect(preview.shown).toHaveLength(6);
    expect(preview.total).toBe(9);
    expect(preview.affordanceLabel).toContain('9');
    expect(preview.affordanceLabel).toMatch(/view all/i);
  });

  it('computes proof-band numbers instead of typing them', () => {
    const band = proofBand();
    expect(band.ports).toHaveLength(3);
    expect(band.liveProductCount).toBeGreaterThan(0);
    expect(band.liveCategoryCount).toBeGreaterThan(0);
    expect(band.responseWindow).toMatch(/business hour/i);
    for (const port of band.ports) expect(port.locode).toMatch(/^IN[A-Z]{3}$/);
  });

  it('keeps the presence numbers consistent with the taxonomy', () => {
    const numbers = presenceNumbers();
    expect(numbers.regions).toBe(REGIONS.length);
    expect(numbers.industries).toBe(9);
    expect(numbers.ports).toBe(3);
    expect(numbers.products).toBe(proofBand().liveProductCount);
  });
});

describe('conditional sections stay conditional (P10)', () => {
  it('renders neither Insights nor Careers while the datasets are empty', () => {
    expect(INSIGHTS).toHaveLength(0);
    expect(OPEN_ROLES).toHaveLength(0);
    expect(hasInsights()).toBe(false);
    expect(hasOpenRoles()).toBe(false);
  });

  it('rejects a placeholder insight', () => {
    expect(() =>
      InsightSchema.parse({
        slug: 'market-intelligence',
        title: 'Market Intelligence',
        summary: 'Coming soon',
        series: 'Market Intelligence',
        publishedAt: '2026-09-04',
        readMinutes: 5,
        href: '/insights/market-intelligence',
      }),
    ).toThrow();
  });

  it('rejects a role with no substance', () => {
    expect(() =>
      RoleSchema.parse({
        slug: 'export-executive',
        title: 'Export Executive',
        team: 'Exports',
        location: 'Surat',
        type: 'full-time',
        summary: 'TBD',
        href: '/careers/export-executive',
      }),
    ).toThrow();
  });

  it('accepts a real entry, so publishing needs no component change', () => {
    const insight = InsightSchema.parse({
      slug: 'cotton-yarn-pricing',
      title: 'Cotton yarn pricing ex Surat, Q4 2026',
      summary:
        'What moved 30s combed cotton yarn prices over the last quarter, and what that means for FOB Mundra quotations on a 20-day sampling window.',
      series: 'Market Intelligence',
      publishedAt: '2026-10-01',
      readMinutes: 6,
      href: '/insights/cotton-yarn-pricing',
    });
    expect(insight.slug).toBe('cotton-yarn-pricing');
  });
});
