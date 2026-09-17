# Trivoxa Group — React Bits × GSAP × Anime.js Prompt Series

Target: https://trivoxa-group.pages.dev (Next.js 14 App Router · TypeScript · Tailwind · GSAP · Framer Motion · R3F)
Run prompts **in order**, one per session/commit. Each prompt is self-contained and paste-ready for Claude Code / Cursor / Antigravity.

**Compulsory components and where they land**

| Component | Placement |
|---|---|
| **CardNav** | Global header, all routes (Prompt 1) |
| **ScrollExpand** | Home hero intro (Prompt 2) + every `/industries/[slug]` hero (Prompt 10) |
| **DepthCarousel** | Home "Industries We Serve" (Prompt 7) + `/insights` featured (Prompt 11) |

Verified against the React Bits registry (Sept 2026). Install format:
`npx shadcn@latest add https://reactbits.dev/r/<Component>-TS-TW`

---

## PROMPT 0 — Motion Foundation, Installs & Rules

```
You are working on the Trivoxa Group website (Next.js 14 App Router, TypeScript strict, Tailwind, GSAP, Framer Motion, React Three Fiber, deployed on Cloudflare Pages). We are upgrading the entire site to a flagship-level motion experience using React Bits components, GSAP and Anime.js. This prompt builds the foundation only — no section redesigns yet.

STEP 1 — AUDIT FIRST
- Map the repo: app/ routes, section components used by app/page.tsx, header/footer, tailwind.config design tokens (colors, fonts, radii), the existing persistent R3F morphing 3D object + globe-unfurl system, and any existing GSAP/Framer code.
- Output a short table: section → file path → current animation → planned React Bits component (use the plan in STEP 5).
- Do NOT change brand colors, fonts or copy. All new components must consume existing Tailwind tokens / CSS variables.

STEP 2 — DEPENDENCIES
- npm i gsap @gsap/react animejs lenis
- GSAP is fully free now: register ScrollTrigger, SplitText, Flip, ScrambleTextPlugin, DrawSVGPlugin, MorphSVGPlugin, CustomEase, Observer in ONE place.
- Anime.js v4 (named ESM exports only: animate, createTimeline, stagger, svg, utils, createScope, onScroll, text). Never use the v3 default `anime()` API.

STEP 3 — INSTALL REACT BITS (TS + Tailwind variants) into src/components/reactbits/
Run, one per line:
npx shadcn@latest add https://reactbits.dev/r/CardNav-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ScrollExpand-TS-TW
npx shadcn@latest add https://reactbits.dev/r/DepthCarousel-TS-TW
npx shadcn@latest add https://reactbits.dev/r/SplitText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/BlurText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/DecryptedText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/SplitFlapText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ScrollReveal-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ScrollFloat-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ScrollVelocity-TS-TW
npx shadcn@latest add https://reactbits.dev/r/CurvedLoop-TS-TW
npx shadcn@latest add https://reactbits.dev/r/TextPressure-TS-TW
npx shadcn@latest add https://reactbits.dev/r/VariableProximity-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ShinyText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/GradientText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/RotatingText-TS-TW
npx shadcn@latest add https://reactbits.dev/r/CountUp-TS-TW
npx shadcn@latest add https://reactbits.dev/r/MaskedHeading-TS-TW
npx shadcn@latest add https://reactbits.dev/r/TrueFocus-TS-TW
npx shadcn@latest add https://reactbits.dev/r/AnimatedContent-TS-TW
npx shadcn@latest add https://reactbits.dev/r/FadeContent-TS-TW
npx shadcn@latest add https://reactbits.dev/r/GradualBlur-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ClickSpark-TS-TW
npx shadcn@latest add https://reactbits.dev/r/TargetCursor-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Magnet-TS-TW
npx shadcn@latest add https://reactbits.dev/r/StarBorder-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ElectricBorder-TS-TW
npx shadcn@latest add https://reactbits.dev/r/GlareHover-TS-TW
npx shadcn@latest add https://reactbits.dev/r/LogoLoop-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Noise-TS-TW
npx shadcn@latest add https://reactbits.dev/r/PixelTransition-TS-TW
npx shadcn@latest add https://reactbits.dev/r/OrbitImages-TS-TW
npx shadcn@latest add https://reactbits.dev/r/MagicBento-TS-TW
npx shadcn@latest add https://reactbits.dev/r/SpotlightCard-TS-TW
npx shadcn@latest add https://reactbits.dev/r/BorderGlow-TS-TW
npx shadcn@latest add https://reactbits.dev/r/TiltedCard-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ReflectiveCard-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ChromaGrid-TS-TW
npx shadcn@latest add https://reactbits.dev/r/CardSwap-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Counter-TS-TW
npx shadcn@latest add https://reactbits.dev/r/FlowingMenu-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ScrollStack-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Stepper-TS-TW
npx shadcn@latest add https://reactbits.dev/r/OptionWheel-TS-TW
npx shadcn@latest add https://reactbits.dev/r/AnimatedList-TS-TW
npx shadcn@latest add https://reactbits.dev/r/ProfileCard-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Masonry-TS-TW
npx shadcn@latest add https://reactbits.dev/r/AccordionGallery-TS-TW
npx shadcn@latest add https://reactbits.dev/r/BounceCards-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Folder-TS-TW
npx shadcn@latest add https://reactbits.dev/r/LineSidebar-TS-TW
npx shadcn@latest add https://reactbits.dev/r/SpecularButton-TS-TW
npx shadcn@latest add https://reactbits.dev/r/GlassSurface-TS-TW
npx shadcn@latest add https://reactbits.dev/r/StaggeredMenu-TS-TW
npx shadcn@latest add https://reactbits.dev/r/DarkVeil-TS-TW
npx shadcn@latest add https://reactbits.dev/r/LightRays-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Threads-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Topography-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Radar-TS-TW
npx shadcn@latest add https://reactbits.dev/r/LaserFlow-TS-TW
npx shadcn@latest add https://reactbits.dev/r/Grainient-TS-TW
npx shadcn@latest add https://reactbits.dev/r/DotField-TS-TW
If any single URL 404s, report it, skip it and continue — never hand-write a fake replacement under the same name.

STEP 4 — HARDEN EVERY INSTALLED COMPONENT
- Add 'use client' where needed. Every WebGL/OGL/Three component is loaded via next/dynamic with ssr:false and a static token-colored placeholder of identical dimensions (no CLS).
- TypeScript strict: zero `any`, zero @ts-ignore. Type all props with exported interfaces.
- Remove every console.log.
- Replace hardcoded hex colors in props defaults with our CSS variables.

STEP 5 — MOTION SYSTEM (create these files)
src/lib/motion/gsap.ts — plugin registration (client-only guard), CustomEase presets: "trivoxa.out" (0.16,1,0.3,1), "trivoxa.inOut" (0.83,0,0.17,1), "trivoxa.snap" (0.7,0,0.3,1). Export duration tokens: fast 0.35, base 0.7, slow 1.2, cinematic 1.8.
src/lib/motion/anime.ts — Anime.js v4 helpers: drawLine(selector), staggerGrid(selector), magneticPress(el), numberRoll(el, to).
src/lib/motion/lenis-provider.tsx — Lenis smooth scroll synced to gsap.ticker and ScrollTrigger.update; disabled when reduced motion.
src/lib/motion/useReducedMotion.ts — returns boolean from matchMedia, SSR-safe.
src/lib/motion/webgl-budget.tsx — context + hook `useWebGLSlot(id)` that allows MAX 2 live WebGL canvases at once (the existing R3F object counts as 1). Components outside the viewport (IntersectionObserver, rootMargin 200px) release their slot and render the static placeholder.
src/lib/motion/device.ts — `isLowPower` (hardwareConcurrency <= 4 || deviceMemory <= 4 || saveData) → WebGL backgrounds swap to CSS gradients + Noise overlay.

DIVISION OF LABOUR (enforce everywhere):
- GSAP: all scroll orchestration (ScrollTrigger pin/scrub), page transitions, SplitText headlines, Flip layout changes, DrawSVG.
- Anime.js: micro-interactions (hover, press, focus), SVG line/route drawing inside cards, stagger grids on data (stats, lists), form feedback.
- Framer Motion: only where a React Bits component already depends on it. Do not add new Framer code.
- React Bits: the visual building blocks.
- Every animation wrapped in useGSAP()/createScope() with cleanup; nothing runs on the server.

STEP 6 — WRITE MOTION_SYSTEM.md at repo root documenting everything above plus the component→section map. Every later prompt will read it first.

STEP 7 — VERIFY: `npm run build` passes with zero TS errors and zero ESLint warnings; the site looks visually identical to before (foundation only).
```

