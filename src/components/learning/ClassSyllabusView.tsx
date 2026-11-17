'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Search,
  Calculator,
  Atom,
  Globe2,
  Languages,
  Scroll,
  X,
} from 'lucide-react';

export interface SyllabusVideo {
  id: string;
  youtubeVideoId: string;
  youtubeUrl?: string | null;
  title: string;
  duration?: string | null;
  durationSeconds?: number;
  thumbnailUrl?: string | null;
  source?: string;
  isApproved?: boolean;
}

export interface SyllabusLesson {
  id: string;
  lessonNumber: number;
  title: string;
  duration?: string | null;
  completed?: boolean;
}

export interface SyllabusTopic {
  id: string;
  name?: string;
  title?: string;
  order?: number;
  videos?: SyllabusVideo[];
}

export interface SyllabusChapter {
  id: string;
  chapterNumber: number;
  title: string;
  description?: string | null;
  theme?: string | null;
  lessons?: SyllabusLesson[];
  videos?: SyllabusVideo[];
  topics?: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  code: string;
  bookName?: string | null;
  description?: string | null;
  chapters?: SyllabusChapter[];
  color?: string | null;
}

interface ClassSyllabusViewProps {
  currentClass: number;
  studentName?: string;
  subjects: SyllabusSubject[];
  completedVideoIds?: string[];
  progressMap?: Record<string, number>;
}

