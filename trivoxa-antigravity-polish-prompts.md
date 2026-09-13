# Trivoxa Group — Antigravity Polish Prompt Series

**Target:** `trivoxa-group.pages.dev` (canonical `trivoxagroup.com`)
**Stack detected:** Next.js App Router (RSC), Tailwind, Cloudflare Pages, Inter / Instrument Serif / Geist Mono, `PerfTierProvider`, `SmoothScroll`, `KineticTextReveal`, `Reveal`, `ScrollProgress`, `RouteProgress`
**Routes in sitemap:** 25 (+ `/styleguide`, disallowed in robots)

Run prompts in order. Each is self-contained and pasteable. Paste **Prompt 00** first — it sets standing rules the rest depend on.

---

## Findings summary (what the crawl actually showed)

| # | Severity | Finding |
|---|---|---|
| 1 | **Critical** | Every animated heading renders as one run-on word in the accessibility tree and on copy — `"Whatwehold,whatweareapplyingfor,andwhen."`, `"BuildingtheFutureofGlobalCommerce."`, `"Twooperatingarms.Onecommitment."`. Site-wide, from `KineticTextReveal`. |
| 2 | **Critical** | RFQ form and Contact form are both `mailto:` only — *"Nothing is stored on this site."* No lead capture, no confirmation, no record. Dead on mobile and on webmail users. |
| 3 | **High** | Heading hierarchy is styling-driven, not structural. Card titles are `<h2>` siblings of the section `<h2>` (compliance credentials, insights series, "Pharmaceutical lines" as a body-sized `h2`). Industry pages print the `h1` text again as an `h2`. |
| 4 | **High** | `og:title` / `og:description` / `og:image` / `twitter:*` are **identical on every route** — compliance page ships the generic homepage OG. Only `<title>`, `description` and `canonical` are per-route. |
| 5 | **High** | Count data disagrees across pages. Home: *"25 products across 5 live categories"*. Catalogue: *"Categories 7"* with two at `0 · onboarding`. Footer lists 5. Industry pages label Technology `live` though it has no catalogue rows. |
| 6 | **High** | Broken / unverified anchors linked from the global footer: `/insights#subscribe` (the insights page explicitly has **no** subscribe form), `/contact#callback`, `/compliance#entity`, `/businesses#how-it-works`, `/group#leadership`, `/group#foundation`. |
| 7 | **Medium** | No structured data beyond `Organization` + `WebSite` + `BreadcrumbList`. No `FAQPage` (9 Q&As sit unmarked across `/rfq` and `/contact`), no `ItemList`/`Product` for 25 HS-coded catalogue rows, no `Person` for leadership. |
| 8 | **Medium** | Catalogue renders all 25 products **twice** in the DOM — full `<table>` plus full card list. Doubles payload and duplicates content for crawlers. |
| 9 | **Medium** | Zero photography site-wide. `/group` ships three visible `Photograph pending` placeholders pointing at `/images/foundation/*.jpg`. |
| 10 | **Medium** | Copy repetition. The Shiveshwar parent-company sentence appears verbatim 3× on `/group` alone. Every industry page prints its hero description a second time under "Where these products go". Leadership "bios" are three interchangeable corporate statements, none about the person. |
| 11 | **Medium** | `/insights` has 0 published items but 3 declared series; `/careers` has 0 roles. Both are honest but thin — indexable pages with no content. |
| 12 | **Medium** | An `EN` control sits in the header with no `hreflang`, no locale alternates and no second locale anywhere. Either a dead control or an unshipped feature. |
| 13 | **Low** | `pages.dev` preview is fully indexable (`robots.txt` = `Allow: /`, canonical points to prod, but no `X-Robots-Tag`). Duplicate-deployment risk. |
| 14 | **Low** | Four legal pages all carry *"under internal review"*. Timeline text on `/group` has steps 01–05 with no dates. |

**Not verified** (no browser session): visual rendering, mobile layout, hover/focus states, the `EN` switcher behaviour, catalogue filter chips, scroll animation timing, real Lighthouse numbers. Prompts 12 and 13 cover those with instructions for Antigravity to check in a real browser.

---

## Prompt 00 — Standing rules + repo recon

