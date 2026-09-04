/**
 * src/lib/three/eagle-points.ts — the eagle, as points.
 * ---------------------------------------------------------------------------
 * P6 requires the particle cloud be DERIVED from the logo mark, never
 * hand-placed. The mark is authored as flat polygons (see
 * src/lib/brand/wordmark-paths.ts), which means we can sample it exactly:
 * area-weighted allocation per polygon, rejection sampling inside each, with a
 * seeded RNG so every render — browser, poster, test — gets the same bird.
 *
 * Pure TypeScript, no DOM, no three. The browser scene and the build-time
 * poster generator both call into here, so the static fallback and the WebGL
 * scene are provably the same eagle.
 */
import { MARK_PATHS, MARK_VIEWBOX } from '@/lib/brand/wordmark-paths';
import { seededRandom } from '@/lib/utils';

export type Point2 = [number, number];
export type Polygon = Point2[];

/** Parse the mark's restricted path grammar (M / implicit L / Z) into polygons. */
export function markPolygons(): Polygon[] {
  return MARK_PATHS.map((d) => {
    const tokens = d.match(/[MLZ]|-?\d+(?:\.\d+)?/gi) ?? [];
    const polygon: Polygon = [];
    let index = 0;

    while (index < tokens.length) {
      const token = tokens[index] as string;
      if (/^[ML]$/i.test(token)) {
        index += 1;
        continue;
      }
      if (/^Z$/i.test(token)) {
        index += 1;
        continue;
      }
      const x = Number(token);
      const y = Number(tokens[index + 1]);
      polygon.push([x, y]);
      index += 2;
    }

    return polygon;
  }).filter((polygon) => polygon.length >= 3);
}

function polygonArea(polygon: Polygon): number {
  let sum = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const [x1, y1] = polygon[i] as Point2;
    const [x2, y2] = polygon[(i + 1) % polygon.length] as Point2;
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function pointInPolygon(polygon: Polygon, x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i] as Point2;
    const [xj, yj] = polygon[j] as Point2;
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function bbox(polygon: Polygon): { minX: number; minY: number; maxX: number; maxY: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of polygon) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

/** The mark's viewBox is 240²; centre the cloud on the origin in [-1, 1]. */
const VIEW = Number(MARK_VIEWBOX.split(' ')[2] ?? 240);

export type EagleCloud = {
  /** xyz, centred, in [-1, 1] with a slight z jitter for depth. */
  positions: Float32Array;
  /** 0 = ivory core, 1 = bronze fringe (~8% of particles). */
  tints: Float32Array;
  /** Pre-computed dispersed targets for the scroll dissolve. */
  dispersed: Float32Array;
  count: number;
};

/**
 * Sample `count` points across the mark, weighted by polygon area so the bird's
 * mass distribution is the logo's mass distribution.
 */
export function sampleEagle(count: number, seed = 7): EagleCloud {
  const random = seededRandom(seed);
  const polygons = markPolygons();
  const areas = polygons.map(polygonArea);
  const totalArea = areas.reduce((a, b) => a + b, 0);

  const positions = new Float32Array(count * 3);
  const tints = new Float32Array(count);
  const dispersed = new Float32Array(count * 3);

  // Allocate per polygon, then fix rounding by giving the remainder to the largest.
  const allocation = areas.map((area) => Math.floor((area / totalArea) * count));
  const assigned = allocation.reduce((a, b) => a + b, 0);
  const largest = areas.indexOf(Math.max(...areas));
  allocation[largest] = (allocation[largest] ?? 0) + (count - assigned);

  let cursor = 0;
  polygons.forEach((polygon, polygonIndex) => {
    const box = bbox(polygon);
    const n = allocation[polygonIndex] ?? 0;

    for (let i = 0; i < n; i += 1) {
      let x = 0;
      let y = 0;
      // Rejection sampling; the mark's polygons are convex-ish so this converges fast.
      for (let attempt = 0; attempt < 24; attempt += 1) {
        x = box.minX + random() * (box.maxX - box.minX);
        y = box.minY + random() * (box.maxY - box.minY);
        if (pointInPolygon(polygon, x, y)) break;
      }

      const slot = cursor + i;
      positions[slot * 3] = (x - VIEW / 2) / (VIEW / 2);
      positions[slot * 3 + 1] = -((y - VIEW / 2) / (VIEW / 2)); // SVG y-down → GL y-up
      positions[slot * 3 + 2] = (random() - 0.5) * 0.06;
      tints[slot] = random() < 0.08 ? 1 : 0; // bronze fringe, sparingly
    }

    cursor += n;
  });

  for (let i = 0; i < count; i += 1) {
    // Dispersed field: a hollow shell, so the dissolve reads as "scattering
    // outward" rather than "collapsing inward".
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 1.6 + random() * 1.1;
    dispersed[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    dispersed[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
    dispersed[i * 3 + 2] = radius * Math.cos(phi) * 0.5;
  }

  return { positions, tints, dispersed, count };
}

/** Particle counts per perf tier (docs/PERF-BUDGET.md). */
export const EAGLE_PARTICLES = {
  high: 80_000,
  medium: 25_000,
  low: 0, // poster image; no WebGL context is created at all
} as const;
