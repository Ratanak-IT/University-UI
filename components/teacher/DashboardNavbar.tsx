"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import HeaderGlobalSearch from "@/components/shared/HeaderGlobalSearch";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import MobileNav from "./MobileNav";
import { useGetTeacherProfileQuery, useGetMyNotificationsQuery } from "@/lib/redux/apiSlice";
import { useNotifyUnreadOnce } from "@/lib/hooks/useNotifyUnreadOnce";

export default function DashboardNavbar() {
  // Shares its cache with the sidebar's own profile query, so opening the
  // rail, the drawer, and this navbar together still costs one request.
  const { data: profile } = useGetTeacherProfileQuery();
  // Shares its cache with the hook below, and with the notifications page
  // when it's open — one query, read in three places.
  const { data: notifications = [] } = useGetMyNotificationsQuery();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useNotifyUnreadOnce();

  return (
    <header className="flex w-full items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-[#004071] sm:text-xl dark:text-sky-400">
            Dashboard
          </h1>
          <p className="hidden truncate text-sm font-medium text-gray-500 sm:block dark:text-slate-400">
            Academic Year 2024–2025 <span className="mx-1">•</span> Semester 2
          </p>
        </div>
      </div>

      {/* Search competes for width with the title and icon cluster on a
          narrow header, so it only joins in from md up — same threshold the
          student navbar already uses for the same reason. */}
      <div className="hidden min-w-0 flex-1 md:block">
        <HeaderGlobalSearch role="teacher" placeholder="Search your classrooms and pages..." />
      </div>

      <div className="flex items-center gap-6">
        <Link
          href="/dashboard/teacher/notifications"
          aria-label="Notifications"
          className="relative rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <Bell className="h-6 w-6 stroke-[1.75]" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-extrabold text-white ring-2 ring-white dark:ring-slate-900">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        <ThemeToggle />

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
