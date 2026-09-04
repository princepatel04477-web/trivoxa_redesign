# CONTENT-MODEL.md — how site data works

Read this before editing any list, product, region, certification or contact
detail. The July 2026 audit found this site shipping four different answers to
"what does Trivoxa sell". This document exists so that can never happen again.

## The one rule

**`src/content/taxonomy.ts` is the only place these lists exist.**

Everything a visitor sees — the mega-menu, the homepage previews, the catalog,
the footer region line, the globe, the compliance tables, the JSON-LD — is
rendered from those arrays through `src/lib/selectors.ts`. Components do not
import the raw arrays; they call selectors. That indirection is what makes the
drift rules enforceable in one file.

## Files

| File | Holds | Who edits it |
|---|---|---|
| `src/content/taxonomy.ts` | INDUSTRIES, DIVISIONS, CATEGORIES, PRODUCTS, REGIONS, PORTS, CERTIFICATIONS, CONTACT | anyone, via PR |
| `src/content/schemas.ts` | the zod contracts those arrays must satisfy | engineers |
| `src/content/company.ts` | the Shiveshwar relationship (ONE sentence), leadership, values, journey, commitments | founders + engineer, with an ADR row |
| `src/lib/selectors.ts` | the only read-path into the taxonomy | engineers |
| `src/content/insights/*.mdx` | articles (P15) | anyone, via PR |
| `src/content/roles/*.ts` | open roles (P15) | founders, via PR |

## Statuses, and what they mean visually

There are exactly two statuses: `live` and `onboarding`.

* **`live`** — the item may be sold today. A `live` product **must** carry every
  required spec field (HS code, grade, MOQ, lead time, Incoterms, port). The
  schema makes an incomplete live product *unrepresentable*; the build fails.
* **`onboarding`** — the item is real but not yet sellable. It renders with the
  designed empty state (`<OnboardingState>`): an honest heading, what IS
  available today, an expected timeframe where one exists, and a "tell us what
  you're sourcing" form routing to `/rfq`. It is **never** an empty table, a
  dead link, or a row of em-dashes.

There is no third state. "Marketed as active with an empty catalog" is the
Furniture & Interiors failure and is a build error.

## Adding content — the whole procedure

**A new industry** (say, a 10th): append one object to `INDUSTRIES`. Add its
categories to `CATEGORIES` and products to `PRODUCTS` if it has any. Update
nothing else. Pages, nav, sitemap, internal links and the homepage count text
all derive from the array. `scripts/check-taxonomy.ts` verifies the references.

**A new product**: append to `PRODUCTS` with `status: 'live'` and complete specs,
or `status: 'onboarding'` if specs are not confirmed. Set `portSlug` from
`PORTS` and `categorySlug` from `CATEGORIES`.

**A new certification**: append to `CERTIFICATIONS`. `in-progress` requires a
`targetQuarter` (or an explicit `targetNote` when a quarter would be a lie).
The compliance page splits active/in-progress automatically.

**A new region**: append to `REGIONS`. The footer, Global Presence and the globe
update together because they render the same array. You must supply a
`verifiableDetail` of at least 30 characters — a specific, checkable fact. The
build warns until a founder confirms it.

**An article**: add an MDX file to `src/content/insights/`. The index, the
sitemap, the JSON-LD and the homepage preview all switch on automatically. With
zero published articles the homepage preview does not render at all (P10).

**A role**: add to the roles collection. With zero open roles `/careers` renders
the rolling hiring-philosophy model, never an empty list under an urgency
headline.

## The guards, and what they catch

`npm run build` runs `scripts/check-taxonomy.ts`, which fails on:

1. any array failing its zod schema (including incomplete `live` products);
2. a category referencing a missing industry, a product referencing a missing
   category or port, an industry referencing a missing category or region;
3. a `live` industry owning categories but no live product;
4. any email in `src/` outside the canonical `CONTACT` set or off the
   `@trivoxagroup.com` domain (RFC-2606 example domains are exempt);
5. the Shiveshwar canonical sentence appearing in more than one file;
6. `docs/DECISIONS.md` marking the Shiveshwar relationship `OPEN`.

and warns on: empty phone numbers, null entity number, unconfirmed region
facts, in-progress certifications without targets.

`tests/taxonomy.test.ts` additionally proves the footer region list and the
Global Presence region list are identical, and that the homepage preview always
carries the true total.

## Copy rules (the audit's sharpest criticism)

* **No abstraction stacking.** The same trust/quality/partnership sentence may
  not be rewritten six ways across six pages. Every section earns its place
  with a fact: an HS code, a port name, a lead time, a certification date, a
  factory photo.
* **Sentences ≤ 22 words** in proof and pillar sections (checked in review).
* Banned words: *leverage, synergy, seamless, cutting-edge*.
* Numbers render in Geist Mono via `data-spec` / `<SpecChip>` — the numbers ARE
  the product for this audience.
* Honesty about a gap is a trust asset. "ISO 9001 in progress, target Q1 2027"
  outsells silence to the buyer personas in the audit.
