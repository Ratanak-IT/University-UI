"use client";

import { useMemo, useState } from "react";
import { Loader2, X, ClipboardList, Search } from "lucide-react";
import { useGetQuizAttemptsQuery, QuizAttemptSummary } from "@/lib/redux/apiSlice";

interface QuizResultsModalProps {
  quizId: string | null;
  quizTitle?: string;
  onClose: () => void;
  /**
   * Opening results from inside one specific classroom's Quizzes tab already
   * answers "which section" — the filter dropdown (and per-row classroom
   * badge) only earns its place when opened from the general quiz list,
   * where a quiz released to several sections needs a way to narrow down.
   */
  classroomId?: string;
}

type FilterId = "all" | "SUBMITTED" | "IN_PROGRESS" | "NOT_STARTED" | "EXPIRED";

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  IN_PROGRESS: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  EXPIRED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  NOT_STARTED: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  IN_PROGRESS: "In progress",
  EXPIRED: "Expired",
  NOT_STARTED: "Not started",
};

export default function QuizResultsModal({ quizId, quizTitle, onClose, classroomId }: QuizResultsModalProps) {
  const { data: attempts = [], isLoading, isError } = useGetQuizAttemptsQuery(quizId || "", {
    skip: !quizId,
  });

  const [filter, setFilter] = useState<FilterId>("all");
  const [classroomFilter, setClassroomFilter] = useState<string>(classroomId ?? "all");
  const [search, setSearch] = useState("");

  // Already scoped to one classroom by the caller — nothing to narrow down,
  // so the picker (and the badge that would otherwise repeat that same
  // classroom on every row) simply doesn't apply here.
  const lockedToClassroom = !!classroomId;

  // A quiz released to more than one section needs a way to narrow to just
  // one — built from whatever classrooms actually show up in the roster,
  // so it never lists a section this quiz wasn't released to.
  const classrooms = useMemo(() => {
    if (lockedToClassroom) return [];
    const seen = new Map<string, string>();
    for (const a of attempts) {
      if (!seen.has(a.classroomId)) seen.set(a.classroomId, a.className || "Classroom");
    }
    return Array.from(seen, ([id, name]) => ({ id, name }));
  }, [attempts, lockedToClassroom]);

  const counts = useMemo(() => {
    const c = { all: attempts.length, SUBMITTED: 0, IN_PROGRESS: 0, NOT_STARTED: 0, EXPIRED: 0 };
    for (const a of attempts) c[a.status] += 1;
    return c;
  }, [attempts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return attempts.filter((a: QuizAttemptSummary) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (classroomFilter !== "all" && a.classroomId !== classroomFilter) return false;
      if (!q) return true;
      return (
        (a.studentName || "").toLowerCase().includes(q) ||
        (a.studentCode || "").toLowerCase().includes(q)
      );
    });
  }, [attempts, filter, classroomFilter, search]);

  if (!quizId) return null;

  const avgScore =
    counts.SUBMITTED > 0
      ? attempts
          .filter((a) => a.status === "SUBMITTED" && a.earnedScore != null && a.totalScore)
          .reduce((sum, a, _i, arr) => sum + (a.earnedScore! / a.totalScore!) * 100 / arr.length, 0)
      : null;

  const FILTERS: { id: FilterId; label: string; count: number }[] = [
    { id: "all", label: "All", count: counts.all },
    { id: "SUBMITTED", label: "Submitted", count: counts.SUBMITTED },
    { id: "IN_PROGRESS", label: "In progress", count: counts.IN_PROGRESS },
    { id: "NOT_STARTED", label: "Not started", count: counts.NOT_STARTED },
    { id: "EXPIRED", label: "Expired", count: counts.EXPIRED },
  ];

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
          <>
            <div className="flex items-center gap-6 border-b border-slate-200 bg-slate-50/50 px-6 py-3 text-sm dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-slate-100">{counts.SUBMITTED}</span> / {counts.all} submitted
              </span>
              {avgScore != null && (
                <span className="text-slate-600 dark:text-slate-300">
                  Avg score: <span className="font-bold text-slate-900 dark:text-slate-100">{avgScore.toFixed(1)}%</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-6 py-3 dark:border-slate-800">
              <div className="flex flex-wrap gap-1">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      filter === f.id
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {f.label}
                    <span className={`ml-1 ${filter === f.id ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"}`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {classrooms.length > 1 && (
                <select
                  value={classroomFilter}
                  onChange={(e) => setClassroomFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="all">All classrooms</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}

              <div className="ml-auto flex min-w-40 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800 sm:max-w-xs">
                <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find a student…"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                />
              </div>
            </div>
          </>
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
              This quiz hasn&apos;t been released to any classroom yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400">
              {search.trim() ? "No student matches your search." : "No students in this category."}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((a) => (
                <li key={`${a.classroomId}-${a.studentId}`} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {a.studentName || "Unknown student"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {a.studentCode}
                      {classrooms.length > 1 && a.className && (
                        <span className="ml-1.5 rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {a.className}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {/*
                      Flagged, not judged. The system cannot tell a notification
                      from cheating, so it reports the count and leaves the
                      decision with the person who knows the student.
                    */}
                    {a.focusLossCount > 0 && (
                      <span
                        className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
                        title={
                          `Left the quiz screen ${a.focusLossCount} time` +
                          `${a.focusLossCount === 1 ? "" : "s"}` +
                          (a.lastFocusLossAt
                            ? `, last at ${new Date(a.lastFocusLossAt).toLocaleTimeString()}`
                            : "") +
                          ". Switching tab or leaving fullscreen is recorded; it is not proof of anything on its own."
                        }
                      >
                        ⚠ {a.focusLossCount}
                      </span>
                    )}
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
                      {STATUS_LABEL[a.status] || a.status}
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
