'use client';

import { useRef } from 'react';
import { useGSAP } from '@/components/motion/use-gsap';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, SectionHeading } from '@/components/ui/typography';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { JOURNEY } from '@/content/company';

/**
 * P11 — the journey, as a pinned reading column.
 *
 * Left: a sticky counter that changes as the visitor scrolls. Right: the five
 * steps in order. Nothing is scrubbed and nothing is hijacked — the counter is
 * a reading aid, so it follows the reader instead of driving them.
 *
 * State lives in the DOM (`data-active`, `textContent`), not in React: five
 * steps firing setState on every scroll frame is how a page like this starts
 * dropping frames on a mid-tier phone. Reduced motion gets the plain list.
 */
export function GroupJourney() {
  const scope = useRef<HTMLDivElement | null>(null);
  const counter = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    ({ ScrollTrigger }) => {
      const root = scope.current;
      if (!root) return;

      const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-journey-step]'));

      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (!self.isActive) return;
            steps.forEach((other) => delete other.dataset.active);
            step.dataset.active = 'true';
            if (counter.current) counter.current.textContent = String(index + 1).padStart(2, '0');
          },
        });
      });

      // the hairline beside the counter fills as the journey is read
      const fill = root.querySelector<HTMLElement>('[data-journey-fill]');
      if (fill) {
        ScrollTrigger.create({
          trigger: root,
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: 0.4,
          onUpdate: (self) => {
            fill.style.transform = `scaleY(${self.progress})`;
          },
        });
      }
    },
    { disabled: reduced, scope },
  );

  return (
    <Section surface="dark" id="journey">
      <Container>
        <div ref={scope} className="grid grid-cols-12 gap-2xl">
          {/* sticky counter */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-[120px]">
              <SectionHeading eyebrow="The Journey" title="From a mill in Surat to nine industries." />

              <div className="mt-2xl hidden items-start gap-lg lg:flex" aria-hidden>
                <span ref={counter} className="text-display-xl text-accent leading-none">
                  01
                </span>
                <div className="surface-hairline relative h-24 w-px overflow-hidden">
                  <span
                    data-journey-fill
                    className="bg-bronze absolute inset-0 origin-top"
                    style={{ transform: 'scaleY(0)' }}
                  />
                </div>
                <Eyebrow tick={false} className="surface-faint">
                  {JOURNEY.length} steps
                </Eyebrow>
              </div>
            </div>
          </div>

          {/* steps */}
          <ol className="col-span-12 flex flex-col lg:col-span-8">
            {JOURNEY.map((item) => (
              <li
                key={item.step}
                data-journey-step
                data-step={item.step}
                className="surface-hairline group grid grid-cols-12 gap-md border-t py-2xl transition-colors duration-base ease-house last:border-b data-[active=true]:border-bronze/60"
              >
                <span className="surface-faint spec-value col-span-2 text-body-sm group-data-[active=true]:text-accent" data-spec>
                  {String(item.step).padStart(2, '0')}
                </span>
                <div className="col-span-10 flex flex-col gap-sm">
                  <h3 className="text-heading-lg transition-colors duration-base ease-house group-data-[active=true]:text-accent">
                    {item.title}
                  </h3>
                  <p className="surface-muted text-body-md max-w-[58ch]">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
