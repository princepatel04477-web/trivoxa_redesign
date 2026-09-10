# Trivoxa Group — Website Rebuild Prompt Series

**Target stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP + Lenis + Motion (Framer) + anime.js · React Three Fiber
**For:** Claude Code / Cursor, run inside the repo, one prompt at a time
**Sources this series is built from:** the `Trivoxa website` Drive folder (brand colours, Navbar spec, Home / Group / Businesses / Industries / Global Presence / Insights / Careers / Contact page docs, Company Profile PDF), the new logo pack in `Logo/`, and the **Website & Brand Audit v1.0 (31 July 2026)** in `review/`.

---

## How to use this document

1. Run the prompts **in order**. Each one assumes the previous ones landed.
2. Paste a prompt whole — the *Context* block matters as much as the *Task* block. Don't trim it.
3. After every prompt, run the **Acceptance** checks before moving on. If a check fails, fix it in that same session rather than deferring — the audit found that most of the current site's problems came from things being built out of sequence and never reconciled.
4. Prompts marked **⚠ AUDIT FIX** exist specifically to close a finding from the July audit. Do not skip or reorder these.
5. Keep `docs/DECISIONS.md` (created in P0) updated as you go. Two of the audit's worst findings were caused by an unrecorded decision drifting across pages.

**Before you start — one non-engineering blocker.** The audit's single most damaging finding is that the site calls Shiveshwar Textiles a *"parent company"* on the Group page while the Company Profile PDF calls it *"one of Trivoxa Group's strategic partner companies."* That is a corporate-structure question, not a copy question. Get a definitive legal answer from the founders **before P2**, because P2 bakes it into the content model and every page renders from there.

---

## Brand reference (paste into any prompt that needs it)

```
COLOURS  (exact, from the Drive brand doc — do not invent shades)
  Espresso        #241C18   main brand colour, dark backgrounds, text on light
  Ivory           #F4EFE6   main light background, text on dark
  Deep Espresso   #171210   deepest sections, near-black brown
  Soft Ivory      #FAF8F3   light cream, cards on ivory
  Bronze Accent   #A88B68   SPARINGLY — hover states, hairlines, icon accents, premium details
  White           #FFFFFF

  Dark surface:  bg #241C18, text/logo #F4EFE6
  Light surface: bg #F4EFE6, text/logo #241C18
  Deep sections: bg #171210
  Bronze is never a background and never body text. It is a 1px line, an underline
  on hover, a small icon fill, a focus ring. If a screen has more than ~3% bronze
  by area, it is wrong.

TYPOGRAPHY  (see P1 — verify against the logo wordmark before locking)
  Display:  Instrument Serif  (fallback candidate: Fraunces, or Clash Display if
            the wordmark turns out to be a geometric sans)
  Body/UI:  Satoshi (Fontshare)  → fallback Inter
  Data:     Geist Mono — used ONLY for HS codes, MOQs, lead times, Incoterms,
            port codes. This is a deliberate signal: the spec data is the product.

VOICE
  Specific, not abstract. The audit's sharpest criticism of the current copy is
  "abstraction stacking" — the same trust/quality/partnership sentence rewritten
  six ways across every page. Every section must earn its place with a fact:
  an HS code, a port name, a lead time, a certification date, a factory photo.
  Cut roughly a third of mission language wherever it survives from the old site.
```

---

# PHASE 0 — Foundation

## P0 · Repo, assets, and decision log

```
You are rebuilding trivoxagroup.com — the site for Trivoxa Group, an international
trade and business group headquartered in Surat, Gujarat, India, operating a Product
Export division and a Service Export division, built on the manufacturing foundation
of Shiveshwar Textiles.

Set up the project. Do not build any pages yet.

1. Scaffold a Next.js 15 App Router project with TypeScript (strict), Tailwind CSS v4,
   ESLint + Prettier, and the following structure:

   src/app/                 routes only, thin — pages compose sections
   src/components/ui/       primitives (button, card, input, dialog, accordion...)
   src/components/sections/ page sections, one file per section
   src/components/motion/   animation wrappers and hooks
   src/components/three/    WebGL scenes
   src/content/             ALL copy and data as typed TS/MDX — no copy in JSX
   src/lib/                 utils, validation, config
   public/brand/            logo assets
   docs/                    DECISIONS.md, CONTENT-MODEL.md, MOTION.md, PERF-BUDGET.md

2. Install and configure: gsap (with ScrollTrigger, SplitText, Flip — all free in
   3.13+), lenis, motion (the Framer Motion successor package), animejs v4,
   three + @react-three/fiber + @react-three/drei, zod, react-hook-form,
   next-intl, clsx, tailwind-merge.

3. Asset intake. From the Drive folder "Trivoxa website / Logo":
   - "Trivoxa Final Logo file without BG" (transparent PNGs, 1.png–7.png)
   - trivoxa-logo.svg and trivoxa-logo check.svg
   - the 3D LOGO folder and Logo video folder
   Bring these into public/brand/. Then:
   - Produce an optimised SVG (SVGO, no embedded rasters, viewBox present,
     currentColor where the mark is monochrome) as public/brand/trivoxa-mark.svg
     and public/brand/trivoxa-wordmark.svg.
   - Produce ivory-on-espresso and espresso-on-ivory lockups.
   - Generate favicon.ico, icon.svg, apple-icon.png and opengraph-image.png from
     the new mark. THE OLD LOGO MUST NOT SURVIVE ANYWHERE — grep for it.
   - Do NOT ship the logo video or 3D renders on the critical path. Note them in
     docs/DECISIONS.md as candidates for the Group page and the loading state.

4. Open the logo files and tell me, in writing, what the TRIVOXA wordmark's
   letterforms actually are: serif or sans, high or low contrast, wide or normal
   tracking, any distinctive terminals or ligatures. I need this before P1 locks
   typography. Include a screenshot or a careful description.

5. Create docs/DECISIONS.md with an ADR-style table (date · decision · rationale ·
   affected files) and seed it with the stack choices above plus one OPEN entry:
   "Shiveshwar Textiles is Trivoxa's [parent company | strategic partner] — awaiting
   legal confirmation. Blocks P2."

Acceptance:
- `npm run build` passes clean.
- public/brand contains the new mark in SVG + both lockups + all favicon sizes.
- No reference to any previous logo file remains in the repo.
- You have reported the wordmark's typographic character back to me.
```

---

## P1 · Design system and tokens

```
Build the Trivoxa design system. Still no pages.

BRAND COLOURS — these are exact values from the client's brand document. Do not
add shades, do not invent a palette ramp beyond what's needed for state.

  --espresso:      #241C18   (brand primary; dark bg; text on light)
  --ivory:         #F4EFE6   (light bg; text on dark)
  --espresso-deep: #171210   (deepest sections)
  --ivory-soft:    #FAF8F3   (cards/raised surfaces on ivory)
  --bronze:        #A88B68   (accent ONLY)
  --white:         #FFFFFF

Rules, enforced in the token layer:
- Bronze is never a page background and never body copy. It is hairlines, hover
  underlines, small icon fills, focus rings, and the occasional number.
- Two canonical surfaces: DARK (espresso bg / ivory ink) and LIGHT (ivory bg /
  espresso ink), plus DEEP (#171210) for full-bleed statement sections. Every
  section declares which surface it is; nothing improvises a background.
- Text on any surface must clear WCAG AA. Verify ivory-on-espresso and
  espresso-on-ivory programmatically and record the ratios in docs/DECISIONS.md.

TYPOGRAPHY — use what you found in P0.
- If the wordmark is a serif: Display = Instrument Serif, Body = Satoshi (Fontshare,
  self-hosted), Data = Geist Mono.
- If the wordmark is a geometric/wide sans: Display = Clash Display or General Sans
  (Fontshare) instead, keeping Satoshi and Geist Mono.
Self-host every face with next/font/local. No render-blocking third-party font CSS.
Ship at most 3 families and at most 5 weights total.

Build a fluid type scale with clamp() — display-xl through body-sm plus an
"eyebrow" style (uppercase, letterspaced, 12–13px, used for the section labels the
content docs call out: OUR BUSINESSES, INDUSTRIES WE SERVE, WHY TRIVOXA, etc.).
Geist Mono is reserved for spec data: HS codes, MOQ, lead time, Incoterms, port
codes, certification numbers. This is a deliberate brand signal — the numbers ARE
the product for this audience.

SPACING & LAYOUT: 4px base, an 8-step scale, a 12-column grid with a 1440 max
content width and generous section rhythm (dark trade sites die from cramped
vertical space — target 120–180px section padding on desktop, 72–96px on mobile).

MOTION TOKENS in docs/MOTION.md and as TS constants:
  duration: instant 120 / fast 240 / base 400 / slow 700 / cinematic 1200
  easing:   ease-out-expo for entrances, ease-in-out-quad for loops,
            a custom cubic-bezier(0.16,1,0.3,1) as the house curve
  distance: reveals travel 16–32px, never more
  stagger:  60–80ms between siblings, capped at 8 items
Every motion value in the codebase reads from these tokens. No magic numbers.

Build the primitives: Button (primary espresso/ivory, secondary outline, ghost,
each with a bronze hover treatment), Link with an animated bronze underline, Card,
Input/Select/Textarea, Accordion, Tabs, Badge, Breadcrumb, Container, Section
(takes a `surface` prop: light | dark | deep), Eyebrow, SectionHeading.

Finally, build /styleguide as a dev-only route rendering every token, every type
style, and every primitive in all states, on all three surfaces. This page is how
we catch drift later.

Acceptance:
- /styleguide renders and shows all three surfaces side by side.
- Lighthouse on /styleguide: no contrast failures.
- Grepping the repo for a raw hex outside the token file returns nothing.
```

