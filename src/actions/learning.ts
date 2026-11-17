'use server';

import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { searchEducationalVideos } from '@/lib/youtube/youtubeService';
import { revalidatePath } from 'next/cache';

/**
 * Retrieves structured learning videos for a topic.
 * Implements the Quota-Optimized Caching Architecture:
 * 1. Check PostgreSQL DB first.
 * 2. If stored videos exist, return immediately (0 API quota used).
 * 3. If no videos exist, query YouTube API server-side, rank, save to DB, and return.
 */
export async function getTopicVideosAction(params: {
  topicId?: string;
  chapterId: string;
  languagePreference?: 'all' | 'Hindi' | 'English';
}) {
  try {
    const { topicId, chapterId, languagePreference } = params;

    // 1. Check PostgreSQL database
    let storedVideos = await prisma.learningVideo.findMany({
      where: {
        ...(topicId ? { topicId } : { chapterId }),
        isApproved: true,
      },
      orderBy: [{ isRecommended: 'desc' }, { relevanceScore: 'desc' }],
      take: 20,
    });

    if (storedVideos.length > 0) {
      return { success: true, videos: storedVideos, source: 'cache' as const };
    }

    // 2. If not stored, query context to construct curriculum query
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        subject: {
          include: { class: true },
        },
        topics: topicId ? { where: { id: topicId } } : false,
      },
    });

    if (!chapter) {
      return { success: false, error: 'Chapter not found', videos: [] };
    }

    const topicName = chapter.topics && chapter.topics[0] ? chapter.topics[0].name : undefined;
    const className = `Class ${chapter.subject.class.classNumber}`;
    const subjectName = chapter.subject.name;

    // 3. Search YouTube Data API v3 server-side
    const rankedVideos = await searchEducationalVideos({
      className,
      subject: subjectName,
      chapter: chapter.title,
      topic: topicName,
      language: languagePreference || 'all',
      maxResults: 6,
    });

    if (rankedVideos.length === 0) {
      return { success: true, videos: [], source: 'empty' as const };
    }

    // 4. Save newly discovered and ranked videos to PostgreSQL
    const savedVideos = [];
    for (const v of rankedVideos) {
      try {
        const saved = await prisma.learningVideo.upsert({
          where: { youtubeVideoId: v.youtubeVideoId },
          update: {
            topicId: topicId || null,
            chapterId,
            relevanceScore: v.relevanceScore,
            qualityScore: v.qualityScore,
            scoreBreakdownJson: JSON.stringify(v.scoreBreakdown),
            isRecommended: v.isRecommended,
            duration: v.duration,
            durationSeconds: v.durationSeconds,
            viewCount: v.viewCount,
            likeCount: v.likeCount,
          },
          create: {
            topicId: topicId || null,
            chapterId,
            youtubeVideoId: v.youtubeVideoId,
            title: v.title,
            channelName: v.channelName,
            channelId: v.channelId,
            thumbnailUrl: v.thumbnailUrl,
            description: v.description,
            publishedAt: v.publishedAt,
            language: v.language,
            duration: v.duration,
            durationSeconds: v.durationSeconds,
            relevanceScore: v.relevanceScore,
            qualityScore: v.qualityScore,
            scoreBreakdownJson: JSON.stringify(v.scoreBreakdown),
            isRecommended: v.isRecommended,
            isApproved: true,
            isCurated: false,
            viewCount: v.viewCount,
            likeCount: v.likeCount,
          },
        });
        savedVideos.push(saved);
      } catch (e) {
        console.error('Error caching video to DB:', (e as Error).message);
      }
    }

    return {
      success: true,
      videos: savedVideos.length > 0 ? savedVideos : storedVideos,
      source: 'api' as const,
    };
  } catch (error) {
    console.error('getTopicVideosAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message, videos: [] };
  }
}

/**
 * Track learner video viewing progress (percentage, seconds, completion).
 */
