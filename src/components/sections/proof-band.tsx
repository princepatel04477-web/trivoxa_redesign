'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useRef } from 'react';
import { Container, Section } from '@/components/ui/layout';
import { CERTIFICATIONS, PORTS } from '@/content/taxonomy';
import { proofBand } from '@/lib/selectors';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import ElectricBorder from '@/components/reactbits/ElectricBorder/ElectricBorder';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import Counter from '@/components/reactbits/Counter/Counter';
import BorderGlow from '@/components/reactbits/BorderGlow/BorderGlow';
import LogoLoop from '@/components/reactbits/LogoLoop/LogoLoop';
import Radar from '@/components/reactbits/Radar/Radar';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { WebGLErrorBoundary } from '@/components/three/webgl-error-boundary';

/**
 * P7 · SECTION A — the proof band.
 *
 * Rebuilt with Prompt 3 specifications:
 * - MaskedHeading section reveal
 * - Radar background (WebGL budget aware)
 * - SpotlightCard + ElectricBorder hover for Port cards with SplitFlapText UN/LOCODEs
 * - Counter + BorderGlow for Published Catalog & 24h SLA Hero tile
 * - LogoLoop trade marks strip
 */
export function ProofBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const band = proofBand();
  const active = CERTIFICATIONS.filter((c) => c.status === 'active');
  const inProgress = CERTIFICATIONS.filter((c) => c.status === 'in-progress');
  const webglSlot = useWebGLSlot('proofband-radar', sectionRef);

  const complianceChips = [
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">IEC · 0824001234</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">GST · 24AAACT8924F1ZW</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">COO · Certificate of Origin</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">Phytosanitary Certification</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">MTC · Material Test Certificates</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">FOB · CIF · DAP Incoterms</span> },
  ];

  return (
    <div ref={sectionRef}>
      <Section surface="deep" tight className="relative overflow-hidden border-t border-bronze/25 py-12 md:py-16">
        {/* Background Radar WebGL */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-20" aria-hidden="true">
          {webglSlot.hasSlot ? (
            <WebGLErrorBoundary fallback={null}>
              <Radar color={BRAND.bronze.hex} speed={0.8} ringCount={4} spokeCount={6} />
            </WebGLErrorBoundary>
          ) : null}
        </div>

        <Container className="relative z-10">
          <div className="mb-10 text-left">
            <h2 className="text-2xl md:text-3xl font-serif text-ivory">
              Operational Reality. Proven Trade Lines.
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* Ports Column */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
              <p className="eyebrow text-bronze">Export Ports</p>
              <div className="flex flex-col gap-3">
                {PORTS.map((port) => (
                  <SpotlightCard
                    key={port.slug}
                    spotlightColor="rgba(168, 139, 104, 0.25)"
                    className="!p-4 !bg-espresso-deep/90 !border hover:!border-bronze/60 transition-all rounded-xl"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-body-md font-semibold text-ivory">{port.name}</span>
                        <div className="shrink-0">
                          <SplitFlapText
                            text={port.locode.replace(/\s+/g, '').slice(0, 5)}
                            fontSize="18px"
                            tileRadius={4}
                            gap={2}
                            flipDuration={0.35}
                          />
                        </div>
                      </div>
                      <span className="text-body-sm surface-faint leading-snug">{port.reason}</span>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            {/* Published Catalog Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-6 lg:border-l lg:border-bronze/20 lg:pl-8">
              <BorderGlow glowColor="40 80 80" borderRadius={16} className="p-6 bg-espresso-deep/80 border border-bronze/20">
                <p className="eyebrow mb-2 text-bronze">Published Catalog</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-md leading-none font-serif text-3xl font-bold text-ivory">
                    <Counter value={band.liveProductCount} fontSize={32} />
                  </span>
                  <span className="text-heading-md font-medium text-ivory/70"> products</span>
                </div>
                <p className="surface-muted mt-2 text-body-sm leading-relaxed text-ivory/70">
                  across {band.liveCategoryCount} live categories, each quoted with HS code, MOQ, lead time and Incoterms.
                </p>
              </BorderGlow>

              <ElectricBorder color={BRAND.bronze.hex} chaos={0.3} borderRadius={16} className="p-6 bg-espresso-deep/90 border border-bronze/40">
                <p className="eyebrow mb-2 text-bronze">Response Window</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-display-md leading-none font-serif text-3xl font-bold text-ivory">
                    <Counter value={24} fontSize={32} />
                  </span>
                  <span className="text-heading-md font-medium text-bronze"> business hours</span>
                </div>
                <p className="surface-muted mt-2 text-body-sm text-ivory/70">
                  {band.hoursIst} · {band.timezoneLabel}
                </p>
              </ElectricBorder>
            </div>

            {/* Compliance Posture Column */}
            <div className="col-span-12 lg:col-span-3 flex flex-col justify-between gap-4 lg:border-l lg:border-bronze/20 lg:pl-8">
              <div className="p-6 rounded-2xl bg-espresso-deep/80 border border-bronze/20 flex flex-col h-full justify-between">
                <div>
                  <p className="eyebrow mb-3 text-bronze">Compliance Posture</p>
                  <p className="text-body-md text-ivory/90 leading-relaxed">
                    {active.map((c) => c.name).join(' and ')} active.{' '}
                    {inProgress.map((c) => c.name).join(', ')} in progress with target dates published.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trade Marks LogoLoop */}
          <div className="mt-12 pt-6 border-t border-bronze/20">
            <LogoLoop logos={complianceChips} speed={40} direction="left" />
          </div>
        </Container>
      </Section>
    </div>
  );
}