---

## P2 · The canonical content model  ⚠ AUDIT FIX

```
This prompt fixes the single biggest structural problem in the current site.

The July 2026 audit found FOUR different, mutually inconsistent lists of "what
Trivoxa sells" — 6 industries on the homepage, 8 on the Industries page, a
7-item tag list on the Businesses page, and 5 categories in the actual Product
Exports catalog. It also found regions listed as 6 on Global Presence but 5 in the
footer (with "Asia-Pacific" silently becoming "Southeast Asia" and South America
disappearing), three different contact email addresses, and Jewellery & Precious
Products marketed in the Company Profile PDF with no page anywhere on the site.

The root cause is that there was never one source of truth. Build it now.

Create src/content/taxonomy.ts as the ONLY place these lists exist:

  export const INDUSTRIES = [...]   // 8 entries, each: slug, name, shortDescription,
                                    // icon, heroImage, status: 'live'|'onboarding',
                                    // relatedCategories[], typicalBuyers[],
                                    // complianceNotes[]
  export const DIVISIONS = [...]    // productExports, serviceExports
  export const CATEGORIES = [...]   // product categories, each linked to an industry
                                    // slug and carrying status
  export const REGIONS = [...]      // 6 entries: Europe, Middle East, Africa,
                                    // North America, South America, Asia-Pacific —
                                    // one canonical name each, used in the footer,
                                    // on Global Presence, and in the globe data
  export const PORTS = [...]        // Mundra, Kandla, Nhava Sheva/JNPT + one-line
                                    // reason each
  export const CONTACT = {...}      // ONE email set: general, sales, careers,
                                    // partnerships — plus phone(s), hours (IST),
                                    // registered office, registered entity number
  export const CERTIFICATIONS = [...] // name, status: 'active'|'in-progress',
                                      // targetQuarter, issuingAuthority, number

Rules, enforced with zod schemas at build time and a unit test:
1. Every industry/category/region shown ANYWHERE on the site is rendered from these
   arrays. A hardcoded industry name in JSX must fail lint.
2. Homepage previews render `INDUSTRIES.slice(0, n)` and MUST carry a visible
   "View all N industries" affordance. Never a silently different subset.
3. Anything with status 'onboarding' renders with an honest, designed empty state —
   not an empty table, not a dead link. The audit specifically flagged the Fabrics
   table shipping em-dashes where HS codes and MOQs should be, on a page whose whole
   pitch is precision. An incomplete row must not render as a row.
4. Jewellery & Precious Products: either give it a real entry with status, or remove
   it from the taxonomy entirely. Whatever we choose gets recorded in DECISIONS.md
   and applied to the Company Profile PDF too. No third state.
5. Add a build-time consistency check (scripts/check-taxonomy.ts, wired into
   `npm run build`) that fails if: any category references a missing industry, any
   'live' item has empty required spec fields, the footer region list diverges from
   REGIONS, or more than one contact email appears in the codebase.

Also create src/content/company.ts holding the Shiveshwar Textiles relationship as a
SINGLE typed constant with a single canonical sentence, used verbatim on every page
that mentions it. Read the answer from docs/DECISIONS.md. If that entry is still
OPEN, stop and tell me — do not guess.

Write docs/CONTENT-MODEL.md explaining the model so future edits can't regress it.

Acceptance:
- `npm run build` runs check-taxonomy and passes.
- A test proves that changing REGIONS updates both footer and Global Presence.
- Zero industry/region/email string literals outside src/content.
```

---

# PHASE 1 — Shell and motion foundation

## P3 · App shell, navigation, footer  ⚠ AUDIT FIX

```
Build the site shell. Two audit findings are fixed here.

FINDING 1: Industries and Contact are absent from the primary navigation on the live
site, despite Industries being a well-built 8-page family and Contact being a
primary nav item in the client's own Navbar spec. The audit calls this "the single
highest-leverage, lowest-effort fix in this entire report."

FINDING 2: The site has two overlapping conversion destinations — Contact and
Request a Quote — that were never reconciled, with Contact mostly routing traffic
away to RFQ anyway.

Build a mega-menu grouped by BUYER INTENT rather than by internal org chart, as the
audit recommends. This collapses the two parallel hierarchies (Industries vs.
Product catalog) that currently disagree with each other:

  WHAT WE EXPORT   → Industries (all 8, from taxonomy) + Product categories +
                     Service categories, in one browsing surface with a featured
                     panel on the right
  WHO WE ARE       → Our Story · Leadership · Shiveshwar Foundation · Vision ·
                     Commitments · Compliance
  GLOBAL NETWORK   → Global Presence · Insights
  WORK WITH US     → Request a Quote · Contact · Careers

Plus a persistent, always-visible "Request a Quote" button (bronze-accented, the
only bronze-heavy element in the header) and a language switcher.

Header behaviour:
- Transparent over the hero on dark pages; on scroll past 80px it fills with
  espresso, gains a 1px bronze hairline, and compresses height. Animate with GSAP
  ScrollTrigger, not a scroll listener.
- The mega-menu panel opens with a height/opacity transition using the house curve;
  columns stagger in at 60ms; the featured panel image does a subtle scale-from-1.04.
- Full keyboard support: Escape closes, focus trapped while open, arrow keys move
  between items, aria-expanded correct. Do not ship a mouse-only mega-menu.
- Mobile: full-screen overlay, accordion sections, staggered entrance. Consider
  React Bits' "Staggered Menu" or "Flowing Menu" as a starting point, restyled to
  the espresso/ivory palette — do not ship it in its stock colours.

Footer, from the client's spec plus what the audit says is missing:
- Columns: Company · What We Export (rendered from taxonomy) · Resources · Legal
- Contact block: general email, phone, business hours in IST, registered office,
  AND the registered entity number. The audit found no phone number and no legal
  entity number anywhere on the site — a German importer and a compliance team both
  flagged this as a credibility problem. They are not optional.
- Regions line rendered from REGIONS so it can never drift from Global Presence again.
- Newsletter: "Quarterly dispatch on global trade and business insights."
- Compliance and Anti-corruption Policy links — and per the audit these should ALSO
  be surfaced from the Group and Contact pages, not buried here only.
- "A venture built on the manufacturing heritage of Shiveshwar Textiles" rendered
  from src/content/company.ts.
- © Trivoxa Group 2026.

Also build: a skip-to-content link, the root layout with next/font, a route-change
progress indicator, and a 404 that is on-brand rather than default.

Acceptance:
- Industries and Contact are reachable from the primary nav on every single route.
- Keyboard-only navigation reaches every menu item; axe reports no violations.
- The footer region list and the Global Presence region list come from one array.
```

---

## P4 · Motion foundation

