"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GraduationCap, ClipboardList, UserCheck, Bell, BellRing } from "lucide-react";
import {
  useGetStudentProfileQuery,
  useGetStudentGpaQuery,
  useGetStudentAttendanceQuery,
  useGetMyNotificationsQuery,
} from "@/lib/redux/apiSlice";
import { fetchStudentDashboardSummary } from "@/lib/api/student";
import StatCards from "@/components/teacher/dashboard/StatCards";
import DeadlinesSection from "@/components/teacher/dashboard/DeadlinesSection";
import type { StatCard, Deadline } from "@/lib/types/dashboard";
import StudentDashboardSkeleton, { DashboardListCardSkeleton } from "@/components/student/DashboardSkeleton";

/**
 * The student landing page — an actual overview (stats, what's due, what's
 * new), not a second copy of the classroom grid. `/dashboard/student/my-classes`
 * already owns the full classroom-card experience; repeating it here just to
 * fill space duplicated the same nine classroom cards it renders more slowly
 * from an entirely separate fetch.
 */
export default function StudentDashboard() {
  const { data: profile, isLoading: loadingProfile } = useGetStudentProfileQuery();
  const studentId = profile?.studentId ?? "";

  const { data: gpaData, isLoading: loadingGpa } = useGetStudentGpaQuery(studentId, {
    skip: !studentId,
  });
  const { data: attendanceByCourse = [], isLoading: loadingAttendance } = useGetStudentAttendanceQuery(
    { studentId },
    { skip: !studentId }
  );
  const { data: notifications = [], isLoading: loadingNotifications } = useGetMyNotificationsQuery();

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;

    async function loadDeadlines() {
      setLoadingAssignments(true);
      const summary = await fetchStudentDashboardSummary(studentId);
      if (cancelled) return;

      setPendingAssignmentsCount(summary?.pendingAssignments ?? 0);

      const upcoming = (summary?.upcomingDeadlines ?? [])
        .filter((a) => a.dueDate)
        .map((a): Deadline => {
          const diffDays = Math.ceil(
            (new Date(a.dueDate!).getTime() - Date.now()) / (1000 * 3600 * 24)
          );
          let due = new Date(a.dueDate!).toLocaleDateString();
          let badgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
          if (diffDays < 0) {
            due = "Overdue";
            badgeClass = "bg-rose-200 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300";
          } else if (diffDays === 0) {
            due = "Due today";
            badgeClass = "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300";
          } else if (diffDays <= 2) {
            due = `${diffDays} days left`;
            badgeClass = "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
          }
          return { id: a.assignmentId, title: a.title, classCode: a.classCode || "", due, badgeClass };
        });

      setDeadlines(upcoming);
      setLoadingAssignments(false);
    }
    loadDeadlines();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  const overallAttendanceRate = useMemo(() => {
    const attended = attendanceByCourse.reduce((s, c) => s + c.present + c.late + c.excused, 0);
    const total = attendanceByCourse.reduce((s, c) => s + c.sessionsHeld, 0);
    return total > 0 ? Math.round((attended / total) * 100) : null;
  }, [attendanceByCourse]);

  const loading = loadingProfile || loadingGpa || loadingAttendance;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const statsList: StatCard[] = [
    {
      label: "Enrolled Classes",
      value: gpaData ? String(new Set(gpaData.subjects.map((s) => s.classroomId)).size) : "—",
      icon: GraduationCap,
      iconBg: "bg-indigo-100 dark:bg-indigo-950/40",
      iconColor: "text-indigo-700 dark:text-indigo-400",
      badge: null,
    },
    {
      label: "Overall Attendance",
      value: overallAttendanceRate != null ? `${overallAttendanceRate}%` : "—",
      icon: UserCheck,
      iconBg: "bg-emerald-100 dark:bg-emerald-950/40",
      iconColor: "text-emerald-700 dark:text-emerald-400",
      badge: null,
    },
    {
      label: "Pending Assignments",
      value: loadingAssignments ? "—" : String(pendingAssignmentsCount),
      icon: ClipboardList,
      iconBg: "bg-rose-100 dark:bg-rose-950/40",
      iconColor: "text-rose-700 dark:text-rose-400",
      badge: null,
    },
    {
      label: "Unread Notifications",
      value: loadingNotifications ? "—" : String(unreadCount),
      icon: BellRing,
      iconBg: "bg-sky-100 dark:bg-sky-950/40",
      iconColor: "text-sky-700 dark:text-sky-400",
      badge: null,
    },
  ];

  const recentNotifications = notifications.slice(0, 5);

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  return (
    <div className="px-8 py-8">
      {profile && (
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">
            Welcome back, {profile.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.studentCode} · {profile.academicYear} · Year {profile.yearLevel} Sem {profile.semester}
          </p>
        </div>
      )}

      <StatCards stats={statsList} />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {loadingAssignments ? (
          <DashboardListCardSkeleton />
        ) : (
          <DeadlinesSection deadlines={deadlines} />
        )}

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-card-foreground">Recent activity</h2>
            <Link
              href="/dashboard/student/notifications"
              className="text-xs font-semibold tracking-wide text-primary hover:underline"
            >
              VIEW ALL
            </Link>
          </div>
          {loadingNotifications ? (
            <ul className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="rounded-xl border border-border p-4">
                  <div className="h-4 w-48 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                  <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                </li>
              ))}
            </ul>
          ) : recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Bell className="h-6 w-6 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-muted-foreground">Nothing new yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentNotifications.map((n) => (
                <li key={n.id} className="rounded-xl border border-border p-4">
                  <p className="text-sm font-semibold text-card-foreground">
                    {n.title || n.message}
                  </p>
                  {n.title && n.message && (
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{n.message}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
