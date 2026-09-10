/**
 * src/lib/geo.ts — coordinates for the globe, the static map and the arcs.
 * One source, three renderers (static SVG, cobe canvas, R3F), so the tiers
 * cannot disagree about where anything is.
 */
import { REGIONS } from '@/content/taxonomy';

export type LatLng = { lat: number; lng: number };

/** Approximate visual anchors per canonical region. Rendering data, not claims. */
export const REGION_ANCHORS: Record<string, LatLng> = {
  europe: { lat: 50, lng: 15 },
  'middle-east': { lat: 25, lng: 45 },
  africa: { lat: 5, lng: 20 },
  'north-america': { lat: 40, lng: -100 },
  'south-america': { lat: -15, lng: -60 },
  'asia-pacific': { lat: -10, lng: 130 },
};

export const HQ: LatLng = { lat: 21.17, lng: 72.83 }; // Surat

export function regionAnchor(slug: string): LatLng {
  return REGION_ANCHORS[slug] ?? HQ;
}

export function regionsWithAnchors() {
  return REGIONS.map((region) => ({ region, anchor: regionAnchor(region.slug) }));
}

/** lat/lng → unit sphere. Shared by every renderer. */
export function latLngToVector3(lat: number, lng: number, radius = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

/**
 * A great-circle-ish arc lifted off the surface — the "trade corridor" visual.
 * Labelled honestly in the section heading (P9 honesty requirement, option a):
 * these are corridors we operate in, never live shipment tracking.
 */
export function arcPoints(from: LatLng, to: LatLng, segments = 48, lift = 0.28): [number, number, number][] {
  const a = latLngToVector3(from.lat, from.lng);
  const b = latLngToVector3(to.lat, to.lng);
  const points: [number, number, number][] = [];

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    // slerp on the sphere, then push outward by a sine bump
    const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const omega = Math.acos(dot);
    const sinOmega = Math.sin(omega) || 1;
    const ka = Math.sin((1 - t) * omega) / sinOmega;
    const kb = Math.sin(t * omega) / sinOmega;

    const x = a[0] * ka + b[0] * kb;
    const y = a[1] * ka + b[1] * kb;
    const z = a[2] * ka + b[2] * kb;

    const bump = 1 + Math.sin(t * Math.PI) * lift;
    points.push([x * bump, y * bump, z * bump]);
  }

  return points;
}
