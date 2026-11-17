import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { TeachMatcherForm } from '@/components/volunteer/TeachMatcherForm';
import { Badge, Button } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import { Video, CheckCircle2, Clock, Award, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TeachPage() {
  const user = await getCurrentUser();

  let openNeeds: any[] = [];
  let volunteerProfile: any = null;

  try {
    const [needs, vol] = await Promise.all([
      prisma.institutionNeed.findMany({
        where: {
          category: { in: ['TEACHING', 'MENTORING'] },
          status: { in: ['OPEN', 'PARTIALLY_FULFILLED'] },
        },
        include: {
          institution: { select: { orgName: true, city: true, state: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      user?.volunteerId
        ? prisma.volunteer.findUnique({
            where: { id: user.volunteerId },
          })
        : null,
    ]);
    openNeeds = needs;
    volunteerProfile = vol;
  } catch (e) {
    console.error('Teach page data fallback:', (e as Error).message);
  }

  return (
    <div className="bg-[#F8FAF8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner - Warm & Clean */}
        <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-5">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5EE] border border-[#C6E6CD] text-xs font-semibold text-[#1B4D2F]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D4E]" />
              <span>Teach for a Day & Mentoring</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight">
              Make your skills count.
            </h1>
            <p className="text-sm sm:text-base text-[#4E5C53] leading-relaxed">
              Teach for a Day: Share your knowledge with children living in verified Child Care Institutions. Dedicate 2 hours on a weekend or offer recurring weekly tutoring. Our smart matching algorithm pairs your subject expertise with verified requirements.
            </p>
          </div>

          {/* Volunteer Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8E0]">
            <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] card-interactive stagger-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#18261E] block">
                <CountUp end={24} duration={850} />
              </span>
              <span className="text-xs text-[#4E5C53] font-medium">Volunteer Hours</span>
            </div>
            <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] card-interactive stagger-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#18261E] block">
                <CountUp end={12} duration={850} />
              </span>
              <span className="text-xs text-[#4E5C53] font-medium">Sessions Completed</span>
            </div>
            <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] card-interactive stagger-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#18261E] block">
                <CountUp end={4} duration={850} />
              </span>
              <span className="text-xs text-[#4E5C53] font-medium">Active Requests</span>
            </div>
            <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] card-interactive stagger-4">
              <span className="text-2xl sm:text-3xl font-bold text-[#2E7D4E] block">
                <CountUp end={100} duration={850} suffix="%" />
              </span>
              <span className="text-xs text-[#4E5C53] font-medium">Verified Institutions</span>
            </div>
          </div>
        </div>

        {/* Interactive Teach For A Day Matching Section */}
        <TeachMatcherForm openNeeds={openNeeds} volunteerProfile={volunteerProfile} />

        {/* Upcoming Approved Sessions Link Banner */}
        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EBF5EE] text-[#2E7D4E] flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18261E]">Virtual Classrooms & Scheduled Sessions</h3>
              <p className="text-xs text-[#4E5C53]">
                Join approved live sessions with interactive whiteboard, notes, and attendance logging.
              </p>
            </div>
          </div>

          <Link href="/teach/sessions">
            <Button className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-semibold">
              View Scheduled Sessions
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
