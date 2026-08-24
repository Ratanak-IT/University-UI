"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useGetAttendanceSummaryQuery } from "@/lib/redux/apiSlice";
import PersonAvatar from "@/components/shared/PersonAvatar";
import { attendanceToneClass } from "./attendanceDisplay";

/**
 * Where each student stands across the whole course, and whether the policy
 * lets them sit the final exam.
 */
export default function AttendanceOverview({
  classroomId,
}: {
  classroomId: string;
}) {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetAttendanceSummaryQuery(classroomId, {
    skip: !classroomId,
  });

  const rows = useMemo(() => {
    const all = data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q)
    );
  }, [data, search]);

  const barred = useMemo(
    () => rows.filter((s) => !s.eligibleForExam),
    [rows]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-6 text-center text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
        Could not load the attendance overview. Please try again.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {barred.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-900 dark:bg-rose-950/40">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <p className="text-sm text-rose-700 dark:text-rose-300">
            <span className="font-bold">
              {barred.length} student{barred.length === 1 ? "" : "s"}
            </span>{" "}
            {barred.length === 1 ? "is" : "are"} below the attendance minimum and
            cannot sit the final exam:{" "}
            {barred.map((s) => s.fullName).slice(0, 5).join(", ")}
            {barred.length > 5 ? ` and ${barred.length - 5} more` : ""}.
          </p>
        </div>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search students…"
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 sm:max-w-sm"
      />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-5 py-3 font-semibold">Present</th>
                <th className="px-5 py-3 font-semibold">Late</th>
                <th className="px-5 py-3 font-semibold">Absent</th>
                <th className="px-5 py-3 font-semibold">Excused</th>
                <th className="px-5 py-3 font-semibold">Not marked</th>
                <th className="px-5 py-3 font-semibold">Attendance</th>
                <th className="px-5 py-3 font-semibold">Exam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((s) => (
                <tr
                  key={s.studentId}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <PersonAvatar
                        name={s.fullName}
                        avatarUrl={s.avatarUrl}
                        size="sm"
                      />
                      <div className="min-w-0 leading-tight">
                        <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                          {s.fullName}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {s.studentCode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                    {s.present}
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                    {s.late}
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                    {s.absent}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                    {s.excused}
                  </td>
                  <td className="px-5 py-3">
                    {s.unmarked > 0 ? (
                      <span
                        className="font-semibold text-amber-600 dark:text-amber-400"
                        title="Sessions that were held but where this student was never marked"
                      >
                        {s.unmarked}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-base font-bold ${attendanceToneClass(
                        s.attendancePercent
                      )}`}
                    >
                      {s.attendancePercent === null
                        ? "—"
                        : `${s.attendancePercent.toFixed(1)}%`}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {s.eligibleForExam ? (
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        Eligible
                      </span>
                    ) : (
                      <span
                        className="text-sm font-bold text-rose-600 dark:text-rose-400"
                        title={`Below the ${s.minPercentToSitExam}% minimum`}
                      >
                        Barred
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    {(data ?? []).length === 0
                      ? "No attendance has been taken for this classroom yet."
                      : "No students match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
