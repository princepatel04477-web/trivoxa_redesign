import Link from 'next/link';
import { BrandMark } from '@/components/ui/brand-lockup';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow } from '@/components/ui/typography';
import { INDUSTRIES } from '@/content/taxonomy';

export const metadata = {
  title: 'Page not found',
  robots: { index: false },
};

/**
 * 404 — on brand, and useful. The audit's complaint about dead ends applies
 * here too: a lost visitor is a lost RFQ, so the page offers the four places
 * a lost buyer actually wants.
 */
export default function NotFound() {
  return (
    <Section surface="deep" className="flex min-h-screen items-center">
      <Container>
        <div className="flex max-w-[42rem] flex-col gap-lg">
          <BrandMark size={56} className="text-accent" />
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="text-display-lg">This lane does not exist.</h1>
          <p className="surface-muted text-body-lg">
            The page you asked for is not on our routing map. These four are, and one of them is
            almost certainly where you were headed.
          </p>

          <ul className="mt-lg flex flex-col gap-xs">
            {[
              { href: '/businesses/product-exports', label: 'The product catalog', note: 'every published line, with HS codes and MOQs' },
              { href: '/industries', label: 'Industries', note: `all ${INDUSTRIES.length} of them` },
              { href: '/rfq', label: 'Request a Quote', note: 'answered within 24 business hours (IST)' },
              { href: '/contact', label: 'Contact', note: 'a human, not a form queue' },
            ].map((item) => (
              <li key={item.href} className="border-ivory/12 border-b py-md">
                <Link href={item.href} className="group flex items-baseline justify-between gap-lg">
                  <span className="text-heading-md group-hover:text-accent transition-colors duration-fast">
                    {item.label}
                  </span>
                  <span className="surface-faint text-body-sm">{item.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
