import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/motion/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { OnboardingState } from '@/components/sections/onboarding-state';
import { CatalogCards, CatalogTable } from '@/components/sections/businesses/catalog-table';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLink } from '@/components/ui/link';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { INDUSTRIES } from '@/content/taxonomy';
import { DIGITAL_PROPERTY, SERVICES } from '@/content/process';
import { industryPageData } from '@/lib/selectors';

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const data = industryPageData(slug);
  if (!data) return {};

  const { industry, rows } = data;
  return {
    title: `${industry.name} — Export Sourcing from Surat`,
    description: `${industry.shortDescription} ${rows.length} catalogue rows with HS codes, MOQs, lead times and Incoterms.`,
    alternates: { canonical: `/industries/${industry.slug}` },
  };
}

/**
 * P13 — /industries/[slug], one template for all nine.
 *
 * Three rules the live site broke and this one cannot:
 *  · the product table is the SAME component the catalogue uses, server-
 *    rendered, so an industry page can never show a different row count from
 *    /businesses/product-exports;
 *  · an onboarding industry leads with the designed onboarding state instead of
 *    a table of dashes — Furniture & Interiors was marketed as an active export
 *    line in three places while its own page admitted the portfolio was still
 *    being finalised;
 *  · compliance notes are this industry's own, and the credentials we do not
 *    yet hold are linked to the register that says when we will.
 */
