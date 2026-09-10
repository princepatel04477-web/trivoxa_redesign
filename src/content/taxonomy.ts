/**
 * src/content/taxonomy.ts — THE ONLY PLACE THESE LISTS EXIST.
 * ---------------------------------------------------------------------------
 * The July 2026 audit found four different lists of "what Trivoxa sells"
 * (6 industries on the homepage, 8 on the Industries page, a 7-item tag list on
 * Businesses, 5 categories in the actual catalog), six regions on Global
 * Presence against five in the footer, and three contact email addresses.
 *
 * There was never one source of truth. This file is it.
 *
 * RULES (enforced by scripts/check-taxonomy.ts, wired into `npm run build`):
 *  1. Every industry / category / region / port / certification / contact
 *     value rendered anywhere on the site comes from these arrays. A
 *     hardcoded industry name in JSX fails lint (`eslint` rule added in P3).
 *  2. Homepage previews render `INDUSTRIES.slice(0, n)` plus a visible
 *     "View all N industries" affordance. Never a silent subset.
 *  3. Anything `onboarding` renders with a designed empty state — never an
 *     empty table, never a dead link, never a row of em-dashes.
 *  4. A `live` product with an empty required spec field is a build error.
 *
 * DATA PROVENANCE
 *  · Product names, MOQs, lead times and Incoterms were transcribed from the
 *    live trivoxagroup.com catalog (crawled 2026-09-04) so the rebuild loses
 *    nothing the audit called "the best single piece of execution on the site".
 *  · HS codes are standard WCO 6-digit headings reconstructed for each line.
 *    THEY MUST BE VERIFIED AGAINST THE CLIENT'S EXPORT DOCUMENTATION BEFORE
 *    LAUNCH — see docs/DECISIONS.md and the P22 checklist. Publishing a wrong
 *    HS code to a customs-literate buyer is worse than publishing none.
 *  · Region "verifiableDetail" values are operational statements drafted from
 *    the company's own port and certification data. Each is flagged in
 *    docs/DECISIONS.md for founder confirmation.
 */

import type {
  Category,
  Certification,
  Contact,
  Division,
  Industry,
  Port,
  Product,
  Region,
} from './schemas';

/* ------------------------------------------------------------------------ */
/* INDUSTRIES — rendered everywhere, sliced nowhere silently                 */
/* ------------------------------------------------------------------------ */

