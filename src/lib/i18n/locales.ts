/**
 * src/lib/i18n/locales.ts — the ONLY list of languages the site claims to speak.
 * ---------------------------------------------------------------------------
 * July 2026 audit: the live site shipped a 12-language switcher whose
 * translations could not be verified — *"shipping a language switcher that
 * doesn't actually translate is worse than not having one; it reads as broken
 * to the exact international audience it's meant to reassure."*
 *
 * The rule, enforced at the source: a locale appears in the switcher ONLY when
 * its message catalogue is complete. P18 lands `de` and `ar` with human-reviewed
 * translations and flips them on here; nothing else may be listed, however
 * strongly anyone insists — the brief says to say so rather than ship
 * placeholders.
 */

export type Locale = {
  code: 'en' | 'de' | 'ar';
  /** Native name, as shown in the switcher. */
  label: string;
  /** Route prefix. The default locale is unprefixed. */
  prefix: string;
  dir: 'ltr' | 'rtl';
  /** True only when messages/<code>.json is complete. */
  complete: boolean;
};

export const LOCALES: Locale[] = [
  { code: 'en', label: 'English', prefix: '/', dir: 'ltr', complete: true },
  // Flipped to complete:true by P18 once human-reviewed catalogues land.
  { code: 'de', label: 'Deutsch', prefix: '/de', dir: 'ltr', complete: false },
  { code: 'ar', label: 'العربية', prefix: '/ar', dir: 'rtl', complete: false },
];

export const SHIPPED_LOCALES: Locale[] = LOCALES.filter((locale) => locale.complete);

export const DEFAULT_LOCALE = 'en' as const;

export function localeByCode(code: string): Locale | undefined {
  return LOCALES.find((locale) => locale.code === code);
}
