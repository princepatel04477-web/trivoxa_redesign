import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/sections/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLink } from '@/components/ui/link';
import { StatusBadge } from '@/components/ui/badge';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { JsonLd, productDetailSchema } from '@/components/seo/json-ld';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { getProductDetail, getRelatedProducts } from '@/content/product-details';
import { CATEGORIES, INDUSTRIES, PORTS, PRODUCTS } from '@/content/taxonomy';
import { catalogRows } from '@/lib/selectors';

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.status === 'live').map((product) => ({
    slug: product.slug,
  }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const categoryName = category?.name ?? 'Export Products';

  const title = `${product.name} — HS ${product.hsCode ?? ''}`;
  const description = `Export-grade ${product.name} (${product.grade ?? 'Standard grade'}). Minimum order: ${product.moq ?? 'Specified on request'}, lead time: ${product.leadTime ?? '15–25 days'}. Sourced through Trivoxa Group.`;

  return {
    ...buildRouteMetadata({
      title,
      description,
      path: `/products/${product.slug}`,
      ogTitle: `${product.name} — HS ${product.hsCode ?? ''}`,
      ogDescription: `${product.name} export specifications: ${product.grade}, MOQ ${product.moq}, ex-${product.portSlug} loading port. ${categoryName} from India.`,
    }),
    alternates: { canonical: `https://trivoxagroup.com/products/${product.slug}` },
  };
}

/**
 * P09 — /products/[slug]
 *
 * Dedicated product detail page for each of the 25 catalogue rows.
 * High-intent search surface linking technical commodity specifications,
 * destination compliance documentation, related lines, and direct RFQ prefill.
 */
export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const rows = catalogRows();
  const row = rows.find((r) => r.slug === slug);
  if (!row) notFound();

  const details = getProductDetail(product.slug);
  const relatedProducts = getRelatedProducts(product.slug, product.categorySlug, 3);
  const category = CATEGORIES.find((c) => c.slug === product.categorySlug);
  const industry = INDUSTRIES.find((i) => i.slug === category?.industrySlug);
  const port = PORTS.find((pt) => pt.slug === product.portSlug);

  return (
    <>
      <JsonLd data={productDetailSchema(row)} />

      <PageHero
        eyebrow={`${category?.name ?? 'Export Line'} · Specification`}
        title={product.name}
        lede={
          <span>
            Export-grade commodity line originating from India. Verified technical grade, minimum order quantity, and loading port logistics under Trivoxa Group commercial protocols.
          </span>
        }
        trail={[
          { href: '/', label: 'Home' },
          { href: '/businesses', label: 'Businesses' },
          { href: '/businesses/product-exports', label: 'Product Exports' },
          { href: `/products/${product.slug}`, label: product.name },
        ]}
        meta={[
          { label: 'HS Code', value: product.hsCode ?? 'Pending' },
          { label: 'Grade', value: product.grade ?? 'Standard' },
          { label: 'MOQ', value: product.moq ?? 'On request' },
          { label: 'Lead time', value: product.leadTime ?? 'On request' },
          { label: 'Loading port', value: port ? `${port.name} (${port.locode})` : 'On request' },
        ]}
        actions={
          <>
            <ButtonLink href={`/rfq?product=${product.slug}&category=${product.categorySlug}`} arrow>
              Request a quotation
            </ButtonLink>
            <ButtonLink href={`/rfq?product=${product.slug}&category=${product.categorySlug}&path=sample`} variant="secondary">
              Request product sample
            </ButtonLink>
          </>
        }
      />

      {/* ── Specification Data Block ──────────────────────────────────────── */}
      <Section surface="light" className="pt-0">
        <Container>
          <SectionHeading
            eyebrow="Commercial Specification"
            title="Standard export terms & logistics parameters."
            lede="Verified trade parameters for this line. Custom packaging, alternative incoterms, and private-label marking can be quoted upon enquiry."
          />

          <div className="surface-hairline mt-xl border p-lg md:p-2xl bg-espresso/[0.01]">
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg md:gap-xl">
              <div className="flex flex-col gap-xs">
                <dt className="surface-faint spec-value text-body-sm uppercase tracking-wider" data-spec>
                  Harmonised System (HS) Code
                </dt>
                <dd className="surface-fg spec-value text-body-xl font-medium" data-spec>
                  {product.hsCode ?? 'Classification on request'}
                </dd>
                <p className="surface-muted text-body-sm">
                  Standard WCO 6-digit export tariff heading for customs clearance.
                </p>
              </div>

              <div className="flex flex-col gap-xs">
                <dt className="surface-faint spec-value text-body-sm uppercase tracking-wider" data-spec>
                  Technical Grade
                </dt>
                <dd className="surface-fg spec-value text-body-xl font-medium" data-spec>
                  {product.grade ?? 'Commercial grade'}
                </dd>
                <p className="surface-muted text-body-sm">
                  Physical specification, composition standard, or assay threshold.
                </p>
              </div>

              <div className="flex flex-col gap-xs">
                <dt className="surface-faint spec-value text-body-sm uppercase tracking-wider" data-spec>
                  Minimum Order Quantity (MOQ)
                </dt>
                <dd className="surface-fg spec-value text-body-xl font-medium" data-spec>
                  {product.moq ?? 'Quoted on request'}
                </dd>
                <p className="surface-muted text-body-sm">
                  Standard commercial batch size for production and container staging.
                </p>
              </div>

              <div className="flex flex-col gap-xs">
                <dt className="surface-faint spec-value text-body-sm uppercase tracking-wider" data-spec>
                  Standard Production Lead Time
                </dt>
                <dd className="surface-fg spec-value text-body-xl font-medium" data-spec>
                  {product.leadTime ?? 'Confirmed per contract'}
                </dd>
                <p className="surface-muted text-body-sm">
                  Factory manufacturing and quality inspection window from PO confirmation.
                </p>
              </div>

              <div className="flex flex-col gap-xs">
                <dt className="surface-faint spec-value text-body-sm uppercase tracking-wider" data-spec>
                  Standard Incoterms
                </dt>
                <dd className="surface-fg spec-value text-body-xl font-medium" data-spec>
                  {(product.incoterms ?? []).join(' · ') || 'FOB / CIF'}
                </dd>
                <p className="surface-muted text-body-sm">
                  Quoted ex-origin port or CIF destination port with international transit insurance.
                </p>
              </div>

              <div className="flex flex-col gap-xs">
                <dt className="surface-faint spec-value text-body-sm uppercase tracking-wider" data-spec>
                  Designated Loading Port
                </dt>
                <dd className="surface-fg spec-value text-body-xl font-medium" data-spec>
                  {port ? `${port.name} (${port.locode})` : 'Indian West Coast'}
                </dd>
                <p className="surface-muted text-body-sm">
                  {port?.reason ?? 'Primary Indian maritime terminal handling this commodity.'}
                </p>
              </div>
            </dl>
          </div>
        </Container>
      </Section>

      {/* ── Grade Analysis & Inspection ────────────────────────────────────── */}
      {details ? (
        <Section surface="light" tight className="border-t surface-hairline surface-raised">
          <Container>
            <div className="grid grid-cols-12 gap-xl">
              <div className="col-span-12 lg:col-span-7 flex flex-col gap-md">
                <SectionHeading
                  eyebrow="Technical Standards"
                  title="Understanding the grade specification."
                />
                <Prose className="text-body-md surface-muted leading-relaxed">
                  <p>{details.gradeExplanation}</p>
                </Prose>

                {details.packaging ? (
                  <div className="mt-md surface-hairline border-t pt-md flex flex-col gap-xs">
                    <span className="surface-fg text-body-sm font-medium uppercase tracking-wider">
                      Standard Seaworthy Export Packaging
                    </span>
                    <p className="surface-muted text-body-sm">{details.packaging}</p>
                  </div>
                ) : null}
              </div>

              <div className="col-span-12 lg:col-span-5 flex flex-col gap-md">
                <div className="surface-hairline border p-lg bg-espresso/[0.02] flex flex-col gap-sm">
                  <span className="surface-fg text-body-md font-medium">Pre-Shipment Quality Testing</span>
                  <p className="surface-muted text-body-sm">
                    Key testing parameters verified prior to container stuffing:
                  </p>
                  <ul className="flex flex-col gap-xs mt-sm">
                    {details.inspectionParameters.map((param) => (
                      <li key={param} className="flex items-start gap-sm text-body-sm surface-muted">
                        <span className="text-accent font-bold">―</span>
                        <span>{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ── Export Documentation & Compliance ────────────────────────────── */}
      <Section surface="light" tight className="border-t surface-hairline">
        <Container>
          <SectionHeading
            eyebrow="Compliance & Traceability"
            title="Destination documentation for this line."
            lede="Every consignment ships with full trade documentation matching destination customs and regulatory requirements."
          />

          <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-md">
            {details?.documentation.map((doc, idx) => (
              <div
                key={doc}
                className="surface-hairline flex items-start gap-md border p-md bg-espresso/[0.01]"
              >
                <span className="surface-faint spec-value text-body-sm mt-0.5" data-spec>
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="surface-fg text-body-md">{doc}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Parent Industry & Related Products ────────────────────────────── */}
      <Section surface="light" tight className="border-t surface-hairline surface-raised">
        <Container>
          {industry ? (
            <div className="mb-2xl surface-hairline border p-lg md:p-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-md">
              <div className="flex flex-col gap-xs">
                <span className="surface-faint spec-value text-body-sm uppercase" data-spec>
                  Parent Industry
                </span>
                <h3 className="surface-fg text-body-xl font-medium">{industry.name}</h3>
                <p className="surface-muted text-body-sm max-w-2xl">{industry.shortDescription}</p>
              </div>
              <ArrowLink href={`/industries/${industry.slug}`} className="text-body-md whitespace-nowrap">
                View all {industry.name} lines
              </ArrowLink>
            </div>
          ) : null}

          {relatedProducts.length > 0 ? (
            <div>
              <SectionHeading
                eyebrow="Portfolio Range"
                title={`Related products in ${category?.name ?? 'this category'}.`}
              />
              <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-md">
                {relatedProducts.map((rel) => (
                  <Card key={rel.slug} className="p-lg flex flex-col justify-between gap-md">
                    <div className="flex flex-col gap-xs">
                      <div className="flex items-center justify-between">
                        <span className="surface-faint spec-value text-body-xs" data-spec>
                          HS {rel.hsCode ?? 'Pending'}
                        </span>
                        <StatusBadge status={rel.status} />
                      </div>
                      <Link
                        href={`/products/${rel.slug}`}
                        className="surface-fg hover:text-accent text-body-lg font-medium transition-colors duration-fast"
                      >
                        {rel.name}
                      </Link>
                      <p className="surface-muted text-body-sm line-clamp-2">
                        {rel.grade ?? 'Export standard specifications.'}
                      </p>
                    </div>

                    <div className="border-t surface-hairline pt-sm flex items-center justify-between text-body-sm">
                      <span className="surface-faint spec-value" data-spec>
                        MOQ: {rel.moq}
                      </span>
                      <ArrowLink href={`/products/${rel.slug}`} className="text-accent text-body-sm">
                        View spec
                      </ArrowLink>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* ── Closing RFQ Conversion Section ────────────────────────────────── */}
      <Section surface="deep" className="border-t surface-hairline">
        <Container>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-xl">
            <div className="flex flex-col gap-sm max-w-2xl">
              <Eyebrow>Direct Trade Enquiry</Eyebrow>
              <h2 className="text-display-md text-ivory font-serif">
                Request a formal quotation for {product.name}.
              </h2>
              <p className="text-body-md text-ivory/70">
                Direct quotation prepared for your specified quantity, incoterms, and destination port. Commercial response within 24 business hours IST.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-md">
              <ButtonLink
                href={`/rfq?product=${product.slug}&category=${product.categorySlug}`}
                arrow
              >
                Request formal quotation
              </ButtonLink>
              <ButtonLink
                href={`/rfq?product=${product.slug}&category=${product.categorySlug}&path=sample`}
                variant="secondary"
              >
                Order testing sample
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
