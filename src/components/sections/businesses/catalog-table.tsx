import { StatusBadge } from '@/components/ui/badge';
import type { CatalogRow } from '@/lib/selectors';

/**
 * The catalogue table and its mobile card twin — extracted so they can be
 * SERVER-rendered.
 *
 * /businesses/product-exports needs them inside a client component (filters,
 * Flip), but an industry page needs the same rows with no JavaScript at all.
 * One implementation, two hosts: the table on an industry page is static HTML,
 * which is both faster and crawlable, and it cannot drift from the filtered
 * version because it is literally the same component.
 */

const COLUMNS = ['Product', 'HS code', 'Grade', 'MOQ', 'Lead time', 'Incoterms', 'Loading port'];

export function CatalogTable({ rows }: { rows: CatalogRow[] }) {
  return (
    <div className="surface-hairline mt-xl hidden border-y md:block">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Trivoxa Group product catalogue: HS code, grade, minimum order quantity, lead time,
          Incoterms and loading port for each product.
        </caption>
        <thead>
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
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.slug}
              data-row
              className="surface-hairline group border-b transition-colors duration-fast ease-house last:border-b-0 hover:bg-espresso/[0.03]"
            >
              <th scope="row" className="px-md py-lg font-normal">
                <span className="surface-fg text-body-md block font-medium">{row.name}</span>
                <span className="surface-faint text-body-sm block">{row.categoryName}</span>
              </th>
              <SpecCell value={row.hsCode} />
              <SpecCell value={row.grade} />
              <SpecCell value={row.moq} />
              <SpecCell value={row.leadTime} />
              <SpecCell value={row.incoterms.join(' · ') || null} />
              <SpecCell value={row.portLocode} hint={row.portName} />
              <td className="px-md py-lg">
                <span className="flex items-center justify-end gap-md">
                  <StatusBadge status={row.status} detail={row.certificationNote ?? undefined} />
                  <a
                    href={`/rfq?product=${row.slug}&category=${row.categorySlug}`}
                    className="link-underline text-bronze-ink text-body-sm font-medium opacity-0 transition-opacity duration-fast ease-house group-hover:opacity-100 group-focus-within:opacity-100"
                  >
                    Quote
                  </a>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecCell({ value, hint }: { value: string | null; hint?: string | null }) {
  return (
    <td className="px-md py-lg align-top">
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

/** The same rows, as cards, below the table breakpoint. Same data, no loss. */
export function CatalogCards({ rows }: { rows: CatalogRow[] }) {
  return (
    <ul className="mt-xl flex flex-col gap-md md:hidden">
      {rows.map((row) => (
        <li
          key={row.slug}
          data-row
          className="surface-raised surface-hairline flex flex-col gap-md border p-lg"
        >
          <div className="flex items-start justify-between gap-md">
            <div className="flex flex-col">
              <span className="surface-fg text-body-lg font-medium">{row.name}</span>
              <span className="surface-faint text-body-sm">{row.categoryName}</span>
            </div>
            <StatusBadge status={row.status} detail={row.certificationNote ?? undefined} />
          </div>

          <dl className="grid grid-cols-2 gap-sm">
            {[
              { label: 'HS code', value: row.hsCode },
              { label: 'Grade', value: row.grade },
              { label: 'MOQ', value: row.moq },
              { label: 'Lead time', value: row.leadTime },
              { label: 'Incoterms', value: row.incoterms.join(' · ') || null },
              {
                label: 'Loading port',
                value: row.portLocode ? `${row.portName} ${row.portLocode}` : null,
              },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <dt className="surface-faint spec-value text-body-sm uppercase" data-spec>
                  {item.label}
                </dt>
                <dd className="surface-fg spec-value text-body-sm" data-spec>
                  {item.value ?? <span className="surface-faint italic">On request</span>}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={`/rfq?product=${row.slug}&category=${row.categorySlug}`}
            className="link-underline text-bronze-ink text-body-sm font-medium"
          >
            Request a quotation →
          </a>
        </li>
      ))}
    </ul>
  );
}

