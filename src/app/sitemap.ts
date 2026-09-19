import type { MetadataRoute } from 'next';
import { INDUSTRIES } from '@/content/taxonomy';
import { LEGAL_DOCUMENTS } from '@/content/legal';
import { liveProducts } from '@/lib/selectors';
import { SITE_URL } from '@/components/seo/json-ld';

/**
 * P19 — sitemap.
 *
 * Built from the same modules the pages are built from, so a new industry or a
 * new legal document appears here without anyone remembering to add a line.
 * `/styleguide` is excluded: it 404s in production, and a sitemap that lists a
 * 404 is worse than no sitemap.
 *
 * Priorities are honest about the money path — the catalogue and the RFQ sit
 * above the narrative pages, because that is where a buyer converts.
 */

// Content revision date corresponding to the September 2026 release cycle
const RELEASE_DATE = new Date('2026-09-13T00:00:00.000Z');

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/businesses', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/businesses/product-exports', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/businesses/service-exports', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/industries', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/global-presence', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/group', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/rfq', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/insights', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.6, changeFrequency: 'monthly' },
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: RELEASE_DATE,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),

    ...INDUSTRIES.map((industry) => ({
      url: `${SITE_URL}/industries/${industry.slug}`,
      lastModified: RELEASE_DATE,
      changeFrequency: 'monthly' as const,
      // An onboarding industry page is still real content — it just carries a
      // designed empty state instead of a product table.
      priority: industry.status === 'live' ? 0.8 : 0.5,
    })),

    ...liveProducts().map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: RELEASE_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),

    ...Object.keys(LEGAL_DOCUMENTS).map((slug) => ({
      url: `${SITE_URL}/legal/${slug}`,
      lastModified: new Date(LEGAL_DOCUMENTS[slug]?.updated ?? RELEASE_DATE),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