```
You are working on the Trivoxa Group marketing site (Next.js App Router, TypeScript, Tailwind, deployed to Cloudflare Pages, canonical domain https://trivoxagroup.com).

STANDING RULES for this entire session — apply to every task I give you from now on:
1. Ship complete, working code. No stubs, no TODO comments, no placeholder implementations, no "rest of the file unchanged".
2. No `any` types. If a type is genuinely unknown, use `unknown` and narrow it.
3. No console.log / console.warn / console.error in shipped code. Errors surface through proper UI state or a typed error boundary.
4. Do not restyle anything I did not ask you to change. This site has an established design language (bronze/ivory, Instrument Serif display, Inter body, Geist Mono for spec values, hairline rules, eyebrow labels). Match it exactly.
5. Every content string must come from the existing data modules, never be hardcoded inline in a component.
6. Run `pnpm build` (or the project's build command) after each task and fix anything it surfaces before telling me you're done.
7. When a task touches more than three files, show me the file list and your plan before you start editing.

FIRST TASK — recon only, no edits:
a) Map the route tree. List every page under app/, its file path, and whether it is static, dynamic or uses a route handler.
b) List every shared component in the layout chain: SiteHeader, footer, KineticTextReveal, Reveal, ScrollProgress, RouteProgress, SmoothScroll, PerfTierProvider, ButtonLink, IconMark. For each: file path, props, and how many routes consume it.
c) Find every data module (products, industries, regions, certifications, ports, leadership, FAQ, routing table) and report: file path, exported shape, and which routes read it.
d) Report where SEO metadata is generated — the root metadata object, any generateMetadata functions, and any shared metadata helper.
e) Report the current lib/ utilities, the Tailwind theme extension, and the CSS custom properties defined in globals.

Output this as a single structured markdown report. Change no files.
```

---

## Prompt 01 — Fix the run-on heading bug (site-wide, highest severity)

```
CRITICAL BUG — every animated heading on this site is unreadable to assistive tech and unusable on copy-paste.

Evidence, pulled from the rendered accessibility tree:
- /compliance h1 reads: "Whatwehold,whatweareapplyingfor,andwhen."
- / h1 reads: "BuildingtheFutureofGlobalCommerce."
- / h2 reads: "Twooperatingarms.Onecommitment."
- /group h2 reads: "FromamillinSurattonineindustries."

Cause: KineticTextReveal splits heading text into per-word (or per-character) spans and the inter-word whitespace is lost from the DOM text content. Sighted users see spacing because of CSS/transform layout; screen readers, copy-paste, text extraction and search-engine snippet generation all see one concatenated token.

TASK:
1. Open the KineticTextReveal component and reproduce the problem — log nothing, just read how it builds its spans.
2. Fix it so the accessible text is the intact original string, using whichever of these fits the component's architecture best:
   - Render an `aria-hidden="true"` decorative layer of animated spans, plus a visually-hidden (`sr-only`) element containing the unmodified string; or
   - Keep a single accessible node and emit real whitespace between word spans (a `&nbsp;`-free approach: give each span `white-space: pre` and include the trailing space inside the span's text).
   Pick one, apply it consistently, and explain in one sentence why you chose it.
3. Verify the fix works for: single-line headings, multi-line headings, headings containing punctuation and ampersands, and the hero variant (isHero={true}).
4. Confirm `prefers-reduced-motion: reduce` renders the plain, fully-spaced heading with no animation at all.
5. Then audit every other place text is split for animation — search the codebase for split(''), split(' '), and any per-character mapping in a render path — and apply the same fix.

ACCEPTANCE:
- `document.querySelector('h1').textContent` on /compliance returns exactly "What we hold, what we are applying for, and when."
- Selecting and copying any heading yields correctly spaced text.
- The visual animation is unchanged from today.
- Zero new layout shift: measure CLS on / and /compliance before and after.
```

---

## Prompt 02 — Heading hierarchy and landmark pass

