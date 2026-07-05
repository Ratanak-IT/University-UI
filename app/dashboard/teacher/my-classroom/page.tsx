import ClassroomCard from "@/components/teacher/ClassroomCard";
import { Plus } from "lucide-react";

const stats = [
  {
    label: "Classrooms",
    sublabel: "classrooms · active",
    value: "6",
    dotClass: "bg-indigo-600",
    dotBgClass: "bg-indigo-50",
  },
  {
    label: "Students",
    sublabel: "classroom_students",
    value: "182",
    dotClass: "bg-sky-500",
    dotBgClass: "bg-sky-50",
  },
  {
    label: "To grade",
    sublabel: "submissions · pending",
    value: "27",
    dotClass: "bg-orange-500",
    dotBgClass: "bg-orange-50",
  },
  {
    label: "Attendance to take",
    sublabel: "today · attendance",
    value: "3",
    dotClass: "bg-emerald-500",
    dotBgClass: "bg-emerald-50",
  },
];

const classrooms = [
  {
    title: "Web Development",
    code: "CS-WD201",
    track: "Frontend",
    initials: "WD",
    students: 32,
    year: "Year 4 · Sem 2",
    room: "Room 204",
    classCode: "wd-7x2k",
    toGrade: 3,
    headerClass: "bg-indigo-700",
    initialsTextClass: "text-indigo-700",
    badgeClass: "bg-violet-100 text-violet-700",
  },
  {
    title: "Database Systems",
    code: "CS-DB301",
    track: "SQL & Design",
    initials: "DB",
    students: 28,
    year: "Year 3 · Sem 2",
    room: "Room 110",
    classCode: "db-3k9p",
    toGrade: 1,
    headerClass: "bg-amber-500",
    initialsTextClass: "text-amber-600",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    title: "Database Systems",
    code: "CS-DB301",
    track: "SQL & Design",
    initials: "DB",
    students: 28,
    year: "Year 3 · Sem 2",
    room: "Room 110",
    classCode: "db-3k9p",
    toGrade: 1,
    headerClass: "bg-amber-500",
    initialsTextClass: "text-amber-600",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  {
    title: "Cybersecurity",
    code: "CS-SEC401",
    track: "CTF Track",
    initials: "CS",
    students: 24,
    year: "Year 4 · Sem 2",
    room: "Lab 3",
    classCode: "sec-x84z",
    toGrade: 5,
    headerClass: "bg-rose-500",
    initialsTextClass: "text-rose-600",
    badgeClass: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "UI/UX Design",
    code: "CS-UX202",
    track: "Figma",
    initials: "UX",
    students: 30,
    year: "Year 2 · Sem 2",
    room: "Room 208",
    classCode: "ux-7m2q",
    toGrade: 2,
    headerClass: "bg-emerald-600",
    initialsTextClass: "text-emerald-700",
    badgeClass: "bg-orange-100 text-orange-700",
  },
  {
    title: "UI/UX Design",
    code: "CS-UX202",
    track: "Figma",
    initials: "UX",
    students: 30,
    year: "Year 2 · Sem 2",
    room: "Room 208",
    classCode: "ux-7m2q",
    toGrade: 2,
    headerClass: "bg-emerald-600",
    initialsTextClass: "text-emerald-700",
    badgeClass: "bg-orange-100 text-orange-700",
  },
];

export default function DashboardPage() {
  return (
    <div className="px-8 py-8">
      {/* Welcome header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, Mr. Davin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Academic Year 2024–2025 · Semester 2 · 6 active classrooms
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800">
          <Plus className="h-4 w-4" strokeWidth={2} />
          New classroom
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${stat.dotBgClass}`}
            >
              <span className={`h-3 w-3 rounded-full ${stat.dotClass}`} />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {stat.label}
            </p>
            <p className="text-sm text-slate-400">{stat.sublabel}</p>
          </div>
        ))}
      </div>

      {/* Classrooms grid */}
      <h2 className="mb-4 mt-8 text-lg font-bold text-slate-900">
        Your classrooms
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((room, i) => (
          <ClassroomCard key={`${room.title}-${i}`} {...room} />
        ))}
      </div>
    </div>
  );
}