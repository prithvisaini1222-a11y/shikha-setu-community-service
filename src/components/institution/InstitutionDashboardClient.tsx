'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  createNeedAction,
  approveVolunteerRequestAction,
  rejectVolunteerRequestAction,
  verifySessionAndIssueCertificateAction,
} from '@/actions/institution';
import { updateDonationStatusAction } from '@/actions/donation';
import { answerDoubtAction } from '@/actions/learning';
import { ProgressBar, Button } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import {
  Building2,
  Layers,
  GraduationCap,
  Package,
  Calendar,
  Award,
  CheckCircle2,
  Plus,
  FileText,
  Printer,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  BarChart3,
  Settings,
  Clock,
  ArrowRight,
  X,
  HelpCircle,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstitutionDashboardClientProps {
  institution: any;
  needs: any[];
  volunteerRequests: any[];
  sessions: any[];
  donations: any[];
  doubts: any[];
  learners?: any[];
}

export function InstitutionDashboardClient({
  institution,
  needs,
  volunteerRequests,
  sessions,
  donations,
  doubts,
  learners = [],
}: InstitutionDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'needs' | 'volunteers' | 'sessions' | 'resources' | 'learners' | 'learning' | 'impact' | 'reports' | 'settings'
  >('overview');

  const [isPending, startTransition] = useTransition();

  // Modals state
  const [isNewNeedOpen, setIsNewNeedOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // New need form state
  const [needTitle, setNeedTitle] = useState('');
  const [needCategory, setNeedCategory] = useState('BOOKS');
  const [needClass, setNeedClass] = useState('8');
  const [needQuantity, setNeedQuantity] = useState(15);
  const [needUrgency, setNeedUrgency] = useState('URGENT');
  const [needDescription, setNeedDescription] = useState('');

  // Handle create need
  const handleCreateNeed = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.append('title', needTitle);
      fd.append('category', needCategory);
      fd.append('classLevel', needClass);
      fd.append('requiredQuantity', String(needQuantity));
      fd.append('urgency', needUrgency);
      fd.append('description', needDescription);
      fd.append('location', `${institution.city}, ${institution.state}`);

      const res = await createNeedAction(fd);
      if (res.success) {
        setIsNewNeedOpen(false);
        setNeedTitle('');
        setNeedDescription('');
        confetti({ particleCount: 50, spread: 60 });
      }
    });
  };

  // Handle Approve volunteer
  const handleApproveVolunteer = (requestId: string) => {
    startTransition(async () => {
      await approveVolunteerRequestAction({
        requestId,
        scheduledStartStr: new Date(Date.now() + 86400 * 1000 * 3).toISOString(),
      });
      confetti({ particleCount: 60, spread: 60 });
    });
  };

  // Handle Reject volunteer
  const handleRejectVolunteer = (requestId: string) => {
    startTransition(async () => {
      await rejectVolunteerRequestAction(requestId);
    });
  };

  // Handle Verify Session & Issue Certificate
  const handleVerifySession = (sessionId: string) => {
    startTransition(async () => {
      await verifySessionAndIssueCertificateAction({
        sessionId,
        attendanceCount: 20,
        institutionFeedback: 'Verified successful completion. High classroom engagement.',
      });
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    });
  };

  // Handle Verify Received Donation
  const handleVerifyDonation = (donationId: string) => {
    startTransition(async () => {
      await updateDonationStatusAction(donationId, 'INSTITUTION_VERIFIED' as any);
      confetti({ particleCount: 50, spread: 60 });
    });
  };

  // Student Doubts state
  const [doubtList, setDoubtList] = useState<any[]>(doubts || []);
  const [doubtFilter, setDoubtFilter] = useState<'ALL' | 'OPEN' | 'ANSWERED'>('ALL');
  const [answeringDoubtId, setAnsweringDoubtId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isAnsweringDoubt, setIsAnsweringDoubt] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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
                  answeredBy: { name: institution.orgName || 'Care Home Mentor', role: 'INSTITUTION' },
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

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'needs', label: 'Needs', icon: Layers, count: needs.length },
    { id: 'volunteers', label: 'Volunteers', icon: GraduationCap, count: volunteerRequests.length },
    { id: 'sessions', label: 'Sessions', icon: Calendar, count: sessions.length },
    { id: 'resources', label: 'Resources', icon: Package, count: donations.length },
    { id: 'learners', label: 'Learners', icon: ShieldCheck, count: learners.length },
    { id: 'learning', label: 'Learning & Doubts', icon: BookOpen, count: openDoubtsCount },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF5EE] text-[#1B4D2F] border border-[#C6E6CD]">
              Verified Child Care Institution (CCI)
            </span>
            <span className="text-xs text-[#98A2B3]">•</span>
            <span className="text-xs text-[#4E5C53]">
              Reg: <strong className="font-mono text-[#18261E]">{institution.registrationNumber}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18261E] tracking-tight">
            {institution.orgName}
          </h1>
          <p className="text-xs text-[#4E5C53]">
            {institution.city}, {institution.state} • Total Children: <strong>{institution.childCount}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setIsNewNeedOpen(true)}
            className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-semibold"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Post New Need
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsReportOpen(true)}
            className="bg-white border-[#E2E8E0] text-[#18261E] hover:bg-[#F4F7F4]"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Monthly Impact Report
          </Button>
        </div>
      </div>

      {/* Main Grid: Sidebar (Left) + Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar: Clean White background, Very light green active item, NO PURPLE / DARK */}
        <aside className="lg:col-span-3 bg-white p-3.5 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#4E5C53]">
            Institution Portal
          </div>
          <nav className="space-y-1">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? 'bg-[#EBF5EE] text-[#1B4D2F]'
                      : 'text-[#4E5C53] hover:bg-[#F8FAF8] hover:text-[#18261E]'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2E7D4E]' : 'text-[#4E5C53]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
                          ? 'bg-white text-[#1B4D2F] border border-[#C6E6CD]'
                          : 'bg-[#F4F7F4] text-[#4E5C53]'
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

        {/* Main Content Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top 4 Stats: Active Needs, Pending Requests, Upcoming Sessions, Resources Received */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in">
            <div className="bg-white p-5 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-1 card-interactive">
              <div className="text-2xl font-bold text-[#243247]">
                <CountUp end={needs.length} />
              </div>
              <div className="text-xs font-semibold text-[#667085]">Active Needs</div>
              <p className="text-[10px] text-[#72B79A]">Live on board</p>
            </div>

            <div className="bg-white p-5 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-1 card-interactive">
              <div className="text-2xl font-bold text-[#243247]">
                <CountUp end={volunteerRequests.filter((r) => r.status === 'PENDING').length} />
              </div>
              <div className="text-xs font-semibold text-[#667085]">Pending Requests</div>
              <p className="text-[10px] text-[#B58514]">Requires action</p>
            </div>

            <div className="bg-white p-5 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-1 card-interactive">
              <div className="text-2xl font-bold text-[#243247]">
                <CountUp end={sessions.length} />
              </div>
              <div className="text-xs font-semibold text-[#667085]">Upcoming Sessions</div>
              <p className="text-[10px] text-[#4B749F]">Scheduled</p>
            </div>

            <div className="bg-white p-5 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-1 card-interactive">
              <div className="text-2xl font-bold text-[#243247]">
                <CountUp end={donations.length} />
              </div>
              <div className="text-xs font-semibold text-[#667085]">Resources Received</div>
              <p className="text-[10px] text-[#72B79A]">100% Verified</p>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Needs Requiring Action */}
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#243247]">Needs Requiring Action</h3>
                    <p className="text-xs text-[#667085]">Open requirements awaiting sponsors or volunteer teachers.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('needs')}
                    className="text-xs font-semibold text-[#2E7D4E] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {needs.slice(0, 3).map((need) => (
                    <div
                      key={need.id}
                      className="p-3.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#243247] block">{need.title}</span>
                        <span className="text-[#667085] text-[11px]">
                          {need.fulfilledQuantity} / {need.requiredQuantity} {need.unit} fulfilled
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${need.urgency === 'URGENT'
                            ? 'bg-[#FEF9ED] text-[#B58514] border border-[#F2C96D]/40'
                            : 'bg-white text-[#667085] border border-[#E2E8E0]'
                          }`}
                      >
                        {need.urgency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#243247]">Upcoming Sessions</h3>
                    <p className="text-xs text-[#667085]">Scheduled teaching classes with verified volunteers.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('sessions')}
                    className="text-xs font-semibold text-[#2E7D4E] hover:underline"
                  >
                    View Sessions →
                  </button>
                </div>

                <div className="space-y-3">
                  {sessions.slice(0, 3).map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-semibold text-[#243247] block">{s.title}</span>
                        <span className="text-[#667085] text-[11px]">
                          Volunteer: {s.volunteer?.fullName} • Class {s.classLevel} {s.subject}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-[#667085] block">
                          {new Date(s.scheduledStart).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F5FE] text-[#4B749F]">
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-[#243247]">Recent Activity</h3>
                <div className="space-y-2.5 text-xs text-[#667085]">
                  <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60">
                    <CheckCircle2 className="w-4 h-4 text-[#72B79A] shrink-0" />
                    <span>Resource delivery of 15 NCERT Mathematics books verified by care superintendent.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60">
                    <CheckCircle2 className="w-4 h-4 text-[#4B749F] shrink-0" />
                    <span>New volunteer teaching request submitted for Class 8 Science.</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-[8px] bg-[#F4F7F4] border border-[#E2E8E0]/60">
                    <CheckCircle2 className="w-4 h-4 text-[#72B79A] shrink-0" />
                    <span>Official certificate SS-2026-001 issued for completed linear equations session.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEEDS MANAGEMENT */}
          {activeTab === 'needs' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#243247]">Active Needs Management</h3>
                  <p className="text-xs text-[#667085]">Publish and manage educational requirements for children.</p>
                </div>
                <Button size="sm" onClick={() => setIsNewNeedOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Create Requirement
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {needs.map((need) => (
                  <div key={need.id} className="p-5 rounded-[12px] border border-[#E2E8E0] bg-[#F4F7F4] space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${need.urgency === 'URGENT'
                            ? 'bg-[#FEF9ED] text-[#B58514] border border-[#F2C96D]/40'
                            : 'bg-white text-[#667085] border border-[#E2E8E0]'
                          }`}
                      >
                        {need.urgency}
                      </span>
                      <span className="text-xs text-[#667085] uppercase font-medium">{need.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#243247]">{need.title}</h4>
                    <p className="text-xs text-[#667085] line-clamp-2">{need.description}</p>
                    <ProgressBar
                      value={need.fulfilledQuantity}
                      max={need.requiredQuantity}
                      label={`${need.fulfilledQuantity}/${need.requiredQuantity} ${need.unit}`}
                      color="bg-[#72B79A]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOLUNTEERS QUEUE */}
          {activeTab === 'volunteers' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="border-b border-[#E2E8E0]/60 pb-4">
                <h3 className="text-base font-bold text-[#243247]">Volunteer Applications Queue</h3>
                <p className="text-xs text-[#667085]">Review, schedule, and approve volunteer educators.</p>
              </div>

              <div className="space-y-3">
                {volunteerRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-[12px] border border-[#E2E8E0] bg-[#F4F7F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#243247]">{req.volunteer?.fullName}</span>
                        <span className="font-semibold text-[#2D7A58] bg-[#EBF5EE] border border-[#72B79A]/30 px-2 py-0.5 rounded-full text-[10px]">
                          {req.matchScore}% Match
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F5FE] text-[#4B749F]">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[#667085]">
                        Subject: <strong className="text-[#243247]">{req.subject}</strong> • Class {req.classLevel} • {req.mode}
                      </p>
                      <p className="text-[#667085] text-[11px]">
                        Topic: {req.topic} • Preferred: {req.preferredDate} ({req.preferredTime})
                      </p>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApproveVolunteer(req.id)}
                          disabled={isPending}
                          className="bg-[#2E7D4E] hover:bg-[#24663F]"
                        >
                          Approve & Schedule
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRejectVolunteer(req.id)}
                          disabled={isPending}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SESSIONS & CERTIFICATES */}
          {activeTab === 'sessions' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="border-b border-[#E2E8E0]/60 pb-4">
                <h3 className="text-base font-bold text-[#243247]">Sessions & Certificate Issuance</h3>
                <p className="text-xs text-[#667085]">Superintendent sign-off portal for completed classes.</p>
              </div>

              <div className="space-y-3">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-4 rounded-[12px] border border-[#E2E8E0] bg-[#F4F7F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#243247]">{sess.title}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF5EE] text-[#72B79A]">
                          {sess.status}
                        </span>
                      </div>
                      <p className="text-[#667085]">
                        Teacher: <strong className="text-[#243247]">{sess.volunteer?.fullName}</strong> • Class {sess.classLevel} {sess.subject}
                      </p>
                      {sess.certificate && (
                        <span className="font-mono text-[11px] text-[#2E7D4E] font-semibold block">
                          Certificate Issued: {sess.certificate.certificateNumber}
                        </span>
                      )}
                    </div>

                    {!sess.certificate && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifySession(sess.id)}
                        disabled={isPending}
                        leftIcon={<Award className="w-3.5 h-3.5" />}
                      >
                        Verify & Issue Certificate
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RESOURCES INVENTORY */}
          {activeTab === 'resources' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="border-b border-[#E2E8E0]/60 pb-4">
                <h3 className="text-base font-bold text-[#243247]">Resource Inventory & Receipts</h3>
                <p className="text-xs text-[#667085]">Acknowledge and inspect physical donations received.</p>
              </div>

              <div className="space-y-3">
                {donations.map((don) => (
                  <div
                    key={don.id}
                    className="p-4 rounded-[12px] border border-[#E2E8E0] bg-[#F4F7F4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#243247]">{don.itemDescription}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF5EE] text-[#72B79A]">
                          {don.status}
                        </span>
                      </div>
                      <p className="text-[#667085]">
                        Quantity: <strong>{don.quantity} units</strong> • Donor: <strong>{don.donor?.name || 'Anonymous Donor'}</strong>
                      </p>
                    </div>

                    {don.status !== 'INSTITUTION_VERIFIED' && (
                      <Button
                        size="sm"
                        onClick={() => handleVerifyDonation(don.id)}
                        disabled={isPending}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Acknowledge Receipt
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: LEARNERS (POCSO COMPLIANT ROSTER) */}
          {activeTab === 'learners' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/60 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#18261E]">Institutional Learner Cohort</h3>
                  <p className="text-xs text-[#667085]">
                    Enrolled students in care supervised under Child Care Institution (CCI) governance.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    POCSO & JJ Act Anonymized
                  </span>
                </div>
              </div>

              {/* Child Safety Privacy Notice */}
              <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#C8E6C9] space-y-1 text-xs text-[#4E5C53]">
                <strong className="text-[#18261E] block flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  Child Privacy & Protection Compliance
                </strong>
                <p className="leading-relaxed">
                  In compliance with statutory juvenile protection guidelines, student identities are anonymized with unique institutional identifiers (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E2E8E0]">LRN-XXX</code>). Personal contact numbers, residential locations, and unmonitored adult communication are strictly blocked across the entire platform.
                </p>
              </div>

              {/* Learners List */}
              {learners.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <GraduationCap className="w-10 h-10 text-[#8E9990] mx-auto" />
                  <h4 className="text-sm font-bold text-[#18261E]">No learners enrolled yet.</h4>
                  <p className="text-xs text-[#667085]">
                    Learners register using their institutional enrollment code to begin learning.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#E2E8E0] border border-[#E2E8E0] rounded-xl overflow-hidden text-xs">
                  <div className="bg-[#FAFBF9] p-3 grid grid-cols-12 font-bold text-[#4E5C53] uppercase tracking-wider text-[11px]">
                    <div className="col-span-3">Learner Alias</div>
                    <div className="col-span-3">Class Standard</div>
                    <div className="col-span-3">Learning Activity</div>
                    <div className="col-span-3 text-right">Protection Status</div>
                  </div>

                  {learners.map((lrn) => (
                    <div
                      key={lrn.id}
                      className="p-3.5 grid grid-cols-12 items-center hover:bg-[#FAFBF9] transition-colors"
                    >
                      <div className="col-span-3 space-y-0.5">
                        <span className="font-mono font-bold text-[#18261E] block">
                          {lrn.rollAlias || `LRN-${lrn.id.slice(-4).toUpperCase()}`}
                        </span>
                        <span className="text-[11px] text-[#4E5C53]">
                          {lrn.displayName || 'Enrolled Child'}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          Class {lrn.classLevel || 6} NCERT
                        </span>
                      </div>

                      <div className="col-span-3 space-y-0.5 text-[11px]">
                        <span className="font-semibold text-[#18261E] block">
                          {lrn.streakDays || 1} Days Active 🔥
                        </span>
                        <span className="text-[#4E5C53]">
                          {lrn.quizAttempts?.length || 0} Quizzes Completed
                        </span>
                      </div>

                      <div className="col-span-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                          <ShieldCheck className="w-3 h-3" />
                          Supervised
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: LEARNING & DOUBTS */}
          {activeTab === 'learning' && (
            <div className="space-y-6">
              {/* Syllabus Overview */}
              <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#243247]">Care Home Learning Syllabus</h3>
                    <p className="text-xs text-[#667085]">
                      Curriculum coverage for Classes 6 to 10 mapped with state board & NCERT standards.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#1B4D2F] bg-[#EEF7F0] px-2.5 py-1 rounded-full border border-[#78B98A]/30">
                    NCERT 2026–27 Aligned
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                  {[6, 7, 8, 9, 10].map((c) => (
                    <div key={c} className="p-3.5 rounded-[12px] border border-[#E2E8E0] bg-[#FAFBF9] hover:border-[#78B98A] transition-all space-y-1">
                      <span className="text-xs font-bold text-[#18261E]">Class {c}</span>
                      <p className="text-[10px] text-[#667085]">Math, Science, English</p>
                      <Link href={`/learn/${c}`} className="text-xs font-semibold text-[#2E7D4E] hover:underline block pt-1">
                        View Modules →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Doubts & Mentoring Queue */}
              <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/60 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF7F0] text-[#1B4D2F] text-[10px] font-bold border border-[#78B98A]/30 mb-1">
                      <HelpCircle className="w-3 h-3 text-[#2E7D4E]" />
                      <span>Care Home Academic Helpdesk</span>
                    </div>
                    <h3 className="text-base font-bold text-[#18261E]">Cohort Academic Doubts</h3>
                    <p className="text-xs text-[#647067]">
                      Doubts raised by your enrolled children during self-study and video lectures.
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
                    <strong className="text-[#18261E]">Child Welfare Compliance:</strong> All student questions are anonymized with roll aliases (<span className="font-mono text-[#2E7D4E]">LRN-xxx</span>) under the POCSO & Juvenile Justice Acts. Mentors provide academic assistance only.
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
                  <div className="text-center py-10 space-y-2">
                    <HelpCircle className="w-9 h-9 text-[#8E9990] mx-auto" />
                    <h4 className="text-sm font-bold text-[#18261E]">No student doubts in this filter.</h4>
                    <p className="text-xs text-[#647067]">
                      Learner questions from the interactive practice portal will appear here.
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
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                                  {doubt.subject?.name || 'Subject'}
                                </span>
                                <span className="font-semibold text-[#18261E]">
                                  {doubt.chapter?.title ? `Ch: ${doubt.chapter.title}` : 'Syllabus Topic'}
                                </span>
                                {doubt.learner?.classLevel && (
                                  <span className="text-[10px] text-[#647067] bg-white px-2 py-0.5 rounded-md border border-[#E2E8E0]">
                                    Class {doubt.learner.classLevel}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#8E9990] font-mono">
                                  {doubt.learner?.rollAlias || 'LRN-Student'}
                                </span>
                                {isOpen ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                    <Clock className="w-3 h-3" />
                                    Awaiting Solution
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B4D2F] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Answered
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8E0] space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9990] block">
                                Student Question
                              </span>
                              <p className="text-sm font-semibold text-[#18261E] leading-relaxed">
                                {doubt.question}
                              </p>
                              <span className="text-[10px] text-[#8E9990] block pt-1">
                                Raised on {new Date(doubt.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>

                            {!isOpen && doubt.answer && (
                              <div className="p-3.5 rounded-xl bg-[#EEF7F0]/60 border border-[#78B98A]/40 space-y-1.5">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-bold text-[#1B4D2F] flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E]" />
                                    Verified Solution
                                  </span>
                                  <span className="text-[#647067]">
                                    by {doubt.answeredBy?.name || 'Institution Mentor'}
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
                                  Answer Doubt
                                </Button>
                              </div>
                            )}

                            {isOpen && isCurrentlyAnswering && (
                              <div className="space-y-3 pt-2 border-t border-[#E2E8E0] bg-white p-4 rounded-xl border">
                                <label className="font-bold text-xs text-[#18261E] block">
                                  Teacher / Mentor Explanation
                                </label>
                                <textarea
                                  rows={4}
                                  value={answerText}
                                  onChange={(e) => setAnswerText(e.target.value)}
                                  placeholder="Provide step-by-step guidance, formula explanation, or worked example..."
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
                                    <span>{isAnsweringDoubt ? 'Submitting...' : 'Submit Solution'}</span>
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
            </div>
          )}

          {/* TAB 7: IMPACT */}
          {activeTab === 'impact' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#243247]">Institution Impact Metrics</h3>
              <p className="text-xs text-[#667085]">
                Aggregated community support delivered to your institution this academic year.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0]">
                  <span className="text-2xl font-bold text-[#243247]">{sessions.length}</span>
                  <p className="text-xs text-[#667085]">Classes Conducted</p>
                </div>
                <div className="p-4 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0]">
                  <span className="text-2xl font-bold text-[#243247]">24</span>
                  <p className="text-xs text-[#667085]">Teaching Hours</p>
                </div>
                <div className="p-4 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0]">
                  <span className="text-2xl font-bold text-[#243247]">45</span>
                  <p className="text-xs text-[#667085]">Books Received</p>
                </div>
                <div className="p-4 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0]">
                  <span className="text-2xl font-bold text-[#243247]">100%</span>
                  <p className="text-xs text-[#72B79A]">Verified Delivery</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MONTHLY REPORT */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#243247]">Monthly Community Impact Report</h3>
                  <p className="text-xs text-[#667085]">Official verified summary for child welfare authorities.</p>
                </div>
                <Button size="sm" onClick={() => window.print()} leftIcon={<Printer className="w-3.5 h-3.5" />}>
                  Print Report
                </Button>
              </div>

              {/* Report Sheet */}
              <div className="border border-[#E2E8E0] rounded-[12px] p-6 space-y-6 bg-[#F4F7F4] text-xs">
                <div className="flex justify-between items-start border-b border-[#E2E8E0] pb-4">
                  <div>
                    <h4 className="text-base font-bold text-[#243247]">{institution.orgName}</h4>
                    <p className="text-[#667085]">Govt Reg: {institution.registrationNumber} • {institution.city}, {institution.state}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#243247] block">Report Period: September 2026</span>
                    <span className="text-[#72B79A] font-semibold">Verified Official Record</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-[8px] border border-[#E2E8E0]">
                    <span className="text-[#667085] block text-[11px]">Classes Taught:</span>
                    <strong className="text-sm text-[#243247]">{sessions.length} Sessions</strong>
                  </div>
                  <div className="bg-white p-3 rounded-[8px] border border-[#E2E8E0]">
                    <span className="text-[#667085] block text-[11px]">Volunteer Hours:</span>
                    <strong className="text-sm text-[#243247]">24 Hours</strong>
                  </div>
                  <div className="bg-white p-3 rounded-[8px] border border-[#E2E8E0]">
                    <span className="text-[#667085] block text-[11px]">Resources Received:</span>
                    <strong className="text-sm text-[#243247]">45 Units</strong>
                  </div>
                  <div className="bg-white p-3 rounded-[8px] border border-[#E2E8E0]">
                    <span className="text-[#667085] block text-[11px]">Child Attendance:</span>
                    <strong className="text-sm text-[#72B79A]">100% Verified</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4 text-xs">
              <h3 className="text-base font-bold text-[#243247]">Institution Settings & Compliance</h3>
              <p className="text-[#667085]">
                Manage contact details, superintendent authorization, and verified location credentials.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0] flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-[#243247] block">Child Protection & Safety Policy</span>
                    <span className="text-[#667085]">Superintendent audit current and compliant</span>
                  </div>
                  <span className="text-[#72B79A] font-semibold">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEED MODAL (Requirement 11) */}
      {isNewNeedOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewNeedOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#243247]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-anim"
        >
          <div className="bg-white rounded-[16px] border border-[#E2E8E0] shadow-xl max-w-lg w-full p-6 space-y-4 modal-dialog-anim">
            <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
              <h3 className="text-base font-bold text-[#243247]">Post New Educational Need</h3>
              <button
                type="button"
                onClick={() => setIsNewNeedOpen(false)}
                className="text-[#98A2B3] hover:text-[#243247] p-1 rounded-[6px] hover:bg-[#F8FAF8] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNeed} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#243247] mb-1">Requirement Title</label>
                <input
                  type="text"
                  required
                  value={needTitle}
                  onChange={(e) => setNeedTitle(e.target.value)}
                  placeholder="e.g. Class 8 Mathematics NCERT Books"
                  className="w-full px-3.5 py-2 border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] focus:bg-white focus:outline-none focus:border-[#2E7D4E] focus:ring-1 focus:ring-[#2E7D4E] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#243247] mb-1">Category</label>
                  <select
                    value={needCategory}
                    onChange={(e) => setNeedCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] focus:bg-white focus:outline-none focus:border-[#2E7D4E] focus:ring-1 focus:ring-[#2E7D4E] transition-all"
                  >
                    <option value="BOOKS">Books & Textbooks</option>
                    <option value="NOTEBOOKS">Notebooks & Stationery</option>
                    <option value="TABLETS">Digital Devices</option>
                    <option value="TEACHING">Teaching Support</option>
                    <option value="EDUCATIONAL_KITS">Educational Kits</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#243247] mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={needQuantity}
                    onChange={(e) => setNeedQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] focus:bg-white focus:outline-none focus:border-[#2E7D4E] focus:ring-1 focus:ring-[#2E7D4E] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#243247] mb-1">Urgency Level</label>
                <select
                  value={needUrgency}
                  onChange={(e) => setNeedUrgency(e.target.value)}
                  className="w-full px-3.5 py-2 border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] focus:bg-white focus:outline-none focus:border-[#2E7D4E] focus:ring-1 focus:ring-[#2E7D4E] transition-all"
                >
                  <option value="URGENT">Urgent (Immediate requirement)</option>
                  <option value="NEEDED">Needed (Standard requirement)</option>
                  <option value="ALMOST_COMPLETE">Almost Complete</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#243247] mb-1">Description & Objective</label>
                <textarea
                  rows={3}
                  required
                  value={needDescription}
                  onChange={(e) => setNeedDescription(e.target.value)}
                  placeholder="Explain why this resource is required for the children..."
                  className="w-full px-3.5 py-2 border border-[#E2E8E0] rounded-[10px] bg-[#F4F7F4] focus:bg-white focus:outline-none focus:border-[#2E7D4E] focus:ring-1 focus:ring-[#2E7D4E] transition-all"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8E0]/60 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsNewNeedOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isPending} loadingText="Publishing...">
                  Publish Requirement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MONTHLY IMPACT REPORT MODAL (Requirement 11) */}
      {isReportOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReportOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#243247]/50 backdrop-blur-xs flex items-center justify-center p-4 modal-backdrop-anim"
        >
          <div className="bg-white rounded-[16px] border border-[#E2E8E0] shadow-xl max-w-md w-full p-6 space-y-4 modal-dialog-anim">
            <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#243247]">Monthly Impact Report</h3>
                <p className="text-[11px] text-[#4E5C53]">{institution.orgName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="text-[#98A2B3] hover:text-[#243247] p-1 rounded-[6px] hover:bg-[#F8FAF8] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F4F7F4] rounded-[10px] border border-[#E2E8E0] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Total Children Reached:</span>
                  <strong className="text-[#18261E]">{institution.childCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Active Academic Needs:</span>
                  <strong className="text-[#18261E]">{needs.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Completed Tutoring Classes:</span>
                  <strong className="text-[#2E7D4E]">{sessions.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4E5C53]">Superintendent Verified Items:</span>
                  <strong className="text-[#2E7D4E]">{donations.length}</strong>
                </div>
              </div>
              <p className="text-[11px] text-[#4E5C53] leading-relaxed">
                Ready for official state social audit compliance or donor transparency records.
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8E0]/60 flex items-center justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setIsReportOpen(false)}>
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-[#2E7D4E] hover:bg-[#24663F] text-white"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
