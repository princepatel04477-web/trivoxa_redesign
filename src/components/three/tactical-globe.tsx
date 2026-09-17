'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  startTransition,
  type FC,
} from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/* ========================================================================== */
/* Country Data — ISO numeric → [ISO3, name]                                  */
/* ========================================================================== */
const CD: Record<string, [string, string]> = {
  '004': ['AFG', 'Afghanistan'],
  '008': ['ALB', 'Albania'],
  '012': ['DZA', 'Algeria'],
  '024': ['AGO', 'Angola'],
  '032': ['ARG', 'Argentina'],
  '036': ['AUS', 'Australia'],
  '040': ['AUT', 'Austria'],
  '031': ['AZE', 'Azerbaijan'],
  '050': ['BGD', 'Bangladesh'],
  '056': ['BEL', 'Belgium'],
  '204': ['BEN', 'Benin'],
  '064': ['BTN', 'Bhutan'],
  '068': ['BOL', 'Bolivia'],
  '070': ['BIH', 'Bosnia and Herz.'],
  '072': ['BWA', 'Botswana'],
  '076': ['BRA', 'Brazil'],
  '096': ['BRN', 'Brunei'],
  '100': ['BGR', 'Bulgaria'],
  '854': ['BFA', 'Burkina Faso'],
  '108': ['BDI', 'Burundi'],
  '116': ['KHM', 'Cambodia'],
  '120': ['CMR', 'Cameroon'],
  '124': ['CAN', 'Canada'],
  '140': ['CAF', 'Central African Rep.'],
  '148': ['TCD', 'Chad'],
  '152': ['CHL', 'Chile'],
  '156': ['CHN', 'China'],
  '170': ['COL', 'Colombia'],
  '178': ['COG', 'Congo'],
  '180': ['COD', 'Dem. Rep. Congo'],
  '188': ['CRI', 'Costa Rica'],
  '384': ['CIV', "Côte d'Ivoire"],
  '191': ['HRV', 'Croatia'],
  '192': ['CUB', 'Cuba'],
  '196': ['CYP', 'Cyprus'],
  '203': ['CZE', 'Czechia'],
  '208': ['DNK', 'Denmark'],
  '262': ['DJI', 'Djibouti'],
  '214': ['DOM', 'Dominican Rep.'],
  '218': ['ECU', 'Ecuador'],
  '818': ['EGY', 'Egypt'],
  '222': ['SLV', 'El Salvador'],
  '226': ['GNQ', 'Eq. Guinea'],
  '232': ['ERI', 'Eritrea'],
  '233': ['EST', 'Estonia'],
  '748': ['SWZ', 'Eswatini'],
  '231': ['ETH', 'Ethiopia'],
  '242': ['FJI', 'Fiji'],
  '246': ['FIN', 'Finland'],
  '250': ['FRA', 'France'],
  '266': ['GAB', 'Gabon'],
  '270': ['GMB', 'Gambia'],
  '268': ['GEO', 'Georgia'],
  '276': ['DEU', 'Germany'],
  '288': ['GHA', 'Ghana'],
  '300': ['GRC', 'Greece'],
  '304': ['GRL', 'Greenland'],
  '320': ['GTM', 'Guatemala'],
  '324': ['GIN', 'Guinea'],
  '624': ['GNB', 'Guinea-Bissau'],
  '328': ['GUY', 'Guyana'],
  '332': ['HTI', 'Haiti'],
  '340': ['HND', 'Honduras'],
  '348': ['HUN', 'Hungary'],
  '352': ['ISL', 'Iceland'],
  '356': ['IND', 'India'],
  '360': ['IDN', 'Indonesia'],
  '364': ['IRN', 'Iran'],
  '368': ['IRQ', 'Iraq'],
  '372': ['IRL', 'Ireland'],
  '376': ['ISR', 'Israel'],
  '380': ['ITA', 'Italy'],
  '388': ['JAM', 'Jamaica'],
  '392': ['JPN', 'Japan'],
  '400': ['JOR', 'Jordan'],
  '398': ['KAZ', 'Kazakhstan'],
  '404': ['KEN', 'Kenya'],
  '408': ['PRK', 'North Korea'],
  '410': ['KOR', 'South Korea'],
  '414': ['KWT', 'Kuwait'],
  '417': ['KGZ', 'Kyrgyzstan'],
  '418': ['LAO', 'Laos'],
  '428': ['LVA', 'Latvia'],
  '422': ['LBN', 'Lebanon'],
  '426': ['LSO', 'Lesotho'],
  '430': ['LBR', 'Liberia'],
  '434': ['LBY', 'Libya'],
  '440': ['LTU', 'Lithuania'],
  '442': ['LUX', 'Luxembourg'],
  '450': ['MDG', 'Madagascar'],
  '454': ['MWI', 'Malawi'],
  '458': ['MYS', 'Malaysia'],
  '466': ['MLI', 'Mali'],
  '478': ['MRT', 'Mauritania'],
  '484': ['MEX', 'Mexico'],
  '498': ['MDA', 'Moldova'],
  '496': ['MNG', 'Mongolia'],
  '499': ['MNE', 'Montenegro'],
  '504': ['MAR', 'Morocco'],
  '508': ['MOZ', 'Mozambique'],
  '104': ['MMR', 'Myanmar'],
  '516': ['NAM', 'Namibia'],
  '524': ['NPL', 'Nepal'],
  '528': ['NLD', 'Netherlands'],
  '554': ['NZL', 'New Zealand'],
  '558': ['NIC', 'Nicaragua'],
  '562': ['NER', 'Niger'],
  '566': ['NGA', 'Nigeria'],
  '578': ['NOR', 'Norway'],
  '512': ['OMN', 'Oman'],
  '586': ['PAK', 'Pakistan'],
  '591': ['PAN', 'Panama'],
  '598': ['PNG', 'Papua New Guinea'],
  '600': ['PRY', 'Paraguay'],
  '604': ['PER', 'Peru'],
  '608': ['PHL', 'Philippines'],
  '616': ['POL', 'Poland'],
  '620': ['PRT', 'Portugal'],
  '634': ['QAT', 'Qatar'],
  '642': ['ROU', 'Romania'],
  '643': ['RUS', 'Russia'],
  '646': ['RWA', 'Rwanda'],
  '682': ['SAU', 'Saudi Arabia'],
  '686': ['SEN', 'Senegal'],
  '688': ['SRB', 'Serbia'],
  '694': ['SLE', 'Sierra Leone'],
  '702': ['SGP', 'Singapore'],
  '703': ['SVK', 'Slovakia'],
  '705': ['SVN', 'Slovenia'],
  '706': ['SOM', 'Somalia'],
  '710': ['ZAF', 'South Africa'],
  '728': ['SSD', 'South Sudan'],
  '724': ['ESP', 'Spain'],
  '144': ['LKA', 'Sri Lanka'],
  '729': ['SDN', 'Sudan'],
  '740': ['SUR', 'Suriname'],
  '752': ['SWE', 'Sweden'],
  '756': ['CHE', 'Switzerland'],
  '760': ['SYR', 'Syria'],
  '158': ['TWN', 'Taiwan'],
  '762': ['TJK', 'Tajikistan'],
  '834': ['TZA', 'Tanzania'],
  '764': ['THA', 'Thailand'],
  '626': ['TLS', 'Timor-Leste'],
  '768': ['TGO', 'Togo'],
  '780': ['TTO', 'Trinidad and Tobago'],
  '788': ['TUN', 'Tunisia'],
  '792': ['TUR', 'Turkey'],
  '795': ['TKM', 'Turkmenistan'],
  '800': ['UGA', 'Uganda'],
  '804': ['UKR', 'Ukraine'],
  '784': ['ARE', 'UAE'],
  '826': ['GBR', 'United Kingdom'],
  '840': ['USA', 'United States'],
  '858': ['URY', 'Uruguay'],
  '860': ['UZB', 'Uzbekistan'],
  '862': ['VEN', 'Venezuela'],
  '704': ['VNM', 'Vietnam'],
  '887': ['YEM', 'Yemen'],
  '894': ['ZMB', 'Zambia'],
  '716': ['ZWE', 'Zimbabwe'],
  '275': ['PSE', 'Palestine'],
  '807': ['MKD', 'North Macedonia'],
  '051': ['ARM', 'Armenia'],
  '112': ['BLR', 'Belarus'],
  '174': ['COM', 'Comoros'],
  '084': ['BLZ', 'Belize'],
  '090': ['SLB', 'Solomon Islands'],
  '540': ['NCL', 'New Caledonia'],
  '548': ['VUT', 'Vanuatu'],
  '010': ['ATA', 'Antarctica'],
  '-99': ['XKX', 'Kosovo'],
};

