"use client";

import { useMemo, useState } from "react";
import { Ban, Check, Loader2, Save, Search, Users } from "lucide-react";
import {
  MARKS,
  attendanceToneClass,
  formatSessionDate,
  shortTime,
  SESSION_STATUS_CLASS,
  SESSION_STATUS_LABEL,
} from "./attendanceDisplay";
import PersonAvatar from "@/components/shared/PersonAvatar";
import type {
  AttendanceStatus,
  SessionRegister as Register,
} from "@/lib/types/attendance";

const PAGE_SIZE = 10;

/** studentId -> the mark the user has set but not yet saved. */
export type MarkDrafts = Record<
  string,
  { status: AttendanceStatus; minutesLate?: number | null; note?: string | null }
>;

export default function SessionRegister({
  register,
  drafts,
  onDraftChange,
  onSave,
  onCancelSession,
  isSaving,
}: {
  register: Register;
  drafts: MarkDrafts;
  onDraftChange: (
    studentId: string,
    draft: MarkDrafts[string] | undefined
  ) => void;
  onSave: () => void;
  onCancelSession: () => void;
  isSaving: boolean;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const session = register.session;
  const cancelled = session.status === "CANCELLED";

  const students = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return register.students;
    return register.students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q)
    );
  }, [register.students, search]);

  const lastPage = Math.max(Math.ceil(students.length / PAGE_SIZE) - 1, 0);
  const currentPage = Math.min(page, lastPage);
  const firstIndex = currentPage * PAGE_SIZE;
  const visible = students.slice(firstIndex, firstIndex + PAGE_SIZE);

  // Counted across everyone, not just the visible page — the whole point is
  // knowing who is still missing a mark before you hit save.
  const counts = useMemo(() => {
    const tally = { PRESENT: 0, LATE: 0, ABSENT: 0, EXCUSED: 0, unmarked: 0 };
    for (const student of register.students) {
      const status = drafts[student.studentId]?.status ?? student.status;
      if (status) tally[status] += 1;
      else tally.unmarked += 1;
    }
    return tally;
  }, [register.students, drafts]);

  const dirtyCount = Object.keys(drafts).length;

  const markEveryone = (status: AttendanceStatus) => {
    for (const student of register.students) {
      onDraftChange(student.studentId, { status });
    }
  };

  return (
    <div className="space-y-4">
      {/* ---- session header ---- */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {formatSessionDate(session.sessionDate)}
            </h2>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {shortTime(session.startTime)}
              {session.endTime ? `–${shortTime(session.endTime)}` : ""}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                SESSION_STATUS_CLASS[session.status]
              }`}
            >
              {SESSION_STATUS_LABEL[session.status]}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {register.className}
            {register.subjectName ? ` · ${register.subjectName}` : ""}
            {session.topic ? ` · ${session.topic}` : ""}
          </p>
          {cancelled && session.cancellationReason && (
            <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              Cancelled — {session.cancellationReason}. It does not count towards
              attendance.
            </p>
          )}
        </div>

        {!cancelled && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => markEveryone("PRESENT")}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Check className="h-4 w-4" />
              All present
            </button>
            <button
              type="button"
              onClick={onCancelSession}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Ban className="h-4 w-4" />
              Cancel class
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || dirtyCount === 0}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving
                ? "Saving…"
                : dirtyCount > 0
                  ? `Save ${dirtyCount} change${dirtyCount === 1 ? "" : "s"}`
                  : "Saved"}
            </button>
          </div>
        )}
      </div>

      {/* ---- live tally ---- */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <TallyChip
          label="Present"
          value={counts.PRESENT}
          tone="text-emerald-600 dark:text-emerald-400"
        />
        <TallyChip
          label="Late"
          value={counts.LATE}
          tone="text-amber-600 dark:text-amber-400"
        />
        <TallyChip
          label="Absent"
          value={counts.ABSENT}
          tone="text-rose-600 dark:text-rose-400"
        />
        <TallyChip
          label="Excused"
          value={counts.EXCUSED}
          tone="text-sky-600 dark:text-sky-400"
        />
        <TallyChip
          label="Not marked"
          value={counts.unmarked}
          tone={
            counts.unmarked > 0
              ? "text-amber-600 dark:text-amber-400"
              : "text-slate-400 dark:text-slate-500"
          }
        />
      </div>

      {/* ---- roster ---- */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/60 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Find a student…"
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
          <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
            <Users className="mr-1 inline h-3.5 w-3.5" />
            {students.length}
          </span>
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {visible.map((student) => {
            const draft = drafts[student.studentId];
            const status = draft?.status ?? student.status;
            const changed = draft !== undefined;

            return (
              <li
                key={student.studentId}
                className={`px-4 py-3 transition-colors ${
                  changed ? "bg-indigo-50/60 dark:bg-indigo-950/30" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <PersonAvatar
                      name={student.fullName}
                      avatarUrl={student.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0 leading-tight">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {student.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {student.studentCode}
                      </p>
                    </div>
                  </div>

                  {/* Course standing, so an exception is judged in context. */}
                  <span
                    className={`shrink-0 text-xs font-bold ${attendanceToneClass(
                      student.attendancePercent
                    )}`}
                    title="Attendance so far in this course"
                  >
                    {student.attendancePercent === null
                      ? "—"
                      : `${student.attendancePercent.toFixed(0)}%`}
                  </span>

                  <div
                    role="radiogroup"
                    aria-label={`Mark ${student.fullName}`}
                    className="flex shrink-0 gap-1 rounded-xl border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800"
                  >
                    {MARKS.map((mark) => {
                      const active = status === mark.value;
                      return (
                        <button
                          key={mark.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          aria-label={mark.label}
                          title={mark.label}
                          disabled={cancelled}
                          onClick={() =>
                            onDraftChange(
                              student.studentId,
                              // Tapping the current mark clears it back to
                              // unmarked, which has to stay reachable rather
                              // than being a one-way door.
                              active && changed ? undefined : { status: mark.value }
                            )
                          }
                          className={`h-9 w-9 rounded-lg text-sm font-bold transition-colors disabled:opacity-40 ${
                            active
                              ? mark.active
                              : "text-slate-500 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-900"
                          }`}
                        >
                          {mark.short}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Only the mark that needs detail asks for it. */}
                {status === "LATE" && !cancelled && (
                  <div className="mt-2 flex items-center gap-2 pl-12">
                    <label
                      className="text-xs text-slate-500 dark:text-slate-400"
                      htmlFor={`late-${student.studentId}`}
                    >
                      Minutes late
                    </label>
                    <input
                      id={`late-${student.studentId}`}
                      type="number"
                      min={0}
                      value={draft?.minutesLate ?? student.minutesLate ?? ""}
                      onChange={(e) =>
                        onDraftChange(student.studentId, {
                          status: "LATE",
                          minutesLate:
                            e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      className="h-8 w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                )}

                {status === "EXCUSED" && !cancelled && (
                  <div className="mt-2 flex items-center gap-2 pl-12">
                    <label
                      className="text-xs text-slate-500 dark:text-slate-400"
                      htmlFor={`excuse-${student.studentId}`}
                    >
                      Reason
                    </label>
                    <input
                      id={`excuse-${student.studentId}`}
                      value={draft?.note ?? student.excuseReference ?? ""}
                      placeholder="Medical certificate, letter…"
                      onChange={(e) =>
                        onDraftChange(student.studentId, {
                          status: "EXCUSED",
                          note: e.target.value,
                        })
                      }
                      className="h-8 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                  </div>
                )}
              </li>
            );
          })}

          {visible.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              {register.students.length === 0
                ? "No students are enrolled in this classroom."
                : "No students match your search."}
            </li>
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/60 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing {students.length === 0 ? 0 : firstIndex + 1} to{" "}
            {firstIndex + visible.length} of {students.length} students
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(Math.max(currentPage - 1, 0))}
              disabled={currentPage === 0}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Prev
            </button>
            <span className="px-2 text-xs text-slate-500 dark:text-slate-400">
              {currentPage + 1} / {lastPage + 1}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(currentPage + 1, lastPage))}
              disabled={currentPage >= lastPage}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TallyChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className={`text-lg font-bold ${tone}`}>{value}</p>
      <p className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
