import React from 'react';
import { requireRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { VolunteerDashboardClient } from '@/components/volunteer/VolunteerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function VolunteerDashboardPage() {
  const user = await requireRole(UserRole.VOLUNTEER);

  let volunteer = await prisma.volunteer.findFirst({
    where: { userId: user.id },
    include: {
      requests: {
        include: { need: { include: { institution: true } } },
        orderBy: { createdAt: 'desc' },
      },
      sessions: {
        include: { institution: true },
        orderBy: { scheduledStart: 'desc' },
      },
      certificates: {
        include: { institution: true },
        orderBy: { issueDate: 'desc' },
      },
    },
  });

  if (!volunteer) {
    volunteer = await prisma.volunteer.findFirst({
      include: {
        requests: { include: { need: { include: { institution: true } } } },
        sessions: { include: { institution: true } },
        certificates: { include: { institution: true } },
      },
    });
  }

  const [openNeeds, doubts] = await Promise.all([
    prisma.institutionNeed.findMany({
      where: {
        category: { in: ['TEACHING', 'MENTORING'] },
        status: { in: ['OPEN', 'PARTIALLY_FULFILLED'] },
      },
      include: { institution: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.doubt.findMany({
      include: {
        learner: { select: { displayName: true, rollAlias: true, classLevel: true } },
        subject: true,
        chapter: true,
        answeredBy: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
  ]);

  if (!volunteer) {
    return (
      <div className="min-h-screen bg-[#F8FAF8] p-8">
        <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border border-[#E2E8E0] text-center">
          <p className="text-xs text-[#667085]">Volunteer profile not configured. Please run seed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <VolunteerDashboardClient
        volunteer={volunteer}
        openNeeds={openNeeds}
        allSessions={volunteer.sessions || []}
        certificates={volunteer.certificates || []}
        requests={volunteer.requests || []}
        doubts={doubts || []}
      />
    </div>
  );
}

