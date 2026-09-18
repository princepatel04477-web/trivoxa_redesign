'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

interface FallingTextProps {
  words?: string[];
  gravity?: number;
  className?: string;
  fontSize?: number;
}

interface Particle {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  vRot: number;
  color: string;
}

export default function FallingText({
  words = [
    'Export Documentation',
    'Customs & HS Codes',
    'Quality Inspection',
    'Freight Coordination',
    'Software Architecture',
    'Loom Engineering',
    'Incoterms CIF/FOB',
    'Supply Chain Operations',
  ],
  gravity = 0.45,
  className = '',
  fontSize = 14,
}: FallingTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameId = useRef<number | null>(null);
  const [_isHovered, setIsHovered] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = containerRef.current.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.font = `${fontSize}px var(--font-mono, monospace)`;

    // Initialize particles spread out across top
    const colors = ['#A88B68', '#C4A47C', '#F4EFE6', '#FAF8F3', '#8C7355'];
    particlesRef.current = words.map((text, i) => {
      const textWidth = ctx.measureText(text).width + 24;
      const textHeight = fontSize + 16;
      const x = Math.max(10, Math.min(canvas.width - textWidth - 10, (i * (canvas.width / words.length)) + 20));
      const y = -20 - (i * 35);
      return {
        text,
        x,
        y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 2 + 1,
        width: textWidth,
        height: textHeight,
        rotation: (Math.random() - 0.5) * 0.2,
        vRot: (Math.random() - 0.5) * 0.02,
        color: colors[i % colors.length]!,
      };
    });

    let active = true;

    // The physics sim redraws every frame forever — only pay for it while
    // the canvas is actually on screen.
    let isVisible = true;
    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) isVisible = entry.isIntersecting;
        },
        { rootMargin: '200px' },
      );
      intersectionObserver.observe(canvas);
    }

    const render = () => {
      if (!active || !ctx) return;

      if (!isVisible) {
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Physics update
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Floor collision
        const floor = canvas.height - p.height;
        if (p.y > floor) {
          p.y = floor;
          p.vy = -p.vy * 0.5; // bounce damping
          p.vx *= 0.85; // friction
          p.vRot *= 0.8;
        }

        // Wall collisions
        if (p.x < 10) {
          p.x = 10;
          p.vx = -p.vx * 0.6;
        } else if (p.x + p.width > canvas.width - 10) {
          p.x = canvas.width - p.width - 10;
          p.vx = -p.vx * 0.6;
        }

        // Draw particle chip
        ctx.save();
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        ctx.rotate(p.rotation);

        // Chip Background
        ctx.fillStyle = 'rgba(36, 28, 24, 0.85)';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-p.width / 2, -p.height / 2, p.width, p.height, 8);
        ctx.fill();
        ctx.stroke();

        // Chip Text
        ctx.fillStyle = p.color;
        ctx.font = `${fontSize}px var(--font-mono, monospace)`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.text, 0, 1);

        ctx.restore();
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const newRect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = newRect.width;
      canvasRef.current.height = newRect.height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      active = false;
      intersectionObserver?.disconnect();
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [words, gravity, fontSize, reducedMotion]);

  // Handle interactive scatter on mouse move / hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    particlesRef.current.forEach((p) => {
      const dx = (p.x + p.width / 2) - mouseX;
      const dy = (p.y + p.height / 2) - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 15;
        p.vx += (dx / dist) * force;
        p.vy -= force * 1.5;
        p.vRot += (Math.random() - 0.5) * 0.1;
      }
    });
  };

  if (reducedMotion) {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {words.map((w) => (
          <span
            key={w}
            className="rounded-lg border border-[#A88B68]/40 bg-[#241C18] px-3 py-1 font-mono text-xs text-[#A88B68]"
          >
            {w}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative h-[240px] w-full overflow-hidden cursor-crosshair ${className}`}
      title="Hover over falling keywords to interact"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
