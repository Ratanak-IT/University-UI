import type { Metadata } from "next";

export const metadata: Metadata = { title: "Quizzes" };

const quizzes = [
  { title: "Big O Notation Check", course: "CS-DS210", questions: 10, duration: "15 min", status: "open", score: null },
  { title: "SQL Joins Quiz", course: "CS-DB301", questions: 12, duration: "20 min", status: "open", score: null },
  { title: "React Hooks Basics", course: "CS-WD201", questions: 15, duration: "25 min", status: "done", score: "13/15" },
  { title: "OWASP Top 10", course: "CS-SEC401", questions: 20, duration: "30 min", status: "done", score: "17/20" },
  { title: "Heuristic Evaluation", course: "CS-UX202", questions: 8, duration: "10 min", status: "done", score: "8/8" },
  { title: "Final Review Quiz", course: "CS-WD201", questions: 25, duration: "40 min", status: "upcoming", score: null },
];

const chip = {
  open: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
  upcoming: "bg-slate-100 text-slate-500",
} as const;

const label = { open: "Open now", done: "Completed", upcoming: "Not open yet" } as const;

export default function QuizzesPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Quizzes</h2>
        <p className="mt-1 text-sm text-slate-500">
          {quizzes.filter((q) => q.status === "open").length} quizzes open right now.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {quizzes.map((q) => (
          <div key={q.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-bold text-indigo-950">{q.title}</p>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${chip[q.status as keyof typeof chip]}`}
              >
                {label[q.status as keyof typeof label]}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">{q.course}</p>

            <p className="mt-4 text-xs text-slate-500">
              {q.questions} questions · {q.duration}
            </p>

            {q.score ? (
              <p className="mt-4 text-2xl font-black text-indigo-950">{q.score}</p>
            ) : (
              <button
                disabled={q.status !== "open"}
                className="mt-4 w-full rounded-lg bg-indigo-700 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {q.status === "open" ? "Start quiz" : "Not available"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
