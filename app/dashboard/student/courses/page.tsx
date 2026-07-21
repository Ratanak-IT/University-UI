"use client";

import { useState } from "react";
import { Menu, Sun, Moon, Info, FileText, Video, HelpCircle, LucideIcon } from "lucide-react";



type Item = { label: string; type: "file" | "video" | "quiz" };
type Week = { title: string; items: Item[] };
type IconType = LucideIcon;

const TABS = ["Overview", "Lessons", "Assignments", "Quizzes", "Announcements"];

const UPDATES = [
  "Midterm Exam Schedule",
  "Assignment 2 Deadline",
  "New Lesson Uploaded",
];

const WEEKS_LEFT: Week[] = [
  {
    title: "Week 1 — Introduction to UX",
    items: [
      { label: "Lesson Slides.pdf", type: "file" },
      { label: "Exercise.pdf", type: "file" },
      { label: "Introduction Video", type: "video" },
    ],
  },
  {
    title: "Week 2 — User Research",
    items: [
      { label: "User Research Guide.pdf", type: "file" },
      { label: "Research Methods Video", type: "video" },
    ],
  },
];

const WEEKS_RIGHT: Week[] = [
  {
    title: "Week 3 — Wireframing",
    items: [
      { label: "Wireframe Fundamentals.pdf", type: "file" },
      { label: "Wireframe Tutorial", type: "video" },
      { label: "quizzes", type: "quiz" },
    ],
  },
  {
    title: "Week 4 — Prototyping",
    items: [
      { label: "Prototyping Guide.pdf", type: "file" },
      { label: "Figma Prototype Demo", type: "video" },
    ],
  },
];

const TYPE_ICON: Record<Item["type"], IconType> = { file: FileText, video: Video, quiz: HelpCircle };

function WeekBlock({ week, isDark }: { week: Week; isDark: boolean }) {
  const heading = isDark ? "text-slate-100" : "text-slate-900";
  const link = isDark
    ? "text-indigo-400 hover:text-indigo-300"
    : "text-indigo-600 hover:text-indigo-700";

  return (
    <div className="mb-6 last:mb-0">
      <h4 className={`mb-2 text-sm font-semibold ${heading}`}>{week.title}</h4>
      <ul className="space-y-1.5">
        {week.items.map((item: Item) => {
          const Icon = TYPE_ICON[item.type];
          return (
            <li key={item.label}>
              <a
                href="#"
                className={`flex items-center gap-2 text-sm underline underline-offset-2 ${link}`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CourseLessons() {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Lessons");

  const course = {
    name: "UX & UI Design",
    teacher: "Dr. John Smith",
    year: "2025–2026",
    semester: 2,
    progress: 50,
  };

  const pageBg = isDark ? "bg-slate-950" : "bg-slate-50";
  const headerBg = isDark ? "bg-slate-900" : "bg-white";
  const headerBorder = isDark ? "border-slate-800" : "border-slate-200";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const cardBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textBase = isDark ? "text-slate-100" : "text-slate-900";
  const iconBtn = isDark
    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
    : "border-slate-200 text-slate-600 hover:bg-slate-100";
  const trackBg = isDark ? "bg-slate-800" : "bg-slate-100";
  const updatesBg = isDark ? "bg-indigo-500/10" : "bg-indigo-50/60";

  return (
    <div className={`flex h-screen w-full overflow-hidden ${pageBg}`}>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">

        {/* Main content */}
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          {/* Course header + progress */}
          <div className={`rounded-xl border ${cardBorder} ${cardBg} p-4 sm:p-6`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className={`text-lg font-bold sm:text-xl ${textBase}`}>{course.name}</h1>
                <p className={`mt-1 text-sm ${textMuted}`}>
                  Teacher: {course.teacher} &nbsp;•&nbsp; Academic Year {course.year} &nbsp;•&nbsp; Semester{" "}
                  {course.semester}
                </p>
              </div>

              <div className="w-full sm:w-56">
                <div className="flex items-baseline justify-between">
                  <span className={`text-xl font-bold ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                    {course.progress}%
                  </span>
                  <span className={`text-xs ${textMuted}`}>Course Progress</span>
                </div>
                <div className={`mt-2 h-2 w-full overflow-hidden rounded-full ${trackBg}`}>
                  <div
                    className={`h-full rounded-full ${isDark ? "bg-indigo-500" : "bg-indigo-600"}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`rounded-xl border ${cardBorder} ${cardBg} p-2`}>
            <div className="flex flex-wrap gap-1">
              {TABS.map((tab) => {
                const active = tab === activeTab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-indigo-600 text-white"
                        : `${textMuted} hover:${isDark ? "bg-slate-800" : "bg-slate-50"}`
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Important updates */}
          <div className={`rounded-xl border ${cardBorder} ${cardBg} p-4 sm:p-5`}>
            <h3 className={`mb-3 text-sm font-semibold ${textBase}`}>Important Updates</h3>
            <div className={`flex flex-col gap-3 rounded-lg ${updatesBg} p-3 sm:flex-row sm:items-center sm:gap-6 sm:p-4`}>
              {UPDATES.map((update, i) => (
                <div key={update} className="flex items-center gap-2">
                  <Info className={`h-4 w-4 shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-500"}`} />
                  <span className={`text-sm ${textBase}`}>{update}</span>
                  {i < UPDATES.length - 1 && (
                    <span className={`hidden sm:inline ${textMuted}`}>&nbsp;</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lessons */}
          <div className={`rounded-xl border ${cardBorder} ${cardBg} p-4 sm:p-6`}>
            <h3 className={`mb-4 text-sm font-semibold ${textBase}`}>Lessons</h3>
            <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
              <div>
                {WEEKS_LEFT.map((week) => (
                  <WeekBlock key={week.title} week={week} isDark={isDark} />
                ))}
              </div>
              <div>
                {WEEKS_RIGHT.map((week) => (
                  <WeekBlock key={week.title} week={week} isDark={isDark} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}