```
The heading levels on this site are chosen by visual size, not by document structure. Fix them.

Confirmed problems:
- /compliance: the section heading "2 credentials we hold today." is an <h2>, and the individual credential cards ("IEC", "GST") are ALSO <h2> — they should be <h3>.
- /compliance: "Pharmaceutical lines", "Food and agricultural lines", "Third-party inspection", "Documentation integrity" are <h2> elements styled at body size, nested under an <h2> section heading.
- /insights: "Market Intelligence", "Compliance & Documentation", "Sourcing & Supply Chains" are <h2> siblings of the "Three things we will write about" <h2>.
- /industries/[slug]: the h1 is the industry name, and a later section prints the SAME industry name again as an <h2> with the SAME description paragraph beneath it. Both the duplicate heading and the duplicate paragraph must go.

TASK:
1. Walk all 25 routes. For each, produce the current heading outline (level + text) and the corrected outline.
2. Apply the corrections. Rules: exactly one h1 per page; section headings h2; cards, list items and sub-blocks inside a section h3; never skip a level; heading level is independent of the Tailwind text-* class used.
3. Where a card title is not genuinely a heading (a spec label, an eyebrow, a numeric index like "01"), demote it to a <p> or <span> rather than inventing a heading level.
4. Verify every page has exactly one <main id="main">, that the skip link targets it, and that each <nav> and the footer carry a distinct aria-label.
5. Run axe-core (or `npx @axe-core/cli`) against all 25 routes and report the before/after violation counts.

ACCEPTANCE: zero "heading-order" and zero "page-has-heading-one" violations across all routes. No visual change anywhere — this is markup only, the text-* classes stay exactly as they are.
```

---

## Prompt 03 — Replace mailto forms with a real submission pipeline

```
Both conversion surfaces on this site are mailto: links. /rfq says "Opens your mail client with the enquiry formatted for our export desk. Nothing is stored on this site." /contact says the same. For a B2B export site where the RFQ is the entire funnel, this loses most leads: mobile users, webmail users, and anyone on a locked-down corporate machine never complete it.

Build a real pipeline. Keep the current copy voice — plain, specific, no marketing padding.

TASK:
1. Create a typed submission schema with Zod, shared between client and server:
   - RFQ: fullName, company, email, phone?, destination?, industry?, category?, productOfInterest?, requirement, source?, plus hidden context fields (product slug, category slug, path=sample|audit, referring URL).
   - Contact: inquiryType (product | service | sample | audit | partnership | careers), fullName, company?, email, callbackNumber?, message.
2. Add a Next route handler for each (POST). Server-side: re-validate with the same schema, reject on failure with field-level errors.
3. Persist to Supabase. Two tables, `rfq_submissions` and `contact_submissions`, with created_at, status, and the full payload. Write the migration SQL. RLS on, insert only via the service role from the route handler — never from the client.
4. Send two emails via Resend per submission:
   - To the desk. Route by the existing routing table: product/sample/audit -> sales@trivoxagroup.com, service/general -> hello@trivoxagroup.com, partnership -> partnerships@trivoxagroup.com, careers -> careers@trivoxagroup.com. Subject line must include the inquiry type and the company name. Body must be a readable spec sheet, not a JSON dump.
   - To the sender: an acknowledgement restating what they submitted and the published response window (24 business hours IST, Mon–Sat 10:00–19:00).
5. Spam controls: a honeypot field, a minimum time-to-submit check, and Cloudflare Turnstile. No CAPTCHA that blocks keyboard users.
6. Client UX: inline per-field validation on blur, a disabled+pending submit state, an accessible success panel (role="status") that replaces the form and restates the response window, and an error state that keeps the user's input and offers the mailto: route as an explicit fallback. Never lose typed data.
7. Honour the deep-link params already in use across the site: /rfq?product=cotton-yarn&category=textile-apparel, /rfq?category=furniture-interiors, /rfq?path=sample, /rfq?path=audit. On load, prefill the relevant selects and the requirement textarea, and show a dismissible chip naming what was prefilled. Right now these params are passed by dozens of links and appear to do nothing — verify and fix.
8. The /rfq FAQ says "Use the audit route on this page and the enquiry reaches the desk marked for it." Make that literally true.
9. Update both pages' trailing copy: remove "Nothing is stored on this site." and replace with an accurate one-liner plus a link to the privacy policy.

ACCEPTANCE: submit each form end to end in a real browser; confirm the Supabase row, both emails, the success state, the error state with the network offline, and prefill from all four deep-link shapes. No `any`. No console statements.
```

