import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { CountUp } from '@/components/motion/count-up';
import { PageHero } from '@/components/sections/page-hero';
import { ClosingCta } from '@/components/sections/closing-cta';
import { GlobeLoader } from '@/components/three/globe-loader';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { allPorts, presenceNumbers, proofBand, regionBlocks } from '@/lib/selectors';
import { JsonLd, portsSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Global Presence — Six Regions, Three Loading Ports',
  description:
    'Trivoxa Group serves six regions from three Gujarat and Maharashtra loading ports — Mundra (INMUN), Kandla (INIXY) and Nhava Sheva (INNSA). The corridors we operate in, with the industries strongest in each.',
  alternates: { canonical: '/global-presence' },
};

/**
 * P14 — /global-presence.
 *
 * Three honesty rules, all visible on the page:
 *  · the arcs and markers are labelled as the corridors we operate in, never as
 *    live shipment tracking — the live site's own disclaimer is carried forward
 *    rather than quietly dropped because the visual got prettier;
 *  · the region list is `regionBlocks()`, the same selector the footer uses, so
 *    the two cannot drift into 5-vs-6 regions again;
 *  · every port prints its UN/LOCODE, which is what makes the page checkable by
 *    someone who books freight for a living.
 *
 * The globe is tiered (SVG chart / cobe / R3F) and the region blocks beside it
 * are the primary content for anyone without a pointer.
 */
export default function GlobalPresencePage() {
  const numbers = presenceNumbers();
  const band = proofBand();
  const blocks = regionBlocks();
  const ports = allPorts();

  return (
    <>
      <PageHero
        eyebrow="Global Presence"
        title="A global perspective. A local understanding."
        lede="Six regions, three loading ports, and a manufacturing belt within a day's road haul of all of them. These are the corridors we operate in — not live shipment tracking."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/global-presence', label: 'Global Presence' },
        ]}
        meta={[
          { label: 'Regions', value: numbers.regions },
          { label: 'Industries', value: numbers.industries },
          { label: 'Loading ports', value: ports.map((port) => port.locode).join(' · ') },
          { label: 'Headquarters', value: 'Surat, Gujarat, IN' },
          { label: 'Desk response', value: numbers.responseWindow },
        ]}
      />

      {/* the globe — deep surface, the only place the site goes fully dark */}
      <Section surface="deep" bleed className="pt-0">
        <Container>
          <div className="grid grid-cols-12 items-center gap-2xl">
            <div className="col-span-12 lg:col-span-7 lg:order-1 order-2">
              <div className="relative aspect-4/3 w-full">
                <GlobeLoader />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 lg:order-2 order-1">
              <Eyebrow tick={false} className="surface-faint">
                Corridors we operate in
              </Eyebrow>
              <Prose className="mt-lg text-body-md">
                <p className="surface-muted max-w-[54ch]">
                  Cargo moves ex Mundra, Kandla or Nhava Sheva into these six regions. Drag the globe
                  to turn it; the list below carries the same information for anyone reading without
                  a pointer, and for anyone whose device would rather not run WebGL.
                </p>
              </Prose>

              <dl className="surface-hairline mt-xl grid grid-cols-3 border-y">
                {[
                  { label: 'Regions', value: numbers.regions },
                  { label: 'Ports', value: numbers.ports },
                  { label: 'Products', value: numbers.products },
                ].map((item) => (
                  <div key={item.label} className="px-md py-lg first:pl-0">
                    <dt className="surface-faint spec-value uppercase" data-spec>
                      {item.label}
                    </dt>
                    <dd className="surface-fg text-display-sm mt-xs">
                      <CountUp value={item.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* regions */}
      <Section surface="light" id="regions">
        <Container>
          <SectionHeading
            eyebrow="Regions"
            title={`${blocks.length} regions, and what each one actually asks for.`}
            lede="Positioning is a sentence about the buyer, not an adjective about the market. Industry links go to the catalogue rows behind them."
          />

          <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
            {blocks.map(({ region, industries }) => (
              <article
                key={region.slug}
                className="surface-hairline col-span-12 flex flex-col gap-md border-t pt-lg md:col-span-6"
              >
                <div className="flex items-baseline justify-between gap-md">
                  <h2 className="text-heading-lg">{region.name}</h2>
                  <span className="surface-faint spec-value" data-spec>
                    {industries.length} industries
                  </span>
                </div>

                <p className="surface-muted text-body-md">{region.marketFocus}</p>

                <Prose className="text-body-sm">
                  <p className="surface-faint max-w-[62ch]">{region.verifiableDetail}</p>
                </Prose>

                <ul className="mt-auto flex flex-wrap gap-xs pt-md">
                  {industries.map((industry) => (
                    <li key={industry.slug}>
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="surface-hairline surface-muted hover:border-bronze/60 hover:text-bronze-ink border px-2.5 py-1 text-body-sm transition-colors duration-fast ease-house"
                      >
                        {industry.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* ports */}
      <Section surface="dark" id="ports">
        <JsonLd data={portsSchema()} />
        <Container>
          <SectionHeading
            eyebrow="Loading Ports"
            title="Three ports, chosen for the cargo rather than the postcode."
            lede="All three are in Gujarat or Maharashtra, within a day's road haul of Surat's manufacturing belt."
          />

          <div className="mt-3xl grid grid-cols-12 gap-md">
            {ports.map((port) => (
              <div
                key={port.slug}
                className="surface-hairline col-span-12 flex flex-col gap-sm border-t pt-lg md:col-span-4"
              >
                <p className="surface-fg spec-value text-display-sm" data-spec>
                  {port.locode}
                </p>
                <h2 className="text-heading-lg">{port.name}</h2>
                <p className="surface-muted text-body-md max-w-[46ch]">{port.reason}</p>
              </div>
            ))}
          </div>

          <HairlineRow className="mt-3xl" />

          <div className="mt-2xl grid grid-cols-12 gap-2xl">
            {PRINCIPLES.map((principle, index) => (
              <div key={principle.title} className="col-span-12 md:col-span-4">
                <p className="surface-faint spec-value mb-xs" data-spec>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="text-body-lg font-medium">{principle.title}</h3>
                <Prose className="mt-sm text-body-sm">
                  <p className="surface-muted max-w-[52ch]">{principle.body}</p>
                </Prose>
              </div>
            ))}
          </div>

          <Prose className="surface-faint mt-2xl max-w-[70ch] text-body-sm">
            <p>
              Transit times, routing and Incoterm are quoted per consignment against the destination
              port — {band.responseWindow}. We do not publish a transit table we cannot hold to.
            </p>
          </Prose>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}

/**
 * Operating principles. Written as things we do, with the artefact named —
 * "we coordinate logistics" is not a principle, it is a job description.
 */
const PRINCIPLES = [
  {
    title: 'The port is named in the quotation',
    body: 'Every price states its loading port and Incoterm — EXW, FOB, CIF or DDP — so a buyer can compare landed cost across suppliers instead of reverse-engineering ours.',
  },
  {
    title: 'Documentation is checked before sailing',
    body: 'Packing list, commercial invoice, certificate of origin and any market-specific declaration are cross-checked against the destination\u2019s import rules while the cargo is still on the road.',
  },
  {
    title: 'We publish the corridors, not a tracking feed',
    body: 'The map on this page shows where we operate. It is not a shipment tracker, and we would rather say so than let a buyer mistake a visual for a live feed.',
  },
] as const;
