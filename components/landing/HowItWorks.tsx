import { RotateCcw } from "lucide-react";

/**
 * Numbered because a term genuinely is a sequence — each stage depends on the
 * one before it, and stage 04 feeds back into 01.
 */
const STAGES = [
  {
    n: "01",
    when: "Weeks -6 to -2",
    title: "Set up the term",
    body: "Import courses, assign teachers, build the timetable. Clashes get caught here, while they're still cheap to fix.",
  },
  {
    n: "02",
    when: "Weeks -3 to 0",
    title: "Open enrollment",
    body: "Students pick classes against live capacity. Prerequisites are checked on the way in, so nobody lands in a class they can't take.",
  },
  {
    n: "03",
    when: "Weeks 1 to 15",
    title: "Teach the term",
    body: "Attendance, lesson files, assignments, submissions. Teachers work from one screen; you watch the whole institution from another.",
  },
  {
    n: "04",
    when: "Weeks 16 to 17",
    title: "Close the books",
    body: "Grades finalize, transcripts generate, the term archives. Next term's setup starts from this one instead of a blank sheet.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-wide text-indigo-700">
            THE TERM CYCLE
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Four stages, and then it starts again.
          </h2>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s, i) => (
            <li
              key={s.n}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-700">
                  {s.n}
                </span>
                <span aria-hidden className="h-px flex-1 bg-slate-100" />
                {i === STAGES.length - 1 && (
                  <RotateCcw className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                )}
              </div>

              <p className="text-xs font-semibold tracking-wide text-slate-400">
                {s.when.toUpperCase()}
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-400">
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          Stage 04 feeds stage 01. Nothing is retyped.
        </p>
      </div>
    </section>
  );
}