---

## PROMPT 1 — Global Chrome: CardNav, Cursor, Preloader, Page Transitions

```
Read MOTION_SYSTEM.md first. Build the global chrome in app/layout.tsx.

1. CARDNAV (COMPULSORY) — replace the current header on every route.
- Logo left (existing Trivoxa wordmark). CTA button right: "Request a Quote" → /rfq, wrapped in StarBorder + Magnet (strength 0.25).
- Three expanding cards:
  • Card 1 "What We Export": Global Product Exports → /businesses/product-exports · Global Service Exports → /businesses/service-exports · All 9 Industries → /industries
  • Card 2 "Who We Are": The Group → /group · Leadership → /group#leadership · Shiveshwar Foundation → /group#foundation · Insights → /insights
  • Card 3 "Global Network": Global Presence → /global-presence · Compliance → /compliance · Careers → /careers · Contact → /contact
- Card backgrounds use our surface tokens in 3 steps of depth; text uses foreground tokens. Card expand uses GSAP ease "trivoxa.out", duration 0.6, cards stagger 0.08.
- Each link: Anime.js hover — arrow icon translates 4px + rotates -45deg, underline scaleX 0→1 from left.
- On scroll down > 120px: nav shrinks (height -12px, backdrop-blur via GlassSurface), hides on fast downward scroll (ScrollTrigger direction), reappears on scroll up.
- Active route highlighted. Closes on route change, Escape and outside click. Full keyboard support, aria-expanded, focus trap while open.
- Mobile < 768px: CardNav stacked mode; lock body scroll while open.

2. PRELOADER (first visit per session only, sessionStorage wrapped in try/catch)
- Full-screen token background + Noise overlay.
- SplitFlapText cycling "SURAT" → "MUNDRA" → "JNPT" → "TRIVOXA".
- CountUp 0→100 bottom-right in mono font.
- Exit: GSAP clip-path inset(0 0 0 0) → inset(0 0 100% 0), 1.0s, "trivoxa.inOut"; then triggers the hero entrance via a custom event "trivoxa:ready".
- Max 2.2s total; skipped entirely with reduced motion.

3. CURSOR
- TargetCursor on desktop pointer:fine only, targeting [data-cursor="target"] (CTAs, cards, carousel items). Hidden on touch.
- ClickSpark wrapping <main>, spark color = accent token, sparkCount 8.

4. PAGE TRANSITIONS
- template.tsx with a GSAP transition: outgoing page fades + y:-24, a token-colored panel wipes up, incoming page SplitText title reveals. 0.9s total. Kill all ScrollTriggers on leave and refresh on enter.

5. GLOBAL POLISH
- GradualBlur fixed at viewport bottom (height 6rem, strength 2) on long pages; hidden on footer via ScrollTrigger.
- Scroll progress hairline at top of CardNav (GSAP scrub scaleX).
- Lenis provider wraps the app.

Verify: all links route correctly, no hydration warnings, Lighthouse accessibility ≥ 95, CLS < 0.05.
```

