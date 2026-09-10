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
import horseData from './horse-intervals.generated.json';
import { seededRandom } from '@/lib/utils';

export type Point2 = [number, number];
export type Polygon = Point2[];

/** Legacy polygon export maintained for backwards compatibility. */
export function markPolygons(): Polygon[] {
  return [];
}

export type EagleCloud = {
  /** xyz, centred, in [-1, 1] with a slight z jitter for depth. */
  positions: Float32Array;
  /** 0 = ivory core, 1 = bronze fringe (~8% of particles). */
  tints: Float32Array;
  /** Pre-computed dispersed targets for the scroll dissolve. */
  dispersed: Float32Array;
  count: number;
};

type Interval = [number, number, number]; // y, xStart, xEnd

function buildCumulativeWeights(intervals: Interval[]) {
  const weights = new Float64Array(intervals.length);
  let total = 0;
  for (let i = 0; i < intervals.length; i += 1) {
    const [, x0, x1] = intervals[i]!;
    total += x1 - x0 + 1;
    weights[i] = total;
  }
  return { weights, total };
}

const coreData = buildCumulativeWeights(horseData.core as Interval[]);
const fringeData = buildCumulativeWeights(horseData.fringe as Interval[]);

function sampleFromIntervals(
  intervals: Interval[],
  weights: Float64Array,
  totalWeight: number,
  rng: () => number,
): [number, number] {
  const target = rng() * totalWeight;
  let low = 0;
  let high = intervals.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if ((weights[mid] ?? 0) < target) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  const [y, x0, x1] = intervals[low]!;
  const x = x0 + rng() * (x1 - x0);
  const jitterY = y + rng() - 0.5;
  return [x, jitterY];
}

/**
 * Sample `count` points across the horse head logo mark with ~8% bronze fringe.
 */
export function sampleEagle(count: number, seed = 7): EagleCloud {
  const rng = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  const tints = new Float32Array(count);
  const dispersed = new Float32Array(count * 3);

  const W = horseData.width;
  const H = horseData.height;
  const cx = W / 2;
  const cy = H / 2;
  const scale = 0.95 / (W / 2);

  // Exact ~8% bronze fringe
  const fringeCount = Math.round(count * 0.08);

  for (let i = 0; i < count; i += 1) {
    const isFringe = i < fringeCount;
    const [x, y] = isFringe
      ? sampleFromIntervals(horseData.fringe as Interval[], fringeData.weights, fringeData.total, rng)
      : sampleFromIntervals(horseData.core as Interval[], coreData.weights, coreData.total, rng);

    positions[i * 3] = (x - cx) * scale;
    positions[i * 3 + 1] = -(y - cy) * scale; // invert Y for WebGL coordinates
    positions[i * 3 + 2] = (rng() - 0.5) * 0.06;
    tints[i] = isFringe ? 1 : 0;
  }

  // Dispersed field for scroll dissolve
  for (let i = 0; i < count; i += 1) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const radius = 1.6 + rng() * 1.1;
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
