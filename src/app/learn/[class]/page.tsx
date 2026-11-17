import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { ClassSyllabusView } from '@/components/learning/ClassSyllabusView';

export const dynamic = 'force-dynamic';

export default async function ClassSubjectsPage({
  params,
}: {
  params: Promise<{ class: string }>;
}) {
  const { class: classParam } = await params;
  const classNumber = parseInt(classParam, 10);

  if (isNaN(classNumber) || classNumber < 6 || classNumber > 10) {
    notFound();
  }

  const user = await getCurrentUser();
  const studentName = user?.name || 'Learner';

  let learnerId = user?.learnerId;
  if (!learnerId && user?.id) {
    const l = await prisma.learner.findFirst({ where: { userId: user.id } });
    learnerId = l?.id;
  }

  const [classData, videoProgressRecords] = await Promise.all([
    prisma.class.findUnique({
      where: { classNumber },
      include: {
        subjects: {
          orderBy: { order: 'asc' },
          include: {
            chapters: {
              orderBy: { chapterNumber: 'asc' },
              include: {
                lessons: { orderBy: { lessonNumber: 'asc' } },
                videos: { where: { isApproved: true }, orderBy: { order: 'asc' } },
                topics: {
                  orderBy: { order: 'asc' },
                  include: {
                    videos: { where: { isApproved: true }, orderBy: { order: 'asc' } },
                  },
                },
              },
            },
          },
        },
      },
    }),
    learnerId
      ? prisma.learnerVideoProgress.findMany({
          where: { learnerId },
          include: {
            video: {
              include: {
                chapter: {
                  include: { subject: true },
                },
              },
            },
          },
        })
      : [],
  ]);

  if (!classData) {
    notFound();
  }

  const completedVideoIds: string[] = [];
  const progressMap: Record<string, number> = {};
  videoProgressRecords.forEach((r) => {
    if ((r.completed || r.progressPercentage >= 90) && r.videoId) {
      completedVideoIds.push(r.videoId);
    }
    const subjName = r.video?.chapter?.subject?.name;
    if (subjName) {
      progressMap[subjName] = Math.max(
        progressMap[subjName] || 0,
        Math.round(r.progressPercentage || 0)
      );
    }
  });

  const formattedSubjects = classData.subjects.map((s) => ({
    id: s.id,
    name: s.name,
    code: s.code,
    bookName: s.bookName,
    description: s.description,
    chapters: s.chapters,
    color: s.color,
  }));

  return (
    <ClassSyllabusView
      subjects={formattedSubjects}
      currentClass={classNumber}
      studentName={studentName}
      completedVideoIds={completedVideoIds}
      progressMap={progressMap}
    />
  );
}
