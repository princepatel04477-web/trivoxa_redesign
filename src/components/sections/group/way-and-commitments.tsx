import { Reveal } from '@/components/motion/reveal';
import { Container, HairlineRow, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { COMMITMENTS, VALUES } from '@/content/company';

/**
 * P11 — The Trivoxa Way, and what we commit to.
 *
 * Values are the cheapest thing on any corporate page, so they earn their
 * space only by being short and by sitting next to the commitments that make
 * them checkable: "Specifications before superlatives" beside "status and
 * certification dates published as they stand".
 */
export function GroupWay() {
  return (
    <Section surface="light" className="border-t surface-hairline" id="vision">
      <Container>
        <div className="grid grid-cols-12 gap-2xl">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading eyebrow="The Trivoxa Way" title="Six principles we can be held to." />

            <Reveal staggerChildren className="mt-2xl">
              <ul className="flex flex-col">
                {VALUES.map((value) => (
                  <li
                    key={value.name}
                    className="surface-hairline grid grid-cols-12 items-baseline gap-md border-b py-lg first:border-t"
                  >
                    <span className="text-body-lg col-span-4 font-medium">{value.name}</span>
                    <span className="surface-muted text-body-sm col-span-8">{value.note}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-7" id="commitments">
            <HairlineRow label="What we commit to" />

            <Reveal staggerChildren className="mt-xl grid grid-cols-12 gap-md">
              {COMMITMENTS.map((commitment, index) => (
                <div
                  key={commitment.title}
                  className="surface-hairline col-span-12 border-t pt-lg sm:col-span-6"
                >
                  <p className="surface-faint spec-value mb-xs" data-spec>
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="text-body-lg font-medium">{commitment.title}</h3>
                  <Prose className="mt-xs text-body-sm">
                    <p className="surface-muted">{commitment.body}</p>
                  </Prose>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
