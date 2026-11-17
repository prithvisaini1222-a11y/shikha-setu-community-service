'use server';

import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/lib/auth/session';
import { extractYouTubeVideoId, fetchSingleVideoMetadata, searchEducationalVideos } from '@/lib/youtube/youtubeService';
import { revalidatePath } from 'next/cache';

/**
 * Admin action: Forces a fresh YouTube API search & re-ranking for a topic/chapter.
 */
export async function refreshTopicVideosAction(params: {
  topicId?: string;
  chapterId: string;
}) {
  await requireAdmin();

  try {
    const { topicId, chapterId } = params;

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        subject: { include: { class: true } },
        topics: topicId ? { where: { id: topicId } } : false,
      },
    });

    if (!chapter) {
      return { success: false, error: 'Chapter not found' };
    }

    const topicName = chapter.topics && chapter.topics[0] ? chapter.topics[0].name : undefined;
    const className = `Class ${chapter.subject.class.classNumber}`;
    const subjectName = chapter.subject.name;

    const rankedVideos = await searchEducationalVideos({
      className,
      subject: subjectName,
      chapter: chapter.title,
      topic: topicName,
      maxResults: 8,
    });

    if (rankedVideos.length === 0) {
      return { success: false, error: 'No videos returned from YouTube search. Check API key.' };
    }

    for (const v of rankedVideos) {
      await prisma.learningVideo.upsert({
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
          updatedAt: new Date(),
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
    }

    revalidatePath(`/learn`);
    return { success: true, count: rankedVideos.length };
  } catch (error) {
    console.error('refreshTopicVideosAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Manually paste YouTube URL or ID to add a curated educational video.
 */
export async function saveCuratedVideoAction(params: {
  topicId?: string;
  chapterId: string;
  youtubeUrlOrId: string;
  titleOverride?: string;
  language?: string;
  isRecommended?: boolean;
}) {
  await requireAdmin();

  try {
    const { topicId, chapterId, youtubeUrlOrId, titleOverride, language, isRecommended } = params;
    const videoId = extractYouTubeVideoId(youtubeUrlOrId);

    if (!videoId) {
      return { success: false, error: 'Invalid YouTube URL or Video ID. Please check the link.' };
    }

    const metadata = await fetchSingleVideoMetadata(videoId);
    if (!metadata) {
      return { success: false, error: 'Unable to retrieve video information.' };
    }

    const video = await prisma.learningVideo.upsert({
      where: { youtubeVideoId: videoId },
      update: {
        topicId: topicId || null,
        chapterId,
        title: titleOverride || metadata.title,
        channelName: metadata.channelName,
        thumbnailUrl: metadata.thumbnailUrl,
        description: metadata.description,
        duration: metadata.duration,
        durationSeconds: metadata.durationSeconds,
        language: language || 'Hindi/English',
        isCurated: true,
        isApproved: true,
        isRecommended: isRecommended ?? true,
        relevanceScore: 95.0,
        qualityScore: 98.0,
      },
      create: {
        topicId: topicId || null,
        chapterId,
        youtubeVideoId: videoId,
        title: titleOverride || metadata.title,
        channelName: metadata.channelName,
        thumbnailUrl: metadata.thumbnailUrl,
        description: metadata.description,
        duration: metadata.duration,
        durationSeconds: metadata.durationSeconds,
        language: language || 'Hindi/English',
        isCurated: true,
        isApproved: true,
        isRecommended: isRecommended ?? true,
        relevanceScore: 95.0,
        qualityScore: 98.0,
      },
    });

    revalidatePath(`/learn`);
    return { success: true, video };
  } catch (error) {
    console.error('saveCuratedVideoAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Toggle video approval or featured/recommended status.
 */
export async function toggleVideoStatusAction(
  videoId: string,
  updates: { isApproved?: boolean; isRecommended?: boolean }
) {
  await requireAdmin();

  try {
    const video = await prisma.learningVideo.update({
      where: { id: videoId },
      data: updates,
    });
    revalidatePath(`/learn`);
    return { success: true, video };
  } catch (error) {
    console.error('toggleVideoStatusAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Delete video from database.
 */
export async function deleteVideoAction(videoId: string) {
  await requireAdmin();

  try {
    await prisma.learningVideo.delete({
      where: { id: videoId },
    });
    revalidatePath(`/learn`);
    return { success: true };
  } catch (error) {
    console.error('deleteVideoAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Add or update trusted educational channel.
 */
export async function saveTrustedChannelAction(params: {
  channelName: string;
  channelId: string;
  subjects?: string[];
  classes?: number[];
  priority?: number;
  status?: string;
  notes?: string;
}) {
  await requireAdmin();

  try {
    const { channelName, channelId, subjects, classes, priority, status, notes } = params;
    const record = await prisma.trustedChannel.upsert({
      where: { channelId },
      update: {
        channelName,
        subjectsJson: JSON.stringify(subjects || []),
        classesJson: JSON.stringify(classes || []),
        priority: priority ?? 1,
        status: status || 'ACTIVE',
        notes,
      },
      create: {
        channelName,
        channelId,
        subjectsJson: JSON.stringify(subjects || []),
        classesJson: JSON.stringify(classes || []),
        priority: priority ?? 1,
        status: status || 'ACTIVE',
        notes,
      },
    });

    return { success: true, channel: record };
  } catch (error) {
    console.error('saveTrustedChannelAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Resolve user video report (dismiss, unpublish video, or mark resolved).
 */
export async function resolveVideoReportAction(
  reportId: string,
  action: 'DISMISS' | 'UNPUBLISH_VIDEO' | 'RESOLVED'
) {
  await requireAdmin();

  try {
    const report = await prisma.videoReport.findUnique({
      where: { id: reportId },
    });

    if (!report) return { success: false, error: 'Report not found' };

    if (action === 'UNPUBLISH_VIDEO') {
      await prisma.learningVideo.update({
        where: { id: report.videoId },
        data: { isApproved: false, isRecommended: false },
      });
    }

    const updated = await prisma.videoReport.update({
      where: { id: reportId },
      data: {
        status: action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED',
      },
    });

    return { success: true, report: updated };
  } catch (error) {
    console.error('resolveVideoReportAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Change chapter and/or topic mapping for a video.
 */
export async function updateVideoOrganizationAction(params: {
  videoId: string;
  chapterId: string;
  topicId?: string | null;
}) {
  await requireAdmin();

  try {
    const { videoId, chapterId, topicId } = params;
    const video = await prisma.learningVideo.update({
      where: { id: videoId },
      data: {
        chapterId,
        topicId: topicId || null,
      },
      include: {
        chapter: { include: { subject: { include: { class: true } } } },
        topic: true,
      },
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/learn');
    return { success: true, video };
  } catch (error) {
    console.error('updateVideoOrganizationAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Change video display order.
 */
export async function updateVideoOrderAction(params: {
  videoId: string;
  order: number;
}) {
  await requireAdmin();

  try {
    const { videoId, order } = params;
    const video = await prisma.learningVideo.update({
      where: { id: videoId },
      data: { order },
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/learn');
    return { success: true, video };
  } catch (error) {
    console.error('updateVideoOrderAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Admin action: Refresh YouTube data for a single video.
 */
export async function refreshSingleVideoMetadataAction(videoId: string) {
  await requireAdmin();

  try {
    const current = await prisma.learningVideo.findUnique({
      where: { id: videoId },
    });

    if (!current) return { success: false, error: 'Video not found' };

    const metadata = await fetchSingleVideoMetadata(current.youtubeVideoId);
    if (!metadata) {
      return { success: false, error: 'Failed to fetch fresh metadata from YouTube API.' };
    }

    const updated = await prisma.learningVideo.update({
      where: { id: videoId },
      data: {
        title: metadata.title,
        channelName: metadata.channelName,
        thumbnailUrl: metadata.thumbnailUrl,
        duration: metadata.duration,
        durationSeconds: metadata.durationSeconds,
        updatedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/admin');
    revalidatePath('/learn');
    return { success: true, video: updated };
  } catch (error) {
    console.error('refreshSingleVideoMetadataAction error:', (error as Error).message);
    return { success: false, error: (error as Error).message };
  }
}