export const INDUSTRIES: Industry[] = [
  {
    slug: 'textile-apparel',
    name: 'Textile & Apparel',
    shortDescription:
      'Fabrics, home textiles and readymade apparel from Surat\'s weaving belt, quoted against GSM, count and composition.',
    icon: 'Shirt',
    status: 'live',
    relatedCategories: ['textile-apparel'],
    typicalBuyers: ['Apparel brands', 'Wholesalers', 'Sourcing houses', 'Uniform contractors'],
    complianceNotes: [
      'Composition and care labelling matched to destination-market rules (EU 1007/2011, US FTC).',
      'Fibre-content test reports available per lot on request.',
    ],
    regionFocus: ['europe', 'middle-east', 'asia-pacific'],
  },
  {
    slug: 'healthcare-pharmaceuticals',
    name: 'Healthcare & Pharmaceuticals',
    shortDescription:
      'Generic formulations, APIs, ayurvedic extracts, surgical disposables and nutraceuticals through quality-focused manufacturing partners.',
    icon: 'Pill',
    status: 'live',
    relatedCategories: ['healthcare-pharmaceuticals'],
    typicalBuyers: ['Distributors', 'Hospital procurement', 'Pharmacy chains', 'Contract packers'],
    complianceNotes: [
      'WHO-GMP and FSSAI are in progress with published target dates; lines ship with the certifications held today, disclosed.',
      'Dossier support (CoA, CoP, stability summary) supplied per shipment.',
    ],
    regionFocus: ['africa', 'north-america', 'middle-east'],
  },
  {
    slug: 'building-materials',
    name: 'Building Materials',
    shortDescription:
      'Vitrified tiles, sanitaryware, marble and granite slabs, engineered quartz, cement and clinker for residential and infrastructure projects.',
    icon: 'Building2',
    status: 'live',
    relatedCategories: ['building-materials'],
    typicalBuyers: ['Project contractors', 'Tile distributors', 'Sanitaryware retailers', 'Developers'],
    complianceNotes: [
      'Shade, calibre and breakage tolerances stated per consignment, not per catalogue.',
      'Fumigation and ISPM 15-compliant timber packing for crated stone.',
    ],
    regionFocus: ['middle-east', 'africa', 'south-america'],
  },
  {
    slug: 'furniture-interiors',
    name: 'Furniture & Interiors',
    shortDescription:
      'Residential, commercial and hospitality furniture being finalised with manufacturing partners — quoted, not yet catalogued.',
    icon: 'Armchair',
    status: 'onboarding',
    relatedCategories: ['furniture-interiors'],
    typicalBuyers: ['Hospitality procurers', 'Interior contractors', 'Furniture retailers'],
    complianceNotes: [
      'ISPM 15 heat-treated / stamped timber packaging will apply to every export consignment.',
      'Formaldehyde-emission class (E1/E0) declared per board lot once lines go live.',
    ],
    regionFocus: ['middle-east', 'europe'],
  },
  {
    slug: 'agriculture-food',
    name: 'Agriculture & Food',
    shortDescription:
      'Cumin and whole spices, groundnuts, castor oil derivatives, dry fruits and processed foods, sourced from Gujarat\'s agri belt.',
    icon: 'Wheat',
    status: 'live',
    relatedCategories: ['agriculture-food'],
    typicalBuyers: ['Food manufacturers', 'Spice blenders', 'Import wholesalers', 'Retail packers'],
    complianceNotes: [
      'FSSAI and Spice Board registrations are in progress with published target dates; phytosanitary certificates supplied per shipment today.',
      'Aflatoxin and moisture analysis reports available per lot.',
    ],
    regionFocus: ['middle-east', 'asia-pacific', 'europe'],
  },
  {
    slug: 'engineering-industrial',
    name: 'Engineering & Industrial',
    shortDescription:
      'Pumps and motors, valves and pipe fittings, auto and machine components, fasteners and machine tools for industrial buyers.',
    icon: 'Cog',
    status: 'live',
    relatedCategories: ['engineering-industrial'],
    typicalBuyers: ['OEMs', 'MRO distributors', 'EPC contractors', 'Machine builders'],
    complianceNotes: [
      'Material test certificates and dimensional reports issued per batch.',
      'CE marking in progress for EU-bound lines; non-CE lines are labelled as such.',
    ],
    regionFocus: ['africa', 'south-america', 'middle-east'],
  },
  {
    slug: 'technology',
    name: 'Technology',
    shortDescription:
      'Software, AI solutions and digital transformation delivered by the Service Export division — the group\'s second operating arm.',
    icon: 'Cpu',
    status: 'live',
    relatedCategories: [],
    typicalBuyers: ['SMBs modernising operations', 'Agencies', 'Startups', 'Enterprise teams'],
    complianceNotes: [
      'Delivered under the Service Export division; data-processing terms available before engagement.',
    ],
    regionFocus: ['north-america', 'europe', 'middle-east'],
  },
  {
    slug: 'retail-consumer-goods',
    name: 'Retail & Consumer Goods',
    shortDescription:
      'Supply-chain support for retailers, distributors and consumer brands — sourcing programmes being assembled with partners.',
    icon: 'ShoppingBag',
    status: 'onboarding',
    relatedCategories: [],
    typicalBuyers: ['Retail chains', 'Distributors', 'Consumer brands', 'E-commerce sellers'],
    complianceNotes: [
      'Destination-market labelling, barcoding and carton-marking specs will be confirmed per programme.',
    ],
    regionFocus: ['europe', 'north-america'],
  },
  {
    slug: 'jewellery-precious-products',
    name: 'Jewellery & Precious Products',
    shortDescription:
      'Sourced jewellery and precious products through trusted manufacturing partnerships — marketed in the Company Profile, now being built honestly here.',
    icon: 'Gem',
    status: 'onboarding',
    relatedCategories: ['jewellery-precious-products'],
    typicalBuyers: ['Jewellery retailers', 'Distributors', 'Bullion dealers'],
    complianceNotes: [
      'BIS hallmarking and IMA-linked assay documentation will apply once lines go live.',
      'Valuation and insurance documentation per consignment, not per catalogue.',
    ],
    regionFocus: ['middle-east', 'north-america'],
  },
];

