import { Check } from "lucide-react";

const ROLES = [
  {
    role: "Registrar",
    sees: "The whole institution",
    headerClass: "bg-indigo-700",
    initials: "RG",
    initialsTextClass: "text-indigo-700",
    lines: [
      "Unassigned classes, before term starts",
      "Enrollment requests waiting on a decision",
      "Every timetable clash in one list",
    ],
  },
  {
    role: "Teacher",
    sees: "Their classes only",
    headerClass: "bg-[#004071]",
    initials: "TC",
    initialsTextClass: "text-[#004071]",
    lines: [
      "Today's schedule and room",
      "Attendance in one tap per student",
      "Submissions to grade, oldest first",
    ],
  },
  {
    role: "Student",
    sees: "Their own record",
    headerClass: "bg-emerald-600",
    initials: "ST",
    initialsTextClass: "text-emerald-700",
    lines: [
      "This week's timetable",
      "Assignments due, with what's already submitted",
      "Grades and transcript, always current",
    ],
  },
];

export default function Roles() {
  return (
    <section className="border-b border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-wide text-indigo-700">
            ONE RECORD, THREE VIEWS
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Everyone opens the same system and sees a different day.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {ROLES.map((r) => (
            <div
              key={r.role}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className={`relative px-5 py-5 ${r.headerClass}`}>
                <h3 className="text-lg font-bold text-white">{r.role}</h3>
                <p className="mt-0.5 text-sm text-white/80">{r.sees}</p>
                <span
                  className={`absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold ${r.initialsTextClass}`}
                >
                  {r.initials}
                </span>
              </div>

              <ul className="space-y-3 px-5 py-5">
                {r.lines.map((l) => (
                  <li key={l} className="flex gap-3 text-sm text-slate-600">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      strokeWidth={2.5}
                    />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