---

## PROMPT 2 — Home Hero: ScrollExpand Intro

```
Read MOTION_SYSTEM.md first. Rebuild the home hero.

1. SCROLLEXPAND (COMPULSORY) — the first thing a visitor sees.
- Media: a looping muted container-port / textile-loom video (use existing asset in /public if available; otherwise a high-quality poster image and leave a typed `heroVideoSrc` constant for the client to swap — no broken placeholders).
- Collapsed state: rounded media card centered, ~40vw wide. Split title on both sides of it: "Building the Future" (left) / "of Global Commerce." (right).
- On scroll, media expands to full-bleed; the two title halves slide apart and fade; after full expansion, the content layer reveals.
- Background behind collapsed state: DarkVeil (WebGL slot) with our tokens; low-power fallback = Grainient-style CSS gradient + Noise.

2. REVEALED CONTENT (over the expanded media, with a token scrim)
- Eyebrow: DecryptedText "SURAT · GLOBAL HQ".
- H1: SplitText by chars, GSAP stagger 0.02, y:100% → 0, triggered by "trivoxa:ready".
- Body copy (existing paragraph about Shiveshwar Textiles): BlurText by words.
- CTAs: "Request a Quote" (SpecularButton + Magnet) and "Explore What We Export" (ghost button with GlareHover). Both data-cursor="target".
- Stat strip (3 items): "Surat, Gujarat · Global HQ", "Mundra & JNPT · Port Lanes", "24h SLA · Guaranteed RFQ Response". The "24h" uses CountUp 0→24; items enter with Anime.js stagger(120) from y:20; vertical divider lines draw via Anime.js svg.createDrawable.
- RotatingText inside a small pill under H1 cycling: "Textiles", "Pharmaceuticals", "Building Materials", "Agri & Food", "Engineering".

3. INTEGRATE WITH EXISTING 3D OBJECT
- The persistent R3F morphing object must not render during the ScrollExpand phase (release its WebGL slot); it fades in as the hero exits. Coordinate via the webgl-budget context, not by unmounting the Canvas.

4. EXIT
- As hero leaves, GSAP scrub: content scale 1 → 0.94, opacity → 0.3, media blur 0 → 8px.

Reduced motion: no ScrollExpand scrub — show the expanded state statically with all text visible.
Mobile: ScrollExpand collapsed width 80vw, titles stacked above/below media.
```

