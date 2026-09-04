# Audit findings — trivoxagroup.com rebuild (P22)

Every finding below came from crawling the live site, the Company Profile PDF and
Shiveshwar Textiles' site, then deciding what the rebuild does about it. Nothing
here is speculative: each row names where the problem was observed, what the
rebuilt site does instead, and how that is enforced or who has to answer for it.

Statuses: **FIXED** (shipped in this repo, usually with a test), **FLAGGED**
(needs a founder answer — the site states the honest position until then),
**DEFERRED** (deliberately not built, with a reason), **EXTERNAL** (has to change
outside this repo).

---

## A. Trust and accuracy findings

| # | Finding on the live site | What the rebuild does | Status |
| --- | --- | --- | --- |
| A1 | Shiveshwar Textiles is described three different ways across the site, including "founding strategic manufacturing partner" on `/contact`. Procurement reads inconsistency as uncertainty about who is actually behind the exporter. | Shiveshwar is the **parent company**. One canonical sentence lives in a typed constant in `src/content/company.ts`; JSON-LD uses `parentOrganization`. `tests/seo.test.ts` fails if a fourth phrasing appears. | FIXED |
| A2 | No phone number anywhere on `/contact`; only `hello@`. Buyers in our target markets expect a number, and its absence reads as "no office". | `CONTACT.phoneNumbers` is an empty array **on purpose**: the site renders a designed callback substitute (ask for a callback on `/contact#callback`, desk replies within the published window) rather than inventing a number. The Company Profile PDF lists two direct numbers — supplying them is a one-line edit. | FLAGGED |
| A3 | No registered entity number / CIN. Procurement teams verify an exporter against a registry before they send an enquiry. | `registeredEntityNumber` is `null` and the compliance page says the number is available on request rather than displaying a placeholder. | FLAGGED |
| A4 | Compliance claims ("IEC, GST active"; FIEO/APEDA/Spice Board/FSSAI/ISO 9001/CE/WHO-GMP "in progress") appear as a summary with no dates and no consequence. | `/compliance` is a register: each certification carries a status (`active` / `in-progress`), a target quarter, and — for WHO-GMP and FSSAI — the **commercial consequence stated publicly** (pharma and food lines cannot ship until those land). Per-shipment inspection is stated. | FIXED |
| A5 | Region pages make unverifiable claims ("strong presence in Europe"). | Each of the 6 regions carries one `verifiableDetail` written to be checkable against documents (REACH-aware paperwork, Mundra/Kandla Gulf lanes, ISPM 15 packing, US retail carton marking, Spanish-language docs for Santos/Callao, JNPT preferential origin). `check-taxonomy` warns on all six until a founder confirms them word for word. | FLAGGED |
| A6 | "Illustrative trade corridors … not live shipment tracking" disclaimer next to a map that looks live. | The globe and corridor scenes are explicitly labelled as illustrative corridors, and the disclaimer is kept — an honest map beats a convincing one. | FIXED |
| A7 | Insights page shows three "Coming soon" cards; the live site's careers page lists no roles. Both are true but presented as filler. | `/insights` says what will be published and why nothing is published yet; there is **no newsletter form**, because a form that posts nowhere is a lie with a button on it. `/careers` states there are no open roles and gives `careers@` for speculative applications. | FIXED |
| A8 | Two division names in circulation: "Service Exports" and "Trivoxa Digital", with the external site at `digital.trivoxagroup.com`. | One taxonomy: division **Service Exports** is the section name; Trivoxa Digital is named as its trading identity and linked externally. Both appear consistently in nav, breadcrumbs and schema. | FIXED |
| A9 | Product catalogue shows 7 category filter links but only 5 industries with live products; clicking a category with nothing behind it dead-ends. | One computed facet (`catalogFacets()`) drives both. Categories that are onboarding but empty are kept as **visible zero-count chips** so the ambition is legible, and every industry page states its onboarding status. | FIXED |

## B. Structure, SEO and technical findings

