import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/components/seo/json-ld';

/**
 * P19 — robots.
 *
 * Crawl everything that exists. The only disallow is `/styleguide`, which is
 * dev-only and returns 404 in production — asking a crawler not to fetch it is
 * cheaper than letting it record a 404 against the domain.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/styleguide'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
