'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/atoms';
import { toggleSaveVideoAction } from '@/actions/learning';
import { ReportVideoModal } from './ReportVideoModal';
import {
  Play,
  Bookmark,
  Flag,
  Clock,
  CheckCircle2,
  Sparkles,
  Award,
} from 'lucide-react';

export interface VideoCardData {
  id: string;
  youtubeVideoId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  description?: string | null;
  duration?: string;
  durationSeconds?: number;
  language?: string;
  relevanceScore?: number;
  isRecommended?: boolean;
  isCurated?: boolean;
  viewCount?: number;
}

interface VideoCardProps {
  video: VideoCardData;
  lessonId?: string;
  chapterUrl?: string;
  isSavedInitial?: boolean;
  onWatch?: (video: VideoCardData) => void;
}

export function VideoCard({
  video,
  lessonId,
  chapterUrl,
  isSavedInitial = false,
  onWatch,
}: VideoCardProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [reportOpen, setReportOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaveLoading(true);
    try {
      const res = await toggleSaveVideoAction(video.id);
      if (res.success && res.isSaved !== undefined) {
        setIsSaved(res.isSaved);
      }
    } catch {
      // ignore
    } finally {
      setSaveLoading(false);
    }
  };

  const handleOpenReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setReportOpen(true);
  };

  const watchHref = lessonId
    ? `/learn/lesson/${lessonId}?v=${video.youtubeVideoId}`
    : chapterUrl
    ? `${chapterUrl}?v=${video.youtubeVideoId}`
    : `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;

  return (
    <>
      <div className="bg-white rounded-[16px] border border-[#E2E8E0] overflow-hidden card-interactive flex flex-col justify-between group shadow-xs">
        <div>
          {/* Video Thumbnail Header */}
          <div className="relative aspect-video w-full bg-[#1F2937] overflow-hidden">
            <img
              src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover img-interactive transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Play Overlay Glow */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 text-[#18261E] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            {/* Badges on Thumbnail */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
              {video.isRecommended && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EE] text-[#1B4D2F] border border-[#C6E6CD] shadow-2xs">
                  <Sparkles className="w-3 h-3 text-[#2E7D4E]" />
                  <span>Recommended</span>
                </span>
              )}
              {video.isCurated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF9ED] text-[#8C6013] border border-[#FDE5A9] shadow-2xs">
                  <Award className="w-3 h-3" />
                  <span>Curated</span>
                </span>
              )}
            </div>

            {/* Duration pill in bottom right */}
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-[6px] bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              <span>{video.duration || '15m'}</span>
            </div>

            {/* Language badge in bottom left */}
            {video.language && (
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[6px] bg-[#18261E]/80 text-white text-[10px] font-medium">
                {video.language}
              </div>
            )}
          </div>

          {/* Card Content */}
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-bold text-[#18261E] line-clamp-2 leading-snug group-hover:text-[#2E7D4E] transition-colors">
              {video.title}
            </h3>

            <div className="flex items-center justify-between text-xs text-[#4E5C53] pt-1">
              <span className="font-medium truncate max-w-[170px]" title={video.channelName}>
                {video.channelName}
              </span>
              {video.relevanceScore && (
                <span className="text-[10px] font-semibold text-[#2E7D4E] bg-[#EBF5EE] px-1.5 py-0.5 rounded">
                  {Math.round(video.relevanceScore)}% match
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-[#E2E8E0]/60 mt-3 pt-3">
          {onWatch ? (
            <Button
              size="sm"
              className="w-full bg-[#2E7D4E] hover:bg-[#24663F] text-white text-xs font-semibold py-1.5"
              onClick={() => onWatch(video)}
            >
              <Play className="w-3.5 h-3.5 mr-1" />
              <span>Watch Lesson</span>
            </Button>
          ) : (
            <Link href={watchHref} className="w-full">
              <Button
                size="sm"
                className="w-full bg-[#2E7D4E] hover:bg-[#24663F] text-white text-xs font-semibold py-1.5"
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                <span>Watch Lesson</span>
              </Button>
            </Link>
          )}

          {/* Save / Bookmark */}
          <button
            onClick={handleToggleSave}
            disabled={saveLoading}
            title={isSaved ? 'Saved to bookmarks' : 'Save lesson'}
            className={`p-2 rounded-[10px] border transition-all ${
              isSaved
                ? 'bg-[#EBF5EE] border-[#C6E6CD] text-[#1B4D2F]'
                : 'bg-[#F4F7F4] border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E] hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Report Button */}
          <button
            onClick={handleOpenReport}
            title="Report video"
            className="p-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#4E5C53] hover:text-[#991B1B] hover:bg-[#FEF2F2] transition-colors"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ReportVideoModal
        videoId={video.id}
        videoTitle={video.title}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
      />
    </>
  );
}
