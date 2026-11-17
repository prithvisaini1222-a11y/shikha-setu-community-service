'use client';

import React from 'react';

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#EEF2EC] rounded-md before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent ${className}`}
    />
  );
}

export function LearningCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E4E7E1] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Shimmer className="w-10 h-10 rounded-xl" />
        <Shimmer className="w-16 h-5 rounded-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="w-3/4 h-5 rounded" />
        <Shimmer className="w-full h-3.5 rounded" />
      </div>
      <div className="pt-2 border-t border-[#E4E7E1] flex items-center justify-between">
        <Shimmer className="w-20 h-4 rounded" />
        <Shimmer className="w-6 h-6 rounded-full" />
      </div>
    </div>
  );
}

export function NeedCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E4E7E1] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Shimmer className="w-24 h-5 rounded-full" />
        <Shimmer className="w-16 h-4 rounded" />
      </div>
      <div className="space-y-2">
        <Shimmer className="w-4/5 h-6 rounded" />
        <Shimmer className="w-full h-4 rounded" />
        <Shimmer className="w-2/3 h-4 rounded" />
      </div>
      <div className="space-y-1.5 pt-2">
        <div className="flex justify-between">
          <Shimmer className="w-16 h-3 rounded" />
          <Shimmer className="w-10 h-3 rounded" />
        </div>
        <Shimmer className="w-full h-2 rounded-full" />
      </div>
      <Shimmer className="w-full h-10 rounded-xl mt-2" />
    </div>
  );
}

export function ChartWidgetSkeleton() {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E4E7E1] space-y-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Shimmer className="w-32 h-5 rounded" />
          <Shimmer className="w-48 h-3 rounded" />
        </div>
        <Shimmer className="w-20 h-7 rounded-lg" />
      </div>
      <Shimmer className="w-full h-48 rounded-xl" />
      <div className="grid grid-cols-3 gap-3 pt-2">
        <Shimmer className="h-12 rounded-xl" />
        <Shimmer className="h-12 rounded-xl" />
        <Shimmer className="h-12 rounded-xl" />
      </div>
    </div>
  );
}
