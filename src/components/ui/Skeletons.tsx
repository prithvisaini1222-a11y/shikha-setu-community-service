'use client';

import React from 'react';

/**
 * Requirement 28: Content-matching skeleton loaders with warm shimmer
 */

export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton-shimmer ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Heading Skeleton */}
      <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] space-y-3 shadow-xs">
        <SkeletonBlock className="h-4 w-40 rounded-[6px]" />
        <SkeletonBlock className="h-8 w-64 rounded-[8px]" />
        <SkeletonBlock className="h-3 w-96 rounded-[6px]" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-[16px] border border-[#E2E8E0] space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <SkeletonBlock className="h-3 w-20 rounded-[4px]" />
              <SkeletonBlock className="h-7 w-7 rounded-[8px]" />
            </div>
            <SkeletonBlock className="h-7 w-24 rounded-[6px]" />
            <SkeletonBlock className="h-3 w-32 rounded-[4px]" />
          </div>
        ))}
      </div>

      {/* Main Grid: 2 Large Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[16px] border border-[#E2E8E0] space-y-4 shadow-xs">
          <SkeletonBlock className="h-5 w-48 rounded-[6px]" />
          <SkeletonBlock className="h-64 w-full rounded-[12px]" />
        </div>
        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] space-y-3 shadow-xs">
          <SkeletonBlock className="h-5 w-32 rounded-[6px]" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBlock key={i} className="h-12 w-full rounded-[10px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LearningSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* Left Video / Content Player (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white p-2 rounded-[16px] border border-[#E2E8E0] flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-9 w-28 rounded-[10px]" />
          ))}
        </div>
        {/* Video Player Box */}
        <div className="bg-white rounded-[16px] border border-[#E2E8E0] p-4 space-y-4 shadow-xs">
          <SkeletonBlock className="aspect-video w-full rounded-[12px]" />
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-3/4 rounded-[6px]" />
            <SkeletonBlock className="h-3 w-1/2 rounded-[4px]" />
          </div>
        </div>
      </div>

      {/* Right Sidebar Syllabus (4 cols) */}
      <div className="lg:col-span-4 bg-white p-5 rounded-[16px] border border-[#E2E8E0] space-y-4 shadow-xs">
        <SkeletonBlock className="h-5 w-36 rounded-[6px]" />
        <SkeletonBlock className="h-2 w-full rounded-full" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-14 w-full rounded-[10px]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NeedsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-[16px] border border-[#E2E8E0] p-6 space-y-4 shadow-xs"
        >
          <div className="flex justify-between">
            <SkeletonBlock className="h-5 w-20 rounded-full" />
            <SkeletonBlock className="h-4 w-16 rounded-[4px]" />
          </div>
          <SkeletonBlock className="h-6 w-3/4 rounded-[6px]" />
          <SkeletonBlock className="h-3 w-full rounded-[4px]" />
          <SkeletonBlock className="h-3 w-4/5 rounded-[4px]" />
          <SkeletonBlock className="h-10 w-full rounded-[10px]" />
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between">
              <SkeletonBlock className="h-3 w-16 rounded-[4px]" />
              <SkeletonBlock className="h-3 w-12 rounded-[4px]" />
            </div>
            <SkeletonBlock className="h-2 w-full rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function VolunteerMatchSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      <div className="lg:col-span-7 bg-white p-6 rounded-[16px] border border-[#E2E8E0] space-y-4">
        <SkeletonBlock className="h-6 w-48 rounded-[6px]" />
        <SkeletonBlock className="h-4 w-full rounded-[4px]" />
        <div className="grid grid-cols-5 gap-2 pt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-12 rounded-[10px]" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-5 bg-white p-6 rounded-[16px] border border-[#E2E8E0] space-y-4">
        <SkeletonBlock className="h-6 w-36 rounded-[6px]" />
        <SkeletonBlock className="h-24 w-full rounded-[12px]" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-8 w-full rounded-[8px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
