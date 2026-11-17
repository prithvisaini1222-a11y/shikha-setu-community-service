'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubjectSpatialCardArtwork } from './SubjectSpatialCardArtwork';
import { SubjectLearningContentView } from './SubjectLearningContentView';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Compass,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  X,
  BookOpen,
  Atom,
  Globe2,
  Languages,
  Scroll,
  Calculator,
} from 'lucide-react';
import { updateLearnerClassAction } from '@/actions/learning';
import confetti from 'canvas-confetti';

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  bookName?: string | null;
  description?: string | null;
  chapters?: any[];
  color?: string | null;
}

interface SubjectSpatialExplorerProps {
  subjects: SubjectItem[];
  currentClass: number;
  studentName?: string;
  onSubjectSelect?: (subject: SubjectItem) => void;
  recentLecture?: any;
  completedVideoIds?: string[];
  progressMap?: Record<string, number>;
}

// 6 Canonical Subjects matching the reference video and prompt diagram:
//                SCIENCE (Top)
//      ENGLISH (Top-Left)     SOCIAL SCIENCE (Top-Right)
//             MATHEMATICS (Main Focus)
//        HINDI (Bottom-Left)   SANSKRIT (Bottom-Right)
const CANONICAL_ORDER = [
  'mathematics',
  'science',
  'social science',
  'sanskrit',
  'hindi',
  'english',
];