/* ------------------------------------------------------------------------ */
/* DIVISIONS — the two operating arms; the structure accepts a third         */
/* ------------------------------------------------------------------------ */

export const DIVISIONS: Division[] = [
  {
    slug: 'product-exports',
    name: 'Global Product Exports',
    description:
      'Connects international buyers with trusted manufacturers and sourced products from India, quoted against real specifications.',
    categorySlugs: [
      'textile-apparel',
      'healthcare-pharmaceuticals',
      'building-materials',
      'agriculture-food',
      'engineering-industrial',
      'furniture-interiors',
      'jewellery-precious-products',
    ],
  },
  {
    slug: 'service-exports',
    name: 'Global Service Exports',
    description:
      'Technology, AI, software, design & branding, digital marketing and business support — delivered as a dedicated property.',
    categorySlugs: [],
    externalHref: 'https://digital.trivoxagroup.com',
    externalLabel: 'digital.trivoxagroup.com',
  },
];

/* ------------------------------------------------------------------------ */
/* CATEGORIES — each linked to an industry and carrying status               */
/* ------------------------------------------------------------------------ */

export const CATEGORIES: Category[] = [
  {
    slug: 'textile-apparel',
    name: 'Textile & Apparel',
    industrySlug: 'textile-apparel',
    status: 'live',
    overview:
      'Woven and made-up textiles from Surat\'s mills: yarn, greige and finished fabric, home textiles, readymade apparel and technical non-wovens.',
    applications: ['Apparel production', 'Home furnishing', 'Workwear', 'Technical textiles'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'healthcare-pharmaceuticals',
    name: 'Healthcare & Pharmaceuticals',
    industrySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    overview:
      'Pharmaceutical and healthcare lines sourced from quality-focused manufacturing partners, with dossier support and disclosed certification status.',
    applications: ['Pharmacy retail', 'Hospital supply', 'Nutraceutical brands', 'Ayurvedic retail'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'building-materials',
    name: 'Building Materials',
    industrySlug: 'building-materials',
    status: 'live',
    overview:
      'Surfaces and structure: vitrified tiles, sanitaryware, natural stone slabs, engineered quartz, cement and clinker for projects of any scale.',
    applications: ['Residential projects', 'Commercial fit-out', 'Infrastructure', 'Sanitary supply'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'agriculture-food',
    name: 'Agriculture & Food',
    industrySlug: 'agriculture-food',
    status: 'live',
    overview:
      'Gujarat\'s agri belt, exported properly: spices, groundnuts, castor derivatives, dry fruits and processed foods with per-lot analysis.',
    applications: ['Food manufacturing', 'Spice blending', 'Retail packing', 'Oleochemicals'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'engineering-industrial',
    name: 'Engineering & Industrial',
    industrySlug: 'engineering-industrial',
    status: 'live',
    overview:
      'Industrial hardware and components with material test certificates: pumps, valves, fasteners, auto components and machine tools.',
    applications: ['Plant & MRO', 'Automotive supply', 'Fabrication', 'Machine building'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'furniture-interiors',
    name: 'Furniture & Interiors',
    industrySlug: 'furniture-interiors',
    status: 'onboarding',
    overview:
      'Furniture and interior solutions for residential, commercial and hospitality environments. The portfolio is being finalised with manufacturing partners.',
    applications: ['Hospitality projects', 'Office fit-out', 'Residential retail'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'jewellery-precious-products',
    name: 'Jewellery & Precious Products',
    industrySlug: 'jewellery-precious-products',
    status: 'onboarding',
    overview:
      'Sourced jewellery and precious products through trusted manufacturing partnerships. Lines are being onboarded with assay documentation.',
    applications: ['Jewellery retail', 'Distribution', 'Bullion trade'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
];

/* ------------------------------------------------------------------------ */
/* PRODUCTS — the catalog. Spec data transcribed from the live site.         */
/* ------------------------------------------------------------------------ */

export const PRODUCTS: Product[] = [
  // ── Textile & Apparel ────────────────────────────────────────────────────
  {
    slug: 'cotton-yarn',
    name: 'Cotton Yarn',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5205.42',
    grade: 'Ne 20–40, combed & carded',
    moq: '5 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Knitting', 'Weaving', 'Hosiery'],
  },
  {
    slug: 'cotton-denim-fabric',
    name: 'Cotton & Denim Fabric',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5209.42',
    grade: 'GSM 240–400, indigo & sulphur',
    moq: '3,000 m',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Denim apparel', 'Workwear', 'Bags'],
  },
  {
    slug: 'home-textiles',
    name: 'Home Textiles',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '6302.31',
    grade: 'Cotton & blends, 200–600 TC',
    moq: '2,000 pcs',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Bed linen', 'Bath linen', 'Hospitality'],
  },
  {
    slug: 'readymade-apparel',
    name: 'Readymade Apparel',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '6205.20',
    grade: 'Woven & knits, buyer tech-pack',
    moq: '1,000 pcs/style',
    leadTime: '30–40 days',
    incoterms: ['FOB', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Private label', 'Uniforms', 'Retail programmes'],
  },
  {
    slug: 'technical-non-woven-textiles',
    name: 'Technical & Non-Woven Textiles',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5603.14',
    grade: 'Spunbond & meltblown, 15–150 GSM',
    moq: '2 MT',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Hygiene', 'Medical', 'Geotextiles', 'Filtration'],
  },

  // ── Healthcare & Pharmaceuticals ─────────────────────────────────────────
  {
    slug: 'generic-formulations',
    name: 'Generic Formulations',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '3004.90',
    grade: 'Tablets, capsules, syrups',
    moq: '10,000 units',
    leadTime: '30–35 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), WHO-GMP (targeted for pharma lines).',
    applications: ['Pharmacy retail', 'Tenders', 'Institutional supply'],
  },
  {
    slug: 'active-pharmaceutical-ingredients',
    name: 'Active Pharmaceutical Ingredients',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '2941.90',
    grade: 'DMF-supported grades',
    moq: '25 kg',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), WHO-GMP (targeted for pharma lines).',
    applications: ['Formulation manufacture', 'Contract synthesis'],
  },
  {
    slug: 'ayurvedic-herbal-extracts',
    name: 'Ayurvedic & Herbal Extracts',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '1302.19',
    grade: 'Standardised extracts, ratio & %',
    moq: '50 kg',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Nutraceuticals', 'Cosmetics', 'Wellness retail'],
  },
  {
    slug: 'surgical-disposables',
    name: 'Surgical Disposables',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '9018.90',
    grade: 'EO-sterilised, single use',
    moq: '5,000 units',
    leadTime: '20–30 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Hospitals', 'Clinics', 'Distributors'],
  },
  {
    slug: 'nutraceuticals-supplements',
    name: 'Nutraceuticals & Supplements',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '2106.90',
    grade: 'Finished dosage, private label',
    moq: '5,000 units',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), WHO-GMP (targeted for pharma lines).',
    applications: ['Supplement brands', 'Wellness retail'],
  },

  // ── Building Materials ───────────────────────────────────────────────────
  {
    slug: 'vitrified-ceramic-tiles',
    name: 'Vitrified & Ceramic Tiles',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6907.21',
    grade: 'GVT/PGVT 600×600, 600×1200',
    moq: '1 FCL (18,000 sqft)',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Flooring', 'Facades', 'Retail fit-out'],
  },
  {
    slug: 'sanitaryware',
    name: 'Sanitaryware',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6910.10',
    grade: 'Vitreous china, one-piece & two-piece',
    moq: '500 pcs',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'mundra',
    applications: ['Residential', 'Hospitality', 'Projects'],
  },
  {
    slug: 'marble-granite-slabs',
    name: 'Marble & Granite Slabs',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6802.91',
    grade: 'Gang-sawn & polished, 20–30 mm',
    moq: '200 sqm',
    leadTime: '30–35 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Countertops', 'Flooring', 'Monuments'],
  },
  {
    slug: 'engineered-quartz',
    name: 'Engineered Quartz',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6810.99',
    grade: '93% quartz, 20–30 mm slabs',
    moq: '150 sqm',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'mundra',
    applications: ['Kitchen surfaces', 'Vanities', 'Commercial tops'],
  },
  {
    slug: 'cement-clinker',
    name: 'Cement & Clinker',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '2523.29',
    grade: 'OPC 43/53, bulk & bagged',
    moq: '500 MT',
    leadTime: '10–15 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Infrastructure', 'Ready-mix', 'Block manufacture'],
  },

  // ── Agriculture & Food ───────────────────────────────────────────────────
  {
    slug: 'cumin-whole-spices',
    name: 'Cumin & Whole Spices',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0909.31',
    grade: 'Unjha-origin, 99–99.5% purity',
    moq: '10 MT',
    leadTime: '12–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), Spice Board (target 2026-Q4).',
    applications: ['Spice blending', 'Food manufacture', 'Retail packing'],
  },
  {
    slug: 'groundnuts',
    name: 'Groundnuts',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1202.42',
    grade: 'Shelled, 50/60 – 80/90 counts',
    moq: '20 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'kandla',
    applications: ['Confectionery', 'Oil crushing', 'Snacks'],
  },
  {
    slug: 'castor-oil-derivatives',
    name: 'Castor Oil & Derivatives',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1515.30',
    grade: 'Commercial & refined, acid value per spec',
    moq: '20 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'kandla',
    applications: ['Oleochemicals', 'Lubricants', 'Cosmetics'],
  },
  {
    slug: 'processed-dehydrated-foods',
    name: 'Processed & Dehydrated Foods',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0712.90',
    grade: 'Dehydrated onion, garlic, vegetables',
    moq: '5 MT',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'mundra',
    applications: ['Food manufacture', 'Seasonings', 'Ready meals'],
  },
  {
    slug: 'dry-fruits',
    name: 'Dry Fruits',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0813.50',
    grade: 'Graded mixes, retail & bulk',
    moq: '5 MT',
    leadTime: '10–15 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Retail packing', 'Confectionery', 'Gifting'],
  },

  // ── Engineering & Industrial ─────────────────────────────────────────────
  {
    slug: 'industrial-pumps-motors',
    name: 'Industrial Pumps & Motors',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8413.70',
    grade: 'Centrifugal & submersible, IE2–IE4',
    moq: '50 units',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Water supply', 'Agriculture', 'Process plants'],
  },
  {
    slug: 'valves-pipe-fittings',
    name: 'Valves & Pipe Fittings',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8481.80',
    grade: 'CI/CS/SS, threaded & flanged',
    moq: '500 units',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Plumbing', 'Fire systems', 'Process lines'],
  },
  {
    slug: 'auto-machine-components',
    name: 'Auto & Machine Components',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8708.99',
    grade: 'Forged, cast & machined to drawing',
    moq: '1,000 units',
    leadTime: '20–30 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Automotive supply', 'Machine building', 'MRO'],
  },
  {
    slug: 'industrial-fasteners',
    name: 'Industrial Fasteners',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '7318.15',
    grade: 'DIN/ISO, class 8.8–12.9',
    moq: '2 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Structural', 'Automotive', 'General assembly'],
  },
  {
    slug: 'machine-tools',
    name: 'Machine Tools',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8457.10',
    grade: 'Machining centres & specials',
    moq: '10 units',
    leadTime: '35–40 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Job shops', 'OEM plants', 'Tool rooms'],
  },
];

