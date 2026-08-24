"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { TableRowsSkeleton } from "@/components/shared/Skeletons";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/lib/redux/apiSlice";

type NotificationType =
  | "GRADE"
  | "ASSIGNMENT"
  | "CERTIFICATE"
  | "ANNOUNCEMENT"
  | "ATTENDANCE"
  | "MENTION"
  | "COMMENT_REPLY";

interface NotificationItem {
  id: string;
  actor: string;
  action: string;
  type: NotificationType;
  context: string;
  time: string;
  initials: string;
  avatarColor: string;
  unread: boolean;
  /** Route to open on click; null when there is nothing to navigate to. */
  link: string | null;
}

const typeStyles: Record<NotificationType, string> = {
  GRADE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  ASSIGNMENT: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
  CERTIFICATE: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  ANNOUNCEMENT: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
  ATTENDANCE: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  MENTION: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  COMMENT_REPLY: "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300",
};

const typeDot: Record<NotificationType, string> = {
  GRADE: "bg-emerald-500",
  ASSIGNMENT: "bg-indigo-500",
  CERTIFICATE: "bg-amber-500",
  ANNOUNCEMENT: "bg-purple-500",
  ATTENDANCE: "bg-sky-500",
  MENTION: "bg-rose-500",
  COMMENT_REPLY: "bg-teal-500",
};

type FilterKey = "All" | "Unread" | NotificationType;


function NotificationRow({
  n,
  onOpen,
}: {
  n: NotificationItem;
  onOpen: (n: NotificationItem) => void;
}) {
  return (
    <div
      onClick={() => onOpen(n)}
      className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-colors ${
        n.unread ? "bg-primary/5 hover:bg-primary/10" : "bg-card hover:bg-muted/40"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${n.avatarColor}`}
      >
        {n.initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-card-foreground">
          {n.actor && <span className="font-semibold">{n.actor} </span>}
          {n.action}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${typeStyles[n.type]}`}>
            {n.type}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{n.context} · {n.time}</span>
        </div>
      </div>
      {n.unread ? (
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
      )}
    </div>
  );
}

export default function NotificationsPage() {
  const { data: apiNotifications = [], isLoading } = useGetMyNotificationsQuery();
  const [markSingleRead] = useMarkNotificationReadMutation();
  const [markAllReadApi] = useMarkAllNotificationsReadMutation();

  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const notifications: NotificationItem[] = useMemo(() => {
    return apiNotifications.map((n) => {
      const type = (typeStyles[n.type as NotificationType] ? n.type : "ANNOUNCEMENT") as NotificationType;
      return {
        id: n.id,
        actor: n.actor || n.title || "System",
        action: n.message || n.title,
        type,
        context: n.context || "Classroom",
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now",
        initials: n.actor ? n.actor.substring(0, 2).toUpperCase() : "UM",
        avatarColor: typeStyles[type],
        unread: !n.isRead,
        link:
          n.link ??
          (n.resourceType === "CLASSROOM" && n.resourceId
            ? `/dashboard/teacher/my-classroom/${n.resourceId}`
            : null),
      };
    });
  }, [apiNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "All", label: "All", count: notifications.length },
    { key: "Unread", label: "Unread", count: unreadCount },
    { key: "GRADE", label: "Grades", count: notifications.filter((n) => n.type === "GRADE").length },
    { key: "ASSIGNMENT", label: "Assignments", count: notifications.filter((n) => n.type === "ASSIGNMENT").length },
    { key: "CERTIFICATE", label: "Certificates", count: notifications.filter((n) => n.type === "CERTIFICATE").length },
    { key: "ANNOUNCEMENT", label: "Announcements", count: notifications.filter((n) => n.type === "ANNOUNCEMENT").length },
    { key: "ATTENDANCE", label: "Attendance", count: notifications.filter((n) => n.type === "ATTENDANCE").length },
    { key: "MENTION", label: "Mentions", count: notifications.filter((n) => n.type === "MENTION").length },
    { key: "COMMENT_REPLY", label: "Replies", count: notifications.filter((n) => n.type === "COMMENT_REPLY").length },
  ];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const typeCounts = useMemo(() => [
    { type: "GRADE" as NotificationType, count: notifications.filter((n) => n.type === "GRADE").length },
    { type: "ASSIGNMENT" as NotificationType, count: notifications.filter((n) => n.type === "ASSIGNMENT").length },
    { type: "CERTIFICATE" as NotificationType, count: notifications.filter((n) => n.type === "CERTIFICATE").length },
    { type: "ANNOUNCEMENT" as NotificationType, count: notifications.filter((n) => n.type === "ANNOUNCEMENT").length },
    { type: "ATTENDANCE" as NotificationType, count: notifications.filter((n) => n.type === "ATTENDANCE").length },
    { type: "MENTION" as NotificationType, count: notifications.filter((n) => n.type === "MENTION").length },
    { type: "COMMENT_REPLY" as NotificationType, count: notifications.filter((n) => n.type === "COMMENT_REPLY").length },
  ], [notifications]);

  async function markAllRead() {
    try {
      await markAllReadApi().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  }


  async function handleRowClick(n: NotificationItem) {
    if (n.unread) {
      markSingleRead(n.id)
        .unwrap()
        .catch((err) => console.error("Failed to mark notification read", err));
    }
    if (n.link) {
      router.push(n.link);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-6 py-6 space-y-6">
        <div className="h-14 w-1/4 animate-pulse rounded-xl bg-muted" />
        <TableRowsSkeleton rows={6} cols={3} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-6 font-sans">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            From your notifications feed · {unreadCount} unread
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="rounded-lg border border-primary/30 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          Mark all as read
        </button>
      </div>

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-card-foreground hover:bg-muted"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  isActive ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification list */}
        <div className="lg:col-span-2 min-w-0 space-y-5">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
              No notifications in this category.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm divide-y divide-border">
              {filtered.map((n) => (
                <NotificationRow key={n.id} n={n} onOpen={handleRowClick} />
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Activity · by type</h3>
            <div className="space-y-3">
              {typeCounts.map((t) => (
                <div key={t.type} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <span className={`h-2 w-2 rounded-full ${typeDot[t.type]}`} />
                    {t.type}
                  </span>
                  <span className="font-semibold text-card-foreground font-mono">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}