'use client';

import React, { useState, useTransition } from 'react';
import { VideoCard, VideoCardData } from './VideoCard';
import { getTopicVideosAction } from '@/actions/learning';
import { Button } from '@/components/ui/atoms';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  FileText,
  HelpCircle,
  Award,
  Filter,
  Play,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface TopicData {
  id: string;
  name: string;
  order: number;
  description?: string | null;
  videos: VideoCardData[];
}

interface ChapterTopicViewProps {
  chapter: {
    id: string;
    chapterNumber: number;
    title: string;
    description?: string | null;
    subject: {
      name: string;
      class: {
        classNumber: number;
      };
    };
    notes: any[];
    questions: any[];
    quizzes: any[];
    lessons: any[];
  };
  initialTopics: TopicData[];
  initialVideos: VideoCardData[];
  savedVideoIds: string[];
}

export function ChapterTopicView({
  chapter,
  initialTopics,
  initialVideos,
  savedVideoIds,
}: ChapterTopicViewProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopics[0]?.id || 'all'
  );
  const [languageFilter, setLanguageFilter] = useState<'all' | 'Hindi' | 'English'>('all');
  const [videos, setVideos] = useState<VideoCardData[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoCardData | null>(
    initialVideos.find((v) => v.isRecommended) || initialVideos[0] || null
  );

  const classNumber = chapter.subject.class.classNumber;
  const subjectName = chapter.subject.name;

  // Handle topic change
  const handleTopicSelect = async (topicId: string) => {
    setSelectedTopicId(topicId);
    setIsLoading(true);

    try {
      const res = await getTopicVideosAction({
        topicId: topicId === 'all' ? undefined : topicId,
        chapterId: chapter.id,
        languagePreference: languageFilter,
      });

      if (res.success && res.videos) {
        setVideos(res.videos as any);
        if (res.videos.length > 0) {
          setActiveVideo((res.videos[0] as any) || null);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Handle language filter
  const handleLanguageChange = async (lang: 'all' | 'Hindi' | 'English') => {
    setLanguageFilter(lang);
    setIsLoading(true);

    try {
      const res = await getTopicVideosAction({
        topicId: selectedTopicId === 'all' ? undefined : selectedTopicId,
        chapterId: chapter.id,
        languagePreference: lang,
      });

      if (res.success && res.videos) {
        setVideos(res.videos as any);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered videos based on language
  const displayedVideos = videos.filter((v) => {
    if (languageFilter === 'all') return true;
    return v.language?.toLowerCase().includes(languageFilter.toLowerCase());
  });

  const recommendedVideos = displayedVideos.filter((v) => v.isRecommended);
  const otherVideos = displayedVideos.filter((v) => !v.isRecommended);

  return (
    <div className="space-y-8">
      {/* 1. TOPIC NAVIGATION SELECTOR */}
      <div className="bg-white p-5 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8E0]/60 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D4E]">
              Curriculum Sequence
            </span>
            <h2 className="text-base font-bold text-[#18261E]">
              Select Chapter Topic / Concept
            </h2>
          </div>

          {/* Language filter pills */}
          <div className="flex items-center gap-1.5 bg-[#F4F7F4] p-1 rounded-[10px] border border-[#E2E8E0] self-start sm:self-auto">
            <span className="text-[10px] text-[#4E5C53] font-semibold px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Lang:
            </span>
            {(['all', 'Hindi', 'English'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-[8px] text-xs font-semibold transition-all ${
                  languageFilter === lang
                    ? 'bg-[#2E7D4E] text-white shadow-2xs'
                    : 'text-[#4E5C53] hover:text-[#18261E] hover:bg-white'
                }`}
              >
                {lang === 'all' ? 'All' : lang}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {initialTopics.map((topic, idx) => {
            const isSelected = selectedTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-xs font-bold shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-[#EBF5EE] border-[#2E7D4E] text-[#1B4D2F] shadow-xs'
                    : 'bg-[#F4F7F4] border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E] hover:border-[#D1CDBC]'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isSelected ? 'bg-[#2E7D4E] text-white' : 'bg-white text-[#4E5C53] border border-[#E2E8E0]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{topic.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ACTIVE VIDEO PLAYER THEATER (If selected) */}
      {activeVideo && (
        <div className="bg-white rounded-[18px] border border-[#E2E8E0] overflow-hidden shadow-xs space-y-4">
          <div className="relative aspect-video w-full max-h-[480px] bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeVideoId}?autoplay=0&rel=0&modestbranding=1`}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="p-6 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                {activeVideo.isRecommended && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EE] text-[#1B4D2F]">
                    <Sparkles className="w-3 h-3 text-[#2E7D4E]" /> Recommended Channel
                  </span>
                )}
                <span className="text-xs text-[#4E5C53] font-medium">{activeVideo.channelName}</span>
                <span className="text-xs text-[#4E5C53]">•</span>
                <span className="text-xs text-[#4E5C53] font-medium">{activeVideo.duration}</span>
              </div>
              <h3 className="text-lg font-bold text-[#18261E]">{activeVideo.title}</h3>
            </div>

            {/* Quick action to Lesson Hub */}
            {chapter.lessons[0] && (
              <Link href={`/learn/lesson/${chapter.lessons[0].id}?v=${activeVideo.youtubeVideoId}`}>
                <Button size="sm" className="bg-[#2E7D4E] hover:bg-[#24663F] text-white shrink-0 font-semibold">
                  <span>Open Full Lesson & Notes</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 3. RECOMMENDED YOUTUBE VIDEOS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[#EBF5EE] text-[#2E7D4E] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#18261E]">
                Recommended Videos
              </h2>
              <p className="text-xs text-[#4E5C53]">
                Curated and ranked by curriculum relevance, channel quality, and explanation clarity.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-[16px] border border-[#E2E8E0] p-4 space-y-3">
                <div className="aspect-video bg-[#E2E8E0]/50 rounded-[10px] animate-pulse" />
                <div className="h-4 bg-[#E2E8E0]/50 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#E2E8E0]/40 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : recommendedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                lessonId={chapter.lessons[0]?.id}
                isSavedInitial={savedVideoIds.includes(video.id)}
                onWatch={(v) => {
                  setActiveVideo(v);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[16px] border border-[#E2E8E0] p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#18261E]">Video status: Not available yet</h3>
              <p className="text-xs text-[#4E5C53] max-w-md mx-auto leading-relaxed">
                This chapter is part of the official 2026–27 NCERT curriculum. Magnet Brains video lessons are being prepared and will appear here once verified. In the meantime, you can review the chapter notes and practice questions below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. MORE VIDEOS (Curriculum Discoveries) */}
      {otherVideos.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#E2E8E0]">
          <h3 className="text-base font-bold text-[#18261E]">More Curriculum Videos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                lessonId={chapter.lessons[0]?.id}
                isSavedInitial={savedVideoIds.includes(video.id)}
                onWatch={(v) => {
                  setActiveVideo(v);
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. CHAPTER RESOURCES: NOTES, PRACTICE, QUIZZES */}
      <div className="bg-[#F4F7F4] rounded-[16px] border border-[#E2E8E0] p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#18261E]">Chapter Learning Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-[12px] border border-[#E2E8E0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EEF3F8] text-[#3B82F6] flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#18261E]">Revision Notes</h4>
              <p className="text-[11px] text-[#4E5C53]">{chapter.notes.length} comprehensive sets</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[12px] border border-[#E2E8E0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#18261E]">Practice Questions</h4>
              <p className="text-[11px] text-[#4E5C53]">{chapter.questions.length} solved examples</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-[12px] border border-[#E2E8E0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#FEF9ED] text-[#8C6013] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#18261E]">Mastery Quiz</h4>
              <p className="text-[11px] text-[#4E5C53]">10-Mark Assessment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
