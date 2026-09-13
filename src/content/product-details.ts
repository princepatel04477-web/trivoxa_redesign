/**
 * src/content/product-details.ts
 * ---------------------------------------------------------------------------
 * Commercial specifications, technical grade definitions, export documentation,
 * and packing standards for all 25 catalogue products.
 *
 * Sourced from the taxonomy and trade compliance requirements.
 * Prompt 09: Plain-language grade notation analysis and destination-market documentation.
 */
import { PRODUCTS, type Product } from './taxonomy';

export interface ProductDetailSpec {
  gradeExplanation: string;
  documentation: string[];
  packaging: string;
  inspectionParameters: string[];
}

export const PRODUCT_DETAILS: Record<string, ProductDetailSpec> = {
  // ── Textile & Apparel ────────────────────────────────────────────────────
  'cotton-yarn': {
    gradeExplanation:
      'Ne 20–40 represents English cotton count indicating yarn fineness (hanks of 840 yards per pound). Combed yarns pass through fine combs removing short fibres (<1 inch) and foreign matter for high-speed weaving and knitting. Carded options retain standard fiber distribution for heavier fabrics.',
    documentation: [
      'Certificate of Origin (Non-preferential / Preferential COO)',
      'Commercial Invoice & Detailed Packing List with Cone Numbers',
      'Mill Quality Certificate (CSP & Uster % test reports)',
      'Fumigation Certificate for timber pallets (ISPM 15)',
    ],
    packaging: '1.89 kg / 2.08 kg paper cones packed in 24-cone corrugated cartons or PP woven bags with palletised shrink-wrap.',
    inspectionParameters: ['Count Strength Product (CSP)', 'Evenness (Uster % CVm)', 'Thin/Thick places & Neps', 'Hairiness index'],
  },
  'cotton-denim-fabric': {
    gradeExplanation:
      'GSM 240–400 translates to 7–12 oz/sq.yd commercial denim weight range. Woven on high-speed airjet looms using rope-dyed indigo warp and unbleached cotton weft. Sulphur topping or bottoming applied for specific cast effects (red, green, or black cast) with wash-down consistency.',
    documentation: [
      'Certificate of Origin (COO)',
      'Mill Inspection Certificate with shade grading and roll lengths',
      'OEKO-TEX Standard 100 conformance declaration (where requested)',
      'ISPM 15 Fumigation Certificate for wooden pallet bases',
    ],
    packaging: 'Rolls of 100–120 metres wrapped in twin-layer polyethylene film with edge protectors on heavy-duty wooden skids.',
    inspectionParameters: ['4-Point fabric inspection system', 'Skewing / Bowing percentage', 'Tear & tensile strength', 'Shade continuity roll-to-roll'],
  },
  'home-textiles': {
    gradeExplanation:
      '200–600 Thread Count (TC) represents total threads per square inch in single-ply or two-ply construction. Higher counts (400–600 TC) use long-staple combed cotton for a sateen or percale handfeel, pre-shrunk and mercerised for colour retention across industrial laundry cycles.',
    documentation: [
      'Certificate of Origin (COO)',
      'Textile testing lab report (colour fastness, tensile, dimensional stability)',
      'Retail barcoding & destination-market carton marking compliance declaration',
      'Phytosanitary inspection clearance where destination quarantine requires',
    ],
    packaging: 'Individual retail insert PVC/biodegradable polybag, packed in 5-ply master cartons with silica desiccant pouches.',
    inspectionParameters: ['Dimensional stability to washing', 'Colour fastness to light and laundering', 'Seam slippage and hem integrity', 'Needle detection clearance'],
  },
  'readymade-apparel': {
    gradeExplanation:
      'Manufactured precisely to buyer-supplied tech packs, measurement charts, and bill of materials (BOM). Stitch density specified at 10–14 SPI (stitches per inch). Seams are overlocked and twin-needle reinforced with pre-shrunk interlinings and color-matched OEKO-TEX compliant trims.',
    documentation: [
      'Certificate of Origin (COO)',
      'Full factory audit / SEDEX SMETA summary where required by retail compliance',
      'Azo-free dye compliance declaration',
      'Metal and needle detection certificate per carton',
    ],
    packaging: 'Garment on hanger (GOH) or individual flat-pack in polybags, master export cartons sealed with tamper-evident tape.',
    inspectionParameters: ['AQL 1.5 / 2.5 standard pre-shipment inspection', 'Measurement tolerance against tech pack', 'Symmetric shade matching', 'Pull test on buttons and snaps (min 90 N)'],
  },
  'technical-non-woven-textiles': {
    gradeExplanation:
      'Spunbond and meltblown polypropylene media engineered from 15 to 150 GSM. Spunbond layers deliver tensile matrix stability and puncture resistance; meltblown micro-fibres provide bacterial and particulate barrier properties (BFE/PFE) for hygiene, medical, and filtration lines.',
    documentation: [
      'Certificate of Origin (COO)',
      'Technical Data Sheet (TDS) confirming tensile, elongation, and hydrostatic head',
      'Food-contact or skin-safety biocompatibility statements per grade',
      'ISPM 15 heat-treatment stamp on transport pallets',
    ],
    packaging: 'Continuous rolls with core diameter 76 mm (3 inch), enclosed in moisture-barrier stretch wrap.',
    inspectionParameters: ['Air permeability (Frazer rating)', 'Hydrostatic water resistance (cm H2O)', 'Tensile strength (MD / CD)', 'Bacterial Filtration Efficiency (BFE)'],
  },

  // ── Healthcare & Pharmaceuticals ─────────────────────────────────────────
  'generic-formulations': {
    gradeExplanation:
      'Solid and liquid finished dosage forms formulated in compliance with cGMP standards. Finished products match pharmacopoeial monographs (USP, BP, or IP) with documented dissolution profiles, content uniformity (95–105%), and stability data adhering to ICH climate zones (Zone IVb: 30°C / 75% RH).',
    documentation: [
      'Certificate of Analysis (COA) per batch signed by Qualified Person',
      'Certificate of Pharmaceutical Product (CPP) / Free Sale Certificate (FSC)',
      'Batch Manufacturing Record (BMR) executive release summary',
      'Commercial invoice, packing list, and temp-log sensor documentation for transit',
    ],
    packaging: 'Alu-Alu or PVC/PVDC blister strips in unit carton with multilingual patient leaflets (PIL), packed in heavy export shippers.',
    inspectionParameters: ['Disintegration & dissolution profile', 'Assay & related substances', 'Microbial limit testing', 'Integrity of tamper-evident seals'],
  },
  'active-pharmaceutical-ingredients': {
    gradeExplanation:
      'Bulk active drug substances produced to GMP and pharmacopoeial monograph specifications. Characterised by specified particle size distribution (micronised or standard), high chromatographic purity (HPLC assay >98.5%), and residual solvent levels strictly within ICH Q3C guidelines.',
    documentation: [
      'Batch Certificate of Analysis (COA) detailing HPLC assay and impurity profile',
      'Drug Master File (DMF) open-part access documentation',
      'ICH Q3C Residual Solvents & ICH Q3D Elemental Impurities statements',
      'Dangerous Goods (DG) Declaration & SDS where chemical classification requires',
    ],
    packaging: 'Double food-grade antistatic polyethylene liner inside tamper-evident fiber drums or UN-certified steel drums.',
    inspectionParameters: ['High Performance Liquid Chromatography (HPLC) assay', 'Related substances & single largest unknown impurity', 'Loss on drying (LOD) & water content (Karl Fischer)', 'Residual solvents by GC-HS'],
  },
  'ayurvedic-herbal-extracts': {
    gradeExplanation:
      'Standardised botanical extracts with guaranteed active phyto-chemical marker concentrations (e.g. Curcuminoids >95%, Withanolides >2.5–5%, Boswellic acids >65%). Derived via water or ethanol/water extraction without non-permitted chemical carriers, vacuum dried to low moisture.',
    documentation: [
      'Certificate of Analysis (COA) with active HPLC/spectrophotometric marker assay',
      'Heavy metal analysis report (Lead, Arsenic, Cadmium, Mercury via ICP-MS)',
      'Pesticide residue clearance report (USP <561> compliant)',
      'Certificate of Origin and Non-GMO / Non-irradiated declaration',
    ],
    packaging: '25 kg vacuum-sealed poly-lined HDPE drums with tamper-evident band.',
    inspectionParameters: ['Active marker quantification (HPLC / HPTLC)', 'Microbiological limits (TAMC, TYMC, Salmonella, E. coli)', 'Heavy metal ICP-MS quantification', 'Residual solvent gas chromatography'],
  },
  'medical-consumables': {
    gradeExplanation:
      'Single-use medical devices and consumables produced from medical-grade virgin polymers (PP, PVC, ABS). Sterilised using Ethylene Oxide (EtO) or Gamma irradiation to a Sterility Assurance Level (SAL) of 10^-6, non-pyrogenic and non-toxic according to ISO 10993 biocompatibility.',
    documentation: [
      'Certificate of Conformance (COC) and Sterilisation Certificate per lot',
      'Biocompatibility test summary (ISO 10993)',
      'Commercial invoice, packing list, and COO',
      'Product packaging labeling with CE / ISO 13485 registration references',
    ],
    packaging: 'Individual peel-open medical pouch (Tyvek or paper/film blister) in 100-count dispenser boxes, packed in 5-ply export shippers.',
    inspectionParameters: ['Pouch seal peel strength and dye-penetration leak test', 'Residual ethylene oxide gas analysis (<4 ppm)', 'Sterility testing (USP <71>)', 'Particulate contamination inspection'],
  },
  'surgical-instruments': {
    gradeExplanation:
      'Forged from surgical-grade martensitic and austenitic stainless steel alloys (AISI 410, 420, 316). Heat-treated to Rockwell hardness (HRC 48–54) for lasting cutting edges and spring tension, followed by ultrasonic cleaning and passivation (ASTM A967) for corrosion resistance.',
    documentation: [
      'Material Test Certificate (MTC) stating steel alloy chemical analysis',
      'Passivation and boil-test corrosion inspection report',
      'Certificate of Origin (COO)',
      'Dimensional conformance inspection sheet against design blueprints',
    ],
    packaging: 'Ultrasonically cleaned and individually wrapped in vapor-corrosion-inhibiting (VCI) paper in foam-lined boxes.',
    inspectionParameters: ['Boil test and copper sulfate test for corrosion resistance', 'Rockwell C hardness test (ASTM E18)', 'Serrated edge and tip alignment under 10x magnification', 'Smooth hinge and ratchet action'],
  },

  // ── Building Materials ───────────────────────────────────────────────────
  'porcelain-vitrified-tiles': {
    gradeExplanation:
      'ISO 13006 / EN 14411 Group BIa porcelain with water absorption E ≤ 0.5%. Hydraulic pressed at >400 bar and fired in roller kilns at 1200°C+. Rectified edges with tight dimensional tolerances (±0.1%) and glaze wear ratings from PEI III (light residential) to PEI V (heavy commercial).',
    documentation: [
      'Certificate of Origin (COO)',
      'Type Test Report per ISO 10545 (water absorption, modulus of rupture, chemical resistance)',
      'CE Declaration of Performance (DoP) for European consignments',
      'ISPM 15 Fumigation Certificate for wooden transport pallets',
    ],
    packaging: 'Corrugated cartons with corner protectors, strapped with PET bands onto heavy-duty heat-treated wooden pallets.',
    inspectionParameters: ['Water absorption test (vacuum method)', 'Modulus of rupture (min 35 N/mm2) & breaking strength', 'Planarity, straightness of sides, and rectangularity', 'Shade and calibre grading per pallet'],
  },
  'sanitaryware-bath-fittings': {
    gradeExplanation:
      'Vitreous china sanitaryware fired at 1220°C with water absorption below 0.5%. Glazed with anti-bacterial zircon glaze (>0.8 mm thickness) for smooth flush mechanics. Bath fittings cast from CW617N / IS 319 brass alloy with multi-layer nickel-chromium electroplating (>12 microns).',
    documentation: [
      'Certificate of Origin (COO)',
      'Hydraulic flush performance and load test certificates per EN 997 / ASME A112.19.2',
      'Neutral Salt Spray (NSS) corrosion test certificate (>200 hours) for brass fittings',
      'Fumigation certificate for export crating',
    ],
    packaging: 'Molded EPS / honeycomb board inside 5-ply cartons, strapped onto wooden pallets with plastic edge protectors.',
    inspectionParameters: ['400 kg static load resistance test for wall-hung pans', 'Hydrostatic pressure test (16 bar for 60 seconds) on brass faucets', 'Salt spray corrosion testing', 'Crazing resistance in autoclave'],
  },
  'natural-stone-slabs': {
    gradeExplanation:
      'First-choice gangsaw slabs of Indian granite (Black Galaxy, Tan Brown, Kashmir White) and marble. Calibrated thickness tolerance (20 mm / 30 mm ±1 mm). Polished with multi-head line polishers to a gloss meter reading of >85 GU, epoxy-resin treated on the back with fiberglass mesh where required.',
    documentation: [
      'Certificate of Origin (COO)',
      'Quarry and material specification report (density, water absorption, compressive strength)',
      'Gangsaw cutting tally sheet with exact slab measurements in sq. metres',
      'ISPM 15 certified heavy-timber A-frame packing certificate',
    ],
    packaging: 'Gangsaw slabs bundled in custom heavy-duty ISPM 15 timber A-frames with steel rod bracing, loaded into 20ft box containers.',
    inspectionParameters: ['Gloss unit measurement (minimum 85 GU)', 'Thickness consistency along perimeter and centre', 'Surface fissure and dry-crack inspection', 'Fibre-mesh adhesion strength'],
  },
  'engineered-quartz': {
    gradeExplanation:
      'Compacted quartz composite slabs produced from 93% pure crushed quartz crystals and 7% polymer resins with colour pigments. Formed under vacuum vibro-compression (>100 tonnes) and thermal curing. Scratch resistant (Mohs hardness 6–7), non-porous, and stain resistant without sealers.',
    documentation: [
      'Certificate of Origin (COO)',
      'NSF 51 food zone safety certificate declaration',
      'Physical testing sheet: stain resistance, flexural strength, thermal shock',
      'ISPM 15 heat-treated wooden bundle crating documentation',
    ],
    packaging: 'Finished slabs bundled vertically in heavy wooden A-frames with foam separators and container strapping.',
    inspectionParameters: ['Flexural strength (>40 MPa)', 'Chemical and household stain resistance (24-hour spot test)', 'Uniform color distribution without resin pooling', 'Flatness tolerance across 3200x1600 mm slab'],
  },
  'cement-clinker': {
    gradeExplanation:
      'Ordinary Portland Cement (OPC 43/53 grade per IS 269 / EN 197-1 CEM I) and high-quality grey portland clinker. Calculated Bogue phase composition: C3S 55–60%, C2S 15–20%, C3A 6–9%, ensuring rapid strength gain, controlled initial setting time (min 30 mins), and low alkali reactivity.',
    documentation: [
      'Manufacturer Mill Test Certificate (MTC) with 3-day, 7-day, and 28-day compressive results',
      'Chemical analysis certificate: loss on ignition (LOI), insoluble residue, SO3, MgO',
      'Certificate of Origin (COO)',
      'Draft survey certificate for bulk vessel loading at port',
    ],
    packaging: '50 kg woven polypropylene (WPP) bags with PE inner liner in 1.5–2.0 MT sling jumbo bags, or bulk in vessel hold.',
    inspectionParameters: ['Compressive strength development at 3, 7, and 28 days', 'Blaine air permeability fineness (min 280 m2/kg)', 'Soundness (Le Chatelier expansion <10 mm)', 'Chemical composition limits per ASTM C150 / EN 197'],
  },

  // ── Agriculture & Food ───────────────────────────────────────────────────
  'whole-ground-spices': {
    gradeExplanation:
      'Machine-cleaned and steam-sterilised spices from Gujarat and South India (Cumin seed, Coriander seed, Fennel seed, Turmeric fingers, and red Chilli). Purity graded to 99% or 99.5% by Sortex colour sorters. Moisture strictly controlled (<9%) to inhibit microbial growth.',
    documentation: [
      'Phytosanitary Certificate issued by Indian DPPQ&S',
      'Spices Board of India Certificate of Inspection and Origin',
      'Certificate of Analysis: aflatoxin (B1+total), moisture, volatile oil, Salmonella clearance',
      'Fumigation Certificate (Methyl Bromide or Aluminium Phosphide)',
    ],
    packaging: '25 kg / 50 kg multi-wall paper bags or food-grade PP bags with moisture-barrier liner; 1 MT big bags on request.',
    inspectionParameters: ['Purity percentage (Sortex sort purity ≥99.5%)', 'Moisture content determination', 'Volatile oil content (ml/100g)', 'Pesticide residue testing against EU/FDA MRLs'],
  },
  'hulled-sesame-seeds': {
    gradeExplanation:
      'Auto-sorted premium white sesame seeds (Sesamum indicum) hulled through a chemical-free mechanical wet or dry hulling process. Graded by purity from 99.95% to 99.98% using multi-camera optical sorters. Free of bitter husks, highly uniform, with minimum 50% natural oil content.',
    documentation: [
      'Phytosanitary Certificate',
      'Certificate of Analysis: FFA (<1.5%), moisture (<4.5%), purity (≥99.95%)',
      'Microbiological test report certifying absence of Salmonella (in 375g) and E. coli',
      'Certificate of Origin (COO)',
    ],
    packaging: '25 kg / 50 kg multi-ply paper bags or woven bags with PE inner lining, sealed and palletised with desiccant.',
    inspectionParameters: ['Optical Sortex purity check', 'Free Fatty Acids (FFA) percentage', 'Moisture balance assay', 'Foreign matter and discoloured seed count'],
  },
  'shelled-groundnuts': {
    gradeExplanation:
      'Bold and Java type peanut kernels originating from Saurashtra, Gujarat. Graded by counts per ounce (Bold 38/42, 40/50; Java 50/60). Double-cleaned, destoned, and Sortex sorted to remove shrivelled and discoloured kernels. Aflatoxin controlled through dry storage protocols.',
    documentation: [
      'APEDA Export Certificate and Phytosanitary Certificate',
      'Aflatoxin Analysis Certificate issued by NABL accredited lab (ELISA / HPLC)',
      'Certificate of Origin (COO)',
      'Fumigation Certificate for containerized agricultural cargo',
    ],
    packaging: '25 kg / 50 kg natural jute bags or vacuum-sealed PP bags loaded into dry 20ft containers with dry-bag desiccants.',
    inspectionParameters: ['Aflatoxin B1 and total aflatoxin (parts per billion)', 'Kernel count per ounce', 'Damaged, split, and broken kernel percentages', 'Moisture content (max 7.0%)'],
  },
  'castor-oil-derivatives': {
    gradeExplanation:
      'Extracted from Gujarat castor beans — the global center of castor production. Commercial grades include First Special Grade (FSG), Cold Pressed Oil, and chemical derivatives: Hydrogenated Castor Oil (HCO / Castor Wax), 12-Hydroxystearic Acid (12-HSA), and Sebacic Acid.',
    documentation: [
      'Certificate of Analysis (COA): acid value, iodine value, hydroxyl value, colour Gardner',
      'Non-hazardous Chemical Declaration & Safety Data Sheet (SDS)',
      'Certificate of Origin (COO)',
      'TDI / Tank clean inspection certificate for bulk liquid container shipments',
    ],
    packaging: '200 kg coated steel drums, 1,000 litre IBC totes, or 20–24 MT flexitanks inside 20ft containers; flaked grades in 25 kg bags.',
    inspectionParameters: ['Acid value and Free Fatty Acids (FFA)', 'Hydroxyl value and Ricinoleic acid content', 'Gardner colour scale reading', 'Moisture and volatile matter (Karl Fischer)'],
  },
  'processed-iqf-foods': {
    gradeExplanation:
      'Individual Quick Frozen (IQF) fruits and vegetables (sweet corn, green peas, mango chunks, diced vegetables) frozen at -40°C in fluidised bed freezers within hours of harvest. Core product temperature maintained at -18°C or colder throughout storage and shipping to preserve cellular structure.',
    documentation: [
      'Phytosanitary Certificate',
      'Certificate of Analysis with complete microbiological profiling and pesticide MRL screen',
      'Continuous Cold-Chain Temperature Data Logger download log from origin to port',
      'Certificate of Origin (COO)',
    ],
    packaging: '10 kg / 20 kg poly-lined export cartons, palletised with thermal blankets inside reefer containers (40ft High Cube).',
    inspectionParameters: ['Continuous temperature log integrity (-18°C threshold)', 'Microbial criteria (Listeria, Salmonella, Coliforms)', 'Clumping and freezer burn visual evaluation', 'Brix reading (sugar level for fruits)'],
  },

  // ── Engineering & Industrial ─────────────────────────────────────────────
  'industrial-pumps-motors': {
    gradeExplanation:
      'Centrifugal process pumps, submersible pumps, and three-phase squirrel cage induction motors (IE2 / IE3 energy efficiency standards per IEC 60034). Castings in graded grey cast iron (FG 260) or stainless steel CF8M. Designed for continuous duty (S1) with IP55 / IP65 enclosure protection.',
    documentation: [
      'Factory Inspection & Performance Curve Test Certificate (Head, Flow, Efficiency, NPSHr)',
      'Material Test Certificate (MTC) EN 10204 3.1 for pressure-containing castings',
      'Routine electrical insulation and high-voltage resistance test sheets',
      'Certificate of Origin (COO) and CE declaration of conformity (where applicable)',
    ],
    packaging: 'Vibration-isolated wooden crates with vapour-corrosion-inhibiting (VCI) interior lining and heavy metal banding.',
    inspectionParameters: ['Hydrostatic pump casing pressure test (1.5x working pressure)', 'Vibration severity testing (ISO 10816)', 'Full-load electrical current draw and winding temperature rise', 'Impeller dynamic balancing (ISO 1940 Grade G2.5)'],
  },
  'valves-pipe-fittings': {
    gradeExplanation:
      'Industrial gate, globe, check, ball, and butterfly valves manufactured to API 600, API 6D, and ASME B16.34 standards. Pressure ratings Class 150 to Class 600. Body materials in ASTM A216 WCB cast steel, A105 forged steel, and SS316 stainless steel with Stellite-faced hard trim.',
    documentation: [
      'EN 10204 3.1 Inspection Certificate with heat chemical and mechanical properties',
      'Hydrostatic and pneumatic pressure test report per API 598 / ISO 5208',
      'NACE MR0175 / ISO 15156 compliance certificate for sour service applications',
      'Certificate of Origin (COO)',
    ],
    packaging: 'End flanges protected with heavy plastic caps, packed in ISPM 15 treated seaworthy wooden cases with rust inhibitors.',
    inspectionParameters: ['Shell hydrostatic test at 1.5x rated pressure', 'High-pressure and low-pressure closure leakage test (zero leakage)', 'Positive Material Identification (PMI) on alloy trims', 'Flange face surface finish roughness check (Ra 3.2–6.3 µm)'],
  },
  'precision-turned-components': {
    gradeExplanation:
      'Custom machined shafts, bushes, collars, and hydraulic fittings produced on multi-axis CNC turning and Swiss-type sliding head machines. Machined in steel alloys, brass, and stainless steel with dimensional tolerances within ±0.005 mm and surface finishes down to Ra 0.4 µm.',
    documentation: [
      'Coordinate Measuring Machine (CMM) dimensional inspection report per sample plan',
      'Raw material mill test certificate with complete heat tracing',
      'Surface treatment and plating thickness certificate (zinc, nickel, black oxide)',
      'Certificate of Origin (COO)',
    ],
    packaging: 'Layered in anti-scratch vacuum thermoformed trays or partitioned corrugated boxes treated with VCI oil.',
    inspectionParameters: ['CMM geometric dimensioning and tolerancing (GD&T)', 'Surface roughness testing (Ra / Rz)', 'Thread gauge verification (Go / No-Go calibrated gauges)', 'Plating thickness measurement via X-ray fluorescence (XRF)'],
  },
  'high-tensile-fasteners': {
    gradeExplanation:
      'Hex bolts, studs, socket screws, and nuts manufactured to ISO 898-1 property classes 8.8, 10.9, and 12.9; ASTM A193 B7/B16 and ASTM A325. Cold-forged from alloy steel (SCM 435, 4140) with continuous induction heat treatment, roll-threaded for superior fatigue resistance.',
    documentation: [
      'EN 10204 3.1 Inspection Certificate with tensile strength and proof load results',
      'Charpy V-notch impact test report at sub-zero temperatures (for low-temp grades)',
      'Salt spray corrosion resistance certificate for zinc-flake / hot-dip galvanized finishes',
      'Certificate of Origin (COO)',
    ],
    packaging: '25 kg heavy-gauge cardboard boxes stacked on 1,000 kg shrink-wrapped and strapped Euro/standard pallets.',
    inspectionParameters: ['Tensile strength & yield point verification', 'Proof load and wedge tensile testing', 'Core and surface hardness (Rockwell C / Vickers)', 'Microstructure decarburization depth inspection'],
  },
  'machine-tools-accessories': {
    gradeExplanation:
      'Machine tool holding and workholding equipment: precision lathe chucks, collet chucks (ER series per DIN 6499), machine vices, and rotary tables. Hardened and ground alloy tool steel (HRC 58–62) delivering runout accuracy within 0.005 mm at nose, dynamically balanced.',
    documentation: [
      'Individual inspection certificate with measured runout and repeatability record',
      'Material test certificate confirming alloy steel grades and heat treatment depth',
      'Certificate of Origin (COO)',
      'Operator and maintenance manual with replacement parts schematic',
    ],
    packaging: 'VCI rust-preventative coated, enclosed in protective wooden cases with form-fitting closed-cell foam linings.',
    inspectionParameters: ['Spindle runout and concentricity test', 'Clamping force measurement at rated torque', 'Hardness depth testing on jaw guideways', 'Dynamic balancing verification at operating RPM'],
  },
};

/** Retrieves detail specification for a product slug */
export function getProductDetail(slug: string): ProductDetailSpec | null {
  return PRODUCT_DETAILS[slug] ?? null;
}

/** Finds up to `limit` related products in the same category, excluding current product */
export function getRelatedProducts(currentSlug: string, categorySlug: string, limit = 3): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === categorySlug && p.slug !== currentSlug).slice(0, limit);
}
