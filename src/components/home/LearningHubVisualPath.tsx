'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Video,
  FileText,
  PenTool,
  CheckCircle2,
  TrendingUp,
  Play,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Award,
  Calculator,
  Atom,
  Languages,
  Globe2,
  Laptop,
  Check,
} from 'lucide-react';

export function LearningHubVisualPath() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [activeStage, setActiveStage] = useState<number>(2); // e.g. Practice active

  const subjects = [
    { name: 'Mathematics', icon: Calculator, topics: '14 Modules', color: '#4F9D69', activeTopic: 'Linear Equations in One Variable' },
    { name: 'Science', icon: Atom, topics: '18 Modules', color: '#6E9AD6', activeTopic: 'Cell Structure and Functions' },
    { name: 'English', icon: BookOpen, topics: '12 Modules', color: '#78B98A', activeTopic: 'Active & Passive Voice Mastery' },
    { name: 'Hindi', icon: Languages, topics: '10 Modules', color: '#D8A94D', activeTopic: 'व्याकरण एवं रचनात्मक लेखन' },
    { name: 'Social Science', icon: Globe2, topics: '16 Modules', color: '#4F9D69', activeTopic: 'The Indian Constitution' },
    { name: 'Computer', icon: Laptop, topics: '8 Modules', color: '#6E9AD6', activeTopic: 'Introduction to Python Logic' },
  ];

  const visualJourney = [
    {
      id: 0,
      title: 'VIDEO',
      sub: 'Concept Visualizer',
      desc: 'Bilingual 12-min interactive lesson animated with real-world examples.',
      icon: Video,
      status: 'completed',
    },
    {
      id: 1,
      title: 'NOTES',
      sub: 'Summary Mindmap',
      desc: 'Concise NCERT aligned revision cheat-sheet with formula highlights.',
      icon: FileText,
      status: 'completed',
    },
    {
      id: 2,
      title: 'PRACTICE',
      sub: 'Interactive Solving',
      desc: 'Solve step-by-step problems with AI hint assistance and feedback.',
      icon: PenTool,
      status: 'active',
    },
    {
      id: 3,
      title: 'TEST',
      sub: 'Adaptive Quiz',
      desc: '5-question mastery benchmark to test core concept retention.',
      icon: CheckCircle2,
      status: 'upcoming',
    },
    {
      id: 4,
      title: 'PROGRESS',
      sub: 'Mastery Ledger',
      desc: 'Badge awarded, learning streak updated, and report saved.',
      icon: TrendingUp,
      status: 'upcoming',
    },
  ];

  const currentSubjectData = subjects.find((s) => s.name === selectedSubject) || subjects[0];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E4E7E1] p-6 sm:p-10 shadow-xs space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E7E1]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
            Class 6–10 NCERT Curriculum Hub
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#25352B] tracking-tight">
            Learning Designed as a Visual Journey
          </h3>
          <p className="text-xs sm:text-sm text-[#647067] max-w-xl">
            Students master each topic through five clear milestone steps from concept explanation to verified mastery.
          </p>
        </div>

        {/* Grade Indicator Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#F8F7F2] p-1.5 rounded-2xl border border-[#E4E7E1]">
          <span className="text-xs font-semibold text-[#647067] px-2.5">Curriculum:</span>
          <span className="px-3 py-1 rounded-xl bg-[#4F9D69] text-white font-bold text-xs shadow-xs">
            Classes 6–10
          </span>
        </div>
      </div>

      {/* Subject Switcher Row */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">
          Select Subject Stream
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj.name;
            const SubjIcon = subj.icon;
            return (
              <button
                key={subj.name}
                type="button"
                onClick={() => setSelectedSubject(subj.name)}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#4F9D69] shadow-xs ring-2 ring-[#4F9D69]/20'
                    : 'bg-[#F8F7F2] border-transparent hover:bg-white hover:border-[#E4E7E1]'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${subj.color}15`, color: subj.color }}
                >
                  <SubjIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#25352B] leading-tight">{subj.name}</div>
                  <div className="text-[10px] text-[#647067]">{subj.topics}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Course Snapshot: Continue Learning Card */}
      <div className="bg-[#F8F7F2] rounded-2xl p-5 sm:p-6 border border-[#E4E7E1] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#EEF7F0] text-[#4F9D69] border border-[#78B98A]">
              Continue Learning
            </span>
            <span className="text-xs text-[#647067]">• NCERT {selectedSubject}</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold text-[#25352B]">
            {currentSubjectData.activeTopic}
          </h4>
          <p className="text-xs text-[#647067]">
            Currently at Stage 3 (Step-by-Step Practice). You have completed Video and Mindmap Notes.
          </p>
        </div>

        {/* Progress meter */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="space-y-1 text-right">
            <span className="text-xs font-bold text-[#25352B]">60% Completed</span>
            <div className="w-36 h-2 rounded-full bg-[#E4E7E1] overflow-hidden">
              <div className="w-[60%] h-full bg-[#4F9D69] rounded-full transition-all duration-500" />
            </div>
            <span className="text-[10px] text-[#647067]">3 of 5 Steps Finished</span>
          </div>

          <Link
            href="/learn"
            className="px-4 py-2.5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 hover:-translate-y-0.5 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume</span>
          </Link>
        </div>
      </div>

      {/* Visual Learning Path: VIDEO -> NOTES -> PRACTICE -> TEST -> PROGRESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#647067] uppercase tracking-wider">
            Interactive Learning Pipeline
          </span>
          <span className="text-xs text-[#4F9D69] font-semibold">Click any step to inspect</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {visualJourney.map((step, idx) => {
            const Icon = step.icon;
            const isStepActive = activeStage === step.id;
            const isCompleted = step.id < activeStage;

            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setActiveStage(step.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-44 relative group ${
                  isStepActive
                    ? 'bg-white border-[#4F9D69] ring-2 ring-[#4F9D69]/20 shadow-md -translate-y-1'
                    : isCompleted
                    ? 'bg-[#EEF7F0]/60 border-[#78B98A] hover:bg-[#EEF7F0]'
                    : 'bg-[#F8F7F2] border-[#E4E7E1] hover:border-[#78B98A] opacity-80'
                }`}
              >
                {/* Status Indicator */}
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-colors ${
                      isStepActive
                        ? 'bg-[#4F9D69] text-white'
                        : isCompleted
                        ? 'bg-[#4F9D69] text-white'
                        : 'bg-white text-[#8E9990] border border-[#E4E7E1]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCompleted
                        ? 'bg-[#4F9D69]/10 text-[#4F9D69]'
                        : isStepActive
                        ? 'bg-[#4F9D69] text-white'
                        : 'bg-white text-[#8E9990] border border-[#E4E7E1]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>Completed</span>
                      </>
                    ) : isStepActive ? (
                      'In Progress'
                    ) : (
                      `Step ${idx + 1}`
                    )}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1 pt-3">
                  <h5 className="text-sm font-bold text-[#25352B] tracking-tight flex items-center justify-between">
                    <span>{step.title}</span>
                    {idx < 4 && <ChevronRight className="w-3.5 h-3.5 text-[#8E9990] hidden sm:block" />}
                  </h5>
                  <div className="text-[11px] font-semibold text-[#4F9D69]">{step.sub}</div>
                  <p className="text-[10px] text-[#647067] leading-relaxed line-clamp-2">
                    {step.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
