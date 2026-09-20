'use client';

import React, { useRef } from 'react';
import { Container, Section } from '@/components/ui/layout';
import { CERTIFICATIONS, PORTS } from '@/content/taxonomy';
import { proofBand } from '@/lib/selectors';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import Counter from '@/components/reactbits/Counter/Counter';
import BorderGlow from '@/components/reactbits/BorderGlow/BorderGlow';
import LogoLoop from '@/components/reactbits/LogoLoop/LogoLoop';

/**
 * P7 · SECTION A — the proof band.
 *
 * Rebuilt with refined luxury styling:
 * - Subtle ambient gradient and refined 1px bronze accents (no erratic electric border or radar)
 * - SpotlightCard for Port cards with SplitFlapText UN/LOCODEs
 * - Counter + BorderGlow for Published Catalog & 24h SLA tile
 * - Substantive export compliance, pre-shipment inspection, and QA protocols
 * - LogoLoop trade marks strip
 */
export function ProofBand() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const band = proofBand();
  const active = CERTIFICATIONS.filter((c) => c.status === 'active');
  const inProgress = CERTIFICATIONS.filter((c) => c.status === 'in-progress');

  const complianceChips = [
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">IEC · 0824001234 (DGFT)</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">GST · 24AAACT8924F1ZW</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">COO · Certificate of Origin (FIEO)</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">Phytosanitary & Fumigation Protocol</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">MTC · Material Test Certificates</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">SGS / BV Pre-Shipment Inspection</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-bronze/30 bg-espresso/80 text-xs font-mono font-medium text-ivory">FOB · CIF · DAP · DDP Incoterms</span> },
  ];

  return (
    <div ref={sectionRef}>
      <Section surface="deep" tight className="relative overflow-hidden border-t border-bronze/25 py-14 md:py-18">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(168,139,104,0.08),_transparent_70%)]"
          aria-hidden="true"
        />

        <Container className="relative z-10">
          <div className="mb-10 text-left">
            <p className="eyebrow text-bronze mb-2">Trade Infrastructure</p>
            <h2 className="text-2xl md:text-3xl font-serif text-ivory font-medium">
              Operational Reality. Proven Trade Lines.
            </h2>
            <p className="surface-faint mt-2 max-w-[48rem] text-sm leading-relaxed">
              Every line quoted by Trivoxa Group is backed by active customs registrations, dedicated port access, and rigorous batch inspection standards.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6 lg:gap-8">
            {/* Ports Column */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
              <p className="eyebrow text-bronze">Western India Export Gateways</p>
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
                  across {band.liveCategoryCount} live categories, each quoted with verifiable HS code, MOQ, lead time, and Incoterms.
                </p>
              </BorderGlow>

              {/* Refined Luxury Response Window Card */}
              <div className="rounded-2xl border border-bronze/30 bg-espresso-deep/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:border-bronze/60">
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
              </div>
            </div>

            {/* Compliance Posture Column */}
            <div className="col-span-12 lg:col-span-3 flex flex-col justify-between gap-4 lg:border-l lg:border-bronze/20 lg:pl-8">
              <div className="p-6 rounded-2xl bg-espresso-deep/80 border border-bronze/20 flex flex-col h-full justify-between">
                <div>
                  <p className="eyebrow mb-3 text-bronze">Compliance Posture</p>
                  <p className="text-body-sm text-ivory/90 leading-relaxed font-sans">
                    <strong className="text-bronze font-semibold">{active.map((c) => c.name).join(' & ')}</strong> registrations active.
                  </p>
                  <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                    {inProgress.map((c) => c.name).join(', ')} in progress with published target verification quarters.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-bronze/20">
                  <p className="font-mono text-[11px] text-stone-400 leading-relaxed">
                    Pre-shipment batch testing, container loading surveillance, and SGS / Bureau Veritas inspection coordination available on buyer request.
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
