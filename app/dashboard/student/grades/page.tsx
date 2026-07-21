<<<<<<< HEAD
import GradesPage from "@/components/student/GradesPage";

export default function Grades() {
  return <GradesPage />;
=======
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Grades" };

const grades = [
  { course: "Web Development", code: "CS-WD201", credits: 3, midterm: 88, assign: 92, quiz: 85, final: 90, total: 89.2, grade: "A", gpa: 4.0 },
  { course: "Database Systems", code: "CS-DB301", credits: 3, midterm: 78, assign: 84, quiz: 80, final: 82, total: 81.3, grade: "B+", gpa: 3.5 },
  { course: "Software Security", code: "CS-SEC401", credits: 4, midterm: 72, assign: 80, quiz: 75, final: 78, total: 76.4, grade: "B", gpa: 3.0 },
  { course: "UX Fundamentals", code: "CS-UX202", credits: 2, midterm: 94, assign: 96, quiz: 92, final: 95, total: 94.4, grade: "A", gpa: 4.0 },
  { course: "Data Structures", code: "CS-DS210", credits: 4, midterm: 81, assign: 86, quiz: 79, final: 84, total: 83.0, grade: "B+", gpa: 3.5 },
  { course: "Academic English", code: "ENG-120", credits: 2, midterm: 90, assign: 88, quiz: 91, final: 89, total: 89.4, grade: "A", gpa: 4.0 },
];

const gradeColor = (g: string) =>
  g.startsWith("A")
    ? "bg-emerald-100 text-emerald-700"
    : g.startsWith("B")
      ? "bg-indigo-100 text-indigo-700"
      : g.startsWith("C")
        ? "bg-amber-100 text-amber-700"
        : "bg-rose-100 text-rose-700";

export default function GradesPage() {
  const totalCredits = grades.reduce((s, g) => s + g.credits, 0);
  const gpa =
    grades.reduce((s, g) => s + g.gpa * g.credits, 0) / totalCredits;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Grades</h2>
        <p className="mt-1 text-sm text-slate-500">
          Semester 2 · Academic Year 2024–2025
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Semester GPA", value: gpa.toFixed(2) },
          { label: "Credits Earned", value: String(totalCredits) },
          { label: "Cumulative CGPA", value: "3.71" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">{s.label}</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-indigo-950">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left">
                {["Course", "Credits", "Midterm", "Assign", "Quiz", "Final", "Total", "Grade", "GPA"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-400"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.code} className="transition-colors hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-bold text-indigo-950">{g.course}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{g.code}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{g.credits}</td>
                  <td className="px-5 py-4 text-slate-600">{g.midterm}</td>
                  <td className="px-5 py-4 text-slate-600">{g.assign}</td>
                  <td className="px-5 py-4 text-slate-600">{g.quiz}</td>
                  <td className="px-5 py-4 text-slate-600">{g.final}</td>
                  <td className="px-5 py-4 font-bold text-indigo-950">
                    {g.total.toFixed(1)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${gradeColor(g.grade)}`}
                    >
                      {g.grade}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {g.gpa.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
>>>>>>> 75d75bff4426661f24b10d98296ded934773e440
}
