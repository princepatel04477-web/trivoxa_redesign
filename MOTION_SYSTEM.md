# Trivoxa Motion & Animation System

## 1. Overview & Architecture
The Trivoxa Group web platform integrates an enterprise-grade motion layer designed for international trade procurement, institutional buyers, and supply chain partners. The system pairs fluid narrative choreography with rigorous hardware bounds, strict accessibility standards, and zero layout shift.

The motion stack is built on four core pillars:
1. **GSAP 3** (`@gsap/react`, `ScrollTrigger`, `Flip`, `SplitText`, `Observer`, `DrawSVGPlugin`): Drives macro scroll sequencing, pinned stage transitions, layout flips, and scroll-linked timeline scrubbers.
2. **Anime.js v4** (`animate`, `createTimeline`, `svg`, `createDrawable`): Handles precision micro-interactions, form step transitions, validation error shakes, and SVG coordinate path animations.
3. **Lenis Smooth Scroll** (`@studio-freight/lenis` / `lenis`): Coordinates normalized wheel/touch scrolling synchronized directly to the GSAP global ticker.
4. **React Bits Component Suite (62-component integration)**: Production-hardened UI motion, canvas shaders, interactive typography, and card physics.

---

## 2. WebGL & Canvas Resource Budget
To maintain 60fps on mobile devices and prevent memory crashes, all WebGL and heavy 2D canvas components operate under a global hardware budget:
- **Global Concurrent Context Limit**: **Maximum 2 active WebGL canvases** allowed simultaneously across the entire viewport.
- **`WebGLBudgetProvider` & `useWebGLSlot(slotId)`**: Central React context manager tracking active canvas allocations. Canvases register on mount and request activation only when within viewport intersection threshold (`rootMargin: '200px'`).
- **Offscreen & Tab Hibernation**: All render loops automatically pause when `document.hidden` is true or when the component scrolls out of view via `IntersectionObserver`.
- **Low-Tier Auto Fallback**: Devices flagged under `PerfTierProvider` (mobile devices, low core count, battery saver mode) automatically substitute WebGL canvases with SVG/CSS visual fallbacks or static high-resolution posters.
- **Legal Route Isolation**: All WebGL effects, heavy canvas animations, and cursor followers are explicitly disabled on all `/legal/*` routes (`/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/legal/anti-corruption`).

---

## 3. Brand Timing & Easing Hierarchy
Every animation maps to Trivoxa brand tokens (`#241C18` Espresso, `#F4EFE6` Paper, `#A88B68` Bronze, `#C4A47C` Light Bronze):

| Token | Duration | Purpose | Typical Application |
|---|---|---|---|
| `duration-micro` | `0.15s` | Immediate feedback | Button press, link underline, tile hover |
| `duration-fast` | `0.30s` | Quick state shifts | Navigation menus, dropdowns, tooltip popups |
| `duration-base` | `0.50s` | Standard UI reveals | Card fades, form stepper slides, tab switches |
| `duration-medium`| `0.80s` | Section transitions | Accordion expands, bento re-flows, list reveals |
| `duration-slow` | `1.20s` | Narrative choreography| Hero reveals, page transitions, headline masks |
| `duration-epic` | `2.00s` | Ambient motion | Globe rotation, laser flow wisps, background threads |

### Custom Easing Functions:
- **`trivoxa.out`** (`cubic-bezier(0.16, 1, 0.3, 1)`): Primary decelerating ease for incoming content and user interactions.
- **`trivoxa.inOut`** (`cubic-bezier(0.65, 0, 0.35, 1)`): Symmetrical ease for state transitions and viewport scrubs.
- **`trivoxa.snap`** (`cubic-bezier(0.25, 1, 0.5, 1)`): Snappy response curve for interactive controls and modal overlays.

---

## 4. Complete React Bits Component-to-Section Map

