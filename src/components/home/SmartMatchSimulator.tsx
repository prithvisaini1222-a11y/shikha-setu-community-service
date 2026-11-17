'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  BookOpen,
} from 'lucide-react';

export function SmartMatchSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<'math' | 'english'>('math');

  const scenarioData = {
    math: {
      volunteer: {
        name: 'Priya Sharma',
        role: 'Volunteer Educator',
        subject: 'Mathematics',
        grades: 'Class 7–8',
        day: 'Sundays',
        duration: '2 Hours',
        mode: 'Online Interactive',
        rating: '4.9/5',
      },
      institution: {
        name: 'Asha Kiran Children Home',
        location: 'New Delhi • Verified CCI',
        needTitle: 'Class 7 Mathematics Support',
        subject: 'Mathematics',
        grade: 'Class 7',
        day: 'Sundays',
        duration: '2 Hours',
        mode: 'Online Virtual Classroom',
        learnersCount: '18 Students',
      },
      matchPercent: 92,
      reasons: [
        { title: 'Subject Match', desc: 'Direct curriculum alignment on NCERT Mathematics' },
        { title: 'Grade Level', desc: 'Class 7 directly matches volunteer Class 7–8 specialty' },
        { title: 'Schedule Fit', desc: 'Sunday 10:00 AM – 12:00 PM mutual availability window' },
      ],
    },
    english: {
      volunteer: {
        name: 'Arjun Sen',
        role: 'Tech & Skills Mentor',
        subject: 'Spoken English & Digital Skills',
        grades: 'Class 8–10',
        day: 'Saturdays',
        duration: '2 Hours',
        mode: 'Hybrid / Online',
        rating: '5.0/5',
      },
      institution: {
        name: 'Prerna Bal Sadan',
        location: 'Jaipur • Verified CCI',
        needTitle: 'Digital Literacy & English Speaking',
        subject: 'Spoken English',
        grade: 'Class 8',
        day: 'Saturdays',
        duration: '2 Hours',
        mode: 'Hybrid Classroom',
        learnersCount: '15 Students',
      },
      matchPercent: 96,
      reasons: [
        { title: 'Subject Match', desc: 'Practical communication and conversational English syllabus' },
        { title: 'Grade Level', desc: 'Class 8 adolescent cohort seeking spoken fluency' },
        { title: 'Schedule Fit', desc: 'Saturday afternoon 2-hour interactive batch' },
      ],
    },
  };

  const current = scenarioData[selectedScenario];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E0] shadow-sm p-6 sm:p-8 card-interactive space-y-6">
      {/* Simulation Selector Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4E]">
            Live Matching Engine
          </span>
          <h3 className="text-lg font-bold text-[#18261E]">
            Automated alignment without administrative chaos
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-[#F8FAF8] p-1 rounded-xl border border-[#E2E8E0] self-start sm:self-auto">
          <button
            onClick={() => setSelectedScenario('math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === 'math'
                ? 'bg-[#2E7D4E] text-white shadow-xs'
                : 'text-[#4E5C53] hover:text-[#18261E]'
            }`}
          >
            Scenario 1: Mathematics
          </button>
          <button
            onClick={() => setSelectedScenario('english')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedScenario === 'english'
                ? 'bg-[#2E7D4E] text-white shadow-xs'
                : 'text-[#4E5C53] hover:text-[#18261E]'
            }`}
          >
            Scenario 2: English & Tech
          </button>
        </div>
      </div>

      {/* Side by side comparison with central connector */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
        {/* Left: Volunteer Card */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] space-y-4 hover:border-[#2E7D4E]/40 transition-colors">
          <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#EBF5EE] text-[#2E7D4E] flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#18261E] block">{current.volunteer.name}</span>
                <span className="text-[11px] text-[#4E5C53]">{current.volunteer.role}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4D2F] bg-[#EBF5EE] px-2 py-0.5 rounded border border-[#C6E6CD]">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Subject:</span>
              <strong className="text-[#18261E] font-semibold">{current.volunteer.subject}</strong>
            </div>
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Grades:</span>
              <strong className="text-[#18261E] font-semibold">{current.volunteer.grades}</strong>
            </div>
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Availability:</span>
              <strong className="text-[#18261E] font-semibold">{current.volunteer.day} ({current.volunteer.duration})</strong>
            </div>
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Mode:</span>
              <span className="text-[#2E7D4E] font-semibold">{current.volunteer.mode}</span>
            </div>
          </div>
        </div>

        {/* Center: Match Beam & Score Indicator */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center text-center py-2 lg:py-0 space-y-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#EBF5EE] border-4 border-[#C6E6CD] flex flex-col items-center justify-center shadow-xs">
              <span className="text-xl font-black text-[#1B4D2F] tracking-tight">
                {current.matchPercent}%
              </span>
              <span className="text-[10px] font-bold text-[#2E7D4E] uppercase tracking-wide">
                Match
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2E7D4E] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <span className="text-xs font-semibold text-[#18261E]">
            High Priority Alignment
          </span>

          {/* Animated Connecting Line */}
          <div className="w-full h-1 rounded-full animate-connector-beam" />
        </div>

        {/* Right: Institution Need Card */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#F8FAF8] border border-[#E2E8E0] space-y-4 hover:border-[#4B749F]/40 transition-colors">
          <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#EEF3F8] text-[#4B749F] flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#18261E] block">{current.institution.name}</span>
                <span className="text-[11px] text-[#4E5C53]">{current.institution.location}</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E4864] bg-[#EEF3F8] px-2 py-0.5 rounded border border-[#C9DCF5]">
              Verified Need
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Need:</span>
              <strong className="text-[#18261E] font-semibold">{current.institution.subject}</strong>
            </div>
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Grade:</span>
              <strong className="text-[#18261E] font-semibold">{current.institution.grade}</strong>
            </div>
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Schedule:</span>
              <strong className="text-[#18261E] font-semibold">{current.institution.day} ({current.institution.duration})</strong>
            </div>
            <div className="flex items-center justify-between text-[#4E5C53]">
              <span>Students:</span>
              <span className="text-[#4B749F] font-semibold">{current.institution.learnersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reasons Checklist */}
      <div className="bg-[#F8FAF8] rounded-xl p-4 border border-[#E2E8E0] space-y-3">
        <span className="text-xs font-bold text-[#18261E] block">
          Why this match succeeds:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {current.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-[#E2E8E0]">
              <div className="w-4 h-4 rounded-full bg-[#EBF5EE] text-[#2E7D4E] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#2E7D4E]" />
              </div>
              <div>
                <span className="font-bold text-[#18261E] block">{r.title}</span>
                <span className="text-[11px] text-[#4E5C53] leading-tight block mt-0.5">{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#4E5C53]">
          <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
          <span>Zero spam requests. Direct superintendent approval required for every session.</span>
        </div>

        <Link
          href="/teach"
          className="inline-flex items-center gap-2 bg-[#2E7D4E] hover:bg-[#24663F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:-translate-y-0.5 transition-all"
        >
          <span>Become a Volunteer Teacher</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
