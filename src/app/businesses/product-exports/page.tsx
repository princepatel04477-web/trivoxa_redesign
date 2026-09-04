import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ClosingCta } from '@/components/sections/closing-cta';
import { ProductCatalog } from '@/components/sections/businesses/product-catalog';
import { Container, Section } from '@/components/ui/layout';
import { ArrowLink } from '@/components/ui/link';
import { SectionHeading, Prose } from '@/components/ui/typography';
import { CATEGORIES } from '@/content/taxonomy';
import { catalogFacets, catalogRows, proofBand } from '@/lib/selectors';
import { JsonLd, catalogSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Product Exports — Catalogue with HS Codes, MOQ and Lead Times',
  description:
    'The Trivoxa Group export catalogue: every product with its HS code, grade, minimum order quantity, lead time, Incoterms and loading port. Filter by category or industry.',
  alternates: { canonical: '/businesses/product-exports' },
};

/**
 * P12 — /businesses/product-exports.
 *
 * The catalogue is the conversion asset, so the page is the table: hero,
 * filters, table, then the two things a buyer asks next (samples, factory
 * audits) and the route into an RFQ. The seven-step process is not repeated
 * here — it is linked, because printing it twice is how two versions of it
 * eventually disagree.
 */
type Query = Record<string, string | string[] | undefined>;

/**
 * Filters are read here, on the server. That makes this route dynamic rather
 * than prerendered — a deliberate trade: a shared or crawled
 * `?category=home-textiles` link must contain the filtered rows, not a loading
 * state (ADR 027).
 */
export default async function ProductExportsPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const initialCategory = typeof query.category === 'string' ? query.category : 'all';

  const rows = catalogRows();
  const band = proofBand();
  const sampleCategories = CATEGORIES.filter((category) => category.supportsSampleRequest).length;
  const auditCategories = CATEGORIES.filter((category) => category.supportsFactoryAudit).length;

  return (
    <>
      <PageHero
        eyebrow="Product Exports"
        title={`${rows.length} products. Every one with its numbers.`}
        lede="HS code, grade, minimum order quantity, lead time, Incoterms and loading port — published, because a buyer who has to email for an MOQ has already started looking elsewhere."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/businesses', label: 'Businesses' },
          { href: '/businesses/product-exports', label: 'Product Exports' },
        ]}
        meta={[
          { label: 'Products', value: rows.length },
          { label: 'Live today', value: band.liveProductCount },
          { label: 'Categories', value: catalogFacets().length },
          { label: 'Loading ports', value: band.ports.map((port) => port.locode).join(' · ') },
          { label: 'Desk response', value: band.responseWindow },
        ]}
      />

      <Section surface="light" id="catalogue" bleed>
        <JsonLd data={catalogSchema(rows, 'Trivoxa Group export catalogue')} />
        <ProductCatalog rows={rows} facets={catalogFacets()} initialCategory={initialCategory} />
      </Section>

      <Section surface="light" tight className="border-t surface-hairline">
        <Container>
          <SectionHeading
            eyebrow="Before you order"
            title="Samples and factory audits, on request."
            action={
              <ArrowLink href="/businesses#how-it-works" className="text-body-md">
                How an order runs →
              </ArrowLink>
            }
          />

          <div className="mt-2xl grid grid-cols-12 gap-2xl">
            <div className="col-span-12 md:col-span-6">
              <p className="surface-faint spec-value mb-xs" data-spec>
                {sampleCategories} of {CATEGORIES.length} categories
              </p>
              <h3 className="text-heading-lg">Sampling</h3>
              <Prose className="mt-sm text-body-md">
                <p className="surface-muted max-w-[56ch]">
                  Samples are produced against the written specification and shipped by international
                  courier — typically within 20 days for textile lines. Your approval is recorded
                  against the sample reference, and that reference governs production.
                </p>
              </Prose>
              <ArrowLink href="/rfq?path=sample" className="mt-lg">
                Request a sample
              </ArrowLink>
            </div>

            <div className="col-span-12 md:col-span-6">
              <p className="surface-faint spec-value mb-xs" data-spec>
                {auditCategories} of {CATEGORIES.length} categories
              </p>
              <h3 className="text-heading-lg">Factory audits</h3>
              <Prose className="mt-sm text-body-md">
                <p className="surface-muted max-w-[56ch]">
                  Buyer-nominated and third-party audits are welcome at our parent company&apos;s mill
                  and at partner factories. Tell us the protocol and the date; we will arrange access
                  and provide the documentation set in advance.
                </p>
              </Prose>
              <ArrowLink href="/rfq?path=audit" className="mt-lg">
                Arrange a factory audit
              </ArrowLink>
            </div>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
