import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ContactForm } from '@/components/forms/contact-form';
import { ContactDetailsPanel } from '@/components/sections/contact-details-panel';
import { Accordion } from '@/components/ui/accordion';
import { ButtonLink } from '@/components/ui/button';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { CONTACT_FAQ, INQUIRY_TYPES } from '@/content/faqs';
import { COMPANY } from '@/content/company';
import { CONTACT } from '@/content/taxonomy';
import { JsonLd, faqSchema } from '@/components/seo/json-ld';

import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: 'Contact — Surat, Gujarat, India',
    description:
      'Every way to reach Trivoxa Group: the four mailbox aliases, the three founders directly, the registered office in Surat, working hours in IST, and what to do when you would rather be called than email.',
    path: '/contact',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/contact' },
};

/**
 * P16 — /contact.
 *
 * Deliberately NOT a second RFQ. This page's job is completeness: every alias,
 * who reads it, the office, the hours, the socials and the two things we do not
 * have — a published telephone line and a registered entity number — each with
 * a designed, honest substitute rather than a blank space or, worse, a number
 * that belongs to a namesake company in Delhi (ADR 018).
 */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Every way to reach us, including the ones we don't have yet."
        lede={`${COMPANY.legalName}, ${CONTACT.registeredOffice}. Four mailbox aliases, three founders reachable directly, and working hours that say when a reply will actually arrive.`}
        trail={[{ href: '/', label: 'Home' }, { href: '/contact', label: 'Contact' }]}
        meta={[
          { label: 'Headquarters', value: COMPANY.headquarters },
          { label: 'Hours', value: `${CONTACT.hoursIst} ${CONTACT.timezoneLabel}` },
          { label: 'Response', value: CONTACT.responseWindow },
          { label: 'General', value: CONTACT.general },
        ]}
      />

      <Section surface="light" className="pt-0">
        <Container>
          <div className="grid grid-cols-12 gap-2xl">
            <div className="col-span-12 lg:col-span-7">
              <HairlineRow label="Send a message" />
              <div className="mt-xl">
                <ContactForm />
              </div>
            </div>

            <aside className="col-span-12 flex flex-col gap-xl lg:col-span-5">
              <ContactDetailsPanel />
            </aside>
          </div>
        </Container>
      </Section>

      <Section surface="dark" tight id="routing">
        <Container>
          <SectionHeading
            eyebrow="Routing"
            title="Which inquiry goes where."
            lede="The form routes on this table, so an enquiry reaches the person who handles it rather than spending a day being forwarded."
          />

          <ul className="mt-2xl flex flex-col">
            {INQUIRY_TYPES.map((type) => (
              <li
                key={type.slug}
                className="surface-hairline grid grid-cols-12 items-baseline gap-md border-b py-lg first:border-t"
              >
                <span className="surface-fg col-span-12 text-body-md font-medium sm:col-span-4">
                  {type.label}
                </span>
                <span className="surface-muted col-span-12 text-body-sm sm:col-span-5">
                  {type.hint}
                </span>
                <a
                  href={`mailto:${CONTACT[type.routesTo]}`}
                  className="link-underline text-accent col-span-12 text-body-sm sm:col-span-3 sm:text-right"
                >
                  {CONTACT[type.routesTo]}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section surface="light" tight>
        <Container>
          <SectionHeading eyebrow="Questions" title="Practical answers, before you write." />
          <JsonLd data={faqSchema(CONTACT_FAQ, 'Contacting Trivoxa Group')} />
          <Accordion
            className="mt-2xl max-w-[48rem]"
            items={CONTACT_FAQ.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
            }))}
            defaultOpenId={CONTACT_FAQ[0]?.id}
          />

          <Prose className="surface-muted mt-2xl max-w-[62ch] text-body-md">
            <p>
              Have a specification ready — grade, quantity, destination port and target Incoterm?
              Skip this page and go straight to the export desk.
            </p>
          </Prose>
          <div className="mt-lg">
            <ButtonLink href="/rfq" arrow>
              Request a quotation
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