| # | Finding | What the rebuild does | Status |
| --- | --- | --- | --- |
| B1 | No `sitemap.xml`, no `robots.txt`. | Both generated from the taxonomy and legal modules: 25 URLs (12 static + 9 industries + 4 legal), `/styleguide` disallowed. Verified by curl in CI-style checks. | FIXED |
| B2 | No structured data. | Evidence-only JSON-LD: `Organization` (with `parentOrganization`, founders, `areaServed` = 6 regions, contact points, socials), `WebSite`, `BreadcrumbList`, `FAQPage`, `ItemList` of `Product`s with HS code / grade / MOQ / lead time / Incoterms / loading port as `additionalProperty`, and ports as `Place` with UN/LOCODEs. **No `Offer`, no price, no `aggregateRating`** — we do not publish prices and will not fake reviews. `tests/seo.test.ts` pins all of it. | FIXED |
| B3 | Duplicate catalogue tables across `/businesses`, `/businesses/product-exports` and 9 industry pages, hand-maintained. | One source of truth (`src/content/taxonomy.ts`); every table renders from it, so a HS code correction is a single edit. `scripts/check-taxonomy.ts` fails the build on drift. | FIXED |
| B4 | Heading hierarchy and landmarks not verified; skip link pointed at a `div`. | One `h1` per route, no skipped levels (verified on `/`, `/industries/[slug]`, `/contact`), real `<main id="main">`, `aria-current="page"` on exact-match nav links. | FIXED |
| B5 | Bronze (#A88B68) used as a text colour on ivory — 2.80:1, failing WCAG AA — in eyebrows, links, hover states and form errors across 26 files. | New token `bronzeInk` #7A6244 (5.01:1 on ivory, 5.41:1 on soft ivory). Surfaces expose `accentText`; `text-accent` is surface-aware; the dark header/footer keep true bronze (5.23:1 / 5.80:1). A test gate requires any file using `text-bronze` to point at a dark ground. | FIXED |
| B6 | Homepage shipped 249 kB of First Load JS, of which ~130 kB gzipped was animation libraries (GSAP + plugins, Motion, Lenis) blocking first paint. | All of it moved off the critical path: dynamic imports prefetched during hydration, hero copy and accordion now animate with CSS. Homepage is **138 kB**; `/rfq` 228 → 128 kB; `/contact` 252 → 152 kB. ADR 035 records honestly that total bytes are unchanged — what changed is that they no longer block paint. | FIXED |
| B7 | Keyboard users lost focus when Escape closed the mega menu or mobile drawer, and a failed form submit announced six alerts without moving focus. | Focus returns to the trigger that opened the overlay; `focusFirstInvalid()` moves focus to the first `aria-invalid` field; the post-submit panel focuses its own heading and carries `role="status"`. | FIXED |
| B8 | Dead-end internal links are easy to introduce as the taxonomy grows. | `tests/routes.test.ts` is an orphan-link gate: every internal href in `src/` must resolve to a real route or a real `id` anchor. | FIXED |
| B9 | No form backend; a "send" button that posts nowhere. | Enquiries compose a structured `mailto:` the buyer can read before sending, behind a transport seam (`src/lib/forms/transport.ts`) that a server action can replace in one line. A honeypot catches bots and is counted, never surfaced. | FIXED |
| B10 | No analytics, so no way to tell which industry pages earn enquiries. | A typed event bus (`src/lib/analytics/events.ts`) emits `rfq_compose`, `contact_compose`, `catalog_filter` and `bot_discarded`, and re-dispatches them as `trivoxa:analytics` CustomEvents for whichever provider is adopted. **No vendor script is installed** and a test fails if one appears without the cookie notice changing. | FIXED |

| B11 | The homepage had no `canonical` — every other route did. `/`, `/?category=…` and any future query-parametered variant are separate documents to a crawler, and the homepage is the one URL that cannot afford that. | `src/app/page.tsx` exports its own metadata with `alternates.canonical: '/'`. Verified: `<link rel="canonical" href="https://trivoxagroup.com">` is in the served HTML. A test now requires every route that declares metadata to declare a canonical (the dev-only styleguide is the single documented exemption — a canonical on a page robots.txt disallows would be a contradiction). | FIXED |
| B12 | Nine routes rendered the brand twice in `<title>` — "Privacy Policy — Trivoxa Group | Trivoxa Group", "Compliance & Certifications — Trivoxa Group | Trivoxa Group" — because `title.template` already appends it. Wasted characters in the one place search results are judged. | Page titles no longer carry the brand: legal documents use `document.title` directly, and `/rfq`, `/contact`, `/compliance`, `/insights` and `/careers` were rewritten. Longest title on the site is now 56 characters. A test scans every `page.tsx` for a `title:` containing "Trivoxa Group" and fails on the tenth. | FIXED |

## C. Legal and governance

| # | Finding | What the rebuild does | Status |
| --- | --- | --- | --- |
| C1 | No privacy policy, terms, cookie notice or anti-corruption statement. | Four documents at `/legal/[slug]`, written as data in `src/content/legal.ts`, each carrying a visible **internal-review** banner: they are honest about what the site actually does (no backend, no analytics cookies, mailto enquiries) but they are not counsel-approved. | FLAGGED |
| C2 | Anti-corruption / sanctions exposure is real for an exporter dealing in pharma-adjacent and dual-use categories, and was not addressed at all. | `/legal/anti-corruption` states the position (no facilitation payments, sanctions screening before quotation, refusal policy) and `/compliance` links the audit path to `/rfq?path=audit`. | FIXED |
| C3 | The Company Profile PDF describes Shiveshwar as a partner rather than the parent. | The PDF is external to this repo. Correct it, or the site and the document will contradict each other in the same buyer's inbox. | EXTERNAL |

## D. Deliberately not built

| # | Item | Why | Status |
| --- | --- | --- | --- |
| D1 | German and Arabic localisation (P18). | The infrastructure exists (`src/lib/i18n/locales.ts`, RTL-aware utilities, `hreflang` scaffolding) and the language switcher is **hidden**. Machine-translating trade documentation into German and Arabic would be a liability, not a feature; it ships when funded human translation exists. | DEFERRED |
| D2 | Analytics provider. | Privacy position plus no consent infrastructure. The bus is ready; adopting a provider means updating the cookie notice in the same commit. | DEFERRED |
| D3 | Form backend / CRM. | Same reason as B9: the seam is built, the endpoint is not, and the UI does not pretend otherwise. | DEFERRED |
| D4 | WebGL on low-tier devices. | The perf-tier system serves static posters below `medium`; the eagle and globe scenes never initialise. That is the design, not a gap. | FIXED |
| D5 | Final brand logo and Satoshi body face. | A provisional vector stand-in ships as a single-file swap (`scripts/build-brand.ts`) and the body font auto-falls back to Inter until the WOFF2s land in `src/fonts/custom/`. Neither blocks any page. | FLAGGED |

---

## Outstanding founder inputs (the eight build warnings)

`npx tsx scripts/check-taxonomy.ts` prints these on every build until answered:

1. `CONTACT.phoneNumbers` is empty — supply the two direct numbers from the Company Profile PDF.
2. `CONTACT.registeredEntityNumber` is null — supply the CIN / registration number.
3–8. The six `REGIONS.*.verifiableDetail` sentences (Europe, Middle East, Africa, North America, South America, Asia-Pacific) each need word-for-word confirmation that the claim is true of shipments you have actually made or can make.

Plus: counsel review of the four `/legal/[slug]` documents (C1), the logo and
Satoshi files (D5), and the Company Profile PDF correction (C3).

## How to re-verify

```bash
npm ci
npm test          # 74 tests, 7 suites: taxonomy, tokens, perf-tier, homepage,
                  # routes (orphan-link gate), seo (schema pinned to content),
                  # forms (transport seam + analytics bus)
npm run build     # type-checks, lints, runs check-taxonomy + check-brand-assets,
                  # prerenders 35 routes, prints the First Load JS budget
```

Route-level sweep (all 25 sitemap URLs, plus hostile inputs):

| Probe | Result |
| --- | --- |
| Every sitemap URL | 200, unique `<title>` and description, canonical present, `og:image` and `twitter:card` set |
| `/legal/not-a-doc`, `/industries/nope`, `/businesses/nope`, unknown top-level path | 404 with the designed not-found page |
| `/businesses/product-exports?category=bogus` | 200, falls back to all 25 products rather than an empty table |
| `/businesses/product-exports?category=textile-apparel` | 200, 5 rows — filtered server-side, so it survives with JavaScript off |
| `/rfq?product=cotton-yarn&division=service-exports&path=audit` | 200, prefill selected, audit path reflected in the composed message |
| Homepage with scripting unavailable | Ports and UN/LOCODEs, 25 products, 9 industries, 6 regions and the 24-hour response window are all in the served HTML — `<CountUp>` renders its final value server-side, so there is no "0 regions served" frame |

Copy spot-check (the spec's rule is concrete or nothing): `/industries/agriculture-food`
opens "Gujarat's agri belt, exported properly: spices, groundnuts, castor
derivatives, dry fruits and processed foods with per-lot analysis";
`/businesses/service-exports` describes AI work as "applied engineering for
businesses that want AI in a process rather than in a press release" and
marketing as "measured on enquiries that name a product and a quantity rather
than on impressions or follower counts". No abstraction-stacking found, no
placeholder copy anywhere in `src/`.

One workflow caveat discovered while auditing: running `npm run build` while
`npm run dev` is serving the same `.next` directory leaves the dev server
requiring production chunk layouts and returning 500s for routes that are
perfectly healthy. Stop the dev server before building, or delete `.next` and
restart it afterwards. The application was never at fault.

Runtime spot-checks used for this audit (production build, `next start`):
`/sitemap.xml` returns 25 URLs and no `/styleguide`; `/robots.txt` disallows
`/styleguide` and names the sitemap; JSON-LD `@type` sets present on `/`,
`/industries/[slug]`, `/rfq`, `/contact`, both division pages and
`/global-presence`; the catalogue renders its rows server-side (so a filtered
view survives with JS off); `<main id="main">`, one `h1`, no skipped heading
levels; closed accordion panels carry `inert`; `--color-bronze-ink` and the
`text-accent` utility are in the shipped CSS.
