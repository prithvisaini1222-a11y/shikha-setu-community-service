'use client';

import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    src: '/images/hero.jpg',
    alt: 'Teacher and students collaborating on math lessons with a digital tablet',
  },
  {
    src: '/images/teaching.jpg',
    alt: 'Volunteer educator explaining geometry concepts on a classroom whiteboard',
  },
  {
    src: '/images/stem-science.jpg',
    alt: 'Students and teacher conducting a hands-on science experiment',
  },
  {
    src: '/images/creative-craft.jpg',
    alt: 'Children engaged in creative art and poster projects with their teacher',
  },
  {
    src: '/images/community.jpg',
    alt: 'Teacher reading storybooks outdoors with children in a community setting',
  },
  {
    src: '/images/career.jpg',
    alt: 'Students learning digital computer skills and coding with a mentor',
  },
  {
    src: '/images/donation.jpg',
    alt: 'Volunteer providing books and learning materials to a student',
  },
  {
    src: '/images/library-reading.jpg',
    alt: 'Students and educator celebrating reading achievements in a library',
  },
];

interface EducationPhotoSlideshowProps {
  className?: string;
}

export function EducationPhotoSlideshow({ className = '' }: EducationPhotoSlideshowProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(media.matches);

    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  // 2. Preload all 8 images in browser cache immediately on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    SLIDES.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.src;
    });
  }, []);

  // 3. Reliable 4-second automatic interval (4000ms per image, loops continuously)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((current) => {
        setPrevIdx(current);
        return (current + 1) % SLIDES.length;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none bg-[#FAFBF9] ${className}`}
      aria-roledescription="carousel"
      aria-label="Moments of learning, teaching, and community impact"
    >
      {SLIDES.map((slide, index) => {
        const isCurrent = index === activeIdx;
        const isPrevious = index === prevIdx;

        return (
          <div
            key={slide.src}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              opacity: isCurrent ? 1 : 0,
              zIndex: isCurrent ? 2 : isPrevious ? 1 : 0,
              transition: isReducedMotion
                ? 'none'
                : 'opacity 800ms cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'opacity',
            }}
            aria-hidden={!isCurrent}
          >
            {/* Native img for instant, zero-flicker decoding */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center pointer-events-none select-none"
            />
          </div>
        );
      })}
    </div>
  );
}