---

## PROMPT 3 — Export Ports & Published Catalog

```
Read MOTION_SYSTEM.md first. Rebuild "Export Ports" and "Published Catalog" sections on the home page. Keep all copy exactly.

EXPORT PORTS
- Section heading: MaskedHeading reveal on ScrollTrigger (start "top 75%").
- Background: Radar component (accent token, low opacity) behind the section — WebGL slot aware.
- 3 port cards as a GSAP pinned horizontal sequence on desktop (pin section, scrub cards in from x:100%), stacked on mobile:
  • Mundra (INMUN) • Kandla (INIXY) • Nhava Sheva/JNPT (INNSA)
- Each card = SpotlightCard with ElectricBorder on hover (chaos 0.4, thickness 1).
- Port code (INMUN etc.) rendered with SplitFlapText flipping in when card enters.
- Inside each card an SVG mini-route "Surat → port" drawn with Anime.js createDrawable, duration 1400, easing "inOutQuad", on enter.

PUBLISHED CATALOG
- 3 stat tiles in a row:
  • "25 products across 5 live categories" → Counter component rolling to 25; "5" uses CountUp.
  • "24 business hours response window (Mon–Sat, 10:00–19:00 IST)" → Counter to 24 wrapped in ElectricBorder (this is the SLA promise — make it the hero tile).
  • "IEC, GST active; multiple certifications in progress" → badges animate in with Anime.js stagger, a pulsing status dot for "in progress".
- Tiles = BorderGlow cards; entrance via AnimatedContent (distance 60, direction vertical).
- LogoLoop below: scrolling strip of compliance/trade marks as text chips: IEC · GST · COO · Phytosanitary · MTC · FOB · CIF · DAP (no fake certification logos).
```

