import Link from 'next/link';
import { StatusBadge } from '@/components/ui/badge';
import type { CatalogRow } from '@/lib/selectors';

/**
 * P08 — The single semantic catalogue table that reflows into cards at narrow widths.
 *
 * Product data exists EXACTLY ONCE in the DOM.
 * - Below `md`: the table reflows via CSS grid on `tr` elements into card containers.
 *   The `thead` is visually hidden with `sr-only` so screen readers preserve column
 *   context while mobile users get a thumb-friendly card layout.
 * - At `md` and above: standard semantic 8-column table with full desktop hover states.
 */

const COLUMNS = ['Product', 'HS code', 'Grade', 'MOQ', 'Lead time', 'Incoterms', 'Loading port'];

export function CatalogTable({ rows }: { rows: CatalogRow[] }) {
  return (
    <div className="surface-hairline mt-xl border-y">
      <table className="w-full border-collapse text-left block md:table">
        <caption className="sr-only">
          Trivoxa Group product catalogue: HS code, grade, minimum order quantity, lead time,
          Incoterms and loading port for each product.
        </caption>
        <thead className="sr-only md:not-sr-only md:table-header-group">
          <tr className="surface-hairline border-b">
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="surface-faint spec-value px-md py-md text-body-sm font-normal uppercase"
                data-spec
              >
                {column}
              </th>
            ))}
            <th scope="col" className="sr-only">
              Status and action
            </th>
          </tr>
        </thead>
        <tbody className="flex flex-col gap-md py-md md:py-0 md:table-row-group">
          {rows.map((row) => (
            <tr
              key={row.slug}
              data-row
              className="surface-raised surface-hairline grid grid-cols-2 gap-x-md gap-y-sm border p-lg transition-colors duration-fast ease-house md:table-row md:border-x-0 md:border-t-0 md:border-b md:p-0 md:bg-transparent last:border-b-0 hover:bg-espresso/[0.03]"
            >
              {/* Column 1: Product info */}
              <th
                scope="row"
                className="col-span-2 flex items-start justify-between gap-md border-b surface-hairline pb-sm font-normal md:border-b-0 md:table-cell md:px-md md:py-lg md:pb-lg"
              >
                <div>
                  <Link
                    href={`/products/${row.slug}`}
                    className="surface-fg hover:text-accent text-body-md block font-medium transition-colors duration-fast"
                  >
                    {row.name}
                  </Link>
                  <span className="surface-faint text-body-sm block">{row.categoryName}</span>
                </div>
                {/* Mobile status badge */}
                <div className="md:hidden">
                  <StatusBadge status={row.status} detail={row.certificationNote ?? undefined} />
                </div>
              </th>

              {/* Column 2: HS code */}
              <SpecCell label="HS code" value={row.hsCode} />

              {/* Column 3: Grade */}
              <SpecCell label="Grade" value={row.grade} />

              {/* Column 4: MOQ */}
              <SpecCell label="MOQ" value={row.moq} />

              {/* Column 5: Lead time */}
              <SpecCell label="Lead time" value={row.leadTime} />

              {/* Column 6: Incoterms */}
              <SpecCell label="Incoterms" value={row.incoterms.join(' · ') || null} />

              {/* Column 7: Loading port */}
              <SpecCell
                label="Loading port"
                value={row.portLocode}
                hint={row.portName}
              />

              {/* Column 8: Desktop status badge + Quote link */}
              <td className="col-span-2 flex items-center justify-between border-t surface-hairline pt-sm md:border-t-0 md:table-cell md:px-md md:py-lg md:pt-lg">
                <span className="flex items-center justify-end gap-md w-full md:w-auto">
                  <span className="hidden md:inline-flex">
                    <StatusBadge status={row.status} detail={row.certificationNote ?? undefined} />
                  </span>
                  <Link
                    href={`/rfq?product=${row.slug}&category=${row.categorySlug}`}
                    className="link-underline text-accent text-body-sm font-medium transition-opacity duration-fast ease-house md:opacity-70 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                  >
                    <span className="md:hidden">Request a quotation →</span>
                    <span className="hidden md:inline">Quote</span>
                  </Link>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | null;
  hint?: string | null;
}) {
  return (
    <td className="col-span-1 flex flex-col justify-start align-top md:table-cell md:px-md md:py-lg">
      <span className="surface-faint spec-value text-body-xs uppercase md:hidden" data-spec>
        {label}
      </span>
      {value ? (
        <>
          <span className="surface-fg spec-value block text-body-sm" data-spec>
            {value}
          </span>
          {hint ? <span className="surface-faint text-body-sm block">{hint}</span> : null}
        </>
      ) : (
        <span className="surface-faint text-body-sm italic">Specified on request</span>
      )}
    </td>
  );
}