---

## Prompt 04 — Fix every broken anchor and dead control

```
The global footer and several body links point at fragment anchors. Verify each one resolves to a real element and fix the ones that do not.

Links to verify (all are currently live in the footer or body copy):
- /insights#subscribe  — the insights page explicitly states there is NO newsletter form on it. The footer "Subscribe →" therefore points at nothing.
- /contact#callback    — footer "Direct line on request — ask for a callback".
- /compliance#entity   — footer "Registered entity".
- /businesses#how-it-works — linked from /businesses/product-exports and from every industry page.
- /group#leadership and /group#foundation — footer Company column.

TASK:
1. For each, confirm whether an element with that id exists. Report a table: anchor, target exists yes/no, current behaviour.
2. Fix by adding the missing id to the correct section — not by changing the link to a bare page link. The link text promises a specific destination; honour it.
3. For /insights#subscribe specifically: either build the subscribe capture (reuse the Prompt 03 pipeline, table `newsletter_subscribers`, double opt-in via Resend) and give it id="subscribe", OR change the footer to the mailto: the insights page already offers. Build it — a footer that promises a newsletter and delivers a dead link is worse than either.
4. Ensure every anchor target has scroll-margin-top accounting for the sticky header, so the heading is not hidden under it on arrival.
5. The header contains an "EN" control with no locale alternates, no hreflang tags and no second locale in the app. Determine what it does. If it is non-functional, remove it — a dead language switcher on a site selling to six regions reads as broken. If i18n is planned, tell me what it would take and leave it out for now.
6. Crawl all 25 routes and report any other href that 404s, redirects, or points at an anchor that does not exist — internal and external (including the four social URLs and digital.trivoxagroup.com).
```

---

## Prompt 05 — Single source of truth for all counts and status labels

```
The site contradicts itself on numbers. Fix by deriving every count from data, never hardcoding.

Confirmed contradictions:
- Homepage: "25 products across 5 live categories."
- /businesses/product-exports header: "Categories: 7" — the filter chips show 7, two of which read "0 · onboarding".
- Footer "Categories" column: lists 5.
- "Industries: 9" everywhere, but only 7 product categories exist.
- /industries/furniture-interiors "Related industries" labels Technology as `live`, yet Technology has zero catalogue rows and does not appear as a product category at all.
- /businesses/product-exports sampling cards read "7 of 7 categories" against a 5-live/2-onboarding reality.

TASK:
1. Consolidate products, categories and industries into one typed data module with an explicit status union: 'live' | 'onboarding'. Derive the industry<->category relationship from data rather than duplicating lists.
2. Export derived selectors: totalProducts, liveProducts, totalCategories, liveCategories, onboardingCategories, totalIndustries, liveIndustries. Every count rendered anywhere on the site must call one of these.
3. Grep the codebase for hardcoded "25", "9", "7", "5", "6", "3" used as counts in JSX or copy strings and replace each with the derived value or a template using it.
4. Fix the labelling rule: a category or industry is `live` only if it has at least one published catalogue row. Apply it everywhere — filter chips, related-industries lists, homepage stats, sampling coverage lines, the industry page "Catalogue rows / Live today" spec block.
5. Make the copy honest where the shapes genuinely differ: "25 products across 5 live categories, 2 more onboarding" rather than a bare "7".
6. Add a build-time assertion (a small script run in CI, or a test) that fails if any category marked `live` has zero products, or if the industry list and category list fall out of sync.

ACCEPTANCE: no count appears as a literal in any component. Flipping one product's status in the data module updates every page correctly. The assertion fails when you deliberately introduce an inconsistency.
```

---

## Prompt 06 — Per-route Open Graph and Twitter metadata