---

## PROMPT 4 — "Why Businesses Choose Trivoxa" with MagicBento

```
Read MOTION_SYSTEM.md first. Rebuild the "Built on Experience. Focused on Partnership." section.

- Heading: ScrollFloat (animationDuration 1, stagger 0.03).
- Replace the 4 feature cards with MagicBento (enableStars, enableSpotlight, enableBorderGlow, enableTilt false on mobile, clickEffect true, glowColor = accent token RGB).
- Bento layout (desktop 4-col grid):
  • Manufacturing Foundation — large tile (2×2). Inside: OrbitImages of fabric/loom thumbnails from /public orbiting a "Shiveshwar Textiles" label.
  • Quality-Driven Operations — tall tile. Inside: AnimatedList of the checks: "GSM check", "Composition check", "Carton drop test", "Pre-shipment photos", "Report before sailing" — items tick in with Anime.js checkmark stroke draw.
  • Global Trade Expertise — wide tile. Inside: CurvedLoop marquee "COO · Phytosanitary · Material Test Certificates · Incoterms per line ·".
  • Long-Term Partnerships — standard tile. Inside: an Anime.js step visual "Order 1 → 2 → 3 → 5" where dots connect with a drawn line; the "5th" dot glows.
- Keep every card's existing copy verbatim.
- Section enters with GSAP batch (ScrollTrigger.batch) stagger 0.12.
```

---

## PROMPT 5 — "Who We Are / A Vision Beyond Business"

```
Read MOTION_SYSTEM.md first. Rebuild the Who We Are section.

- Background: Threads component (amplitude 1, distance 0, mouse interaction on desktop), tokens only.
- Heading "A Vision Beyond Business.": TextPressure on desktop (fontFamily = our display font, minFontSize 48, width + weight true, italic false); on mobile fallback to SplitText.
- Body paragraph: ScrollReveal (baseOpacity 0.1, enableBlur true, baseRotation 3, blurStrength 4) — words light up as you scroll.
- The phrase "not as a broker, but as an operator with a factory floor behind it" gets VariableProximity (radius 120, falloff "exponential").
- Inline stats "2 export divisions · 9 industries · 6 regions": each number CountUp, wrapped in TrueFocus-style blur focus cycling through the three.
- CTA "Discover the Group" → /group: SpecularButton + Magnet, data-cursor="target".
- Section divider below: ScrollVelocity with texts ["Surat · Mundra · Kandla · JNPT ·", "Textiles · Pharma · Stone · Agri · Engineering ·"], velocity 60, alternating directions.
```

---

## PROMPT 6 — "Our Businesses" Two Divisions

```
Read MOTION_SYSTEM.md first. Rebuild "Two operating arms. One commitment."

- Heading: SplitText words; subheading BlurText.
- Two division panels side-by-side (stacked on mobile), each a ReflectiveCard (desktop) / TiltedCard (fallback), rotateAmplitude 8, scaleOnHover 1.03:
  • Global Product Exports — list of 5 industries rendered as FlowingMenu (each row: industry name, marquee image strip on hover), links to /businesses/product-exports?category=<slug>. CTA "Explore Global Product Exports".
  • Global Service Exports — tag "digital.trivoxagroup.com" with DecryptedText on hover; list of 5 services as FlowingMenu linking out to digital.trivoxagroup.com (target _blank, rel noopener). CTA "Explore Global Service Exports".
- On desktop, GSAP Flip: hovering one panel expands it to 60% width and compresses the other to 40% (0.6s, "trivoxa.out"); resets on leave.
- A center connector SVG line between panels labelled "One commitment" drawn with GSAP DrawSVG on scroll scrub.
```

