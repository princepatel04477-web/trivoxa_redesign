/**
 * src/components/seo/json-ld.tsx — structured data, built from the taxonomy.
 * ---------------------------------------------------------------------------
 * The audit's SEO finding was that the live site had no structured data at all:
 * no Organization, no BreadcrumbList, no product or FAQ markup — so a search
 * result for "textile exporter Surat" showed a title and nothing checkable.
 *
 * Two rules here:
 *  · every node is BUILT from the same content modules the pages render, so a
 *    JSON-LD address, region list or product count cannot disagree with the
 *    visible page (drift between schema and content is the classic way a rich
 *    result gets revoked);
 *  · we only claim what we can evidence. No `Offer` with a price we do not
 *    publish, no `aggregateRating`, no `sameAs` profiles we do not own. A
 *    Product node without a price is still a Product node with an HS code, a
 *    brand and a description — honest and useful.
 */
import type { ReactNode } from 'react';
import { COMPANY, LEADERSHIP, SHIVESHWAR_RELATIONSHIP } from '@/content/company';
import { CONTACT, DIVISIONS, INDUSTRIES, PORTS, REGIONS } from '@/content/taxonomy';
import type { FaqEntry } from '@/content/faqs';
import type { CatalogRow } from '@/lib/selectors';
import type { Crumb } from '@/components/ui/breadcrumb';

export const SITE_URL = 'https://trivoxagroup.com';

/** Renders a JSON-LD block. Server-only by design: no client JS, no hydration. */
export function JsonLd({ data }: { data: Record<string, unknown> }): ReactNode {
  return (
    <script
      type="application/ld+json"
      // The content is ours, built from typed modules — never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema(): Record<string, unknown> {
  const shiveshwar = {
    '@type': 'Organization',
    name: 'Shiveshwar Textiles',
    description:
      'Woven textile manufacturer in Palsana, Surat — cotton, polyester and blended fabrics.',
    address: { '@type': 'PostalAddress', addressLocality: 'Palsana, Surat', addressRegion: 'Gujarat', addressCountry: 'IN' },
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY.legalName,
    alternateName: 'Trivoxa',
    description: `International trade and business group headquartered in ${COMPANY.headquarters}.`,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/trivoxa-lockup-light.svg`,
    image: `${SITE_URL}/opengraph-image.png`,
    foundingDate: String(COMPANY.founded.year),
    email: CONTACT.general,
    telephone: CONTACT.phoneNumbers[0] ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.registeredOffice,
      addressLocality: 'Surat',
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: CONTACT.sales,
        areaServed: REGIONS.map((region) => region.name),
        availableLanguage: ['en'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: CONTACT.general,
        hoursAvailable: CONTACT.hoursIst,
        availableLanguage: ['en'],
      },
    ],
    // The relationship the audit found stated three different ways. One node,
    // one typed constant, and it is the PARENT — per ADR 002.
    ...(SHIVESHWAR_RELATIONSHIP === 'parent-company'
      ? { parentOrganization: shiveshwar }
      : { subOrganization: undefined, memberOf: shiveshwar }),
    department: DIVISIONS.map((division) => ({
      '@type': 'Organization',
      name: division.name,
      description: division.description,
      url: `${SITE_URL}/businesses/${division.slug}`,
    })),
    areaServed: REGIONS.map((region) => ({ '@type': 'Place', name: region.name })),
    knowsAbout: INDUSTRIES.map((industry) => industry.name),
    founder: LEADERSHIP.map((leader) => ({
      '@type': 'Person',
      name: leader.name,
      jobTitle: leader.role,
      email: leader.email,
      worksFor: { '@id': `${SITE_URL}/#organization` },
    })),
    sameAs: CONTACT.socials.map((social) => social.href),
  };
}

export function webSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY.legalName,
    description: 'International trade and business group from Surat, Gujarat, India.',
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** BreadcrumbList — rendered by <PageHero>, so every page that has a trail has one. */
export function breadcrumbSchema(trail: Crumb[]): Record<string, unknown> | null {
  if (trail.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };
}

export function faqSchema(items: FaqEntry[], name: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/**
 * The catalogue as an ItemList of Products. No Offer: we do not publish prices,
 * and inventing a price range for a rich result is exactly the kind of claim
 * that gets a listing penalised.
 */
export function catalogSchema(rows: CatalogRow[], name: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: rows.length,
    itemListElement: rows.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: row.name,
        category: row.categoryName,
        description: row.applications.length > 0 ? `Applications: ${row.applications.join(', ')}.` : undefined,
        brand: { '@type': 'Brand', name: COMPANY.legalName },
        // The spec-data signal: the HS heading and the commercial terms we can
        // actually state, as additional properties rather than as a fake offer.
        additionalProperty: [
          row.hsCode ? { '@type': 'PropertyValue', name: 'HS code', value: row.hsCode } : null,
          row.grade ? { '@type': 'PropertyValue', name: 'Grade', value: row.grade } : null,
          row.moq ? { '@type': 'PropertyValue', name: 'Minimum order quantity', value: row.moq } : null,
          row.leadTime ? { '@type': 'PropertyValue', name: 'Lead time', value: row.leadTime } : null,
          row.incoterms.length > 0
            ? { '@type': 'PropertyValue', name: 'Incoterms', value: row.incoterms.join(', ') }
            : null,
          row.portName
            ? {
                '@type': 'PropertyValue',
                name: 'Loading port',
                value: `${row.portName} (${row.portLocode})`,
              }
            : null,
        ].filter(Boolean),
      },
    })),
  };
}

/** Ports as a Place list — the detail the audit said was the best on the site. */
export function portsSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Loading ports used by Trivoxa Group',
    itemListElement: PORTS.map((port, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Place',
        name: `${port.name} (${port.locode})`,
        description: port.reason,
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
      },
    })),
  };
}
