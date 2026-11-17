'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Video,
  FileText,
  HelpCircle,
  BarChart3,
  Play,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  Volume2,
  Maximize2,
  Check,
  RotateCcw,
} from 'lucide-react';

type TabType = 'video' | 'notes' | 'practice' | 'quiz' | 'progress';

export function LearningHubPreview() {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'video', label: 'Video Lesson', icon: Video },
    { id: 'notes', label: 'Revision Notes', icon: FileText },
    { id: 'practice', label: 'Interactive Practice', icon: Sparkles },
    { id: 'quiz', label: '10-Q Quiz Preview', icon: HelpCircle },
    { id: 'progress', label: 'Mastery Progress', icon: BarChart3 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] shadow-sm overflow-hidden card-interactive">
      {/* EdTech Browser/App Top Bar */}
      <div className="bg-[#F8FAF8] border-b border-[#E2E8E0] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#E2E8E0] border border-[#D0D7CF]" />
            <span className="w-3 h-3 rounded-full bg-[#E2E8E0] border border-[#D0D7CF]" />
            <span className="w-3 h-3 rounded-full bg-[#E2E8E0] border border-[#D0D7CF]" />
          </div>
          <div className="h-4 w-px bg-[#E2E8E0] mx-1" />
          <div className="flex items-center gap-2 text-xs font-semibold text-[#18261E]">
            <span className="bg-[#EBF5EE] text-[#1B4D2F] px-2 py-0.5 rounded-md font-bold">Class 8</span>
            <span className="text-[#7E8C82]">/</span>
            <span className="text-[#4E5C53]">Mathematics</span>
            <span className="text-[#7E8C82]">/</span>
            <span className="text-[#18261E] font-bold">Chapter 2: Linear Equations</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1B4D2F] bg-[#EBF5EE] px-2.5 py-0.5 rounded-full border border-[#C6E6CD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D4E] animate-pulse" />
            Live NCERT Curriculum
          </span>
          <Link
            href="/learn"
            className="text-xs font-bold text-[#2E7D4E] hover:text-[#24663F] hidden sm:inline-flex items-center gap-1 ml-2 group"
          >
            Full Syllabus
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Embedded Navigation Tabs */}
      <div className="flex items-center border-b border-[#E2E8E0] bg-white px-4 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#2E7D4E] text-[#1B4D2F] bg-[#EBF5EE]/40'
                  : 'border-transparent text-[#4E5C53] hover:text-[#18261E] hover:border-[#D6DCD4]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D4E]' : 'text-[#7E8C82]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="p-4 sm:p-6 bg-[#FFFFFF] min-h-[380px] flex flex-col justify-center">
        {/* TAB 1: VIDEO LESSON */}
        {activeTab === 'video' && (
          <div className="space-y-4">
            {/* Realistic Video Player Mockup */}
            <div className="relative aspect-video max-h-[320px] mx-auto w-full bg-[#1F2E24] rounded-xl overflow-hidden shadow-inner flex flex-col justify-between p-4 group">
              <div className="flex items-center justify-between text-xs text-white/80 z-10">
                <span className="font-semibold bg-black/40 px-2.5 py-1 rounded backdrop-blur-xs">
                  Lesson 2.1 • Solving Linear Equations (NCERT)
                </span>
                <span className="bg-[#2E7D4E] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  Curated YouTube Safe Player
                </span>
              </div>

              {/* Center Play button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-[#2E7D4E] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 group-hover:bg-[#24663F]"
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                  <Play className={`w-6 h-6 ${isPlaying ? 'fill-white' : 'translate-x-0.5 fill-white'}`} />
                </button>
              </div>

              {/* Bottom Video Controls */}
              <div className="space-y-2 z-10">
                {/* Progress bar */}
                <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer">
                  <div className="bg-[#2E7D4E] h-full w-[45%]" />
                </div>
                <div className="flex items-center justify-between text-xs text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]">08:14 / 18:42</span>
                    <span className="text-white/50">•</span>
                    <span className="text-[11px] text-white/70">Chapter 2 • Method of Transposition</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-3.5 h-3.5" />
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Subtle background gradient pattern */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
            </div>

            {/* Timestamps */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#7E8C82] font-medium">Key Timestamps:</span>
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-[#F8FAF8] hover:bg-[#EBF5EE] text-[#18261E] hover:text-[#1B4D2F] border border-[#E2E8E0] px-2.5 py-1 rounded-md transition-colors"
              >
                02:15 Introduction
              </button>
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-[#F8FAF8] hover:bg-[#EBF5EE] text-[#18261E] hover:text-[#1B4D2F] border border-[#E2E8E0] px-2.5 py-1 rounded-md transition-colors"
              >
                06:40 Transposition Rule
              </button>
              <button
                onClick={() => setIsPlaying(true)}
                className="bg-[#F8FAF8] hover:bg-[#EBF5EE] text-[#18261E] hover:text-[#1B4D2F] border border-[#E2E8E0] px-2.5 py-1 rounded-md transition-colors"
              >
                12:20 Real-world Examples
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REVISION NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#18261E] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2E7D4E]" />
                  Core Definition: Linear Equation in One Variable
                </h4>
                <span className="text-[11px] font-semibold text-[#1B4D2F] bg-[#EBF5EE] px-2 py-0.5 rounded">
                  High Yield
                </span>
              </div>
              <p className="text-xs text-[#4E5C53] leading-relaxed">
                An algebraic equation where the highest power of the variable is exactly 1. Standard format: <strong className="font-mono text-[#18261E]">ax + b = 0</strong> (where a ≠ 0).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-[#E2E8E0] bg-white space-y-1">
                <span className="font-bold text-[#18261E] block">1. Transposition Rule</span>
                <p className="text-[#4E5C53] leading-relaxed">
                  When moving a term across the &quot;=&quot; sign, its mathematical sign reverses: (+) becomes (-), and (×) becomes (÷).
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-[#E2E8E0] bg-white space-y-1">
                <span className="font-bold text-[#18261E] block">2. Golden Balance Law</span>
                <p className="text-[#4E5C53] leading-relaxed">
                  Any arithmetic operation performed on the LHS must identically be applied to the RHS to preserve equality.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-[#7E8C82]">Verified by NCERT Subject Matter Experts</span>
              <Link href="/learn" className="text-[#2E7D4E] font-bold hover:underline">
                Download PDF Summary →
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE PRACTICE */}
        {activeTab === 'practice' && (
          <div className="space-y-4 max-w-xl mx-auto w-full">
            <div className="p-3 rounded-lg bg-[#EBF5EE] text-[#1B4D2F] text-xs font-semibold flex items-center justify-between">
              <span>Interactive Step-by-Step Practice</span>
              <span>Question 1 of 5</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#4E5C53]">Problem Statement:</span>
              <p className="text-base font-bold text-[#18261E] bg-[#F8FAF8] p-3.5 rounded-xl border border-[#E2E8E0] font-mono">
                Solve for x: 3x - 7 = 14
              </p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 1, text: 'x = 3', isCorrect: false },
                { id: 2, text: 'x = 7', isCorrect: true },
                { id: 3, text: 'x = 21', isCorrect: false },
                { id: 4, text: 'x = 5', isCorrect: false },
              ].map((option) => {
                const isSelected = selectedAnswer === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={`p-3 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between border ${
                      isSelected
                        ? option.isCorrect
                          ? 'bg-[#EBF5EE] border-[#2E7D4E] text-[#1B4D2F] shadow-xs'
                          : 'bg-[#FDF3F3] border-[#D96B6B] text-[#B04343]'
                        : 'bg-white border-[#E2E8E0] text-[#18261E] hover:border-[#2E7D4E]/60 hover:bg-[#F8FAF8]'
                    }`}
                  >
                    <span>{option.text}</span>
                    {isSelected && option.isCorrect && <Check className="w-4 h-4 text-[#2E7D4E]" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {selectedAnswer !== null && (
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  selectedAnswer === 2
                    ? 'bg-[#EBF5EE] border border-[#C6E6CD] text-[#1B4D2F]'
                    : 'bg-[#FEF9ED] border border-[#FDE5A9] text-[#966F1C]'
                }`}
              >
                {selectedAnswer === 2 ? (
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E7D4E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Correct.</strong> 3x - 7 = 14 → 3x = 14 + 7 = 21 → x = 21/3 = 7. You earned +10 Mastery Points.
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <RotateCcw className="w-4 h-4 text-[#966F1C] shrink-0 mt-0.5" />
                    <div>
                      <strong>Keep going:</strong> Remember to transpose -7 to RHS as +7 first (14 + 7 = 21), then divide by 3.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 10-Q QUIZ PREVIEW */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <div>
                <span className="text-xs font-bold text-[#18261E] block">NCERT Chapter Test: Linear Equations</span>
                <span className="text-[11px] text-[#4E5C53]">10 Questions • Passing score: 70%</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#EBF5EE] text-[#1B4D2F] px-3 py-1 rounded-full text-xs font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>12:45 remaining</span>
              </div>
            </div>

            {/* Question Progress Tracker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#4E5C53]">
                <span>Question 4 of 10</span>
                <span className="font-semibold text-[#18261E]">40% Completed</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E2E8E0] overflow-hidden">
                <div className="h-full bg-[#2E7D4E] w-[40%] rounded-full transition-all" />
              </div>
            </div>

            {/* Mock Question */}
            <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] space-y-2">
              <span className="text-[11px] font-semibold text-[#4B749F] uppercase tracking-wider">Concept Check</span>
              <p className="text-xs sm:text-sm font-semibold text-[#18261E]">
                Which of the following is NOT a linear equation in one variable?
              </p>
              <div className="space-y-1.5 pt-1 text-xs text-[#4E5C53]">
                <div className="p-2 bg-white rounded-md border border-[#E2E8E0]">A) 2x + 5 = 11</div>
                <div className="p-2 bg-[#EBF5EE] rounded-md border border-[#2E7D4E] text-[#1B4D2F] font-semibold flex items-center justify-between">
                  <span>B) x² + 3x = 8 (Correct Answer: Degree is 2)</span>
                  <Check className="w-3.5 h-3.5 text-[#2E7D4E]" />
                </div>
                <div className="p-2 bg-white rounded-md border border-[#E2E8E0]">C) 5y - 2 = 18</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MASTERY PROGRESS */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] text-center space-y-1">
                <span className="text-2xl font-bold text-[#2E7D4E]">68%</span>
                <span className="text-xs font-semibold text-[#18261E] block">Chapter Mastery</span>
                <span className="text-[11px] text-[#4E5C53]">Level 3 Scholar</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] text-center space-y-1">
                <span className="text-2xl font-bold text-[#4B749F]">4 / 5</span>
                <span className="text-xs font-semibold text-[#18261E] block">Lessons Mastered</span>
                <span className="text-[11px] text-[#4E5C53]">1 Lesson Remaining</span>
              </div>
              <div className="p-4 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] text-center space-y-1">
                <span className="text-2xl font-bold text-[#18261E]">92%</span>
                <span className="text-xs font-semibold text-[#18261E] block">Quiz Average</span>
                <span className="text-[11px] text-[#1B4D2F] font-semibold">Distinction</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <span className="font-bold text-[#18261E] block">Milestone Checklist</span>
              <div className="space-y-1.5 text-[#4E5C53]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
                  <span className="line-through text-[#7E8C82]">Concept Video: One-Variable Fundamentals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
                  <span className="line-through text-[#7E8C82]">Revision Notes Download & Self-Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
                  <span className="line-through text-[#7E8C82]">Practice Drill 1 & 2 Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-[#4B749F] flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4B749F]" />
                  </span>
                  <span className="font-semibold text-[#18261E]">Next: Chapter Assessment Test (10 Questions)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Callout */}
      <div className="bg-[#F8FAF8] border-t border-[#E2E8E0] p-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-[#4E5C53]">
          Every lesson on ShikshaSetu is mapped directly to state and national board standards.
        </span>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 bg-[#2E7D4E] hover:bg-[#24663F] text-white px-3.5 py-1.5 rounded-lg font-semibold transition-all shadow-xs shrink-0"
        >
          <span>Explore Class 6–10 Syllabus</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
