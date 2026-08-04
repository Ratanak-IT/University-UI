"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import {
  fetchMyProfile,
  fetchStudentAttendance,
  AttendanceResponse,
  StudentProfile,
} from "@/lib/api/student";

interface GroupedAttendance {
  course: string;
  code: string;
  attended: number;
  total: number;
  rate: number;
}

const rateColor = (r: number) =>
  r >= 90 ? "text-emerald-600" : r >= 80 ? "text-amber-600" : "text-rose-600";

const barColor = (r: number) =>
  r >= 90 ? "bg-emerald-500" : r >= 80 ? "bg-amber-500" : "bg-rose-500";

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [records, setRecords] = useState<GroupedAttendance[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) {
        setProfile(p);
        const attendanceList = await fetchStudentAttendance(p.studentId);
        if (attendanceList && attendanceList.length > 0) {
          // Group by classroom/subject
          const groups: Record<string, { course: string; code: string; attended: number; total: number }> = {};
          
          attendanceList.forEach((log) => {
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
            if (log.status === "PRESENT" || log.status === "LATE" || log.status === "EXCUSED") {
              groups[key].attended += 1;
            }
          });

          const mapped: GroupedAttendance[] = Object.values(groups).map((g) => ({
            course: g.course,
            code: g.code,
            attended: g.attended,
            total: g.total,
            rate: g.total > 0 ? Math.round((g.attended / g.total) * 100) : 0,
          }));

          setRecords(mapped);
        } else {
          setRecords([]);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const totalAttended = records.reduce((s, r) => s + r.attended, 0);
  const totalClasses = records.reduce((s, r) => s + r.total, 0);
  const overall = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Attendance</h2>
        <p className="mt-1 text-sm text-slate-500">
          {loading
            ? "Loading..."
            : `Overall ${overall}% · 80% required to sit final exams`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700">No attendance records found</p>
          <p className="text-sm text-slate-500">There are no attendance logs registered for your classes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.code} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-indigo-950">{r.course}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{r.code}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${rateColor(r.rate)}`}>{r.rate}%</p>
                  <p className="text-xs text-slate-400">
                    {r.attended} / {r.total} classes
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${barColor(r.rate)}`}
                  style={{ width: `${r.rate}%` }}
                />
              </div>
              {r.rate < 80 && (
                <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Below the 80% requirement — speak to your advisor.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