/* ========================================================================== */
/* 3D Sphere Math                                                             */
/* ========================================================================== */
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

interface ProjectedPoint {
  sx: number;
  sy: number;
  rx: number;
  ry: number;
  rz: number;
  v: boolean;
}

function project(
  lng: number,
  lat: number,
  lambda: number,
  phi: number,
  gamma: number,
  R: number,
  cx: number,
  cy: number
): ProjectedPoint {
  const lr = (lng - lambda) * D2R;
  const la = lat * D2R;
  const cl = Math.cos(la);

  const x0 = cl * Math.cos(lr);
  const y0 = cl * Math.sin(lr);
  const z0 = Math.sin(la);

  const cp = Math.cos(phi * D2R);
  const sp = Math.sin(phi * D2R);
  const x1 = x0 * cp + z0 * sp;
  const y1 = y0;
  const z1 = -x0 * sp + z0 * cp;

  const cg = Math.cos(gamma * D2R);
  const sg = Math.sin(gamma * D2R);
  const rx = x1;
  const ry = y1 * cg - z1 * sg;
  const rz = y1 * sg + z1 * cg;

  return { sx: cx + R * ry, sy: cy - R * rz, rx, ry, rz, v: rx >= 0 };
}

function unproject(
  px: number,
  py: number,
  lambda: number,
  phi: number,
  gamma: number,
  R: number,
  cx: number,
  cy: number
): { lng: number; lat: number } | null {
  const Ry = (px - cx) / R;
  const Rz = -(py - cy) / R;
  const r2 = Ry * Ry + Rz * Rz;
  if (r2 > 1) return null;

  const cg = Math.cos(gamma * D2R);
  const sg = Math.sin(gamma * D2R);
  const y1 = Ry * cg + Rz * sg;
  const z1 = -Ry * sg + Rz * cg;

  const x1 = Math.sqrt(Math.max(0, 1 - r2));

  const cp = Math.cos(phi * D2R);
  const sp = Math.sin(phi * D2R);
  const x0 = x1 * cp - z1 * sp;
  const y0 = y1;
  const z0 = x1 * sp + z1 * cp;

  const lat = Math.asin(clamp(z0, -1, 1)) * R2D;
  let lng = Math.atan2(y0, x0) * R2D + lambda;
  lng = (((lng + 180) % 360) + 360) % 360 - 180;
  return { lng, lat };
}

