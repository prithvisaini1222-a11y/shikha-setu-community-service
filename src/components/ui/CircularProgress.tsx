'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CircularProgressProps {
  value: number; // 0 to 100
  size?: number; // size in px
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  showText?: boolean;
  label?: string;
  className?: string;
}

/**
 * CircularProgress Component
 * Requirement 16: Animate from 0 -> final percentage with smooth stroke animation (900-1200ms)
 */
export function CircularProgress({
  value,
  size = 72,
  strokeWidth = 6,
  color = '#2E7D4E',
  trackColor = '#E2E8E0',
  showText = true,
  label,
  className = '',
}: CircularProgressProps) {
  const [percent, setPercent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    // If prefers-reduced-motion, set directly
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPercent(Math.min(100, Math.max(0, value)));
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Slight delay to allow smooth initial mount
          setTimeout(() => {
            setPercent(Math.min(100, Math.max(0, value)));
          }, 80);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={containerRef}
      className={`inline-flex flex-col items-center justify-center relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.5}
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{
            transition: 'stroke-dashoffset 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-xs font-bold text-[#18261E] leading-none">{percent}%</span>
          {label && <span className="text-[9px] text-[#4E5C53] font-medium mt-0.5">{label}</span>}
        </div>
      )}
    </div>
  );
}