export function ClassSyllabusView({
  currentClass,
  studentName = 'Learner',
  subjects = [],
  completedVideoIds = [],
  progressMap = {},
}: ClassSyllabusViewProps) {
  const router = useRouter();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || ''
  );
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(
    subjects[0]?.chapters?.[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeVideo, setActiveVideo] = useState<SyllabusVideo | null>(null);

  const activeSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math')) return <Calculator className="w-4 h-4" />;
    if (n.includes('sci')) return <Atom className="w-4 h-4" />;
    if (n.includes('soc') || n.includes('sst')) return <Globe2 className="w-4 h-4" />;
    if (n.includes('eng')) return <BookOpen className="w-4 h-4" />;
    if (n.includes('hin')) return <Languages className="w-4 h-4" />;
    if (n.includes('san')) return <Scroll className="w-4 h-4" />;
    return <BookOpen className="w-4 h-4" />;
  };

  const toggleChapter = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  // Filter chapters by search query
  const filteredChapters = (activeSubject?.chapters || []).filter((ch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ch.title.toLowerCase().includes(q) ||
      `chapter ${ch.chapterNumber}`.includes(q) ||
      (ch.topics && ch.topics.some((t) => (t.title || t.name || '').toLowerCase().includes(q))) ||
      (ch.videos && ch.videos.some((v) => v.title.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#18261E] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Header: Class Title & Academic Context */}
        <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Class {currentClass} NCERT Syllabus
                </span>
                <span className="text-xs text-[#4E5C53]">Academic Year 2026–27</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18261E] tracking-tight">
                Class {currentClass} Academic Curriculum
              </h1>
              <p className="text-xs sm:text-sm text-[#4E5C53] leading-relaxed max-w-2xl">
                Structured overview of official NCERT subjects, chapters, topics, and Magnet Brains video lectures.
              </p>
            </div>

            {/* Quick Class Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-[#FAFBF9] p-1.5 rounded-xl border border-[#E2E8E0] shrink-0 self-start sm:self-auto">
              <span className="text-[11px] font-semibold text-[#4E5C53] px-2">Class:</span>
              {[6, 7, 8, 9, 10].map((num) => {
                const isCurrent = num === currentClass;
                return (
                  <Link
                    key={num}
                    href={`/learn/${num}`}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#2E7D32] text-white shadow-xs'
                        : 'text-[#4E5C53] hover:text-[#18261E] hover:bg-white'
                    }`}
                  >
                    {num}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#75847A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters or topics (e.g. Rational Numbers, Metals)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-xs text-[#18261E] placeholder:text-[#75847A] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#75847A] hover:text-[#18261E]"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Subjects Horizontal Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-[#E2E8E0] p-2 shadow-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {subjects.map((s) => {
              const isSelected = s.id === selectedSubjectId;
              const chapterCount = s.chapters?.length || 0;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedSubjectId(s.id);
                    setExpandedChapterId(s.chapters?.[0]?.id || null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EEF7F0] text-[#18261E] border border-[#C8E6C9] shadow-2xs'
                      : 'text-[#4E5C53] hover:bg-[#F8FAF8] hover:text-[#18261E] border border-transparent'
                  }`}
                  type="button"
                >
                  <span className={isSelected ? 'text-[#2E7D32]' : 'text-[#75847A]'}>
                    {getSubjectIcon(s.name)}
                  </span>
                  <span>{s.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white text-[#2E7D32] border border-[#C8E6C9]'
                        : 'bg-[#F4F7F4] text-[#75847A]'
                    }`}
                  >
                    {chapterCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Selected Subject Header & Overview */}
        {activeSubject && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8E0] pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#18261E]">
                    {activeSubject.name}
                  </h2>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#FAFBF9] border border-[#E2E8E0] text-[#4E5C53]">
                    {activeSubject.code}
                  </span>
                  {activeSubject.bookName && (
                    <span className="text-[11px] font-medium text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                      {activeSubject.bookName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4E5C53]">
                  {activeSubject.description ||
                    `Complete syllabus breakdown for Class ${currentClass} ${activeSubject.name}.`}
                </p>
              </div>

              <div className="text-xs font-semibold text-[#4E5C53]">
                {filteredChapters.length} Chapters Available
              </div>
            </div>

            {/* 4. Structured Chapters List (Simple, Functional, Easy to Scan) */}
            <div className="space-y-3">
              {filteredChapters.map((chapter) => {
                const isExpanded = expandedChapterId === chapter.id;

                // Aggregate videos from chapter.videos and chapter.topics.videos
                const allVideos: SyllabusVideo[] = [
                  ...(chapter.videos || []),
                  ...(chapter.topics?.flatMap((t) => t.videos || []) || []),
                ];

                // Deduplicate by youtubeVideoId
                const seen = new Set<string>();
                const uniqueVideos: SyllabusVideo[] = [];
                allVideos.forEach((v) => {
                  if (v && v.youtubeVideoId && !seen.has(v.youtubeVideoId)) {
                    seen.add(v.youtubeVideoId);
                    uniqueVideos.push(v);
                  }
                });

                const topicCount = chapter.topics?.length || 0;
                const videoCount = uniqueVideos.length;
                const completedCount = uniqueVideos.filter((v) =>
                  completedVideoIds.includes(v.youtubeVideoId)
                ).length;
                const isChapterComplete =
                  videoCount > 0 && completedCount === videoCount;

                return (
                  <div
                    key={chapter.id}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'border-[#2E7D32]/40 shadow-xs'
                        : 'border-[#E2E8E0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {/* Chapter Header Row */}
                    <div
                      onClick={() => toggleChapter(chapter.id)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-[#FAFBF9] transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                            isChapterComplete
                              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'
                              : isExpanded
                              ? 'bg-[#2E7D32] text-white'
                              : 'bg-[#F4F7F4] text-[#18261E] border border-[#E2E8E0]'
                          }`}
                        >
                          {isChapterComplete ? (
                            <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                          ) : (
                            chapter.chapterNumber
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#75847A] uppercase tracking-wider">
                              Chapter {chapter.chapterNumber}
                            </span>
                            {isChapterComplete && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32]">
                                <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-[#18261E] truncate">
                            {chapter.title}
                          </h3>
                        </div>
                      </div>

                      {/* Right Metadata & Expand Toggle */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex items-center gap-3 text-xs text-[#4E5C53]">
                          {topicCount > 0 && (
                            <span>{topicCount} Topics</span>
                          )}
                          {videoCount > 0 && (
                            <span>• {videoCount} Lectures</span>
                          )}
                        </div>

                        <div className="p-1.5 rounded-lg text-[#75847A]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#2E7D32]" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chapter Expanded Details: Topics & Lectures */}
                    {isExpanded && (
                      <div className="border-t border-[#E2E8E0] bg-[#FAFBF9] p-4 sm:p-6 space-y-4 animate-fade-in">
                        {chapter.description && (
                          <p className="text-xs text-[#4E5C53] leading-relaxed">
                            {chapter.description}
                          </p>
                        )}

                        {/* Topics Breakdown */}
                        {chapter.topics && chapter.topics.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-[#18261E] uppercase tracking-wider">
                              Key Topics
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {chapter.topics.map((t, idx) => (
                                <div
                                  key={t.id || idx}
                                  className="p-2.5 rounded-xl bg-white border border-[#E2E8E0] text-xs font-medium text-[#18261E] flex items-center gap-2"
                                >
                                  <span className="w-5 h-5 rounded-md bg-[#F4F7F4] text-[#4E5C53] text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="truncate">{t.title || t.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Video Lectures List */}
                        {uniqueVideos.length > 0 ? (
                          <div className="space-y-2 pt-2">
                            <h4 className="text-xs font-bold text-[#18261E] uppercase tracking-wider">
                              Magnet Brains Video Lectures ({uniqueVideos.length})
                            </h4>
                            <div className="space-y-2">
                              {uniqueVideos.map((video, vIdx) => {
                                const isVideoCompleted = completedVideoIds.includes(
                                  video.youtubeVideoId
                                );
                                return (
                                  <div
                                    key={video.id || vIdx}
                                    className="bg-white p-3 rounded-xl border border-[#E2E8E0] flex items-center justify-between gap-3 hover:border-[#2E7D32]/40 transition-colors"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <button
                                        onClick={() => setActiveVideo(video)}
                                        className="w-8 h-8 rounded-lg bg-[#EEF7F0] text-[#2E7D32] flex items-center justify-center shrink-0 hover:bg-[#2E7D32] hover:text-white transition-colors cursor-pointer"
                                        type="button"
                                        title="Watch Lecture"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                      <div className="min-w-0">
                                        <h5 className="text-xs font-bold text-[#18261E] truncate">
                                          {video.title}
                                        </h5>
                                        <div className="flex items-center gap-2 text-[11px] text-[#4E5C53]">
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-[#75847A]" />
                                            {video.duration || '15m'}
                                          </span>
                                          <span>• {video.source || 'Magnet Brains'}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      {isVideoCompleted ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Completed
                                        </span>
                                      ) : (
                                        <button
                                          onClick={() => setActiveVideo(video)}
                                          className="text-xs font-bold text-[#2E7D32] hover:underline cursor-pointer"
                                          type="button"
                                        >
                                          Watch →
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 bg-white rounded-xl border border-[#E2E8E0] text-center space-y-1">
                            <p className="text-xs font-semibold text-[#18261E]">No video lectures available yet for this chapter</p>
                            <p className="text-[11px] text-[#4E5C53]">
                              This chapter is aligned with the official CBSE/NCERT 2026–27 curriculum. Verified video lectures are currently in production and will appear here once approved.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredChapters.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-[#E2E8E0] space-y-2">
                  <p className="text-sm font-bold text-[#18261E]">No chapters found</p>
                  <p className="text-xs text-[#75847A]">
                    Try searching for another topic or clear your search filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. In-Page Video Modal for Lecture Playback */}
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#E2E8E0] overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-[#E2E8E0] flex items-center justify-between bg-[#FAFBF9]">
                <div className="min-w-0 pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] block">
                    Class {currentClass} • {activeSubject?.name}
                  </span>
                  <h3 className="text-sm font-bold text-[#18261E] truncate">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg text-[#75847A] hover:bg-[#F4F7F4] hover:text-[#18261E] transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeVideoId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-4 flex items-center justify-between text-xs text-[#4E5C53] bg-white">
                <span>Duration: {activeVideo.duration || '15m'} • Source: Magnet Brains</span>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white font-bold hover:bg-[#1B5E20] transition-colors"
                  type="button"
                >
                  Close Player
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
