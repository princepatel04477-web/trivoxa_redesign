'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useState } from 'react';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import LineSidebar from '@/components/reactbits/LineSidebar/LineSidebar';
import FadeContent from '@/components/reactbits/FadeContent/FadeContent';
import { CONTACT } from '@/content/taxonomy';
import type { LegalDocument } from '@/content/legal';

/**
 * Prompt 12: Calm treatment for /legal/privacy, /legal/terms, /legal/cookies, /legal/anti-corruption.
 * - SplitText title only
 * - LineSidebar table of contents with scroll-spy / jump-to
 * - Section headings FadeContent
 * - Calm, legible typography with 0 WebGL and TargetCursor disabled.
 */
export function LegalDocumentView({ document: docData }: { document: LegalDocument }) {
  const anchors = docData.sections.map((section, index) => ({
    id: `section-${index + 1}`,
    heading: section.heading,
  }));

  const [activeToc, setActiveToc] = useState<number | null>(0);

  const trail = [
    { href: '/', label: 'Home' },
    { href: `/legal/${docData.slug}`, label: docData.title },
  ];
  const breadcrumbs = breadcrumbSchema(trail);

  const handleTocClick = (index: number) => {
    setActiveToc(index);
    if (typeof window !== 'undefined') {
      const target = window.document.getElementById(`section-${index + 1}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Calm Legal Hero */}
      <Section surface="light" className="pt-header" bleed>
        {breadcrumbs ? <JsonLd data={breadcrumbs} /> : null}
        <Container>
          <Breadcrumb trail={trail} className="mb-xl" />

          <div className="grid grid-cols-12 gap-xl">
            <div className="col-span-12 lg:col-span-8">
              <Eyebrow>Legal</Eyebrow>
              <h1 className="mt-lg">
                <SplitText
                  text={docData.title}
                  tag="span"
                  splitType="words"
                  className="text-display-lg font-serif tracking-tight text-stone-900 block"
                  delay={40}
                  duration={0.8}
                  textAlign="left"
                />
              </h1>
              <Prose className="mt-lg max-w-[62ch] text-body-lg">
                <p className="surface-muted">{docData.summary}</p>
              </Prose>
            </div>

            <div className="col-span-12 lg:col-span-4">
              <dl className="surface-hairline border-t">
                <div className="surface-hairline flex items-baseline justify-between gap-md border-b py-md">
                  <dt className="surface-faint spec-value uppercase" data-spec>
                    Last updated
                  </dt>
                  <dd className="surface-fg spec-value text-right" data-spec>
                    {docData.updated}
                  </dd>
                </div>
                <div className="surface-hairline flex items-baseline justify-between gap-md border-b py-md">
                  <dt className="surface-faint spec-value uppercase" data-spec>
                    Review status
                  </dt>
                  <dd className="text-bronze-ink spec-value text-right font-semibold" data-spec>
                    {docData.reviewStatus === 'counsel-approved' ? 'Counsel approved' : 'Internal review'}
                  </dd>
                </div>
                <div className="surface-hairline flex items-baseline justify-between gap-md border-b py-md">
                  <dt className="surface-faint spec-value uppercase" data-spec>
                    Questions to
                  </dt>
                  <dd className="surface-fg spec-value text-right" data-spec>
                    {CONTACT.general}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Container>
      </Section>

      {/* Main Content Layout with LineSidebar TOC and FadeContent headings */}
      <Section surface="light" className="pt-0">
        <Container>
          <div className="grid grid-cols-12 gap-2xl">
            <nav aria-label="Contents" className="col-span-12 lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-[120px]">
                <Eyebrow tick={false} className="surface-faint mb-3">
                  On this page
                </Eyebrow>
                
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <LineSidebar
                    items={anchors.map((a) => a.heading)}
                    accentColor={BRAND.bronze.hex}
                    textColor={BRAND.espresso.hex}
                    markerColor={BRAND.bronze.hex}
                    defaultActive={activeToc}
                    onItemClick={handleTocClick}
                    fontSize={0.88}
                    itemGap={14}
                    proximityRadius={60}
                    className="w-full"
                  />
                </div>

                {docData.reviewStatus === 'internal-review' ? (
                  <p className="border-bronze/40 surface-muted mt-xl border-l-2 pl-md text-body-sm">
                    Under internal review — not yet read by counsel. It states what this site
                    actually does today.
                  </p>
                ) : null}
              </div>
            </nav>

            <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              {docData.sections.map((section, index) => (
                <section
                  key={section.heading}
                  id={anchors[index]?.id}
                  className="surface-hairline scroll-mt-[120px] border-t py-2xl first:border-t-0 first:pt-0"
                >
                  <FadeContent blur duration={800} threshold={0.15}>
                    <h2 className="text-heading-lg max-w-[32ch] text-stone-900">{section.heading}</h2>
                  </FadeContent>

                  {section.paragraphs.length > 0 ? (
                    <Prose className="mt-lg max-w-[74ch] text-body-md">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)} className="surface-muted leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </Prose>
                  ) : null}

                  {section.list.length > 0 ? (
                    <ul className="mt-lg flex max-w-[74ch] flex-col gap-sm">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 40)} className="surface-muted text-body-md flex items-start gap-md">
                          <span aria-hidden className="bg-bronze mt-2.5 size-1.5 shrink-0 rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <div className="surface-raised surface-hairline mt-2xl flex flex-wrap items-center justify-between gap-lg border p-lg">
                <p className="surface-muted text-body-sm max-w-[54ch]">
                  Questions about this document go to {CONTACT.general}, marked for the attention of
                  the Managing Director.
                </p>
                <ArrowLink href="/contact">Contact the group</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
