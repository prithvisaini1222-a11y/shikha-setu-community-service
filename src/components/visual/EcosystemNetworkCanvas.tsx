'use client';

import React, { useEffect, useRef } from 'react';

interface EcosystemNetworkCanvasProps {
  activeRole?: 'learner' | 'volunteer' | 'donor' | 'institution' | 'admin' | string;
  isAuthenticating?: boolean;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  category: 'learner' | 'volunteer' | 'donor' | 'institution';
}

export function EcosystemNetworkCanvas({
  activeRole = 'volunteer',
  isAuthenticating = false,
  className = '',
}: EcosystemNetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.offsetWidth || 400);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 300);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle colors according to brand guidelines: leaf green + very little soft blue
    const colors = {
      learner: '#78B98A',      // light leaf green
      volunteer: '#4F9D69',    // primary leaf green
      donor: '#5FA375',        // soft leaf green
      institution: '#6E9AD6',  // subtle soft blue
    };

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 10000), 30);
    const categories: ('learner' | 'volunteer' | 'donor' | 'institution')[] = [
      'learner',
      'volunteer',
      'donor',
      'institution',
    ];

    for (let i = 0; i < particleCount; i++) {
      const cat = categories[i % categories.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.2 + 1.0,
        color: colors[cat],
        category: cat,
      });
    }

    // Role hubs locations relative to canvas
    const getHubPositions = () => {
      const cx = width / 2;
      const cy = height / 2;
      const rx = Math.min(width * 0.38, 140);
      const ry = Math.min(height * 0.35, 95);

      return {
        center: { x: cx, y: cy, label: 'ShikshaSetu', color: '#4F9D69', radius: 22 },
        learner: { x: cx - rx, y: cy - ry * 0.65, label: 'Learners', color: '#78B98A', radius: 14 },
        volunteer: { x: cx - rx * 0.85, y: cy + ry * 0.8, label: 'Volunteers', color: '#4F9D69', radius: 15 },
        institution: { x: cx + rx, y: cy - ry * 0.65, label: 'Institutions', color: '#6E9AD6', radius: 15 },
        donor: { x: cx + rx * 0.85, y: cy + ry * 0.8, label: 'Donors', color: '#5FA375', radius: 14 },
      };
    };

    let animationFrameId: number;
    let pulseTime = 0;

    const render = () => {
      pulseTime += 0.015;
      ctx.clearRect(0, 0, width, height);

      const hubs = getHubPositions();

      // 1. Draw connecting ambient grid / particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move slowly
        p.x += p.vx;
        p.y += p.vy;

        // Subtle mouse nudge
        if (mouseRef.current.active) {
          const mdx = p.x - mouseRef.current.x;
          const mdy = p.y - mouseRef.current.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 60) {
            p.x += (mdx / mDist) * 0.4;
            p.y += (mdy / mDist) * 0.4;
          }
        }

        // Bounce on boundary
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        const isRoleActive = activeRole.toLowerCase().includes(p.category);
        ctx.beginPath();
        ctx.arc(p.x, p.y, isRoleActive ? p.radius * 1.2 : p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = isRoleActive ? 0.6 : 0.28;
        ctx.fill();

        // Connect nearby particles with thin low-opacity lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            ctx.beginPath();
            ctx.strokeStyle = '#4F9D69';
            ctx.globalAlpha = (1 - dist / 65) * 0.08;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw Main Hub Connections to Central ShikshaSetu Node
      const roleKeys: ('learner' | 'volunteer' | 'institution' | 'donor')[] = [
        'learner',
        'volunteer',
        'institution',
        'donor',
      ];

      roleKeys.forEach((key) => {
        const hub = hubs[key];
        const isActive = activeRole.toLowerCase().includes(key);

        ctx.beginPath();
        ctx.moveTo(hub.x, hub.y);
        ctx.lineTo(hubs.center.x, hubs.center.y);

        if (isActive || isAuthenticating) {
          ctx.strokeStyle = hub.color;
          ctx.lineWidth = 1.8;
          ctx.globalAlpha = 0.5 + Math.sin(pulseTime * 2) * 0.15;
        } else {
          ctx.strokeStyle = '#E2E8E0';
          ctx.lineWidth = 1.0;
          ctx.globalAlpha = 0.35;
        }
        ctx.stroke();

        // Animated pulse packet traveling between active hub and center
        if (isActive || isAuthenticating) {
          const t = (pulseTime * 0.5) % 1;
          const px = hub.x + (hubs.center.x - hub.x) * t;
          const py = hub.y + (hubs.center.y - hub.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = hub.color;
          ctx.globalAlpha = 0.75;
          ctx.fill();
        }

        // Draw Hub Node
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hub.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = 0.95;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(hub.x, hub.y, hub.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? hub.color : '#D5DDD5';
        ctx.lineWidth = isActive ? 2.0 : 1.2;
        ctx.globalAlpha = 0.85;
        ctx.stroke();

        // Inner pip
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, isActive ? 4 : 3, 0, Math.PI * 2);
        ctx.fillStyle = hub.color;
        ctx.globalAlpha = 0.9;
        ctx.fill();

        // Node Label
        ctx.font = '600 10px Inter, sans-serif';
        ctx.fillStyle = '#25352B';
        ctx.textAlign = 'center';
        ctx.fillText(hub.label, hub.x, hub.y + hub.radius + 12);
      });

      // 3. Central ShikshaSetu Node
      const centerPulse = Math.sin(pulseTime * 1.5) * 1.5;
      const centerRadius = hubs.center.radius + (isAuthenticating ? 3 : centerPulse);

      // Outer soft ripple
      ctx.beginPath();
      ctx.arc(hubs.center.x, hubs.center.y, centerRadius + 6, 0, Math.PI * 2);
      ctx.fillStyle = '#EEF7F0';
      ctx.globalAlpha = 0.5 + Math.sin(pulseTime * 1.5) * 0.2;
      ctx.fill();

      // Main center body
      ctx.beginPath();
      ctx.arc(hubs.center.x, hubs.center.y, centerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#4F9D69';
      ctx.globalAlpha = 1;
      ctx.fill();

      // White ring
      ctx.beginPath();
      ctx.arc(hubs.center.x, hubs.center.y, centerRadius - 3, 0, Math.PI * 2);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.7;
      ctx.stroke();

      // Center Text
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SETU', hubs.center.x, hubs.center.y);

      // Reset
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeRole, isAuthenticating]);

  return (
    <div className={`relative w-full h-full min-h-[220px] overflow-hidden rounded-2xl ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block select-none" />
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-[#647067] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2E8E0]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4F9D69]" />
          <span>Learner • Volunteer • Institution • Donor</span>
        </span>
        <span className="text-[10px] text-[#4F9D69] font-bold">Community Network</span>
      </div>
    </div>
  );
}
