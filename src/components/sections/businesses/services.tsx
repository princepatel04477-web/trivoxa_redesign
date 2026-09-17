'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import { DIGITAL_PROPERTY, SERVICES } from '@/content/process';
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack/ScrollStack';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import StarBorder from '@/components/reactbits/StarBorder/StarBorder';

/**
 * P10 — The services of Trivoxa Digital, rendered as a stacking deck via ScrollStack.
 *
 * Parameters per Prompt 10:
 * - 5+ services as ScrollStack (itemDistance 100, itemScale 0.03, blurAmount 1)
 * - Final card CTA out to digital.trivoxagroup.com
 */
export function ServiceLines() {
  return (
    <Section surface="light" id="services" className="py-20 overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="Service Lines"
          title="Services delivered like exports: scoped, documented, handed over."
          lede="Each line is delivered by Trivoxa Digital under fixed-scope contracts with verifiable review milestones and source-file transfers."
          action={
            <a
              href={DIGITAL_PROPERTY.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-bronze-ink inline-flex items-center gap-1 text-body-md font-medium"
            >
              {DIGITAL_PROPERTY.label}
              <ArrowUpRight aria-hidden size={14} />
            </a>
          }
        />

        {/* ScrollStack Container */}
        <div className="mt-12 w-full max-w-4xl mx-auto">
          <ScrollStack
            useWindowScroll={true}
            itemDistance={100}
            itemScale={0.03}
            blurAmount={1}
            className="w-full"
          >
            {SERVICES.map((service, index) => (
              <ScrollStackItem
                key={service.slug}
                itemClassName="bg-[#171210] border border-[#A88B68]/30 p-8 sm:p-10 rounded-[28px] text-[#F4EFE6] shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#A88B68]/20 pb-4 mb-6">
                    <span className="font-mono text-xs text-[#A88B68] uppercase tracking-widest">
                      Service Line 0{index + 1}
                    </span>
                    <span className="font-mono text-xs text-[#F4EFE6]/60">
                      Trivoxa Digital
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFE6]">
                    {service.name}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-[#F4EFE6]/80 leading-relaxed max-w-[64ch]">
                    {service.summary}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-[#A88B68]/20">
                  <p className="font-mono text-xs text-[#A88B68] mb-2 uppercase tracking-wider">
                    Core Deliverables
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="text-xs text-[#F4EFE6]/70 flex items-center gap-2"
                      >
                        <span className="size-1 rounded-full bg-[#A88B68] shrink-0" />
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollStackItem>
            ))}

            {/* Final Card: Dedicated Property CTA */}
            <ScrollStackItem
              itemClassName="bg-gradient-to-br from-[#241C18] via-[#171210] to-[#171210] border-2 border-[#A88B68] p-8 sm:p-12 rounded-[28px] text-[#F4EFE6] shadow-2xl flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-[#A88B68] uppercase tracking-widest block mb-3">
                  Dedicated Digital Operating Property
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4EFE6]">
                  Ready to scope a software or digital systems project?
                </h3>
                <p className="mt-4 text-base text-[#F4EFE6]/80 leading-relaxed max-w-[62ch]">
                  Visit our dedicated technology property at{' '}
                  <ShinyText text="digital.trivoxagroup.com" speed={3} className="font-bold text-[#A88B68]" />{' '}
                  for case studies, live staging demos, and engineering team profiles.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={DIGITAL_PROPERTY.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-block"
                >
                  <StarBorder
                    color="#A88B68"
                    className="font-mono text-xs uppercase tracking-wider font-semibold text-[#F4EFE6]"
                  >
                    Visit digital.trivoxagroup.com ↗
                  </StarBorder>
                </a>

                <Link
                  href="/rfq?division=service-exports"
                  className="font-mono text-xs text-[#A88B68] hover:text-[#F4EFE6] underline px-4 py-2"
                >
                  Or submit brief via Group RFQ →
                </Link>
              </div>
            </ScrollStackItem>
          </ScrollStack>
        </div>

        <div className="surface-hairline mt-20 flex flex-wrap items-center justify-between gap-md border-t pt-xl">
          <p className="surface-muted text-body-md max-w-[62ch]">
            Engagement runs on the same five steps whether the work is a catalogue redesign or a
            platform build — scope, priced proposal, review cycles, handover, support.
          </p>
          <ArrowLink href="#engagement">See the engagement process</ArrowLink>
        </div>
      </Container>
    </Section>
  );
}
