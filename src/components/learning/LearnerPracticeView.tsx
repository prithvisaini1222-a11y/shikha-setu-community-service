'use client';

import React, { useState } from 'react';
import { submitQuizAction } from '@/actions/learning';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: string;
}

export interface QuizItem {
  id: string;
  title: string;
  chapterId: string;
  chapterTitle: string;
  subjectName: string;
  passScore: number;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  lastAttempt?: {
    score: number;
    maxScore: number;
    accuracyPercentage: number;
    completedAt: string;
  } | null;
}

interface LearnerPracticeViewProps {
  quizzes: QuizItem[];
  subjects: any[];
  currentClass: number;
  onSelectSubject?: (subject: any) => void;
}

export function LearnerPracticeView({
  quizzes = [],
  subjects = [],
  currentClass,
  onSelectSubject,
}: LearnerPracticeViewProps) {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [activeQuiz, setActiveQuiz] = useState<QuizItem | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    maxScore: number;
    accuracy: number;
  } | null>(null);

  // Filter quizzes by subject
  const filteredQuizzes = selectedSubjectFilter === 'ALL'
    ? quizzes
    : quizzes.filter((q) => q.subjectName.toLowerCase() === selectedSubjectFilter.toLowerCase());

  // Handle answering a question
  const handleSelectOption = (questionId: string, option: string) => {
    if (quizResult) return; // Locked after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Submit the active quiz
  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    try {
      const res = await submitQuizAction(activeQuiz.id, userAnswers);
      if (res.success) {
        setQuizResult({
          score: res.score,
          maxScore: res.maxScore,
          accuracy: res.accuracy,
        });
        if (res.accuracy >= 70) {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (e) {
      console.error('Quiz submission error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset current quiz attempt
  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              <BarChart3 className="w-3.5 h-3.5" />
              Class {currentClass} Practice & Assessment
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#18261E] tracking-tight">
              NCERT Diagnostic & Mastery Quizzes
            </h1>
            <p className="text-xs sm:text-sm text-[#4E5C53]">
              Evaluate chapter understanding with instant step-by-step solutions and mastery scoring.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#FAFBF9] border border-[#E2E8E0] text-xs font-bold text-[#18261E]">
              {quizzes.length} Diagnostic Quizzes Available
            </span>
          </div>
        </div>
      </div>

      {/* Active Quiz Player Modal / Full View */}
      {activeQuiz ? (
        <div className="bg-white rounded-3xl border border-[#E2E8E0] p-6 sm:p-8 shadow-xs space-y-6">
          {/* Quiz Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E0] pb-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2E7D32]">
                {activeQuiz.subjectName} • {activeQuiz.chapterTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#18261E]">
                {activeQuiz.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setActiveQuiz(null);
                  handleResetQuiz();
                }}
                className="px-4 py-2 rounded-xl border border-[#E2E8E0] text-xs font-bold text-[#4E5C53] hover:text-[#18261E] hover:bg-[#FAFBF9] transition-colors cursor-pointer"
              >
                ← Back to Quizzes
              </button>
            </div>
          </div>

          {/* Result Banner if submitted */}
          {quizResult && (
            <div
              className={`p-5 rounded-2xl border ${
                quizResult.accuracy >= 70
                  ? 'bg-[#E8F5E9] border-[#C8E6C9] text-[#1B5E20]'
                  : 'bg-[#FFF3E0] border-[#FFE082] text-[#B78103]'
              } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#2E7D32]" />
                  <span className="font-extrabold text-sm sm:text-base">
                    Quiz Evaluation: {quizResult.score} / {quizResult.maxScore} Marks ({quizResult.accuracy}%)
                  </span>
                </div>
                <p className="text-xs">
                  {quizResult.accuracy >= 70
                    ? 'Excellent mastery! You have grasped the foundational NCERT principles for this chapter.'
                    : 'Good attempt. Review the answer explanations below to strengthen concepts before retesting.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl bg-white border border-[#E2E8E0] text-xs font-bold text-[#18261E] hover:bg-[#FAFBF9] transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry Quiz
              </button>
            </div>
          )}

          {/* Question List */}
          <div className="space-y-6">
            {activeQuiz.questions.length === 0 ? (
              <div className="py-12 text-center text-[#4E5C53] text-sm">
                No interactive questions configured for this quiz yet. Check chapter videos and notes!
              </div>
            ) : (
              activeQuiz.questions.map((q, idx) => {
                const selected = userAnswers[q.id];
                const isSubmitted = Boolean(quizResult);
                const isCorrect = isSubmitted && selected?.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-[#E2E8E0] bg-[#FAFBF9] space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E2E8E0] text-[#18261E] font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#18261E]">
                          {q.questionText}
                        </h4>
                      </div>
                      {q.difficulty && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#E2E8E0] text-[#4E5C53] uppercase shrink-0">
                          {q.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isChosen = selected === opt;
                        const isTheCorrectOne = isSubmitted && opt.trim().toLowerCase() === q.correctAnswer?.trim().toLowerCase();

                        let optClasses = 'border-[#E2E8E0] bg-white text-[#18261E] hover:border-[#2E7D32]/60';
                        if (isChosen) {
                          optClasses = 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] font-bold';
                        }
                        if (isSubmitted) {
                          if (isTheCorrectOne) {
                            optClasses = 'border-[#2E7D32] bg-[#E8F5E9] text-[#1B5E20] font-bold ring-1 ring-[#2E7D32]';
                          } else if (isChosen && !isTheCorrectOne) {
                            optClasses = 'border-[#E57373] bg-[#FFEBEE] text-[#C62828]';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(q.id, opt)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && isTheCorrectOne && (
                              <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                            )}
                            {isSubmitted && isChosen && !isTheCorrectOne && (
                              <XCircle className="w-4 h-4 text-[#C62828] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission */}
                    {isSubmitted && (
                      <div className="mt-3 p-3 rounded-xl bg-white border border-[#E2E8E0] text-xs text-[#4E5C53] space-y-1">
                        <span className="font-bold text-[#18261E] block">
                          Correct Answer: <span className="text-[#2E7D32]">{q.correctAnswer}</span>
                        </span>
                        {q.explanation && (
                          <p className="text-[#4E5C53] leading-relaxed">
                            <span className="font-semibold">Explanation:</span> {q.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Submit Action Bar */}
          {!quizResult && activeQuiz.questions.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8E0]">
              <span className="text-xs text-[#4E5C53]">
                Answered {Object.keys(userAnswers).length} of {activeQuiz.questions.length} questions
              </span>
              <button
                type="button"
                disabled={isSubmitting || Object.keys(userAnswers).length === 0}
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Evaluating...' : 'Submit Assessment →'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Catalog Grid */
        <div className="space-y-4">
          {/* Subject Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setSelectedSubjectFilter('ALL')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedSubjectFilter === 'ALL'
                  ? 'bg-[#2E7D32] text-white'
                  : 'bg-white border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E]'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSubjectFilter(s.name)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedSubjectFilter.toLowerCase() === s.name.toLowerCase()
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white border border-[#E2E8E0] text-[#4E5C53] hover:text-[#18261E]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Quiz Cards */}
          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2E8E0] p-10 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#4E5C53] mx-auto opacity-40" />
              <h3 className="text-base font-bold text-[#18261E]">
                No quizzes found for this subject filter
              </h3>
              <p className="text-xs text-[#4E5C53] max-w-md mx-auto">
                Explore the learning lectures and video sessions in My Learning to strengthen your knowledge.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl border border-[#E2E8E0] p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                        {quiz.subjectName}
                      </span>
                      <span className="text-[11px] font-medium text-[#4E5C53] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {quiz.timeLimitMinutes} min
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-[#18261E] line-clamp-2">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-[#4E5C53] line-clamp-1">
                      {quiz.chapterTitle}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-[#E2E8E0]/70">
                    {quiz.lastAttempt && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#4E5C53]">Last Score:</span>
                        <span className="font-bold text-[#2E7D32]">
                          {quiz.lastAttempt.score}/{quiz.lastAttempt.maxScore} ({quiz.lastAttempt.accuracyPercentage}%)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-[#4E5C53]">
                        {quiz.questions.length} questions
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveQuiz(quiz);
                          handleResetQuiz();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <span>{quiz.lastAttempt ? 'Retake' : 'Start Quiz'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

