"use client";

import Link from "next/link";
import {
  BookMarked,
  CalendarClock,
  UserCheck,
  Star,
  ArrowRight,
  Clock,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const statCards = [
  {
    label: "Enrolled Courses",
    value: "6",
    icon: BookMarked,
    iconBg: "bg-violet-100",
    iconColor: "text-indigo-700",
    hint: "Semester 2",
  },
  {
    label: "Due This Week",
    value: "3",
    icon: CalendarClock,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    hint: "1 due tomorrow",
  },
  {
    label: "Attendance",
    value: "94%",
    icon: UserCheck,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hint: "Above 80% required",
  },
  {
    label: "Current GPA",
    value: "3.62",
    icon: Star,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-900",
    hint: "+0.14 this term",
  },
];

const todayClasses = [
  {
    time: "08:00",
    title: "Web Development",
    code: "CS-WD201",
    room: "Room 204",
    accent: "bg-indigo-700",
    status: "now" as const,
  },
  {
    time: "09:30",
    title: "Database Systems",
    code: "CS-DB301",
    room: "Lab 2",
    accent: "bg-amber-500",
    status: "next" as const,
  },
  {
    time: "13:30",
    title: "Software Security",
    code: "CS-SEC401",
    room: "Lab 3",
    accent: "bg-rose-500",
    status: "later" as const,
  },
  {
    time: "15:00",
    title: "UX Fundamentals",
    code: "CS-UX202",
    room: "Room 208",
    accent: "bg-emerald-600",
    status: "later" as const,
  },
];

const deadlines = [
  { title: "Final Thesis Draft", course: "CS-WD201", due: "Tomorrow, 11:59 PM", urgent: true },
  { title: "ER Diagram Exercise", course: "CS-DB301", due: "Thu, 5:00 PM", urgent: false },
  { title: "Threat Model Report", course: "CS-SEC401", due: "Fri, 11:59 PM", urgent: false },
  { title: "Usability Test Notes", course: "CS-UX202", due: "Next Mon, 3:00 PM", urgent: false },
];

const gradeTrend = [
  { label: "W1", gpa: 3.2 },
  { label: "W3", gpa: 3.35 },
  { label: "W5", gpa: 3.3 },
  { label: "W7", gpa: 3.48 },
  { label: "W9", gpa: 3.55 },
  { label: "W11", gpa: 3.5 },
  { label: "W13", gpa: 3.62 },
];

const courses = [
  { title: "Web Development", code: "CS-WD201", progress: 78, accent: "bg-indigo-700" },
  { title: "Database Systems", code: "CS-DB301", progress: 64, accent: "bg-amber-500" },
  { title: "Software Security", code: "CS-SEC401", progress: 45, accent: "bg-rose-500" },
  { title: "UX Fundamentals", code: "CS-UX202", progress: 88, accent: "bg-emerald-600" },
];

const statusLabel = {
  now: { text: "In progress", cls: "bg-emerald-100 text-emerald-700" },
  next: { text: "Up next", cls: "bg-indigo-100 text-indigo-700" },
  later: { text: "", cls: "" },
};

export default function StudentDashboard() {
  return (
    <div className="space-y-6 p-8">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">
          Good morning, Dara.
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          You have 4 classes today and 1 assignment due tomorrow.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-slate-500">{c.label}</p>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconBg}`}
                >
                  <Icon className={`h-[18px] w-[18px] ${c.iconColor}`} strokeWidth={2} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-black tracking-tight text-indigo-950">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{c.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's schedule */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-indigo-950">Today&apos;s classes</h3>
            <Link
              href="/dashboard/student/timetable"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
            >
              Full timetable
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>

          <ul className="mt-5 space-y-3">
            {todayClasses.map((c) => (
              <li
                key={c.code}
                className="flex items-center gap-4 rounded-xl border border-slate-100 p-3.5 transition-colors hover:bg-slate-50"
              >
                <span className="w-12 shrink-0 text-sm font-bold text-slate-400">
                  {c.time}
                </span>
                <span className={`h-10 w-1 shrink-0 rounded-full ${c.accent}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-indigo-950">{c.title}</p>
                  <p className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                    <span>{c.code}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" strokeWidth={2} />
                      {c.room}
                    </span>
                  </p>
                </div>
                {c.status !== "later" && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      statusLabel[c.status].cls
                    }`}
                  >
                    {statusLabel[c.status].text}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Deadlines */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-indigo-950">Upcoming deadlines</h3>
            <Link
              href="/dashboard/student/assignments"
              className="text-xs font-semibold text-indigo-700 hover:underline"
            >
              All
            </Link>
          </div>

          <ul className="mt-5 space-y-3">
            {deadlines.map((d) => (
              <li key={d.title} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-semibold text-indigo-950">{d.title}</p>
                <p className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{d.course}</span>
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      d.urgent ? "text-rose-600" : "text-slate-500"
                    }`}
                  >
                    <Clock className="h-3 w-3" strokeWidth={2} />
                    {d.due}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* GPA trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-indigo-950">GPA trend</h3>
          <p className="mt-1 text-xs text-slate-400">This semester, by week</p>

          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gradeTrend} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  domain={[3, 4]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="#4338ca"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#4338ca" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-indigo-950">Course progress</h3>
            <Link
              href="/dashboard/student/my-classes"
              className="text-xs font-semibold text-indigo-700 hover:underline"
            >
              All
            </Link>
          </div>

          <ul className="mt-5 space-y-4">
            {courses.map((c) => (
              <li key={c.code}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-indigo-950">{c.title}</span>
                  <span className="text-xs font-bold text-slate-400">{c.progress}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${c.accent}`}
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
