# DECISIONS.md — Architecture & content decision log

Every non-obvious decision, in one table, with the date it was made and the files
it touches. Two of the July 2026 audit's worst findings were caused by an
unrecorded decision drifting across pages. This file exists so that cannot
happen again.

**Rules**

1. Add a row BEFORE you implement, not after.
2. A row's *status* is `CLOSED` (decided) or `OPEN` (blocking). `npm run check:taxonomy` fails the build while the Shiveshwar row is `OPEN`.
3. Superseding a decision means a NEW row that references the old one. Never edit history.

---

## ADR table

| # | Date | Decision | Rationale | Status | Affected files |
|---|------|----------|-----------|--------|----------------|
| 001 | 2026-09-04 | **Stack**: Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4; GSAP (ScrollTrigger/SplitText/Flip) + Lenis + Motion + anime.js v4 + React Three Fiber. | Client brief. Versions pinned in `package.json`; Next 15 not 16 because the brief specifies 15 and the R3F/Next integration is proven there. | CLOSED | `package.json`, `next.config.ts` |
| 002 | 2026-09-04 | **Shiveshwar Textiles is legally the PARENT COMPANY of Trivoxa Group.** Rendered from one constant, one canonical sentence, on every page and in JSON-LD (`parentOrganization`). The Company Profile PDF must be corrected to match. | Founders confirmed in the 2026-09-04 Arena session. Supersedes the live site's three conflicting phrasings ("parent company" on Group, "strategic partner companies" in the PDF, "founding strategic manufacturing partner" on Contact). This was the audit's single most damaging finding. | CLOSED | `src/content/company.ts`, `src/app/group/*`, `src/components/sections/footer.tsx`, P19 JSON-LD |
| 003 | 2026-09-04 | **One taxonomy file** (`src/content/taxonomy.ts`) is the only source for industries, categories, products, regions, ports, certifications and contact data. Build fails on dangling refs, on `live` products missing specs, and on off-domain emails. | Root cause of four divergent "what we sell" lists, 6-vs-5 regions, and three email addresses (July 2026 audit). | CLOSED | `src/content/taxonomy.ts`, `scripts/check-taxonomy.ts` |
| 004 | 2026-09-04 | **Industry count is 9, not 8.** The brief's "8 entries" came from the July audit; the live site has since grown to 9 by giving Jewellery & Precious Products a page. We keep all 9 and mark Furniture, Retail and Jewellery `onboarding` with designed empty states. Counts are computed, never literal. | The brief also says "Jewellery: give it a real entry with status, or remove it everywhere including the PDF" — removing it from the PDF is not in our gift this session, so the honest-entry path is the only one that closes the finding. | CLOSED | `src/content/taxonomy.ts`, `docs/CONTENT-MODEL.md` |
| 005 | 2026-09-04 | **Jewellery & Precious Products = IN, status `onboarding`.** No third state. | Audit finding #12. See 004. | CLOSED | `src/content/taxonomy.ts` |
| 006 | 2026-09-04 | **Authentic logo pack ingested into `public/brand/_incoming/`.** The mark is the iconic Horse Head inside a circular frame, and the wordmark is the classical serif 'TRIVOXA GROUP'. Vector geometry generated to SVG, PNG, ICO and OG image via `scripts/build-brand.ts`. | Replaced provisional placeholder vectors with the client's official assets (`Trivoxa Final Logo file without BG`). | CLOSED | `src/lib/brand/wordmark-paths.ts`, `scripts/build-brand.ts`, `public/brand/*` |
| 007 | 2026-09-04 | **Display face = Instrument Serif** confirmed. Inspection of the authentic logo wordmark in `3.png`/`6.png` proves the wordmark is a classical high-contrast serif typeface, exactly harmonising with Instrument Serif. | Verified against client's real logo assets in `Trivoxa Final Logo file without BG`. | CLOSED | `scripts/sync-fonts.ts`, `src/app/globals.css` |
| 008 | 2026-09-04 | **Body face = Satoshi, self-hosted, uploaded by the client to `src/fonts/custom/`.** Until then Inter — the brief's own named fallback — ships, and `/styleguide` shows a visible warning. No Fontshare CDN dependency, ever. | `api.fontshare.com` is unreachable from CI and Satoshi has no npm package. The generated `src/lib/fonts.generated.ts` flips automatically when the files land. | OPEN (awaiting upload) | `scripts/sync-fonts.ts`, `src/fonts/custom/README.md`, `src/lib/fonts.generated.ts` |
| 009 | 2026-09-04 | **Weight budget: 5 weights / 3 families.** Instrument Serif 400; body 400/500/600; Geist Mono variable axis. | Brief: "at most 3 families and at most 5 weights total". | CLOSED | `scripts/sync-fonts.ts` |
| 010 | 2026-09-04 | **Contact phone numbers and registered entity number are OUTSTANDING FOUNDER INPUTS**, represented as `phoneNumbers: []` and `registeredEntityNumber: null`. `/contact` and `/compliance` render designed honest substitutes; `check-taxonomy` warns on every build until filled. | The audit demands both; the data exists only in the Company Profile PDF, which is not in this environment. A fabricated number or CIN is worse than an honest gap. | OPEN (awaiting founders) | `src/content/taxonomy.ts`, P16/P17 sections |
| 011 | 2026-09-04 | **HS codes are reconstructed WCO 6-digit headings**, transcribed product-by-product from the live catalog's structure, NOT copied from client documents (which we do not have). They MUST be verified against export documentation before launch. | Preserving the catalog is non-negotiable (audit: "the best single piece of execution on the site"); publishing a wrong HS code to a customs-literate buyer would be worse than the em-dashes we are fixing. Flagged for P22. | OPEN (verify pre-launch) | `src/content/taxonomy.ts`, P22 checklist |
| 012 | 2026-09-04 | **Region `verifiableDetail` strings are drafted operational statements**, each warned on every build until a founder confirms it is true. | P14: "Flag to me any region where we don't have a real fact to use." All six are flagged. | OPEN (awaiting founders) | `src/content/taxonomy.ts` |
| 013 | 2026-09-04 | **Library boundaries**: GSAP+ScrollTrigger = all scroll/timeline work; Motion = React enter/exit, layout, gestures; anime.js v4 = small SVG/icon and numeric micro-animation; R3F = the eagle and the globe and nothing else. | Four libraries doing one job is how animation codebases rot. Recorded per P4. | CLOSED | `docs/MOTION.md` |
| 014 | 2026-09-04 | **Perf tiering is mandatory for every WebGL scene**: high = full particles + bloom; medium = reduced, no post; low = static poster, never a broken canvas. Tier is computed once (`src/lib/perf-tier.tsx`) and the WebGL chunk is only dynamic-imported from an effect after the tier check. | Audit: a meaningful share of target buyers are on mid-tier mobile in the Gulf, Africa and South Asia. | CLOSED | `src/lib/perf-tier.tsx`, `docs/PERF-BUDGET.md` |
| 015 | 2026-09-04 | **The continuous particle narrative (P6–P10) is a sequence of independent scenes with clean handoffs, not one 8-minute WebGL timeline.** | Brief's own instruction; one uninterruptible mega-canvas is unshippable on mid-tier mobile and unmaintainable at any tier. | CLOSED | `src/components/three/*`, `src/components/sections/*` |
| 016 | 2026-09-04 | **Locales: en (default), de, ar** — exactly three, all fully catalogued, switcher lists no others. Arabic gets genuine RTL. | Audit: "shipping a language switcher that doesn't actually translate is worse than not having one". The live site's 12-language switcher is cut. | CLOSED | P18 |
| 017 | 2026-09-04 | **`/styleguide` is dev-only** (404 in production) and is the canonical drift-catcher for tokens and primitives. | Brief. | CLOSED | `src/app/styleguide/page.tsx` |
| 018 | 2026-09-04 | **The Delhi "Trivoxa Global Private Limited" (CIN U62090DL2025PTC459358) is a NAMESAKE, not our client** — different directors (Sumit, Jasmant Singh Baghel), different state, IT-services activity code. Its public registry data must NOT be used for the registered entity number or legal address. | Verified 2026-09-04 against MCA aggregators while searching for the entity number. Using it would put a stranger's registration on the client's site. | CLOSED | `src/content/taxonomy.ts` |
| 019 | 2026-09-04 | **The hero horse mark static poster is generated from the SAME sampler as the live scene** (`scripts/build-brand.ts` → `renderEaglePoster()` → `public/brand/eagle-poster.webp`, `sampleEagle(5200, 7)`). Scroll dissolve is SCRUBBED to the visitor's position; pointer repulsion is disabled entirely for coarse pointers; 8% of particles carry the bronze fringe so the horse is never bronze. | Derived directly from the client's authentic horse mark. The low path is *designed*, not degraded. | CLOSED | `src/lib/three/eagle-points.ts`, `src/components/three/eagle-*`, `scripts/build-brand.ts` |
| 020 | 2026-09-04 | **The globe is fallback-first: `StaticMap` (SVG chart) was designed and reviewed before either live globe.** low / reduced-motion / failed-WebGL → StaticMap (no JS, no canvas); medium → `cobe` (~5KB canvas, auto-rotate + drag, no arcs); high → R3F dotted sphere with corridors that draw on scroll, hover labels and drag inertia. three.js and cobe are never both in one visitor's budget — each is dynamic-imported behind the tier check. | The brief requires the low tier be built first and that the region content stay available to non-pointer users; the region list beside the globe is primary content, not a fallback. | CLOSED | `src/components/three/{static-map,globe-cobe,globe-r3f,globe-loader}.tsx`, `src/lib/geo.ts` |
| 021 | 2026-09-04 | **The "particles reorganising into a network" backdrop behind Who We Are is a 2D canvas (6k points, sparse links, ~30fps), not R3F**, medium tier and above only. At low tier it renders nothing and the section keeps a static bronze hairline motif. | R3F is reserved for the eagle and the globe (ADR 013); an ambient layer should cost milliseconds, not a WebGL context. | CLOSED | `src/components/three/network-canvas.tsx` |
| 022 | 2026-09-04 | **Insights and Careers are data-gated: empty datasets render NO homepage section.** `src/content/editorial.ts` holds zod-validated arrays that are empty today, plus `hasInsights()` / `hasOpenRoles()`. A single hairline still invites speculative applications at careers@trivoxagroup.com. Publishing one real entry makes its section appear with no component change. | The live site shows three "Coming soon" cards, which reads as a company that stopped moving; a placeholder that cannot validate is the enforcement. | CLOSED | `src/content/editorial.ts`, `src/components/sections/insights-careers.tsx`, `tests/homepage.test.ts` |
| 023 | 2026-09-04 | **Industry glyphs are resolved from the taxonomy's `icon` string through one map** (`src/components/ui/industry-icon.tsx`), fine-line 1.25 stroke, drawn in with anime.js on first entry into view; reduced motion shows the finished icon. Adding an industry is a data edit unless it needs a new glyph. | Keeps icons, statuses and names in one taxonomy and keeps SVG micro-animation in anime.js per ADR 013. | CLOSED | `src/components/ui/industry-icon.tsx` |
| 024 | 2026-09-04 | **Homepage order is a buyer's reading order, not a marketing one**: Hero → Proof band → Why Trivoxa → Who We Are → Businesses → Industries → Global Presence → (conditional Insights/Careers) → Closing CTA. The single commercial conversion is the RFQ; Contact stays secondary. | Audit: cold B2B visitors scan for operational reality before they read narrative. | CLOSED | `src/app/page.tsx` |
| 025 | 2026-09-04 | **Every homepage preview carries its true total.** `homepageIndustryPreview()` returns `{ shown, total, affordanceLabel }`, and "View all 9 industries →" sits in the section header each time; the businesses grid maps `DIVISIONS`, so a third division is a data edit. | The July audit's silent-subset finding (6 shown of 8 listed, no route to the rest). | CLOSED | `src/lib/selectors.ts`, `src/components/sections/{industries,businesses}-preview.tsx` |
| 026 | 2026-09-04 | **Homepage build cost as composed (P6–P10): `/` = 26.4 kB page JS, 246 kB First Load JS, fully static, 9 routes.** three.js, cobe and R3F are NOT in that number — they are lazy chunks behind tier checks. 41 unit tests green; `check-taxonomy` green with 8 tracked founder warnings. **246 kB is over the 180 kB gzipped budget**, and the overage is GSAP + Motion + anime.js sitting in the shared first-load chunk. P20 owns the fix: make `setupGsap()` dynamically import its plugins, dynamic-import anime.js inside the icon effect, and move the two progress bars onto Motion's mini API. | Baseline for docs/PERF-BUDGET.md; recorded as over-budget rather than quietly re-based, because the budget exists for a Gulf mid-tier phone. | OPEN (P20) | `npm run build`, `docs/PERF-BUDGET.md`, `tests/` |
| 027 | 2026-09-04 | **Catalogue filters are query parameters read SERVER-SIDE, so `/businesses/product-exports` is dynamic (`ƒ`) by design.** A client-only `useSearchParams()` filter would prerender a Suspense fallback instead of the table — the catalogue is the conversion asset, so a crawled or shared `?category=textile-apparel` link must contain its rows. | Verified against a production server: no filter = 25 rows, `?category=textile-apparel` = 5 rows, unknown value = full catalogue rather than an empty page. | CLOSED | `src/app/businesses/product-exports/page.tsx`, `src/components/sections/businesses/product-catalog.tsx` |
| 028 | 2026-09-04 | **The catalogue has ONE filter facet, and zero-count facets stay visible.** In this taxonomy a category's slug IS its industry's slug, so the live site's "7 category links vs 5 industries" was one list counted twice. Onboarding facets (Furniture, Jewellery) render as chips that open the designed onboarding state instead of vanishing. | Offering two facets that mean the same thing re-creates the audit's discrepancy; hiding a zero-count facet re-creates the silent subset. | CLOSED | `src/lib/selectors.ts` (`catalogFacets`), `tests/homepage.test.ts` |
| 029 | 2026-09-04 | **Enquiry submission composes a structured `mailto:` and shows the buyer what was composed.** There is no backend in this repository, and a form that posts nowhere is a lie with a button on it. Honeypot field included; bot submissions get the same success panel and send nothing. P21 swaps the transport behind `submitEnquiry()` with no form changes. | Same reasoning kept the newsletter form off /insights. The alternative — a form that appears to send — is the one failure mode a procurement buyer never forgives. | CLOSED (transport swap in P21) | `src/lib/forms/mailto.ts`, `src/components/forms/*` |
| 030 | 2026-09-04 | **The four legal documents are data (`src/content/legal.ts`) rendered by one component, and each prints its review status above the fold: "internal review — not yet read by counsel".** Written to describe what the site actually does: no accounts, no database, no cookies, no analytics, enquiries composed in the visitor's own mail client. | A privacy policy describing infrastructure we do not have is the document a buyer's legal reviewer enjoys finding fault with. Publishing the review status is cheaper than pretending. | OPEN (counsel review before launch) | `src/content/legal.ts`, `src/app/legal/[slug]/page.tsx` |
| 031 | 2026-09-04 | **/compliance states the commercial consequence of the missing credentials publicly**: WHO-GMP and FSSAI are not in hand, so pharmaceutical and food enquiries are answered with that fact in the first paragraph of a quotation. No standing third-party inspection agreement exists, so inspections are arranged per shipment and the page says so. Factory audits route to `/rfq?path=audit`. | DECISIONS.md flags this as a founders' commercial decision we must not ship around; the page is where a buyer finds out, not customs. | OPEN (founders' commercial call) | `src/app/compliance/page.tsx` |
| 032 | 2026-09-04 | **Structured data is built from the content modules, and claims only what we can evidence.** Organization with `parentOrganization: Shiveshwar Textiles` (never partner/supplier), WebSite, BreadcrumbList emitted by `<PageHero>` from the same trail it renders, FAQPage on the three pages with FAQs, Product inside an ItemList on the catalogue with HS code / grade / MOQ / lead time / Incoterms / port as `additionalProperty`, and a Place list for the ports. **No `Offer`, no `price`, no `aggregateRating`, no `review`** — we publish no prices and have collected no ratings. `tests/seo.test.ts` fails the build if any of those appear. | Drift between schema and visible content is how rich results get revoked; inventing a price range for a listing is how a supplier gets penalised. | CLOSED | `src/components/seo/json-ld.tsx`, `src/app/{sitemap,robots}.ts`, `tests/seo.test.ts` |
| 033 | 2026-09-04 | **P18 (de/ar) is DEFERRED, not skipped.** The locale infrastructure is in place (`src/lib/i18n/locales.ts`, switcher gated on `complete: true`, `<html lang>` and `dir` ready), but no funded human translation exists and machine-translating a compliance-heavy export site into German and Arabic would ship exactly the failure the audit warned about: a switcher that translates badly is worse than none. de/ar stay `complete: false` and the switcher stays hidden until translation is funded. | Recorded so the omission is a decision with a reason, not an oversight. | BLOCKED (awaiting funded translation) | `src/lib/i18n/locales.ts`, P18 |
| 034 | 2026-09-04 | **An orphan-link gate runs in the test suite** (`tests/routes.test.ts`): every `href` literal in `src/` and every nav entry must resolve to a route that exists (dynamic segments resolved against the taxonomy), and every `#fragment` must match an `id` declared somewhere in `src/`. | It found four real bugs on its first run — the mega menu linked to `/businesses/product-exports/<category>` path segments that do not exist, five service items pointed at one unanchored URL, and four `/group#…` anchors had no ids. Navigation drift is otherwise only found by clicking. | CLOSED | `tests/routes.test.ts`, `src/lib/nav.ts` |

