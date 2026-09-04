import type { Metadata } from 'next';
import { Reveal } from '@/components/motion/reveal';
import { PageHero } from '@/components/sections/page-hero';
import { ClosingCta } from '@/components/sections/closing-cta';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { CONTACT } from '@/content/taxonomy';
import { INSIGHT_SERIES, INSIGHTS, hasInsights } from '@/content/editorial';

export const metadata: Metadata = {
  title: 'Insights — What Trivoxa Group Will Publish',
  description:
    'No articles yet, and no placeholder cards pretending otherwise. Three series are defined: market intelligence per category, compliance and documentation changes, and how sourcing and supply chains actually work.',
  alternates: { canonical: '/insights' },
};

/**
 * P15 — /insights.
 *
 * The live page showed three cards that each said "Coming soon", which reads as
 * a company that stopped moving. This version states the position once, plainly,
 * and then describes what each series will contain concretely enough to be held
 * to. The moment `INSIGHTS` in src/content/editorial.ts has an entry, the
 * article grid renders — the page is already written for it.
 *
 * There is deliberately NO newsletter form yet: a form that posts nowhere is a
 * lie with a button on it. The route to being told first is a real email
 * address. P21 adds the form when it has an endpoint to post to.
 */
export default function InsightsPage() {
  const publishing = hasInsights();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={publishing ? 'What we are learning about these markets.' : 'Nothing published yet. Here is exactly what will be.'}
        lede="We publish when we have something a buyer can act on — a price movement with the HS heading named, a credential with its registration number, a document set from a real consignment. Until then this page says so."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/insights', label: 'Insights' },
        ]}
        meta={[
          { label: 'Series', value: INSIGHT_SERIES.length },
          { label: 'Published', value: INSIGHTS.length },
          { label: 'Next up', value: 'Market Intelligence' },
        ]}
      />

      {publishing ? (
        <Section surface="light" className="pt-0">
          <Container>
            <Reveal staggerChildren className="grid grid-cols-12 gap-md">
              {INSIGHTS.map((insight) => (
                <Card key={insight.slug} trace className="col-span-12 flex flex-col gap-md p-lg lg:col-span-4">
                  <Eyebrow tick={false} className="surface-faint">
                    {insight.series} · {insight.readMinutes} min
                  </Eyebrow>
                  <h2 className="text-heading-lg">{insight.title}</h2>
                  <Prose className="text-body-sm">
                    <p className="surface-muted">{insight.summary}</p>
                  </Prose>
                  <p className="surface-faint spec-value mt-auto text-body-sm" data-spec>
                    {insight.publishedAt}
                  </p>
                </Card>
              ))}
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section surface="light" className={publishing ? 'border-t surface-hairline' : 'pt-0'}>
        <Container>
          <SectionHeading
            eyebrow="The series"
            title="Three things we will write about, and how often."
            lede="Each series has a defined cadence and a defined kind of article, so “insights” is a commitment rather than a section of the site."
          />

          <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
            {INSIGHT_SERIES.map((series) => (
              <div
                key={series.slug}
                className="surface-hairline col-span-12 flex flex-col gap-md border-t pt-lg md:col-span-4"
              >
                <h2 className="text-heading-lg">{series.name}</h2>
                <p className="surface-faint spec-value text-body-sm" data-spec>
                  {series.cadence}
                </p>
                <ul className="mt-md flex flex-col gap-sm">
                  {series.willPublish.map((item) => (
                    <li key={item} className="surface-muted text-body-sm flex items-start gap-2">
                      <span aria-hidden className="bg-bronze mt-2 size-1 shrink-0 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </Container>
      </Section>

      <Section surface="dark" tight>
        <Container>
          <div className="border-bronze/40 surface-raised flex flex-wrap items-center justify-between gap-xl border p-xl">
            <div className="flex max-w-[56ch] flex-col gap-xs">
              <h2 className="text-heading-lg">Be told when the first piece goes out.</h2>
              <Prose className="text-body-md">
                <p className="surface-muted">
                  There is no newsletter form on this page yet, because a form that posts nowhere is
                  a promise with a button on it. Email us and we will add you to the list we keep by
                  hand — the first issue goes to those addresses.
                </p>
              </Prose>
            </div>
            <a
              href={`mailto:${CONTACT.general}?subject=Insights%20%E2%80%94%20add%20me%20to%20the%20list`}
              className="link-underline text-bronze text-body-md font-medium"
            >
              {CONTACT.general} →
            </a>
          </div>
        </Container>
      </Section>

      <ClosingCta />
    </>
  );
}