export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const data = industryPageData(slug);
  if (!data) notFound();

  const { industry, categories, rows, regions, related } = data;
  const onboarding = industry.status === 'onboarding';
  const overview = categories[0]?.overview ?? industry.shortDescription;
  const sampleSupport = categories.some((category) => category.supportsSampleRequest);
  const auditSupport = categories.some((category) => category.supportsFactoryAudit);
  const applications = categories.flatMap((category) => category.applications);

  return (
    <>
      <PageHero
        eyebrow={onboarding ? 'Industry · onboarding' : 'Industry'}
        title={industry.name}
        lede={overview}
        trail={[
          { href: '/', label: 'Home' },
          { href: '/industries', label: 'Industries' },
          { href: `/industries/${industry.slug}`, label: industry.name },
        ]}
        meta={[
          { label: 'Catalogue rows', value: rows.length },
          { label: 'Live today', value: rows.filter((row) => row.status === 'live').length },
          { label: 'Regions', value: regions.map((region) => region.name).join(' · ') || 'On request' },
          { label: 'Sampling', value: sampleSupport ? 'Supported' : 'On request' },
          { label: 'Factory audit', value: auditSupport ? 'Welcome' : 'On request' },
        ]}
        actions={
          <>
            <ButtonLink href={`/rfq?category=${industry.slug}`} arrow>
              Request a quotation
            </ButtonLink>
            {rows.length > 0 ? (
              <ButtonLink
                href={`/businesses/product-exports?category=${industry.slug}`}
                variant="secondary"
              >
                Full catalogue view
              </ButtonLink>
            ) : null}
          </>
        }
      />

      {onboarding ? (
        <Section surface="light" className="pt-0">
          <Container>
            <OnboardingState
              name={industry.name}
              note={industry.shortDescription}
              availableToday={[
                'Sourcing against a written specification, quoted per order',
                'Samples by international courier, with an approval record',
                'MOQ, lead time, Incoterms and loading port on the quotation',
              ]}
              rfqHref={`/rfq?category=${industry.slug}`}
            />
          </Container>
        </Section>
      ) : null}

      {/* A live industry with no catalogue rows is served by the Service Export
          division — Technology is exactly that, and it must not render as an
          empty product page. */}
      {!onboarding && rows.length === 0 ? (
        <Section surface="light" className="pt-0" id="services">
          <Container>
            <SectionHeading
              eyebrow="Served by Service Exports"
              title="This industry is delivered as a service, not shipped in a container."
              lede={`${industry.name} is operated by the group's Service Export division through ${DIGITAL_PROPERTY.label}. There are no catalogue rows for it, and there never will be — here is what we deliver instead.`}
              action={
                <ArrowLink href="/businesses/service-exports" className="text-body-md">
                  Service exports
                </ArrowLink>
              }
            />

            <Reveal staggerChildren className="mt-2xl grid grid-cols-12 gap-md">
              {SERVICES.map((service) => (
                <Card key={service.slug} trace className="col-span-12 flex flex-col gap-sm p-lg md:col-span-6">
                  <h2 className="text-body-lg font-medium">{service.name}</h2>
                  <Prose className="text-body-sm">
                    <p className="surface-muted">{service.summary}</p>
                  </Prose>
                  <p className="surface-faint spec-value mt-auto pt-md text-body-sm" data-spec>
                    {service.deliverables.join(' · ')}
                  </p>
                </Card>
              ))}
            </Reveal>

            <div className="mt-xl">
              <ButtonLink href="/rfq?division=service-exports" arrow>
                Request a proposal
              </ButtonLink>
            </div>
          </Container>
        </Section>
      ) : null}

      {rows.length > 0 ? (
        <Section surface="light" id="products" bleed>
          <Container>
            <SectionHeading
              eyebrow="What we supply"
              title={`${rows.length} catalogue rows, with their numbers.`}
              lede="HS code, grade, MOQ, lead time, Incoterms and loading port. The same rows as the group catalogue, filtered to this industry."
              action={
                <ArrowLink
                  href={`/businesses/product-exports?category=${industry.slug}`}
                  className="text-body-md"
                >
                  Filter the full catalogue
                </ArrowLink>
              }
            />
            <CatalogTable rows={rows} />
            <CatalogCards rows={rows} />
          </Container>
        </Section>
      ) : null}

      {applications.length > 0 ? (
        <Section surface="light" tight className="border-t surface-hairline">
          <Container>
            <HairlineRow label="Where these products go" />
            <Reveal staggerChildren className="mt-xl grid grid-cols-12 gap-md">
              {categories.map((category) => (
                <Card key={category.slug} className="col-span-12 flex flex-col gap-sm p-lg md:col-span-6">
                  <h2 className="text-body-lg font-medium">{category.name}</h2>
                  <Prose className="text-body-sm">
                    <p className="surface-muted">{category.overview}</p>
                  </Prose>
                  <ul className="mt-auto flex flex-wrap gap-xs pt-md">
                    {category.applications.map((application) => (
                      <li
                        key={application}
                        className="surface-hairline surface-muted border px-2.5 py-1 text-body-sm"
                      >
                        {application}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section surface="dark" tight>
        <Container>
          <div className="grid grid-cols-12 gap-2xl">
            <div className="col-span-12 lg:col-span-6">
              <SectionHeading eyebrow="Buyers & markets" title="Who we ship this to." />

              <div className="mt-xl">
                <Eyebrow tick={false} className="surface-faint">
                  Typical buyers
                </Eyebrow>
                <ul className="mt-md flex flex-wrap gap-xs">
                  {industry.typicalBuyers.map((buyer) => (
                    <li
                      key={buyer}
                      className="surface-hairline surface-fg border px-md py-xs text-body-sm"
                    >
                      {buyer}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-xl">
                <Eyebrow tick={false} className="surface-faint">
                  Strongest in
                </Eyebrow>
                <ul className="surface-hairline mt-md flex flex-col border-t">
                  {regions.length > 0 ? (
                    regions.map((region) => (
                      <li
                        key={region.slug}
                        className="surface-hairline flex items-baseline justify-between gap-md border-b py-md"
                      >
                        <Link
                          href="/global-presence"
                          className="link-underline surface-fg text-body-md"
                        >
                          {region.name}
                        </Link>
                        <span className="surface-muted text-body-sm">{region.marketFocus}</span>
                      </li>
                    ))
                  ) : (
                    <li className="surface-muted text-body-md py-md">
                      Quoted per destination — tell us the port and we will confirm the lane.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <SectionHeading eyebrow="Compliance" title="What this industry requires." />

              <ul className="surface-hairline mt-xl flex flex-col border-t">
                {industry.complianceNotes.map((note) => (
                  <li
                    key={note}
                    className="surface-hairline surface-muted flex items-start gap-md border-b py-md text-body-md"
                  >
                    <span aria-hidden className="bg-bronze mt-2 size-1 shrink-0 rounded-full" />
                    {note}
                  </li>
                ))}
              </ul>

              <Prose className="surface-muted mt-lg max-w-[58ch] text-body-sm">
                <p>
                  Group credentials — what we hold and what is in progress, with target quarters —
                  are published in one register rather than repeated per industry.
                </p>
              </Prose>

              <div className="mt-lg flex flex-wrap gap-lg">
                <ArrowLink href="/compliance">Compliance register</ArrowLink>
                <ArrowLink href="/businesses#how-it-works">How an order runs</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="light" tight className="border-t surface-hairline">
        <Container>
          <HairlineRow label="Related industries" />
          <ul className="mt-xl grid grid-cols-12 gap-xs">
            {related.map((entry) => (
              <li key={entry.slug} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <Link
                  href={`/industries/${entry.slug}`}
                  className="surface-hairline surface-muted hover:border-bronze/60 hover:text-bronze flex items-center justify-between gap-md border px-md py-md text-body-sm transition-colors duration-fast ease-house"
                >
                  {entry.name}
                  <span className="surface-faint spec-value" data-spec>
                    {entry.status === 'live' ? 'live' : 'onboarding'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="light" tight>
        <Container>
          <div className="border-bronze/40 surface-raised flex flex-wrap items-center justify-between gap-xl border p-xl">
            <div className="flex max-w-[54ch] flex-col gap-xs">
              <h2 className="text-heading-lg">
                Tell us the grade, the quantity and the destination port.
              </h2>
              <p className="surface-muted text-body-md">
                The export desk answers {rows.length > 0 ? 'with a dated quotation' : 'with what can be sourced to specification'} — MOQ, lead time, Incoterm and loading port included.
              </p>
            </div>
            <ButtonLink href={`/rfq?category=${industry.slug}`} size="lg" arrow>
              Request a quotation
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
