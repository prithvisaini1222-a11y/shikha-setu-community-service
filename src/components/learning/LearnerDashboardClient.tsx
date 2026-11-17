'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateLearnerClassAction } from '@/actions/learning';
import { VisualClassSelection } from './VisualClassSelection';
import { LearnerCollapsibleSidebar } from './LearnerCollapsibleSidebar';
import { SubjectSpatialExplorer, SubjectItem } from './SubjectSpatialExplorer';
import { SubjectLearningContentView, LectureItem } from './SubjectLearningContentView';
import { LearnerPracticeView, QuizItem } from './LearnerPracticeView';
import { LearnerDoubtsView, DoubtItem } from './LearnerDoubtsView';
import { LearnerProfileView } from './LearnerProfileView';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Video,
  Clock,
  CheckCircle2,
  Bookmark,
  Calendar,
  Layers,
  GraduationCap,
  Play,
  Compass,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearnerDashboardClientProps {
  currentClass: number;
  studentName: string;
  learnerId?: string;
  learnerProfile?: {
    displayName?: string;
    rollAlias?: string;
    institutionName?: string;
    streakDays?: number;
    classLevel?: number;
  };
  subjects: any[];
  recentVideo?: any;
  recentLecture?: any;
  recentLesson?: any;
  videoProgress?: any[];
  completedVideoIds?: string[];
  progressMap?: Record<string, number>;
  savedVideos?: any[];
  upcomingSessions?: any[];
  doubts?: DoubtItem[];
  quizzes?: QuizItem[];
  initialShowSelection?: boolean;
}

