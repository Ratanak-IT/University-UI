"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, X, BookOpen, FileText, Award, Calendar, Users, Star, ArrowRight, ShieldCheck, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchItem {
  id: string;
  title: string;
  category: "Courses" | "Pages" | "Assignments" | "Quizzes";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface RouteSuggestion {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Known dashboard routes for both roles, used to power "/path" autocomplete suggestions.
const KNOWN_ROUTES: RouteSuggestion[] = [
  { path: "/dashboard/student", label: "Student Dashboard", icon: LayoutGrid },
  { path: "/dashboard/student/courses", label: "My Courses", icon: BookOpen },
  { path: "/dashboard/student/grades", label: "Grades", icon: Star },
  { path: "/dashboard/student/attendance", label: "Attendance", icon: Calendar },
  { path: "/dashboard/student/certificates", label: "Certificates", icon: Award },
  { path: "/dashboard/student/notifications", label: "Notifications", icon: ShieldCheck },
  { path: "/dashboard/student/profile", label: "My Profile", icon: Users },

  { path: "/dashboard/teacher", label: "Teacher Dashboard", icon: LayoutGrid },
  { path: "/dashboard/teacher/my-classroom", label: "My Classrooms", icon: Users },
  { path: "/dashboard/teacher/my-student", label: "My Students", icon: Users },
  { path: "/dashboard/teacher/lessons", label: "Lessons", icon: BookOpen },
  { path: "/dashboard/teacher/assignments", label: "Assignments", icon: FileText },
  { path: "/dashboard/teacher/quiz", label: "Quizzes", icon: Award },
  { path: "/dashboard/teacher/attendance", label: "Attendance", icon: Calendar },
  { path: "/dashboard/teacher/grades", label: "Grades", icon: Star },
  { path: "/dashboard/teacher/notifications", label: "Notifications", icon: ShieldCheck },
  { path: "/dashboard/teacher/profile", label: "My Profile", icon: Users },
];

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

export default function HeaderGlobalSearch({ placeholder = "Search classes, lessons, assignments, or grades... or type a path like /dashboard" }: { placeholder?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();
  const isPathQuery = trimmedQuery.startsWith("/");

  // Typing a path (e.g. "/dash") suggests known routes that start with it, so
  // the list narrows live as the user keeps typing — real autocomplete.
  const routeSuggestions: SearchItem[] = isPathQuery
    ? KNOWN_ROUTES.filter((r) =>
        r.path.toLowerCase().startsWith(trimmedQuery.toLowerCase())
      ).map((r) => ({
        id: `route-${r.path}`,
        title: r.label,
        category: "Pages",
        href: r.path,
        icon: r.icon,
        badge: "Route",
      }))
    : [];

  const hasExactRouteMatch = routeSuggestions.some(
    (r) => r.href.toLowerCase() === trimmedQuery.toLowerCase()
  );

  // Fallback so an arbitrary/unlisted path can still be jumped to directly.
  const directNavItem: SearchItem | null =
    isPathQuery && !hasExactRouteMatch
      ? {
          id: "direct-nav",
          title: trimmedQuery,
          category: "Pages",
          href: trimmedQuery,
          icon: ArrowRight,
          badge: "Go to path",
        }
      : null;

  const filteredResults = trimmedQuery === ""
    ? []
    : SEARCH_ITEMS.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const displayedResults = isPathQuery
    ? [...routeSuggestions, ...(directNavItem ? [directNavItem] : [])]
    : filteredResults;

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
    if (e.key === "Enter" && displayedResults.length > 0) {
      handleSelect(displayedResults[0].href);
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
          {displayedResults.length === 0 ? (
            <div className="p-6 text-center text-xs font-medium text-slate-400">
              No results found matching &quot;<span className="font-bold text-slate-700 dark:text-slate-200">{query}</span>&quot;
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                {isPathQuery ? "Quick Navigation" : `Matching Search Results (${displayedResults.length})`}
              </div>
              {displayedResults.map((item) => {
                const ItemIcon = item.icon;
                const isDirect = item.id === "direct-nav";
                const isRoute = item.id.startsWith("route-");
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 ${
                      isDirect ? "bg-indigo-50/60 dark:bg-indigo-950/40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {isDirect ? `Go to ${item.title}` : item.title}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 truncate">
                          {isDirect
                            ? "Press Enter to navigate directly"
                            : isRoute
                            ? item.href
                            : `Category: ${item.category}`}
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
