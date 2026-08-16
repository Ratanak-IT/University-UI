"use client";

import { Users, BookMarked, Folder, ChevronDown, Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import ClassroomCard from "./ClassroomCard";
import { useGetTeacherClassroomsQuery } from "@/lib/redux/apiSlice";
import { CardGridSkeleton } from "@/components/shared/Skeletons";


const statCards = [
  {
    label: "Total Enrolled",
    value: "1,248",
    icon: Users,
    iconBg: "bg-violet-100",
    iconColor: "text-indigo-700",
    badge: "+12%",
  },
  {
    label: "Active Classes",
    value: "6",
    icon: BookMarked,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
    badge: null,
  },
  {
    label: "Course Materials",
    value: "42",
    icon: Folder,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-900",
    badge: null,
  },
];

const engagementData = [
  { day: "1", value: 20 },
  { day: "5", value: 35 },
  { day: "10", value: 48 },
  { day: "13", value: 46 },
  { day: "16", value: 62 },
  { day: "19", value: 58 },
  { day: "22", value: 44 },
  { day: "25", value: 52 },
  { day: "28", value: 70 },
  { day: "30", value: 66 },
];

const contentLibraryData = [
  { name: "Video Courses", value: 70, color: "#1e2a5e" },
  { name: "Uploaded Books", value: 30, color: "#c7d2fe" },
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

const deadlines = [
  { title: "Mid-term Project", classCode: "CS101-A", due: "OCT 24", badgeClass: "bg-rose-100 text-rose-600" },
  { title: "Final Portfolio", classCode: "UXD202-B", due: "NOV 12", badgeClass: "bg-slate-100 text-slate-600" },
  { title: "Weekly Quiz 08", classCode: "DSTR301", due: "TOMORROW", badgeClass: "bg-sky-100 text-sky-700" },
];

const attendance = [
  {
    name: "Rath Vuthy",
    id: "2024-001",
    avatar: "https://i.pravatar.cc/80?img=15",
    classroom: "CS101-A",
    date: "Oct 23, 2024",
    status: "Present",
    statusClass: "bg-emerald-100 text-emerald-700",
    score: "10/10",
    note: "Active participation",
  },
  {
    name: "Sok Pagna",
    id: "2024-042",
    avatar: "https://i.pravatar.cc/80?img=33",
    classroom: "UXD202-B",
    date: "Oct 23, 2024",
    status: "Late",
    statusClass: "bg-amber-100 text-amber-700",
    score: "8/10",
    note: "Arrived 15m late",
  },
];

export default function DashboardPage() {
  const { data: apiClassrooms = [], isLoading } = useGetTeacherClassroomsQuery();
  return (
    <div className="px-8 py-8">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-6 flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={1.75} />
                </div>
                {stat.badge && (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold tracking-wide text-slate-400">
                {stat.label.toUpperCase()}
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Engagement chart + Content library */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Student Engagement Trends
            </h2>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Last 30 Days
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={engagementData}>
              <XAxis dataKey="day" hide />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1e2a5e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#1e2a5e" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Content Library
          </h2>
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={contentLibraryData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={85}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={0}
                >
                  {contentLibraryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute flex flex-col items-center">
              <p className="text-2xl font-bold text-slate-900">10</p>
              <p className="text-xs font-semibold tracking-wide text-slate-400">
                SUBJECTS
              </p>
            </div>
          </div>
          <ul className="mt-2 space-y-3">
            {contentLibraryData.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-900">
                  {item.value}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Classrooms + Upcoming deadlines */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Your Classrooms
            </h2>
            <a
              href="/dashboard/teacher/my-classroom"
              className="text-xs font-semibold tracking-wide text-indigo-700 hover:underline"
            >
              MANAGE ALL
            </a>
          </div>
          {isLoading ? (
            <CardGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {classrooms.map((room, i) => (
                <ClassroomCard key={`${room.title}-${i}`} {...room} />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Upcoming deadlines
            </h2>
            <a
              href="#"
              className="text-xs font-semibold tracking-wide text-indigo-700 hover:underline"
            >
              VIEW ALL
            </a>
          </div>
          <ul className="space-y-3">
            {deadlines.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.badgeClass}`}
                  >
                    {item.due}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">{item.classCode}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Attendance snapshot */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Today&apos;s attendance snapshot
          </h2>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs font-semibold tracking-wide text-indigo-700 hover:underline"
            >
              VIEW ALL
            </a>
            <button className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-500">
                <th className="rounded-l-lg px-4 py-3">STUDENT</th>
                <th className="px-4 py-3">CLASSROOM</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3">SCORE</th>
                <th className="rounded-r-lg px-4 py-3">NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendance.map((row) => (
                <tr key={row.id}>
                  <td className="flex items-center gap-3 px-4 py-4">
                    <img
                      src={row.avatar}
                      alt={row.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {row.name}
                      </p>
                      <p className="text-xs text-slate-400">ID: {row.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.classroom}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.date}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${row.statusClass}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                    {row.score}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    {row.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}