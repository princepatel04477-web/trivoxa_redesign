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

export type {
  Category,
  Certification,
  Contact,
  Division,
  Industry,
  Port,
  Product,
  Region,
};

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
    slug: 'jewellery-precious-products',
    name: 'Jewellery & Precious Products',
    shortDescription:
      'Lab-grown and natural diamonds, hallmarked gold jewellery, 925 sterling silver, and bridal jadau directly from Surat\'s artisan hubs.',
    icon: 'Gem',
    status: 'live',
    relatedCategories: ['jewellery-precious-products'],
    typicalBuyers: ['Jewellery retailers', 'Chain showrooms', 'Wholesale distributors', 'Private label brands'],
    complianceNotes: [
      'BIS hallmarking (14K/18K/22K) and GIA/IGI diamond grading certifications per piece.',
      'Valuation, tamper-evident security packing and door-to-door transit insurance per consignment.',
    ],
    regionFocus: ['middle-east', 'north-america', 'europe'],
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
    slug: 'agriculture-food',
    name: 'Agriculture & Food',
    shortDescription:
      'Cumin, whole spices, rice, oilseeds, pulses, processed foods, and cold-chain seafood from Gujarat\'s coastal and agri belts.',
    icon: 'Wheat',
    status: 'live',
    relatedCategories: ['agriculture-food', 'seafood'],
    typicalBuyers: ['Food manufacturers', 'Spice blenders', 'Import wholesalers', 'Retail packers', 'Seafood distributors'],
    complianceNotes: [
      'FSSAI, APEDA, MPEDA and Spice Board registrations; phytosanitary and health certificates supplied per shipment.',
      'Aflatoxin, pesticide residue and moisture analysis reports available per lot.',
    ],
    regionFocus: ['middle-east', 'asia-pacific', 'europe'],
  },
  {
    slug: 'engineering-industrial',
    name: 'Engineering & Industrial',
    shortDescription:
      'Pumps and motors, valves, pipe fittings, heavy machinery, diesel gensets, fasteners and precision CNC machine tools.',
    icon: 'Cog',
    status: 'live',
    relatedCategories: ['engineering-industrial'],
    typicalBuyers: ['OEMs', 'MRO distributors', 'EPC contractors', 'Machine builders', 'Infrastructure projects'],
    complianceNotes: [
      'Material test certificates (MTC 3.1) and dimensional inspection reports issued per batch.',
      'CE marking in progress for EU-bound lines; all machinery bench-tested before crating.',
    ],
    regionFocus: ['africa', 'south-america', 'middle-east'],
  },
  {
    slug: 'furniture-interiors',
    name: 'Furniture & Interiors',
    shortDescription:
      'Solid wood hospitality furniture, modular office systems, acoustic panels, dining chairs and contract joinery.',
    icon: 'Armchair',
    status: 'live',
    relatedCategories: ['furniture-interiors'],
    typicalBuyers: ['Hospitality procurers', 'Interior contractors', 'Furniture retailers', 'Architectural specifiers'],
    complianceNotes: [
      'ISPM 15 heat-treated / stamped timber packaging applied to every export container.',
      'BIFMA testing and formaldehyde-emission class (E1/E0) verified per board lot.',
    ],
    regionFocus: ['middle-east', 'europe', 'north-america'],
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
      'Supply-chain sourcing programmes for international retailers, FMCG distributors and direct-to-consumer private labels.',
    icon: 'ShoppingBag',
    status: 'live',
    relatedCategories: [],
    typicalBuyers: ['Retail chains', 'Distributors', 'Consumer brands', 'E-commerce sellers'],
    complianceNotes: [
      'Destination-market labelling, GS1 barcoding and master carton-marking specs confirmed per programme.',
    ],
    regionFocus: ['europe', 'north-america'],
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
      'jewellery-precious-products',
      'healthcare-pharmaceuticals',
      'building-materials',
      'agriculture-food',
      'seafood',
      'engineering-industrial',
      'furniture-interiors',
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
      'Woven and made-up textiles from Surat\'s mills: cotton fabric, polyester fabric, denim, home textiles, readymade apparel and technical non-wovens.',
    applications: ['Apparel production', 'Home furnishing', 'Workwear', 'Technical textiles'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'jewellery-precious-products',
    name: 'Jewellery & Precious Products',
    industrySlug: 'jewellery-precious-products',
    status: 'live',
    overview:
      'Diamond cutting and jewellery manufacturing from Surat: lab-grown diamonds, natural certified diamonds, hallmarked gold jewellery, 925 sterling silver, and bridal jewellery.',
    applications: ['Jewellery retail', 'Wholesale distribution', 'Private label brands', 'Bespoke commissions'],
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
      'Gujarat\'s agri belt, exported properly: whole spices, basmati & non-basmati rice, groundnuts, sesame seeds, castor derivatives, tea, coffee, and dehydrated foods.',
    applications: ['Food manufacturing', 'Spice blending', 'Retail packing', 'Oleochemicals'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'seafood',
    name: 'Seafood',
    industrySlug: 'agriculture-food',
    status: 'live',
    overview:
      'HACCP & MPEDA-approved cold chain seafood from India\'s coastal hubs: Frozen Vannamei shrimp, marine fish, squid, cuttlefish, and dried marine products in reefer containers.',
    applications: ['Seafood distribution', 'Foodservice & restaurants', 'Supermarket retail packs', 'Value-added processing'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'engineering-industrial',
    name: 'Engineering & Industrial',
    industrySlug: 'engineering-industrial',
    status: 'live',
    overview:
      'Industrial hardware and heavy machinery: centrifugal pumps, valves, machine tools, diesel generators, earthmoving equipment, fasteners and auto parts.',
    applications: ['Plant & MRO', 'Automotive supply', 'Infrastructure projects', 'Machine building'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
  {
    slug: 'furniture-interiors',
    name: 'Furniture & Interiors',
    industrySlug: 'furniture-interiors',
    status: 'live',
    overview:
      'Contract and architectural furniture for hospitality, commercial, and residential projects: solid wood lines, modular desks, dining seating, and acoustic wall systems.',
    applications: ['Hospitality projects', 'Office fit-out', 'Residential retail', 'Architectural joinery'],
    supportsSampleRequest: true,
    supportsFactoryAudit: true,
  },
];

/* ------------------------------------------------------------------------ */
/* PRODUCTS — the catalog. Spec data transcribed from the live site.         */
/* ------------------------------------------------------------------------ */

export const PRODUCTS: Product[] = [
  // ── Textile & Apparel (Universal 50,000m MOQ for woven lines) ────────────
  {
    slug: 'cotton-fabric',
    name: 'Cotton Fabric',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5208.11',
    grade: '100% Cotton, 30s/40s/60s combed & carded poplin & twill',
    moq: '50,000 m',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Shirting', 'Dress goods', 'Uniforms', 'Home textiles'],
  },
  {
    slug: 'polyester-fabric',
    name: 'Polyester Fabric',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5407.52',
    grade: 'FDY/DTY 75D–150D, plain, twill & moss crepe weaves',
    moq: '50,000 m',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Fashion apparel', 'Linings', 'Scarves', 'Industrial textiles'],
  },
  {
    slug: 'cotton-denim-fabric',
    name: 'Cotton & Denim Fabric',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5209.42',
    grade: 'GSM 240–400, indigo rope dyed & sulphur bottomed',
    moq: '50,000 m',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Denim apparel', 'Workwear jackets', 'Heavy-duty utility bags'],
  },
  {
    slug: 'home-textiles',
    name: 'Home Textiles',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '6302.31',
    grade: 'Cotton & modal blends, 200–600 TC sateen & percale',
    moq: '50,000 m',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Bed linen', 'Duvet covers', 'Bath linen', 'Hospitality supply'],
  },
  {
    slug: 'readymade-apparel',
    name: 'Readymade Apparel',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '6205.20',
    grade: 'Woven & knitted garments built to buyer tech-pack (10–14 SPI)',
    moq: '50,000 m',
    leadTime: '30–40 days',
    incoterms: ['FOB', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Private label fashion', 'Corporate uniforms', 'Retail programmes'],
  },
  {
    slug: 'technical-non-woven-textiles',
    name: 'Technical & Non-Woven Textiles',
    categorySlug: 'textile-apparel',
    status: 'live',
    hsCode: '5603.14',
    grade: 'Spunbond & meltblown polypropylene, 15–150 GSM',
    moq: '50,000 m',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Hygiene barrier', 'Medical drapes', 'Geotextiles', 'Industrial air filtration'],
  },

  // ── Gems & Jewellery (18 Lines) ──────────────────────────────────────────
  {
    slug: 'lab-grown-diamonds',
    name: 'Lab-Grown Diamonds (CVD/HPHT)',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7104.91',
    grade: 'IGI/GIA certified, VVS–VS clarity, D–H color, round & fancy cuts',
    moq: '50 Carats',
    leadTime: '7–12 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Fine jewellery manufacturing', 'Loose parcel trading', 'Custom jewellery design'],
  },
  {
    slug: 'natural-cut-diamonds',
    name: 'Natural Cut & Polished Diamonds',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7102.39',
    grade: 'Kimberley Process certified, IF–SI clarity, Triple Excellent cut',
    moq: '25 Carats',
    leadTime: '7–10 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Luxury jewellery', 'Bridal solitaires', 'Haute horlogerie dials'],
  },
  {
    slug: 'diamond-studded-gold-jewellery',
    name: '14K/18K Diamond Studded Gold Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: '14K / 18K BIS hallmarked gold with natural or lab-grown diamonds',
    moq: '250 Grams',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Retail showroom chains', 'Wholesale export', 'Brand collections'],
  },
  {
    slug: 'plain-hallmarked-gold-jewellery',
    name: '22K Plain Hallmarked Gold Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: '22K (916) BIS hallmarked, high-precision casting and stamping',
    moq: '500 Grams',
    leadTime: '12–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Traditional retail', 'Bullion jewellery counters', 'Export distribution'],
  },
  {
    slug: 'sterling-silver-jewellery',
    name: '925 Sterling Silver Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.11',
    grade: '925 stamped solid sterling silver, anti-tarnish rhodium e-coat',
    moq: '5 Kilograms',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Fast-fashion jewellery', 'E-commerce brands', 'Gift assortments'],
  },
  {
    slug: 'cubic-zirconia-silver-jewellery',
    name: 'CZ Studded Silver Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.11',
    grade: 'AAA+ machine-cut Cubic Zirconia in micro-prong 925 silver settings',
    moq: '500 Pieces',
    leadTime: '14–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Bridge jewellery', 'Fashion boutiques', 'Department store concessions'],
  },
  {
    slug: 'moissanite-fine-jewellery',
    name: 'Moissanite Fine Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'VVS1 colorless (D–F) moissanite mounted in 14K gold or 925 silver',
    moq: '100 Pieces',
    leadTime: '12–15 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Affordable luxury bridal', 'Direct-to-consumer jewellery lines'],
  },
  {
    slug: 'kundan-polki-bridal-jewellery',
    name: 'Kundan & Polki Jadau Bridal Sets',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: '22K gold foil setting with uncut polki & hand-painted Meenakari reverse',
    moq: '25 Sets',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Bridal boutiques', 'Heritage collections', 'South Asian diaspora retail'],
  },
  {
    slug: 'solitaire-engagement-rings',
    name: 'Diamond Solitaire Engagement Rings',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: '0.50–3.00 ctw center stone with 14K/18K/Platinum mounts',
    moq: '50 Pieces',
    leadTime: '14–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Bridal retail chains', 'Online engagement ring customizers'],
  },
  {
    slug: 'diamond-tennis-bracelets',
    name: 'Diamond Tennis Bracelets',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: '3.00–10.00 ctw continuous 4-prong and bezel linked 14K settings',
    moq: '30 Pieces',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Luxury gifting', 'Fine jewellery retail', 'Private client sales'],
  },
  {
    slug: 'diamond-pendants-necklaces',
    name: 'Studded Diamond Pendants & Necklaces',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'Micro-set halo, cluster, and journey designs in 14K/18K gold',
    moq: '50 Pieces',
    leadTime: '14–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Everyday fine jewellery', 'Retail gift programmes'],
  },
  {
    slug: 'gold-diamond-earrings',
    name: 'Gold & Diamond Earrings & Huggies',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'Comfort-click huggies, studs, and chandelier drops in 14K/18K gold',
    moq: '100 Pairs',
    leadTime: '12–16 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Core retail inventory', 'Seasonal collections'],
  },
  {
    slug: 'plain-gold-chains',
    name: 'Plain Gold Chains & Mangalsutras',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'Hollow & solid rope, curb, Franco, and box chains in 18K/22K',
    moq: '500 Grams',
    leadTime: '10–14 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Everyday chain retail', 'Custom pendant pairings'],
  },
  {
    slug: 'platinum-fine-jewellery',
    name: 'Platinum Fine Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.20',
    grade: 'Pt950 hallmarked cast wedding bands and diamond settings',
    moq: '200 Grams',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Men\'s luxury wedding bands', 'High-end engagement jewellery'],
  },
  {
    slug: 'precious-gemstone-jewellery',
    name: 'Precious Gemstone Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'Natural Zambian emerald, Burmese ruby, and Ceylon sapphire in 18K',
    moq: '50 Pieces',
    leadTime: '18–22 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Colored gemstone retail', 'High jewellery collections'],
  },
  {
    slug: 'temple-jewellery',
    name: 'Handcrafted Temple Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: '22K antique finish with repoussé and champlevé Nakshi craftsmanship',
    moq: '250 Grams',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Festive & bridal wear', 'Indian heritage boutiques abroad'],
  },
  {
    slug: 'gold-bangles-bracelets',
    name: 'Gold Bangles & Kada Collection',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'CNC diamond-cut, laser-welded and handmade kada in 22K gold',
    moq: '500 Grams',
    leadTime: '12–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Bridal trousseau', 'Traditional gold retailers'],
  },
  {
    slug: 'custom-cad-oem-jewellery',
    name: 'Custom OEM/ODM CAD Fine Jewellery',
    categorySlug: 'jewellery-precious-products',
    status: 'live',
    hsCode: '7113.19',
    grade: 'Precision 3D CAD/CAM modelled, 3D printed & vacuum cast to spec',
    moq: '100 Pieces',
    leadTime: '20–30 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Private label contract manufacturing', 'Designer label production'],
  },

  // ── Healthcare & Pharmaceuticals ─────────────────────────────────────────
  {
    slug: 'generic-formulations',
    name: 'Generic Formulations',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '3004.90',
    grade: 'Tablets, capsules, dry syrups & liquid orals',
    moq: '10,000 units',
    leadTime: '30–35 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), WHO-GMP (targeted for pharma lines).',
    applications: ['Pharmacy retail chains', 'Government tender procurement', 'Institutional hospitals'],
  },
  {
    slug: 'active-pharmaceutical-ingredients',
    name: 'Active Pharmaceutical Ingredients',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '2941.90',
    grade: 'BP/USP/EP compendial monograph conforming grades with DMF support',
    moq: '25 kg',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), WHO-GMP (targeted for pharma lines).',
    applications: ['Formulation manufacturing', 'Contract pharmaceutical synthesis'],
  },
  {
    slug: 'ayurvedic-herbal-extracts',
    name: 'Ayurvedic & Herbal Extracts',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '1302.19',
    grade: 'Standardised botanical extracts, verified marker compounds HPLC/UV',
    moq: '50 kg',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Nutraceutical brands', 'Phytocosmetics', 'Alternative wellness retail'],
  },
  {
    slug: 'surgical-disposables',
    name: 'Surgical Disposables',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '9018.90',
    grade: 'EO-sterilised, medical grade polymer, single-use hospital supplies',
    moq: '5,000 units',
    leadTime: '20–30 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Operating rooms', 'Trauma centres', 'Outpatient surgical clinics'],
  },
  {
    slug: 'nutraceuticals-supplements',
    name: 'Nutraceuticals & Supplements',
    categorySlug: 'healthcare-pharmaceuticals',
    status: 'live',
    hsCode: '2106.90',
    grade: 'Finished gummies, effervescent tablets, powders, private label ready',
    moq: '5,000 units',
    leadTime: '25–30 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), WHO-GMP (targeted for pharma lines).',
    applications: ['Dietary supplement brands', 'Sports nutrition distribution'],
  },

  // ── Building Materials (Standardized 1 × 20\' FCL MOQ) ───────────────────
  {
    slug: 'vitrified-ceramic-tiles',
    name: 'Vitrified & Ceramic Tiles',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6907.21',
    grade: 'GVT/PGVT 600×600, 600×1200, 800×1600 mm, nano polished & matte',
    moq: '1 × 20\' FCL (~15,000 sq.ft)',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Residential flooring', 'Commercial lobby facades', 'Retail store fit-out'],
  },
  {
    slug: 'sanitaryware',
    name: 'Sanitaryware',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6910.10',
    grade: 'Vitreous china, rimless one-piece water closets, wall-hung basins',
    moq: '1 × 20\' FCL (~15,000 sq.ft)',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'mundra',
    applications: ['Residential developments', 'Hotels & hospitality', 'Commercial developments'],
  },
  {
    slug: 'marble-granite-slabs',
    name: 'Marble & Granite Slabs',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6802.91',
    grade: 'Gang-sawn & polished slabs, 20–30 mm calibrated thickness',
    moq: '1 × 20\' FCL (~15,000 sq.ft)',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Kitchen countertops', 'Architectural flooring', 'Monumental cladding'],
  },
  {
    slug: 'engineered-quartz',
    name: 'Engineered Quartz',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '6810.99',
    grade: '93% pure quartz crystal bound with polymer resin, jumbo slabs',
    moq: '1 × 20\' FCL (~15,000 sq.ft)',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'mundra',
    applications: ['Kitchen surfaces', 'Bathroom vanities', 'Commercial bartops'],
  },
  {
    slug: 'cement-clinker',
    name: 'Cement & Clinker',
    categorySlug: 'building-materials',
    status: 'live',
    hsCode: '2523.29',
    grade: 'OPC 43/53 Grade, bulk breakbulk or 50kg export bags in sling',
    moq: '1 × 20\' FCL (~15,000 sq.ft)',
    leadTime: '10–15 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Civil infrastructure', 'Ready-mix concrete batching', 'Concrete blocks'],
  },

  // ── Agriculture & Food (14 Lines with Updated MOQs) ──────────────────────
  {
    slug: 'cumin-whole-spices',
    name: 'Cumin Seeds (Jeera)',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0909.31',
    grade: 'Unjha machine cleaned & Sortex 99%–99.5% purity, whole seeds',
    moq: '10 MT',
    leadTime: '10–14 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    certificationNote: 'Pending certification — FSSAI (target 2027-Q1), Spice Board (target 2026-Q4).',
    applications: ['Spice grinding & blending', 'Food processing', 'Consumer retail packaging'],
  },
  {
    slug: 'basmati-non-basmati-rice',
    name: 'Basmati & Non-Basmati Rice',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1006.30',
    grade: '1121 / 1509 Steam, Sella & Golden Sella, max 12% moisture',
    moq: '25 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Wholesale grain trade', 'Supermarket retail bags', 'Foodservice distribution'],
  },
  {
    slug: 'pulses-lentils',
    name: 'Pulses & Lentils',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0713.40',
    grade: 'Chickpeas (Kabuli), Toor Dal, Moong & Urad, machine cleaned',
    moq: '20 MT',
    leadTime: '12–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Dry grocery distribution', 'Canned food canning', 'Flour milling'],
  },
  {
    slug: 'groundnuts',
    name: 'Groundnuts (Peanuts)',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1202.42',
    grade: 'Java & Bold varieties, 50/60 – 80/90 counts, aflatoxin tested',
    moq: '20 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'kandla',
    applications: ['Peanut butter manufacture', 'Oil expelling', 'Snack roasting'],
  },
  {
    slug: 'sesame-seeds',
    name: 'Sesame Seeds',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1207.40',
    grade: 'Natural white & auto-hulled 99.9% Sortex cleaned, min 50% oil content',
    moq: '10 MT',
    leadTime: '12–16 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Tahini production', 'Bakery toppings', 'Sesame oil extraction'],
  },
  {
    slug: 'castor-oil-derivatives',
    name: 'Castor Oil & Derivatives',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1515.30',
    grade: 'Commercial, BSS & First Special Grade (FSG), refined technical',
    moq: '20 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'kandla',
    applications: ['Oleochemical synthesis', 'Industrial lubricants', 'Polyurethane polyols'],
  },
  {
    slug: 'black-tea',
    name: 'Black & Orthodox Tea',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0902.40',
    grade: 'Assam & Nilgiri CTC / Orthodox, BOP, BP, Dust & Fannings',
    moq: '1 MT',
    leadTime: '12–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Tea bag blending', 'Commercial iced tea bottling', 'Retail specialty tea'],
  },
  {
    slug: 'green-coffee-beans',
    name: 'Green Coffee Beans',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0901.11',
    grade: 'Arabica Plantation A/AA & Robusta Cherry AB, washed/unwashed',
    moq: '5 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Commercial coffee roasters', 'Instant coffee extraction'],
  },
  {
    slug: 'refined-sugar',
    name: 'Refined Cane Sugar (ICUMSA 45)',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1701.99',
    grade: 'ICUMSA 45 sparkling white crystal, polarization 99.8% min',
    moq: '25 MT',
    leadTime: '10–15 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Beverage bottling', 'Confectionery', 'Direct food retail'],
  },
  {
    slug: 'fresh-fruits-vegetables',
    name: 'Fresh Fruits & Vegetables',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0804.50',
    grade: 'Export grade Kesar/Alphonso mangoes, fresh red onions, green cavendish',
    moq: '1 × 40\' Reefer',
    leadTime: '7–10 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Fresh produce wholesale', 'Supermarket retail', 'HORECA distributors'],
  },
  {
    slug: 'processed-dehydrated-foods',
    name: 'Processed & Dehydrated Foods',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0712.90',
    grade: 'Dehydrated white/red onion flakes, minced garlic, vegetable powders',
    moq: '5 MT',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'mundra',
    applications: ['Instant soups & noodles', 'Seasoning blends', 'Ready-to-eat meals'],
  },
  {
    slug: 'turmeric-whole-spices',
    name: 'Turmeric & Whole Spices',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '0910.30',
    grade: 'Salem & Nizamabad fingers, Curcumin content 2.5%–4.5% min',
    moq: '10 MT',
    leadTime: '12–16 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Spice extraction', 'Nutraceutical curcumin isolation', 'Culinary retail'],
  },
  {
    slug: 'milling-wheat',
    name: 'Milling & Durum Wheat',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '1001.99',
    grade: 'Machine cleaned hard wheat, protein min 12%, max 12% moisture',
    moq: '25 MT',
    leadTime: '12–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'kandla',
    applications: ['Flour mills', 'Pasta & semolina manufacturing', 'Bakeries'],
  },
  {
    slug: 'soyabean-meal',
    name: 'Soyabean Meal & Oilseeds',
    categorySlug: 'agriculture-food',
    status: 'live',
    hsCode: '2304.00',
    grade: 'Dehulled & toasted non-GMO soya meal, protein min 48%, fat max 1.5%',
    moq: '20 MT',
    leadTime: '14–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'kandla',
    applications: ['Animal feed compounders', 'Poultry nutrition', 'Aquafeed formulation'],
  },

  // ── Dedicated Seafood Section (5 Lines) ──────────────────────────────────
  {
    slug: 'frozen-shrimp-vannamei',
    name: 'Frozen Vannamei Shrimp',
    categorySlug: 'seafood',
    status: 'live',
    hsCode: '0306.17',
    grade: 'Head-On (HOSO), Headless (HLSO), PD & PUD, 16/20 to 51/60 counts',
    moq: '1 × 40\' Reefer',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Seafood wholesalers', 'Restaurant supply distributors', 'Retail supermarket packs'],
  },
  {
    slug: 'frozen-fish-varieties',
    name: 'Frozen Marine Fish (Ribbon & Croaker)',
    categorySlug: 'seafood',
    status: 'live',
    hsCode: '0303.89',
    grade: 'Whole round, blast frozen, sorted by size (100–200g, 200–300g, 300g+)',
    moq: '1 × 40\' Reefer',
    leadTime: '14–18 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Fish processors', 'International wholesale markets', 'Canning factories'],
  },
  {
    slug: 'squid-cuttlefish',
    name: 'Frozen Squid & Cuttlefish',
    categorySlug: 'seafood',
    status: 'live',
    hsCode: '0307.43',
    grade: 'Whole round, cleaned tubes, rings & tentacles, IQF & shatterpack',
    moq: '1 × 40\' Reefer',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Calamari production', 'Foodservice distributors', 'Retail frozen seafood'],
  },
  {
    slug: 'dried-marine-seafood',
    name: 'Dried Seafood Varieties',
    categorySlug: 'seafood',
    status: 'live',
    hsCode: '0305.59',
    grade: 'Sun-dried and salt-cured anchovy, baby shrimp, ribbon fish, dried fish maw',
    moq: '5 MT',
    leadTime: '12–16 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Ethnic food retailers', 'Soup & broth manufacturers', 'Asian export markets'],
  },
  {
    slug: 'processed-surimi-seafood',
    name: 'Processed Seafood & Surimi',
    categorySlug: 'seafood',
    status: 'live',
    hsCode: '1604.20',
    grade: 'Frozen refined surimi block, crab sticks, breaded fish fillets',
    moq: '5 MT',
    leadTime: '18–24 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Prepared food lines', 'School & institutional catering', 'Deli counters'],
  },

  // ── Engineering & Heavy Machinery (All MOQ: 1 unit) ──────────────────────
  {
    slug: 'industrial-pumps-motors',
    name: 'Industrial Centrifugal Pumps & Motors',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8413.70',
    grade: 'Centrifugal & submersible end-suction, IE2–IE4 high efficiency electric motors',
    moq: '1 unit',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Municipal waterworks', 'Irrigation schemes', 'Chemical & process plants'],
  },
  {
    slug: 'valves-pipe-fittings',
    name: 'Industrial Valves & Process Fittings',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8481.80',
    grade: 'Forged & cast steel, ball, gate, globe, check valves, ANSI 150–600#',
    moq: '1 unit',
    leadTime: '15–20 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Refinery piping', 'Fire sprinkler grids', 'High-pressure steam lines'],
  },
  {
    slug: 'auto-machine-components',
    name: 'Engineered Auto & Machine Components',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8708.99',
    grade: 'Forged, cast, heat-treated & CNC finish-machined to buyer drawing tolerances',
    moq: '1 unit',
    leadTime: '20–25 days',
    incoterms: ['FOB', 'CIF', 'EXW'],
    portSlug: 'nhava-sheva',
    applications: ['Tier-1 OEM automotive assembly', 'Earthmoving gearbox lines', 'Heavy machine assemblies'],
  },
  {
    slug: 'industrial-fasteners',
    name: 'High-Tensile Industrial Fasteners',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '7318.15',
    grade: 'DIN 931/933, ISO 4014, structural grade 8.8, 10.9 & 12.9 with zinc flake coat',
    moq: '1 unit',
    leadTime: '12–16 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Wind turbine towers', 'Bridges & pre-engineered steel buildings', 'Heavy vehicle chassis'],
  },
  {
    slug: 'machine-tools',
    name: 'CNC & VMC Machine Tools',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8457.10',
    grade: '3-Axis, 4-Axis & 5-Axis Vertical Machining Centres, heavy bed CNC slant lathes',
    moq: '1 unit',
    leadTime: '30–40 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'nhava-sheva',
    applications: ['Precision tooling rooms', 'Aerospace machining jobbers', 'Die & mold manufacturing'],
  },
  {
    slug: 'diesel-power-generators',
    name: 'Heavy-Duty Diesel Power Generators',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8502.11',
    grade: '25 kVA – 1250 kVA soundproof acoustic canopy, CPCB IV+ compliant diesel engines',
    moq: '1 unit',
    leadTime: '20–30 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Data centers', 'Commercial towers', 'Remote mining & construction sites'],
  },
  {
    slug: 'earthmoving-construction-equipment',
    name: 'Earthmoving & Construction Equipment',
    categorySlug: 'engineering-industrial',
    status: 'live',
    hsCode: '8429.52',
    grade: 'Heavy hydraulic crawler excavators, backhoe loaders, pneumatic soil compactors',
    moq: '1 unit',
    leadTime: '25–35 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'nhava-sheva',
    applications: ['Highway construction', 'Open-cast quarrying', 'Commercial land development'],
  },

  // ── Furniture & Contract Interiors (All MOQ: 1 × 20\' FCL) ───────────────
  {
    slug: 'solid-wood-hospitality-furniture',
    name: 'Solid Wood Hospitality Furniture',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9403.60',
    grade: 'FSC teak, sheesham & white oak, kiln-dried, commercial PU lacquer finish',
    moq: '1 × 20\' FCL',
    leadTime: '35–45 days',
    incoterms: ['FOB', 'CIF', 'DDP'],
    portSlug: 'mundra',
    applications: ['Hotel guestroom casegoods', 'Resort suites', 'Boutique hospitality projects'],
  },
  {
    slug: 'modular-office-workstations',
    name: 'Modular Office Workstations & Desks',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9403.10',
    grade: 'E1 certified moisture-resistant engineered wood, powder-coated steel loop legs',
    moq: '1 × 20\' FCL',
    leadTime: '30–40 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Corporate headquarters', 'Co-working complexes', 'Institutional IT campuses'],
  },
  {
    slug: 'contract-dining-chairs',
    name: 'Commercial Dining & Accent Chairs',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9401.71',
    grade: 'BIFMA structural standards, heavy-gauge steel frame & high-density foam upholstery',
    moq: '1 × 20\' FCL',
    leadTime: '25–35 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Restaurant chains', 'Conference banqueting', 'Food court fit-outs'],
  },
  {
    slug: 'outdoor-patio-furniture',
    name: 'Contract Outdoor & Patio Furniture',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9401.79',
    grade: 'UV-stabilized synthetic polyethylene wicker on marine-grade aluminium frames',
    moq: '1 × 20\' FCL',
    leadTime: '30–40 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Poolside terraces', 'Outdoor dining venues', 'Beachfront hotel verandas'],
  },
  {
    slug: 'upholstered-lounge-sofas',
    name: 'Upholstered Sofas & Lounge Seating',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9401.61',
    grade: 'Seasoned hardwood subframes, pocket springs, 35-density foam, commercial velvet & leatherette',
    moq: '1 × 20\' FCL',
    leadTime: '30–45 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Airport executive lounges', 'Hotel lobbies', 'Executive office seating'],
  },
  {
    slug: 'architectural-fitted-joinery',
    name: 'Architectural Joinery & Fitted Millwork',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9403.50',
    grade: 'Bespoke architectural wall cladding, reception desks & fitted wardrobes, Blum hardware',
    moq: '1 × 20\' FCL',
    leadTime: '35–50 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Luxury residential developments', 'Corporate reception areas', 'High-end retail fit-out'],
  },
  {
    slug: 'acoustic-wall-partitions',
    name: 'Acoustic Wall Panels & Partitions',
    categorySlug: 'furniture-interiors',
    status: 'live',
    hsCode: '9403.89',
    grade: 'NRC 0.85+ rated recycled PET felt & micro-perforated timber veneer baffles',
    moq: '1 × 20\' FCL',
    leadTime: '25–35 days',
    incoterms: ['FOB', 'CIF'],
    portSlug: 'mundra',
    applications: ['Auditoriums', 'Broadcast studios', 'Corporate boardrooms', 'Open-plan offices'],
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
  ],
};

/* ------------------------------------------------------------------------ */
/* Selectors — the ONLY way components reach into these arrays.              */
/* ------------------------------------------------------------------------ */

export const totalIndustries = (): number => INDUSTRIES.length;
export const liveIndustries = (): Industry[] => INDUSTRIES.filter((i) => i.status === 'live');
export const onboardingIndustries = (): Industry[] =>
  INDUSTRIES.filter((i) => i.status === 'onboarding');

export const totalCategories = (): number => CATEGORIES.length;
export const liveCategories = (): Category[] => CATEGORIES.filter((c) => c.status === 'live');
export const onboardingCategories = (): Category[] =>
  CATEGORIES.filter((c) => c.status === 'onboarding');

export const totalProducts = (): number => PRODUCTS.length;
export const liveProducts = (): Product[] => PRODUCTS.filter((p) => p.status === 'live');
export const onboardingProducts = (): Product[] =>
  PRODUCTS.filter((p) => p.status === 'onboarding');

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
