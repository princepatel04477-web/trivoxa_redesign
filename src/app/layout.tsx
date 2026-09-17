import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts.generated';
import { PerfTierProvider } from '@/lib/perf-tier';
import { GlobalCardNav } from '@/components/sections/global-cardnav';
import { SiteFooter } from '@/components/sections/site-footer';
import { LenisProvider } from '@/lib/motion/lenis-provider';
import { WebGLBudgetProvider } from '@/lib/motion/webgl-budget';
import { Preloader } from '@/components/motion/preloader';
import { BRAND } from '@/lib/tokens/colors';
import { JsonLd, organizationSchema, webSiteSchema } from '@/components/seo/json-ld';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://trivoxagroup.com'),
  title: {
    default: 'Trivoxa Group | International Trade & Business Group',
    template: '%s | Trivoxa Group',
  },
  description:
    'Trivoxa Group is an international trade and business group headquartered in Surat, Gujarat — product exports and service exports built on the manufacturing foundation of Shiveshwar Textiles.',
  applicationName: 'Trivoxa Group',
  authors: [{ name: 'Trivoxa Group' }],
  keywords: [
    'export company India',
    'product exports',
    'service exports',
    'sourcing from India',
    'Trivoxa Group',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Trivoxa Group',
    locale: 'en_IN',
    title: 'Trivoxa Group | International Trade & Business Group',
    description:
      'Product exports and professional services from India, built on the manufacturing foundation of Shiveshwar Textiles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trivoxa Group | International Trade & Business Group',
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: BRAND.espresso.hex,
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} data-surface="light" suppressHydrationWarning>
      <body className="surface-bg surface-fg antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={webSiteSchema()} />
        <PerfTierProvider>
          <WebGLBudgetProvider>
            <LenisProvider>
              <Preloader />
              <GlobalCardNav />
              <main id="main" className="isolate relative min-h-screen">
                {children}
              </main>
              <SiteFooter />
            </LenisProvider>
          </WebGLBudgetProvider>
        </PerfTierProvider>
      </body>
    </html>
  );
}
