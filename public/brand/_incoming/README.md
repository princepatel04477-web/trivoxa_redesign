# Drop the real logo pack here

Everything from the Drive folder **"Trivoxa website / Logo"** goes in this directory:

- `Trivoxa Final Logo file without BG` → the transparent PNGs (`1.png` … `7.png`)
- `trivoxa-logo.svg` and `trivoxa-logo check.svg`
- the `3D LOGO` folder
- the `Logo video` folder

Then run:

```bash
npm run check:brand
```

It reports which generated provisional asset each uploaded file supersedes, and
flags anything the build still needs. Nothing in `src/` has to change: the
components read `public/brand/trivoxa-mark.svg` and the vector wordmark in
`src/lib/brand/wordmark-paths.ts`, and both are single-point swaps.

**Do not ship the logo video or the 3D renders on the critical path.** They are
recorded in `docs/DECISIONS.md` as candidates for the Group page hero and the
loading state — not for the header, not for LCP.