/* ------------------------------------------------------------------------ */
/* REGIONS — one canonical name each; footer and globe render the same array */
/* ------------------------------------------------------------------------ */

export const REGIONS: Region[] = [
  {
    slug: 'europe',
    name: 'Europe',
    industryFocus: ['textile-apparel', 'building-materials', 'healthcare-pharmaceuticals'],
    verifiableDetail:
      'EU-bound consignments ship with REACH-aware documentation and destination labelling; CE-marked engineering lines follow the published CE target.',
    marketFocus: 'Distributors and project buyers who read compliance pages first.',
  },
  {
    slug: 'middle-east',
    name: 'Middle East',
    industryFocus: ['agriculture-food', 'building-materials'],
    verifiableDetail:
      'Gulf lanes run from Mundra and Kandla — the shortest sea transit from Surat\'s manufacturing belt — into Jebel Ali and Dammam.',
    marketFocus: 'Trade houses and project procurement across the GCC.',
  },
  {
    slug: 'africa',
    name: 'Africa',
    industryFocus: ['engineering-industrial', 'building-materials'],
    verifiableDetail:
      'Cement, clinker and engineering hardware move ex Mundra to East African ports with ISPM 15-compliant timber packing.',
    marketFocus: 'Infrastructure contractors and industrial distributors.',
  },
  {
    slug: 'north-america',
    name: 'North America',
    industryFocus: ['healthcare-pharmaceuticals', 'textile-apparel'],
    verifiableDetail:
      'Home textiles and apparel programmes ship with carton marking and labelling to US retail compliance specifications.',
    marketFocus: 'Wholesale distributors and private-label programmes.',
  },
  {
    slug: 'south-america',
    name: 'South America',
    industryFocus: ['engineering-industrial', 'agriculture-food'],
    verifiableDetail:
      'Spanish-language export documentation is prepared on request for Santos and Callao lanes.',
    marketFocus: 'Industrial buyers and agri-importers.',
  },
  {
    slug: 'asia-pacific',
    name: 'Asia-Pacific',
    industryFocus: ['textile-apparel', 'retail-consumer-goods'],
    verifiableDetail:
      'ASEAN and ANZ buyers are served via Nhava Sheva (JNPT) with preferential-origin documentation where an FTA applies.',
    marketFocus: 'Apparel manufacturers and consumer-goods distributors.',
  },
];

