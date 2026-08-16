"use client";

import { toast } from "@/components/shared/Toast";
import { useState, useMemo, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  Download,
  Save,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  useGetTeacherClassroomsQuery,
  useGetClassroomStudentsQuery,
  useGetExamScoresQuery,
  useSaveExamScoresMutation,
  useGetTeacherProfileQuery,
} from "@/lib/redux/apiSlice";
import { ExamType } from "@/lib/api/teacher";
import ModernSelect from "@/components/shared/ModernSelect";

type GradeLetter = "A" | "B" | "C" | "D" | "F";
type Status = "Passed" | "Failed" | "Pending";

interface StudentScoreRow {
  studentId: string;
  name: string;
  studentCode: string;
  avatarUrl?: string | null;
  initials: string;
  avatarColor: string;
  classroom: string;
  yearLevel?: number;
  yearLevelStr?: string;
  semesterNum?: number;
  semester: string;
  midterm: number | "";
  final: number | "";
  assign: number | "";
  quiz: number | "";
  attend: number | "";
  total: number;
  grade: GradeLetter;
  gpa: number;
  status: Status;
  gradedBy: string;
}

const avatarColors = [
  "bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  "bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  "bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
  "bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
  "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  "bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
];

const gradeStyles: Record<GradeLetter, string> = {
  A: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  B: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  C: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  D: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  F: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
};

