import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { ArrowLeft } from 'lucide-react';
import { SubjectLearningContentView } from '@/components/learning/SubjectLearningContentView';

export const dynamic = 'force-dynamic';

export default async function SubjectChaptersPage({
  params,
}: {
  params: Promise<{ class: string; subject: string }>;
}) {
  const { class: classParam, subject: subjectParam } = await params;
  const classNumber = parseInt(classParam, 10);

  if (isNaN(classNumber) || classNumber < 6 || classNumber > 10) notFound();

  const user = await getCurrentUser();

  // Find subject for this specific class
  const subjectRecord = await prisma.subject.findFirst({
    where: {
      class: { classNumber },
      OR: [
        { name: { contains: subjectParam.replace(/-/g, ' '), mode: 'insensitive' } },
        { code: { contains: subjectParam, mode: 'insensitive' } },
      ],
    },
    include: {
      class: true,
      chapters: {
        orderBy: { chapterNumber: 'asc' },
        include: {
          lessons: { orderBy: { lessonNumber: 'asc' } },
          videos: {
            where: { isApproved: true },
            orderBy: { order: 'asc' },
          },
          topics: {
            orderBy: { order: 'asc' },
            include: {
              videos: { where: { isApproved: true }, orderBy: { order: 'asc' } },
            },
          },
        },
      },
    },
  });

  if (!subjectRecord) {
    // Fallback: search available subjects for this class
    const fallbackClass = await prisma.class.findUnique({
      where: { classNumber },
      include: {
        subjects: {
          include: {
            chapters: true,
          },
        },
      },
    });
    if (!fallbackClass || fallbackClass.subjects.length === 0) notFound();
    return (
      <div className="min-h-screen bg-[#FAF8F5] p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href={`/learn/${classNumber}`} className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Class {classNumber}
          </Link>
          <h1 className="text-xl font-bold text-[#18261E]">Please select from available subjects in Class {classNumber}:</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fallbackClass.subjects.map((s) => (
              <Link
                key={s.id}
                href={`/learn/${classNumber}/${s.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="p-4 bg-white rounded-2xl border border-[#E2E8E0] hover:border-[#2E7D32] font-semibold text-[#18261E] text-sm transition-all"
              >
                {s.name} ({s.chapters.length} Chapters)
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fetch actual learner progress for this subject
  let progressPercentage = 0;
  let recentLecture = null;
  let completedVideoIds: string[] = [];

  let learnerId = user?.learnerId;
  if (!learnerId && user?.id) {
    const l = await prisma.learner.findFirst({ where: { userId: user.id } });
    learnerId = l?.id;
  }

  if (learnerId) {
    try {
      const subjectChapterIds = new Set(subjectRecord.chapters.map((c) => c.id));

      const [videoProgressRecords, lessonProgressRecords] = await Promise.all([
        prisma.learnerVideoProgress.findMany({
          where: { learnerId },
          include: {
            video: true,
          },
          orderBy: { lastWatchedAt: 'desc' },
        }),
        prisma.learningProgress.findMany({
          where: { learnerId },
          include: {
            lesson: true,
          },
          orderBy: { lastAccessedAt: 'desc' },
        }),
      ]);

      completedVideoIds = videoProgressRecords
        .filter((r) => r.completed || r.progressPercentage >= 90)
        .map((r) => r.videoId);

      const totalLessons = subjectRecord.chapters.reduce((acc, c) => acc + c.lessons.length, 0);
      const completedLessons = lessonProgressRecords.filter(
        (lp) => lp.isCompleted && subjectChapterIds.has(lp.lesson.chapterId)
      ).length;

      const totalVideos = subjectRecord.chapters.reduce(
        (acc, c) => acc + c.videos.length + c.topics.reduce((tAcc, t) => tAcc + t.videos.length, 0),
        0
      );
      const completedVids = videoProgressRecords.filter(
        (vp) => (vp.completed || vp.progressPercentage >= 90) && vp.video?.chapterId && subjectChapterIds.has(vp.video.chapterId)
      ).length;

      const totalItems = totalLessons + totalVideos;
      const completedItems = completedLessons + completedVids;

      if (totalItems > 0) {
        progressPercentage = Math.round((completedItems / totalItems) * 100);
      }

      // Find recent lecture
      const recentVid = videoProgressRecords.find(
        (vp) => vp.video?.chapterId && subjectChapterIds.has(vp.video.chapterId)
      );
      if (recentVid && recentVid.video) {
        recentLecture = {
          id: recentVid.video.id,
          youtubeVideoId: recentVid.video.youtubeVideoId,
          youtubeUrl: recentVid.video.youtubeUrl || `https://www.youtube.com/watch?v=${recentVid.video.youtubeVideoId}`,
          title: recentVid.video.title,
          duration: recentVid.video.duration || '15m',
          thumbnailUrl: recentVid.video.thumbnailUrl,
          source: recentVid.video.source || 'Magnet Brains',
          lessonNumber: recentVid.video.order || 1,
          completed: recentVid.completed,
        };
      }
    } catch (e) {
      console.error('Error computing subject progress:', e);
    }
  }

  return (
    <SubjectLearningContentView
      subjectName={subjectRecord.name}
      subjectCode={subjectRecord.code}
      bookName={subjectRecord.bookName}
      currentClass={classNumber}
      chapters={subjectRecord.chapters}
      progressPercentage={progressPercentage}
      recentLecture={recentLecture}
      completedVideoIds={completedVideoIds}
    />
  );
}
