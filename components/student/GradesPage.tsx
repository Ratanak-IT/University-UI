"use client";

import { useMemo, useState } from "react";
import {
  TrendingUp,
  Star,
  Download,
  ChevronDown,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";
import { openTranscript } from "@/lib/transcript";
import {
  useGetStudentProfileQuery,
  useGetStudentGpaQuery,
} from "@/lib/redux/apiSlice";
import type { GradeResponse } from "@/lib/api/student";
import PersonAvatar from "@/components/shared/PersonAvatar";

const STATUS_LABEL: Record<GradeResponse["status"], string> = {
  POSTED: "Official",
  SUBMITTED: "Pending registrar",
  IN_PROGRESS: "In progress",
};

const STATUS_CLASS: Record<GradeResponse["status"], string> = {
  POSTED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  SUBMITTED: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  IN_PROGRESS:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
};

/** "2025-2026 · Semester 1" — the unit a student actually thinks in. */
function termKey(s: GradeResponse): string {
  return `${s.academicYear}__${s.semester}`;
}

function termLabel(s: GradeResponse): string {
  return `${s.academicYear} · Semester ${s.semester}`;
}

export default function GradesPage() {
  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const {
    data: gpaData,
    isLoading: loadingGpa,
    isError,
  } = useGetStudentGpaQuery(profile?.studentId ?? "", { skip: !profile?.studentId });

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isTermOpen, setIsTermOpen] = useState(false);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<GradeResponse | null>(null);

  const allSubjects = useMemo(() => gpaData?.subjects ?? [], [gpaData]);
  const loading = loadingProfile || loadingGpa;

  // The terms a student actually has grades for, most recent first — never a
  // hard-coded "Year 1..4" list that may not correspond to anything real.
  const terms = useMemo(() => {
    const seen = new Map<string, { key: string; label: string; academicYear: string; semester: number }>();
    for (const s of allSubjects) {
      const key = termKey(s);
      if (!seen.has(key)) {
        seen.set(key, { key, label: termLabel(s), academicYear: s.academicYear, semester: s.semester });
      }
    }
    return Array.from(seen.values()).sort((a, b) => {
      if (a.academicYear !== b.academicYear) return b.academicYear.localeCompare(a.academicYear);
      return b.semester - a.semester;
    });
  }, [allSubjects]);

  // Derived, not synced through an effect: the most recent term is the
  // sensible default, and falls out of the data itself once it loads.
  const activeTermKey = selectedTerm && terms.some((t) => t.key === selectedTerm)
    ? selectedTerm
    : (terms[0]?.key ?? null);

  const subjectGrades = useMemo(
    () => (activeTermKey ? allSubjects.filter((s) => termKey(s) === activeTermKey) : []),
    [allSubjects, activeTermKey]
  );

  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of subjectGrades) {
      const l = s.letterGrade;
      const group = !l ? "Pending" : l.startsWith("A") ? "Grade A" : l.startsWith("B") ? "Grade B" : "Grade C/Other";
      counts[group] = (counts[group] || 0) + 1;
    }
    const points = [
      { name: "Grade A", value: counts["Grade A"] || 0, color: "#10b981" },
      { name: "Grade B", value: counts["Grade B"] || 0, color: "#4f46e5" },
      { name: "Grade C", value: counts["Grade C/Other"] || 0, color: "#cbd5e1" },
      { name: "Pending", value: counts["Pending"] || 0, color: "#f59e0b" },
    ].filter((d) => d.value > 0);
    return points.length > 0 ? points : [{ name: "No grades yet", value: 1, color: "#e2e8f0" }];
  }, [subjectGrades]);

  const studentName = profile ? `${profile.firstName} ${profile.lastName}` : "Student";

  function exportToExcel() {
    if (subjectGrades.length === 0) return;
    const rows = subjectGrades.map((row) => ({
      "Subject Code": row.subjectCode,
      "Subject Name": row.subjectName,
      Credits: row.credit,
      "Score Percent": row.scorePercent !== null ? `${row.scorePercent.toFixed(1)}%` : "Pending",
      Grade: row.letterGrade || "Pending",
      "Grade Point": row.gradePoint !== null ? row.gradePoint : "Pending",
      Status: STATUS_LABEL[row.status],
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 15 }, { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 16 },
    ];

    const workbook = XLSX.utils.book_new();
    const term = terms.find((t) => t.key === activeTermKey);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Semester ${term?.semester ?? ""}`);
    XLSX.writeFile(workbook, `grades-${(term?.academicYear ?? "").replace(/\s/g, "")}-s${term?.semester ?? ""}.xlsx`);
  }

  function exportTranscript() {
    if (!profile || subjectGrades.length === 0) return;
    const term = terms.find((t) => t.key === activeTermKey);
    openTranscript(
      {
        fullName: studentName,
        studentId: profile.studentCode,
        nationalId: "***-**-1234",
        degreeProgram: "Undergraduate Program",
        academicYear: term?.academicYear ?? profile.academicYear,
        semester: String(term?.semester ?? ""),
      },
      subjectGrades.map((row) => ({
        code: row.subjectCode,
        subject: row.subjectName,
        credits: row.credit,
        score: Math.round(row.scorePercent ?? 0),
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

  if (isError) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <AlertCircle className="h-8 w-8 text-rose-400" />
        <p className="font-semibold text-slate-700 dark:text-slate-200">Could not load your grades</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please try again in a moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors">
      {/* Student Profile Header Banner */}
      {profile && (
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm text-card-foreground">
          <div className="flex items-center gap-5">
            <PersonAvatar name={studentName} avatarUrl={profile.avatarUrl} size="lg" />

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {studentName}
                </h1>
                <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Active Student
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  ID: {profile.studentCode}
                </span>
                <span>•</span>
                <span>Year {profile.yearLevel}</span>
                <span>•</span>
                <span>{terms.find((t) => t.key === activeTermKey)?.label ?? "No grades yet"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cumulative GPA</p>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {gpaData ? gpaData.cumulativeGpa.toFixed(2) : "0.00"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Credits Earned</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {gpaData ? gpaData.creditsEarned : 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Academic Records &amp; Subject Grades</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official subject score breakdowns entered by course instructors.
          </p>
        </div>

        {terms.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTermOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {terms.find((t) => t.key === activeTermKey)?.label ?? "Select term"}
                <ChevronDown className="h-4 w-4" />
              </button>
              {isTermOpen && (
                <div className="absolute right-0 z-10 mt-1.5 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  {terms.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        setSelectedTerm(t.key);
                        setIsTermOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                        t.key === activeTermKey
                          ? "font-semibold text-indigo-700 dark:text-indigo-400"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={exportTranscript}
              disabled={subjectGrades.length === 0}
              className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm"
            >
              <Download className="h-4 w-4" strokeWidth={2} />
              Full Transcript
            </button>
          </div>
        )}
      </div>

      {allSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <Star className="h-8 w-8 text-slate-300 dark:text-slate-700" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">No grades posted yet</p>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Once a teacher posts a score in one of your classes, it shows up here.
          </p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/15">
                <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cumulative GPA</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
                {gpaData?.cumulativeGpa.toFixed(2) ?? "0.00"}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Official (posted) grades only — {gpaData?.currentGpa.toFixed(2) ?? "0.00"} including in-progress
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                  style={{ width: `${gpaData ? (gpaData.cumulativeGpa / 4) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/15">
                <Star className="h-4 w-4 text-rose-500 dark:text-rose-400" strokeWidth={2} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Credits</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-50">
                {gpaData?.creditsEarned ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Earned of {gpaData?.creditsAttempted ?? 0} attempted
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                  style={{
                    width: `${
                      gpaData?.creditsAttempted
                        ? Math.min((gpaData.creditsEarned / gpaData.creditsAttempted) * 100, 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">This term&apos;s grades</p>
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
                    <p className="text-base font-bold text-slate-900 dark:text-slate-50">{subjectGrades.length}</p>
                    <p className="text-[9px] font-semibold tracking-wide text-slate-400 dark:text-slate-500">
                      SUBJECTS
                    </p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm">
                  {gradeDistribution.map((item) => (
                    <li key={item.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}: {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Subject grades table */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Subject Grades</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={exportToExcel}
                  disabled={subjectGrades.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  disabled={subjectGrades.length === 0}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:border-slate-800 dark:text-slate-400">
                    <th className="px-4 py-3.5">Subject &amp; Code</th>
                    <th className="px-3 py-3.5 text-center">Completeness</th>
                    <th className="px-3 py-3.5 text-center">Total (%)</th>
                    <th className="px-3 py-3.5 text-center">GPA</th>
                    <th className="px-3 py-3.5 text-center">Grade</th>
                    <th className="px-3 py-3.5 text-center">Status</th>
                    <th className="px-3 py-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subjectGrades.map((row) => {
                    let badgeCls = "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400";
                    if (row.letterGrade?.startsWith("A")) {
                      badgeCls = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
                    } else if (row.letterGrade?.startsWith("B")) {
                      badgeCls = "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300";
                    } else if (row.letterGrade?.startsWith("C") || row.letterGrade?.startsWith("D")) {
                      badgeCls = "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300";
                    }

                    return (
                      <tr key={row.courseGradeId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{row.subjectName}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {row.subjectCode} · {row.className} ({row.credit} Credits)
                          </div>
                        </td>

                        <td className="px-3 py-4 text-center text-slate-600 dark:text-slate-300">
                          {row.completenessPercent !== null ? `${row.completenessPercent.toFixed(0)}%` : "—"}
                        </td>

                        <td className="px-3 py-4 text-center font-extrabold text-indigo-700 dark:text-indigo-400">
                          {row.scorePercent !== null ? `${row.scorePercent.toFixed(1)}%` : "—"}
                        </td>

                        <td className="px-3 py-4 text-center font-semibold text-slate-600 dark:text-slate-300">
                          {row.gradePoint !== null ? row.gradePoint.toFixed(2) : "—"}
                        </td>

                        <td className="px-3 py-4 text-center">
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${badgeCls}`}>
                            {row.letterGrade || "—"}
                          </span>
                        </td>

                        <td className="px-3 py-4 text-center">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${STATUS_CLASS[row.status]}`}>
                            {STATUS_LABEL[row.status]}
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
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dean's list banner */}
          {gpaData && gpaData.cumulativeGpa >= 3.5 && (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-700 to-indigo-600 p-6 shadow-sm dark:from-indigo-800 dark:to-indigo-700">
              <div className="max-w-xl">
                <h3 className="text-base font-bold text-white">Dean&apos;s List Qualification</h3>
                <p className="mt-1 text-sm text-indigo-100">
                  You are currently on track to qualify for the Dean&apos;s List. Maintaining a Cumulative GPA
                  above 3.50 across all modules is required. Keep up the excellent performance!
                </p>
              </div>
              <div className="shrink-0 rounded-xl bg-white/10 px-5 py-3 text-center">
                <p className="text-[10px] font-semibold tracking-wide text-indigo-100">REQUIRED GPA</p>
                <p className="text-lg font-bold text-white">3.50+</p>
                <p className="mt-1 text-[10px] font-semibold text-emerald-300">● ACTIVE QUALIFIER</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Score Breakdown Modal */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {selectedSubjectModal.subjectCode}
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedSubjectModal.subjectName}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedSubjectModal.className} · {selectedSubjectModal.credit} Credits ·{" "}
                  {termLabel(selectedSubjectModal)}
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {selectedSubjectModal.scorePercent !== null
                    ? `${selectedSubjectModal.scorePercent.toFixed(1)}%`
                    : "—"}
                </span>
                <div className="mt-1">
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      STATUS_CLASS[selectedSubjectModal.status]
                    }`}
                  >
                    {selectedSubjectModal.letterGrade || "Pending"} · {STATUS_LABEL[selectedSubjectModal.status]}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-b border-slate-100 py-4 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Component breakdown
              </h3>

              {selectedSubjectModal.breakdown.length === 0 ? (
                <p className="py-2 text-xs text-slate-400">
                  This classroom&apos;s grading policy has no components set up yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedSubjectModal.breakdown.map((b) => (
                    <div
                      key={b.componentId}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-xs font-extrabold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                          {b.weightPercent.toFixed(0)}%
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{b.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {b.gradedItems}/{b.totalItems} marked · weighted {b.weightPercent.toFixed(0)}% of total
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                          {b.earnedPoints.toFixed(1)} / {b.possiblePoints.toFixed(1)}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {b.percent !== null ? `${b.percent.toFixed(0)}%` : "Not marked yet"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSubjectModal.remark && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300">
                  <span className="font-bold uppercase tracking-wide text-slate-400">Teacher&apos;s remark: </span>
                  {selectedSubjectModal.remark}
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
    </div>
  );
}
