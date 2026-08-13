"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  useGetStudentProfileQuery,
  useGetMyNotificationsQuery,
} from "@/lib/redux/apiSlice";

export default function NavbarStudent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: profile } = useGetStudentProfileQuery();
  const { data: notifications = [] } = useGetMyNotificationsQuery();

  useEffect(() => setMounted(true), []);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const studentName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username
    : "Student";

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "ST"
    : "ST";

  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-card px-6 py-4 text-card-foreground transition-colors">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-xl font-black text-indigo-700 dark:text-indigo-400">
          Dashboard
        </h1>
        <p className="text-xs font-semibold text-muted-foreground">
          Academic Year {profile?.academicYear || "2025–2026"} <span className="mx-1">•</span> Semester {profile?.semester || 2}
        </p>
      </div>

      <div className="relative w-full max-w-xl mx-6 hidden sm:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-4.5 w-4.5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search courses, grades, or certificates..."
          className="w-full rounded-xl border border-border bg-muted/40 py-2.5 pl-11 pr-4 text-sm text-foreground placeholder-muted-foreground transition-all focus:border-indigo-600 focus:bg-background focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:focus:border-indigo-500 dark:focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/student/notifications"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell className="h-5 w-5 stroke-[1.75]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-extrabold text-white ring-2 ring-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5 stroke-[1.75] text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 stroke-[1.75]" />
          )}
        </button>

        <Link
          href="/dashboard/student/profile"
          className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-indigo-200 ring-2 ring-transparent transition-all hover:ring-indigo-400 dark:border-indigo-800"
        >
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={studentName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-xs font-black text-white dark:bg-indigo-700">
              {initials}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
