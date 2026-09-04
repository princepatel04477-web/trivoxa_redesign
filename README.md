# Trivoxa Group — website rebuild

Next.js 15 (App Router) + TypeScript strict + Tailwind v4 rebuild of
[trivoxagroup.com](https://trivoxagroup.com) for Trivoxa Group, an international
trade and business group in Surat, Gujarat, with two divisions — **Product
Exports** and **Service Exports** (trading as Trivoxa Digital) — built on
**Shiveshwar Textiles**, its parent company.

The build follows a 22-phase specification (P0–P22). Every phase's decisions are
recorded as ADRs in [`docs/DECISIONS.md`](docs/DECISIONS.md); everything found
wrong on the live site and what was done about it is in
[`docs/AUDIT.md`](docs/AUDIT.md).

```bash
npm ci
npm run dev     # http://localhost:3000
npm test        # 77 tests, 7 suites
npm run build   # type-checks, lints, runs content gates, prerenders 35 routes
```

`npm run build` is the gate: it fails on TypeScript, ESLint, taxonomy drift
(`scripts/check-taxonomy.ts`), brand-asset or contrast violations
(`scripts/check-brand-assets.ts`), broken internal links and orphan anchors
(`tests/routes.test.ts`), and structured data that does not match the content
modules (`tests/seo.test.ts`).

---

## Where things live

| Path | What it is |
| --- | --- |
| `src/content/taxonomy.ts` | **The single source of truth**: 9 industries, 7 categories, 25 products (HS code, grade, MOQ, lead time, Incoterms, loading port), 6 regions, 3 ports, 9 certifications. Every table, chip, filter and schema.org Product is rendered from this file. Correct a HS code here and it is corrected everywhere. |
| `src/content/company.ts` | Entity facts, contacts, leadership, and the one canonical sentence describing Shiveshwar Textiles as the parent company. |
| `src/content/{capabilities,process,editorial,faqs,legal}.ts` | Supporting copy, all typed, all data rather than JSX. |
| `src/lib/tokens/` | Brand colours (with the computed contrast matrix), typography scale, motion tokens. |
| `src/lib/perf-tier.ts` | Device tiering (`low` / `medium` / `high`) that decides whether WebGL runs at all. |
| `src/lib/motion/gsap-setup.ts` | GSAP loaded off the critical path — `loadGsap()` / `peekGsap()`. |
| `src/lib/forms/{mailto,transport}.ts` | How an enquiry leaves the site, behind one seam. |
| `src/lib/analytics/events.ts` | Typed event bus. **No analytics provider is installed.** |
| `src/components/seo/json-ld.tsx` | Evidence-only structured data builders. |
| `src/app/` | Routes: `/`, `/businesses`, `/businesses/product-exports`, `/businesses/service-exports`, `/industries`, `/industries/[slug]`, `/global-presence`, `/group`, `/insights`, `/careers`, `/rfq`, `/contact`, `/compliance`, `/legal/[slug]`, `sitemap.ts`, `robots.ts`. |
| `docs/` | `DECISIONS.md` (ADR 001–037), `AUDIT.md` (findings register), `CONTENT-MODEL.md`, `MOTION.md`, `PERF-BUDGET.md`. |
| `scripts/` | `sync-fonts.ts`, `build-brand.ts`, `check-taxonomy.ts`, `check-brand-assets.ts` — all run automatically in `predev` / `build`. |

## Non-negotiables

These are enforced by tests, not by convention:

- **Bronze (#A88B68) is an accent, never a background and never body copy.** It
  covers ≤ ~3% of any screen. As *text* it only appears on dark surfaces
  (5.2:1 / 5.8:1); on light surfaces use `bronzeInk` #7A6244 or the
  surface-aware `text-accent` utility.
- **Geist Mono is reserved for data**: HS codes, MOQ, lead times, Incoterms,
  ports. Instrument Serif for display, Satoshi (Inter until the WOFF2s land) for
  body.
- **Every animated state must be correct without its animation.** Headings,
  numbers and tables are server-rendered in their final state; `<CountUp>` never
  shows "0 regions served"; a visitor with JavaScript off sees the whole
  catalogue.
- **Nothing claims what is not true.** No prices, no `aggregateRating`, no
  invented phone number, no newsletter form that posts nowhere, no "received"
  confirmation for a submission that was only composed into a `mailto:`. Legal
  documents carry a visible internal-review banner until counsel signs them.
- **Performance budget:** First Load JS < 180 kB per route. Homepage is 138 kB.

## Pending founder inputs

`npx tsx scripts/check-taxonomy.ts` prints these on every build until answered:

1. Two direct phone numbers (`CONTACT.phoneNumbers`).
2. Registered entity number / CIN (`CONTACT.registeredEntityNumber`).
3. Word-for-word confirmation of the six `REGIONS.*.verifiableDetail` claims.

Plus: the Drive logo pack (a provisional vector stand-in ships as a single-file
swap via `scripts/build-brand.ts`), the Satoshi WOFF2s (drop into
`src/fonts/custom/`; the build auto-detects and falls back to Inter until then),
counsel review of the four `/legal/[slug]` documents, and a correction to the
Company Profile PDF, which still describes Shiveshwar Textiles as a partner
rather than the parent company.

German and Arabic localisation (P18) is **deferred, not forgotten**: the i18n
scaffolding and RTL-aware utilities exist and the language switcher is hidden
until funded human translation is available. See ADR 033.
