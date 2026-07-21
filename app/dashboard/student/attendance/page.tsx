import type { Metadata } from "next";

export const metadata: Metadata = { title: "Attendance" };

const records = [
  { course: "Web Development", code: "CS-WD201", attended: 22, total: 24, rate: 92 },
  { course: "Database Systems", code: "CS-DB301", attended: 20, total: 22, rate: 91 },
  { course: "Software Security", code: "CS-SEC401", attended: 17, total: 20, rate: 85 },
  { course: "UX Fundamentals", code: "CS-UX202", attended: 18, total: 18, rate: 100 },
  { course: "Data Structures", code: "CS-DS210", attended: 14, total: 18, rate: 78 },
  { course: "Academic English", code: "ENG-120", attended: 11, total: 12, rate: 92 },
];

const rateColor = (r: number) =>
  r >= 90 ? "text-emerald-600" : r >= 80 ? "text-amber-600" : "text-rose-600";

const barColor = (r: number) =>
  r >= 90 ? "bg-emerald-500" : r >= 80 ? "bg-amber-500" : "bg-rose-500";

export default function AttendancePage() {
  const overall = Math.round(
    (records.reduce((s, r) => s + r.attended, 0) /
      records.reduce((s, r) => s + r.total, 0)) *
      100
  );

  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Attendance</h2>
        <p className="mt-1 text-sm text-slate-500">
          Overall {overall}% · 80% required to sit final exams
        </p>
      </div>

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
              <p className="mt-2 text-xs font-semibold text-rose-600">
                Below the 80% requirement — speak to your advisor.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