```
Build the animation layer. This is infrastructure, not decoration — get it right
once and every subsequent prompt becomes cheap.

The audit's UX reviewer warned specifically: "Fix the IA before investing more in
animation fidelity; right now you're decorating a structure that doesn't fully hang
together yet." The IA is fixed (P2, P3). Now we can spend on motion — but with a
performance budget, because a meaningful share of Trivoxa's buyers are in the Gulf,
Africa and South Asia on mid-tier mobile hardware.

1. Smooth scroll: Lenis, wired to GSAP's ticker so ScrollTrigger stays in sync.
   Disabled entirely under prefers-reduced-motion and on touch devices below the
   perf tier threshold (see 4).

2. GSAP setup: a single registerPlugin call (ScrollTrigger, SplitText, Flip,
   ScrollSmoother if licensed — otherwise Lenis covers it). A useGSAP hook wrapper
   with proper context cleanup. Never leave a ScrollTrigger un-killed on unmount.

3. Reusable motion components in src/components/motion/:
   - <Reveal>            fade + 24px rise, ScrollTrigger, once, 60ms stagger for children
   - <SplitHeading>      GSAP SplitText per-line mask reveal for display headings
   - <CountUp>           number ticker WITH A NON-JS FALLBACK — the audit found the
                         "Presence in Numbers" counters rendering as literal zeros in
                         a content fetch. A visitor whose JS is slow or blocked must
                         see the real figure, not "0 regions served". Render the final
                         value in the HTML and animate from a lower bound.
   - <Parallax>          subtle, max 12% travel
   - <Marquee>           logo/port/corridor ticker, pauses on hover, respects RM
   - <MagneticButton>    cursor attraction on the primary CTA only
   - <PageTransition>    View Transitions API where supported, Motion fallback
   - <ScrollProgress>    thin bronze hairline at the top of long pages

4. Performance tiering — build src/lib/perf-tier.ts that classifies the device once
   on mount into 'high' | 'medium' | 'low' using: navigator.hardwareConcurrency,
   deviceMemory, a WebGL capability probe, connection.effectiveType, and
   prefers-reduced-motion. Expose it via context. Every WebGL scene in this project
   reads this tier and degrades:
     high   → full particle count, post-processing
     medium → reduced particle count, no post-processing
     low    → a static, beautifully-composed poster image. Not a broken canvas.
   Write the tier thresholds into docs/PERF-BUDGET.md alongside the budget:
   LCP < 2.5s on a mid-tier Android over 4G, CLS < 0.05, INP < 200ms,
   initial JS < 180KB gzipped excluding WebGL chunks (which must be dynamically
   imported and below the fold or behind a tier check).

5. Reduced motion is a first-class path, not an afterthought: content appears at its
   final position with a 120ms opacity fade, WebGL scenes render their poster image,
   marquees stop. Test it by actually toggling the OS setting.

6. Library boundaries, so we don't end up with four libraries doing one job:
   GSAP + ScrollTrigger  → all scroll-driven and timeline work
   Motion (Framer)       → React component enter/exit, layout animations, gestures
   anime.js v4           → small standalone SVG/icon and numeric micro-animations
   React Three Fiber     → the eagle, the globe, and nothing else
   Record this in docs/MOTION.md.

Acceptance:
- Every motion component works, and works correctly under prefers-reduced-motion.
- <CountUp> shows the real number with JS disabled.
- perf-tier returns 'low' when throttled to 4x CPU slowdown + Slow 4G in DevTools.
```

---

## P5 · Component library — React Bits & 21st.dev intake

```
Bring in the third-party component vocabulary and make it ours.

The client wants React Bits (reactbits.dev) and 21st.dev components. The audit's
branding reviewer warned that the current visual language is "competent, safe,
on-trend B2B design — nothing embarrassing, nothing memorable either." Shipping
these components in their default neon/gradient styling would make that worse, not
better. Every component that comes in gets re-themed to espresso/ivory/bronze and
re-timed to our motion tokens before it is used anywhere.

React Bits is copy-in source, not a dependency — take the source, put it in
src/components/ui/ or src/components/motion/, and edit it. Candidates to evaluate
(verify each exists and behaves as expected in the current gallery before relying
on it):

  Backgrounds / atmosphere   Particles, Threads, Silk, Waves, Aurora, Squares, Beams
  Text                       Split Text, Scroll Reveal, Scroll Float, Shiny Text,
                             Count Up, Variable Proximity, Text Pressure
  Interaction                Animated Content, Fade Content, Magnet, Glare Hover,
                             Star Border, Click Spark, Pixel Transition
  Layout                     Spotlight Card, Card Swap, Chroma Grid, Scroll Stack,
                             Bounce Cards, Circular Gallery, Logo Loop, Stepper,
                             Staggered Menu, Flowing Menu, Infinite Scroll

For 21st.dev, use the shadcn-compatible registry installs and then restyle. Pull
what genuinely fits: bento grids, marquee bands, animated tabs, testimonial and
stat sections, gradient/border-beam buttons.

Hard rules for intake:
1. No component ships in its stock palette. Espresso/ivory/bronze only.
2. No component ships with its stock durations. Rewire to our motion tokens.
3. Every one gets a reduced-motion path and a perf-tier check if it uses canvas
   or WebGL.
4. Every one gets an entry on /styleguide showing it on all three surfaces.
5. Anything that pulls a heavy dependency for a small effect gets rejected —
   note the rejection and why in docs/DECISIONS.md.
6. Cap the vocabulary. Pick roughly 12–15 components total for the whole site. A
   site using thirty different animation idioms reads as a demo reel, not as an
   international business group. Restraint IS the premium signal here.

Deliverable: the chosen components, re-themed, on /styleguide, plus a short
docs/COMPONENTS.md saying which component is the house solution for which job
(e.g. "card grids use Spotlight Card; stat bands use CountUp + Reveal; the only
marquee on the site is the export-corridor band").

Acceptance:
- /styleguide shows every adopted component on light, dark and deep surfaces.
- No stock colour values remain — grep for the originals.
- Bundle impact measured and recorded per component.
```

---

# PHASE 2 — Homepage

The client's Home page doc specifies a continuous particle narrative: an eagle made
of particles in the hero that dissolves on scroll, reassembles into a network, splits
into business cards, regroups into industry icons, forms a globe, then settles into
article cards. That is a beautiful idea and it is also the highest-risk thing in this
build. **P6–P10 implement it as a sequence of independent scenes that share a visual
language and hand off cleanly — not as one continuous 8-minute WebGL timeline.** One
uninterruptible mega-canvas is unshippable on mid-tier mobile and unmaintainable at
any tier. The handoff between scenes carries the story; the scenes stay separable.

## P6 · Hero — the particle eagle

```
Build the homepage hero.

CONTENT (from the client's docs and the live site — keep this headline, the audit
called it worth keeping):
  Eyebrow:   INTERNATIONAL TRADE & BUSINESS GROUP
  Headline:  Building the Future of Global Commerce.
  Sub:       one tight sentence — sourcing, manufacturing partnerships and
             professional services, built on the manufacturing foundation of
             Shiveshwar Textiles. Render the Shiveshwar sentence from
             src/content/company.ts.
  Primary CTA:   Request a Quote
  Secondary CTA: Explore What We Export

VISUAL: the Trivoxa eagle rendered as a particle system in React Three Fiber.

Implementation:
1. Derive the point cloud from the NEW logo mark in public/brand/. Sample the SVG
   path or an alpha map into 40k–80k positions at tier 'high'. Store as a Float32
   buffer. Do NOT hand-place particles.
2. Custom shader material: additive blending, ivory (#F4EFE6) core with bronze
   (#A88B68) fringing on ~8% of particles for the premium detail the brand doc asks
   for. Espresso-deep (#171210) background.
3. Idle motion, all subtle — the doc's words are "shimmer", "breathing", "gentle
   drift". Amplitudes small enough that a screenshot still reads as a clean eagle.
4. Pointer interaction: a soft repulsion field following the cursor, eased, that
   settles back. On touch, disable entirely.
5. Scroll dissolve: ScrollTrigger scrubs the particles from the eagle formation
   outward into a dispersed field as the hero leaves the viewport. It must be
   scrubbed, not triggered — the user controls it.
6. TIERING is mandatory:
     high   → 80k particles, bloom
     medium → 25k particles, no post-processing
     low    → a static hero image: a beautifully composed still render of the eagle
              (export one from the 3D LOGO folder or render one from the scene at
              build time), with the headline animating in via SplitText only.
   Reduced motion → the static path, always.
7. Lazy-load the entire three.js chunk. The headline, sub, and CTAs must be in the
   server-rendered HTML and readable before any WebGL initialises. LCP is the
   headline, never the canvas.

Text motion: SplitText per-line mask reveal on the headline (700ms, house curve,
80ms line stagger), sub fades at +200ms, CTAs at +320ms, scroll cue at +600ms.

Acceptance:
- LCP < 2.5s on Moto G4 / Slow 4G profile with the canvas present.
- Low tier renders the poster image and never mounts a WebGL context.
- Headline is readable with JS disabled.
- 60fps sustained on a mid-range laptop at tier 'high'.
```

