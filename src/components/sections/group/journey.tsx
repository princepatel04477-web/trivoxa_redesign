'use client';

import React, { useRef, useEffect } from 'react';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import { JOURNEY } from '@/content/company';
import { INDUSTRIES } from '@/content/taxonomy';
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack/ScrollStack';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * P11 — The journey as ScrollStack cards with a scrubbed vertical spine line.
 */
export function GroupJourney() {
  const spineLineRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !spineLineRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      end: 'bottom 70%',
      scrub: 0.5,
      onUpdate: (self) => {
        if (spineLineRef.current) {
          const maxLen = 300;
          const drawLength = self.progress * maxLen;
          spineLineRef.current.style.strokeDashoffset = `${maxLen - drawLength}`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [reducedMotion]);

  return (
    <Section surface="dark" id="journey" className="py-24 bg-[#171210] text-[#F4EFE6] overflow-hidden">
      <Container>
        <div ref={containerRef} className="grid grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Title and Scrubbed DrawSVG Spine Line */}
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="The Journey"
              title={`From a mill in Surat to ${INDUSTRIES.length} export sectors.`}
              lede="Our lineage began on the weaving floor. Trivoxa brings that physical manufacturing precision to international procurement."
            />

            {/* Scrubbed Spine Line Visual */}
            <div className="mt-10 hidden lg:flex items-center gap-6">
              <svg width="24" height="300" className="overflow-visible">
                {/* Background track line */}
                <line
                  x1="12"
                  y1="0"
                  x2="12"
                  y2="300"
                  stroke="rgba(168, 139, 104, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Animated DrawSVG scrubbed line */}
                <line
                  ref={spineLineRef}
                  x1="12"
                  y1="0"
                  x2="12"
                  y2="300"
                  stroke="#A88B68"
                  strokeWidth="3"
                  strokeDasharray="300"
                  strokeDashoffset="300"
                />
                {/* Accent node dot at top */}
                <circle cx="12" cy="6" r="4" fill="#A88B68" />
              </svg>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-widest text-[#A88B68]">
                  Evolution
                </span>
                <span className="font-serif text-2xl font-bold text-[#F4EFE6]">
                  1998 → 2026+
                </span>
                <span className="text-xs text-[#F4EFE6]/60">
                  5 defined developmental eras
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: ScrollStack Timeline Cards */}
          <div className="col-span-12 lg:col-span-8">
            <ScrollStack
              useWindowScroll={true}
              itemDistance={90}
              itemScale={0.03}
              blurAmount={1}
              className="w-full"
            >
              {JOURNEY.map((item) => (
                <ScrollStackItem
                  key={item.step}
                  itemClassName="bg-[#241C18] border border-[#A88B68]/30 p-8 sm:p-10 rounded-[28px] text-[#F4EFE6] shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-[#A88B68]/20 pb-4 mb-4">
                      <span className="inline-block rounded-full border border-[#A88B68]/40 bg-[#171210] px-3 py-1 font-mono text-xs text-[#A88B68]">
                        Milestone 0{item.step}
                      </span>
                      <span className="font-mono text-sm font-semibold text-[#A88B68]">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F4EFE6] mt-2">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-base sm:text-lg text-[#F4EFE6]/80 leading-relaxed max-w-[62ch]">
                      {item.body}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#A88B68]/15 flex items-center justify-between">
                    <span className="font-mono text-xs text-[#A88B68]/70">
                      Trivoxa Corporate Heritage
                    </span>
                    <span className="font-mono text-xs text-[#F4EFE6]/40">
                      Phase {item.step} of 5
                    </span>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>
      </Container>
    </Section>
  );
}
