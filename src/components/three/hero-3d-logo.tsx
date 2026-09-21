'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Center, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { WebGLErrorBoundary } from './webgl-error-boundary';

interface ModelProps {
  modelPath: string;
  activeModel?: 'cream' | 'bronze';
}

function LogoModel({ modelPath, activeModel = 'cream' }: ModelProps) {
  const { scene } = useGLTF(modelPath);

  // Clone scene to prevent mutations across remounts and style materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const origMat = mesh.material as THREE.MeshStandardMaterial;
          const mat = origMat.clone();

          if (activeModel === 'bronze') {
            mat.color = new THREE.Color('#c59b6d');
            mat.roughness = 0.28;
            mat.metalness = 0.85;
            mat.envMapIntensity = 1.8;
          } else {
            // Cream / Ivory luxury ceramic-gold sheen
            mat.color = new THREE.Color('#f4efe6');
            mat.roughness = 0.32;
            mat.metalness = 0.25;
            mat.envMapIntensity = 1.5;
          }
          mesh.material = mat;
        }
      }
    });
    return clone;
  }, [scene, activeModel]);

  return (
    <Center>
      <primitive object={clonedScene} scale={4.6} />
    </Center>
  );
}

function Logo3DScene({
  modelPath = '/brand/3d/horse-emblem-cream.glb',
  activeModel = 'cream',
  autoRotate = true,
}: {
  modelPath?: string;
  activeModel?: 'cream' | 'bronze';
  autoRotate?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 2.2], fov: 40 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
      className="cursor-grab active:cursor-grabbing w-full h-full touch-none"
      aria-label="Interactive 3D Trivoxa Horse Emblem"
    >
      {/* Dynamic 5-point studio lighting */}
      <ambientLight intensity={1.6} color="#fff8f0" />
      <directionalLight position={[5, 6, 5]} intensity={3.2} color="#ffffff" />
      <directionalLight position={[-5, 2, -3]} intensity={1.8} color="#dfb282" />
      <directionalLight position={[0, 5, -5]} intensity={2.8} color="#f7ebd9" />
      <directionalLight position={[0, -4, 2]} intensity={1.0} color="#a88b68" />
      <pointLight position={[0, 0, 2.5]} intensity={1.5} color="#ffffff" />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.12} floatIntensity={0.25} floatingRange={[-0.03, 0.03]}>
          <LogoModel modelPath={modelPath} activeModel={activeModel} />
        </Float>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={2.4}
          enableDamping={true}
          dampingFactor={0.06}
          rotateSpeed={0.85}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
          makeDefault
        />
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
 * Probe WebGL capability once safely
 */
function hasWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Hero3DLogo — Luxury interactive 3D logo centerpiece for the Hero section.
 * Renders the authentic 3D Horse Emblem model from the 3D LOGO folder with
 * mouse/touch drag controls, smooth 360-degree rotation, floating levitation,
 * warm studio lighting, and instant fallback.
 */
export function Hero3DLogo({ className = '' }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [activeModel, setActiveModel] = useState<'cream' | 'bronze'>('cream');

  useEffect(() => {
    setMounted(true);
    setCanRender(hasWebGLSupport());
  }, []);

  const modelPath =
    activeModel === 'cream'
      ? '/brand/3d/horse-emblem-cream.glb'
      : '/brand/3d/horse-emblem.glb';

  if (!mounted || !canRender) {
    return <LogoFallback />;
  }

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D Canvas with WebGL Error Boundary */}
      <WebGLErrorBoundary fallback={<LogoFallback />}>
        <div className="absolute inset-0 w-full h-full">
          <Logo3DScene
            modelPath={modelPath}
            activeModel={activeModel}
            autoRotate={!reducedMotion}
          />
        </div>
      </WebGLErrorBoundary>

      {/* Model Material Variant Switcher / Status Pill */}
      <div className="pointer-events-none absolute bottom-2 inset-x-3 flex items-center justify-between z-20">
        <span className="text-ivory/90 bg-espresso-deep/90 border-bronze/40 rounded-full border px-2.5 py-1 font-mono text-[9px] sm:text-[10px] font-medium tracking-wider uppercase backdrop-blur-md flex items-center gap-1.5 shadow-md">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span className="hidden sm:inline">Drag to rotate ·</span> 3D Horse
        </span>

        <div className="pointer-events-auto flex items-center gap-1 bg-espresso-deep/90 border border-bronze/40 rounded-full p-0.5 backdrop-blur-md shadow-md">
          <button
            type="button"
            onClick={() => setActiveModel('cream')}
            className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              activeModel === 'cream'
                ? 'bg-bronze text-espresso-deep font-semibold shadow-xs'
                : 'text-ivory/70 hover:text-ivory'
            }`}
            title="Ivory / Cream Finish"
          >
            Cream
          </button>
          <button
            type="button"
            onClick={() => setActiveModel('bronze')}
            className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full transition-all cursor-pointer ${
              activeModel === 'bronze'
                ? 'bg-bronze text-espresso-deep font-semibold shadow-xs'
                : 'text-ivory/70 hover:text-ivory'
            }`}
            title="Brushed Bronze Finish"
          >
            Bronze
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero3DLogo;