---

## P7 · Proof band + Why Trivoxa

```
Build the two sections directly under the hero.

The audit made a specific recommendation here worth following: a cold B2B visitor is
"scanning for proof of operational reality faster than they are reading brand
narrative." So we lead with something concrete before we lead with story.

SECTION A — PROOF BAND (new; not in the original docs, added on the audit's advice)
A quiet, dense band on the DEEP surface immediately below the hero, containing real
operational facts pulled from the taxonomy:
  - Named export ports: Mundra · Kandla · Nhava Sheva (JNPT), each with its one-line
    reason. The audit called these "excellent, specific, and exactly the kind of
    detail that reassures a logistics-literate buyer."
  - Live product count and category count, from the catalog data (never hardcoded).
  - Response window: within 24 business hours (IST).
  - Compliance posture: a single honest line linking to /compliance — e.g.
    "IEC and GST active. ISO 9001, FSSAI and WHO-GMP in progress with target dates
    published." Honesty about a gap is a trust asset here; the Swiss-distributor
    persona in the audit called the compliance page the best thing on the site.
Typeset the numbers in Geist Mono. Use <CountUp> with its non-JS fallback.
Understated: hairline dividers in bronze, no cards, no icons bigger than 20px.

SECTION B — WHY BUSINESSES CHOOSE TRIVOXA
Four pillars, from the live site (this block is already good — the audit praised
leading with proof points before the company story, so keep the order):
  Manufacturing Foundation · Quality-Driven Operations · Global Trade Expertise ·
  Long-Term Partnerships
Each: a fine-line icon, a heading, and TWO sentences maximum. Rewrite the current
copy to cut abstraction — every pillar must contain one concrete noun (a process
step, a document type, a port, a standard). Replace "we believe in lasting
relationships" style sentences entirely.

Layout: 4-up on desktop, 2-up tablet, stacked mobile. Spotlight Card treatment with
a bronze border that traces on hover. Reveal with 70ms stagger. On the DEEP surface
so it reads as a continuation of the hero before the page opens up to ivory.

Acceptance:
- Every number in the proof band traces to taxonomy or catalog data.
- No sentence in either section is longer than 22 words.
- The word "leverage", "synergy", "seamless" and "cutting-edge" appear nowhere.
```

---

## P8 · Who We Are + Businesses + Industries previews

```
Build the middle of the homepage — three sections that share one particle handoff.

SECTION C — WHO WE ARE (About preview)
Short. Three paragraphs at most: who Trivoxa is, what it does, why it exists — plus
the canonical Shiveshwar sentence from src/content/company.ts. Lead with the
manufacturing lineage, assertively. The audit's branding read was blunt: the one
asset that is specifically Trivoxa is a real, decades-old textile manufacturer as
its operating foundation, and it is currently treated as a supporting footnote
rather than the spine of the story. Fix that here.
CTA: Discover the Group.
Background: the dispersed particles from the hero reorganising into a slow connected
network — a separate, much lighter canvas (medium tier and above only, 6k particles,
no interaction). At low tier, a static ivory surface with a bronze hairline motif.

SECTION D — BUSINESSES PREVIEW
Two large cards, from DIVISIONS in the taxonomy:
  Global Product Exports  — connects international buyers with trusted manufacturers
                            and sourced products from India
  Global Service Exports  — technology, AI, software, design & branding, digital
                            marketing, business support. Signpost the dedicated
                            property digital.trivoxagroup.com.
Each card: icon/visual, two-line description, category chips rendered from taxonomy,
"Explore" link. The structure must accept a third division later without redesign —
the client's doc is explicit about that.
Motion: cards assemble from the network with a Flip-based entrance; on hover, a
bronze border traces and the card lifts 4px with a soft espresso shadow.

SECTION E — INDUSTRIES PREVIEW  ⚠ AUDIT FIX
The audit found the homepage showing 6 industries while the Industries page lists 8,
with Furniture & Interiors and Retail & Consumer Goods silently dropped. Fix it:
render `INDUSTRIES.slice(0, 6)` from the taxonomy AND a visible, prominent
"View all 8 industries →" affordance. Never a silent subset again.
Each tile: fine-line icon, industry name, and — on hover — the short description
and an 'Explore' cue. Items with status 'onboarding' carry a small, honest bronze
label rather than being hidden.
Motion: business cards dissolve into particles that regroup into the industry icons
(anime.js v4 on the SVG paths for the icon draw-in is cheaper and cleaner here than
a WebGL morph — use it). Stagger the grid at 60ms.

Acceptance:
- Changing the length of INDUSTRIES changes the homepage count text automatically.
- The "view all" link is present and above the fold of that section.
- All three sections run at 60fps together at tier 'medium'.
```

---

## P9 · Global presence preview + the globe

```
Build the globe section. This is the highest technical-risk element on the site and
the audit flagged it explicitly: 3D globes are expensive, and a meaningful share of
Trivoxa's target buyers — Middle East, Africa, South Asia-adjacent markets — are on
mid-tier mobile hardware and inconsistent connections. Build the fallbacks first.

CONTENT
  Eyebrow: GLOBAL PRESENCE
  Heading: A Global Perspective. A Local Understanding.
  Six regions from REGIONS in the taxonomy — Europe, Middle East, Africa,
  North America, South America, Asia-Pacific — each with its industries focus.
  The three named ports.
  CTA: View Our Global Network

IMPLEMENTATION — three tiers, build them in this order:
  low    → a static, well-designed SVG world map on the deep surface with the six
           regions marked in bronze and the arcs drawn as flat paths. This must be
           genuinely handsome on its own, because a real share of visitors will only
           ever see this. Build it FIRST and make it good.
  medium → `cobe` (tiny, ~5KB, canvas-based, no three.js) — an auto-rotating dotted
           globe with region markers. Draggable. No arcs animation.
  high   → React Three Fiber: a dotted-sphere globe in espresso with ivory landmass
           points, bronze arcs drawing between Surat and each region as the section
           scrolls into view, region markers that respond to hover with a label,
           and drag-to-rotate with inertia. Auto-rotate slowly when idle; pause on
           interaction; resume after 3s.

HONESTY REQUIREMENT ⚠ AUDIT FIX
The current homepage ships a trade-corridor ticker with the disclaimer "illustrative
— representative of the lanes Trivoxa operates, not live shipment tracking." The
audit called the disclaimer honest and well-judged but noted that needing a footnote
to not mislead is itself a design smell. Resolve it: either
  (a) label the arcs as "trade corridors we operate in" in the section heading
      itself so no footnote is needed, or
  (b) drop the animated corridors and show static region relationships.
Take option (a). Do not ship a visual that implies live shipment tracking.

Never render "0 regions served". Region counts come from REGIONS.length and are
present in the server HTML.

Acceptance:
- Frame budget: the globe chunk is dynamically imported and never loads at tier low.
- Test on a throttled 4x-CPU / Slow-4G profile: the section is fully usable.
- The static map tier is reviewed and approved on its own merits before merging.
```

---

## P10 · Insights, Careers, closing CTA  ⚠ AUDIT FIX

