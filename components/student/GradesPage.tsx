"use client";

import { useState } from "react";
import { TrendingUp, Star, Calendar, Hourglass, Download, ChevronDown, FileSpreadsheet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { openTranscript } from "@/lib/transcript";

const STUDENT = {
  fullName: "Sok Maly",
  studentId: "STU-2026-142",
  nationalId: "***-**-1234",
  degreeProgram: "Computer Science · Software Engineering Track",
};

const CUMULATIVE_CGPA = 3.78;

const gradeDistribution = [
  { name: "Grade A", value: 5, color: "#10b981" },
  { name: "Grade B", value: 4, color: "#4f46e5" },
  { name: "Grade C", value: 1, color: "#cbd5e1" },
];

const yearOptions = ["Year 1", "Year 2", "Year 3", "Year 4"];

const semester1Grades = [
  {
    code: "SE301",
    subject: "Spring Boot",
    professor: "Dr. Dara Kim",
    credits: 4,
    midterm: 90,
    finalProject: 94,
    average: 92.0,
    grade: "A",
    gradeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    code: "CS210",
    subject: "Data Structure",
    professor: "Sokha Rin",
    credits: 4,
    midterm: 86,
    finalProject: 89,
    average: 87.5,
    grade: "B+",
    gradeClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    code: "CN220",
    subject: "Computer Network",
    professor: "Elena Rossi",
    credits: 5,
    midterm: 84,
    finalProject: 88,
    average: 86.0,
    grade: "B+",
    gradeClass: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  },
  {
    code: "SE315",
    subject: "Software Engineering",
    professor: "Marcus Reed",
    credits: 4,
    midterm: 91,
    finalProject: 93,
    average: 92.0,
    grade: "A",
    gradeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    code: "OS230",
    subject: "Operating System",
    professor: "Linda Park",
    credits: 3,
    midterm: 80,
    finalProject: 85,
    average: 82.5,
    grade: "B",
    gradeClass: "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300",
  },
];

const semester2Grades = [
  {
    code: "CC340",
    subject: "Cloud Computing",
    professor: "Dr. Dara Kim",
    credits: 4,
    midterm: 88,
    finalProject: null,
    average: 88.0,
    grade: "Pending",
    gradeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    code: "CS320",
    subject: "Algorithms",
    professor: "Sokha Rin",
    credits: 4,
    midterm: 91,
    finalProject: null,
    average: 91.0,
    grade: "Pending",
    gradeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    code: "MD310",
    subject: "Mobile Development",
    professor: "Elena Rossi",
    credits: 4,
    midterm: 85,
    finalProject: null,
    average: 85.0,
    grade: "Pending",
    gradeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
];

export default function GradesPage() {
  const [semester, setSemester] = useState<"1" | "2">("1");
  const [year, setYear] = useState("Year 2");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const subjectGrades = semester === "1" ? semester1Grades : semester2Grades;

  function exportToExcel() {
    const rows = subjectGrades.map((row) => ({
      "Subject Code": row.code,
      "Subject Name": row.subject,
      Professor: row.professor,
      Credits: row.credits,
      Midterm: row.midterm,
      "Final Project": row.finalProject ?? "-",
      Average: row.average.toFixed(1),
      Grade: row.grade,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 12 }, // Subject Code
      { wch: 24 }, // Subject Name
      { wch: 18 }, // Professor
      { wch: 9 },  // Credits
      { wch: 10 }, // Midterm
      { wch: 14 }, // Final Project
      { wch: 10 }, // Average
      { wch: 10 }, // Grade
    ];

    const workbook = XLSX.utils.book_new();
    const sheetName = `Semester ${semester}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = `grades-${year.toLowerCase().replace(" ", "-")}-semester-${semester}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  function exportTranscript() {
    openTranscript(
      {
        fullName: STUDENT.fullName,
        studentId: STUDENT.studentId,
        nationalId: STUDENT.nationalId,
        degreeProgram: STUDENT.degreeProgram,
        academicYear: "2025-2026",
        semester,
      },
      subjectGrades.map((row) => ({
        code: row.code,
        subject: row.subject,
        credits: row.credits,
        score: Math.round(row.average),
        grade: row.grade,
      })),
      CUMULATIVE_CGPA
    );
  }

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb + header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            <span className="text-indigo-600 dark:text-indigo-400">Academic Records</span> / Year 2
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Grades Overview</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            tracking and module results for the current academic year.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsYearOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {year}
              <ChevronDown className="h-4 w-4" />
            </button>
            {isYearOpen && (
              <div className="absolute right-0 z-10 mt-1.5 w-32 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                {yearOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setYear(opt);
                      setIsYearOpen(false);
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                      opt === year ? "font-semibold text-indigo-700 dark:text-indigo-400" : "text-slate-600 dark:text-slate-300"
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
            onClick={exportTranscript}
            className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Full Transcript
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15">
              <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              + 3%
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Year 2 Cumulative GPA</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">3.78</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Current GPA based on 10 subjects</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-[75%] rounded-full bg-indigo-600 dark:bg-indigo-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/15">
              <Star className="h-4 w-4 text-rose-500 dark:text-rose-400" strokeWidth={2} />
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              + 5%
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Credits</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">52</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Earned out of 80 required</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-[65%] rounded-full bg-indigo-600 dark:bg-indigo-500" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Grades Distribution</p>
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
                <p className="text-base font-bold text-slate-900 dark:text-slate-50">10</p>
                <p className="text-[9px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                  SUBJECTS
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              {gradeDistribution.map((item) => (
                <li key={item.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
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
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/15">
            <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Semester 1</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                Completed
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">October 2024 - December 2024</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
              AVG SCORE / RANK
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              88 / <span className="font-medium text-slate-500 dark:text-slate-400">8th of 120</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/15">
            <Hourglass className="h-5 w-5 text-amber-500 dark:text-amber-400" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Semester 2</p>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                In Progress
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">January 2025 - June 2025</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
              PROJECTED / STATUS
            </p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              89 / <span className="font-medium">Pending</span>
            </p>
          </div>
        </div>
      </div>

      {/* Subject grades table */}
      <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Subject Grades</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-slate-200 p-0.5 text-sm font-medium dark:border-slate-700">
              <button
                type="button"
                onClick={() => setSemester("1")}
                className={`rounded-md px-3 py-1.5 ${
                  semester === "1"
                    ? "bg-indigo-700 text-white dark:bg-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                Semester 1
              </button>
              <button
                type="button"
                onClick={() => setSemester("2")}
                className={`rounded-md px-3 py-1.5 ${
                  semester === "2"
                    ? "bg-indigo-700 text-white dark:bg-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                Semester 2
              </button>
            </div>
            <button
              type="button"
              onClick={exportToExcel}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                <th className="px-4 py-3">SUBJECT NAME</th>
                <th className="px-4 py-3">PROFESSOR</th>
                <th className="px-4 py-3">CREDITS</th>
                <th className="px-4 py-3">MIDTERM</th>
                <th className="px-4 py-3">FINAL PROJECT</th>
                <th className="px-4 py-3">AVERAGE</th>
                <th className="px-4 py-3">GRADE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectGrades.map((row) => (
                <tr key={row.subject}>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {row.subject}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.professor}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.credits}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.midterm}</td>
                  <td className="px-4 py-4 text-sm text-slate-400 dark:text-slate-500">
                    {row.finalProject ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
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
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 shadow-sm dark:from-indigo-800 dark:to-indigo-700">
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
