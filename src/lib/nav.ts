/**
 * src/lib/nav.ts — the primary navigation, grouped by BUYER INTENT.
 * ---------------------------------------------------------------------------
 * The July 2026 audit's highest-leverage finding: Industries and Contact were
 * absent from the primary nav, and the two parallel hierarchies (Industries
 * vs. product catalog) disagreed with each other. The recommendation, taken
 * here, is a mega-menu organised by what a visitor is trying to DO rather than
 * by the internal org chart — which collapses both hierarchies into one
 * browsing surface.
 *
 * Everything list-shaped is derived from the taxonomy. Adding a 9th→10th
 * industry puts it in the mega-menu with no edit here.
 */
import { CATEGORIES, INDUSTRIES } from '@/content/taxonomy';
import { SERVICES } from '@/content/process';
import { CONTACT } from '@/content/taxonomy';

export type NavLeaf = {
  href: string;
  label: string;
  description?: string;
  status?: 'live' | 'onboarding';
  external?: boolean;
};

export type NavColumn = {
  heading: string;
  items: NavLeaf[];
};

export type NavGroup = {
  id: string;
  label: string;
  columns: NavColumn[];
  /** Right-hand featured panel (WHAT WE EXPORT only). */
  featured?: {
    eyebrow: string;
    title: string;
    body: string;
    href: string;
    cta: string;
  };
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'export',
    label: 'What We Export',
    columns: [
      {
        heading: 'Industries',
        items: INDUSTRIES.map((industry) => ({
          href: `/industries/${industry.slug}`,
          label: industry.name,
          status: industry.status,
        })),
      },
      {
        heading: 'Product Categories',
        // Query params, not path segments: the catalogue is one route whose
        // filter state lives in the URL and is read server-side (P12). A
        // path-per-category would be 7 more routes rendering the same table.
        items: CATEGORIES.map((category) => ({
          href: `/businesses/product-exports?category=${category.slug}`,
          label: category.name,
          status: category.status,
        })),
      },
      {
        heading: 'Service Lines',
        // Derived from the same SERVICES data the page renders, so the mega
        // panel cannot list a line the page does not have (or miss one it does).
        items: [
          ...SERVICES.map((service) => ({
            href: '/businesses/service-exports#services',
            label: service.name,
          })),
          {
            href: 'https://digital.trivoxagroup.com',
            label: 'digital.trivoxagroup.com',
            external: true,
          },
        ],
      },
    ],
    featured: {
      eyebrow: 'Request a Quote',
      title: 'Quoted against HS codes and MOQs.',
      body: 'Tell us what you are sourcing. A human replies within 24 business hours (IST).',
      href: '/rfq',
      cta: 'Start an RFQ',
    },
  },
  {
    id: 'who',
    label: 'Who We Are',
    columns: [
      {
        heading: 'The Group',
        items: [
          { href: '/group', label: 'Our Story' },
          { href: '/group#leadership', label: 'Leadership' },
          { href: '/group#foundation', label: 'Shiveshwar Foundation' },
          { href: '/group#vision', label: 'Vision' },
          { href: '/group#commitments', label: 'Commitments' },
        ],
      },
      {
        heading: 'Trust',
        items: [
          { href: '/compliance', label: 'Compliance & Certifications' },
          { href: '/legal/anti-corruption', label: 'Anti-corruption Policy' },
        ],
      },
    ],
  },
  {
    id: 'network',
    label: 'Global Network',
    columns: [
      {
        heading: 'Network',
        items: [
          { href: '/global-presence', label: 'Global Presence' },
          { href: '/global-presence#ports', label: 'Export Ports' },
        ],
      },
      {
        heading: 'Thinking',
        items: [{ href: '/insights', label: 'Insights' }],
      },
    ],
  },
  {
    id: 'work',
    label: 'Work With Us',
    columns: [
      {
        heading: 'Commercial',
        items: [
          { href: '/rfq', label: 'Request a Quote' },
          { href: '/rfq?path=sample', label: 'Request a Sample' },
          { href: '/rfq?path=audit', label: 'Request a Factory Audit' },
        ],
      },
      {
        heading: 'People & Partners',
        items: [
          { href: '/contact', label: 'Contact' },
          { href: '/careers', label: 'Careers' },
          { href: '/contact#routing', label: 'Partnerships', description: CONTACT.partnerships },
        ],
      },
    ],
  },
];

/** Flat list of every internal href in the nav — used by the orphan check. */
export function navHrefs(): string[] {
  return NAV_GROUPS.flatMap((group) =>
    group.columns.flatMap((column) => column.items.map((item) => item.href)),
  ).filter((href) => href.startsWith('/'));
}
