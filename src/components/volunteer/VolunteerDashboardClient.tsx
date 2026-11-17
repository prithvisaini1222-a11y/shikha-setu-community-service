'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { updateSessionStatusAction } from '@/actions/volunteer';
import { answerDoubtAction } from '@/actions/learning';
import { Badge, Button, ProgressBar } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import { TeachMatcherForm } from './TeachMatcherForm';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  Check,
  Video,
  User,
  MessageSquare,
  FileText,
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  Sliders,
  HelpCircle,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VolunteerDashboardClientProps {
  volunteer: any;
  openNeeds: any[];
  allSessions: any[];
  certificates: any[];
  requests: any[];
  doubts?: any[];
}

export function VolunteerDashboardClient({
  volunteer,
  openNeeds,
  allSessions,
  certificates,
  requests,
  doubts = [],
}: VolunteerDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'opportunities'
    | 'teach'
    | 'sessions'
    | 'doubts'
    | 'contributions'
    | 'skills'
    | 'certificates'
    | 'messages'
    | 'profile'
  >('overview');

  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isReportingIssue, setIsReportingIssue] = useState<string | null>(null);
  const [issueText, setIssueText] = useState('');
  const [isPending, startTransition] = useTransition();

  // Student Doubts state
  const [doubtList, setDoubtList] = useState<any[]>(doubts || []);
  const [doubtFilter, setDoubtFilter] = useState<'ALL' | 'OPEN' | 'ANSWERED'>('ALL');
  const [answeringDoubtId, setAnsweringDoubtId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isAnsweringDoubt, setIsAnsweringDoubt] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const hours = volunteer.totalHours || 24;
  const sessionsCount = volunteer.totalSessions || 12;
  const learnersSupported = sessionsCount * 18;
  const verifiedContributions = certificates.length || 3;
  const openDoubtsCount = doubtList.filter((d) => d.status === 'OPEN').length;

  const handleAnswerDoubt = async (doubtId: string) => {
    if (!answerText.trim()) return;
    setIsAnsweringDoubt(true);
    setAnswerFeedback(null);
    try {
      const res = await answerDoubtAction({ doubtId, answer: answerText.trim() });
      if (res.success && res.doubt) {
        setDoubtList((prev) =>
          prev.map((d) =>
            d.id === doubtId
              ? {
                  ...d,
                  status: 'ANSWERED',
                  answer: answerText.trim(),
                  answeredBy: { name: volunteer.fullName || 'Verified Educator', role: 'VOLUNTEER' },
                  answeredAt: new Date().toISOString(),
                }
              : d
          )
        );
        setAnsweringDoubtId(null);
        setAnswerText('');
        setAnswerFeedback({ type: 'success', message: 'Doubt answered successfully!' });
        confetti({ particleCount: 50, spread: 60 });
      } else {
        setAnswerFeedback({ type: 'error', message: res.error || 'Failed to answer doubt.' });
      }
    } catch (err: any) {
      setAnswerFeedback({ type: 'error', message: err.message || 'Error submitting answer.' });
    } finally {
      setIsAnsweringDoubt(false);
    }
  };

  // Complete session action
  const handleCompleteSession = (sessionId: string) => {
    startTransition(async () => {
      await updateSessionStatusAction({
        sessionId,
        status: 'COMPLETED' as any,
        attendanceCount: 18,
        volunteerFeedback: 'Lesson delivered successfully. High student enthusiasm.',
      });
      confetti({ particleCount: 70, spread: 60 });
      setSelectedSession(null);
    });
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'opportunities', label: 'Opportunities', icon: Sparkles, count: openNeeds.length },
    { id: 'teach', label: 'Teach for a Day', icon: GraduationCap },
    { id: 'sessions', label: 'My Sessions', icon: Calendar, count: allSessions.length },
    { id: 'doubts', label: 'Student Doubts', icon: HelpCircle, count: openDoubtsCount },
    { id: 'contributions', label: 'My Contributions', icon: Layers, count: requests.length },
    { id: 'skills', label: 'Skills', icon: Sliders },
    { id: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8E0] shadow-xs">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF7F0] text-[#1B4D2F] text-xs font-bold border border-[#78B98A]/30">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
            <span>Verified Volunteer Teacher</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18261E] tracking-tight">
            Make your skills count.
          </h1>
          <p className="text-xs sm:text-sm text-[#4E5C53] max-w-xl">
            Welcome back, {volunteer.fullName}. Your teaching brings clarity and confidence to children in care institutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="md"
            onClick={() => setActiveTab('teach')}
            className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-bold shadow-xs cursor-pointer"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Teach for a Day
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={hours} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Volunteer Hours</div>
          <p className="text-[11px] text-[#2E7D4E]">Verified by care homes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={sessionsCount} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Sessions Conducted</div>
          <p className="text-[11px] text-[#2E7D4E]">Classes & workshops</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={learnersSupported} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Learners Supported</div>
          <p className="text-[11px] text-[#2E7D4E]">Impact in care homes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="text-3xl font-extrabold text-[#18261E] tracking-tight">
            <CountUp end={verifiedContributions} />
          </div>
          <div className="text-xs font-semibold text-[#4E5C53]">Verified Contributions</div>
          <p className="text-[11px] text-[#2E7D4E]">Authenticated certificates</p>
        </div>
      </div>

      {/* 3. Main Layout: Sidebar (3 cols) + Content (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#647067]">
            Volunteer Workspace
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EEF7F0] text-[#1B4D2F] font-bold shadow-2xs'
                      : 'text-[#4E5C53] hover:bg-[#FAFBF9] hover:text-[#18261E]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D4E]' : 'text-[#8E9990]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#1B4D2F] border border-[#78B98A]/30'
                          : 'bg-[#FAFBF9] text-[#647067] border border-[#E2E8E0]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Visual Matching Highlight */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E7D4E]" />
                    <h3 className="text-sm font-bold text-[#18261E]">Smart Match Recommendation</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('opportunities')}
                    className="text-xs font-bold text-[#2E7D4E] hover:underline"
                  >
                    View All Matches →
                  </button>
                </div>

                {/* Animated Connecting Visual */}
                <div className="p-4 sm:p-6 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-3 text-xs">
                    {/* Volunteer Side */}
                    <div className="sm:col-span-5 bg-white p-4 rounded-xl border border-[#E2E8E0] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#647067] uppercase">Your Profile</span>
                        <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
                      </div>
                      <strong className="text-sm text-[#18261E] block">Class 7 & 8 Mathematics</strong>
                      <div className="text-[11px] text-[#4E5C53] space-y-1">
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E] shrink-0" /><span>Available: Sunday 10am - 1pm</span></p>
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E] shrink-0" /><span>Mode: Online / Video Hub</span></p>
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E] shrink-0" /><span>Experience: 3+ years teaching</span></p>
                      </div>
                    </div>

                    {/* Connecting Match Symbol */}
                    <div className="sm:col-span-1 flex flex-col items-center justify-center py-2 sm:py-0">
                      <div className="w-9 h-9 rounded-full bg-[#EEF7F0] border border-[#78B98A] flex items-center justify-center font-extrabold text-xs text-[#2E7D4E] animate-pulse shadow-2xs">
                        92%
                      </div>
                      <span className="text-[9px] font-bold text-[#2E7D4E] mt-1">MATCH</span>
                    </div>

                    {/* Institution Need Side */}
                    <div className="sm:col-span-5 bg-white p-4 rounded-xl border border-[#E2E8E0] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#647067] uppercase">Institution Requirement</span>
                        <span className="w-2 h-2 rounded-full bg-[#6E9AD6]" />
                      </div>
                      <strong className="text-sm text-[#18261E] block">Asha Kiran Care Home</strong>
                      <div className="text-[11px] text-[#4E5C53] space-y-1">
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6E9AD6] shrink-0" /><span>Subject: Class 7 Mathematics</span></p>
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6E9AD6] shrink-0" /><span>Time: Sunday 2 Hours slot</span></p>
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#6E9AD6] shrink-0" /><span>Learners: 18 students eager to learn</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      onClick={() => setActiveTab('teach')}
                      className="bg-[#2E7D4E] text-white"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Apply for this Match
                    </Button>
                  </div>
                </div>
              </div>

              {/* Scheduled Sessions Snapshot */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <h3 className="text-sm font-bold text-[#18261E]">Upcoming Teaching Sessions</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sessions')}
                    className="text-xs font-bold text-[#2E7D4E] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {allSessions.length === 0 ? (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-[#647067]">No sessions scheduled yet.</p>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab('opportunities')}
                      className="bg-[#2E7D4E] text-white"
                    >
                      Find an Opportunity
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allSessions.slice(0, 3).map((session) => (
                      <div
                        key={session.id}
                        className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <strong className="text-sm text-[#18261E] block">{session.title}</strong>
                          <p className="text-[#647067] text-[11px]">
                            {session.institution?.orgName} • {new Date(session.scheduledStart).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                            {session.status}
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedSession(session)}
                            className="text-[11px]"
                          >
                            Session Detail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Academic Doubts Snapshot */}
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#2E7D4E]" />
                    <h3 className="text-sm font-bold text-[#18261E]">Student Doubts Awaiting Mentor</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('doubts')}
                    className="text-xs font-bold text-[#2E7D4E] hover:underline cursor-pointer"
                  >
                    View All ({openDoubtsCount}) →
                  </button>
                </div>

                {openDoubtsCount === 0 ? (
                  <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-center text-xs text-[#647067]">
                    All student questions are currently answered. New doubts will appear here as students practice.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {doubtList
                      .filter((d) => d.status === 'OPEN')
                      .slice(0, 2)
                      .map((d) => (
                        <div
                          key={d.id}
                          className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#1B4D2F] bg-[#EEF7F0] px-2 py-0.5 rounded-full text-[10px]">
                                {d.subject?.name || 'Academic'}
                              </span>
                              <span className="font-semibold text-[#18261E]">
                                {d.chapter?.title ? `Ch: ${d.chapter.title}` : 'Syllabus'}
                              </span>
                            </div>
                            <p className="text-xs text-[#25352B] line-clamp-1 font-medium">{d.question}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setActiveTab('doubts');
                              setAnsweringDoubtId(d.id);
                            }}
                            className="bg-[#2E7D4E] text-white text-[11px] shrink-0 cursor-pointer"
                          >
                            Answer Question
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Volunteer Opportunities</h3>
                <p className="text-xs text-[#647067]">
                  Care homes and non-profit centers requesting volunteer teachers and mentors.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {openNeeds.map((need) => (
                  <div
                    key={need.id}
                    className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E2E8E0] hover:border-[#78B98A] transition-all flex flex-col justify-between space-y-3 text-xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                          92% Match
                        </span>
                        <span className="text-[11px] text-[#647067]">Sunday 2h</span>
                      </div>
                      <strong className="text-sm text-[#18261E] block">{need.title}</strong>
                      <p className="text-[#647067] text-[11px] flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#8E9990]" />
                        <span>{need.institution?.orgName}</span>
                      </p>
                      <p className="text-[#4E5C53] text-[11px] line-clamp-2 leading-relaxed">
                        {need.description}
                      </p>
                      <div className="pt-2 border-t border-[#E2E8E0]/60 text-[10px] text-[#647067] space-y-1">
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#2E7D4E] shrink-0" /><span>Subject: {need.subject || 'All Subjects'}</span></p>
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#2E7D4E] shrink-0" /><span>Class: {need.classLevel ? `Class ${need.classLevel}` : 'Middle School'}</span></p>
                        <p className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#2E7D4E] shrink-0" /><span>Availability: Weekend slots open</span></p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedOpportunity(need);
                          setActiveTab('teach');
                        }}
                        className="w-full bg-[#2E7D4E] text-white"
                      >
                        View Opportunity & Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEACH FOR A DAY */}
          {activeTab === 'teach' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Teach for a Day — Multi-Step Matcher</h3>
                <p className="text-xs text-[#647067]">
                  Select subject, class, topic, availability, and mode to generate matching care home sessions.
                </p>
              </div>

              <TeachMatcherForm
                openNeeds={openNeeds}
                volunteerProfile={volunteer}
              />
            </div>
          )}

          {/* TAB 4: MY SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">My Teaching Sessions</h3>
                <p className="text-xs text-[#647067]">Manage scheduled, ongoing, and completed sessions.</p>
              </div>

              {allSessions.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <Calendar className="w-10 h-10 text-[#8E9990] mx-auto" />
                  <h4 className="text-sm font-bold text-[#18261E]">No sessions yet.</h4>
                  <p className="text-xs text-[#647067]">Find an opportunity and start teaching.</p>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('opportunities')}
                    className="bg-[#2E7D4E] text-white"
                  >
                    Explore Opportunities
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {allSessions.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-sm text-[#18261E]">{s.title}</strong>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                            {s.status}
                          </span>
                        </div>
                        <p className="text-[#647067] text-[11px]">
                          {s.institution?.orgName} • {new Date(s.scheduledStart).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedSession(s)}
                          className="text-[11px]"
                        >
                          View Detail
                        </Button>
                        {s.status === 'SCHEDULED' && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteSession(s.id)}
                            className="bg-[#2E7D4E] text-white text-[11px]"
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: STUDENT ACADEMIC DOUBTS */}
          {activeTab === 'doubts' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/60 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF7F0] text-[#1B4D2F] text-[10px] font-bold border border-[#78B98A]/30 mb-1">
                    <HelpCircle className="w-3 h-3 text-[#2E7D4E]" />
                    <span>Academic Mentorship Queue</span>
                  </div>
                  <h3 className="text-base font-bold text-[#18261E]">Care Home Student Doubts</h3>
                  <p className="text-xs text-[#647067]">
                    Support learners in CCIs across Classes 6–10 by providing clear, encouraging explanations.
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 bg-[#FAFBF9] p-1 rounded-xl border border-[#E2E8E0] text-xs">
                  <button
                    type="button"
                    onClick={() => setDoubtFilter('ALL')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      doubtFilter === 'ALL'
                        ? 'bg-[#2E7D4E] text-white shadow-xs'
                        : 'text-[#647067] hover:text-[#18261E]'
                    }`}
                  >
                    All ({doubtList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoubtFilter('OPEN')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      doubtFilter === 'OPEN'
                        ? 'bg-[#2E7D4E] text-white shadow-xs'
                        : 'text-[#647067] hover:text-[#18261E]'
                    }`}
                  >
                    Pending ({openDoubtsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoubtFilter('ANSWERED')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      doubtFilter === 'ANSWERED'
                        ? 'bg-[#2E7D4E] text-white shadow-xs'
                        : 'text-[#647067] hover:text-[#18261E]'
                    }`}
                  >
                    Answered ({doubtList.length - openDoubtsCount})
                  </button>
                </div>
              </div>

              {/* Statutory POCSO Safety Notice */}
              <div className="p-3.5 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex items-start gap-2.5 text-xs text-[#4E5C53]">
                <ShieldCheck className="w-4 h-4 text-[#2E7D4E] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-[#18261E]">Statutory Child Protection:</strong> All learner identities are pseudonymized (<span className="font-mono text-[#2E7D4E]">LRN-xxx</span>) under the POCSO & Juvenile Justice Acts. Direct private messaging and personal contact exchanges are strictly disabled.
                </p>
              </div>

              {answerFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    answerFeedback.type === 'success'
                      ? 'bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{answerFeedback.message}</span>
                </div>
              )}

              {/* Doubts List */}
              {doubtList
                .filter((d) => {
                  if (doubtFilter === 'OPEN') return d.status === 'OPEN';
                  if (doubtFilter === 'ANSWERED') return d.status === 'ANSWERED';
                  return true;
                })
                .length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <HelpCircle className="w-10 h-10 text-[#8E9990] mx-auto" />
                  <h4 className="text-sm font-bold text-[#18261E]">No student doubts in this view.</h4>
                  <p className="text-xs text-[#647067]">
                    When learners submit queries from their study modules, they will appear here for educator guidance.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {doubtList
                    .filter((d) => {
                      if (doubtFilter === 'OPEN') return d.status === 'OPEN';
                      if (doubtFilter === 'ANSWERED') return d.status === 'ANSWERED';
                      return true;
                    })
                    .map((doubt) => {
                      const isOpen = doubt.status === 'OPEN';
                      const isCurrentlyAnswering = answeringDoubtId === doubt.id;

                      return (
                        <div
                          key={doubt.id}
                          className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E2E8E0] hover:border-[#78B98A]/50 transition-all space-y-3.5 text-xs"
                        >
                          {/* Subject & Context Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                                {doubt.subject?.name || 'Academic Subject'}
                              </span>
                              <span className="font-semibold text-[#18261E]">
                                {doubt.chapter?.title ? `Ch: ${doubt.chapter.title}` : 'General Curriculum'}
                              </span>
                              {doubt.learner?.classLevel && (
                                <span className="text-[10px] text-[#647067] bg-white px-2 py-0.5 rounded-md border border-[#E2E8E0]">
                                  Class {doubt.learner.classLevel}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#8E9990] font-mono">
                                {doubt.learner?.rollAlias || 'LRN-Cohort'}
                              </span>
                              {isOpen ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                  <Clock className="w-3 h-3" />
                                  Awaiting Mentor
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B4D2F] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Answered
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Question Text */}
                          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8E0] space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9990] block">
                              Student Question
                            </span>
                            <p className="text-sm font-semibold text-[#18261E] leading-relaxed">
                              {doubt.question}
                            </p>
                            <span className="text-[10px] text-[#8E9990] block pt-1">
                              Asked on {new Date(doubt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Answer section */}
                          {!isOpen && doubt.answer && (
                            <div className="p-3.5 rounded-xl bg-[#EEF7F0]/60 border border-[#78B98A]/40 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-[#1B4D2F] flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E]" />
                                  Verified Educator Solution
                                </span>
                                <span className="text-[#647067]">
                                  by {doubt.answeredBy?.name || 'Volunteer Mentor'}
                                </span>
                              </div>
                              <p className="text-xs text-[#25352B] leading-relaxed whitespace-pre-wrap">
                                {doubt.answer}
                              </p>
                              {doubt.answeredAt && (
                                <span className="text-[10px] text-[#647067] block">
                                  Answered on {new Date(doubt.answeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action to Answer */}
                          {isOpen && !isCurrentlyAnswering && (
                            <div className="flex justify-end pt-1">
                              <Button
                                size="sm"
                                onClick={() => {
                                  setAnsweringDoubtId(doubt.id);
                                  setAnswerText('');
                                }}
                                className="bg-[#2E7D4E] text-white text-xs cursor-pointer"
                              >
                                Answer This Doubt
                              </Button>
                            </div>
                          )}

                          {/* Inline Answering Box */}
                          {isOpen && isCurrentlyAnswering && (
                            <div className="space-y-3 pt-2 border-t border-[#E2E8E0] bg-white p-4 rounded-xl border">
                              <div className="flex items-center justify-between">
                                <label className="font-bold text-xs text-[#18261E]">
                                  Your Educator Explanation
                                </label>
                                <span className="text-[11px] text-[#647067]">
                                  Keep it encouraging and conceptual
                                </span>
                              </div>
                              <textarea
                                rows={4}
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Write step-by-step guidance, formula clarification, or example..."
                                className="w-full p-3 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] text-xs focus:outline-none focus:border-[#2E7D4E] focus:ring-1 focus:ring-[#2E7D4E]"
                              />
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  disabled={isAnsweringDoubt}
                                  onClick={() => {
                                    setAnsweringDoubtId(null);
                                    setAnswerText('');
                                  }}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  disabled={isAnsweringDoubt || !answerText.trim()}
                                  onClick={() => handleAnswerDoubt(doubt.id)}
                                  className="bg-[#2E7D4E] text-white text-xs flex items-center gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{isAnsweringDoubt ? 'Submitting...' : 'Submit Verified Answer'}</span>
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MY CONTRIBUTIONS */}
          {activeTab === 'contributions' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Contribution History & Lifecycle</h3>
                <p className="text-xs text-[#647067]">
                  Visual timeline: Applied → Approved → Session Scheduled → Session Completed → Verified
                </p>
              </div>

              <div className="space-y-4">
                {requests.length === 0 ? (
                  <p className="text-xs text-[#647067] py-6 text-center">No applications logged yet.</p>
                ) : (
                  requests.map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-[#18261E]">
                          {req.subject} (Class {req.classLevel}): {req.topic}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                          {req.status}
                        </span>
                      </div>

                      {/* 5-Step Lifecycle Timeline */}
                      <div className="grid grid-cols-5 gap-1 text-center text-[10px] pt-2">
                        <div className="p-1.5 rounded-md bg-[#EEF7F0] text-[#1B4D2F] font-bold inline-flex items-center justify-center gap-1">
                          <span>1. Applied</span>
                          <CheckCircle2 className="w-3 h-3 text-[#1B4D2F]" />
                        </div>
                        <div className={`p-1.5 rounded-md font-bold ${req.status !== 'PENDING' ? 'bg-[#EEF7F0] text-[#1B4D2F]' : 'bg-gray-100 text-gray-500'}`}>
                          2. Approved
                        </div>
                        <div className={`p-1.5 rounded-md font-bold ${req.session ? 'bg-[#EEF7F0] text-[#1B4D2F]' : 'bg-gray-100 text-gray-500'}`}>
                          3. Scheduled
                        </div>
                        <div className={`p-1.5 rounded-md font-bold ${req.session?.status === 'COMPLETED' ? 'bg-[#EEF7F0] text-[#1B4D2F]' : 'bg-gray-100 text-gray-500'}`}>
                          4. Completed
                        </div>
                        <div className={`p-1.5 rounded-md font-bold ${req.session?.verifiedByInstitution ? 'bg-[#EEF7F0] text-[#1B4D2F]' : 'bg-gray-100 text-gray-500'}`}>
                          5. Verified
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: SKILLS */}
          {activeTab === 'skills' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Teaching Competencies & Subjects</h3>
                <p className="text-xs text-[#647067]">Configured teaching preferences used for smart matching.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <span className="text-[#8E9990] block text-[11px]">Primary Subjects:</span>
                  <strong className="text-sm text-[#18261E]">{volunteer.subjects}</strong>
                </div>
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <span className="text-[#8E9990] block text-[11px]">Classes:</span>
                  <strong className="text-sm text-[#18261E]">{volunteer.classes || 'Class 6, 7, 8'}</strong>
                </div>
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <span className="text-[#8E9990] block text-[11px]">Availability:</span>
                  <strong className="text-sm text-[#18261E]">{volunteer.availability}</strong>
                </div>
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <span className="text-[#8E9990] block text-[11px]">Preferred Mode:</span>
                  <strong className="text-sm text-[#18261E] uppercase">{volunteer.mode}</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Teaching Contribution Certificates</h3>
                <p className="text-xs text-[#647067]">
                  Official cryptographically-verifiable certificates issued after institution verification.
                </p>
              </div>

              {certificates.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Award className="w-10 h-10 text-[#8E9990] mx-auto" />
                  <h4 className="text-sm font-bold text-[#18261E]">No certificates yet.</h4>
                  <p className="text-xs text-[#647067]">
                    Certificates will become available after an institution verifies your completed session.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-5 rounded-2xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#2E7D4E]">
                          {cert.certificateNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B4D2F] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Authenticated
                        </span>
                      </div>
                      <strong className="text-sm text-[#18261E] block">{cert.contributionType}</strong>
                      <div className="text-[11px] text-[#647067]">
                        <span>Institution: <strong>{cert.institution?.orgName}</strong></span>
                        <br />
                        <span>Hours Contributed: <strong>{cert.hoursContributed} hrs</strong></span>
                        <br />
                        <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="pt-2 flex items-center gap-2">
                        <Link
                          href={`/certificates/verify/${cert.certificateNumber}`}
                          className="flex-1"
                        >
                          <Button size="sm" variant="secondary" className="w-full text-xs">
                            View Certificate
                          </Button>
                        </Link>
                        <a
                          href={`/api/certificates/${cert.certificateNumber}/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="sm" className="w-full bg-[#2E7D4E] text-white text-xs">
                            Download PDF
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Institutional Communications</h3>
                <p className="text-xs text-[#647067]">
                  Official notices and class coordination messages from care home superintendents.
                </p>
              </div>
              <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] text-xs text-[#647067]">
                Notice from Asha Kiran CCI: "Thank you for confirming the Sunday Class 7 Mathematics session. The projector and whiteboards will be prepared."
              </div>
            </div>
          )}

          {/* TAB 9: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/60 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Volunteer Profile & Verification</h3>
                <p className="text-xs text-[#647067]">Your educator credentials, POCSO compliance, and account status.</p>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[#8E9990] block text-[11px]">Full Name:</span>
                  <strong className="text-sm text-[#18261E]">{volunteer.fullName}</strong>
                </div>
                <div>
                  <span className="text-[#8E9990] block text-[11px]">Verification:</span>
                  <span className="font-bold text-[#2E7D4E]">{volunteer.verificationStatus}</span>
                </div>
                <div>
                  <span className="text-[#8E9990] block text-[11px]">Total Teaching Hours:</span>
                  <span className="font-bold text-[#18261E]">{volunteer.totalHours} hrs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <h4 className="text-sm font-bold text-[#18261E]">Session Details</h4>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="text-[#8E9990] hover:text-[#18261E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <strong className="text-base text-[#18261E] block">{selectedSession.title}</strong>
              <div className="text-[#647067] space-y-1">
                <p>Institution: <strong>{selectedSession.institution?.orgName}</strong></p>
                <p>Subject: <strong>{selectedSession.subject}</strong></p>
                <p>Class: <strong>Class {selectedSession.classLevel}</strong></p>
                <p>Date: <strong>{new Date(selectedSession.scheduledStart).toLocaleDateString()}</strong></p>
                <p>Mode: <strong className="uppercase">{selectedSession.mode}</strong></p>
                <p>Status: <strong className="text-[#2E7D4E]">{selectedSession.status}</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8E0] flex items-center justify-between gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsReportingIssue(selectedSession.id)}
                className="text-red-600 hover:bg-red-50"
              >
                Report Issue
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary" onClick={() => setSelectedSession(null)}>
                  Close
                </Button>
                {selectedSession.status === 'SCHEDULED' && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteSession(selectedSession.id)}
                    className="bg-[#2E7D4E] text-white"
                  >
                    Complete Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {isReportingIssue && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <h4 className="text-sm font-bold text-[#18261E]">Report Session Issue</h4>
              <button
                type="button"
                onClick={() => setIsReportingIssue(null)}
                className="text-[#8E9990] hover:text-[#18261E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="font-semibold text-[#18261E] block">Issue description</label>
              <textarea
                rows={3}
                value={issueText}
                onChange={(e) => setIssueText(e.target.value)}
                placeholder="e.g. Virtual classroom connection interrupted..."
                className="w-full p-2.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9]"
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => setIsReportingIssue(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsReportingIssue(null);
                  setIssueText('');
                }}
                className="bg-[#2E7D4E] text-white"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
