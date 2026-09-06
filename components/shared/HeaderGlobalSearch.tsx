"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Search,
  X,
  BookOpen,
  BookMarked,
  FileText,
  Award,
  Calendar,
  Users,
  Star,
  ArrowRight,
  Bell,
  UserCircle,
  GraduationCap,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useGetMyClassroomsQuery,
  useGetTeacherClassroomsQuery,
} from "@/lib/redux/apiSlice";

type SearchCategory = "Pages" | "Courses";

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchCategory;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Every href below is a real route under app/dashboard/{role}/ — verified
// against the file tree, not guessed, so a result never 404s.
const STUDENT_PAGES: SearchItem[] = [
  { id: "s-courses", title: "My Courses", category: "Pages", href: "/dashboard/student/courses", icon: BookOpen },
  { id: "s-myclasses", title: "My Classes", category: "Pages", href: "/dashboard/student/my-classes", icon: Users },
  { id: "s-assignments", title: "Assignments", category: "Pages", href: "/dashboard/student/assignments", icon: FileText },
  { id: "s-quizzes", title: "Quizzes", category: "Pages", href: "/dashboard/student/quizzes", icon: Award },
  { id: "s-lessons", title: "Lessons", category: "Pages", href: "/dashboard/student/lessons", icon: BookMarked },
  { id: "s-grades", title: "Grades & GPA", category: "Pages", href: "/dashboard/student/grades", icon: Star },
  { id: "s-attendance", title: "Attendance", category: "Pages", href: "/dashboard/student/attendance", icon: Calendar },
  { id: "s-certificates", title: "Certificates", category: "Pages", href: "/dashboard/student/certificates", icon: GraduationCap },
  { id: "s-timetable", title: "Timetable", category: "Pages", href: "/dashboard/student/timetable", icon: ClipboardList },
  { id: "s-notifications", title: "Notifications", category: "Pages", href: "/dashboard/student/notifications", icon: Bell },
  { id: "s-profile", title: "My Profile", category: "Pages", href: "/dashboard/student/profile", icon: UserCircle },
];

const TEACHER_PAGES: SearchItem[] = [
  { id: "t-overview", title: "Overview", category: "Pages", href: "/dashboard/teacher", icon: LayoutDashboard },
  { id: "t-classroom", title: "My Classrooms", category: "Pages", href: "/dashboard/teacher/my-classroom", icon: Users },
  { id: "t-students", title: "My Students", category: "Pages", href: "/dashboard/teacher/my-student", icon: Users },
  { id: "t-assignments", title: "Assignments", category: "Pages", href: "/dashboard/teacher/assignments", icon: FileText },
  { id: "t-quiz", title: "Quiz Builder", category: "Pages", href: "/dashboard/teacher/quiz", icon: Award },
  { id: "t-lessons", title: "Lessons", category: "Pages", href: "/dashboard/teacher/lessons", icon: BookMarked },
  { id: "t-grades", title: "Gradebook", category: "Pages", href: "/dashboard/teacher/grades", icon: Star },
  { id: "t-attendance", title: "Attendance", category: "Pages", href: "/dashboard/teacher/attendance", icon: Calendar },
  { id: "t-notifications", title: "Notifications", category: "Pages", href: "/dashboard/teacher/notifications", icon: Bell },
  { id: "t-profile", title: "My Profile", category: "Pages", href: "/dashboard/teacher/profile", icon: UserCircle },
];

/**
 * Global header search — deliberately split by `role`. A student and a
 * teacher share almost nothing here: different pages, different routes into
 * a classroom, and each only sees classrooms they are actually a member of
 * (the same `/classrooms/my-classrooms` endpoint each role's own pages
 * already use, scoped server-side by the caller's identity, not by any
 * client-side filtering).
 */
export default function HeaderGlobalSearch({
  role,
  placeholder,
}: {
  role: "student" | "teacher";
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: studentClassrooms = [] } = useGetMyClassroomsQuery(undefined, {
    skip: role !== "student",
  });
  const { data: teacherClassrooms = [] } = useGetTeacherClassroomsQuery(undefined, {
    skip: role !== "teacher",
  });
  const classrooms = role === "student" ? studentClassrooms : teacherClassrooms;

  const items = useMemo<SearchItem[]>(() => {
    const pages = role === "student" ? STUDENT_PAGES : TEACHER_PAGES;
    const courseHrefBase =
      role === "student" ? "/dashboard/student/my-classes" : "/dashboard/teacher/my-classroom";
    const courses: SearchItem[] = classrooms.map((c) => ({
      id: c.classroomId,
      title: c.subjectName || c.className,
      subtitle: `${c.classCode}${c.className && c.className !== (c.subjectName || c.className) ? ` · ${c.className}` : ""}`,
      category: "Courses",
      href: `${courseHrefBase}/${c.classroomId}`,
      icon: BookOpen,
    }));
    return [...pages, ...courses];
  }, [role, classrooms]);

  const trimmedQuery = query.trim();
  const isPathQuery = trimmedQuery.startsWith("/");

  // Typing a path (e.g. "/dashboard/student") suggests known routes that
  // start with it, so the list narrows live as the user keeps typing.
  const routeSuggestions: SearchItem[] = isPathQuery
    ? items
        .filter((item) => item.href.toLowerCase().startsWith(trimmedQuery.toLowerCase()))
        .map((item) => ({ ...item, id: `route-${item.href}` }))
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
        }
      : null;

  const filteredResults =
    trimmedQuery === ""
      ? []
      : items.filter((item) => {
          const q = query.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.subtitle?.toLowerCase().includes(q) ?? false)
          );
        });

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
          placeholder={placeholder ?? "Search pages and your courses..."}
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
                          {item.subtitle || item.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {item.category}
                      </span>
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
