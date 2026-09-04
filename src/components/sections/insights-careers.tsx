import Link from 'next/link';
import { Reveal } from '@/components/motion/reveal';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import {
  CAREERS_EMAIL,
  INSIGHTS,
  OPEN_ROLES,
  hasInsights,
  hasOpenRoles,
} from '@/content/editorial';

/**
 * P10 — the conditional sections.
 *
 * Both return `null` when their dataset is empty, which is today. That is a
 * deliberate decision, not an omission: three "Coming soon" cards on a
 * homepage tell a procurement reader that the company stopped moving, and the
 * audit's own verdict on the live site was that the Insights block looked like
 * a page that failed to load.
 *
 * When `src/content/editorial.ts` gains one real entry, the matching section
 * appears — same card treatment as every other preview, no component change.
 */

export function InsightsPreview() {
  if (!hasInsights()) return null;

  return (
    <Section surface="light" className="border-t surface-hairline">
      <Container>
        <SectionHeading
          eyebrow="Insights"
          title="What we are learning about these markets."
          action={
            <ArrowLink href="/insights" className="text-body-md">
              All insights
            </ArrowLink>
          }
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
          {INSIGHTS.slice(0, 3).map((insight) => (
            <Card key={insight.slug} trace className="col-span-12 flex flex-col gap-md p-lg lg:col-span-4">
              <Eyebrow tick={false} className="surface-faint">
                {insight.series} · {insight.readMinutes} min
              </Eyebrow>
              <h3 className="text-heading-lg">{insight.title}</h3>
              <Prose className="text-body-sm">
                <p className="surface-muted">{insight.summary}</p>
              </Prose>
              <ArrowLink href={insight.href} className="mt-auto text-body-sm">
                Read
              </ArrowLink>
            </Card>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

export function CareersPreview() {
  if (!hasOpenRoles()) return null;

  return (
    <Section surface="light" className="border-t surface-hairline">
      <Container>
        <SectionHeading
          eyebrow="Careers"
          title="Roles open right now."
          action={
            <ArrowLink href="/careers" className="text-body-md">
              All roles
            </ArrowLink>
          }
        />

        <Reveal staggerChildren className="mt-2xl flex flex-col gap-md">
          {OPEN_ROLES.slice(0, 4).map((role) => (
            <Card key={role.slug} trace interactive className="flex flex-col gap-sm p-lg">
              <div className="flex flex-wrap items-baseline justify-between gap-md">
                <h3 className="text-heading-lg">{role.title}</h3>
                <p className="surface-faint spec-value" data-spec>
                  {role.team} · {role.location} · {role.type}
                </p>
              </div>
              <Prose className="text-body-sm">
                <p className="surface-muted">{role.summary}</p>
              </Prose>
              <ArrowLink href={role.href} className="text-body-sm">
                View role
              </ArrowLink>
            </Card>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * The single line we keep even with no roles open, because /careers still
 * invites speculative applications and the homepage shouldn't pretend the
 * invitation doesn't exist. It is a hairline, not a section.
 */
export function CareersLine() {
  if (hasOpenRoles()) return null;

  return (
    <div className="border-t surface-hairline">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-md py-xl">
          <p className="surface-muted text-body-md">
            No open roles today. We still read every application that arrives at{' '}
            <Link href={`mailto:${CAREERS_EMAIL}`} className="link-underline text-bronze font-medium">
              {CAREERS_EMAIL}
            </Link>
            .
          </p>
          <ArrowLink href="/careers">Careers at Trivoxa</ArrowLink>
        </div>
      </Container>
    </div>
  );
}
