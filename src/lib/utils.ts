import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class lists; last wins. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Brand numbers are formatted locale-aware everywhere they render, so an
 * Arabic visitor sees ٢٥ and a German visitor sees 25 — never a hardcoded
 * English grouping. `compact` gives "1.2k" style for stat bands.
 */
export function formatNumber(value: number, locale: string, compact = false): string {
  return new Intl.NumberFormat(locale, {
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

export function formatDateTime(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
}

/** `2027-Q1` → "Q1 2027", localised where the locale has quarter names. */
export function formatQuarter(target: string, locale: string): string {
  const match = /^(\d{4})-Q([1-4])$/.exec(target);
  if (!match) return target;
  const [, year, quarter] = match;
  const label = new Intl.NumberFormat(locale).format(Number(year));
  const q = new Intl.NumberFormat(locale).format(Number(quarter));
  return locale.startsWith('ar') ? `الربع ${q} ${label}` : `Q${q} ${label}`;
}

/** Clamp without surprises, used by canvas/scene math. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Deterministic pseudo-random in [0,1) from a seed — stable particle jitter. */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function isExternalHref(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}
