import Link from 'next/link';
import { CountUp } from '@/components/motion/count-up';
import { Reveal } from '@/components/motion/reveal';
import { Container, Section } from '@/components/ui/layout';
import { CERTIFICATIONS, PORTS } from '@/content/taxonomy';
import { proofBand } from '@/lib/selectors';

/**
 * P7 · SECTION A — the proof band.
 *
 * Added on the audit's advice: a cold B2B visitor is "scanning for proof of
 * operational reality faster than they are reading brand narrative." So the
 * first thing under the hero is dense, quiet, factual — named ports, live
 * counts, a response window, and an honest compliance posture.
 *
 * Every number is computed (proofBand → taxonomy). Understated by design:
 * bronze hairlines, no cards, no icon larger than 20px.
 */
export function ProofBand() {
  const band = proofBand();
  const active = CERTIFICATIONS.filter((c) => c.status === 'active');
  const inProgress = CERTIFICATIONS.filter((c) => c.status === 'in-progress');

  return (
    <Section surface="deep" tight className="border-t border-bronze/25">
      <Container>
        <Reveal as="div" staggerChildren className="grid grid-cols-12 gap-xl">
          {/* ports */}
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow mb-md">Export Ports</p>
            <ul className="flex flex-col">
              {PORTS.map((port) => (
                <li key={port.slug} className="border-ivory/12 flex gap-md border-b py-md first:border-t">
                  <span className="spec-value text-accent w-14 shrink-0" data-spec>
                    {port.locode}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="text-body-md font-medium">{port.name}</span>
                    <span className="surface-muted text-body-sm">{port.reason}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* live counts */}
          <div className="border-ivory/12 col-span-12 flex flex-col justify-between gap-lg lg:col-span-4 lg:border-l lg:pl-xl">
            <div>
              <p className="eyebrow mb-md">Published Catalog</p>
              <p className="text-display-md leading-none">
                <CountUp value={band.liveProductCount} />
                <span className="surface-muted text-heading-md"> products</span>
              </p>
              <p className="surface-muted mt-xs text-body-sm">
                across <CountUp value={band.liveCategoryCount} /> live categories, each quoted with
                HS code, MOQ, lead time and Incoterms.
              </p>
            </div>

            <div>
              <p className="eyebrow mb-md">Response Window</p>
              <p className="text-heading-md">
                <CountUp value={24} suffix=" business hours" />
              </p>
              <p className="surface-muted mt-xs text-body-sm">
                {band.hoursIst} · {band.timezoneLabel}
              </p>
            </div>
          </div>

          {/* compliance posture — honesty as a trust asset */}
          <div className="border-ivory/12 col-span-12 lg:col-span-3 lg:border-l lg:pl-xl">
            <p className="eyebrow mb-md">Compliance Posture</p>
            <p className="text-body-md">
              {active.map((c) => c.name).join(' and ')} active.{' '}
              {inProgress.map((c) => c.name).join(', ')} in progress with target dates published.
            </p>
            <Link
              href="/compliance"
              className="link-underline text-accent mt-md inline-block text-body-sm font-semibold"
            >
              Read the certification register →
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
