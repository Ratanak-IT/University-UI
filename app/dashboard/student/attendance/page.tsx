"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  AlertCircle,
  UserCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import {
  useGetStudentProfileQuery,
  useGetStudentAttendanceQuery,
} from "@/lib/redux/apiSlice";
import ModernSelect from "@/components/shared/ModernSelect";

interface GroupedAttendance {
  classroomId: string;
  course: string;
  code: string;
  attended: number;
  total: number;
  rate: number;
}

const rateColor = (r: number) =>
  r >= 90
    ? "text-emerald-600 dark:text-emerald-400"
    : r >= 80
    ? "text-amber-600 dark:text-amber-400"
    : "text-rose-600 dark:text-rose-400";

const barColor = (r: number) =>
  r >= 90 ? "bg-emerald-500" : r >= 80 ? "bg-amber-500" : "bg-rose-500";

export default function StudentAttendancePage() {
  // A notification (marked absent/late) links here with ?classroomId= so the
  // click lands pre-filtered to that class, not the unfiltered full history.
  const searchParams = useSearchParams();
  const [filterClassroom, setFilterClassroom] = useState<string>(
    () => searchParams.get("classroomId") || "ALL"
  );

  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId || "";

  const { data: attendanceLogs = [], isLoading: loadingLogs } = useGetStudentAttendanceQuery(
    { studentId },
    { skip: !studentId }
  );

  const loading = loadingProfile || loadingLogs;

  const courseSummaries: GroupedAttendance[] = (() => {
    if (!attendanceLogs || attendanceLogs.length === 0) return [];
    const groups: Record<
      string,
      { course: string; code: string; attended: number; total: number }
    > = {};

    attendanceLogs.forEach((log) => {
      const key = log.classroomId;
      if (!groups[key]) {
        groups[key] = {
          course: log.subjectName || log.className || "Classroom",
          code: log.className || "—",
          attended: 0,
          total: 0,
        };
      }
      groups[key].total += 1;
      if (
        log.status === "PRESENT" ||
        log.status === "LATE" ||
        log.status === "EXCUSED"
      ) {
        groups[key].attended += 1;
      }
    });

    return Object.entries(groups).map(([classroomId, g]) => ({
      classroomId,
      course: g.course,
      code: g.code,
      attended: g.attended,
      total: g.total,
      rate: g.total > 0 ? Math.round((g.attended / g.total) * 100) : 0,
    }));
  })();

  const totalAttended = courseSummaries.reduce((s, r) => s + r.attended, 0);
  const totalClasses = courseSummaries.reduce((s, r) => s + r.total, 0);
  const overallRate =
    totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  const filteredLogs =
    filterClassroom === "ALL"
      ? attendanceLogs
      : attendanceLogs.filter((log) => log.classroomId === filterClassroom);

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <UserCheck className="h-4 w-4" />
            Attendance History
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            My Attendance Records
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading..."
              : `Overall Attendance: ${overallRate}% · Minimum 80% required for final exams.`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>
      ) : attendanceLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <UserCheck className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <p className="mt-3 text-lg font-bold text-slate-800 dark:text-slate-200">
            No attendance records found
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            There are no recorded attendance logs registered for your classes yet.
          </p>
        </div>
      ) : (
        <>
          {/* Overall + per-course summary */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Overall Attendance</p>
              <p className={`mt-1 text-3xl font-bold ${rateColor(overallRate)}`}>{overallRate}%</p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {totalAttended} of {totalClasses} sessions
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${barColor(overallRate)}`}
                  style={{ width: `${overallRate}%` }}
                />
              </div>
              {overallRate < 80 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Below the 80% exam requirement
                </div>
              )}
            </div>

            {courseSummaries.map((c) => (
              <div
                key={c.classroomId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <BookOpen className="h-3.5 w-3.5" />
                  {c.code}
                </div>
                <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-slate-100" title={c.course}>
                  {c.course}
                </p>
                <p className={`mt-1 text-2xl font-bold ${rateColor(c.rate)}`}>{c.rate}%</p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  {c.attended} of {c.total} sessions
                </p>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${barColor(c.rate)}`} style={{ width: `${c.rate}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Daily Attendance Table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                Detailed Log History
              </h2>
              
              {/* Classroom filter dropdown */}
              <div className="w-52">
                <ModernSelect
                  value={filterClassroom}
                  onChange={(val) => setFilterClassroom(val)}
                  options={[
                    { value: "ALL", label: "All Classes" },
                    ...courseSummaries.map((c) => ({
                      value: c.classroomId,
                      label: c.course,
                    })),
                  ]}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 px-4">Subject / Class</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.attendanceId}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-3.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                        {log.attendanceDate}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {log.subjectName || log.className}
                      </td>
                      <td className="py-3.5 px-4">
                        {log.status === "PRESENT" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Present
                          </span>
                        )}
                        {log.status === "ABSENT" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                            <XCircle className="h-3.5 w-3.5" />
                            Absent
                          </span>
                        )}
                        {log.status === "LATE" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock className="h-3.5 w-3.5" />
                            Late
                          </span>
                        )}
                        {log.status === "EXCUSED" && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                            <HelpCircle className="h-3.5 w-3.5" />
                            Excused
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-xs text-slate-500 dark:text-slate-400">
                        {log.remark || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
