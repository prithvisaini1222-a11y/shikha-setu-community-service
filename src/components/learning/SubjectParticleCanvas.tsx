'use client';

import React, { useEffect, useRef } from 'react';

interface SubjectParticleCanvasProps {
  className?: string;
  isConverging?: boolean;
  accentColor?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulsing: number;
}

export function SubjectParticleCanvas({
  className = '',
  isConverging = false,
  accentColor = '#4CAF50',
}: SubjectParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean }>({
    x: -9999,
    y: -9999,
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    // ShikshaSetu brand palette particles (Soft Green, Soft Blue, Warm Amber, Cream)
    const colors = [accentColor, '#4CAF50', '#60A5FA', '#F59E0B', '#A7F3D0', '#93C5FD'];

    // Create 45-60 gentle particles for crisp 60fps performance
    const count = Math.min(55, Math.floor((width * height) / 14000));
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 2.5 + 1.2;
      const alpha = Math.random() * 0.45 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35 - 0.08, // gentle upward drift
        radius,
        baseRadius: radius,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha,
        baseAlpha: alpha,
        pulsing: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const centerX = width / 2;
    const centerY = height * 0.65; // Anchored near the bottom horizon where the 3D subject sits

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const targetX = isConverging ? width / 2 : mouseRef.current.x;
      const targetY = isConverging ? centerY : mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.pulsing += 0.02;
        p.alpha = p.baseAlpha + Math.sin(p.pulsing) * 0.08;

        if (isConverging) {
          // Convergence towards active subject center
          const dx = centerX - p.x;
          const dy = centerY - p.y;
          p.x += dx * 0.06;
          p.y += dy * 0.06;
          p.radius = Math.max(0.2, p.radius * 0.98);
        } else {
          // Standard gentle drift
          p.x += p.vx;
          p.y += p.vy;

          // Wrap edges
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;

          // Subtle interaction with mouse pointer
          if (mouseRef.current.isHovering) {
            const dx = p.x - targetX;
            const dy = p.y - targetY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 130;

            if (dist < maxDist && dist > 0) {
              const force = (maxDist - dist) / maxDist;
              // Gentle gravitate/repulsion balance
              p.x += (dx / dist) * force * 0.6;
              p.y += (dy / dist) * force * 0.6;
            }
          }
        }

        // Draw particle with soft halo
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles with subtle filament lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          const connectDistance = isConverging ? 110 : 75;

          if (dist < connectDistance) {
            const lineAlpha = (1 - dist / connectDistance) * 0.12;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.75;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isConverging, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto absolute inset-0 w-full h-full select-none ${className}`}
      aria-hidden="true"
    />
  );
}