```
Every route on this site ships identical social metadata. Confirmed on /compliance: the page has a correct per-route <title> and description, a correct canonical to https://trivoxagroup.com/compliance — but og:title is "Trivoxa Group | International Trade & Business Group" and og:description is the generic homepage line. Same on every other route. Any share of a specific page misrepresents it.

TASK:
1. Build a typed metadata helper that takes { title, description, path, ogTitle?, ogDescription?, ogImage? } and returns a complete Next Metadata object: title, description, canonical (always absolute, always the trivoxagroup.com production origin), openGraph (title, description, url, siteName, locale, type, images with width/height/alt), and twitter (summary_large_image, title, description, image, alt).
2. Wire every route's generateMetadata through it. og:title and og:description must default to the page's own title and description, not to the site defaults.
3. Add the missing og:url per route — it is absent today.
4. Add alt text to every og:image entry. It is missing.
5. Build dynamic OG images using Next's ImageResponse at the edge, in the site's own visual language (bronze on the deep surface, Instrument Serif display line, Geist Mono spec line, the Trivoxa mark). Templates:
   - default (home, group, global-presence)
   - industry: industry name + live/onboarding status + catalogue row count
   - catalogue: "25 products · HS code, MOQ, lead time, Incoterms"
   - compliance: "2 active · 7 in progress · next target 2026-Q4"
   - rfq / contact: the response-window line
6. Fonts must be loaded correctly in the ImageResponse runtime, not silently fall back to a system face.
7. Verify each of the 25 routes renders a distinct, correct card in a real validator, not just by reading the HTML.

ACCEPTANCE: a table of all 25 routes with their resolved og:title, og:description, og:url and og:image, all distinct and all accurate.
```

---

## Prompt 07 — Structured data for the parts that can actually rank

```
Current JSON-LD: Organization (good — parent company, departments, founders, areaServed, sameAs all present), WebSite, and BreadcrumbList per page. Everything commercially useful is unmarked.

TASK:
1. FAQPage. /rfq carries 5 Q&As ("How quickly will I get a quotation?", "Do you supply products that are not in the catalogue?", "Which Incoterms do you quote?", "Can I get a sample before committing?", "Can we audit the factory, or send a third party?") and /contact carries 4. Both are unmarked. Move the FAQ content into a typed data module and generate FAQPage JSON-LD from it so the markup can never drift from the visible text.
2. Catalogue. Emit an ItemList on /businesses/product-exports, and a Product node per row carrying name, category, the HS code as an additionalProperty, and an Offer with availability and areaServed. Do NOT invent prices — there are none published, and fabricating them would be both wrong and a rich-result violation.
3. Leadership. Add Person nodes on /group for the three founders, linked to the Organization via worksFor, matching the founder[] data already in the Organization schema. Keep one source of truth for the three of them.
4. Industry pages. Add CollectionPage (or Service where a category is onboarding rather than catalogued) with an ItemList of that industry's products.
5. Insights. Once articles exist, Article/BlogPosting per post. For now, ensure the empty state emits nothing rather than an empty ItemList.
6. Validate every route's output against the Rich Results Test and the Schema.org validator. Report pass/fail per route.

CONSTRAINT: all JSON-LD must be generated from the same data modules that render the visible page. No hand-written JSON-LD literals — that is how markup and page content drift apart.
```

---

## Prompt 08 — Catalogue: kill the duplicate DOM, then make it fast

```
/businesses/product-exports renders all 25 products TWICE in the DOM — once as a full <table> with eight columns, once as a full list of definition-list cards. Both are present simultaneously; presumably one is hidden per breakpoint by CSS. This doubles the HTML payload and gives crawlers the entire catalogue twice on one URL.

TASK:
1. Confirm the duplication and how it is currently hidden (CSS display, Tailwind breakpoint classes, or conditional rendering).
2. Restructure so the product data exists once in the DOM. Either:
   - a single semantic <table> that reflows to a card layout at narrow widths using CSS grid on the row elements, or
   - a single source array rendered once, with the table markup used at md+ and the card markup at sm, mounted exclusively — not both.
   The table is the accessible, correct choice for spec data (HS code, grade, MOQ, lead time, Incoterms, loading port). Prefer the reflow approach and keep <caption>, <th scope>, and the existing descriptive caption text.
3. The filter chips (All / 7 categories with counts) must be real controls: keyboard operable, aria-pressed state, and they must write to the URL (?category=slug) so a filtered view is shareable and back-button-correct. Confirm whether ?category= from the footer links currently applies the filter on load — if not, make it.
4. Add a text filter over product name and HS code. Debounced, no layout shift, with a proper empty state.
5. The "Showing 25 of 25 products · 25 live today" line must be an aria-live="polite" region that announces filter results.
6. Measure: HTML transfer size, LCP and CLS on this route before and after. Report the numbers.

ACCEPTANCE: view-source shows each product exactly once. Keyboard-only traversal of filters and table works. Screen reader announces row context correctly. No `any` in the filter state types.
```

