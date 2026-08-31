"use client";

import { Loader2, X, ClipboardList } from "lucide-react";
import { useGetQuizAttemptsQuery } from "@/lib/redux/apiSlice";

interface QuizResultsModalProps {
  quizId: string | null;
  quizTitle?: string;
  onClose: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  EXPIRED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

export default function QuizResultsModal({ quizId, quizTitle, onClose }: QuizResultsModalProps) {
  const { data: attempts = [], isLoading, isError } = useGetQuizAttemptsQuery(quizId || "", {
    skip: !quizId,
  });

  if (!quizId) return null;

  const submittedCount = attempts.filter((a) => a.status === "SUBMITTED").length;
  const avgScore =
    submittedCount > 0
      ? attempts
          .filter((a) => a.status === "SUBMITTED" && a.earnedScore != null && a.totalScore)
          .reduce((sum, a, _i, arr) => sum + (a.earnedScore! / a.totalScore!) * 100 / arr.length, 0)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              <ClipboardList className="h-5 w-5 text-indigo-600" />
              Quiz Results
            </h2>
            {quizTitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{quizTitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isLoading && !isError && attempts.length > 0 && (
          <div className="flex items-center gap-6 border-b border-slate-200 bg-slate-50/50 px-6 py-3 text-sm dark:border-slate-800 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-slate-100">{submittedCount}</span> / {attempts.length} submitted
            </span>
            {avgScore != null && (
              <span className="text-slate-600 dark:text-slate-300">
                Avg score: <span className="font-bold text-slate-900 dark:text-slate-100">{avgScore.toFixed(1)}%</span>
              </span>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading results...
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400">
              Failed to load results.
            </div>
          ) : attempts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
              No student has attempted this quiz yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {attempts.map((a) => (
                <li key={a.attemptId} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {a.studentName || "Unknown student"}
                    </p>
                    {a.studentCode && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{a.studentCode}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {a.status === "SUBMITTED" && a.earnedScore != null && a.totalScore != null && (
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {a.earnedScore} / {a.totalScore}
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        STATUS_STYLES[a.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {a.status === "SUBMITTED" ? "Submitted" : a.status === "IN_PROGRESS" ? "In progress" : "Expired"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
