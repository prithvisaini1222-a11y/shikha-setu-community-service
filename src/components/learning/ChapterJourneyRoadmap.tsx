'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Play,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  Video,
} from 'lucide-react';

export interface ChapterData {
  id: string;
  chapterNumber: number;
  title: string;
  theme?: string | null;
  description?: string | null;
  lessons?: any[];
  videos?: any[];
  quizzes?: any[];
  notes?: any[];
}

interface ChapterJourneyRoadmapProps {
  subjectName: string;
  classNumber: number;
  subjectCode?: string;
  bookName?: string | null;
  chapters: ChapterData[];
  currentChapterNumber?: number;
  completedChapterNumbers?: number[];
}

export function ChapterJourneyRoadmap({
  subjectName,
  classNumber,
  subjectCode = 'SCI-8',
  bookName,
  chapters = [],
  currentChapterNumber = 2,
  completedChapterNumbers = [1],
}: ChapterJourneyRoadmapProps) {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  // Active current chapter
  const currentChapter =
    chapters.find((ch) => ch.chapterNumber === currentChapterNumber) || chapters[0];

  const toggleExpand = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  const subjectSlug = subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className="space-y-10 w-full animate-fade-in">
      {/* 1. HERO: CONTINUE LEARNING (Requirement: Large current lesson card) */}
      {currentChapter && (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#E2E8E0] p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E8F5E9]/60 via-[#E3F2FD]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                  <Sparkles className="w-3.5 h-3.5" /> Continue Learning
                </span>
                <span className="text-xs font-semibold text-[#4E5C53]">
                  {subjectName} • Class {classNumber}
                </span>
                {bookName && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                    <BookOpen className="w-3 h-3 text-[#16A34A]" /> {bookName}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                  Chapter {currentChapter.chapterNumber}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#18261E] tracking-tight mt-0.5">
                  {currentChapter.title}
                </h2>
                <p className="text-sm text-[#4E5C53] mt-1 leading-relaxed line-clamp-2">
                  {currentChapter.description ||
                    'Master foundational concepts, watch Magnet Brains video lectures, revise notes, and test yourself with interactive quizzes.'}
                </p>
              </div>

              {/* Progress & 5-Step Cycle */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#18261E]">Chapter Progress</span>
                  <span className="font-bold text-[#2E7D32]">65% Complete</span>
                </div>
                <div className="w-full bg-[#E2E8E0] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] h-full rounded-full transition-all duration-500"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>

            {/* Direct Action / Magnet Brains Preview */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/learn/${classNumber}/${subjectSlug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#256629] text-white font-bold text-sm shadow-md transition-all active:scale-95 group"
              >
                <Play className="w-4 h-4 fill-white transition-transform group-hover:scale-110" />
                <span>Resume Lesson</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. VISUAL 5-STEP LEARNING CYCLE INDICATOR */}
      <div className="bg-[#F8FAF8] rounded-xl border border-[#E2E8E0] p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
            NCERT Structured Learning Journey
          </span>
          <span className="text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
            5-Step Academic Flow
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { step: '1', title: 'Topic', icon: Layers, desc: 'Concept Outline' },
            { step: '2', title: 'Video', icon: Video, desc: 'Magnet Brains' },
            { step: '3', title: 'Notes', icon: FileText, desc: 'Revision Sheets' },
            { step: '4', title: 'Practice', icon: HelpCircle, desc: 'Instant Reveals' },
            { step: '5', title: 'Quiz', icon: Award, desc: '10-Q Assessment' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-[#E2E8E0]/70 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#18261E] block leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-[#4E5C53] block">{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. THE VISUAL CHAPTER JOURNEY ROADMAP (Ch 1 → Ch 2 → Ch 3...) */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-[#18261E] tracking-tight">
            Curriculum Journey & Chapters
          </h3>
          <p className="text-xs text-[#4E5C53] mt-0.5">
            Follow the sequential learning path from foundational concepts to advanced applications.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-10 space-y-6">
          {/* Connecting Vertical Timeline Line */}
          <div className="absolute left-[19px] sm:left-[35px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#4CAF50] via-[#81C784] to-[#CFD8DC]" />

          {chapters.map((chapter, index) => {
            const isCompleted = completedChapterNumbers.includes(chapter.chapterNumber);
            const isCurrent = chapter.chapterNumber === currentChapterNumber;
            const isUpcoming = !isCompleted && !isCurrent;
            const isExpanded = expandedChapterId === chapter.id;

            const lessonCount = chapter.lessons?.length || 3;
            const videoCount = chapter.videos?.length || 2;

            return (
              <div key={chapter.id} className="relative group">
                {/* Status Node Circle on Timeline */}
                <div
                  className={`absolute -left-[27px] sm:-left-[43px] top-5 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform duration-200 z-10 group-hover:scale-110 ${
                    isCompleted
                      ? 'bg-[#2E7D32] text-white ring-4 ring-[#E8F5E9]'
                      : isCurrent
                        ? 'bg-white text-[#2E7D32] border-2 border-[#2E7D32] ring-4 ring-[#E8F5E9] animate-pulse'
                        : 'bg-white text-[#86968B] border border-[#CFD8DC]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span>{chapter.chapterNumber}</span>
                  )}
                </div>

                {/* Chapter Card */}
                <div
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 bg-white ${
                    isCurrent
                      ? 'border-[#2E7D32] shadow-md ring-1 ring-[#2E7D32]/20'
                      : isCompleted
                        ? 'border-[#C8E6C9] shadow-xs hover:border-[#81C784]'
                        : 'border-[#E2E8E0] shadow-xs hover:border-[#B0BEC5]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      {/* Theme / Status Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold text-[#4E5C53] uppercase tracking-wider">
                          Chapter {chapter.chapterNumber}
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2E7D32] text-white">
                            Current Focus
                          </span>
                        )}
                        {chapter.theme && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F4F7F4] text-[#4E5C53] border border-[#E2E8E0]">
                            {chapter.theme}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="text-lg sm:text-xl font-bold text-[#18261E] group-hover:text-[#2E7D32] transition-colors">
                        {chapter.title}
                      </h4>

                      {chapter.description && (
                        <p className="text-xs text-[#4E5C53] leading-relaxed line-clamp-2">
                          {chapter.description}
                        </p>
                      )}

                      {/* Content Metadata Pills */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#4E5C53]">
                        <span className="flex items-center gap-1 font-medium">
                          <Layers className="w-3.5 h-3.5 text-[#2E7D32]" />
                          {lessonCount} Lessons
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Video className="w-3.5 h-3.5 text-[#1E88E5]" />
                          {videoCount} Magnet Brains Videos
                        </span>
                        <span className="flex items-center gap-1 font-medium text-[#D97706]">
                          <Award className="w-3.5 h-3.5" />
                          10-Q Quiz Included
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Button & Toggle */}
                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => toggleExpand(chapter.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F4F7F4] hover:bg-[#E8F5E9] text-xs font-semibold text-[#18261E] transition-colors"
                        type="button"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Lessons'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Link
                        href={`/learn/${classNumber}/${subjectSlug}`}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#2E7D32] hover:bg-[#256629] text-white shadow-xs'
                            : 'bg-[#F4F7F4] hover:bg-[#E8F5E9] text-[#2E7D32]'
                        }`}
                      >
                        <span>{isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Magnet Brains Video & Topic Preview */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#E2E8E0] space-y-3 animate-fade-in">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#4E5C53] block">
                        Included Magnet Brains Video Lectures
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(chapter.videos && chapter.videos.length > 0
                          ? chapter.videos
                          : [
                              {
                                id: `v-${chapter.id}-1`,
                                title: `${chapter.title} — Conceptual Introduction`,
                                channelName: 'Magnet Brains',
                                duration: '18m',
                              },
                              {
                                id: `v-${chapter.id}-2`,
                                title: `${chapter.title} — NCERT Exemplar & Practice`,
                                channelName: 'Magnet Brains',
                                duration: '22m',
                              },
                            ]
                        ).map((v: any, vIdx: number) => (
                          <Link
                            key={v.id || vIdx}
                            href={`/learn/${classNumber}/${subjectSlug}`}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAF8] hover:bg-[#EFF6FF] border border-[#E2E8E0] transition-colors group/video"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#E3F2FD] text-[#1E88E5] flex items-center justify-center shrink-0 group-hover/video:bg-[#1E88E5] group-hover/video:text-white transition-colors">
                              <Play className="w-4 h-4 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#18261E] truncate group-hover/video:text-[#1E88E5] transition-colors">
                                {v.title}
                              </p>
                              <span className="text-[10px] text-[#4E5C53] flex items-center gap-2">
                                <span>{v.channelName || 'Magnet Brains'}</span>
                                <span>•</span>
                                <span>{v.duration || '15m'}</span>
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
