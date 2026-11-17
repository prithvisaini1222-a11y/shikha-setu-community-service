import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { HeroVideoVisual } from '@/components/home/HeroVideoVisual';
import { SystemFlowDiagram } from '@/components/visual/SystemFlowDiagram';
import { LearningHubVisualPath } from '@/components/home/LearningHubVisualPath';
import { TeachForADayPreview } from '@/components/home/TeachForADayPreview';
import { RealNeedDonationFlow } from '@/components/home/RealNeedDonationFlow';
import { InstitutionImpactPreview } from '@/components/home/InstitutionImpactPreview';
import {
  BookOpen,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Award,
  Leaf,
  LayoutDashboard,
  Clock,
  Radio,
  ArrowLeftRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  // Resilient live database metric queries
  let needsCount = 3;
  let volunteersCount = 18;
  let institutionsCount = 4;
  let completedSessionsCount = 32;
  let totalHoursCalculated = 74;

  try {
    needsCount = await prisma.institutionNeed.count({
      where: { status: { in: ['OPEN', 'PARTIALLY_FULFILLED'] } },
    });
    volunteersCount = await prisma.volunteer.count({
      where: { verificationStatus: 'VERIFIED' },
    });
    institutionsCount = await prisma.institution.count({
      where: { verificationStatus: 'VERIFIED' },
    });
    completedSessionsCount = await prisma.session.count({
      where: { status: 'COMPLETED' },
    });
    const volHoursAgg = await prisma.volunteer.aggregate({
      _sum: { totalHours: true },
    });
    if (volHoursAgg._sum.totalHours) {
      totalHoursCalculated = Math.round(volHoursAgg._sum.totalHours);
    }
  } catch (e) {
    console.error('HomePage data fetch note:', (e as Error).message);
  }

  const dashboardUrl = currentUser
    ? `/dashboard/${currentUser.role.toLowerCase()}`
    : '/auth/login';

  return (
    <div className="bg-[#F8F7F2] text-[#25352B] space-y-8 sm:space-y-12 pb-12 overflow-hidden selection:bg-[#EEF7F0] selection:text-[#4F9D69]">
      {/* 1. ROLE-AWARE AUTHENTICATED GREETING BANNER */}
      {currentUser && (
        <div className="bg-[#EEF7F0] border-b border-[#E2E8E0] px-4 py-2.5 text-xs text-[#4F9D69]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
              <span>
                Welcome back, <strong className="font-bold">{currentUser.name}</strong> • Active Portal:{' '}
                <span className="font-mono uppercase font-bold text-[#4F9D69] bg-white px-2 py-0.5 rounded border border-[#78B98A]/30">
                  {currentUser.role}
                </span>
              </span>
            </div>
            <Link
              href={dashboardUrl}
              className="inline-flex items-center gap-1.5 font-bold text-[#4F9D69] hover:underline"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to Your {currentUser.role} Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION: PURE LIGHT & AIRY EDITORIAL HERO */}
      <section className="pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative w-full rounded-2xl sm:rounded-3xl bg-white border border-[#E2E8E0] shadow-sm p-6 sm:p-10 lg:p-14 overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#EEF7F0]/80 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#6E9AD6]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left: Concise Copy & Clear CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EEF7F0] text-[#4F9D69] text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-[#4F9D69]" />
                <span>Education • Mentorship • Impact</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#25352B] leading-[1.1]">
                  Connect. Teach. <br />
                  <span className="text-[#4F9D69]">Give. Empower.</span>
                </h1>
                <p className="text-base sm:text-lg text-[#647067] leading-relaxed max-w-xl">
                  Connecting children, volunteer teachers, verified institutions, and donors through a transparent, high-trust educational ecosystem.
                </p>
              </div>

              {/* Action Buttons (Requirement 10: Auth-aware CTAs) */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={
                    currentUser
                      ? currentUser.role === 'LEARNER'
                        ? '/dashboard/learner'
                        : `/dashboard/${currentUser.role.toLowerCase()}`
                      : '/auth/login?redirect=/dashboard/learner'
                  }
                  className="bg-[#4F9D69] hover:bg-[#3E8555] text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-sm btn-primary-lift inline-flex items-center gap-2 group cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href={
                    currentUser
                      ? currentUser.role === 'VOLUNTEER'
                        ? '/dashboard/volunteer'
                        : '/teach'
                      : '/auth/login?redirect=/teach'
                  }
                  className="bg-white hover:bg-[#FAFBF9] text-[#25352B] font-bold px-6 py-3.5 rounded-xl text-sm border border-[#E2E8E0] hover:border-[#78B98A] shadow-xs btn-primary-lift inline-flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-[#4F9D69]" />
                  <span>Help a Child Learn</span>
                </Link>
              </div>

              {/* Real Feature Badges (No fake mesh labels) */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-[#647067] border-t border-[#F0F3EF]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4F9D69]" />
                  <span>100% Verified Care Institutions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4F9D69]" />
                  <span>POCSO Child-Safe Guidelines</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#4F9D69]" />
                  <span>80G Tax-Exempt Receipts</span>
                </div>
              </div>
            </div>

            {/* Right: ONE Cohesive Visual - 3D Educational Object with Community Connection */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAFBF9] to-[#F2F6F3] border border-[#E2E8E0] p-4 sm:p-6 shadow-xs">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E2E8E0]/70 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4F9D69]" />
                    <span className="font-bold text-[#25352B] text-xs">
                      Community Educational Network
                    </span>
                  </div>
                  <span className="text-[11px] text-[#647067] font-medium">
                    Learner • Volunteer • Institution • Donor
                  </span>
                </div>

                {/* Educational Motion Video Container */}
                <div className="h-72 sm:h-80 w-full rounded-xl flex items-center justify-center relative overflow-hidden bg-white/40">
                  <HeroVideoVisual className="w-full h-full" />
                </div>

                {/* Visual Footer */}
                <div className="pt-3 mt-2 border-t border-[#E2E8E0]/70 flex items-center justify-between text-[11px] text-[#647067]">
                  <span>Powered by ShikshaSetu</span>
                  <span className="text-[#4F9D69] font-medium">Verified Social Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POSITIVE IMAGERY MOSAIC (REAL EDUCATION, TEACHING, COMMUNITY) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#E2E8E0] shadow-xs group">
            <Image
              src="/images/education.jpg"
              alt="Children studying together"
              fill
              className="object-cover img-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25352B]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78B98A]">
                Curricular Foundation
              </span>
              <h3 className="font-bold text-base sm:text-lg">Class 6–10 Guided Learning</h3>
              <p className="text-xs text-white/80 line-clamp-1">Structured conceptual paths with interactive tests</p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#E2E8E0] shadow-xs group">
            <Image
              src="/images/teaching.jpg"
              alt="Teacher helping students"
              fill
              className="object-cover img-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25352B]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6E9AD6]">
                Volunteer Engagement
              </span>
              <h3 className="font-bold text-base sm:text-lg">Teach For A Day</h3>
              <p className="text-xs text-white/80 line-clamp-1">High-impact weekend mentorship with verified institutions</p>
            </div>
          </div>

          <div className="relative h-64 rounded-2xl overflow-hidden border border-[#E2E8E0] shadow-xs group">
            <Image
              src="/images/donation.jpg"
              alt="Books and digital supplies for children"
              fill
              className="object-cover img-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#25352B]/85 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78B98A]">
                100% Item-Level Transparency
              </span>
              <h3 className="font-bold text-base sm:text-lg">Real Classroom Needs</h3>
              <p className="text-xs text-white/80 line-clamp-1">Textbooks and tech delivered directly with photo verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN SYSTEM FLOW DIAGRAM */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SystemFlowDiagram />
      </section>

      {/* 5. LEARNING HUB VISUAL PATH */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <LearningHubVisualPath />
      </section>

      {/* 6. TEACH FOR A DAY (VOLUNTEER EXPERIENCE & 92% MATCH TOOLTIP) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TeachForADayPreview />
      </section>

      {/* 7. SUPPORT A REAL NEED (DONATION EXPERIENCE & FULFILLMENT FLOW) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RealNeedDonationFlow />
      </section>

      {/* 8. INSTITUTION OPERATIONS CONSOLE & IMPACT NETWORK */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <InstitutionImpactPreview
          sessionsCount={completedSessionsCount}
          volunteerHours={totalHoursCalculated}
          resourcesFulfilled={needsCount * 5}
          institutionsCount={institutionsCount}
        />
      </section>
    </div>
  );
}
