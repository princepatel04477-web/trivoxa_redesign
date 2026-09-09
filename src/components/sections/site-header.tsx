'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { BrandLockup } from '@/components/ui/brand-lockup';
import { MagneticButton } from '@/components/motion/magnetic-button';
import { StatusBadge } from '@/components/ui/badge';
import { NAV_GROUPS, type NavGroup } from '@/lib/nav';
import { SHIPPED_LOCALES } from '@/lib/i18n/locales';
import { useGSAP } from '@/components/motion/use-gsap';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { DURATION, EASE_GSAP, EASE_MOTION, STAGGER } from '@/lib/tokens/motion';
import { CONTACT } from '@/content/taxonomy';
import { cn } from '@/lib/utils';

/**
 * SiteHeader — the shell, and two audit fixes.
 *
 * FINDING 1: Industries and Contact were missing from the primary nav on the
 * live site. The buyer-intent mega-menu below makes both reachable from every
 * route (Industries under "What We Export", Contact under "Work With Us"), and
 * the acceptance test asserts reachability per route.
 *
 * FINDING 2: Contact and RFQ overlapped. The header now makes RFQ the single
 * commercial destination — the persistent bronze-accented button — while
 * Contact sits under "Work With Us" as the "just want to talk" path.
 *
 * Behaviour: transparent over the (always deep-surfaced) hero; past 80px of
 * scroll it fills with espresso, gains a 1px bronze hairline and compresses —
 * driven by GSAP ScrollTrigger, never a scroll listener.
 */
/**
 * `aria-current="page"` — exact match only. A section link is not "the current
 * page" when you are two levels inside it: announcing /businesses as current on
 * /businesses/product-exports is a lie a screen reader user will notice (P20).
 */
function currentFor(href: string, pathname: string): 'page' | undefined {
  return pathname.replace(/\/$/, '') === href ? 'page' : undefined;
}

