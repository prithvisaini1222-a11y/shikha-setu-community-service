export interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface YouTubeSearchItem {
  id: {
    kind: string;
    videoId: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default?: YouTubeThumbnail;
      medium?: YouTubeThumbnail;
      high?: YouTubeThumbnail;
      standard?: YouTubeThumbnail;
      maxres?: YouTubeThumbnail;
    };
    channelTitle: string;
    liveBroadcastContent?: string;
  };
}

export interface YouTubeVideoDetails {
  id: string;
  contentDetails: {
    duration: string; // ISO 8601, e.g. PT15M33S
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
  };
}

export interface CurriculumQuery {
  className: string;      // e.g. "Class 8"
  subject: string;        // e.g. "Mathematics"
  chapter: string;        // e.g. "Linear Equations in One Variable"
  topic?: string;         // e.g. "Solving Equations Having Variables on Both Sides"
  language?: 'all' | 'Hindi' | 'English' | 'Hinglish';
  maxResults?: number;
}

export interface VideoScoreBreakdown {
  topicRelevance: number;     // max 40
  curriculumMatch: number;    // max 20
  channelQuality: number;     // max 15
  engagement: number;         // max 10
  languagePreference: number; // max 10
  freshness: number;          // max 5
  totalScore: number;         // max 100
  reasons: string[];
}

export interface RankedVideo {
  youtubeVideoId: string;
  title: string;
  channelName: string;
  channelId?: string;
  thumbnailUrl: string;
  description: string;
  publishedAt?: Date;
  language: string;
  duration: string;
  durationSeconds: number;
  relevanceScore: number;
  qualityScore: number;
  scoreBreakdown: VideoScoreBreakdown;
  isRecommended: boolean;
  isApproved: boolean;
  viewCount: number;
  likeCount: number;
}
