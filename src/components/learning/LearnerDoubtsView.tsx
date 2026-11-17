'use client';

import React, { useState } from 'react';
import { submitDoubtAction } from '@/actions/learning';
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  BookOpen,
  UserCheck,
  AlertCircle,
} from 'lucide-react';

export interface DoubtItem {
  id: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  question: string;
  status: string; // 'OPEN' | 'ANSWERED' | 'RESOLVED'
  answer?: string | null;
  answeredBy?: string | null;
  answeredAt?: string | null;
  createdAt: string;
}

interface LearnerDoubtsViewProps {
  doubts: DoubtItem[];
  subjects: any[];
  currentClass: number;
}

export function LearnerDoubtsView({
  doubts: initialDoubts = [],
  subjects = [],
  currentClass,
}: LearnerDoubtsViewProps) {
  const [doubtsList, setDoubtsList] = useState<DoubtItem[]>(initialDoubts);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [questionText, setQuestionText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'ANSWERED'>('ALL');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Derived chapters for the currently selected subject
  const currentSubjectObj = subjects.find((s) => s.id === selectedSubjectId);
  const availableChapters: any[] = currentSubjectObj?.chapters || [];

  // Update selectedChapterId if subject changes
  const handleSubjectChange = (newSubjId: string) => {
    setSelectedSubjectId(newSubjId);
    const subj = subjects.find((s) => s.id === newSubjId);
    if (subj?.chapters && subj.chapters.length > 0) {
      setSelectedChapterId(subj.chapters[0].id);
    } else {
      setSelectedChapterId('');
    }
  };

  // Set default chapter on initial mount if not set
  React.useEffect(() => {
    if (!selectedChapterId && availableChapters.length > 0) {
      setSelectedChapterId(availableChapters[0].id);
    }
  }, [availableChapters, selectedChapterId]);

  // Submit Doubt
  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !selectedChapterId || !questionText.trim()) {
      setSubmissionFeedback({
        type: 'error',
        message: 'Please choose a subject, chapter, and describe your doubt clearly.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionFeedback(null);

    const formData = new FormData();
    formData.append('subjectId', selectedSubjectId);
    formData.append('chapterId', selectedChapterId);
    formData.append('question', questionText.trim());

    try {
      const res = await submitDoubtAction(formData);
      if (res.success) {
        const currentChapterObj = availableChapters.find((c) => c.id === selectedChapterId);
        const newDoubt: DoubtItem = {
          id: res.doubtId || `doubt-${Date.now()}`,
          subjectId: selectedSubjectId,
          subjectName: currentSubjectObj?.name || 'Subject',
          chapterId: selectedChapterId,
          chapterTitle: currentChapterObj?.title || 'Chapter',
          question: questionText.trim(),
          status: 'OPEN',
          answer: null,
          answeredBy: null,
          answeredAt: null,
          createdAt: new Date().toISOString(),
        };

        setDoubtsList([newDoubt, ...doubtsList]);
        setQuestionText('');
        setSubmissionFeedback({
          type: 'success',
          message: 'Your doubt has been submitted to verified educators. You will receive an answer here shortly.',
        });
      } else {
        setSubmissionFeedback({
          type: 'error',
          message: res.error || 'Failed to submit doubt. Please try again.',
        });
      }
    } catch (err: any) {
      setSubmissionFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered doubts
  const filteredDoubts = doubtsList.filter((d) => {
    if (statusFilter === 'OPEN') return d.status === 'OPEN';
    if (statusFilter === 'ANSWERED') return d.status === 'ANSWERED' || d.status === 'RESOLVED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <Sparkles className="w-3.5 h-3.5" />
              Supervised Academic Doubt Resolution
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#18261E] tracking-tight">
              Ask a Doubt
            </h1>
            <p className="text-xs sm:text-sm text-[#4E5C53]">
              Need help understanding a formula, theorem, grammar rule, or scientific concept? Ask our certified educators.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#FAFBF9] border border-[#E2E8E0] px-3.5 py-2 rounded-2xl text-xs font-semibold text-[#18261E] shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span>Supervised & Safe</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ask Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2E8E0] p-6 shadow-xs space-y-5">
          <div className="space-y-1 border-b border-[#E2E8E0] pb-4">
            <h2 className="text-base font-extrabold text-[#18261E] flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#2E7D32]" />
              New Academic Query
            </h2>
            <p className="text-xs text-[#4E5C53]">
              Select the subject and chapter where you have questions.
            </p>
          </div>

          <form onSubmit={handleSubmitDoubt} className="space-y-4">
            {/* Subject Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#18261E] block">
                Subject
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] text-xs font-semibold text-[#18261E] focus:outline-none focus:border-[#2E7D32] transition-colors"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.bookName || `Class ${currentClass}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#18261E] block">
                Chapter
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => setSelectedChapterId(e.target.value)}
                disabled={availableChapters.length === 0}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] text-xs font-semibold text-[#18261E] focus:outline-none focus:border-[#2E7D32] transition-colors disabled:opacity-50"
              >
                {availableChapters.length === 0 ? (
                  <option value="">No chapters available</option>
                ) : (
                  availableChapters.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Ch {ch.chapterNumber}: {ch.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Question Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-[#18261E]">
                  Describe Your Doubt
                </label>
                <span className="text-[#4E5C53] text-[11px]">
                  {questionText.length}/500
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={500}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="E.g., In Chapter 2 Exercise 2.1, how do we factorize x² - 5x + 6 when both signs are negative?"
                className="w-full p-3 rounded-xl border border-[#E2E8E0] bg-[#FAFBF9] text-xs text-[#18261E] placeholder:text-[#4E5C53]/60 focus:outline-none focus:border-[#2E7D32] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Feedback alert */}
            {submissionFeedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  submissionFeedback.type === 'success'
                    ? 'bg-[#E8F5E9] border border-[#C8E6C9] text-[#1B5E20]'
                    : 'bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828]'
                }`}
              >
                {submissionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{submissionFeedback.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !questionText.trim()}
              className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Submitting Doubt...</span>
              ) : (
                <>
                  <span>Post Doubt to Educators</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Child Safety Note */}
          <div className="p-3 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-[11px] text-[#4E5C53] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
            <span>
              All student doubts are answered in accordance with child protection standards. Answers are reviewed by institution educators.
            </span>
          </div>
        </div>

        {/* Right Column: Doubt History (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E]'
                }`}
              >
                All Doubts ({doubtsList.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('ANSWERED')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === 'ANSWERED'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E]'
                }`}
              >
                Answered ({doubtsList.filter((d) => d.status === 'ANSWERED' || d.status === 'RESOLVED').length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('OPEN')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === 'OPEN'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E]'
                }`}
              >
                In Review ({doubtsList.filter((d) => d.status === 'OPEN').length})
              </button>
            </div>
          </div>

          {/* Doubt Cards List */}
          {filteredDoubts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2E8E0] p-10 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-[#4E5C53] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-[#18261E]">
                No doubts in this category
              </h3>
              <p className="text-xs text-[#4E5C53] max-w-sm mx-auto">
                Have a question while watching video lectures? Post it on the left to receive solutions from certified educators.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDoubts.map((doubt) => {
                const isAnswered = doubt.status === 'ANSWERED' || doubt.status === 'RESOLVED';

                return (
                  <div
                    key={doubt.id}
                    className="bg-white rounded-2xl border border-[#E2E8E0] p-5 shadow-2xs space-y-3.5"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          {doubt.subjectName}
                        </span>
                        <span className="text-xs font-semibold text-[#4E5C53]">
                          {doubt.chapterTitle}
                        </span>
                      </div>

                      {isAnswered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                          <CheckCircle2 className="w-3 h-3" />
                          Answered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF8E1] text-[#B78103] border border-[#FFE082]">
                          <Clock className="w-3 h-3" />
                          Under Review
                        </span>
                      )}
                    </div>

                    {/* Question text */}
                    <div className="text-xs sm:text-sm font-bold text-[#18261E] leading-relaxed">
                      Q: {doubt.question}
                    </div>

                    {/* Verified Answer Section */}
                    {isAnswered && doubt.answer && (
                      <div className="p-4 rounded-xl bg-[#FAFBF9] border border-[#C8E6C9] space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold text-[#2E7D32] flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5" />
                            {doubt.answeredBy || 'Certified Educator'}
                          </span>
                          {doubt.answeredAt && (
                            <span className="text-[11px] text-[#4E5C53]">
                              {new Date(doubt.answeredAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#18261E] leading-relaxed whitespace-pre-wrap">
                          {doubt.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