---

## Prompt 09 — Product detail pages (the real SEO upside)

```
There are 25 catalogue rows, each with an HS code, grade, MOQ, lead time, Incoterms and loading port — and none of them has a URL. Every row links only to /rfq?product=slug. That is 25 pages of highly specific, high-intent, low-competition search surface currently invisible: buyers search "HS 5209.42 denim fabric exporter India", not "trivoxa".

TASK:
1. Create /products/[slug] as a statically generated route from the existing product data. 25 pages.
2. Page structure, in the site's existing visual language (hero eyebrow + display heading + spec dl, hairline rules, Geist Mono for spec values):
   - h1: product name
   - spec block: HS code, grade, MOQ, lead time, Incoterms, loading port (with the port's UN/LOCODE)
   - a plain-language section on what the grade notation actually means for that line
   - the destination-market documentation this line typically needs, sourced from the compliance data (phyto, COO, material test certs, ISPM 15, E1/E0, etc. as applicable)
   - the parent industry, linked
   - 3 related products from the same category
   - a prefilled RFQ CTA linking to /rfq?product=slug&category=slug
3. generateMetadata per product: title "<Product> — HS <code> | Trivoxa Group", a description naming grade and MOQ, canonical, and a per-product OG image using the Prompt 06 templates.
4. Product JSON-LD per page (no fabricated price), plus a BreadcrumbList: Home / Businesses / Product Exports / <Product>.
5. Link them in: make the catalogue product name a link to its detail page (keep the separate "Quote" action), add them to the industry pages, and add all 25 to sitemap.xml with a sensible priority and changefreq.
6. For onboarding categories with zero rows, do NOT generate empty product pages.

ACCEPTANCE: 25 new static routes build, all internally linked, all in the sitemap, each with distinct metadata and valid Product JSON-LD.
```

---

## Prompt 10 — Content: de-duplicate, de-generify, date the timeline

```
Copy problems found across the site. Fix in the existing voice — plain, specific, slightly austere, numbers over adjectives. Do not make it warmer or more promotional.

1. The Shiveshwar parent-company sentence ("Built on the manufacturing foundation of our parent company, Shiveshwar Textiles — decades of woven textile production expertise in Surat that inform every sourcing decision and quality standard we uphold.") appears verbatim three times on /group alone: the hero, the Ecosystem section, and again in the structured data. It also appears on /, /compliance and elsewhere. Site-wide consistency is deliberate and correct. Three times on one page is not. Keep it once per page, at the most load-bearing position, and write distinct supporting copy for the other two slots.

2. Every industry page prints its hero description a second time, verbatim, under "Where these products go". Confirmed on /industries/furniture-interiors. Fix the template: the second slot should say something the first does not — typical end use, order shape, what the buyer usually asks first.

3. Leadership bios on /group are three interchangeable corporate statements. "Leadership at Trivoxa is driven by a commitment to long-term thinking, responsible decision-making, and continuous improvement" is not a bio of Parth Mangukiya — it would fit any of the three, or nobody. Rewrite all three around what each founder actually does: the function they own, the decision that lands on their desk, what a buyer would email them about. Flag to me any fact you do not have rather than inventing one.

4. The Journey timeline (01–05, "Manufacturing Foundations" through "Growing Global Partnerships") has no dates. A timeline without dates is a list. Add years, or restructure it as phases and drop the timeline framing.

5. The six "Trivoxa Way" principles (Vision, Integrity, Excellence, Innovation, Partnership, Impact) are generic — the one-liners under them ("Specifications before superlatives", "Relationships measured in years, not shipments") are good and specific. Cut the generic labels or replace them with the specific lines as the headings.

6. /careers has no open roles and /insights has no published items. Both say so honestly, which is right. Strengthen each: /careers should describe the kind of person they'd hire and what a speculative application should contain; /insights should give the first piece a target quarter so "Published: 0" has a horizon attached.

7. The four legal pages all read "under internal review". Draft real Privacy, Terms, Cookie and Anti-corruption copy appropriate to an Indian exporter handling EU and UK buyer data (so: GDPR-aware, DPDP Act 2023-aware). Mark clearly at the top of your output that these are drafts requiring legal review before publication — do not present them as reviewed.

Show me a diff-style before/after for every copy change. Change no layout or component structure in this task.
```

