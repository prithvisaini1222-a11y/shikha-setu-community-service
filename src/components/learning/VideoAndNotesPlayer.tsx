'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  submitPracticeAnswerAction,
  submitQuizAction,
  markLessonCompleteAction,
  submitDoubtAction,
  toggleSaveVideoAction,
} from '@/actions/learning';
import { Badge, ProgressBar, Button, Card } from '@/components/ui/atoms';
import { CountUp } from '@/components/ui/CountUp';
import { AnimatedTabs } from '@/components/ui/AnimatedTabs';
import {
  PlayCircle,
  FileText,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  Loader2,
  Send,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Lock,
  Clock,
  Printer,
  Compass,
  Bookmark,
  Flag,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReportVideoModal } from './ReportVideoModal';

interface VideoAndNotesPlayerProps {
  lesson: any;
  notes: any[];
  practiceQuestions: any[];
  quiz: any;
  learnerId?: string;
  isCompletedInitial: boolean;
  relatedVideos?: any[];
  selectedVideoId?: string;
  previousLesson?: { id: string; lessonNumber: number; title: string } | null;
  nextLesson?: { id: string; lessonNumber: number; title: string } | null;
}

function getEmbedUrl(urlOrId: string): string {
  if (!urlOrId) return '';
  if (urlOrId.includes('youtube-nocookie.com/embed/')) {
    return urlOrId.includes('?') ? urlOrId : `${urlOrId}?rel=0&modestbranding=1`;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) {
    return `https://www.youtube-nocookie.com/embed/${urlOrId}?rel=0&modestbranding=1`;
  }
  const match = urlOrId.match(/(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
  }
  return urlOrId;
}

export function VideoAndNotesPlayer({
  lesson,
  notes,
  practiceQuestions,
  quiz,
  learnerId,
  isCompletedInitial,
  relatedVideos = [],
  selectedVideoId,
  previousLesson,
  nextLesson,
}: VideoAndNotesPlayerProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'practice' | 'quiz' | 'doubt'>('video');
  const [isCompleted, setIsCompleted] = useState(isCompletedInitial);
  const [isPending, startTransition] = useTransition();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const activeEmbedUrl = getEmbedUrl(selectedVideoId || lesson.videoUrl);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, { selected: string; result?: any }>>({});

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!quizResult) {
      setDisplayScore(0);
      return;
    }
    let current = 0;
    const target = Number(quizResult.score) || 0;
    if (target <= 0) {
      setDisplayScore(0);
      return;
    }
    const interval = setInterval(() => {
      current += 1;
      setDisplayScore(current);
      if (current >= target) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [quizResult]);

  // Doubt state
  const [doubtText, setDoubtText] = useState('');
  const [doubtSuccess, setDoubtSuccess] = useState(false);

  // Parse objectives
  let objectives: string[] = [];
  try {
    objectives = JSON.parse(lesson.objectivesJson || '[]');
  } catch (e) {
    objectives = [];
  }

  // Parse quiz questions safely
  let quizQuestions: any[] = [];
  try {
    if (quiz && quiz.questionsJson) {
      quizQuestions = JSON.parse(quiz.questionsJson);
    }
  } catch (e) {
    quizQuestions = [];
  }

  // Handle Mark Completed (Requirement 22)
  const handleMarkComplete = () => {
    startTransition(async () => {
      await markLessonCompleteAction(lesson.id);
      setIsCompleted(true);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    });
  };

  // Handle Practice Answer (Requirement 18)
  const handlePracticeSelect = async (questionId: string, choice: string) => {
    setPracticeAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: choice },
    }));

    const res = await submitPracticeAnswerAction(questionId, choice);
    setPracticeAnswers((prev) => ({
      ...prev,
      [questionId]: { selected: choice, result: res },
    }));

    if (res.isCorrect) {
      confetti({ particleCount: 25, spread: 45 });
    }
  };

  // Handle Quiz Option Selection
  const handleSelectQuizOption = (questionId: string, opt: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: opt,
    }));
  };

  // Handle Quiz Submission
  const handleQuizSubmit = async () => {
    if (!quiz) return;
    setIsSubmittingQuiz(true);
    try {
      const res = await submitQuizAction(quiz.id, quizAnswers);
      setQuizResult(res);
      if (res && 'accuracy' in res && (res as any).accuracy >= 70) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setIsCompleted(true);
      }
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Reset Quiz
  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizResult(null);
    setCurrentQuizIndex(0);
  };

  // Handle Doubt Submit
  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    startTransition(async () => {
      const fd = new FormData();
      fd.append('subjectId', lesson.chapter.subjectId);
      fd.append('chapterId', lesson.chapterId);
      fd.append('question', doubtText);
      await submitDoubtAction(fd);
      setDoubtText('');
      setDoubtSuccess(true);
    });
  };

  const tabsList = [
    { id: 'video', label: 'Video Lesson', icon: PlayCircle },
    { id: 'notes', label: 'Chapter Notes', icon: FileText },
    { id: 'practice', label: `Practice (${practiceQuestions.length})`, icon: HelpCircle },
    { id: 'quiz', label: '10-Question Quiz', icon: Award },
    { id: 'doubt', label: 'Ask a Doubt', icon: MessageSquare },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT / MAIN LMS AREA (8 Cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Navigation Tabs Bar with Smooth Sliding Active Indicator (Requirement 13) */}
        <div className="bg-white rounded-[16px] border border-[#E2E8E0] px-2 pt-1 shadow-xs">
          <AnimatedTabs
            tabs={tabsList}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            variant="underline"
          />
        </div>

        {/* TAB 1: VIDEO LESSON */}
        {activeTab === 'video' && (
          <div className="space-y-6 animate-fade-in">
            {/* Embedded Video Player with Skeleton Loading Fallback (Requirement 32) */}
            <div className="bg-[#18261E] rounded-[16px] overflow-hidden aspect-video shadow-xs border border-[#E2E8E0] relative">
              {!videoLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#18261E] text-[#9CA3AF] space-y-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#2E7D4E] border-t-transparent animate-spin" />
                  <span className="text-xs font-semibold text-[#E2E8E0]">Loading Video Stream...</span>
                </div>
              )}
              <iframe
                src={activeEmbedUrl}
                title={lesson.title}
                onLoad={() => setVideoLoaded(true)}
                className={`w-full h-full border-0 transition-opacity duration-500 ${
                  videoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Meta Card */}
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4 card-interactive">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#4E5C53] font-medium">
                    <span className="font-semibold text-[#2E7D4E]">{lesson.videoSource || 'NCERT / EdTech'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} min</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#18261E]">{lesson.title}</h2>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleMarkComplete}
                    disabled={isPending || isCompleted}
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    className={isCompleted ? 'border-[#C6E6CD] text-[#1B4D2F] bg-[#EBF5EE]' : 'bg-[#2E7D4E] hover:bg-[#24663F] text-white font-semibold'}
                    leftIcon={<CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-[#2E7D4E] animate-check-pop' : ''}`} />}
                  >
                    {isCompleted ? 'Lesson Completed' : 'Mark as Completed'}
                  </Button>

                  <button
                    onClick={async () => {
                      setSaveLoading(true);
                      try {
                        const res = await toggleSaveVideoAction(lesson.id);
                        if (res.success && res.isSaved !== undefined) setIsSaved(res.isSaved);
                      } finally {
                        setSaveLoading(false);
                      }
                    }}
                    disabled={saveLoading}
                    title={isSaved ? 'Lesson saved' : 'Save lesson'}
                    className={`p-2 rounded-[10px] border transition-all text-xs flex items-center gap-1.5 ${
                      isSaved
                        ? 'bg-[#EBF5EE] border-[#C6E6CD] text-[#1B4D2F] font-semibold'
                        : 'bg-[#F4F7F4] border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E] hover:bg-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={() => setReportOpen(true)}
                    title="Report video"
                    className="p-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] text-[#4E5C53] hover:text-[#991B1B] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {lesson.description && (
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed pt-2 border-t border-[#E2E8E0]">
                  {lesson.description}
                </p>
              )}

              {/* Learning Objectives */}
              {objectives.length > 0 && (
                <div className="pt-3 border-t border-[#E2E8E0] space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#243247] flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-[#F2C96D]" />
                    Learning Objectives
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {objectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 bg-[#F4F7F4] p-2.5 rounded-[10px] border border-[#E2E8E0] text-xs text-[#18261E] transition-all hover:bg-white hover:-translate-y-px">
                        <span className="w-4 h-4 rounded-full bg-[#2E7D4E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Curriculum Placement & Lesson Navigation (Requirement 21) */}
              <div className="pt-3 border-t border-[#E2E8E0] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#4E5C53]">Chapter:</span>
                    <span className="font-semibold text-[#18261E]">{lesson.chapter?.title}</span>
                    {lesson.topic && (
                      <>
                        <span className="text-[#86968B]">•</span>
                        <span className="text-[#4E5C53]">Topic:</span>
                        <span className="font-bold text-[#2E7D4E]">{lesson.topic.name}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E0]/60">
                  {previousLesson ? (
                    <Link
                      href={`/learn/lesson/${previousLesson.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4E5C53] hover:text-[#18261E] px-3.5 py-2 rounded-[10px] border border-[#E2E8E0] bg-[#F4F7F4] hover:bg-white transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous: Lesson {previousLesson.lessonNumber}</span>
                    </Link>
                  ) : <div />}

                  {nextLesson ? (
                    <Link
                      href={`/learn/lesson/${nextLesson.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#2E7D4E] hover:bg-[#24663F] px-4 py-2 rounded-[10px] shadow-xs transition-colors"
                    >
                      <span>Next: Lesson {nextLesson.lessonNumber}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#2E7D4E] font-semibold bg-[#EBF5EE] px-3 py-1.5 rounded-[8px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D4E]" />
                      <span>Last Lesson in Chapter</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Requirement 22: Learning Completion Banner & Next Recommended Lesson */}
            {isCompleted && (
              <div className="bg-[#EBF5EE] border border-[#C6E6CD] rounded-[16px] p-6 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#1B4D2F] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D4E] animate-check-pop" />
                    <span>Lesson Completed Successfully!</span>
                  </div>
                  <span className="text-xs font-bold text-[#1B4D2F] bg-white px-2.5 py-0.5 rounded-full border border-[#C6E6CD]">
                    100% Progress
                  </span>
                </div>
                <p className="text-xs text-[#4E5C53]">
                  Great job completing this conceptual lesson. Ready for the next topic?
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-[#C6E6CD]/60">
                  <span className="text-xs font-semibold text-[#18261E]">
                    Next Recommended: Linear Equations with Fractions
                  </span>
                  <button
                    onClick={() => setActiveTab('practice')}
                    className="px-3.5 py-1.5 rounded-[8px] bg-[#2E7D4E] hover:bg-[#24663F] text-white text-xs font-bold shadow-xs transition-all hover:-translate-y-px active:scale-95 cursor-pointer"
                  >
                    Start Practice →
                  </button>
                </div>
              </div>
            )}

            {/* Related Lessons & Recommendations (Requirement 25) */}
            {relatedVideos.length > 0 && (
              <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E8E0]/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#18261E]">Continue Learning: Related Videos</h3>
                    <p className="text-xs text-[#4E5C53]">More recommended videos from this chapter and subject.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedVideos.map((rv: any) => (
                    <Link
                      key={rv.id}
                      href={`/learn/lesson/${lesson.id}?v=${rv.youtubeVideoId}`}
                      className="flex items-center gap-3 p-3 rounded-[12px] border border-[#E2E8E0] bg-[#F4F7F4] hover:bg-white hover:border-[#2E7D4E] transition-all card-interactive group"
                    >
                      <div className="w-20 aspect-video rounded-[8px] overflow-hidden bg-[#1F2937] shrink-0 relative">
                        <img
                          src={rv.thumbnailUrl || `https://img.youtube.com/vi/${rv.youtubeVideoId}/hqdefault.jpg`}
                          alt={rv.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="text-xs font-bold text-[#18261E] truncate group-hover:text-[#2E7D4E]">
                          {rv.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-[#4E5C53]">
                          <span className="truncate">{rv.channelName}</span>
                          <span>•</span>
                          <span>{rv.duration || '15m'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CHAPTER NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6 animate-fade-in">
            {notes.length === 0 ? (
              <div className="bg-white p-8 rounded-[16px] border border-[#E2E8E0] text-center text-xs text-[#4E5C53]">
                No additional revision notes published for this chapter yet.
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6 card-interactive">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8E0] pb-4 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#18261E]">{note.title}</h3>
                      <p className="text-xs text-[#4E5C53] mt-0.5">{note.summary}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      leftIcon={<Printer className="w-3.5 h-3.5" />}
                    >
                      Print Notes
                    </Button>
                  </div>

                  {note.keyFormulas && (
                    <div className="p-4 rounded-[12px] bg-[#FEF9ED] border border-[#FDE5A9] text-[#8C6013] space-y-1 text-xs">
                      <span className="font-bold uppercase tracking-wider block text-[#8C6013]">
                        Key Formulas & Transposition Rules
                      </span>
                      <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed">
                        {note.keyFormulas}
                      </pre>
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none text-xs text-[#18261E] leading-relaxed whitespace-pre-line">
                    {note.content}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PRACTICE SYSTEM (Requirement 18: Answer micro-interactions) */}
        {activeTab === 'practice' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-2 card-interactive">
              <h3 className="text-base font-bold text-[#18261E]">Interactive Practice Engine</h3>
              <p className="text-xs text-[#4E5C53]">
                Attempt these conceptual questions to solidify your understanding. Each answer provides immediate explanation feedback.
              </p>
            </div>

            <div className="space-y-4">
              {practiceQuestions.map((q, idx) => {
                let options: string[] = [];
                try {
                  options = JSON.parse(q.optionsJson || '[]');
                } catch (e) {
                  options = [];
                }

                const answerState = practiceAnswers[q.id];
                const result = answerState?.result;

                return (
                  <div key={q.id} className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-4 card-interactive">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-[8px] bg-[#EBF5EE] text-[#1B4D2F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-[#18261E]">{q.prompt}</p>
                        <span className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wider block">
                          Difficulty: {q.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Options Grid with Smooth Selected State and Instant Color Reveals (Requirement 18) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                      {options.map((opt) => {
                        const isChosen = answerState?.selected === opt;
                        let btnStyle = 'bg-white border-[#E2E8E0] text-[#18261E] hover:border-[#D1CDBC] hover:-translate-y-px';

                        if (isChosen && result) {
                          btnStyle = result.isCorrect
                            ? 'bg-[#EBF5EE] border-[#2E7D4E] text-[#1B4D2F] font-semibold ring-1 ring-[#C6E6CD]'
                            : 'bg-[#FDF2F2] border-[#DC2626] text-[#991B1B] font-semibold ring-1 ring-[#F8D7DA]';
                        } else if (isChosen) {
                          btnStyle = 'bg-[#EEF3F8] border-[#4B749F] text-[#3765BC] font-semibold';
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handlePracticeSelect(q.id, opt)}
                            className={`p-3.5 rounded-[12px] border text-left text-xs transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.98] ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isChosen && result && (
                              result.isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-[#2E7D4E] shrink-0 animate-check-pop" />
                              ) : (
                                <XCircle className="w-4 h-4 text-[#DC2626] shrink-0 animate-check-pop" />
                              )
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback & Explanation Card */}
                    {result && (
                      <div
                        className={`ml-9 p-3.5 rounded-[12px] border text-xs space-y-1 animate-fade-in ${
                          result.isCorrect
                            ? 'bg-[#EBF5EE] border-[#C6E6CD] text-[#1B4D2F]'
                            : 'bg-[#FDF2F2] border-[#F8D7DA] text-[#991B1B]'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {result.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
                              <span>Correct! Great comprehension.</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-[#DC2626]" />
                              <span>Incorrect. Correct Answer: {result.correctAnswer}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[#18261E] leading-relaxed pt-1">
                          <strong>Explanation:</strong> {result.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: 10-QUESTION DISTRACTION-FREE QUIZ UI */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fade-in">
            {!quiz ? (
              <div className="bg-white p-8 rounded-[16px] border border-[#E2E8E0] text-center text-xs text-[#4E5C53]">
                No active chapter quiz configured yet.
              </div>
            ) : quizResult ? (
              /* Requirement 19: QUIZ RESULT CARD WITH COUNT-UP */
              <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6 card-interactive animate-scale-in">
                <div className="text-center space-y-2 border-b border-[#E2E8E0] pb-6">
                  <div className="w-12 h-12 rounded-[12px] bg-[#EBF5EE] text-[#2E7D4E] flex items-center justify-center mx-auto animate-check-pop">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#18261E]">Your Result</h3>
                  <p className="text-xs text-[#4E5C53]">Class 8 • Mathematics — {quiz.title}</p>
                </div>

                {/* Score Summary with animated count-up */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0]">
                    <span className="text-xs font-bold text-[#4E5C53] uppercase tracking-wider">Score</span>
                    <div className="text-2xl sm:text-3xl font-black text-[#2E7D4E] mt-1 transition-all">
                      <CountUp end={quizResult.score || displayScore} suffix={` / ${quizResult.maxScore}`} />
                    </div>
                  </div>
                  <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0]">
                    <span className="text-xs font-bold text-[#4E5C53] uppercase tracking-wider">Accuracy</span>
                    <div className="text-2xl sm:text-3xl font-bold text-[#1B4D2F] mt-1">
                      <CountUp end={quizResult.accuracy || 0} suffix="%" />
                    </div>
                  </div>
                  <div className="bg-[#F4F7F4] p-4 rounded-[12px] border border-[#E2E8E0] col-span-2 sm:col-span-1">
                    <span className="text-xs font-bold text-[#4E5C53] uppercase tracking-wider">Status</span>
                    <div className={`text-sm font-bold mt-2 ${quizResult.accuracy >= 70 ? 'text-[#1B4D2F]' : 'text-[#8C6013]'}`}>
                      {quizResult.accuracy >= 70 ? 'Mastery Achieved' : 'Needs Practice'}
                    </div>
                  </div>
                </div>

                {/* Weak Area Detection */}
                {quizResult.weakAreas && quizResult.weakAreas.length > 0 && (
                  <div className="p-4 rounded-[12px] bg-[#FEF9ED] border border-[#FDE5A9] space-y-1 text-xs animate-fade-in stagger-2">
                    <span className="font-bold text-[#8C6013] uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-[#F2C96D]" />
                      <span>Identified Weak Area</span>
                    </span>
                    <p className="text-[#4E5C53]">
                      Review topic: <strong>{quizResult.weakAreas.join(', ')}</strong>.
                    </p>
                  </div>
                )}

                {/* Recommended Next Step (Slight Delay Reveal - Requirement 19) */}
                <div className="p-5 rounded-[12px] bg-[#EBF5EE] border border-[#C6E6CD] space-y-2 animate-fade-in stagger-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E7D4E]" />
                    <span className="text-xs font-bold text-[#18261E] uppercase tracking-wider">
                      Recommended Next Step
                    </span>
                  </div>
                  <p className="text-xs text-[#4E5C53]">
                    Review: <strong>Fractions & Transposition rules</strong>
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <Button size="sm" onClick={handleRetakeQuiz} className="bg-[#2E7D4E] hover:bg-[#24663F] text-white font-semibold" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                    Practice Again
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab('notes')} rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Review Chapter Notes
                  </Button>
                </div>
              </div>
            ) : (
              /* ACTIVE QUIZ QUESTIONS STEPPER (DISTRACTION FREE) */
              <div className="bg-white rounded-[16px] border border-[#E2E8E0] shadow-xs p-6 sm:p-8 space-y-6 card-interactive">
                {/* Stepper Header */}
                <div className="border-b border-[#E2E8E0] pb-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#18261E]">
                      Class 8 • Mathematics
                    </span>
                    <span className="font-semibold text-[#2E7D4E]">
                      {currentQuizIndex + 1} / {quizQuestions.length || 10}
                    </span>
                  </div>
                  <ProgressBar
                    value={currentQuizIndex + 1}
                    max={quizQuestions.length || 10}
                    showPercent={false}
                    size="sm"
                    color="bg-[#2E7D4E]"
                  />
                </div>

                {/* Active Question */}
                {quizQuestions[currentQuizIndex] ? (
                  (() => {
                    const currentQ = quizQuestions[currentQuizIndex];
                    const selected = quizAnswers[currentQ.id];

                    return (
                      <div className="space-y-5 animate-fade-in">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-[#98A2B3] uppercase tracking-wider">
                            Question {currentQuizIndex + 1}
                          </span>
                          <h3 className="text-base font-bold text-[#18261E] leading-snug">
                            {currentQ.prompt}
                          </h3>
                        </div>

                        {/* Large Selectable Cards with soft green selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {currentQ.options.map((opt: string) => {
                            const isSelected = selected === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelectQuizOption(currentQ.id, opt)}
                                className={`p-4 rounded-[12px] border text-left text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.98] ${
                                  isSelected
                                    ? 'border-[#2E7D4E] bg-[#EBF5EE] text-[#18261E] ring-1 ring-[#2E7D4E] scale-[1.01]'
                                    : 'border-[#E2E8E0] hover:border-[#D1CDBC] bg-white text-[#18261E] hover:-translate-y-px'
                                }`}
                              >
                                <span>{opt}</span>
                                <span
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                    isSelected
                                      ? 'border-[#2E7D4E] bg-[#2E7D4E] text-white'
                                      : 'border-[#E2E8E0]'
                                  }`}
                                >
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-xs text-[#667085]">No question data available.</p>
                )}

                {/* Navigation Controls */}
                <div className="pt-4 border-t border-[#E2E8E0] flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={currentQuizIndex === 0}
                    onClick={() => setCurrentQuizIndex((p) => Math.max(0, p - 1))}
                    leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  >
                    Previous
                  </Button>

                  {currentQuizIndex < quizQuestions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setCurrentQuizIndex((p) => p + 1)}
                      className="bg-[#2E7D4E] hover:bg-[#24663F]"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      isLoading={isSubmittingQuiz}
                      loadingText="Scoring..."
                      onClick={handleQuizSubmit}
                      className="bg-[#2E7D4E] hover:bg-[#24663F] min-w-[120px]"
                      rightIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    >
                      Submit Quiz
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ASK A DOUBT */}
        {activeTab === 'doubt' && (
          <div className="bg-white p-6 sm:p-8 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-6 card-interactive animate-fade-in">
            <div className="space-y-1 border-b border-[#E2E8E0] pb-4">
              <h3 className="text-base font-bold text-[#243247]">Ask an Academic Doubt</h3>
              <p className="text-xs text-[#667085]">
                Child-Safe Channel: Questions are directly routed to approved volunteer educators and institution coordinators.
              </p>
            </div>

            {doubtSuccess ? (
              <div className="p-4 rounded-[12px] bg-[#EBF5EE] border border-[#C6E6CD] text-[#367757] text-xs space-y-1 animate-check-pop">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D4E]" />
                  <span>Doubt Submitted Successfully!</span>
                </p>
                <p>Your volunteer educator has been notified and will answer in your study portal.</p>
              </div>
            ) : (
              <form onSubmit={handleDoubtSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#243247] mb-1">
                    Describe your question clearly
                  </label>
                  <textarea
                    rows={4}
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder="e.g. In linear equations, why does the sign flip when transferring a negative term across the equal sign?"
                    className="w-full text-xs p-3 rounded-[10px] border border-[#E2E8E0] bg-white focus:outline-none focus:border-[#2E7D4E] focus:ring-2 focus:ring-[#2E7D4E]/20 text-[#18261E]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#9CA3AF]">
                    Compliant with POCSO and Child Protection Standards.
                  </span>
                  <Button type="submit" size="sm" isLoading={isPending} loadingText="Submitting..." className="bg-[#2E7D4E] hover:bg-[#24663F]" rightIcon={<Send className="w-3.5 h-3.5" />}>
                    Submit Doubt
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* RIGHT / SECONDARY ROADMAP SIDEBAR (4 Cols) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Lesson Roadmap Navigation */}
        <div className="bg-white p-6 rounded-[16px] border border-[#E2E8E0] shadow-xs space-y-5 card-interactive">
          <div className="flex items-center justify-between border-b border-[#E2E8E0] pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#243247]">
              Lesson Roadmap
            </h4>
            <span className="text-[10px] font-semibold bg-[#EEF3F8] text-[#3765BC] px-2 py-0.5 rounded-full border border-[#CFE0FA]">
              Class 8 Maths
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#EBF5EE] border border-[#C6E6CD]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1B4D2F]" />
                <span className="font-semibold text-[#18261E]">Introduction</span>
              </div>
              <span className="text-[10px] text-[#1B4D2F] font-semibold">completed</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#EBF5EE] border border-[#C6E6CD]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1B4D2F]" />
                <span className="font-semibold text-[#18261E]">Core Concept</span>
              </div>
              <span className="text-[10px] text-[#1B4D2F] font-semibold">completed</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#EBF5EE] border border-[#C6E6CD]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#1B4D2F]" />
                <span className="font-semibold text-[#18261E]">Solved Example</span>
              </div>
              <span className="text-[10px] text-[#1B4D2F] font-semibold">completed</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#EEF3F8] border border-[#CFE0FA]">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#4B749F]" />
                <span className="font-semibold text-[#18261E]">Practice</span>
              </div>
              <span className="text-[10px] text-[#4B749F] font-semibold">current</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-[10px] bg-[#F4F7F4] border border-[#E2E8E0]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full border border-[#98A2B3] inline-block" />
                <span className="font-medium text-[#4E5C53]">10-Question Quiz</span>
              </div>
              <span className="text-[10px] text-[#98A2B3] font-medium">upcoming</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8E0] space-y-2">
            <Button
              className={`w-full text-xs ${isCompleted ? 'bg-[#EBF5EE] text-[#1B4D2F] border-[#C6E6CD]' : 'bg-[#2E7D4E] hover:bg-[#24663F] text-white font-semibold'}`}
              variant={isCompleted ? 'secondary' : 'primary'}
              onClick={handleMarkComplete}
              disabled={isPending || isCompleted}
            >
              {isCompleted ? 'Completed' : 'Mark Lesson as Completed'}
            </Button>
            <Button
              variant="secondary"
              className="w-full text-xs bg-white text-[#18261E] border-[#E2E8E0]"
              onClick={() => setActiveTab('doubt')}
            >
              Ask Teacher a Doubt
            </Button>
          </div>
        </div>

        {/* Institution Moderation Notice */}
        <div className="bg-[#F4F7F4] border border-[#E2E8E0] rounded-[16px] p-5 space-y-1.5 text-xs text-[#667085] card-interactive">
          <span className="font-bold text-[#243247] block text-[11px] uppercase tracking-wider">
            Child Protection Guard
          </span>
          <p className="leading-relaxed text-[11px]">
            All doubt submissions and quiz scores are monitored by designated care home superintendents. Direct private child messaging is strictly disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
