'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BRAND } from '@/lib/tokens/colors';
import { HQ, arcPoints, latLngToVector3, regionsWithAnchors } from '@/lib/geo';
import { loadGsap, peekGsap, type GsapBundle } from '@/lib/motion/gsap-setup';

/**
 * P9 · HIGH TIER — the signature globe.
 *
 * Dotted sphere in espresso with ivory points; bronze corridors draw between
 * Surat and each region AS THE SECTION SCROLLS INTO VIEW (scrubbed); region
 * markers answer hover with a label; drag-to-rotate with inertia; slow
 * auto-rotate when idle, paused on interaction, resumed after 3s.
 *
 * Only reached by dynamic import behind the tier check (globe-loader).
 */

const IVORY = new THREE.Color(BRAND.ivory.hex);
const BRONZE = new THREE.Color(BRAND.bronze.hex);

function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function Corridors() {
  const progress = useRef(0);

  /**
   * Built as real THREE.Line objects and mounted with <primitive>: R3F's `<line>`
   * JSX collides with the SVG line element in TypeScript, and the primitive
   * route also keeps the geometry we need for the draw range in one place.
   */
  const corridors = useMemo(
    () =>
      regionsWithAnchors().map(({ region, anchor }) => {
        const points = arcPoints(HQ, anchor, 64, 0.22).map(
          (p) => new THREE.Vector3(p[0], p[1], p[2]),
        );
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // start fully collapsed; the scrub opens them up
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: BRONZE,
          transparent: true,
          opacity: 0.75,
        });
        return { slug: region.slug, line: new THREE.Line(geometry, material), count: points.length };
      }),
    [],
  );

  /* draw-on-scroll, SCRUBBED — the corridor is drawn by the visitor, not by a timer */
  useEffect(() => {
    let trigger: { kill: () => void } | null = null;
    let cancelled = false;

    const create = ({ ScrollTrigger }: GsapBundle): void => {
      if (cancelled) return;
      trigger = ScrollTrigger.create({
        trigger: '#global-presence-preview',
        start: 'top 75%',
        end: 'bottom 35%',
        scrub: 0.5,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    };

    const ready = peekGsap();
    if (ready) create(ready);
    else void loadGsap().then(create);

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, []);

  useFrame(() => {
    corridors.forEach((corridor, index) => {
      const staggered = Math.min(1, Math.max(0, progress.current * 1.5 - index * 0.07));
      corridor.line.geometry.setDrawRange(0, Math.floor(corridor.count * staggered));
    });
  });

  return (
    <>
      {corridors.map((corridor) => (
        <primitive key={corridor.slug} object={corridor.line} />
      ))}
    </>
  );
}

function Markers({ onHover }: { onHover: (name: string | null) => void }) {
  const regions = regionsWithAnchors();

  return (
    <group>
      {regions.map(({ region, anchor }) => {
        const [x, y, z] = latLngToVector3(anchor.lat, anchor.lng, 1.01);
        return (
          <mesh
            key={region.slug}
            position={[x, y, z]}
            onPointerOver={() => onHover(region.name)}
            onPointerOut={() => onHover(null)}
          >
            <sphereGeometry args={[0.022, 12, 12]} />
            <meshBasicMaterial color={BRONZE} />
          </mesh>
        );
      })}
      {/* HQ */}
      <mesh position={latLngToVector3(HQ.lat, HQ.lng, 1.01)}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color={IVORY} />
      </mesh>
    </group>
  );
}

function GlobeRig({ onHover }: { onHover: (name: string | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const idleAt = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const { gl } = useThree();

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const now = state.clock.elapsedTime;

    if (!dragging.current) {
      // inertia decays; auto-rotate resumes 3s after the last interaction
      velocity.current *= 0.94;
      const idle = now - idleAt.current > 3;
      group.rotation.y += velocity.current + (idle ? delta * 0.06 : 0);
    }

    void gl;
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={(event) => {
        dragging.current = true;
        lastX.current = event.clientX;
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        const group = groupRef.current;
        if (!group) return;
        const dx = event.clientX - lastX.current;
        lastX.current = event.clientX;
        group.rotation.y += dx * 0.005;
        velocity.current = dx * 0.005;
      }}
      onPointerUp={() => {
        dragging.current = false;
        idleAt.current = performance.now() / 1000;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fibonacciSphere(5200, 1), 3]}
          />
        </bufferGeometry>
        <pointsMaterial color={IVORY} size={0.008} sizeAttenuation transparent opacity={0.85} />
      </points>

      <Corridors />
      <Markers onHover={onHover} />
    </group>
  );
}

export function GlobeR3F() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 2.6], fov: 42 }}
        aria-hidden
      >
        <GlobeRig onHover={setHovered} />
      </Canvas>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
        aria-live="polite"
      >
        {hovered ? (
          <span className="border-bronze/50 bg-espresso-deep/90 spec-value border px-3 py-1" data-spec>
            {hovered}
          </span>
        ) : null}
      </div>
    </div>
  );
}