export function SiteHeader() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const menuId = useId();

  /* scroll state: espresso fill + hairline + compression, via ScrollTrigger */
  useGSAP(({ gsap, ScrollTrigger }) => {
    const header = headerRef.current;
    if (!header) return;

    header.style.setProperty('--header-h', '84px');

    // Height compression rides the house curve — driven straight off the
    // ScrollTrigger callbacks that also flip data-scrolled (for the CSS fill
    // and hairline), rather than a MutationObserver watching the attribute
    // this same effect just set.
    const compress = (scrolled: boolean): void => {
      header.dataset.scrolled = scrolled ? 'true' : 'false';
      gsap.to(header, {
        height: scrolled ? 64 : 84,
        duration: reduced ? 0 : DURATION.fast / 1000,
        ease: EASE_GSAP.outExpo,
        overwrite: 'auto',
        onUpdate: () => {
          header.style.setProperty('--header-h', `${header.offsetHeight}px`);
        },
      });
    };

    const trigger = ScrollTrigger.create({
      start: 80,
      end: 'max',
      onEnter: () => compress(true),
      onEnterBack: () => compress(true),
      onLeaveBack: () => compress(false),
    });

    return () => {
      trigger.kill();
    };
  });

  /* close on navigation */
  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [pathname]);

  const close = useCallback((): void => {
    setOpenGroup(null);
  }, []);

  /* Escape closes; focus trap while a panel or the mobile menu is open */
  useEffect(() => {
    const active = openGroup !== null || mobileOpen;
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault();
        const index = openGroup === null ? -1 : NAV_GROUPS.findIndex((g) => g.id === openGroup);
        close();
        setMobileOpen(false);
        // Focus has to go back to the control that opened the overlay. The panel
        // unmounts under the focused element, and without this the browser drops
        // focus to <body> — a keyboard user is silently teleported to the top of
        // the document (P20).
        if (mobileOpen) menuButtonRef.current?.focus();
        else if (index >= 0) triggersRef.current[index]?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      const scope = mobileOpen ? headerRef.current : (panelRef.current ?? headerRef.current);
      if (!scope) return;
      const focusables = Array.from(
        scope.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openGroup, mobileOpen, close]);

  /* arrow keys move between the group triggers */
  const onTriggerKeyDown = (event: React.KeyboardEvent, index: number): void => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + delta + NAV_GROUPS.length) % NAV_GROUPS.length;
    triggersRef.current[next]?.focus();
  };

  const activeGroup = NAV_GROUPS.find((group) => group.id === openGroup) ?? null;

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      data-surface="deep"
      className={cn(
        'fixed inset-x-0 top-0 z-50 text-ivory',
        'transition-[background-color,border-color] duration-fast ease-house',
        'border-b border-transparent',
        'data-[scrolled=true]:bg-espresso/95 data-[scrolled=true]:border-bronze/35',
        'data-[scrolled=true]:backdrop-blur-md',
        mobileOpen && 'bg-espresso border-bronze/35',
      )}
      style={{ height: 84 }}
    >
      <div className="container-content flex h-full items-center justify-between gap-lg">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow / 1000, ease: EASE_MOTION.outExpo }}
          className="shrink-0"
        >
          <Link
            href="/"
            className="rounded-sm py-2 text-ivory transition-opacity hover:opacity-80"
            aria-label="Trivoxa Group — home"
            aria-current={currentFor('/', pathname)}
          >
            <BrandLockup size={30} />
          </Link>
        </motion.div>

        {/* desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-xl lg:flex">
          {NAV_GROUPS.map((group, index) => (
            <button
              key={group.id}
              ref={(el) => {
                triggersRef.current[index] = el;
              }}
              type="button"
              aria-expanded={openGroup === group.id}
              aria-controls={`${menuId}-${group.id}`}
              aria-haspopup="true"
              onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
              onKeyDown={(event) => onTriggerKeyDown(event, index)}
              className={cn(
                'link-underline flex items-center gap-1.5 py-2 text-body-sm font-medium',
                'transition-colors duration-fast ease-house',
                openGroup === group.id ? 'text-bronze' : 'text-ivory hover:text-bronze',
              )}
            >
              {group.label}
              <svg
                aria-hidden
                viewBox="0 0 10 6"
                className={cn(
                  'h-1.5 w-2.5 transition-transform duration-fast ease-house',
                  openGroup === group.id && 'rotate-180',
                )}
                fill="none"
              >
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-md">
          <LocaleSwitcher />

          {/* The one magnetic element on the page (docs/MOTION.md: "applied
              to the PRIMARY CTA only") — this is that CTA. */}
          <MagneticButton className="hidden sm:inline-flex" strength={0.22}>
            <Link
              href="/rfq"
              aria-current={currentFor('/rfq', pathname)}
              className={cn(
                'inline-flex items-center gap-2 border border-bronze/70 px-5 py-2.5 text-body-sm font-semibold',
                'rounded-control text-ivory transition-all duration-fast ease-house',
                'hover:border-bronze hover:bg-bronze/15',
              )}
            >
              Request a Quote
            </Link>
          </MagneticButton>

          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={cn(
                  'bg-current absolute inset-x-0 top-0 h-px transition-transform duration-fast ease-house',
                  mobileOpen && 'top-1/2 rotate-45',
                )}
              />
              <span
                className={cn(
                  'bg-current absolute inset-x-0 bottom-0 h-px transition-transform duration-fast ease-house',
                  mobileOpen && 'bottom-1/2 -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mega-menu panel */}
      <AnimatePresence>
        {activeGroup ? (
          <motion.div
            key={activeGroup.id}
            id={`${menuId}-${activeGroup.id}`}
            ref={panelRef}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : DURATION.base / 1000, ease: EASE_MOTION.house }}
            className="bg-espresso-deep absolute inset-x-0 top-full overflow-hidden border-t border-bronze/25"
          >
            <MegaPanel group={activeGroup} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

/* ------------------------------------------------------------------------ */

function MegaPanel({ group }: { group: NavGroup }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="container-content grid grid-cols-12 gap-xl py-xl">
      {group.columns.map((column, columnIndex) => (
        <motion.nav
          key={column.heading}
          aria-label={column.heading}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduced ? 0 : (columnIndex * STAGGER.tight) / 1000,
            duration: DURATION.fast / 1000,
            ease: EASE_MOTION.house,
          }}
          className={cn(
            'col-span-12 flex flex-col gap-xs',
            group.featured ? 'lg:col-span-3' : 'lg:col-span-4',
          )}
        >
          <p className="eyebrow mb-md text-ivory/60">{column.heading}</p>
          <ul className="flex flex-col">
            {column.items.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  aria-current={currentFor(item.href, pathname)}
                  {...(item.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="group flex items-baseline justify-between gap-md py-2 text-ivory transition-colors duration-fast ease-house hover:text-bronze"
                >
                  <span className="text-body-md">{item.label}</span>
                  {item.status === 'onboarding' ? <StatusBadge status="onboarding" /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      ))}

      {group.featured ? (
        <motion.aside
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: DURATION.fast / 1000, duration: DURATION.base / 1000 }}
          className="border-bronze/30 col-span-12 flex flex-col gap-md border-l pl-xl lg:col-span-3"
        >
          <motion.div
            initial={reduced ? false : { scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: DURATION.slow / 1000, ease: EASE_MOTION.house }}
            className="from-espresso to-espresso-deep bg-gradient-to-b p-lg"
          >
            <p className="eyebrow text-bronze">{group.featured.eyebrow}</p>
            <p className="text-heading-md mt-md text-ivory">{group.featured.title}</p>
            <p className="mt-xs text-body-sm text-ivory/70">{group.featured.body}</p>
            <Link
              href={group.featured.href}
              className="border-bronze/70 text-ivory hover:border-bronze hover:bg-bronze/15 mt-lg inline-flex items-center gap-2 border px-4 py-2 text-body-sm font-semibold transition-colors duration-fast ease-house rounded-control"
            >
              {group.featured.cta}
            </Link>
          </motion.div>
        </motion.aside>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent): void => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // P18's rule, enforced at the source: the switcher lists ONLY locales with a
  // complete catalogue. Today that is English; de and ar join when translated.
  if (SHIPPED_LOCALES.length <= 1) {
    return (
      <span className="text-ivory/70 hidden text-body-sm font-medium sm:inline" aria-label="Language: English">
        EN
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="text-ivory hover:text-bronze text-body-sm font-medium transition-colors"
      >
        EN
      </button>
      {open ? (
        <ul role="listbox" className="bg-espresso-deep border-bronze/30 absolute right-0 mt-2 border p-xs">
          {SHIPPED_LOCALES.map((locale) => (
            <li key={locale.code}>
              <Link href={locale.prefix} className="text-ivory hover:text-bronze block px-3 py-1.5 text-body-sm">
                {locale.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: DURATION.fast / 1000 }}
          className="bg-espresso-deep fixed inset-x-0 bottom-0 top-[var(--header-h,84px)] z-40 overflow-y-auto lg:hidden"
        >
          <nav aria-label="Primary mobile" className="container-content flex flex-col py-xl">
            {NAV_GROUPS.map((group, index) => (
              <motion.div
                key={group.id}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: reduced ? 0 : (index * STAGGER.base) / 1000,
                  duration: DURATION.base / 1000,
                  ease: EASE_MOTION.house,
                }}
                className="border-ivory/15 border-b"
              >
                <button
                  type="button"
                  aria-expanded={expanded === group.id}
                  onClick={() => setExpanded(expanded === group.id ? null : group.id)}
                  className="text-ivory flex w-full items-center justify-between py-lg text-heading-md"
                >
                  {group.label}
                  <span aria-hidden className={cn('text-bronze transition-transform', expanded === group.id && 'rotate-45')}>
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {expanded === group.id ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: DURATION.fast / 1000, ease: EASE_MOTION.house }}
                      className="overflow-hidden pb-lg"
                    >
                      {group.columns.map((column) => (
                        <div key={column.heading} className="mb-md">
                          <p className="eyebrow text-ivory/50 mb-xs">{column.heading}</p>
                          {column.items.map((item) => (
                            <Link
                              key={`${item.href}-${item.label}`}
                              href={item.href}
                              aria-current={currentFor(item.href, pathname)}
                              onClick={onClose}
                              className="text-ivory/85 hover:text-bronze flex items-center justify-between py-1.5 text-body-md"
                            >
                              {item.label}
                              {item.status === 'onboarding' ? <StatusBadge status="onboarding" /> : null}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ))}

            <div className="mt-xl flex flex-col gap-md">
              <Link
                href="/rfq"
                aria-current={currentFor('/rfq', pathname)}
                onClick={onClose}
                className="border-bronze/70 text-ivory hover:bg-bronze/15 inline-flex items-center justify-center border px-5 py-3 text-body-md font-semibold rounded-control"
              >
                Request a Quote
              </Link>
              <a
                href={CONTACT.phoneNumbers[0] ? `tel:${CONTACT.phoneNumbers[0]}` : `/contact`}
                onClick={onClose}
                className="text-ivory/80 text-center text-body-sm"
              >
                {CONTACT.phoneNumbers[0] ?? 'Contact us'}
              </a>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
