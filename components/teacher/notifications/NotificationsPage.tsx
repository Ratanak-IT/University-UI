"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { TableRowsSkeleton } from "@/components/shared/Skeletons";
import {
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/lib/redux/apiSlice";

type NotificationType = "GRADE" | "ASSIGNMENT" | "CERTIFICATE" | "ANNOUNCEMENT" | "ATTENDANCE";

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
}

interface Settings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  submissionAlerts: boolean;
  weeklyDigest: boolean;
}

const typeStyles: Record<NotificationType, string> = {
  GRADE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  ASSIGNMENT: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
  CERTIFICATE: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  ANNOUNCEMENT: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
  ATTENDANCE: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
};

const typeDot: Record<NotificationType, string> = {
  GRADE: "bg-emerald-500",
  ASSIGNMENT: "bg-indigo-500",
  CERTIFICATE: "bg-amber-500",
  ANNOUNCEMENT: "bg-purple-500",
  ATTENDANCE: "bg-sky-500",
};

type FilterKey = "All" | "Unread" | NotificationType;

export default function NotificationsPage() {
  const { data: apiNotifications = [], isLoading } = useGetMyNotificationsQuery();
  const [markSingleRead] = useMarkNotificationReadMutation();
  const [markAllReadApi] = useMarkAllNotificationsReadMutation();

  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [settings, setSettings] = useState<Settings>({
    emailAlerts: true,
    pushNotifications: true,
    submissionAlerts: true,
    weeklyDigest: false,
  });

  const notifications: NotificationItem[] = useMemo(() => {
    return apiNotifications.map((n: any) => ({
      id: n.id || n.notificationId,
      actor: n.actor || n.title || "System",
      action: n.message || n.title,
      type: (n.type as NotificationType) || "ANNOUNCEMENT",
      context: n.context || "Classroom",
      time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : "Just now",
      initials: n.actor ? n.actor.substring(0, 2).toUpperCase() : "UM",
      avatarColor: typeStyles[n.type as NotificationType] || "bg-indigo-100 text-indigo-800",
      unread: !n.isRead,
    }));
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
  ], [notifications]);

  async function markAllRead() {
    try {
      await markAllReadApi().unwrap();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  }

  async function handleRowClick(id: string) {
    try {
      await markSingleRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  }

  function toggleSetting(key: keyof Settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function NotificationRow({ n }: { n: NotificationItem }) {
    return (
      <div
        onClick={() => handleRowClick(n.id)}
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

  function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={on}
        className={`relative box-border inline-flex h-5 w-9 shrink-0 items-center rounded-full border-0 p-0 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 ${
          on ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            on ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    );
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
                <NotificationRow key={n.id} n={n} />
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

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">Notification settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground/80">Email alerts</span>
                <Toggle on={settings.emailAlerts} onClick={() => toggleSetting("emailAlerts")} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground/80">Push notifications</span>
                <Toggle on={settings.pushNotifications} onClick={() => toggleSetting("pushNotifications")} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground/80">Submission alerts</span>
                <Toggle on={settings.submissionAlerts} onClick={() => toggleSetting("submissionAlerts")} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground/80">Weekly digest</span>
                <Toggle on={settings.weeklyDigest} onClick={() => toggleSetting("weeklyDigest")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}