'use client';

import React, { useRef, useEffect } from 'react';

interface HeroVideoVisualProps {
  className?: string;
}

export function HeroVideoVisual({ className = '' }: HeroVideoVisualProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Hero video autoplay notice:', err?.message || err);
        });
      }
    }
  }, []);

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl flex items-center justify-center select-none bg-[#F7FAF8] ${className}`}
      aria-label="Community Educational Network Motion Visual"
    >
      <video
        ref={videoRef}
        src="/Revise_video_branding_and_remove…_20260922141910.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        className="w-full h-full object-cover select-none pointer-events-none scale-110 origin-[40%_35%]"
      >
        <source
          src="/Revise_video_branding_and_remove…_20260922141910.mp4"
          type="video/mp4"
        />
        <source
          src="/hero-video.mp4"
          type="video/mp4"
        />
        <source
          src="/videos/Revise_video_branding_and_remove…_20260922141910.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
