'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Subject3DVisual } from './Subject3DVisual';
import { SubjectParticleCanvas } from './SubjectParticleCanvas';
import { ChapterJourneyRoadmap } from './ChapterJourneyRoadmap';
import { updateLearnerClassAction } from '@/actions/learning';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  GraduationCap,
  Play,
  CheckCircle2,
  X,
  Compass,
  Award,
  FlaskConical,
  Calculator,
  Globe,
  PenLine,
  Scroll,
} from 'lucide-react';
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

interface SubjectDiscoveryExperienceProps {
  currentClass?: number;
  studentName?: string;
  learnerId?: string;
  subjects: SubjectItem[];
  recentLesson?: any;
  recentVideo?: any;
  learnerProgress?: any[];
}

const INTEREST_OPTIONS = [
  { id: 'sci', label: 'Science & Experiments', icon: FlaskConical, match: 'science' },
  { id: 'math', label: 'Numbers & Puzzles', icon: Calculator, match: 'mathematics' },
  { id: 'eng', label: 'Stories & Language', icon: BookOpen, match: 'english' },
  { id: 'sst', label: 'History & Society', icon: Globe, match: 'social' },
  { id: 'hin', label: 'Literature & Poetry', icon: PenLine, match: 'hindi' },
  { id: 'san', label: 'Ancient Wisdom & Classics', icon: Scroll, match: 'sanskrit' },
];

