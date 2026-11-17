'use client';

import React, { useState } from 'react';
import {
  ClassVisualIllustration,
} from './EducationalIllustrations';
import {
  BookOpen,
  ArrowRight,
  Check,
  X,
  Atom,
  Sparkles,
  GraduationCap,
  Globe2,
  PenTool,
} from 'lucide-react';

interface ClassOption {
  number: number;
  badge: string;
  title: string;
  tagline: string;
  subjectsSummary: string;
  highlightColor: string;
  bgLight: string;
}

const CLASS_OPTIONS: ClassOption[] = [
  {
    number: 6,
    badge: 'Middle School Foundation',
    title: 'Class 6',
    tagline: 'Curiosity, patterns, living world, and early history.',
    subjectsSummary: 'Math • Science • Social Science • English • Hindi • Computer',
    highlightColor: '#4F9D69',
    bgLight: '#EEF7F0',
  },
  {
    number: 7,
    badge: 'Conceptual Development',
    title: 'Class 7',
    tagline: 'Equations, organisms, earth systems, and languages.',
    subjectsSummary: 'Math • Science • Social Science • English • Hindi • Computer',
    highlightColor: '#3B82F6',
    bgLight: '#EFF6FF',
  },
  {
    number: 8,
    badge: 'Pre-Secondary Mastery',
    title: 'Class 8',
    tagline: 'Algebra, cellular science, modern history, and coding.',
    subjectsSummary: 'Math • Science • Social Science • English • Hindi • Computer',
    highlightColor: '#8B5CF6',
    bgLight: '#F5F3FF',
  },
  {
    number: 9,
    badge: 'Secondary Core Curriculum',
    title: 'Class 9',
    tagline: 'Motion, atomic structure, global politics, and algorithms.',
    subjectsSummary: 'Math • Science • Social Science • English • Hindi • Computer',
    highlightColor: '#D97706',
    bgLight: '#FEF3C7',
  },
  {
    number: 10,
    badge: 'Board Preparation & Foundation',
    title: 'Class 10',
    tagline: 'Trigonometry, electricity, economy, and advanced coding.',
    subjectsSummary: 'Math • Science • Social Science • English • Hindi • Computer',
    highlightColor: '#EF4444',
    bgLight: '#FEF2F2',
  },
];

interface VisualClassSelectionProps {
  currentClass?: number;
  studentName?: string;
  onSelectClass: (classNumber: number) => Promise<void> | void;
  isOpen: boolean;
  onClose?: () => void;
  allowClose?: boolean;
  skipWelcome?: boolean;
}

