'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number; // in ms
  duration?: number; // in ms
  distance?: string; // e.g., '24px'
  threshold?: number;
  className?: string;
}

/**
 * ScrollReveal Component
 * Requirement 3: Scroll-triggered section reveal
 * Enters viewport: translateY(24px) -> 0, opacity 0 -> 1
 * Triggers intelligently ONCE and does not re-animate repeatedly on scroll.
 * Respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  delay = 0,
  duration = 600,
  distance = '24px',
  threshold = 0.1,
  className = '',
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If reduced motion is preferred, immediately show
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element); // Trigger once only!
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${distance})`,
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