| # | React Bits Component | Page / Route | Section / Placement | Primary Role & Fallback |
|---|---|---|---|---|
| 1 | `TargetCursor` | Global Layout (`src/app/layout.tsx`) | Global Viewport | Custom precision target reticle with hover magnetic snap. Disabled on mobile/touch & `/legal/*`. |
| 2 | `ClickSpark` | Global Layout & `/rfq` | Global Viewport & RFQ Submit | Subtle tactile click burst (6 gold sparks) on interactive elements. |
| 3 | `GradualBlur` | Global Layout (`src/app/layout.tsx`) | Top / Bottom fixed headers | Progressive CSS backdrop blur for fixed header and bottom bleed. |
| 4 | `CardNav` | Global Layout (`global-cardnav.tsx`) | Global Primary Header | 3-card mega-navigation with magnetic tabs, mobile drawer, and keyboard navigation. |
| 5 | `MagneticButton` | Global Chrome & Hero | Header CTA & Primary CTAs | Physics-based spring pull toward mouse cursor on desktop. |
| 6 | `StarBorder` | Global Chrome | Header "Request a Quote" CTA | Subtle rotating amber border glow on primary procurement action. |
| 7 | `DarkVeil` | Home (`/`) | Hero Section Background | Ambient dark atmospheric gradient canvas under WebGL slot `hero-darkveil`. |
| 8 | `ScrollExpand` | Home (`/`) | Hero Photograph Stage | Pinned scroll expansion of Mundra Port container terminal from card to full width. |
| 9 | `KineticTextReveal` | Home (`/`) | Hero Headline | Staggered 3D Y-axis character flip into view. Screen-reader accessible DOM text preserved. |
| 10 | `DecryptedText` | Home (`/`) & `/contact` | Hero Subtitle & Contact Email | Scramble text decryption on viewport entry and hover. |
| 11 | `BlurText` | Home (`/`) | Hero Lede Paragraph | Progressive blur-to-focus word reveal. |
| 12 | `Radar` | Home (`/`) | Section A (Proof Band) Background | Sweeping maritime radar canvas under WebGL slot `proofband-radar`. |
| 13 | `SpotlightCard` | Home (`/`) & `/global-presence` | Proof Band & Region Hub Cards | Radial light follower highlighting card borders and background gradients. |
| 14 | `ElectricBorder` | Home (`/`) & `/contact` | Proof Band Cards & `#callback` | Pulsing high-energy electric border path around key credibility tiles. |
| 15 | `SplitFlapText` | Home (`/`) & `/global-presence` | Port LOCODE Chips | Mechanical departure-board flip animation for UN/LOCODEs (`INMUN`, `INNSA`, `INIXY`). |
| 16 | `Counter` | Home (`/`) & `/global-presence` | Proof Band & Regional Statistics | Animated numerical ticker for products (25), categories (7), and trade metrics. |
| 17 | `BorderGlow` | Home (`/`) | 24h SLA Hero Tile | Soft cycling amber glow around the 24-business-hour response commitment tile. |
| 18 | `LogoLoop` | Home (`/`) | Proof Band Marquee | Smooth infinite marquee for ISO, IEC, GST, FIEO, and chamber marks. Pauses on hover and off-screen. |
| 19 | `MagicBento` | Home (`/`) | Why Trivoxa Section | Interactive 5-card grid with synchronized hover lighting and ripple physics. |
| 20 | `OrbitImages` | Home (`/`) | Sourcing Hub Bento Card | Orbital revolving badges representing Mundra, Kandla, and Nhava Sheva sea corridors. |
| 21 | `AnimatedList` | Home (`/`), `/insights`, `/compliance` | Process steps, briefs, certification lists | Staggered item entry with smooth height transitions and keyboard accessibility. |
| 22 | `Threads` | Home (`/`) | Who We Are Background | Flowing generative textile thread wave canvas under WebGL slot `threads-who-we-are`. |
| 23 | `TextPressure` | Home (`/`), `/group`, Footer | Section Headings & Footer Wordmark | Variable font weight/width distortion based on pointer proximity and velocity. |
| 24 | `VariableProximity` | Home (`/`) | Narrative Excerpts | Dynamic character weight scaling as cursor sweeps over trade philosophy text. |
| 25 | `ScrollReveal` | Home (`/`) & `/group` | Narrative Body Text | Word-by-word opacity reveal synchronized to user scroll progress. |
| 26 | `ReflectiveCard` | Home (`/`) | Product Exports Division Card | Metallic specular card sheen with 3D gyroscopic tilt and lighting. |
| 27 | `FlowingMenu` | Home (`/`) | Service Exports Division Card | Infinite vertical kinetic typographic marquee linking service capabilities. |
| 28 | `DepthCarousel` | Home (`/`) & `/insights` | Industries Section & Featured Briefs | 3D depth-staggered interactive carousel with keyboard arrows, wheel scrub, and touch swipe. |
| 29 | `TiltedCard` | Home (`/`) | Industry Cards | Perspective 3D card tilt with glare sheen and caption parallax. |
| 30 | `ChromaGrid` | Home (`/`) & `/rfq` | Global Presence Preview & RFQ Sector Picker | 9-tile interactive grid with dynamic chromatic glow, keyboard selection, and ARIA radio states. |
| 31 | `LaserFlow` | Home (`/`) | Closing CTA Section | Luminous laser mist shader under WebGL slot `laser-flow-cta`. |
| 32 | `ShinyText` | Home (`/`), Buttons | Accent badges and CTA buttons | Shimmering light sweep across text characters. |
| 33 | `DotField` | Home (`/`) & Footer | Footer Ambient Grid | Responsive 2D dot matrix with interactive cursor wave dispersion. |
| 34 | `Noise` | Global & Footer | Dark sections & dialog backdrops | Micro-grain SVG noise texture overlay for analog tactile depth. |
| 35 | `Grainient` | `/industries` | Industries Hub Hero Background | Flowing noise-grain gradient shader under WebGL slot `industries-grainient`. |
| 36 | `StaggeredMenu` | `/industries` | Division Filter Bar | Staggered elastic button menu for instant category filtering. |
| 37 | `Masonry` | `/industries/[slug]` | Product Grid Layout | Auto-balancing multi-column card layout with entrance stagger. |
| 38 | `AccordionGallery` | `/businesses` | Division Showcase | Multi-panel horizontal accordion with synchronized image zoom. |
| 39 | `PixelTransition` | `/businesses/product-exports` | Catalogue Feature Visuals | Retro-modern pixelated reveal transition on product imagery. |
| 40 | `LightRays` | `/group` | Group Hero Background | Volumetric god-rays lighting canvas under WebGL slot `group-lightrays`. |
| 41 | `ScrollStack` | `/group` | Shiveshwar Journey Timeline | Vertical stacking cards with pinned progress and scrubbed spine line. |
| 42 | `ProfileCard` | `/group` | Leadership Profiles | Interactive holographic identity cards with 3D tilt and founder credentials. |
| 43 | `BounceCards` | `/group` | Shiveshwar Foundation Section | Elastic physics card cluster showcasing community and education initiatives. |
| 44 | `SplitText` | Inner Heroes & `/legal/*` | Page Hero Titles | Refined GSAP line-and-word split text reveal. |
| 45 | `FallingText` | `/careers` | Careers Hero Header | Physics-simulated falling trade skill keywords with mouse scatter and container bounds. |
| 46 | `Stepper` | `/careers` & `/rfq` | Hiring Process & 5-Step RFQ Wizard | Multi-stage guided workflow with animated progress bars, step validation, and back navigation. |
| 47 | `Folder` | `/compliance` | Regulatory Document Groups | Interactive tabbed folder components that open on click to display certificates. |
| 48 | `LineSidebar` | `/compliance` & `/legal/*` | Sticky Table of Contents | Clean animated indicator line tracking current reading section via IntersectionObserver. |
| 49 | `FadeContent` | `/legal/*` | Legal Section Blocks | Calibrated scroll-triggered opacity fades with zero spatial shift for legal readability. |
| 50 | `OptionWheel` | `/rfq` | Incoterm Selector (Step 4) | Circular rotating wheel picker (EXW, FOB, CFR, CIF, DAP, DDP) with accessible native select fallback. |
| 51 | `SpecularButton` | `/rfq` | RFQ Form Submit Button | WebGL specular shine button with active loading shimmer and ClickSpark burst. |
| 52 | `GlassSurface` | `/contact` | Contact Details Panel | Multi-layer frosted glass card with real-time blur and SVG edge distortion. |
| 53 | `GradientText` | Global Footers & Badges | High-intent typography | Smooth continuous multi-stop gradient color animation across brand golds. |
| 54 | `CountUp` | `/rfq` Success & Numbers | SLA & Metric Displays | Smooth numerical easing from 0 to target metric with custom formatting. |
| 55 | `CurvedLoop` | Visual Highlights | Trade Corridor Visualizers | Flowing curved path animation for supply chain logistics and shipping routes. |
| 56 | `TrueFocus` | Hero Subtitles | Value Proposition Headlines | Animated bounding box jumping between focal keywords. |
| 57 | `ElasticSlider` | Interactive Showcases | Volume & Specification Sliders | Fluid spring-physics range slider for consignment estimates. |
| 58 | `Crosshair` | Global Visual Assets | Technical Specification Overlays | Fine-line architectural crosshairs for technical precision feel. |
| 59 | `Topography` | Background Overlays | Geological & Mineral Detail Backdrops | Contour line topographic vector shader. |
| 60 | `Stack` | Mobile Showcases | Compact Card Piles | Gesture-driven swipeable card stack. |
| 61 | `CardSwap` | Rotating Highlights | Value Proposition Cards | Automatic cyclic card swap with 3D promotion overlap. |
| 62 | `AnimatedContent` | Content Sections | Section Reveals | General-purpose entrance wrapper with threshold triggers and blur transitions. |

