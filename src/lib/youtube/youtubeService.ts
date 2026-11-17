import { CurriculumQuery, RankedVideo, YouTubeSearchItem, YouTubeVideoDetails } from './types';
import { scoreAndRankVideo, DEFAULT_TRUSTED_CHANNELS } from './rankingEngine';
import { prisma } from '@/lib/db/prisma';

/**
 * Extracts a clean 11-character YouTube video ID from various URL formats or returns the input if already an ID.
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already standard 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard watch URLs: https://www.youtube.com/watch?v=XYZ
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  return null;
}

/**
 * Server-side YouTube Data API v3 integration with curriculum search & explainable ranking.
 */
export async function searchEducationalVideos(query: CurriculumQuery): Promise<RankedVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'your_youtube_api_v3_key_here') {
    console.warn('[YouTubeService] YOUTUBE_API_KEY not configured. Returning empty results for offline fallback.');
    return [];
  }

  try {
    // 1. Build curriculum-aware query
    const targetTopic = query.topic ? `"${query.topic}"` : '';
    const langKeyword = query.language === 'Hindi' ? 'Hindi' : query.language === 'English' ? 'English' : '';
    const searchQuery = `${query.className} ${query.subject} "${query.chapter}" ${targetTopic} CBSE NCERT ${langKeyword}`.trim();

    const maxResults = query.maxResults || 8;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&type=video&videoEmbeddable=true&safeSearch=strict&maxResults=${maxResults}&key=${apiKey}`;

    const searchRes = await fetch(searchUrl, { next: { revalidate: 3600 } });
    if (!searchRes.ok) {
      const errText = await searchRes.text();
      console.error(`[YouTubeService] YouTube search API error (${searchRes.status}):`, errText);
      return [];
    }

    const searchData = await searchRes.json();
    const items: YouTubeSearchItem[] = searchData.items || [];
    if (items.length === 0) return [];

    const videoIds = items.map((i) => i.id.videoId).filter(Boolean);

    // 2. Fetch video details (durations and statistics)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(
      ','
    )}&key=${apiKey}`;

    const detailsRes = await fetch(detailsUrl, { next: { revalidate: 3600 } });
    let detailsMap: Record<string, YouTubeVideoDetails> = {};

    if (detailsRes.ok) {
      const detailsData = await detailsRes.json();
      const detailsItems: YouTubeVideoDetails[] = detailsData.items || [];
      detailsMap = detailsItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, YouTubeVideoDetails>);
    }

    // 3. Retrieve trusted channels from DB or default
    let trustedChannels = DEFAULT_TRUSTED_CHANNELS;
    try {
      const dbChannels = await prisma.trustedChannel.findMany({
        where: { status: 'ACTIVE' },
        select: { channelName: true },
      });
      if (dbChannels.length > 0) {
        trustedChannels = Array.from(new Set([...DEFAULT_TRUSTED_CHANNELS, ...dbChannels.map((c) => c.channelName)]));
      }
    } catch {
      // Use defaults if db is temporarily unreachable
    }

    // 4. Rank and score each video
    const rankedVideos: RankedVideo[] = items.map((item) => {
      const vid = item.id.videoId;
      const details = detailsMap[vid];
      const viewCount = details?.statistics?.viewCount ? parseInt(details.statistics.viewCount, 10) : 0;
      const likeCount = details?.statistics?.likeCount ? parseInt(details.statistics.likeCount, 10) : 0;
      const durationStr = details?.contentDetails?.duration || 'PT15M';

      const thumb =
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url ||
        `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;

      return scoreAndRankVideo(
        {
          id: vid,
          title: item.snippet.title,
          description: item.snippet.description,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          publishedAt: item.snippet.publishedAt,
          thumbnailUrl: thumb,
          durationStr,
          viewCount,
          likeCount,
        },
        query,
        trustedChannels
      );
    });

    // 5. Sort by relevanceScore descending
    rankedVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return rankedVideos;
  } catch (error) {
    console.error('[YouTubeService] searchEducationalVideos error:', (error as Error).message);
    return [];
  }
}

/**
 * Fetches metadata for a single YouTube video ID or URL (used by Admin manual curation).
 * Supports both YouTube API v3 (if key configured) and unauthenticated oEmbed fallback.
 */
export async function fetchSingleVideoMetadata(urlOrId: string): Promise<{
  videoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  description: string;
  duration: string;
  durationSeconds: number;
} | null> {
  const videoId = extractYouTubeVideoId(urlOrId);
  if (!videoId) return null;

  const apiKey = process.env.YOUTUBE_API_KEY;

  // Option A: Use YouTube Data API v3 if key is present
  if (apiKey && apiKey !== 'your_youtube_api_v3_key_here') {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
          const { duration, durationSeconds } = (await import('./rankingEngine')).parseYouTubeDuration(
            item.contentDetails?.duration || 'PT15M'
          );
          let channelTitle = item.snippet.channelTitle || '';
          if (/magnet\s*brains/i.test(channelTitle)) {
            channelTitle = 'Magnet Brains';
          }
          return {
            videoId,
            title: item.snippet.title,
            channelName: channelTitle || 'Educational Channel',
            thumbnailUrl:
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            description: item.snippet.description || '',
            duration,
            durationSeconds,
          };
        }
      }
    } catch (e) {
      console.error('[YouTubeService] fetchSingleVideoMetadata API error:', (e as Error).message);
    }
  }

  // Option B: Fallback to YouTube oEmbed (unauthenticated, public)
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oEmbedUrl);
    if (res.ok) {
      const oembed = await res.json();
      let authorName = oembed.author_name || '';
      if (/magnet\s*brains/i.test(authorName)) {
        authorName = 'Magnet Brains';
      }
      return {
        videoId,
        title: oembed.title || 'Educational Lesson',
        channelName: authorName || 'Educational Channel',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        description: 'Curated curriculum video for ShikshaSetu learning.',
        duration: '18m',
        durationSeconds: 1080,
      };
    }
  } catch (e) {
    console.error('[YouTubeService] oEmbed fallback error:', (e as Error).message);
  }

  // Final fallback
  return {
    videoId,
    title: 'Curated Educational Video',
    channelName: 'Verified Educational Channel',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    description: 'Curated curriculum lesson for ShikshaSetu.',
    duration: '15m',
    durationSeconds: 900,
  };
}
