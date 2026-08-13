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
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<GradeResponse | null>(null);

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
        
        const gpa = await fetchStudentGpa(p.studentId);
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
  
  const filteredGrades = allSubjects.filter((s) => {
    if (!s.semester) return true;
    return s.semester === selectedSemesterNum;
  });

  // If filtered yield empty but allSubjects has items, fallback to allSubjects so student doesn't see blank page
  const subjectGrades = filteredGrades.length > 0 ? filteredGrades : allSubjects;

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
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors">
      {/* Student Profile Header Banner */}
      {profile && (
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm text-card-foreground">
          <div className="flex items-center gap-5">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Student Avatar"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-indigo-50 dark:ring-indigo-950"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 text-xl font-black text-white shadow-md">
                {profile.firstName ? profile.firstName[0].toUpperCase() : "S"}
                {profile.lastName ? profile.lastName[0].toUpperCase() : "T"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Active Student
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  ID: {profile.studentCode || "STU-001"}
                </span>
                <span>•</span>
                <span>Year {profile.yearLevel || 2} · Semester {semester}</span>
                <span>•</span>
                <span>Academic Year: {profile.academicYear || "2025-2026"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cumulative GPA</p>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {gpaData?.cumulativeGpa ? gpaData.cumulativeGpa.toFixed(2) : "0.00"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Earned Credits</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {gpaData?.totalCredits ? gpaData.totalCredits : 0} pts
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Academic Records & Subject Grades</h2>
          <p className="text-xs text-slate-500">
            Official subject score breakdowns entered by course instructors.
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
            className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm"
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
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
                <th className="px-4 py-3.5">Subject & Code</th>
                <th className="px-3 py-3.5 text-center">Midterm</th>
                <th className="px-3 py-3.5 text-center">Final</th>
                <th className="px-3 py-3.5 text-center">Assign</th>
                <th className="px-3 py-3.5 text-center">Quiz</th>
                <th className="px-3 py-3.5 text-center">Attend</th>
                <th className="px-3 py-3.5 text-center">Total (%)</th>
                <th className="px-3 py-3.5 text-center">GPA</th>
                <th className="px-3 py-3.5 text-center">Grade</th>
                <th className="px-3 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {subjectGrades.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-400">
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

                  const findCategory = (type: string) => {
                    if (!row.scores) return null;
                    return row.scores.find((s) => s.examType === type);
                  };

                  const m = findCategory("MIDTERM");
                  const f = findCategory("FINAL");
                  const a = findCategory("ASSIGNMENT");
                  const q = findCategory("QUIZ");
                  const att = findCategory("ATTENDANCE");

                  return (
                    <tr key={row.classroomId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {row.subjectName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {row.subjectCode || "CODE"} · {row.className || "Class"} ({row.credit || 3} Credits)
                        </div>
                      </td>

                      {/* Midterm Column */}
                      <td className="px-3 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {m ? `${m.score}/${m.maxScore}` : "-"}
                      </td>

                      {/* Final Column */}
                      <td className="px-3 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {f ? `${f.score}/${f.maxScore}` : "-"}
                      </td>

                      {/* Assign Column */}
                      <td className="px-3 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {a ? `${a.score}/${a.maxScore}` : "-"}
                      </td>

                      {/* Quiz Column */}
                      <td className="px-3 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {q ? `${q.score}/${q.maxScore}` : "-"}
                      </td>

                      {/* Attend Column */}
                      <td className="px-3 py-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {att ? `${att.score}/${att.maxScore}` : "-"}
                      </td>

                      {/* Total Score % Column */}
                      <td className="px-3 py-4 text-center font-extrabold text-indigo-700 dark:text-indigo-400">
                        {row.scorePercent !== null ? `${row.scorePercent.toFixed(1)}%` : "—"}
                      </td>

                      {/* GPA Column */}
                      <td className="px-3 py-4 text-center font-semibold text-slate-600 dark:text-slate-300">
                        {row.gradePoint !== null ? row.gradePoint.toFixed(2) : "—"}
                      </td>

                      {/* Grade Badge Column */}
                      <td className="px-3 py-4 text-center">
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${badgeCls}`}>
                          {row.letterGrade || "Pending"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSubjectModal(row)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                        >
                          View Breakdown
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Breakdown Modal */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {selectedSubjectModal.subjectCode}
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedSubjectModal.subjectName}
                </h2>
                <p className="text-xs text-slate-500">
                  Classroom: {selectedSubjectModal.className} · {selectedSubjectModal.credit} Credits
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {selectedSubjectModal.scorePercent !== null ? `${selectedSubjectModal.scorePercent.toFixed(1)}%` : "—"}
                </span>
                <div className="mt-1">
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Grade: {selectedSubjectModal.letterGrade || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-b border-slate-100 dark:border-slate-800 py-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detailed Assessment Scores (ពិន្ទុតាមផ្នែក)
              </h3>

              {!selectedSubjectModal.scores || selectedSubjectModal.scores.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No individual category scores entered by teacher yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedSubjectModal.scores.map((sc, i) => {
                    const percent = Math.round((sc.score / sc.maxScore) * 100);
                    return (
                      <div
                        key={sc.examScoreId || i}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                            {sc.examType.substring(0, 3)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {sc.examType}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Earned {sc.score} out of {sc.maxScore} points
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                            {sc.score} / {sc.maxScore}
                          </p>
                          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {percent}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setSelectedSubjectModal(null)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
