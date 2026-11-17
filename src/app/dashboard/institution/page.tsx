import React from 'react';
import { requireRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { InstitutionDashboardClient } from '@/components/institution/InstitutionDashboardClient';

export const dynamic = 'force-dynamic';

export default async function InstitutionDashboardPage() {
  const user = await requireRole(UserRole.INSTITUTION);

  // Find or fallback to primary institution
  let institution = await prisma.institution.findFirst({
    where: { userId: user.id },
  });

  if (!institution) {
    institution = await prisma.institution.findFirst();
  }

  if (!institution) {
    return <div className="p-8">Institution not configured. Please run seed.</div>;
  }

  const [needs, volunteerRequests, sessions, donations, doubts, learners] = await Promise.all([
    prisma.institutionNeed.findMany({
      where: { institutionId: institution.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.volunteerRequest.findMany({
      where: { need: { institutionId: institution.id } },
      include: { volunteer: true, need: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.session.findMany({
      where: { institutionId: institution.id },
      include: { volunteer: true, certificate: true },
      orderBy: { scheduledStart: 'desc' },
    }),
    prisma.donation.findMany({
      where: { need: { institutionId: institution.id } },
      include: { donor: true, need: true },
      orderBy: { initiatedAt: 'desc' },
    }),
    prisma.doubt.findMany({
      where: {
        OR: [
          { learner: { institutionId: institution.id } },
          { status: 'OPEN' },
        ],
      },
      include: {
        learner: true,
        subject: true,
        chapter: true,
        answeredBy: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 25,
    }),
    prisma.learner.findMany({
      where: { institutionId: institution.id },
      include: {
        progress: { take: 3 },
        quizAttempts: { take: 3, orderBy: { completedAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <InstitutionDashboardClient
        institution={institution}
        needs={needs}
        volunteerRequests={volunteerRequests}
        sessions={sessions}
        donations={donations}
        doubts={doubts}
        learners={learners}
      />
    </div>
  );
}
