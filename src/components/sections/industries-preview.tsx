'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { INDUSTRIES } from '@/content/taxonomy';
import DepthCarousel from '@/components/reactbits/DepthCarousel/DepthCarousel';
import MaskedHeading from '@/components/reactbits/MaskedHeading/MaskedHeading';
import StarBorder from '@/components/reactbits/StarBorder/StarBorder';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import GradualBlur from '@/components/reactbits/GradualBlur/GradualBlur';
import { animate } from '@/lib/motion/anime';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { gsap } from 'gsap';

const INDUSTRY_TINTS = [
  'rgba(168, 139, 104, 0.18)',
  'rgba(196, 164, 124, 0.18)',
  'rgba(140, 115, 85, 0.18)',
  'rgba(175, 145, 110, 0.18)',
  'rgba(155, 130, 95, 0.18)',
  'rgba(130, 110, 85, 0.18)',
  'rgba(180, 150, 115, 0.18)',
  'rgba(200, 170, 130, 0.18)',
  'rgba(145, 125, 100, 0.18)',
];

export function IndustriesPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const bgTintRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const reducedMotion = useReducedMotion();

  const currentIndustry = INDUSTRIES[activeIndex] ?? INDUSTRIES[0]!;

  const carouselItems = INDUSTRIES.map((ind) => ({
    image: `/brand/og/industry-${ind.slug}.png`,
    alt: ind.name,
    title: ind.name,
    slug: ind.slug,
    description: ind.shortDescription,
    status: ind.status,
  }));

  // Anime.js progress bar animation for 4.5s autoplay cycle
  useEffect(() => {
    if (reducedMotion || isAutoplayPaused || !progressBarRef.current) return;

    if (animRef.current) {
      animRef.current.pause();
    }

    progressBarRef.current.style.width = '0%';
    animRef.current = animate(progressBarRef.current, {
      width: ['0%', '100%'],
      duration: 4500,
      ease: 'linear',
    });

    return () => {
      if (animRef.current) animRef.current.pause();
    };
  }, [activeIndex, isAutoplayPaused, reducedMotion]);

  // Crossfade background tint on active change (GSAP 0.8s)
  useEffect(() => {
    if (!bgTintRef.current) return;
    const targetColor = INDUSTRY_TINTS[activeIndex % INDUSTRY_TINTS.length];
    gsap.to(bgTintRef.current, {
      backgroundColor: targetColor,
      duration: 0.8,
      ease: 'power2.out',
    });
  }, [activeIndex]);

  const slideCounter = `${String(activeIndex + 1).padStart(2, '0')} / ${String(INDUSTRIES.length).padStart(2, '0')}`;

  return (
    <Section
      surface="deep"
      className="relative overflow-hidden py-24"
      aria-label="Industries We Serve Carousel"
    >
      {/* Background Crossfade Tint */}
      <div
        ref={bgTintRef}
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: INDUSTRY_TINTS[0] }}
      />

      <Container className="relative z-10">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="surface-accent text-eyebrow mb-3 tracking-widest uppercase">
              Industries We Serve
            </p>
            <MaskedHeading
              text="Supporting the Industries That Shape Tomorrow."
              className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl md:text-5xl"
            />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/industries" data-cursor="target">
              <StarBorder color="var(--color-accent, #A88B68)" speed="5s">
                <span className="font-mono text-xs uppercase tracking-wider text-stone-100">
                  View all 9 industries →
                </span>
              </StarBorder>
            </Link>
          </div>
        </div>

        {/* Live announcer for screen readers */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Currently viewing {currentIndustry.name}, slide {activeIndex + 1} of {INDUSTRIES.length}
        </div>

        {/* DepthCarousel Wrapper with left/right gradual blur */}
        <div
          className="relative my-8 h-[460px] w-full md:h-[520px]"
          role="region"
          aria-roledescription="carousel"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
        >
          {/* Left and Right GradualBlur Edge Scrims */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 md:w-28">
            <GradualBlur
              position="left"
              strength={2}
              height="100%"
              className="h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 md:w-28">
            <GradualBlur
              position="right"
              strength={2}
              height="100%"
              className="h-full w-full"
            />
          </div>

          <DepthCarousel
            items={carouselItems}
            cardWidth={340}
            cardHeight={440}
            depth={240}
            spread={110}
            blur={reducedMotion ? 0 : 5}
            autoplay={!reducedMotion && !isAutoplayPaused}
            autoplayDelay={4500}
            loop
            onChange={(idx) => setActiveIndex(idx)}
            renderItem={(rawItem, _idx: number, _isActive: boolean) => {
              const item = rawItem as (typeof carouselItems)[0];
              const isFurniture = item.slug === 'furniture-interiors';
              return (
                <div
                  className="relative h-full w-full overflow-hidden rounded-[20px] border border-stone-800 bg-stone-950"
                  data-cursor="target"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="340px"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  {/* Card overlay content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col p-6">
                    {isFurniture ? (
                      <div className="mb-2 inline-flex items-center">
                        <span className="rounded-full border border-accent/40 bg-stone-900/90 px-2.5 py-0.5 font-mono text-[10px] text-accent">
                          <ShinyText text="Quoted, not yet catalogued" speed={3} />
                        </span>
                      </div>
                    ) : item.status === 'onboarding' ? (
                      <span className="mb-2 inline-block w-fit rounded-full border border-stone-700 bg-stone-900/80 px-2 py-0.5 font-mono text-[10px] text-stone-300">
                        In Onboarding
                      </span>
                    ) : null}

                    <h4 className="font-serif text-xl font-medium text-stone-100 md:text-2xl">
                      {item.title}
                    </h4>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-300">
                      {item.description}
                    </p>

                    <Link
                      href={`/industries/${item.slug}`}
                      className="group mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-stone-100"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              );
            }}
          />
        </div>

        {/* Carousel Footer: Active Details, Progress Bar & SplitFlap counter */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-stone-800/60 pt-6 md:flex-row">
          <div className="flex items-center gap-4">
            {/* SplitFlap slide counter */}
            <div className="flex items-center font-mono text-sm text-accent">
              <SplitFlapText text={slideCounter} flipDuration={0.4} />
            </div>

            {/* Autoplay Pause / Resume toggle */}
            <button
              type="button"
              onClick={() => setIsAutoplayPaused((prev) => !prev)}
              aria-label={isAutoplayPaused ? 'Play carousel autoplay' : 'Pause carousel autoplay'}
              className="flex size-7 items-center justify-center rounded-full border border-stone-700 bg-stone-900/80 text-stone-400 hover:text-stone-100"
            >
              {isAutoplayPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
            </button>
          </div>

          {/* Autoplay Progress Bar */}
          <div className="h-1 w-48 overflow-hidden rounded-full bg-stone-800 md:w-64">
            <div
              ref={progressBarRef}
              className="h-full bg-accent transition-[width] duration-100 ease-linear"
              style={{ width: '0%' }}
            />
          </div>

          {/* Active Industry Title with DecryptedText */}
          <div className="text-right">
            <div className="font-serif text-lg text-stone-200">
              <DecryptedText text={currentIndustry.name} speed={30} />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

