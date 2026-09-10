/**
 * P1 acceptance, enforced:
 *  · the CSS token file and the TS token file agree on every brand hex;
 *  · ivory-on-espresso and espresso-on-ivory clear WCAG AA, computed;
 *  · motion values in TS match the CSS @theme block (no magic numbers).
 */
import { readdirSync, readFileSync } from 'node:fs';
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

/* -------------------------------------------------------------------------- */
/* P20 — accent text contrast                                                 */
/* -------------------------------------------------------------------------- */

describe('bronze words (P20)', () => {
  it('accentText clears AA for body copy on every surface ground and card', () => {
    for (const surface of Object.values(SURFACES)) {
      expect(
        meetsAA(contrastRatio(surface.accentText, surface.bg), 'normal'),
        `${surface.surface}: accentText on bg`,
      ).toBe(true);
      expect(
        meetsAA(contrastRatio(surface.accentText, surface.raised), 'normal'),
        `${surface.surface}: accentText on raised`,
      ).toBe(true);
    }
  });

  it('the light surface darkens bronze to bronze-ink; dark surfaces keep bronze', () => {
    expect(SURFACES.light.accentText).toBe(BRAND.bronzeInk.hex);
    expect(SURFACES.dark.accentText).toBe(BRAND.bronze.hex);
    expect(SURFACES.deep.accentText).toBe(BRAND.bronze.hex);
    // Bronze itself still fails AA as text on ivory — that is the reason the
    // second token exists, and this is what stops anyone collapsing them.
    expect(meetsAA(contrastRatio(BRAND.bronze.hex, BRAND.ivory.hex), 'normal')).toBe(false);
  });

  it('globals.css wires --surface-accent-text per surface', () => {
    const block = (surface: string): string => {
      const start = css.indexOf(`[data-surface='${surface}']`);
      expect(start, surface).toBeGreaterThan(-1);
      return css.slice(start, css.indexOf('}', css.indexOf('--surface-shadow-lift', start)));
    };

    expect(block('light')).toContain('--surface-accent-text: var(--color-bronze-ink)');
    expect(block('dark')).toContain('--surface-accent-text: var(--color-bronze)');
    expect(block('deep')).toContain('--surface-accent-text: var(--color-bronze)');
    expect(css).toContain('@utility text-accent');
  });

  it('text-bronze only ever appears on a dark surface', () => {
    // A gate, not a style preference: bronze on ivory is 2.8:1. Any component
    // that renders bronze WORDS must be able to point at the dark ground it
    // sits on (data-surface="deep"/"dark", or an explicit espresso background).
    const root = path.resolve(__dirname, '../src');
    const offenders: string[] = [];

    const walk = (dir: string): void => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith('.tsx')) {
          const src = readFileSync(full, 'utf8');
          const usesBronzeText = /text-bronze(?!-ink)/.test(src);
          const darkGround =
            /data-surface=['"](?:dark|deep)['"]/.test(src) ||
            /bg-espresso/.test(src) ||
            /data-\[scrolled=true\]:bg-espresso/.test(src);
          if (usesBronzeText && !darkGround) offenders.push(path.relative(root, full));
        }
      }
    };

    walk(root);
    expect(offenders, `text-bronze on a light surface: ${offenders.join(', ')}`).toEqual([]);
  });
});
