import React from 'react';
import { requireRole } from '@/lib/auth/session';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { LearnerDashboardClient } from '@/components/learning/LearnerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function LearnerDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; chooseClass?: string }>;
}) {
  const user = await requireRole(UserRole.LEARNER);
  const { welcome, chooseClass } = (await searchParams) || {};

  // Fetch learner details
  let learner = await prisma.learner.findFirst({
    where: { userId: user.id },
    include: {
      institution: true,
      progress: {
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
      },
      quizAttempts: {
        include: { quiz: true },
        orderBy: { completedAt: 'desc' },
        take: 3,
      },
    },
  });

  // If learner record doesn't exist yet, create or fallback
  if (!learner) {
    const firstInst = await prisma.institution.findFirst();
    learner = await prisma.learner.create({
      data: {
        userId: user.id,
        displayName: user.name || 'Learner',
        classLevel: 6,
        institutionId: firstInst?.id || 'inst-default',
        rollAlias: `LRN-${Math.floor(100 + Math.random() * 900)}`,
        streakDays: 1,
      },
      include: {
        institution: true,
        progress: {
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
        },
        quizAttempts: {
          include: { quiz: true },
          orderBy: { completedAt: 'desc' },
          take: 3,
        },
      },
    });
  }

  const activeClassLevel = learner.classLevel || 6;

  // Fetch actual curriculum data, upcoming sessions, video progress, doubts, and quizzes
  const [classData, upcomingSessions, videoProgress, savedVideos, learnerDoubts, classQuizzes, classQuestions] =
    await Promise.all([
      prisma.class.findUnique({
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
      }),
      prisma.session.findMany({
        where: {
          status: 'SCHEDULED',
          classLevel: activeClassLevel,
        },
        include: { volunteer: true, institution: true },
        take: 3,
        orderBy: { scheduledStart: 'asc' },
      }),
      learner.id
        ? prisma.learnerVideoProgress.findMany({
            where: { learnerId: learner.id },
            include: {
              video: {
                include: {
                  chapter: {
                    include: { subject: { include: { class: true } } },
                  },
                },
              },
            },
            orderBy: { lastWatchedAt: 'desc' },
            take: 10,
          })
        : [],
      learner.id
        ? prisma.savedVideo.findMany({
            where: { learnerId: learner.id },
            include: {
              video: {
                include: {
                  chapter: {
                    include: { subject: { include: { class: true } } },
                  },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
            take: 4,
          })
        : [],
      learner.id
        ? prisma.doubt.findMany({
            where: { learnerId: learner.id },
            include: {
              subject: true,
              chapter: true,
              answeredBy: { select: { name: true, role: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
          })
        : [],
      prisma.quiz.findMany({
        where: {
          chapter: {
            subject: {
              class: { classNumber: activeClassLevel },
            },
          },
        },
        include: {
          chapter: {
            include: {
              subject: true,
              questions: true,
            },
          },
          attempts: learner.id
            ? {
                where: { learnerId: learner.id },
                orderBy: { completedAt: 'desc' },
                take: 1,
              }
            : false,
        },
        take: 15,
      }),
      prisma.question.findMany({
        where: {
          chapter: {
            subject: {
              class: { classNumber: activeClassLevel },
            },
          },
        },
        include: {
          chapter: {
            include: { subject: true },
          },
        },
        take: 25,
      }),
    ]);

  const studentName = learner.displayName || user.name || 'Learner';
  const recentLesson = learner.progress[0]?.lesson;

  // Format doubts
  const formattedDoubts = learnerDoubts.map((d) => ({
    id: d.id,
    subjectId: d.subjectId,
    subjectName: d.subject.name,
    chapterId: d.chapterId,
    chapterTitle: d.chapter.title,
    question: d.question,
    status: d.status,
    answer: d.answer,
    answeredBy: d.answeredBy?.name,
    answeredAt: d.answeredAt ? d.answeredAt.toISOString() : null,
    createdAt: d.createdAt.toISOString(),
  }));

  // Format quizzes (and synthesize practice modules from chapter questions if needed)
  const formattedQuizzes = classQuizzes.map((q) => {
    let parsedQuestions: any[] = [];
    try {
      parsedQuestions = (q.chapter.questions || []).map((qu) => {
        let opts: string[] = [];
        try {
          opts = JSON.parse(qu.optionsJson);
        } catch {
          opts = [qu.correctAnswer];
        }
        return {
          id: qu.id,
          questionText: qu.questionText,
          options: opts,
          correctAnswer: qu.correctAnswer,
          explanation: qu.explanation,
          difficulty: qu.difficulty,
        };
      });
    } catch {
      parsedQuestions = [];
    }

    const attemptsList = Array.isArray(q.attempts) ? q.attempts : [];
    const lastAttempt = attemptsList[0]
      ? {
          score: attemptsList[0].score,
          maxScore: attemptsList[0].maxScore,
          accuracyPercentage: attemptsList[0].accuracyPercentage,
          completedAt: attemptsList[0].completedAt.toISOString(),
        }
      : null;

    return {
      id: q.id,
      title: q.title,
      chapterId: q.chapterId,
      chapterTitle: q.chapter.title,
      subjectName: q.chapter.subject.name,
      passScore: q.passScore,
      timeLimitMinutes: q.timeLimitMinutes,
      questions: parsedQuestions,
      lastAttempt,
    };
  });

  // Compute real learner progress map and recent lecture
  const progressMap: Record<string, number> = {};
  const completedVideoIds: string[] = [];
  videoProgress.forEach((vp) => {
    if (vp.completed && vp.videoId) {
      completedVideoIds.push(vp.videoId);
    }
    const subjName = vp.video?.chapter?.subject?.name;
    if (subjName) {
      progressMap[subjName] = Math.max(
        progressMap[subjName] || 0,
        Math.round(vp.progressPercentage || 0)
      );
    }
  });

  const mostRecentVP = videoProgress[0];
  const recentLecture = mostRecentVP?.video
    ? {
        id: mostRecentVP.video.id,
        youtubeVideoId: mostRecentVP.video.youtubeVideoId,
        title: mostRecentVP.video.title,
        duration: mostRecentVP.video.duration || '15m',
        durationSeconds: mostRecentVP.video.durationSeconds || 900,
        thumbnailUrl: mostRecentVP.video.thumbnailUrl,
        chapterId: mostRecentVP.video.chapterId,
        chapterTitle: mostRecentVP.video.chapter?.title,
        chapterNumber: mostRecentVP.video.chapter?.chapterNumber || 1,
        subjectName: mostRecentVP.video.chapter?.subject?.name || 'Mathematics',
        progressPercentage: Math.round(mostRecentVP.progressPercentage || 0),
        completed: mostRecentVP.completed,
      }
    : null;

  return (
    <LearnerDashboardClient
      currentClass={activeClassLevel}
      studentName={studentName}
      learnerId={learner.id}
      learnerProfile={{
        displayName: studentName,
        rollAlias: learner.rollAlias,
        institutionName: learner.institution?.orgName || 'Partner Learning Center',
        streakDays: learner.streakDays || 1,
        classLevel: activeClassLevel,
      }}
      subjects={classData?.subjects || []}
      recentVideo={mostRecentVP?.video}
      recentLecture={recentLecture}
      recentLesson={recentLesson}
      videoProgress={videoProgress}
      completedVideoIds={completedVideoIds}
      progressMap={progressMap}
      savedVideos={savedVideos}
      upcomingSessions={upcomingSessions}
      doubts={formattedDoubts}
      quizzes={formattedQuizzes}
      initialShowSelection={welcome === 'true' || chooseClass === 'true'}
    />
  );
}
