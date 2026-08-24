"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import HeaderGlobalSearch from "@/components/shared/HeaderGlobalSearch";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import MobileNav from "./MobileNav";
import {
  useGetStudentProfileQuery,
  useGetMyNotificationsQuery,
} from "@/lib/redux/apiSlice";
import { useNotifyUnreadOnce } from "@/lib/hooks/useNotifyUnreadOnce";

export default function NavbarStudent() {
  const { data: profile } = useGetStudentProfileQuery();
  const { data: notifications = [] } = useGetMyNotificationsQuery();

  useNotifyUnreadOnce();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const studentName = profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.username
    : "Student";

  const initials = profile
    ? `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase() || "ST"
    : "ST";

  return (
    <header className="flex w-full items-center justify-between gap-3 border-b border-border bg-card px-4 py-4 sm:px-6 text-card-foreground transition-colors">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black text-indigo-700 sm:text-xl dark:text-indigo-400">
            Dashboard
          </h1>
          <p className="hidden truncate text-xs font-semibold text-muted-foreground sm:block">
            Academic Year {profile?.academicYear || "2025–2026"} <span className="mx-1">•</span> Semester {profile?.semester || 2}
          </p>
        </div>
      </div>

      <div className="hidden sm:block flex-1 max-w-xl mx-6">
        <HeaderGlobalSearch role="student" placeholder="Search your courses and pages..." />
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

        <ThemeToggle />

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