```
Finish the homepage — and make an editorial decision the audit was firm about.

THE FINDING: the current homepage promotes Insights (six "coming soon" cards, zero
published articles) and Careers (zero open roles against a spec that had nine). The
audit's verdict: "A thin homepage preview of a strong page is fine; a rich homepage
preview of an empty page is a net negative." Both previews currently undercut the
confidence the rest of the homepage builds.

So build these two sections CONDITIONALLY, driven by content state:

INSIGHTS PREVIEW
  if publishedArticles.length >= 3  → the full three-card preview with the
                                      particle-to-card entrance from the client's doc
  if 1–2 published                  → a single-line band: "Latest thinking:
                                      [title] →". No grid, no empty slots.
  if 0 published                    → the section does not render at all. Not a
                                      placeholder, not "coming soon" — absent.
Wire this to the actual content collection so it flips on automatically the day
articles land. Log a build warning when it's suppressed so nobody forgets.

CAREERS PREVIEW
  Same pattern against openRoles.length. With zero open roles, render a single quiet
  line — "We hire when the role is real. Open applications welcome." linking to
  /careers — rather than a "Build What's Next With Us" hero for a page with nothing
  on it. The audit noted the current careers mailto routes to a co-founder's personal
  inbox; use the careers alias from CONTACT in the taxonomy.

CLOSING CTA
  Heading: Let's Build Global Business Together.
  Two buttons: Request a Quote (primary) · Start a Conversation (secondary).
  Deep surface, generous space, the eagle mark rendered large at ~4% opacity behind
  the text as a watermark. A slow, single bronze hairline drawing across the section
  on entry — one gesture, not five.

Then assemble the full homepage and review the whole scroll end to end. Check that
the particle narrative reads as one story rather than a sequence of unrelated
effects, and that a visitor who scrolls fast never sees a half-initialised canvas.

Acceptance:
- With zero published articles and zero open roles, neither section renders, and the
  page still reads as complete.
- Full-page Lighthouse on mobile: Performance ≥ 85, Accessibility ≥ 95, SEO 100.
- Total page weight under 1.5MB at tier medium.
```

---

# PHASE 3 — Inner pages

## P11 · The Group page

```
Build /group. This is the trust page, and per the audit it is already the strongest
content page on the site — the job is to preserve what works and fix one critical
contradiction.

STRUCTURE (from the client's Group page doc, plus "The Journey" which the developer
added and the audit praised as "not in the documentation at all — a strong addition"):
  1. Hero — particle network forming a global business graph (not the eagle; the
     doc is explicit that this hero is a network, not the bird). Same tiering rules.
  2. Who We Are
  3. Our Foundation — Shiveshwar Textiles, the manufacturing heritage, why it matters
  4. The Journey — a five-step scroll-pinned timeline from Shiveshwar's manufacturing
     foundations to the two export divisions launching. GSAP ScrollTrigger pin +
     horizontal scrub on desktop, vertical stepper on mobile.
  5. Our Story
  6. Our Vision
  7. The Trivoxa Way — Vision · Integrity · Excellence · Innovation · Partnership ·
     Impact
  8. Leadership — founder's message, profiles, philosophy. Real photos, real names,
     real direct emails from CONTACT (not personal Gmail-style addresses).
  9. Business Ecosystem — an animated diagram, not a bullet list: Trivoxa Group at
     centre, Product Export Division, Service Export Division, Manufacturing Network,
     Technology Partners, Logistics Partners, Global Client Network. Draw the
     connections with anime.js on SVG paths as the section enters.
 10. Strategic Partners
 11. Our Commitments
 12. Looking Ahead
 13. Contact CTA

⚠ AUDIT FIX — THE CRITICAL ONE
The current Group page says "As the parent company of Trivoxa Group, Shiveshwar
Textiles provides the manufacturing expertise…" while the Company Profile PDF calls
Shiveshwar "one of Trivoxa Group's strategic partner companies." The audit calls
this "the single most damaging inconsistency on the entire site because it touches
corporate structure, not just marketing copy" — and quotes a Fortune 500 procurement
persona saying it would go straight to their supplier-risk team as a flag.

Render EVERY mention of the relationship from the single canonical sentence in
src/content/company.ts. If that value is still marked OPEN in docs/DECISIONS.md,
stop and tell me — do not write a sentence and hope.

ALSO: surface the Compliance page from here (the audit notes it's currently buried
in the footer, despite being one of the strongest trust assets on the site), and add
the registered entity number and registered legal address. A compliance team doing
supplier onboarding cares more about those than about any logo.

PHOTOGRAPHY: the three named factory photos (exterior, weaving floor, quality
inspection) already exist and are genuinely good proof. Use them at full quality with
next/image, captioned, not as decorative background wash.

Acceptance:
- The Shiveshwar relationship string appears exactly once in the codebase.
- Registered entity number and legal address render on the page.
- The Journey timeline is fully usable with keyboard and under reduced motion.
```

---

## P12 · Businesses + the Product Exports catalog

```
Build /businesses, /businesses/product-exports and /businesses/service-exports.

The audit's verdict on the existing catalog: "the best single piece of execution on
the site — it reads like a site built by people who have actually exported
something." Twenty-five products with HS code, MOQ, lead time and Incoterms, with
filtering and Add-to-RFQ. PRESERVE THIS ENTIRELY. Improve the shell around it; do
not simplify the data.

/businesses
  Hero: "Global Solutions for Modern Business." + the supporting paragraph from the
  client's doc. Then: Business Overview (two divisions, one commitment), the two
  division cards, How We Work (7 steps: understand requirements → consultation →
  source or build → quality assurance → documentation → global delivery → long-term
  support) as a scroll-scrubbed horizontal process, Why Businesses Choose Trivoxa, CTA.

  ⚠ AUDIT FIX: the current page shows seven category tags — including Furniture and
  Jewellery — above a catalog containing five categories, zero furniture products and
  zero jewellery products. Render the tags from CATEGORIES in the taxonomy and show
  each one's status. An 'onboarding' category renders with its honest label. A
  category with no page does not render at all.

/businesses/product-exports — the catalog
  - Filterable, sortable product table/grid: category, HS code, grade, MOQ, lead
    time, Incoterms, port. Geist Mono for every spec value.
  - Add-to-RFQ with a persistent cart that survives navigation (localStorage) and
    hands off to the RFQ page.
  - ⚠ AUDIT FIX: the Fabrics table currently ships with 4 of 5 products showing
    em-dashes in every spec column, on a page whose entire pitch is precision. Enforce
    it in code: a product with status 'live' MUST have every required spec field
    populated, validated by zod at build time. Incomplete products either get their
    data filled in or carry status 'onboarding' and render in a separate, clearly
    labelled "coming online" list — never as a row of dashes in the main table.
  - ⚠ AUDIT FIX: extend the "Request Sample" pattern from Fabrics to EVERY category.
    The audit flagged that requesting a sample and requesting a factory audit are
    standard next steps for a first-time international buyer, and only one page
    offers it. Add both: "Request a sample" and "Request a factory audit/visit".
  - Motion here is restrained. Filter transitions use Motion layout animations;
    rows fade at 40ms stagger. No parallax, no particles. This page is a tool.

/businesses/service-exports
  Six categories from the taxonomy, the book-a-call → discovery → scope → delivery
  flow, and a clear signpost to digital.trivoxagroup.com. Keep the cross-property
  handoff explicit so it doesn't read as a dead end.

Acceptance:
- Build fails if any 'live' product is missing an HS code, MOQ, lead time or Incoterm.
- Sample-request and audit-request CTAs exist on every category page.
- The RFQ cart survives a full page navigation and a reload.
```

---

## P13 · Industry, category and product templates

