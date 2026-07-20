"use client";

import { useState } from "react";
import { TrendingUp, Star, Calendar, Hourglass, Download, ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const gradeDistribution = [
  { name: "Grade A", value: 5, color: "#10b981" },
  { name: "Grade B", value: 4, color: "#4f46e5" },
  { name: "Grade C", value: 1, color: "#cbd5e1" },
];

const yearOptions = ["Year 1", "Year 2", "Year 3", "Year 4"];

const semester1Grades = [
  {
    subject: "Spring Boot",
    professor: "Dr. Dara Kim",
    credits: 4,
    midterm: 90,
    finalProject: 94,
    average: 92.0,
    grade: "A",
    gradeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    subject: "Data Structure",
    professor: "Sokha Rin",
    credits: 4,
    midterm: 86,
    finalProject: 89,
    average: 87.5,
    grade: "B+",
    gradeClass: "bg-sky-100 text-sky-700",
  },
  {
    subject: "Computer Network",
    professor: "Elena Rossi",
    credits: 5,
    midterm: 84,
    finalProject: 88,
    average: 86.0,
    grade: "B+",
    gradeClass: "bg-sky-100 text-sky-700",
  },
  {
    subject: "Software Engineering",
    professor: "Marcus Reed",
    credits: 4,
    midterm: 91,
    finalProject: 93,
    average: 92.0,
    grade: "A",
    gradeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    subject: "Operating System",
    professor: "Linda Park",
    credits: 3,
    midterm: 80,
    finalProject: 85,
    average: 82.5,
    grade: "B",
    gradeClass: "bg-slate-100 text-slate-600",
  },
];

const semester2Grades = [
  {
    subject: "Cloud Computing",
    professor: "Dr. Dara Kim",
    credits: 4,
    midterm: 88,
    finalProject: null,
    average: 88.0,
    grade: "Pending",
    gradeClass: "bg-amber-100 text-amber-700",
  },
  {
    subject: "Algorithms",
    professor: "Sokha Rin",
    credits: 4,
    midterm: 91,
    finalProject: null,
    average: 91.0,
    grade: "Pending",
    gradeClass: "bg-amber-100 text-amber-700",
  },
  {
    subject: "Mobile Development",
    professor: "Elena Rossi",
    credits: 4,
    midterm: 85,
    finalProject: null,
    average: 85.0,
    grade: "Pending",
    gradeClass: "bg-amber-100 text-amber-700",
  },
];

export default function GradesPage() {
  const [semester, setSemester] = useState<"1" | "2">("1");
  const [year, setYear] = useState("Year 2");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const subjectGrades = semester === "1" ? semester1Grades : semester2Grades;

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb + header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            <span className="text-indigo-600">Academic Records</span> / Year 2
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Grades Overview</h1>
          <p className="mt-1 text-sm text-slate-500">
            tracking and module results for the current academic year.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsYearOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {year}
              <ChevronDown className="h-4 w-4" />
            </button>
            {isYearOpen && (
              <div className="absolute right-0 z-10 mt-1.5 w-32 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                {yearOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setYear(opt);
                      setIsYearOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                      opt === year ? "font-semibold text-indigo-700" : "text-slate-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Full Transcript
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
              <TrendingUp className="h-4 w-4 text-indigo-600" strokeWidth={2} />
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              + 3%
            </span>
          </div>
          <p className="text-sm text-slate-500">Year 2 Cumulative GPA</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">3.78</p>
          <p className="mt-1 text-xs text-slate-400">Current GPA based on 10 subjects</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[75%] rounded-full bg-indigo-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50">
              <Star className="h-4 w-4 text-rose-500" strokeWidth={2} />
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              + 5%
            </span>
          </div>
          <p className="text-sm text-slate-500">Total Credits</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">52</p>
          <p className="mt-1 text-xs text-slate-400">Earned out of 80 required</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[65%] rounded-full bg-indigo-600" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-2 text-sm text-slate-500">Grades Distribution</p>
          <div className="flex items-center gap-4">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="value"
                    innerRadius={28}
                    outerRadius={44}
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    {gradeDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute flex flex-col items-center">
                <p className="text-base font-bold text-slate-900">10</p>
                <p className="text-[9px] font-semibold tracking-wide text-slate-400">
                  SUBJECTS
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              {gradeDistribution.map((item) => (
                <li key={item.name} className="flex items-center gap-2 text-slate-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}: {item.value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Semester cards */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Calendar className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Semester 1</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                Completed
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">October 2024 - December 2024</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400">
              AVG SCORE / RANK
            </p>
            <p className="text-sm font-bold text-slate-900">
              88 / <span className="font-medium text-slate-500">8th of 120</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <Hourglass className="h-5 w-5 text-amber-500" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Semester 2</p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                In Progress
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">January 2025 - June 2025</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400">
              PROJECTED / STATUS
            </p>
            <p className="text-sm font-bold text-amber-600">
              89 / <span className="font-medium">Pending</span>
            </p>
          </div>
        </div>
      </div>

      {/* Subject grades table */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-indigo-600" strokeWidth={2} />
            <h2 className="text-base font-bold text-slate-900">Subject Grades</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-200 p-0.5 text-sm font-medium">
              <button
                type="button"
                onClick={() => setSemester("1")}
                className={`rounded-md px-3 py-1.5 ${
                  semester === "1"
                    ? "bg-indigo-700 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Semester 1
              </button>
              <button
                type="button"
                onClick={() => setSemester("2")}
                className={`rounded-md px-3 py-1.5 ${
                  semester === "2"
                    ? "bg-indigo-700 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                Semester 2
              </button>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-slate-400">
                <th className="px-4 py-3">SUBJECT NAME</th>
                <th className="px-4 py-3">PROFESSOR</th>
                <th className="px-4 py-3">CREDITS</th>
                <th className="px-4 py-3">MIDTERM</th>
                <th className="px-4 py-3">FINAL PROJECT</th>
                <th className="px-4 py-3">AVERAGE</th>
                <th className="px-4 py-3">GRADE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjectGrades.map((row) => (
                <tr key={row.subject}>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {row.subject}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{row.professor}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{row.credits}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{row.midterm}</td>
                  <td className="px-4 py-4 text-sm text-slate-400">
                    {row.finalProject ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-indigo-700">
                    {row.average.toFixed(1)}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${row.gradeClass}`}
                    >
                      {row.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dean's list banner */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 shadow-sm">
        <div className="max-w-xl">
          <h3 className="text-base font-bold text-white">Dean&apos;s List Qualification</h3>
          <p className="mt-1 text-sm text-indigo-100">
            You are currently on track to qualify for the Dean&apos;s List for the academic
            year 2024-2025. Maintaining a GPA above 3.75 across all modules is required.
            Keep up the excellent performance!
          </p>
        </div>
        <div className="shrink-0 rounded-xl bg-white/10 px-5 py-3 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-indigo-100">
            REQUIRED GPA
          </p>
          <p className="text-lg font-bold text-white">3.75+</p>
          <p className="mt-1 text-[10px] font-semibold text-emerald-300">
            ● ACTIVE QUALIFIER
          </p>
        </div>
      </div>
    </div>
  );
}