/* ------------------------------------------------------------------------ */
/* PORTS — named, with a reason each. The audit called these the best        */
/* detail on the site; they are now data, not copy.                          */
/* ------------------------------------------------------------------------ */

export const PORTS: Port[] = [
  {
    slug: 'mundra',
    name: 'Mundra',
    locode: 'INMUN',
    reason: 'India\'s largest private port — the bulk and container capacity behind stone, cement and agri cargo.',
  },
  {
    slug: 'kandla',
    name: 'Kandla',
    locode: 'INIXY',
    reason: 'The closest deep-water port to Surat\'s manufacturing belt; cost-effective for bulk and break-bulk.',
  },
  {
    slug: 'nhava-sheva',
    name: 'Nhava Sheva (JNPT)',
    locode: 'INNSA',
    reason: 'India\'s largest container port — the lane for time-critical textiles, pharma and engineering cargo.',
  },
];

/* ------------------------------------------------------------------------ */
/* CERTIFICATIONS — active and in-progress, with published targets           */
/* ------------------------------------------------------------------------ */

export const CERTIFICATIONS: Certification[] = [
  {
    slug: 'iec',
    name: 'IEC',
    fullName: 'Import Export Code',
    status: 'active',
    issuingAuthority: 'Directorate General of Foreign Trade, Government of India',
  },
  {
    slug: 'gst',
    name: 'GST',
    fullName: 'Goods & Services Tax Registration',
    status: 'active',
    issuingAuthority: 'Goods and Services Tax Network, Government of India',
  },
  {
    slug: 'fieo',
    name: 'FIEO',
    fullName: 'Federation of Indian Export Organisations',
    status: 'in-progress',
    targetQuarter: '2026-Q4',
    issuingAuthority: 'FIEO',
  },
  {
    slug: 'apeda',
    name: 'APEDA',
    fullName: 'Agricultural & Processed Food Products Export Development Authority',
    status: 'in-progress',
    targetQuarter: '2026-Q4',
    issuingAuthority: 'APEDA, Ministry of Commerce & Industry',
  },
  {
    slug: 'fssai',
    name: 'FSSAI',
    fullName: 'Food Safety & Standards Authority of India',
    status: 'in-progress',
    targetQuarter: '2027-Q1',
    issuingAuthority: 'FSSAI',
  },
  {
    slug: 'iso-9001',
    name: 'ISO 9001',
    fullName: 'Quality Management System',
    status: 'in-progress',
    targetQuarter: '2027-Q1',
    issuingAuthority: 'Accredited certification body',
  },
  {
    slug: 'spice-board',
    name: 'Spice Board',
    fullName: 'Spices Board of India',
    status: 'in-progress',
    targetQuarter: '2026-Q4',
    issuingAuthority: 'Spices Board, Ministry of Commerce & Industry',
  },
  {
    slug: 'ce',
    name: 'CE',
    fullName: 'CE Marking (EU Conformity)',
    status: 'in-progress',
    targetNote: 'Targeted for EU-bound lines',
    issuingAuthority: 'EU Notified Body',
  },
  {
    slug: 'who-gmp',
    name: 'WHO-GMP',
    fullName: 'WHO Good Manufacturing Practice',
    status: 'in-progress',
    targetNote: 'Targeted for pharma lines',
    issuingAuthority: 'WHO / national regulatory authority',
  },
];

