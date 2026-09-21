'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Section, HairlineRow } from '@/components/ui/layout';
import { ArrowLink } from '@/components/ui/link';
import { ButtonLink } from '@/components/ui/button';
import { Card as UICard } from '@/components/ui/card';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { OnboardingState } from '@/components/sections/onboarding-state';
import { CatalogTable } from '@/components/sections/businesses/catalog-table';
import { DIGITAL_PROPERTY, SERVICES } from '@/content/process';
import type { Industry, Category, Region } from '@/content/taxonomy';
import type { CatalogRow } from '@/lib/selectors';

// React Bits components
import ScrollExpand from '@/components/reactbits/ScrollExpand/ScrollExpand';
import BlurText from '@/components/reactbits/BlurText/BlurText';
import Masonry from '@/components/reactbits/Masonry/Masonry';
import AnimatedList from '@/components/reactbits/AnimatedList/AnimatedList';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import CardSwap, { Card as SwapCard } from '@/components/reactbits/CardSwap/CardSwap';

interface IndustryDetailClientProps {
  industry: Industry;
  categories: Category[];
  rows: CatalogRow[];
  regions: Region[];
  related: { slug: string; name: string; status: 'live' | 'onboarding' }[];
  commercialContextRecord: Record<
    string,
    { typicalEndUse: string; orderShape: string; buyerFirstQuestion: string }
  >;
}

