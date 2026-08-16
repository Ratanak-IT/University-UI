"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import HeaderGlobalSearch from "@/components/shared/HeaderGlobalSearch";

export default function DashboardNavbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [profile, setProfile] = useState<{ avatarUrl?: string | null; firstName?: string; lastName?: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    import("@/lib/api/teacher").then((m) => {
      m.fetchTeacherProfile().then((p) => {
        if (p) setProfile(p);
      });
    });
  }, []);

  return (
    <header className="flex w-full items-center justify-between border-b border-gray-100 bg-white px-8 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-[#004071] dark:text-sky-400">
          Dashboard
        </h1>
        <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
          Academic Year 2024–2025 <span className="mx-1">•</span> Semester 2
        </p>
      </div>

      <HeaderGlobalSearch placeholder="Search students, classes, or files..." />

      <div className="flex items-center gap-6">
        <Link
          href="/dashboard/teacher/notifications"
          aria-label="Notifications"
          className="relative rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Bell className="h-6 w-6 stroke-[1.75]" />
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-6 w-6 stroke-[1.75]" />
          ) : (
            <Moon className="h-6 w-6 stroke-[1.75]" />
          )}
        </button>

        <Link
          href="/dashboard/teacher/profile"
          className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 ring-2 ring-transparent transition-all hover:ring-gray-300 dark:border-slate-700 dark:hover:ring-slate-600 shrink-0"
        >
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="User profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs">
              {profile?.firstName?.[0] || "T"}{profile?.lastName?.[0] || ""}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
