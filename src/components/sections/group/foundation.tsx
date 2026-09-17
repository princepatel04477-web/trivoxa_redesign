'use client';

import React from 'react';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import ScrollReveal from '@/components/reactbits/ScrollReveal/ScrollReveal';
import BounceCards from '@/components/reactbits/BounceCards/BounceCards';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';

/**
 * P11 — The Shiveshwar Foundation block with ScrollReveal copy and BounceCards.
 */
export function GroupFoundation() {
  const foundationImages = [
    '/brand/og/product-cotton-denim-fabric.png',
    '/brand/og/product-cotton-yarn.png',
    '/brand/og/product-home-textiles.png',
    '/brand/og/industry-textile-apparel.png',
    '/brand/eagle-poster.webp',
  ];

  return (
    <Section surface="deep" id="foundation" className="scroll-mt-24 py-24 bg-espresso-deep text-ivory overflow-hidden">
      <Container>
        <div className="grid grid-cols-12 gap-12 items-center">
          {/* Left Column: Headings and ScrollReveal copy */}
          <div className="col-span-12 lg:col-span-6">
            <SectionHeading
              eyebrow="The Foundation"
              title="The mill behind every specification."
              lede="Woven textile production in Surat, decades deep. Not a broker, but an operator with a factory floor behind it."
            />

            <div className="mt-8">
              <ScrollReveal
                baseOpacity={0.15}
                enableBlur={true}
                blurStrength={3}
                containerClassName="text-base sm:text-lg text-ivory/90 leading-relaxed font-sans"
              >
                {SHIVESHWAR_CANONICAL_SENTENCE}
              </ScrollReveal>
            </div>

            <div className="mt-8 p-6 rounded-2xl border border-bronze/30 bg-espresso/60">
              <p className="font-mono text-xs uppercase tracking-widest text-bronze mb-2">
                Manufacturing Assurance
              </p>
              <p className="text-sm text-ivory/80 leading-relaxed">
                Before quoting an overseas inquiry, specifications are calibrated against loom constraints, yarn count tolerances, and certified testing standards on our production lines in Gujarat.
              </p>
            </div>
          </div>

          {/* Right Column: BounceCards interactive gallery */}
          <div className="col-span-12 lg:col-span-6 flex justify-center items-center">
            <div className="relative w-full max-w-[420px] h-[400px] flex items-center justify-center">
              <BounceCards
                images={foundationImages}
                containerWidth={400}
                containerHeight={380}
                animationDelay={0.3}
                animationStagger={0.07}
                enableHover={true}
                transformStyles={[
                  'rotate(12deg) translate(-140px, -20px)',
                  'rotate(6deg) translate(-70px, 10px)',
                  'rotate(-2deg) translate(0px, 0px)',
                  'rotate(-8deg) translate(70px, -15px)',
                  'rotate(3deg) translate(140px, 15px)',
                ]}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
