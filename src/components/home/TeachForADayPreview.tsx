'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Users,
  Info,
} from 'lucide-react';

export function TeachForADayPreview() {
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedGrade, setSelectedGrade] = useState('Class 8');
  const [selectedDay, setSelectedDay] = useState('Saturday Morning');
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E4E7E1] p-6 sm:p-10 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E7E1]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
            Volunteer Matching Engine
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#25352B] tracking-tight">
            Teach for a Day: Instant Smart Match
          </h3>
          <p className="text-xs sm:text-sm text-[#647067] max-w-xl">
            Choose your subject, target class, and weekend slot. Our algorithm pairs you with verified Child Care Institutions needing your exact skills.
          </p>
        </div>

        <Link
          href="/teach"
          className="px-4 py-2 rounded-xl bg-[#EEF7F0] text-[#4F9D69] hover:bg-[#4F9D69] hover:text-white transition-all text-xs font-bold border border-[#78B98A] flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Explore All 24 Open Sessions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Interactive Matcher Workspace: Split 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column (5 cols): Volunteer Selector Panel */}
        <div className="lg:col-span-5 space-y-5 bg-[#F8F7F2] p-6 rounded-2xl border border-[#E4E7E1]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#25352B] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#4F9D69]" />
              <span>Configure Your Availability</span>
            </span>
            <span className="text-[10px] font-bold text-[#4F9D69] bg-white px-2 py-0.5 rounded-full border border-[#E4E7E1]">
              Live Simulator
            </span>
          </div>

          {/* Subject selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#647067]">Subject Expertise</label>
            <div className="grid grid-cols-3 gap-2">
              {['Mathematics', 'Science', 'English'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-[#4F9D69] text-white shadow-xs'
                      : 'bg-white text-[#25352B] border border-[#E4E7E1] hover:border-[#78B98A]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Target Grade selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#647067]">Preferred Class Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['Class 6', 'Class 8', 'Class 10'].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedGrade(cls)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    selectedGrade === cls
                      ? 'bg-[#4F9D69] text-white shadow-xs'
                      : 'bg-white text-[#25352B] border border-[#E4E7E1] hover:border-[#78B98A]'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Slot */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#647067]">Preferred Day & Time</label>
            <div className="grid grid-cols-2 gap-2">
              {['Saturday Morning', 'Sunday Afternoon'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedDay(slot)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                    selectedDay === slot
                      ? 'bg-[#4F9D69] text-white shadow-xs'
                      : 'bg-white text-[#25352B] border border-[#E4E7E1] hover:border-[#78B98A]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Matched Opportunity Card & Visual Link */}
        <div className="lg:col-span-7 relative">
          <div className="bg-white rounded-2xl border-2 border-[#4F9D69] p-6 sm:p-7 shadow-lg space-y-6 relative overflow-hidden">
            {/* Top Match Bar with Tooltip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EEF7F0] text-[#4F9D69] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#4F9D69] uppercase tracking-wider block">
                    Verified Match Found
                  </span>
                  <h4 className="text-sm font-bold text-[#25352B]">
                    Asha Kiran Children’s Home
                  </h4>
                </div>
              </div>

              {/* 92% Match Badge with Hover Tooltip */}
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-[#EEF7F0] border border-[#4F9D69] text-[#4F9D69] text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs hover:bg-[#4F9D69] hover:text-white transition-colors"
                >
                  <span>92% Match</span>
                  <Info className="w-3.5 h-3.5 shrink-0" />
                </button>

                {/* Popup Tooltip */}
                {showTooltip && (
                  <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#25352B] text-white rounded-xl shadow-xl z-20 text-xs space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold text-[11px] text-[#78B98A] border-b border-white/10 pb-1 flex items-center justify-between">
                      <span>Match Quality Breakdown</span>
                      <span>92%</span>
                    </div>
                    <div className="space-y-1 text-[11px] text-white/90">
                      <div className="flex items-center gap-1.5 text-[#EEF7F0]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#78B98A]" />
                        <span>Exact Subject: {selectedSubject}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#EEF7F0]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#78B98A]" />
                        <span>Class Match: {selectedGrade} (18 Students)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#EEF7F0]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#78B98A]" />
                        <span>Schedule: {selectedDay}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F8F7F2] border border-[#E4E7E1] text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#4F9D69]" />
                <div>
                  <div className="text-[10px] text-[#647067]">Date & Slot</div>
                  <div className="font-bold text-[#25352B]">{selectedDay}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4F9D69]" />
                <div>
                  <div className="text-[10px] text-[#647067]">Duration</div>
                  <div className="font-bold text-[#25352B]">2 Hours Interactive</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#4F9D69]" />
                <div>
                  <div className="text-[10px] text-[#647067]">Cohort Size</div>
                  <div className="font-bold text-[#25352B]">18 Students</div>
                </div>
              </div>
            </div>

            {/* Verification & Child Safety Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#647067] pt-1">
              <div className="flex items-center gap-1 text-[#4F9D69] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified CC Institution (JJ Act Reg #KA-2019-88)</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4F9D69]" />
                <span>Smart TV Whiteboard Connected</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Link
                href="/teach"
                className="w-full py-3 px-5 rounded-xl bg-[#4F9D69] hover:bg-[#3E8555] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <span>Confirm & Reserve This Teaching Slot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