---

## Prompt 11 — Imagery system and the pending-photo component

```
This site currently has no photography at all. /group ships three visible placeholder blocks reading "Photograph pending — /images/foundation/exterior.jpg — Awaiting original photography from Shiveshwar Textiles", plus a line stating "3 of 3 foundation photographs are still pending." The honesty is right and should stay; the presentation should be deliberate rather than look like a broken image.

TASK:
1. Build a typed PendingPhotograph component that renders the placeholder as an intentional design element in the site's language — hairline border, eyebrow label, Geist Mono filename, bronze accent — with a defined aspect-ratio box so nothing shifts when the real photo lands. It must be aria-labelled as a placeholder, not announced as an image.
2. Build the real image pipeline alongside it, so dropping a file into /images/foundation/ swaps automatically:
   - next/image with explicit width/height or fill + aspect-ratio, AVIF and WebP, responsive sizes, blurDataURL placeholders
   - a typed image manifest (path, alt, credit, aspect) so alt text is mandatory at the type level and cannot be forgotten
   - Cloudflare Pages image handling configured correctly for the Next adapter in use
3. Identify every other place on the site that would benefit from imagery and build the slots now, using PendingPhotograph until files exist: industry page heroes (9), the two division pages, the global-presence regions, and the catalogue category headers. A textile exporter with no fabric photography loses to competitors on first impression.
4. Set an explicit image budget: no single image over 200KB after optimisation, hero images preloaded, everything below the fold lazy.
5. Document in the repo README exactly what photographs are needed, at what aspect ratio and minimum resolution, so the client can shoot to spec.

ACCEPTANCE: placeholders look designed, not broken. Adding a real file requires only dropping it in and filling one manifest entry. Zero CLS on every route that gains an image slot.
```

---

## Prompt 12 — Motion, performance and reduced-motion

```
This site runs SmoothScroll, ScrollProgress, RouteProgress, Reveal, KineticTextReveal and a PerfTierProvider. Verify all of it behaves under real conditions — measure, do not assume.

TASK:
1. Report what PerfTierProvider currently measures and what it degrades. Confirm it actually downgrades animation on low-end devices rather than just existing.
2. Audit prefers-reduced-motion across the whole site. Under `reduce`: SmoothScroll must fall back to native scrolling, Reveal must render content in its final state immediately (never hidden), KineticTextReveal must render plain text, ScrollProgress and RouteProgress must not animate. Verify each — content that is opacity-0 until an animation runs is invisible content if the animation is suppressed.
3. Verify Reveal never leaves content permanently hidden if the IntersectionObserver never fires (element already in viewport on load, observer unsupported, JS error upstream). Content-visibility must fail open.
4. Run Lighthouse on /, /businesses/product-exports, /rfq, /compliance and one industry page — mobile throttled, three runs each, report medians. Target: LCP under 2.5s, CLS under 0.1, TBT under 200ms, INP under 200ms.
5. Check the font loading strategy. Four families are preloaded (Inter 400/500/600, Instrument Serif 400, Geist Mono). Confirm font-display, confirm the preloads are actually used on first paint, and drop any preload that is not.
6. Report the JavaScript bundle per route. The chunk list is identical across routes today, which suggests heavy shared client code. Identify what is client-side that could be a server component, and what could be dynamically imported.
7. Verify SmoothScroll does not break: anchor links, browser find-in-page, keyboard scrolling, or scroll restoration on back navigation. These are the four things smooth-scroll libraries usually break.

Report measured numbers before and after every change. No change ships without a number attached.
```

---

## Prompt 13 — Responsive, keyboard and cross-browser QA sweep

