"use client"
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

type NotificationType = "Submission" | "Comment" | "Grade" | "Announcement" | "Attendance";

interface Notification {
  id: string;
  actor: string;
  action: string;
  type: NotificationType;
  context: string;
  time: string;
  initials: string;
  avatarColor: string;
  unread: boolean;
  group: "Today" | "Earlier this week";
}

interface Settings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  submissionAlerts: boolean;
  weeklyDigest: boolean;
}

const typeStyles: Record<NotificationType, string> = {
  Submission: "bg-primary/10 text-primary",
  Comment: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  Grade: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Announcement: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Attendance: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
};

const typeDot: Record<NotificationType, string> = {
  Submission: "bg-primary",
  Comment: "bg-sky-500",
  Grade: "bg-emerald-500",
  Announcement: "bg-orange-500",
  Attendance: "bg-teal-500",
};

const initialNotifications: Notification[] = [
  {
    id: "1",
    actor: "Emma Chen",
    action: "submitted Portfolio Project",
    type: "Submission",
    context: "Web Development",
    time: "10m",
    initials: "EC",
    avatarColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    unread: true,
    group: "Today",
  },
  {
    id: "2",
    actor: "Liam Rai",
    action: "commented on SQL Injection Lab",
    type: "Comment",
    context: "Cybersecurity",
    time: "45m",
    initials: "LR",
    avatarColor: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    unread: true,
    group: "Today",
  },
  {
    id: "3",
    actor: "",
    action: "You released grades for Quiz 3",
    type: "Grade",
    context: "Database Systems",
    time: "2h",
    initials: "GR",
    avatarColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    unread: false,
    group: "Today",
  },
  {
    id: "4",
    actor: "Admin",
    action: "posted: Semester 2 schedule updated",
    type: "Announcement",
    context: "All classrooms",
    time: "Mon",
    initials: "AN",
    avatarColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    unread: true,
    group: "Earlier this week",
  },
  {
    id: "5",
    actor: "Noah Kim",
    action: "submitted Wireframe Task",
    type: "Submission",
    context: "UI/UX Design",
    time: "Mon",
    initials: "NK",
    avatarColor: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    unread: false,
    group: "Earlier this week",
  },
  {
    id: "6",
    actor: "",
    action: "Reminder: mark attendance for today's class",
    type: "Attendance",
    context: "Cybersecurity",
    time: "Sun",
    initials: "AT",
    avatarColor: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    unread: false,
    group: "Earlier this week",
  },
];

const typeCounts: { type: NotificationType; count: number }[] = [
  { type: "Submission", count: 12 },
  { type: "Comment", count: 8 },
  { type: "Grade", count: 3 },
  { type: "Announcement", count: 2 },
  { type: "Attendance", count: 4 },
];

type FilterKey = "All" | "Unread" | NotificationType;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");
  const [settings, setSettings] = useState<Settings>({
    emailAlerts: true,
    pushNotifications: true,
    submissionAlerts: true,
    weeklyDigest: false,
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "All", label: "All", count: notifications.length },
    { key: "Unread", label: "Unread", count: unreadCount },
    { key: "Submission", label: "Submission", count: notifications.filter((n) => n.type === "Submission").length },
    { key: "Comment", label: "Comment", count: notifications.filter((n) => n.type === "Comment").length },
    { key: "Grade", label: "Grade", count: notifications.filter((n) => n.type === "Grade").length },
    { key: "Announcement", label: "Announcement", count: notifications.filter((n) => n.type === "Announcement").length },
    { key: "Attendance", label: "Attendance", count: notifications.filter((n) => n.type === "Attendance").length },
  ];

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const grouped = useMemo(() => {
    const today = filtered.filter((n) => n.group === "Today");
    const earlier = filtered.filter((n) => n.group === "Earlier this week");
    return { today, earlier };
  }, [filtered]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function toggleSetting(key: keyof Settings) {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function NotificationRow({ n }: { n: Notification }) {
    return (
      <div
        className={`flex items-center gap-3 px-6 py-8 ${n.unread ? "bg-primary/5" : "bg-card"}`}
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
        style={{ appearance: "none", WebkitAppearance: "none" } as React.CSSProperties}
      >
        <span
          className={`pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            on ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-6 font-sans" style={{ fontSize: "18px" }}>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            From your notifications feed · {unreadCount} unread
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="rounded-lg border border-primary/30 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/10"
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

      <div className="grid grid-cols-3 gap-6">
        {/* Notification list */}
        <div className="col-span-2 min-w-0 space-y-5">
          {grouped.today.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Today
              </p>
              <div className="divide-y divide-border">
                {grouped.today.map((n) => (
                  <NotificationRow key={n.id} n={n} />
                ))}
              </div>
            </div>
          )}

          {grouped.earlier.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <p className="px-5 pt-4 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Earlier this week
              </p>
              <div className="divide-y divide-border">
                {grouped.earlier.map((n) => (
                  <NotificationRow key={n.id} n={n} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
              No notifications in this filter.
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">This week · by type</h3>
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