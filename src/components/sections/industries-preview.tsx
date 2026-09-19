'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Pause,
  Play,
  Shirt,
  Stethoscope,
  Building2,
  Armchair,
  Wheat,
  Cog,
  Sparkles,
  ShoppingBag,
  Cpu,
} from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { INDUSTRIES } from '@/content/taxonomy';
import DepthCarousel from '@/components/reactbits/DepthCarousel/DepthCarousel';
import StarBorder from '@/components/reactbits/StarBorder/StarBorder';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import GradualBlur from '@/components/reactbits/GradualBlur/GradualBlur';
import { animate } from '@/lib/motion/anime';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const INDUSTRY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'textile-apparel': Shirt,
  'healthcare-pharmaceuticals': Stethoscope,
  'building-materials': Building2,
  'furniture-interiors': Armchair,
  'agriculture-food': Wheat,
  'engineering-industrial': Cog,
  'jewellery-precious-products': Sparkles,
  'retail-consumer-goods': ShoppingBag,
  technology: Cpu,
};

export function IndustriesPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  // Autoplay + its progress bar must not run while the carousel is scrolled away.
  const [inView, setInView] = useState(false);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const reducedMotion = useReducedMotion();

  const currentIndustry = INDUSTRIES[activeIndex] ?? INDUSTRIES[0]!;

  const carouselItems = INDUSTRIES.map((ind) => ({
    image: '',
    title: ind.name,
    slug: ind.slug,
    description: ind.shortDescription,
    status: ind.status,
  }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      rootMargin: '80px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const autoplayActive = inView && !reducedMotion && !isAutoplayPaused;

  // Progress bar for the 4.5s autoplay cycle. Animates transform (scaleX), not
  // width — width forces layout + paint on every frame.
  useEffect(() => {
    if (!autoplayActive || !progressBarRef.current) return;

    if (animRef.current) {
      animRef.current.pause();
    }

    progressBarRef.current.style.transform = 'scaleX(0)';
    animRef.current = animate(progressBarRef.current, {
      scaleX: [0, 1],
      duration: 4500,
      ease: 'linear',
    });

    return () => {
      if (animRef.current) animRef.current.pause();
    };
  }, [activeIndex, autoplayActive]);

  const slideCounter = `${String(activeIndex + 1).padStart(2, '0')} / ${String(INDUSTRIES.length).padStart(2, '0')}`;

  return (
    <div ref={sectionRef}>
      <Section
        surface="deep"
        className="relative overflow-hidden py-24"
        aria-label="Industries We Serve Carousel"
      >
        <Container className="relative z-10">
          <div className="mb-12 max-w-[42rem]">
            <p className="text-bronze mb-3 font-mono text-xs font-semibold tracking-widest uppercase">
              Industries We Serve
            </p>
            <h2 className="text-ivory font-serif text-3xl leading-tight font-medium sm:text-4xl md:text-5xl">
              Supporting the Industries That Shape Tomorrow.
            </h2>
            <p className="surface-faint mt-3 text-sm leading-relaxed">
              Nine export sectors structured around verified manufacturing lineages, quality
              controls, and established port corridors.
            </p>
          </div>

          {/* Live announcer for screen readers */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Currently viewing {currentIndustry.name}, slide {activeIndex + 1} of {INDUSTRIES.length}
          </div>

          {/* DepthCarousel Wrapper with left/right gradual blur */}
          <div
            className="relative my-8 h-[460px] w-full md:h-[500px]"
            role="region"
            aria-roledescription="carousel"
            onMouseEnter={() => setIsAutoplayPaused(true)}
            onMouseLeave={() => setIsAutoplayPaused(false)}
          >
            {/* Left and Right GradualBlur Edge Scrims */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 md:w-28">
              <GradualBlur position="left" strength={2} height="100%" className="h-full w-full" />
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 md:w-28">
              <GradualBlur position="right" strength={2} height="100%" className="h-full w-full" />
            </div>

            <DepthCarousel
              items={carouselItems}
              cardWidth={340}
              cardHeight={440}
              depth={240}
              spread={110}
              blur={reducedMotion ? 0 : 5}
              autoplay={autoplayActive}
              autoplayDelay={4500}
              loop
              onChange={(idx) => setActiveIndex(idx)}
              renderItem={(rawItem, idx: number, isActive: boolean) => {
                const item = rawItem as (typeof carouselItems)[0];
                const isFurniture = item.slug === 'furniture-interiors';
                const IconComp = INDUSTRY_ICONS[item.slug] || Building2;
                const numStr = String(idx + 1).padStart(2, '0');

                return (
                  <div
                    className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] border p-7 transition-all duration-300 select-none ${
                      isActive
                        ? 'border-bronze/60 bg-espresso shadow-[0_25px_60px_rgba(0,0,0,0.85)]'
                        : 'bg-espresso-deep border'
                    }`}
                  >
                    {/* Subtle radial glow */}
                    <div
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,139,104,0.14),_transparent_70%)]"
                      aria-hidden="true"
                    />

                    {/* Top card bar: Number + Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-bronze font-mono text-xs font-bold tracking-wider">
                        {numStr}
                      </span>
                      {isFurniture ? (
                        <span className="border-bronze/40 bg-espresso-deep/90 text-bronze rounded-full border px-3 py-1 font-mono text-[10px]">
                          <ShinyText text="Quoted, not yet catalogued" speed={3} />
                        </span>
                      ) : item.status === 'onboarding' ? (
                        <span className="bg-espresso-deep/90 surface-faint rounded-full border px-3 py-1 font-mono text-[10px]">
                          In Onboarding
                        </span>
                      ) : (
                        <span className="border-bronze/30 bg-bronze/10 text-bronze rounded-full border px-3 py-1 font-mono text-[10px]">
                          Live Export
                        </span>
                      )}
                    </div>

                    {/* Center: Large Architectural Icon */}
                    <div className="relative z-10 my-auto flex items-center justify-center py-6">
                      <div className="bg-espresso-deep/70 text-bronze flex size-20 items-center justify-center rounded-2xl border shadow-inner transition-transform duration-500 hover:scale-105">
                        <IconComp className="size-10 stroke-[1.25]" />
                      </div>
                    </div>

                    {/* Bottom: Title, Description, Link */}
                    <div className="relative z-10 flex flex-col">
                      <h3 className="text-ivory font-serif text-2xl leading-tight font-medium">
                        {item.title}
                      </h3>
                      <p className="surface-faint mt-2 line-clamp-2 text-xs leading-relaxed">
                        {item.description}
                      </p>
                      <Link
                        href={`/industries/${item.slug}`}
                        className="group text-bronze hover:text-ivory mt-4 inline-flex items-center gap-1.5 font-mono text-xs transition-colors"
                      >
                        <span>Explore industry</span>
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
            <div className="flex items-center gap-3">
              {/* SplitFlap slide counter */}
              <div className="flex items-center">
                <SplitFlapText
                  text={slideCounter}
                  fontSize={16}
                  padTo={slideCounter.length}
                  tileRadius={3}
                  gap={3}
                  flipDuration={0.35}
                />
              </div>

              {/* Autoplay Pause / Resume toggle */}
              <button
                type="button"
                onClick={() => setIsAutoplayPaused((prev) => !prev)}
                aria-label={isAutoplayPaused ? 'Play carousel autoplay' : 'Pause carousel autoplay'}
                className="flex size-7 items-center justify-center rounded-full border border-stone-700 bg-stone-900/80 text-stone-400 transition-colors hover:text-stone-100"
              >
                {isAutoplayPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
              </button>
            </div>

            {/* Autoplay Progress Bar */}
            <div className="h-1 w-36 overflow-hidden rounded-full bg-stone-800 md:w-56">
              <div
                ref={progressBarRef}
                className="bg-accent h-full w-full origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>

            {/* Active Industry Title with DecryptedText */}
            <div className="text-right">
              <div className="font-serif text-base text-stone-200 sm:text-lg">
                <DecryptedText text={currentIndustry.name} speed={30} />
              </div>
            </div>
          </div>

          {/* View all 9 industries StarBorder CTA */}
          <div className="mt-10 flex justify-center">
            <Link href="/industries" data-cursor="target">
              <StarBorder color={BRAND.bronze.hex} speed="5s">
                <span className="text-ivory inline-block px-4 py-1 font-mono text-xs tracking-wider uppercase">
                  View all 9 industries →
                </span>
              </StarBorder>
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}
