'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { animate } from '@/lib/motion/anime';
import { GoArrowUpRight } from 'react-icons/go';
import { BrandLockup } from '@/components/ui/brand-lockup';
import Magnet from '@/components/reactbits/Magnet/Magnet';

export type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export const TRIVOXA_CARDNAV_ITEMS: CardNavItem[] = [
  {
    label: 'What we export',
    bgColor: BRAND.ivorySoft.hex,
    textColor: BRAND.espresso.hex,
    links: [
      { label: 'Global product exports', href: '/businesses/product-exports', ariaLabel: 'Product Exports' },
      { label: 'Global service exports', href: '/businesses/service-exports', ariaLabel: 'Service Exports' },
      { label: 'All 9 industries', href: '/industries', ariaLabel: 'Industries We Serve' },
    ],
  },
  {
    label: 'Who we are',
    bgColor: BRAND.ivory.hex,
    textColor: BRAND.espresso.hex,
    links: [
      { label: 'The Group', href: '/group', ariaLabel: 'About Trivoxa Group' },
      { label: 'Leadership', href: '/group#leadership', ariaLabel: 'Group Leadership' },
      { label: 'Shiveshwar Foundation', href: '/group#foundation', ariaLabel: 'Shiveshwar Foundation' },
      { label: 'Insights', href: '/insights', ariaLabel: 'Articles and Analysis' },
    ],
  },
  {
    label: 'Global network',
    bgColor: BRAND.ivorySoft.hex,
    textColor: BRAND.espresso.hex,
    links: [
      { label: 'Global presence', href: '/global-presence', ariaLabel: 'Global Operations Map' },
      { label: 'Careers', href: '/careers', ariaLabel: 'Careers at Trivoxa' },
      { label: 'Contact', href: '/contact', ariaLabel: 'Contact Information' },
    ],
  },
];

