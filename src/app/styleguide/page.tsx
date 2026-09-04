import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Badge, SpecChip, StatusBadge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { BrandLockup, BrandMark, BrandWordmark } from '@/components/ui/brand-lockup';
import { Card } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/field';
import { Container, Section, HairlineRow } from '@/components/ui/layout';
import { Link, ArrowLink } from '@/components/ui/link';
import { Tabs } from '@/components/ui/tabs';
import { Eyebrow, SectionHeading } from '@/components/ui/typography';
import { BODY_FONT_FAMILY, BODY_FONT_IS_FALLBACK } from '@/lib/fonts.generated';
import { BRAND, SURFACES, contrastReport, type Surface } from '@/lib/tokens/colors';
import { DURATION, EASE, STAGGER } from '@/lib/tokens/motion';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

/**
 * /styleguide — dev-only drift catcher.
 *
 * Every token, every type style, every primitive, in every state, on all three
 * surfaces, on one page. The July 2026 audit's sharpest structural finding was
 * unrecorded decisions drifting across pages; this page is how the visual half
 * of that gets caught before it ships.
 */
export default function StyleguidePage() {
  if (process.env.NODE_ENV === 'production') notFound();

  return (
    <main>
      <Section surface="deep" tight>
        <div className="flex flex-col gap-lg">
          <Eyebrow>Trivoxa Design System</Eyebrow>
          <SectionHeading
            as="h1"
            size="display-lg"
            title="Styleguide"
            lede="Tokens, type, and primitives — rendered on all three surfaces so drift has nowhere to hide."
          />
          {BODY_FONT_IS_FALLBACK ? (
            <Card className="border-bronze/60 p-lg">
              <p className="text-body-md">
                <strong className="text-bronze">Body face fallback active.</strong>{' '}
                Rendering <span data-spec>{BODY_FONT_FAMILY}</span> because Satoshi is not in{' '}
                <span data-spec>src/fonts/custom/</span>. Drop the WOFF2 files there and rebuild.
              </p>
            </Card>
          ) : (
            <p className="surface-muted text-body-md">
              Body face: <span data-spec>{BODY_FONT_FAMILY}</span> ✓
            </p>
          )}
        </div>
      </Section>

      <ColorSection />
      <TypeSection />
      <TokenSection />
      <PrimitiveSection />
    </main>
  );
}

/* ------------------------------------------------------------------------ */
/* SURFACE PANEL                                                            */
/* ------------------------------------------------------------------------ */