---

## PROMPT 7 — Industries We Serve: DepthCarousel

```
Read MOTION_SYSTEM.md first. Rebuild "Supporting the Industries That Shape Tomorrow."

1. DEPTHCAROUSEL (COMPULSORY)
- Items: all 9 industries (pull from the existing industries data source — do not duplicate data). First 6 match current copy: Textile & Apparel, Healthcare & Pharmaceuticals, Building Materials, Furniture & Interiors, Agriculture & Food, Engineering & Industrial, plus the remaining 3 from data.
- Each slide: industry image, title, one-line description, "Explore" link → /industries/<slug>, data-cursor="target".
- Furniture & Interiors shows a "Quoted, not yet catalogued" badge (ShinyText).
- Behavior: drag/swipe, arrow keys, autoplay 4.5s paused on hover/focus/offscreen, loop on. Active slide sharp + elevated; side slides receding in depth with blur and reduced opacity.
- On active-slide change: title swaps with DecryptedText; description with BlurText; a slide counter "01 / 09" uses SplitFlapText.
- Background tint cross-fades (GSAP 0.8s) to a per-industry accent derived from our token palette (define 9 variants in tailwind config, not random hex).

2. SECTION DRESSING
- Heading: MaskedHeading. 
- Progress bar under carousel: Anime.js animates width with autoplay timer, resets on change.
- CTA "View all 9 industries" → /industries: StarBorder button.
- GradualBlur on left and right edges of the carousel viewport.

Accessibility: role="region" aria-roledescription="carousel", each slide aria-label "n of 9", live region announcing the active industry, autoplay stop button.
Reduced motion: autoplay off, no depth blur, instant transitions.
```

---

## PROMPT 8 — Global Presence

```
Read MOTION_SYSTEM.md first. Rebuild "A Global Perspective. A Local Understanding." Keep the existing globe topology (Surat HQ, Mundra, Nhava Sheva → Rotterdam, Jebel Ali, Mombasa, New York, Santos, Singapore).

- The existing R3F morphing object performs its globe-unfurl here (it holds the WebGL slot; no other WebGL in this section).
- Background: Topography rendered as static SVG/CSS (not WebGL) so the globe keeps the budget.
- Heading: SplitText lines; subheading "The corridors we actually operate in — not live shipment tracking." in ShinyText (speed 4).
- 6 region cards as ChromaGrid (radius 300, damping 0.45) — Europe, Middle East, Africa, North America, South America, Asia-Pacific, each with its existing one-liner and the hub port (Rotterdam, Jebel Ali, Mombasa, New York, Santos, Singapore).
- Hovering a region card: dispatch an event that highlights the matching arc on the globe and draws that lane in an SVG route map with Anime.js createDrawable (duration 1200).
- Stats row "Regions 6 · Industries 9 · Ports 3": Counter components triggered on enter.
- Port chips INMUN · INIXY · INNSA: SplitFlapText.
- CTA "View Our Global Network" → /global-presence.
- Pin the section on desktop for 150vh: GSAP scrub rotates globe through the 6 regions while the corresponding card is activated.
```

---

## PROMPT 9 — Careers, Final CTA & Footer

