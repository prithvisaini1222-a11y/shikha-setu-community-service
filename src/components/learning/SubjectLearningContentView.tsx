'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  Video,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  Award,
} from 'lucide-react';
import { trackVideoProgressAction } from '@/actions/learning';

export interface LectureItem {
  id: string;
  youtubeVideoId: string;
  youtubeUrl?: string | null;
  title: string;
  duration?: string | null;
  durationSeconds?: number;
  thumbnailUrl?: string | null;
  source?: string;
  lessonNumber?: number;
  completed?: boolean;
  lectureType?: string;
  mappingStatus?: string;
  syllabusStatus?: string;
}

export interface ChapterItem {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string | null;
  theme?: string | null;
  syllabusStatus?: string | null;
  textbookEdition?: string | null;
  lessons?: any[];
  videos?: any[];
  topics?: any[];
}

export interface SubjectLearningContentProps {
  subjectName: string;
  subjectCode: string;
  bookName?: string | null;
  currentClass: number;
  chapters: ChapterItem[];
  progressPercentage?: number;
  recentLecture?: LectureItem | null;
  completedVideoIds?: string[];
  onBackToSubjects?: () => void;
}

export function SubjectLearningContentView({
  subjectName,
  subjectCode,
  bookName,
  currentClass,
  chapters = [],
  progressPercentage = 0,
  recentLecture,
  completedVideoIds = [],
  onBackToSubjects,
}: SubjectLearningContentProps) {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    chapters[0]?.id || null
  );
  const [activeVideo, setActiveVideo] = useState<LectureItem | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>(completedVideoIds);
  const [chapterCategoryFilter, setChapterCategoryFilter] = useState<Record<string, string>>({});

  const toggleChapter = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  const handleWatchLecture = (lecture: LectureItem) => {
    setActiveVideo(lecture);
  };

  const handleMarkComplete = async (videoId: string) => {
    if (activeVideo) {
      setCompletedIds((prev) => Array.from(new Set([...prev, activeVideo.id, activeVideo.youtubeVideoId, videoId])));
    } else {
      setCompletedIds((prev) => [...prev, videoId]);
    }
    await trackVideoProgressAction({
      videoId,
      progressPercentage: 100,
      watchTimeSeconds: 600,
      completed: true,
    });
  };

  // Color styling based on subject
  const getSubjectBadgeColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
    if (n.includes('sci')) return 'bg-[#EFF6FF] text-[#1E88E5] border-[#BFDBFE]';
    if (n.includes('soc') || n.includes('sst')) return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
    if (n.includes('eng')) return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
    if (n.includes('hin')) return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
    if (n.includes('san')) return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]';
    return 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';
  };

  const badgeColorClass = getSubjectBadgeColor(subjectName);

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#18261E] pb-16 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Top Navigation: ← Back to Subjects */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (onBackToSubjects) {
                onBackToSubjects();
              } else if (typeof window !== 'undefined') {
                window.location.href = `/learn/${currentClass}`;
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E2E8E0] text-xs font-bold text-[#18261E] hover:bg-[#E8F5E9] hover:border-[#2E7D32] hover:text-[#2E7D32] shadow-xs transition-all cursor-pointer group active:scale-95"
            type="button"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#2E7D32]" />
            <span>Back to Subjects</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#4E5C53]">
              Class {currentClass} • {chapters.length} Chapters
            </span>
          </div>
        </div>

        {/* Subject Header (Requirement 7) */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E2E8E0] p-6 sm:p-10 shadow-xs">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeColorClass}`}>
                {subjectCode}
              </span>
              <span className="text-xs font-semibold text-[#4E5C53]">
                Academic Year 2026–27
              </span>
              {bookName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                  <BookOpen className="w-3 h-3 text-[#16A34A]" /> {bookName}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#18261E] tracking-tight uppercase">
              {subjectName}
            </h1>

            <h3 className="text-lg sm:text-xl font-bold text-[#2E7D32]">
              Class {currentClass}
            </h3>

            <p className="text-xs sm:text-sm text-[#4E5C53] leading-relaxed">
              Official NCERT curriculum with conceptual Magnet Brains video lectures, revision sheets, and quizzes.
            </p>

            {/* Overall Subject Progress */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#18261E]">Subject Progress</span>
                <span className="font-bold text-[#2E7D32]">
                  {progressPercentage > 0 ? `${progressPercentage}% complete` : 'Not Started'}
                </span>
              </div>
              <div className="w-full bg-[#E2E8E0] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2E7D32] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning Card (Requirement 7 & 17: If learner has previous progress) */}
        {recentLecture && (
          <div className="relative overflow-hidden rounded-2xl bg-white border border-[#C8E6C9] p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Continue Learning
                </span>
                <h4 className="text-base font-bold text-[#18261E]">
                  {recentLecture.title}
                </h4>
                <p className="text-xs text-[#4E5C53]">
                  {subjectName} • Class {currentClass} • Lesson {recentLecture.lessonNumber || 1}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleWatchLecture(recentLecture)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-xs shadow-xs transition-all active:scale-95 shrink-0"
              type="button"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continue →</span>
            </button>
          </div>
        )}

        {/* Chapters & Lectures Section (Requirements 7, 8, 9) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18261E] tracking-tight">
              Chapters & Lectures
            </h2>
            <span className="text-xs text-[#4E5C53] font-medium">
              Click any chapter to view all Magnet Brains lectures
            </span>
          </div>

          <div className="space-y-3">
            {chapters.map((chapter) => {
              const isExpanded = expandedChapterId === chapter.id;

              // Aggregate all lectures from chapter.videos and chapter.topics.videos and chapter.lessons
              const rawVideos: any[] = [
                ...(chapter.videos || []),
                ...(chapter.topics?.flatMap((t: any) => t.videos || []) || []),
              ];

              // Deduplicate by youtubeVideoId
              const seenIds = new Set<string>();
              const lectures: LectureItem[] = [];

              rawVideos.forEach((v, idx) => {
                if (v && v.youtubeVideoId && !seenIds.has(v.youtubeVideoId)) {
                  seenIds.add(v.youtubeVideoId);
                  lectures.push({
                    id: v.id || `vid-${idx}`,
                    youtubeVideoId: v.youtubeVideoId,
                    youtubeUrl: v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeVideoId}`,
                    title: v.title,
                    duration: v.duration || '15m',
                    durationSeconds: v.durationSeconds || 900,
                    thumbnailUrl: v.thumbnailUrl || `https://i.ytimg.com/vi/${v.youtubeVideoId}/hqdefault.jpg`,
                    source: v.source || 'Magnet Brains',
                    lessonNumber: idx + 1,
                    completed: completedIds.includes(v.youtubeVideoId),
                    lectureType: v.lectureType || 'Topic Explanation',
                    mappingStatus: v.mappingStatus || 'VERIFIED',
                    syllabusStatus: v.syllabusStatus || chapter.syllabusStatus || 'CURRENT_2026_27',
                  });
                }
              });

              // If chapter has lessons with videoUrl, also incorporate them
              if (chapter.lessons && chapter.lessons.length > 0) {
                chapter.lessons.forEach((l, lIdx) => {
                  let vidId = '';
                  if (l.videoUrl) {
                    const match = l.videoUrl.match(/(?:embed\/|v=|vi\/|youtu\.be\/|\/v\/)([a-zA-Z0-9_-]{11})/);
                    if (match && match[1]) vidId = match[1];
                  }
                  if (vidId && !seenIds.has(vidId)) {
                    seenIds.add(vidId);
                    lectures.push({
                      id: l.id || `les-${lIdx}`,
                      youtubeVideoId: vidId,
                      youtubeUrl: l.videoUrl,
                      title: l.title,
                      duration: `${l.durationMinutes || 15}m`,
                      durationSeconds: (l.durationMinutes || 15) * 60,
                      thumbnailUrl: `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
                      source: l.videoSource || 'Magnet Brains',
                      lessonNumber: l.lessonNumber || lectures.length + 1,
                      completed: completedIds.includes(vidId),
                      lectureType: l.lectureType || 'Topic Explanation',
                      mappingStatus: l.mappingStatus || 'VERIFIED',
                      syllabusStatus: chapter.syllabusStatus || 'CURRENT_2026_27',
                    });
                  }
                });
              }

              const totalLecturesCount = lectures.length;
              const completedCount = lectures.filter((l) => completedIds.includes(l.youtubeVideoId)).length;
              const chapterProgressPct =
                totalLecturesCount > 0 ? Math.round((completedCount / totalLecturesCount) * 100) : 0;

              return (
                <div
                  key={chapter.id}
                  className="rounded-2xl bg-white border border-[#E2E8E0] shadow-xs overflow-hidden transition-all hover:border-[#2E7D32]/40"
                >
                  {/* Chapter Header Bar */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                    type="button"
                  >
                    <div className="flex items-start sm:items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-sm shrink-0">
                        {chapter.chapterNumber}
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold text-[#4E5C53] uppercase tracking-wider">
                            Chapter {chapter.chapterNumber}
                          </span>
                          {chapter.theme && (
                            <span className="text-[10px] font-medium bg-[#F4F7F4] text-[#4E5C53] px-2 py-0.5 rounded-md border border-[#E2E8E0]">
                              {chapter.theme}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#18261E]">
                          {chapter.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#4E5C53] pt-0.5">
                          <span className="font-semibold text-[#2E7D32]">
                            {chapterProgressPct > 0 ? `${chapterProgressPct}% complete` : 'Not Started'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium">
                            <Video className="w-3.5 h-3.5 text-[#1E88E5]" />
                            {totalLecturesCount} {totalLecturesCount === 1 ? 'Lecture' : 'Lectures'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
                      <span className="hidden sm:inline">
                        {isExpanded ? 'Hide Lectures' : 'Show Lectures'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#4E5C53]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#4E5C53]" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Lecture List (Requirement 8 & 9) */}
                  {isExpanded && (() => {
                    const getCat = (l: LectureItem) => {
                      const type = (l.lectureType || '').toLowerCase();
                      const title = (l.title || '').toLowerCase();
                      if (l.syllabusStatus === 'PREVIOUS_EDITION' || l.mappingStatus === 'OUTDATED') return 'SUPPLEMENTARY';
                      if (type.includes('one-shot') || type.includes('revision') || title.includes('one shot') || title.includes('revision')) return 'REVISION';
                      if (type.includes('ncert') || type.includes('exercise') || title.includes('ncert') || title.includes('exercise') || title.includes('solutions')) return 'NCERT_SOLUTIONS';
                      if (type.includes('mcq') || type.includes('practice') || type.includes('question') || type.includes('pyq') || title.includes('mcq') || title.includes('question')) return 'PRACTICE';
                      return 'MAIN_LESSONS';
                    };

                    const currentCat = chapterCategoryFilter[chapter.id] || 'ALL';
                    const counts = {
                      ALL: lectures.length,
                      MAIN_LESSONS: lectures.filter(l => getCat(l) === 'MAIN_LESSONS').length,
                      NCERT_SOLUTIONS: lectures.filter(l => getCat(l) === 'NCERT_SOLUTIONS').length,
                      PRACTICE: lectures.filter(l => getCat(l) === 'PRACTICE').length,
                      REVISION: lectures.filter(l => getCat(l) === 'REVISION').length,
                      SUPPLEMENTARY: lectures.filter(l => getCat(l) === 'SUPPLEMENTARY').length,
                    };

                    const filteredLectures = currentCat === 'ALL'
                      ? lectures
                      : lectures.filter(l => getCat(l) === currentCat);

                    return (
                      <div className="border-t border-[#E2E8E0] bg-[#FAFBF9] p-5 sm:p-6 space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
                            Available Magnet Brains Lectures
                          </span>
                          <span className="text-[11px] font-semibold text-[#2E7D32]">
                            {completedCount} of {totalLecturesCount} Completed
                          </span>
                        </div>

                        {/* Category Filter Pills */}
                        {lectures.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pb-1">
                            <button
                              type="button"
                              onClick={() => setChapterCategoryFilter(prev => ({ ...prev, [chapter.id]: 'ALL' }))}
                              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                currentCat === 'ALL'
                                  ? 'bg-[#2E7D32] text-white shadow-2xs'
                                  : 'bg-white text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
                              }`}
                            >
                              All ({counts.ALL})
                            </button>
                            {counts.MAIN_LESSONS > 0 && (
                              <button
                                type="button"
                                onClick={() => setChapterCategoryFilter(prev => ({ ...prev, [chapter.id]: 'MAIN_LESSONS' }))}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  currentCat === 'MAIN_LESSONS'
                                    ? 'bg-[#2E7D32] text-white shadow-2xs'
                                    : 'bg-white text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
                                }`}
                              >
                                Main Lessons ({counts.MAIN_LESSONS})
                              </button>
                            )}
                            {counts.NCERT_SOLUTIONS > 0 && (
                              <button
                                type="button"
                                onClick={() => setChapterCategoryFilter(prev => ({ ...prev, [chapter.id]: 'NCERT_SOLUTIONS' }))}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  currentCat === 'NCERT_SOLUTIONS'
                                    ? 'bg-[#2E7D32] text-white shadow-2xs'
                                    : 'bg-white text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
                                }`}
                              >
                                NCERT Solutions ({counts.NCERT_SOLUTIONS})
                              </button>
                            )}
                            {counts.PRACTICE > 0 && (
                              <button
                                type="button"
                                onClick={() => setChapterCategoryFilter(prev => ({ ...prev, [chapter.id]: 'PRACTICE' }))}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  currentCat === 'PRACTICE'
                                    ? 'bg-[#2E7D32] text-white shadow-2xs'
                                    : 'bg-white text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
                                }`}
                              >
                                Practice & MCQs ({counts.PRACTICE})
                              </button>
                            )}
                            {counts.REVISION > 0 && (
                              <button
                                type="button"
                                onClick={() => setChapterCategoryFilter(prev => ({ ...prev, [chapter.id]: 'REVISION' }))}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  currentCat === 'REVISION'
                                    ? 'bg-[#2E7D32] text-white shadow-2xs'
                                    : 'bg-white text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
                                }`}
                              >
                                Revision ({counts.REVISION})
                              </button>
                            )}
                            {counts.SUPPLEMENTARY > 0 && (
                              <button
                                type="button"
                                onClick={() => setChapterCategoryFilter(prev => ({ ...prev, [chapter.id]: 'SUPPLEMENTARY' }))}
                                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                  currentCat === 'SUPPLEMENTARY'
                                    ? 'bg-[#D97706] text-white shadow-2xs'
                                    : 'bg-white text-[#D97706] hover:bg-[#FEF3C7] border border-[#FDE68A]'
                                }`}
                              >
                                Previous Edition ({counts.SUPPLEMENTARY})
                              </button>
                            )}
                          </div>
                        )}

                        {lectures.length === 0 ? (
                          <div className="p-8 text-center bg-white rounded-2xl border border-[#E2E8E0] space-y-2">
                            <div className="w-10 h-10 rounded-xl bg-[#F4F7F4] text-[#4E5C53] flex items-center justify-center mx-auto">
                              <BookOpen className="w-5 h-5 text-[#2E7D32]" />
                            </div>
                            <h4 className="text-sm font-bold text-[#18261E]">No lectures available yet for this chapter</h4>
                            <p className="text-xs text-[#4E5C53] max-w-md mx-auto">
                              This chapter is part of the official CBSE/NCERT 2026–27 syllabus. Verified video lectures for this chapter are currently in production and will be displayed as soon as they are approved.
                            </p>
                          </div>
                        ) : filteredLectures.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#4E5C53] bg-white rounded-xl border border-[#E2E8E0]">
                            No lectures found in the selected category. Please select "All" to view all available lectures.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredLectures.map((lecture, lIdx) => {
                              const isDone = completedIds.includes(lecture.youtubeVideoId);

                              return (
                                <div
                                  key={lecture.id || lIdx}
                                  className={`rounded-xl border p-3.5 bg-white flex items-center justify-between gap-3 transition-all hover:shadow-xs ${
                                    isDone
                                      ? 'border-[#C8E6C9] bg-[#F4FBF5]'
                                      : 'border-[#E2E8E0] hover:border-[#2E7D32]'
                                  }`}
                                >
                                  {/* Thumbnail & Info */}
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                                      <img
                                        src={lecture.thumbnailUrl || `https://i.ytimg.com/vi/${lecture.youtubeVideoId}/hqdefault.jpg`}
                                        alt={lecture.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                                        <Play className="w-5 h-5 text-white fill-white opacity-90" />
                                      </div>
                                      {lecture.duration && (
                                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-semibold px-1 py-0.2 rounded">
                                          {lecture.duration}
                                        </span>
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider block">
                                          Lesson {String(lecture.lessonNumber || lIdx + 1).padStart(2, '0')}
                                        </span>
                                        {lecture.lectureType && (
                                          <span className="text-[9px] font-bold bg-[#E8F5E9] text-[#2E7D32] px-1.5 py-0.2 rounded border border-[#C8E6C9]">
                                            {lecture.lectureType}
                                          </span>
                                        )}
                                        {(lecture.syllabusStatus === 'PREVIOUS_EDITION' || lecture.mappingStatus === 'OUTDATED') && (
                                          <span className="text-[9px] font-bold bg-[#FEF3C7] text-[#D97706] px-1.5 py-0.2 rounded border border-[#FDE68A]">
                                            Previous Edition
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="text-xs font-bold text-[#18261E] truncate" title={lecture.title}>
                                        {lecture.title}
                                      </h4>
                                      <span className="text-[10px] text-[#4E5C53] block">
                                        {lecture.source || 'Magnet Brains'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Watch & Status Button */}
                                  <div className="shrink-0 flex items-center gap-2">
                                    {isDone && (
                                      <span className="text-[#2E7D32]" title="Completed">
                                        <CheckCircle2 className="w-5 h-5" />
                                      </span>
                                    )}

                                    <button
                                      onClick={() => handleWatchLecture(lecture)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                        isDone
                                          ? 'bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#C8E6C9]'
                                          : 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-2xs active:scale-95'
                                      }`}
                                      type="button"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>Watch</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white border border-[#E2E8E0] shadow-2xl overflow-hidden space-y-4 p-4 sm:p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8E0]">
              <div>
                <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider">
                  {subjectName} • Class {currentClass} • Lesson {activeVideo.lessonNumber || 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#18261E] line-clamp-1">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-[#4E5C53] hover:bg-[#F4F7F4] transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Responsive YouTube Player */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#4E5C53]">
                Source: <strong>{activeVideo.source || 'Magnet Brains'}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkComplete(activeVideo.id || activeVideo.youtubeVideoId)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    completedIds.includes(activeVideo.id) || completedIds.includes(activeVideo.youtubeVideoId)
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                      : 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-xs active:scale-95'
                  }`}
                  type="button"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedIds.includes(activeVideo.id) || completedIds.includes(activeVideo.youtubeVideoId)
                      ? 'Completed'
                      : 'Mark as Completed'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2 rounded-xl bg-[#F4F7F4] hover:bg-[#E2E8E0] text-xs font-semibold text-[#18261E] transition-colors"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
