import { Mail } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { LEADERSHIP } from '@/content/company';

/**
 * P11 — leadership.
 *
 * Real names, real roles, group-domain aliases only (never personal inboxes),
 * and the founders' own words. No stock portraits and no invented
 * credentials: until photography exists, each card carries a monogram set in a
 * bronze hairline, which is a treatment rather than a placeholder pretending
 * to be a photograph.
 */
export function GroupLeadership() {
  return (
    <Section surface="light" id="leadership">
      <Container>
        <SectionHeading
          eyebrow="Leadership"
          title="Three founders, one operating discipline."
          lede="Reachable directly, on group-domain addresses, because a supplier you cannot email is a supplier you cannot audit."
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
          {LEADERSHIP.map((leader) => (
            <Card
              key={leader.email}
              trace
              className="col-span-12 flex flex-col gap-lg p-xl md:col-span-4"
            >
              <Monogram name={leader.name} />

              <div className="flex flex-col gap-1">
                <h3 className="text-heading-lg">{leader.name}</h3>
                <p className="surface-faint spec-value uppercase" data-spec>
                  {leader.role}
                </p>
              </div>

              <Prose className="text-body-md">
                <p className="surface-muted">{leader.message}</p>
              </Prose>

              <a
                href={`mailto:${leader.email}`}
                className="link-underline text-bronze-ink mt-auto inline-flex items-center gap-2 text-body-sm font-medium"
              >
                <Mail aria-hidden size={14} />
                {leader.email}
              </a>
            </Card>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}

function Monogram({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('');

  return (
    <span
      aria-hidden
      className="border-bronze/50 surface-fg text-heading-lg flex size-16 items-center justify-center border"
    >
      {initials}
    </span>
  );
}
