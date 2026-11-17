'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchLearningHubAction } from '@/actions/learning';
import { Search, BookOpen, Sparkles, Video, X, ArrowRight, Loader2 } from 'lucide-react';

export function LearningSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ chapters: any[]; topics: any[]; videos: any[] }>({
    chapters: [],
    topics: [],
    videos: [],
  });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ chapters: [], topics: [], videos: [] });
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchLearningHubAction(query);
        setResults(res);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const totalResults = results.chapters.length + results.topics.length + results.videos.length;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4E5C53]">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder="Search subjects, chapters, topics (e.g. 'Linear Equations', 'Rational Numbers', 'Science')..."
          className="w-full pl-10 pr-10 py-3 rounded-[14px] bg-white border border-[#E2E8E0] text-xs sm:text-sm text-[#18261E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 transition-all shadow-xs"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4E5C53] hover:text-[#18261E]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Instant Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-[16px] border border-[#E2E8E0] shadow-xl p-4 z-40 max-h-[420px] overflow-y-auto space-y-4 dropdown-anim">
          {loading ? (
            <div className="py-8 flex items-center justify-center gap-2 text-xs text-[#4E5C53]">
              <Loader2 className="w-4 h-4 animate-spin text-[#2E7D4E]" />
              <span>Searching curriculum & videos...</span>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-6 text-center text-xs text-[#4E5C53] space-y-1">
              <p className="font-semibold text-[#18261E]">No matching lessons found for "{query}"</p>
              <p>Try searching for core topics like "algebra", "equations", "motion", or "light".</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chapters match */}
              {results.chapters.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D4E] block">
                    Chapters ({results.chapters.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.chapters.map((ch: any) => {
                      const classNum = ch.subject?.class?.classNumber || 8;
                      const subSlug = ch.subject?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'mathematics';
                      return (
                        <Link
                          key={ch.id}
                          href={`/learn/${classNum}/${subSlug}/${ch.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-[10px] hover:bg-[#F8FAF8] transition-colors border border-transparent hover:border-[#E2E8E0]"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-[#EBF5EE] text-[#1B4D2F] flex items-center justify-center text-[10px] font-bold">
                              {ch.chapterNumber}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-[#18261E]">{ch.title}</h4>
                              <p className="text-[10px] text-[#4E5C53]">
                                Class {classNum} • {ch.subject?.name}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#4E5C53]" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Videos match */}
              {results.videos.length > 0 && (
                <div className="space-y-2 border-t border-[#E2E8E0]/60 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3B82F6] block">
                    Recommended Videos ({results.videos.length})
                  </span>
                  <div className="space-y-1.5">
                    {results.videos.map((vid: any) => {
                      const classNum = vid.chapter?.subject?.class?.classNumber || 8;
                      const subSlug = vid.chapter?.subject?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'mathematics';
                      return (
                        <Link
                          key={vid.id}
                          href={vid.chapterId ? `/learn/${classNum}/${subSlug}/${vid.chapterId}?v=${vid.youtubeVideoId}` : `/learn/8/mathematics`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2.5 rounded-[10px] hover:bg-[#F8FAF8] transition-colors border border-transparent hover:border-[#E2E8E0]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 aspect-video rounded-[6px] overflow-hidden bg-black shrink-0 relative">
                              <img
                                src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-[#18261E] truncate max-w-[320px]">
                                {vid.title}
                              </h4>
                              <p className="text-[10px] text-[#4E5C53]">
                                {vid.channelName} • {vid.duration || '15m'}
                              </p>
                            </div>
                          </div>
                          <Sparkles className="w-3.5 h-3.5 text-[#2E7D4E] shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
