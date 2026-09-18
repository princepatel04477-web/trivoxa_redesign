import * as fs from 'fs';
import * as path from 'path';

/**
 * Next.js 16 static export on Windows has an issue where route segments in RSC
 * payload filenames (e.g. __next.rfq.__PAGE__.txt) are written as subdirectories
 * (e.g. rfq/__next.rfq/__PAGE__.txt) instead of a single dot-separated file.
 *
 * Cloudflare Pages serves files statically by their exact request path.
 * When client-side routing requests /rfq/__next.rfq.__PAGE__.txt, Cloudflare
 * returns 404 because the file is inside a directory.
 *
 * This script runs after `next build` and creates the exact dot-separated
 * flattened filenames expected by the Next.js client router.
 */

const outDir = path.resolve(__dirname, '../out');

function flattenRscFiles(dir: string, baseRouteDir: string = dir) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // If we entered a directory starting with __next.
      if (entry.name.startsWith('__next.')) {
        processNextDir(fullPath, baseRouteDir, entry.name);
      } else {
        // Recurse into route subdirectories
        flattenRscFiles(fullPath, fullPath);
      }
    }
  }
}

function processNextDir(nextDirPath: string, routeDir: string, nextPrefix: string) {
  function walk(currentDir: string, parts: string[]) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(currentDir, item.name);
      if (item.isDirectory()) {
        walk(itemPath, [...parts, item.name]);
      } else if (item.name === '__PAGE__.txt') {
        // Found a __PAGE__.txt inside a nested __next directory!
        // Construct the expected flattened filenames:
        
        // 1. Literal path joined by dots: e.g. __next.rfq.__PAGE__.txt
        const flatName1 = `${parts.join('.')}.${item.name}`;
        const targetPath1 = path.join(routeDir, flatName1);
        try {
          fs.copyFileSync(itemPath, targetPath1);
          console.log(`[fix-export] Created: ${path.relative(outDir, targetPath1)}`);
        } catch (e) {
          console.error(`[fix-export] Error copying to ${targetPath1}:`, e);
        }

        // 2. If parts contain '$d$slug', also create an alias using the actual folder name
        if (parts.includes('$d$slug')) {
          const folderSlug = path.basename(routeDir);
          const partsWithSlug = parts.map(p => p === '$d$slug' ? folderSlug : p);
          const flatName2 = `${partsWithSlug.join('.')}.${item.name}`;
          const targetPath2 = path.join(routeDir, flatName2);
          if (targetPath2 !== targetPath1) {
            try {
              fs.copyFileSync(itemPath, targetPath2);
              console.log(`[fix-export] Created slug alias: ${path.relative(outDir, targetPath2)}`);
            } catch (e) {
              console.error(`[fix-export] Error copying to ${targetPath2}:`, e);
            }
          }
        }
      }
    }
  }

  walk(nextDirPath, [nextPrefix]);
}

console.log('[fix-export] Checking and fixing RSC payload files in out/ ...');
flattenRscFiles(outDir);
console.log('[fix-export] Done fixing RSC payload files.');
