import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd, industryCollectionSchema } from '@/components/seo/json-ld';
import { buildRouteMetadata } from '@/lib/seo/metadata';
import { INDUSTRIES } from '@/content/taxonomy';
import { industryPageData } from '@/lib/selectors';
import { IndustryDetailClient } from '@/components/sections/industry-detail-client';

export function generateStaticParams() {
  return INDUSTRIES.map((industry) => ({ slug: industry.slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const data = industryPageData(slug);
  if (!data) return {};

  const { industry, rows } = data;
  return {
    ...buildRouteMetadata({
      title: `${industry.name} — Export Sourcing from Surat`,
      description: `${industry.shortDescription} ${rows.length} catalogue rows with HS codes, MOQs, lead times and Incoterms.`,
      path: `/industries/${industry.slug}`,
    }),
    alternates: { canonical: `https://trivoxagroup.com/industries/${industry.slug}` },
  };
}

const CATEGORY_COMMERCIAL_CONTEXT: Record<
  string,
  { typicalEndUse: string; orderShape: string; buyerFirstQuestion: string }
> = {
  'textile-apparel': {
    typicalEndUse: 'Commercial garment manufacturing, home furnishing programmes, uniform contracts, and institutional linen supply.',
    orderShape: 'Full container loads (20ft / 40ft FCL) mixed across yarn counts and fabric finishes, with recurring seasonal production schedules.',
    buyerFirstQuestion: 'GSM tolerances, shade consistency across dye lots, and lab dip approval turnaround.',
  },
  'healthcare-pharmaceuticals': {
    typicalEndUse: 'Hospital procurement tenders, retail pharmacy chains, contract packaging, and institutional health programmes.',
    orderShape: 'Palletised sea freight or temperature-monitored air consignments aligned to dossier filing schedules, with full batch coding.',
    buyerFirstQuestion: 'Certificate of Analysis (CoA), stability study summary, and dossier registration status.',
  },
  'building-materials': {
    typicalEndUse: 'Commercial real estate developments, public infrastructure, tile retail distribution, and architectural fit-out programmes.',
    orderShape: 'Heavy 20ft container loads with break-bulk crating and ISPM 15 heat-treated pallets.',
    buyerFirstQuestion: 'Water absorption test reports, breaking strength certification, and shade/calibre sorting protocols per container.',
  },
  'agriculture-food': {
    typicalEndUse: 'Food processing facilities, spice re-packing and blending plants, supermarket private-label lines, and oleochemical extraction.',
    orderShape: '20ft/40ft FCL with moisture-barrier liner bags and seasonal forward contracts against harvest cycles.',
    buyerFirstQuestion: 'Moisture content, pesticide residue limits (EU/FDA MRL compliance), and aflatoxin analysis per lot.',
  },
  'engineering-industrial': {
    typicalEndUse: 'OEM manufacturing assembly, municipal fluid handling, plant maintenance (MRO), and industrial infrastructure construction.',
    orderShape: 'Scheduled batch deliveries crate-packed with rust-preventative coatings and dimensional inspection reports.',
    buyerFirstQuestion: 'Material test certificates (EN 10204 3.1), hydro-test pressure ratings, and dimensional drawing sign-offs.',
  },
  'furniture-interiors': {
    typicalEndUse: 'Hospitality fit-outs (hotels and resorts), commercial workplace refurbishments, and multi-unit residential developments.',
    orderShape: 'Project-based contract runs, knocked-down (KD) flat-packed cartons with assembly hardware sets.',
    buyerFirstQuestion: 'Board formaldehyde emission class (E0/E1), Martindale rub-test ratings on upholstery, and mockup sample lead times.',
  },
  'jewellery-precious-products': {
    typicalEndUse: 'Retail jewellery store networks, luxury brand manufacturing partnerships, and institutional bullion trade.',
    orderShape: 'High-security insured air freight consignments, tamper-evident sealed casing with serialized assay certificates.',
    buyerFirstQuestion: 'BIS hallmarking verification, purity assay certificates, and customs clearance protocols for destination ports.',
  },
};

/**
 * P10 — /industries/[slug], one template for all nine.
 *
 * Rebuilt with React Bits Prompt 10:
 * - ScrollExpand hero with MaskedHeading and BlurText
 * - Categories as Masonry (animateFrom bottom, blurToFocus true)
 * - Specs we quote against as AnimatedList
 * - Ports used + Incoterms as SplitFlapText chips
 * - Sticky CTA with ElectricBorder -> /rfq?industry=<slug>
 * - Related industries as CardSwap (delay 5000, pauseOnHover)
 */
export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const data = industryPageData(slug);
  if (!data) notFound();

  const { industry, categories, rows, regions, related } = data;

  return (
    <>
      <JsonLd data={industryCollectionSchema(industry, rows)} />
      <IndustryDetailClient
        industry={industry}
        categories={categories}
        rows={rows}
        regions={regions}
        related={related}
        commercialContextRecord={CATEGORY_COMMERCIAL_CONTEXT}
      />
    </>
  );
}
