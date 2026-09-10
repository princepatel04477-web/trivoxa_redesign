# src/fonts/custom/

Drop the **real brand body face** here. Tracked in git, unlike `../vendor/`.

## What to upload

From Fontshare → Satoshi (<https://www.fontshare.com/fonts/satoshi>), download the
WOFF2 files and place them here. Any ONE of these layouts works — `sync-fonts.ts`
detects them in this priority order:

**1. Variable (best — one file, full weight axis)**

```
Satoshi-Variable.woff2
```

**2. Static, Fontshare's own naming**

```
Satoshi-Regular.woff2     → weight 400
Satoshi-Medium.woff2      → weight 500
Satoshi-Bold.woff2        → weight 600
```

**3. Static, @fontsource naming** (if you export from another tool)

```
satoshi-latin-400-normal.woff2
satoshi-latin-500-normal.woff2
satoshi-latin-600-normal.woff2
```

Then run `npm run prebuild` (or just `npm run dev` / `npm run build` — it runs
automatically). Nothing else changes: every consumer reads the `--font-body`
custom property, and `/styleguide` reports which face is active.

## Until then

The build falls back to **Inter**, which is the fallback the brand document
itself names. `/styleguide` shows a visible warning while the fallback is in use,
so this can never be forgotten or silently shipped.

## Weight budget

The brand spec allows at most 3 families and 5 weights. Current allocation:

| Family           | Role              | Weights        |
| ---------------- | ----------------- | -------------- |
| Instrument Serif | Display           | 400            |
| Satoshi / Inter  | Body + UI         | 400, 500, 600  |
| Geist Mono       | Spec data         | variable axis  |

Do not add a fourth weight to the body face without removing one elsewhere.
