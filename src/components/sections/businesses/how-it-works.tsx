import { Reveal } from '@/components/motion/reveal';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import type { ProcessStep } from '@/content/process';

/**
 * P12 — "How Trivoxa Works", the same component for both divisions.
 *
 * The live site named seven steps and explained none of them. Here every step
 * carries a body sentence and an OUTPUT — the artefact the buyer ends up
 * holding, set in the data face so it reads as a deliverable and not as
 * decoration. One component, two datasets (7 product steps, 5 service steps),
 * so the two divisions cannot drift into different vocabularies.
 */
export function HowItWorks({
  steps,
  eyebrow = 'How Trivoxa Works',
  title,
  lede,
  surface = 'light',
  id = 'how-it-works',
}: {
  steps: ProcessStep[];
  eyebrow?: string;
  title: string;
  lede?: string;
  surface?: 'light' | 'dark' | 'deep';
  id?: string;
}) {
  return (
    <Section surface={surface} id={id}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lede={lede} />

        <Reveal staggerChildren className="mt-3xl">
          <ol className="surface-hairline border-t">
            {steps.map((step) => (
              <li
                key={step.step}
                className="surface-hairline group grid grid-cols-12 gap-md border-b py-xl transition-colors duration-base ease-house hover:border-bronze/50"
              >
                <span className="surface-faint spec-value col-span-2 text-display-sm leading-none transition-colors duration-base ease-house group-hover:text-bronze sm:col-span-1" data-spec>
                  {String(step.step).padStart(2, '0')}
                </span>

                <div className="col-span-10 flex flex-col gap-sm sm:col-span-7">
                  <h3 className="text-heading-lg">{step.title}</h3>
                  <Prose className="text-body-md">
                    <p className="surface-muted max-w-[62ch]">{step.body}</p>
                  </Prose>
                </div>

                <div className="col-span-12 sm:col-span-4">
                  <p className="surface-faint spec-value mb-xs uppercase" data-spec>
                    You receive
                  </p>
                  <p className="surface-fg spec-value text-body-md" data-spec>
                    {step.output}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}
