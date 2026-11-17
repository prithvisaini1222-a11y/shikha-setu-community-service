'use client';

import React, { useState, useTransition } from 'react';
import {
  saveCuratedVideoAction,
  refreshTopicVideosAction,
  toggleVideoStatusAction,
  deleteVideoAction,
  saveTrustedChannelAction,
  resolveVideoReportAction,
  updateVideoOrganizationAction,
  updateVideoOrderAction,
  refreshSingleVideoMetadataAction,
} from '@/actions/adminContent';
import { Button } from '@/components/ui/atoms';
import {
  Video,
  Sparkles,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Award,
  ExternalLink,
  Search,
  Filter,
  Edit,
  Layers,
  ArrowUpDown,
  BookOpen,
  X,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminContentManagementProps {
  chapters: any[];
  videos: any[];
  trustedChannels: any[];
  videoReports: any[];
}

export function AdminContentManagement({
  chapters,
  videos: initialVideos,
  trustedChannels: initialTrustedChannels,
  videoReports: initialReports,
}: AdminContentManagementProps) {
  const [subTab, setSubTab] = useState<'videos' | 'addVideo' | 'channels' | 'reports'>('videos');
  const [videos, setVideos] = useState<any[]>(initialVideos);
  const [trustedChannels, setTrustedChannels] = useState<any[]>(initialTrustedChannels);
  const [videoReports, setVideoReports] = useState<any[]>(initialReports);
  const [searchFilter, setSearchFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('6');

  // Add video form state
  const [selectedChapterId, setSelectedChapterId] = useState(chapters[0]?.id || '');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [titleOverride, setTitleOverride] = useState('');
  const [isRecommended, setIsRecommended] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [addMessage, setAddMessage] = useState<string | null>(null);

  // Edit organization / order modal state
  const [editingVideo, setEditingVideo] = useState<any | null>(null);
  const [editChapterId, setEditChapterId] = useState('');
  const [editTopicId, setEditTopicId] = useState('');
  const [editOrder, setEditOrder] = useState<number>(1);
  const [editLoading, setEditLoading] = useState(false);

  // Refresh state
  const [refreshLoadingId, setRefreshLoadingId] = useState<string | null>(null);
  const [singleRefreshId, setSingleRefreshId] = useState<string | null>(null);

  // Add trusted channel state
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelId, setNewChannelId] = useState('');
  const [channelPriority, setChannelPriority] = useState(1);
  const [channelLoading, setChannelLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  // Handle manual video addition
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInput || !selectedChapterId) return;

    setAddLoading(true);
    setAddMessage(null);

    try {
      const res = await saveCuratedVideoAction({
        chapterId: selectedChapterId,
        youtubeUrlOrId: youtubeInput,
        titleOverride: titleOverride || undefined,
        isRecommended,
      });

      if (res.success && res.video) {
        setVideos([res.video, ...videos]);
        setYoutubeInput('');
        setTitleOverride('');
        setAddMessage('Video successfully curated and added to curriculum!');
        confetti({ particleCount: 40, spread: 50 });
      } else {
        setAddMessage(res.error || 'Failed to add video.');
      }
    } catch (err) {
      setAddMessage((err as Error).message);
    } finally {
      setAddLoading(false);
    }
  };

  // Handle refresh recommendations for a chapter
  const handleRefreshChapter = async (chapterId: string) => {
    setRefreshLoadingId(chapterId);
    try {
      const res = await refreshTopicVideosAction({ chapterId });
      if (res.success) {
        confetti({ particleCount: 30, spread: 40 });
        alert(`Successfully refreshed! Discovered & ranked ${res.count} videos.`);
      } else {
        alert(res.error || 'Refresh failed. Verify YouTube API Key.');
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setRefreshLoadingId(null);
    }
  };

  // Refresh single video metadata
  const handleRefreshSingleVideo = async (videoId: string) => {
    setSingleRefreshId(videoId);
    try {
      const res = await refreshSingleVideoMetadataAction(videoId);
      if (res.success && res.video) {
        setVideos((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, ...res.video } : v))
        );
        alert('YouTube metadata successfully refreshed!');
      } else {
        alert(res.error || 'Could not refresh video metadata.');
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSingleRefreshId(null);
    }
  };

  // Toggle video recommendation or approval
  const handleToggleStatus = (videoId: string, updates: { isApproved?: boolean; isRecommended?: boolean }) => {
    startTransition(async () => {
      const res = await toggleVideoStatusAction(videoId, updates);
      if (res.success) {
        setVideos((prev) =>
          prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v))
        );
      }
    });
  };

  // Open Edit Organization Modal
  const openEditModal = (video: any) => {
    setEditingVideo(video);
    setEditChapterId(video.chapterId || '');
    setEditTopicId(video.topicId || '');
    setEditOrder(video.order || 1);
  };

  // Save Video Organization & Order Changes
  const handleSaveEdit = async () => {
    if (!editingVideo || !editChapterId) return;
    setEditLoading(true);

    try {
      const resOrg = await updateVideoOrganizationAction({
        videoId: editingVideo.id,
        chapterId: editChapterId,
        topicId: editTopicId || null,
      });

      const resOrder = await updateVideoOrderAction({
        videoId: editingVideo.id,
        order: editOrder,
      });

      if (resOrg.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === editingVideo.id
              ? {
                  ...v,
                  chapterId: editChapterId,
                  topicId: editTopicId || null,
                  order: editOrder,
                  chapter: resOrg.video?.chapter || v.chapter,
                  topic: resOrg.video?.topic || v.topic,
                }
              : v
          )
        );
        setEditingVideo(null);
      } else {
        alert(resOrg.error || 'Failed to update video mapping.');
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setEditLoading(false);
    }
  };

  // Delete video (Remove duplicate)
  const handleDeleteVideo = (videoId: string) => {
    if (!confirm('Are you sure you want to remove this video from curriculum recommendations?')) return;
    startTransition(async () => {
      const res = await deleteVideoAction(videoId);
      if (res.success) {
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
      }
    });
  };

  // Add trusted channel
  const handleAddChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName || !newChannelId) return;

    setChannelLoading(true);
    try {
      const res = await saveTrustedChannelAction({
        channelName: newChannelName,
        channelId: newChannelId,
        priority: channelPriority,
        status: 'ACTIVE',
      });
      if (res.success && res.channel) {
        setTrustedChannels([res.channel, ...trustedChannels]);
        setNewChannelName('');
        setNewChannelId('');
      }
    } finally {
      setChannelLoading(false);
    }
  };

  // Resolve moderation report
  const handleResolveReport = (reportId: string, action: 'DISMISS' | 'UNPUBLISH_VIDEO' | 'RESOLVED') => {
    startTransition(async () => {
      const res = await resolveVideoReportAction(reportId, action);
      if (res.success) {
        setVideoReports((prev) => prev.filter((r) => r.id !== reportId));
        if (action === 'UNPUBLISH_VIDEO') {
          const rep = videoReports.find((r) => r.id === reportId);
          if (rep) {
            setVideos((prev) =>
              prev.map((v) => (v.id === rep.videoId ? { ...v, isApproved: false, isRecommended: false } : v))
            );
          }
        }
      }
    });
  };

  // Unique subjects for filter
  const availableSubjects = Array.from(
    new Set(
      chapters
        .filter((c) => classFilter === 'ALL' || String(c.subject?.class?.classNumber) === classFilter)
        .map((c) => c.subject?.name)
        .filter(Boolean)
    )
  );

  const filteredVideos = videos.filter((v) => {
    const classNum = String(v.chapter?.subject?.class?.classNumber || '');
    const subjectName = v.chapter?.subject?.name || '';

    if (classFilter !== 'ALL' && classNum !== classFilter) return false;
    if (subjectFilter !== 'ALL' && subjectName !== subjectFilter) return false;

    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      v.title?.toLowerCase().includes(q) ||
      v.channelName?.toLowerCase().includes(q) ||
      v.chapter?.title?.toLowerCase().includes(q) ||
      v.topic?.name?.toLowerCase().includes(q) ||
      v.youtubeVideoId?.toLowerCase().includes(q)
    );
  });

  const selectedChapterForEdit = chapters.find((c) => c.id === editChapterId);

  return (
    <div className="space-y-6">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8E0] pb-3 overflow-x-auto">
        <button
          onClick={() => setSubTab('videos')}
          className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
            subTab === 'videos'
              ? 'bg-[#2E7D4E] text-white shadow-2xs'
              : 'bg-[#F4F7F4] text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
          }`}
        >
          Curriculum Videos ({videos.length})
        </button>

        <button
          onClick={() => setSubTab('addVideo')}
          className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'addVideo'
              ? 'bg-[#2E7D4E] text-white shadow-2xs'
              : 'bg-[#F4F7F4] text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Video by URL</span>
        </button>

        <button
          onClick={() => setSubTab('channels')}
          className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'channels'
              ? 'bg-[#2E7D4E] text-white shadow-2xs'
              : 'bg-[#F4F7F4] text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trusted Channels ({trustedChannels.length})</span>
        </button>

        <button
          onClick={() => setSubTab('reports')}
          className={`px-3.5 py-1.5 rounded-[10px] text-xs font-bold transition-all flex items-center gap-1.5 ${
            subTab === 'reports'
              ? 'bg-[#D97706] text-white shadow-2xs'
              : 'bg-[#F4F7F4] text-[#4E5C53] hover:text-[#18261E] border border-[#E2E8E0]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Video Reports ({videoReports.length})</span>
        </button>
      </div>

      {/* 1. CURRICULUM VIDEOS LIST TAB */}
      {subTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#4E5C53]" />
              <input
                type="text"
                placeholder="Search by title, chapter, topic, or video ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-[10px] border border-[#E2E8E0] bg-white focus:outline-none focus:border-[#2E7D4E]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#4E5C53] font-medium">Class:</span>
                <select
                  value={classFilter}
                  onChange={(e) => {
                    setClassFilter(e.target.value);
                    setSubjectFilter('ALL');
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-[8px] border border-[#E2E8E0] bg-white text-[#18261E] focus:outline-none"
                >
                  <option value="ALL">All Classes</option>
                  <option value="6">Class 6 (2026-27)</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#4E5C53] font-medium">Subject:</span>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-[8px] border border-[#E2E8E0] bg-white text-[#18261E] focus:outline-none"
                >
                  <option value="ALL">All Subjects ({availableSubjects.length})</option>
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-[#4E5C53] ml-2">
                Showing {filteredVideos.length} of {videos.length} videos
              </span>
            </div>
          </div>

          <div className="bg-white rounded-[16px] border border-[#E2E8E0] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F7F4] text-[#4E5C53] font-semibold border-b border-[#E2E8E0]">
                  <tr>
                    <th className="p-3.5">Video & Details</th>
                    <th className="p-3.5">Curriculum Placement</th>
                    <th className="p-3.5">Order</th>
                    <th className="p-3.5">Source & Year</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8E0]">
                  {filteredVideos.slice(0, 100).map((vid) => {
                    const classNum = vid.chapter?.subject?.class?.classNumber || 6;
                    const subjectName = vid.chapter?.subject?.name || 'Curriculum';
                    const bookName = vid.chapter?.subject?.bookName;

                    return (
                      <tr key={vid.id} className="hover:bg-[#F4F7F4] transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5 max-w-[280px]">
                            <div className="w-14 aspect-video rounded-[6px] overflow-hidden bg-black shrink-0 relative">
                              <img
                                src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`}
                                alt={vid.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#18261E] truncate" title={vid.title}>
                                {vid.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-[#4E5C53]">
                                <span>{vid.channelName}</span>
                                <span>•</span>
                                <span>{vid.duration || '15m'}</span>
                                <span>•</span>
                                <a
                                  href={`https://www.youtube.com/watch?v=${vid.youtubeVideoId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#2E7D4E] hover:underline flex items-center gap-0.5"
                                >
                                  <span>{vid.youtubeVideoId}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EBF5EE] text-[#1B4D2F]">
                              Class {classNum} • {subjectName} {bookName ? `(${bookName})` : ''}
                            </span>
                            <p className="text-[11px] text-[#18261E] font-medium truncate max-w-[200px]" title={vid.chapter?.title}>
                              Ch {vid.chapter?.chapterNumber}: {vid.chapter?.title}
                            </p>
                            {vid.topic && (
                              <p className="text-[10px] text-[#4E5C53] truncate max-w-[200px]" title={vid.topic.name}>
                                Topic: {vid.topic.name}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-[#18261E]">
                          #{vid.order || 1}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-block text-[10px] text-[#4E5C53]">
                            {vid.source || 'Magnet Brains'}
                          </span>
                          <span className="block text-[9px] text-[#86968B] font-mono">
                            {vid.academicYear || '2026-27'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {vid.isRecommended ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF5EE] text-[#1B4D2F]">
                                <Sparkles className="w-3 h-3" /> Recommended
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#4E5C53]">Standard</span>
                            )}
                            {vid.isApproved ? (
                              <span className="text-[10px] font-semibold text-[#1B4D2F]">Approved</span>
                            ) : (
                              <span className="text-[10px] font-semibold text-[#991B1B]">Unpublished</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                          {/* Edit / Move Organization */}
                          <button
                            onClick={() => openEditModal(vid)}
                            className="px-2 py-1 rounded-[6px] border border-[#E2E8E0] text-[11px] font-semibold hover:bg-white text-[#18261E]"
                            title="Change chapter, topic, or sequence order"
                          >
                            <Edit className="w-3 h-3 inline mr-1" />
                            Move/Order
                          </button>

                          {/* Feature / Unfeature */}
                          <button
                            onClick={() =>
                              handleToggleStatus(vid.id, { isRecommended: !vid.isRecommended })
                            }
                            className="px-2 py-1 rounded-[6px] border border-[#E2E8E0] text-[11px] font-semibold hover:bg-white text-[#18261E]"
                          >
                            {vid.isRecommended ? 'Unfeature' : 'Feature'}
                          </button>

                          {/* Approve / Reject */}
                          <button
                            onClick={() =>
                              handleToggleStatus(vid.id, { isApproved: !vid.isApproved })
                            }
                            className="px-2 py-1 rounded-[6px] border border-[#E2E8E0] text-[11px] font-semibold hover:bg-white text-[#18261E]"
                          >
                            {vid.isApproved ? 'Reject' : 'Approve'}
                          </button>

                          {/* Refresh YouTube metadata */}
                          <button
                            onClick={() => handleRefreshSingleVideo(vid.id)}
                            disabled={singleRefreshId === vid.id}
                            className="p-1 rounded-[6px] border border-[#E2E8E0] text-[#2E7D4E] hover:bg-[#EBF5EE] disabled:opacity-50"
                            title="Refresh YouTube metadata"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${singleRefreshId === vid.id ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Delete video */}
                          <button
                            onClick={() => handleDeleteVideo(vid.id)}
                            className="p-1 rounded-[6px] border border-[#E2E8E0] text-[#991B1B] hover:bg-[#FEF2F2]"
                            title="Delete video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredVideos.length > 100 && (
                <div className="p-3 text-center text-xs text-[#4E5C53] border-t border-[#E2E8E0]">
                  Showing first 100 of {filteredVideos.length} matching videos. Use the search or filters to narrow down.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT ORGANIZATION MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#18261E]">Edit Video Curriculum Placement</h3>
                <p className="text-[11px] text-[#4E5C53] truncate max-w-md">{editingVideo.title}</p>
              </div>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-1 rounded-full text-[#4E5C53] hover:bg-[#F4F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Target Chapter */}
              <div className="space-y-1">
                <label className="font-bold text-[#18261E] block">Target Chapter *</label>
                <select
                  value={editChapterId}
                  onChange={(e) => {
                    setEditChapterId(e.target.value);
                    setEditTopicId('');
                  }}
                  className="w-full p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] focus:outline-none"
                >
                  {chapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Class {ch.subject?.class?.classNumber} • {ch.subject?.name} — Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Topic */}
              <div className="space-y-1">
                <label className="font-bold text-[#18261E] block">Target Topic (Optional)</label>
                <select
                  value={editTopicId}
                  onChange={(e) => setEditTopicId(e.target.value)}
                  className="w-full p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] focus:outline-none"
                >
                  <option value="">-- No specific topic / Chapter Overview --</option>
                  {selectedChapterForEdit?.topics?.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Order: {t.order})
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Order Sequence */}
              <div className="space-y-1">
                <label className="font-bold text-[#18261E] block">Lesson Sequence Order (1, 2, 3...)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editOrder}
                  onChange={(e) => setEditOrder(parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8E0]">
              <button
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 text-xs font-semibold rounded-[10px] border border-[#E2E8E0] text-[#4E5C53] hover:bg-[#F4F7F4]"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                isLoading={editLoading}
                className="text-xs"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANUAL VIDEO ADDITION TAB */}
      {subTab === 'addVideo' && (
        <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E8E0] shadow-xs space-y-6 max-w-2xl">
          <div className="space-y-1 border-b border-[#E2E8E0]/60 pb-3">
            <h3 className="text-base font-bold text-[#18261E]">Manually Add Educational YouTube Video</h3>
            <p className="text-xs text-[#4E5C53]">
              Paste any YouTube URL or 11-character video ID. The system will extract metadata, associate it with a curriculum chapter/topic, and mark it approved.
            </p>
          </div>

          {addMessage && (
            <div className="p-3.5 rounded-[12px] bg-[#EBF5EE] border border-[#C6E6CD] text-[#1B4D2F] text-xs font-semibold">
              {addMessage}
            </div>
          )}

          <form onSubmit={handleAddVideo} className="space-y-4">
            {/* Magnet Brains Quick Presets (NCERT 2026-27 Books) */}
            <div className="p-3.5 bg-[#EEF3F8] border border-[#CFE0FA] rounded-[12px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#3765BC] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Magnet Brains Class 6 NCERT 2026–27 Presets
                </span>
                <span className="text-[10px] text-[#4E5C53]">Click to autofill URL & chapter</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Ganita Prakash Ch 1 (Patterns)', url: 'https://www.youtube.com/watch?v=n9E35nlfVKs', subject: 'Mathematics' },
                  { label: 'Curiosity Ch 1 (Science World)', url: 'https://www.youtube.com/watch?v=gT8h_E1G-1k', subject: 'Science' },
                  { label: 'Exploring Society Ch 1 (Earth)', url: 'https://www.youtube.com/watch?v=Yf148Xo6oZ4', subject: 'Social Science' },
                  { label: 'Poorvi Unit 1 (Fables)', url: 'https://www.youtube.com/watch?v=68RkG_tVf6g', subject: 'English' },
                  { label: 'Malhar Ch 1 (मातृभूमि)', url: 'https://www.youtube.com/watch?v=k5lqK8O09jU', subject: 'Hindi' },
                  { label: 'Deepakam Ch 1 (वर्णमाला)', url: 'https://www.youtube.com/watch?v=Kz69Zt2nLpY', subject: 'Sanskrit' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setYoutubeInput(preset.url);
                      const matchingCh = [...chapters].find(
                        (ch) => ch.subject?.class?.classNumber === 6 && ch.subject?.name.includes(preset.subject)
                      );
                      if (matchingCh) setSelectedChapterId(matchingCh.id);
                    }}
                    className="px-2.5 py-1 text-[10px] font-semibold bg-white rounded-md border border-[#CFE0FA] text-[#3765BC] hover:bg-[#3765BC] hover:text-white transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18261E] block">
                Target Curriculum Chapter *
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E]"
              >
                {[...chapters]
                  .sort((a, b) => {
                    const cA = a.subject?.class?.classNumber || 0;
                    const cB = b.subject?.class?.classNumber || 0;
                    if (cA !== cB) return cA - cB;
                    const sA = a.subject?.name || '';
                    const sB = b.subject?.name || '';
                    if (sA !== sB) return sA.localeCompare(sB);
                    return (a.chapterNumber || 0) - (b.chapterNumber || 0);
                  })
                  .map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Class {ch.subject?.class?.classNumber} • {ch.subject?.name} ({ch.subject?.bookName || 'NCERT'}) — Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18261E] block">
                YouTube Video URL or Video ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. https://www.youtube.com/watch?v=n9E35nlfVKs or n9E35nlfVKs"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#18261E] block">
                Custom Title Override (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank to use original YouTube title"
                value={titleOverride}
                onChange={(e) => setTitleOverride(e.target.value)}
                className="w-full text-xs p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E] focus:outline-none focus:border-[#2E7D4E]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isRecommendedCheck"
                checked={isRecommended}
                onChange={(e) => setIsRecommended(e.target.checked)}
                className="rounded text-[#2E7D4E] focus:ring-[#2E7D4E]"
              />
              <label htmlFor="isRecommendedCheck" className="text-xs text-[#18261E] font-medium">
                Feature as Recommended Lesson
              </label>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" isLoading={addLoading} className="w-full text-xs">
                Save & Map to Curriculum
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 3. TRUSTED CHANNELS TAB */}
      {subTab === 'channels' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[18px] border border-[#E2E8E0] shadow-xs space-y-4 max-w-xl">
            <div className="space-y-1 border-b border-[#E2E8E0]/60 pb-3">
              <h3 className="text-base font-bold text-[#18261E]">Add Trusted YouTube Channel</h3>
              <p className="text-xs text-[#4E5C53]">
                Videos from trusted channels receive priority in educational ranking and recommendation algorithm.
              </p>
            </div>

            <form onSubmit={handleAddChannel} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#18261E] block">Channel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Magnet Brains"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#18261E] block">YouTube Channel ID / Handle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @MagnetBrainsEducation or UC..."
                  value={newChannelId}
                  onChange={(e) => setNewChannelId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#18261E] block">Priority Weight</label>
                <select
                  value={channelPriority}
                  onChange={(e) => setChannelPriority(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#18261E]"
                >
                  <option value={1}>Standard Trusted (1)</option>
                  <option value={2}>High Quality Source (2)</option>
                  <option value={3}>Official State / NCERT Partner (3)</option>
                </select>
              </div>

              <Button type="submit" variant="primary" isLoading={channelLoading} className="text-xs">
                Add Channel to Whitelist
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-[16px] border border-[#E2E8E0] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7F4] text-[#4E5C53] font-semibold border-b border-[#E2E8E0]">
                <tr>
                  <th className="p-3.5">Channel Name</th>
                  <th className="p-3.5">Channel ID</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E0]">
                {trustedChannels.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3.5 font-bold text-[#18261E]">{c.channelName}</td>
                    <td className="p-3.5 font-mono text-[11px] text-[#4E5C53]">{c.channelId}</td>
                    <td className="p-3.5">Level {c.priority}</td>
                    <td className="p-3.5 font-semibold text-[#1B4D2F]">{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MODERATION REPORTS TAB */}
      {subTab === 'reports' && (
        <div className="bg-white rounded-[16px] border border-[#E2E8E0] overflow-hidden shadow-xs">
          {videoReports.length === 0 ? (
            <div className="p-8 text-center text-[#4E5C53] text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto text-[#2E7D4E] mb-2" />
              No pending content moderation reports! The curriculum is healthy and clean.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F4F7F4] text-[#4E5C53] font-semibold border-b border-[#E2E8E0]">
                <tr>
                  <th className="p-3.5">Reported Video</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5">Reported By</th>
                  <th className="p-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8E0]">
                {videoReports.map((rep) => (
                  <tr key={rep.id}>
                    <td className="p-3.5 font-bold text-[#18261E] max-w-[200px] truncate">
                      {rep.video?.title || 'Unknown Video'}
                    </td>
                    <td className="p-3.5 font-semibold text-[#991B1B]">{rep.reason}</td>
                    <td className="p-3.5 text-[#4E5C53]">{rep.details || 'None provided'}</td>
                    <td className="p-3.5">{rep.user?.name || 'Anonymous Learner'}</td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'DISMISS')}
                        className="px-2.5 py-1 rounded-[6px] border border-[#E2E8E0] text-[11px] hover:bg-[#F4F7F4]"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'UNPUBLISH_VIDEO')}
                        className="px-2.5 py-1 rounded-[6px] bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-[11px] font-bold hover:bg-[#FEE2E2]"
                      >
                        Unpublish Video
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