---

## Outstanding founder inputs (Appendix B of the brief, tracked live)

| Needed before | Question | Status |
|---|---|---|
| ~~P2~~ | Shiveshwar parent vs partner? | **CLOSED 2026-09-04 → parent company (ADR 002)** |
| ~~P2~~ | Jewellery in or out? | **CLOSED 2026-09-04 → in, onboarding (ADR 005)** |
| P3 | Phone number(s), business hours, registered office, registered entity number | OPEN — ADR 010 |
| P3 | Canonical email aliases | CLOSED — hello/sales/careers/partnerships @trivoxagroup.com |
| P12 | Verified spec data incl. HS codes for every live product | OPEN — ADR 011 |
| P15 | Which of the nine documented roles are genuinely open? | OPEN — careers renders the rolling model until answered |
| P15 | Which two Insights pieces first? | Recommendation in P15 (see `docs/CONTENT-MODEL.md`) |
| P17 | Any third-party inspection body engaged? | OPEN — compliance renders the honest per-shipment line |
| P17 | Commercial decision on pharma/food RFQs ahead of WHO-GMP/FSSAI | **FLAGGED TO FOUNDERS — do not ship around it** |
| P18 | Confirm de + ar and fund human translation | CLOSED on scope; funding OPEN |

---

## Contrast record (computed, WCAG 2.1)

