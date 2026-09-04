/**
 * P1 acceptance, enforced:
 *  · the CSS token file and the TS token file agree on every brand hex;
 *  · ivory-on-espresso and espresso-on-ivory clear WCAG AA, computed;
 *  · motion values in TS match the CSS @theme block (no magic numbers).
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { BRAND, SURFACES, contrastRatio, meetsAA } from '@/lib/tokens/colors';
import { DURATION, EASE } from '@/lib/tokens/motion';

const css = readFileSync(path.resolve(__dirname, '../src/app/globals.css'), 'utf8');

function themeBlock(): string {
  const start = css.indexOf('@theme');
  const end = css.indexOf('}', start);
  return css.slice(start, end);
}

describe('palette parity', () => {
  it('every brand hex appears exactly once, in @theme', () => {
    const theme = themeBlock();
    for (const [name, colour] of Object.entries(BRAND)) {
      const occurrences = theme.split(colour.hex.toLowerCase()).length - 1;
      expect(occurrences, `${name} ${colour.hex}`).toBe(1);
    }
  });

  it('no raw hex exists outside the @theme token block', () => {
    const theme = themeBlock();
    const outside = css.replace(theme, '');
    const stray = [...outside.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0]);
    expect(stray).toEqual([]);
  });
});

describe('contrast — computed, WCAG 2.1 AA', () => {
  it('ivory on espresso clears AA normal', () => {
    const ratio = contrastRatio(BRAND.ivory.hex, BRAND.espresso.hex);
    expect(ratio).toBeGreaterThan(4.5);
    expect(meetsAA(ratio)).toBe(true);
  });

  it('espresso on ivory clears AA normal', () => {
    const ratio = contrastRatio(BRAND.espresso.hex, BRAND.ivory.hex);
    expect(meetsAA(ratio)).toBe(true);
  });

  it('every surface fg/bg pair clears AA normal', () => {
    for (const surface of Object.values(SURFACES)) {
      expect(meetsAA(contrastRatio(surface.fg, surface.bg)), surface.surface).toBe(true);
      expect(meetsAA(contrastRatio(surface.muted, surface.bg)), `${surface.surface} muted`).toBe(true);
    }
  });

  it('bronze clears 3:1 on dark grounds — its only legal homes', () => {
    expect(meetsAA(contrastRatio(BRAND.bronze.hex, BRAND.espresso.hex), 'ui')).toBe(true);
    expect(meetsAA(contrastRatio(BRAND.bronze.hex, BRAND.espressoDeep.hex), 'ui')).toBe(true);
  });

  it('bronze on ivory fails non-text contrast, so focus rings carry a deep halo', () => {
    // This is WHY :focus-visible is bronze + espresso-deep halo, not bronze
    // alone. If someone "simplifies" the halo away, this test tells them why
    // it existed. Recorded in docs/DECISIONS.md.
    expect(contrastRatio(BRAND.bronze.hex, BRAND.ivory.hex)).toBeLessThan(3);
    expect(meetsAA(contrastRatio(BRAND.espressoDeep.hex, BRAND.ivory.hex), 'ui')).toBe(true);
  });
});

describe('motion parity', () => {
  it('every duration token exists in the CSS theme', () => {
    const theme = themeBlock();
    for (const [name, ms] of Object.entries(DURATION)) {
      expect(theme.includes(`--duration-${name}: ${ms}ms`), name).toBe(true);
    }
  });

  it('the house curve is identical in both layers', () => {
    const theme = themeBlock();
    expect(theme).toContain(`--ease-house: ${EASE.house}`);
  });
});
