"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, BookOpen, FileText, Award, Calendar, Users, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchItem {
  id: string;
  title: string;
  category: "Courses" | "Pages" | "Assignments" | "Quizzes";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Pages
  { id: "p1", title: "My Classes & Courses", category: "Pages", href: "/dashboard/student/courses", icon: BookOpen, badge: "Page" },
  { id: "p2", title: "Assignments & Homework", category: "Pages", href: "/dashboard/student/courses", icon: FileText, badge: "Page" },
  { id: "p3", title: "Quizzes & Online Assessments", category: "Pages", href: "/dashboard/student/courses", icon: Award, badge: "Page" },
  { id: "p4", title: "Academic Grades & GPA Records", category: "Pages", href: "/dashboard/student/grades", icon: Star, badge: "Page" },
  { id: "p5", title: "Attendance History & Logs", category: "Pages", href: "/dashboard/student/attendance", icon: Calendar, badge: "Page" },
  { id: "p6", title: "Notifications Center", category: "Pages", href: "/dashboard/student/notifications", icon: ShieldCheck, badge: "Page" },

  // Courses
  { id: "c1", title: "CS201 Data Structures & Algorithms", category: "Courses", href: "/dashboard/student/courses", icon: BookOpen, badge: "Course" },
  { id: "c2", title: "CS202 Database Systems & SQL", category: "Courses", href: "/dashboard/student/courses", icon: BookOpen, badge: "Course" },
  { id: "c3", title: "CS204 Web Frontend Architecture", category: "Courses", href: "/dashboard/student/courses", icon: BookOpen, badge: "Course" },
  { id: "c4", title: "CS203 Object-Oriented Programming Java", category: "Courses", href: "/dashboard/student/courses", icon: BookOpen, badge: "Course" },

  // Teacher specific shortcuts
  { id: "t1", title: "Teacher Classroom Management", category: "Pages", href: "/dashboard/teacher/my-classroom", icon: Users, badge: "Teacher" },
  { id: "t2", title: "Teacher Gradebook & Scores", category: "Pages", href: "/dashboard/teacher/grades", icon: Star, badge: "Teacher" },
  { id: "t3", title: "Teacher Quiz Builder", category: "Pages", href: "/dashboard/teacher/quiz", icon: Award, badge: "Teacher" },
];

export default function HeaderGlobalSearch({ placeholder = "Search classes, lessons, assignments, or grades..." }: { placeholder?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredResults = query.trim() === ""
    ? []
    : SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredResults.length > 0) {
      handleSelect(filteredResults[0].href);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-8" ref={containerRef}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-11 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-3 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Popover Dropdown Results */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
          {filteredResults.length === 0 ? (
            <div className="p-6 text-center text-xs font-medium text-slate-400">
              No results found matching &quot;<span className="font-bold text-slate-700 dark:text-slate-200">{query}</span>&quot;
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Matching Search Results ({filteredResults.length})
              </div>
              {filteredResults.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 truncate">
                          Category: {item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
