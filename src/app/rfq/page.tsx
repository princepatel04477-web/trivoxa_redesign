import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { RfqForm } from '@/components/forms/rfq-form';
import { Accordion } from '@/components/ui/accordion';
import { ArrowLink } from '@/components/ui/link';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { CONTACT } from '@/content/taxonomy';
import { PRODUCT_EXPORT_PROCESS } from '@/content/process';
import { RFQ_FAQ } from '@/content/faqs';
import { proofBand } from '@/lib/selectors';
import { JsonLd, faqSchema } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Request a Quotation — Trivoxa Group Export Desk',
  description:
    'Send a specification — grade, quantity, destination port and target Incoterm — and the Trivoxa export desk replies within 24 business hours with unit price, MOQ, lead time and loading port.',
  alternates: { canonical: '/rfq' },
};

type Query = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined): string | undefined =>
  typeof value === 'string' ? value : Array.isArray(value) ? value[0] : undefined;

/**
 * P16 — /rfq. The single commercial conversion on the site.
 *
 * Everything else on the site exists to get a buyer here with a specification
 * in hand, so the page is the form, the four things that make a quotation real,
 * and the answers to the five questions that arrive first. Context travels in
 * the query string: `?product=`, `?category=`, `?division=` and `?path=`
 * pre-fill from catalogue rows, industry pages and the compliance audit CTA.
 *
 * Dynamic by design (searchParams) — a pre-filled link from a catalogue row has
 * to arrive pre-filled in the HTML, not after hydration.
 */
export default async function RfqPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const band = proofBand();
  const path = first(query.path);

  const prefill = {
    product: first(query.product),
    category: first(query.category),
    division: first(query.division),
    path,
  };

  const outputs = [
    PRODUCT_EXPORT_PROCESS[0],
    PRODUCT_EXPORT_PROCESS[3],
    PRODUCT_EXPORT_PROCESS[5],
  ].filter((step): step is NonNullable<typeof step> => Boolean(step));

  return (
    <>
      <PageHero
        eyebrow="Request a Quotation"
        title="Send the specification. We'll come back with numbers."
        lede="Grade, quantity, destination port and target Incoterm. That is enough for the export desk to price a real quotation — unit price, MOQ, lead time, Incoterm and loading port — instead of sending a brochure."
        trail={[{ href: '/', label: 'Home' }, { href: '/rfq', label: 'Request a Quotation' }]}
        meta={[
          { label: 'Desk response', value: band.responseWindow },
          { label: 'Desk hours', value: `${CONTACT.hoursIst} ${CONTACT.timezoneLabel}` },
          { label: 'Commercial desk', value: CONTACT.sales },
          { label: 'Loading ports', value: band.ports.map((port) => port.locode).join(' · ') },
        ]}
      />

      <Section surface="light" className="pt-0">
        <Container>
          {path === 'audit' ? (
            <PathNote
              title="Factory audit request"
              body="Marked for the audit route: tell us the protocol, the dates and who is attending. We arrange access at our parent company's mill in Surat or at the partner factory, and send the documentation set in advance."
            />
          ) : null}
          {path === 'sample' ? (
            <PathNote
              title="Sample request"
              body="Marked for sampling: give us the specification and the courier account or address. Textile samples typically ship within 20 days of specification lock, and your approval is recorded against the sample reference."
            />
          ) : null}

          <div className="grid grid-cols-12 gap-2xl">
            <div className="col-span-12 lg:col-span-7">
              <RfqForm prefill={prefill} />
            </div>

            <aside className="col-span-12 lg:col-span-5">
              <HairlineRow label="What happens next" />

              <ol className="mt-lg flex flex-col">
                {outputs.map((step) => (
                  <li
                    key={step.step}
                    className="surface-hairline flex items-baseline justify-between gap-md border-b py-md first:border-t"
                  >
                    <span className="surface-fg text-body-md">{step.title}</span>
                    <span className="surface-faint spec-value text-right text-body-sm" data-spec>
                      {step.output}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="surface-raised surface-hairline mt-xl flex flex-col gap-sm border p-lg">
                <Eyebrow tick={false} className="surface-faint">
                  Prefer email?
                </Eyebrow>
                <Prose className="text-body-sm">
                  <p className="surface-muted">
                    Write to{' '}
                    <a href={`mailto:${CONTACT.sales}`} className="link-underline text-bronze-ink">
                      {CONTACT.sales}
                    </a>{' '}
                    with the same four details, or to{' '}
                    <a href={`mailto:${CONTACT.general}`} className="link-underline text-bronze-ink">
                      {CONTACT.general}
                    </a>{' '}
                    if you are not sure which desk handles it. Both are read by the founders.
                  </p>
                </Prose>
                <div className="mt-xs flex flex-wrap gap-lg">
                  <ArrowLink href="/businesses/product-exports">Browse the catalogue</ArrowLink>
                  <ArrowLink href="/compliance">Check our credentials</ArrowLink>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section surface="light" tight className="border-t surface-hairline">
        <Container>
          <SectionHeading eyebrow="Before you send" title="The five questions that arrive first." />
          <JsonLd data={faqSchema(RFQ_FAQ, 'Requesting a quotation from Trivoxa Group')} />
          <Accordion
            className="mt-2xl max-w-3xl"
            items={RFQ_FAQ.map((faq) => ({ id: faq.id, question: faq.question, answer: faq.answer }))}
            defaultOpenId={RFQ_FAQ[0]?.id}
          />
        </Container>
      </Section>
    </>
  );
}

function PathNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-bronze/40 surface-raised mb-2xl flex flex-col gap-xs border p-lg">
      <Eyebrow tick={false} className="surface-faint">
        {title}
      </Eyebrow>
      <p className="surface-muted text-body-md max-w-[74ch]">{body}</p>
    </div>
  );
}
