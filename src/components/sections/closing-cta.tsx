import { ButtonLink } from '@/components/ui/button';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { proofBand } from '@/lib/selectors';
import { CONTACT } from '@/content/taxonomy';

/**
 * P10 — the closing call to action.
 *
 * One commercial conversion on the whole homepage: the RFQ. Contact stays a
 * secondary route because the brief separates them — RFQ is the commercial
 * ask, Contact is the complete "how to reach us" page, and muddling the two
 * is how the live site ended up with three different phrasings of who
 * Shiveshwar is.
 *
 * The supporting line is data, not a slogan: the response window and the desk
 * email, both straight from the taxonomy.
 */
export function ClosingCta() {
  const band = proofBand();

  return (
    <Section surface="dark" className="relative overflow-hidden">
      {/* a single bronze hairline — the only ornament this section gets */}
      <div aria-hidden className="hairline-bronze absolute inset-x-0 top-0 opacity-70" />

      <Container className="relative z-10">
        <div className="grid grid-cols-12 items-end gap-xl">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow>Start a Conversation</Eyebrow>
            <h2 className="text-display-lg mt-lg max-w-[18ch]">
              Send the specification. We&apos;ll come back with numbers.
            </h2>
            <Prose className="mt-lg max-w-[62ch] text-body-md">
              <p className="surface-muted">
                Grade, quantity, destination port, target Incoterm. That is enough for the export
                desk to price a real quotation instead of a brochure answer — answered{' '}
                {band.responseWindow}, desk hours {band.hoursIst}.
              </p>
            </Prose>
          </div>

          <div className="col-span-12 flex flex-col items-start gap-md lg:col-span-5 lg:items-end">
            <div className="flex flex-wrap gap-md">
              <ButtonLink href="/rfq" size="lg" arrow>
                Request a Quotation
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="secondary">
                Contact the Group
              </ButtonLink>
            </div>

            <p className="surface-faint spec-value text-body-sm" data-spec>
              {CONTACT.general} · {CONTACT.registeredOffice}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
