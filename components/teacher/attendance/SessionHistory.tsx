"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useGetSessionsQuery } from "@/lib/redux/apiSlice";
import {
  formatSessionDate,
  shortTime,
  SESSION_STATUS_CLASS,
  SESSION_STATUS_LABEL,
} from "./attendanceDisplay";
import type { ClassSession } from "@/lib/types/attendance";
import Pagination from "@/components/teacher/my-student/Pagination";

const PAGE_SIZE = 5;

/** Every meeting of the class, so a gap in the register is visible as a gap. */
export default function SessionHistory({
  classroomId,
  onOpen,
}: {
  classroomId: string;
  onOpen: (session: ClassSession) => void;
}) {
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetSessionsQuery(
    { classroomId },
    { skip: !classroomId }
  );

  const sortedSessions = useMemo(() => {
    return [...(data ?? [])].sort((a, b) => {
      if (a.sessionDate !== b.sessionDate) {
        return a.sessionDate > b.sessionDate ? -1 : 1;
      }
      return a.startTime > b.startTime ? -1 : 1;
    });
  }, [data]);

  const filteredSessions = useMemo(() => {
    if (!dateFilter) return sortedSessions;
    return sortedSessions.filter((s) => s.sessionDate === dateFilter);
  }, [sortedSessions, dateFilter]);

  const totalSessions = filteredSessions.length;
  const totalPages = Math.max(1, Math.ceil(totalSessions / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const visibleSessions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredSessions.slice(start, start + PAGE_SIZE);
  }, [filteredSessions, safePage]);

  function handleDateFilterChange(value: string) {
    setDateFilter(value);
    setPage(1);
  }

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
        Could not load the session history. Please try again.
      </p>
    );
  }

  const sessions = data ?? [];

  if (sessions.length === 0) {
    return (
      <p className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No sessions yet. Take today&apos;s attendance to open the first one.
      </p>
    );
  }

  const rangeStart = totalSessions === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, totalSessions);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-center gap-2">
          <label
            htmlFor="session-date-filter"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400"
          >
            Filter by date
          </label>
          <input
            id="session-date-filter"
            type="date"
            value={dateFilter}
            onChange={(e) => handleDateFilterChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => handleDateFilterChange("")}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Newest sessions first
        </p>
      </div>

      {totalSessions === 0 ? (
        <p className="px-5 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          No sessions found for that date.
        </p>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Date &amp; time</th>
              <th className="px-5 py-3 font-semibold">Topic</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Marked</th>
              <th className="px-5 py-3 font-semibold">P / L / A / E</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visibleSessions.map((s) => {
              const complete = s.rosterSize > 0 && s.markedCount >= s.rosterSize;
              return (
                <tr
                  key={s.sessionId}
                  className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatSessionDate(s.sessionDate)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {shortTime(s.startTime)}
                      {s.endTime ? `–${shortTime(s.endTime)}` : ""} ·{" "}
                      {s.type.toLowerCase()}
                    </p>
                  </td>
                  <td className="max-w-56 truncate px-5 py-3 text-slate-700 dark:text-slate-300">
                    {s.topic ?? (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                        SESSION_STATUS_CLASS[s.status]
                      }`}
                      title={s.cancellationReason ?? undefined}
                    >
                      {SESSION_STATUS_LABEL[s.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {s.status === "CANCELLED" ? (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    ) : (
                      <span
                        className={
                          complete
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }
                      >
                        {s.markedCount}/{s.rosterSize}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {s.status === "CANCELLED" ? (
                      <span className="text-slate-400 dark:text-slate-500">—</span>
                    ) : (
                      <span className="font-mono text-xs">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {s.presentCount}
                        </span>
                        {" / "}
                        <span className="text-amber-600 dark:text-amber-400">
                          {s.lateCount}
                        </span>
                        {" / "}
                        <span className="text-rose-600 dark:text-rose-400">
                          {s.absentCount}
                        </span>
                        {" / "}
                        <span className="text-sky-600 dark:text-sky-400">
                          {s.excusedCount}
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="w-24 px-5 py-3">
                    <button
                      type="button"
                      onClick={() => onOpen(s)}
                      className="rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {totalSessions === 0
            ? "No sessions found"
            : `Showing ${rangeStart}–${rangeEnd} of ${totalSessions} sessions`}
        </p>
        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
