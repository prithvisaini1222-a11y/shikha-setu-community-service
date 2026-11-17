import { CurriculumQuery, VideoScoreBreakdown, RankedVideo } from './types';

export interface RankingWeights {
  topicRelevance: number;     // 40
  curriculumMatch: number;    // 20
  channelQuality: number;     // 15
  engagement: number;         // 10
  languagePreference: number; // 10
  freshness: number;          // 5
}

export const DEFAULT_WEIGHTS: RankingWeights = {
  topicRelevance: 40,
  curriculumMatch: 20,
  channelQuality: 15,
  engagement: 10,
  languagePreference: 10,
  freshness: 5,
};

// Known educational trusted channels with default quality boost
export const DEFAULT_TRUSTED_CHANNELS = [
  'Khan Academy',
  'Khan Academy India',
  'NCERT Official',
  'Magnet Brains',
  'Vedantu 6-8',
  'Vedantu 9&10',
  'Physics Wallah - Foundation',
  'Dear Sir',
  'Unacademy Class 8',
  'Unacademy Class 9 & 10',
  'Learn Fatafat',
  'BodhaGuru',
  'CrashCourse',
];

/**
 * Parses ISO 8601 duration (PT18M24S) into seconds and human-readable string (18m 24s)
 */
export function parseYouTubeDuration(durationStr: string): { duration: string; durationSeconds: number } {
  if (!durationStr || !durationStr.startsWith('PT')) {
    return { duration: '15m', durationSeconds: 900 };
  }

  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return { duration: '15m', durationSeconds: 900 };
  }

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const durationSeconds = hours * 3600 + minutes * 60 + seconds;
  let formatted = '';
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0 || hours > 0) formatted += `${minutes}m`;
  if (hours === 0 && seconds > 0) formatted += ` ${seconds}s`;

  return {
    duration: formatted.trim() || `${minutes}m`,
    durationSeconds,
  };
}

/**
 * Explainable Video Ranking Engine
 */
