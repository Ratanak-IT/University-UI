"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, HelpCircle, Loader2, X } from "lucide-react";
import {
  fetchMyProfile,
  fetchStudentQuizzes,
  startQuizAttempt,
  submitQuizAttempt,
  reportQuizFocusLoss,
  QuizResponse,
  QuizAttemptResponse,
  StudentProfile,
} from "@/lib/api/student";
import { useQuizProctor } from "@/lib/hooks/useQuizProctor";

/**
 * Sitting a quiz, on a page of its own.
 *
 * <p>It used to be a modal over the courses list. A dialog is the wrong shape
 * for this: it can be dismissed by a stray click on the backdrop, it competes
 * with fullscreen, and the page behind it keeps polling and re-rendering while
 * someone is trying to concentrate. A quiz is not a detour from another screen
 * — for as long as it is open it is the only thing the student is doing.
 */
export function QuizAttemptPage({ quizId }: { quizId: string }) {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [attemptData, setAttemptData] = useState<QuizAttemptResponse | null>(null);
  const [startingQuiz, setStartingQuiz] = useState(true);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizAttemptResponse | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  /**
   * Keyed by question id, holding both the picked index and the typed text.
   * Storing the index rather than only the text is what lets a teacher reword
   * an option after publishing without silently invalidating answers already
   * recorded against it.
   */
  const [answers, setAnswers] = useState<
    Record<string, { selectedOptionIndex?: number; answer: string }>
  >({});
  const [currentQ, setCurrentQ] = useState(0);

  const leaveQuiz = useCallback(() => {
    router.push("/dashboard/student/courses");
  }, [router]);

  // Opening the attempt is the whole point of the route, so it happens on
  // arrival rather than behind another button.
  useEffect(() => {
    let cancelled = false;

    async function begin() {
      const me = await fetchMyProfile();
      if (!me || cancelled) {
        if (!cancelled) { setLoadFailed(true); setStartingQuiz(false); }
        return;
      }
      setProfile(me);

      const quizzes = await fetchStudentQuizzes(me.studentId);
      const found = quizzes?.find((q) => q.quizId === quizId) ?? null;
      if (cancelled) return;

      if (!found) {
        setLoadFailed(true);
        setStartingQuiz(false);
        return;
      }
      setQuiz(found);

      const attempt = await startQuizAttempt(me.studentId, quizId);
      if (cancelled) return;

      if (attempt) setAttemptData(attempt);
      else setLoadFailed(true);
      setStartingQuiz(false);
    }

    begin();
    return () => { cancelled = true; };
  }, [quizId]);

  const quizInProgress = Boolean(attemptData && !quizCompleted);

  const { count: focusLossCount, isFullscreen, enterFullscreen } = useQuizProctor({
    active: quizInProgress,
    onFocusLoss: () => {
      if (!profile || !attemptData) return;
      // Deliberately not awaited: recording must never delay the student
      // getting back to their paper.
      void reportQuizFocusLoss(profile.studentId, quizId, attemptData.attemptId);
    },
  });

  const handleSubmitQuiz = async () => {
    if (!profile || !attemptData) return;
    setSubmittingQuiz(true);

    const answerItems = attemptData.questions.map((q) => {
      const given = answers[q.questionId];
      return {
        questionId: q.questionId,
        selectedOptionIndex: given?.selectedOptionIndex,
        answer: given?.answer ?? "",
      };
    });

    const result = await submitQuizAttempt(
      profile.studentId,
      quizId,
      attemptData.attemptId,
      answerItems
    );

    setSubmittingQuiz(false);
    setQuizCompleted(true);
    setQuizResult(result);
  };

  const sortedQuestions = attemptData?.questions
    ? [...attemptData.questions].sort((a, b) => a.questionOrder - b.questionOrder)
    : [];

  if (startingQuiz && !quiz) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (loadFailed && !quiz) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-10 w-10 text-rose-400 dark:text-rose-500" />
        <p className="text-base font-bold text-slate-700 dark:text-slate-200">
          This quiz is not available
        </p>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
          It may have closed, or you may have used all your attempts.
        </p>
        <button
          onClick={leaveQuiz}
          className="mt-1 rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Back to courses
        </button>
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Page header — sticky so the title and exit stay reachable while scrolling. */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-indigo-950 dark:text-slate-100">{quiz.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {quiz.durationMinutes} Minutes • {quiz.maxAttempts} Max Attempts
                {attemptData && ` • ${sortedQuestions.length} Questions`}
              </p>
            </div>
          </div>
          <button
            onClick={() => leaveQuiz()}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* STATE: Loading quiz */}
          {startingQuiz && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">Loading quiz questions...</p>
            </div>
          )}

          {/* STATE: Quiz completed - show results */}
          {quizCompleted && (
            <div className="py-8 space-y-6">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quiz Submitted!</h4>
                {quizResult && quizResult.earnedScore !== null && (
                  <div className="mx-auto w-fit rounded-2xl bg-indigo-50 px-8 py-4 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900">
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Your Score</p>
                    <p className="text-3xl font-black text-indigo-950 dark:text-slate-100">
                      {quizResult.earnedScore} <span className="text-lg font-bold text-slate-400 dark:text-slate-500">/ {quizResult.totalScore}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Show answer results if available */}
              {quizResult?.answers && quizResult.answers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Results</p>
                  {quizResult.answers.map((ar, i) => {
                    const q = sortedQuestions.find((sq) => sq.questionId === ar.questionId);
                    return (
                      <div
                        key={ar.questionId}
                        className={`flex items-center justify-between rounded-xl border p-3 ${
                          ar.isCorrect
                            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
                            : "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/30"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate dark:text-slate-100">
                            Q{i + 1}: {q?.questionText ?? "Question"}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-300">Your answer: {ar.answer || "—"}</p>
                        </div>
                        <div className="shrink-0 ml-3">
                          {ar.isCorrect ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              +{ar.earnedScore}
                            </span>
                          ) : (
                            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                              0
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => { leaveQuiz(); }}
                  className="rounded-xl bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* STATE: Taking quiz - show questions */}
          {!startingQuiz && !quizCompleted && attemptData && sortedQuestions.length > 0 && (
            <div className="space-y-5">
              {/*
                Stated openly rather than watched in secret. A count the
                student can see discourages leaving; a count they cannot see
                only ambushes them at marking time.
              */}
              {focusLossCount > 0 ? (
                <div className="flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                  <span aria-hidden className="mt-px">⚠️</span>
                  <span>
                    You left this quiz{" "}
                    <span className="font-bold">
                      {focusLossCount} time{focusLossCount === 1 ? "" : "s"}
                    </span>
                    . Your teacher can see this. Stay on this screen until you submit.
                    {!isFullscreen && (
                      <button
                        type="button"
                        onClick={() => void enterFullscreen()}
                        className="ml-1.5 font-bold underline underline-offset-2"
                      >
                        Return to fullscreen
                      </button>
                    )}
                  </span>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400">
                  Stay on this screen. Switching tabs or leaving fullscreen is
                  recorded and shown to your teacher.
                </p>
              )}

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Question {currentQ + 1} of {sortedQuestions.length}</span>
                  <span>{Object.values(answers).filter((a) => a.answer).length} answered</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / sortedQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question navigation dots */}
              <div className="flex flex-wrap gap-1.5">
                {sortedQuestions.map((q, i) => (
                  <button
                    key={q.questionId}
                    onClick={() => setCurrentQ(i)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      i === currentQ
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                        : answers[q.questionId]?.answer
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {/* Current question */}
              {(() => {
                const q = sortedQuestions[currentQ];
                return (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-800/30">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Question {currentQ + 1}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 dark:text-slate-500">({q.score} pts)</span>
                    </div>
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{q.questionText}</p>

                    {/* Answer input: a typed box for SHORT_ANSWER, choice
                        buttons for everything else (TRUE_FALSE is just a
                        two-option MULTIPLE_CHOICE and needs no separate UI). */}
                    {q.type === "SHORT_ANSWER" ? (
                      <textarea
                        value={answers[q.questionId]?.answer ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [q.questionId]: { answer: e.target.value },
                          }))
                        }
                        rows={3}
                        placeholder="Type your answer…"
                        className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-800"
                      />
                    ) : (
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm cursor-pointer transition-all ${
                              answers[q.questionId]?.selectedOptionIndex === oi
                                ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200 dark:border-indigo-700 dark:bg-indigo-950/40 dark:ring-indigo-900"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.questionId}`}
                              value={oi}
                              checked={answers[q.questionId]?.selectedOptionIndex === oi}
                              onChange={() =>
                                setAnswers((prev) => ({
                                  ...prev,
                                  [q.questionId]: { selectedOptionIndex: oi, answer: opt },
                                }))
                              }
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                            />
                            <span className="text-slate-800 font-medium dark:text-slate-200">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Navigation & Submit */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
                  disabled={currentQ === 0}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Previous
                </button>

                {currentQ < sortedQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ((p) => Math.min(sortedQuestions.length - 1, p + 1))}
                    className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submittingQuiz}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-200 dark:shadow-none"
                  >
                    {submittingQuiz ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Submit Quiz
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STATE: No questions returned */}
          {!startingQuiz && !quizCompleted && attemptData && sortedQuestions.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <HelpCircle className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">No questions available</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">This quiz has no questions yet. Contact your teacher.</p>
              <button
                onClick={() => { leaveQuiz(); }}
                className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          )}

          {/* STATE: Failed to start */}
          {!startingQuiz && !quizCompleted && !attemptData && (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="mx-auto h-10 w-10 text-rose-400 dark:text-rose-500" />
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">Could not start quiz</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">You may have used all attempts or the quiz is not available.</p>
              <button
                onClick={() => leaveQuiz()}
                className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          )}
        </div>
    </div>
  );
}
