import { ButtonLink } from '@/components/ui/button';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { NetworkCanvas } from '@/components/three/network-canvas';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';

/**
 * P8 · SECTION C — Who We Are.
 *
 * Short, and leading with the manufacturing lineage assertively — the audit's
 * branding read was blunt that the one asset specifically Trivoxa's is a real,
 * decades-old textile manufacturer, currently treated as a footnote rather
 * than the spine of the story. This section is the correction.
 *
 * Background: the hero's dispersed particles reorganising into a slow
 * connected network — a separate, much lighter 2D canvas, 6k points, no
 * interaction, medium tier and above only. At low tier: a static ivory
 * surface with a bronze hairline motif.
 */
export function WhoWeAre() {
  return (
    <Section surface="light" className="relative overflow-hidden">
      <NetworkCanvas />

      <Container className="relative z-10">
        <div className="grid grid-cols-12 gap-xl">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading eyebrow="Who We Are" title="A Vision Beyond Business." />
          </div>

          <div className="col-span-12 lg:col-span-7">
            <Prose className="text-body-lg">
              <p>
                Trivoxa Group exists to bridge global demand and India&apos;s manufacturing
                capability — not as a broker, but as an operator with a factory floor behind it.
              </p>
              <p>{SHIVESHWAR_CANONICAL_SENTENCE}</p>
              <p>
                Today we run two export divisions across nine industries and six regions. Tomorrow
                we expand into new industries and markets, on the same terms: specifications before
                superlatives, and relationships measured in years.
              </p>
            </Prose>

            <div className="mt-xl flex flex-wrap items-center gap-lg">
              <ButtonLink href="/group" arrow>
                Discover the Group
              </ButtonLink>
              <Eyebrow tick={false} className="surface-faint">
                Surat · Gujarat · India
              </Eyebrow>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
