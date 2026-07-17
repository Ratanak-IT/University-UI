import {
  CalendarDays,
  UserPlus,
  UserCheck,
  Star,
  Folder,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    name: "Timetabling",
    icon: CalendarDays,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    body: "Build the week once. UMS catches room double-bookings and teacher clashes before you publish, not after a student emails you.",
    detail: "Clash detection · Room capacity · Publish to students",
  },
  {
    name: "Enrollment",
    icon: UserPlus,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-700",
    body: "Students request, advisors approve, capacity holds. Waitlists move on their own when a seat opens.",
    detail: "Prerequisites · Waitlists · Capacity locks",
  },
  {
    name: "Attendance",
    icon: UserCheck,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    body: "Teachers mark from a phone in under a minute. Patterns surface early enough that someone can still do something about them.",
    detail: "Offline capable · At-risk flags",
  },
  {
    name: "Grades & transcripts",
    icon: Star,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    body: "One gradebook per class, one transcript per student. Weighted schemes stay where you set them, and nothing is recalculated behind your back.",
    detail: "Weighted schemes · GPA · Export",
  },
  {
    name: "Lessons & files",
    icon: Folder,
    iconBg: "bg-sky-100",
    iconColor: "text-sky-700",
    body: "Lesson material and submissions stored privately, served fast, and scoped so only the right class ever sees them.",
    detail: "Private buckets · Signed access",
  },
  {
    name: "Roles & access",
    icon: ShieldCheck,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    body: "Registrar, dean, teacher, student — each sees exactly their slice. Single sign-on, so nobody keeps another password.",
    detail: "SSO · Fine-grained roles · Audit log",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-6xl px-8 py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-wide text-indigo-700">
            WHAT&apos;S INSIDE
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Six systems that usually don&apos;t talk to each other.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-500">
            Most universities run these as separate spreadsheets, and the gaps
            between them are where the work goes. Here they share one record.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.name}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${f.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {f.body}
                </p>
                <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
                  {f.detail}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
