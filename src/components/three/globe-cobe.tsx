'use client';

import { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { BRAND } from '@/lib/tokens/colors';
import { regionsWithAnchors } from '@/lib/geo';

/**
 * P9 · MEDIUM TIER — `cobe`: ~5KB, canvas-based, no three.js.
 *
 * Auto-rotating dotted globe with the six region markers, draggable. No arc
 * animation at this tier — arcs are the high tier's signature, and paying
 * three.js's cost for them on a mid-range phone is exactly the trade the audit
 * told us not to make.
 */
export function GlobeCobe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const markers = regionsWithAnchors().map(({ anchor }) => ({
      location: [anchor.lat, anchor.lng] as [number, number],
      size: 0.06,
    }));

    let phi = 0;
    let dragOffset = 0;
    let dragging = false;
    let lastX = 0;

    const onDown = (event: PointerEvent): void => {
      dragging = true;
      lastX = event.clientX;
    };
    const onMove = (event: PointerEvent): void => {
      if (!dragging) return;
      dragOffset += (event.clientX - lastX) * 0.005;
      lastX = event.clientX;
    };
    const onUp = (): void => {
      dragging = false;
    };

    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio, 2),
      width: canvas.offsetWidth * Math.min(window.devicePixelRatio, 2),
      height: canvas.offsetWidth * Math.min(window.devicePixelRatio, 2),
      phi: 0,
      theta: 0.12,
      dark: 1,
      diffuse: 0.6,
      mapSamples: 14_000,
      mapBrightness: 2.4,
      baseColor: [0.957, 0.937, 0.902],
      markerColor: [0.659, 0.545, 0.408],
      glowColor: [0.141, 0.11, 0.094],
      markers,
      opacity: 0.95,
      onRender: (state: Record<string, unknown>) => {
        if (!dragging) phi += 0.0032;
        state.phi = phi + dragOffset;
        state.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
        state.height = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2);
      },
    });

    void BRAND;

    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', aspectRatio: '1 / 1', touchAction: 'pan-y' }}
      aria-label="Rotating globe marking the six regions Trivoxa Group serves"
      role="img"
    />
  );
}
