'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

/**
 * Tooltip Component
 * Requirement 9 & 38: Polished tooltips & popovers with fade + scale entrance.
 * Does not use browser defaults.
 */
export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 150,
  className = '',
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-50 px-3 py-1.5 text-[11px] font-medium text-[#18261E] bg-white border border-[#E2E8E0] rounded-[8px] shadow-md whitespace-nowrap pointer-events-none tooltip-anim ${positionStyles[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Popover Component
 * Requirement 9 & 10: Rich interactive popup (e.g. "Why 92% match?")
 */
export function Popover({
  trigger,
  children,
  title,
  className = '',
  position = 'bottom',
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-0 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div ref={popoverRef} className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none inline-flex items-center"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute z-50 w-64 bg-white border border-[#E2E8E0] rounded-[12px] p-3.5 shadow-lg dropdown-anim ${positionStyles[position]} ${className}`}
        >
          {title && (
            <div className="text-xs font-bold text-[#18261E] pb-2 border-b border-[#E2E8E0] mb-2 flex items-center justify-between">
              <span>{title}</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#7E8C82] hover:text-[#18261E] p-0.5 rounded cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="text-xs text-[#4E5C53] leading-relaxed">{children}</div>
        </div>
      )}
    </div>
  );
}