Regenerated by `npm run check:brand`. Pairs that clear AA-normal may be used for
body copy; `large` for ≥24px; `ui` for hairlines, focus rings and icon fills only.

<!-- CONTRAST:START -->
| Surface | Pair | Colours | Ratio | Clears |
|---|---|---|---|---|
| light | fg on bg | `#241C18` on `#F4EFE6` | **14.62** | normal |
| light | muted on bg | `#5A534E` on `#F4EFE6` | **6.59** | normal |
| light | faint on bg | `#8C867F` on `#F4EFE6` | **3.14** | large |
| light | fg on raised | `#241C18` on `#FAF8F3` | **15.77** | normal |
| light | accent on bg | `#A88B68` on `#F4EFE6` | **2.80** | none |
| light | accentText on bg | `#7A6244` on `#F4EFE6` | **5.01** | normal |
| light | accentText on raised | `#7A6244` on `#FAF8F3` | **5.41** | normal |
| dark | fg on bg | `#F4EFE6` on `#241C18` | **14.62** | normal |
| dark | muted on bg | `#BEB8B0` on `#241C18` | **8.51** | normal |
| dark | faint on bg | `#8C867F` on `#241C18` | **4.65** | normal |
| dark | fg on raised | `#F4EFE6` on `#2D2521` | **13.11** | normal |
| dark | accent on bg | `#A88B68` on `#241C18` | **5.23** | normal |
| dark | accentText on bg | `#A88B68` on `#241C18` | **5.23** | normal |
| dark | accentText on raised | `#A88B68` on `#2D2521` | **4.69** | normal |
| deep | fg on bg | `#F4EFE6` on `#171210` | **16.22** | normal |
| deep | muted on bg | `#BBB6AE` on `#171210` | **9.21** | normal |
| deep | faint on bg | `#817C77` on `#171210` | **4.50** | large |
| deep | fg on raised | `#F4EFE6` on `#211C1A` | **14.72** | normal |
| deep | accent on bg | `#A88B68` on `#171210` | **5.80** | normal |
| deep | accentText on bg | `#A88B68` on `#171210` | **5.80** | normal |
| deep | accentText on raised | `#A88B68` on `#211C1A` | **5.26** | normal |
<!-- CONTRAST:END -->
## 035 — P20: the animation stack is loaded off the critical path