const statusStyles: Record<Status, string> = {
  Passed: "text-emerald-600 dark:text-emerald-400",
  Failed: "text-rose-600 dark:text-rose-400",
  Pending: "text-muted-foreground",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function calculateGradeLetter(totalPercent: number): GradeLetter {
  if (totalPercent >= 85) return "A";
  if (totalPercent >= 75) return "B";
  if (totalPercent >= 65) return "C";
  if (totalPercent >= 50) return "D";
  return "F";
}

function calculateGpa(totalPercent: number): number {
  if (totalPercent >= 85) return 4.0;
  if (totalPercent >= 75) return 3.5;
  if (totalPercent >= 65) return 3.0;
  if (totalPercent >= 50) return 2.0;
  return 0.0;
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export default function Attendan2Grades() {
  const { data: classrooms = [], isLoading: loadingClassrooms } = useGetTeacherClassroomsQuery();
  const { data: teacherProfile } = useGetTeacherProfileQuery();

  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>("All Years");
  const [selectedSemester, setSelectedSemester] = useState<string>("All Semesters");
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Filter classrooms by selected Year Level & Semester
  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((c: any) => {
      const yLevel = c.yearLevel || 2;
      const matchYear =
        selectedYearLevel === "All Years" ||
        `Year ${yLevel}` === selectedYearLevel;

      const sem = c.semester || 2;
      const matchSemester =
        selectedSemester === "All Semesters" ||
        `Semester ${sem}` === selectedSemester;

      return matchYear && matchSemester;
    });
  }, [classrooms, selectedYearLevel, selectedSemester]);

  // Sync selectedClassroomId whenever filteredClassrooms or filters change
  useEffect(() => {
    if (filteredClassrooms.length > 0) {
      const exists = filteredClassrooms.some((c: any) => c.classroomId === selectedClassroomId);
      if (!exists) {
        setSelectedClassroomId(filteredClassrooms[0].classroomId);
        setPage(1);
      }
    } else if (selectedClassroomId) {
      setSelectedClassroomId("");
    }
  }, [filteredClassrooms, selectedClassroomId]);

  const { data: students = [], isLoading: loadingStudents } = useGetClassroomStudentsQuery(
    selectedClassroomId,
    { skip: !selectedClassroomId }
  );

  const { data: examScores = [], isLoading: loadingScores } = useGetExamScoresQuery(
    selectedClassroomId,
    { skip: !selectedClassroomId }
  );

  const [saveExamScores, { isLoading: isSaving }] = useSaveExamScoresMutation();

  // Local grid matrix scores state: { [studentId]: { midterm, final, assign, quiz, attend } }
  const [matrixScores, setMatrixScores] = useState<
    Record<
      string,
      {
        midterm: number | "";
        final: number | "";
        assign: number | "";
        quiz: number | "";
        attend: number | "";
      }
    >
  >({});

  // Sync existing backend examScores into matrixScores
  useEffect(() => {
    if (!students || students.length === 0) return;

    const newMatrix: Record<
      string,
      {
        midterm: number | "";
        final: number | "";
        assign: number | "";
        quiz: number | "";
        attend: number | "";
      }
    > = {};

    students.forEach((s: any) => {
      const studentId = s.studentId || s.id;
      const sScores = examScores.filter((es) => es.studentId === studentId);

      const findScore = (type: ExamType): number | "" => {
        const found = sScores.find((es) => es.examType === type);
        return found !== undefined && found.score !== null ? found.score : "";
      };

      newMatrix[studentId] = {
        midterm: findScore("MIDTERM"),
        final: findScore("FINAL"),
        assign: findScore("ASSIGNMENT"),
        quiz: findScore("QUIZ"),
        attend: findScore("ATTENDANCE"),
      };
    });

    setMatrixScores(newMatrix);
  }, [students, examScores, selectedClassroomId]);

  function triggerToast(msg: string) {
    if (msg.toLowerCase().includes("fail") || msg.toLowerCase().includes("error") || msg.toLowerCase().includes("select")) {
      toast.error(msg);
    } else {
      toast.success(msg);
    }
  }

  function handleScoreCellChange(
    studentId: string,
    field: "midterm" | "final" | "assign" | "quiz" | "attend",
    val: string
  ) {
    let num: number | "" = val === "" ? "" : Number(val);
    if (typeof num === "number" && isNaN(num)) return;

    const maxLimits = {
      midterm: 100,
      final: 100,
      assign: 20,
      quiz: 10,
      attend: 10,
    };

    if (typeof num === "number") {
      num = Math.min(Math.max(0, num), maxLimits[field]);
    }

    setMatrixScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {
          midterm: "",
          final: "",
          assign: "",
          quiz: "",
          attend: "",
        }),
        [field]: num,
      },
    }));
  }

  async function handleSaveAllScores() {
    if (!selectedClassroomId) {
      triggerToast("Please select a classroom first.");
      return;
    }

    const categories: { key: "midterm" | "final" | "assign" | "quiz" | "attend"; examType: ExamType; maxScore: number }[] = [
      { key: "midterm", examType: "MIDTERM", maxScore: 100 },
      { key: "final", examType: "FINAL", maxScore: 100 },
      { key: "assign", examType: "ASSIGNMENT", maxScore: 20 },
      { key: "quiz", examType: "QUIZ", maxScore: 10 },
      { key: "attend", examType: "ATTENDANCE", maxScore: 10 },
    ];

    try {
      for (const cat of categories) {
        const payloadScores = Object.entries(matrixScores)
          .filter(([_, row]) => row[cat.key] !== "")
          .map(([studentId, row]) => ({
            studentId,
            score: Number(row[cat.key]),
          }));

        if (payloadScores.length > 0) {
          await saveExamScores({
            classroomId: selectedClassroomId,
            payload: {
              examType: cat.examType,
              maxScore: cat.maxScore,
              scores: payloadScores,
            },
          }).unwrap();
        }
      }
      triggerToast("All grade columns saved to server successfully!");
    } catch (err: any) {
      triggerToast(err?.data?.message || "Failed to save grades. Please try again.");
    }
  }

  // Calculate row metrics
  const allRows: StudentScoreRow[] = useMemo(() => {
    if (!students || students.length === 0) return [];

    const teacherName = teacherProfile
      ? `${teacherProfile.firstName} ${teacherProfile.lastName}`
      : "Teacher";

    const selectedClassroomObj = classrooms.find((c) => c.classroomId === selectedClassroomId);
    const classroomName = selectedClassroomObj ? selectedClassroomObj.className : "CS202-A";

    return students.map((s: any, i: number) => {
      const studentId = s.studentId || s.id;
      const name =
        s.fullName ||
        s.studentFullName ||
        s.studentName ||
        (s.firstName ? `${s.firstName} ${s.lastName || ""}`.trim() : null) ||
        s.name ||
        "Student";
      const studentCode = s.studentCode || "STU-00";

      const scores = matrixScores[studentId] || {
        midterm: "",
        final: "",
        assign: "",
        quiz: "",
        attend: "",
      };

      const m = scores.midterm !== "" ? Number(scores.midterm) : 0;
      const f = scores.final !== "" ? Number(scores.final) : 0;
      const a = scores.assign !== "" ? Number(scores.assign) : 0;
      const q = scores.quiz !== "" ? Number(scores.quiz) : 0;
      const att = scores.attend !== "" ? Number(scores.attend) : 0;

      // Weighted calculation:
      // Midterm (100 -> 30%), Final (100 -> 40%), Assign (20 -> 15%), Quiz (10 -> 10%), Attend (10 -> 5%)
      const totalEarned = (m / 100) * 30 + (f / 100) * 40 + (a / 20) * 15 + (q / 10) * 10 + (att / 10) * 5;
      const totalPercent = Math.round(totalEarned * 10) / 10;

      const hasAnyScore =
        scores.midterm !== "" ||
        scores.final !== "" ||
        scores.assign !== "" ||
        scores.quiz !== "" ||
        scores.attend !== "";

      const grade = calculateGradeLetter(totalPercent);
      const gpa = calculateGpa(totalPercent);
      const status: Status = !hasAnyScore
        ? "Pending"
        : grade === "F"
        ? "Failed"
        : "Passed";

      const yearLevel = s.yearLevel || selectedClassroomObj?.yearLevel || 2;
      const semesterNum = s.semester || selectedClassroomObj?.semester || 2;
      const semesterStr = `Semester ${semesterNum}`;
      const yearLevelStr = `Year ${yearLevel}`;

      return {
        studentId,
        name,
        studentCode,
        avatarUrl: s.avatarUrl || s.avatar || s.profileUrl || null,
        initials: initialsOf(name),
        avatarColor: avatarColors[i % avatarColors.length],
        classroom: classroomName,
        yearLevel,
        yearLevelStr,
        semesterNum,
        semester: semesterStr,
        midterm: scores.midterm,
        final: scores.final,
        assign: scores.assign,
        quiz: scores.quiz,
        attend: scores.attend,
        total: totalPercent,
        grade,
        gpa,
        status,
        gradedBy: teacherName,
      };
    });
  }, [students, matrixScores, selectedClassroomId, classrooms, teacherProfile]);

  // Filtered rows by status, year level, semester & student name/code search
  const filteredRows = useMemo(() => {
    return allRows.filter((r) => {
      const matchStatus =
        statusFilter === "All Statuses" || r.status === statusFilter;
      const matchSemester =
        selectedSemester === "All Semesters" || r.semester === selectedSemester;
      const matchYear =
        selectedYearLevel === "All Years" || r.yearLevelStr === selectedYearLevel;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.studentCode.toLowerCase().includes(q);
      return matchStatus && matchSemester && matchYear && matchSearch;
    });
  }, [allRows, statusFilter, selectedSemester, selectedYearLevel, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  // Summary stats
  const stats = useMemo(() => {
    if (allRows.length === 0) return { total: 0, passRate: "0%", avgScore: "0", atRisk: "0 Students" };
    const passed = allRows.filter((r) => r.status === "Passed").length;
    const atRisk = allRows.filter((r) => r.status === "Failed" || r.total < 60).length;
    const avg = Math.round(allRows.reduce((acc, r) => acc + r.total, 0) / allRows.length * 10) / 10;

    return {
      total: allRows.length,
      passRate: `${Math.round((passed / allRows.length) * 100)}%`,
      avgScore: `${calculateGradeLetter(avg)} (${avg})`,
      atRisk: `${atRisk} Students`,
    };
  }, [allRows]);

  const selectedClassroomObj = classrooms.find((c) => c.classroomId === selectedClassroomId);

  function exportToCsv() {
    if (allRows.length === 0) return;
    const headers = [
      "Student Code",
      "Student Name",
      "Classroom",
      "Midterm (/100)",
      "Final (/100)",
      "Assignment (/20)",
      "Quiz (/10)",
      "Attendance (/10)",
      "Total (%)",
      "Grade",
      "GPA",
      "Status",
    ];
    const csvLines = [headers.join(",")];

    allRows.forEach((r) => {
      const line = [
        `"${r.studentCode}"`,
        `"${r.name}"`,
        `"${r.classroom}"`,
        r.midterm !== "" ? r.midterm : 0,
        r.final !== "" ? r.final : 0,
        r.assign !== "" ? r.assign : 0,
        r.quiz !== "" ? r.quiz : 0,
        r.attend !== "" ? r.attend : 0,
        `${r.total}%`,
        r.grade,
        r.gpa.toFixed(1),
        r.status,
      ];
      csvLines.push(line.join(","));
    });

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Gradebook_${selectedClassroomObj?.classCode || "Class"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background px-6 py-6 space-y-6">
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-primary-foreground" />}
          iconBg="bg-primary"
          label="Total Students"
          value={String(stats.total)}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          label="Pass Rate"
          value={stats.passRate}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-100 dark:bg-amber-900/40"
          label="Class Avg."
          value={stats.avgScore}
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-rose-500 dark:text-rose-400" />}
          iconBg="bg-rose-100 dark:bg-rose-900/40"
          label="At Risk"
          value={stats.atRisk}
        />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* Classroom Selector */}
          <div className="w-64">
            <ModernSelect
              label="Classroom"
              value={selectedClassroomId}
              onChange={(val) => {
                setSelectedClassroomId(val);
                setPage(1);
              }}
              disabled={loadingClassrooms}
              options={
                filteredClassrooms.length === 0
                  ? [{ value: "", label: "No classrooms for this Year/Semester" }]
                  : filteredClassrooms.map((c: any) => ({
                      value: c.classroomId,
                      label: `${c.className} (${c.classCode || "Class"})`,
                      badge: `Y${c.yearLevel || 2} S${c.semester || 2}`,
                    }))
              }
            />
          </div>

          {/* Year Level Selector */}
          <div className="w-36">
            <ModernSelect
              label="Year Level"
              value={selectedYearLevel}
              onChange={(val) => {
                setSelectedYearLevel(val);
                setPage(1);
              }}
              options={[
                { value: "All Years", label: "All Years" },
                { value: "Year 1", label: "Year 1" },
                { value: "Year 2", label: "Year 2" },
                { value: "Year 3", label: "Year 3" },
                { value: "Year 4", label: "Year 4" },
              ]}
            />
          </div>

          {/* Semester Selector */}
          <div className="w-40">
            <ModernSelect
              label="Semester"
              value={selectedSemester}
              onChange={(val) => {
                setSelectedSemester(val);
                setPage(1);
              }}
              options={[
                { value: "All Semesters", label: "All Semesters" },
                { value: "Semester 1", label: "Semester 1" },
                { value: "Semester 2", label: "Semester 2" },
              ]}
            />
          </div>

          {/* Status Filter */}
          <div className="w-44">
            <ModernSelect
              label="Status"
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              options={[
                { value: "All Statuses", label: "All Statuses" },
                { value: "Passed", label: "Passed" },
                { value: "Failed", label: "Failed" },
                { value: "Pending", label: "Pending" },
              ]}
            />
          </div>

          {/* Search Student */}
          <div className="w-56">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Search Student
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAllScores}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving Grades..." : "Save All Scores"}
          </button>
        </div>
      </div>

      {/* Grade book table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="text-base font-semibold text-card-foreground">Grade Book</h2>
            <p className="text-xs text-muted-foreground">
              Class: <strong>{selectedClassroomObj?.className || "Classroom"}</strong> ({selectedClassroomObj?.classCode || "Code"})
            </p>
          </div>
          <button
            type="button"
            onClick={exportToCsv}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-card-foreground shadow-sm hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Export to CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead>
              <tr className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Classroom</th>
                <th className="px-3 py-3 font-medium">Semester</th>
                <th className="px-3 py-3 font-medium text-center bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                  Midterm (/100)
                </th>
                <th className="px-3 py-3 font-medium text-center bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                  Final (/100)
                </th>
                <th className="px-3 py-3 font-medium text-center bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                  Assign (/20)
                </th>
                <th className="px-3 py-3 font-medium text-center bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                  Quiz (/10)
                </th>
                <th className="px-3 py-3 font-medium text-center bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
                  Attend (/10)
                </th>
                <th className="px-3 py-3 font-medium text-center">Total</th>
                <th className="px-3 py-3 font-medium text-center">Grade</th>
                <th className="px-3 py-3 font-medium text-center">GPA</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Graded by</th>
                <th className="px-3 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingStudents || loadingScores ? (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-sm text-muted-foreground">
                    Loading student gradebook...
                  </td>
                </tr>
              ) : currentPageRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-sm text-muted-foreground">
                    No student rows found.
                  </td>
                </tr>
              ) : (
                currentPageRows.map((s, i) => (
                  <tr
                    key={`${s.studentId}-${i}`}
                    className="border-b border-border last:border-0 hover:bg-muted/60 transition-colors"
                  >
                    {/* Student Info with Profile Avatar */}
                    <td className="flex items-center gap-3.5 px-5 py-3.5">
                      {s.avatarUrl ? (
                        <img
                          src={s.avatarUrl}
                          alt={s.name}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-sm"
                        />
                      ) : (
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${s.avatarColor}`}
                        >
                          {s.initials}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-card-foreground hover:text-indigo-600 transition-colors">
                          {s.name}
                        </div>
                        <div className="text-[11px] font-medium text-muted-foreground">
                          {s.studentCode}
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-muted-foreground">{s.classroom}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">{s.semester}</td>

                    {/* Interactive Editable Midterm Cell */}
                    <td className="px-2 py-2 text-center bg-indigo-50/20 dark:bg-indigo-950/10">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.midterm}
                        onChange={(e) => handleScoreCellChange(s.studentId, "midterm", e.target.value)}
                        placeholder="-"
                        className="w-16 rounded-md border border-indigo-200 bg-white px-2 py-1 text-center text-sm font-bold text-slate-900 shadow-none focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Interactive Editable Final Cell */}
                    <td className="px-2 py-2 text-center bg-indigo-50/20 dark:bg-indigo-950/10">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.final}
                        onChange={(e) => handleScoreCellChange(s.studentId, "final", e.target.value)}
                        placeholder="-"
                        className="w-16 rounded-md border border-indigo-200 bg-white px-2 py-1 text-center text-sm font-bold text-slate-900 shadow-none focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Interactive Editable Assign Cell */}
                    <td className="px-2 py-2 text-center bg-indigo-50/20 dark:bg-indigo-950/10">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={s.assign}
                        onChange={(e) => handleScoreCellChange(s.studentId, "assign", e.target.value)}
                        placeholder="-"
                        className="w-16 rounded-md border border-indigo-200 bg-white px-2 py-1 text-center text-sm font-bold text-slate-900 shadow-none focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Interactive Editable Quiz Cell */}
                    <td className="px-2 py-2 text-center bg-indigo-50/20 dark:bg-indigo-950/10">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={s.quiz}
                        onChange={(e) => handleScoreCellChange(s.studentId, "quiz", e.target.value)}
                        placeholder="-"
                        className="w-16 rounded-md border border-indigo-200 bg-white px-2 py-1 text-center text-sm font-bold text-slate-900 shadow-none focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Interactive Editable Attend Cell */}
                    <td className="px-2 py-2 text-center bg-indigo-50/20 dark:bg-indigo-950/10">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        value={s.attend}
                        onChange={(e) => handleScoreCellChange(s.studentId, "attend", e.target.value)}
                        placeholder="-"
                        className="w-16 rounded-md border border-indigo-200 bg-white px-2 py-1 text-center text-sm font-bold text-slate-900 shadow-none focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </td>

                    {/* Dynamic Total */}
                    <td className="px-3 py-3.5 text-center font-bold text-card-foreground">
                      {s.total}%
                    </td>

                    {/* Grade Badge */}
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${gradeStyles[s.grade]}`}
                      >
                        {s.grade}
                      </span>
                    </td>

                    {/* GPA */}
                    <td className="px-3 py-3.5 text-center text-muted-foreground font-semibold">
                      {s.gpa.toFixed(1)}
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3.5">
                      <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles[s.status]}`}>
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            s.status === "Passed"
                              ? "bg-emerald-500"
                              : s.status === "Failed"
                              ? "bg-rose-500"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        {s.status}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 text-muted-foreground">{s.gradedBy}</td>

                    <td className="px-3 py-3.5 text-center">
                      <button
                        type="button"
                        aria-label="More actions"
                        className="text-muted-foreground hover:text-card-foreground"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-3 text-sm">
          <span className="text-muted-foreground">
            Showing {filteredRows.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(page * PAGE_SIZE, filteredRows.length)} of {filteredRows.length} students
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                  n === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-card-foreground hover:bg-muted"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}