export function GlobalCardNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Close and reset on route changes cleanly
  useEffect(() => {
    setIsExpanded(false);
    setIsHidden(false);
    const navEl = navRef.current;
    const cardsEl = cardsContainerRef.current;
    if (navEl) {
      gsap.killTweensOf(navEl);
      gsap.killTweensOf(cardsRef.current);
      const baseH = window.scrollY > 120 ? 52 : 64;
      navEl.style.height = `${baseH}px`;
      navEl.style.overflow = 'hidden';
    }
    if (cardsEl) {
      cardsEl.style.display = 'none';
    }
    ScrollTrigger.refresh();
  }, [pathname]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        closeMenu();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Scroll listener for height compression, hide on scroll down, and scroll-progress hairline
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const currentY = window.scrollY;
        setIsScrolled(currentY > 120);

        // Responsive hide on scroll down past 160px; reveal immediately on scroll up
        if (currentY > 160 && self.direction === 1 && !isExpanded) {
          setIsHidden(true);
        } else if (self.direction === -1 || currentY < 120) {
          setIsHidden(false);
        }

        // Scrub progress bar scaleX
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [isExpanded]);

  const openMenu = () => {
    const navEl = navRef.current;
    const cardsEl = cardsContainerRef.current;
    if (!navEl || !cardsEl) return;

    setIsExpanded(true);
    // Unhide to measure natural content height
    cardsEl.style.display = 'grid';
    cardsEl.style.opacity = '0';
    const contentH = cardsEl.scrollHeight;
    const baseH = isScrolled ? 52 : 64;
    const targetH = baseH + contentH;

    gsap.killTweensOf(navEl);
    gsap.killTweensOf(cardsRef.current);
    gsap.set(navEl, { overflow: 'hidden' });

    gsap.fromTo(
      navEl,
      { height: navEl.offsetHeight || baseH },
      {
        height: targetH,
        duration: 0.38,
        ease: 'power3.out',
        onComplete: () => {
          if (navEl) {
            navEl.style.height = 'auto';
            navEl.style.overflow = 'visible';
          }
        },
      }
    );

    gsap.fromTo(
      cardsEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );

    gsap.fromTo(
      cardsRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.32, ease: 'power3.out', stagger: 0.05, delay: 0.05 }
    );
  };

  const closeMenu = () => {
    const navEl = navRef.current;
    const cardsEl = cardsContainerRef.current;
    if (!navEl) return;

    const baseH = isScrolled ? 52 : 64;
    gsap.killTweensOf(navEl);
    gsap.killTweensOf(cardsRef.current);
    if (cardsEl) gsap.killTweensOf(cardsEl);
    gsap.set(navEl, { overflow: 'hidden' });

    gsap.to(cardsRef.current, {
      y: 10,
      opacity: 0,
      duration: 0.18,
      ease: 'power2.in',
    });

    if (cardsEl) {
      gsap.to(cardsEl, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
    }

    gsap.to(navEl, {
      height: baseH,
      duration: 0.32,
      ease: 'power3.inOut',
      onComplete: () => {
        setIsExpanded(false);
        if (cardsEl) cardsEl.style.display = 'none';
        if (navEl) navEl.style.height = `${baseH}px`;
      },
    });
  };

  const toggleMenu = () => {
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Anime.js hover effect for navigation links
  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector('.nav-arrow-icon');
    const underline = e.currentTarget.querySelector('.nav-underline');
    if (icon) {
      animate(icon, {
        translateX: 4,
        rotate: -45,
        duration: 250,
        ease: 'outQuad',
      });
    }
    if (underline) {
      animate(underline, {
        scaleX: [0, 1],
        duration: 300,
        ease: 'outQuad',
      });
    }
  };

  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const icon = e.currentTarget.querySelector('.nav-arrow-icon');
    const underline = e.currentTarget.querySelector('.nav-underline');
    if (icon) {
      animate(icon, {
        translateX: 0,
        rotate: 0,
        duration: 250,
        ease: 'outQuad',
      });
    }
    if (underline) {
      animate(underline, {
        scaleX: 0,
        duration: 200,
        ease: 'outQuad',
      });
    }
  };

  return (
    <header
      ref={containerRef}
      role="banner"
      className={`fixed left-1/2 -translate-x-1/2 w-[92%] max-w-[1020px] z-[99] transition-transform duration-300 ${
        isScrolled ? 'top-3 md:top-4' : 'top-4 md:top-6'
      } ${isHidden ? '-translate-y-32' : 'translate-y-0'}`}
    >
      <nav
        ref={navRef}
        aria-label="Global Primary Navigation"
        className={`relative block w-full rounded-2xl border border-bronze/30 shadow-2xl transition-colors duration-300 backdrop-blur-xl ${
          isScrolled ? 'bg-espresso/90' : 'bg-espresso/80'
        }`}
      >
        {/* Scroll Progress Hairline at top edge of CardNav */}
        <div
          ref={progressBarRef}
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-bronze to-bronze/60 origin-left scale-x-0"
        />

        {/* Top Header Bar */}
        <div
          className={`flex items-center justify-between px-4 md:px-6 transition-all duration-300 ${
            isScrolled ? 'h-[52px]' : 'h-[64px]'
          }`}
        >
          {/* Left: Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2 text-ivory transition-opacity hover:opacity-90 shrink-0"
            aria-label="Trivoxa Group - Homepage"
          >
            {/* Smaller lockup on phones so logo + Menu + CTA fit inside the bar. */}
            <BrandLockup size={24} className="md:hidden" />
            <BrandLockup size={32} className="hidden md:inline-flex" />
          </Link>

          {/* Center: Desktop 3 Card Triggers */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {TRIVOXA_CARDNAV_ITEMS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={toggleMenu}
                aria-expanded={isExpanded}
                className={`group flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  isExpanded
                    ? 'bg-ivory/15 text-ivory'
                    : 'text-ivory/80 hover:bg-ivory/10 hover:text-ivory'
                }`}
              >
                <span>{item.label}</span>
                <svg
                  className={`size-3 text-bronze transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex md:hidden group items-center gap-2 rounded-full px-3 py-1.5 border border-bronze/30 bg-ivory-soft/10 text-ivory hover:bg-ivory-soft/20 transition-all cursor-pointer"
            >
              <span className="text-xs font-medium text-ivory">
                {isExpanded ? 'Close' : 'Menu'}
              </span>
              <div className="flex flex-col gap-1 w-3.5">
                <span
                  className={`block h-0.5 w-full bg-bronze transition-transform duration-300 ${
                    isExpanded ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-bronze transition-opacity duration-300 ${
                    isExpanded ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-bronze transition-transform duration-300 ${
                    isExpanded ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </div>
            </button>

            {/* Solid Ink "Request a quote" Button */}
            <Magnet magnetStrength={0.25} padding={25}>
              <Link
                href="/rfq"
                aria-label="Request a quote"
                data-cursor="target"
                className="inline-flex items-center justify-center rounded-full bg-ivory px-4 py-2 text-xs font-semibold text-espresso shadow-sm transition-all duration-200 hover:bg-ivory-soft hover:shadow-md active:scale-95 whitespace-nowrap"
              >
                <span className="sm:hidden">Quote</span>
                <span className="hidden sm:inline">Request a quote</span>
              </Link>
            </Magnet>
          </div>
        </div>

        {/* Expandable 3 Cards Container */}
        <div
          ref={cardsContainerRef}
          style={{ display: isExpanded ? 'grid' : 'none' }}
          className={`grid-cols-1 md:grid-cols-3 gap-3 p-3 md:p-4 border-t border-bronze/20 transition-opacity duration-300 max-h-[calc(100vh-100px)] overflow-y-auto ${
            isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden={!isExpanded}
        >
          {TRIVOXA_CARDNAV_ITEMS.map((item, idx) => (
            <div
              key={item.label}
              ref={(el) => {
                if (el) cardsRef.current[idx] = el;
              }}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
              className="flex flex-col justify-between rounded-xl p-4 md:p-5 shadow-lg min-h-[170px]"
            >
              <h3 className="text-sm font-semibold tracking-wide text-bronze pb-2 border-b border-espresso/10">
                {item.label}
              </h3>
              <ul className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
                {item.links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-label={link.ariaLabel}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={closeMenu}
                        onMouseEnter={handleLinkMouseEnter}
                        onMouseLeave={handleLinkMouseLeave}
                        className={`relative flex items-center justify-between text-sm font-medium transition-colors py-1 group ${
                          isActive ? 'text-bronze font-bold' : 'text-espresso hover:text-bronze'
                        }`}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="nav-underline absolute bottom-0 left-0 h-[1.5px] w-full bg-bronze origin-left scale-x-0" />
                        </span>
                        <GoArrowUpRight
                          className="nav-arrow-icon text-sm text-bronze transition-transform"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
}
