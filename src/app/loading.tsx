import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8F7F2] p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
        {/* Top Header Greeting Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#E2E8E0]/70 rounded-full skeleton-shimmer" />
            <div className="h-8 w-64 bg-[#E2E8E0]/80 rounded-xl skeleton-shimmer" />
            <div className="h-4 w-80 bg-[#E2E8E0]/50 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-10 w-36 bg-[#E2E8E0]/70 rounded-xl skeleton-shimmer self-start sm:self-auto" />
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-[#E2E8E0]/60 rounded-md skeleton-shimmer" />
                <div className="w-8 h-8 rounded-lg bg-[#E2E8E0]/50 skeleton-shimmer" />
              </div>
              <div className="h-7 w-16 bg-[#E2E8E0]/80 rounded-lg skeleton-shimmer" />
              <div className="h-2 w-full bg-[#E2E8E0]/40 rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>

        {/* Main Content Split Skeleton (Featured Card + Secondary Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Card (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E0] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-4">
              <div className="space-y-1.5">
                <div className="h-5 w-48 bg-[#E2E8E0]/70 rounded-lg skeleton-shimmer" />
                <div className="h-3 w-64 bg-[#E2E8E0]/40 rounded-md skeleton-shimmer" />
              </div>
              <div className="h-8 w-24 bg-[#E2E8E0]/50 rounded-lg skeleton-shimmer" />
            </div>

            <div className="space-y-4">
              <div className="h-48 w-full bg-[#FAFBF9] rounded-xl border border-[#E2E8E0]/60 p-4 space-y-3">
                <div className="h-4 w-3/4 bg-[#E2E8E0]/60 rounded skeleton-shimmer" />
                <div className="h-3 w-1/2 bg-[#E2E8E0]/40 rounded skeleton-shimmer" />
                <div className="h-24 w-full bg-[#E2E8E0]/30 rounded-lg skeleton-shimmer mt-4" />
              </div>
            </div>
          </div>

          {/* Side Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-2xs space-y-4">
              <div className="h-5 w-36 bg-[#E2E8E0]/70 rounded-lg skeleton-shimmer" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0]/60 space-y-2">
                    <div className="h-4 w-full bg-[#E2E8E0]/60 rounded skeleton-shimmer" />
                    <div className="h-3 w-2/3 bg-[#E2E8E0]/40 rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
