"use client";
 
import { useMemo, useState } from "react";
import {
  Users,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  SlidersHorizontal,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
 
type Grade = "A" | "B" | "C" | "D" | "F";
type Status = "Passed" | "Failed" | "Pending";
 
interface StudentGrade {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  classroom: string;
  semester: string;
  midterm: number;
  final: number;
  assign: number;
  quiz: number;
  attend: number;
  total: number;
  grade: Grade;
  gpa: number;
  status: Status;
  gradedBy: string;
}
 
const names = [
  "Chhay Davin",
  "Arthur Davin",
  "Sokha Chan",
  "Bopha Ly",
  "Rithy Sok",
  "Sreymom Heng",
  "Vanna Prak",
  "Dara Chea",
  "Kunthea Meas",
  "Pisach Ouk",
  "Sreyneang Kim",
  "Vibol Ros",
  "Chanlina Yin",
  "Sopheak Nou",
  "Malis Tep",
  "Ratanak Uch",
  "Sreypov Chum",
  "Vuthy Long",
  "Channary Im",
  "Piseth Ang",
  "Sokunthea Van",
  "Bora Keo",
  "Chanthou Mao",
  "Sovann Pich",
];
 
const avatarColors = [
  "bg-amber-200 text-amber-800",
  "bg-sky-200 text-sky-800",
  "bg-rose-200 text-rose-800",
  "bg-violet-200 text-violet-800",
  "bg-emerald-200 text-emerald-800",
  "bg-orange-200 text-orange-800",
];
 
function gradeFromTotal(total: number): Grade {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}
 
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}
 
const allStudents: StudentGrade[] = names.map((name, i) => {
  const midterm = 75 + ((i * 7) % 25);
  const final = 70 + ((i * 11) % 30);
  const assign = 80 + ((i * 5) % 20);
  const quiz = 75 + ((i * 9) % 25);
  const attend = 85 + ((i * 3) % 16);
  const total = Math.round((midterm + final + assign + quiz + attend) / 5 * 10) / 10;
  const grade = gradeFromTotal(total);
  const status: Status = grade === "F" ? "Failed" : total >= 60 ? "Passed" : "Pending";
 
  return {
    id: `s-${i + 1}`,
    name,
    initials: initialsOf(name),
    avatarColor: avatarColors[i % avatarColors.length],
    classroom: "CS101-A",
    semester: "Y2 S2",
    midterm,
    final,
    assign,
    quiz,
    attend,
    total,
    grade,
    gpa: Math.round((total / 25) * 10) / 10,
    status,
    gradedBy: "K. Sopheap",
  };
});
 
const gradeStyles: Record<Grade, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-sky-100 text-sky-700",
  C: "bg-amber-100 text-amber-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-rose-100 text-rose-700",
};
 
const statusStyles: Record<Status, string> = {
  Passed: "text-emerald-600",
  Failed: "text-rose-600",
  Pending: "text-slate-400",
};
 
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
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
 
const PAGE_SIZE = 8;
 
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "…", total];
  if (current >= total - 2) return [1, "…", total - 2, total - 1, total];
  return [1, "…", current, "…", total];
}
 
export default function Attendan2Grades() {
  const [page, setPage] = useState(1);
  const totalStudents = 256; // full dataset size (mocked beyond sample rows)
  const totalPages = Math.ceil(totalStudents / PAGE_SIZE);
 
  const pageStudents = useMemo(() => {
    // cycle through the sample data to fill each page with distinct-looking rows
    const start = ((page - 1) * PAGE_SIZE) % allStudents.length;
    const rows: StudentGrade[] = [];
    for (let i = 0; i < PAGE_SIZE; i++) {
      rows.push(allStudents[(start + i) % allStudents.length]);
    }
    return rows;
  }, [page]);
 
  const showingFrom = (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, totalStudents);
  const pageNumbers = getPageNumbers(page, totalPages);
 
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-white" />}
          iconBg="bg-blue-900"
          label="Total Students"
          value="42"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
          label="Pass Rate"
          value="92.8%"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-100"
          label="Class Avg."
          value="B (78.4)"
        />
        <StatCard
          icon={<AlertTriangle className="h-5 w-5 text-rose-500" />}
          iconBg="bg-rose-100"
          label="At Risk"
          value="3 Students"
        />
      </div>
 
      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Classroom</label>
            <button className="flex w-56 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
              CS202 - Web Development
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Semester</label>
            <button className="flex w-28 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
              2
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
            <button className="flex w-36 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">
              All Statuses
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>
 
        <button className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800">
          <SlidersHorizontal className="h-4 w-4" />
          Apply Filters
        </button>
      </div>
 
      {/* Grade book table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Grade Book</h2>
            <p className="text-xs text-slate-400">Class: Web Development II (CS202-A)</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 shadow-sm hover:bg-slate-50">
            <Download className="h-4 w-4" />
            Export to CSV
          </button>
        </div>
 
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Classroom</th>
                <th className="px-3 py-3 font-medium">Semester</th>
                <th className="px-3 py-3 font-medium">Midterm</th>
                <th className="px-3 py-3 font-medium">Final</th>
                <th className="px-3 py-3 font-medium">Assign</th>
                <th className="px-3 py-3 font-medium">Quiz</th>
                <th className="px-3 py-3 font-medium">Attend</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Grade</th>
                <th className="px-3 py-3 font-medium">GPA</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Graded by</th>
                <th className="px-3 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageStudents.map((s, i) => (
                <tr
                  key={`${s.id}-${page}-${i}`}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                >
                  <td className="flex items-center gap-3 px-5 py-3.5">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${s.avatarColor}`}
                    >
                      {s.initials}
                    </div>
                    <span className="font-medium text-slate-800">{s.name}</span>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">{s.classroom}</td>
                  <td className="px-3 py-3.5 text-slate-500">{s.semester}</td>
                  <td className="px-3 py-3.5 text-slate-500">{s.midterm}</td>
                  <td className="px-3 py-3.5 text-slate-500">{s.final}</td>
                  <td className="px-3 py-3.5 text-slate-500">{s.assign}</td>
                  <td className="px-3 py-3.5 text-slate-500">{s.quiz}</td>
                  <td className="px-3 py-3.5 text-slate-500">{s.attend}</td>
                  <td className="px-3 py-3.5 font-medium text-slate-800">{s.total}</td>
                  <td className="px-3 py-3.5">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${gradeStyles[s.grade]}`}
                    >
                      {s.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">{s.gpa.toFixed(1)}</td>
                  <td className="px-3 py-3.5">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles[s.status]}`}>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          s.status === "Passed"
                            ? "bg-emerald-500"
                            : s.status === "Failed"
                            ? "bg-rose-500"
                            : "bg-slate-300"
                        }`}
                      />
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500">{s.gradedBy}</td>
                  <td className="px-3 py-3.5">
                    <button aria-label="More actions" className="text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-3 text-sm">
          <span className="text-slate-400">
            Showing {showingFrom}-{showingTo} of {totalStudents} students
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
 
            {pageNumbers.map((n, i) =>
              n === "…" ? (
                <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium ${
                    n === page
                      ? "bg-blue-900 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {n}
                </button>
              )
            )}
 
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