```
Build the three repeating page templates. The client's Navbar doc says it plainly:
"Every industry page should follow the same structure. Every category page should
follow the same structure. Every product page should follow the same structure."

These are TEMPLATES driven by src/content — adding an industry must be a data edit,
never a new component.

INDUSTRY TEMPLATE — /industries/[slug], 8 pages
  Hero (industry name + one specific sentence) → Industry Overview → Product
  Categories in this industry (from taxonomy) → Typical Buyers → What Buyers Should
  Know (the compliance/regulatory note — ISPM 15 for furniture packaging,
  destination-market labelling for retail goods, and so on; the audit singled these
  out as "the kind of practical, specific content a procurement professional actually
  wants") → Manufacturing Capabilities → Applications → Why Trivoxa for this industry
  → CTA.

CATEGORY TEMPLATE — /businesses/product-exports/[category]
  Hero → Category Overview → Product Portfolio (spec table) → Applications →
  Manufacturing → Quality → Request a Sample → CTA.

PRODUCT TEMPLATE — /businesses/product-exports/[category]/[product]
  Hero → full spec block (HS code, grade, MOQ, lead time, Incoterms, packing, port)
  → Applications → Quality & Testing → Related Products → Add to RFQ / Request Sample.

Also build the /industries index page from the client's Industries doc:
  Hero "Industry Expertise. Global Opportunities." → Industries Overview → the 8
  industry cards → Industry Challenges → Our Industry Solutions → How We Partner With
  Every Industry (4 steps) → Why Industries Choose Trivoxa → Looking Ahead → CTA.

  ⚠ AUDIT FIX: this entire well-built page family is currently orphaned — no link
  from the primary navigation on any page. P3 fixed the nav; verify here that every
  one of the 8 industry pages is reachable in two clicks from any route, appears in
  the sitemap, and is internally linked from the matching product category and back.

EMPTY-STATE DISCIPLINE ⚠ AUDIT FIX
The audit found the Furniture & Interiors page marketed as an active export line
across three places while its own product page said the portfolio "is being finalised
with our manufacturing partners." Build ONE designed empty state, used everywhere:
an honest heading, what's actually available today, an expected timeframe if one
exists, and a "tell us what you're sourcing" form that routes to RFQ. It should feel
deliberate. It should never feel like a page that failed to load.

Motion: shared-element transitions between an industry card and its page using the
View Transitions API (Motion fallback). Hero images use next/image with a blur
placeholder. Templates keep motion light — these are read-to-decide pages.

Acceptance:
- Adding a 9th industry requires editing only src/content/taxonomy.ts.
- All 8 industry pages, all category pages and all product pages are in the sitemap.
- The empty state is used by every 'onboarding' item and looks intentional.
```

---

## P14 · Global Presence page

```
Build /global-presence, from the client's Global Presence doc.

  1. Hero — "Connecting the World Through Trusted Business Partnerships." with the
     interactive globe from P9, at full size.
  2. Global Overview — "A Global Perspective. A Local Understanding."
  3. Our Global Network — the interactive globe as the signature section: HQ,
     manufacturing network, logistics connections, partners, client markets, future
     expansion regions. Drag to rotate, click a region to filter the content below.
  4. Regions We Serve — the six canonical regions from REGIONS, each with industries
     served, products, services, market focus.
  5. How We Connect the World — the ecosystem as an animated diagram: manufacturing
     partners → export divisions → logistics partners → global buyers → long-term
     partnerships. anime.js path drawing on scroll.
  6. International Operations — the eight capabilities.
  7. Presence in Numbers ⚠ AUDIT FIX — regions, industries, export ports, response
     window. Use <CountUp> WITH the server-rendered real value. The audit found these
     counters rendering as literal zeros in a content-level fetch: "If JavaScript is
     slow, blocked, or errors out, a real visitor sees a company boasting '0 regions
     served.'" Verify with JS disabled before you call this done.
  8. Export Ports — Mundra, Kandla, Nhava Sheva/JNPT, each with its reason and an
     embedded map anchored to the Surat HQ.
  9. Growing Across Borders — deliberately modest framing about expanding
     partnerships and emerging markets rather than claimed country counts. The audit
     praised this restraint; keep it.
 10. Why Global Businesses Choose Trivoxa → Looking Ahead → CTA.

⚠ AUDIT FIX: the footer currently names five regions (swapping "Asia-Pacific" for
"Southeast Asia" and dropping South America) while this page names six. Both now
render from REGIONS. Add a test asserting the two lists are identical.

⚠ REGIONAL DEPTH: the UAE persona in the audit said the Middle East section is
"one paragraph among six, generic to the point I can't tell if you've actually
shipped here yet." Each region block needs at least one specific, verifiable
detail — a corridor, a product family, a port pairing, a named partner if one can
be disclosed. Flag to me any region where we don't have a real fact to use.

Acceptance:
- Footer regions === page regions, proven by a test.
- Counters show real values with JS disabled.
- Globe passes the throttled-mobile test from P9.
```

---

## P15 · Insights and Careers

```
Build /insights and /careers, and be honest in both.

/insights
  The current page has zero published articles behind a "vote on what we publish
  first" mechanic. The audit gave real credit for that idea — it turns a pre-content
  state into an active email-capture and prioritisation tool — but was clear that it
  is not thought leadership, and that a company positioning itself as "more than a
  trading company" with an empty Insights page has a credibility gap.

  Build it as a real content system so it can stop being empty:
  - MDX-based articles in src/content/insights with typed frontmatter (title, slug,
    excerpt, category, author, publishedAt, readingTime, heroImage, tags).
  - Index with category filtering and search.
  - Article template: reading progress hairline, sticky table of contents, pull
    quotes, related articles, share.
  - JSON-LD Article schema.
  - Keep the voting/waitlist mechanic, but only render it BELOW published articles
    once any exist.
  - Empty state: if zero articles, the page states plainly what's coming and when,
    and the homepage preview stays suppressed (P10).

  The three planned pieces are already named. Recommend to me which two are fastest
  to publish so this page stops being a liability:
    - A Practical Guide to Sourcing from India with Confidence
    - Reading Global Demand: Where Opportunity Is Moving Next
    - Building Supply Chains That Endure Beyond a Single Order

/careers
  - Culture content, the hiring process, and the factory photography.
  - Roles rendered from a typed collection with a role template (responsibilities,
    requirements, location, division, apply link).
  - ⚠ AUDIT FIX: with zero open roles, do NOT headline the page "Build What's Next
    With Us" over an empty list. Use the rolling model the audit recommends: a clear
    hiring philosophy, an always-open general application, and roles listed only when
    they are real. The empty state is a feature here, not an apology.
  - ⚠ AUDIT FIX: applications route to the careers alias in CONTACT — not to a
    co-founder's personal inbox. Grep the repo to confirm no personal address remains.
  - The client's doc had nine roles specified (Business Development Executive, Export
    Documentation Executive, Software Engineer, AI Solutions Engineer, UI/UX Designer
    and others). Ask the founders which of these are genuinely open; publish only those.

Acceptance:
- Adding an MDX file publishes an article and flips the homepage preview on.
- No personal email address anywhere in the repo.
- Both empty states read as deliberate, and were reviewed as such.
```

---

## P16 · Contact and RFQ — one conversion architecture  ⚠ AUDIT FIX

```
Build /contact and /rfq as ONE deliberate system, not two overlapping ones.

THE FINDING: the site currently has two conversion destinations doing overlapping
jobs. Contact was built as six routing cards that mostly send traffic to RFQ,
Service Exports or Careers, with no FAQ, no phone number and no business hours on
the page. RFQ — which was never in the documentation at all — is the stronger of the
two: four clear entry paths, a three-step review→quote→confirm flow, a stated
24-business-hour window, and an embedded map anchoring Surat against the three ports.
The audit's recommendation, which we are taking: make RFQ the single commercial
conversion point, and rebuild Contact as a lighter, genuinely complete
"how to reach us" page.

/rfq — the commercial funnel
  - Four entry paths: Product RFQ · Service Engagement · Partnership · Careers.
  - Product RFQ pre-populates from the Add-to-RFQ cart built in P12.
  - Three steps with a visible stepper: your requirement → your details → review &
    confirm. React Hook Form + Zod, per-step validation, state preserved on back.
  - Add sample-request and factory-audit-request as first-class request types.
  - Keep the map with Surat HQ and the three ports.
  - Confirmation screen states the 24-business-hour window and what happens next.
  - Server action + Resend (or the client's chosen provider), with spam protection
    that isn't a CAPTCHA wall (honeypot + timing + rate limit).
  - Keep the form SHORT. The audit specifically warned that the original spec's
    six sets of dynamic fields would hurt conversion: "a shorter form that captures
    intent and lets a human ask follow-up questions converts better."

/contact — everything RFQ isn't
  Complete, and complete is the point. It must contain, visibly, above the fold
  where possible:
  - A real phone number. The audit's German-importer persona: "No phone number on
    your Contact page is unusual for a company asking me to place a six-figure order."
    The Company Profile PDF already lists two direct numbers — the website is
    currently a downgrade from the company's own PDF. Fix that.
  - Business hours in IST, with the timezone stated.
  - Registered office address and registered entity number.
  - ONE canonical email set from CONTACT in the taxonomy. The audit found three
    different addresses in circulation (hello@, parth@, dhruv@). One general, one
    sales, one careers, one partnerships — all @trivoxagroup.com, all aliases.
  - A short general-inquiry form only. Anything commercial links to /rfq.
  - The FAQ accordion from the client's doc (it specified nine questions and none
    shipped). Include shipping/Incoterm questions, MOQ questions, sample policy,
    payment terms, lead times, certification status.
  - Social links.
  - A link to /compliance.

Cross-link both pages explicitly so the division of labour is obvious to a visitor:
Contact says "placing an order or requesting a quote? → Request a Quote". RFQ says
"just want to talk to someone? → Contact".

Acceptance:
- A phone number, business hours, entity number and registered address all render
  on /contact.
- Exactly one email domain pattern in the codebase; no personal addresses.
- The RFQ form submits end to end and delivers mail; failures surface to the user.
```

