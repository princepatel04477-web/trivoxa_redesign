import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ClosingCta } from '@/components/sections/closing-cta';
import { ServiceLines } from '@/components/sections/businesses/services';
import { HowItWorks } from '@/components/sections/businesses/how-it-works';
import { Accordion } from '@/components/ui/accordion';
import { ButtonLink } from '@/components/ui/button';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { DIGITAL_PROPERTY, SERVICE_ENGAGEMENT_PROCESS, SERVICE_FAQ, SERVICES } from '@/content/process';
import { CONTACT } from '@/content/taxonomy';
import { JsonLd, faqSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Service Exports — Trivoxa Digital',
  description: `${SERVICES.length} professional service lines delivered by the group's technology property: technology & AI, branding & design, digital marketing, web & app development, SaaS platforms and consulting. Five-step engagement with written scope and handover.`,
  alternates: { canonical: '/businesses/service-exports' },
};

/**
 * P12 — /businesses/service-exports.
 *
 * The bridge back to product exports matters here: the live site ran the two
 * divisions as if they were unrelated companies. Same group, same documentation
 * discipline, one desk — and the dedicated property is signposted rather than
 * hidden behind a logo.
 */
export default function ServiceExportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Exports"
        title="Services delivered like exports: scoped, documented, handed over."
        lede="Trivoxa Digital is the group's technology property. It runs the same discipline we apply to a container of home textiles — a written scope, a priced proposal, review cycles you can open, and a handover that leaves your team able to operate the work without us."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/businesses', label: 'Businesses' },
          { href: '/businesses/service-exports', label: 'Service Exports' },
        ]}
        meta={[
          { label: 'Service lines', value: SERVICES.length },
          { label: 'Engagement steps', value: SERVICE_ENGAGEMENT_PROCESS.length },
          { label: 'Property', value: DIGITAL_PROPERTY.label },
          { label: 'Desk response', value: CONTACT.responseWindow },
        ]}
        actions={
          <>
            <ButtonLink href="/rfq?division=service-exports" arrow>
              Request a proposal
            </ButtonLink>
            <ButtonLink href={DIGITAL_PROPERTY.href} variant="secondary" external>
              Visit {DIGITAL_PROPERTY.label}
            </ButtonLink>
          </>
        }
      />

      <ServiceLines />

      <HowItWorks
        steps={SERVICE_ENGAGEMENT_PROCESS}
        eyebrow="Engagement"
        title="Five steps from scope to handover."
        lede="Written scope, dated proposal, review cycles, handover with credentials transferred, then a defined support window. Nothing here is renegotiated under pressure later."
        surface="dark"
        id="engagement"
      />

      <Section surface="light" tight>
        <Container>
          <div className="grid grid-cols-12 gap-2xl">
            <div className="col-span-12 lg:col-span-5">
              <SectionHeading
                eyebrow="Why Service Exports"
                title="Built on the same operating discipline."
              />
              <Prose className="mt-lg text-body-md">
                <p className="surface-muted max-w-[58ch]">
                  A buyer who has already shipped goods with us does not need to be onboarded again
                  for a services engagement: the same entity, the same desk, the same documentation
                  standard, and one relationship record across both divisions.
                </p>
              </Prose>
              <ButtonLink href="/businesses/product-exports" variant="secondary" className="mt-xl" arrow>
                See the product catalogue
              </ButtonLink>
            </div>

            <div className="col-span-12 lg:col-span-7">
              <ul className="flex flex-col">
                {[
                  {
                    title: 'One accountable desk',
                    body: 'Named people in the proposal, reachable on group-domain addresses — not a rotating account manager.',
                  },
                  {
                    title: 'Evidence at every cycle',
                    body: 'A staging build or draft asset you can open at each review, so feedback lands on something real.',
                  },
                  {
                    title: 'You own the output',
                    body: 'Source files, credentials in your own accounts, and documentation covering how to change what we built.',
                  },
                  {
                    title: 'Pricing that states its assumptions',
                    body: 'Fixed-scope pricing with a dated timeline; out-of-scope requirements are raised before work starts.',
                  },
                ].map((point, index) => (
                  <li
                    key={point.title}
                    className="surface-hairline grid grid-cols-12 gap-md border-b py-lg first:border-t"
                  >
                    <span className="surface-faint spec-value col-span-2 sm:col-span-1" data-spec>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="col-span-10 flex flex-col gap-1 sm:col-span-11">
                      <h3 className="text-body-lg font-medium">{point.title}</h3>
                      <p className="surface-muted text-body-sm max-w-[62ch]">{point.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="light" tight className="border-t surface-hairline">
        <Container>
          <SectionHeading eyebrow="Questions" title="What buyers ask before step one." />
          <JsonLd data={faqSchema(SERVICE_FAQ, 'Working with Trivoxa Digital')} />
          <Accordion
            className="mt-2xl max-w-[48rem]"
            items={SERVICE_FAQ.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
            }))}
            defaultOpenId={SERVICE_FAQ[0]?.id}
          />
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
