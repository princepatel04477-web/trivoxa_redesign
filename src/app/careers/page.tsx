import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { ArrowLink } from '@/components/ui/link';
import { ButtonLink } from '@/components/ui/button';
import { COMPANY, VALUES } from '@/content/company';
import { CAREERS_EMAIL, HIRING_PROCESS, OPEN_ROLES, WHAT_WE_LOOK_FOR, hasOpenRoles } from '@/content/editorial';

export const metadata: Metadata = {
  title: 'Careers — Surat, Gujarat',
  description:
    'No open roles today, and no roles invented to fill a page. What we look for, how hiring works at a founder-led export group in Surat, and where to send a speculative application.',
  alternates: { canonical: '/careers' },
};

/**
 * P15 — /careers.
 *
 * The live page pitched "build a global trading company from Surat" above an
 * empty roles list. That order is wrong: an empty list under a big pitch reads
 * as a page that failed. So the state is stated first, in its own designed
 * block, with a real address to write to — and the roles render themselves the
 * moment `OPEN_ROLES` has an entry.
 */
export default function CareersPage() {
  const hiring = hasOpenRoles();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={hiring ? 'Roles open right now.' : 'No open roles today. The invitation still stands.'}
        lede={`Trivoxa Group is a founder-led export business in ${COMPANY.headquarters}, building an international trading company on top of a manufacturing foundation that has been running for decades. Small team, real consequences, work that ships.`}
        trail={[
          { href: '/', label: 'Home' },
          { href: '/careers', label: 'Careers' },
        ]}
        meta={[
          { label: 'Open roles', value: OPEN_ROLES.length },
          { label: 'Headquarters', value: COMPANY.headquarters },
          { label: 'Applications to', value: CAREERS_EMAIL },
        ]}
      />

      <Section surface="light" className="pt-0">
        <Container>
          {hiring ? (
            <Reveal staggerChildren className="flex flex-col gap-md">
              {OPEN_ROLES.map((role) => (
                <div
                  key={role.slug}
                  className="surface-hairline flex flex-wrap items-baseline justify-between gap-md border-t pt-lg"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-heading-lg">{role.title}</h2>
                    <p className="surface-faint spec-value" data-spec>
                      {role.team} · {role.location} · {role.type}
                    </p>
                  </div>
                  <ArrowLink href={role.href}>View role</ArrowLink>
                </div>
              ))}
            </Reveal>
          ) : (
            <div className="border-bronze/40 surface-raised flex flex-col gap-md border p-xl">
              <Eyebrow tick={false} className="surface-faint">
                Current openings · 0
              </Eyebrow>
              <h2 className="text-heading-lg max-w-[24ch]">
                We are not hiring against a vacancy right now — we are hiring against capability.
              </h2>
              <Prose className="text-body-md">
                <p className="surface-muted max-w-[64ch]">
                  Three founders, two export divisions and nine industries: when we need someone, it
                  is usually because a category is being onboarded or a document set is being
                  systematised, and the role is written around the person who can do it. If that is
                  you, write to us anyway — say what you would take on and why you are the one to
                  take it on.
                </p>
              </Prose>
              <div className="mt-sm flex flex-wrap gap-md">
                <ButtonLink href={`mailto:${CAREERS_EMAIL}?subject=Speculative%20application`} arrow>
                  Email {CAREERS_EMAIL}
                </ButtonLink>
                <ArrowLink href="/group">Who you would be working with</ArrowLink>
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section surface="light" tight className="border-t surface-hairline">
        <Container>
          <SectionHeading
            eyebrow="What we look for"
            title="Four things, none of them a degree."
          />

          <Reveal staggerChildren className="mt-2xl grid grid-cols-12 gap-md">
            {WHAT_WE_LOOK_FOR.map((item, index) => (
              <div
                key={item.slug}
                className="surface-hairline col-span-12 flex flex-col gap-sm border-t pt-lg md:col-span-6"
              >
                <p className="surface-faint spec-value" data-spec>
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="text-body-lg font-medium">{item.title}</h2>
                <Prose className="text-body-sm">
                  <p className="surface-muted max-w-[58ch]">{item.body}</p>
                </Prose>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section surface="dark" tight>
        <Container>
          <SectionHeading
            eyebrow="How hiring works"
            title="Four steps, and we tell you where you are in them."
          />

          <ol className="mt-2xl flex flex-col">
            {HIRING_PROCESS.map((step) => (
              <li
                key={step.step}
                className="surface-hairline grid grid-cols-12 gap-md border-b py-xl first:border-t"
              >
                <span className="surface-faint spec-value col-span-2 text-display-sm leading-none sm:col-span-1" data-spec>
                  {String(step.step).padStart(2, '0')}
                </span>
                <div className="col-span-10 flex flex-col gap-sm sm:col-span-7">
                  <h2 className="text-heading-lg">{step.title}</h2>
                  <Prose className="text-body-md">
                    <p className="surface-muted max-w-[62ch]">{step.body}</p>
                  </Prose>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section surface="light" tight>
        <Container>
          <HairlineRow label="The Trivoxa Way" />
          <ul className="mt-xl flex flex-wrap gap-xs">
            {VALUES.map((value) => (
              <li
                key={value.name}
                className="surface-hairline surface-muted border px-md py-xs text-body-sm"
                title={value.note}
              >
                {value.name}
              </li>
            ))}
          </ul>
          <Prose className="surface-muted mt-lg max-w-[62ch] text-body-sm">
            <p>
              Six principles, each with a sentence about what it means in practice — on the Group
              page, because a values list on a careers page that nobody can check is decoration.
            </p>
          </Prose>
          <div className="mt-lg">
            <ArrowLink href="/group">Read the principles in full</ArrowLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
