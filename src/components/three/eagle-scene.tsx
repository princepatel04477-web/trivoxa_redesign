'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { sampleEagle } from '@/lib/three/eagle-points';
import { loadGsap, peekGsap, type GsapBundle } from '@/lib/motion/gsap-setup';
import { BRAND } from '@/lib/tokens/colors';

/**
 * The particle eagle (P6).
 *
 *  · point cloud DERIVED from the logo mark (sampleEagle) — never hand-placed;
 *  · custom shader: additive blending, ivory core, bronze fringe on ~8%;
 *  · idle motion is "shimmer / breathing / gentle drift" — amplitudes small
 *    enough that a screenshot still reads as a clean eagle;
 *  · pointer repulsion, eased, settling back; disabled on touch entirely;
 *  · scroll dissolve is SCRUBBED, not triggered: the visitor controls it.
 *
 * This module is only ever reached by dynamic import from eagle-loader, after
 * the perf-tier check — a `low` device never downloads three.js at all.
 */

const IVORY = new THREE.Color(BRAND.ivory.hex);
const BRONZE = new THREE.Color(BRAND.bronze.hex);

const VERTEX = /* glsl */ `
  attribute float aTint;
  attribute vec3 aDispersed;

  uniform float uDisperse;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPointerStrength;
  uniform float uSize;
  uniform float uPixelRatio;

  varying float vTint;

  void main() {
    vec3 pos = mix(position, aDispersed, uDisperse);

    // shimmer + breathing: sub-pixel at rest, alive in motion
    pos.x += sin(uTime * 0.6 + position.y * 6.0) * 0.006;
    pos.y += cos(uTime * 0.5 + position.x * 5.0) * 0.006;
    pos.z += sin(uTime * 0.4 + position.x * 3.0 + position.y * 2.0) * 0.008;

    // soft cursor repulsion, in the cloud's plane
    vec2 toPointer = pos.xy - uPointer;
    float distance = length(toPointer);
    float falloff = smoothstep(0.42, 0.0, distance);
    pos.xy += (toPointer / max(distance, 0.0001)) * falloff * uPointerStrength;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    vTint = aTint;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uIvory;
  uniform vec3 uBronze;
  uniform float uOpacity;
  varying float vTint;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, d);
    if (alpha < 0.01) discard;
    vec3 colour = mix(uIvory, uBronze, vTint);
    gl_FragColor = vec4(colour, alpha * uOpacity);
  }
`;

function EaglePoints({ count, interactive }: { count: number; interactive: boolean }) {
  const pointerTarget = useRef(new THREE.Vector2(99, 99));
  const { viewport } = useThree();

  const cloud = useMemo(() => sampleEagle(count), [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3));
    geo.setAttribute('aTint', new THREE.BufferAttribute(cloud.tints, 1));
    geo.setAttribute('aDispersed', new THREE.BufferAttribute(cloud.dispersed, 3));
    return geo;
  }, [cloud]);

  const uniforms = useMemo(
    () => ({
      uDisperse: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(99, 99) },
      uPointerStrength: { value: 0 },
      uSize: { value: 2.6 },
      uPixelRatio: { value: 1 },
      uIvory: { value: IVORY },
      uBronze: { value: BRONZE },
      uOpacity: { value: 0.9 },
    }),
    [],
  );

  /**
   * Effects and the frame loop write through this ref. The memo above has a
   * stable identity, so the ref never goes stale — and going through
   * `.current` is what keeps react-hooks/exhaustive-deps from demanding a
   * dependency on every single uniform member expression.
   */
  const u = useRef(uniforms);
  u.current = uniforms;

  useEffect(() => {
    u.current.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  }, [u]);

  /* scroll dissolve — SCRUBBED. The user controls it. */
  useEffect(() => {
    let trigger: { kill: () => void } | null = null;
    let cancelled = false;

    const create = ({ ScrollTrigger }: GsapBundle): void => {
      if (cancelled) return;
      trigger = ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
        onUpdate: (self) => {
          u.current.uDisperse.value = self.progress;
          u.current.uOpacity.value = 0.9 * (1 - self.progress * 0.85);
        },
      });
    };

    // Scrub only — no entrance animation — so an async GSAP load costs nothing
    // here: the poster is already on screen and the canvas stays at progress 0
    // until the trigger exists.
    const ready = peekGsap();
    if (ready) create(ready);
    else void loadGsap().then(create);

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [u]);

  /* pointer repulsion, eased; disabled on touch entirely */
  useEffect(() => {
    if (!interactive) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (event: PointerEvent): void => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = -((event.clientY / window.innerHeight) * 2 - 1);
      pointerTarget.current.set(nx * (viewport.width / 2), ny * (viewport.height / 2));
      u.current.uPointerStrength.value = 0.16;
    };

    const onLeave = (): void => {
      u.current.uPointerStrength.value = 0;
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [interactive, viewport, u]);

  useFrame((_state, delta) => {
    u.current.uTime.value += delta;

    // ease the pointer toward the cursor; strength eases back to rest
    const target = u.current.uPointer.value as THREE.Vector2;
    target.lerp(pointerTarget.current, 1 - Math.pow(0.001, delta));
  });

  const responsiveScale = Math.min(1, (viewport.width * 0.92) / 2.15);

  return (
    <points scale={responsiveScale} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function EagleScene({ count, bloom }: { count: number; bloom: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 3], fov: 45 }}
      aria-hidden
      style={{ pointerEvents: 'none' }}
    >
      <EaglePoints count={count} interactive />
      {bloom ? (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
