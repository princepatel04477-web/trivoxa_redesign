'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Float, PresentationControls } from '@react-three/drei';
import type * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { usePerfTier } from '@/lib/perf-tier';
import { WebGLErrorBoundary } from './webgl-error-boundary';

interface ModelProps {
  modelPath: string;
  autoRotate?: boolean;
}

function LogoModel({ modelPath, autoRotate = true }: ModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene to prevent mutations across remounts
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Boost specular/metallic luster slightly for institutional luxury finish
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.envMapIntensity = 1.2;
          mat.roughness = Math.max(0.25, mat.roughness * 0.85);
          mat.metalness = Math.min(0.85, mat.metalness + 0.2);
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame((_state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={clonedScene} scale={4.5} />
      </Center>
    </group>
  );
}

function Logo3DScene({ modelPath = '/brand/3d/horse-emblem-cream.glb' }: { modelPath?: string }) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 2.2], fov: 40 }}
      className="cursor-grab active:cursor-grabbing w-full h-full"
      aria-label="Interactive 3D Trivoxa Horse Emblem"
    >
      <ambientLight intensity={1.2} color="#dfb282" />
      <directionalLight position={[4, 5, 4]} intensity={2.8} color="#fff6e8" />
      <directionalLight position={[-4, -2, -3]} intensity={1.5} color="#c59b6d" />
      <pointLight position={[0, 3, 2]} intensity={2.0} color="#e5c59e" />
      <spotLight position={[0, -3, 2]} intensity={1.0} color="#a88b68" angle={0.6} />

      <Suspense fallback={null}>
        <PresentationControls
          global={false}
          cursor={true}
          snap={true}
          speed={1.8}
          zoom={1}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI, Math.PI]}
        >
          <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.5} floatingRange={[-0.05, 0.05]}>
            <LogoModel modelPath={modelPath} />
          </Float>
        </PresentationControls>
      </Suspense>
    </Canvas>
  );
}

// Preload models for immediate smooth display
if (typeof window !== 'undefined') {
  useGLTF.preload('/brand/3d/horse-emblem-cream.glb');
  useGLTF.preload('/brand/3d/horse-emblem.glb');
  useGLTF.preload('/brand/3d/trivoxa-group.glb');
}

/**
 * 2D Fallback poster using high-resolution rendered 3D emblem
 */
function LogoFallback() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 drop-shadow-[0_0_30px_rgba(168,139,104,0.4)]">
        <Image
          src="/brand/_incoming/1.png"
          alt="Trivoxa Group 3D Emblem"
          fill
          priority
          sizes="(max-width: 768px) 180px, 240px"
          className="object-contain"
        />
      </div>
    </div>
  );
}

/**
 * Hero3DLogo — Luxury interactive 3D logo centerpiece for the Hero section.
 * Renders the authentic 3D Horse Emblem model from the 3D LOGO folder with
 * mouse-interactive physics, floating levitation, studio bronze lighting,
 * and high-fidelity fallback.
 */
export function Hero3DLogo({ className = '' }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const tier = usePerfTier();
  const [mounted, setMounted] = useState(false);
  const [activeModel, setActiveModel] = useState<'cream' | 'bronze'>('cream');

  useEffect(() => {
    setMounted(true);
  }, []);

  const modelPath =
    activeModel === 'cream'
      ? '/brand/3d/horse-emblem-cream.glb'
      : '/brand/3d/horse-emblem.glb';

  if (!mounted || reducedMotion || tier === 'low') {
    return <LogoFallback />;
  }

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center ${className}`}>
      {/* 3D Canvas with WebGL Error Boundary */}
      <WebGLErrorBoundary fallback={<LogoFallback />}>
        <div className="w-full h-full min-h-[160px] sm:min-h-[180px] lg:min-h-[200px] relative">
          <Logo3DScene modelPath={modelPath} />
        </div>
      </WebGLErrorBoundary>

      {/* Model Material Variant Switcher / Indicator */}
      <div className="pointer-events-auto absolute bottom-2 inset-x-3 flex items-center justify-between z-20">
        <span className="text-ivory/90 bg-espresso-deep/85 border-bronze/30 rounded border px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-medium tracking-wider uppercase backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          3D Emblem · Interactive
        </span>

        <div className="flex items-center gap-1 bg-espresso-deep/90 border border-bronze/30 rounded-full px-1.5 py-0.5 backdrop-blur-xs shadow-sm">
          <button
            type="button"
            onClick={() => setActiveModel('cream')}
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
              activeModel === 'cream'
                ? 'bg-bronze text-espresso-deep font-semibold'
                : 'text-ivory/60 hover:text-ivory'
            }`}
            title="Ivory / Cream Finish"
          >
            Cream
          </button>
          <button
            type="button"
            onClick={() => setActiveModel('bronze')}
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full transition-colors ${
              activeModel === 'bronze'
                ? 'bg-bronze text-espresso-deep font-semibold'
                : 'text-ivory/60 hover:text-ivory'
            }`}
            title="Ink / Deep Bronze Finish"
          >
            Ink
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero3DLogo;
