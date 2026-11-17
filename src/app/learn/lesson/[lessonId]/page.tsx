import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { VideoAndNotesPlayer } from '@/components/learning/VideoAndNotesPlayer';
import { ArrowLeft } from 'lucide-react';

export default async function LessonDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lessonId: string }>;
  searchParams?: Promise<{ v?: string }>;
}) {
  const { lessonId } = await params;
  const sParams = searchParams ? await searchParams : {};
  const selectedVideoId = sParams?.v;
  const user = await getCurrentUser();

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      topic: true,
      chapter: {
        include: {
          subject: {
            include: {
              class: true,
            },
          },
          notes: true,
          questions: {
            orderBy: { createdAt: 'asc' },
          },
          quizzes: {
            take: 1,
          },
        },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  const chapter = lesson.chapter;
  const subject = chapter.subject;
  const classNumber = subject.class.classNumber;

  // Fetch adjacent lessons for Next/Previous lesson navigation
  const [previousLesson, nextLesson] = await Promise.all([
    prisma.lesson.findFirst({
      where: {
        chapterId: chapter.id,
        lessonNumber: { lt: lesson.lessonNumber },
      },
      orderBy: { lessonNumber: 'desc' },
      select: { id: true, lessonNumber: true, title: true },
    }),
    prisma.lesson.findFirst({
      where: {
        chapterId: chapter.id,
        lessonNumber: { gt: lesson.lessonNumber },
      },
      orderBy: { lessonNumber: 'asc' },
      select: { id: true, lessonNumber: true, title: true },
    }),
  ]);

  // Fetch related videos from chapter
  const relatedVideos = await prisma.learningVideo.findMany({
    where: {
      chapterId: chapter.id,
      isApproved: true,
    },
    take: 6,
    orderBy: [{ isRecommended: 'desc' }, { relevanceScore: 'desc' }],
  });

  // Check if learner has completed this lesson
  let isCompletedInitial = false;
  if (user && user.learnerId) {
    const progress = await prisma.learningProgress.findUnique({
      where: {
        learnerId_lessonId: {
          learnerId: user.learnerId,
          lessonId: lesson.id,
        },
      },
    });
    isCompletedInitial = !!progress?.isCompleted;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4E5C53] font-medium">
          <Link href="/learn" className="hover:text-[#2E7D4E]">
            Classes
          </Link>
          <span>/</span>
          <Link href={`/learn/${classNumber}`} className="hover:text-[#2E7D4E]">
            Class {classNumber}
          </Link>
          <span>/</span>
          <Link
            href={`/learn/${classNumber}/${subject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            className="hover:text-[#2E7D4E]"
          >
            {subject.name}
          </Link>
          <span>/</span>
          <span className="text-[#18261E] font-semibold truncate max-w-xs">{chapter.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF5EE] text-[#1B4D2F]">
                Class {classNumber} • {subject.name}
              </span>
              <span className="text-xs text-[#4E5C53] font-medium">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#18261E]">
              Lesson {lesson.lessonNumber}: {lesson.title}
            </h1>
          </div>

          <Link
            href={`/learn/${classNumber}/${subject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E5C53] hover:text-[#18261E] px-3.5 py-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] hover:bg-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Chapter Overview</span>
          </Link>
        </div>

        {/* Core Player, Notes, Practice, Quiz & Doubt */}
        <VideoAndNotesPlayer
          lesson={lesson}
          notes={chapter.notes}
          practiceQuestions={chapter.questions}
          quiz={chapter.quizzes[0] || null}
          learnerId={user?.learnerId}
          isCompletedInitial={isCompletedInitial}
          relatedVideos={relatedVideos}
          selectedVideoId={selectedVideoId}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
        />
      </div>
    </div>
  );
}