function SurfacePanel({
  surface,
  title,
  children,
}: {
  surface: Surface;
  title: string;
  children: ReactNode;
}) {
  return (
    <Section surface={surface} tight className="border-t surface-hairline">
      <div className="flex flex-col gap-xl">
        <HairlineRow label={title} />
        {children}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */
/* 1 · COLOUR                                                               */
/* ------------------------------------------------------------------------ */

function ColorSection() {
  const report = contrastReport();

  return (
    <>
      <Section surface="light">
        <div className="flex flex-col gap-xl">
          <SectionHeading
            eyebrow="01 · Colour"
            title="Six canonical colours. No shades, no ramp."
            lede="Bronze is never a background and never body copy. It is a hairline, a hover underline, a small icon fill, a focus ring, or the occasional number."
          />

          <div className="grid-12">
            {Object.entries(BRAND).map(([name, colour]) => (
              <div key={name} className="col-span-6 md:col-span-4 lg:col-span-2">
                <div
                  className="h-24 w-full border surface-hairline"
                  style={{ backgroundColor: colour.hex }}
                />
                <p className="mt-md text-body-sm font-semibold">{name}</p>
                <p className="spec-value" data-spec>
                  {colour.hex}
                </p>
                <p className="surface-muted mt-xs text-body-sm">{colour.role}</p>
              </div>
            ))}
          </div>

          <HairlineRow label="Contrast — computed, WCAG 2.1" />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-body-sm">
              <caption className="surface-muted sr-only">
                Contrast ratios for every ink/ground pair on each surface
              </caption>
              <thead>
                <tr className="surface-muted text-left">
                  <th className="border-b surface-hairline py-xs pr-lg font-medium">Surface</th>
                  <th className="border-b surface-hairline py-xs pr-lg font-medium">Pair</th>
                  <th className="border-b surface-hairline py-xs pr-lg font-medium">Ratio</th>
                  <th className="border-b surface-hairline py-xs font-medium">Clears</th>
                </tr>
              </thead>
              <tbody>
                {report.map((entry) => (
                  <tr key={`${entry.surface}-${entry.pair}`}>
                    <td className="border-b surface-hairline py-xs pr-lg">{entry.surface}</td>
                    <td className="border-b surface-hairline py-xs pr-lg">
                      <span
                        className="mr-2 inline-block size-3 border surface-hairline align-middle"
                        style={{ backgroundColor: entry.fg }}
                      />
                      {entry.pair}
                    </td>
                    <td className="border-b surface-hairline py-xs pr-lg spec-value" data-spec>
                      {entry.ratio.toFixed(2)}
                    </td>
                    <td className="border-b surface-hairline py-xs">
                      <span
                        className={cn(
                          'font-semibold uppercase tracking-wide',
                          entry.clears === 'normal' ? 'text-bronze' : 'surface-faint',
                        )}
                      >
                        {entry.clears}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {(Object.keys(SURFACES) as Surface[]).map((surface) => (
        <SurfacePanel key={surface} surface={surface} title={`Surface · ${surface}`}>
          <div className="grid-12 items-start">
            <div className="col-span-12 flex flex-col gap-md lg:col-span-6">
              <p className="text-display-sm">A Global Perspective.</p>
              <p className="text-body-lg">Body copy on {surface}. Specific, not abstract.</p>
              <p className="surface-muted text-body-md">
                Muted ink — supporting sentences, captions, meta. Composited at 74% over the ground,
                never a new hue.
              </p>
              <p className="surface-faint text-body-sm">Faint ink — placeholders and disabled only.</p>
              <div className="hairline-bronze my-md w-24" />
              <p className="text-body-sm">
                <Link href="/styleguide">A link with the bronze underline</Link> ·{' '}
                <ArrowLink href="/styleguide">An arrow link</ArrowLink>
              </p>
            </div>
            <div className="col-span-12 flex flex-col gap-md lg:col-span-6">
              <div className="flex flex-wrap gap-md">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <Card raised trace className="p-lg">
                <p className="text-heading-md">Raised card</p>
                <p className="surface-muted mt-xs text-body-sm">
                  Bronze border traces on hover. No radius, no wash.
                </p>
              </Card>
            </div>
          </div>
        </SurfacePanel>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · TYPOGRAPHY                                                           */
/* ------------------------------------------------------------------------ */

const TYPE_SPECIMENS: { name: string; className: string; sample: string; note: string }[] = [
  { name: 'display-xl', className: 'text-display-xl', sample: 'Building the Future', note: 'Hero headline · 44→96px' },
  { name: 'display-lg', className: 'text-display-lg', sample: 'Global Commerce.', note: 'Page headline · 36→68px' },
  { name: 'display-md', className: 'text-display-md', sample: 'Industry Expertise.', note: 'Section heading · 30→52px' },
  { name: 'display-sm', className: 'text-display-sm', sample: 'A Local Understanding.', note: 'Sub-section · 26→40px' },
  { name: 'heading-lg', className: 'text-heading-lg', sample: 'Manufacturing Foundation', note: 'Card title · 22→32px' },
  { name: 'heading-md', className: 'text-heading-md', sample: 'Quality-Driven Operations', note: 'Small title · 19→26px' },
  { name: 'body-lg', className: 'text-body-lg', sample: 'Sourcing, manufacturing partnerships and professional services, built on a decades-old textile foundation.', note: 'Lede · 17→19px' },
  { name: 'body-md', className: 'text-body-md', sample: 'Every project is guided by structured quality coordination — from production specifications through final delivery — with documentation at every stage.', note: 'Default body · 16→17px' },
  { name: 'body-sm', className: 'text-body-sm', sample: 'Mundra · Kandla · Nhava Sheva (JNPT)', note: 'Caption / meta · 14px' },
];

function TypeSection() {
  return (
    <Section surface="light">
      <div className="flex flex-col gap-xl">
        <SectionHeading
          eyebrow="02 · Typography"
          title="Instrument Serif · Satoshi · Geist Mono"
          lede="Three families, five weights. Geist Mono is reserved for spec data — HS codes, MOQs, lead times, Incoterms, port codes. The numbers are the product."
        />

        <div className="flex flex-col gap-lg">
          {TYPE_SPECIMENS.map((specimen) => (
            <div key={specimen.name} className="grid-12 items-baseline border-b surface-hairline pb-lg">
              <div className="col-span-12 md:col-span-3">
                <p className="spec-value" data-spec>
                  {specimen.name}
                </p>
                <p className="surface-faint text-body-sm">{specimen.note}</p>
              </div>
              <p className={cn('col-span-12 md:col-span-9', specimen.className)}>{specimen.sample}</p>
            </div>
          ))}

          <div className="grid-12 items-baseline">
            <div className="col-span-12 md:col-span-3">
              <p className="spec-value" data-spec>
                eyebrow
              </p>
              <p className="surface-faint text-body-sm">Section label · 13px + 0.16em</p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <Eyebrow>Industries We Serve</Eyebrow>
            </div>
          </div>

          <div className="grid-12 items-baseline">
            <div className="col-span-12 md:col-span-3">
              <p className="spec-value" data-spec>
                data / spec
              </p>
              <p className="surface-faint text-body-sm">Geist Mono · tabular</p>
            </div>
            <div className="col-span-12 flex flex-wrap gap-lg md:col-span-9">
              <SpecChip label="HS" value="5208.42" />
              <SpecChip label="MOQ" value="3,000 m" />
              <SpecChip label="Lead" value="20–25 days" />
              <SpecChip label="Incoterms" value="FOB · CIF · EXW" />
              <SpecChip label="Port" value="INMUN" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · MOTION & SPACING TOKENS                                              */
/* ------------------------------------------------------------------------ */

function TokenSection() {
  return (
    <Section surface="dark">
      <div className="flex flex-col gap-xl">
        <SectionHeading
          eyebrow="03 · Motion & spacing"
          title="Every value reads from a token."
          lede="No magic numbers. Reveals travel 16–32px; stagger is 60–80ms capped at 8 items; parallax at most 12%."
        />

        <div className="grid-12">
          <div className="col-span-12 flex flex-col gap-md lg:col-span-6">
            <HairlineRow label="Duration" />
            {Object.entries(DURATION).map(([name, ms]) => (
              <div key={name} className="flex items-center gap-md">
                <span className="surface-muted w-24 text-body-sm">{name}</span>
                <span className="spec-value w-20" data-spec>
                  {ms}ms
                </span>
                <span className="surface-raised relative h-1 flex-1 overflow-hidden">
                  <span
                    className="bg-bronze absolute inset-y-0 left-0"
                    style={{ width: `${(ms / DURATION.cinematic) * 100}%` }}
                  />
                </span>
              </div>
            ))}

            <HairlineRow label="Easing" />
            {Object.entries(EASE).map(([name, curve]) => (
              <div key={name} className="flex items-baseline gap-md">
                <span className="surface-muted w-24 text-body-sm">{name}</span>
                <span className="spec-value text-body-sm" data-spec>
                  {curve}
                </span>
              </div>
            ))}

            <HairlineRow label="Stagger" />
            <p className="surface-muted text-body-sm">
              tight {STAGGER.tight}ms · base {STAGGER.base}ms · loose {STAGGER.loose}ms · cap 8 items
            </p>
          </div>

          <div className="col-span-12 flex flex-col gap-md lg:col-span-6">
            <HairlineRow label="Spacing ramp (4px base)" />
            {[
              ['hair', 4],
              ['xs', 8],
              ['sm', 12],
              ['md', 16],
              ['lg', 24],
              ['xl', 32],
              ['2xl', 48],
              ['3xl', 64],
              ['4xl', 96],
            ].map(([name, px]) => (
              <div key={name} className="flex items-center gap-md">
                <span className="surface-muted w-16 text-body-sm">{name}</span>
                <span className="spec-value w-14" data-spec>
                  {px}
                </span>
                <span className="bg-bronze/60 h-2" style={{ width: `${px}px` }} />
              </div>
            ))}
            <p className="surface-faint mt-md text-body-sm">
              Section rhythm: clamp(72px, 10vw, 180px) — dark trade sites die from cramped vertical
              space.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */
/* 4 · PRIMITIVES, ALL STATES, ALL SURFACES                                 */
/* ------------------------------------------------------------------------ */

function PrimitiveSection() {
  return (
    <>
      {(Object.keys(SURFACES) as Surface[]).map((surface) => (
        <SurfacePanel key={surface} surface={surface} title={`Primitives on ${surface}`}>
          <div className="grid-12 gap-xl">
            <div className="col-span-12 flex flex-col gap-xl lg:col-span-6">
              <div>
                <HairlineRow label="Button" />
                <div className="mt-md flex flex-wrap items-center gap-md">
                  <Button>Default</Button>
                  <Button className="hover:border-bronze hover:-translate-y-px">Hover</Button>
                  <Button disabled>Disabled</Button>
                  <Button variant="secondary" arrow>
                    Secondary
                  </Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg" arrow>
                    Large
                  </Button>
                </div>
              </div>

              <div>
                <HairlineRow label="Badge & status" />
                <div className="mt-md flex flex-wrap gap-md">
                  <Badge>Neutral</Badge>
                  <Badge tone="outline">Outline</Badge>
                  <Badge tone="accent">Accent</Badge>
                  <StatusBadge status="onboarding" />
                  <StatusBadge status="onboarding" detail="Q4 2026" />
                </div>
              </div>

              <div>
                <HairlineRow label="Lockups" />
                <div className="mt-md flex flex-wrap items-center gap-xl">
                  <BrandMark size={48} className="surface-fg" />
                  <BrandWordmark height={18} className="surface-fg" />
                  <BrandLockup size={40} className="surface-fg" />
                </div>
              </div>

              <div>
                <HairlineRow label="Breadcrumb" />
                <Breadcrumb
                  className="mt-md"
                  trail={[
                    { href: '/', label: 'Home' },
                    { href: '/businesses', label: 'Businesses' },
                    { href: '/businesses/product-exports', label: 'Product Exports' },
                  ]}
                />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-xl lg:col-span-6">
              <div className="grid gap-md sm:grid-cols-2">
                <Input label="Email" placeholder="name@example.com" hint="Work address" />
                <Input label="Company" placeholder="GmbH, LLC, FZE…" />
                <Select
                  label="Incoterms"
                  options={[
                    { value: 'fob', label: 'FOB — Free on Board' },
                    { value: 'cif', label: 'CIF — Cost, Insurance & Freight' },
                    { value: 'exw', label: 'EXW — Ex Works' },
                    { value: 'ddp', label: 'DDP — Delivered Duty Paid' },
                  ]}
                />
                <Input label="With error" placeholder="—" error="Enter a valid HS code." defaultValue="5208" />
              </div>
              <Textarea label="Requirement" placeholder="What are you sourcing?" />

              <Accordion
                items={[
                  {
                    id: 'moq',
                    question: 'What are your minimum order quantities?',
                    answer: <p>Every published product lists its MOQ in the catalog. Where a line is still onboarding we say so rather than publishing a placeholder.</p>,
                  },
                  {
                    id: 'samples',
                    question: 'Can I request a sample before ordering?',
                    answer: <p>Yes — sample requests and factory audits are first-class request types on every category page and in the RFQ flow.</p>,
                  },
                ]}
              />

              <Tabs
                items={[
                  { id: 'a', label: 'Product Exports', panel: <p className="surface-muted text-body-md">Twenty-five published products across five live categories.</p> },
                  { id: 'b', label: 'Service Exports', panel: <p className="surface-muted text-body-md">Technology, AI, software, design and digital marketing — digital.trivoxagroup.com.</p> },
                ]}
              />
            </div>
          </div>
        </SurfacePanel>
      ))}

      <Section surface="light" tight>
        <Container>
          <p className="surface-faint text-body-sm">
            /styleguide is dev-only. In production this route returns 404.
          </p>
        </Container>
      </Section>
    </>
  );
}