`src/lib/motion/gsap-setup.ts` now exports `loadGsap()` (dynamic import of
gsap + ScrollTrigger + SplitText + Flip, cached, plugins registered once) and
`peekGsap()` (synchronous access for frame-critical callers); the old synchronous
`setupGsap()` is gone. `useGSAP()` runs its callback immediately when the bundle
is already cached and otherwise when it lands, cancelling cleanly on unmount.
Lenis is imported alongside GSAP inside SmoothScroll, Motion's route progress
imports `motion/react` on the first navigation, and anime.js imports when an
industry icon first enters view. HeroCopyMotion and Accordion no longer use a
library at all — they animate with CSS (`@keyframes hero-copy-enter`, and
`grid-template-rows: 0fr -> 1fr` with `inert` on a closed panel).

Measured, `next build` First Load JS: homepage 249 kB -> 138 kB, /businesses
174 -> 118, service-exports 220 -> 119, /contact 252 -> 151, /global-presence
183 -> 127. The GSAP chunk (~36 kB gz) and the Motion chunk (~43 kB gz) are no
longer in the initial HTML.

Being straight about what this does and does not do: the download is kicked off
during hydration, so total bytes transferred are essentially unchanged. What
changes is that ~130 kB gzipped of animation code no longer blocks first paint
or competes with hydration for the main thread, and a visitor who bounces from
the hero never executes SplitText at all. The honest claim is a faster
interactive page, not a smaller one.

