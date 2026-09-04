import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import { DIGITAL_PROPERTY, SERVICES } from '@/content/process';

/**
 * P12 — the six service lines of Trivoxa Digital.
 *
 * Each card lists deliverables rather than adjectives: a buyer comparing
 * agencies can tell from "Export catalogue layout" what they would receive, and
 * cannot from "passionate about design". The property link is on the section as
 * well as the cards, so the cross-property handoff is never a dead end.
 */
export function ServiceLines() {
  return (
    <Section surface="light" id="services">
      <Container>
        <SectionHeading
          eyebrow="Service Lines"
          title="Six lines, delivered by the group's own technology property."
          action={
            <a
              href={DIGITAL_PROPERTY.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-bronze-ink inline-flex items-center gap-1 text-body-md font-medium"
            >
              {DIGITAL_PROPERTY.label}
              <ArrowUpRight aria-hidden size={14} />
            </a>
          }
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
          {SERVICES.map((service) => (
            <Card
              key={service.slug}
              trace
              className="col-span-12 flex flex-col gap-md p-lg md:col-span-6 xl:col-span-4"
            >
              <h3 className="text-heading-lg">{service.name}</h3>

              <Prose className="text-body-sm">
                <p className="surface-muted">{service.summary}</p>
              </Prose>

              <ul className="surface-hairline mt-auto flex flex-col border-t pt-md">
                {service.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="surface-muted text-body-sm flex items-start gap-2 py-1"
                  >
                    <span aria-hidden className="bg-bronze mt-2 size-1 shrink-0 rounded-full" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Reveal>

        <div className="surface-hairline mt-2xl flex flex-wrap items-center justify-between gap-md border-t pt-xl">
          <p className="surface-muted text-body-md max-w-[62ch]">
            Engagement runs on the same five steps whether the work is a catalogue redesign or a
            platform build — scope, priced proposal, review cycles, handover, support.
          </p>
          <ArrowLink href="#engagement">See the engagement process</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
