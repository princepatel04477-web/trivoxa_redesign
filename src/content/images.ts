import fs from 'node:fs';
import path from 'node:path';

/**
 * src/content/images.ts — The single source of truth for all site photography.
 * ---------------------------------------------------------------------------
 * Enforces mandatory alt text, explicit aspect ratios, and shoot requirements
 * at the TypeScript level so no photograph is added without accessibility data.
 *
 * Image Budget:
 *  - Max file size: 200 KB (after WebP / AVIF compression)
 *  - Formats: .webp, .avif, .jpg
 *  - High-intent hero slots are preloaded; below-fold slots are lazy.
 */

export type AspectRatio = '16/9' | '4/3' | '4/5' | '1/1' | '21/9';

export interface ImageManifestEntry {
  id: string;
  expectedPath: string;
  alt: string; // Strictly mandatory
  aspectRatio: AspectRatio;
  aspectRatioClass: string;
  section: string;
  subject: string;
  caption?: string;
  credit?: string;
  specHint?: string;
  priority?: boolean;
}

export const IMAGE_MANIFEST: Record<string, ImageManifestEntry> = {
  // ── 1. Manufacturing Foundation (/group) ──────────────────────────────────
  'foundation-exterior': {
    id: 'foundation-exterior',
    expectedPath: '/images/foundation/exterior.jpg',
    alt: 'Exterior facade of the Shiveshwar Textiles manufacturing facility in Surat, Gujarat.',
    aspectRatio: '4/5',
    aspectRatioClass: 'aspect-4/5',
    section: 'Foundation',
    subject: 'Surat Manufacturing Facility Exterior',
    caption: 'The Shiveshwar Textiles mill in Surat, Gujarat — woven textile production foundation.',
    credit: 'Shiveshwar Textiles',
    specHint: '1200×1500px, exterior architectural daylight, factory signage visible',
  },
  'foundation-weaving': {
    id: 'foundation-weaving',
    expectedPath: '/images/foundation/weaving.jpg',
    alt: 'Shuttleless rapier looms operating on the active weaving floor at Shiveshwar Textiles.',
    aspectRatio: '4/5',
    aspectRatioClass: 'aspect-4/5',
    section: 'Foundation',
    subject: 'Production Weaving Floor',
    caption: 'Active shuttleless weaving shed producing export-spec cotton and denim fabrics.',
    credit: 'Shiveshwar Textiles',
    specHint: '1200×1500px, medium interior shot, loom motion, authentic natural factory lighting',
  },
  'foundation-inspection': {
    id: 'foundation-inspection',
    expectedPath: '/images/foundation/inspection.jpg',
    alt: 'Quality control inspectors examining finished woven fabric against backlight tables.',
    aspectRatio: '4/5',
    aspectRatioClass: 'aspect-4/5',
    section: 'Foundation',
    subject: 'Fabric Inspection & 4-Point Grading',
    caption: 'Backlit fabric inspection table executing ASTM D5430 4-point grading before roll packing.',
    credit: 'Shiveshwar Textiles',
    specHint: '1200×1500px, close/medium shot, inspection table illumination, inspector at work',
  },

  // ── 2. Industries (9 sector heroes) ──────────────────────────────────────
  'industry-textile-apparel': {
    id: 'industry-textile-apparel',
    expectedPath: '/images/industries/textile-apparel.jpg',
    alt: 'Ring-spun cotton yarn packages and rolls of woven indigo denim fabric ready for export palletizing.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Textile & Apparel',
    subject: 'Woven Textiles & Cotton Lines',
    caption: 'Combed cotton yarn and denim fabric programmes packaged for sea freight.',
    specHint: '1920×1080px, clean product arrangement, texture detail visible',
  },
  'industry-healthcare-pharmaceuticals': {
    id: 'industry-healthcare-pharmaceuticals',
    expectedPath: '/images/industries/healthcare-pharmaceuticals.jpg',
    alt: 'Cleanroom packaging line running pharmaceutical solid dosage forms in aluminum blister packaging.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Healthcare & Pharmaceuticals',
    subject: 'WHO-GMP Compliant Pharmaceutical Formulation Facility',
    caption: 'Finished formulation blister packaging under ISO Class 7 cleanroom conditions.',
    specHint: '1920×1080px, cleanroom gowning, pharmaceutical equipment, high key lighting',
  },
  'industry-building-materials': {
    id: 'industry-building-materials',
    expectedPath: '/images/industries/building-materials.jpg',
    alt: 'Large format porcelain vitrified tiles and natural stone slabs stacked in export crating.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Building Materials',
    subject: 'Export Tile Crates & Natural Stone Slabs',
    caption: 'Precision-squared porcelain slabs packaged in fumigated wooden A-frames.',
    specHint: '1920×1080px, architectural surfaces, polished edges, ISPM 15 crates',
  },
  'industry-agriculture-food': {
    id: 'industry-agriculture-food',
    expectedPath: '/images/industries/agriculture-food.jpg',
    alt: 'Processed export-grade agricultural commodities including cumin seeds, sesame, and groundnuts in moisture-barrier bags.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Agriculture & Food',
    subject: 'Export-Grade Spices & Agro Commodities',
    caption: 'Sorted whole spices and oilseeds sealed in multi-wall export sacks with lot coding.',
    specHint: '1920×1080px, natural agricultural tones, clean sorting tables',
  },
  'industry-engineering-industrial': {
    id: 'industry-engineering-industrial',
    expectedPath: '/images/industries/engineering-industrial.jpg',
    alt: 'Precision machined stainless steel pipe valves, industrial pumps, and high-tensile fasteners.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Engineering & Industrial',
    subject: 'Machined Industrial Hardware & Fluid Handling',
    caption: 'Pressure-tested stainless valves and precision fasteners with mill test certificates.',
    specHint: '1920×1080px, industrial CNC components, metallic reflections, clean inspection staging',
  },
  'industry-chemicals-allied': {
    id: 'industry-chemicals-allied',
    expectedPath: '/images/industries/chemicals-allied.jpg',
    alt: 'UN-certified industrial chemical packaging including HDPE drums and composite IBC totes.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Chemicals & Allied',
    subject: 'Specialty Dyestuffs & Industrial Chemical Sourcing',
    caption: 'UN-approved packaging for industrial chemical exports with destination SDS labelling.',
    specHint: '1920×1080px, industrial warehouse, compliant safety markings, clean drumming line',
  },
  'industry-packaging-printing': {
    id: 'industry-packaging-printing',
    expectedPath: '/images/industries/packaging-printing.jpg',
    alt: 'Automated flexographic printing and corrugated box converting production machinery.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Packaging & Printing',
    subject: 'High-Speed Corrugated & Flexible Converting',
    caption: 'Multi-color flexo printed corrugated packaging folded and bundled for bulk dispatch.',
    specHint: '1920×1080px, converting line, crisp paperboard registration, palletized cartons',
  },
  'industry-furniture-interiors': {
    id: 'industry-furniture-interiors',
    expectedPath: '/images/industries/furniture-interiors.jpg',
    alt: 'Architectural hardwood veneer panels and contract furniture components ready for container loading.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Furniture & Interiors',
    subject: 'Commercial Fit-Out & Contract Furniture Components',
    caption: 'Precision CNC-cut interior components packed with edge-protection corner guards.',
    specHint: '1920×1080px, natural wood grains, clean workshop assembly, architectural finish',
  },
  'industry-jewellery-precious-products': {
    id: 'industry-jewellery-precious-products',
    expectedPath: '/images/industries/jewellery-precious-products.jpg',
    alt: 'Master gemologist evaluating polished lab-grown diamond parcels with stereomicroscope and precision carat balance.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Jewellery & Precious Products',
    subject: 'Gemological Grading & Precious Metal Assay',
    caption: 'Precision parcel sorting and spectrophotometer verification in Surat cutting centre.',
    specHint: '1920×1080px, dark luxury background, directional gem lighting, optical tweezers',
  },

  // ── 3. Divisions (2 headers) ─────────────────────────────────────────────
  'division-product-exports': {
    id: 'division-product-exports',
    expectedPath: '/images/divisions/product-exports.jpg',
    alt: 'Container freight station at Mundra Port with Trivoxa export containers loading onto deep-sea vessels.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Product Exports',
    subject: 'Mundra Port Maritime Container Dispatch',
    caption: 'Direct sea routes linking Gujarat manufacturing corridors to global destination ports.',
    specHint: '1920×1080px, container cranes, maritime terminal, golden hour port lighting',
  },
  'division-service-exports': {
    id: 'division-service-exports',
    expectedPath: '/images/divisions/service-exports.jpg',
    alt: 'Software engineers and trade operations team monitoring international supply chains on dual-screen workstations.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Service Exports',
    subject: 'Digital Services & Global Trade Operations Desk',
    caption: 'Technology development and operational services delivered through modern remote infrastructure.',
    specHint: '1920×1080px, contemporary office desk, clean code editors, focused collaborative posture',
  },

  // ── 4. Global Presence (Trade Lanes) ─────────────────────────────────────
  'region-europe': {
    id: 'region-europe',
    expectedPath: '/images/regions/europe.jpg',
    alt: 'Cargo vessel offloading Indian export containers at the Port of Rotterdam gateway.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Global Presence',
    subject: 'European Gateway Logistics',
    caption: 'Direct transit to Rotterdam and Hamburg with REACH documentation.',
  },
  'region-middle-east': {
    id: 'region-middle-east',
    expectedPath: '/images/regions/middle-east.jpg',
    alt: 'Deep-water berths at Jebel Ali Port, Dubai, receiving fast sea feeder vessels from Gujarat ports.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Global Presence',
    subject: 'Gulf Maritime Corridor',
    caption: '3–5 day sea transit from Mundra into Jebel Ali and Dammam.',
  },
  'region-africa': {
    id: 'region-africa',
    expectedPath: '/images/regions/africa.jpg',
    alt: 'Breakbulk and container cargo operations discharging at Mombasa port in East Africa.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Global Presence',
    subject: 'East African Trade Lanes',
    caption: 'Direct sailings from Kandla and Mundra serving African industrial hubs.',
  },
  'region-north-america': {
    id: 'region-north-america',
    expectedPath: '/images/regions/north-america.jpg',
    alt: 'Container logistics and distribution freight facilities serving US and Canadian import corridors.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Global Presence',
    subject: 'North American Trade Corridor',
    caption: 'Long-haul container lanes with US retail carton marking compliance.',
  },
  'region-south-america': {
    id: 'region-south-america',
    expectedPath: '/images/regions/south-america.jpg',
    alt: 'Container vessel at Santos port container terminal receiving Indian export programmes.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Global Presence',
    subject: 'Latin American Trade Routes',
    caption: 'Spanish and Portuguese language export documentation for Santos and Callao lanes.',
  },
  'region-asia-pacific': {
    id: 'region-asia-pacific',
    expectedPath: '/images/regions/asia-pacific.jpg',
    alt: 'Deepwater container terminal and feeder vessel operations across ASEAN and Australia trade lanes.',
    aspectRatio: '16/9',
    aspectRatioClass: 'aspect-16/9',
    section: 'Global Presence',
    subject: 'Asia-Pacific Regional Corridors',
    caption: 'Direct connections ex Nhava Sheva with preferential-origin documentation.',
  },
};

export function resolveImageFile(manifestId: string): {
  exists: boolean;
  entry: ImageManifestEntry | null;
  resolvedPath: string | null;
} {
  const entry = IMAGE_MANIFEST[manifestId];
  if (!entry) return { exists: false, entry: null, resolvedPath: null };

  const publicDir = path.join(process.cwd(), 'public');
  const baseName = entry.expectedPath.replace(/^\//, '');
  const fullPath = path.join(publicDir, baseName);

  if (fs.existsSync(fullPath)) {
    return { exists: true, entry, resolvedPath: entry.expectedPath };
  }

  const ext = path.extname(baseName);
  const withoutExt = baseName.slice(0, -ext.length);
  for (const altExt of ['.webp', '.png', '.jpeg']) {
    const candidate = `${withoutExt}${altExt}`;
    if (fs.existsSync(path.join(publicDir, candidate))) {
      return { exists: true, entry, resolvedPath: `/${candidate.replace(/\\/g, '/')}` };
    }
  }

  return { exists: false, entry, resolvedPath: null };
}