Consequences that call sites must respect: GSAP arrival is asynchronous, so
every animated state must be correct without it (server-rendered final values,
visible table rows, poster images) — which was already the P4/P6 rule. The one
frame-critical exception is the catalogue's Flip transition, which cannot wait
for a promise: it uses `peekGsap()` and simply skips the transition if GSAP has
not landed, because by the time a buyer clicks a category filter it always has.
## 036 — P20 accessibility: bronze words, focus, and landmarks

Four findings, four decisions. Each one is pinned by a test so it cannot be
quietly reverted.

**1. Bronze is not a text colour on light surfaces.** #A88B68 on ivory is 2.80:1
— it fails WCAG 1.4.3 at every size we set, and it was in use for eyebrows,
links, error messages and hover states across 26 files. A sixth brand token,
`bronzeInk` #7A6244, is the same hue darkened to 5.01:1 on ivory and 5.41:1 on
soft ivory: AA for body copy. Surfaces now expose `accentText` alongside
`accent` (bronze stays for hairlines, borders, underlines and icon fills, which
are non-text), and `--surface-accent-text` resolves per surface: bronze-ink on
light, true bronze on espresso (5.23:1) and espresso-deep (5.80:1), where bronze
already passes. `text-accent` is the surface-aware utility for components that
appear on both grounds (buttons); components that only ever sit on ivory use
`text-bronze-ink`. The header and footer — both dark — keep `text-bronze`, and a
test gate now requires any file using `text-bronze` to be able to point at a
dark ground. The contrast matrix in `scripts/check-brand-assets.ts` gained
`accentText on bg` and `accentText on raised` rows for all three surfaces.

