'use client';

import React from 'react';
import Link from 'next/link';
import PixelTransition from '@/components/reactbits/PixelTransition/PixelTransition';
import type { CatalogRow } from '@/lib/selectors';
import { StatusBadge } from '@/components/ui/badge';

export function ProductPixelGrid({ rows }: { rows: CatalogRow[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => {
        const imageSrc = `/brand/og/product-${row.categorySlug}.png`;

        const frontSide = (
          <div className="relative h-full w-full overflow-hidden rounded-[16px] border border-stone-800 bg-[#171210]">
            <img
              src={imageSrc}
              alt={row.name}
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171210] via-[#171210]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#A88B68]">
                  {row.categoryName}
                </span>
                <StatusBadge status={row.status} />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F4EFE6] leading-tight">
                {row.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-[#A88B68]/80">
                HS: {row.hsCode} · MOQ: {row.moq}
              </p>
              <span className="mt-3 inline-block font-mono text-[11px] text-[#A88B68] underline decoration-dotted">
                Hover for full specification →
              </span>
            </div>
          </div>
        );

        const backSide = (
          <div className="relative h-full w-full overflow-hidden rounded-[16px] border border-[#A88B68]/50 bg-[#171210] p-6 text-[#F4EFE6] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#A88B68]/20 pb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#A88B68]">
                  Specification Sheet
                </span>
                <span className="font-mono text-xs font-semibold text-[#A88B68]">
                  {row.hsCode}
                </span>
              </div>
              <h4 className="mt-2 font-serif text-base font-bold text-[#F4EFE6]">
                {row.name}
              </h4>

              <dl className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2.5 font-mono text-[11px]">
                <div>
                  <dt className="text-[#A88B68]">Grade</dt>
                  <dd className="text-[#F4EFE6] font-medium truncate">{row.grade}</dd>
                </div>
                <div>
                  <dt className="text-[#A88B68]">MOQ</dt>
                  <dd className="text-[#F4EFE6] font-medium">{row.moq}</dd>
                </div>
                <div>
                  <dt className="text-[#A88B68]">Lead Time</dt>
                  <dd className="text-[#F4EFE6] font-medium">{row.leadTime}</dd>
                </div>
                <div>
                  <dt className="text-[#A88B68]">Loading Port</dt>
                  <dd className="text-[#F4EFE6] font-medium">{row.portName || row.portLocode || 'Mundra / Nhava Sheva'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[#A88B68]">Incoterms</dt>
                  <dd className="text-[#F4EFE6] font-medium">
                    {row.incoterms.join(' · ')}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 pt-3 border-t border-[#A88B68]/20 flex items-center justify-between">
              <Link
                href={`/products/${row.slug}`}
                className="font-mono text-xs text-[#F4EFE6] hover:text-[#A88B68] underline"
              >
                Detail
              </Link>
              <Link
                href={`/rfq?product=${row.slug}`}
                className="inline-flex items-center gap-1 rounded bg-[#A88B68] px-3 py-1 font-mono text-xs font-semibold text-[#171210] hover:bg-[#C4A47C] transition-colors"
              >
                Quote →
              </Link>
            </div>
          </div>
        );

        return (
          <div key={row.slug} data-row className="h-[340px] w-full">
            <PixelTransition
              firstContent={frontSide}
              secondContent={backSide}
              gridSize={8}
              pixelColor="#A88B68"
              animationStepDuration={0.25}
              className="h-full w-full"
            />
          </div>
        );
      })}
    </div>
  );
}