---

## P17 · Compliance, legal, and trust surfaces

```
Build /compliance and the legal pages, and add the trust signals the audit found
missing.

/compliance — this already exists on the live site and the audit called it "a
genuinely mature piece of B2B trust-building" and "the best thing on the site"
(the Swiss-distributor persona reads it first on any new supplier). Rebuild it
faithfully and make it MORE prominent, not less:
  - Two clearly separated groups from CERTIFICATIONS in the taxonomy: Active (IEC,
    GST) with registration numbers and issuing authorities, and In Progress (FIEO,
    APEDA, FSSAI, ISO 9001, Spice Board, CE, WHO-GMP) with target quarters.
  - The commitment to publish numbers and authorities as each is finalised.
  - Registered entity number and legal registered address, aimed at procurement and
    legal reviewers rather than general visitors.
  - Link it from the Group page, the Contact page and the homepage proof band — not
    only the footer.

⚠ A COMMERCIAL FLAG TO RAISE WITH THE FOUNDERS, NOT TO SOLVE IN CODE
The audit notes that the catalog is already taking RFQs for Active Pharmaceutical
Ingredients, generic formulations, nutraceuticals and whole spices — categories
where FSSAI and WHO-GMP are not cosmetic. Selling into those ahead of holding those
credentials is a real commercial and reputational risk regardless of how honestly
it's disclosed. Surface this to the client; do not quietly ship around it.

TRUST SIGNALS THE AUDIT FOUND MISSING — add each, or add the honest substitute:
  - Client/partner reference logos → we have none yet. Build the module the audit
    suggested: a small, dignified "We're onboarding our first reference partners"
    block, which turns silence into a forward-looking statement. Design it so real
    logos drop straight in later.
  - Third-party inspection partners (SGS, Bureau Veritas, Intertek) → the Japanese
    sourcing persona said "I would ask, before a first order, who audits you — and I
    don't see an answer on the site." Add a named inspection partner if one is
    engaged, or an honest line about per-shipment inspection arrangements.
  - Case studies / example shipments → build the template now (product → port →
    destination → lead time → outcome) even if it holds one anonymised example.

Legal pages: Privacy Policy, Terms & Conditions, Cookie Policy, Anti-corruption
Policy, plus a cookie-preferences mechanism that actually gates non-essential
scripts (relevant for the European buyers this site targets).

Acceptance:
- Compliance is reachable from Group, Contact and the homepage, not just the footer.
- Certification data renders from the taxonomy; adding a certification is a data edit.
- Cookie preferences genuinely block analytics until consented.
```

---

# PHASE 4 — Hardening and launch

## P18 · Internationalisation  ⚠ AUDIT FIX

```
Set up i18n — and cut the scope hard.

THE FINDING: the current site shows a 12-language switcher (English, Deutsch,
Français, Español, العربية, Italiano, Português, Nederlands, Türkçe, Русский, Polski,
हिन्दी). The audit could not verify whether any of them render real translations, and
was blunt about the risk: "Shipping a language switcher that doesn't actually
translate is worse than not having one — it reads as broken to the exact
international audience it's meant to reassure." Its recommendation: cut to 2–3
languages that map to actual target markets, translate them properly, and add more
as demand justifies it.

Implement next-intl with locale-prefixed routes, and ship exactly three locales:
  en  English   (default, no prefix)
  de  Deutsch   (the German/Swiss buyers this brand is explicitly targeting)
  ar  العربية    (the Gulf market, and it forces RTL support to be real)

Requirements:
- All copy already lives in src/content. Extract to message catalogues; no strings
  in components.
- Arabic gets genuine RTL: logical CSS properties throughout, mirrored layouts,
  mirrored icon direction, and a display font that supports Arabic well. Test the
  mega-menu, the product tables and the RFQ stepper in RTL specifically — those
  three break most often.
- Locale-aware formatting for numbers, dates and any currency.
- hreflang alternates on every page, and a per-locale sitemap.
- The switcher shows only the three shipped locales. Do not list a language we
  cannot serve. If the client insists on showing more, they must fund translation
  first — say so rather than shipping placeholders.
- Translations go through a human reviewer for de and ar. Machine translation on a
  page arguing for quality control is self-defeating.

Acceptance:
- All three locales render fully translated pages; nothing falls back silently.
- RTL layout verified on mega-menu, product table and RFQ stepper.
- No locale is listed in the switcher without a complete catalogue.
```

---

## P19 · SEO, metadata and structured data

```
Make the site legible to search engines and to procurement teams' due-diligence
searches.

- Per-route metadata via generateMetadata: title templates, descriptions written for
  the actual buyer query ("polyester greige fabric exporter India HS code" beats
  "Trivoxa Group | Textiles"), canonical URLs, OG and Twitter cards using the new
  brand mark.
- JSON-LD: Organization (with the registered entity number, address, contact points,
  sameAs socials, and parentOrganization or memberOf per the resolved Shiveshwar
  relationship), BreadcrumbList sitewide, Product for every catalog item including
  HS code as an additionalProperty, Article for insights, FAQPage for the contact
  FAQ, JobPosting for any real open role.
- Dynamic sitemap.ts covering all locales, all 8 industries, every category and
  product, and insights. robots.ts.
- Internal linking discipline: every industry page links to its categories and back;
  every product links to its category and industry; the Compliance page is linked
  from Group, Contact and the homepage. No orphaned routes — write a script that
  crawls the built sitemap and fails if any route has zero inbound internal links.
  (An orphaned, well-built page family is exactly how the Industries section got
  lost the first time.)
- Redirect map from every existing trivoxagroup.com URL to its new equivalent, with
  301s. Pull the current URL list before you start; do not lose accumulated equity.

Acceptance:
- Rich Results Test passes for Organization, Product, Article and FAQPage.
- The orphan-check script passes.
- Every old URL resolves with a single 301 to a live page — no chains, no 404s.
```

---

## P20 · Performance and accessibility

```
Harden the build against the conditions Trivoxa's actual buyers are on.

PERFORMANCE — the budget from docs/PERF-BUDGET.md, enforced:
- Test profile: Moto G4 class, 4x CPU throttle, Slow 4G. Not a MacBook on wifi.
- LCP < 2.5s, CLS < 0.05, INP < 200ms on that profile, on the homepage AND on the
  product catalog.
- Initial JS < 180KB gzipped excluding WebGL chunks. Run a bundle analysis and cut
  anything that costs more than it earns — check the P5 component intake first, that's
  where the fat usually is.
- Every three.js scene dynamically imported, below the fold or tier-gated. Verify
  that tier 'low' never downloads the WebGL chunk at all.
- next/image everywhere with correct sizes; AVIF/WebP; blur placeholders. Audit the
  factory photography — it's high-value and probably heavy.
- Self-hosted fonts, preloaded, font-display: swap, subset to used glyphs (plus
  Arabic ranges from P18).
- Add Lighthouse CI to the pipeline with the budget as a hard gate.

ACCESSIBILITY — WCAG 2.1 AA, verified not assumed:
- Full keyboard path through: mega-menu, mobile menu, product filters, RFQ stepper,
  FAQ accordion, globe (needs a non-pointer alternative — a region list that does
  what clicking the globe does), language switcher.
- Visible focus states everywhere, in bronze, meeting contrast on all three surfaces.
- Correct heading order on every route; one h1 per page.
- Alt text on every image; the decorative particle canvases marked aria-hidden with
  the meaning carried in adjacent text.
- Form errors announced to screen readers, associated with their inputs, and not
  colour-only.
- Reduced-motion path exercised on every single page — not just the homepage.
- Run axe on every route in CI and fail the build on violations.

Also: a real error boundary around every WebGL scene that falls back to the poster
image rather than blanking a section, and an offline/failed-fetch state for the
catalog.

Acceptance:
- Lighthouse mobile on the throttled profile: Performance ≥ 85, Accessibility 100,
  Best Practices ≥ 95, SEO 100 — on homepage, an industry page, and the catalog.
- Zero axe violations across all routes in CI.
- Killing the WebGL context mid-session degrades gracefully instead of white-screening.
```