---

## 5. Accessibility & Reduced Motion Standards
Trivoxa Group enforces strict **WCAG 2.1 AA** compliance across every interactive and animated surface:
- **`prefers-reduced-motion: reduce` Support**:
  - All canvas render loops (`DarkVeil`, `Radar`, `Threads`, `LaserFlow`, `LightRays`, `DotField`) freeze or unmount into solid brand-token surfaces.
  - Spatial scrubbers (`ScrollExpand`, `ScrollStack`) render in their final, fully-expanded resting states.
  - Split text animations (`SplitText`, `BlurText`, `KineticTextReveal`) display the complete un-split text immediately.
  - Marquees and loops (`LogoLoop`, `FlowingMenu`) stop continuous translation and render scrollable or static flex rows.
  - Interactive physics (`TargetCursor`, `FallingText`, `Magnet`, `OptionWheel`) disable pointer forces.
- **Screen Reader Integrity**:
  - All animated text components retain the complete, original string inside `aria-label` or visually hidden elements; split characters and decorative spans carry `aria-hidden="true"`.
  - The entire site maintains strictly **one `<h1>` per page** across all 59 generated static routes.
  - Form controls (including custom pickers like `OptionWheel` and `ChromaGrid`) provide native `<select>`, `role="radiogroup"`, `role="radio"`, and `aria-checked` states.
- **Contrast & Legibility**:
  - Text rendered over animated shaders or canvas backgrounds uses dark scrim overlays (`rgba(36, 28, 24, 0.85)` / `bg-[#241C18]/90`) ensuring contrast ratios strictly exceeding 4.5:1 for body copy and 3.0:1 for large display text.

---

## 6. Build & Verification Status
The full verification pipeline executes without exceptions:
- **`npm run typecheck`**: **0 TypeScript errors** (`tsc --noEmit`).
- **`npm run lint`**: **0 ESLint errors** across all components and scripts (`eslint .`).
- **`npm run test`**: **99 / 99 unit & integration tests passing** across 9 test suites (`vitest run`).
- **`npm run build`**: **59 / 59 static routes generated** successfully with Next.js Turbopack SSG.
- **Landmark Accessibility**: Every static HTML page contains valid `<main id="main">`, `<header role="banner">`, skip-to-content links, canonical tags, and zero positive tabindices.
