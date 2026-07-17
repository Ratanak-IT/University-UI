import type { Metadata } from "next";
import { Users, MapPin } from "lucide-react";

export const metadata: Metadata = { title: "My Classes" };

const classes = [
  {
    title: "Web Development",
    code: "CS-WD201",
    track: "Frontend",
    initials: "WD",
    teacher: "Chhay Davin",
    students: 32,
    room: "Room 204",
    schedule: "Mon · Wed, 08:00",
    progress: 78,
    header: "bg-indigo-700",
  },
  {
    title: "Database Systems",
    code: "CS-DB301",
    track: "SQL & Design",
    initials: "DB",
    teacher: "Sok Pisey",
    students: 28,
    room: "Lab 2",
    schedule: "Mon · Thu, 09:30",
    progress: 64,
    header: "bg-amber-500",
  },
  {
    title: "Software Security",
    code: "CS-SEC401",
    track: "AppSec",
    initials: "SE",
    teacher: "Vann Sophea",
    students: 25,
    room: "Lab 3",
    schedule: "Tue · Fri, 13:30",
    progress: 45,
    header: "bg-rose-500",
  },
  {
    title: "UX Fundamentals",
    code: "CS-UX202",
    track: "Design",
    initials: "UX",
    teacher: "Meas Chanda",
    students: 30,
    room: "Room 208",
    schedule: "Tue · Thu, 15:00",
    progress: 88,
    header: "bg-emerald-600",
  },
  {
    title: "Data Structures",
    code: "CS-DS210",
    track: "Core CS",
    initials: "DS",
    teacher: "Ly Sokna",
    students: 35,
    room: "Room 110",
    schedule: "Wed, 11:00",
    progress: 52,
    header: "bg-sky-600",
  },
  {
    title: "Academic English",
    code: "ENG-120",
    track: "General",
    initials: "AE",
    teacher: "Sarah Miles",
    students: 40,
    room: "A-101",
    schedule: "Fri, 09:30",
    progress: 70,
    header: "bg-violet-600",
  },
];

export default function MyClassesPage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">My Classes</h2>
        <p className="mt-1 text-sm text-slate-500">
          6 courses enrolled this semester.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => (
          <div
            key={c.code}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
          >
            {/* Colored header */}
            <div className={`relative px-5 py-4 text-white ${c.header}`}>
              <p className="pr-12 text-base font-bold leading-tight">{c.title}</p>
              <p className="mt-0.5 text-xs text-white/80">
                {c.code} · {c.track}
              </p>
              <span className="absolute bottom-3 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {c.initials}
              </span>
            </div>

            {/* Body */}
            <div className="space-y-2 px-5 py-4">
              <p className="text-sm font-medium text-indigo-950">{c.teacher}</p>
              <p className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" strokeWidth={2} />
                  {c.students} students
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" strokeWidth={2} />
                  {c.room}
                </span>
              </p>
              <p className="text-xs text-slate-400">{c.schedule}</p>

              <div className="pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Progress</span>
                  <span className="font-bold text-slate-400">{c.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${c.header}`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