/* ------------------------------------------------------------------------ */
/* CONTACT — ONE email set. The audit found three in circulation.            */
/* ------------------------------------------------------------------------ */

export const CONTACT: Contact = {
  general: 'hello@trivoxagroup.com',
  sales: 'sales@trivoxagroup.com',
  careers: 'careers@trivoxagroup.com',
  partnerships: 'partnerships@trivoxagroup.com',
  /**
   * EMPTY BY DESIGN — see docs/DECISIONS.md "Founder inputs outstanding".
   * The Company Profile PDF lists two direct numbers; they have not been
   * supplied to this build. /contact renders the designed callback substitute
   * and `npm run check:taxonomy` raises a build WARNING until these land.
   * A fabricated number is the one thing this field must never contain.
   */
  phoneNumbers: [],
  hoursIst: 'Monday–Saturday, 10:00–19:00',
  timezoneLabel: 'IST (UTC+5:30)',
  registeredOffice: 'Surat, Gujarat, India',
  registeredEntityNumber: null,
  responseWindow: 'within 24 business hours (IST)',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/trivoxagroup' },
    { label: 'Instagram', href: 'https://www.instagram.com/trivoxagroup' },
    { label: 'X', href: 'https://x.com/trivoxagroup' },
    { label: 'YouTube', href: 'https://www.youtube.com/@trivoxagroup' },
  ],
};

