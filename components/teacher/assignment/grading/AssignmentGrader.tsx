"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Inbox,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "@/components/shared/Toast";
import PersonAvatar from "@/components/shared/PersonAvatar";
import PrivateCommentThread from "@/components/shared/PrivateCommentThread";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";
import { apiErrorMessage } from "@/lib/api/errors";
import {
  useGetAssignmentDetailQuery,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
} from "@/lib/redux/apiSlice";
import type { SubmissionResponse } from "@/lib/api/assignment";

const NO_SUBMISSIONS: SubmissionResponse[] = [];

/** MISSING means "on the roster, never handed in" — the backend sends it. */
type RowStatus = "GRADED" | "SUBMITTED" | "LATE" | "MISSING";

type GradeRow = {
  studentId: string;
  studentCode: string;
  fullName: string;
  avatarUrl?: string;
  submission: SubmissionResponse | null;
  status: RowStatus;
  score: number | null;
};

type FilterId = "todo" | "all" | "missing" | "graded";

const STATUS_STYLE: Record<RowStatus, string> = {
  GRADED:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  SUBMITTED: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400",
  LATE: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  MISSING: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const STATUS_LABEL: Record<RowStatus, string> = {
  GRADED: "Graded",
  SUBMITTED: "Submitted",
  LATE: "Late",
  MISSING: "Not handed in",
};

const VIDEO_RE = /\.(mp4|webm|mov|m4v|avi|mkv)$/i;

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AssignmentGrader({
  assignmentId,
}: {
  assignmentId: string;
}) {
  const { data: assignment, isLoading: loadingAssignment } =
    useGetAssignmentDetailQuery(assignmentId);

  const { data: submissionData, isLoading: loadingSubs } =
    useGetAssignmentSubmissionsQuery(assignmentId);
  const submissions = submissionData ?? NO_SUBMISSIONS;

  const [gradeSubmission, { isLoading: isSaving }] = useGradeSubmissionMutation();

  /** Null until the teacher picks a tab, so the default can follow the data. */
  const [pickedFilter, setPickedFilter] = useState<FilterId | null>(null);
  const [search, setSearch] = useState("");
  const [pickedStudentId, setPickedStudentId] = useState("");
  /** The score/feedback being typed, tagged with the student it belongs to. */
  const [draft, setDraft] = useState<{
    studentId: string;
    score: string;
    feedback: string;
  } | null>(null);
  /** The attachment open in the secure viewer, if any. */
  const [viewing, setViewing] = useState<{
    name: string;
    url: string;
    isVideo: boolean;
  } | null>(null);

  const maxScore = assignment?.maxScore ?? 100;

  // The endpoint returns the whole roster, MISSING rows included, so the list
  // is a straight map — no client-side merge and no second request.
  const rows: GradeRow[] = useMemo(
    () =>
      submissions.map((sub) => ({
        studentId: sub.studentId,
        studentCode: sub.studentCode,
        fullName: sub.studentName,
        avatarUrl: sub.avatarUrl,
        submission: sub.submissionId ? sub : null,
        status: sub.status as RowStatus,
        score: sub.score,
      })),
    [submissions]
  );

  const counts = useMemo(() => {
    let graded = 0;
    let missing = 0;
    let todo = 0;
    for (const r of rows) {
      if (r.status === "GRADED") graded += 1;
      else if (r.status === "MISSING") missing += 1;
      else todo += 1;
    }
    return { graded, missing, todo, all: rows.length };
  }, [rows]);

  // Opening on "To grade" is right when there is a queue. When there isn't —
  // nobody has handed in yet, or everything is already marked — that tab is
  // empty, and dropping a teacher onto a blank screen reads as a broken page.
  // Fall back to the whole roster so the class is always visible.
  const filter: FilterId = pickedFilter ?? (counts.todo > 0 ? "todo" : "all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "todo" && (r.status === "GRADED" || r.status === "MISSING"))
        return false;
      if (filter === "graded" && r.status !== "GRADED") return false;
      if (filter === "missing" && r.status !== "MISSING") return false;
      if (!q) return true;
      return (
        r.fullName.toLowerCase().includes(q) ||
        r.studentCode.toLowerCase().includes(q)
      );
    });
  }, [rows, filter, search]);

  // Derived selection: a filter change can drop the current student out of the
  // list, and falling back to the first remaining one is a pure function of
  // that list. Writing it back with setState in an effect is the pattern that
  // froze the attendance screen.
  const selectedId = filtered.some((r) => r.studentId === pickedStudentId)
    ? pickedStudentId
    : (filtered[0]?.studentId ?? "");

  // An empty list has several very different causes, and congratulating a
  // teacher whose class simply hasn't handed anything in is worse than saying
  // nothing at all.
  const emptyMessage = search.trim()
    ? "No student matches your search."
    : counts.all === 0
      ? "No students are enrolled in this classroom yet."
      : filter === "todo"
        ? counts.graded > 0
          ? "Everything handed in has been graded."
          : `Nobody has handed anything in yet — ${counts.missing} still to come.`
        : filter === "missing"
          ? "Everyone has handed something in."
          : filter === "graded"
            ? "Nothing has been graded yet."
            : "No students to show.";

  const selectedIndex = filtered.findIndex((r) => r.studentId === selectedId);
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  // Same trick for the draft: tagging it with a student id makes it
  // self-resetting when the selection moves, so no effect has to clear it.
  const activeDraft = draft?.studentId === selectedId ? draft : null;
  const scoreValue =
    activeDraft?.score ??
    (selected?.score !== null && selected?.score !== undefined
      ? String(selected.score)
      : "");
  const feedbackValue =
    activeDraft?.feedback ?? selected?.submission?.feedback ?? "";

  const setScore = (score: string) =>
    setDraft({ studentId: selectedId, score, feedback: feedbackValue });
  const setFeedback = (feedback: string) =>
    setDraft({ studentId: selectedId, score: scoreValue, feedback });

  const goTo = useCallback(
    (index: number) => {
      const next = filtered[index];
      if (next) setPickedStudentId(next.studentId);
    },
    [filtered]
  );

  const handleSave = useCallback(
    async (advance: boolean) => {
      // Guarding on the id rather than the row also narrows it to a string:
      // a MISSING row has no submission to grade.
      const submissionId = selected?.submission?.submissionId;
      if (!submissionId) return;

      const parsed = Number(scoreValue);
      if (scoreValue === "" || Number.isNaN(parsed) || parsed < 0) {
        toast.error("Enter a score of 0 or more.");
        return;
      }
      if (parsed > maxScore) {
        toast.error(`Score cannot be above the maximum of ${maxScore}.`);
        return;
      }

      // Captured before the save, because grading changes the list: under the
      // "To grade" filter the graded student drops out, and the derived
      // selection would otherwise fall back to the top of the list — sending
      // the teacher back to student 1 after grading student 3.
      const nextStudentId = filtered[selectedIndex + 1]?.studentId ?? null;
      const name = selected?.fullName;

      try {
        await gradeSubmission({
          submissionId,
          score: parsed,
          feedback: feedbackValue,
        }).unwrap();

        setDraft(null);
        toast.success(`Saved ${name}'s grade.`);

        if (advance && nextStudentId) setPickedStudentId(nextStudentId);
      } catch (err) {
        toast.error(apiErrorMessage(err, "Could not save the grade."));
      }
    },
    [
      selected,
      scoreValue,
      feedbackValue,
      maxScore,
      gradeSubmission,
      filtered,
      selectedIndex,
    ]
  );

  // Grading is a keyboard job: ctrl/cmd+Enter saves and moves on, the arrows
  // walk the list without reaching for the mouse.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        void handleSave(true);
        return;
      }
      if (typing) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        goTo(selectedIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        goTo(selectedIndex - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleSave, goTo, selectedIndex]);

  if (loadingAssignment || loadingSubs) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          Assignment not found
        </p>
        <Link
          href="/dashboard/teacher/assignments"
          className="mt-3 inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400"
        >
          Back to assignments
        </Link>
      </div>
    );
  }

  const progress = counts.all === 0 ? 0 : (counts.graded / counts.all) * 100;

  const FILTERS: { id: FilterId; label: string; count: number }[] = [
    { id: "todo", label: "To grade", count: counts.todo },
    { id: "all", label: "All", count: counts.all },
    { id: "missing", label: "Not handed in", count: counts.missing },
    { id: "graded", label: "Graded", count: counts.graded },
  ];

  return (
    <div className="space-y-5">
      {/* ---- header ---- */}
      <div>
        <Link
          href="/dashboard/teacher/assignments"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-4 w-4" />
          All assignments
        </Link>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {assignment.title}
            </h1>
            <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                Due {formatWhen(assignment.dueDate)}
              </span>
              <span>{maxScore} points</span>
            </div>
          </div>

          {/* Progress is the answer to "am I done yet?", so it leads. */}
          <div className="w-full max-w-xs">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {counts.graded} of {counts.all} graded
              </span>
              {counts.todo > 0 && (
                <span className="text-slate-500 dark:text-slate-400">
                  {counts.todo} waiting
                </span>
              )}
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---- filters ---- */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setPickedFilter(f.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                filter === f.id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {f.label}
              <span
                className={`ml-1.5 text-xs ${
                  filter === f.id
                    ? "text-indigo-100"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex min-w-50 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800 sm:max-w-xs">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find a student…"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[340px_1fr]">
        {/* ---- student list ---- */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
            {filtered.map((row) => {
              const active = row.studentId === selectedId;
              return (
                <li key={row.studentId}>
                  <button
                    type="button"
                    onClick={() => setPickedStudentId(row.studentId)}
                    aria-current={active ? "true" : undefined}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      active
                        ? "bg-indigo-50 dark:bg-indigo-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <PersonAvatar
                      name={row.fullName}
                      avatarUrl={row.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1 leading-tight">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {row.fullName}
                      </p>
                      <span
                        className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          STATUS_STYLE[row.status]
                        }`}
                      >
                        {STATUS_LABEL[row.status]}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-slate-700 dark:text-slate-200">
                      {row.score !== null ? row.score : "—"}
                    </span>
                  </button>
                </li>
              );
            })}

            {filtered.length === 0 && (
              <li className="px-4 py-14 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </li>
            )}
          </ul>
        </div>

        {/* ---- grader ---- */}
        {selected ? (
          <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* who, and how to move on */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex min-w-0 items-center gap-3">
                <PersonAvatar
                  name={selected.fullName}
                  avatarUrl={selected.avatarUrl}
                  size="md"
                />
                <div className="min-w-0 leading-tight">
                  <p className="truncate font-bold text-slate-900 dark:text-slate-100">
                    {selected.fullName}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {selected.studentCode}
                    {selected.status === "MISSING"
                      ? " · nothing handed in"
                      : ` · handed in ${formatWhen(selected.submission?.submittedAt)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="mr-1 text-xs text-slate-500 dark:text-slate-400">
                  {selectedIndex + 1} / {filtered.length}
                </span>
                <button
                  type="button"
                  onClick={() => goTo(selectedIndex - 1)}
                  disabled={selectedIndex <= 0}
                  aria-label="Previous student"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(selectedIndex + 1)}
                  disabled={selectedIndex >= filtered.length - 1}
                  aria-label="Next student"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {selected.status === "MISSING" ? (
              <div className="py-12 text-center">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Nothing handed in yet
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  There is no submission to grade for {selected.fullName}.
                </p>
              </div>
            ) : (
              <>
                {/* the work itself */}
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Submitted work
                  </h3>
                  {selected.submission?.files?.length ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {selected.submission.files.map((file) => (
                        // Opens in the secure viewer rather than a new tab, so
                        // the file is read in-page under the same protection
                        // the student's own viewer uses.
                        <button
                          key={file.fileId}
                          type="button"
                          onClick={() =>
                            setViewing({
                              name: file.fileOriginalName,
                              url: file.previewUrl,
                              isVideo: VIDEO_RE.test(file.fileOriginalName),
                            })
                          }
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <FileText className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {file.fileOriginalName}
                          </span>
                          <Eye className="h-4 w-4 shrink-0 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No files attached.
                    </p>
                  )}
                </div>

                {/* the grade */}
                <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 sm:grid-cols-[160px_1fr]">
                  <div>
                    <label
                      htmlFor="grader-score"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                    >
                      Score
                    </label>
                    <div className="relative">
                      <input
                        id="grader-score"
                        type="number"
                        min={0}
                        max={maxScore}
                        step="0.5"
                        value={scoreValue}
                        onChange={(e) => setScore(e.target.value)}
                        key={selectedId}
                        autoFocus
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-14 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                        / {maxScore}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="grader-feedback"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400"
                    >
                      Feedback
                    </label>
                    <textarea
                      id="grader-feedback"
                      rows={3}
                      value={feedbackValue}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Optional comments for the student…"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Save &amp; next
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Save only
                  </button>
                  <span className="text-xs text-slate-400">
                    Ctrl + Enter to save and move on · ↑ ↓ to switch student
                  </span>
                </div>
              </>
            )}
          </div>

          <PrivateCommentThread
            assignmentId={assignmentId}
            target={{ role: "teacher", studentId: selected.studentId }}
            otherPartyName={selected.fullName}
          />
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Inbox className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">
              {counts.all === 0 ? "No students yet" : "Nothing selected"}
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {emptyMessage}
            </p>
          </div>
        )}
      </div>

      <SecureFileViewerModal
        isOpen={viewing !== null}
        onClose={() => setViewing(null)}
        fileName={viewing?.name ?? ""}
        fileUrl={viewing?.url ?? ""}
        isVideo={viewing?.isVideo ?? false}
      />
    </div>
  );
}
