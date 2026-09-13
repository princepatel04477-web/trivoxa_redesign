/**
 * src/lib/seo/metadata.ts
 * ---------------------------------------------------------------------------
 * Typed metadata helper for Trivoxa Group routes.
 *
 * Enforces:
 *  - Absolute canonical URLs pointing to production origin (https://trivoxagroup.com)
 *  - Per-route OpenGraph title, description, url, siteName, and locale
 *  - Strict og:image configuration with 1200x630 dimensions and required alt text
 *  - Consistent Twitter summary_large_image card tags
 */
import type { Metadata } from 'next';

export const PRODUCTION_ORIGIN = 'https://trivoxagroup.com';

export interface RouteMetadataInput {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    url: string;
    width?: number;
    height?: number;
    alt: string;
  };
  type?: 'website' | 'article';
}

/**
 * Resolves the canonical OpenGraph image URL and descriptive alt text for a route.
 */
export function resolveOgImage(path: string, pageTitle: string): { url: string; width: number; height: number; alt: string } {
  const cleanPath = path.replace(/\/$/, '') || '/';

  // Compliance template
  if (cleanPath === '/compliance') {
    return {
      url: `${PRODUCTION_ORIGIN}/brand/og/compliance.png`,
      width: 1200,
      height: 630,
      alt: 'Trivoxa Group Compliance & Certifications Register — 2 active credentials, 7 in progress targeting 2026-Q4',
    };
  }

  // Catalogue template
  if (cleanPath === '/businesses/product-exports') {
    return {
      url: `${PRODUCTION_ORIGIN}/brand/og/catalogue.png`,
      width: 1200,
      height: 630,
      alt: 'Trivoxa Group Export Catalogue — 25 products across 5 live categories with HS codes, MOQs, lead times and Incoterms',
    };
  }

  // RFQ / Contact response window template
  if (cleanPath === '/rfq' || cleanPath === '/contact') {
    return {
      url: `${PRODUCTION_ORIGIN}/brand/og/enquiry.png`,
      width: 1200,
      height: 630,
      alt: 'Trivoxa Group Commercial Enquiry & RFQ Desk — Response window within 24 business hours IST',
    };
  }

  // Industry template
  if (cleanPath.startsWith('/industries/')) {
    const slug = cleanPath.replace('/industries/', '');
    return {
      url: `${PRODUCTION_ORIGIN}/brand/og/industry-${slug}.png`,
      width: 1200,
      height: 630,
      alt: `${pageTitle} — Trivoxa Group Export Sourcing Specifications`,
    };
  }

  // Product template
  if (cleanPath.startsWith('/products/')) {
    const slug = cleanPath.replace('/products/', '');
    return {
      url: `${PRODUCTION_ORIGIN}/brand/og/product-${slug}.png`,
      width: 1200,
      height: 630,
      alt: `${pageTitle} — Trivoxa Group Export Line Specification`,
    };
  }

  // Default brand template for all other routes
  return {
    url: `${PRODUCTION_ORIGIN}/opengraph-image.png`,
    width: 1200,
    height: 630,
    alt: 'Trivoxa Group — International Trade & Business Group, Surat, Gujarat, India',
  };
}

/**
 * Builds a strictly-typed Next.js Metadata object with per-route social and canonical tags.
 */
export function buildRouteMetadata(input: RouteMetadataInput): Metadata {
  const canonicalPath = input.path === '/' ? '/' : input.path.replace(/\/$/, '');
  const canonicalUrl = `${PRODUCTION_ORIGIN}${canonicalPath}`;

  const resolvedImage = input.ogImage ?? resolveOgImage(canonicalPath, input.ogTitle ?? input.title);

  const title = input.title;
  const description = input.description;
  const ogTitle = input.ogTitle ?? title;
  const ogDescription = input.ogDescription ?? description;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'Trivoxa Group',
      locale: 'en_IN',
      type: input.type ?? 'website',
      images: [
        {
          url: resolvedImage.url,
          width: resolvedImage.width ?? 1200,
          height: resolvedImage.height ?? 630,
          alt: resolvedImage.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [resolvedImage.url],
    },
  };
}
