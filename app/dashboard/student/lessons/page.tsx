import type { Metadata } from "next";
import { PlayCircle, FileText, Lock } from "lucide-react";

export const metadata: Metadata = { title: "Lessons" };

const lessons = [
  { title: "Lesson 7: Server Components", course: "CS-WD201", date: "Nov 23, 2024", video: true, pdf: "ServerComponents.pdf", locked: false },
  { title: "Lesson 6: Routing & Layouts", course: "CS-WD201", date: "Nov 16, 2024", video: true, pdf: "Routing_Guide.pdf", locked: false },
  { title: "Lesson 5: Indexes & Query Plans", course: "CS-DB301", date: "Nov 9, 2024", video: true, pdf: "Indexes.pdf", locked: false },
  { title: "Lesson 4: Normalization", course: "CS-DB301", date: "Nov 2, 2024", video: false, pdf: "Normalization.pdf", locked: false },
  { title: "Lesson 3: XSS & CSRF", course: "CS-SEC401", date: "Oct 26, 2024", video: true, pdf: "XSS_CSRF.pdf", locked: false },
  { title: "Lesson 8: Deployment", course: "CS-WD201", date: "Nov 30, 2024", video: true, pdf: "Deployment.pdf", locked: true },
];

export default function LessonsPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Lessons</h2>
        <p className="mt-1 text-sm text-slate-500">
          Course materials from your enrolled classes.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <ul className="divide-y divide-slate-100">
          {lessons.map((l) => (
            <li
              key={l.title}
              className={`flex items-center gap-4 p-5 ${l.locked ? "opacity-55" : "transition-colors hover:bg-slate-50"}`}
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-bold text-indigo-950">
                  {l.title}
                  {l.locked && <Lock className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
                    {l.course}
                  </span>
                  {l.video && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <PlayCircle className="h-3.5 w-3.5" strokeWidth={2} />
                      Video
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-slate-500">
                    <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                    {l.pdf}
                  </span>
                </p>
              </div>

              <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{l.date}</span>

              <button
                disabled={l.locked}
                className="shrink-0 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {l.locked ? "Locked" : "Open"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