function limbIntersect(
  a: ProjectedPoint,
  b: ProjectedPoint,
  R: number,
  cx: number,
  cy: number
): ProjectedPoint | null {
  const dr = a.rx - b.rx;
  if (Math.abs(dr) < 1e-12) return null;
  const t = a.rx / dr;
  if (t < 0 || t > 1) return null;
  let ry = a.ry + t * (b.ry - a.ry);
  let rz = a.rz + t * (b.rz - a.rz);
  const norm = Math.sqrt(ry * ry + rz * rz);
  if (norm < 1e-9) return null;
  ry /= norm;
  rz /= norm;
  return { sx: cx + R * ry, sy: cy - R * rz, rx: 0, ry, rz, v: true };
}

function ringToSegments(
  ring: [number, number][],
  lambda: number,
  phi: number,
  gamma: number,
  R: number,
  cx: number,
  cy: number
): ProjectedPoint[][] {
  const n = ring.length;
  if (n < 3) return [];
  const proj: ProjectedPoint[] = new Array(n);
  let visCount = 0;

  for (let i = 0; i < n; i++) {
    const p = ring[i];
    if (!p) continue;
    const pt = project(p[0], p[1], lambda, phi, gamma, R, cx, cy);
    proj[i] = pt;
    if (pt.v) visCount++;
  }
  if (visCount === 0) return [];
  if (visCount === n) return [proj.slice()];

  let startIdx = -1;
  for (let i = 0; i < n; i++) {
    const curPt = proj[i];
    const nextPt = proj[(i + 1) % n];
    if (curPt && nextPt && !curPt.v && nextPt.v) {
      startIdx = i;
      break;
    }
  }

  if (startIdx === -1) return [proj.slice()];

  const segments: ProjectedPoint[][] = [];
  let cur: ProjectedPoint[] = [];

  for (let k = 0; k < n; k++) {
    const i = (startIdx + k) % n;
    const j = (startIdx + k + 1) % n;
    const A = proj[i];
    const B = proj[j];
    if (!A || !B) continue;

    if (A.v && B.v) {
      cur.push(B);
    } else if (A.v && !B.v) {
      const inter = limbIntersect(A, B, R, cx, cy);
      if (inter) cur.push(inter);
      if (cur.length >= 2) segments.push(cur);
      cur = [];
    } else if (!A.v && B.v) {
      const inter = limbIntersect(A, B, R, cx, cy);
      if (inter) cur.push(inter);
      cur.push(B);
    }
  }

  return segments;
}

function segmentsToPath(segs: ProjectedPoint[][]): string {
  if (segs.length === 0) return '';
  let out = '';
  for (const seg of segs) {
    for (let i = 0; i < seg.length; i++) {
      const p = seg[i];
      if (!p) continue;
      out += (i === 0 ? 'M' : 'L') + p.sx.toFixed(1) + ',' + p.sy.toFixed(1);
    }
    out += 'Z';
  }
  return out;
}

function buildSphericalPath(
  type: string,
  coords: unknown,
  lambda: number,
  phi: number,
  gamma: number,
  R: number,
  cx: number,
  cy: number
): string {
  if (!coords) return '';
  if (type === 'Polygon') {
    let out = '';
    for (const ring of coords as [number, number][][]) {
      out += segmentsToPath(ringToSegments(ring, lambda, phi, gamma, R, cx, cy));
    }
    return out;
  }
  if (type === 'MultiPolygon') {
    let out = '';
    for (const poly of coords as [number, number][][][]) {
      for (const ring of poly) {
        out += segmentsToPath(ringToSegments(ring, lambda, phi, gamma, R, cx, cy));
      }
    }
    return out;
  }
  return '';
}

/* ========================================================================== */
/* TopoJSON Decoder                                                           */
/* ========================================================================== */
interface TopoJSONTopology {
  transform?: { scale: [number, number]; translate: [number, number] };
  arcs: [number, number][][];
  objects: {
    countries?: {
      geometries: {
        id?: string | number;
        type: string;
        arcs: unknown;
      }[];
    };
  };
}

function decArcs(t: TopoJSONTopology): [number, number][][] {
  const tf = t.transform;
  if (!tf) return t.arcs;
  const sx = tf.scale[0],
    sy = tf.scale[1],
    dx = tf.translate[0],
    dy = tf.translate[1];
  return t.arcs.map((a) => {
    let x = 0,
      y = 0;
    return a.map((p) => {
      x += p[0];
      y += p[1];
      return [x * sx + dx, y * sy + dy];
    });
  });
}

function resolveRing(idx: number[], arcs: [number, number][][]): [number, number][] {
  const out: [number, number][] = [];
  for (const i of idx) {
    const raw = i >= 0 ? arcs[i] : arcs[~i]?.slice().reverse();
    const a = raw ?? [];
    for (let j = out.length > 0 ? 1 : 0; j < a.length; j++) {
      const pt = a[j];
      if (pt) out.push(pt);
    }
  }
  return out;
}

interface RawFeature {
  id: string;
  type: string;
  coords: unknown;
}

function extractFeatures(t: TopoJSONTopology): RawFeature[] {
  const arcs = decArcs(t);
  const gs = t.objects.countries?.geometries;
  if (!gs) return [];
  return gs.map((g) => {
    let c: unknown = null;
    if (g.type === 'Polygon') {
      c = (g.arcs as number[][]).map((r) => resolveRing(r, arcs));
    } else if (g.type === 'MultiPolygon') {
      c = (g.arcs as number[][][]).map((p) => p.map((r) => resolveRing(r, arcs)));
    }
    return { id: String(g.id ?? ''), type: g.type, coords: c };
  });
}

