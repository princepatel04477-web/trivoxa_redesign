'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { CatalogRow } from '@/lib/selectors';
import { StatusBadge } from '@/components/ui/badge';
import { ArrowUpRight, RotateCcw } from 'lucide-react';

function ProductCard({ row }: { row: CatalogRow }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const imageSrc = `/brand/og/product-${row.slug}.png`;

  return (
    <div
      data-row
      className="group relative h-[380px] w-full [perspective:1200px]"
    >
      <div
        className={`relative h-full w-full rounded-[16px] transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* FRONT FACE: Product Spotlight */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-[16px] border border-stone-800 bg-espresso-deep shadow-xl [backface-visibility:hidden]">
          {/* Product Image */}
          <div className="relative h-[210px] w-full overflow-hidden bg-espresso">
            <Image
              src={imageSrc}
              alt={row.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep via-espresso-deep/30 to-transparent" />
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <span className="rounded-full bg-espresso-deep/85 backdrop-blur-sm border border-bronze/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bronze">
                {row.categoryName}
              </span>
              <StatusBadge status={row.status} />
            </div>
          </div>

          {/* Product Meta & Action Bar */}
          <div className="flex h-[170px] flex-col justify-between p-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-ivory leading-snug">
                {row.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-bronze/80">
                HS: <span className="text-ivory font-medium">{row.hsCode}</span> · MOQ:{' '}
                <span className="text-ivory font-medium">{row.moq}</span>
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-stone-800/80 pt-3">
              <Link
                href={`/products/${row.slug}`}
                className="inline-flex items-center gap-1 font-mono text-xs text-ivory/80 hover:text-bronze transition-colors group/link"
              >
                <span>Dossier</span>
                <ArrowUpRight className="size-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                aria-label={`View full technical specifications for ${row.name}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-bronze/40 bg-bronze/10 px-3 py-1 font-mono text-[11px] font-medium text-bronze hover:bg-bronze hover:text-espresso-deep transition-all duration-200 cursor-pointer"
              >
                <span>Full Specs</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* BACK FACE: Institutional Specification Sheet */}
        <div className="absolute inset-0 h-full w-full overflow-hidden rounded-[16px] border border-bronze/60 bg-espresso-deep p-5 text-ivory flex flex-col justify-between shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div>
            <div className="flex items-center justify-between border-b border-bronze/25 pb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-bronze">
                Specification Sheet
              </span>
              <span className="font-mono text-xs font-semibold text-bronze">
                HS {row.hsCode}
              </span>
            </div>

            <h4 className="mt-2.5 font-serif text-lg font-bold text-ivory">
              {row.name}
            </h4>

            <dl className="mt-3.5 grid grid-cols-2 gap-x-2 gap-y-2 font-mono text-[11px]">
              <div>
                <dt className="text-bronze/80">Grade</dt>
                <dd className="text-ivory font-medium truncate" title={row.grade || undefined}>
                  {row.grade}
                </dd>
              </div>
              <div>
                <dt className="text-bronze/80">MOQ</dt>
                <dd className="text-ivory font-medium">{row.moq}</dd>
              </div>
              <div>
                <dt className="text-bronze/80">Lead Time</dt>
                <dd className="text-ivory font-medium">{row.leadTime}</dd>
              </div>
              <div>
                <dt className="text-bronze/80">Loading Port</dt>
                <dd className="text-ivory font-medium truncate">
                  {row.portName || row.portLocode || 'Mundra / Nhava Sheva'}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-bronze/80">Incoterms</dt>
                <dd className="text-ivory font-medium">
                  {row.incoterms.join(' · ')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="pt-3 border-t border-bronze/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              aria-label="Flip back to product view"
              className="inline-flex items-center gap-1 font-mono text-xs text-stone-400 hover:text-ivory transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href={`/products/${row.slug}`}
                className="font-mono text-xs text-ivory/80 hover:text-bronze underline transition-colors"
              >
                Detail
              </Link>
              <Link
                href={`/rfq?product=${row.slug}`}
                className="inline-flex items-center gap-1 rounded bg-bronze px-3 py-1 font-mono text-xs font-semibold text-espresso-deep hover:bg-ivory hover:text-espresso transition-colors shadow-sm"
              >
                Quote →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPixelGrid({ rows }: { rows: CatalogRow[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <ProductCard key={row.slug} row={row} />
      ))}
    </div>
  );
}

