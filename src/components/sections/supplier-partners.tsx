'use client';

import React from 'react';
import { ShieldCheck, Anchor, Award, Factory, Building, Compass } from 'lucide-react';

interface Partner {
  name: string;
  category: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PARTNERS: Partner[] = [
  {
    name: 'Shiveshwar Textiles',
    category: 'Parent Manufacturing Mill',
    detail: 'Sayan, Surat',
    icon: Factory,
  },
  {
    name: 'APEDA',
    category: 'Agri Export Authority',
    detail: 'Ministry of Commerce & Industry',
    icon: Award,
  },
  {
    name: 'FIEO',
    category: 'Export Promotion Council',
    detail: 'Govt. of India Recognized',
    icon: ShieldCheck,
  },
  {
    name: 'Mundra Port',
    category: 'Adani Ports & SEZ',
    detail: 'INMUN · Container & Bulk',
    icon: Anchor,
  },
  {
    name: 'Nhava Sheva (JNPT)',
    category: 'Container Terminal',
    detail: 'INNSA · Mumbai Port Corridor',
    icon: Anchor,
  },
  {
    name: 'Kandla Port',
    category: 'Deendayal Port Authority',
    detail: 'INIXY · Agro & Breakbulk',
    icon: Anchor,
  },
  {
    name: 'ISO 9001:2015',
    category: 'Quality Management',
    detail: 'Certified Production Lines',
    icon: ShieldCheck,
  },
  {
    name: 'FSSAI',
    category: 'Food Safety Authority',
    detail: 'Food & Agro Processing',
    icon: Building,
  },
  {
    name: 'Spices Board India',
    category: 'Commodity Quality Board',
    detail: 'Ministry of Commerce',
    icon: Compass,
  },
];

export function SupplierPartners() {
  return (
    <section
      aria-label="Institutional and Supplier Partners"
      className="relative w-full overflow-hidden border-y border-bronze/25 bg-espresso-deep/95 py-5 sm:py-6 select-none"
    >
      {/* Edge gradient fades for seamless infinite illusion */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-espresso-deep via-espresso-deep/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-espresso-deep via-espresso-deep/80 to-transparent"
        aria-hidden="true"
      />

      <div
        className="marquee-track flex w-max items-center gap-6 sm:gap-10 hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': '35s' } as React.CSSProperties}
      >
        {[...PARTNERS, ...PARTNERS].map((partner, index) => {
          const IconComp = partner.icon;
          return (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-3.5 rounded-xl border border-bronze/20 bg-espresso/60 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-sm transition-colors hover:border-bronze/50 hover:bg-espresso/90"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-bronze/30 bg-bronze/10 text-bronze">
                <IconComp className="size-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-sm sm:text-base font-semibold text-ivory tracking-tight whitespace-nowrap">
                    {partner.name}
                  </span>
                  <span className="hidden sm:inline-block size-1 rounded-full bg-bronze/40" />
                  <span className="hidden sm:inline-block font-mono text-[10px] font-medium text-bronze uppercase tracking-wider whitespace-nowrap">
                    {partner.category}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-stone-400 whitespace-nowrap">
                  {partner.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
