import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { ChapterTopicView } from '@/components/learning/ChapterTopicView';
import { ArrowLeft, BookOpen, Clock, Award, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ class: string; subject: string; chapterId: string }>;
}) {
  const { class: classParam, subject: subjectParam, chapterId } = await params;
  const classNumber = parseInt(classParam, 10);
  const user = await getCurrentUser();

  if (isNaN(classNumber)) notFound();

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      subject: {
        include: {
          class: true,
        },
      },
      topics: {
        orderBy: { order: 'asc' },
        include: {
          videos: {
            where: { isApproved: true },
            orderBy: [{ isRecommended: 'desc' }, { relevanceScore: 'desc' }],
          },
        },
      },
      videos: {
        where: { isApproved: true },
        orderBy: [{ isRecommended: 'desc' }, { relevanceScore: 'desc' }],
      },
      notes: true,
      questions: true,
      quizzes: true,
      lessons: {
        orderBy: { lessonNumber: 'asc' },
      },
    },
  });

  if (!chapter) {
    notFound();
  }

  const topics = chapter.topics;

  // Fetch saved video IDs for current learner
  let savedVideoIds: string[] = [];
  if (user?.learnerId) {
    const saved = await prisma.savedVideo.findMany({
      where: { learnerId: user.learnerId },
      select: { videoId: true },
    });
    savedVideoIds = saved.map((s) => s.videoId);
  }

  const subject = chapter.subject;
  const allChapterVideos = chapter.videos.length > 0 ? chapter.videos : topics.flatMap((t) => t.videos);

  return (
    <div className="min-h-screen bg-[#F8FAF8] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

        {/* Chapter Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E8E0] shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF5EE] text-[#1B4D2F]">
                  Class {classNumber} • {subject.name}
                </span>
                <span className="text-xs text-[#4E5C53] font-medium">
                  Chapter {chapter.chapterNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#18261E] tracking-tight">
                {chapter.title}
              </h1>
              <p className="text-sm text-[#4E5C53] leading-relaxed">{chapter.description}</p>
            </div>

            <Link
              href={`/learn/${classNumber}/${subject.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E5C53] hover:text-[#18261E] px-3.5 py-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] hover:bg-white transition-colors self-start md:self-auto shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {subject.name}</span>
            </Link>
          </div>

          {/* Chapter Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E2E8E0]">
            <div className="bg-[#F4F7F4] p-3 rounded-[12px] border border-[#E2E8E0]">
              <span className="text-lg font-bold text-[#18261E] block">{topics.length}</span>
              <span className="text-[11px] text-[#4E5C53]">Curriculum Topics</span>
            </div>
            <div className="bg-[#F4F7F4] p-3 rounded-[12px] border border-[#E2E8E0]">
              <span className="text-lg font-bold text-[#18261E] block">
                {allChapterVideos.length > 0 ? allChapterVideos.length : 'Multiple'}
              </span>
              <span className="text-[11px] text-[#4E5C53]">Video Lessons</span>
            </div>
            <div className="bg-[#F4F7F4] p-3 rounded-[12px] border border-[#E2E8E0]">
              <span className="text-lg font-bold text-[#18261E] block">{chapter.notes.length}</span>
              <span className="text-[11px] text-[#4E5C53]">Revision Notes</span>
            </div>
            <div className="bg-[#F4F7F4] p-3 rounded-[12px] border border-[#E2E8E0]">
              <span className="text-lg font-bold text-[#2E7D4E] block">
                {chapter.questions.length}
              </span>
              <span className="text-[11px] text-[#4E5C53]">Practice Questions</span>
            </div>
          </div>
        </div>

        {/* Interactive Topic & Recommended Videos Hub */}
        <ChapterTopicView
          chapter={chapter as any}
          initialTopics={topics as any}
          initialVideos={allChapterVideos as any}
          savedVideoIds={savedVideoIds}
        />
      </div>
    </div>
  );
}