export function LearnerDashboardClient({
  currentClass: initialClass,
  studentName,
  learnerId,
  learnerProfile,
  subjects = [],
  recentVideo,
  recentLecture,
  recentLesson,
  videoProgress = [],
  completedVideoIds = [],
  progressMap = {},
  savedVideos = [],
  upcomingSessions = [],
  doubts = [],
  quizzes = [],
  initialShowSelection = false,
}: LearnerDashboardClientProps) {
  const router = useRouter();
  const [currentClass, setCurrentClass] = useState<number>(initialClass);
  const [showClassSelection, setShowClassSelection] = useState<boolean>(initialShowSelection);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('my-learning');

  // Currently selected subject for direct learning workspace
  const [activeSubject, setActiveSubject] = useState<SubjectItem | null>(null);

  // Handle class selection
  const handleSelectClass = async (classNum: number) => {
    setIsUpdating(true);
    setCurrentClass(classNum);
    await updateLearnerClassAction(classNum);
    setShowClassSelection(false);
    setIsUpdating(false);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    router.refresh();
  };

  // Convert subjects to SubjectItem format
  const formattedSubjects: SubjectItem[] = subjects.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    bookName: s.bookName,
    description: s.description,
    chapters: s.chapters || [],
    color: s.color,
  }));

  // Handle Continue Learning CTA click
  const handleContinueLearning = () => {
    if (recentLecture && recentLecture.subjectName) {
      const match = formattedSubjects.find((s) =>
        s.name.toLowerCase().includes(recentLecture.subjectName.toLowerCase())
      );
      if (match) {
        setActiveSubject(match);
        return;
      }
    }
    if (formattedSubjects.length > 0) {
      setActiveSubject(formattedSubjects[0]);
    }
  };

  // Real learner progress data
  const hasProgress = Boolean(recentLecture || videoProgress.length > 0 || recentLesson);
  const activeLectureTitle =
    recentLecture?.title || recentVideo?.title || recentLesson?.title || 'Foundations of Class ' + currentClass;
  const activeSubjectName =
    recentLecture?.subjectName || recentVideo?.chapter?.subject?.name || subjects[0]?.name || 'Mathematics';
  const activeChapterNumber =
    recentLecture?.chapterNumber || recentVideo?.chapter?.chapterNumber || 1;
  const activeChapterTitle =
    recentLecture?.chapterTitle || recentVideo?.chapter?.title || recentLesson?.chapter?.title || 'Core Concepts';
  const activeProgressPercentage =
    recentLecture?.progressPercentage ||
    (videoProgress[0] ? Math.round(videoProgress[0].progressPercentage || 0) : 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18261E] flex flex-col">
      {/* Visual Class Selection Overlay */}
      <VisualClassSelection
        isOpen={showClassSelection}
        currentClass={currentClass}
        studentName={studentName}
        onSelectClass={handleSelectClass}
        onClose={() => setShowClassSelection(false)}
        allowClose={true}
        skipWelcome={!initialShowSelection}
      />

      {/* Main Workspace Layout: Professional Collapsible Sidebar + Main Content */}
      <div className="flex-1 flex w-full relative">
        {/* 1. PROFESSIONAL COLLAPSIBLE SIDEBAR (Controlled strictly by click — NO hover auto-collapse) */}
        <LearnerCollapsibleSidebar
          currentClass={currentClass}
          studentName={studentName}
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* 2. MAIN LEARNING WORKSPACE AREA (Smoothly gains/adjusts space with no overlap or horizontal scroll) */}
        <main className="flex-1 min-w-0 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-8">
          {activeSection === 'practice' ? (
            <LearnerPracticeView
              quizzes={quizzes}
              subjects={formattedSubjects}
              currentClass={currentClass}
              onSelectSubject={(subj) => {
                setActiveSubject(subj);
                setActiveSection('my-learning');
              }}
            />
          ) : activeSection === 'doubts' ? (
            <LearnerDoubtsView
              doubts={doubts}
              subjects={formattedSubjects}
              currentClass={currentClass}
            />
          ) : activeSection === 'profile' ? (
            <LearnerProfileView
              currentClass={currentClass}
              studentName={studentName}
              learnerProfile={learnerProfile}
              onChangeClass={() => setShowClassSelection(true)}
            />
          ) : activeSubject ? (
            <SubjectLearningContentView
              subjectName={activeSubject.name}
              subjectCode={activeSubject.code}
              bookName={activeSubject.bookName}
              currentClass={currentClass}
              chapters={activeSubject.chapters || []}
              progressPercentage={progressMap[activeSubject.name] || 0}
              recentLecture={recentLecture}
              completedVideoIds={completedVideoIds}
              onBackToSubjects={() => setActiveSubject(null)}
            />
          ) : (
            <>
              {/* B. MY LEARNING HOME HEADER */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
                {/* Subtle Ambient Studio Accents */}
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#E8F5E9]/50 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#E3F2FD]/30 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                        <GraduationCap className="w-3.5 h-3.5" />
                        Class {currentClass}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowClassSelection(true)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-[#4E5C53] bg-[#FAFBF9] border border-[#E2E8E0] hover:text-[#2E7D32] hover:border-[#C8E6C9] transition-colors cursor-pointer"
                      >
                        Change Class
                      </button>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#18261E] tracking-tight">
                      My Learning
                    </h1>
                    <p className="text-sm sm:text-base text-[#4E5C53] font-medium">
                      Continue where you left off.
                    </p>
                  </div>

                  {/* Summary Badges */}
                  <div className="flex items-center gap-3 bg-[#FAFBF9] p-3.5 rounded-2xl border border-[#E2E8E0] shrink-0">
                    <div className="text-center px-3 border-r border-[#E2E8E0]">
                      <span className="text-2xl font-black text-[#18261E] block">
                        {subjects.length || 6}
                      </span>
                      <span className="text-[10px] font-bold text-[#4E5C53] uppercase tracking-wider">
                        Subjects
                      </span>
                    </div>
                    <div className="text-center px-3">
                      <span className="text-2xl font-black text-[#2E7D32] block">
                        {subjects.reduce((acc, s) => acc + (s.chapters?.length || 0), 0) || 48}
                      </span>
                      <span className="text-[10px] font-bold text-[#4E5C53] uppercase tracking-wider">
                        Chapters
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* C. CONTINUE LEARNING (Real Learner Progress) */}
              <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-5">
                {hasProgress ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E0]/80 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#E8F5E9] text-[#2E7D32]">
                            <Sparkles className="w-3.5 h-3.5" />
                            Continue Learning
                          </span>
                          <span className="text-xs font-semibold text-[#4E5C53]">
                            • {activeSubjectName} • Chapter {activeChapterNumber}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-[#18261E]">
                          {activeLectureTitle}
                        </h3>
                        <p className="text-xs text-[#4E5C53]">
                          {activeChapterTitle}
                        </p>
                      </div>

                      <button
                        onClick={handleContinueLearning}
                        className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer transform hover:scale-102 active:scale-98"
                        type="button"
                      >
                        <span>Continue Learning →</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Real Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-[#4E5C53]">
                        <span>Lesson Progress</span>
                        <span className="font-bold text-[#2E7D32]">
                          {activeProgressPercentage > 0
                            ? `${activeProgressPercentage}% completed`
                            : 'In Progress'}
                        </span>
                      </div>
                      <div className="w-full bg-[#FAFBF9] rounded-full h-2.5 overflow-hidden border border-[#E2E8E0]">
                        <div
                          className="bg-[#2E7D32] h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.max(activeProgressPercentage, 12)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-[#18261E]">
                        Start your learning journey
                      </h3>
                      <p className="text-xs text-[#4E5C53]">
                        Select a core subject below to explore chapters, watch video lectures, and practice.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const el = document.getElementById('explore-subjects');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                      type="button"
                    >
                      <span>Explore Subjects</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* D. EXPLORE SUBJECTS (Using the 3D Spatial Reference Interaction) */}
              <div id="explore-subjects" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#18261E] tracking-tight">
                      Explore Subjects
                    </h2>
                    <p className="text-xs text-[#4E5C53]">
                      Step into each subject world. Click the active subject to view chapters, lessons, and video lectures.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#2E7D32] hidden sm:block">
                    Class {currentClass} NCERT Core
                  </span>
                </div>

                {/* 3D Spatial Explorer Component directly inside My Learning */}
                <div className="rounded-3xl border border-[#E2E8E0] bg-white shadow-xs overflow-hidden">
                  <SubjectSpatialExplorer
                    subjects={formattedSubjects}
                    currentClass={currentClass}
                    studentName={studentName}
                    recentLecture={recentLecture}
                    completedVideoIds={completedVideoIds}
                    progressMap={progressMap}
                    onSubjectSelect={(subj) => setActiveSubject(subj)}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