export async function trackVideoProgressAction(params: {
  videoId: string;
  progressPercentage: number;
  watchTimeSeconds: number;
  completed?: boolean;
}) {
  try {
    const user = await getCurrentUser();
    let learnerId = user?.learnerId;
    if (!learnerId && user?.id) {
      const l = await prisma.learner.findFirst({ where: { userId: user.id } });
      learnerId = l?.id;
    }

    if (!learnerId) {
      return { success: false, error: 'Unauthorized: Learner profile required' };
    }

    const { videoId, progressPercentage, watchTimeSeconds, completed } = params;

    // Resolve video by ID or YouTube ID for robustness
    const video = await prisma.learningVideo.findFirst({
      where: {
        OR: [{ id: videoId }, { youtubeVideoId: videoId }],
      },
    });

    if (!video) {
      return { success: false, error: 'Learning video not found in database' };
    }

    const resolvedVideoId = video.id;

    const record = await prisma.learnerVideoProgress.upsert({
      where: {
        learnerId_videoId: {
          learnerId,
          videoId: resolvedVideoId,
        },
      },
      update: {
        progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
        watchTimeSeconds,
        completed: completed ?? progressPercentage >= 90,
        lastWatchedAt: new Date(),
      },
      create: {
        learnerId,
        videoId: resolvedVideoId,
        progressPercentage: Math.max(0, Math.min(100, progressPercentage)),
        watchTimeSeconds,
        completed: completed ?? progressPercentage >= 90,
        lastWatchedAt: new Date(),
      },
    });

    return { success: true, progress: record };
  } catch (error) {
    console.error('trackVideoProgressAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Toggle bookmark/save for a lesson video.
 */
export async function toggleSaveVideoAction(videoId: string) {
  try {
    const user = await getCurrentUser();
    let learnerId = user?.learnerId;
    if (!learnerId && user?.id) {
      const l = await prisma.learner.findFirst({ where: { userId: user.id } });
      learnerId = l?.id;
    }

    if (!learnerId) {
      return { success: false, error: 'Please log in as a learner to save lessons' };
    }

    // Resolve video by ID or YouTube ID
    const video = await prisma.learningVideo.findFirst({
      where: {
        OR: [{ id: videoId }, { youtubeVideoId: videoId }],
      },
    });

    if (!video) {
      return { success: false, error: 'Video not found in database' };
    }

    const resolvedVideoId = video.id;

    const existing = await prisma.savedVideo.findUnique({
      where: {
        learnerId_videoId: {
          learnerId,
          videoId: resolvedVideoId,
        },
      },
    });

    if (existing) {
      await prisma.savedVideo.delete({
        where: { id: existing.id },
      });
      return { success: true, isSaved: false };
    } else {
      await prisma.savedVideo.create({
        data: {
          learnerId,
          videoId: resolvedVideoId,
        },
      });
      return { success: true, isSaved: true };
    }
  } catch (error) {
    console.error('toggleSaveVideoAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Submit child-safe moderation report for inappropriate/misleading/wrong topic video.
 */
export async function reportVideoAction(params: {
  videoId: string;
  reason: string;
  details?: string;
}) {
  try {
    const user = await getCurrentUser();
    const { videoId, reason, details } = params;

    const report = await prisma.videoReport.create({
      data: {
        videoId,
        userId: user?.id || null,
        reason,
        details,
        status: 'PENDING',
      },
    });

    return { success: true, reportId: report.id };
  } catch (error) {
    console.error('reportVideoAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Learning Hub Search across Class, Subject, Chapter, Topic, and Videos.
 */
export async function searchLearningHubAction(queryStr: string) {
  if (!queryStr || queryStr.trim().length < 2) {
    return { chapters: [], topics: [], videos: [] };
  }

  const q = queryStr.trim();

  try {
    const [chapters, topics, videos] = await Promise.all([
      prisma.chapter.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          subject: { include: { class: true } },
          lessons: { take: 1 },
        },
        take: 5,
      }),
      prisma.topic.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
        },
        include: {
          chapter: {
            include: {
              subject: { include: { class: true } },
            },
          },
        },
        take: 5,
      }),
      prisma.learningVideo.findMany({
        where: {
          isApproved: true,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { channelName: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          chapter: {
            include: {
              subject: { include: { class: true } },
            },
          },
        },
        take: 6,
      }),
    ]);

    return { chapters, topics, videos };
  } catch (error) {
    console.error('searchLearningHubAction error:', (error as Error).message);
    return { chapters: [], topics: [], videos: [] };
  }
}

/**
 * Evaluates student choice on practice question.
 */
export async function submitPracticeAnswerAction(questionId: string, selectedChoice: string) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return { success: false, isCorrect: false, explanation: 'Question not found' };
    }

    const isCorrect = question.correctAnswer.trim().toLowerCase() === selectedChoice.trim().toLowerCase();

    return {
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  } catch (error) {
    console.error('submitPracticeAnswerAction error:', (error as Error).message);
    return { success: false, isCorrect: false, explanation: (error as Error).message };
  }
}

/**
 * Evaluates student quiz attempt and saves record.
 */
export async function submitQuizAction(quizId: string, answers: Record<string, string>) {
  try {
    const user = await getCurrentUser();
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        chapter: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!quiz) {
      return { success: false, score: 0, maxScore: 0, accuracy: 0 };
    }

    const questions = quiz.chapter.questions;
    let score = 0;

    for (const q of questions) {
      const ans = answers[q.id];
      if (ans && ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score += 1;
      }
    }

    const maxScore = questions.length > 0 ? questions.length : 10;
    const accuracy = Math.round((score / maxScore) * 100);

    let learnerId = user?.learnerId;
    if (!learnerId && user?.id) {
      const learner = await prisma.learner.findFirst({ where: { userId: user.id } });
      learnerId = learner?.id;
    }

    if (learnerId) {
      await prisma.quizAttempt.create({
        data: {
          learnerId,
          quizId: quiz.id,
          score,
          maxScore,
          accuracyPercentage: accuracy,
          weakAreasJson: JSON.stringify([]),
          recommendationsJson: JSON.stringify([]),
        },
      });
      revalidatePath('/dashboard/learner');
    }

    return {
      success: true,
      score,
      maxScore,
      accuracy,
    };
  } catch (error) {
    console.error('submitQuizAction error:', (error as Error).message);
    return { success: false, score: 0, maxScore: 10, accuracy: 0 };
  }
}

/**
 * Marks a lesson complete for the current learner.
 */
export async function markLessonCompleteAction(lessonId: string) {
  try {
    const user = await getCurrentUser();
    let learnerId = user?.learnerId;
    if (!learnerId && user?.id) {
      const l = await prisma.learner.findFirst({ where: { userId: user.id } });
      learnerId = l?.id;
    }

    if (!learnerId) {
      return { success: false, error: 'Unauthorized: Learner login required' };
    }

    await prisma.learningProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        lastAccessedAt: new Date(),
      },
      create: {
        learnerId,
        lessonId,
        isCompleted: true,
        lastAccessedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/learner');
    return { success: true };
  } catch (error) {
    console.error('markLessonCompleteAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Submits an academic doubt to educators.
 */
export async function submitDoubtAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const subjectId = formData.get('subjectId') as string;
    const chapterId = formData.get('chapterId') as string;
    const question = formData.get('question') as string;

    let learnerId = user?.learnerId;
    if (!learnerId && user?.id) {
      const learner = await prisma.learner.findFirst({ where: { userId: user.id } });
      learnerId = learner?.id;
    }

    if (!learnerId || !subjectId || !chapterId || !question) {
      return { success: false, error: 'Missing required doubt fields' };
    }

    const doubt = await prisma.doubt.create({
      data: {
        learnerId,
        subjectId,
        chapterId,
        question,
        status: 'OPEN',
      },
    });

    revalidatePath('/dashboard/learner');
    return { success: true, doubtId: doubt.id };
  } catch (error) {
    console.error('submitDoubtAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Resolves and answers an academic doubt asked by a learner.
 * Callable by verified educators, volunteers, care home mentors, and administrators.
 */
export async function answerDoubtAction(
  paramsOrDoubtId: string | { doubtId: string; answer: string },
  maybeAnswer?: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized: Please log in to answer doubts.' };
    }

    const doubtId = typeof paramsOrDoubtId === 'string' ? paramsOrDoubtId : paramsOrDoubtId.doubtId;
    const answer = typeof paramsOrDoubtId === 'string' ? maybeAnswer : paramsOrDoubtId.answer;

    if (!doubtId || !answer || !answer.trim()) {
      return { success: false, error: 'Missing doubt ID or answer text.' };
    }

    const doubt = await prisma.doubt.findUnique({
      where: { id: doubtId },
    });

    if (!doubt) {
      return { success: false, error: 'Doubt not found.' };
    }

    const updated = await prisma.doubt.update({
      where: { id: doubtId },
      data: {
        status: 'ANSWERED',
        answer: answer.trim(),
        answeredByUserId: user.id,
        answeredAt: new Date(),
      },
      include: {
        learner: true,
        subject: true,
        chapter: true,
        answeredBy: { select: { id: true, name: true, role: true } },
      },
    });

    revalidatePath('/dashboard/learner');
    revalidatePath('/dashboard/volunteer');
    revalidatePath('/dashboard/institution');
    revalidatePath('/dashboard/admin');

    return { success: true, doubt: updated };
  } catch (error) {
    console.error('answerDoubtAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Updates the learner's active class level (6 to 10).
 * Persists to PostgreSQL and revalidates dashboard and learning views.
 */
export async function updateLearnerClassAction(classNumber: number) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    if (classNumber < 6 || classNumber > 10) {
      return { success: false, error: 'Class must be between 6 and 10' };
    }

    const learner = await prisma.learner.findFirst({
      where: {
        OR: [
          { userId: user.id },
          ...(user.learnerId ? [{ id: user.learnerId }] : [])
        ]
      }
    });

    if (!learner) {
      return { success: false, error: 'Learner profile not found' };
    }

    await prisma.learner.update({
      where: { id: learner.id },
      data: { classLevel: classNumber }
    });

    revalidatePath('/dashboard/learner');
    revalidatePath('/learn');
    return { success: true, classLevel: classNumber };
  } catch (error) {
    console.error('updateLearnerClassAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

