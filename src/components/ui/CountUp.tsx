'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number; // ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * CountUp Component
 * Requirement 17: Counts up numbers from 0 -> target when entering viewport.
 * Triggers ONCE via IntersectionObserver.
 * Smooth cubic-out easing between 800-1200ms.
 */
export function CountUp({
  end,
  start = 0,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: CountUpProps) {
  const [value, setValue] = useState(start);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // If reduced motion, jump straight to end
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.unobserve(element);

          const startTime = performance.now();
          const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easedProgress = easeOutCubic(progress);
            const currentVal = start + (end - start) * easedProgress;

            setValue(currentVal);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [end, start, duration]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