export function SubjectSpatialExplorer({
  subjects = [],
  currentClass: initialClass = 8,
  studentName = 'Learner',
  onSubjectSelect,
  recentLecture,
  completedVideoIds = [],
  progressMap = {},
}: SubjectSpatialExplorerProps) {
  const [currentClass, setCurrentClass] = useState<number>(initialClass);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTransitioningToSubject, setIsTransitioningToSubject] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [showClassModal, setShowClassModal] = useState<boolean>(false);
  const [isUpdatingClass, setIsUpdatingClass] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(1200);

  // Track window width for responsive 3D spatial scaling
  useEffect(() => {
    const updateWidth = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Responsive spatial multiplier
  const spatialScaleFactor = useMemo(() => {
    if (windowWidth < 640) return 0.52;
    if (windowWidth < 1024) return 0.76;
    return 1.0;
  }, [windowWidth]);

  // Default fallback subjects if database list is empty
  const defaultSubjects: SubjectItem[] = useMemo(
    () => [
      {
        id: 'sub-math',
        name: 'Mathematics',
        code: `MATH-${currentClass}`,
        bookName: 'NCERT Mathematics',
        description: 'Explore numbers, patterns and problem solving',
        chapters: [],
      },
      {
        id: 'sub-sci',
        name: 'Science',
        code: `SCI-${currentClass}`,
        bookName: 'NCERT Science',
        description: 'Discover how the world works',
        chapters: [],
      },
      {
        id: 'sub-sst',
        name: 'Social Science',
        code: `SST-${currentClass}`,
        bookName: 'NCERT Social Science',
        description: 'Explore people, places and the past',
        chapters: [],
      },
      {
        id: 'sub-san',
        name: 'Sanskrit',
        code: `SAN-${currentClass}`,
        bookName: 'NCERT Sanskrit',
        description: 'Explore classical language and knowledge',
        chapters: [],
      },
      {
        id: 'sub-hin',
        name: 'Hindi',
        code: `HIN-${currentClass}`,
        bookName: 'NCERT Hindi',
        description: 'भाषा, साहित्य और रचनात्मक लेखन',
        chapters: [],
      },
      {
        id: 'sub-eng',
        name: 'English',
        code: `ENG-${currentClass}`,
        bookName: 'NCERT English',
        description: 'Read, write and discover stories',
        chapters: [],
      },
    ],
    [currentClass]
  );

  // Normalize and arrange subjects to match canonical 6-way orbital constellation
  const activeSubjects: SubjectItem[] = useMemo(() => {
    const list = subjects.length > 0 ? [...subjects] : [...defaultSubjects];
    
    // Sort according to CANONICAL_ORDER
    const ordered: SubjectItem[] = [];
    CANONICAL_ORDER.forEach((key) => {
      const found = list.find((s) => s.name.toLowerCase().includes(key));
      if (found) {
        ordered.push(found);
      } else {
        const fallback = defaultSubjects.find((d) => d.name.toLowerCase().includes(key));
        if (fallback) ordered.push(fallback);
      }
    });

    // Add any remaining subjects not in canonical list
    list.forEach((s) => {
      if (!ordered.some((o) => o.id === s.id || o.name.toLowerCase() === s.name.toLowerCase())) {
        ordered.push(s);
      }
    });

    return ordered.slice(0, 6);
  }, [subjects, defaultSubjects]);

  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const total = activeSubjects.length;

  const handlePrev = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsNavigating(false), 620);
  }, [isNavigating, total]);

  const handleNext = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setActiveIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsNavigating(false), 620);
  }, [isNavigating, total]);

  // Keyboard navigation (← / → / ↑ / ↓)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedSubject || isNavigating) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleNext();
      if (e.key === 'Enter') handleCardClick(activeIndex);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, selectedSubject, activeIndex, isNavigating]);

  // Click on any subject
  const handleCardClick = (index: number) => {
    if (isNavigating) return;
    if (index === activeIndex) {
      // Enter subject with spatial zoom transition into learning content
      const chosen = activeSubjects[index];
      setIsTransitioningToSubject(true);

      setTimeout(() => {
        setSelectedSubject(chosen);
        setIsTransitioningToSubject(false);
        if (onSubjectSelect) {
          onSubjectSelect(chosen);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    } else {
      // Fly camera to the clicked subject
      setIsNavigating(true);
      setActiveIndex(index);
      setTimeout(() => setIsNavigating(false), 620);
    }
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
  };

  const handleChangeClass = async (newClass: number) => {
    setIsUpdatingClass(true);
    setCurrentClass(newClass);
    await updateLearnerClassAction(newClass);
    setIsUpdatingClass(false);
    setShowClassModal(false);
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.5 } });
    if (typeof window !== 'undefined') {
      window.location.href = `/learn/${newClass}`;
    }
  };

  // If a subject is selected, smoothly render the subject's learning content view
  if (selectedSubject) {
    const subjProgress = progressMap[selectedSubject.name] || progressMap[selectedSubject.code] || 0;
    return (
      <SubjectLearningContentView
        subjectName={selectedSubject.name}
        subjectCode={selectedSubject.code}
        bookName={selectedSubject.bookName}
        currentClass={currentClass}
        chapters={selectedSubject.chapters || []}
        progressPercentage={subjProgress}
        recentLecture={recentLecture}
        completedVideoIds={completedVideoIds}
        onBackToSubjects={handleBackToSubjects}
      />
    );
  }

  // Active card progress & details
  const activeSubjectItem = activeSubjects[activeIndex] || activeSubjects[0];
  const activeProgress =
    progressMap[activeSubjectItem.name] || progressMap[activeSubjectItem.code] || 0;

  // 3D SPATIAL SLOTS CONFIGURATION
  // Matches the user's diagram & reference video frames:
  // relIndex 0: Center Foreground Main Focus
  // relIndex 1: Top Center (Far Background)
  // relIndex 2: Top Right (Mid Background)
  // relIndex 3: Bottom Right (Mid Foreground)
  // relIndex 4: Bottom Left (Mid Foreground)
  // relIndex 5: Top Left (Mid Background)
  const getSpatialSlot = (relIndex: number) => {
    switch (relIndex) {
      case 0:
        return {
          x: 0,
          y: 20 * spatialScaleFactor,
          z: 140,
          scale: 1.0,
          rotateX: -2,
          rotateY: 0,
          rotateZ: 0,
          opacity: 1.0,
          filter: 'blur(0px)',
          zIndex: 50,
          isFocus: true,
        };
      case 1: // Top Center (Science when Math is focus)
        return {
          x: 0,
          y: -270 * spatialScaleFactor,
          z: -380,
          scale: 0.44,
          rotateX: 14,
          rotateY: 0,
          rotateZ: 0,
          opacity: 0.72,
          filter: 'blur(2px)',
          zIndex: 15,
          isFocus: false,
        };
      case 2: // Top Right (Social Science when Math is focus)
        return {
          x: 480 * spatialScaleFactor,
          y: -140 * spatialScaleFactor,
          z: -240,
          scale: 0.52,
          rotateX: 8,
          rotateY: -22,
          rotateZ: -2,
          opacity: 0.78,
          filter: 'blur(1.5px)',
          zIndex: 22,
          isFocus: false,
        };
      case 3: // Bottom Right (Sanskrit when Math is focus)
        return {
          x: 430 * spatialScaleFactor,
          y: 190 * spatialScaleFactor,
          z: -80,
          scale: 0.60,
          rotateX: -6,
          rotateY: -16,
          rotateZ: 2,
          opacity: 0.88,
          filter: 'blur(0.8px)',
          zIndex: 35,
          isFocus: false,
        };
      case 4: // Bottom Left (Hindi when Math is focus)
        return {
          x: -430 * spatialScaleFactor,
          y: 190 * spatialScaleFactor,
          z: -80,
          scale: 0.60,
          rotateX: -6,
          rotateY: 16,
          rotateZ: -2,
          opacity: 0.88,
          filter: 'blur(0.8px)',
          zIndex: 35,
          isFocus: false,
        };
      case 5: // Top Left (English when Math is focus)
        return {
          x: -480 * spatialScaleFactor,
          y: -140 * spatialScaleFactor,
          z: -240,
          scale: 0.52,
          rotateX: 8,
          rotateY: 22,
          rotateZ: 2,
          opacity: 0.78,
          filter: 'blur(1.5px)',
          zIndex: 22,
          isFocus: false,
        };
      default:
        return {
          x: 0,
          y: 0,
          z: -500,
          scale: 0.3,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          opacity: 0,
          filter: 'blur(4px)',
          zIndex: 5,
          isFocus: false,
        };
    }
  };

  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return <Calculator className="w-3.5 h-3.5" />;
    if (n.includes('sci')) return <Atom className="w-3.5 h-3.5" />;
    if (n.includes('soc') || n.includes('sst')) return <Globe2 className="w-3.5 h-3.5" />;
    if (n.includes('eng')) return <BookOpen className="w-3.5 h-3.5" />;
    if (n.includes('hin')) return <Languages className="w-3.5 h-3.5" />;
    if (n.includes('san')) return <Scroll className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
  };

  return (
    <div className="relative min-h-[calc(100vh-75px)] w-full bg-[#FAF8F5] text-[#18261E] overflow-hidden flex flex-col justify-between select-none py-4 sm:py-6">
      {/* 1. Subtle Ambient Studio Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-b from-[#E8F5E9]/50 via-[#E3F2FD]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 2. Top Header Bar: Learner Class & Info */}
      <div className="relative z-30 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#18261E]">{studentName}</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                Class {currentClass}
              </span>
            </div>
            <span className="text-[11px] text-[#4E5C53]">Spatial Curriculum Discovery</span>
          </div>
        </div>

        {/* Change Class Action */}
        <button
          onClick={() => setShowClassModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#E8F5E9] border border-[#E2E8E0] text-xs font-semibold text-[#18261E] shadow-2xs transition-all hover:border-[#2E7D32] cursor-pointer"
          type="button"
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Change Class</span>
        </button>
      </div>

      {/* 3. Center Section: 3D SPATIAL FIELD (Reference: Educational_subjects_spatial_exp) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 flex flex-col items-center my-auto">
        {/* Spatial Carousel Viewport with 1600px Perspective */}
        <div className="relative w-full h-[480px] sm:h-[540px] md:h-[580px] lg:h-[620px] flex items-center justify-center [perspective:1600px] [perspective-origin:50%_45%]">
          {/* Navigation Chevron Left */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-40 w-11 h-11 rounded-full bg-white/90 hover:bg-white border border-[#E2E8E0] shadow-lg flex items-center justify-center text-[#18261E] hover:text-[#2E7D32] transition-all cursor-pointer active:scale-95 hover:scale-105"
            type="button"
            aria-label="Previous Subject"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Chevron Right */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 w-11 h-11 rounded-full bg-white/90 hover:bg-white border border-[#E2E8E0] shadow-lg flex items-center justify-center text-[#18261E] hover:text-[#2E7D32] transition-all cursor-pointer active:scale-95 hover:scale-105"
            type="button"
            aria-label="Next Subject"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 3D Constellation Orbit Container */}
          <div className="relative w-full h-full flex items-center justify-center [transform-style:preserve-3d]">
            {activeSubjects.map((subject, index) => {
              // Calculate relative offset in 6-subject orbit: 0, 1, 2, 3, 4, 5
              const relIndex = (index - activeIndex + total) % total;
              const slot = getSpatialSlot(relIndex);
              const isActive = slot.isFocus;

              return (
                <motion.div
                  key={subject.id || subject.name}
                  onClick={() => handleCardClick(index)}
                  className="absolute w-[320px] sm:w-[560px] md:w-[700px] lg:w-[820px] h-[190px] sm:h-[320px] md:h-[400px] lg:h-[460px] rounded-[32px] overflow-hidden cursor-pointer shadow-[0_16px_40px_rgba(0,0,0,0.06)] border border-[#E8ECE6]"
                  style={{
                    zIndex: slot.zIndex,
                    filter: slot.filter,
                  }}
                  animate={{
                    x: slot.x,
                    y: slot.y,
                    z: isTransitioningToSubject && isActive ? slot.z + 240 : slot.z,
                    scale: isTransitioningToSubject && isActive ? 1.25 : slot.scale,
                    opacity: isTransitioningToSubject && !isActive ? 0 : slot.opacity,
                    rotateX: slot.rotateX,
                    rotateY: slot.rotateY,
                    rotateZ: slot.rotateZ,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                  }}
                  whileHover={
                    isActive
                      ? {
                          scale: 1.02,
                        }
                      : {
                          scale: slot.scale * 1.05,
                        }
                  }
                >
                  {/* Full Rich Diorama Artwork matching reference video */}
                  <SubjectSpatialCardArtwork
                    subjectName={subject.name}
                    className="w-full h-full"
                  />

                  {/* Active Foreground Badge & Enter Pill */}
                  {isActive && (
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(index);
                        }}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-102 active:scale-98"
                        type="button"
                      >
                        <span>Enter {subject.name} World</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Non-active click indicator overlay */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
                      <div className="opacity-0 hover:opacity-100 transition-opacity bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xs">
                        Click to Focus
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 4. Reflective Studio Floor with Pedestal (Matching reference video) */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-[340px] sm:w-[560px] md:w-[740px] h-[32px] sm:h-[44px] rounded-[100%] bg-gradient-to-b from-[#A5D6A7]/40 via-[#81C784]/25 to-transparent blur-md pointer-events-none z-0 transform -rotate-x-12" />

          {/* Studio Floor Slogan Reflection: "Explore. Learn. Discover." */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
            <span className="text-[13px] sm:text-[15px] font-black tracking-widest text-[#2E7D32]/30 uppercase">
              Explore • Learn • Discover
            </span>
          </div>
        </div>
      </div>

      {/* 5. Bottom Quick Subject Pills (Allows instant camera travel to any subject) */}
      <div className="relative z-30 max-w-2xl mx-auto w-full px-4 flex flex-wrap items-center justify-center gap-2 pt-3 pb-1">
        {activeSubjects.map((s, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={s.id || s.name}
              onClick={() => setActiveIndex(idx)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                isCurrent
                  ? 'bg-[#1B5E20] text-white shadow-xs scale-105'
                  : 'bg-white hover:bg-[#F8FAF8] text-[#37474F] hover:text-[#18261E] border border-[#E2E8E0]'
              }`}
              type="button"
            >
              {getSubjectIcon(s.name)}
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>

      {/* 6. Class Switching Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E2E8E0] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-[#18261E]">Select Academic Class</h3>
                <p className="text-xs text-[#4E5C53]">
                  Updates your subjects, syllabus, videos, and quizzes.
                </p>
              </div>
              <button
                onClick={() => setShowClassModal(false)}
                className="p-1.5 rounded-lg text-[#4E5C53] hover:bg-[#F4F7F4] transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {[6, 7, 8, 9, 10].map((num) => {
                const isCurrent = num === currentClass;
                return (
                  <button
                    key={num}
                    onClick={() => handleChangeClass(num)}
                    disabled={isUpdatingClass}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-[#2E7D32] bg-[#E8F5E9]/50 shadow-xs'
                        : 'border-[#E2E8E0] hover:border-[#2E7D32] hover:bg-[#F8FAF8]'
                    }`}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                          isCurrent
                            ? 'bg-[#2E7D32] text-white'
                            : 'bg-[#F4F7F4] text-[#18261E]'
                        }`}
                      >
                        {num}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-[#18261E] block">
                          Class {num} Curriculum
                        </span>
                        <span className="text-[11px] text-[#4E5C53]">
                          NCERT 2026–27 Core Subjects
                        </span>
                      </div>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
