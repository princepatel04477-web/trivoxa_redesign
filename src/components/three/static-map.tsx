import { PORTS } from '@/content/taxonomy';
import { BRAND } from '@/lib/tokens/colors';
import { HQ, regionsWithAnchors } from '@/lib/geo';

/**
 * P9 · LOW TIER — built FIRST, reviewed on its own merits.
 *
 * A real share of Trivoxa's buyers will only ever see this, so it is composed
 * as a chart, not as a fallback: a dotted graticule, the six canonical regions
 * in bronze with their names set in the data face, and the Surat→region
 * corridors as flat arcs from the SAME geometry the WebGL globe uses.
 *
 * No JavaScript, no canvas, no network. It is also what reduced-motion and
 * failed-WebGL visitors get, everywhere the globe appears.
 */

const W = 1200;
const H = 620;

/** equirectangular projection into the viewBox */
function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [x, y];
}

function graticule(): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];
  for (let lat = -60; lat <= 75; lat += 7.5) {
    for (let lng = -180; lng < 180; lng += 7.5) {
      const [x, y] = project(lat, lng);
      dots.push({ x, y });
    }
  }
  return dots;
}

export function StaticMap({ className }: { className?: string }) {
  const regions = regionsWithAnchors();
  const [hqX, hqY] = project(HQ.lat, HQ.lng);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Map of the ${regions.length} regions Trivoxa Group serves, with trade corridors from Surat, India`}
    >
      <rect width={W} height={H} fill={BRAND.espressoDeep.hex} />

      {/* graticule */}
      <g fill={BRAND.ivory.hex} fillOpacity={0.13}>
        {graticule().map((dot, i) => (
          <circle key={i} cx={dot.x.toFixed(1)} cy={dot.y.toFixed(1)} r={0.9} />
        ))}
      </g>

      {/* corridors from Surat */}
      <g fill="none" stroke={BRAND.bronze.hex} strokeOpacity={0.55} strokeWidth={1}>
        {regions.map(({ region, anchor }) => {
          // The lifted sphere arc belongs to the WebGL globe; on the flat
          // chart the honest equivalent is a simple lifted quadratic.
          const [ax, ay] = project(anchor.lat, anchor.lng);
          const midX = (hqX + ax) / 2;
          const midY = Math.min(hqY, ay) - 60;
          return <path key={region.slug} d={`M${hqX.toFixed(1)} ${hqY.toFixed(1)} Q${midX.toFixed(1)} ${midY.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`} strokeDasharray="3 5" />;
        })}
      </g>

      {/* region markers */}
      {regions.map(({ region, anchor }) => {
        const [x, y] = project(anchor.lat, anchor.lng);
        return (
          <g key={region.slug}>
            <circle cx={x} cy={y} r={5} fill="none" stroke={BRAND.bronze.hex} strokeWidth={1} />
            <circle cx={x} cy={y} r={1.8} fill={BRAND.bronze.hex} />
            <text
              x={x + 12}
              y={y + 4}
              fill={BRAND.ivory.hex}
              fontSize={15}
              fontFamily="'Geist Mono', ui-monospace, monospace"
              letterSpacing="0.08em"
            >
              {region.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* HQ */}
      <g>
        <circle cx={hqX} cy={hqY} r={7} fill="none" stroke={BRAND.ivory.hex} strokeWidth={1} />
        <circle cx={hqX} cy={hqY} r={2.4} fill={BRAND.ivory.hex} />
        <text
          x={hqX + 14}
          y={hqY - 10}
          fill={BRAND.ivory.hex}
          fontSize={16}
          fontFamily="'Geist Mono', ui-monospace, monospace"
          letterSpacing="0.08em"
        >
          SURAT · HQ
        </text>
        <text x={hqX + 14} y={hqY + 12} fill={BRAND.ivory.hex} fillOpacity={0.6} fontSize={12} fontFamily="'Geist Mono', ui-monospace, monospace">
          {PORTS.map((port) => port.locode).join(' · ')}
        </text>
      </g>
    </svg>
  );
}
