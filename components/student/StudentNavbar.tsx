"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Moon } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard/student": "Dashboard",
  "/dashboard/student/my-classes": "My Classes",
  "/dashboard/student/timetable": "Timetable",
  "/dashboard/student/lessons": "Lessons",
  "/dashboard/student/assignments": "Assignments",
  "/dashboard/student/quizzes": "Quizzes",
  "/dashboard/student/grades": "Grades",
  "/dashboard/student/attendance": "Attendance",
  "/dashboard/student/notifications": "Notifications",
  "/dashboard/student/profile": "My Profile",
};

export default function StudentNavbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <header className="flex w-full items-center justify-between border-b border-slate-100 bg-white px-8 py-4">
      {/* Title + academic period */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-indigo-950">{title}</h1>
        <p className="text-sm font-medium text-slate-500">
          Academic Year 2024–2025 <span className="mx-1">•</span> Semester 2
        </p>
      </div>

      {/* Search */}
      <div className="relative mx-8 w-full max-w-xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search classes, lessons, or assignments…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-12 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-700"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell className="h-6 w-6 stroke-[1.75]" />
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <button
          aria-label="Toggle theme"
          className="rounded-full p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Moon className="h-6 w-6 stroke-[1.75]" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-sm font-bold text-white">
          SD
        </div>
      </div>
    </header>
  );
}
