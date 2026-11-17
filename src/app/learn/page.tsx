import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { ClassSyllabusView } from '@/components/learning/ClassSyllabusView';

export const dynamic = 'force-dynamic';

export default async function LearnOverviewPage() {
  const user = await getCurrentUser();
  const activeClassLevel = user?.classLevel || 8;
  const studentName = user?.name || 'Aarav';

  // 1. Fetch complete class curriculum from PostgreSQL (Class → Subject → Chapter → Topic → Video / Lesson)
  let classData = null;
  let completedVideoIds: string[] = [];
  const progressMap: Record<string, number> = {};

  try {
    classData = await prisma.class.findUnique({
      where: { classNumber: activeClassLevel },
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
    });

    // 2. Fetch actual learner progress if user has learner profile
    if (user?.learnerId) {
      const [videoProgressRecords, lessonProgressRecords] = await Promise.all([
        prisma.learnerVideoProgress.findMany({
          where: { learnerId: user.learnerId },
          include: {
            video: {
              include: {
                chapter: {
                  include: { subject: true },
                },
              },
            },
          },
          orderBy: { lastWatchedAt: 'desc' },
        }),
        prisma.learningProgress.findMany({
          where: { learnerId: user.learnerId },
          include: {
            lesson: {
              include: {
                chapter: {
                  include: { subject: true },
                },
              },
            },
          },
          orderBy: { lastAccessedAt: 'desc' },
        }),
      ]);

      // Collect completed video IDs
      completedVideoIds = videoProgressRecords
        .filter((r) => r.completed || r.progressPercentage >= 90)
        .map((r) => r.videoId);

      videoProgressRecords.forEach((r) => {
        const subjName = r.video?.chapter?.subject?.name;
        if (subjName) {
          progressMap[subjName] = Math.max(
            progressMap[subjName] || 0,
            Math.round(r.progressPercentage || 0)
          );
        }
      });
    }
  } catch (e) {
    console.error('LearnOverviewPage query fallback:', (e as Error).message);
  }

  // Format subjects list
  const formattedSubjects =
    classData?.subjects && classData.subjects.length > 0
      ? classData.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          code: s.code,
          bookName: s.bookName,
          description: s.description,
          chapters: s.chapters,
          color: s.color,
        }))
      : [];

  return (
    <ClassSyllabusView
      subjects={formattedSubjects}
      currentClass={activeClassLevel}
      studentName={studentName}
      completedVideoIds={completedVideoIds}
      progressMap={progressMap}
    />
  );
}
