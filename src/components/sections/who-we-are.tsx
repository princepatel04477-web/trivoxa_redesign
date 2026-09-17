'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Section } from '@/components/ui/layout';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { DIVISIONS, INDUSTRIES, REGIONS } from '@/content/taxonomy';
import Threads from '@/components/reactbits/Threads/Threads';
import TextPressure from '@/components/reactbits/TextPressure/TextPressure';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import ScrollReveal from '@/components/reactbits/ScrollReveal/ScrollReveal';
import VariableProximity from '@/components/reactbits/VariableProximity/VariableProximity';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import Magnet from '@/components/reactbits/Magnet/Magnet';
import ScrollVelocity from '@/components/reactbits/ScrollVelocity/ScrollVelocity';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export function WhoWeAre() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const webglSlot = useWebGLSlot('threads-who-we-are', sectionRef);
  const reducedMotion = useReducedMotion();

  // Cycling focus for the 3 inline stats
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  const stats = [
    { count: DIVISIONS.length, label: 'export divisions' },
    { count: INDUSTRIES.length, label: 'industries' },
    { count: REGIONS.length, label: 'regions' },
  ];

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-stone-950 text-stone-100">
      <Section surface="deep" className="relative py-28">
        {/* Background: Threads WebGL with budget slot */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          {webglSlot.hasSlot && !reducedMotion ? (
            <Threads
              amplitude={1}
              distance={0}
              enableMouseInteraction={true}
              color={[0.66, 0.55, 0.41]}
            />
          ) : (
            <div className="absolute inset-0 bg-stone-950/80" />
          )}
        </div>

        <Container className="relative z-10">
          <div ref={containerRef} className="grid grid-cols-12 gap-y-12 lg:gap-x-16">
            {/* Left Column: Heading */}
            <div className="col-span-12 lg:col-span-5">
              <p className="surface-accent text-eyebrow mb-4 tracking-widest uppercase">
                Who We Are
              </p>

              {/* Desktop TextPressure (>= 1024px) / Mobile & Tablet SplitText (< 1024px) */}
              <h2 className="my-2">
                <span className="hidden lg:block">
                  <TextPressure
                    as="span"
                    text="A Vision Beyond Business."
                    fontFamily="Instrument Serif"
                    minFontSize={44}
                    width
                    weight
                    italic={false}
                    textColor="var(--color-ivory)"
                  />
                </span>
                <span className="block lg:hidden">
                  <SplitText
                    text="A Vision Beyond Business."
                    className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl"
                  />
                </span>
              </h2>

              <div className="mt-8">
                <p className="font-mono text-xs tracking-widest text-accent uppercase">
                  Surat · Gujarat · India
                </p>
              </div>
            </div>

            {/* Right Column: Narrative + Variable Proximity + Stats */}
            <div className="col-span-12 flex flex-col gap-8 lg:col-span-7">
              <div className="text-lg leading-relaxed text-stone-200 md:text-xl">
                <span>
                  Trivoxa Group exists to bridge global demand and India&apos;s manufacturing
                  capability —{' '}
                </span>
                <span className="font-medium text-accent">
                  <VariableProximity
                    label="not as a broker, but as an operator with a factory floor behind it."
                    containerRef={containerRef}
                    radius={120}
                    falloff="exponential"
                    fromFontVariationSettings="'wght' 400, 'opsz' 14"
                    toFontVariationSettings="'wght' 800, 'opsz' 28"
                    className="inline cursor-default"
                  />
                </span>
              </div>

              {/* Canonical sentence with ScrollReveal */}
              <div className="text-[clamp(22px,2vw,32px)] leading-relaxed text-ivory">
                <ScrollReveal
                  baseOpacity={0.15}
                  enableBlur={!reducedMotion}
                  baseRotation={0}
                  blurStrength={4}
                  wordAnimationEnd="center center"
                  rotationEnd="center center"
                  textClassName="leading-relaxed font-serif text-ivory"
                >
                  {SHIVESHWAR_CANONICAL_SENTENCE}
                </ScrollReveal>
              </div>

              <p className="text-sm leading-relaxed text-stone-400 md:text-base">
                Tomorrow we expand into new industries and markets, on the same terms:
                specifications before superlatives, and relationships measured in years.
              </p>

              {/* Cycling TrueFocus-style stats */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                {stats.map((item, idx) => {
                  const isActive = activeStatIndex === idx;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all duration-500 ${
                        isActive
                          ? 'border-accent/80 bg-accent/15 text-stone-100 shadow-[0_0_15px_rgba(168,139,104,0.3)]'
                          : 'border-stone-800/80 bg-stone-900/40 text-stone-400 opacity-60'
                      }`}
                    >
                      <span className="text-lg font-bold text-accent">
                        <CountUp to={item.count} duration={1.2} />
                      </span>
                      <span className="text-xs uppercase tracking-wider">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Discover the Group */}
              <div className="mt-4 flex items-center gap-6">
                <Magnet padding={20} magnetStrength={2}>
                  <div data-cursor="target">
                    <SpecularButton
                      size="md"
                      tint="var(--color-bronze)"
                      tintOpacity={0.4}
                      onClick={() => router.push('/group')}
                      className="cursor-pointer"
                    >
                      Discover the Group →
                    </SpecularButton>
                  </div>
                </Magnet>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section divider: ScrollVelocity */}
      <div className="border-y border-stone-800/80 bg-stone-900/60 py-4">
        <ScrollVelocity
          texts={[
            'Surat · Mundra · Kandla · JNPT ·',
            'Textiles · Pharma · Stone · Agri · Engineering ·',
          ]}
          velocity={60}
          className="font-mono text-xs uppercase tracking-widest text-stone-400"
        />
      </div>
    </div>
  );
}

