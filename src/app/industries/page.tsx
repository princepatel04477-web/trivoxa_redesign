import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { ClosingCta } from '@/components/sections/closing-cta';
import { StatusBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IndustryIcon } from '@/components/ui/industry-icon';
import { ArrowLink } from '@/components/ui/link';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { CAPABILITIES } from '@/content/capabilities';
import { industryHub, proofBand } from '@/lib/selectors';

export const metadata: Metadata = {
  title: 'Industries We Serve — Nine Export Industries from Surat',
  description:
    'Nine industries, each with its catalogue rows, HS codes, MOQs, lead times and compliance notes. Six are live today; three are onboarding and labelled as such rather than marketed as active.',
  alternates: { canonical: '/industries' },
};

/**
 * P13 — /industries, the hub.
 *
 * The audit's complaint about this page was that it listed industries as
 * marketing nouns. Here every card carries the count of catalogue rows behind
 * it and its honest status, and the capability grid underneath points at the
 * page that evidences each capability — a claim with nowhere to be checked is
 * a claim we do not make.
 */
export default function IndustriesPage() {
  const hub = industryHub();
  const band = proofBand();
  const live = hub.filter((entry) => entry.industry.status === 'live').length;

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Nine industries. One sourcing discipline."
        lede="Each industry below is backed by catalogue rows with HS codes, grades, MOQs and lead times — or it is labelled onboarding, with what we can do for you today stated instead."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/industries', label: 'Industries' },
        ]}
        meta={[
          { label: 'Industries', value: hub.length },
          { label: 'Live today', value: live },
          { label: 'Catalogue rows', value: band.liveProductCount },
          { label: 'Loading ports', value: band.ports.map((port) => port.locode).join(' · ') },
        ]}
      />

      <Section surface="light" className="pt-0">
        <Container>
          <Reveal staggerChildren className="grid grid-cols-12 gap-md">
            {hub.map(({ industry, productCount, liveProductCount }) => (
              <Card
                key={industry.slug}
                trace
                lift
                className="group col-span-12 flex flex-col gap-md p-xl md:col-span-6 xl:col-span-4"
              >
                <div className="flex items-start justify-between gap-md">
                  <IndustryIcon name={industry.icon} size={32} className="surface-fg" />
                  <StatusBadge status={industry.status} />
                </div>

                <h2 className="text-heading-lg">{industry.name}</h2>

                <Prose className="text-body-sm">
                  <p className="surface-muted">{industry.shortDescription}</p>
                </Prose>

                <p className="surface-faint spec-value mt-auto text-body-sm" data-spec>
                  {productCount} catalogue rows · {liveProductCount} live
                </p>

                <div className="flex flex-wrap items-center gap-lg">
                  <ArrowLink href={`/industries/${industry.slug}`} className="text-body-sm">
                    Industry detail
                  </ArrowLink>
                  {productCount > 0 ? (
                    <ArrowLink
                      href={`/businesses/product-exports?category=${industry.slug}`}
                      className="text-body-sm"
                    >
                      Products
                    </ArrowLink>
                  ) : null}
                </div>
              </Card>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section surface="dark" id="capabilities">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Eight things we do, whichever industry the order is in."
            lede="Each one is evidenced somewhere on this site — a process step, a register, a catalogue column. Where we cannot evidence it, we do not list it."
          />

          <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
            {CAPABILITIES.map((capability, index) => (
              <div
                key={capability.slug}
                className="surface-hairline col-span-12 flex flex-col gap-sm border-t pt-lg md:col-span-6"
              >
                <p className="surface-faint spec-value" data-spec>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="text-body-lg font-medium">{capability.name}</h3>
                <Prose className="text-body-sm">
                  <p className="surface-muted max-w-[62ch]">{capability.body}</p>
                </Prose>
                <ArrowLink href={capability.evidenceHref} className="mt-auto text-body-sm">
                  {capability.evidence} →
                </ArrowLink>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
