import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ContactForm } from '@/components/forms/contact-form';
import { Accordion } from '@/components/ui/accordion';
import { ButtonLink } from '@/components/ui/button';
import { ArrowLink } from '@/components/ui/link';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { CONTACT_FAQ, INQUIRY_TYPES } from '@/content/faqs';
import { COMPANY, LEADERSHIP } from '@/content/company';
import { CONTACT } from '@/content/taxonomy';
import { JsonLd, faqSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Contact Trivoxa Group — Surat, Gujarat',
  description:
    'Every way to reach Trivoxa Group: the four mailbox aliases, the three founders directly, the registered office in Surat, working hours in IST, and what to do when you would rather be called than email.',
  alternates: { canonical: '/contact' },
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
  const aliases = [
    { label: 'Everything else', value: CONTACT.general, note: 'Read by the founders.' },
    { label: 'Commercial & quotations', value: CONTACT.sales, note: 'The export desk.' },
    { label: 'Careers', value: CONTACT.careers, note: 'Speculative applications welcome.' },
    { label: 'Partnerships & distribution', value: CONTACT.partnerships, note: 'Market partnerships.' },
  ];

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
              <div>
                <Eyebrow tick={false} className="surface-faint">
                  Mailboxes
                </Eyebrow>
                <ul className="mt-md flex flex-col">
                  {aliases.map((alias) => (
                    <li
                      key={alias.value}
                      className="surface-hairline flex items-baseline justify-between gap-md border-b py-md first:border-t"
                    >
                      <span className="flex flex-col">
                        <span className="surface-faint text-body-sm">{alias.label}</span>
                        <a
                          href={`mailto:${alias.value}`}
                          className="link-underline text-bronze text-body-md font-medium"
                        >
                          {alias.value}
                        </a>
                      </span>
                      <span className="surface-muted text-right text-body-sm">{alias.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Eyebrow tick={false} className="surface-faint">
                  The founders, directly
                </Eyebrow>
                <ul className="mt-md flex flex-col">
                  {LEADERSHIP.map((leader) => (
                    <li
                      key={leader.email}
                      className="surface-hairline flex items-baseline justify-between gap-md border-b py-md first:border-t"
                    >
                      <span className="surface-fg text-body-md">{leader.name}</span>
                      <a
                        href={`mailto:${leader.email}`}
                        className="link-underline surface-muted hover:text-bronze text-body-sm"
                      >
                        {leader.email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-raised surface-hairline flex flex-col gap-md border p-lg">
                <div>
                  <p className="surface-faint spec-value uppercase" data-spec>
                    Registered office
                  </p>
                  <p className="surface-fg mt-xs text-body-md">{CONTACT.registeredOffice}</p>
                </div>

                <div>
                  <p className="surface-faint spec-value uppercase" data-spec>
                    Registered entity number
                  </p>
                  <p className="surface-muted mt-xs text-body-sm">
                    {CONTACT.registeredEntityNumber ??
                      'Not yet published. We will print it here the moment the founders release it — we would rather show the gap than print a registration that belongs to a different company.'}
                  </p>
                </div>

                <div>
                  <p className="surface-faint spec-value uppercase" data-spec>
                    Telephone
                  </p>
                  {CONTACT.phoneNumbers.length > 0 ? (
                    <ul className="mt-xs flex flex-col">
                      {CONTACT.phoneNumbers.map((number) => (
                        <li key={number} className="surface-fg spec-value text-body-md" data-spec>
                          {number}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="surface-muted mt-xs text-body-sm">
                      No published line — we will not print a number we cannot guarantee is answered
                      by someone who knows your enquiry. Ask for a callback in the form and we call
                      you within the response window.
                    </p>
                  )}
                </div>

                <div>
                  <p className="surface-faint spec-value uppercase" data-spec>
                    Hours
                  </p>
                  <p className="surface-fg spec-value mt-xs text-body-md" data-spec>
                    {CONTACT.hoursIst} · {CONTACT.timezoneLabel}
                  </p>
                </div>
              </div>

              {CONTACT.socials.length > 0 ? (
                <div>
                  <Eyebrow tick={false} className="surface-faint">
                    Elsewhere
                  </Eyebrow>
                  <ul className="mt-md flex flex-wrap gap-lg">
                    {CONTACT.socials.map((social) => (
                      <li key={social.href}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="link-underline surface-muted hover:text-bronze text-body-sm"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
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
                  className="link-underline text-bronze col-span-12 text-body-sm sm:col-span-3 sm:text-right"
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
            className="mt-2xl max-w-3xl"
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
            <ArrowLink href="/compliance" className="ml-xl">
              Compliance register
            </ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
