import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { StatusBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { ArrowLink } from '@/components/ui/link';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { COMPANY, SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { CERTIFICATIONS, CONTACT } from '@/content/taxonomy';

export const metadata: Metadata = {
  title: 'Compliance & Certifications',
  description:
    'The credentials Trivoxa Group holds today (IEC, GST), the ones in progress with their published target quarters (FIEO, APEDA, Spice Board, FSSAI, ISO 9001, CE, WHO-GMP), and what that means for a pharmaceutical or food enquiry.',
  alternates: { canonical: '/compliance' },
};

/**
 * P17 — /compliance.
 *
 * The page a European importer's compliance team opens before they reply to a
 * quotation, so it is built as a register rather than as reassurance:
 *
 *  · active credentials with their issuing authority and, where we hold one, a
 *    registration number — and "number on request" where we do not, never a
 *    placeholder that looks like a number;
 *  · in-progress credentials with a target quarter, because the schema forbids
 *    "targeted" without a date;
 *  · the commercial consequence stated out loud: WHO-GMP and FSSAI are not in
 *    hand yet, so pharma and food enquiries are answered with that fact in the
 *    first paragraph rather than discovered at customs. This is the item
 *    DECISIONS.md flags to the founders as a commercial decision we must not
 *    ship around;
 *  · the entity block, which exists because the audit found a site with no
 *    registered address and no entity number anywhere.
 */
export default function CompliancePage() {
  const active = CERTIFICATIONS.filter((cert) => cert.status === 'active');
  const inProgress = CERTIFICATIONS.filter((cert) => cert.status === 'in-progress');

  const byTarget = inProgress.reduce<Record<string, typeof inProgress>>((groups, cert) => {
    const key = cert.targetQuarter ?? cert.targetNote ?? 'Target date to be confirmed';
    groups[key] = [...(groups[key] ?? []), cert];
    return groups;
  }, {});

  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="What we hold, what we are applying for, and when."
        lede="Every credential on this page has an issuing authority, and every one we do not yet hold has a published target. Where a destination market requires something we cannot document, we say so at quotation stage — not at customs."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/compliance', label: 'Compliance' },
        ]}
        meta={[
          { label: 'Active', value: active.length },
          { label: 'In progress', value: inProgress.length },
          { label: 'Next target', value: Object.keys(byTarget)[0] ?? '—' },
          {
            label: 'Entity number',
            value: CONTACT.registeredEntityNumber ? 'Published' : 'Pending release',
          },
        ]}
      />

      {/* the entity block — the audit found no registered address anywhere */}
      <Section surface="light" className="pt-0" id="entity">
        <Container>
          <HairlineRow label="The entity you contract with" />

          <div className="mt-xl grid grid-cols-12 gap-2xl">
            <dl className="col-span-12 md:col-span-6">
              {[
                { label: 'Legal name', value: COMPANY.legalName },
                { label: 'Registered office', value: CONTACT.registeredOffice },
                { label: 'Headquarters', value: COMPANY.headquarters },
                {
                  label: 'Registered entity number',
                  value:
                    CONTACT.registeredEntityNumber ??
                    'Not yet published — released by the founders and printed here the same day. We will not print a registration that belongs to a different company.',
                },
                { label: 'Group established', value: `${COMPANY.founded.year}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="surface-hairline flex items-baseline justify-between gap-lg border-b py-md first:border-t"
                >
                  <dt className="surface-faint spec-value uppercase" data-spec>
                    {item.label}
                  </dt>
                  <dd className="surface-fg text-right text-body-md">{item.value}</dd>
                </div>
              ))}
            </dl>

            <div className="col-span-12 md:col-span-6">
              <Eyebrow tick={false} className="surface-faint">
                Parent company
              </Eyebrow>
              <Prose className="mt-md text-body-md">
                <p className="surface-muted">{SHIVESHWAR_CANONICAL_SENTENCE}</p>
              </Prose>
              <p className="surface-faint mt-lg text-body-sm max-w-[56ch]">
                {COMPANY.founded.note} One sentence, one relationship, used identically on every
                page of this site — the July 2026 audit found three different descriptions of it.
              </p>
              <div className="mt-lg">
                <ArrowLink href="/group">The group structure</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* active */}
      <Section surface="light" tight className="border-t surface-hairline" id="active">
        <Container>
          <SectionHeading
            eyebrow="Active"
            title={`${active.length} credentials we hold today.`}
            lede="Registration numbers are printed here the moment a credential lands. Until we hold the number to publish, it is available on request against a named enquiry."
          />

          <Reveal staggerChildren className="mt-2xl grid grid-cols-12 gap-md">
            {active.map((cert) => (
              <div
                key={cert.slug}
                className="surface-hairline col-span-12 flex flex-col gap-sm border-t pt-lg md:col-span-6"
              >
                <div className="flex items-baseline justify-between gap-md">
                  <h2 className="text-heading-lg">{cert.name}</h2>
                  <span className="surface-faint spec-value text-body-sm" data-spec>
                    {cert.registrationNumber ?? 'Number on request'}
                  </span>
                </div>
                <p className="surface-muted text-body-md">{cert.fullName}</p>
                <p className="surface-faint mt-auto text-body-sm">{cert.issuingAuthority}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      {/* in progress */}
      <Section surface="dark" tight id="in-progress">
        <Container>
          <SectionHeading
            eyebrow="In progress"
            title={`${inProgress.length} applications, each with a published target.`}
            lede="The schema will not accept a credential marked 'targeted' without a quarter or an explicit note, so this list cannot soften into a promise."
          />

          <div className="mt-2xl flex flex-col gap-2xl">
            {Object.entries(byTarget).map(([target, certs]) => (
              <div key={target}>
                <p className="surface-fg spec-value text-display-sm" data-spec>
                  {target}
                </p>
                <ul className="surface-hairline mt-lg flex flex-col border-t">
                  {certs.map((cert) => (
                    <li
                      key={cert.slug}
                      className="surface-hairline flex flex-wrap items-baseline justify-between gap-md border-b py-md"
                    >
                      <span className="flex flex-col gap-1">
                        <span className="surface-fg text-body-lg font-medium">{cert.name}</span>
                        <span className="surface-muted text-body-sm">{cert.fullName}</span>
                        <span className="surface-faint text-body-sm">{cert.issuingAuthority}</span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-xs">
                        <StatusBadge status="in-progress" detail={cert.targetQuarter} />
                        {cert.targetNote ? (
                          <span className="surface-faint text-right text-body-sm">
                            {cert.targetNote}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* the consequence, stated out loud */}
      <Section surface="light" tight id="consequences">
        <Container>
          <SectionHeading
            eyebrow="What this means for your enquiry"
            title="Two lines we cannot yet document the way a pharma or food buyer needs."
          />

          <div className="mt-2xl grid grid-cols-12 gap-md">
            {[
              {
                title: 'Pharmaceutical lines',
                body: 'WHO-GMP is in progress with a published target on this page. Until it is in hand, we will tell you in the first paragraph of a quotation whether your destination market can be served with the documentation we hold — and we will decline the line rather than ship paperwork that fails at customs.',
              },
              {
                title: 'Food and agricultural lines',
                body: 'FSSAI is in progress, and APEDA and Spice Board registrations are targeted for the same quarter. Spices, groundnuts and dehydrated foods are quoted today with the phyto and quality documentation each destination requires; where a market insists on a credential we do not hold, we say so before you spend money on sampling.',
              },
              {
                title: 'Third-party inspection',
                body: 'No inspection body is engaged under a standing agreement today. Buyer-nominated inspections (SGS, Bureau Veritas, Intertek or your own) are arranged per shipment, at the buyer\u2019s cost unless the quotation says otherwise, and our own pre-shipment inspection report travels with every consignment.',
              },
              {
                title: 'Documentation integrity',
                body: 'Invoices, packing lists, certificates of origin and declarations match the goods and the transaction. We do not issue understated invoices, split invoices or mis-declared origin, and we record it when a buyer asks us to.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="surface-hairline col-span-12 flex flex-col gap-sm border-t pt-lg md:col-span-6"
              >
                <p className="surface-faint spec-value" data-spec>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="text-body-lg font-medium">{item.title}</h2>
                <Prose className="text-body-sm">
                  <p className="surface-muted max-w-[62ch]">{item.body}</p>
                </Prose>
              </div>
            ))}
          </div>

          <div className="border-bronze/40 surface-raised mt-2xl flex flex-wrap items-center justify-between gap-xl border p-xl">
            <div className="flex max-w-[54ch] flex-col gap-xs">
              <h2 className="text-heading-lg">Audit the factory before you commit.</h2>
              <p className="surface-muted text-body-md">
                Buyer-nominated or third-party, at our parent company&apos;s mill in Surat or at a
                partner factory. Tell us the protocol and the dates; we arrange access and send the
                documentation set in advance.
              </p>
            </div>
            <ButtonLink href="/rfq?path=audit" size="lg" arrow>
              Arrange a factory audit
            </ButtonLink>
          </div>

          <div className="surface-hairline mt-2xl flex flex-wrap items-center justify-between gap-lg border-t pt-xl">
            <p className="surface-muted text-body-sm max-w-[62ch]">
              Policies that apply to how we work: privacy, terms, cookies and anti-corruption. All
              four are under internal review and say so on the page.
            </p>
            <div className="flex flex-wrap gap-lg">
              <ArrowLink href="/legal/privacy">Privacy</ArrowLink>
              <ArrowLink href="/legal/terms">Terms</ArrowLink>
              <ArrowLink href="/legal/cookies">Cookies</ArrowLink>
              <ArrowLink href="/legal/anti-corruption">Anti-corruption</ArrowLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
