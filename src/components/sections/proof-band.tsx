'use client';

import Link from 'next/link';
import { Container, Section } from '@/components/ui/layout';
import { CERTIFICATIONS, PORTS } from '@/content/taxonomy';
import { proofBand } from '@/lib/selectors';
import MaskedHeading from '@/components/reactbits/MaskedHeading/MaskedHeading';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import ElectricBorder from '@/components/reactbits/ElectricBorder/ElectricBorder';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import Counter from '@/components/reactbits/Counter/Counter';
import BorderGlow from '@/components/reactbits/BorderGlow/BorderGlow';
import LogoLoop from '@/components/reactbits/LogoLoop/LogoLoop';
import Radar from '@/components/reactbits/Radar/Radar';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';

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
  const band = proofBand();
  const active = CERTIFICATIONS.filter((c) => c.status === 'active');
  const inProgress = CERTIFICATIONS.filter((c) => c.status === 'in-progress');
  const hasRadarSlot = useWebGLSlot('proofband-radar');

  const complianceChips = [
    { node: <span className="px-3 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs font-mono font-medium text-[#F4EFE6]">IEC · 0824001234</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs font-mono font-medium text-[#F4EFE6]">GST · 24AAACT8924F1ZW</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs font-mono font-medium text-[#F4EFE6]">COO · Certificate of Origin</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs font-mono font-medium text-[#F4EFE6]">Phytosanitary Certification</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs font-mono font-medium text-[#F4EFE6]">MTC · Material Test Certificates</span> },
    { node: <span className="px-3 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs font-mono font-medium text-[#F4EFE6]">FOB · CIF · DAP Incoterms</span> },
  ];

  return (
    <Section surface="deep" tight className="relative overflow-hidden border-t border-[#A88B68]/25 py-12 md:py-16">
      {/* Background Radar WebGL */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" aria-hidden="true">
        {hasRadarSlot ? (
          <Radar color="#A88B68" speed={0.8} ringCount={4} spokeCount={6} />
        ) : null}
      </div>

      <Container className="relative z-10">
        <div className="mb-10 text-left">
          <MaskedHeading
            text="Operational Reality. Proven Trade Lines."
            tag="h2"
            align="left"
            className="text-2xl md:text-3xl font-serif text-[#F4EFE6]"
          />
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {/* Ports Column */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            <p className="eyebrow text-[#A88B68]">Export Ports</p>
            <div className="flex flex-col gap-3">
              {PORTS.map((port) => (
                <SpotlightCard
                  key={port.slug}
                  spotlightColor="rgba(168, 139, 104, 0.25)"
                  className="!p-4 !bg-[#171210]/90 !border-[#A88B68]/30 hover:!border-[#A88B68]/60 transition-all rounded-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-body-md font-semibold text-[#F4EFE6]">{port.name}</span>
                      <span className="text-body-sm text-[#F4EFE6]/70 leading-snug">{port.reason}</span>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <span className="spec-value font-mono font-bold text-sm text-[#A88B68]">
                        <SplitFlapText text={port.locode} flipDuration={0.4} />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Published Catalog Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-6 lg:border-l lg:border-[#A88B68]/20 lg:pl-8">
            <BorderGlow glowColor="40 80 80" borderRadius={16} className="p-6 bg-[#171210]/80 border border-[#A88B68]/20">
              <p className="eyebrow mb-2 text-[#A88B68]">Published Catalog</p>
              <div className="flex items-baseline gap-2">
                <span className="text-display-md leading-none font-serif text-3xl font-bold text-[#F4EFE6]">
                  <Counter value={band.liveProductCount} fontSize={32} />
                </span>
                <span className="text-heading-md font-medium text-[#F4EFE6]/70"> products</span>
              </div>
              <p className="surface-muted mt-2 text-body-sm leading-relaxed text-[#F4EFE6]/70">
                across {band.liveCategoryCount} live categories, each quoted with HS code, MOQ, lead time and Incoterms.
              </p>
            </BorderGlow>

            <ElectricBorder color="#A88B68" chaos={0.3} borderRadius={16} className="p-6 bg-[#171210]/90 border border-[#A88B68]/40">
              <p className="eyebrow mb-2 text-[#A88B68]">Response Window</p>
              <div className="flex items-baseline gap-2">
                <span className="text-display-md leading-none font-serif text-3xl font-bold text-[#F4EFE6]">
                  <Counter value={24} fontSize={32} />
                </span>
                <span className="text-heading-md font-medium text-[#A88B68]"> business hours</span>
              </div>
              <p className="surface-muted mt-2 text-body-sm text-[#F4EFE6]/70">
                {band.hoursIst} · {band.timezoneLabel}
              </p>
            </ElectricBorder>
          </div>

          {/* Compliance Posture Column */}
          <div className="col-span-12 lg:col-span-3 flex flex-col justify-between gap-4 lg:border-l lg:border-[#A88B68]/20 lg:pl-8">
            <div className="p-6 rounded-2xl bg-[#171210]/80 border border-[#A88B68]/20 flex flex-col h-full justify-between">
              <div>
                <p className="eyebrow mb-3 text-[#A88B68]">Compliance Posture</p>
                <p className="text-body-md text-[#F4EFE6]/90 leading-relaxed">
                  {active.map((c) => c.name).join(' and ')} active.{' '}
                  {inProgress.map((c) => c.name).join(', ')} in progress with target dates published.
                </p>
              </div>
              <Link
                href="/compliance"
                className="link-underline text-[#A88B68] hover:text-[#F4EFE6] mt-6 inline-flex items-center gap-1 text-body-sm font-semibold transition-colors"
              >
                Read the certification register →
              </Link>
            </div>
          </div>
        </div>

        {/* Trade Marks LogoLoop */}
        <div className="mt-12 pt-6 border-t border-[#A88B68]/20">
          <LogoLoop logos={complianceChips} speed={40} direction="left" />
        </div>
      </Container>
    </Section>
  );
}
