"use client";

import { useState } from "react";
import {
  Menu,
  Sun,
  Moon,
  MoreVertical,
  FileText,
  Github,
  Users,
  Send,
  Plus,
  MessageSquare,
} from "lucide-react";
import Sidebar from "@/components/SidebarStudent";

/**
 * AssignmentDetail
 * Pairs with Sidebar.jsx. Renders one of two states via the `status` prop:
 *   status="turned_in" -> submitted work (GitHub link), Unsubmit button, academic guidelines panel
 *   status="assigned"  -> not yet submitted, "+ Add or create" / "Mark as done" buttons
 *
 * Swap the `assignment` object below to reuse for both the assignment
 * and quiz review screens (app/courses/[course]/assignment/page.tsx and
 * app/courses/[course]/quizzes/page.tsx).
 */

const ASSIGNMENT_TURNED_IN = {
  headerCrumb: "Dashboard / My Courses / UX & UI Design/ Week 8 - High Fidelity Prototyping Assignments / Assignment Submit Review",
  pageCrumb: "Dashboard / My Courses / UX & UI Design / High Fidelity Prototyping Assignments / Assignment Submit Review",
  title: "Complete the Logic for both categories and products",
  author: "Keo Kay",
  date: "Jun 11",
  points: 100,
  due: "Due Jun 12, 8:30 PM",
  body: [
    "get all product with pagination and keyword",
    "get all categories with pagination",
    "soft delete on the categories",
  ],
  note: "Implement all the remain method inside the service interface",
  noteLink: "service interface",
  status: "turned_in",
  submission: {
    label: "GitHub - Arthurdavin/Logic-Products",
    url: "https://github.com/Arthurdavin/...",
  },
  comments: [{ name: "You", when: "Yesterday", text: "Teacher, I've finished the logic for soft delete. Could you please review it?" }],
  guidelines: "Late submissions may incur a 10% penalty per day. Ensure all code is pushed to your personal branch for grading.",
};

const ASSIGNMENT_ASSIGNED = {
  headerCrumb: "Dashboard / My Courses / UX & UI Design/ Week 8 - High Fidelity Prototyping Assignments",
  pageCrumb: "Dashboard / My Courses / UX & UI Design / High Fidelity Prototyping Quiz / Review",
  title: "Kev Menea",
  author: "Keo Kay",
  date: "Jun 23",
  points: 100,
  due: null,
  body: ["gojo"],
  note: null,
  status: "assigned",
  quiz: { label: "Blank Quiz", sub: "Google Forms" },
  comments: [],
  guidelines: null,
};

