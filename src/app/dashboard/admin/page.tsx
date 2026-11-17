import React from 'react';
import { requireRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const user = await requireRole(UserRole.ADMIN);

  const [
    institutions,
    volunteers,
    users,
    auditLogs,
    chapters,
    videos,
    trustedChannels,
    videoReports,
    needs,
    donations,
    sessions,
    learners,
    classes,
  ] = await Promise.all([
    prisma.institution.findMany({
      include: { user: true },
      orderBy: [{ verificationStatus: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.volunteer.findMany({
      include: { user: true },
      orderBy: [{ verificationStatus: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.user.findMany({
      include: { institution: true, volunteer: true, learner: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
    }),
    prisma.chapter.findMany({
      include: {
        subject: { include: { class: true } },
        topics: true,
      },
      orderBy: { chapterNumber: 'asc' },
    }),
    prisma.learningVideo.findMany({
      include: {
        chapter: { include: { subject: { include: { class: true } } } },
        topic: true,
      },
      orderBy: [{ chapterId: 'asc' }, { order: 'asc' }],
      take: 1000,
    }),
    prisma.trustedChannel.findMany({
      orderBy: { priority: 'desc' },
    }),
    prisma.videoReport.findMany({
      where: { status: 'PENDING' },
      include: { video: true, user: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.institutionNeed.findMany({
      include: { institution: true, donations: true, volunteerRequests: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.donation.findMany({
      include: { donor: true, need: { include: { institution: true } } },
      orderBy: { initiatedAt: 'desc' },
    }),
    prisma.session.findMany({
      include: { volunteer: true, institution: true, certificate: true },
      orderBy: { scheduledStart: 'desc' },
    }),
    prisma.learner.findMany({
      include: { user: true, institution: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.class.findMany({
      include: { subjects: { include: { chapters: true } } },
      orderBy: { classNumber: 'asc' },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AdminDashboardClient
        institutions={institutions}
        volunteers={volunteers}
        users={users}
        auditLogs={auditLogs}
        chapters={chapters}
        videos={videos}
        trustedChannels={trustedChannels}
        videoReports={videoReports}
        needs={needs}
        donations={donations}
        sessions={sessions}
        learners={learners}
        classes={classes}
      />
    </div>
  );
}