---

## P21 · Analytics, forms backend, deployment

```
Wire up the operational layer and ship.

- Analytics: a privacy-respecting setup (Vercel Analytics + Plausible, or the
  client's choice) gated behind the cookie consent from P17. Track the events that
  matter commercially: RFQ started, RFQ step completed, RFQ submitted, add-to-RFQ,
  sample requested, audit requested, product spec viewed, industry page viewed,
  compliance page viewed, contact phone revealed, language switched.
- Form delivery: server actions → Resend (or client's provider) → the correct alias
  per request type, from CONTACT in the taxonomy. Auto-acknowledgement to the sender
  restating the 24-business-hour window. Every submission also written to a durable
  store (a database or at minimum an append-only log) — email alone loses leads.
- Error monitoring: Sentry, with source maps, and alerting on form-submission
  failures specifically. A silently failing RFQ form is the worst possible bug on
  this site.
- Deploy to Vercel: production on the apex, preview deployments per PR, environment
  variables documented in .env.example, and the digital.trivoxagroup.com subdomain
  relationship confirmed and cross-linked.
- CI: typecheck, lint, unit tests, taxonomy consistency check, orphan-route check,
  Lighthouse CI, axe. All blocking.
- A README that a new developer can follow to a running local site in under ten
  minutes, plus docs/CONTENT-EDITING.md written for a non-developer: how to add a
  product, an industry, an article, a job, a certification.

Acceptance:
- A test RFQ submission arrives at the right alias, is stored, and acknowledges.
- A deliberately broken form submission raises a Sentry alert.
- A PR with a taxonomy inconsistency fails CI.
```

---

## P22 · Final consistency audit and launch review

```
Before launch, re-run the July 2026 audit's findings against the new build. Go
finding by finding and report the status of each, with the file and line that
proves it.

MUST-FIX TIER — every one of these has to be closed:
  1. Shiveshwar Textiles "parent company" vs "strategic partner company" — one
     canonical answer, rendered from one constant, applied to the site AND flagged
     for correction in the Company Profile PDF.
  2. Industries and Contact present in the primary navigation on every route.
  3. One canonical industries/categories list, used everywhere. Verify by diffing
     the rendered lists on the homepage, /businesses, /industries and the product
     catalog — they must be derivable from one another with no surprises.
  4. Real phone number and stated business hours on /contact.
  5. Fabrics product data complete, or incomplete rows moved to an 'onboarding'
     state and out of the main table. No em-dashes in a live spec table.

HIGH TIER:
  6. Insights: at least 2–3 articles published, or the homepage preview suppressed.
  7. Careers: real roles, or honest hiring-philosophy framing.
  8. Contact/RFQ overlap resolved into one clear conversion path.
  9. Globe performance verified on mid-tier mobile in target regions.
 10. Language switcher shows only fully translated locales.

MEDIUM TIER:
 11. Onboarding categories clearly labelled, never presented as active with an
     empty catalog.
 12. Jewellery & Precious Products: restored consistently or removed everywhere,
     including the Company Profile PDF.
 13. Region count and naming identical between footer and Global Presence.
 14. One canonical email set; no personal inboxes.
 15. Non-JS fallback on every counter.

NICE-TO-HAVE (report status, don't block launch):
 16. Named third-party inspection partner.
 17. Registered entity number visible.
 18. Sample-request pattern on every category.
 19. Reference-partners honesty module.

THEN, a fresh-eyes pass the original audit could not do, because it was a
content-level crawl with no browser: an actual visual and interaction review.
  - Screenshot every route at 375 / 768 / 1440 / 1920, light and dark surfaces.
  - Record the homepage scroll on a mid-tier device profile and watch for jank,
    layout shift, and half-initialised canvases.
  - Test with prefers-reduced-motion on, with JavaScript off, and with a slow
    connection — three separate passes.
  - Check the site in Arabic end to end.

Report back as a table: finding · status · evidence · anything still open. Do not
mark anything closed that you have not verified in the running build.
```

---

## Appendix A — Prompt-to-audit-finding map

| Audit finding (July 2026) | Closed by |
|---|---|
| Shiveshwar "parent" vs "strategic partner" contradiction | P2, P11, P22 |
| Industries + Contact orphaned from primary nav | P3, P13, P22 |
| Four different "industries we serve" lists | P2, P8, P12, P22 |
| Regions: 6 on page vs 5 in footer, inconsistent naming | P2, P14 |
| Three different contact emails; careers → personal inbox | P2, P15, P16 |
| No phone number, no business hours on Contact | P3, P16 |
| No FAQ on Contact | P16 |
| Fabrics table shipping em-dashes in spec columns | P12 |
| Furniture marketed as active with an empty catalog | P2, P13 |
| Jewellery in the PDF but nowhere on the site | P2, P22 |
| Insights: zero published articles, promoted on homepage | P10, P15 |
| Careers: zero roles under hiring-urgency framing | P10, P15 |
| Contact/RFQ overlap, two half-finished ideas | P3, P16 |
| "Presence in Numbers" counters rendering as zeros | P4, P14 |
| 3D globe performance risk on mid-tier mobile | P4, P9, P14, P20 |
| 12 languages, translation status unverified | P18 |
| No registered entity number anywhere | P3, P11, P16, P17 |
| No third-party inspection body named | P17 |
| No client references or case studies | P17 |
| Sample request only on Fabrics | P12, P13 |
| Compliance page buried in the footer | P11, P17 |
| Abstraction-stacked copy across every page | P7, P8, P11 |
| Manufacturing lineage under-leveraged as the brand spine | P6, P8, P11 |
| Empty-state pattern never specified | P10, P13, P15 |
| No canonical taxonomy — root cause of most of the above | P2 |

## Appendix B — Decisions to get from the founders before you need them

| Needed before | Question |
|---|---|
| P2 | Is Shiveshwar Textiles legally the parent company or an independent strategic partner? |
| P2 | Jewellery & Precious Products — in or out? |
| P3 | Phone number(s), business hours, registered office, registered entity number for public display. |
| P3 | Canonical email aliases: general, sales, careers, partnerships. |
| P12 | Complete spec data (HS code, grade, MOQ, lead time, Incoterms) for every product we intend to list as live. |
| P15 | Which of the nine documented roles are genuinely open right now? |
| P15 | Which two Insights pieces can be written first? |
| P17 | Is any third-party inspection body engaged, even per-shipment? |
| P17 | Commercial decision on taking pharma/food RFQs ahead of WHO-GMP and FSSAI. |
| P18 | Confirm de + ar as the two translated locales, and budget for human translation. |

## Appendix C — Working notes

- **Run P0 and P1 in one sitting.** The typography answer from P0 feeds directly into P1, and a wrong font choice is expensive to unwind after fifteen components exist.
- **P2 is the load-bearing prompt.** If you only do three prompts from this document, do P2, P3 and P16 — they close most of the audit's must-fix tier on their own.
- **Build the low tier first** in P6 and P9. It's tempting to build the beautiful WebGL version and bolt on a fallback; that always produces a fallback nobody looked at, and for this audience the fallback is what a real share of buyers will actually see.
- **Restraint is the premium signal.** The audit's branding read was that the current site is "on-trend B2B — nothing embarrassing, nothing memorable." More effects won't fix that; specificity will. The HS codes, the port names, the honest certification dates and the factory photographs are what make this site distinctive. The animation's job is to frame them, not to compete with them.
