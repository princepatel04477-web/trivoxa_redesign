import { Reveal } from '@/components/motion/reveal';
import { StatusBadge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IndustryIcon } from '@/components/ui/industry-icon';
import { ArrowLink } from '@/components/ui/link';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import { homepageIndustryPreview } from '@/lib/selectors';

/**
 * P8 · SECTION E — Industries preview.  ⚠ AUDIT FIX
 *
 * The July audit found the homepage showing 6 industries while the Industries
 * page listed 8, with two silently dropped and no way to reach the rest. The
 * fix is structural: `homepageIndustryPreview()` returns the slice AND the
 * true total AND the affordance label, so a silent subset is unrepresentable
 * — and the "View all N industries →" link sits in the section header, above
 * the fold of the section, every time.
 *
 * Onboarding items carry the honest bronze label rather than being hidden.
 */
export function IndustriesPreview() {
  const preview = homepageIndustryPreview(6);

  return (
    <Section surface="light" className="border-t surface-hairline">
      <Container>
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Supporting the Industries That Shape Tomorrow."
          action={
            <ArrowLink href="/industries" className="text-body-md">
              {preview.affordanceLabel}
            </ArrowLink>
          }
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-md">
          {preview.shown.map((industry) => (
            <Card
              key={industry.slug}
              trace
              className="group col-span-12 flex flex-col gap-md p-lg sm:col-span-6 xl:col-span-4"
            >
              <div className="flex items-start justify-between">
                <IndustryIcon name={industry.icon} className="surface-fg" />
                {industry.status === 'onboarding' ? <StatusBadge status="onboarding" /> : null}
              </div>

              <h3 className="text-heading-lg">{industry.name}</h3>

              {/* description appears on hover/focus — the tile stays calm */}
              <p className="surface-muted text-body-sm opacity-0 transition-opacity duration-fast ease-house group-hover:opacity-100 group-focus-within:opacity-100">
                {industry.shortDescription}
              </p>

              <ArrowLink href={`/industries/${industry.slug}`} className="mt-auto text-body-sm">
                Explore
              </ArrowLink>
            </Card>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