```
Read MOTION_SYSTEM.md first.

CAREERS STRIP
- Copy "No open roles today. We still read every application that arrives at careers@trivoxagroup.com." — email in GradientText, click copies to clipboard with Anime.js "Copied" pill feedback.
- CTA "Careers at Trivoxa" → /careers with GlareHover.

START A CONVERSATION (final CTA)
- Background: LaserFlow (accent token, vertical beam hitting the heading) — WebGL slot; low-power fallback gradient.
- Heading "Send the specification. We'll come back with numbers.": SplitText chars; "numbers." uses a Counter-style digit roll on the letters via GSAP ScrambleText.
- Copy keywords "Grade, quantity, destination port, target Incoterm" each highlighted sequentially with TrueFocus.
- CTAs "Request a Quotation" (SpecularButton + Magnet) and "Contact the Group" (StarBorder).

FOOTER
- Top: huge "TRIVOXA" wordmark with TextPressure (desktop) that reacts to cursor; mobile static GradientText.
- Contact block (email, callback, hours, registered office, entity note): FadeContent stagger.
- Link columns (What We Export, Categories, Company, Resources, Legal): each link Anime.js underline + arrow; columns enter with ScrollTrigger.batch.
- Newsletter "Quarterly dispatch on global trade and business insights.": input with animated focus border (Anime.js), submit shows ClickSpark + success checkmark draw; keep existing submit logic untouched.
- Regional links row: CurvedLoop marquee.
- Background: DotField (subtle) + Noise overlay.
- Copyright line with ShinyText on "Shiveshwar Textiles".
- A footer reveal effect: main content lifts (GSAP) revealing a sticky footer underneath.
```

---

## PROMPT 10 — Industries & Businesses Routes

```
Read MOTION_SYSTEM.md first. Apply the system to: /industries, /industries/[slug] (all 9), /businesses, /businesses/product-exports, /businesses/service-exports.

/industries
- Hero: SplitText title + Grainient background.
- All 9 industries as ChromaGrid; filter pills (All / Catalogued / Quoted) with GSAP Flip re-layout.

/industries/[slug]  (shared template)
- SCROLLEXPAND hero (COMPULSORY on this template): industry media expands; title = MaskedHeading, description BlurText.
- Product categories as Masonry (animateFrom "bottom", blurToFocus true, hover scale).
- Specs we quote against (e.g. GSM, count, composition for textiles — read from existing data) as AnimatedList.
- Ports used + Incoterms as SplitFlapText chips.
- "Request a quote for <industry>" sticky CTA with ElectricBorder → /rfq?industry=<slug>.
- Related industries: CardSwap (delay 5000, pauseOnHover).

/businesses
- Two divisions as AccordionGallery (hover expands panel), each panel links to its route.

/businesses/product-exports
- Category tabs from ?category= param; switching categories uses GSAP Flip on the product grid.
- Product cards: PixelCard-like reveal using PixelTransition (image → spec sheet).
- Keep existing data/query logic exactly.

/businesses/service-exports
- 5 services as ScrollStack (itemDistance 100, itemScale 0.03, blurAmount 1); final card CTA out to digital.trivoxagroup.com.
```

---

## PROMPT 11 — Group, Global Presence, Insights, Careers, Compliance

```
Read MOTION_SYSTEM.md first. Apply to /group, /global-presence, /insights, /careers, /compliance.

/group
- Hero: TextPressure "The Group" + LightRays background.
- Story timeline (Shiveshwar Textiles heritage → Trivoxa → 2 divisions): ScrollStack cards, with a GSAP DrawSVG vertical spine line scrubbed alongside.
- #leadership: ProfileCard per leader (enableTilt, token gradients; use existing names/photos only — if none exist, render a "Leadership profiles coming soon" state, do not invent people).
- #foundation: Shiveshwar Foundation block with ScrollReveal copy and BounceCards of initiative images from /public.

/global-presence
- Full-page version of the home globe section: pinned 300vh scrub through all 6 regions; each region panel = SpotlightCard with its hub port, a lane SVG drawn by Anime.js, and Counter stats that exist in data.

/insights
- DEPTHCAROUSEL (COMPULSORY here too) for featured articles.
- Article list below: AnimatedList; category filters with GSAP Flip.
- #subscribe: same animated newsletter form as footer.

/careers
- Hero: FallingText of role keywords (gravity on hover), empty-state copy kept verbatim.
- "How we hire" as Stepper (read-only walkthrough).
- Email CTA with copy-to-clipboard feedback.

/compliance
- Document groups as Folder components (click opens to reveal doc links).
- Certification status list with AnimatedList and pulsing "in progress" dots.
- Sticky table of contents with LineSidebar.
```

