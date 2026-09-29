import fs from 'fs';
import path from 'path';

function createPdfContent(): Buffer {
  const content = [
    'BT',
    '/F1 22 Tf',
    '50 750 Td',
    '(TRIVOXA GROUP - MARKET INTELLIGENCE BRIEFING) Tj',
    '/F2 12 Tf',
    '0 -24 Td',
    '(Q4 2026 HORIZON - GLOBAL COMMODITIES & MARITIME TRADE CORRIDORS) Tj',
    '0 -18 Td',
    '(Headquarters: Surat, Gujarat, India | Western India Gateways: Mundra, Kandla, JNPT) Tj',
    '0 -30 Td',
    '/F1 14 Tf',
    '(1. EXECUTIVE SUMMARY) Tj',
    '/F2 10 Tf',
    '0 -16 Td',
    '(Trivoxa Group operates structured international export corridors originating ex Western India.) Tj',
    '0 -14 Td',
    '(Anchor manufacturing operations are anchored by Shiveshwar Textiles in Sayan, Surat,) Tj',
    '0 -14 Td',
    '(complemented by technological supply chain infrastructure developed with Varunya Technologies.) Tj',
    '0 -24 Td',
    '/F1 14 Tf',
    '(2. KEY ACTIVE MARITIME EXPORT CORRIDORS) Tj',
    '/F2 10 Tf',
    '0 -16 Td',
    '(- European Corridor: Rotterdam (NL RTM) & Hamburg (DE HAM) - Cotton fabrics, garments, precision fasteners) Tj',
    '0 -14 Td',
    '(- Middle East Corridor: Jebel Ali (AE JEA) - Spices, vitrified tiles, engineered quartz, denim fabrics) Tj',
    '0 -14 Td',
    '(- North America Corridor: New York (US NYC) & Savannah - Lab-grown diamonds, quartz slabs, industrial goods) Tj',
    '0 -14 Td',
    '(- Africa Corridor: Mombasa (KE MBA) - Generic pharmaceutical formulations, agricultural staples, machinery) Tj',
    '0 -14 Td',
    '(- South America Corridor: Santos (BR SSZ) - Industrial hardware, agrochemicals, engineering components) Tj',
    '0 -14 Td',
    '(- Asia-Pacific Corridor: Singapore (SG SIN) - Raw yarn, non-woven technical textiles, food ingredients) Tj',
    '0 -24 Td',
    '/F1 14 Tf',
    '(3. REGULATORY COMPLIANCE & QUALITY CERTIFICATIONS) Tj',
    '/F2 10 Tf',
    '0 -16 Td',
    '(- ISO 9001:2015 Quality Management Systems across production lines) Tj',
    '0 -14 Td',
    '(- APEDA (Agricultural and Processed Food Products Export Development Authority)) Tj',
    '0 -14 Td',
    '(- FIEO (Federation of Indian Export Organisations) Premier Trading Status) Tj',
    '0 -14 Td',
    '(- Spices Board of India & FSSAI certified food processing and packaging) Tj',
    '0 -14 Td',
    '(- Bureau of Indian Standards (BIS) Hallmarked Precious Metal & Diamond Verification) Tj',
    '0 -24 Td',
    '/F1 14 Tf',
    '(4. COMMERCIAL INQUIRIES & CONTRACTING) Tj',
    '/F2 10 Tf',
    '0 -16 Td',
    '(All trade consignments are governed by standard Incoterms (FOB / CIF / CFR) with SLA-backed) Tj',
    '0 -14 Td',
    '(inbound quotation turnaround of 24-48 hours. Formal RFQs: export@trivoxagroup.com) Tj',
    '0 -20 Td',
    '(Trivoxa Group | Surat, Gujarat, India | www.trivoxagroup.com) Tj',
    'ET'
  ].join('\n');

  const streamLen = Buffer.byteLength(content);

  const objects = [
    // 1: Catalog
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    // 2: Pages
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    // 3: Page
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    // 4: Contents Stream
    `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${content}\nendstream\nendobj\n`,
    // 5: Font F1 (Helvetica-Bold)
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    // 6: Font F2 (Helvetica)
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];

  const header = '%PDF-1.4\n%\xe2\xe3\xcf\xd3\n';
  const offsets: number[] = [];
  let currentOffset = Buffer.byteLength(header);

  for (const obj of objects) {
    offsets.push(currentOffset);
    currentOffset += Buffer.byteLength(obj);
  }

  const xrefStart = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += offset.toString().padStart(10, '0') + ' 00000 n \n';
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  const pdfData = header + objects.join('') + xref + trailer;
  return Buffer.from(pdfData, 'utf-8');
}

const dir = path.join(process.cwd(), 'public', 'downloads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const filePath = path.join(dir, 'trivoxa-market-intelligence-2026.pdf');
fs.writeFileSync(filePath, createPdfContent());
console.log(`Generated PDF at ${filePath}`);
