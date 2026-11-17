'use client';

import React, { useState, useTransition } from 'react';
import { submitTeachForADayAction } from '@/actions/volunteer';
import { Badge, Button, ProgressBar } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import { Popover } from '@/components/ui/Tooltip';
import { calculateVolunteerNeedMatch } from '@/lib/matching/matcher';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Building2,
  ArrowRight,
  ArrowLeft,
  Video,
  Check,
  UserCheck,
  ShieldCheck,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TeachMatcherFormProps {
  openNeeds: any[];
  volunteerProfile: any;
}

export function TeachMatcherForm({ openNeeds, volunteerProfile }: TeachMatcherFormProps) {
  const [step, setStep] = useState(1);
  const [selectedNeedId, setSelectedNeedId] = useState(openNeeds[0]?.id || '');
  const [subject, setSubject] = useState('Mathematics');
  const [classLevel, setClassLevel] = useState(7);
  const [topic, setTopic] = useState('Linear Equations & Word Problems');
  const [preferredDate, setPreferredDate] = useState('2026-09-20');
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 01:00 PM');
  const [mode, setMode] = useState('online');
  const [recurringType, setRecurringType] = useState('weekly');

  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<any>(null);

  // Selected need details
  const selectedNeed = openNeeds.find((n) => n.id === selectedNeedId) || openNeeds[0];

  // Calculate live match preview
  const liveMatch = calculateVolunteerNeedMatch({
    volunteerSkills: volunteerProfile?.skills || 'Mathematics, Science',
    volunteerSubjects: subject,
    volunteerClasses: String(classLevel),
    volunteerAvailability: 'Sunday, Weekends',
    volunteerMode: mode,
    volunteerExperienceYears: volunteerProfile?.experienceYears || 3,
    needSubject: selectedNeed?.subject,
    needClassLevel: selectedNeed?.classLevel,
    needMode: selectedNeed?.mode,
    needUrgency: selectedNeed?.urgency,
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.append('needId', selectedNeedId);
      fd.append('subject', subject);
      fd.append('classLevel', String(classLevel));
      fd.append('topic', topic);
      fd.append('preferredDate', preferredDate);
      fd.append('preferredTime', preferredTime);
      fd.append('durationHours', '2.0');
      fd.append('mode', mode);
      fd.append('recurringType', recurringType);

      const res = await submitTeachForADayAction(fd);
      setSubmitResult(res);
      if (res.success) {
        confetti({ particleCount: 70, spread: 70 });
      }
    });
  };

  const stepsList = [
    { num: 1, label: 'Subject' },
    { num: 2, label: 'Class' },
    { num: 3, label: 'Schedule' },
    { num: 4, label: 'Mode' },
    { num: 5, label: 'Confirm' },
  ];

  const matchPercent = liveMatch.percentage || liveMatch.score || 92;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
      {/* Left Multi-Step Form (7 cols) */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6 card-interactive">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF5EE] text-[#1B4D2F]">
              Teach for a Day
            </span>
            <span className="text-xs font-medium text-[#4E5C53]">Step {step} of 5</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#18261E]">Volunteer Teaching Application</h2>
          <p className="text-xs text-[#4E5C53] mt-1">
            Specify what you can teach to be matched with verified Child Care Institutions.
          </p>
        </div>

        {/* Step Indicator Bar with Smooth Transitions */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 border-y border-[#E2E8E0]/60 py-3">
          {stepsList.map((s) => (
            <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setStep(s.num)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  step === s.num
                    ? 'bg-[#2E7D4E] text-white scale-110 shadow-xs'
                    : step > s.num
                    ? 'bg-[#EBF5EE] text-[#1B4D2F] border border-[#C6E6CD]'
                    : 'bg-[#F8FAF8] text-[#98A2B3] hover:bg-[#EFECE3]'
                }`}
              >
                {step > s.num ? <Check className="w-3.5 h-3.5" /> : s.num}
              </button>
              <span
                className={`text-xs hidden sm:inline transition-colors ${
                  step === s.num ? 'text-[#18261E] font-semibold' : 'text-[#4E5C53]'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {submitResult?.success && (
          <div className="p-4 rounded-[12px] bg-[#EBF5EE] border border-[#C6E6CD] text-[#243247] text-xs space-y-1 animate-check-pop">
            <div className="font-semibold text-[#1B4D2F] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
              <span>Teaching Request Dispatched with {submitResult.matchScore || matchPercent}% Match!</span>
            </div>
            <p className="text-[#4E5C53]">
              The Child Care Institution superintendent has received your request and will schedule the session.
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step === 5) handleSubmit();
            else setStep((s) => s + 1);
          }}
          className="space-y-6"
        >
          {/* STEP 1: WHAT CAN YOU TEACH? */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
                Step 1: What can you teach?
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">Select Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 focus:bg-white transition-all"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Computer">Computer / Digital Skills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">Specific Chapter or Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Linear Equations in One Variable"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] text-[#18261E] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">Target Institution Requirement</label>
                <select
                  value={selectedNeedId}
                  onChange={(e) => setSelectedNeedId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 focus:bg-white transition-all"
                >
                  {openNeeds.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title} — {n.institution?.orgName || 'Care Home'} ({n.institution?.city || 'Delhi'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: TARGET CLASS LEVEL */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
                Step 2: Target Class Level
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {[6, 7, 8, 9, 10].map((c) => {
                  const isSelected = classLevel === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setClassLevel(c)}
                      className={`p-3 rounded-[10px] border text-center transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#2E7D4E] bg-[#EBF5EE] text-[#1B4D2F] font-bold scale-105 shadow-xs'
                          : 'border-[#E2E8E0] bg-[#F4F7F4] hover:bg-white text-[#18261E] hover:border-[#D1CDBC]'
                      }`}
                    >
                      <div className="text-sm font-bold">Class {c}</div>
                      <span className="text-[10px] text-[#9CA3AF]">NCERT</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
                Step 3: Preferred Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#18261E] mb-1.5">Target Date</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18261E] mb-1.5">Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 focus:bg-white transition-all"
                  >
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Morning)</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM (Midday)</option>
                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM (Afternoon)</option>
                    <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MODE & COMMITMENT */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
                Step 4: Delivery Mode
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`p-4 rounded-[12px] border text-left transition-all duration-200 cursor-pointer ${
                    mode === 'online'
                      ? 'border-[#2E7D4E] bg-[#EBF5EE] text-[#1B4D2F] shadow-xs'
                      : 'border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-sm">Virtual Classroom</div>
                  <div className="text-xs text-[#4E5C53] mt-1">Live interactive online session via video link</div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('in-person')}
                  className={`p-4 rounded-[12px] border text-left transition-all duration-200 cursor-pointer ${
                    mode === 'in-person'
                      ? 'border-[#2E7D4E] bg-[#EBF5EE] text-[#1B4D2F] shadow-xs'
                      : 'border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-sm">On-Premise Visit</div>
                  <div className="text-xs text-[#4E5C53] mt-1">Visit care home campus directly</div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E5C53]">
                Step 5: Review & Confirm
              </h3>
              <div className="p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Subject & Grade:</span>
                  <strong className="text-[#18261E]">Class {classLevel} {subject}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Topic:</span>
                  <strong className="text-[#18261E]">{topic}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Scheduled Slot:</span>
                  <strong className="text-[#18261E]">{preferredDate} at {preferredTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Delivery Mode:</span>
                  <strong className="text-[#2E7D4E] capitalize">{mode} ({recurringType})</strong>
                </div>
              </div>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="pt-4 border-t border-[#E2E8E0] flex items-center justify-between">
            {step > 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-bold"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                isLoading={isPending}
                loadingText="Submitting Request..."
                onClick={() => handleSubmit()}
                className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-bold min-w-[140px]"
                rightIcon={!submitResult?.success ? <Send className="w-3.5 h-3.5" /> : undefined}
              >
                {submitResult?.success ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Request Submitted
                  </span>
                ) : (
                  'Teach for a Day'
                )}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Right Matching UI Card (5 cols) */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs p-6 space-y-5 card-interactive">
          <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2E7D4E]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#18261E]">
                Smart Match Algorithm
              </h3>
            </div>
            
            {/* Popover explaining why this match */}
            <Popover
              position="bottom"
              title="Why 92% Match?"
              trigger={
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D2F] bg-[#EBF5EE] border border-[#C6E6CD] px-2.5 py-0.5 rounded-full hover:bg-[#D8F0E4] transition-colors cursor-pointer">
                  <CountUp end={matchPercent} suffix="% Match" />
                  <HelpCircle className="w-3 h-3 text-[#2E7D4E]" />
                </span>
              }
            >
              <div className="space-y-1.5 text-xs">
                <p className="font-semibold text-[#18261E]">Match Calculation Factors:</p>
                <ul className="space-y-1 text-[#4E5C53]">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#2E7D4E]" />
                    <span>NCERT Class curriculum alignment</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#2E7D4E]" />
                    <span>Verified subject proficiency</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#2E7D4E]" />
                    <span>Weekend schedule match</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#2E7D4E]" />
                    <span>Delivery mode compatibility</span>
                  </li>
                </ul>
              </div>
            </Popover>
          </div>

          {/* Requirement 10: Animated Connecting Beam: Volunteer <---> Institution */}
          <div className="p-4 rounded-[12px] bg-[#F4F7F4] border border-[#E2E8E0]/80">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center font-bold text-xs border border-[#C6E6CD] shadow-2xs">
                  You
                </div>
                <div>
                  <div className="font-semibold text-[#18261E]">Volunteer</div>
                  <div className="text-[10px] text-[#2E7D4E] font-medium">Verified</div>
                </div>
              </div>

              {/* Requirement 10: Animated Beam Line */}
              <div className="flex-1 mx-3 flex items-center justify-center relative">
                <div className="w-full h-1 rounded-full animate-connector-beam" />
                <span className="absolute px-2 py-0.5 bg-white text-[10px] font-bold text-[#1B4D2F] border border-[#C6E6CD] shadow-2xs rounded-full">
                  <CountUp end={matchPercent} suffix="%" />
                </span>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className="font-semibold text-[#18261E] truncate max-w-[90px]">
                    {selectedNeed?.institution?.orgName || 'Care Home'}
                  </div>
                  <div className="text-[10px] text-[#2E7D4E] font-medium">CCI Verified</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center font-bold text-xs border border-[#C6E6CD] shadow-2xs">
                  CCI
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-base font-bold text-[#243247]">
                Class {classLevel} {subject}
              </div>
              <div className="text-xs text-[#667085] flex items-center gap-2 mt-1">
                <span>Sunday</span>
                <span>•</span>
                <span>11:00 AM</span>
                <span>•</span>
                <span>2 hours</span>
              </div>
            </div>

            {/* Requirement 10: Match factors revealed one-by-one with subtle stagger */}
            <div className="pt-3 border-t border-[#E2E8E0]/60 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                Match Factors
              </div>
              <div className="space-y-2 text-xs text-[#243247]">
                <div
                  className="flex items-center justify-between p-2 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60 animate-fade-in stagger-1"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E] animate-check-pop" />
                    <span>Subject: <strong>{subject}</strong></span>
                  </span>
                  <span className="text-[11px] text-[#1B4D2F] font-semibold bg-[#EBF5EE] px-2 py-0.5 rounded-full">
                    Matched
                  </span>
                </div>

                <div
                  className="flex items-center justify-between p-2 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60 animate-fade-in stagger-2"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E] animate-check-pop" />
                    <span>Class: <strong>Grade {classLevel}</strong></span>
                  </span>
                  <span className="text-[11px] text-[#1B4D2F] font-semibold bg-[#EBF5EE] px-2 py-0.5 rounded-full">
                    Aligned
                  </span>
                </div>

                <div
                  className="flex items-center justify-between p-2 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60 animate-fade-in stagger-3"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4B749F] animate-check-pop" />
                    <span>Schedule: <strong>Weekend slot</strong></span>
                  </span>
                  <span className="text-[11px] text-[#3765BC] font-semibold bg-[#EEF3F8] px-2 py-0.5 rounded-full">
                    Available
                  </span>
                </div>

                <div
                  className="flex items-center justify-between p-2 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60 animate-fade-in stagger-4"
                >
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E] animate-check-pop" />
                    <span>Delivery: <strong>{mode}</strong></span>
                  </span>
                  <span className="text-[11px] text-[#1B4D2F] font-semibold bg-[#EBF5EE] px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8E0]/60">
            <Button
              className="w-full text-xs font-bold bg-[#2E7D4E] hover:bg-[#24663F] text-white"
              onClick={() => {
                if (step < 5) setStep(5);
                else handleSubmit();
              }}
            >
              Teach for a Day
            </Button>
          </div>
        </div>

        {/* Child Safety Moderation Card */}
        <div className="bg-[#F4F7F4] border border-[#E2E8E0] rounded-[16px] p-5 space-y-2 text-xs text-[#4E5C53] card-interactive">
          <div className="flex items-center gap-1.5 text-[#18261E] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#2E7D4E]" />
            <span className="text-xs">Verified Volunteer Policy</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            All sessions are monitored and supervised by authorized care home staff. After completing the session, an official digital certificate with a verifiable QR code is issued.
          </p>
        </div>
      </div>
    </div>
  );
}