---

## PROMPT 12 — RFQ, Contact & Legal

```
Read MOTION_SYSTEM.md first. Apply to /rfq, /contact, /legal/*. Never change validation, submission handlers, Supabase/Resend logic or field names — only the presentation layer.

/rfq
- Convert the form into a Stepper: 1 Product & Industry → 2 Grade / Specification → 3 Quantity & Destination Port → 4 Incoterm & Timeline → 5 Contact → Review.
- Industry picker: ChromaGrid of 9 tiles (selectable, aria-pressed).
- Incoterm selection: OptionWheel (EXW, FOB, CFR, CIF, DAP, DDP) with a native <select> fallback for screen readers.
- Destination port input with an Anime.js animated suggestion list.
- Step transitions: GSAP x-slide + fade, 0.5s; validation errors shake with Anime.js (translateX keyframes) and focus the first invalid field.
- Submit: SpecularButton → loading shimmer → success screen with ClickSpark burst, SVG check drawn by DrawSVG, and "Answered within 24 business hours (IST)" where 24 is CountUp.
- Prefill industry from ?industry= param.

/contact
- Split layout: left GlassSurface panel with contact details (DecryptedText on email hover), right the existing form with animated focus borders.
- #callback: ElectricBorder highlighted block.
- Desk hours line with a live "Desk open / closed" pill computed in Asia/Kolkata time.

/legal/privacy, /legal/terms, /legal/cookies, /legal/anti-corruption
- Calm treatment: SplitText title only, LineSidebar table of contents with scroll-spy, section headings FadeContent. No WebGL, no cursor effects on these pages (disable TargetCursor via route check).
```

---

## PROMPT 13 — Performance, Accessibility & Release QA

```
Read MOTION_SYSTEM.md first. Final hardening pass across every route. Fix issues, don't just report them.

PERFORMANCE
- Confirm at most 2 live WebGL contexts at any scroll position on every route (log counts in a dev-only overlay behind NEXT_PUBLIC_MOTION_DEBUG, never console.log). Fix any violation.
- All React Bits WebGL components dynamic-imported with ssr:false; route JS budget: home ≤ 350KB gzipped first load; code-split per section with next/dynamic + IntersectionObserver mounting.
- ScrollTrigger.refresh() after fonts load and after images in pinned sections load; no pin jumps.
- Pause autoplay carousels, marquees, CurvedLoop, LogoLoop and WebGL render loops when the tab is hidden or the element is offscreen.
- Targets (mobile, Lighthouse): Performance ≥ 85, LCP < 2.5s, CLS < 0.05, INP < 200ms.

ACCESSIBILITY
- prefers-reduced-motion: every scrub, pin, marquee, cursor, WebGL and text scramble disabled with static equivalents; content fully readable.
- All animated text keeps the real string in the DOM for screen readers (aria-label on split containers, aria-hidden on split chars).
- Keyboard: CardNav, DepthCarousel, Stepper, OptionWheel, Folder, FlowingMenu fully operable; visible focus rings using tokens.
- Contrast AA on all text over animated backgrounds (add scrims where needed).

CROSS-DEVICE
- Test 360px, 768px, 1024px, 1440px, 1920px. Touch: no hover-only content; TargetCursor/Magnet/Tilt disabled.
- Safari: check backdrop-filter, clip-path and WebGL fallbacks.

BUILD
- `npm run build` with zero TS errors, zero ESLint warnings, no `any`, no console.log, no hydration warnings.
- Verify Cloudflare Pages build output works (static routes + any edge functions) and deploy a preview.
- Update MOTION_SYSTEM.md with the final component→section map and a list of any component that 404'd or was swapped.
```
