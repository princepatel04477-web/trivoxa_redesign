'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { GoArrowUpRight } from 'react-icons/go';
import { ChevronDown } from 'lucide-react';
import { BrandLockup } from '@/components/ui/brand-lockup';

export type NavSubLink = {
  label: string;
  href: string;
  description: string;
};

export type NavItem = {
  label: string;
  href: string;
  sublinks?: NavSubLink[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'The Group',
    href: '/group',
    sublinks: [
      { label: 'Group Overview', href: '/group', description: 'Surat headquarters & manufacturing lineage' },
      { label: 'Leadership', href: '/group#leadership', description: 'Executive board & governance' },
      { label: 'Shiveshwar Foundation', href: '/group#foundation', description: 'CSR & community empowerment initiatives' },
    ],
  },
  {
    label: 'Businesses',
    href: '/businesses',
    sublinks: [
      { label: 'Product Exports', href: '/businesses/product-exports', description: 'Industrial goods, textiles, agro & stone exports' },
      { label: 'Service Exports', href: '/businesses/service-exports', description: 'Contract manufacturing & supply chain tech' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
  },
  {
    label: 'Global Presence',
    href: '/global-presence',
  },
  {
    label: 'Insights',
    href: '/insights',
  },
  {
    label: 'Careers',
    href: '/careers',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

// Preserved for backwards compatibility
export const TRIVOXA_CARDNAV_ITEMS = NAV_ITEMS;

export function GlobalCardNav() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close all menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
    setIsHidden(false);
    ScrollTrigger.refresh();
  }, [pathname]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll listener for height compression, hide on scroll down, and scroll-progress hairline
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const currentY = window.scrollY;
        setIsScrolled(currentY > 120);

        if (currentY > 160 && self.direction === 1 && !isMobileOpen) {
          setIsHidden(true);
        } else if (self.direction === -1 || currentY < 120) {
          setIsHidden(false);
        }

        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [isMobileOpen]);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header
      ref={containerRef}
      role="banner"
      className={`fixed left-1/2 -translate-x-1/2 w-[94%] max-w-[1100px] z-[99] transition-transform duration-300 ${
        isScrolled ? 'top-3 md:top-4' : 'top-4 md:top-6'
      } ${isHidden ? '-translate-y-32' : 'translate-y-0'}`}
    >
      <nav
        aria-label="Global Primary Navigation"
        className={`relative block w-full rounded-2xl border border-bronze/30 shadow-2xl transition-colors duration-300 backdrop-blur-xl ${
          isScrolled ? 'bg-espresso-deep/95' : 'bg-espresso-deep/90'
        }`}
      >
        {/* Scroll Progress Hairline at top edge */}
        <div
          ref={progressBarRef}
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-bronze to-bronze/60 origin-left scale-x-0"
        />

        {/* Top Header Bar */}
        <div
          className={`flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
            isScrolled ? 'h-[54px]' : 'h-[64px]'
          }`}
        >
          {/* Left: Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 text-ivory transition-opacity hover:opacity-90 shrink-0"
            aria-label="Trivoxa Group - Homepage"
          >
            <BrandLockup size={24} className="md:hidden" />
            <BrandLockup size={30} className="hidden md:inline-flex" />
          </Link>

          {/* Center: Desktop Direct Navigation & Flyouts */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              if (item.sublinks) {
                const isOpen = openDropdown === item.label;
                return (
                  <div
                    key={item.label}
                    className="relative py-2"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={item.href}
                      className={`group flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                        isActive || isOpen
                          ? 'bg-ivory/15 text-ivory font-semibold'
                          : 'text-ivory/80 hover:bg-ivory/10 hover:text-ivory'
                      }`}
                      aria-expanded={isOpen}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`size-3 text-bronze transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </Link>

                    {/* Flyout Dropdown */}
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-1.5 transition-all duration-200 ${
                        isOpen
                          ? 'opacity-100 translate-y-0 pointer-events-auto'
                          : 'opacity-0 -translate-y-2 pointer-events-none'
                      }`}
                    >
                      <div className="w-72 rounded-2xl border border-bronze/35 bg-espresso-deep/98 p-2.5 shadow-2xl backdrop-blur-2xl">
                        {item.sublinks.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`group/sub flex flex-col rounded-xl p-2.5 transition-colors ${
                                isSubActive
                                  ? 'bg-ivory/15'
                                  : 'hover:bg-ivory/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`font-serif text-sm font-semibold transition-colors ${
                                  isSubActive ? 'text-bronze font-bold' : 'text-ivory group-hover/sub:text-bronze'
                                }`}>
                                  {sub.label}
                                </span>
                                <GoArrowUpRight className="size-3 text-bronze/70 group-hover/sub:text-bronze group-hover/sub:translate-x-0.5 group-hover/sub:-translate-y-0.5 transition-transform" />
                              </div>
                              <span className="mt-0.5 text-[11px] text-stone-400 font-sans leading-tight">
                                {sub.description}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-ivory/15 text-bronze font-bold shadow-sm'
                      : 'text-ivory/80 hover:bg-ivory/10 hover:text-ivory'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex lg:hidden group items-center gap-2 rounded-full px-3 py-1.5 border border-bronze/30 bg-ivory/10 text-ivory hover:bg-ivory/20 transition-all cursor-pointer"
            >
              <span className="text-xs font-medium text-ivory">
                {isMobileOpen ? 'Close' : 'Menu'}
              </span>
              <div className="flex flex-col gap-1 w-3.5">
                <span
                  className={`block h-0.5 w-full bg-bronze transition-transform duration-300 ${
                    isMobileOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-bronze transition-opacity duration-300 ${
                    isMobileOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-bronze transition-transform duration-300 ${
                    isMobileOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>

            {/* Solid Ink "Request a quote" Button — NO Magnet hover repellent */}
            <Link
              href="/rfq"
              aria-label="Request a quote"
              className="inline-flex items-center justify-center rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-espresso shadow-sm transition-all duration-200 hover:bg-bronze hover:text-stone-950 hover:shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <span className="sm:hidden">Quote</span>
              <span className="hidden sm:inline">Request a quote</span>
            </Link>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {isMobileOpen && (
          <div className="lg:hidden border-t border-bronze/25 bg-espresso-deep/98 px-5 py-6 rounded-b-2xl max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col divide-y divide-stone-800/80">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <div key={item.label} className="py-2.5">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`font-serif text-base font-semibold transition-colors ${
                            isActive ? 'text-bronze font-bold' : 'text-ivory hover:text-bronze'
                          }`}
                        >
                          {item.label}
                        </Link>
                        {item.sublinks && (
                          <span className="font-mono text-[10px] text-bronze/60 uppercase">
                            {item.sublinks.length} divisions
                          </span>
                        )}
                      </div>

                      {item.sublinks && (
                        <div className="mt-2 ml-2 flex flex-col gap-2 border-l border-bronze/25 pl-3">
                          {item.sublinks.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsMobileOpen(false)}
                              className="group flex items-center justify-between text-xs text-stone-300 hover:text-bronze py-0.5"
                            >
                              <span>{sub.label}</span>
                              <GoArrowUpRight className="size-3 text-bronze/60 group-hover:text-bronze" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile RFQ CTA */}
              <div className="pt-2">
                <Link
                  href="/rfq"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-bronze py-3 text-center font-mono text-xs uppercase font-semibold text-stone-950 shadow-lg hover:bg-bronze-light transition-all"
                >
                  Request an Official Quotation (RFQ)
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
