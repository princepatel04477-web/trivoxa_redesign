import { StatusBadge } from '@/components/ui/badge';
import { Container, Section } from '@/components/ui/layout';
import { ArrowLink } from '@/components/ui/link';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { CERTIFICATIONS } from '@/content/taxonomy';

/**
 * P12 / P17 — the compliance posture, summarised.
 *
 * Two columns, and the second one is the point: in-progress credentials with
 * their target quarter printed next to them. "Targeted" without a date is
 * banned by the schema, so this block cannot soften a gap into a vibe.
 *
 * Registration numbers render when the taxonomy has one and say "on request"
 * when it does not — never a placeholder that looks like a number.
 */
export function ComplianceSummary({
  surface = 'light',
  title = 'Compliance, stated plainly.',
  lede,
}: {
  surface?: 'light' | 'dark' | 'deep';
  title?: string;
  lede?: string;
}) {
  const active = CERTIFICATIONS.filter((cert) => cert.status === 'active');
  const inProgress = CERTIFICATIONS.filter((cert) => cert.status === 'in-progress');

  return (
    <Section surface={surface} className="border-t surface-hairline" tight>
      <Container>
        <SectionHeading
          eyebrow="Compliance"
          title={title}
          lede={
            lede ??
            'What we hold today, what we are applying for, and the quarter each application is targeted at.'
          }
          action={
            <ArrowLink href="/compliance" className="text-body-md">
              Full compliance register
            </ArrowLink>
          }
        />

        <div className="mt-2xl grid grid-cols-12 gap-2xl">
          <div className="col-span-12 lg:col-span-6">
            <p className="eyebrow mb-lg">Active</p>
            <ul className="flex flex-col">
              {active.map((cert) => (
                <li
                  key={cert.slug}
                  className="surface-hairline flex items-start justify-between gap-md border-b py-md first:border-t"
                >
                  <span className="flex flex-col gap-1">
                    <span className="surface-fg text-body-lg font-medium">{cert.name}</span>
                    <span className="surface-muted text-body-sm">{cert.fullName}</span>
                    <span className="surface-faint text-body-sm">{cert.issuingAuthority}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-xs">
                    <span className="surface-faint spec-value text-body-sm" data-spec>
                      {cert.registrationNumber ?? 'Number on request'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <p className="eyebrow mb-lg">In progress</p>
            <ul className="flex flex-col">
              {inProgress.map((cert) => (
                <li
                  key={cert.slug}
                  className="surface-hairline flex items-start justify-between gap-md border-b py-md first:border-t"
                >
                  <span className="flex flex-col gap-1">
                    <span className="surface-fg text-body-lg font-medium">{cert.name}</span>
                    <span className="surface-muted text-body-sm">{cert.fullName}</span>
                    {cert.targetNote ? (
                      <span className="surface-faint text-body-sm">{cert.targetNote}</span>
                    ) : null}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-xs">
                    <StatusBadge status="in-progress" detail={cert.targetQuarter} />
                    <span className="surface-faint spec-value text-body-sm" data-spec>
                      {cert.issuingAuthority}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <Prose className="surface-muted mt-xl max-w-[56ch] text-body-sm">
              <p>
                Where a destination market requires a credential we do not yet hold, we say so at
                quotation stage rather than at customs. Registration numbers are published here the
                moment a credential lands.
              </p>
            </Prose>
          </div>
        </div>
      </Container>
    </Section>
  );
}