function CommentBox({ comments, isDark }) {
  const cardBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textBase = isDark ? "text-slate-100" : "text-slate-900";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const inputBg = isDark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700";

  return (
    <div className={`mt-6 border-t ${cardBorder} pt-4`}>
      <div className="mb-3 flex items-center gap-2">
        <Users className={`h-4 w-4 ${textMuted}`} />
        <p className={`text-sm font-semibold ${textBase}`}>Class comments</p>
      </div>

      {comments.map((c, i) => (
        <div key={i} className="mb-3 flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
            {c.name[0]}
          </div>
          <div className="min-w-0">
            <p className={`text-sm ${textBase}`}>
              <span className="font-medium">{c.name}</span>{" "}
              <span className={`text-xs ${textMuted}`}>{c.when}</span>
            </p>
            <p className={`text-sm ${textMuted}`}>{c.text}</p>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-400 text-xs font-semibold text-white">M</div>
        <div className={`flex flex-1 items-center gap-2 rounded-full border px-4 py-2 ${inputBg}`}>
          <input placeholder="Add class comment..." className="w-full bg-transparent text-sm outline-none placeholder:text-current" />
          <Send className={`h-4 w-4 shrink-0 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
        </div>
      </div>
    </div>
  );
}

export default function AssignmentDetail({ status = "turned_in" }) {
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const a = status === "turned_in" ? ASSIGNMENT_TURNED_IN : ASSIGNMENT_ASSIGNED;

  const pageBg = isDark ? "bg-slate-950" : "bg-slate-50";
  const headerBg = isDark ? "bg-slate-900" : "bg-white";
  const headerBorder = isDark ? "border-slate-800" : "border-slate-200";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const cardBorder = isDark ? "border-slate-800" : "border-slate-200";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const textBase = isDark ? "text-slate-100" : "text-slate-900";
  const iconBtn = isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100";
  const link = isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-700";

  return (
    <div className={`flex h-screen w-full overflow-hidden ${pageBg}`}>
      <Sidebar
        isDark={isDark}
        activeItem="course"
        activeCourse={{ id: "course", label: "ux/ui design" }}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Top bar */}
        <header className={`sticky top-0 z-10 flex items-center gap-3 border-b ${headerBorder} ${headerBg} px-4 py-3 sm:px-6`}>
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className={`shrink-0 rounded-md border p-2 md:hidden ${iconBtn}`}>
            <Menu className="h-5 w-5" />
          </button>

          <p className={`min-w-0 text-sm font-medium leading-snug ${link}`}>{a.headerCrumb}</p>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
            <button onClick={() => setIsDark((d) => !d)} aria-label="Toggle dark mode" className={`rounded-md border p-2 transition-colors ${iconBtn}`}>
              {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </button>
            <div className="hidden text-right sm:block">
              <p className={`text-sm font-semibold ${textBase}`}>Student</p>
              <p className={`text-xs ${textMuted}`}>Active</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">M</div>
          </div>
        </header>

        {/* Page heading + breadcrumb */}
        <div className={`border-b ${headerBorder} ${headerBg} px-4 py-4 sm:px-6 lg:px-8`}>
          <h1 className={`text-lg font-bold sm:text-xl ${textBase}`}>Assignments UX &amp; UI Design</h1>
          <p className={`mt-1 text-sm ${link}`}>{a.pageCrumb}</p>
        </div>

        {/* Main content */}
        <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
          {/* Assignment card */}
          <div className={`rounded-xl border ${cardBorder} ${cardBg} p-5 sm:p-6`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isDark ? "bg-indigo-500/15" : "bg-indigo-50"}`}>
                <FileText className={`h-5 w-5 ${isDark ? "text-indigo-400" : "text-indigo-600"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className={`text-base font-semibold sm:text-lg ${textBase}`}>{a.title}</h2>
                <p className={`mt-1 text-sm ${textMuted}`}>
                  {a.author} • {a.date}
                </p>
                <p className={`mt-1 text-sm font-medium ${textBase}`}>
                  {a.points} points{a.due ? <span className={`font-normal ${textMuted}`}> &nbsp;•&nbsp; {a.due}</span> : null}
                </p>
              </div>
              <button className={`shrink-0 rounded-md p-1.5 ${textMuted} ${isDark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className={`mt-4 space-y-1.5 text-sm ${textBase}`}>
              {a.body.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {a.note && (
              <p className={`mt-3 text-sm italic ${textMuted}`}>
                {a.note.replace(a.noteLink, "")}
                <a href="#" className={`not-italic underline ${link}`}>
                  {a.noteLink}
                </a>
              </p>
            )}

            {a.quiz && (
              <a
                href="#"
                className={`mt-4 flex items-center gap-3 rounded-lg border p-3 ${cardBorder} ${isDark ? "hover:bg-slate-800/60" : "hover:bg-slate-50"}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-indigo-600 text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${textBase}`}>{a.quiz.label}</p>
                  <p className={`text-xs ${textMuted}`}>{a.quiz.sub}</p>
                </div>
                <div className={`h-12 w-16 shrink-0 rounded border ${cardBorder} ${isDark ? "bg-slate-800" : "bg-slate-50"}`} />
              </a>
            )}

            <CommentBox comments={a.comments} isDark={isDark} />
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Your work */}
            <div className={`rounded-xl border ${cardBorder} ${cardBg} p-4`}>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${textBase}`}>Your work</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.status === "turned_in"
                      ? isDark
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-emerald-50 text-emerald-700"
                      : isDark
                      ? "bg-slate-800 text-slate-300"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {a.status === "turned_in" ? "TURNED IN" : "ASSIGNED"}
                </span>
              </div>

              {a.status === "turned_in" ? (
                <>
                  <a
                    href="#"
                    className={`mt-3 flex items-center gap-3 rounded-lg border p-3 ${cardBorder} ${isDark ? "hover:bg-slate-800/60" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-slate-900 text-white">
                      <Github className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-xs font-medium ${textBase}`}>{a.submission.label}</p>
                      <p className={`truncate text-xs ${textMuted}`}>{a.submission.url}</p>
                    </div>
                  </a>
                  <button className={`mt-3 w-full rounded-lg border py-2 text-sm font-medium ${iconBtn}`}>Unsubmit</button>
                </>
              ) : (
                <div className="mt-3 space-y-2">
                  <button className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-sm font-medium ${iconBtn}`}>
                    <Plus className="h-4 w-4" /> Add or create
                  </button>
                  <button className="w-full rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                    Mark as done
                  </button>
                </div>
              )}
            </div>

            {/* Private comments */}
            <div className={`rounded-xl border ${cardBorder} ${cardBg} p-4`}>
              <div className="mb-2 flex items-center gap-2">
                <MessageSquare className={`h-4 w-4 ${textMuted}`} />
                <p className={`text-sm font-semibold ${textBase}`}>Private comments</p>
              </div>
              <p className={`text-sm ${link}`}>+ Add comment to {a.author}</p>
            </div>

            {/* Academic guidelines */}
            {a.guidelines && (
              <div className={`rounded-xl border ${cardBorder} ${isDark ? "bg-slate-900" : "bg-indigo-50/50"} p-4`}>
                <p className={`text-[11px] font-semibold uppercase tracking-wider ${textMuted}`}>Academic guidelines</p>
                <p className={`mt-2 text-sm italic ${textBase}`}>{a.guidelines}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}