export function scoreAndRankVideo(
  video: {
    id: string;
    title: string;
    description: string;
    channelTitle: string;
    channelId?: string;
    publishedAt?: string;
    thumbnailUrl: string;
    durationStr?: string;
    viewCount?: number;
    likeCount?: number;
  },
  query: CurriculumQuery,
  trustedChannels: string[] = DEFAULT_TRUSTED_CHANNELS,
  weights: RankingWeights = DEFAULT_WEIGHTS
): RankedVideo {
  const reasons: string[] = [];
  const textCorpus = `${video.title} ${video.description}`.toLowerCase();
  const titleLower = video.title.toLowerCase();

  // 1. TOPIC RELEVANCE (max 40 pts)
  let topicRelevance = 0;
  const targetTopic = (query.topic || query.chapter).toLowerCase();
  const topicWords = targetTopic.split(/\s+/).filter((w) => w.length > 2);

  if (titleLower.includes(targetTopic)) {
    topicRelevance += 28;
    reasons.push('Title contains exact topic name (+28)');
  } else {
    // Proportional word matching
    const matchedWords = topicWords.filter((w) => textCorpus.includes(w));
    const ratio = topicWords.length > 0 ? matchedWords.length / topicWords.length : 0;
    const pts = Math.round(ratio * 20);
    topicRelevance += pts;
    if (pts > 0) reasons.push(`Matches ${matchedWords.length}/${topicWords.length} topic keywords (+${pts})`);
  }

  // Bonus for dedicated concept vs generic full course
  if (titleLower.includes('introduction') || titleLower.includes('concept') || titleLower.includes('solved examples')) {
    topicRelevance += 6;
    reasons.push('Focuses on specific pedagogical concept (+6)');
  }
  if (titleLower.includes('full course') || titleLower.includes('marathon') || titleLower.includes('mega revision')) {
    topicRelevance -= 6;
    reasons.push('Penalty for overly broad multi-hour lecture (-6)');
  }
  topicRelevance = Math.max(0, Math.min(weights.topicRelevance, topicRelevance));

  // 2. CURRICULUM MATCH (max 20 pts)
  let curriculumMatch = 0;
  const classNum = query.className.replace(/[^0-9]/g, '');
  const classPatterns = [`class ${classNum}`, `grade ${classNum}`, `class-${classNum}`, `std ${classNum}`, `ncert class ${classNum}`];
  const hasExactClass = classPatterns.some((p) => textCorpus.includes(p));

  if (hasExactClass) {
    curriculumMatch += 14;
    reasons.push(`Explicitly matches Class ${classNum} curriculum (+14)`);
  } else {
    // Penalty if video is clearly for a DIFFERENT class (e.g. Class 12 when querying for Class 8)
    const otherClasses = [6, 7, 8, 9, 10, 11, 12].filter((n) => n.toString() !== classNum);
    const hasWrongClass = otherClasses.some((n) => textCorpus.includes(`class ${n}`) || textCorpus.includes(`grade ${n}`));
    if (hasWrongClass) {
      curriculumMatch -= 8;
      reasons.push('Contains references to a different class level (-8)');
    }
  }

  // CBSE / NCERT / State Board keyword boost
  if (textCorpus.includes('ncert') || textCorpus.includes('cbse')) {
    curriculumMatch += 6;
    reasons.push('NCERT / CBSE standard syllabus match (+6)');
  }
  curriculumMatch = Math.max(0, Math.min(weights.curriculumMatch, curriculumMatch));

  // 3. CHANNEL QUALITY (max 15 pts)
  let channelQuality = 0;
  const isTrusted = trustedChannels.some((tc) =>
    video.channelTitle.toLowerCase().includes(tc.toLowerCase())
  );
  if (isTrusted) {
    channelQuality = weights.channelQuality;
    reasons.push(`Verified educational channel: ${video.channelTitle} (+${weights.channelQuality})`);
  } else {
    channelQuality = 7; // Neutral baseline for unverified educational channels
  }

  // 4. ENGAGEMENT (max 10 pts)
  let engagement = 0;
  const views = video.viewCount || 0;
  if (views > 100000) {
    engagement = 10;
    reasons.push('High student engagement (100k+ views) (+10)');
  } else if (views > 20000) {
    engagement = 8;
  } else if (views > 5000) {
    engagement = 6;
  } else {
    engagement = 4;
  }

  // 5. LANGUAGE PREFERENCE (max 10 pts)
  let languagePreference = 8; // Default good score
  let detectedLanguage = 'Hindi/English';
  if (textCorpus.includes('in hindi') || textCorpus.includes('hindi me') || /[\u0900-\u097F]/.test(video.title)) {
    detectedLanguage = 'Hindi';
  } else if (textCorpus.includes('in english') || textCorpus.includes('english medium')) {
    detectedLanguage = 'English';
  }

  if (query.language && query.language !== 'all') {
    if (detectedLanguage.toLowerCase().includes(query.language.toLowerCase())) {
      languagePreference = weights.languagePreference;
      reasons.push(`Matches requested language: ${query.language} (+10)`);
    } else {
      languagePreference = 5;
    }
  }

  // 6. FRESHNESS (max 5 pts)
  let freshness = 3;
  if (video.publishedAt) {
    const pubYear = new Date(video.publishedAt).getFullYear();
    const currentYear = new Date().getFullYear();
    if (currentYear - pubYear <= 2) {
      freshness = 5;
      reasons.push('Recently published/updated educational content (+5)');
    } else if (currentYear - pubYear <= 5) {
      freshness = 4;
    } else {
      freshness = 2;
    }
  }

  const totalScore = Math.min(
    100,
    topicRelevance + curriculumMatch + channelQuality + engagement + languagePreference + freshness
  );

  const durationData = parseYouTubeDuration(video.durationStr || '');

  // Quality Rules Filter:
  // Reject shorts (< 60s) or extremely short videos
  const isApproved = durationData.durationSeconds >= 60;
  // Recommended threshold >= 72
  const isRecommended = totalScore >= 72 && isApproved;

  const scoreBreakdown: VideoScoreBreakdown = {
    topicRelevance,
    curriculumMatch,
    channelQuality,
    engagement,
    languagePreference,
    freshness,
    totalScore,
    reasons,
  };

  return {
    youtubeVideoId: video.id,
    title: video.title,
    channelName: video.channelTitle,
    channelId: video.channelId,
    thumbnailUrl: video.thumbnailUrl,
    description: video.description,
    publishedAt: video.publishedAt ? new Date(video.publishedAt) : undefined,
    language: detectedLanguage,
    duration: durationData.duration,
    durationSeconds: durationData.durationSeconds,
    relevanceScore: totalScore,
    qualityScore: Math.round((topicRelevance + curriculumMatch + channelQuality) * (100 / 75)),
    scoreBreakdown,
    isRecommended,
    isApproved,
    viewCount: views,
    likeCount: video.likeCount || 0,
  };
}