/* ========================================================================== */
/* Hover hit-test (point-in-polygon over lng/lat)                             */
/* ========================================================================== */
function pointInRing(x: number, y: number, ring: [number, number][]): boolean {
  let inside = false;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const pi = ring[i];
    const pj = ring[j];
    if (!pi || !pj) continue;
    const xi = pi[0],
      yi = pi[1];
    const xj = pj[0],
      yj = pj[1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

interface CountryRecord {
  id: string;
  name: string;
  type: string;
  coords: unknown;
  rings: [number, number][][];
  bbox: { minLng: number; maxLng: number; minLat: number; maxLat: number };
}

function findCountryAt(
  lng: number,
  lat: number,
  index: CountryRecord[]
): CountryRecord | null {
  for (const c of index) {
    if (
      lng < c.bbox.minLng ||
      lng > c.bbox.maxLng ||
      lat < c.bbox.minLat ||
      lat > c.bbox.maxLat
    ) {
      continue;
    }
    let inside = false;
    for (const ring of c.rings) {
      if (pointInRing(lng, lat, ring)) inside = !inside;
    }
    if (inside) return c;
  }
  return null;
}

/* ========================================================================== */
/* Utilities                                                                  */
/* ========================================================================== */
function rgba(c: string, a: number): string {
  if (typeof c !== 'string' || !c) return `rgba(0,0,0,${a})`;
  const s = c.trim();
  if (s.indexOf('rgb') === 0) {
    const m = s.match(/-?[\d.]+/g);
    if (m && m.length >= 3) {
      return `rgba(${m[0]},${m[1]},${m[2]},${a})`;
    }
    return `rgba(0,0,0,${a})`;
  }
  if (s.indexOf('hsl') === 0) {
    const m = s.match(/-?[\d.]+/g);
    if (m && m.length >= 3) {
      return `hsla(${m[0]},${m[1]}%,${m[2]}%,${a})`;
    }
    return `rgba(0,0,0,${a})`;
  }
  const h = s.replace('#', '');
  if (h.length !== 3 && h.length !== 6 && h.length !== 8) {
    return `rgba(0,0,0,${a})`;
  }
  const f =
    h.length === 3
      ? h
          .split('')
          .map((x) => x + x)
          .join('')
      : h.slice(0, 6);
  return `rgba(${parseInt(f.slice(0, 2), 16)},${parseInt(f.slice(2, 4), 16)},${parseInt(f.slice(4, 6), 16)},${a})`;
}

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 1831565813) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGraticule(
  lambda: number,
  phi: number,
  gamma: number,
  R: number,
  cx: number,
  cy: number
): string {
  let out = '';
  for (let lat = -60; lat <= 60; lat += 30) {
    let started = false;
    let prev: ProjectedPoint | null = null;
    for (let lng = -180; lng <= 180; lng += 4) {
      const p = project(lng, lat, lambda, phi, gamma, R, cx, cy);
      if (p.v) {
        if (!started || (prev && !prev.v)) {
          out += 'M' + p.sx.toFixed(1) + ',' + p.sy.toFixed(1);
          started = true;
        } else {
          out += 'L' + p.sx.toFixed(1) + ',' + p.sy.toFixed(1);
        }
      }
      prev = p;
    }
  }

  for (let lng = -180; lng < 180; lng += 30) {
    let started = false;
    let prev: ProjectedPoint | null = null;
    for (let lat = -80; lat <= 80; lat += 4) {
      const p = project(lng, lat, lambda, phi, gamma, R, cx, cy);
      if (p.v) {
        if (!started || (prev && !prev.v)) {
          out += 'M' + p.sx.toFixed(1) + ',' + p.sy.toFixed(1);
          started = true;
        } else {
          out += 'L' + p.sx.toFixed(1) + ',' + p.sy.toFixed(1);
        }
      }
      prev = p;
    }
  }
  return out;
}

/* ========================================================================== */
/* Types & Defaults                                                           */
/* ========================================================================== */
export interface GlobeMarker {
  label: string;
  description?: string;
  latitude: number;
  longitude: number;
  color?: string;
}

export interface TacticalGlobeProps {
  className?: string;
  markers?: GlobeMarker[];
  countries?: { code: string; name: string; enabled: boolean }[];
  mapStyle?: {
    oceanColor?: string;
    landFill?: string;
    landStroke?: string;
    strokeWidth?: number;
    hoverColor?: string;
    disabledColor?: string;
  };
  tooltip?: {
    show?: boolean;
    background?: string;
    textColor?: string;
    borderColor?: string;
  };
  grid?: {
    show?: boolean;
    color?: string;
    opacity?: number;
  };
  layout?: {
    cornerRadius?: number;
    padding?: number;
    showBorder?: boolean;
    borderColor?: string;
  };
  interaction?: {
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    enableDrag?: boolean;
    dragSensitivity?: number;
    glowColor?: string;
    glowIntensity?: number;
    showStars?: boolean;
    showLabels?: boolean;
  };
}

export const DEFAULT_TRIVOXA_MARKERS: GlobeMarker[] = [
  {
    label: 'Surat (HQ)',
    description: 'Trivoxa Group Central Headquarters & Export Desk',
    latitude: 21.17,
    longitude: 72.83,
    color: '#D4AF37',
  },
  {
    label: 'Mundra Port',
    description: 'Primary Container & Bulk Outbound Terminal (INMUN)',
    latitude: 22.84,
    longitude: 69.7,
    color: '#C49A6C',
  },
  {
    label: 'Nhava Sheva',
    description: 'JNPT Outbound Freight & Formulation Corridor (INNSA)',
    latitude: 18.95,
    longitude: 72.95,
    color: '#C49A6C',
  },
  {
    label: 'Europe (Rotterdam)',
    description: 'European Main Port • REACH-Compliant Inbound',
    latitude: 51.92,
    longitude: 4.48,
    color: '#C49A6C',
  },
  {
    label: 'Middle East (Jebel Ali)',
    description: 'Gulf Distribution Hub (AEJEA)',
    latitude: 25.01,
    longitude: 55.06,
    color: '#C49A6C',
  },
  {
    label: 'East Africa (Mombasa)',
    description: 'East African Trade Corridor Gateway',
    latitude: -4.04,
    longitude: 39.67,
    color: '#C49A6C',
  },
  {
    label: 'North America (New York)',
    description: 'US Retail & Wholesale Distribution Hub',
    latitude: 40.71,
    longitude: -74.01,
    color: '#C49A6C',
  },
  {
    label: 'South America (Santos)',
    description: 'Mercosur Regional Trade Terminal',
    latitude: -23.96,
    longitude: -46.33,
    color: '#C49A6C',
  },
  {
    label: 'Asia-Pacific (Singapore)',
    description: 'ASEAN & Pacific Rim Transshipment Center',
    latitude: 1.35,
    longitude: 103.82,
    color: '#C49A6C',
  },
];

/* ========================================================================== */
/* Main Component                                                             */
/* ========================================================================== */
export const TacticalGlobe: FC<TacticalGlobeProps> = ({
  className,
  markers = DEFAULT_TRIVOXA_MARKERS,
  countries = [],
  mapStyle: userMapStyle,
  tooltip: userTooltip,
  grid: userGrid,
  layout: userLayout,
  interaction: userInteraction,
}) => {
  const reduced = usePrefersReducedMotion();

  const mapStyle = useMemo(
    () => ({
      oceanColor: userMapStyle?.oceanColor ?? '#171210',
      landFill: userMapStyle?.landFill ?? '#261e1a',
      landStroke: userMapStyle?.landStroke ?? '#3d302a',
      strokeWidth: userMapStyle?.strokeWidth ?? 0.5,
      hoverColor: userMapStyle?.hoverColor ?? '#A88B68',
      disabledColor: userMapStyle?.disabledColor ?? '#1c1613',
    }),
    [userMapStyle]
  );

  const tooltip = useMemo(
    () => ({
      show: userTooltip?.show ?? true,
      background: userTooltip?.background ?? 'rgba(23, 18, 16, 0.94)',
      textColor: userTooltip?.textColor ?? '#F4EFE6',
      borderColor: userTooltip?.borderColor ?? 'rgba(168, 139, 104, 0.35)',
    }),
    [userTooltip]
  );

  const grid = useMemo(
    () => ({
      show: userGrid?.show ?? true,
      color: userGrid?.color ?? '#57463C',
      opacity: userGrid?.opacity ?? 0.2,
    }),
    [userGrid]
  );

  const layout = useMemo(
    () => ({
      cornerRadius: userLayout?.cornerRadius ?? 0,
      padding: userLayout?.padding ?? 12,
      showBorder: userLayout?.showBorder ?? false,
      borderColor: userLayout?.borderColor ?? 'rgba(168, 139, 104, 0.2)',
    }),
    [userLayout]
  );

  const interaction = useMemo(
    () => ({
      autoRotate: reduced ? false : (userInteraction?.autoRotate ?? true),
      autoRotateSpeed: userInteraction?.autoRotateSpeed ?? 5,
      rotateX: userInteraction?.rotateX ?? 0,
      rotateY: userInteraction?.rotateY ?? 0,
      rotateZ: userInteraction?.rotateZ ?? -40,
      enableDrag: userInteraction?.enableDrag ?? true,
      dragSensitivity: userInteraction?.dragSensitivity ?? 0.4,
      glowColor: userInteraction?.glowColor ?? '#A88B68',
      glowIntensity: userInteraction?.glowIntensity ?? 0.35,
      showStars: userInteraction?.showStars ?? true,
      showLabels: userInteraction?.showLabels ?? true,
    }),
    [userInteraction, reduced]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const ghostPathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const markerRefs = useRef<Map<number, SVGGElement>>(new Map());
  const gridPathRef = useRef<SVGPathElement | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [dims, setDims] = useState({ w: 700, h: 500 });
  const [feats, setFeats] = useState<RawFeature[] | null>(null);
  const [err, setErr] = useState(false);
  const [hM, setHM] = useState<{
    screenX: number;
    screenY: number;
    label: string;
    description?: string;
  } | null>(null);
  const [hC, setHC] = useState<{
    screenX: number;
    screenY: number;
    name: string;
    code: string;
  } | null>(null);

  const rotRef = useRef({
    lambda: interaction.rotateZ,
    phi: interaction.rotateY,
    gamma: interaction.rotateX,
  });
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startLambda: 0,
    startPhi: 0,
  });
  const lastMouseRef = useRef<{ x: number; y: number } | null>(null);
  const userInteractedRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!dragRef.current.active) {
      rotRef.current.lambda = interaction.rotateZ;
      rotRef.current.phi = interaction.rotateY;
      rotRef.current.gamma = interaction.rotateX;
    }
  }, [interaction.rotateX, interaction.rotateY, interaction.rotateZ]);

  useEffect(() => {
    if (!isClient) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => {
      const r = e[0]?.contentRect;
      if (r && r.width > 0 && r.height > 0) {
        startTransition(() => {
          setDims({ w: r.width, h: r.height });
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isClient]);

  // Load TopoJSON data from local static path first, fallback to CDN if needed
  useEffect(() => {
    if (!isClient) return;
    let dead = false;

    const loadData = async () => {
      try {
        const localRes = await fetch('/data/countries-110m.json');
        if (!localRes.ok) throw new Error('Local fetch failed');
        const data = await localRes.json();
        if (!dead) {
          startTransition(() => {
            setFeats(extractFeatures(data as TopoJSONTopology));
          });
        }
      } catch {
        try {
          const cdnRes = await fetch(
            'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
          );
          if (!cdnRes.ok) throw new Error('CDN fetch failed');
          const data = await cdnRes.json();
          if (!dead) {
            startTransition(() => {
              setFeats(extractFeatures(data as TopoJSONTopology));
            });
          }
        } catch {
          if (!dead) {
            startTransition(() => {
              setErr(true);
            });
          }
        }
      }
    };

    void loadData();
    return () => {
      dead = true;
    };
  }, [isClient]);

  const { w: W, h: H } = dims;
  const pad = layout.padding;
  const innerW = Math.max(0, W - pad * 2);
  const innerH = Math.max(0, H - pad * 2);
  const R = Math.max(20, Math.min(innerW, innerH) / 2 - 8);
  const cx = W / 2;
  const cy = H / 2;

  const countryIndex = useMemo(() => {
    if (!feats) return [];
    const out: CountryRecord[] = [];
    // Features with no entry in CD (small/unrecognized territories) all fall
    // back to their padded numeric id, and more than one can share the same
    // raw id (several legitimately use 0) — that collided as a duplicate
    // React key and a clobbered ref in ghostPathRefs/pathRefs (both Maps
    // keyed by id). Disambiguating here keeps `name` exactly as it was; only
    // the id used for React keys and ref lookups gets a uniqueness suffix.
    const seenIds = new Map<string, number>();
    for (const f of feats) {
      const pad3 = String(f.id).padStart(3, '0');
      const e = CD[pad3];
      const a3 = e ? e[0] : pad3;
      const nm = e ? e[1] : a3;
      if (a3 === 'ATA') continue;

      const seenCount = seenIds.get(a3) ?? 0;
      seenIds.set(a3, seenCount + 1);
      const uniqueId = seenCount === 0 ? a3 : `${a3}-${seenCount}`;

      const rings: [number, number][][] = [];
      let minLng = Infinity,
        maxLng = -Infinity,
        minLat = Infinity,
        maxLat = -Infinity;

      const visit = (ring: [number, number][]) => {
        rings.push(ring);
        for (const p of ring) {
          if (p[0] < minLng) minLng = p[0];
          if (p[0] > maxLng) maxLng = p[0];
          if (p[1] < minLat) minLat = p[1];
          if (p[1] > maxLat) maxLat = p[1];
        }
      };

      if (f.type === 'Polygon') {
        for (const r of f.coords as [number, number][][]) visit(r);
      } else if (f.type === 'MultiPolygon') {
        for (const poly of f.coords as [number, number][][][]) {
          for (const r of poly) visit(r);
        }
      }
      out.push({
        id: uniqueId,
        name: nm,
        type: f.type,
        coords: f.coords,
        rings,
        bbox: { minLng, maxLng, minLat, maxLat },
      });
    }
    return out;
  }, [feats]);

  const cfgMap = useMemo(() => {
    const m = new Map<string, { code: string; name: string; enabled: boolean }>();
    countries.forEach((c) => m.set(c.code, c));
    return m;
  }, [countries]);

  const stars = useMemo(() => {
    if (!interaction.showStars) return [];
    const rnd = mulberry32(1584243068);
    const N = 70;
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < N; i++) {
      const x = rnd() * W;
      const y = rnd() * H;
      const dx = x - cx,
        dy = y - cy;
      if (dx * dx + dy * dy < (R + 12) * (R + 12)) continue;
      out.push({ x, y, r: 0.4 + rnd() * 0.9, o: 0.18 + rnd() * 0.6 });
    }
    return out;
  }, [W, H, cx, cy, R, interaction.showStars]);

  // Imperative per-frame animation loop
  useEffect(() => {
    if (!isClient || countryIndex.length === 0) return;
    if (W <= 0 || H <= 0 || R <= 0) return;

    let raf = 0;
    let lastTime = typeof performance !== 'undefined' ? performance.now() : 0;
    const idleMs = 1200;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const sinceUser = now - userInteractedRef.current;

      if (interaction.autoRotate && !dragRef.current.active && sinceUser > idleMs) {
        rotRef.current.lambda += interaction.autoRotateSpeed * dt;
      }

      const { lambda, phi, gamma } = rotRef.current;

      // Update country paths
      for (const c of countryIndex) {
        const d = buildSphericalPath(c.type, c.coords, lambda, phi, gamma, R, cx, cy);
        const p = pathRefs.current.get(c.id);
        if (p) p.setAttribute('d', d);
        const g = ghostPathRefs.current.get(c.id);
        if (g) g.setAttribute('d', d);
      }

      // Update grid
      if (grid.show && gridPathRef.current) {
        gridPathRef.current.setAttribute(
          'd',
          buildGraticule(lambda, phi, gamma, R, cx, cy)
        );
      }

      // Update markers
      for (let i = 0; i < markers.length; i++) {
        const m = markers[i];
        const el = markerRefs.current.get(i);
        if (!m || !el) continue;
        const p = project(m.longitude, m.latitude, lambda, phi, gamma, R, cx, cy);
        if (p.v) {
          const fade = clamp(p.rx * 4, 0, 1);
          el.style.opacity = String(fade);
          el.style.display = '';
          el.setAttribute('transform', `translate(${p.sx.toFixed(1)},${p.sy.toFixed(1)})`);
        } else {
          el.style.opacity = '0';
          el.style.display = 'none';
        }
      }

      // Raycast hover country
      if (lastMouseRef.current && !dragRef.current.active) {
        const m = lastMouseRef.current;
        const ll = unproject(m.x, m.y, lambda, phi, gamma, R, cx, cy);
        if (ll) {
          const c = findCountryAt(ll.lng, ll.lat, countryIndex);
          if (c) {
            if (!hC || hC.code !== c.id) {
              startTransition(() => {
                setHC({ screenX: m.x, screenY: m.y, name: c.name, code: c.id });
              });
            } else if (hC.screenX !== m.x || hC.screenY !== m.y) {
              startTransition(() => {
                setHC({ ...hC, screenX: m.x, screenY: m.y });
              });
            }
          } else if (hC) {
            startTransition(() => {
              setHC(null);
            });
          }
        } else if (hC) {
          startTransition(() => {
            setHC(null);
          });
        }
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [
    isClient,
    countryIndex,
    markers,
    R,
    cx,
    cy,
    W,
    H,
    grid.show,
    interaction.autoRotate,
    interaction.autoRotateSpeed,
    hC,
  ]);

  // Sync country hover fills
  useEffect(() => {
    for (const c of countryIndex) {
      const el = pathRefs.current.get(c.id);
      if (!el) continue;
      const cc = cfgMap.get(c.id);
      const enabled = cc ? cc.enabled : true;
      const isHov = hC?.code === c.id;
      const fill = isHov
        ? mapStyle.hoverColor
        : !enabled && cc
          ? mapStyle.disabledColor
          : mapStyle.landFill;
      el.setAttribute('fill', fill);
    }
  }, [
    countryIndex,
    cfgMap,
    hC,
    mapStyle.hoverColor,
    mapStyle.disabledColor,
    mapStyle.landFill,
  ]);

  const localMouse = (e: React.PointerEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!interaction.enableDrag) return;
    const m = localMouse(e);
    const dx = m.x - cx,
      dy = m.y - cy;
    if (dx * dx + dy * dy > (R + 8) * (R + 8)) return;
    dragRef.current = {
      active: true,
      startX: m.x,
      startY: m.y,
      startLambda: rotRef.current.lambda,
      startPhi: rotRef.current.phi,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    startTransition(() => {
      setHC(null);
      setHM(null);
    });
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const m = localMouse(e);
    lastMouseRef.current = m;
    if (dragRef.current.active) {
      const sens = interaction.dragSensitivity;
      const dx = m.x - dragRef.current.startX;
      const dy = m.y - dragRef.current.startY;
      rotRef.current.lambda = dragRef.current.startLambda - dx * sens;
      rotRef.current.phi = clamp(dragRef.current.startPhi + dy * sens, -85, 85);
    }
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      userInteractedRef.current =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const onPointerLeave = () => {
    lastMouseRef.current = null;
    if (!dragRef.current.active) {
      startTransition(() => {
        setHC(null);
        setHM(null);
      });
    }
  };

  const handleMarkerEnter = (i: number, e: React.MouseEvent) => {
    const m = markers[i];
    if (!m) return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    startTransition(() => {
      setHM({
        screenX: e.clientX - r.left,
        screenY: e.clientY - r.top,
        label: m.label,
        description: m.description,
      });
    });
  };

  const handleMarkerMove = (i: number, e: React.MouseEvent) => {
    const m = markers[i];
    if (!m) return;
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    startTransition(() => {
      setHM({
        screenX: e.clientX - r.left,
        screenY: e.clientY - r.top,
        label: m.label,
        description: m.description,
      });
    });
  };

  const handleMarkerLeave = () => {
    startTransition(() => {
      setHM(null);
    });
  };

  const { oceanColor, landFill, landStroke, strokeWidth } = mapStyle;
  const { show: showGrid, color: gridCol, opacity: gridOp } = grid;
  const { cornerRadius, showBorder, borderColor: bCol } = layout;
  const { show: showTooltip, background: ttBg, textColor: ttCol, borderColor: ttBord } = tooltip;
  const { glowColor, glowIntensity, enableDrag, showLabels } = interaction;
  const loading = !feats && !err;

  const reactId = React.useId();
  const uid = reactId.replace(/:/g, '');
  const fG = 'g' + uid;
  const fL = 'l' + uid;
  const gO = 'o' + uid;
  const gShade = 's' + uid;
  const gAtm = 'a' + uid;
  const clipDisc = 'c' + uid;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        borderRadius: cornerRadius,
        padding: pad,
        background: 'transparent',
        border: showBorder ? `1px solid ${bCol}` : 'none',
        color: '#F4EFE6',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
      role="region"
      aria-label="Interactive 3D Tactical Globe showing Trivoxa Group trade lanes and corridors"
    >
      <style>{`
        .mm-c { transition: fill 140ms ease, filter 140ms ease; }
        .mm-c:hover { filter: brightness(1.2); }
        @keyframes mm-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.6); opacity: 0.08; }
        }
        .mm-pulse {
          animation: mm-pulse 2.4s ease-out infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
      `}</style>

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(244, 239, 230, 0.4)',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          Loading globe topology…
        </div>
      )}

      {err && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 6,
            color: rgba('#C49A6C', 0.8),
            fontSize: 11,
            fontFamily: 'var(--font-mono, monospace)',
          }}
        >
          <span>Map topology offline</span>
          <span style={{ fontSize: 9, opacity: 0.6 }}>Falling back to trade nodes</span>
        </div>
      )}

      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          cursor: enableDrag ? (dragRef.current.active ? 'grabbing' : 'grab') : 'default',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <defs>
          <filter id={fG} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={fL} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feColorMatrix
              in="b"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.16 0"
            />
          </filter>

          <radialGradient id={gShade} cx="38%" cy="32%" r="78%">
            <stop offset="0%" stopColor={rgba('#ffffff', 0.1)} />
            <stop offset="55%" stopColor={rgba('#ffffff', 0)} />
            <stop offset="92%" stopColor={rgba('#000000', 0.35)} />
            <stop offset="100%" stopColor={rgba('#000000', 0.6)} />
          </radialGradient>

          <radialGradient id={gAtm} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={rgba(glowColor, 0)} />
            <stop
              offset={(R / Math.max(R + 60, 1) * 100).toFixed(1) + '%'}
              stopColor={rgba(glowColor, 0)}
            />
            <stop
              offset={((R + 6) / Math.max(R + 60, 1) * 100).toFixed(1) + '%'}
              stopColor={rgba(glowColor, 0.4 * glowIntensity)}
            />
            <stop offset="100%" stopColor={rgba(glowColor, 0)} />
          </radialGradient>

          <linearGradient id={gO} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={rgba('#362a23', 0.25)} />
            <stop offset="50%" stopColor={rgba('#1c1613', 0.05)} />
            <stop offset="100%" stopColor={rgba('#120e0c', 0.35)} />
          </linearGradient>

          <clipPath id={clipDisc}>
            <circle cx={cx} cy={cy} r={R} />
          </clipPath>
        </defs>

        {interaction.showStars &&
          stars.map((s, i) => (
            <circle
              key={'s' + i}
              cx={s.x.toFixed(1)}
              cy={s.y.toFixed(1)}
              r={s.r.toFixed(2)}
              fill={rgba('#FAF8F3', s.o)}
            />
          ))}

        {/* Atmosphere halo */}
        <circle cx={cx} cy={cy} r={R + 60} fill={`url(#${gAtm})`} pointerEvents="none" />

        {/* Ocean sphere base */}
        <circle cx={cx} cy={cy} r={R} fill={oceanColor} />
        <circle cx={cx} cy={cy} r={R} fill={`url(#${gO})`} />

        {/* Land & Graticule inside clipped sphere */}
        <g clipPath={`url(#${clipDisc})`}>
          <g opacity={0.07} filter={`url(#${fL})`}>
            {countryIndex.map((c) => (
              <path
                key={'g' + c.id}
                ref={(el) => {
                  if (el) ghostPathRefs.current.set(c.id, el);
                  else ghostPathRefs.current.delete(c.id);
                }}
                fill={landFill}
                stroke="none"
                pointerEvents="none"
              />
            ))}
          </g>

          {showGrid && (
            <path
              ref={gridPathRef}
              fill="none"
              stroke={gridCol}
              strokeWidth={0.5}
              strokeOpacity={gridOp}
              vectorEffect="non-scaling-stroke"
              pointerEvents="none"
            />
          )}

          {countryIndex.map((c) => {
            const cc = cfgMap.get(c.id);
            const enabled = cc ? cc.enabled : true;
            const initialFill = !enabled && cc ? mapStyle.disabledColor : landFill;
            return (
              <path
                key={c.id}
                ref={(el) => {
                  if (el) pathRefs.current.set(c.id, el);
                  else pathRefs.current.delete(c.id);
                }}
                className="mm-c"
                fill={initialFill}
                stroke={landStroke}
                strokeWidth={strokeWidth}
                vectorEffect="non-scaling-stroke"
                style={{ cursor: 'default' }}
              />
            );
          })}
        </g>

        {/* Sphere depth shading */}
        <circle cx={cx} cy={cy} r={R} fill={`url(#${gShade})`} pointerEvents="none" />
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={rgba(glowColor, 0.4 * glowIntensity)}
          strokeWidth={1}
          pointerEvents="none"
        />

        {/* Trade node markers */}
        {markers.map((m, i) => {
          const sz = 5;
          const col = m.color || '#C49A6C';
          return (
            <g
              key={'m' + i + '-' + m.label}
              ref={(el) => {
                if (el) markerRefs.current.set(i, el);
                else markerRefs.current.delete(i);
              }}
              style={{ cursor: 'pointer', opacity: 0 }}
              onMouseEnter={(e) => handleMarkerEnter(i, e)}
              onMouseMove={(e) => handleMarkerMove(i, e)}
              onMouseLeave={handleMarkerLeave}
            >
              <circle className="mm-pulse" r={sz * 1.5} fill={rgba(col, 0.55)} />
              <circle r={sz * 2.2} fill={rgba(col, 0.15)} />
              <circle r={sz} fill={col} />
              <circle cx={-sz * 0.35} cy={-sz * 0.35} r={sz * 0.35} fill={rgba('#ffffff', 0.65)} />

              {showLabels && m.label && (
                <text
                  x={sz * 2.2}
                  y={sz * 0.4 + 1}
                  fill="#F4EFE6"
                  fontSize={10}
                  fontWeight={600}
                  fontFamily="var(--font-mono, monospace)"
                  letterSpacing="0.04em"
                  stroke={oceanColor}
                  strokeWidth={3}
                  strokeLinejoin="round"
                  paintOrder="stroke"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {m.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Marker Tooltip */}
      {showTooltip && hM && (
        <div
          style={{
            position: 'absolute',
            left: hM.screenX + 14,
            top: hM.screenY - 14,
            transform: 'translateY(-100%)',
            background: ttBg,
            color: ttCol,
            border: `1px solid ${ttBord}`,
            borderRadius: 8,
            padding: '8px 12px',
            pointerEvents: 'none',
            zIndex: 20,
            boxShadow: '0 8px 30px ' + rgba('#000', 0.5),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxWidth: 240,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.03em',
              fontFamily: 'var(--font-body, sans-serif)',
              whiteSpace: 'nowrap',
            }}
          >
            {hM.label}
          </div>
          {hM.description && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 400,
                opacity: 0.75,
                lineHeight: 1.35,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              {hM.description}
            </div>
          )}
        </div>
      )}

      {/* Country Hover Tooltip */}
      {showTooltip && !hM && hC && (
        <div
          style={{
            position: 'absolute',
            left: hC.screenX + 14,
            top: hC.screenY - 10,
            transform: 'translateY(-100%)',
            background: ttBg,
            color: ttCol,
            border: `1px solid ${ttBord}`,
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.04em',
            fontFamily: 'var(--font-mono, monospace)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 20,
            boxShadow: '0 8px 24px ' + rgba('#000', 0.5),
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          {hC.name}
        </div>
      )}
    </div>
  );
};

export default TacticalGlobe;