export function SubjectDiscoveryExperience({
  currentClass: initialClass = 8,
  studentName = 'Aarav',
  learnerId,
  subjects: initialSubjects = [],
  recentLesson,
  recentVideo,
  learnerProgress = [],
}: SubjectDiscoveryExperienceProps) {
  const router = useRouter();

  // Active state
  const [currentClass, setCurrentClass] = useState<number>(initialClass);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [showClassModal, setShowClassModal] = useState<boolean>(false);
  const [isUpdatingClass, setIsUpdatingClass] = useState<boolean>(false);
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  // Subject list fallback if empty
  const defaultSubjects: SubjectItem[] = [
    {
      id: 'sub-sci',
      name: 'Science',
      code: `SCI-${currentClass}`,
      bookName: 'NCERT Science',
      description: 'Explore how the world works, from microscopic cells to the cosmos.',
      chapters: [
        { id: 'ch-s1', chapterNumber: 1, title: 'Crop Production and Management', lessons: [{}, {}], videos: [{}, {}] },
        { id: 'ch-s2', chapterNumber: 2, title: 'Microorganisms: Friend and Foe', lessons: [{}, {}, {}], videos: [{}, {}] },
        { id: 'ch-s3', chapterNumber: 3, title: 'Synthetic Fibres & Plastics', lessons: [{}, {}], videos: [{}, {}] },
        { id: 'ch-s4', chapterNumber: 4, title: 'Materials: Metals and Non-Metals', lessons: [{}, {}], videos: [{}] },
      ],
    },
    {
      id: 'sub-math',
      name: 'Mathematics',
      code: `MATH-${currentClass}`,
      bookName: 'NCERT Mathematics',
      description: 'Master patterns, algebra, geometric reasoning, and logical proofs.',
      chapters: [
        { id: 'ch-m1', chapterNumber: 1, title: 'Rational Numbers', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-m2', chapterNumber: 2, title: 'Linear Equations in One Variable', lessons: [{}, {}, {}], videos: [{}, {}] },
        { id: 'ch-m3', chapterNumber: 3, title: 'Understanding Quadrilaterals', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-m4', chapterNumber: 4, title: 'Data Handling & Probability', lessons: [{}, {}], videos: [{}] },
      ],
    },
    {
      id: 'sub-sst',
      name: 'Social Science',
      code: `SST-${currentClass}`,
      bookName: 'NCERT Our Pasts & Earth',
      description: 'Discover human civilizations, earth geography, and democratic life.',
      chapters: [
        { id: 'ch-ss1', chapterNumber: 1, title: 'Introduction: How, When and Where', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-ss2', chapterNumber: 2, title: 'From Trade to Territory', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-ss3', chapterNumber: 3, title: 'Ruling the Countryside', lessons: [{}, {}], videos: [{}] },
      ],
    },
    {
      id: 'sub-eng',
      name: 'English',
      code: `ENG-${currentClass}`,
      bookName: 'NCERT Honeydew',
      description: 'Explore world literature, storytelling, creative expression, and grammar.',
      chapters: [
        { id: 'ch-e1', chapterNumber: 1, title: 'The Best Christmas Present in the World', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-e2', chapterNumber: 2, title: 'The Tsunami', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-e3', chapterNumber: 3, title: 'Glimpses of the Past', lessons: [{}, {}], videos: [{}] },
      ],
    },
    {
      id: 'sub-hin',
      name: 'Hindi',
      code: `HIN-${currentClass}`,
      bookName: 'NCERT Vasant',
      description: 'Sahitya, kavyadhara, vyakaran, aur bhasha ki saundaryata.',
      chapters: [
        { id: 'ch-h1', chapterNumber: 1, title: 'ध्वनि (सूर्यकांत त्रिपाठी ‘निराला’)', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-h2', chapterNumber: 2, title: 'लाख की चूड़ियाँ (कामतान नाथ)', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-h3', chapterNumber: 3, title: 'बस की यात्रा (हरिशंकर परसाई)', lessons: [{}, {}], videos: [{}] },
      ],
    },
    {
      id: 'sub-san',
      name: 'Sanskrit',
      code: `SAN-${currentClass}`,
      bookName: 'NCERT Ruchira',
      description: 'Prachin sanskriti, shloka gayan, vyakarana bodha, aur naitik mulya.',
      chapters: [
        { id: 'ch-sk1', chapterNumber: 1, title: 'सुभाषितानि (सदाचार श्लोक)', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-sk2', chapterNumber: 2, title: 'बिलस्य वाणी न कदापि मे श्रुता', lessons: [{}, {}], videos: [{}] },
        { id: 'ch-sk3', chapterNumber: 3, title: 'डिजीभारतम् (डिजिटल भारत)', lessons: [{}, {}], videos: [{}] },
      ],
    },
  ];

  const subjects = initialSubjects.length > 0 ? initialSubjects : defaultSubjects;

  const totalSubjects = subjects.length;
  const activeSubject = subjects[activeIndex] || subjects[0];

  // Flanking subjects (Previous and Next)
  const prevIndex = (activeIndex - 1 + totalSubjects) % totalSubjects;
  const nextIndex = (activeIndex + 1) % totalSubjects;
  const prevSubject = subjects[prevIndex];
  const nextSubject = subjects[nextIndex];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSubjects) % totalSubjects);
  }, [totalSubjects]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSubjects);
  }, [totalSubjects]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedSubject) return; // In detail view
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, selectedSubject]);

  // Handle Interest Tag Selection
  const handleSelectInterest = (interest: typeof INTEREST_OPTIONS[0]) => {
    setSelectedInterest(interest.id);
    const targetIdx = subjects.findIndex((s) =>
      s.name.toLowerCase().includes(interest.match)
    );
    if (targetIdx !== -1) {
      setActiveIndex(targetIdx);
    }
  };

  // Handle Subject Selection / Entering Transition
  const handleEnterSubject = (subject: SubjectItem) => {
    setIsEntering(true);
    // 300ms smooth particle convergence and zoom
    setTimeout(() => {
      setSelectedSubject(subject);
      setIsEntering(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 320);
  };

  // Handle Class Switch
  const handleChangeClass = async (newClass: number) => {
    setIsUpdatingClass(true);
    setCurrentClass(newClass);
    await updateLearnerClassAction(newClass);
    setIsUpdatingClass(false);
    setShowClassModal(false);
    confetti({ particleCount: 45, spread: 65, origin: { y: 0.5 } });
    router.refresh();
  };

  // Subject Theme Accent Colors
  const getSubjectColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return { bg: '#E8F5E9', border: '#C8E6C9', text: '#2E7D32', hex: '#4CAF50' };
    if (n.includes('sci')) return { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E88E5', hex: '#3B82F6' };
    if (n.includes('soc') || n.includes('sst')) return { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706', hex: '#F59E0B' };
    if (n.includes('eng')) return { bg: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED', hex: '#8B5CF6' };
    if (n.includes('hin')) return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', hex: '#EF4444' };
    if (n.includes('san')) return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309', hex: '#D97706' };
    return { bg: '#E8F5E9', border: '#C8E6C9', text: '#2E7D32', hex: '#4CAF50' };
  };

  const activeColors = getSubjectColor(activeSubject.name);

  // If learner has entered a subject, render the visual detail & chapter roadmap view
  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] text-[#18261E] pb-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSubject(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E2E8E0] text-xs font-bold text-[#18261E] hover:bg-[#E8F5E9] hover:border-[#2E7D32] hover:text-[#2E7D32] shadow-xs transition-all"
              type="button"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore All Subjects</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#4E5C53]">
                {studentName} • Class {currentClass}
              </span>
              <button
                onClick={() => setShowClassModal(true)}
                className="text-[11px] font-bold text-[#2E7D32] hover:underline px-2 py-0.5 rounded-md bg-[#E8F5E9]"
                type="button"
              >
                Change Class
              </button>
            </div>
          </div>

          {/* Immersive Subject Header with 3D Visual Accent */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E2E8E0] p-6 sm:p-10 shadow-md">
            {/* Ambient Background Glow */}
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ backgroundColor: activeColors.hex }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                  <span
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: activeColors.bg, color: activeColors.text }}
                  >
                    {selectedSubject.code}
                  </span>
                  <span className="text-xs font-semibold text-[#4E5C53]">
                    Class {currentClass} Academic Hub
                  </span>
                  {selectedSubject.bookName && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                      <BookOpen className="w-3 h-3 text-[#16A34A]" /> {selectedSubject.bookName}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18261E] tracking-tight uppercase">
                  {selectedSubject.name}
                </h1>
                <p className="text-sm text-[#4E5C53] leading-relaxed">
                  {selectedSubject.description ||
                    `Comprehensive NCERT curriculum with Magnet Brains video lectures, revision sheets, and quizzes.`}
                </p>
              </div>

              {/* 3D Visual in Header */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 shrink-0 relative">
                <Subject3DVisual
                  subjectType={selectedSubject.name}
                  className="w-full h-full"
                  isHovered={false}
                  isExpanded={true}
                />
              </div>
            </div>
          </div>

          {/* Sequential Chapter Journey Roadmap */}
          <ChapterJourneyRoadmap
            subjectName={selectedSubject.name}
            classNumber={currentClass}
            subjectCode={selectedSubject.code}
            bookName={selectedSubject.bookName}
            chapters={selectedSubject.chapters || []}
            currentChapterNumber={2}
            completedChapterNumbers={[1]}
          />
        </div>
      </div>
    );
  }

  // DISCOVERY STAGE (The Horizon Carousel inspired by Earth Video)
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full bg-[#FCFBF7] text-[#18261E] overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Interactive Particle Canvas Background */}
      <SubjectParticleCanvas
        isConverging={isEntering}
        accentColor={activeColors.hex}
        className="z-0"
      />

      {/* 2. Soft Ambient Horizon Radial Glows */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-40 z-0"
        style={{ backgroundColor: activeColors.hex }}
      />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E8F5E9]/50 blur-3xl pointer-events-none z-0" />

      {/* 3. Top Discovery Bar: Learner Identity + Class Level */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            {studentName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#18261E]">{studentName}</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                Class {currentClass}
              </span>
            </div>
            <span className="text-[11px] text-[#4E5C53]">Personalized Learning Discovery</span>
          </div>
        </div>

        {/* Change Class Quick Action (No tedious dropdowns required) */}
        <button
          onClick={() => setShowClassModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#E8F5E9] border border-[#E2E8E0] text-xs font-semibold text-[#18261E] shadow-2xs transition-all hover:border-[#2E7D32]"
          type="button"
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#2E7D32]" />
          <span>Change Class</span>
        </button>
      </div>

      {/* 4. Center Stage: Title + Interest Tags + Horizon Carousel */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 flex flex-col items-center text-center my-auto py-6">
        {/* Category Badge & Main Heading */}
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-[#2E7D32]">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Subject Discovery</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#18261E] tracking-tight">
            What do you want to explore?
          </h1>

          <p className="text-xs sm:text-sm text-[#4E5C53] font-medium">
            Choose a subject to start learning • NCERT 2026–27 Curriculum
          </p>
        </div>

        {/* Optional Interest Quick Tags (Non-intrusive onboarding) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4 pb-2 max-w-3xl">
          {INTEREST_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected =
              selectedInterest === opt.id ||
              activeSubject.name.toLowerCase().includes(opt.match);
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectInterest(opt)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  isSelected
                    ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs scale-105'
                    : 'bg-white/80 hover:bg-white text-[#4E5C53] border-[#E2E8E0] hover:border-[#2E7D32]'
                }`}
                type="button"
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#2E7D32]'}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* 5. Horizon Carousel Stage (The signature Earth-video inspired layout) */}
        <div className="w-full relative flex flex-col items-center justify-center mt-4">
          {/* Flanking Left Subject Preview Button */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#E2E8E0] shadow-sm hover:shadow-md transition-all group active:scale-95"
            type="button"
            aria-label={`Previous subject: ${prevSubject.name}`}
          >
            <ChevronLeft className="w-5 h-5 text-[#4E5C53] group-hover:text-[#2E7D32] transition-transform group-hover:-translate-x-0.5" />
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-[#4E5C53] block uppercase tracking-wider">Previous</span>
              <span className="text-xs font-bold text-[#18261E] group-hover:text-[#2E7D32] transition-colors">
                {prevSubject.name}
              </span>
            </div>
          </button>

          {/* Flanking Right Subject Preview Button */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-white/90 hover:bg-white border border-[#E2E8E0] shadow-sm hover:shadow-md transition-all group active:scale-95"
            type="button"
            aria-label={`Next subject: ${nextSubject.name}`}
          >
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-[#4E5C53] block uppercase tracking-wider">Next</span>
              <span className="text-xs font-bold text-[#18261E] group-hover:text-[#2E7D32] transition-colors">
                {nextSubject.name}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#4E5C53] group-hover:text-[#2E7D32] transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Center Active Subject Presentation */}
          <div className="flex flex-col items-center space-y-3 max-w-lg mx-auto w-full px-4">
            <span
              className="text-xs font-extrabold uppercase tracking-widest px-3 py-0.5 rounded-full"
              style={{ backgroundColor: activeColors.bg, color: activeColors.text }}
            >
              {activeSubject.code}
            </span>

            {/* Massive Subject Name with Clean Editorial Hierarchy */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#18261E] tracking-tight uppercase">
              {activeSubject.name}
            </h2>

            {/* Concise 1-Line Description */}
            <p className="text-xs sm:text-sm text-[#4E5C53] font-medium leading-relaxed max-w-md">
              {activeSubject.description}
            </p>

            {/* Metadata & Progress Pill */}
            <div className="flex items-center gap-2 text-xs text-[#4E5C53] pt-1">
              <span className="font-semibold">
                {activeSubject.chapters?.length || 12} Chapters
              </span>
              <span>•</span>
              <span className="text-[#2E7D32] font-bold">Class {currentClass}</span>
              {activeSubject.bookName && (
                <>
                  <span>•</span>
                  <span className="italic">{activeSubject.bookName}</span>
                </>
              )}
            </div>

            {/* Call to Action Button */}
            <div className="pt-2">
              <button
                onClick={() => handleEnterSubject(activeSubject)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 group"
                type="button"
              >
                <span>Explore Subject</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* 6. The Bottom Horizon: Massive Interactive 3D Visual (Rising like Earth in reference video) */}
          <div
            onClick={() => handleEnterSubject(activeSubject)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full max-w-xl h-72 sm:h-80 md:h-96 relative mt-2 cursor-pointer group"
          >
            <Subject3DVisual
              subjectType={activeSubject.name}
              className="w-full h-full"
              isHovered={isHovered}
              isExpanded={isEntering}
            />

            {/* Subtle Horizon Glow Ring */}
            <div className="absolute inset-x-8 bottom-4 h-1 rounded-full bg-gradient-to-r from-transparent via-[#4CAF50]/40 to-transparent blur-xs pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 7. Bottom Personalized Bar: "Because you enjoy..." (If recent learning exists) */}
      {recentLesson && (
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6">
          <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2E8E0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] block">
                  Because you enjoy learning
                </span>
                <p className="text-xs font-bold text-[#18261E]">
                  Continue: {recentLesson.title || 'Linear Equations — Lesson 3'}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleEnterSubject(activeSubject)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#256629] transition-all shrink-0"
              type="button"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 8. Class Switching Modal */}
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
                          {num === 6
                            ? 'Middle School Foundation (Ganita Prakash & Curiosity)'
                            : num === 8
                              ? 'Pre-Secondary Conceptual Mastery'
                              : num === 10
                                ? 'Board Preparation & Advanced Foundations'
                                : 'Core Academic Subjects'}
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
