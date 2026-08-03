"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Star, Calendar, Hourglass, Download, ChevronDown, FileSpreadsheet, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { openTranscript } from "@/lib/transcript";
import { fetchMyProfile, fetchStudentGpa, GpaResponse, GradeResponse, StudentProfile } from "@/lib/api/student";

const yearOptions = ["Year 1", "Year 2", "Year 3", "Year 4"];

export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [gpaData, setGpaData] = useState<GpaResponse | null>(null);
  
  const [semester, setSemester] = useState<"1" | "2">("1");
  const [year, setYear] = useState("Year 2");
  const [isYearOpen, setIsYearOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) {
        setProfile(p);
        // Map year level to text
        const yrText = `Year ${p.yearLevel}`;
        if (yearOptions.includes(yrText)) {
          setYear(yrText);
        }
        
        const gpa = await fetchStudentGpa(p.id);
        if (gpa) {
          setGpaData(gpa);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  // Filter subjects by the current active year level and semester
  const selectedYearNum = parseInt(year.replace("Year ", "")) || 2;
  const selectedSemesterNum = parseInt(semester);

  // Group and filter subjects based on selection
  const allSubjects = gpaData?.subjects ?? [];
  
  const subjectGrades = allSubjects.filter((s) => {
    // If backend doesn't provide yearLevel in GradeResponse, we map semester and academic year
    const matchesSemester = s.semester === selectedSemesterNum;
    return matchesSemester;
  });

  // Calculate grade distribution dynamically for the chart
  const gradeCounts: Record<string, number> = {};
  allSubjects.forEach((s) => {
    const l = s.letterGrade || "Pending";
    let group = "Grade C/Other";
    if (l.startsWith("A")) group = "Grade A";
    else if (l.startsWith("B")) group = "Grade B";
    else if (l === "Pending") group = "Pending";
    gradeCounts[group] = (gradeCounts[group] || 0) + 1;
  });

  const gradeDistribution = [
    { name: "Grade A", value: gradeCounts["Grade A"] || 0, color: "#10b981" },
    { name: "Grade B", value: gradeCounts["Grade B"] || 0, color: "#4f46e5" },
    { name: "Grade C", value: gradeCounts["Grade C/Other"] || 0, color: "#cbd5e1" },
  ].filter(d => d.value > 0);

  // Fallback if empty
  if (gradeDistribution.length === 0) {
    gradeDistribution.push({ name: "No Grades", value: 1, color: "#cbd5e1" });
  }

  // Calculate average scores per semester
  const sem1Subjects = allSubjects.filter(s => s.semester === 1);
  const sem2Subjects = allSubjects.filter(s => s.semester === 2);

  const sem1Avg = sem1Subjects.length > 0
    ? Math.round(sem1Subjects.reduce((sum, s) => sum + (s.scorePercent || 0), 0) / sem1Subjects.length)
    : 0;

  const sem2Avg = sem2Subjects.length > 0
    ? Math.round(sem2Subjects.reduce((sum, s) => sum + (s.scorePercent || 0), 0) / sem2Subjects.length)
    : 0;

  const completedSubjectsCount = allSubjects.filter(s => s.letterGrade && s.letterGrade !== "Pending").length;

  function exportToExcel() {
    const rows = subjectGrades.map((row) => ({
      "Subject Code": row.subjectCode,
      "Subject Name": row.subjectName,
      Credits: row.credit,
      "Score Percent": row.scorePercent !== null ? `${row.scorePercent}%` : "Pending",
      Grade: row.letterGrade || "Pending",
      "Grade Point": row.gradePoint !== null ? row.gradePoint : "Pending",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 15 }, // Subject Code
      { wch: 30 }, // Subject Name
      { wch: 10 }, // Credits
      { wch: 15 }, // Score Percent
      { wch: 10 }, // Grade
      { wch: 12 }, // Grade Point
    ];

    const workbook = XLSX.utils.book_new();
    const sheetName = `Semester ${semester}`;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const fileName = `grades-${year.toLowerCase().replace(" ", "-")}-semester-${semester}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  function exportTranscript() {
    if (!profile) return;
    openTranscript(
      {
        fullName: `${profile.firstName} ${profile.lastName}`,
        studentId: profile.studentCode,
        nationalId: "***-**-1234",
        degreeProgram: "Undergraduate Program",
        academicYear: profile.academicYear,
        semester: semester,
      },
      subjectGrades.map((row) => ({
        code: row.subjectCode,
        subject: row.subjectName,
        credits: row.credit,
        score: Math.round(row.scorePercent || 0),
        grade: row.letterGrade || "Pending",
      })),
      gpaData?.cumulativeGpa ?? 0
    );
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      {/* Breadcrumb + header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
            <span className="text-indigo-600 dark:text-indigo-400">Academic Records</span> / {year}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50">Grades Overview</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tracking and module results for the current academic year.
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
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Cumulative GPA</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {gpaData?.cumulativeGpa !== undefined ? gpaData.cumulativeGpa.toFixed(2) : "0.00"}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Current GPA based on {completedSubjectsCount} graded subject{completedSubjectsCount !== 1 ? "s" : ""}
          </p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500" 
              style={{ width: `${gpaData?.cumulativeGpa ? (gpaData.cumulativeGpa / 4.0) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/15">
              <Star className="h-4 w-4 text-rose-500 dark:text-rose-400" strokeWidth={2} />
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Credits</p>
          <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
            {gpaData?.totalCredits !== undefined ? gpaData.totalCredits : "0"}
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Earned credits</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div 
              className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500" 
              style={{ width: `${gpaData?.totalCredits ? Math.min((gpaData.totalCredits / 120) * 100, 100) : 0}%` }}
            />
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
                <p className="text-base font-bold text-slate-900 dark:text-slate-50">
                  {allSubjects.length}
                </p>
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
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
              AVG SCORE
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {sem1Avg > 0 ? `${sem1Avg}%` : "—"}
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
                Active
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
              AVG SCORE
            </p>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">
              {sem2Avg > 0 ? `${sem2Avg}%` : "—"}
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
                <th className="px-4 py-3">SUBJECT CODE</th>
                <th className="px-4 py-3">CREDITS</th>
                <th className="px-4 py-3">CLASS NAME</th>
                <th className="px-4 py-3">SCORE PERCENT</th>
                <th className="px-4 py-3">GRADE POINT</th>
                <th className="px-4 py-3">LETTER GRADE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectGrades.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                    No subject grades recorded for Semester {semester}.
                  </td>
                </tr>
              ) : (
                subjectGrades.map((row) => {
                  let badgeCls = "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
                  if (row.letterGrade?.startsWith("A")) {
                    badgeCls = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
                  } else if (row.letterGrade?.startsWith("B")) {
                    badgeCls = "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300";
                  } else if (row.letterGrade?.startsWith("C") || row.letterGrade?.startsWith("D")) {
                    badgeCls = "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300";
                  }

                  return (
                    <tr key={row.classroomId}>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {row.subjectName}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.subjectCode}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.credit}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{row.className}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                        {row.scorePercent !== null ? `${row.scorePercent.toFixed(1)}%` : "—"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {row.gradePoint !== null ? row.gradePoint.toFixed(2) : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeCls}`}>
                          {row.letterGrade || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dean's list banner */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 shadow-sm dark:from-indigo-800 dark:to-indigo-700">
        <div className="max-w-xl">
          <h3 className="text-base font-bold text-white">Dean&apos;s List Qualification</h3>
          <p className="mt-1 text-sm text-indigo-100">
            You are currently on track to qualify for the Dean&apos;s List. Maintaining a Cumulative GPA above 3.50 across all modules is required. Keep up the excellent performance!
          </p>
        </div>
        <div className="shrink-0 rounded-xl bg-white/10 px-5 py-3 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-indigo-100">
            REQUIRED GPA
          </p>
          <p className="text-lg font-bold text-white">3.50+</p>
          {gpaData && gpaData.cumulativeGpa >= 3.50 && (
            <p className="mt-1 text-[10px] font-semibold text-emerald-300">
              ● ACTIVE QUALIFIER
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