**2. `<div id="main">` was not a landmark.** The skip link targeted it and it
behaved like a main region visually, but screen readers had no `main` landmark
to jump to. It is now `<main id="main">`.

**3. Focus was being dropped.** Two cases: Escape-closing the mega panel or the
mobile drawer unmounted the focused element and left focus on `<body>`, so a
keyboard user was silently returned to the top of the document — focus now goes
back to the trigger that opened the overlay. And a failed form submit coloured
six borders and fired six `role="alert"` announcements without saying which
field was the problem — `focusFirstInvalid()` now moves focus to the first
`aria-invalid` field on the next frame (after React has written the attributes).
The post-submit confirmation panel focuses its own heading for the same reason:
the panel replaces the form in the DOM, so there is no persistent element a live
region could have been attached to, and a region inserted together with the
change is not reliably announced. It carries `role="status"` as well.

**4. `aria-current="page"`, exact match only.** Nav links, mobile drawer links,
the RFQ CTAs and the home lockup now report the current route. Exact match
deliberately: announcing `/businesses` as "current page" while the buyer reads
`/businesses/product-exports` is wrong, and the breadcrumb already carries the
section context.

Also verified rather than assumed: one `h1` per route and no skipped heading
levels on `/`, `/industries/textile-apparel` and `/contact`; the region marquee
pauses on hover and focus-within and stops under reduced motion; the honeypot is
`aria-hidden` with `tabIndex={-1}`; external links announce "(opens in a new
tab)" unless the caller supplied an aria-label; the catalogue table has a
`sr-only` caption and `scope` on every header cell; every form field has
`autoComplete`.
## 037 — P21: one transport seam, one typed event bus, no analytics provider

