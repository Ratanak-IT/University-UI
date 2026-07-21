"use client";

import React, { useState } from "react";
import { Menu, Sun, Moon, LayoutGrid, List } from "lucide-react";

const COURSES: Course[] = [
  {
    id: 1,
    name: "Web Development",
    code: "CS-WD201 . Frontend",
    initials: "WD",
    students: 32,
    year: "Year 4 . Sem 2",
    meta: "Room 204 . Code wd-7k2t",
    toGrade: 3,
    color: "indigo",
  },
  {
    id: 2,
    name: "Database Systems",
    code: "CS-DB301 . SQL and Design",
    initials: "DB",
    students: 28,
    year: "Year 3 . Sem 2",
    meta: "Room 110 . Code db-3k8p",
    toGrade: 1,
    color: "amber",
  },
  {
    id: 3,
    name: "Database Systems",
    code: "CS-DB301 . SQL and Design",
    initials: "DB",
    students: 28,
    year: "Year 3 . Sem 2",
    meta: "Room 110 . Code db-3k8p",
    toGrade: 1,
    color: "amber",
  },
  {
    id: 4,
    name: "Cybersecurity",
    code: "CS-SEC401 . CTF Track",
    initials: "CS",
    students: 24,
    year: "Year 4 . Sem 2",
    meta: "Lab 3 . Code sec-x84z",
    toGrade: 5,
    color: "rose",
  },
  {
    id: 5,
    name: "UI/UX Design",
    code: "CS-UX202 . Figma",
    initials: "UX",
    students: 30,
    year: "Year 2 . Sem 2",
    meta: "Room 208 . Code ux-7m7q",
    toGrade: 2,
    color: "emerald",
  },
  {
    id: 6,
    name: "UI/UX Design",
    code: "CS-UX202 . Figma",
    initials: "UX",
    students: 30,
    year: "Year 2 . Sem 2",
    meta: "Room 208 . Code ux-7m7q",
    toGrade: 2,
    color: "emerald",
  },
  {
    id: 7,
    name: "Cybersecurity",
    code: "CS-SEC401 . CTF Track",
    initials: "CS",
    students: 24,
    year: "Year 4 . Sem 2",
    meta: "Lab 3 . Code sec-x84z",
    toGrade: 5,
    color: "rose",
  },
  {
    id: 8,
    name: "Cybersecurity",
    code: "CS-SEC401 . CTF Track",
    initials: "CS",
    students: 24,
    year: "Year 4 . Sem 2",
    meta: "Lab 3 . Code sec-x84z",
    toGrade: 5,
    color: "rose",
  },
];

const COLOR_HEADER = {
  indigo: "bg-indigo-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
  emerald: "bg-emerald-600",
};

const COLOR_BADGE_LIGHT = {
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

const COLOR_BADGE_DARK = {
  indigo: "bg-indigo-500/15 text-indigo-300",
  amber: "bg-amber-500/15 text-amber-300",
  rose: "bg-rose-500/15 text-rose-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
};

type CourseColor = "indigo" | "amber" | "rose" | "emerald";

interface Course {
  id: number;
  name: string;
  code: string;
  initials: string;
  students: number;
  year: string;
  meta: string;
  toGrade: number;
  color: CourseColor;
}

interface CourseCardProps {
  course: Course;
  isDark: boolean;
}

function CourseCard({ course, isDark }: CourseCardProps) {
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const cardBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textBase = isDark ? "text-slate-100" : "text-slate-900";
  const badgeClass = isDark ? COLOR_BADGE_DARK[course.color] : COLOR_BADGE_LIGHT[course.color];

  return (
    <div className={`overflow-hidden rounded-xl border ${cardBorder} ${cardBg} shadow-sm`}>
      <div className={`relative ${COLOR_HEADER[course.color]} px-4 pb-8 pt-4 text-white`}>
        <p className="text-sm font-semibold">{course.name}</p>
        <p className="mt-0.5 text-xs text-white/80">{course.code}</p>
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
          {course.initials}
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <p className={`text-sm font-medium ${textBase}`}>
          {course.students} students <span className={textMuted}>. {course.year}</span>
        </p>
        <p className={`mt-1 text-xs ${textMuted}`}>{course.meta}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
            {course.toGrade} to grade
          </span>
          <button
            className={`text-sm font-semibold ${
              isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700"
            }`}
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [isDark, setIsDark] = useState(false);
  const [view, setView] = useState("card");

  const pageBg = isDark ? "bg-slate-950" : "bg-slate-50";
  const headerBg = isDark ? "bg-slate-900" : "bg-white";
  const headerBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textBase = isDark ? "text-slate-100" : "text-slate-900";
  const iconBtn = isDark
    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
    : "border-slate-200 text-slate-600 hover:bg-slate-100";
  const selectClass = isDark
    ? "border-slate-700 bg-slate-900 text-slate-200"
    : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={`flex h-screen w-full overflow-hidden ${pageBg}`}>


      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* Main content */}
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <h2 className={`text-lg font-semibold sm:text-xl ${textBase}`}>Course Overview</h2>

          {/* Filter bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <select className={`rounded-md border px-3 py-1.5 text-sm ${selectClass}`}>
              <option>All</option>
              <option>In progress</option>
              <option>Completed</option>
            </select>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`text-sm ${textMuted}`}>Sort by</span>
              <select className={`rounded-md border px-3 py-1.5 text-sm ${selectClass}`}>
                <option>Course name</option>
                <option>Students</option>
                <option>To grade</option>
              </select>

              <div className={`flex overflow-hidden rounded-md border ${selectClass}`}>
                <button
                  onClick={() => setView("card")}
                  aria-label="Card view"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${
                    view === "card"
                      ? isDark
                        ? "bg-slate-800"
                        : "bg-slate-100"
                      : ""
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" /> Card
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`flex items-center gap-1.5 border-l px-3 py-1.5 text-sm ${
                    isDark ? "border-slate-700" : "border-slate-200"
                  } ${view === "list" ? (isDark ? "bg-slate-800" : "bg-slate-100") : ""}`}
                >
                  <List className="h-4 w-4" /> List
                </button>
              </div>
            </div>
          </div>

          {/* Course grid */}
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((course) => (
              <CourseCard key={course.id} course={course} isDark={isDark} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
