'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container, Section } from '@/components/ui/layout';
import { CONTACT } from '@/content/taxonomy';
import { proofBand } from '@/lib/selectors';
import LaserFlow from '@/components/reactbits/LaserFlow/LaserFlow';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import TrueFocus from '@/components/reactbits/TrueFocus/TrueFocus';
import GradientText from '@/components/reactbits/GradientText/GradientText';
import GlareHover from '@/components/reactbits/GlareHover/GlareHover';
import SpecularButton from '@/components/reactbits/SpecularButton/SpecularButton';
import StarBorder from '@/components/reactbits/StarBorder/StarBorder';
import Magnet from '@/components/reactbits/Magnet/Magnet';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { animate } from '@/lib/motion/anime';

export function ClosingCta() {
  const router = useRouter();
  const band = proofBand();
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const webglSlot = useWebGLSlot('laser-flow-cta', ctaSectionRef);
  const reducedMotion = useReducedMotion();

  const [copied, setCopied] = useState(false);
  const copiedPillRef = useRef<HTMLSpanElement>(null);
  const numbersSpanRef = useRef<HTMLSpanElement>(null);

  // Email copy to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('careers@trivoxagroup.com');
    setCopied(true);
    if (copiedPillRef.current) {
      animate(copiedPillRef.current, {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'outBack',
      });
    }
    setTimeout(() => setCopied(false), 2200);
  };

  // Scramble / digit roll on "numbers."
  useEffect(() => {
    if (reducedMotion || !numbersSpanRef.current) return;
    const chars = '0123456789%#$@&';
    const target = 'numbers.';
    let iteration = 0;

    const interval = setInterval(() => {
      if (!numbersSpanRef.current) return;
      numbersSpanRef.current.innerText = target
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return target[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= target.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 40);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="relative overflow-hidden bg-stone-950 text-stone-100">
      {/* CAREERS STRIP */}
      <div className="border-b border-stone-800/80 bg-stone-900/50 py-6">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center font-sans text-xs text-stone-300 md:justify-start md:text-sm">
              <span>No open roles today. We still read every application that arrives at</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="relative inline-flex items-center gap-1.5 font-mono font-medium hover:opacity-80"
                title="Click to copy email"
              >
                <GradientText
                  colors={['#A88B68', '#F4EFE6', '#C4A47C']}
                  animationSpeed={5}
                  className="px-1"
                >
                  careers@trivoxagroup.com
                </GradientText>
                {copied && (
                  <span
                    ref={copiedPillRef}
                    className="ml-1 rounded-full border border-accent bg-accent/20 px-2 py-0.5 text-[10px] text-accent"
                  >
                    Copied!
                  </span>
                )}
              </button>
            </div>

            <div>
              <GlareHover
                width="auto"
                height="auto"
                background="transparent"
                borderColor="transparent"
                glareColor="#A88B68"
                glareOpacity={0.3}
              >
                <Link
                  href="/careers"
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-700 bg-stone-800/80 px-4 py-2 font-mono text-xs text-stone-200 transition-colors hover:border-accent hover:text-stone-100"
                >
                  Careers at Trivoxa →
                </Link>
              </GlareHover>
            </div>
          </div>
        </Container>
      </div>

      {/* START A CONVERSATION (FINAL CTA) */}
      <div ref={ctaSectionRef}>
        <Section surface="deep" className="relative py-28 text-left">
          {/* LaserFlow WebGL Background */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
            {webglSlot.hasSlot ? (
              <LaserFlow
                color="#A88B68"
                flowSpeed={0.8}
                wispIntensity={0.6}
                horizontalBeamOffset={0}
                verticalBeamOffset={-0.3}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#241C18]/80 via-[#171210] to-[#171210]" />
            )}
          </div>

          <Container className="relative z-10">
            <div className="grid grid-cols-12 items-end gap-12 lg:gap-16 text-left">
              <div className="col-span-12 lg:col-span-7 text-left">
                <p className="text-eyebrow mb-3 tracking-widest uppercase text-[#A88B68]">
                  Start a Conversation
                </p>

                {/* Heading with ScrambleText on numbers. */}
                <h2 className="font-serif text-3xl font-medium text-[#F4EFE6] sm:text-4xl md:text-5xl lg:max-w-[20ch] text-left">
                  <SplitText text="Send the specification. We'll come back with " className="inline" />
                  <span ref={numbersSpanRef} className="text-[#A88B68] underline decoration-[#A88B68]/40">
                    numbers.
                  </span>
                </h2>

                {/* TrueFocus highlighted keywords */}
                <div className="mt-6 flex justify-start">
                  <TrueFocus
                    sentence="Grade quantity destination-port Incoterm"
                    separator=" "
                    blurAmount={3}
                    borderColor="#A88B68"
                    glowColor="rgba(168,139,104,0.4)"
                    animationDuration={0.6}
                    pauseBetweenAnimations={1.5}
                  />
                </div>

                <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#8C8279] md:text-base text-left">
                  Grade, quantity, destination port, target Incoterm. That is enough for the export
                  desk to price a real quotation instead of a brochure answer — answered{' '}
                  {band.responseWindow}, desk hours {band.hoursIst}.
                </p>
              </div>

            {/* CTAs */}
            <div className="col-span-12 flex flex-col items-start gap-6 lg:col-span-5 lg:items-end">
              <div className="flex flex-wrap gap-4">
                <Magnet padding={20} magnetStrength={2}>
                  <div data-cursor="target">
                    <SpecularButton
                      size="lg"
                      tint="#A88B68"
                      tintOpacity={0.4}
                      onClick={() => router.push('/rfq')}
                      className="cursor-pointer"
                    >
                      Request a Quotation →
                    </SpecularButton>
                  </div>
                </Magnet>

                <Link href="/contact" data-cursor="target">
                  <StarBorder color="var(--color-accent, #A88B68)" speed="5s">
                    <span className="font-mono text-xs uppercase tracking-wider text-stone-100">
                      Contact the Group
                    </span>
                  </StarBorder>
                </Link>
              </div>

              <p className="font-mono text-xs text-stone-400">
                {CONTACT.general} · {CONTACT.registeredOffice}
              </p>
            </div>
          </div>
        </Container>
        </Section>
      </div>
    </div>
  );
}