export function IndustryDetailClient({
  industry,
  categories,
  rows,
  regions,
  related,
  commercialContextRecord,
}: IndustryDetailClientProps) {
  const isService = industry.slug === 'technology';
  const onboarding = industry.status === 'onboarding';

  // Derived specs from categories or default industry parameters
  const specsList = Array.from(
    new Set([
      'Material Composition & Grade Verification',
      'Dimensional Tolerances & GSM/Count Inspection',
      'Batch Quality Certificate (CoA / Test Report)',
      'Export Wooden Palletisation (ISPM 15)',
      'Pre-shipment Container Inspection & Seal Record',
      ...(industry.complianceNotes || []),
    ])
  );

  // Ports used + Incoterms
  const portsList = [
    { name: 'Mundra Port', locode: 'INMUN' },
    { name: 'Pipavav Port', locode: 'INIXY' },
    { name: 'Nhava Sheva', locode: 'INNSA' },
  ];
  const incotermsList = ['FOB', 'CIF', 'CFR', 'EXW', 'DAP', 'DDP'];

  // Masonry items for categories
  const masonryItems = categories.map((cat, i) => ({
    id: cat.slug,
    img: `/brand/categories/${cat.slug}.jpg`,
    url: `/businesses/product-exports?category=${cat.slug}`,
    height: 240 + (i % 3) * 50,
    title: cat.name,
  }));

  return (
    <div className="relative w-full overflow-x-clip">
      {/* 1. SCROLLEXPAND Hero (COMPULSORY) */}
      <section className="relative w-full bg-espresso-deep text-ivory pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-bronze">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/industries" className="hover:underline">Industries</Link>
            <span>/</span>
            <span className="text-ivory/80">{industry.name}</span>
          </nav>
        </div>

        <ScrollExpand
          src={isService ? `/brand/og/industry-${industry.slug}.png` : `/brand/categories/${industry.slug}.jpg`}
          alt={industry.name}
          startWidth={70}
          startHeight={45}
          scrollDistance={1.1}
          holdDistance={0.3}
          useWindowScroll
          className="bg-espresso-deep"
        >
          <div className="mx-auto max-w-5xl rounded-3xl bg-espresso-deep/80 px-4 py-12 text-center backdrop-blur-sm">
            <span className="inline-block rounded-full border border-bronze/40 bg-espresso-deep/90 px-3 py-1 font-mono text-xs text-bronze mb-4">
              {isService ? 'Service Exports Division' : onboarding ? 'Portfolio Onboarding' : 'Verified Export Sector'}
            </span>

            <h1 className="my-3 font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ivory">
              {industry.name}
            </h1>

            <div className="mt-4 max-w-[48rem] mx-auto">
              <BlurText
                text={industry.shortDescription}
                className="text-base sm:text-xl text-ivory/80 leading-relaxed justify-center"
                delay={20}
              />
            </div>

            {/* Ports + Incoterms SplitFlapText Chips */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-bronze/20">
              <span className="font-mono text-xs text-bronze uppercase tracking-wider">Ports:</span>
              {portsList.map((p) => (
                <span
                  key={p.locode}
                  className="inline-flex items-center gap-1.5 rounded-md border border-bronze/30 bg-espresso/80 px-2.5 py-1 font-mono text-xs text-ivory"
                >
                  <span className="text-ivory/70">{p.name}</span>
                  <span className="text-bronze font-bold">
                    <SplitFlapText text={p.locode} flipDuration={0.4} />
                  </span>
                </span>
              ))}

              <span className="mx-2 text-bronze/40 hidden sm:inline">|</span>

              <span className="font-mono text-xs text-bronze uppercase tracking-wider">Incoterms:</span>
              {incotermsList.map((term) => (
                <span
                  key={term}
                  className="rounded-md border border-stone-800 bg-espresso-deep px-2 py-0.5 font-mono text-xs text-bronze"
                >
                  <SplitFlapText text={term} flipDuration={0.4} />
                </span>
              ))}
            </div>
          </div>
        </ScrollExpand>
      </section>

      {/* 2. Onboarding State (if applicable) */}
      {onboarding && !isService && (
        <Section surface="light" className="pt-8">
          <Container>
            <OnboardingState
              name={industry.name}
              note={industry.shortDescription}
              availableToday={[
                'Sourcing against a written specification, quoted per order',
                'Samples by international courier, with an approval record',
                'MOQ, lead time, Incoterms and loading port on the quotation',
              ]}
              rfqHref={`/rfq?industry=${industry.slug}`}
            />
          </Container>
        </Section>
      )}

      {/* 3. Service Sector Details (if service) */}
      {isService && (
        <Section surface="light" className="pt-8" id="services">
          <Container>
            <SectionHeading
              eyebrow="Served by Service Exports"
              title="This industry is delivered as a service, not shipped in a container."
              lede={`${industry.name} is operated by the group's Service Export division through ${DIGITAL_PROPERTY.label}. There are no catalogue rows for it — here is what we deliver instead.`}
              action={
                <ArrowLink href="/businesses/service-exports" className="text-body-md">
                  Service exports
                </ArrowLink>
              }
            />

            <div className="mt-8 grid grid-cols-12 gap-6">
              {SERVICES.map((service) => (
                <UICard key={service.slug} trace className="col-span-12 md:col-span-6 p-6">
                  <h3 className="text-xl font-serif font-medium text-stone-900">{service.name}</h3>
                  <p className="mt-2 text-sm text-stone-600 leading-relaxed">{service.summary}</p>
                  <p className="mt-4 font-mono text-xs text-bronze">
                    {service.deliverables.join(' · ')}
                  </p>
                </UICard>
              ))}
            </div>

            <div className="mt-8">
              <ButtonLink href="/rfq?division=service-exports" arrow>
                Request a proposal
              </ButtonLink>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. Product Categories as Masonry */}
      {masonryItems.length > 0 && !isService && (
        <Section surface="light" className="py-16">
          <Container>
            <SectionHeading
              eyebrow="Product Categories"
              title={`Published lines under ${industry.name}.`}
              lede="Click any category to explore standard specifications, packaging options, and order MOQ guidelines."
            />

            <div className="mt-10 min-h-[480px] w-full">
              <Masonry
                items={masonryItems}
                animateFrom="bottom"
                blurToFocus={true}
                scaleOnHover={true}
                hoverScale={0.97}
              />
            </div>
          </Container>
        </Section>
      )}

      {/* 5. Specs We Quote Against as AnimatedList */}
      <Section surface="dark" className="py-16 bg-espresso-deep text-ivory">
        <Container>
          <div className="grid grid-cols-12 gap-y-8 sm:gap-x-8 items-start">
            <div className="col-span-12 lg:col-span-5">
              <p className="font-mono text-xs text-bronze uppercase tracking-widest mb-2">
                Technical Rigor
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory">
                Specifications We Quote Against
              </h2>
              <p className="mt-4 text-sm sm:text-base text-ivory/70 leading-relaxed">
                Before booking vessel space or production capacity, every parameter is verified with our factory floors and testing labs in Surat and Gujarat export clusters.
              </p>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <AnimatedList
                items={specsList}
                className="flex flex-col gap-3"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 6. Catalogue Rows Table (if present) */}
      {rows.length > 0 && (
        <Section surface="light" id="products" bleed className="py-16">
          <Container>
            <SectionHeading
              eyebrow="Published Catalogue"
              title={`${rows.length} verified catalogue rows with commercial numbers.`}
              lede="HS code, grade, MOQ, lead time, Incoterms and loading port. The same rows as the group catalogue, filtered to this sector."
              action={
                <ArrowLink
                  href={`/businesses/product-exports?category=${industry.slug}`}
                  className="text-body-md"
                >
                  Filter full catalogue
                </ArrowLink>
              }
            />
            <div className="mt-8">
              <CatalogTable rows={rows} />
            </div>
          </Container>
        </Section>
      )}

      {/* 7. Commercial Applications & Context */}
      {categories.length > 0 && (
        <Section surface="light" tight className="border-t border-stone-200 py-16">
          <Container>
            <SectionHeading
              eyebrow="Commercial Applications"
              title="Where these materials and consignments go."
              lede="Key end uses, typical specifications, and procurement shapes."
            />
            <div className="mt-10 grid grid-cols-12 gap-6">
              {categories.map((category) => {
                const commercial = commercialContextRecord[category.slug];
                return (
                  <UICard key={category.slug} className="col-span-12 md:col-span-6 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-medium text-stone-900">{category.name}</h3>
                      {commercial ? (
                        <div className="mt-4 flex flex-col gap-2 text-sm text-stone-600">
                          <p>
                            <span className="font-semibold text-stone-900">Typical end use:</span>{' '}
                            {commercial.typicalEndUse}
                          </p>
                          <p>
                            <span className="font-semibold text-stone-900">Order shape:</span>{' '}
                            {commercial.orderShape}
                          </p>
                          <p>
                            <span className="font-semibold text-stone-900">Buyer first question:</span>{' '}
                            {commercial.buyerFirstQuestion}
                          </p>
                        </div>
                      ) : (
                        <Prose className="mt-2 text-sm text-stone-600">
                          <p>{category.overview}</p>
                        </Prose>
                      )}
                    </div>
                    <ul className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-stone-200">
                      {category.applications.map((application) => (
                        <li
                          key={application}
                          className="rounded border border-stone-200 bg-stone-50 px-2 py-0.5 font-mono text-xs text-stone-600"
                        >
                          {application}
                        </li>
                      ))}
                    </ul>
                  </UICard>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* 8. Buyers, Markets & Compliance */}
      <Section surface="dark" tight className="py-16 bg-espresso-deep text-ivory">
        <Container>
          <div className="grid grid-cols-12 gap-y-12 sm:gap-x-12">
            <div className="col-span-12 lg:col-span-6">
              <SectionHeading eyebrow="Buyers & Markets" title="Who we ship this to." />

              <div className="mt-6">
                <Eyebrow tick={false} className="text-bronze">
                  Typical buyers
                </Eyebrow>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {industry.typicalBuyers.map((buyer) => (
                    <li
                      key={buyer}
                      className="border border-bronze/30 rounded px-3 py-1 text-sm text-ivory/90 bg-espresso/60"
                    >
                      {buyer}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Eyebrow tick={false} className="text-bronze">
                  Strongest trade corridors
                </Eyebrow>
                <ul className="mt-3 divide-y divide-bronze/20 border-t border-b border-bronze/20">
                  {regions.length > 0 ? (
                    regions.map((region) => (
                      <li
                        key={region.slug}
                        className="flex items-center justify-between py-3 text-sm"
                      >
                        <Link
                          href="/global-presence"
                          className="font-medium text-ivory hover:text-bronze transition-colors"
                        >
                          {region.name}
                        </Link>
                        <span className="text-xs text-ivory/60">{region.marketFocus}</span>
                      </li>
                    ))
                  ) : (
                    <li className="py-3 text-sm text-ivory/60">
                      Quoted per destination port on inquiry.
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <SectionHeading eyebrow="Compliance & Quality" title="What this industry requires." />

              <ul className="mt-6 divide-y divide-bronze/20 border-t border-b border-bronze/20">
                {industry.complianceNotes.map((note) => (
                  <li
                    key={note}
                    className="flex items-start gap-3 py-3 text-sm text-ivory/80 leading-relaxed"
                  >
                    <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-bronze" />
                    {note}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-4">
                <ArrowLink href="/businesses#how-it-works" className="text-xs text-bronze">How an order runs</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 9. Related Industries: CardSwap */}
      {related.length >= 2 && (
        <Section surface="light" className="py-16 border-t border-stone-200">
          <Container>
            <HairlineRow label="Related industries" />
            <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-[28rem]">
                <h3 className="text-2xl font-serif font-bold text-stone-900">
                  Cross-Industry Sourcing
                </h3>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  Consolidate multi-commodity shipments from Gujarat and Maharashtra ports under a single group export contract.
                </p>
                <div className="mt-6">
                  <Link
                    href="/industries"
                    className="font-mono text-xs text-bronze hover:underline"
                  >
                    View all 9 industries →
                  </Link>
                </div>
              </div>

              {/* CardSwap Deck */}
              <div className="relative h-[280px] w-full max-w-[340px]">
                <CardSwap delay={5000} pauseOnHover={true} width={300} height={200}>
                  {related.slice(0, 4).map((entry) => (
                    <SwapCard
                      key={entry.slug}
                      customClass="p-6 bg-espresso text-ivory border border-bronze/40 shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <span className="font-mono text-[10px] text-bronze uppercase tracking-wider block">
                          Related Sector · {entry.status}
                        </span>
                        <h4 className="font-serif text-xl font-bold text-ivory mt-2">
                          {entry.name}
                        </h4>
                      </div>
                      <div className="mt-4 pt-2 border-t border-bronze/20 flex justify-between items-center">
                        <Link
                          href={`/industries/${entry.slug}`}
                          className="font-mono text-xs text-bronze hover:underline"
                        >
                          Explore sector →
                        </Link>
                      </div>
                    </SwapCard>
                  ))}
                </CardSwap>
              </div>
            </div>
          </Container>
        </Section>
      )}
    </div>
  );
}
