'use client';

import { BRAND } from '@/lib/tokens/colors';
import React from 'react';
import Link from 'next/link';
import { Container, HairlineRow } from '@/components/ui/layout';
import { SectionHeading, Eyebrow } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import { ButtonLink } from '@/components/ui/button';
import Folder from '@/components/reactbits/Folder/Folder';
import AnimatedList from '@/components/reactbits/AnimatedList/AnimatedList';
import LineSidebar from '@/components/reactbits/LineSidebar/LineSidebar';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import { COMPANY, SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { CERTIFICATIONS, CONTACT } from '@/content/taxonomy';

export function ComplianceClient() {
  const active = CERTIFICATIONS.filter((cert) => cert.status === 'active');
  const inProgress = CERTIFICATIONS.filter((cert) => cert.status === 'in-progress');

  const inProgressItems = inProgress.map((cert) => (
    <div key={cert.slug} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-espresso border border-bronze/30 text-ivory">
      <div className="flex items-start gap-3">
        <span className="relative flex h-3 w-3 mt-1.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bronze opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-bronze" />
        </span>
        <div>
          <h4 className="font-serif text-lg font-bold text-ivory">{cert.name}</h4>
          <p className="text-xs text-ivory/70 mt-0.5">{cert.fullName}</p>
          <p className="font-mono text-[11px] text-bronze mt-1">{cert.issuingAuthority}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="inline-block rounded-md border border-bronze/40 bg-espresso-deep px-2.5 py-1 font-mono text-xs text-bronze font-semibold">
          {cert.targetQuarter ?? 'Targeted'}
        </span>
        {cert.targetNote && (
          <p className="text-[10px] text-ivory/50 mt-1 max-w-[18ch] truncate">
            {cert.targetNote}
          </p>
        )}
      </div>
    </div>
  ));

  // Folder document packets
  const corporateDocs = [
    <div key="iec" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">IEC Registration</strong>
      <span>Directorate General of Foreign Trade (DGFT)</span>
      <span className="block mt-1 font-semibold text-bronze">Active · Verified on customs gate</span>
    </div>,
    <div key="gst" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">GST Registration</strong>
      <span>Government of Gujarat, Commercial Taxes</span>
      <span className="block mt-1 font-semibold text-bronze">Active · Verified entity</span>
    </div>,
    <div key="pan" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">Tax Identity (PAN)</strong>
      <span>Income Tax Department of India</span>
      <span className="block mt-1 font-semibold text-bronze">Trivoxa Corporate Entity</span>
    </div>,
  ];

  const exportBoardDocs = [
    <div key="fieo" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">FIEO Registration</strong>
      <span>Federation of Indian Export Organisations</span>
      <span className="block mt-1 text-amber-700">In Progress · Target 2026-Q3</span>
    </div>,
    <div key="apeda" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">APEDA Certificate</strong>
      <span>Agricultural & Processed Food Products</span>
      <span className="block mt-1 text-amber-700">In Progress · Target 2026-Q4</span>
    </div>,
    <div key="spices" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">Spices Board India</strong>
      <span>Ministry of Commerce and Industry</span>
      <span className="block mt-1 text-amber-700">In Progress · Target 2026-Q4</span>
    </div>,
  ];

  const qualityDocs = [
    <div key="iso" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">ISO 9001:2015 QMS</strong>
      <span>Quality Management Systems Audit</span>
      <span className="block mt-1 text-amber-700">Audit Scheduled 2027-Q1</span>
    </div>,
    <div key="ce" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">CE Declaration Dossier</strong>
      <span>European Conformity Technical File</span>
      <span className="block mt-1 text-amber-700">Target 2027-Q2</span>
    </div>,
    <div key="gmp" className="p-3 text-xs text-espresso-deep font-mono">
      <strong className="block text-sm font-bold text-stone-900">WHO-GMP Facility Status</strong>
      <span>Pharma Sourcing Protocol</span>
      <span className="block mt-1 text-amber-700">Target 2027-Q3</span>
    </div>,
  ];

  const tocItems = [
    'Entity Details',
    'Active Credentials',
    'In Progress Register',
    'Document Vault Folders',
    'Audit Protocols',
  ];

  const handleTocClick = (index: number) => {
    const ids = ['entity', 'active', 'in-progress', 'document-vault', 'audits'];
    const targetId = ids[index];
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
      {/* 1. Hero */}
      <section className="bg-espresso-deep py-20 text-ivory border-b border-bronze/20">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 font-mono text-xs text-bronze">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-ivory/80">Compliance</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-bronze mb-3">
            Public Regulatory Register
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ivory max-w-[56rem]">
            <SplitText
              text="What we hold, what we are applying for, and when."
              tag="span"
              className="inline-block"
              delay={25}
            />
          </h1>

          <p className="mt-6 max-w-[48rem] text-base sm:text-lg text-ivory/80 leading-relaxed font-sans">
            Every credential on this page has an issuing authority, and every one we do not yet hold has a published target. Where a destination market requires something we cannot document, we say so at quotation stage — not at customs.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-bronze/20 pt-6">
            <div>
              <p className="font-mono text-xs text-bronze">Active Credentials</p>
              <p className="font-serif text-2xl font-bold text-ivory">{active.length}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Applications in Progress</p>
              <p className="font-serif text-2xl font-bold text-ivory">{inProgress.length}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Next Target Date</p>
              <p className="font-serif text-2xl font-bold text-ivory">2026-Q3</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Entity Registration</p>
              <p className="font-serif text-2xl font-bold text-ivory">Surat, Gujarat</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Layout with Sticky LineSidebar TOC */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-12 gap-12">
          {/* Sticky LineSidebar Table of Contents (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-4">
                Contents
              </span>
              <LineSidebar
                items={tocItems}
                accentColor={BRAND.bronze.hex}
                textColor={BRAND.espresso.hex}
                markerColor={BRAND.bronze.hex}
                onItemClick={handleTocClick}
                fontSize={0.75}
                proximityRadius={80}
              />
            </div>
          </aside>

          {/* Main Sections Column */}
          <div className="col-span-12 lg:col-span-9 flex flex-col gap-20">
            {/* Section A: Entity Block */}
            <section id="entity" className="scroll-mt-28">
              <HairlineRow label="The entity you contract with" />
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <dl className="divide-y divide-stone-200 border-t border-b border-stone-200 font-mono text-xs">
                  {[
                    { label: 'Legal name', value: COMPANY.legalName },
                    { label: 'Registered office', value: CONTACT.registeredOffice },
                    { label: 'Headquarters', value: COMPANY.headquarters },
                    {
                      label: 'Registered entity number',
                      value:
                        CONTACT.registeredEntityNumber ??
                        'Available in buyer onboarding pack on quotation sign-off.',
                    },
                    { label: 'Group established', value: `${COMPANY.founded.year}` },
                  ].map((item) => (
                    <div key={item.label} className="py-3 flex flex-col gap-1">
                      <dt className="text-bronze uppercase font-semibold">{item.label}</dt>
                      <dd className="text-stone-900 font-sans text-sm">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-col justify-between p-6 rounded-2xl bg-stone-50 border border-stone-200">
                  <div>
                    <Eyebrow tick={false} className="text-bronze">
                      Parent Company Heritage
                    </Eyebrow>
                    <p className="mt-3 text-sm text-stone-700 leading-relaxed font-sans">
                      {SHIVESHWAR_CANONICAL_SENTENCE}
                    </p>
                    <p className="mt-4 text-xs text-stone-500 font-sans">
                      {COMPANY.founded.note} One relationship, verified across all group records.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-stone-200">
                    <ArrowLink href="/group">View group structure →</ArrowLink>
                  </div>
                </div>
              </div>
            </section>

            {/* Section B: Active Credentials */}
            <section id="active" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Active Credentials"
                title={`${active.length} credentials we hold and operate under today.`}
                lede="Registration numbers are verified on customs databases prior to bill of lading issuance."
              />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {active.map((cert) => (
                  <div
                    key={cert.slug}
                    className="p-6 rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
                        <span className="font-mono text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-emerald-600" />
                          Active & Verified
                        </span>
                        <span className="font-mono text-xs text-stone-500">
                          {cert.registrationNumber ?? 'Available on request'}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-stone-900">{cert.name}</h3>
                      <p className="text-sm text-stone-600 mt-1">{cert.fullName}</p>
                    </div>
                    <p className="mt-6 font-mono text-xs text-bronze">
                      Authority: {cert.issuingAuthority}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section C: In-Progress Credentials with AnimatedList */}
            <section id="in-progress" className="scroll-mt-28">
              <div className="p-8 rounded-2xl bg-espresso-deep text-ivory border border-bronze/40">
                <SectionHeading
                  eyebrow="In Progress Register"
                  title={`${inProgress.length} applications with published target quarters.`}
                  lede="The schema forbids marking a credential as 'targeted' without an explicit timeline. Pulsing indicators denote active audit filings."
                />

                <div className="mt-8">
                  <AnimatedList
                    items={inProgressItems}
                    className="flex flex-col gap-3"
                  />
                </div>
              </div>
            </section>

            {/* Section D: Document Vault as Folder Components */}
            <section id="document-vault" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Document Vault"
                title="Interactive Document Dossiers (Click folder to open)."
                lede="Click on any dossier folder to preview the inspection certificates, export board filings, and entity documents."
              />

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {/* Folder 1: Corporate Entity */}
                <div className="flex flex-col items-center text-center">
                  <Folder
                    color={BRAND.bronze.hex}
                    size={1.1}
                    items={corporateDocs}
                    className="cursor-pointer"
                  />
                  <h4 className="font-serif text-lg font-bold text-stone-900 mt-4">
                    Entity Dossier
                  </h4>
                  <p className="font-mono text-xs text-stone-500 mt-1">
                    IEC, GST & Incorporation (3 Docs)
                  </p>
                  <span className="font-mono text-[10px] text-bronze mt-2">
                    Click to expand papers
                  </span>
                </div>

                {/* Folder 2: Export Boards */}
                <div className="flex flex-col items-center text-center">
                  <Folder
                    color={BRAND.bronze.hex}
                    size={1.1}
                    items={exportBoardDocs}
                    className="cursor-pointer"
                  />
                  <h4 className="font-serif text-lg font-bold text-stone-900 mt-4">
                    Export Promotion Boards
                  </h4>
                  <p className="font-mono text-xs text-stone-500 mt-1">
                    FIEO, APEDA & Spices Board (3 Docs)
                  </p>
                  <span className="font-mono text-[10px] text-bronze mt-2">
                    Click to expand papers
                  </span>
                </div>

                {/* Folder 3: Quality & CE */}
                <div className="flex flex-col items-center text-center">
                  <Folder
                    color={BRAND.bronzeInk.hex}
                    size={1.1}
                    items={qualityDocs}
                    className="cursor-pointer"
                  />
                  <h4 className="font-serif text-lg font-bold text-stone-900 mt-4">
                    Quality & Standards
                  </h4>
                  <p className="font-mono text-xs text-stone-500 mt-1">
                    ISO 9001, CE & WHO-GMP (3 Docs)
                  </p>
                  <span className="font-mono text-[10px] text-bronze mt-2">
                    Click to expand papers
                  </span>
                </div>
              </div>
            </section>

            {/* Section E: Audits & Protocols */}
            <section id="audits" className="scroll-mt-28 p-8 rounded-2xl border border-stone-200 bg-stone-50">
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Independent Third-Party Audits
              </h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed max-w-[48rem]">
                We accommodate buyer-nominated audits (SGS, Intertek, Bureau Veritas, TÜV) at partner factories across Surat and Gujarat clusters. Audit dates and technical files must be coordinated at least 14 days prior to container loading.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ButtonLink href="/rfq?path=audit" arrow>
                  Request factory audit coordination
                </ButtonLink>
                <ArrowLink href="/businesses#how-it-works">
                  How inspection runs →
                </ArrowLink>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
