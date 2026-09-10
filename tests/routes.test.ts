/**
 * The orphan-link gate.
 *
 * The July 2026 audit found navigation entries pointing at pages that did not
 * exist and industry rails linking to slugs with no products behind them. A
 * reviewer finds those by clicking; this test finds them by reading every
 * `href="/…"` in the source and matching it against the routes that actually
 * exist in src/app, resolving dynamic segments against the canonical taxonomy.
 *
 * It is deliberately strict: a link to a page we have not built yet fails the
 * build, which is the only way a sitemap and a navigation stop drifting apart.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { INDUSTRIES } from '@/content/taxonomy';
import { LEGAL_DOCUMENTS } from '@/content/legal';
import { navHrefs } from '@/lib/nav';

const ROOT = process.cwd();
const APP = path.join(ROOT, 'src', 'app');

/** Every route that has a page.tsx, with dynamic segments left as ":param". */
function collectRoutes(dir: string, prefix = ''): string[] {
  const routes: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    // /api has no page.tsx; /styleguide does exist as a route (dev-gated in its
    // own page file), so it counts for link resolution — links to it must not
    // 404 in development, where it is used.
    if (entry.name === 'api' && prefix === '') continue;

    const segment = entry.name.startsWith('[') && entry.name.endsWith(']')
      ? `:${entry.name.slice(1, -1)}`
      : entry.name;
    const routePath = `${prefix}/${segment}`;

    if (fs.existsSync(path.join(dir, entry.name, 'page.tsx'))) routes.push(routePath);
    routes.push(...collectRoutes(path.join(dir, entry.name), routePath));
  }

  if (fs.existsSync(path.join(dir, 'page.tsx')) && prefix === '') routes.push('/');

  return routes;
}

/** Values a dynamic segment is allowed to take, from the canonical data. */
const PARAM_VALUES: Record<string, string[]> = {
  slug: [...INDUSTRIES.map((industry) => industry.slug), ...Object.keys(LEGAL_DOCUMENTS)],
};

function matches(route: string, href: string): boolean {
  const routeParts = route.split('/').filter(Boolean);
  const hrefParts = href.split('/').filter(Boolean);
  if (routeParts.length !== hrefParts.length) return false;

  return routeParts.every((part, index) => {
    const value = hrefParts[index] as string;
    if (!part.startsWith(':')) return part === value;
    const allowed = PARAM_VALUES[part.slice(1)] ?? [];
    return allowed.includes(value);
  });
}

type Found = { href: string; file: string; template: boolean };

/**
 * Every internal href in src/. Two kinds:
 *  · static literals — `href="/compliance"`;
 *  · template prefixes — `href={`/industries/${industry.slug}`}`, captured up to
 *    the interpolation. A prefix is validated as "leads to a real route" rather
 *    than as an exact path, and it counts as a reference for reachability.
 */
function collectHrefs(): Found[] {
  const found: Found[] = [];
  const pattern = /href=\{?[`"'](\/[^`"'?#]*?)(\$\{|[`"'])/g;

  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) continue;

      const source = fs.readFileSync(full, 'utf8');
      for (const match of source.matchAll(pattern)) {
        const href = match[1];
        if (!href) continue;
        found.push({ href, file: path.relative(ROOT, full), template: match[2] === '${' });
      }
    }
  };

  walk(path.join(ROOT, 'src'));
  return found;
}

/** Does this href prefix lead to a real route (exact, or a parent of one)? */
function prefixLeadsToRoute(prefix: string, routes: string[]): boolean {
  return routes.some((route) => route === prefix || route.startsWith(`${prefix}/`) || `${route}/`.startsWith(prefix));
}

/** Every `id="…"` declared anywhere in src — the anchor targets. */
function collectIds(): Set<string> {
  const ids = new Set<string>();
  const pattern = /\bid=["']([a-z0-9-]+)["']/g;

  const walk = (dir: string): void => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.tsx')) continue;
      for (const match of fs.readFileSync(full, 'utf8').matchAll(pattern)) {
        if (match[1]) ids.add(match[1]);
      }
    }
  };

  walk(path.join(ROOT, 'src'));
  return ids;
}

const strip = (href: string): string => href.split('?')[0]?.split('#')[0] ?? href;
const fragmentOf = (href: string): string | null => {
  const index = href.indexOf('#');
  return index === -1 ? null : href.slice(index + 1);
};

describe('no orphan links', () => {
  const routes = collectRoutes(APP);
  const hrefs = collectHrefs();
  const nav = navHrefs();
  const ids = collectIds();

  it('finds the routes it is supposed to find', () => {
    expect(routes).toContain('/');
    expect(routes).toContain('/businesses/product-exports');
    expect(routes).toContain('/industries/:slug');
    expect(routes).toContain('/legal/:slug');
    expect(routes).toContain('/compliance');
  });

  it('resolves every internal href in the source to a real route', () => {
    const orphans = hrefs
      .filter(({ href, template }) =>
        template
          ? !prefixLeadsToRoute(href, routes)
          : !routes.some((route) => matches(route, href)),
      )
      .map(({ href, file }) => `${href}  (${file})`);

    expect(orphans, `Orphan links:\n${orphans.join('\n')}`).toEqual([]);
  });

  it('resolves every navigation entry to a real route', () => {
    const orphans = nav
      .map(strip)
      .filter((href) => href.length > 0)
      .filter((href) => !routes.some((route) => matches(route, href)));
    expect(orphans, `Orphan nav links:\n${orphans.join('\n')}`).toEqual([]);
  });

  it('resolves every anchor to an id that exists on some page', () => {
    const anchored = [...hrefs.map((entry) => entry.href), ...nav];
    const missing = anchored
      .map((href) => ({ href, fragment: fragmentOf(href) }))
      .filter((entry): entry is { href: string; fragment: string } => Boolean(entry.fragment))
      .filter((entry) => !ids.has(entry.fragment))
      .map((entry) => `${entry.href}  (#${entry.fragment} is not declared anywhere in src/)`);

    expect(missing, `Dangling anchors:\n${missing.join('\n')}`).toEqual([]);
  });

  it('links every industry page from somewhere in the source', () => {
    // A page that nothing links to is a page a buyer cannot reach.
    for (const industry of INDUSTRIES) {
      const href = `/industries/${industry.slug}`;
      const referenced =
        hrefs.some((entry) => entry.href === href) ||
        hrefs.some((entry) => entry.template && href.startsWith(entry.href)) ||
        nav.includes(href);
      expect(referenced, `${href} is not linked from any source file`).toBe(true);
    }
  });

  it('links every legal document from the footer or compliance page', () => {
    for (const slug of Object.keys(LEGAL_DOCUMENTS)) {
      const href = `/legal/${slug}`;
      const referenced =
        hrefs.some((entry) => entry.href === href) ||
        hrefs.some((entry) => entry.template && href.startsWith(entry.href));
      expect(referenced, `${href} is not linked from any source file`).toBe(true);
    }
  });
});
