import Link from 'next/link';
import { BrandLockup } from '@/components/ui/brand-lockup';
import { Container } from '@/components/ui/layout';
import { CATEGORIES, CONTACT, INDUSTRIES } from '@/content/taxonomy';
import { SHIVESHWAR_FOOTER_LINE } from '@/content/company';
import { footerRegions } from '@/lib/selectors';

/**
 * SiteFooter — the client's spec, plus everything the audit found missing.
 *
 *  · the registered entity number and legal address (absent site-wide — a
 *    German importer and a compliance team both flagged it);
 *  · business hours in IST with the timezone stated;
 *  · the regions line rendered from REGIONS, so it can never drift from
 *    Global Presence again (audit: 6 on the page vs 5 in the footer);
 *  · Compliance and Anti-corruption surfaced here AND from Group/Contact.
 *
 * Where founder data is outstanding (phone, entity number) the footer renders
 * the designed honest substitute — never a blank, never a fabrication.
 */
export function SiteFooter() {
  const regions = footerRegions();

  return (
    <footer data-surface="deep" className="surface-bg surface-fg border-t border-bronze/25">
      <Container className="py-section-tight">
        <div className="grid grid-cols-12 gap-xl">
          {/* brand + contact block */}
          <div className="col-span-12 flex flex-col gap-lg lg:col-span-4">
            <BrandLockup size={34} className="text-ivory" />
            <p className="surface-muted max-w-[42ch] text-body-sm">
              International trade and business group coordinating from Surat, Gujarat, India.
            </p>

            <dl className="mt-md flex flex-col gap-md text-body-sm">
              <div>
                <dt className="eyebrow mb-1">Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT.general}`} className="link-underline hover:text-bronze">
                    {CONTACT.general}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="eyebrow mb-1">Phone</dt>
                <dd className="surface-muted">
                  {CONTACT.phoneNumbers.length > 0 ? (
                    CONTACT.phoneNumbers.map((number) => (
                      <a key={number} href={`tel:${number.replace(/\s/g, '')}`} className="link-underline block hover:text-bronze">
                        {number}
                      </a>
                    ))
                  ) : (
                    <Link href="/contact#callback" className="link-underline hover:text-bronze">
                      Direct line on request — ask for a callback
                    </Link>
                  )}
                </dd>
              </div>

              <div>
                <dt className="eyebrow mb-1">Hours</dt>
                <dd className="surface-muted">
                  {CONTACT.hoursIst} · {CONTACT.timezoneLabel}
                </dd>
              </div>

              <div>
                <dt className="eyebrow mb-1">Registered office</dt>
                <dd className="surface-muted">{CONTACT.registeredOffice}</dd>
              </div>

              <div>
                <dt className="eyebrow mb-1">Registered entity</dt>
                <dd className="surface-muted">
                  {CONTACT.registeredEntityNumber ? (
                    <span data-spec>{CONTACT.registeredEntityNumber}</span>
                  ) : (
                    <Link href="/compliance#entity" className="link-underline hover:text-bronze">
                      Number in the supplier-onboarding pack — see Compliance
                    </Link>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* what we export — rendered from the taxonomy */}
          <nav aria-label="What we export" className="col-span-6 flex flex-col gap-xs lg:col-span-3">
            <p className="eyebrow mb-md">What We Export</p>
            {INDUSTRIES.slice(0, 6).map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="surface-muted hover:text-bronze py-1 text-body-sm transition-colors duration-fast"
              >
                {industry.name}
              </Link>
            ))}
            <Link href="/industries" className="text-bronze mt-md text-body-sm font-semibold">
              All {INDUSTRIES.length} industries →
            </Link>
            <p className="eyebrow mt-lg mb-md">Categories</p>
            {CATEGORIES.filter((category) => category.status === 'live')
              .slice(0, 5)
              .map((category) => (
                <Link
                  key={category.slug}
                  href={`/businesses/product-exports/${category.slug}`}
                  className="surface-muted hover:text-bronze py-1 text-body-sm transition-colors duration-fast"
                >
                  {category.name}
                </Link>
              ))}
          </nav>

          {/* company + resources */}
          <nav aria-label="Company" className="col-span-6 flex flex-col gap-xs lg:col-span-2">
            <p className="eyebrow mb-md">Company</p>
            {[
              { href: '/group', label: 'The Group' },
              { href: '/group#leadership', label: 'Leadership' },
              { href: '/group#foundation', label: 'Shiveshwar Foundation' },
              { href: '/global-presence', label: 'Global Presence' },
              { href: '/insights', label: 'Insights' },
              { href: '/careers', label: 'Careers' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="surface-muted hover:text-bronze py-1 text-body-sm transition-colors duration-fast"
              >
                {item.label}
              </Link>
            ))}

            <p className="eyebrow mt-lg mb-md">Resources</p>
            {[
              { href: '/compliance', label: 'Compliance' },
              { href: '/rfq', label: 'Request a Quote' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="surface-muted hover:text-bronze py-1 text-body-sm transition-colors duration-fast"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* legal + newsletter */}
          <div className="col-span-12 flex flex-col gap-lg lg:col-span-3">
            <nav aria-label="Legal" className="flex flex-col gap-xs">
              <p className="eyebrow mb-md">Legal</p>
              {[
                { href: '/legal/privacy', label: 'Privacy Policy' },
                { href: '/legal/terms', label: 'Terms & Conditions' },
                { href: '/legal/cookies', label: 'Cookie Policy' },
                { href: '/legal/anti-corruption', label: 'Anti-corruption Policy' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="surface-muted hover:text-bronze py-1 text-body-sm transition-colors duration-fast"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="border-bronze/30 mt-md border-t pt-lg">
              <p className="eyebrow mb-md">Newsletter</p>
              <p className="surface-muted text-body-sm">
                Quarterly dispatch on global trade and business insights.
              </p>
              <Link
                href="/insights#subscribe"
                className="text-bronze mt-md inline-block text-body-sm font-semibold"
              >
                Subscribe →
              </Link>
            </div>
          </div>
        </div>

        {/* regions line — one array, two surfaces, no drift */}
        <div className="border-ivory/12 mt-3xl border-t pt-lg">
          <p className="eyebrow mb-md">Regions We Serve</p>
          <ul className="flex flex-wrap gap-x-lg gap-y-xs">
            {regions.map((region) => (
              <li key={region.slug} className="surface-muted text-body-sm">
                {region.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-ivory/12 mt-xl flex flex-col gap-md border-t pt-lg md:flex-row md:items-center md:justify-between">
          <p className="surface-muted text-body-sm">{SHIVESHWAR_FOOTER_LINE}</p>
          <p className="surface-faint text-body-sm">© Trivoxa Group 2026</p>
        </div>
      </Container>
    </footer>
  );
}
