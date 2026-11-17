'use client';

import React, { useRef, useState, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface AnimatedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
}

/**
 * AnimatedTabs Component
 * Requirement 13: Smooth sliding active indicator underline/pill for tabs
 */
export function AnimatedTabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className = '',
}: AnimatedTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(`[data-tab-id="${activeTab}"]`) as HTMLElement;
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center overflow-x-auto select-none no-scrollbar ${
        variant === 'underline'
          ? 'border-b border-[#E2E8E0]'
          : 'bg-[#F8FAF8] p-1 rounded-[12px] border border-[#E2E8E0]'
      } ${className}`}
    >
      {/* Sliding Active Indicator */}
      <div
        className={`absolute pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          variant === 'underline'
            ? 'bottom-0 h-[2px] bg-[#2E7D4E]'
            : 'top-1 bottom-1 bg-white rounded-[10px] shadow-xs border border-[#E2E8E0]'
        }`}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
        }}
      />

      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
              isActive
                ? variant === 'underline'
                  ? 'text-[#1B4D2F]'
                  : 'text-[#18261E]'
                : 'text-[#4E5C53] hover:text-[#18261E]'
            }`}
          >
            {Icon && (
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#2E7D4E]' : 'text-[#7E8C82]'
                }`}
              />
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                  isActive
                    ? 'bg-[#EBF5EE] text-[#1B4D2F] border border-[#C6E6CD]'
                    : 'bg-[#F8FAF8] text-[#7E8C82] border border-[#E2E8E0]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
