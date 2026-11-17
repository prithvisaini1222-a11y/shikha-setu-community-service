'use client';

import React, { useState, useTransition } from 'react';
import {
  verifyInstitutionAction,
  verifyVolunteerAction,
  toggleUserVerificationAction,
  requestChangesAction,
  updateNeedStatusByAdminAction,
  updateSessionStatusByAdminAction,
  updateDonationStatusByAdminAction,
} from '@/actions/admin';
import { Badge, ProgressBar, Button } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import {
  Building2,
  GraduationCap,
  Users,
  ShieldCheck,
  FileText,
  Search,
  BookOpen,
  Check,
  Sparkles,
  Layers,
  HeartHandshake,
  Calendar,
  BarChart3,
  Bell,
  Settings,
  X,
  AlertTriangle,
  Clock,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  Radio,
  MapPin,
  Package,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdminContentManagement } from './AdminContentManagement';

interface AdminDashboardClientProps {
  institutions: any[];
  volunteers: any[];
  users: any[];
  auditLogs: any[];
  chapters?: any[];
  videos?: any[];
  trustedChannels?: any[];
  videoReports?: any[];
  needs?: any[];
  donations?: any[];
  sessions?: any[];
  learners?: any[];
  classes?: any[];
}

export function AdminDashboardClient({
  institutions,
  volunteers,
  users,
  auditLogs,
  chapters = [],
  videos = [],
  trustedChannels = [],
  videoReports = [],
  needs = [],
  donations = [],
  sessions = [],
  learners = [],
  classes = [],
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'users'
    | 'learners'
    | 'volunteers'
    | 'donors'
    | 'institutions'
    | 'verification'
    | 'curriculum'
    | 'needs'
    | 'donations'
    | 'sessions'
    | 'reports'
    | 'impact'
    | 'notifications'
    | 'settings'
  >('overview');

  const [verificationSubTab, setVerificationSubTab] = useState<
    'institutions' | 'volunteers' | 'donors' | 'documents'
  >('institutions');

  const [searchQuery, setSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [needCategoryFilter, setNeedCategoryFilter] = useState('ALL');
  const [needStatusFilter, setNeedStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [requestTarget, setRequestTarget] = useState<{ type: 'Institution' | 'Volunteer'; id: string } | null>(null);

  const [isPending, startTransition] = useTransition();

  // Verification actions
  const handleVerifyInst = (institutionId: string, status: 'VERIFIED' | 'REJECTED') => {
    startTransition(async () => {
      await verifyInstitutionAction(institutionId, status);
      if (status === 'VERIFIED') confetti({ particleCount: 60, spread: 60 });
    });
  };

  const handleVerifyVol = (volunteerId: string, status: 'VERIFIED' | 'REJECTED') => {
    startTransition(async () => {
      await verifyVolunteerAction(volunteerId, status);
      if (status === 'VERIFIED') confetti({ particleCount: 60, spread: 60 });
    });
  };

  const handleToggleUser = (userId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleUserVerificationAction(userId, !currentStatus);
    });
  };

  const handleRequestChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTarget || !changeNotes) return;
    startTransition(async () => {
      await requestChangesAction({
        entityType: requestTarget.type,
        entityId: requestTarget.id,
        notes: changeNotes,
      });
      setRequestTarget(null);
      setChangeNotes('');
    });
  };

  // Need status action
  const handleUpdateNeedStatus = (needId: string, status: string) => {
    startTransition(async () => {
      await updateNeedStatusByAdminAction(needId, status);
    });
  };

  // Session action
  const handleUpdateSessionStatus = (sessionId: string, status: string) => {
    startTransition(async () => {
      await updateSessionStatusByAdminAction({ sessionId, status });
      if (status === 'COMPLETED') confetti({ particleCount: 50, spread: 50 });
    });
  };

  // Donation status action
  const handleUpdateDonationStatus = (donationId: string, status: string) => {
    startTransition(async () => {
      await updateDonationStatusByAdminAction(donationId, status);
      if (status === 'FULFILLED' || status === 'INSTITUTION_VERIFIED') {
        confetti({ particleCount: 50, spread: 50 });
      }
    });
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // Filtered needs
  const filteredNeeds = needs.filter((n) => {
    const matchesCat = needCategoryFilter === 'ALL' || n.category === needCategoryFilter;
    const matchesStatus = needStatusFilter === 'ALL' || n.status === needStatusFilter;
    return matchesCat && matchesStatus;
  });

  const pendingInstitutions = institutions.filter((i) => i.verificationStatus === 'PENDING');
  const pendingVolunteers = volunteers.filter((v) => v.verificationStatus === 'PENDING');
  const verifiedInstitutions = institutions.filter((i) => i.verificationStatus === 'VERIFIED');
  const verifiedVolunteers = volunteers.filter((v) => v.verificationStatus === 'VERIFIED');

  // Sidebar navigation links (15 sections as required)
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users, count: users.length },
    { id: 'learners', label: 'Learners', icon: BookOpen, count: learners.length },
    { id: 'volunteers', label: 'Volunteers', icon: GraduationCap, count: volunteers.length },
    { id: 'donors', label: 'Donors', icon: HeartHandshake, count: users.filter((u) => u.role === 'DONOR').length },
    { id: 'institutions', label: 'Institutions', icon: Building2, count: institutions.length },
    {
      id: 'verification',
      label: 'Verification',
      icon: ShieldCheck,
      count: pendingInstitutions.length + pendingVolunteers.length,
      alert: pendingInstitutions.length + pendingVolunteers.length > 0,
    },
    { id: 'curriculum', label: 'Learning Content', icon: BookOpen, count: videos.length },
    { id: 'needs', label: 'Needs', icon: Layers, count: needs.length },
    { id: 'donations', label: 'Donations', icon: HeartHandshake, count: donations.length },
    { id: 'sessions', label: 'Teaching Sessions', icon: Calendar, count: sessions.length },
    { id: 'reports', label: 'Reports', icon: FileText, count: videoReports.length },
    { id: 'impact', label: 'Impact', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#1B4D2F] bg-[#EEF7F0] px-2.5 py-0.5 rounded-full border border-[#78B98A]/30">
              ShikshaSetu Admin Console
            </span>
            <span className="text-xs text-[#9CA3AF]">•</span>
            <span className="text-[11px] font-bold text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
              Sample Data Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18261E] tracking-tight">
            Platform Governance & Safety Directorate
          </h1>
          <p className="text-xs sm:text-sm text-[#4E5C53]">
            Verified child-care institutions, educators, educational needs, and impact oversight.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-xs font-semibold text-[#25352B]">
            <ShieldCheck className="w-4 h-4 text-[#2E7D4E]" />
            <span>Root Admin Authorized</span>
          </span>
        </div>
      </div>

      {/* 2. Main 15-Section Grid: Sidebar (3 cols) + Content (9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-white p-3 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#647067]">
            Platform Management
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
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
                        item.alert
                          ? 'bg-amber-100 text-amber-800'
                          : isActive
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
              {/* Platform Metrics (Sample Data Clearly Labeled) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#18261E]">Platform Overview Metrics</h3>
                  <span className="text-[11px] font-semibold text-[#8C6013] bg-[#FEF9ED] px-2.5 py-0.5 rounded-full border border-[#FDE5A9]">
                    Sample Data (Prototype Mode)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="bg-white p-4 rounded-xl border border-[#E2E8E0] shadow-xs space-y-1">
                    <div className="text-2xl font-extrabold text-[#18261E]">
                      <CountUp end={learners.length || 420} />
                    </div>
                    <div className="text-xs font-semibold text-[#4E5C53]">Active Learners</div>
                    <p className="text-[10px] text-[#2E7D4E]">Enrolled in CCIs</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E2E8E0] shadow-xs space-y-1">
                    <div className="text-2xl font-extrabold text-[#18261E]">
                      <CountUp end={verifiedInstitutions.length || 12} />
                    </div>
                    <div className="text-xs font-semibold text-[#4E5C53]">Verified Institutions</div>
                    <p className="text-[10px] text-[#2E7D4E]">Reg & POCSO Audited</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E2E8E0] shadow-xs space-y-1">
                    <div className="text-2xl font-extrabold text-[#18261E]">
                      <CountUp end={verifiedVolunteers.length || 48} />
                    </div>
                    <div className="text-xs font-semibold text-[#4E5C53]">Verified Volunteers</div>
                    <p className="text-[10px] text-[#2E7D4E]">Educators & Mentors</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E2E8E0] shadow-xs space-y-1">
                    <div className="text-2xl font-extrabold text-[#18261E]">
                      <CountUp end={users.filter((u) => u.role === 'DONOR').length || 24} />
                    </div>
                    <div className="text-xs font-semibold text-[#4E5C53]">Active Donors</div>
                    <p className="text-[10px] text-[#2E7D4E]">Supporting Needs</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E2E8E0] shadow-xs space-y-1">
                    <div className="text-2xl font-extrabold text-[#18261E]">
                      <CountUp end={sessions.length || 68} />
                    </div>
                    <div className="text-xs font-semibold text-[#4E5C53]">Teaching Sessions</div>
                    <p className="text-[10px] text-[#2E7D4E]">Completed & Scheduled</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#E2E8E0] shadow-xs space-y-1">
                    <div className="text-2xl font-extrabold text-[#18261E]">
                      <CountUp end={donations.reduce((acc, d) => acc + d.quantity, 0) || 1250} />
                    </div>
                    <div className="text-xs font-semibold text-[#4E5C53]">Resources Fulfilled</div>
                    <p className="text-[10px] text-[#2E7D4E]">Books & Kits in Homes</p>
                  </div>
                </div>
              </div>

              {/* Compact Live Activity Feed */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
                    <h3 className="text-sm font-bold text-[#18261E]">Live Platform Activity Feed</h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#4F9D69] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                    Real-time Logs
                  </span>
                </div>

                <div className="divide-y divide-[#E2E8E0]/60 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#2E7D4E]" />
                      <span>
                        <strong className="text-[#18261E]">Volunteer Verified:</strong> Anita Sharma (Mathematics, Class 8) was approved.
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8E9990]">10m ago</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#6E9AD6]" />
                      <span>
                        <strong className="text-[#18261E]">New Institution Submitted:</strong> Bal Sahyog Care Home submitted registration documents.
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8E9990]">25m ago</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4 text-[#2E7D4E]" />
                      <span>
                        <strong className="text-[#18261E]">Donation Received:</strong> 25x Mathematics NCERT Books received by Asha Kiran CCI.
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8E9990]">1h ago</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#2E7D4E]" />
                      <span>
                        <strong className="text-[#18261E]">Teaching Session Completed:</strong> Class 8 Science - Cell Structure (20 students attended).
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8E9990]">2h ago</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#4F9D69]" />
                      <span>
                        <strong className="text-[#18261E]">Educational Need Fulfilled:</strong> Class 7 Science Lab Kits (100% funded and verified).
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8E9990]">3h ago</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#6E9AD6]" />
                      <span>
                        <strong className="text-[#18261E]">Learning Content Updated:</strong> Class 6 Ganita Prakash video order refined.
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8E9990]">5h ago</span>
                  </div>
                </div>
              </div>

              {/* Pending Approvals Quick Action Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAFBF9] p-5 rounded-2xl border border-[#E2E8E0] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#18261E] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#6E9AD6]" />
                      Pending Institution Verifications ({pendingInstitutions.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('verification');
                        setVerificationSubTab('institutions');
                      }}
                      className="text-xs font-bold text-[#2E7D4E] hover:underline"
                    >
                      Inspect All →
                    </button>
                  </div>
                  {pendingInstitutions.length === 0 ? (
                    <p className="text-xs text-[#8E9990]">No pending institution verification requests.</p>
                  ) : (
                    pendingInstitutions.slice(0, 2).map((inst) => (
                      <div key={inst.id} className="p-3 bg-white rounded-xl border border-[#E2E8E0] flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#18261E] block">{inst.orgName}</strong>
                          <span className="text-[#647067] text-[11px]">{inst.city}, {inst.state}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleVerifyInst(inst.id, 'VERIFIED')}
                          className="bg-[#2E7D4E] text-white"
                        >
                          Approve
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                <div className="bg-[#FAFBF9] p-5 rounded-2xl border border-[#E2E8E0] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#18261E] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#2E7D4E]" />
                      Pending Volunteer Verifications ({pendingVolunteers.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('verification');
                        setVerificationSubTab('volunteers');
                      }}
                      className="text-xs font-bold text-[#2E7D4E] hover:underline"
                    >
                      Inspect All →
                    </button>
                  </div>
                  {pendingVolunteers.length === 0 ? (
                    <p className="text-xs text-[#8E9990]">No pending volunteer verification requests.</p>
                  ) : (
                    pendingVolunteers.slice(0, 2).map((vol) => (
                      <div key={vol.id} className="p-3 bg-white rounded-xl border border-[#E2E8E0] flex items-center justify-between text-xs">
                        <div>
                          <strong className="text-[#18261E] block">{vol.fullName}</strong>
                          <span className="text-[#647067] text-[11px]">{vol.skills}</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleVerifyVol(vol.id, 'VERIFIED')}
                          className="bg-[#2E7D4E] text-white"
                        >
                          Approve
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/70 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#18261E]">All Registered Platform Accounts</h3>
                  <p className="text-xs text-[#647067]">Search and manage permissions across all 5 roles.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8E9990]" />
                    <input
                      type="text"
                      placeholder="Search by name, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] focus:outline-none focus:border-[#4F9D69]"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] focus:outline-none"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="LEARNER">Learners</option>
                    <option value="INSTITUTION">Institutions</option>
                    <option value="VOLUNTEER">Volunteers</option>
                    <option value="DONOR">Donors</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAFBF9] text-[#647067] border-b border-[#E2E8E0]">
                    <tr>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Verification</th>
                      <th className="py-2.5 px-3">Created</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8E0]/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAFBF9]/80 transition-colors">
                        <td className="py-3 px-3">
                          <strong className="text-[#18261E] block">{u.name}</strong>
                          <span className="text-[#8E9990] text-[11px]">{u.email}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAFBF9] border border-[#E2E8E0] text-[#4E5C53]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {u.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1B4D2F] bg-[#EEF7F0] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                              <CheckCircle2 className="w-3 h-3" />
                              VERIFIED
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-[#8C6013] bg-[#FEF9ED] px-2 py-0.5 rounded-full border border-[#FDE5A9]">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[#647067]">
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedUser(u)}
                            className="text-[11px] px-2 py-1"
                          >
                            Inspect
                          </Button>
                          <Button
                            size="sm"
                            variant={u.isVerified ? 'secondary' : 'primary'}
                            onClick={() => handleToggleUser(u.id, u.isVerified)}
                            className="text-[11px] px-2 py-1"
                          >
                            {u.isVerified ? 'Unverify' : 'Verify'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LEARNERS */}
          {activeTab === 'learners' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Learners Directory (Child-Safe Roster)</h3>
                <p className="text-xs text-[#647067]">
                  Aggregated learner records with privacy-safe alias identifiers. Zero personal phone numbers or addresses.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {learners.map((lrn) => (
                  <div key={lrn.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-[#2E7D4E] bg-[#EEF7F0] px-2 py-0.5 rounded-md border border-[#78B98A]/30">
                        {lrn.rollAlias}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#E2E8E0] text-[#4E5C53]">
                        Class {lrn.classLevel}
                      </span>
                    </div>
                    <strong className="text-[#18261E] block text-sm">{lrn.displayName}</strong>
                    <div className="text-[#647067] text-[11px]">
                      <span>Institution: <strong>{lrn.institution?.orgName || 'Care Home Partner'}</strong></span>
                      <br />
                      <span>Learning Streak: {lrn.streakDays} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: VOLUNTEERS */}
          {activeTab === 'volunteers' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Volunteer Teachers Directory</h3>
                <p className="text-xs text-[#647067]">Registered educators, skills, availability, and teaching hours.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {volunteers.map((vol) => (
                  <div key={vol.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[#18261E]">{vol.fullName}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          vol.verificationStatus === 'VERIFIED'
                            ? 'bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30'
                            : 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]'
                        }`}
                      >
                        {vol.verificationStatus}
                      </span>
                    </div>
                    <p className="text-[#647067] text-[11px]">{vol.bio || 'Passionate volunteer educator.'}</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#E2E8E0]/60">
                      <div>
                        <span className="text-[#8E9990] block">Subjects:</span>
                        <strong className="text-[#18261E]">{vol.subjects}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E9990] block">Availability:</span>
                        <strong className="text-[#18261E]">{vol.availability}</strong>
                      </div>
                      <div>
                        <span className="text-[#8E9990] block">Hours Contributed:</span>
                        <strong className="text-[#2E7D4E]">{vol.totalHours} hrs</strong>
                      </div>
                      <div>
                        <span className="text-[#8E9990] block">Sessions:</span>
                        <strong className="text-[#18261E]">{vol.totalSessions}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DONORS */}
          {activeTab === 'donors' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Educational Donors & Supporters</h3>
                <p className="text-xs text-[#647067]">Individual and corporate sponsors contributing educational resources.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users
                  .filter((u) => u.role === 'DONOR')
                  .map((donor) => {
                    const donorDonations = donations.filter((d) => d.donorId === donor.id);
                    return (
                      <div key={donor.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-[#18261E] text-sm">{donor.name}</strong>
                          <span className="text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] px-2 py-0.5 rounded-full border border-[#78B98A]/30">
                            Verified Donor
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8E9990] block">{donor.email}</span>
                        <div className="pt-2 border-t border-[#E2E8E0]/60 flex items-center justify-between text-[11px]">
                          <span>Pledges: <strong>{donorDonations.length}</strong></span>
                          <span>Units Donated: <strong className="text-[#2E7D4E]">{donorDonations.reduce((acc, d) => acc + d.quantity, 0)}</strong></span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB 6: INSTITUTIONS */}
          {activeTab === 'institutions' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Child Care Institutions (CCIs) & NGOs</h3>
                <p className="text-xs text-[#647067]">Registered homes and non-profit centers hosting learners.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {institutions.map((inst) => (
                  <div key={inst.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[#18261E]">{inst.orgName}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inst.verificationStatus === 'VERIFIED'
                            ? 'bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30'
                            : 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]'
                        }`}
                      >
                        {inst.verificationStatus}
                      </span>
                    </div>
                    <p className="text-[#647067] text-[11px]">
                      {inst.city}, {inst.state} • Reg: <span className="font-mono">{inst.registrationNumber}</span>
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E0]/60 text-[11px]">
                      <span>Children Under Care: <strong>{inst.childCount}</strong></span>
                      <span>Contact: <strong>{inst.contactPerson}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: VERIFICATION CENTER */}
          {activeTab === 'verification' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-5">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Dedicated Verification Directorate</h3>
                <p className="text-xs text-[#647067]">
                  Review registration documents, conduct KYC, approve verified badges, or request changes.
                </p>
              </div>

              {/* Verification Sub-Tabs */}
              <div className="flex items-center gap-2 border-b border-[#E2E8E0]/60 pb-2">
                <button
                  type="button"
                  onClick={() => setVerificationSubTab('institutions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    verificationSubTab === 'institutions'
                      ? 'bg-[#2E7D4E] text-white'
                      : 'bg-[#FAFBF9] text-[#647067] hover:bg-[#FAFBF9]/80'
                  }`}
                >
                  Institutions ({institutions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationSubTab('volunteers')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    verificationSubTab === 'volunteers'
                      ? 'bg-[#2E7D4E] text-white'
                      : 'bg-[#FAFBF9] text-[#647067] hover:bg-[#FAFBF9]/80'
                  }`}
                >
                  Volunteers ({volunteers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationSubTab('donors')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    verificationSubTab === 'donors'
                      ? 'bg-[#2E7D4E] text-white'
                      : 'bg-[#FAFBF9] text-[#647067] hover:bg-[#FAFBF9]/80'
                  }`}
                >
                  Donors
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationSubTab('documents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    verificationSubTab === 'documents'
                      ? 'bg-[#2E7D4E] text-white'
                      : 'bg-[#FAFBF9] text-[#647067] hover:bg-[#FAFBF9]/80'
                  }`}
                >
                  Document Audit
                </button>
              </div>

              {/* Institutions verification tab */}
              {verificationSubTab === 'institutions' && (
                <div className="space-y-3">
                  {institutions.map((inst) => (
                    <div key={inst.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <strong className="text-sm text-[#18261E]">{inst.orgName}</strong>
                          <span className="text-[#647067] text-[11px] block">
                            {inst.city}, {inst.state} • Reg: <span className="font-mono">{inst.registrationNumber}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              inst.verificationStatus === 'VERIFIED'
                                ? 'bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30'
                                : 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]'
                            }`}
                          >
                            {inst.verificationStatus}
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setRequestTarget({ type: 'Institution', id: inst.id })}
                            className="text-[11px]"
                          >
                            Request Changes
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyInst(inst.id, 'VERIFIED')}
                            className="bg-[#2E7D4E] text-white text-[11px]"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleVerifyInst(inst.id, 'REJECTED')}
                            className="text-red-600 hover:bg-red-50 text-[11px]"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Volunteers verification tab */}
              {verificationSubTab === 'volunteers' && (
                <div className="space-y-3">
                  {volunteers.map((vol) => (
                    <div key={vol.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] space-y-3 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <strong className="text-sm text-[#18261E]">{vol.fullName}</strong>
                          <span className="text-[#647067] text-[11px] block">
                            Skills: {vol.skills} • Availability: {vol.availability}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              vol.verificationStatus === 'VERIFIED'
                                ? 'bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30'
                                : 'bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9]'
                            }`}
                          >
                            {vol.verificationStatus}
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setRequestTarget({ type: 'Volunteer', id: vol.id })}
                            className="text-[11px]"
                          >
                            Request Changes
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerifyVol(vol.id, 'VERIFIED')}
                            className="bg-[#2E7D4E] text-white text-[11px]"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleVerifyVol(vol.id, 'REJECTED')}
                            className="text-red-600 hover:bg-red-50 text-[11px]"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Donors verification */}
              {verificationSubTab === 'donors' && (
                <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-xs text-[#647067]">
                  All donors are verified through OTP authentication, transaction receipt audit, and 80G certificate generation compliance.
                </div>
              )}

              {/* Document Audit */}
              {verificationSubTab === 'documents' && (
                <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-xs text-[#647067]">
                  Document repository contains 18 audited government registration certificates and POCSO compliance certificates.
                </div>
              )}
            </div>
          )}

          {/* TAB 8: CURRICULUM */}
          {activeTab === 'curriculum' && (
            <AdminContentManagement
              chapters={chapters}
              videos={videos}
              trustedChannels={trustedChannels}
              videoReports={videoReports}
            />
          )}

          {/* TAB 9: NEEDS */}
          {activeTab === 'needs' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/70 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-[#18261E]">Institutional Needs Oversight</h3>
                  <p className="text-xs text-[#647067]">Audit, approve, reject, or close educational requirements.</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={needCategoryFilter}
                    onChange={(e) => setNeedCategoryFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9]"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="BOOKS">Books</option>
                    <option value="NOTEBOOKS">Notebooks</option>
                    <option value="STATIONERY">Stationery</option>
                    <option value="TABLETS">Devices</option>
                    <option value="TEACHING">Teaching</option>
                  </select>

                  <select
                    value={needStatusFilter}
                    onChange={(e) => setNeedStatusFilter(e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9]"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="PARTIALLY_FULFILLED">Partially Fulfilled</option>
                    <option value="FULFILLED">Fulfilled</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredNeeds.map((need) => (
                  <div key={need.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-[#18261E]">{need.title}</strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                          {need.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-[#E2E8E0] text-[#4E5C53]">
                          {need.status}
                        </span>
                      </div>
                      <p className="text-[#647067] text-[11px]">{need.description}</p>
                      <div className="text-[11px] text-[#4E5C53]">
                        {need.institution?.orgName} • {need.fulfilledQuantity} / {need.requiredQuantity} units fulfilled
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {need.status !== 'CLOSED' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateNeedStatus(need.id, 'CLOSED')}
                          className="text-[11px]"
                        >
                          Close Need
                        </Button>
                      )}
                      {need.status !== 'OPEN' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNeedStatus(need.id, 'OPEN')}
                          className="bg-[#2E7D4E] text-white text-[11px]"
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: DONATIONS */}
          {activeTab === 'donations' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Donation Verification & Fulfillment Flow</h3>
                <p className="text-xs text-[#647067]">
                  Track lifecycle: Pledged → Received → Verified → Fulfilled
                </p>
              </div>

              <div className="space-y-3">
                {donations.map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-[#18261E]">{d.itemDescription}</strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                          {d.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#647067]">
                        Donor: <strong>{d.donor?.name || 'Anonymous'}</strong> • Institution: <strong>{d.need?.institution?.orgName}</strong>
                      </div>
                      <div className="text-[10px] text-[#8E9990]">
                        Tracking: <span className="font-mono text-[#2E7D4E]">{d.trackingNumber || 'N/A'}</span> • {new Date(d.initiatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {d.status === 'INITIATED' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateDonationStatus(d.id, 'INSTITUTION_RECEIVED')}
                          className="bg-[#2E7D4E] text-white text-[11px]"
                        >
                          Mark Received
                        </Button>
                      )}
                      {d.status === 'INSTITUTION_RECEIVED' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateDonationStatus(d.id, 'INSTITUTION_VERIFIED')}
                          className="bg-[#2E7D4E] text-white text-[11px]"
                        >
                          Verify & Audit
                        </Button>
                      )}
                      {d.status === 'INSTITUTION_VERIFIED' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateDonationStatus(d.id, 'FULFILLED')}
                          className="bg-[#2E7D4E] text-white text-[11px]"
                        >
                          Mark Fulfilled
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: TEACHING SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Teaching Sessions Directory</h3>
                <p className="text-xs text-[#647067]">Scheduled and completed sessions across institutions.</p>
              </div>

              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="p-4 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-[#18261E]">{s.title}</strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF7F0] text-[#1B4D2F] border border-[#78B98A]/30">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#647067]">
                        Teacher: <strong>{s.volunteer?.fullName}</strong> • Institution: <strong>{s.institution?.orgName}</strong>
                      </div>
                      <div className="text-[10px] text-[#8E9990]">
                        Mode: <span className="uppercase">{s.mode}</span> • {new Date(s.scheduledStart).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {s.status === 'SCHEDULED' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateSessionStatus(s.id, 'COMPLETED')}
                            className="bg-[#2E7D4E] text-white text-[11px]"
                          >
                            Verify Completion
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateSessionStatus(s.id, 'CANCELLED')}
                            className="text-red-600 hover:bg-red-50 text-[11px]"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Child Safety & POCSO Compliance Reports</h3>
                <p className="text-xs text-[#647067]">
                  Incident flags, content reports, and institutional safety audits.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#EEF7F0] border border-[#78B98A]/30 text-xs text-[#1B4D2F] space-y-1">
                <strong>Safety Directorate Audit:</strong> All volunteer interactions adhere to POCSO guidelines.
                No individual direct messaging with minors. Classes are conducted in group institutional environments.
              </div>

              <div className="space-y-3">
                {videoReports.length === 0 ? (
                  <p className="text-xs text-[#8E9990] py-4 text-center">Zero pending safety flags.</p>
                ) : (
                  videoReports.map((r) => (
                    <div key={r.id} className="p-3.5 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-red-700">{r.reason}</strong>
                        <span className="text-[10px] text-[#8E9990]">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#647067] text-[11px]">{r.details}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 13: IMPACT */}
          {activeTab === 'impact' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-6">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Platform Ecosystem Impact</h3>
                <p className="text-xs text-[#647067]">
                  Aggregated outcomes across learners, educators, care homes, and donors.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <div className="text-2xl font-extrabold text-[#18261E]">1,250+</div>
                  <div className="text-xs font-semibold text-[#4E5C53]">Textbooks Delivered</div>
                  <p className="text-[10px] text-[#2E7D4E]">NCERT Curriculum</p>
                </div>
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <div className="text-2xl font-extrabold text-[#18261E]">240+</div>
                  <div className="text-xs font-semibold text-[#4E5C53]">Volunteer Hours</div>
                  <p className="text-[10px] text-[#2E7D4E]">Weekend Tutoring</p>
                </div>
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <div className="text-2xl font-extrabold text-[#18261E]">18</div>
                  <div className="text-xs font-semibold text-[#4E5C53]">Partner CCIs</div>
                  <p className="text-[10px] text-[#2E7D4E]">Delhi NCR & UP</p>
                </div>
                <div className="p-4 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] space-y-1">
                  <div className="text-2xl font-extrabold text-[#18261E]">100%</div>
                  <div className="text-xs font-semibold text-[#4E5C53]">Audit Transparency</div>
                  <p className="text-[10px] text-[#2E7D4E]">Superintendent Signed</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">Governance Notifications</h3>
                <p className="text-xs text-[#647067]">Administrative alerts and audit signals.</p>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0]">
                  <strong className="text-[#18261E] block">Daily KYC Sync Complete</strong>
                  <span className="text-[#647067] text-[11px]">All submitted institution registrations verified against Darpan portal guidelines.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 15: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8E0] shadow-xs space-y-4">
              <div className="border-b border-[#E2E8E0]/70 pb-3">
                <h3 className="text-sm font-bold text-[#18261E]">System Governance & Audit Logs</h3>
                <p className="text-xs text-[#647067]">Immutable audit trail for child-safety and verification compliance.</p>
              </div>

              <div className="space-y-2 text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E2E8E0] flex items-center justify-between">
                    <div>
                      <strong className="text-[#18261E] font-mono">{log.action}</strong>
                      <span className="text-[#647067] text-[11px] block">{log.entityType} #{log.entityId}</span>
                    </div>
                    <span className="text-[10px] text-[#8E9990]">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Changes Modal */}
      {requestTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <h4 className="text-sm font-bold text-[#18261E]">
                Request Changes: {requestTarget.type}
              </h4>
              <button
                type="button"
                onClick={() => setRequestTarget(null)}
                className="text-[#8E9990] hover:text-[#18261E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRequestChanges} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#18261E] block mb-1">
                  Explanation / Missing Documentation Note
                </label>
                <textarea
                  rows={4}
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  placeholder="e.g. Please re-upload registration certificate with clear seal from competent authority..."
                  required
                  className="w-full p-2.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] focus:outline-none focus:border-[#4F9D69]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setRequestTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  type="submit"
                  disabled={isPending}
                  className="bg-[#2E7D4E] text-white"
                >
                  Send Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8E0] p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <h4 className="text-sm font-bold text-[#18261E]">User Profile Inspector</h4>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-[#8E9990] hover:text-[#18261E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-[#8E9990] block text-[11px]">Name:</span>
                <strong className="text-[#18261E] text-sm">{selectedUser.name}</strong>
              </div>
              <div>
                <span className="text-[#8E9990] block text-[11px]">Email:</span>
                <span className="text-[#4E5C53]">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-[#8E9990] block text-[11px]">Role:</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAFBF9] border border-[#E2E8E0] text-[#4E5C53]">
                  {selectedUser.role}
                </span>
              </div>
              <div>
                <span className="text-[#8E9990] block text-[11px]">Verification Status:</span>
                <span className="font-bold text-[#2E7D4E]">
                  {selectedUser.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E2E8E0] flex justify-end">
              <Button size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
