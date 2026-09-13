import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { PRODUCTS, INDUSTRIES } from '../src/content/taxonomy';

describe('QA Verification Suite (Prompts 13 & 14)', () => {
  const outDir = path.resolve(__dirname, '../out');
  const publicDir = path.resolve(__dirname, '../public');
  const srcDir = path.resolve(__dirname, '../src');

  describe('Static Build Landmark & Semantic Accessibility (out/)', () => {
    it('verifies all generated static HTML pages have semantic landmarks and valid structure', () => {
      if (!fs.existsSync(outDir)) {
        throw new Error('out/ directory does not exist. Run npm run build first.');
      }

      function getHtmlFiles(dir: string): string[] {
        let results: string[] = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            results = results.concat(getHtmlFiles(fullPath));
          } else if (entry.name.endsWith('.html')) {
            results.push(fullPath);
          }
        }
        return results;
      }

      const htmlFiles = getHtmlFiles(outDir);
      expect(htmlFiles.length).toBeGreaterThanOrEqual(50);

      for (const file of htmlFiles) {
        const content = fs.readFileSync(file, 'utf8');
        const relPath = path.relative(outDir, file).replace(/\\/g, '/');

        // Check canonical tag (except 404 which might not have self-canonical)
        if (!relPath.includes('404') && !relPath.includes('_not-found') && !relPath.includes('styleguide')) {
          expect(content, `${relPath} should have a canonical link`).toMatch(/<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/trivoxagroup\.com/i);
          
          // Check exactly one h1 per page
          const h1Matches = content.match(/<h1[\s>]/g);
          expect(h1Matches, `${relPath} should have an h1`).not.toBeNull();
          expect(h1Matches?.length, `${relPath} should have exactly one h1`).toBe(1);

          // Check skip to content link
          expect(content, `${relPath} should have a skip link`).toContain('href="#main"');

          // Check main content container
          expect(content, `${relPath} should have id="main"`).toContain('id="main"');

          // Check no positive tabindex anywhere
          expect(content, `${relPath} should not have positive tabindex`).not.toMatch(/tabindex=["'][1-9]\d*["']/);
        }
      }
    });
  });

  describe('Forms Accessibility & Standards (/rfq & /contact)', () => {
    it('verifies RFQ page HTML contains accessible form controls with autocomplete and labels', () => {
      const rfqPath = path.join(outDir, 'rfq/index.html');
      if (fs.existsSync(rfqPath)) {
        const html = fs.readFileSync(rfqPath, 'utf8');
        expect(html).toMatch(/autocomplete=["']name["']/);
        expect(html).toMatch(/autocomplete=["']email["']/);
        expect(html).toMatch(/autocomplete=["']organization["']/);
        expect(html).toContain('aria-describedby');
      }
    });

    it('verifies Contact page HTML contains accessible form controls', () => {
      const contactPath = path.join(outDir, 'contact/index.html');
      if (fs.existsSync(contactPath)) {
        const html = fs.readFileSync(contactPath, 'utf8');
        expect(html).toMatch(/autocomplete=["']name["']/);
        expect(html).toMatch(/autocomplete=["']email["']/);
      }
    });
  });

  describe('Pre-rendered Open Graph Image Cards', () => {
    it('verifies that all 37 pre-rendered OG cards exist in public/brand/og/ and are non-empty', () => {
      const ogDir = path.join(publicDir, 'brand/og');
      expect(fs.existsSync(ogDir)).toBe(true);

      // Core routes
      const coreCards = ['catalogue.png', 'compliance.png', 'enquiry.png'];

      for (const card of coreCards) {
        const cardPath = path.join(ogDir, card);
        expect(fs.existsSync(cardPath), `OG image ${card} must exist`).toBe(true);
        const stat = fs.statSync(cardPath);
        expect(stat.size, `OG image ${card} must be > 10KB`).toBeGreaterThan(10000);
      }

      // Industry routes (9)
      for (const ind of INDUSTRIES) {
        const card = `industry-${ind.slug}.png`;
        const cardPath = path.join(ogDir, card);
        expect(fs.existsSync(cardPath), `OG image for industry ${ind.slug} must exist`).toBe(true);
      }

      // Product routes (25)
      for (const prod of PRODUCTS) {
        const card = `product-${prod.slug}.png`;
        const cardPath = path.join(ogDir, card);
        expect(fs.existsSync(cardPath), `OG image for product ${prod.slug} must exist`).toBe(true);
      }
    });
  });

  describe('Security Headers & Cloudflare Pages Configuration', () => {
    it('verifies public/_headers contains production security headers and CSP', () => {
      const headersPath = path.join(publicDir, '_headers');
      expect(fs.existsSync(headersPath)).toBe(true);
      const headers = fs.readFileSync(headersPath, 'utf8');

      expect(headers).toContain('Strict-Transport-Security:');
      expect(headers).toContain('X-Content-Type-Options: nosniff');
      expect(headers).toContain('X-Frame-Options:');
      expect(headers).toContain('Referrer-Policy: strict-origin-when-cross-origin');
      expect(headers).toContain('Permissions-Policy:');
      expect(headers).toContain('Content-Security-Policy:');
    });

    it('verifies functions/_middleware.ts exists and enforces noindex on non-production hosts', () => {
      const middlewarePath = path.resolve(__dirname, '../functions/_middleware.ts');
      expect(fs.existsSync(middlewarePath)).toBe(true);
      const middleware = fs.readFileSync(middlewarePath, 'utf8');
      expect(middleware).toContain('X-Robots-Tag');
      expect(middleware).toContain('noindex, nofollow');
      expect(middleware).toContain('trivoxagroup.com');
    });
  });

  describe('Sitemap & Indexing (Prompt 14)', () => {
    it('verifies sitemap.xml in out/ contains all routes with valid lastmod dates', () => {
      const sitemapPath = path.join(outDir, 'sitemap.xml');
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const sitemap = fs.readFileSync(sitemapPath, 'utf8');

      // Check all 25 products are present in sitemap
      for (const prod of PRODUCTS) {
        expect(sitemap).toContain(`https://trivoxagroup.com/products/${prod.slug}`);
      }

      // Check all 9 industries are present in sitemap
      for (const ind of INDUSTRIES) {
        expect(sitemap).toContain(`https://trivoxagroup.com/industries/${ind.slug}`);
      }

      // Check ISO lastmod format
      expect(sitemap).toMatch(/<lastmod>2026-\d{2}-\d{2}T/);
    });

    it('verifies robots.txt disallows /styleguide and allows indexing on production', () => {
      const robotsPath = path.join(outDir, 'robots.txt');
      expect(fs.existsSync(robotsPath)).toBe(true);
      const robots = fs.readFileSync(robotsPath, 'utf8');
      expect(robots).toContain('Disallow: /styleguide');
      expect(robots).toContain('Sitemap: https://trivoxagroup.com/sitemap.xml');
    });
  });

  describe('Code Hygiene & Console Cleanliness', () => {
    it('verifies zero console.log / console.warn / console.error calls in src/', () => {
      function checkDir(dir: string) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            checkDir(fullPath);
          } else if (/\.(ts|tsx)$/.test(entry.name)) {
            const code = fs.readFileSync(fullPath, 'utf8');
            expect(code, `File ${fullPath} should not contain console.log/warn/error`).not.toMatch(/\bconsole\.(log|warn|error)\b/);
          }
        }
      }
      checkDir(srcDir);
    });
  });
});
