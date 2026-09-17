'use client';

import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { animate } from '@/lib/motion/anime';
import { GoArrowUpRight } from 'react-icons/go';
import { BrandLockup } from '@/components/ui/brand-lockup';
import StarBorder from '@/components/reactbits/StarBorder/StarBorder';
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
    label: 'What We Export',
    bgColor: '#FAF8F3',
    textColor: '#241C18',
    links: [
      { label: 'Global Product Exports', href: '/businesses/product-exports', ariaLabel: 'Product Exports' },
      { label: 'Global Service Exports', href: '/businesses/service-exports', ariaLabel: 'Service Exports' },
      { label: 'All 9 Industries', href: '/industries', ariaLabel: 'Industries We Serve' },
    ],
  },
  {
    label: 'Who We Are',
    bgColor: '#F4EFE6',
    textColor: '#241C18',
    links: [
      { label: 'The Group', href: '/group', ariaLabel: 'About Trivoxa Group' },
      { label: 'Leadership', href: '/group#leadership', ariaLabel: 'Group Leadership' },
      { label: 'Shiveshwar Foundation', href: '/group#foundation', ariaLabel: 'Shiveshwar Foundation' },
      { label: 'Insights', href: '/insights', ariaLabel: 'Articles and Analysis' },
    ],
  },
  {
    label: 'Global Network',
    bgColor: '#EDE6D8',
    textColor: '#241C18',
    links: [
      { label: 'Global Presence', href: '/global-presence', ariaLabel: 'Global Operations Map' },
      { label: 'Compliance', href: '/compliance', ariaLabel: 'Certifications and Standards' },
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
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Close on route changes
  useEffect(() => {
    if (isExpanded) {
      toggleMenu();
    }
  }, [pathname]);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        toggleMenu();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        toggleMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Scroll listener for height compression, hide on fast scroll down, and scroll-progress hairline
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const currentY = window.scrollY;
        setIsScrolled(currentY > 120);

        // Fast downward scroll hides nav; scroll up shows nav
        if (currentY > 200 && self.direction === 1 && self.getVelocity() > 600) {
          setIsHidden(true);
        } else if (self.direction === -1) {
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
  }, []);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      return 520;
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: isScrolled ? 52 : 64, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 30, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.6,
      ease: 'trivoxa.out',
    });
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.5, ease: 'trivoxa.out', stagger: 0.08 },
      '-=0.3'
    );
    return tl;
  };

  useLayoutEffect(() => {
    tlRef.current = createTimeline();
    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, [isScrolled]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsExpanded(true);
      tl.play(0);
    } else {
      tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
      tl.reverse();
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
        className={`relative block w-full rounded-2xl border border-[#A88B68]/30 shadow-2xl transition-colors duration-300 backdrop-blur-xl ${
          isScrolled ? 'bg-[#241C18]/90' : 'bg-[#241C18]/80'
        }`}
      >
        {/* Scroll Progress Hairline at top edge of CardNav */}
        <div
          ref={progressBarRef}
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#A88B68] to-[#E3C8A0] origin-left scale-x-0"
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
            className="flex items-center gap-2 text-[#F4EFE6] transition-opacity hover:opacity-90"
            aria-label="Trivoxa Group - Homepage"
          >
            <BrandLockup size={32} />
          </Link>

          {/* Center: Hamburger Toggle */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Close navigation menu' : 'Open navigation menu'}
            className="group flex items-center gap-2.5 rounded-full px-4 py-1.5 border border-[#A88B68]/30 bg-[#FAF8F3]/10 text-[#F4EFE6] hover:bg-[#FAF8F3]/20 transition-all cursor-pointer"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F4EFE6]">
              {isExpanded ? 'Close' : 'Menu'}
            </span>
            <div className="flex flex-col gap-1 w-4">
              <span
                className={`block h-0.5 w-full bg-[#A88B68] transition-transform duration-300 ${
                  isExpanded ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-[#A88B68] transition-opacity duration-300 ${
                  isExpanded ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-[#A88B68] transition-transform duration-300 ${
                  isExpanded ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>

          {/* Right: RFQ CTA with Magnet and StarBorder */}
          <div className="hidden sm:block">
            <Magnet magnetStrength={0.25} padding={40}>
              <Link href="/rfq" aria-label="Request a Quote" data-cursor="target">
                <StarBorder
                  as="div"
                  color="#A88B68"
                  backgroundColor="#241C18"
                  textColor="#F4EFE6"
                  borderColor="rgba(168, 139, 104, 0.4)"
                  className="px-5 py-2 text-xs font-semibold tracking-wide uppercase"
                >
                  Request a Quote
                </StarBorder>
              </Link>
            </Magnet>
          </div>
        </div>

        {/* Expandable 3 Cards Container */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-3 md:p-4 border-t border-[#A88B68]/20 transition-opacity duration-300 ${
            isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none hidden'
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
              className="flex flex-col justify-between rounded-xl p-5 shadow-lg min-h-[160px]"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#A88B68] pb-2 border-b border-[#241C18]/10">
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
                        onMouseEnter={handleLinkMouseEnter}
                        onMouseLeave={handleLinkMouseLeave}
                        className={`relative flex items-center justify-between text-sm font-medium transition-colors py-1 group ${
                          isActive ? 'text-[#A88B68] font-bold' : 'text-[#241C18] hover:text-[#A88B68]'
                        }`}
                      >
                        <span className="relative">
                          {link.label}
                          <span className="nav-underline absolute bottom-0 left-0 h-[1.5px] w-full bg-[#A88B68] origin-left scale-x-0" />
                        </span>
                        <GoArrowUpRight
                          className="nav-arrow-icon text-sm text-[#A88B68] transition-transform"
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
