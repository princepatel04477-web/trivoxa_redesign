import { ButtonLink } from '@/components/ui/button';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { GlobeLoader } from '@/components/three/globe-loader';
import { CountUp } from '@/components/motion/count-up';
import { allPorts, presenceNumbers } from '@/lib/selectors';
import { globalPresenceRegions } from '@/lib/selectors';

/**
 * P9 — Global Presence preview.
 *
 * On the deep surface, which is the only place the site goes fully dark, so
 * the globe reads as the subject rather than decoration.
 *
 * Two honesty rules are non-negotiable here and both are on the page:
 *  · the arcs are labelled as the corridors we operate in, never as live
 *    shipment tracking (the live site's own disclaimer is carried forward);
 *  · the ports print their UN/LOCODEs in the data face, which makes them
 *    checkable rather than decorative.
 *
 * The region list beside the globe is not a fallback — it is the primary
 * content for anyone without a pointer, and it is what screen readers get
 * instead of an aria-hidden canvas.
 */
export function GlobalPresencePreview() {
  const numbers = presenceNumbers();
  const regions = globalPresenceRegions();
  const ports = allPorts();

  return (
    <Section surface="deep" className="relative overflow-hidden">
      <Container className="relative z-10">
        <div className="grid grid-cols-12 items-center gap-2xl">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading
              eyebrow="Global Presence"
              title="A Global Perspective. A Local Understanding."
              lede="The corridors we actually operate in — not live shipment tracking."
            />

            {/* The non-pointer alternative: does what clicking the globe does. */}
            <ul className="mt-xl grid grid-cols-2 gap-xs">
              {regions.map((region) => (
                <li key={region.slug} className="surface-hairline border-t pt-sm">
                  <p className="surface-fg text-body-md font-medium">{region.name}</p>
                  <p className="surface-muted text-body-sm">{region.marketFocus}</p>
                </li>
              ))}
            </ul>

            <div className="mt-xl flex flex-wrap gap-lg">
              <dl className="flex gap-2xl">
                {[
                  { label: 'Regions', value: numbers.regions },
                  { label: 'Industries', value: numbers.industries },
                  { label: 'Ports', value: numbers.ports },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="surface-faint spec-value uppercase" data-spec>
                      {item.label}
                    </dt>
                    <dd className="text-display-sm mt-xs">
                      <CountUp value={item.value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-xl">
              <ButtonLink href="/global-presence" arrow>
                View Our Global Network
              </ButtonLink>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="relative aspect-4/3 w-full">
              <GlobeLoader />
            </div>

            <div className="mt-lg flex flex-wrap items-center justify-between gap-md border-t surface-hairline pt-lg">
              <Prose className="text-body-sm">
                <p className="surface-muted">
                  Loading ports nearest our factories and our buyers — Gujarat and Maharashtra,
                  within a day&apos;s road haul of Surat.
                </p>
              </Prose>
              <ul className="flex flex-wrap gap-md">
                {ports.map((port) => (
                  <li key={port.slug} className="flex items-baseline gap-xs">
                    <span className="surface-fg text-body-md">{port.name}</span>
                    <span className="surface-faint spec-value" data-spec>
                      {port.locode}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Eyebrow tick={false} className="surface-faint mt-2xl justify-center">
          Response window {numbers.responseWindow}
        </Eyebrow>
      </Container>
    </Section>
  );
}