export function VisualClassSelection({
  currentClass = 6,
  studentName = 'Learner',
  onSelectClass,
  isOpen,
  onClose,
  allowClose = false,
}: VisualClassSelectionProps) {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!isOpen) return null;

  // Handle class selection with smooth focus animation (Requirement 5)
  const handleSelectClass = async (classNum: number) => {
    if (isTransitioning) return;
    setSelectedClass(classNum);
    setIsTransitioning(true);

    try {
      // 1.3 second education-focused transition
      setTimeout(async () => {
        await onSelectClass(classNum);
        setIsTransitioning(false);
        if (onClose) onClose();
      }, 1300);
    } catch (err) {
      console.error('Error saving class selection:', err);
      setIsTransitioning(false);
    }
  };

  const selectedOption = CLASS_OPTIONS.find((c) => c.number === selectedClass);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F7F2]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 overflow-y-auto selection:bg-[#EEF7F0] selection:text-[#4F9D69]">
      {/* Optional Close Button (only when allowed, e.g. opened from "Change Class") */}
      {allowClose && onClose && !isTransitioning && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white border border-[#E2E8E0] text-[#647067] hover:text-[#25352B] hover:bg-[#EEF7F0] transition-colors cursor-pointer z-50"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-6xl w-full space-y-8 animate-in fade-in duration-300 py-6">
        {/* Header: Exact Title & Subtitle from Requirement 4 */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8E0] text-xs font-bold text-[#4F9D69] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4F9D69]" />
            <span>Welcome, {studentName}!</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25352B] tracking-tight">
            Which class are you in?
          </h1>
          <p className="text-xs sm:text-sm text-[#647067] leading-relaxed">
            Choose your class to personalize your learning journey.
          </p>
        </div>

        {/* 5 Interactive Class Cards (Class 6 to 10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {CLASS_OPTIONS.map((item) => {
            const isSelected = selectedClass === item.number;
            const isOther = isTransitioning && !isSelected;

            return (
              <button
                key={item.number}
                type="button"
                disabled={isTransitioning}
                onClick={() => handleSelectClass(item.number)}
                className={`group text-left p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden bg-white shadow-xs ${
                  isSelected
                    ? 'border-[#4F9D69] ring-4 ring-[#4F9D69]/25 bg-[#F4FBF6] scale-105 sm:scale-110 shadow-xl z-30'
                    : isOther
                    ? 'opacity-25 scale-90 translate-y-3 pointer-events-none'
                    : 'border-[#E2E8E0] hover:border-[#78B98A] hover:-translate-y-1.5 hover:shadow-md'
                }`}
              >
                {/* Top Badge & Selection Check Indicator */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: item.bgLight,
                        color: item.highlightColor,
                        borderColor: `${item.highlightColor}33`,
                      }}
                    >
                      {item.badge}
                    </span>

                    {/* Checkmark Indicator */}
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#4F9D69] text-white flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Educational Illustration */}
                  <div className="my-4 flex items-center justify-center">
                    <div
                      className={`transform transition-transform duration-300 ${
                        isSelected
                          ? 'scale-115 -rotate-2'
                          : 'group-hover:scale-108 group-hover:-rotate-2'
                      }`}
                    >
                      <ClassVisualIllustration classNumber={item.number} />
                    </div>
                  </div>

                  {/* Class Title & Tagline */}
                  <div className="space-y-1 mt-2">
                    <h3
                      className={`text-xl font-extrabold tracking-tight transition-colors ${
                        isSelected ? 'text-[#1B4D2F]' : 'text-[#25352B]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#647067] line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Hint */}
                <div className="pt-4 mt-4 border-t border-[#E2E8E0]/70 flex items-center justify-between text-xs font-bold">
                  <span
                    className={
                      isSelected ? 'text-[#4F9D69]' : 'text-[#647067] group-hover:text-[#4F9D69]'
                    }
                  >
                    {isSelected ? 'Selected' : `Choose Class ${item.number}`}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected
                        ? 'text-[#4F9D69] translate-x-1'
                        : 'text-[#647067] group-hover:translate-x-0.5 group-hover:text-[#4F9D69]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* TRANSITION OVERLAY: "Welcome to Class [X]" / "Let's build your learning journey." (Requirement 5) */}
        {isTransitioning && selectedOption && (
          <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in-95 duration-400 py-4 max-w-md mx-auto">
            {/* Subtle Educational Floating Elements Entering */}
            <div className="flex items-center gap-3 text-[#4F9D69]">
              <div className="p-2 rounded-xl bg-white border border-[#E2E8E0] shadow-xs animate-float-gentle text-xs font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#4F9D69]" />
                <span>Books</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#E2E8E0] shadow-xs animate-float-gentle-alt text-xs font-bold flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-[#D97706]" />
                <span>Pencil</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#E2E8E0] shadow-xs animate-float-gentle text-xs font-bold flex items-center gap-1.5">
                <Atom className="w-4 h-4 text-[#3B82F6]" />
                <span>Science</span>
              </div>
              <div className="p-2 rounded-xl bg-white border border-[#E2E8E0] shadow-xs animate-float-gentle-alt text-xs font-bold flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-[#10B981]" />
                <span>Globe</span>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#25352B] tracking-tight">
                Welcome to {selectedOption.title}
              </h2>
              <p className="text-sm font-semibold text-[#4F9D69]">
                Let&apos;s build your learning journey.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-56 bg-[#E2E8E0] rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#4F9D69] h-full rounded-full w-full animate-pulse transition-all duration-1000" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