```
Open a real browser and walk all 25 routes. This is verification, not code — produce a findings report first, then fix.

Viewports: 320, 375, 414, 768, 1024, 1280, 1440, 1920. Also test at 200% browser zoom and with a 320px-wide viewport at 400% zoom (WCAG reflow).

For each route, check and report:
1. Horizontal overflow at any width. The catalogue table at 320px is the highest-risk surface.
2. Text truncation, orphaned words in display headings, and heading line-break quality at each breakpoint — Instrument Serif display lines that break badly look broken.
3. Sticky header behaviour: overlap with anchored content, behaviour over the deep/light surface transitions, behaviour on scroll-up, and the mobile nav (open, trap focus, close on Escape, close on route change, restore focus to the trigger).
4. Tap target sizes on mobile — minimum 44x44px for every interactive element including the filter chips and footer links.
5. Full keyboard traversal: visible focus ring on every interactive element against BOTH the light and deep surfaces, logical tab order, skip link works and is visible on focus, no focus trap outside the mobile menu, no positive tabindex anywhere.
6. Colour contrast: every text/background pair against WCAG AA (4.5:1 body, 3:1 large). Pay attention to surface-faint and surface-muted classes on the deep surface, and to the bronze accent on light — accent colours on light backgrounds are where this usually fails.
7. Browsers: Chrome, Safari (desktop and iOS), Firefox. Safari specifically for the smooth-scroll behaviour, backdrop filters, and any CSS the build targets loosely.
8. Every form control on /rfq and /contact: visible label (not placeholder-only), programmatic label association, correct inputmode and autocomplete attributes, and error messages associated via aria-describedby.

Deliver the findings as a table: route, viewport, severity, description, screenshot. Then fix everything severity medium and above and re-verify.
```

---

## Prompt 14 — Deployment, indexing and final verification

```
Final pass before this is called done.

1. The Cloudflare Pages preview at trivoxa-group.pages.dev is fully indexable: robots.txt says Allow: / and there is no X-Robots-Tag. Canonical correctly points to trivoxagroup.com, but that is a hint, not a directive. Add a _headers rule (or middleware) applying `X-Robots-Tag: noindex, nofollow` to any host that is not trivoxagroup.com. Verify it fires on the preview and does NOT fire on production.
2. Add production security headers via _headers: Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a Content-Security-Policy. Build the CSP against what the site actually loads — Resend, Supabase, Turnstile, the font files, the JSON-LD inline scripts. Report in enforce mode only after a report-only run comes back clean.
3. sitemap.xml currently lists 25 URLs, all with lastmod 2026-09-04. Generate lastmod from real content dates, add the 25 product pages from Prompt 09, and confirm every URL returns 200 and is self-canonical.
4. robots.txt: confirm the /styleguide disallow is intended, and that /styleguide is not linked from anywhere public.
5. Verify the /404 page (its copy — "This lane does not exist." with four suggested routes — is good, keep it) returns a real 404 status, not a 200.
6. Full link crawl of the production build: every internal href, every external href, every anchor fragment. Report anything that 404s, redirects more than once, or targets a missing id.
7. Re-run: `pnpm build`, TypeScript with no errors and no `any`, ESLint clean, axe-core on all routes, Lighthouse on the five key routes, Rich Results Test on the routes carrying JSON-LD.
8. Produce a final report: every issue from this session, its status, and the measured before/after for every performance and accessibility number.

Do not mark anything complete that you have not verified in a browser or a build.
```

---

## Suggested execution order

| Phase | Prompts | Why this order |
|---|---|---|
| **1 — Correctness** | 00, 01, 02 | Recon, then the two bugs that make the site read wrong to machines and assistive tech. Everything downstream depends on correct markup. |
| **2 — Conversion** | 03, 04 | The forms are the business. Fix them before anything cosmetic. |
| **3 — Consistency** | 05, 10 | Data truth, then copy truth. Do 05 before 06/07 so metadata and schema generate from corrected data. |
| **4 — Discoverability** | 06, 07, 09 | Per-route OG, schema, then the 25 product pages. |
| **5 — Craft** | 08, 11, 12 | Catalogue, imagery, motion and performance. |
| **6 — Verification** | 13, 14 | Browser QA and ship gate. |

Prompt 09 is the highest-leverage item for actual inbound traffic, but it depends on 05 and 06 being done first.
