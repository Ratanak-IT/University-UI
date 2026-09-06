"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  UserCheck,
  Calendar,
  XCircle,
  Clock,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { useGetStudentProfileQuery, useGetStudentAttendanceQuery } from "@/lib/redux/apiSlice";
import type { AttendanceRecordResponse } from "@/lib/api/student";
import ModernSelect from "@/components/shared/ModernSelect";
import { StatCardSkeleton, TableRowsSkeleton } from "@/components/shared/Skeletons";

const rateColor = (r: number) =>
  r >= 90
    ? "text-emerald-600 dark:text-emerald-400"
    : r >= 80
    ? "text-amber-600 dark:text-amber-400"
    : "text-rose-600 dark:text-rose-400";

const barColor = (r: number) =>
  r >= 90 ? "bg-emerald-500" : r >= 80 ? "bg-amber-500" : "bg-rose-500";

/** A record tagged with which course it belongs to, for the flattened table. */
type FlatRecord = AttendanceRecordResponse;

export default function StudentAttendancePage() {
  // A notification (marked absent/late) links here with ?classroomId= so the
  // click lands pre-filtered to that class, not the unfiltered full history.
  const searchParams = useSearchParams();
  const [filterClassroom, setFilterClassroom] = useState<string>(
    () => searchParams.get("classroomId") || "ALL"
  );

  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId || "";

  // The backend already groups this per classroom — with the real exam
  // threshold for each one — so no client-side grouping is needed.
  const { data: courses = [], isLoading: loadingCourses } = useGetStudentAttendanceQuery(
    { studentId },
    { skip: !studentId }
  );

  const loading = loadingProfile || loadingCourses;

  const totalAttended = courses.reduce((s, c) => s + c.present + c.late + c.excused, 0);
  const totalClasses = courses.reduce((s, c) => s + c.sessionsHeld, 0);
  const overallRate = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  const ineligibleCourses = courses.filter((c) => !c.eligibleForExam);

  const filteredRecords: FlatRecord[] = useMemo(() => {
    const selected = filterClassroom === "ALL" ? courses : courses.filter((c) => c.classroomId === filterClassroom);
    return selected
      .flatMap((c) => c.records)
      .sort((a, b) => (a.attendanceDate < b.attendanceDate ? 1 : a.attendanceDate > b.attendanceDate ? -1 : 0));
  }, [courses, filterClassroom]);

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
            {loading ? "Loading..." : `Overall Attendance: ${overallRate}% across ${courses.length} class${courses.length === 1 ? "" : "es"}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <TableRowsSkeleton rows={6} cols={4} />
        </div>
      ) : courses.length === 0 ? (
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
          {ineligibleCourses.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-sm font-semibold">
                Not eligible for the final exam in {ineligibleCourses.map((c) => c.subjectName).join(", ")} —
                attendance is below the required minimum for {ineligibleCourses.length === 1 ? "that class" : "those classes"}.
              </p>
            </div>
          )}

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
            </div>

            {courses.map((c) => {
              const rate = c.attendancePercent != null ? Math.round(c.attendancePercent) : 0;
              return (
                <div
                  key={c.classroomId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
                    <BookOpen className="h-3.5 w-3.5" />
                    {c.className}
                  </div>
                  <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-slate-100" title={c.subjectName}>
                    {c.subjectName}
                  </p>
                  <p className={`mt-1 text-2xl font-bold ${rateColor(rate)}`}>{rate}%</p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {c.present + c.late + c.excused} of {c.sessionsHeld} sessions
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={`h-full rounded-full ${barColor(rate)}`} style={{ width: `${rate}%` }} />
                  </div>
                  <div
                    className={`mt-3 flex items-center gap-1.5 text-xs font-semibold ${
                      c.eligibleForExam
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {c.eligibleForExam ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
                    {c.eligibleForExam ? "Eligible for exam" : "Below exam minimum"}
                    {c.minPercentToSitExam != null && (
                      <span className="font-normal text-slate-400 dark:text-slate-500">
                        (min {Math.round(c.minPercentToSitExam)}%)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
                    ...courses.map((c) => ({
                      value: c.classroomId,
                      label: c.subjectName,
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
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                        No records for this class yet.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr
                        key={record.recordId}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                      >
                        <td className="py-3.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                          {record.attendanceDate}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {record.subjectName || record.className}
                        </td>
                        <td className="py-3.5 px-4">
                          {record.status === "PRESENT" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Present
                            </span>
                          )}
                          {record.status === "ABSENT" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                              <XCircle className="h-3.5 w-3.5" />
                              Absent
                            </span>
                          )}
                          {record.status === "LATE" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                              <Clock className="h-3.5 w-3.5" />
                              Late{record.minutesLate != null ? ` (${record.minutesLate}m)` : ""}
                            </span>
                          )}
                          {record.status === "EXCUSED" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
                              <HelpCircle className="h-3.5 w-3.5" />
                              Excused
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 pl-4 text-xs text-slate-500 dark:text-slate-400">
                          {record.remark || record.excuseReference || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