**Transport.** `src/lib/forms/transport.ts` defines `EnquiryTransport`
(`id`, `disclosure`, `submit`) and a `SubmissionResult` union:
`{ kind: 'mailto', href }` or `{ kind: 'queued', reference }`. Both forms call
`submitThroughTransport(enquiry, event)`; the active transport is
`mailtoTransport`, and swapping in a server action or CRM webhook is a one-line
change to the exported `transport`. The union matters because the two results
are different truths: a mailto result means "your mail client now has this, and
nothing is stored here", a queued result means "we accepted it, reference X".
`SentPanel` in both forms now renders either sentence — the queued branch is
unreachable until a backend exists, and it is written rather than stubbed so
nobody has to invent copy under pressure later.

**Events.** `src/lib/analytics/events.ts` holds a typed map of the commercial
events (`rfq_compose`, `contact_compose`, `catalog_filter`, `rfq_cta_click`,
`callback_request`, `audit_request`, `bot_discarded`) and a `track()` that fans
out to subscribers and re-dispatches as a `trivoxa:analytics` CustomEvent.
Emitted today: `rfq_compose` (with division, industry, category, requested path,
destination), `contact_compose` (inquiry type, mailbox), `catalog_filter`
(category, visible row count) and `bot_discarded` (which form's honeypot was
filled).

Three of the seven are declared but NOT emitted — `rfq_cta_click`,
`callback_request`, `audit_request` — and that is a decision, not an oversight.
Every one of them lives on a server component (the closing CTA band, the hero,
the compliance audit CTA), so tracking a click means either adding a client
component to every page, which P20 just spent its budget removing, or appending
`?from=` to links, which pollutes canonical URLs for a metric that a real
analytics provider would get from referrer data anyway. They stay in the map as
the contract for whoever adopts a provider.

**No provider is installed.** No gtag, no GA/Plausible/Meta script, no vendor
SDK anywhere in `src/`, and `tests/forms.test.ts` fails the build if one appears
without the cookie notice changing in the same commit. The cookie notice's
honest sentence — this site sets no analytics cookies and runs no third-party
tracking — is a product position, not a gap to be filled quietly. Data leaves the
browser only when the buyer's own mail client sends the composed message.
