"use client";

import { toast } from "@/components/shared/Toast";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Loader2,
  Save,
} from "lucide-react";
import {
  useGetTeacherClassroomsQuery,
  useGetClassroomStudentsQuery,
  useGetTeacherAttendanceQuery,
  useRecordTeacherAttendanceMutation,
} from "@/lib/redux/apiSlice";
import { ClassroomResponse } from "@/lib/api/student";

type Status = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

interface StudentAttendanceRow {
  studentId: string;
  studentCode: string;
  fullName: string;
  email: string;
  status: Status;
  remark: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISODate(s: string): Date {
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function DailyAttendancePage() {
  const [selectedClassroom, setSelectedClassroom] = useState<ClassroomResponse | null>(null);
  const [classroomOpen, setClassroomOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rows, setRows] = useState<StudentAttendanceRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const dateInputRef = useRef<HTMLInputElement>(null);

  // RTK Query Hooks
  const { data: classrooms = [], isLoading: loadingClassrooms } = useGetTeacherClassroomsQuery();

  useEffect(() => {
    if (classrooms && classrooms.length > 0 && !selectedClassroom) {
      setSelectedClassroom(classrooms[0]);
    }
  }, [classrooms, selectedClassroom]);

  const classroomId = selectedClassroom?.classroomId || "";
  const dateIso = toISODate(selectedDate);

  const { data: students = [], isLoading: loadingStudents } = useGetClassroomStudentsQuery(
    classroomId,
    { skip: !classroomId }
  );

  const { data: attendanceData = [], isLoading: loadingAttendance } = useGetTeacherAttendanceQuery(
    { classroomId, date: dateIso },
    { skip: !classroomId }
  );

  const [recordAttendance, { isLoading: saving }] = useRecordTeacherAttendanceMutation();

  const loadingData = loadingStudents || loadingAttendance;

  useEffect(() => {
    if (!students || students.length === 0) {
      setRows([]);
      return;
    }

    const logMap = new Map<string, { status: Status; remark: string }>();
    if (attendanceData && Array.isArray(attendanceData)) {
      attendanceData.forEach((item: any) => {
        if (item.studentId) {
          logMap.set(item.studentId, {
            status: (item.status as Status) || "PRESENT",
            remark: item.remark || "",
          });
        }
      });
    }

    const mergedRows: StudentAttendanceRow[] = students.map((st: any) => {
      const existing = logMap.get(st.studentId);
      return {
        studentId: st.studentId,
        studentCode: st.studentCode || st.studentId.substring(0, 8),
        fullName: st.fullName || `${st.firstName || ""} ${st.lastName || ""}`.trim() || "Student",
        email: st.email || "—",
        status: existing ? existing.status : "PRESENT",
        remark: existing ? existing.remark : "",
      };
    });

    setRows(mergedRows);
  }, [students, attendanceData]);

  function showToast(message: string) {
    if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("error")) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  }

  function updateStudentStatus(studentId: string, status: Status) {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  }

  function updateStudentRemark(studentId: string, remark: string) {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remark } : r))
    );
  }

  async function handleSubmitSheet() {
    if (!selectedClassroom) return;
    const dateISO = toISODate(selectedDate);
    const items = rows.map((r) => ({
      studentId: r.studentId,
      status: r.status,
      remark: r.remark,
    }));

    try {
      await recordAttendance({
        classroomId: selectedClassroom.classroomId,
        payload: { attendanceDate: dateISO, items },
      }).unwrap();
      showToast(`Attendance saved successfully for ${formatDate(selectedDate)}.`);
    } catch (err) {
      showToast("Failed to save attendance. Please check network connection.");
    }
  }

  function changeDate(delta: number) {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
  }

  const counts = {
    total: rows.length,
    Present: rows.filter((r) => r.status === "PRESENT").length,
    Absent: rows.filter((r) => r.status === "ABSENT").length,
    Late: rows.filter((r) => r.status === "LATE").length,
    Excused: rows.filter((r) => r.status === "EXCUSED").length,
  };

  const filteredRows =
    statusFilter === "ALL"
      ? rows
      : rows.filter((r) => r.status === statusFilter);

  if (loadingClassrooms) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
            <Users className="h-4 w-4" />
            Classroom Attendance
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Daily Attendance Sheet
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Record and manage student attendance for your classrooms.
          </p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={handleSubmitSheet}
          disabled={saving || !selectedClassroom || rows.length === 0}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Attendance
        </button>
      </div>

      {/* Filters Bar: Classroom Selector & Date Picker */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Classroom Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setClassroomOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <span>{selectedClassroom ? selectedClassroom.className : "Select Classroom"}</span>
            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>
          {classroomOpen && (
            <div className="absolute left-0 z-20 mt-1.5 w-64 rounded-xl border border-slate-100 bg-white p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {classrooms.map((c) => (
                <button
                  key={c.classroomId}
                  type="button"
                  onClick={() => {
                    setSelectedClassroom(c);
                    setClassroomOpen(false);
                  }}
                  className={`block w-full text-left rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    selectedClassroom?.classroomId === c.classroomId
                      ? "bg-indigo-50 font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {c.className} ({c.classCode})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeDate(-1)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="relative flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100">
            <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{formatDate(selectedDate)}</span>
            <input
              ref={dateInputRef}
              type="date"
              value={toISODate(selectedDate)}
              onChange={(e) => e.target.value && setSelectedDate(fromISODate(e.target.value))}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>
          <button
            type="button"
            onClick={() => changeDate(1)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Breakdown Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          onClick={() => setStatusFilter("ALL")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
            statusFilter === "ALL"
              ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Users className="h-4 w-4 text-indigo-600" /> Total Enrolled
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-50">{counts.total}</p>
        </div>

        <div
          onClick={() => setStatusFilter("PRESENT")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
            statusFilter === "PRESENT"
              ? "border-emerald-600 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-950/30"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Present
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-400">{counts.Present}</p>
        </div>

        <div
          onClick={() => setStatusFilter("ABSENT")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
            statusFilter === "ABSENT"
              ? "border-rose-600 bg-rose-50/50 dark:border-rose-500 dark:bg-rose-950/30"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600">
            <XCircle className="h-4 w-4 text-rose-600" /> Absent
          </div>
          <p className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-400">{counts.Absent}</p>
        </div>

        <div
          onClick={() => setStatusFilter("LATE")}
          className={`cursor-pointer rounded-2xl border p-4 shadow-sm transition-all ${
            statusFilter === "LATE"
              ? "border-amber-600 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-950/30"
              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600">
            <Clock className="h-4 w-4 text-amber-600" /> Late / Excused
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-400">{counts.Late + counts.Excused}</p>
        </div>
      </div>

      {/* Roster & Marking Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loadingData ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="py-12 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            No students found for this classroom.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <th className="pb-3 pr-4">Student ID</th>
                  <th className="pb-3 px-4">Student Name</th>
                  <th className="pb-3 px-4">Status Marking</th>
                  <th className="pb-3 pl-4">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRows.map((r) => (
                  <tr key={r.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-3.5 pr-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {r.studentCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {r.fullName}
                      <span className="block text-xs font-normal text-slate-400">{r.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(r.studentId, "PRESENT")}
                          className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                            r.status === "PRESENT"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(r.studentId, "ABSENT")}
                          className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                            r.status === "ABSENT"
                              ? "bg-rose-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(r.studentId, "LATE")}
                          className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                            r.status === "LATE"
                              ? "bg-amber-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          Late
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStudentStatus(r.studentId, "EXCUSED")}
                          className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                            r.status === "EXCUSED"
                              ? "bg-sky-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 pl-4">
                      <input
                        type="text"
                        value={r.remark}
                        onChange={(e) => updateStudentRemark(r.studentId, e.target.value)}
                        placeholder="Add remark..."
                        className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}