/* ------------------------------------------------------------------------ */
/* Selectors — the ONLY way components reach into these arrays.              */
/* ------------------------------------------------------------------------ */

export const liveIndustries = (): Industry[] => INDUSTRIES.filter((i) => i.status === 'live');
export const onboardingIndustries = (): Industry[] =>
  INDUSTRIES.filter((i) => i.status === 'onboarding');

export function industryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}

export function categoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function categoriesForIndustry(industrySlug: string): Category[] {
  return CATEGORIES.filter((category) => category.industrySlug === industrySlug);
}

export function productsForCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((product) => product.categorySlug === categorySlug);
}

export function liveProductsForCategory(categorySlug: string): Product[] {
  return productsForCategory(categorySlug).filter((product) => product.status === 'live');
}

export function onboardingProductsForCategory(categorySlug: string): Product[] {
  return productsForCategory(categorySlug).filter((product) => product.status === 'onboarding');
}

export function productBySlug(categorySlug: string, productSlug: string): Product | undefined {
  return PRODUCTS.find(
    (product) => product.categorySlug === categorySlug && product.slug === productSlug,
  );
}

export function regionBySlug(slug: string): Region | undefined {
  return REGIONS.find((region) => region.slug === slug);
}

export function portBySlug(slug: string): Port | undefined {
  return PORTS.find((port) => port.slug === slug);
}

export const activeCertifications = (): Certification[] =>
  CERTIFICATIONS.filter((certification) => certification.status === 'active');
export const inProgressCertifications = (): Certification[] =>
  CERTIFICATIONS.filter((certification) => certification.status === 'in-progress');

/** Counts used by the proof band and "Presence in Numbers" — never hardcoded. */
export const STATS = {
  industryCount: (): number => INDUSTRIES.length,
  liveCategoryCount: (): number => CATEGORIES.filter((c) => c.status === 'live').length,
  productCount: (): number => PRODUCTS.length,
  liveProductCount: (): number => PRODUCTS.filter((p) => p.status === 'live').length,
  regionCount: (): number => REGIONS.length,
  portCount: (): number => PORTS.length,
} as const;
